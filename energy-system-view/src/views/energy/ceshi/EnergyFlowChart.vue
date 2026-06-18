<template>
  <div class="energy-flow-chart">
    <div style="margin-bottom: 24px" v-if="typeCanstay == 2">
      <a-input class="marBottom" style="width: 400px; margin-bottom: 24px" v-model:value="listObj.name" placeholder="请输入名称" />
      <a-input class="marBottom" v-model:value="listObj.remark" placeholder="请输入说明" />
    </div>
    <div style="margin-bottom: 24px" v-if="typeCanstay == 1">
      <a-input class="marBottom" style="width: 400px; margin-bottom: 24px" v-model:value="listObj.name" disabled="true" placeholder="请输入名称" />
      <a-input class="marBottom" v-model:value="listObj.remark" disabled="true" placeholder="请输入说明" />
    </div>
    <div v-if="typeCanstay == 1">
      <a-form :model="queryParam" style="width: 100%">
        <a-row :gutter="28">
          <a-col :span="4.5">
            <a-form-item label="基准期">
              <a-select ref="select" v-model:value="countTimeType" style="width: 120px">
                <a-select-option value="0">年</a-select-option>
                <a-select-option value="1">月</a-select-option>
                <a-select-option value="2">日</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4.5">
            <a-form-item label="统计期">
              <a-date-picker
                v-model:value="time"
                v-if="countTimeType == '2'"
                style="width: 200px"
                placeholder="请选择"
                valueFormat="YYYY-MM-DD"
              />
              <a-date-picker
                v-model:value="time"
                v-if="countTimeType == '0'"
                picker="year"
                style="width: 200px"
                placeholder="请选择"
                valueFormat="YYYY"
              />
              <a-date-picker
                v-model:value="time"
                v-if="countTimeType == '1'"
                picker="month"
                style="width: 200px"
                placeholder="请选择"
                valueFormat="YYYY-MM"
              />
            </a-form-item>
          </a-col>
          <a-col :span="2">
            <a-form-item label="" style="">
              <div style="width: 100%; display: flex; gap: 24px">
                <a-button type="primary" @click="onHandleAdd">查询</a-button>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="flow-controls" v-if="typeCanstay == 2">
      <div class="control-group">
        <button class="control-btn" :class="{ active: mode === 'view' }" @click="mode = 'view'"> 👁️ 查看模式 </button>
        <button class="control-btn" :class="{ active: mode === 'connect' }" @click="mode = 'connect'"> 🔗 连线模式 </button>
        <button class="control-btn" @click="clearConnections"> 🗑️ 清除连线 </button>
      </div>
      <div class="connection-status" v-if="mode === 'connect'">
        <span v-if="!selectedNode1">请选择第一个节点</span>
        <span v-else-if="!selectedNode2">请选择第二个节点</span>
        <span v-else>已选择两个节点，点击创建连线</span>
      </div>
      <div class="control-group">
        <button class="control-btn" @click="onQuickconfiguration"> 快速配置 </button>
        <button class="control-btn" @click="onClickSection"> 添加环节 </button>
        <button class="control-btn" @click="clearConneSave"> 保存 </button>
      </div>
    </div>

    <div class="flow-container" v-if="typeCanstay == 2">
      <!-- SVG画布用于绘制连线 -->
      <svg class="connection-canvas" ref="canvas">
        <!-- 绘制所有连接线 -->
        <g v-for="(conn, index) in connections" :key="index">
          <path :d="calculatePath(conn.from, conn.to)" class="connection-line" :class="{ selected: conn.selected }" @click="selectConnection(conn)" />
          <circle :cx="conn.midX" :cy="conn.midY" r="4" class="connection-midpoint" @click="deleteConnection(index)" />
        </g>

        <!-- 绘制当前正在创建的连线 -->
        <path v-if="isDrawing && selectedNode1" :d="calculateDrawingPath(selectedNode1)" class="connection-line drawing" />
      </svg>

      <!-- 能源输入部分 -->
      <div v-for="(item, index) in listObj.meters" :key="index" style="display:flex;">
        <div class="energy-section input-section">
          <div class="section-header">
            <div class="section-title">
              <!-- <span class="section-icon">⚡</span> -->
              <h3>{{ item.name }}</h3>
              <span class="node-count" v-if="item.meters">{{ item.meters.length }}</span>
            </div>
            <!-- <button class="add-node-btn" @click="addNode(item)">添加节点</button> -->
            <a-popover>
              <template #content>
                <div class="aButtons marBos" @click="addNode(item)"> 添加节点 </div>
                <div class="aButtons marBos" @click="onUpdataNode(item)"> 编辑 </div>
                <a-popconfirm title="确认删除嘛？" ok-text="确定" cancel-text="取消" @confirm="onNodeDelte(item)" @cancel="cancel">
                  <div class="aButtons"> 删除 </div>
                </a-popconfirm>
              </template>
              <Icon class="foniswICon" icon="ant-design:bars-outlined" />
            </a-popover>
          </div>
          <div class="nodes-container">
            <FlowNode
              v-for="node in item.meters"
              :key="node.id"
              :node="node"
              :items="item"
              :selected="selectedNode1?.id === node.id || selectedNode2?.id === node.id"
              :mode="mode"
              @select="onNodeSelect"
              @update-node="updateNode"
              @delete-node="deleteNode"
              @update-Meternode="updateMeterNode"
              @delete-Meternode="deleteMeterNode"
              @add-meter="addMeter(node)"
            />
          </div>
        </div>
        <!-- 箭头 -->
        <div class="section-arrow" v-if="index < listObj.meters.length - 1">
          <!-- <div class="arrow-line"></div> -->
          <!-- <div class="arrow-head">→</div> -->
        </div>
      </div>
    </div>

    <div class="flex" style="margin: 24px 0; gap: 24px" v-if="typeCanstay == 1">
      <div class="flow-container1">
        <div class="aosTios">系统总效率：</div>
        <div class="aosTios1">{{ listDiges.totalEfficiency }}%</div>
      </div>
      <div class="flow-container gaps">
        <div v-for="(item, index) in listDiges.efficiency" :key="index" class="flex gaps">
          <div>
            <div class="aosTios">{{ item.name }}供应：</div>
            <div class="aosTios">{{ item.value }}%</div>
          </div>
          <div class="borders" v-if="index < listDiges.efficiency.length - 1"></div>
        </div>
      </div>
    </div>
    <!-- 、、eacharts -->
    <div id="energyChart" style="height: 400px" v-if="typeCanstay == 1"></div>

    <!-- 添加环节 -->
    <a-modal :title="SectionTitle" :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <div class="padings">
        <a-form
          :model="formState"
          name="basic"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
          <a-form-item label="名称" required>
            <a-input v-model:value="formState.name" />
          </a-form-item>
          <a-form-item label="排序" required>
            <a-input v-model:value="formState.sort" />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <!-- 添加节点 -->
    <a-modal :title="textModal" :visible="visibleTwo" @ok="handleNodeOk" @cancel="handleCancel">
      <div class="padings">
        <a-form
          name="basic"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
          <a-form-item label="名称" required>
            <a-input v-model:value="nodeName" />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <!-- 快速配置 -->
    <a-drawer
      v-model:visible="visibleDrawer"
      :width="600"
      class="custom-class"
      :title="textDrawer"
      placement="right"
      @after-visible-change="afterVisibleChange"
    >
      <div>
        <a-form-item name="stationId">
          <template #label><span title="场站">场站</span></template>
          <select-station-no-clear v-model:value="queryParam.stationId" @ok="changeStation"></select-station-no-clear>
        </a-form-item>
        <a-tabs v-model:activeKey="activeKey" @change="onTanse">
          <a-tab-pane :tab="item.title" v-for="(item, index) in energyConsumeEquipmentTypes" :key="index">
            <a-tree
              v-model:selectedKeys="selectedKeys"
              v-model:checkedKeys="checkedKeys"
              default-expand-all
              checkable
              :tree-data="treeListArr"
              :field-names="fieldNames"
            >
              <template #title="{ name }">
                <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ name }}</span>
                <template v-else>{{ name }}</template>
              </template>
            </a-tree>
          </a-tab-pane>
        </a-tabs>
      </div>
      <template #footer>
        <div class="flexRight">
          <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
          <a-button type="primary" @click="onSubmit">确定</a-button>
        </div>
      </template>
    </a-drawer>

    <!-- 表计 -->
    <a-drawer
      v-model:visible="visibleMeterDrawer"
      :width="600"
      class="custom-class"
      :title="textDrawer"
      placement="right"
      @after-visible-change="afterVisibleChange"
    >
      <div v-if="visibleMeterDrawer">
        <a-form-item name="stationId">
          <template #label><span title="场站">场站</span></template>
          <select-station-no-clear v-model:value="queryParam.stationId" @ok="changeStation"></select-station-no-clear>
        </a-form-item>
        <a-tabs v-model:activeKey="activeKey" @change="onTanse">
          <a-tab-pane :tab="item.title" v-for="(item, index) in energyConsumeEquipmentTypes" :key="index">
            <a-tree
              v-model:selectedKeys="selectedKeys"
              v-model:checkedKeys="checkedKeys"
              default-expand-all
              :tree-data="treeListArr"
              :field-names="fieldNames"
              @select="onSelect"
            >
              <template #title="{ name }">
                <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ name }}</span>
                <template v-else>{{ name }}</template>
              </template>
            </a-tree>
          </a-tab-pane>
        </a-tabs>
      </div>
      <template #footer>
        <div class="flexRight">
          <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
          <a-button type="primary" @click="onMeterSubmit">确定</a-button>
        </div>
      </template>
    </a-drawer>
    <!-- 连线详情面板 -->
    <div class="connection-panel" v-if="selectedConnection">
      <div class="panel-header">
        <h4>连线详情</h4>
        <button class="close-btn" @click="selectedConnection = null">×</button>
      </div>
      <div class="panel-content">
        <div class="connection-info">
          <div class="info-row">
            <span class="info-label">起点:</span>
            <span class="info-value">{{ selectedConnection.from.name }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">终点:</span>
            <span class="info-value">{{ selectedConnection.to.name }}</span>
          </div>
        </div>
        <button class="delete-btn" @click="deleteSelectedConnection">删除连线</button>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, computed, onMounted, nextTick, defineEmits, defineProps } from 'vue';
