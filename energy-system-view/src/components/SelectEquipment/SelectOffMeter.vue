<template>
  <div style="height: 100%;">
    <a-input v-model:value="searchValue" style="margin-bottom: 8px" placeholder="输入关键词搜索"/>
    <div style="height: calc(100% - 40px); background: #ffffff; overflow-y: auto">
      <a-tree
        checkable
        checkStrictly
        :tree-data="filteredEquipments"
        v-model:checkedKeys="selectedEquipmentIds"
        :fieldNames="{
        title: 'name',
        key: 'id',
      }"
        @check="checkEquipments"
      >
      </a-tree>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {onMounted, ref, defineProps, watch, computed, nextTick} from 'vue';
import {
  equipmentList,
} from "@/views/energy/meter/CyEquipment.api";

const props = defineProps({
  equipmentTypeId: String,
  stationId: String,
});
const emit = defineEmits();

const searchValue = ref(undefined); //过滤名字
const selectedEquipmentIds = ref([]); //选中的
const equipments = ref([]); //所有数据

// 过滤函数
const filteredEquipments = computed(() => {
  if (!searchValue.value) return equipments.value

  const filterTree = (nodes) => {
    return nodes.filter(node => {
      // 如果当前节点匹配
      const match = node.name.includes(searchValue.value)

      // 如果有子节点，递归过滤
      if (node.children) {
        const filteredChildren = filterTree(node.children)
        if (filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren
          }
        }
      }

      return match
    })
  }

  return filterTree(equipments.value)
})

/**
 * 获取树形数据
 */
function getOffMeters() {
  //更换设备类型的时候 清空已选中的数据
  selectedEquipmentIds.value = []
  equipmentList({
    equipmentTypeId: props.equipmentTypeId,
    stationId: props.stationId,
    meterType: 3,
    pageSize: -1
  }).then((res) => {
    equipments.value = res.records
  })

  //更换设备类型的时候 清空已选中的数据
  checkEquipments()
}

/**
 * 将选中的数据返回给父页面
 */
function checkEquipments() {
  emit("update:value", selectedEquipmentIds.value.checked)
}

// 监听equipmentTypeId变化
watch(() => props.equipmentTypeId, (newVal) => {
  if (props.equipmentTypeId && props.stationId) {
    nextTick(() => {
      getOffMeters()
    })
  }
}, {immediate: true});

// 监听stationId变化
watch(() => props.stationId, (newVal) => {
  if (props.equipmentTypeId && props.stationId) {
    nextTick(() => {
      getOffMeters()
    })
  }
}, {immediate: true});

onMounted(async () => {
  // getOffMeters()
});
</script>

