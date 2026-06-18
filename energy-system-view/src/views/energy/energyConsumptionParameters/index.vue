<template>
  <div class="p-4">
    <a-card :bordered="false" style="height: 100%">
      <select-station-no-clear style="width: 200px" v-model:value="stationId"></select-station-no-clear>
      <a-tabs v-model:activeKey="activeKey" @change="tabChange">
        <a-tab-pane :key="item.key" :tab="item.label" v-for="item in compList" />
      </a-tabs>
      <component :is="currentComponent" :stationId="stationId" />
    </a-card>
  </div>
</template>
<script lang="ts">
import JDictSelectTag from '@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import { defineComponent, ref, computed } from 'vue';
import CyCoalCoefficientList from './coalCoefficient/CyCoalCoefficientList.vue';
import CyEnergyRateList from './rate/CyEnergyRateList.vue';
import CyEnergyFactorList from './energyFactor/CyEnergyFactorList.vue';
import {initDictOptions} from "@/utils/dict";
import SelectStationNoClear from "@/components/station/SelectStationNoClear.vue";
export default defineComponent({
  name: 'document-table-demo',
  components: {
    SelectStationNoClear,
    CyCoalCoefficientList,
    CyEnergyRateList,
    CyEnergyFactorList,
    JDictSelectTag
  },
  setup() {
    //当前选中key
    const activeKey = ref('CyCoalCoefficientList');
    const stationId = ref('');
    //组件集合
    const compList = ref([
      { key: 'CyCoalCoefficientList', label: '折标煤系数' },
      { key: 'CyEnergyRateList', label: '能源费率' },
      { key: 'CyEnergyFactorList', label: '碳排因子' },
    ]);
    //当前选中组件
    const currentComponent = computed(() => {
      return activeKey.value;
    });

    //使用component动态切换tab
    function tabChange(key) {
      activeKey.value = key;
    }

    return {
      activeKey,
      stationId,
      currentComponent,
      tabChange,
      compList
    };
  },
});
</script>