import SelectStationNoClear from '@/components/station/SelectStationNoClear.vue';
import { BasicForm, useForm } from '/@/components/Form/index';
import FlowNode from './FlowNode.vue';
import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';
import { loadTreeRootNoTenant } from '@/views/system/category/category.api';
import * as echarts from 'echarts';
import { treeListByEquipmentTypeId } from '@/views/energy/meter/CyEquipment.api';
const props = defineProps({
  selectedId: { type: String },
});
const emit = defineEmits(['clearConneSaveSuccess']);

const { createMessage } = useMessage();
const visible = ref(false);
const visibleTwo = ref(false);
const visibleDrawer = ref(false); //快速配置
const visibleMeterDrawer = ref(false); //表计

//快速配置
const queryParam = ref({
  stationId: '',
  energyConsumeEquipmentTypeId: '',
});
const energyConsumeEquipmentTypes = ref([]);
const selectedKeys = ref([]);
const checkedKeys = ref([]);

const activeKey = ref(0); // 选中的tab键
const treeListArr = ref([]); //树状图数据
const fieldNames = {
  children: 'meters',
  title: 'name',
  key: 'id',
};

//表计
const selectedMeter = ref([]); //选择的表计

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const formState = ref({
  //环节信息
  name: '',
  sort: '',
});

