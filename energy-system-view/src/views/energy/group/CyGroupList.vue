<template>
  <a-card :bordered='false'>
    <div style="display: flex; justify-content: space-between; align-items: center; height: 100%">
      <div
        style="width: 25%; height: calc(100vh - 60px - 56px - 24px - 24px ); padding: 0 10px; background-color: rgba(242, 242, 242, 0.5686274509803921">
        <div style="margin-top: 10px">
          <a-descriptions title="能耗分组"></a-descriptions>
        </div>
        <div
          style="height: calc(100vh - 60px - 56px - 24px - 24px - 10px - 44px);  background-color: rgba(247, 247, 247, 0.9294117647058824); ">
          <div>
            <a-tree
              style="height: calc(100vh - 240px); margin-top: 10px;"
              checkStrictly
              :tree-data="treeData"
              :expanded-keys="expandedKeys"
              :auto-expand-parent="autoExpandParent"
              v-model:selectedKeys="selectedId"
              :fieldNames="{
                  children: 'groups',
                  title: 'name',
                  key: 'id',
                  type: 'type'
                }"
              @expand="onExpand"
              @select="getStation"
              :blockNode="true"
            >
              <template #title="{ name, type, dataRef }">
                <div
                  class="custom-tree-node"
                  :class="{ 'clickable-node': type == 3 || type == 4 }"
                  @click="type == 3 || type == 4 ? onNodeClick(dataRef) : null"
                >
                  <!-- 编辑模式 -->
                  <div v-if="editingNodeKey === dataRef.id" class="node-edit">
                    <div>
                      <a-input
                        ref="inputRef"
                        v-model:value="editingName"
                        size="small"
                        @press-enter="handleSaveEdit"
                        @keyup.esc="handleCancelEdit"
                        placeholder="请输入分组名称"
                        style="width: 200px; margin: 8px;"
                      />
                    </div>
                    <div style="margin-left: 8px; margin-bottom: 8px">
                      <a-button type="primary" size="small" @click="handleSaveEdit">保存</a-button>
                      <a-button size="small" @click="handleCancelEdit"
                                style="margin-left: 10px">取消
                      </a-button>
                    </div>
                  </div>

                  <!-- 查看模式 -->
                  <div v-else class="node-view">
                    <span class="node-name">
                      <span v-if="type == 1 || type == 2"
                            style="vertical-align: middle; display: inline-block;">
                        <svg
                          class="svg-company"
                          viewBox="0 0 1024 1024"
                          xmlns="http://www.w3.org/2000/svg"
                          width="256"
                          height="256"
                        >
                            <path
                              d="M234.9 226.9c0-25.9 25.1-46.9 56-46.9h226.9c30.5 0 55.3 21.1 55.3 46.9v580.9h40V340.2h132.5c25.9 0 46.9 21.1 46.9 46.9v413.5h40V387.2c0-47.9-39-86.9-86.9-86.9H613v-73.4c0-23.7-10.2-45.8-28.7-62.3-17.9-15.9-41.5-24.7-66.6-24.7H290.9c-52.9 0-96 39-96 86.9v580.9h40V226.9zM145.8 841.2h734.9v40H145.8z"
                              fill="#333333"
                              p-id="10104">
                            </path>
                            <path
                              d="M286.9 354.1h124.7v40H286.9zM448.1 353.9h63.2v40h-63.2zM286.9 489.1h124.7v40H286.9zM448.1 488.9h63.2v40h-63.2zM286.9 616.6h124.7v40H286.9zM448.1 616.3h63.2v40h-63.2zM638.5 433.1h71v40h-71zM730.2 433h36v40h-36zM638.5 557.9h71v40h-71zM730.2 557.7h36v40h-36zM638.5 684.7h71v40h-71zM730.2 684.5h36v40h-36z"
                              fill="#333333">
                            </path>
                          </svg>
                      </span>
                      <span v-if="type == 3" style="vertical-align: middle; display: inline-block;">
                      <svg width="15" height="15" viewBox="0 0 48 48" fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 44V4H12V20L28 12V20L44 12V44H4Z" fill="none" stroke="#333"
                              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <rect x="12" y="28" width="8" height="8" fill="none" stroke="#333"
                              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <rect x="28" y="28" width="8" height="8" fill="none" stroke="#333"
                              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>
                    {{ name }}
                  </span>
                    <span class="node-actions">
                      <!-- 添加分组按钮（场站和分组类型显示） -->
                      <a-tooltip v-if="type == 3 || type == 4" title="添加下一级">
                        <PlusCircleOutlined
                          :class="{ 'disabled-icon': addState }"
                          :style="{
                            cursor: addState ? 'not-allowed' : 'pointer',
                          }"
                          @click.stop="!addState ? handleAdd(dataRef) : null"
                        />
                      </a-tooltip>

                      <!-- 编辑按钮（分组类型显示） -->
                      <a-tooltip v-if="type == 4" title="编辑">
                        <EditOutlined
                          class="action-icon"
                          @click.stop="handleEdit(dataRef)"
                        />
                      </a-tooltip>

                      <!-- 删除按钮（分组类型显示） -->
                      <a-tooltip v-if="type == 4" title="删除">
                        <DeleteOutlined
                          class="action-icon"
                          @click.stop="handleDelete(dataRef)"
                        />
                      </a-tooltip>
                    </span>
                  </div>
                </div>
              </template>
            </a-tree>
          </div>
        </div>

      </div>
      <div style="width: 75%; height: calc(100vh - 60px - 56px - 24px - 24px ); padding: 0 10px">
        <template v-if="visable">
          <cy-group-equipment-form ref="registerForm" @ok="initTreeList"></cy-group-equipment-form>
        </template>
        <!-- 空状态居中 -->
        <div v-else style="
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                ">
          <a-empty description="暂无数据"/>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, ref} from "vue";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue';
