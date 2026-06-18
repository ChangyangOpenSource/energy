<template>
  <a-card :bordered='false' :body-style="{padding: '0px 24px 0px 24px'}" style="height: calc(100vh - 60px - 56px - 24px - 24px );overflow-y: auto;">
    <div style="overflow-y: auto;">
      <div>
        <a-descriptions title="查询结果"></a-descriptions>
      </div>
      <div>
        <div style="display: flex;align-items: center;justify-content: space-between;">
          <div>统计值</div>
          <div>

          </div>
        </div>
        <div style="margin-top: 10px;">
          <a-table
            bordered
            :columns="columns"
            :data-source="dataSource"
            :pagination="false"
            :row-key="record => record.id"
            size="small"
          >
          </a-table>
        </div>
      </div>
      <div style="margin-top: 10px;">
        <div style="display: flex;align-items: center;justify-content: space-between;">
          <div>数据趋势图</div>
          <div>
          </div>
        </div>
        <div>
          <div id="main" style="width: 100%; height: 400px;"></div>
        </div>
      </div>

      <div style="margin-top: 10px;">
        <div style="display: flex;align-items: center;justify-content: space-between;">
          <div>数据明细</div>
          <div>
            <div @click="handleDownload">
              <DownloadOutlined :style="{ fontSize: '24px', cursor: 'pointer' }"/>
            </div>
          </div>
        </div>
        <div style="margin-top: 10px;">
          <a-table
            bordered
            :columns="columnsDetail"
            :data-source="dataSourceDetail"
            :pagination="false"
            :row-key="record => record.id"
          >
          </a-table>
        </div>
      </div>

    </div>


  </a-card>
</template>



<script setup lang="ts">
import {ref, reactive, unref, nextTick} from 'vue';
import * as echarts from 'echarts';
import {defineExpose} from "vue/dist/vue";
import {
  exportDeviceListDataApi
} from "@/api/equipment/equipment";
import { DownloadOutlined } from '@ant-design/icons-vue';
import {getCalData} from "@/views/energy/meter/components/CyEquipmentData.api";

const queryParams = ref({
  energyTypeCode: undefined,//能源类型
  deviceSn: [],//设备id
  type: 1,//时间维度
  dataTime: null,//时间
  startTime: null,//时间
  endTime: null,//时间
  latitude: undefined //查询的维度
});

//设备的总数据
const dataList = ref([]);

//设备
const equipmentList = ref([]);

//设备的维度值
const equipmentLatitude = ref([])

const columns = ref([
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName',
    width: 80
  },
  {
    title: '数据点',
    dataIndex: 'dataPoint',
    key: 'dataPoint',
    width: 80
  },
  {
    title: '总计',
    dataIndex: 'total',
    key: 'total',
    width: 40
  },
  {
    title: '平均值',
    dataIndex: 'avg',
    key: 'avg',
    width: 40
  },
  {
    title: '最大值',
    dataIndex: 'max',
    key: 'max',
    width: 40
  },
  {
    title: '最小值',
    dataIndex: 'min',
    key: 'min',
    width: 40
  },
])

const dataSource = ref([])

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


const columnsDetail = ref([
  {
    title: '日期',
    dataIndex: 'dataTime',
    key: 'dataTime',
    width: 60
  },
  {
    title: '数据点',
    dataIndex: 'dataPoint',
    key: 'dataPoint',
    width: 60
  },
])

const dataSourceDetail = ref([])

/**
 * 加载Echarts图标数据
 */
function initEcharts(){
  var chartDom = document.getElementById('main');
  if (!chartDom) return;

  var myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom);
  myChart.clear();

  echartsOption.value.xAxis.data = dataSourceDetail.value.map(item => item.dataTime);

  let seriesData = []
  let latitudeDataValue = []

  equipmentList.value.forEach((item, index) => {
    const latitudeName = item.title;
    const dataIndex = item.dataIndex;
    latitudeDataValue.push(latitudeName);

    // 检查数据是否存在并处理undefined情况
    let data = dataSourceDetail.value.map(item2 => {
      const value = item2[dataIndex];
      return value !== undefined ? value : 0;
    });

    let latitudeData = {
      name: latitudeName,
      type: 'line',
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
        const unit = equipmentLatitude.value[0].unit || '';
        result += `${param.seriesName}:     ${param.value}${unit}<br/>`;
      });
      return result;
    }
  };

  console.log(echartsOption.value, 'echartsOption')
  myChart.setOption(echartsOption.value, true);
}