const listObj = ref({
  //能流图信息
  id: '',
  name: '',
  remark: '',
});
const SectionTitle = ref('添加环节');
const textModal = ref('添加节点');
const textDrawer = ref('快速配置');
const nodeName = ref(''); //添加节点名称
const listNode = ref({}); //添加环节信息
const listNodeValue = ref({}); //节点信息
const typeCanstay = ref(1); //1浏览还是  2可操作
const isAssCanstay = ref(false); //是否添加或编辑能流表  false添加 true 编辑
const isAddNode = ref(false); //是否添加或编辑节点  false添加 true 编辑

// 模式：view查看模式，connect连线模式
const mode = ref('view');

// 选择的节点
const selectedNode1 = ref(null);
const selectedNode2 = ref(null);

// 选择的环节
const selectedMeters1 = ref(null);//第一环节
const selectedMeters2 = ref(null);//第二环节

// 连接线数据
const connections = ref([]);
const selectedConnection = ref(null);

// 是否正在绘制
const isDrawing = ref(false);

//时间维度
const countTimeType = ref('0');
const time = ref('');

//切换1浏览还是  2可操作
const ontypeCanstay = (val) => {
  typeCanstay.value = val;
};

//切换状态
const onIsAssCanstay = (val) => {
  isAssCanstay.value = val;
};

