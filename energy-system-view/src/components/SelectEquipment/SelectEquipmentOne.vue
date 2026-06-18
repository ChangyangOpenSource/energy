<template>
  <div style=" height: 100%">
    <a-input v-model:value="searchValue" style="margin-bottom: 8px" placeholder="输入关键词查询"/>
    <div style="height: calc(100% - 40px); background: #ffffff; overflow-y: auto">

      <a-tree
        :tree-data="equipments"
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        v-model:selectedKeys="selectedKeys"
        :fieldNames="{
          children: 'meters',
          title: 'name',
          key: 'sn',
        }"
        @select="selectedEquipments"
        @expand="onExpand"
      >
        <template #title="{ name }">
          <span v-if="name.indexOf(searchValue) > -1">
            {{ name.substring(0, name.indexOf(searchValue)) }}
            <span style="color: #f50">{{ searchValue }}</span>
            {{ name.substring(name.indexOf(searchValue) + searchValue.length) }}
          </span>
          <span v-else>{{ name }}</span>
        </template>
      </a-tree>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {onMounted, ref, defineProps, watch, nextTick} from 'vue';
import {treeListByEquipmentTypeId} from "@/views/energy/meter/CyEquipment.api";

const props = defineProps({
  equipmentTypeId: String,
  stationId: String,
});
const emit = defineEmits();

const expandedKeys = ref([]); //
const autoExpandParent = ref(true);
const selectedKeys = ref(''); //选中的
const equipments = ref([]); //列表树
const dataList = ref([]); //所有返回数据 不分层级
const searchValue = ref(undefined)//关键词筛选

// 在组件创建时或menuData变化时构建父级映射
const parentMap = ref(new Map());

// 构建key到父级链的映射
const buildParentMap = (tree, parentKeys = []) => {
  tree.forEach(node => {
    // 存储当前节点的完整父级链
    parentMap.value.set(node.id, [...parentKeys]);

    if (node.meters && node.meters.length > 0) {
      // 递归处理子节点，将当前节点key加入父级链
      buildParentMap(node.meters, [...parentKeys, node.id]);
    }
  });
};


/**
 * 获取父级key
 * @param id
 * @param children
 */
const getParentKey = (id, parent): string | number | undefined => {
  let parentKey;
  for (let i = 0; i < parent.length; i++) {
    const node = parent[i];
    if (node.meters) {
      if (node.meters.some(item => item.id === id)) {
        parentKey = node.id;
      } else {
        parentKey = getParentKey(id, node.meters);
      }
    }
  }
  return parentKey;
};

/**
 * 展开方法
 * @param keys
 */
const onExpand = (keys: string[]) => {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
};


/**
 * 树形复选框 选择时间
 */
function selectedEquipments(a, b) {
  emit("deviceDetection", selectedKeys.value, b.node.dataRef)
}


/**
 * 获取树形数据
 */
function getTreeData(equipmentTypeId, stationId) {
  if (props.equipmentTypeId && props.stationId) {
    treeListByEquipmentTypeId({
      equipmentTypeId: equipmentTypeId,
      stationId: stationId
    }).then((res) => {
      equipments.value = res
      dataList.value = []
      initDataList()
      buildParentMap(equipments.value)
      selectedKeys.value = ''
    })
  }
}

/**
 * 初始化dataList
 */
function initDataList() {
  equipments.value.map((item) => {
    if (item.meters && item.meters.length > 0) {
      item.meters.map((child) => {
        pushData(child)
      })
    }
  })
}

/**
 * 初始化dataList
 */
function pushData(child) {
  dataList.value.push(child)
  if (child.meters && child.meters.length > 0) {
    child.meters.map((child2) => {
      pushData(child2)
    })
  }
}

// 监听equipmentTypeId变化
watch(() => props.equipmentTypeId, (newVal) => {
  if (props.equipmentTypeId && props.stationId) {
    nextTick(() => {
      getTreeData(props.equipmentTypeId, props.stationId)
    })
  }
}, {immediate: true});

// 监听stationId变化
watch(() => props.stationId, (newVal) => {
  if (props.equipmentTypeId && props.stationId) {
    nextTick(() => {
      getTreeData(props.equipmentTypeId, props.stationId)
    })
  }
}, {immediate: true});

//监听 searchValue
watch(searchValue, value => {
  if (!value) {
    expandedKeys.value = [];
    autoExpandParent.value = false;
    return;
  }

  const allParentKeys = new Set();

  dataList.value.forEach(item => {
    if (item.name.indexOf(value) > -1) {
      // 从映射表中获取所有父级
      const parents = parentMap.value.get(item.id) || [];
      parents.forEach(id => allParentKeys.add(id));

    }
  });

  console.log("需要展开的所有父级key:", Array.from(allParentKeys));
  expandedKeys.value = Array.from(allParentKeys);
  searchValue.value = value;
  autoExpandParent.value = true;
});

</script>

