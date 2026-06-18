<template>
  <a-card :bordered='false'>
    <div style="display: flex; justify-content: space-between; align-items: center; height: 100%">
      <div
        style="width: 25%; background-color: rgba(247, 247, 247, 0.9294117647058824); height: calc(100vh - 60px - 56px - 24px - 24px); padding: 0 10px">
        <div style="margin-top: 10px">
          <a-descriptions title="用能设备列表"></a-descriptions>
        </div>
        <div>
          <div>场站</div>
          <select-station-no-clear v-model:value="stationId"></select-station-no-clear>
        </div>
        <div>
          <a-input-search v-model:value="searchValue"
                          style="margin-top: 10px; margin-bottom: 10px"
                          placeholder="输入关键词搜索"/>
          <a-tree
            style="height: calc(100vh - 330px)"
            checkStrictly
            :tree-data="menuData"
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            v-model:selectedKeys="equipmentId"
            :fieldNames="{
                  children: 'children',
                  title: 'label',
                  key: 'key',
                  selectable: 'selectable'
                }"
            @expand="onExpand"
            @select="getEquipmentData"
          >
            <template #title="{ label, dataRef }">
              <span v-if="dataRef.selectable">
                <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 43H43V5H14V15" stroke="#333" stroke-width="2" stroke-linejoin="round"/>
                  <path d="M5 15H23V43H5L5 15Z" fill="none" stroke="#333" stroke-width="2" stroke-linejoin="round"/>
                  <path d="M13 37H15" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M28 37H30" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span v-if="label.indexOf(searchValue) > -1">
                {{ label.substring(0, label.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ label.substring(label.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ label }}</span>
            </template>
          </a-tree>
        </div>
      </div>
      <div style="width: 75%; height: calc(100vh - 60px - 56px - 24px - 24px ); padding: 0 10px">
        <template v-if="visable">
          <a-card
            style="max-height: calc(24px + 39px + 39px + 39px + 39px); overflow-y: auto; margin: 10px">
            <a-row :gutter="24">
              <a-col :md="4">
                <div
                  style="display: flex; justify-content: center; align-items: center; height: 100%;">
                  <span v-if="!equipmentFixedParam.diagram"
                        style="font-size: 12px; font-style: italic;">无图片</span>
                  <img v-else :src="getImage(equipmentFixedParam.diagram)">
                </div>
              </a-col>
              <a-col :md="10">
                <div style="font-size: 18px; font-weight: 700">{{equipmentFixedParam.energyConsumeEquipmentName }}</div>
                <div>{{equipmentFixedParam.energyConsumeEquipmentCode }}</div>
                <div>关联场站：{{ equipmentFixedParam.stationName }}</div>
                <div>设备型号：{{ equipmentFixedParam.modelName }}</div>
              </a-col>
              <a-col :md="10">
                <div style="font-size: 18px; font-weight: 700">固定参数</div>
                <div v-for="param in equipmentFixedParam.params">
                  <a-row :gutter="24">
                    <a-col :md="24">
                      {{ param.name }}：{{ param.value }} {{ param.unit }}
                    </a-col>
                  </a-row>
                </div>
              </a-col>
            </a-row>
          </a-card>

          <a-tabs
            v-model:activeKey="activeKey"
            style="margin: 10px"
            @change="changeTabs"
          >
            <a-tab-pane v-for="dynamicParam in equipmentFixedParam.dynamicParams"
                        :key="dynamicParam.value" :tab="dynamicParam.text">

            </a-tab-pane>
          </a-tabs>
          <div>
            <energy-consumption-modules ref="registerModal" :id="equipmentId"
                                        :paramType="activeKey"></energy-consumption-modules>
          </div>
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
import {computed, nextTick, onMounted, ref, watch} from 'vue';
import {
  analysis,
  menuList
} from "@/views/energy/energyConsumeEquipment/CyEnergyConsumeEquipment.api";
import {getFileAccessHttpUrl} from "@/utils/common/compUtils";
import EnergyConsumptionModules
  from "@/views/energy/energyConsumeEquipmentAnalysis/modules/EnergyConsumptionModules.vue";
import SelectStationNoClear from "@/components/station/SelectStationNoClear.vue";

const stationId = ref("") //场站
const searchValue = ref() //查询值
const expandedKeys = ref([]); //
const autoExpandParent = ref(true);
const visable = ref(false)//右侧页面是否显示
const registerModal = ref([]);
const equipmentFixedParam = ref({
  diagram: undefined
}) // 设备动态参数
const equipmentId = ref([]) //设备
const menuData = ref([]) //列表数据
const dataList = ref([]) //列表数据 不含层级
const activeKey = ref() //tab选中值

// 在组件创建时或menuData变化时构建父级映射
const parentMap = ref(new Map());

// 构建key到父级链的映射
const buildParentMap = (tree, parentKeys = []) => {
  tree.forEach(node => {
    // 存储当前节点的完整父级链
    parentMap.value.set(node.key, [...parentKeys]);

    if (node.children && node.children.length > 0) {
      // 递归处理子节点，将当前节点key加入父级链
      buildParentMap(node.children, [...parentKeys, node.key]);
    }
  });
};

watch(searchValue, value => {
  if (!value) {
    expandedKeys.value = [];
    autoExpandParent.value = false;
    return;
  }

  const allParentKeys = new Set();

  dataList.value.forEach(item => {
    if (item.label.indexOf(value) > -1) {
      // 从映射表中获取所有父级
      const parents = parentMap.value.get(item.key) || [];
      parents.forEach(key => allParentKeys.add(key));

    }
  });

  console.log("需要展开的所有父级key:", Array.from(allParentKeys));
  expandedKeys.value = Array.from(allParentKeys);
  searchValue.value = value;
  autoExpandParent.value = true;
});


// 监听stationId变化
watch(stationId, (newVal, oldVal) => {
  console.log('stationId changed:', newVal)
  if (newVal) {
    menuList({stationId: stationId.value}).then((res) => {
      menuData.value = res;
      initDataList()
      expandedAll()
      buildParentMap(menuData.value)
    })
  }
}, { immediate: true });

/**
 * 展开全部
 */
function expandedAll() {
  const keys = []

  function traverse(nodes) {
    if (!nodes || !nodes.length) return
    nodes.forEach(node => {
      keys.push(node.key)
      if (node.children && node.children.length) {
        traverse(node.children)
      }
    })
  }

  traverse(menuData.value)

  expandedKeys.value = keys
}
/**
 * 获取图片地址
 *
 * @param url
 */
function getImage(url) {
  return getFileAccessHttpUrl(url);
}

/**
 * 获取父级key
 * @param id
 * @param children
 */
const getParentKey = (key, parent): string | number | undefined => {
  let parentKey;
  for (let i = 0; i < parent.length; i++) {
    const node = parent[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

/**
 * 获取设备分析数据
 */
function getEquipmentData() {
  if (equipmentId.value && equipmentId.value.length > 0) {
    visable.value = true
    analysis({id: equipmentId.value}).then((res) => {
      equipmentFixedParam.value = res
      activeKey.value = res.dynamicParams[0].value

      registerModal.value.init(equipmentId.value[0], res.dynamicParams[0].value)
    })
  } else {
    visable.value = false
  }
}

/**
 * 切换tabs
 */
function changeTabs() {
  registerModal.value.init(equipmentId.value[0], activeKey.value)
}

/**
 * 展开方法
 * @param keys
 */
const onExpand = (keys: string[]) => {
  expandedKeys.value = keys;
  autoExpandParent.value = false;

  console.log("expandedKeys", expandedKeys)
};

function initDataList() {
  menuData.value.map((item) => {
    if (item.children && item.children.length > 0) {
      item.children.map((child) => {
        pushData(child)
      })
    }
  })
}

function pushData(child) {
  dataList.value.push(child)
  if (child.children && child.children.length > 0) {
    child.children.map((child2) => {
      pushData(child2)
    })
  }
}
</script>