const onSelect = (selectedKeys, e) => {
  selectedMeter.value = e.selectedNodes;
  console.log('selectedKeys', selectedKeys);
  console.log('e', e);
};

const onClose = () => {
  visibleMeterDrawer.value = false;
  visibleDrawer.value = false;
};

const listDiges = ref({}); //能流图数据


const onHandleAdd = (val) => {
  onSankeyDiagers();
};

///能流图 数据展示
const onSankeyDiagers = () => {
  defHttp
    .post({
      url: '/cyEnergyFlowDiagram/sankeyDiagram',
      data: {
        energyFlowDiagramId: props.selectedId,
        countTimeType: countTimeType.value,
        time: time.value,
      },
    })
    .then((res) => {
      console.log(res);
      if (res) {
        listDiges.value = res;
        let energyChart = echarts.init(document.getElementById('energyChart'));
        let optionPie = {
          series: [
            {
              type: 'sankey',
              emphasis: {
                focus: 'adjacency',
              },
              nodeAlign: 'left',
              data: listDiges.value.nodes,
              links: listDiges.value.links,
              lineStyle: {
                color: 'source',
                curveness: 0.5,
              },
            },
          ],
        };
        energyChart.setOption(optionPie);
        window.addEventListener('resize', function () {
          energyChart.resize();
        });
      }
    });
};

//选择新建清空数据
const onRemove = () => {
  queryParam.value = {
    stationId: '',
    energyConsumeEquipmentTypeId: '',
  };
  formState.value = {
    name: '',
    sort: '',
  };
  listObj.value = {
    id: '',
    name: '',
    remark: '',
  };
  nodeName.value = '';
  listNode.value = {};
  listNodeValue.value = {};
  isAddNode.value = false;
  treeListArr.value = [];
};

// 节点数据
const inputNodes = ref([
  {
    id: 'input-1',
    name: '总厂 11',
    value: '400.00',
    meters: [
      {
        id: 'meter-1',
        name: '进电',
        value: '400.00',
      },
    ],
    type: 'input',
  },
  {
    id: 'input-2',
    name: '总厂 12',
    value: '0.00',
    meters: [
      {
        id: 'meter-2',
        name: '进电',
      },
    ],
    type: 'input',
  },
  {
    id: 'input-3',
    name: '进电',
    value: '400.00',
    meters: [
      {
        id: 'meter-3',
        name: '进电',
      },
    ],
    type: 'input',
  },
  {
    id: 'input-4',
    name: '水表',
    value: '20.00',
    meters: [
      {
        id: 'meter-4',
        name: '进电',
      },
    ],
    type: 'input',
  },
  {
    id: 'input-5',
    name: '进厂燃气',
    value: '20.00',
    meters: [
      {
        id: 'meter-5',
        name: '进电',
      },
    ],
    type: 'input',
  },
]);

const conversionNodes = ref([
  {
    id: 'conversion-1',
    name: '变电站',
    value: '0.00',
    meters: [
      {
        id: 'conversionMeter-1',
        name: '变压器1#一次侧',
        value: '400.00',
      },
      {
        id: 'conversionMeter-2',
        name: '变压器2#一次侧',
        value: '400.00',
      },
      {
        id: 'conversionMeter-3',
        name: '水表',
        value: '400.00',
      },
    ],
    type: 'conversion',
  },
]);

const distributionNodes = ref([
  {
    id: 'distribution-1',
    name: '工厂',
    value: '0.00',
    meters: [
      {
        id: 'distributionMeter-1',
        name: '水表',
        value: '400.00',
      },
    ],
    type: 'distribution',
  },
]);

const consumptionNodes = ref([
  {
    id: 'consumption-1',
    name: '车间A',
    value: '0.00',
    meters: [
      {
        id: 'consumptionMeter-1',
        name: '1#空压机',
        value: '400.00',
      },
    ],
    type: 'consumption',
  },
  {
    id: 'consumption-2',
    name: '车间B',
    value: '0.00',
    meters: [
      {
        id: 'consumptionMeter-2',
        name: '1#空压机',
        value: '400.00',
      },
    ],
    type: 'consumption',
  },
  {
    id: 'consumption-3',
    name: '食堂',
    value: '0.00',
    meters: [
      {
        id: 'consumptionMeter-3',
        name: '1#空压机',
        value: '400.00',
      },
    ],
    type: 'consumption',
  },
]);