/**
 * 下载
 */
function handleDownload(){
  exportDeviceListDataApi('设备数据.xlsx', queryParams.value);
}

/**
 * 查询设备数据
 */
async function findDeviceListDataFun(){
  const data = await getCalData(queryParams.value);
  let deviceParam = data.parameterPositions[0];
  let paramCode = deviceParam['paramCode'];
  dataList.value = data.dataList;
  equipmentLatitude.value = data.parameterPositions;
  equipmentList.value = data.equipmentList;
  //需要将data.dataList数据根据dataTime先进行分组  然后将数据里面的 deviceSn当作key deviceParam[paramCode]

  let groupData = groupAndTransform(dataList.value, paramCode, deviceParam['unit']);
  console.log(groupData, 'groupData')

  //循环设备
  for (let i = 0; i < data.equipmentList.length; i++) {
    columnsDetail.value.push(data.equipmentList[i])
  }
  dataSourceDetail.value = groupData;
  calculateStatistics();
  initEcharts();

}


// 添加新的函数用于计算统计数据
function calculateStatistics() {
  const statisticsData = [];

  // 遍历所有设备列（排除前两个固定列：日期和数据点）
  for (let i = 2; i < columnsDetail.value.length; i++) {
    const deviceColumn = columnsDetail.value[i];
    const deviceSn = deviceColumn.dataIndex;

    // 收集该设备的所有数据值
    const values = dataSourceDetail.value
      .map(item => item[deviceSn])
      .filter(val => val !== undefined && val !== null)
      .map(val => Number(val));


    // 计算统计值
    let total = 0;
    let avg = 0;
    let max = values.length > 0 ? Math.max(...values) : 0;
    let min = values.length > 0 ? Math.min(...values) : 0;

    if (values.length > 0) {
      total = values.reduce((sum, val) => sum + val, 0);
      avg = total / values.length;
    }

    // 从 dataSourceDetail 中获取 dataPoint（取第一条记录的 dataPoint）
    const dataPoint = dataSourceDetail.value.length > 0 ?
      dataSourceDetail.value[0].dataPoint : '';

    statisticsData.push({
      id: deviceSn,
      deviceName: deviceColumn.title, // 设备名称
      dataPoint: dataPoint, // 从数据源中获取统一的 dataPoint
      total: total.toFixed(2),
      avg: avg.toFixed(2),
      max: max.toFixed(2),
      min: min.toFixed(2)
    });
  }

  console.log("statisticsData", statisticsData)
  dataSource.value = statisticsData;
}


// 分组转换函数
function groupAndTransform(dataList: any[], paramCode: string, unit: string) {
  // 按 dataTime 分组
  const groupedByTime = dataList.reduce((acc, item) => {
    if (!acc[item.dataTime]) {
      acc[item.dataTime] = [];
    }
    acc[item.dataTime].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  // 转换为数组结构
  const result = Object.keys(groupedByTime).map(time => {
    // 从第一个项中获取 dataPoint（假设同一时间下的数据点相同）
    const firstItem = groupedByTime[time][0];
    const row = {
      dataTime: time,
      dataPoint: firstItem?.dataPoint || '', // 从 dataList 中获取 dataPoint
      deviceName: '', // 需要确认设备名称字段的具体来源
    } as Record<string, any>;

    // 将每个设备的数据添加到行中
    groupedByTime[time].forEach(item => {
      row[item.deviceSn] = item.deviceParam[paramCode] + unit;
    });

    return row;
  });

  return result;
}

/**
 * 初始化加载
 */
function init(queryParamsVlaue){
  queryParams.value = JSON.parse(JSON.stringify(queryParamsVlaue));
  findDeviceListDataFun();
}

defineExpose({
  init
});

</script>

<style scoped lang="less">

</style>
