<template>
  <a-card :bordered='false' >
    <div style="display: flex; justify-content: space-between; align-items: center; height: 100%">
      <div style="width: 25%; background-color: rgba(247, 247, 247, 0.9294117647058824); height: calc(100vh - 60px - 56px - 24px - 24px ); padding: 0 10px">
        <div style="margin-top: 10px">
          <a-descriptions title="历史数据"></a-descriptions>
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
          <div style="height: 38vh;">
            <select-equipment-tree :equipmentTypeId="queryParams.equipmentTypeId" :stationId="queryParams.stationId" v-model:value="queryParams.deviceSn"></select-equipment-tree>
          </div>
        </div>
        <div style="margin-top: 10px">
          <div>选择参数</div>
          <div>
            <select-param :deviceSn="queryParams.deviceSn" v-model:value="queryParams.latitude"></select-param>
          </div>
        </div>
        <div>
          <div>时间维度</div>
          <div>
            <select-time-value v-model:value="queryParams.type" :options-value-list="[3,4,5,6]"></select-time-value>
          </div>
        </div>
        <div>
          <div>选择时间</div>
          <div>
            <select-time-one :timeValue="queryParams.type" v-model:value="queryParams.dataTime"></select-time-one>
          </div>
        </div>

        <div style="margin-top: 10px; width: 100%">
          <a-button type="primary" style="width: 100%" @click="findDeviceData">查询</a-button>
        </div>
      </div>
      <div style="width: 75%; height: calc(100vh - 60px - 56px - 24px - 24px ); padding: 0 10px">
        <template v-if="visable">
          <energy-consumption-modules ref="EnergyConsumptionModulesRef"></energy-consumption-modules>
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
import {ref} from 'vue';
import {defineExpose} from "vue/dist/vue";
import EnergyConsumptionModules from "@/views/energy/energyConsumption/modules/EnergyConsumptionModules.vue";
import SelectEquipmentTree from "@/components/SelectEquipment/SelectEquipmentTree.vue";
import SelectParam from "@/components/SelectParam/selectParam.vue";
import SelectTimeValue from "@/components/SelectTimeValue/selectTimeValue.vue";
import SelectEquipmentType from "@/components/SelectEquipmentType/selectEquipmentType.vue";
import SelectTimeOne from "@/components/SelectTime/selectTimeOne.vue";
import {useMessage} from "@/hooks/web/useMessage";
import SelectStationNoClear from "@/components/station/SelectStationNoClear.vue";

const visable = ref(false)//右侧页面是否显示
const EnergyConsumptionModulesRef = ref();
const { createMessage, createConfirm } = useMessage();


const queryParams = ref({
  stationId: undefined, //场站
  equipmentTypeId: undefined,//设备类型
  energyTypeCode: undefined,//能源类型
  deviceSn: undefined,//设备id
  type: 3,//时间维度
  dataTime: null,//时间
  startTime: null,//时间
  endTime: null,//时间
  latitude: undefined //查询的维度
});

function findDeviceData(){
  console.log(111, queryParams.value);
  if (!queryParams.value.deviceSn || queryParams.value.deviceSn.length == 0) {
    visable.value = false
    createMessage.warning("请选择设备");
  } else if(!queryParams.value.latitude) {
    visable.value = false
    createMessage.warning("请选择参数");
  }  else if(!queryParams.value.type) {
    visable.value = false
    createMessage.warning("请选择时间维度");
  } else if(!queryParams.value.dataTime) {
    visable.value = false
    createMessage.warning("请选择时间");
  }else {
    visable.value = true
    if(queryParams.value.type == 2){
      queryParams.value.startTime = queryParams.value.dataTime + " 00:00"
      queryParams.value.endTime = queryParams.value.dataTime + " 23:59"
    } else if(queryParams.value.type == 3) {
      queryParams.value.startTime = queryParams.value.dataTime + " 00"
      queryParams.value.endTime = queryParams.value.dataTime + " 23"
    }
    EnergyConsumptionModulesRef.value.init(queryParams.value);
  }
}

defineExpose({
});

</script>

<style scoped lang="less">

</style>