//快速配置确定选择
const onSubmit = () => {
  visibleDrawer.value = false;
  console.log('checkedKeys', checkedKeys.value);
  console.log('treeListArr', treeListArr.value);
  addLevel(treeListArr.value);
  defHttp
    .post({
      url: '/cyEnergyFlowDiagram/quickConfiguration',
      data: {
        energyFlowDiagramId: listObj.value.id,
        meters: treeListArr.value,
      },
    })
    .then((res) => {
      if (res) {
        getDetailsById();
      }
    });
};

//保存选择表计
const onMeterSubmit = () => {
  defHttp
    .post({
      url: '/cyEnergyFlowDiagramLink/add',
      data: {
        energyFlowDiagramId: listObj.value.id,
        parentId: listNode.value.id,
        equipmentId: selectedMeter.value[0].id,
        name: selectedMeter.value[0].name,
        type: 2,
      },
    })
    .then((res) => {
      console.log(res, 'handleOk');
      if (res) {
        visibleMeterDrawer.value = false;
        getDetailsById();
      }
    });
};

const addLevel = (nodes, currentLevel = 0) => {
  nodes.forEach((node) => {
    let index = checkedKeys.value.findIndex((item) => item == node.id);
    if (index > -1) {
      node.select = true;
    } else {
      node.select = false;
    }
    if (node.meters?.length) {
      addLevel(node.meters, currentLevel + 1);
    }
  });
};

//快速配置
const onQuickconfiguration = () => {
  visibleDrawer.value = true;
  getEquipmentTypes();
};
// 切换场站
const changeStation = () => {
  treeIOnLIst();
};
//切换设备
const onTanse = () => {
  console.log(energyConsumeEquipmentTypes.value, 'activeKey.value');
  queryParam.value.energyConsumeEquipmentTypeId = energyConsumeEquipmentTypes.value[activeKey.value].key;
  treeIOnLIst();
};

/**
 * 获取用能设备类型
 */
function getEquipmentTypes() {
  loadTreeRootNoTenant({ pcode: 'C03A01', async: false }).then((res) => {
    energyConsumeEquipmentTypes.value = res;
    queryParam.value.energyConsumeEquipmentTypeId = res[0].key;
    setTimeout(() => {
      treeIOnLIst();
    }, 200);
  });
}

//获取树状图数据
function treeIOnLIst() {
  console.log(queryParam.value.stationId, 'queryParam.value.energyConsumeEquipmentTypeId');
  treeListByEquipmentTypeId({
    equipmentTypeId: queryParam.value.energyConsumeEquipmentTypeId,
    stationId: queryParam.value.stationId,
  }).then((res) => {
    treeListArr.value = res;
  });
}

//获取详情
function getDetailsById() {
  console.log(props.selectedId, 'selectedId');
  defHttp
    .get({
      url: '/cyEnergyFlowDiagram/getDetailsById',
      params: {
        id: props.selectedId,
      },
    })
    .then((res) => {
      console.log(res, 'getDetailsById');
      if (res) {
        listObj.value = res;
        nextTick(() => {
          res.connections.forEach((item) => {
            createConnection(item.from, item.to, item.id);
          });
        });
      }
    });
}

//编辑节点
const updateNode = (node) => {
  console.log(node, 'updateNode');
  textModal.value = '编辑节点';
  visibleTwo.value = true;
  nodeName.value = node.name;
  listNodeValue.value = node;
  isAddNode.value = true;
};

//删除节点
const deleteNode = (node) => {
  console.log(node, 'deleteNode');
  defHttp
    .delete({
      url: `/cyEnergyFlowDiagramLink/delete?id=${node.id}`,
    })
    .then((res) => {
      if (res) {
        getDetailsById();
      }
    });
};

//编辑表计
const updateMeterNode = (node) => {
  console.log(node, 'updateNode');
  textModal.value = '编辑节点';
  visibleTwo.value = true;
  nodeName.value = node.name;
  listNodeValue.value = node;
  isAddNode.value = true;
};

//删除表计
const deleteMeterNode = (node) => {
  console.log(node, 'deleteNode');
  defHttp
    .delete({
      url: `/cyEnergyFlowDiagramLink/delete?id=${node.id}`,
    })
    .then((res) => {
      if (res) {
        getDetailsById();
      }
    });
};

