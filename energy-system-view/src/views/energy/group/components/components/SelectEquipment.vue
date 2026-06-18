<template>
  <a-drawer
    :title="title"
    :width="600"
    :visible="visible"
    @ok="handleOk"
    :footer-style="{ textAlign: 'right' }"
    @close="handleCancel">
    <select-equipment-tree ref="registerEquipment" v-show="param.relationType == 1"  v-model:value="param.equipmentCodes"></select-equipment-tree>
    <select-energy-equipment ref="registerEnergyEquipment" v-show="param.relationType == 3" v-model:value="param.energyEquipmentIds"></select-energy-equipment>

    <template #footer>
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="handleOk">确认</a-button>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, nextTick, defineExpose } from 'vue';
import SelectEquipmentTree from "@/components/SelectEquipment/SelectEquipmentTree.vue";
import SelectEnergyEquipment from "@/components/SelectEnergyEquipment/SelectEnergyEquipment.vue";
import {addGroupEquipment} from "@/views/energy/group/CyGroup.api";

const emit = defineEmits(['ok']);
const title = ref('')
const visible = ref(false)

const registerEquipment = ref()
const registerEnergyEquipment = ref()
const param = ref()

/**
 * 初始化
 */
function init(queryParam) {
  visible.value = true
  param.value = queryParam
  param.value.equipmentCodes= []
  param.value.energyEquipmentIds= []

  nextTick(() => {
    if (queryParam.relationType == 1) {
      title.value = '计量表'
      registerEquipment.value.getTreeData(param.value.equipmentTypeId, param.value.stationId)

    } else if (queryParam.relationType == 3){

      title.value = '用能设备'
      registerEnergyEquipment.value.init(param.value.stationId)
    }
  })
}

/**
 * 保存
 */
function handleOk() {
  visible.value = false
  console.log("param", param)
  addGroupEquipment(param.value).then((res) => {
    emit("ok")
  })
}

/**
 * 取消
 */
function handleCancel() {
  visible.value = false
}


defineExpose({
  init,
})

</script>

<style scoped lang="less">

</style>
