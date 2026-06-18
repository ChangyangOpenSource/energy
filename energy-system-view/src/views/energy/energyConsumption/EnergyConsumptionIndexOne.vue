<template>
  <a-card :bordered='false' >
    <div style="display: flex; justify-content: space-between; align-items: center; height: 100%">
      <div style="width: 25%; background-color: rgba(247, 247, 247, 0.9294117647058824); height: calc(100vh - 60px - 56px - 24px - 24px); padding: 0 10px">
        <div style="margin-top: 10px">
          <a-descriptions title="实时查询"></a-descriptions>
        </div>
        <div>
          <div>场站</div>
          <select-station-no-clear v-model:value="queryParams.stationId"></select-station-no-clear>
        </div>
        <div>
          <div>设备类型</div>
          <select-equipment-type v-model:value="queryParams.equipmentTypeId"></select-equipment-type>
        </div>
        <div>
          <div>选择设备</div>
          <div style="height: 61vh;">
            <select-equipment-one :equipmentTypeId="queryParams.equipmentTypeId" :stationId="queryParams.stationId" @deviceDetection="deviceDetection"></select-equipment-one>
          </div>
        </div>
      </div>
      <div style="width: 75%; height: calc(100vh - 60px - 56px - 24px - 24px ); padding: 0 10px">
        <template v-if="visable">
          <equipment-data-detection-modules ref="EquipmentDataDetectionRef"></equipment-data-detection-modules>
        </template>
        <!-- 空状态居中 -->
        <div v-else style="
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <a-empty description="暂无数据" />
        </div>
      </div>
    </div>
  </a-card>
</template>



<script setup lang="ts">
import {nextTick, ref} from 'vue';
import {defineExpose} from "vue/dist/vue";
import SelectEquipmentType from "@/components/SelectEquipmentType/selectEquipmentType.vue";
import SelectEquipmentOne from "@/components/SelectEquipment/SelectEquipmentOne.vue";
import EquipmentDataDetectionModules from "@/components/SelectEquipmentData/EquipmentDataDetectionModules.vue";
import SelectStationNoClear from "@/components/station/SelectStationNoClear.vue";

const EquipmentDataDetectionRef = ref();
const visable = ref(false)//右侧页面是否显示

const queryParams = ref({
  stationId: undefined, //场站
  equipmentTypeId: undefined,//设备类型
  energyTypeCode: undefined,//能源类型
  deviceSn: undefined,//设备id
  type: 2,//时间维度
  dataTime: null,//时间
  latitude: undefined //查询的维度
});

/**
 * 实时检测
 */
function deviceDetection(sn, selectedRow) {
  if (sn && sn.length > 0) {
    visable.value = true
    nextTick(()=>{
      EquipmentDataDetectionRef.value.init({equipmentCode: sn[0], type: selectedRow.type, meterType:selectedRow.meterType})
    })
  } else {
    visable.value = false
  }
}

defineExpose({
});

</script>

<style scoped lang="less">

</style>