//添加节点
const handleNodeOk = () => {
  if (!nodeName.value) {
    createMessage.warn('请输入名称');
    return;
  }
  if (!isAddNode.value) {
    defHttp
      .post({
        url: '/cyEnergyFlowDiagramLink/add',
        data: {
          energyFlowDiagramId: listObj.value.id,
          parentId: listNode.value.id,
          name: nodeName.value,
          type: 1,
        },
      })
      .then((res) => {
        console.log(res, 'handleOk');
        if (res) {
          visibleTwo.value = false;
          getDetailsById();
        }
      });
  } else {
    defHttp
      .post({
        url: '/cyEnergyFlowDiagramLink/edit',
        data: {
          id: listNodeValue.value.id,
          name: nodeName.value,
          type: 1,
        },
      })
      .then((res) => {
        console.log(res, 'handleOk');
        if (res) {
          visibleTwo.value = false;
          getDetailsById();
        }
      });
  }
};

//添加环节
const onFinish = (values) => {
  console.log('Success:', values);
};
//添加环节
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
//添加环节
const handleOk = () => {
  if (!formState.value.name) {
    createMessage.warn('请输入名称');
    return;
  }
  if (!formState.value.sort) {
    createMessage.warn('请输入说明');
    return;
  }

  if (!isAddNode.value) {
    defHttp
      .post({
        url: '/cyEnergyFlowDiagramLink/add',
        data: {
          energyFlowDiagramId: listObj.value.id,
          name: formState.value.name,
          sort: formState.value.sort,
          type: 0,
        },
      })
      .then((res) => {
        console.log(res, 'handleOk');
        if (res) {
          visible.value = false;
          getDetailsById();
        }
      });
  } else {
    defHttp
      .post({
        url: '/cyEnergyFlowDiagramLink/edit',
        data: {
          id: formState.value.id,
          name: formState.value.name,
          sort: formState.value.sort,
          type: 0,
        },
      })
      .then((res) => {
        console.log(res, 'handleOk');
        if (res) {
          visible.value = false;
          getDetailsById();
        }
      });
  }
};

const onClickSection = () => {
  SectionTitle.value = '添加环节';
  visible.value = true;
};

const handleCancel = () => {
  visible.value = false;
  visibleTwo.value = false;
};

//保存//编辑模版
const clearConneSave = () => {
  if (!isAssCanstay.value) {
    defHttp
      .post({
        url: '/cyEnergyFlowDiagram/add',
        data: {
          name: listObj.value.name,
          remark: listObj.value.remark,
        },
      })
      .then((res) => {
        if (res) {
          emit('clearConneSaveSuccess');
        }
      });
  } else {
    defHttp
      .post({
        url: '/cyEnergyFlowDiagram/edit',
        data: {
          id: listObj.value.id,
          name: listObj.value.name,
          remark: listObj.value.remark,
        },
      })
      .then((res) => {
        if (res) {
          emit('clearConneSaveSuccess');
        }
      });
  }
};

//保存连线
const saveConnections = () => {
  defHttp
    .post({
      url: '/cyEnergyFlowDiagramLinkConnection/batchSave',
      data: {
        id: listObj.value.id,
        connections: connections.value,
      },
    })
    .then((res) => {
      if (res) {
        connections.value = [];
        getDetailsById();
      }
    });
};

// 节点选择处理
const onNodeSelect = (node, items) => {
  console.log('选择节点:', node);
  console.log('选择环节:', items);
  if (mode.value !== 'connect') return;
  if (!selectedNode1.value) {
    selectedNode1.value = node;
    selectedMeters1.value = items;
    isDrawing.value = true;
  } else if (!selectedNode2.value && selectedNode1.value.id !== node.id && !node.isLink && items.sort > selectedMeters1.value.sort) {
    selectedNode2.value = node;
    selectedMeters2.value = items;
    node.isLink = true;
    // 创建连接
    createConnection(selectedNode1.value, selectedNode2.value);
    // 重置选择
    setTimeout(() => {
      selectedNode1.value = null;
      selectedNode2.value = null;
      isDrawing.value = false;
      saveConnections();
    }, 300);
  } else {
    // 重新选择第一个节点
    selectedNode1.value = node;
    selectedNode2.value = null;
  }
};