import {message, Modal} from "ant-design-vue";
import {deleteById, treeList, saveOrUpdate} from "@/views/energy/group/CyGroup.api";
import CyGroupEquipmentForm from "@/views/energy/group/components/CyGroupEquipmentForm.vue";


const selectedId = ref([]) //选中的id
const treeData = ref([]) //场站树形结构
const expandedKeys = ref([]); //
const autoExpandParent = ref(true);
const registerForm = ref();
const visable = ref(false)//右侧页面是否显示
/**
 * 展开方法
 * @param keys
 */
const onExpand = (keys: string[]) => {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
  console.log("expandedKeys", expandedKeys)
};


// 节点点击事件
const onNodeClick = (record) => {
  selectedId.value = []
  console.log('节点数据:', record);
  // 可以在这里处理节点点击逻辑
  visable.value = true
  //点击分组 需要往上找到场站

  nextTick(() => {
    registerForm.value.init(record)
  })
};

// 编辑相关状态
const editingNodeKey = ref(null); // 正在编辑的节点key
const editingName = ref(''); // 编辑的名称
const editingOriginalName = ref(''); // 原始名称（用于取消编辑时恢复）
const inputRef = ref(); // 输入框引用
const addState = ref(false); //添加节点的状态

// 点击添加分组
function handleAdd(node) {
  console.log('添加分组到节点:', node);

  // 生成新的临时ID（可以用时间戳或UUID）
  const newId = 'temp_' + Date.now();
  const newGroup = {
    id: newId,
    key: newId,
    name: '', // 初始为空，等待用户输入
    type: 4, // 场站分组
    groups: [],
    parentId: node.id,
    parentType: node.type === 3 ? 1 : 2, // 父节点是场站还是分组
    isNew: true, // 标记为新节点
    stationId: node.type === 3 ? node.id : node.stationId, // 继承场站ID
  };

  addState.value = true

  // 添加到树数据中
  addNodeToTree(treeData.value, node.id, newGroup);

  // 展开父节点
  if (!expandedKeys.value.includes(node.id)) {
    expandedKeys.value.push(node.id);
  }

  // 延迟一小段时间后进入编辑模式
  nextTick(() => {
    setTimeout(() => {
      startEditing(newId, '');
    }, 100);
  });
}

