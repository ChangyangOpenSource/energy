<template>
  <a-card :bordered='false'>
    <div style="display: flex; justify-content: space-between; align-items: center; height: 100%">
      <div
        style="width: 25%; height: calc(100vh - 60px - 56px - 24px - 24px ); padding: 0 10px; background-color: rgba(242, 242, 242, 0.5686274509803921);">
        <div style="display: flex; margin-top: 10px">
          <a-descriptions title="场站管理"></a-descriptions>
          <a-button type="primary" @click="handleAdd">添加场站</a-button>
        </div>
        <div
          style="height: calc(100vh - 60px - 56px - 24px - 24px - 10px - 44px);  background-color: rgba(247, 247, 247, 0.9294117647058824); ">
          <div>
            <a-tree
              style="height: calc(100vh - 240px); margin-top: 10px"
              checkStrictly
              :tree-data="stationData"
              :expanded-keys="expandedKeys"
              :auto-expand-parent="autoExpandParent"
              v-model:selectedKeys="stationId"
              :fieldNames="{
                  children: 'children',
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
                  :class="{ 'clickable-node': type == 3 }"
                  @click="type == 3 ? onNodeClick(dataRef) : null"
                >
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
                          p-id="10104"
                        ></path>
                        <path
                          d="M286.9 354.1h124.7v40H286.9zM448.1 353.9h63.2v40h-63.2zM286.9 489.1h124.7v40H286.9zM448.1 488.9h63.2v40h-63.2zM286.9 616.6h124.7v40H286.9zM448.1 616.3h63.2v40h-63.2zM638.5 433.1h71v40h-71zM730.2 433h36v40h-36zM638.5 557.9h71v40h-71zM730.2 557.7h36v40h-36zM638.5 684.7h71v40h-71zM730.2 684.5h36v40h-36z"
                          fill="#333333"
                        ></path>
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
                  <span v-if="type != 3" class="node-actions">
                    <a-tooltip title="添加场站">
                      <PlusCircleOutlined
                        class="action-icon"
                        @click.stop="handleAdd(dataRef)"
                      />
                    </a-tooltip>
                  </span>
                  <span v-if="type == 3" class="node-actions">
                    <a-tooltip title="编辑">
                      <EditOutlined
                        class="action-icon"
                        @click.stop="handleEdit(dataRef)"
                      />
                    </a-tooltip>
                    <a-tooltip title="删除">
                      <DeleteOutlined
                        class="action-icon"
                        @click.stop="handleDelete(dataRef)"
                      />
                    </a-tooltip>
                  </span>
                </div>
              </template>
            </a-tree>
          </div>
        </div>

      </div>
      <div style="width: 75%; height: calc(100vh - 60px - 56px - 24px - 24px ); padding: 0 10px">
        <template v-if="visable">
          <cy-station-form ref="registerForm" @ok="initStationTree"></cy-station-form>
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
import {deleteById, getStationTree, queryById} from "@/views/energy/station/CyStation.api";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue';
import CyStationForm from "@/views/energy/station/components/CyStationForm.vue";
import {Modal} from "ant-design-vue";


const stationId = ref([]) //选中的场站id
const stationData = ref([]) //场站树形结构
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
  console.log('节点数据:', record);
  if (!record.disabled) {
    // 可以在这里处理节点点击逻辑
    nextTick(() => {
      queryById({id: record.id}).then((res) => {
        registerForm.value.detail(res)
      })
    })
    visable.value = true
  }
};

// 添加子节点
const handleAdd = (record) => {
  stationId.value = []
  console.log('添加子节点到:', record);
  visable.value = true
  nextTick(() => {
    registerForm.value.add(record)
  })
};

// 编辑节点
const handleEdit = (record) => {
  console.log('编辑节点:', record);
  nextTick(() => {
    queryById({id: record.id}).then((res) => {
      registerForm.value.edit(res)
    })
  })
  visable.value = true
};

// 删除节点
const handleDelete = (record) => {
  console.log('删除节点:', record);
  // 确认删除
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除 ${record.name} 吗？`,
    onOk: () => deleteById({id: record.id}).then((res) => {
      initStationTree()
    })
  });
};

onMounted(async () => {
  const res = await getStationTree();
  stationData.value = res
})


/**
 * 初始化场站树形结构
 */
function initStationTree() {
  getStationTree().then((res) => {
    stationData.value = res
  })
}

/**
 * 获取选中场站数据信息
 */
const getStation = (selectedKeys, {node}) => {
  if (node.type == 3) {
    stationId.value = selectedKeys;
  } else {
    visable.value = false
    stationId.value = []
  }
};


</script>

<style lang="less" scoped>
:deep(.ant-tree-title) {
  display: block;
  width: 100%;
  //background: red;
}

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
  padding-right: 8px;
}

.node-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-actions {
  margin-left: auto; /* 靠右显示 */
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.custom-tree-node:hover .node-actions {
  opacity: 1;
}

.action-icon {
  font-size: 14px;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
}

.action-icon:hover {
  background-color: #f0f0f0;
}
</style>