// 创建连接
const createConnection = (fromNode, toNode, id) => {
  const connection = {
    id: id ? id : `conn-${Date.now()}`,
    from: fromNode,
    to: toNode,
    type: '',
    energy: '0.00',
    selected: false,
  };

  connections.value.push(connection);
  console.log('创建连接:', connection, connections.value);
};

// 根据节点类型确定连接类型
const getConnectionType = (fromType, toType) => {
  const types = {
    'input-conversion': '能源输入转换',
    'conversion-distribution': '转换配送',
    'distribution-consumption': '配送消费',
    'input-distribution': '直配',
    'conversion-consumption': '直供',
  };

  return types[`${fromType}-${toType}`] || '其他连接';
};

// 计算SVG路径
const calculatePath = (fromNode, toNode) => {
  const fromPos = getNodePosition(fromNode.id);
  const toPos = getNodePosition(toNode.id);

  if (!fromPos || !toPos) return '';

  // 创建曲线路径
  const startX = fromPos.x + fromPos.width;
  const startY = fromPos.y + fromPos.height / 2;
  const endX = toPos.x;
  const endY = toPos.y + toPos.height / 2;

  // 控制点使曲线平滑
  const controlX1 = startX + (endX - startX) / 3;
  const controlY1 = startY;
  const controlX2 = startX + ((endX - startX) * 2) / 3;
  const controlY2 = endY;

  return `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
};

// 计算正在绘制的路径
const calculateDrawingPath = (fromNode) => {
  const fromPos = getNodePosition(fromNode.id);
  if (!fromPos) return '';

  // 模拟鼠标位置（这里简化处理）
  const endX = fromPos.x + 200;
  const endY = fromPos.y;

  const startX = fromPos.x + fromPos.width;
  const startY = fromPos.y + fromPos.height / 2;

  return `M ${startX} ${startY} L ${endX} ${endY}`;
};

// 获取节点位置
const getNodePosition = (nodeId) => {
  const element = document.querySelector(`[data-meters-id="${nodeId}"]`);

  if (!element) return null;

  const rect = element.getBoundingClientRect();
  const container = document.querySelector('.flow-container');
  const containerRect = container.getBoundingClientRect();

  return {
    x: rect.left - containerRect.left,
    y: rect.top - containerRect.top,
    width: rect.width,
    height: rect.height,
  };
};

// 计算连接线中点位置
connections.value.forEach((conn) => {
  const fromPos = getNodePosition(conn.from.id);
  const toPos = getNodePosition(conn.to.id);

  if (fromPos && toPos) {
    conn.midX = (fromPos.x + fromPos.width + toPos.x) / 2;
    conn.midY = (fromPos.y + fromPos.height / 2 + toPos.y + toPos.height / 2) / 2;
  }
});

// 选择连接线
const selectConnection = (connection) => {
  console.log('选择连接线:', connection);
  console.log('选择连接线:', connections.value);
  connections.value.forEach((conn) => {
    conn.selected = conn.id === connection.id;
  });
  selectedConnection.value = connection;
};

// 删除连接线
const deleteConnection = (index) => {
  connections.value.splice(index, 1);
  selectedConnection.value = null;
};

const deleteSelectedConnection = () => {
  const index = connections.value.findIndex((conn) => conn.id === selectedConnection.value?.id);
  if (index !== -1) {
    connections.value.splice(index, 1);
    selectedConnection.value = null;
  }
  saveConnections();
  console.log('删除连接线:', connections.value);
};

// 清除所有连线
const clearConnections = () => {
  connections.value = [];
  selectedConnection.value = null;
  saveConnections();
};

// 添加节点
const addNode = (sectionType) => {
  textModal.value = '添加节点';
  visibleTwo.value = true;
  isAddNode.value = false;
  listNode.value = sectionType;
  listNodeValue.value = {};
  nodeName.value = '';
};

// 编辑环节
const onUpdataNode = (sectionType) => {
  console.log(sectionType, 'sectionType');
  SectionTitle.value = '编辑环节';
  visible.value = true;
  isAddNode.value = true;
  listNode.value = sectionType;
  formState.value = sectionType;
};

//删除节点
const onNodeDelte = (nodeId) => {
  console.log(nodeId, 'nodeId');
  defHttp
    .delete({
      url: `/cyEnergyFlowDiagramLink/delete?id=${nodeId.id}`,
    })
    .then((res) => {
      if (res) {
        getDetailsById();
      }
    });
};

// 添加表计
const addMeter = (node) => {
  console.log(node, 'node');
  listNode.value = node;
  visibleMeterDrawer.value = true;
  getEquipmentTypes();
};
//暴露方法
defineExpose({
  getDetailsById,
  onIsAssCanstay,
  onRemove,
  onSankeyDiagers,
  ontypeCanstay,
});
// 初始化一些示例连接
onMounted(() => {
  nextTick(() => {
    // 创建一些示例连接
    // setTimeout(() => {
    //   if (inputNodes.value[0] && conversionNodes.value[0]) {
    //     createConnection(inputNodes.value[0], conversionNodes.value[0]);
    //   }
    //   if (conversionNodes.value[0] && distributionNodes.value[0]) {
    //     createConnection(conversionNodes.value[0], distributionNodes.value[0]);
    //   }
    //   if (distributionNodes.value[0] && consumptionNodes.value[0]) {
    //     createConnection(distributionNodes.value[0], consumptionNodes.value[0]);
    //   }
    // }, 500);
  });
});
</script>
  
  <style scoped>
.gaps {
  gap: 20px;
}
.aosTios {
  font-weight: 500;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.9);
}
.aosTios1 {
  font-weight: bold;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.9);
  text-align: right;
}
.borders {
  width: 2px;
  height: 40px;
  background: #3333;
}
.aButtons {
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  padding: 3px 8px;
  cursor: pointer;
}
.aButtons:hover {
  color: #333 !important;
  white-space: nowrap;
  background: #deeff8 !important;
  padding: 3px 8px;
}
.marBos {
  margin-bottom: 16px;
}
.flexRight {
  display: flex;
  justify-content: flex-end;
}
.flex {
  display: flex;
  align-items: center;
}
.padings {
  padding: 24px 0;
}
.energy-flow-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.flow-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: white;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 20px;
}

.control-group {
  display: flex;
  gap: 10px;
}

.control-btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.control-btn.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.control-btn:hover {
  border-color: #1890ff;
}

.connection-status {
  padding: 8px 16px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 4px;
  color: #52c41a;
}

.flow-container {
  flex: 1;
  display: flex;
  position: relative;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  overflow: auto;
}

.flow-container1 {
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  overflow: auto;
}

.connection-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.connection-line {
  fill: none;
  stroke: #1890ff;
  stroke-width: 2;
  pointer-events: stroke;
  cursor: pointer;
}

.connection-line.drawing {
  stroke-dasharray: 5, 5;
  stroke: #ff4d4f;
}

.connection-line.selected {
  stroke-width: 3;
  stroke: #722ed1;
}

.connection-midpoint {
  fill: #ff4d4f;
  stroke: white;
  stroke-width: 2;
  cursor: pointer;
  pointer-events: all;
}

.connection-midpoint:hover {
  fill: #ff7875;
  transform: scale(1.2);
}

.energy-section {
  flex: 1;
  min-width: 250px;
  /* background: white; */
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  padding: 15px;
  margin: 0 10px;
  position: relative;
}

.input-section {
  border-top: 3px solid #1890ff;
}

.conversion-section {
  border-top: 3px solid #52c41a;
}

.distribution-section {
  border-top: 3px solid #fa8c16;
}

.consumption-section {
  border-top: 3px solid #722ed1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.section-icon {
  font-size: 20px;
}

.node-count {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.add-node-btn {
  padding: 4px 12px;
  background: #f0f0f0;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: #666;
}

.add-node-btn:hover {
  background: #e8e8e8;
}

.nodes-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.section-arrow {
  display: flex;
  align-items: center;
  padding: 0 10px;
  width: 40px;
}

.arrow-line {
  width: 40px;
  height: 2px;
  background: #666;
}

.arrow-head {
  margin-left: -5px;
  color: #666;
  font-size: 20px;
}

.connection-panel {
  position: absolute;
  right: 20px;
  top: 100px;
  width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #e8e8e8;
}

.panel-header h4 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}

.panel-content {
  padding: 15px;
}

.connection-info {
  margin-bottom: 15px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.info-label {
  color: #666;
}

.info-value {
  font-weight: 500;
  color: #333;
}

.energy-input {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  width: 100px;
}

.delete-btn {
  width: 100%;
  padding: 8px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:hover {
  background: #ff7875;
}
</style>