// 点击编辑
function handleEdit(node) {
  console.log('编辑节点:', node,);
  startEditing(node.id, node.name);
}

// 开始编辑
function startEditing(key, name) {
  editingNodeKey.value = key;
  editingName.value = name;
  editingOriginalName.value = name;

  // 聚焦到输入框
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus();
    }
  });
}

// 保存编辑
async function handleSaveEdit() {
  if (!editingNodeKey.value) return;

  const newName = editingName.value.trim();
  if (!newName) {
    message.warning('分组名称不能为空');
    return;
  }

  // 找到正在编辑的节点
  const node = findNodeByKey(treeData.value, editingNodeKey.value);
  if (!node) {
    message.error('找不到要编辑的节点');
    return;
  }
  addState.value = false

  let param;
  if (!node.parentId) {
    //编辑
    param = {
      id: node.id,
      groupName: newName,
      stationId: node.stationId,
    }
  } else {
    addState.value = false
    //新增节点
    param = {
      parentId: node.parentId,
      groupName: newName,
      stationId: node.stationId,
    }
  }

  await saveOrUpdate(param)
  initTreeList()

  // 退出编辑模式
  editingNodeKey.value = null;
}

// 取消编辑
function handleCancelEdit() {
  if (!editingNodeKey.value) return;
  // 退出编辑模式
  editingNodeKey.value = null;
  addState.value = false
  //刷新数据
  initTreeList()
}

// 删除分组
async function handleDelete(node) {
  console.log('删除节点:', node);

  Modal.confirm({
    title: '确认删除',
    content: `确定要删除 ${node.name} 吗？`,
    onOk: () => deleteById({id: node.id}).then((res) => {
      initTreeList()
    })
  });
}

// 辅助函数：向树中添加节点
function addNodeToTree(nodes, parentId, newNode) {
  for (const node of nodes) {
    if (node.id === parentId) {
      if (!node.groups) {
        node.groups = [];
      }
      node.groups.push(newNode);
      return true;
    }

    if (node.groups && node.groups.length > 0) {
      const found = addNodeToTree(node.groups, parentId, newNode);
      if (found) return true;
    }
  }
  return false;
}

// 辅助函数：根据key查找节点
function findNodeByKey(nodes, key) {
  for (const node of nodes) {
    if (node.id === key) {
      return node;
    }

    if (node.groups && node.groups.length > 0) {
      const found = findNodeByKey(node.groups, key);
      if (found) return found;
    }
  }
  return null;
}

onMounted(async () => {
  const res = await treeList();
  treeData.value = res
})


/**
 * 初始化场站树形结构
 */
function initTreeList() {
  visable.value = false
  treeList().then((res) => {
    treeData.value = res
  })
}

/**
 * 获取选中场站数据信息
 */
const getStation = (selectedKeys, {node}) => {
  // 如果点击的是加号等操作按钮，不触发选中
  if (!node.event?.target?.closest('.node-actions') && (node.type == 3 || node.type == 4) && !selectedKeys[0].includes("temp")) {
    selectedId.value = selectedKeys;
    console.log('选中的场站ID:', selectedKeys);
  } else {
    visable.value = false
    selectedId.value = []
  }
};


</script>

<style lang="less" scoped>
/* 为可点击的节点添加手型光标 */
.clickable-node {
  cursor: pointer;
}

/* 为不可点击的节点添加默认光标 */
.custom-tree-node:not(.clickable-node) {
  cursor: default;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  //padding: 4px 0;
}

.node-view {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.node-edit {
  align-items: center;
  width: 100%;
}

.node-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-actions {
  margin-left: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.custom-tree-node:hover .node-actions {
  opacity: 1;
}

.action-icon {
  margin-left: 6px;
  cursor: pointer;
  font-size: 14px;
}

.action-icon:hover {
  color: #1890ff;
}
</style>
