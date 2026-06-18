<template>
  <div class="energy-flow-system">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="tool-group">
        <span class="tool-label">模式:</span>
        <button 
          v-for="mode in modes" 
          :key="mode.value"
          :class="['mode-btn', { active: activeMode === mode.value }]"
          @click="setActiveMode(mode.value)"
          :title="mode.tooltip"
        >
          <span class="mode-icon">{{ mode.icon }}</span>
          {{ mode.label }}
        </button>
      </div>
      <div class="tool-group">
        <span class="tool-label">节点类型:</span>
        <div class="node-types">
          <div 
            v-for="type in nodeTypes" 
            :key="type.id"
            :class="['node-type-item', { active: selectedNodeType === type.id }]"
            @click="selectNodeType(type.id)"
            :title="type.tooltip"
            draggable="true"
            @dragstart="handleNodeTypeDragStart($event, type)"
          >
            <div class="node-type-icon" :style="{ backgroundColor: type.color }"></div>
            {{ type.name }}
          </div>
        </div>
      </div>
      <div class="tool-group">
        <button class="tool-btn" @click="saveFlow">
          <span class="icon">💾</span> 保存
        </button>
        <button class="tool-btn" @click="loadFlow">
          <span class="icon">📂</span> 加载
        </button>
        <button class="tool-btn" @click="exportImage">
          <span class="icon">📷</span> 导出图片
        </button>
        <button class="tool-btn btn-danger" @click="clearCanvas">
          <span class="icon">🗑️</span> 清空
        </button>
      </div>
    </div>

    <div class="canvas-container" ref="canvasContainer" @dragover.prevent @drop="handleDrop">
      <!-- 网格背景 -->
      <div class="grid-background"></div>
      
      <!-- 节点容器 -->
      <div class="nodes-container">
        <div 
          v-for="node in nodes" 
          :key="node.id"
          :class="['flow-node', node.type, { selected: selectedNodeId === node.id }]"
          :style="{
            left: node.x + 'px',
            top: node.y + 'px',
            width: node.width + 'px',
            height: node.height + 'px'
          }"
          @mousedown="startNodeDrag($event, node)"
          @click.stop="selectNode(node)"
          @contextmenu.prevent="showNodeContextMenu($event, node)"
        >
          <!-- 节点头部 -->
          <div class="node-header" :style="{ backgroundColor: getNodeColor(node) }">
            <div class="node-title">
              {{ node.title }}
              <span v-if="node.value" class="node-value">{{ node.value }}</span>
            </div>
            <div class="node-actions">
              <button class="node-action-btn" @click.stop="removeNode(node.id)" title="删除节点">
                ×
              </button>
            </div>
          </div>
          
          <!-- 节点内容 -->
          <div class="node-content">
            <div v-if="node.subtitle" class="node-subtitle">{{ node.subtitle }}</div>
            <div v-if="node.description" class="node-description">{{ node.description }}</div>
          </div>
          
          <!-- 连接端口 -->
          <div class="node-ports">
            <!-- 输入端口 -->
            <div 
              v-for="input in node.inputs" 
              :key="input.id"
              class="port input-port"
              :style="{
                left: input.x + 'px',
                top: input.y + 'px'
              }"
              @mousedown.stop="startConnection($event, node, input)"
              @mouseup.stop="endConnection($event, node, input)"
              :title="input.label || '输入端口'"
            ></div>
            
            <!-- 输出端口 -->
            <div 
              v-for="output in node.outputs" 
              :key="output.id"
              class="port output-port"
              :style="{
                left: output.x + 'px',
                top: output.y + 'px'
              }"
              @mousedown.stop="startConnection($event, node, output)"
              @mouseup.stop="endConnection($event, node, output)"
              :title="output.label || '输出端口'"
            ></div>
          </div>
          
          <!-- 节点连接点 -->
          <div class="node-connection-dots">
            <div 
              v-for="dot in node.connectionDots" 
              :key="dot.id"
              class="connection-dot"
              :style="{
                left: dot.x + 'px',
                top: dot.y + 'px'
              }"
              @mousedown.stop="startConnectionFromDot($event, node, dot)"
              @mouseup.stop="endConnectionAtDot($event, node, dot)"
            ></div>
          </div>
          
          <!-- 节点调整大小手柄 -->
          <div class="node-resize-handle" @mousedown.stop="startResizeNode($event, node)"></div>
        </div>
      </div>
      
      <!-- 连线容器（SVG） -->
      <svg class="connections-layer" ref="connectionsLayer">
        <!-- 已有的连线 -->
        <g v-for="connection in connections" :key="connection.id">
          <!-- 连线路径 -->
          <path 
            :d="calculateConnectionPath(connection)" 
            :class="['connection-path', connection.type]"
            :style="{
              stroke: connection.color || getConnectionColor(connection),
              strokeWidth: connection.width + 'px'
            }"
            @click.stop="selectConnection(connection)"
            @contextmenu.prevent="showConnectionContextMenu($event, connection)"
          />
          
          <!-- 连线箭头 -->
          <path 
            v-if="connection.endNode"
            :d="calculateArrowPath(connection)"
            class="connection-arrow"
            :style="{ fill: connection.color || getConnectionColor(connection) }"
          />
          
          <!-- 连线标签 -->
          <text 
            v-if="connection.label"
            :x="connection.labelPosition.x"
            :y="connection.labelPosition.y"
            class="connection-label"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ connection.label }}
          </text>
          
          <!-- 连线控制点（用于调整曲线） -->
          <circle 
            v-if="connection.controlPoint && activeMode === 'edit'"
            :cx="connection.controlPoint.x"
            :cy="connection.controlPoint.y"
            r="6"
            class="connection-control-point"
            @mousedown.stop="startControlPointDrag($event, connection)"
          />
        </g>
        
        <!-- 正在绘制的连线 -->
        <path 
          v-if="drawingConnection"
          :d="calculateDrawingPath()"
          class="drawing-connection-path"
        />
      </svg>
      
      <!-- 画布上下文菜单 -->
      <div 
        v-if="showCanvasContextMenu"
        class="context-menu canvas-context-menu"
        :style="{
          left: contextMenuPosition.x + 'px',
          top: contextMenuPosition.y + 'px'
        }"
      >
        <div class="context-menu-header">画布操作</div>
        <div class="context-menu-item" @click="addNodeAtPosition('input')">
          <span class="menu-icon">⚡</span> 添加能源输入节点
        </div>
        <div class="context-menu-item" @click="addNodeAtPosition('conversion')">
          <span class="menu-icon">🔄</span> 添加能源转换节点
        </div>
        <div class="context-menu-item" @click="addNodeAtPosition('distribution')">
          <span class="menu-icon">📦</span> 添加能源配送节点
        </div>
        <div class="context-menu-item" @click="addNodeAtPosition('consumption')">
          <span class="menu-icon">🏭</span> 添加能源消费节点
        </div>
        <div class="context-menu-item" @click="addNodeAtPosition('efficiency')">
          <span class="menu-icon">📊</span> 添加效率节点
        </div>
        <div class="context-menu-divider"></div>
        <div class="context-menu-item" @click="zoomIn">
          <span class="menu-icon">➕</span> 放大 ({{ Math.round(zoom * 100) }}%)
        </div>
        <div class="context-menu-item" @click="zoomOut">
          <span class="menu-icon">➖</span> 缩小 ({{ Math.round(zoom * 100) }}%)
        </div>
        <div class="context-menu-item" @click="resetZoom">
          <span class="menu-icon">↔️</span> 重置缩放
        </div>
      </div>
      
      <!-- 节点上下文菜单 -->
      <div 
        v-if="showNodeContextMenuFlag && contextMenuNode"
        class="context-menu node-context-menu"
        :style="{
          left: contextMenuPosition.x + 'px',
          top: contextMenuPosition.y + 'px'
        }"
      >
        <div class="context-menu-header">{{ contextMenuNode.title }}</div>
        <div class="context-menu-item" @click="editNode(contextMenuNode)">
          <span class="menu-icon">✏️</span> 编辑节点
        </div>
        <div class="context-menu-item" @click="duplicateNode(contextMenuNode)">
          <span class="menu-icon">📋</span> 复制节点
        </div>
        <div class="context-menu-divider"></div>
        <div class="context-menu-item" @click="addInputPort(contextMenuNode)">
          <span class="menu-icon">↙️</span> 添加输入端口
        </div>
        <div class="context-menu-item" @click="addOutputPort(contextMenuNode)">
          <span class="menu-icon">↗️</span> 添加输出端口
        </div>
        <div class="context-menu-divider"></div>
        <div class="context-menu-item text-danger" @click="removeNode(contextMenuNode.id)">
          <span class="menu-icon">🗑️</span> 删除节点
        </div>
      </div>
      
      <!-- 连线上下文菜单 -->
      <div 
        v-if="showConnectionContextMenuFlag && contextMenuConnection"
        class="context-menu connection-context-menu"
        :style="{
          left: contextMenuPosition.x + 'px',
          top: contextMenuPosition.y + 'px'
        }"
      >
        <div class="context-menu-header">连线操作</div>
        <div class="context-menu-item" @click="editConnection(contextMenuConnection)">
          <span class="menu-icon">✏️</span> 编辑连线
        </div>
        <div class="context-menu-item text-danger" @click="removeConnection(contextMenuConnection.id)">
          <span class="menu-icon">🗑️</span> 删除连线
        </div>
      </div>
      
      <!-- 缩放控制 -->
      <div class="zoom-controls">
        <button class="zoom-btn" @click="zoomOut" title="缩小">-</button>
        <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
        <button class="zoom-btn" @click="zoomIn" title="放大">+</button>
      </div>
      
      <!-- 状态提示 -->
      <div class="status-bar">
        <div class="status-item">
          模式: <span class="status-value">{{ getModeLabel(activeMode) }}</span>
        </div>
        <div class="status-item">
          节点数: <span class="status-value">{{ nodes.length }}</span>
        </div>
        <div class="status-item">
          连线数: <span class="status-value">{{ connections.length }}</span>
        </div>
        <div class="status-item">
          选中: <span class="status-value">
            {{ selectedNodeId ? '节点' : selectedConnectionId ? '连线' : '无' }}
          </span>
        </div>
      </div>
    </div>

    <!-- 节点编辑模态框 -->
    <div v-if="showNodeEditor" class="modal-overlay" @click="closeNodeEditor">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingNode ? '编辑节点' : '添加节点' }}</h3>
          <button class="modal-close" @click="closeNodeEditor">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>节点类型:</label>
            <select v-model="nodeForm.type" class="form-control">
              <option v-for="type in nodeTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>节点标题:</label>
            <input v-model="nodeForm.title" class="form-control" placeholder="例如: 总厂" />
          </div>
          <div class="form-group">
            <label>副标题:</label>
            <input v-model="nodeForm.subtitle" class="form-control" placeholder="例如: 进电" />
          </div>
          <div class="form-group">
            <label>数值:</label>
            <input v-model="nodeForm.value" class="form-control" placeholder="例如: 400.00" />
          </div>
          <div class="form-group">
            <label>描述:</label>
            <textarea v-model="nodeForm.description" class="form-control" rows="3" placeholder="节点描述"></textarea>
          </div>
          <div class="form-group">
            <label>宽度:</label>
            <input v-model.number="nodeForm.width" type="number" min="100" max="500" class="form-control" />
          </div>
          <div class="form-group">
            <label>高度:</label>
            <input v-model.number="nodeForm.height" type="number" min="60" max="300" class="form-control" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeNodeEditor">取消</button>
          <button class="btn btn-primary" @click="saveNodeForm">{{ editingNode ? '更新' : '创建' }}</button>
        </div>
      </div>
    </div>

    <div v-if="showConnectionEditor" class="modal-overlay" @click="closeConnectionEditor">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>编辑连线</h3>
          <button class="modal-close" @click="closeConnectionEditor">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>连线标签:</label>
            <input v-model="connectionForm.label" class="form-control" placeholder="例如: 损耗: 198-(100+80)" />
          </div>
          <div class="form-group">
            <label>连线类型:</label>
            <select v-model="connectionForm.type" class="form-control">
              <option value="default">默认</option>
              <option value="dashed">虚线</option>
              <option value="dotted">点线</option>
            </select>
          </div>
          <div class="form-group">
            <label>连线颜色:</label>
            <input v-model="connectionForm.color" type="color" class="form-control color-picker" />
          </div>
          <div class="form-group">
            <label>线宽:</label>
            <input v-model.number="connectionForm.width" type="range" min="1" max="5" class="form-control" />
            <span class="slider-value">{{ connectionForm.width }}px</span>
          </div>
          <div class="form-group">
            <label>起点节点:</label>
            <select v-model="connectionForm.startNodeId" class="form-control" @change="updateConnectionFormPorts">
              <option value="">请选择起点节点</option>
              <option v-for="node in nodes" :key="node.id" :value="node.id">
                {{ node.title }} ({{ getNodeTypeName(node.type) }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>起点端口:</label>
            <select v-model="connectionForm.startPortId" class="form-control">
              <option value="">自动选择</option>
              <option v-for="port in startPorts" :key="port.id" :value="port.id">
                {{ port.label || '输出端口' }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>终点节点:</label>
            <select v-model="connectionForm.endNodeId" class="form-control" @change="updateConnectionFormPorts">
              <option value="">请选择终点节点</option>
              <option v-for="node in nodes" :key="node.id" :value="node.id">
                {{ node.title }} ({{ getNodeTypeName(node.type) }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>终点端口:</label>
            <select v-model="connectionForm.endPortId" class="form-control">
              <option value="">自动选择</option>
              <option v-for="port in endPorts" :key="port.id" :value="port.id">
                {{ port.label || '输入端口' }}
              </option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeConnectionEditor">取消</button>
          <button class="btn btn-primary" @click="saveConnectionForm">保存</button>
        </div>
      </div>
    </div>

    <!-- 信息面板 -->
    <div class="info-panel">
      <div class="panel-header">
        <h3>能流图配置</h3>
        <button class="panel-toggle" @click="toggleInfoPanel">
          {{ infoPanelCollapsed ? '展开' : '折叠' }}
        </button>
      </div>
      <div v-if="!infoPanelCollapsed" class="panel-body">
        <div class="section">
          <h4>节点列表</h4>
          <div class="node-list">
            <div 
              v-for="node in nodes" 
              :key="node.id"
              :class="['node-list-item', { selected: selectedNodeId === node.id }]"
              @click="selectNode(node)"
            >
              <div class="node-list-color" :style="{ backgroundColor: getNodeColor(node) }"></div>
              <div class="node-list-info">
                <div class="node-list-title">{{ node.title }}</div>
                <div v-if="node.subtitle" class="node-list-subtitle">{{ node.subtitle }}</div>
              </div>
              <div v-if="node.value" class="node-list-value">{{ node.value }}</div>
            </div>
          </div>
        </div>
        <div class="section">
          <h4>连线列表</h4>
          <div class="connection-list">
            <div 
              v-for="connection in connections" 
              :key="connection.id"
              :class="['connection-list-item', { selected: selectedConnectionId === connection.id }]"
              @click="selectConnection(connection)"
            >
              <div class="connection-list-line" :style="{ backgroundColor: connection.color || getConnectionColor(connection) }"></div>
              <div class="connection-list-info">
                <div class="connection-list-label">
                  {{ connection.label || '未命名连线' }}
                </div>
                <div class="connection-list-nodes">
                  {{ getNodeTitle(connection.startNodeId) }} → {{ getNodeTitle(connection.endNodeId) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'

// 状态管理
const canvasContainer = ref(null)
const connectionsLayer = ref(null)

// 画布状态
const zoom = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)
const isDraggingCanvas = ref(false)
const dragStart = ref({ x: 0, y: 0 })

// 模式管理
const modes = ref([
  { value: 'select', label: '选择', icon: '🖱️', tooltip: '选择和移动节点' },
  { value: 'connect', label: '连线', icon: '🔗', tooltip: '连接节点' },
  { value: 'edit', label: '编辑', icon: '✏️', tooltip: '编辑节点和连线' },
  { value: 'pan', label: '平移', icon: '✋', tooltip: '平移画布' }
])
const activeMode = ref('select')

// 节点类型
const nodeTypes = ref([
  { id: 'input', name: '能源输入', color: '#4CAF50', tooltip: '能源输入节点' },
  { id: 'conversion', name: '能源转换', color: '#2196F3', tooltip: '能源转换节点' },
  { id: 'distribution', name: '能源配送', color: '#FF9800', tooltip: '能源配送节点' },
  { id: 'consumption', name: '能源消费', color: '#F44336', tooltip: '能源消费节点' },
  { id: 'efficiency', name: '综合利用效率', color: '#9C27B0', tooltip: '能源综合利用效率节点' },
  { id: 'loss', name: '损耗', color: '#607D8B', tooltip: '能源损耗节点' }
])
const selectedNodeType = ref('input')

// 节点管理
const nodes = ref([])
const selectedNodeId = ref(null)
const draggingNode = ref(null)
const dragNodeStart = ref({ x: 0, y: 0 })
const resizingNode = ref(null)
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0 })

// 连线管理
const connections = ref([])
const selectedConnectionId = ref(null)
const drawingConnection = ref(null)
const draggingControlPoint = ref(null)
const dragControlStart = ref({ x: 0, y: 0 })

// 上下文菜单
const showCanvasContextMenu = ref(false)
const showNodeContextMenuFlag = ref(false)
const showConnectionContextMenuFlag = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const contextMenuNode = ref(null)
const contextMenuConnection = ref(null)

// 模态框
const showNodeEditor = ref(false)
const showConnectionEditor = ref(false)
const editingNode = ref(null)
const nodeForm = reactive({
  id: '',
  type: 'input',
  title: '',
  subtitle: '',
  value: '',
  description: '',
  width: 180,
  height: 100,
  x: 0,
  y: 0
})
const connectionForm = reactive({
  id: '',
  label: '',
  type: 'default',
  color: '',
  width: 2,
  startNodeId: '',
  startPortId: '',
  endNodeId: '',
  endPortId: ''
})
const startPorts = ref([])
const endPorts = ref([])

// 信息面板
const infoPanelCollapsed = ref(false)

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 初始化示例数据
const initializeSampleData = () => {
  // 清空现有数据
  nodes.value = []
  connections.value = []
  
  // 创建示例节点
  const node1 = createNode('input', '总厂', '进电', '400.00', 100, 100)
  const node2 = createNode('input', '总厂', '进厂水', '20.00', 100, 250)
  const node3 = createNode('input', '总厂', '进厂燃气', '20.00', 100, 400)
  
  const node4 = createNode('conversion', '变电站1', '变压器#1一次侧', '200.00', 350, 100)
  const node5 = createNode('conversion', '变电站1', '变压器#2一次侧', '200.00', 350, 250)
  const node6 = createNode('loss', '损耗', '200-190', '', 350, 400)
  
  const node7 = createNode('distribution', '车间A', '二次侧', '198.00', 600, 100)
  const node8 = createNode('distribution', '车间B', '二次侧', '190.00', 600, 250)
  const node9 = createNode('loss', '损耗', '198-(100+80)', '', 600, 400)
  
  const node10 = createNode('consumption', '空压机组', '空压机1号', '100.00', 850, 100)
  const node11 = createNode('consumption', '车间B', '生产线', '80.00', 850, 250)
  const node12 = createNode('consumption', '车间B', '食堂', '100.00', 850, 400)
  
  const node13 = createNode('efficiency', '有效利用量', '', '', 1100, 100)
  
  // 添加节点
  nodes.value.push(node1, node2, node3, node4, node5, node6, node7, node8, node9, node10, node11, node12, node13)
  
  // 创建示例连线
  connections.value.push(
    createConnection(node1.id, node4.id, '400.00'),
    createConnection(node2.id, node5.id, '20.00'),
    createConnection(node3.id, node6.id, '20.00'),
    createConnection(node4.id, node7.id, '200.00'),
    createConnection(node5.id, node8.id, '200.00'),
    createConnection(node7.id, node10.id, '198.00'),
    createConnection(node8.id, node11.id, '190.00'),
    createConnection(node11.id, node12.id, '80.00'),
    createConnection(node10.id, node13.id, '100.00'),
    createConnection(node12.id, node13.id, '100.00')
  )
  
  // 更新端口连接
  updatePortConnections()
}

// 创建节点
const createNode = (type, title, subtitle, value, x, y) => {
  const id = generateId()
  const nodeType = nodeTypes.value.find(t => t.id === type)
  
  return {
    id,
    type,
    title,
    subtitle,
    value,
    description: '',
    x: x || 100,
    y: y || 100,
    width: 180,
    height: 100,
    inputs: [],
    outputs: [],
    connectionDots: [
      { id: 'top', x: 90, y: 0 },
      { id: 'right', x: 180, y: 50 },
      { id: 'bottom', x: 90, y: 100 },
      { id: 'left', x: 0, y: 50 }
    ]
  }
}

// 创建连线
const createConnection = (startNodeId, endNodeId, label) => {
  const startNode = nodes.value.find(n => n.id === startNodeId)
  const endNode = nodes.value.find(n => n.id === endNodeId)
  
  if (!startNode || !endNode) return null
  
  const id = generateId()
  
  // 计算控制点（创建曲线）
  const startX = startNode.x + startNode.width
  const startY = startNode.y + startNode.height / 2
  const endX = endNode.x
  const endY = endNode.y + endNode.height / 2
  
  const controlX = (startX + endX) / 2
  const controlY = startY
  
  return {
    id,
    label,
    type: 'default',
    color: '',
    width: 2,
    startNodeId,
    startPortId: '',
    endNodeId,
    endPortId: '',
    controlPoint: { x: controlX, y: controlY },
    labelPosition: { x: (startX + endX) / 2, y: (startY + endY) / 2 - 15 }
  }
}

// 更新端口连接
const updatePortConnections = () => {
  // 重置所有节点的端口
  nodes.value.forEach(node => {
    node.inputs = []
    node.outputs = []
    
    // 根据节点类型添加默认端口
    if (node.type === 'input') {
      // 输入节点只有输出端口
      node.outputs = [
        { id: generateId(), label: '输出', x: node.width - 10, y: node.height / 2 }
      ]
    } else if (node.type === 'efficiency') {
      // 效率节点只有输入端口
      node.inputs = [
        { id: generateId(), label: '输入', x: 10, y: node.height / 2 }
      ]
    } else {
      // 其他节点既有输入也有输出端口
      node.inputs = [
        { id: generateId(), label: '输入', x: 10, y: node.height / 2 }
      ]
      node.outputs = [
        { id: generateId(), label: '输出', x: node.width - 10, y: node.height / 2 }
      ]
    }
  })
  
  // 根据连线更新端口连接状态
  connections.value.forEach(conn => {
    const startNode = nodes.value.find(n => n.id === conn.startNodeId)
    const endNode = nodes.value.find(n => n.id === conn.endNodeId)
    
    if (startNode && endNode) {
      // 如果还没有指定端口，自动分配
      if (!conn.startPortId && startNode.outputs.length > 0) {
        conn.startPortId = startNode.outputs[0].id
      }
      
      if (!conn.endPortId && endNode.inputs.length > 0) {
        conn.endPortId = endNode.inputs[0].id
      }
    }
  })
}

// 获取节点颜色
const getNodeColor = (node) => {
  const nodeType = nodeTypes.value.find(t => t.id === node.type)
  return nodeType ? nodeType.color : '#4CAF50'
}

// 获取连线颜色
const getConnectionColor = (connection) => {
  const startNode = nodes.value.find(n => n.id === connection.startNodeId)
  if (!startNode) return '#666'
  
  return getNodeColor(startNode)
}

// 设置活动模式
const setActiveMode = (mode) => {
  activeMode.value = mode
  
  // 清除所有选择
  if (mode !== 'select') {
    selectedNodeId.value = null
    selectedConnectionId.value = null
  }
  
  // 取消正在进行的连线
  if (mode !== 'connect') {
    drawingConnection.value = null
  }
}

// 获取模式标签
const getModeLabel = (mode) => {
  const modeObj = modes.value.find(m => m.value === mode)
  return modeObj ? modeObj.label : '未知'
}

// 选择节点类型
const selectNodeType = (typeId) => {
  selectedNodeType.value = typeId
}

// 处理节点类型拖拽开始
const handleNodeTypeDragStart = (event, nodeType) => {
  event.dataTransfer.setData('nodeType', nodeType.id)
  event.dataTransfer.setData('offsetX', '90')
  event.dataTransfer.setData('offsetY', '50')
}

// 处理画布拖放
const handleDrop = (event) => {
  event.preventDefault()
  
  const nodeType = event.dataTransfer.getData('nodeType')
  if (!nodeType) return
  
  const containerRect = canvasContainer.value.getBoundingClientRect()
  const x = (event.clientX - containerRect.left - offsetX.value) / zoom.value - 90
  const y = (event.clientY - containerRect.top - offsetY.value) / zoom.value - 50
  
  addNode(nodeType, x, y)
}

// 添加节点
const addNode = (type, x, y) => {
  const nodeType = nodeTypes.value.find(t => t.id === type)
  const node = createNode(type, `新${nodeType.name}`, '', '', x, y)
  nodes.value.push(node)
  
  // 更新端口连接
  updatePortConnections()
}

// 在指定位置添加节点
const addNodeAtPosition = (type) => {
  const containerRect = canvasContainer.value.getBoundingClientRect()
  const x = (contextMenuPosition.value.x - containerRect.left - offsetX.value) / zoom.value - 90
  const y = (contextMenuPosition.value.y - containerRect.top - offsetY.value) / zoom.value - 50
  
  addNode(type, x, y)
  showCanvasContextMenu.value = false
}

// 开始节点拖拽
const startNodeDrag = (event, node) => {
  if (activeMode.value !== 'select' && activeMode.value !== 'edit') return
  
  event.preventDefault()
  draggingNode.value = node
  dragNodeStart.value = {
    x: event.clientX - node.x,
    y: event.clientY - node.y
  }
  
  selectNode(node)
  
  document.addEventListener('mousemove', handleNodeDrag)
  document.addEventListener('mouseup', stopNodeDrag)
}

// 处理节点拖拽
const handleNodeDrag = (event) => {
  if (!draggingNode.value) return
  
  const containerRect = canvasContainer.value.getBoundingClientRect()
  draggingNode.value.x = (event.clientX - containerRect.left - offsetX.value) / zoom.value - dragNodeStart.value.x
  draggingNode.value.y = (event.clientY - containerRect.top - offsetY.value) / zoom.value - dragNodeStart.value.y
  
  // 更新相关连线
  updateConnectionsForNode(draggingNode.value.id)
}

// 停止节点拖拽
const stopNodeDrag = () => {
  draggingNode.value = null
  document.removeEventListener('mousemove', handleNodeDrag)
  document.removeEventListener('mouseup', stopNodeDrag)
}

// 开始调整节点大小
const startResizeNode = (event, node) => {
  if (activeMode.value !== 'edit') return
  
  event.preventDefault()
  event.stopPropagation()
  
  resizingNode.value = node
  resizeStart.value = {
    x: event.clientX,
    y: event.clientY,
    width: node.width,
    height: node.height
  }
  
  document.addEventListener('mousemove', handleResizeNode)
  document.addEventListener('mouseup', stopResizeNode)
}

// 处理调整节点大小
const handleResizeNode = (event) => {
  if (!resizingNode.value) return
  
  const deltaX = event.clientX - resizeStart.value.x
  const deltaY = event.clientY - resizeStart.value.y
  
  resizingNode.value.width = Math.max(100, resizeStart.value.width + deltaX)
  resizingNode.value.height = Math.max(60, resizeStart.value.height + deltaY)
  
  // 更新连接点位置
  updateNodeConnectionDots(resizingNode.value)
  
  // 更新相关连线
  updateConnectionsForNode(resizingNode.value.id)
}

// 停止调整节点大小
const stopResizeNode = () => {
  resizingNode.value = null
  document.removeEventListener('mousemove', handleResizeNode)
  document.removeEventListener('mouseup', stopResizeNode)
}

// 更新节点连接点
const updateNodeConnectionDots = (node) => {
  if (!node.connectionDots) return
  
  node.connectionDots = [
    { id: 'top', x: node.width / 2, y: 0 },
    { id: 'right', x: node.width, y: node.height / 2 },
    { id: 'bottom', x: node.width / 2, y: node.height },
    { id: 'left', x: 0, y: node.height / 2 }
  ]
}

// 选择节点
const selectNode = (node) => {
  if (activeMode.value !== 'select' && activeMode.value !== 'edit') return
  
  selectedNodeId.value = node.id
  selectedConnectionId.value = null
}

// 移除节点
const removeNode = (nodeId) => {
  // 删除节点
  nodes.value = nodes.value.filter(n => n.id !== nodeId)
  
  // 删除与该节点相关的所有连线
  connections.value = connections.value.filter(
    conn => conn.startNodeId !== nodeId && conn.endNodeId !== nodeId
  )
  
  // 清除选择
  selectedNodeId.value = null
  
  // 关闭上下文菜单
  showNodeContextMenuFlag.value = false
}

// 显示节点上下文菜单
const showNodeContextMenu = (event, node) => {
  event.preventDefault()
  
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  contextMenuNode.value = node
  showNodeContextMenuFlag.value = true
  showCanvasContextMenu.value = false
  showConnectionContextMenuFlag.value = false
  
  // 点击其他地方关闭菜单
  setTimeout(() => {
    document.addEventListener('click', closeAllContextMenus)
  }, 10)
}

// 开始连线
const startConnection = (event, node, port) => {
  if (activeMode.value !== 'connect') return
  
  event.preventDefault()
  event.stopPropagation()
  
  // 记录起点
  drawingConnection.value = {
    startNodeId: node.id,
    startPortId: port.id,
    startX: node.x + port.x,
    startY: node.y + port.y,
    endX: event.clientX,
    endY: event.clientY
  }
  
  document.addEventListener('mousemove', handleDrawingConnection)
  document.addEventListener('mouseup', finishConnection)
}

// 从连接点开始连线
const startConnectionFromDot = (event, node, dot) => {
  if (activeMode.value !== 'connect') return
  
  event.preventDefault()
  event.stopPropagation()
  
  // 记录起点
  drawingConnection.value = {
    startNodeId: node.id,
    startX: node.x + dot.x,
    startY: node.y + dot.y,
    endX: event.clientX,
    endY: event.clientY
  }
  
  document.addEventListener('mousemove', handleDrawingConnection)
  document.addEventListener('mouseup', finishConnectionAtDot)
}

// 处理连线绘制
const handleDrawingConnection = (event) => {
  if (!drawingConnection.value) return
  
  drawingConnection.value.endX = event.clientX
  drawingConnection.value.endY = event.clientY
}

// 结束连线
const endConnection = (event, node, port) => {
  if (!drawingConnection.value) return
  
  event.preventDefault()
  event.stopPropagation()
  
  // 确保不是连接到同一个节点
  if (drawingConnection.value.startNodeId === node.id) {
    finishConnection()
    return
  }
  
  // 创建新连线
  const connection = {
    id: generateId(),
    label: '',
    type: 'default',
    color: '',
    width: 2,
    startNodeId: drawingConnection.value.startNodeId,
    startPortId: drawingConnection.value.startPortId,
    endNodeId: node.id,
    endPortId: port.id
  }
  
  // 计算控制点
  const startNode = nodes.value.find(n => n.id === connection.startNodeId)
  const endNode = nodes.value.find(n => n.id === connection.endNodeId)
  
  if (startNode && endNode) {
    const startX = startNode.x + (connection.startPortId ? 
      startNode.outputs.find(p => p.id === connection.startPortId)?.x || startNode.width : 
      startNode.width)
    const startY = startNode.y + (connection.startPortId ? 
      startNode.outputs.find(p => p.id === connection.startPortId)?.y || startNode.height / 2 : 
      startNode.height / 2)
    
    const endX = endNode.x + (connection.endPortId ? 
      endNode.inputs.find(p => p.id === connection.endPortId)?.x || 0 : 
      0)
    const endY = endNode.y + (connection.endPortId ? 
      endNode.inputs.find(p => p.id === connection.endPortId)?.y || endNode.height / 2 : 
      endNode.height / 2)
    
    connection.controlPoint = {
      x: (startX + endX) / 2,
      y: startY
    }
    
    connection.labelPosition = {
      x: (startX + endX) / 2,
      y: (startY + endY) / 2 - 15
    }
  }
  
  connections.value.push(connection)
  finishConnection()
}

// 在连接点结束连线
const endConnectionAtDot = (event, node, dot) => {
  if (!drawingConnection.value) return
  
  event.preventDefault()
  event.stopPropagation()
  
  // 确保不是连接到同一个节点
  if (drawingConnection.value.startNodeId === node.id) {
    finishConnection()
    return
  }
  
  // 创建新连线
  const connection = {
    id: generateId(),
    label: '',
    type: 'default',
    color: '',
    width: 2,
    startNodeId: drawingConnection.value.startNodeId,
    endNodeId: node.id
  }
  
  // 计算控制点
  const startNode = nodes.value.find(n => n.id === connection.startNodeId)
  const endNode = node
  
  if (startNode && endNode) {
    const startX = drawingConnection.value.startX
    const startY = drawingConnection.value.startY
    const endX = endNode.x + dot.x
    const endY = endNode.y + dot.y
    
    connection.controlPoint = {
      x: (startX + endX) / 2,
      y: startY
    }
    
    connection.labelPosition = {
      x: (startX + endX) / 2,
      y: (startY + endY) / 2 - 15
    }
  }
  
  connections.value.push(connection)
  finishConnection()
}

// 完成连线
const finishConnection = () => {
  drawingConnection.value = null
  document.removeEventListener('mousemove', handleDrawingConnection)
  document.removeEventListener('mouseup', finishConnection)
}

// 计算连线路径
const calculateConnectionPath = (connection) => {
  const startNode = nodes.value.find(n => n.id === connection.startNodeId)
  const endNode = nodes.value.find(n => n.id === connection.endNodeId)
  
  if (!startNode || !endNode) return ''
  
  // 计算起点坐标
  let startX, startY
  if (connection.startPortId && startNode.outputs) {
    const port = startNode.outputs.find(p => p.id === connection.startPortId)
    if (port) {
      startX = startNode.x + port.x
      startY = startNode.y + port.y
    } else {
      startX = startNode.x + startNode.width
      startY = startNode.y + startNode.height / 2
    }
  } else {
    startX = startNode.x + startNode.width
    startY = startNode.y + startNode.height / 2
  }
  
  // 计算终点坐标
  let endX, endY
  if (connection.endPortId && endNode.inputs) {
    const port = endNode.inputs.find(p => p.id === connection.endPortId)
    if (port) {
      endX = endNode.x + port.x
      endY = endNode.y + port.y
    } else {
      endX = endNode.x
      endY = endNode.y + endNode.height / 2
    }
  } else {
    endX = endNode.x
    endY = endNode.y + endNode.height / 2
  }
  
  // 使用贝塞尔曲线
  const controlX = connection.controlPoint ? connection.controlPoint.x : (startX + endX) / 2
  const controlY = connection.controlPoint ? connection.controlPoint.y : startY
  
  return `M ${startX} ${startY} C ${controlX} ${controlY}, ${controlX} ${endY}, ${endX} ${endY}`
}

// 计算绘制中的连线路径
const calculateDrawingPath = () => {
  if (!drawingConnection.value) return ''
  
  const containerRect = canvasContainer.value.getBoundingClientRect()
  const startX = drawingConnection.value.startX
  const startY = drawingConnection.value.startY
  const endX = (drawingConnection.value.endX - containerRect.left - offsetX.value) / zoom.value
  const endY = (drawingConnection.value.endY - containerRect.top - offsetY.value) / zoom.value
  
  const controlX = (startX + endX) / 2
  const controlY = startY
  
  return `M ${startX} ${startY} C ${controlX} ${controlY}, ${controlX} ${endY}, ${endX} ${endY}`
}

// 计算箭头路径
const calculateArrowPath = (connection) => {
  const startNode = nodes.value.find(n => n.id === connection.startNodeId)
  const endNode = nodes.value.find(n => n.id === connection.endNodeId)
  
  if (!startNode || !endNode) return ''
  
  // 计算终点坐标
  let endX, endY
  if (connection.endPortId && endNode.inputs) {
    const port = endNode.inputs.find(p => p.id === connection.endPortId)
    if (port) {
      endX = endNode.x + port.x
      endY = endNode.y + port.y
    } else {
      endX = endNode.x
      endY = endNode.y + endNode.height / 2
    }
  } else {
    endX = endNode.x
    endY = endNode.y + endNode.height / 2
  }
  
  // 创建箭头
  const arrowSize = 8
  const angle = Math.atan2(endY - (endY - 10), endX - (endX - 10))
  
  const x1 = endX - arrowSize * Math.cos(angle - Math.PI / 6)
  const y1 = endY - arrowSize * Math.sin(angle - Math.PI / 6)
  const x2 = endX - arrowSize * Math.cos(angle + Math.PI / 6)
  const y2 = endY - arrowSize * Math.sin(angle + Math.PI / 6)
  
  return `M ${endX} ${endY} L ${x1} ${y1} L ${x2} ${y2} Z`
}

// 开始控制点拖拽
const startControlPointDrag = (event, connection) => {
  if (activeMode.value !== 'edit') return
  
  event.preventDefault()
  event.stopPropagation()
  
  draggingControlPoint.value = connection
  dragControlStart.value = {
    x: event.clientX,
    y: event.clientY,
    cpX: connection.controlPoint.x,
    cpY: connection.controlPoint.y
  }
  
  document.addEventListener('mousemove', handleControlPointDrag)
  document.addEventListener('mouseup', stopControlPointDrag)
}

// 处理控制点拖拽
const handleControlPointDrag = (event) => {
  if (!draggingControlPoint.value) return
  
  const deltaX = event.clientX - dragControlStart.value.x
  const deltaY = event.clientY - dragControlStart.value.y
  
  draggingControlPoint.value.controlPoint.x = dragControlStart.value.cpX + deltaX / zoom.value
  draggingControlPoint.value.controlPoint.y = dragControlStart.value.cpY + deltaY / zoom.value
  
  // 更新标签位置
  updateConnectionLabelPosition(draggingControlPoint.value)
}

// 停止控制点拖拽
const stopControlPointDrag = () => {
  draggingControlPoint.value = null
  document.removeEventListener('mousemove', handleControlPointDrag)
  document.removeEventListener('mouseup', stopControlPointDrag)
}

// 更新连线标签位置
const updateConnectionLabelPosition = (connection) => {
  const startNode = nodes.value.find(n => n.id === connection.startNodeId)
  const endNode = nodes.value.find(n => n.id === connection.endNodeId)
  
  if (!startNode || !endNode) return
  
  // 计算起点坐标
  let startX, startY
  if (connection.startPortId && startNode.outputs) {
    const port = startNode.outputs.find(p => p.id === connection.startPortId)
    if (port) {
      startX = startNode.x + port.x
      startY = startNode.y + port.y
    } else {
      startX = startNode.x + startNode.width
      startY = startNode.y + startNode.height / 2
    }
  } else {
    startX = startNode.x + startNode.width
    startY = startNode.y + startNode.height / 2
  }
  
  // 计算终点坐标
  let endX, endY
  if (connection.endPortId && endNode.inputs) {
    const port = endNode.inputs.find(p => p.id === connection.endPortId)
    if (port) {
      endX = endNode.x + port.x
      endY = endNode.y + port.y
    } else {
      endX = endNode.x
      endY = endNode.y + endNode.height / 2
    }
  } else {
    endX = endNode.x
    endY = endNode.y + endNode.height / 2
  }
  
  connection.labelPosition = {
    x: (startX + endX) / 2,
    y: (startY + endY) / 2 - 15
  }
}

// 更新节点的所有连线
const updateConnectionsForNode = (nodeId) => {
  connections.value.forEach(connection => {
    if (connection.startNodeId === nodeId || connection.endNodeId === nodeId) {
      updateConnectionLabelPosition(connection)
    }
  })
}

// 选择连线
const selectConnection = (connection) => {
  if (activeMode.value !== 'select' && activeMode.value !== 'edit') return
  
  selectedConnectionId.value = connection.id
  selectedNodeId.value = null
}

// 显示连线上下文菜单
const showConnectionContextMenu = (event, connection) => {
  event.preventDefault()
  
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  contextMenuConnection.value = connection
  showConnectionContextMenuFlag.value = true
  showCanvasContextMenu.value = false
  showNodeContextMenuFlag.value = false
  
  // 点击其他地方关闭菜单
  setTimeout(() => {
    document.addEventListener('click', closeAllContextMenus)
  }, 10)
}

// 移除连线
const removeConnection = (connectionId) => {
  connections.value = connections.value.filter(conn => conn.id !== connectionId)
  selectedConnectionId.value = null
  showConnectionContextMenuFlag.value = false
}

// 编辑节点
const editNode = (node) => {
  editingNode.value = node
  Object.assign(nodeForm, {
    id: node.id,
    type: node.type,
    title: node.title,
    subtitle: node.subtitle || '',
    value: node.value || '',
    description: node.description || '',
    width: node.width,
    height: node.height,
    x: node.x,
    y: node.y
  })
  showNodeEditor.value = true
  showNodeContextMenuFlag.value = false
}

// 复制节点
const duplicateNode = (node) => {
  const newNode = {
    ...node,
    id: generateId(),
    x: node.x + 20,
    y: node.y + 20
  }
  nodes.value.push(newNode)
  showNodeContextMenuFlag.value = false
  
  // 更新端口连接
  updatePortConnections()
}

// 添加输入端口
const addInputPort = (node) => {
  if (!node.inputs) node.inputs = []
  
  const portCount = node.inputs.length
  const portY = node.height / (portCount + 2) * (portCount + 1)
  
  node.inputs.push({
    id: generateId(),
    label: `输入${portCount + 1}`,
    x: 10,
    y: portY
  })
  
  showNodeContextMenuFlag.value = false
}

// 添加输出端口
const addOutputPort = (node) => {
  if (!node.outputs) node.outputs = []
  
  const portCount = node.outputs.length
  const portY = node.height / (portCount + 2) * (portCount + 1)
  
  node.outputs.push({
    id: generateId(),
    label: `输出${portCount + 1}`,
    x: node.width - 10,
    y: portY
  })
  
  showNodeContextMenuFlag.value = false
}

// 关闭所有上下文菜单
const closeAllContextMenus = () => {
  showCanvasContextMenu.value = false
  showNodeContextMenuFlag.value = false
  showConnectionContextMenuFlag.value = false
  document.removeEventListener('click', closeAllContextMenus)
}

// 保存节点表单
const saveNodeForm = () => {
  if (editingNode.value) {
    // 更新现有节点
    const node = nodes.value.find(n => n.id === editingNode.value.id)
    if (node) {
      Object.assign(node, {
        type: nodeForm.type,
        title: nodeForm.title,
        subtitle: nodeForm.subtitle,
        value: nodeForm.value,
        description: nodeForm.description,
        width: nodeForm.width,
        height: nodeForm.height
      })
      
      // 更新连接点位置
      updateNodeConnectionDots(node)
    }
  } else {
    // 创建新节点
    const node = createNode(
      nodeForm.type,
      nodeForm.title,
      nodeForm.subtitle,
      nodeForm.value,
      nodeForm.x,
      nodeForm.y
    )
    node.width = nodeForm.width
    node.height = nodeForm.height
    node.description = nodeForm.description
    
    nodes.value.push(node)
  }
  
  closeNodeEditor()
}

// 关闭节点编辑器
const closeNodeEditor = () => {
  showNodeEditor.value = false
  editingNode.value = null
  
  // 重置表单
  Object.assign(nodeForm, {
    id: '',
    type: 'input',
    title: '',
    subtitle: '',
    value: '',
    description: '',
    width: 180,
    height: 100,
    x: 0,
    y: 0
  })
}

// 编辑连线
const editConnection = (connection) => {
  Object.assign(connectionForm, {
    id: connection.id,
    label: connection.label || '',
    type: connection.type || 'default',
    color: connection.color || '',
    width: connection.width || 2,
    startNodeId: connection.startNodeId || '',
    startPortId: connection.startPortId || '',
    endNodeId: connection.endNodeId || '',
    endPortId: connection.endPortId || ''
  })
  
  // 更新端口列表
  updateConnectionFormPorts()
  
  showConnectionEditor.value = true
  showConnectionContextMenuFlag.value = false
}

// 更新连线表单端口
const updateConnectionFormPorts = () => {
  // 更新起点端口列表
  if (connectionForm.startNodeId) {
    const startNode = nodes.value.find(n => n.id === connectionForm.startNodeId)
    startPorts.value = startNode ? startNode.outputs || [] : []
  } else {
    startPorts.value = []
  }
  
  // 更新终点端口列表
  if (connectionForm.endNodeId) {
    const endNode = nodes.value.find(n => n.id === connectionForm.endNodeId)
    endPorts.value = endNode ? endNode.inputs || [] : []
  } else {
    endPorts.value = []
  }
}

// 保存连线表单
const saveConnectionForm = () => {
  const connection = connections.value.find(c => c.id === connectionForm.id)
  if (connection) {
    Object.assign(connection, {
      label: connectionForm.label,
      type: connectionForm.type,
      color: connectionForm.color,
      width: connectionForm.width,
      startNodeId: connectionForm.startNodeId,
      startPortId: connectionForm.startPortId,
      endNodeId: connectionForm.endNodeId,
      endPortId: connectionForm.endPortId
    })
    
    // 更新标签位置
    updateConnectionLabelPosition(connection)
  }
  
  closeConnectionEditor()
}

// 关闭连线编辑器
const closeConnectionEditor = () => {
  showConnectionEditor.value = false
  
  // 重置表单
  Object.assign(connectionForm, {
    id: '',
    label: '',
    type: 'default',
    color: '',
    width: 2,
    startNodeId: '',
    startPortId: '',
    endNodeId: '',
    endPortId: ''
  })
}

// 获取节点标题
const getNodeTitle = (nodeId) => {
  const node = nodes.value.find(n => n.id === nodeId)
  return node ? node.title : '未知节点'
}

// 获取节点类型名称
const getNodeTypeName = (typeId) => {
  const type = nodeTypes.value.find(t => t.id === typeId)
  return type ? type.name : '未知类型'
}

// 缩放控制
const zoomIn = () => {
  zoom.value = Math.min(3, zoom.value + 0.1)
}

const zoomOut = () => {
  zoom.value = Math.max(0.5, zoom.value - 0.1)
}

const resetZoom = () => {
  zoom.value = 1
  offsetX.value = 0
  offsetY.value = 0
}

// 保存流程图
const saveFlow = () => {
  const flowData = {
    nodes: nodes.value,
    connections: connections.value,
    zoom: zoom.value,
    offsetX: offsetX.value,
    offsetY: offsetY.value,
    saveTime: new Date().toISOString()
  }
  
  localStorage.setItem('energy-flow-data', JSON.stringify(flowData))
  alert('能流图已保存到本地存储')
}

// 加载流程图
const loadFlow = () => {
  const savedData = localStorage.getItem('energy-flow-data')
  if (savedData) {
    try {
      const flowData = JSON.parse(savedData)
      nodes.value = flowData.nodes || []
      connections.value = flowData.connections || []
      zoom.value = flowData.zoom || 1
      offsetX.value = flowData.offsetX || 0
      offsetY.value = flowData.offsetY || 0
      
      // 更新端口连接
      updatePortConnections()
      
      alert('能流图已从本地存储加载')
    } catch (error) {
      alert('加载能流图失败: ' + error.message)
    }
  } else {
    alert('没有找到保存的能流图')
  }
}

// 导出图片
const exportImage = () => {
  alert('导出图片功能需结合html2canvas等库实现')
  // 实际实现可以使用html2canvas库
  // import html2canvas from 'html2canvas';
  // const canvas = await html2canvas(canvasContainer.value);
  // const link = document.createElement('a');
  // link.download = 'energy-flow.png';
  // link.href = canvas.toDataURL('image/png');
  // link.click();
}

// 清空画布
const clearCanvas = () => {
  if (confirm('确定要清空画布吗？所有节点和连线将被删除。')) {
    nodes.value = []
    connections.value = []
    selectedNodeId.value = null
    selectedConnectionId.value = null
  }
}

// 切换信息面板
const toggleInfoPanel = () => {
  infoPanelCollapsed.value = !infoPanelCollapsed.value
}

// 初始化
onMounted(() => {
  // 初始化示例数据
  initializeSampleData()
  
  // 监听画布点击
  canvasContainer.value.addEventListener('click', (event) => {
    if (event.target === canvasContainer.value || event.target.classList.contains('grid-background')) {
      // 点击画布空白处
      selectedNodeId.value = null
      selectedConnectionId.value = null
      
      // 显示画布上下文菜单
      if (event.button === 2 || (event.button === 0 && event.ctrlKey)) {
        event.preventDefault()
        contextMenuPosition.value = { x: event.clientX, y: event.clientY }
        showCanvasContextMenu.value = true
        showNodeContextMenuFlag.value = false
        showConnectionContextMenuFlag.value = false
      }
    }
  })
  
  // 监听画布右键点击
  canvasContainer.value.addEventListener('contextmenu', (event) => {
    if (event.target === canvasContainer.value || event.target.classList.contains('grid-background')) {
      event.preventDefault()
      contextMenuPosition.value = { x: event.clientX, y: event.clientY }
      showCanvasContextMenu.value = true
      showNodeContextMenuFlag.value = false
      showConnectionContextMenuFlag.value = false
    }
  })
  
  // 监听画布拖拽
  canvasContainer.value.addEventListener('mousedown', (event) => {
    if (activeMode.value === 'pan' && (event.target === canvasContainer.value || event.target.classList.contains('grid-background'))) {
      event.preventDefault()
      isDraggingCanvas.value = true
      dragStart.value = { x: event.clientX - offsetX.value, y: event.clientY - offsetY.value }
      
      document.addEventListener('mousemove', handleCanvasDrag)
      document.addEventListener('mouseup', stopCanvasDrag)
    }
  })
  
  // 加载保存的数据
  loadFlow()
})

// 处理画布拖拽
const handleCanvasDrag = (event) => {
  if (!isDraggingCanvas.value) return
  console.log('handleCanvasDrag', event.clientX, event.clientY)
  offsetX.value = event.clientX - dragStart.value.x
  offsetY.value = event.clientY - dragStart.value.y
}

// 停止画布拖拽
const stopCanvasDrag = () => {
  isDraggingCanvas.value = false
  document.removeEventListener('mousemove', handleCanvasDrag)
  document.removeEventListener('mouseup', stopCanvasDrag)
}

// 监听缩放变化
watch(zoom, () => {
  // 缩放时更新连线
  connections.value.forEach(connection => {
    updateConnectionLabelPosition(connection)
  })
})

// 清理
onUnmounted(() => {
  document.removeEventListener('click', closeAllContextMenus)
})
</script>

<style scoped>
.energy-flow-system {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f5f5;
  overflow: hidden;
}

.toolbar {
  padding: 12px 20px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.tool-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tool-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.mode-btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background-color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.mode-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.mode-btn.active {
  background-color: #1890ff;
  border-color: #1890ff;
  color: white;
}

.mode-icon {
  font-size: 16px;
}

.node-types {
  display: flex;
  gap: 8px;
}

.node-type-item {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background-color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.node-type-item:hover {
  border-color: #1890ff;
}

.node-type-item.active {
  border-color: #1890ff;
  background-color: #f0f9ff;
}

.node-type-icon {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.tool-btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background-color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.tool-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.btn-danger {
  color: #ff4d4f;
}

.btn-danger:hover {
  border-color: #ff4d4f;
  background-color: #fff2f0;
}

.icon {
  font-size: 16px;
}

.canvas-container {
  flex: 1;
  position: relative;
  overflow: auto;
  background-color: #fafafa;
  cursor: default;
}

.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 4000px;
  height: 4000px;
  background-image: 
    linear-gradient(to right, #e8e8e8 1px, transparent 1px),
    linear-gradient(to bottom, #e8e8e8 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.3;
}

.nodes-container {
  position: absolute;
  top: 0;
  left: 0;
}

.flow-node {
  position: absolute;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: all 0.2s;
  user-select: none;
  border: 2px solid transparent;
}

.flow-node:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.flow-node.selected {
  border-color: #1890ff;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.3);
}

.node-header {
  padding: 12px 16px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.node-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-value {
  font-size: 12px;
  background-color: rgba(255,255,255,0.2);
  padding: 2px 6px;
  border-radius: 4px;
}

.node-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.flow-node:hover .node-actions {
  opacity: 1;
}

.node-action-btn {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(0,0,0,0.2);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
}

.node-action-btn:hover {
  background-color: rgba(0,0,0,0.3);
}

.node-content {
  padding: 12px 16px;
}

.node-subtitle {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
}

.node-description {
  font-size: 12px;
  color: #666;
}

.node-ports {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.port {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  pointer-events: all;
  cursor: crosshair;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.input-port {
  background-color: #52c41a;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #52c41a;
}

.output-port {
  background-color: #faad14;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #faad14;
}

.port:hover {
  transform: translate(-50%, -50%) scale(1.3);
}

.node-connection-dots {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.connection-dot {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #1890ff;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #1890ff;
  pointer-events: all;
  cursor: crosshair;
  transform: translate(-50%, -50%);
  z-index: 5;
}

.connection-dot:hover {
  transform: translate(-50%, -50%) scale(1.3);
}

.node-resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  cursor: nwse-resize;
  background-color: #1890ff;
  border-radius: 2px;
  opacity: 0;
  transition: opacity 0.2s;
}

.flow-node:hover .node-resize-handle {
  opacity: 1;
}

.connections-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.connection-path {
  fill: none;
  stroke-linecap: round;
  pointer-events: stroke;
  transition: all 0.2s;
}

.connection-path:hover {
  stroke-width: 3px !important;
}

.connection-path.default {
  stroke-dasharray: none;
}

.connection-path.dashed {
  stroke-dasharray: 5,5;
}

.connection-path.dotted {
  stroke-dasharray: 2,2;
}

.connection-arrow {
  pointer-events: none;
}

.connection-label {
  font-size: 12px;
  fill: #333;
  pointer-events: none;
  text-shadow: 1px 1px 2px white;
  font-weight: 500;
}

.connection-control-point {
  fill: white;
  stroke: #1890ff;
  stroke-width: 2;
  cursor: move;
  pointer-events: all;
  transition: all 0.2s;
}

.connection-control-point:hover {
  fill: #1890ff;
  r: 7;
}

.drawing-connection-path {
  fill: none;
  stroke: #ff4d4f;
  stroke-width: 2;
  stroke-dasharray: 5,5;
  pointer-events: none;
}

.context-menu {
  position: fixed;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  min-width: 180px;
  z-index: 1000;
  overflow: hidden;
}

.context-menu-header {
  padding: 12px 16px;
  background-color: #f5f5f5;
  font-weight: 600;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #e8e8e8;
}

.context-menu-item {
  padding: 10px 16px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.context-menu-item:hover {
  background-color: #f5f5f5;
}

.context-menu-item.text-danger {
  color: #ff4d4f;
}

.context-menu-divider {
  height: 1px;
  background-color: #e8e8e8;
  margin: 4px 0;
}

.menu-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.zoom-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  z-index: 10;
}

.zoom-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
  background-color: white;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoom-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.zoom-level {
  font-size: 14px;
  color: #666;
  min-width: 50px;
  text-align: center;
}

.status-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255,255,255,0.9);
  border-top: 1px solid #e8e8e8;
  padding: 8px 20px;
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: #666;
  z-index: 10;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-value {
  font-weight: 500;
  color: #333;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 500px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background-color: #f5f5f5;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.modal-close:hover {
  background-color: #e8e8e8;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #1890ff;
}

.form-control.color-picker {
  height: 40px;
  padding: 4px;
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
}

.slider-value {
  display: inline-block;
  margin-left: 10px;
  font-size: 14px;
  color: #666;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  border: 1px solid #d9d9d9;
  background-color: white;
  color: #333;
}

.btn-secondary:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.btn-primary {
  border: 1px solid #1890ff;
  background-color: #1890ff;
  color: white;
}

.btn-primary:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

.info-panel {
  position: absolute;
  top: 80px;
  right: 20px;
  width: 280px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  z-index: 100;
}

.panel-header {
  padding: 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.panel-toggle {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  background-color: white;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.panel-toggle:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.panel-body {
  max-height: 400px;
  overflow-y: auto;
}

.section {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.section:last-child {
  border-bottom: none;
}

.section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.node-list, .connection-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.node-list-item, .connection-list-item {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
}

.node-list-item:hover, .connection-list-item:hover {
  border-color: #1890ff;
  background-color: #f0f9ff;
}

.node-list-item.selected, .connection-list-item.selected {
  border-color: #1890ff;
  background-color: #e6f7ff;
}

.node-list-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.node-list-info {
  flex: 1;
  min-width: 0;
}

.node-list-title {
  font-size: 13px;
  color: #333;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-list-subtitle {
  font-size: 11px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-list-value {
  font-size: 12px;
  color: #1890ff;
  font-weight: 500;
  flex-shrink: 0;
}

.connection-list-line {
  width: 16px;
  height: 3px;
  border-radius: 2px;
  flex-shrink: 0;
}

.connection-list-label {
  font-size: 13px;
  color: #333;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.connection-list-nodes {
  font-size: 11px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>