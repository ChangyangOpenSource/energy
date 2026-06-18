<template>
  <div style=" height: 100%">

    <!-- 40px -->
    <a-input v-model:value="searchValue" style="margin-bottom: 8px" placeholder="输入关键词查询"/>

    <div style="height: calc(100% - 40px); background: #ffffff; overflow-y: auto">
      <a-tree
        checkable
        checkStrictly
        :tree-data="energyEquipments"
        v-model:checkedKeys="checkedKeys"
        :fieldNames="{
            title: 'energyConsumeEquipmentName',
            key: 'id',
          }"
        @check="checkEnergyEquipments"
      >
        <template #title="{ energyConsumeEquipmentName }">
            <span v-if="energyConsumeEquipmentName.indexOf(searchValue) > -1">
              {{ energyConsumeEquipmentName.substring(0, energyConsumeEquipmentName.indexOf(searchValue)) }}
              <span style="color: #f50">{{ searchValue }}</span>
              {{ energyConsumeEquipmentName.substring(energyConsumeEquipmentName.indexOf(searchValue) + searchValue.length) }}
            </span>
          <span v-else>{{ energyConsumeEquipmentName }}</span>
        </template>
      </a-tree>
    </div>
  </div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {list} from "@/views/energy/energyConsumeEquipment/CyEnergyConsumeEquipment.api"

const searchValue = ref(undefined)//关键词筛选
const energyEquipments = ref([]); //列表树
const checkedKeys = ref(); //勾选的
const emit = defineEmits();

/**
 * 树形复选框 选择时间
 */
function checkEnergyEquipments() {
  emit("update:value", checkedKeys.value.checked)
}

/**
 * 初始化数据
 */
function init(stationId) {
  list({stationId: stationId}).then((res) => {
    energyEquipments.value = res.records
    checkedKeys.value = []
  })
}

defineExpose({
  init
})
</script>

<style scoped lang="less">

</style>
