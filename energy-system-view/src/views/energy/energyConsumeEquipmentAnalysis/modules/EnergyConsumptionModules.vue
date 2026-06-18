<template>
  <a-card :bordered='false' :body-style="{padding: '0px 24px 0px 24px'}"
          style="height: calc(100vh - 62px - 138px - 200px );overflow-y: auto;">
    <div>
      <div>
        <a-card style="max-height: calc(24px + 39px + 39px + 39px + 39px); overflow-y: auto;">
          <a-descriptions title="" :column="{ xs: 1, sm: 3, md: 4}">
            <a-descriptions-item v-for="(equipmentData, index) in equipmentLatitude" :key="index"
                                 :label="equipmentData.paramName">
              <div v-if="equipmentLatitudeDataList.length > 0">
                {{
                  equipmentLatitudeDataList[equipmentLatitudeDataList.length - 1].deviceParam[equipmentData.paramCode]
                }}
              </div>
              <div v-else>0</div>
              {{ equipmentData.unit }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </div>

      <div style="margin-top: 15px; width: 100%; display: flex;align-items: center;justify-content: flex-start; gap: 12px">
        <div style="width: 20%">
          <select-time-value v-model:value="type" :options-value-list="[2,3,4,5,6]"></select-time-value>
        </div>
        <div style="width: 30%">
          <select-time-one :timeValue="type" :dataTime="dataTime"
                           v-model:value="dataTime"></select-time-one>
        </div>
        <div style="width: 50%">
          <a-select
            v-model:value="latitudeValue"
            mode="multiple"
            style="width: 100%"
            placeholder="请选择"
            @change="handleChange"
            allow-clear
          >
            <a-select-option v-for="(item, index) in equipmentLatitude" :key="index"
                             :value="item.paramCode">{{ item.paramName }}
            </a-select-option>
          </a-select>
        </div>
        <div>
          <a-button type="primary" @click="query">查询</a-button>
        </div>
      </div>

      <div style="margin-top: 15px; display: flex">
        <a-descriptions title="数据趋势"></a-descriptions>
        <a v-if="echartsType== 'bar'" @click="changeEcharts('line')">
          <svg width="24" height="24" viewBox="0 0 48 48" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6V42H42" stroke="#333" stroke-width="4" stroke-linecap="round"
                  stroke-linejoin="round"/>
            <path d="M14 34L22 18L32 27L42 6" stroke="#333" stroke-width="4" stroke-linecap="round"
                  stroke-linejoin="round"/>
          </svg>
        </a>
        <a v-if="echartsType== 'line'" @click="changeEcharts('bar')">
          <svg width="24" height="24" viewBox="0 0 48 48" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6V42H42" stroke="#333" stroke-width="4" stroke-linecap="round"
                  stroke-linejoin="round"/>
            <path d="M14 30V34" stroke="#333" stroke-width="4" stroke-linecap="round"
                  stroke-linejoin="round"/>
            <path d="M22 22V34" stroke="#333" stroke-width="4" stroke-linecap="round"
                  stroke-linejoin="round"/>
            <path d="M30 6V34" stroke="#333" stroke-width="4" stroke-linecap="round"
                  stroke-linejoin="round"/>
            <path d="M38 14V34" stroke="#333" stroke-width="4" stroke-linecap="round"
                  stroke-linejoin="round"/>
          </svg>
        </a>
      </div>

      <div>
        <div id="main" style="width: 100%; height: 400px;"></div>
      </div>


      <div
        style="margin-top: 10px;display: flex;align-items: center;justify-content: space-between;">
        <div>
          <a-descriptions title="数据明细"></a-descriptions>
        </div>
        <div>
          <div @click="handleDownload">
            <DownloadOutlined :style="{ fontSize: '24px', cursor: 'pointer' }"/>
          </div>

        </div>
      </div>
      <div style="margin-top: 10px;">
        <a-table
          bordered
          :columns="columns"
          :data-source="equipmentLatitudeDataList"
          :pagination="false"
          :row-key="record => record.id"
          :scroll="{ x: 1500 }"
        >
        </a-table>
      </div>
    </div>
  </a-card>
</template>


<script setup lang="ts">
import {ref, defineProps, defineExpose} from 'vue';
import * as echarts from 'echarts';
import {DownloadOutlined} from '@ant-design/icons-vue';
import SelectTimeValue from "@/components/SelectTimeValue/selectTimeValue.vue";
import SelectTimeOne from "@/components/SelectTime/selectTimeOne.vue";
import {
  calDynamicParam,
  exportXlsDynamicParam
} from "@/views/energy/energyConsumeEquipment/CyEnergyConsumeEquipment.api";
import dayjs from "dayjs";

const id = ref(undefined)
const paramType = ref(undefined)
const type = ref(2)
const dataTime = ref()//时间筛选
//维度值的选中值
const latitudeValue = ref([])
//设备的维度值
const equipmentLatitude = ref([])
//设备数据集合
const equipmentLatitudeDataList = ref([])
//echarts类型
const echartsType = ref('line')
//echarts的option
const echartsOption = ref({
  title: {
    text: ''
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: 'Video Ads',
      type: 'line',
      stack: 'Total',
      data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
      name: 'Direct',
      type: 'line',
      stack: 'Total',
      data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
})

//集合
const columns = ref([
  {
    title: '时间',
    dataIndex: 'dataTime',
    key: 'dataTime',
    width: 150
  },
])


/**
 * 多选下拉框选中回调
 */
function handleChange() {
  //重新加载Echarts
  initEcharts();
  //重新加载table
  columns.value = [
    {
      title: '时间',
      dataIndex: 'dataTime',
      key: 'dataTime',
      width: 150
    },
  ]
  latitudeValue.value.forEach((item, index) => {
    const latitudeItem = equipmentLatitude.value.find(item2 => item2.paramCode == item);
    if (!latitudeItem) return;

    const latitudeName = latitudeItem.paramName;
    const unit = latitudeItem.unit;
    columns.value.push({
      title: latitudeName,
      dataIndex: latitudeItem.paramCode,
      key: latitudeItem.paramCode,
      width: 150,
      customRender: function ({text, record, index, column}) {
        return record.deviceParam?.[item] + unit;
      }
    })
  });
}

/**
 * 加载echarts数据
 */
function initEcharts() {
  var chartDom = document.getElementById('main');
  if (!chartDom) return;

  var myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom);
  myChart.clear();

  // echarts的 xAxis.data  是equipmentLatitudeDataList里面的dataTime
  echartsOption.value.xAxis.data = equipmentLatitudeDataList.value.map(item => item.dataTime);

  let seriesData = []
  let latitudeDataValue = []

  latitudeValue.value.forEach((item, index) => {
    const latitudeItem = equipmentLatitude.value.find(item2 => item2.paramCode == item);
    if (!latitudeItem) return;

    const latitudeName = latitudeItem.paramName;
    latitudeDataValue.push(latitudeName);

    // 检查数据是否存在并处理undefined情况
    let data = equipmentLatitudeDataList.value.map(item2 => {
      const value = item2.deviceParam?.[item];
      return value !== undefined ? value : 0;
    });

    let latitudeData = {
      name: latitudeName,
      type: echartsType.value,
      data: data
    }
    seriesData.push(latitudeData);
  })

  echartsOption.value.legend.data = latitudeDataValue;
  echartsOption.value.series = seriesData;
  echartsOption.value.tooltip = {
    trigger: 'axis',
    formatter: function (params) {
      let result = '';
      params.forEach(function (param) {
        // 根据 seriesName 在 equipmentLatitude 中查找对应的单位
        const unit = equipmentLatitude.value.find(item => item.paramName === param.seriesName)?.unit || '';
        result += `${param.seriesName}:     ${param.value}${unit}<br/>`;
      });
      return result;
    }
  };

  console.log('图表最后的数据', echartsOption.value)
  myChart.setOption(echartsOption.value, true);
}

function changeEcharts(type) {
  echartsType.value = type
  initEcharts()
}

/**
 * 下载数据
 */
function handleDownload() {
  let param = {
    id: id.value,
    paramType: paramType.value,
    type: type.value,
    dataTime: dataTime.value,
    latitudeValue: latitudeValue.value
  }
  const data = exportXlsDynamicParam('设备数据.xlsx', param);
}

/**
 * 获取设备数据
 */
async function query() {
  let param = {
    id: id.value,
    paramType: paramType.value,
    type: type.value,
    dataTime: dataTime.value
  }
  // const data = await calculate(param);
  const data = await calDynamicParam(param);
  console.log(data);
  equipmentLatitude.value = data.parameterPositions;
  if (equipmentLatitude.value.length > 0 && (!latitudeValue || latitudeValue.value.length == 0)) {
    latitudeValue.value.push(equipmentLatitude.value[0].paramCode);
  }
  equipmentLatitudeDataList.value = data.dataList;
  console.log("latitudeValue", latitudeValue)
  handleChange();
}

function init(equipmentId, initParamType) {
  echartsType.value = 'line' //默认线性表
  id.value = equipmentId //查询的设备id
  paramType.value = initParamType //动态参数类型
  type.value = 2 //默认15分钟数据
  dataTime.value = dayjs().startOf('day').format('YYYY-MM-DD') //默认今天
  latitudeValue.value = [] //维度

  query()
}

defineExpose({
  init,
});
</script>

<style scoped lang="less">

</style>
