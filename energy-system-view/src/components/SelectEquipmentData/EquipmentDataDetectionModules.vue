<template>
  <a-card :bordered='false' :body-style="{padding: '0px 24px 0px 24px'}" style="height: calc(100vh - 60px - 56px - 24px - 24px );overflow-y: auto;">
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px;">
        <div style="font-size: 18px">
          {{equipmentName}}
        </div>
        <div>
          {{realTime}}
          <a-button type="primary" @click="realTimeQuery">刷新</a-button>
        </div>
      </div>
      <div>
        <a-card style="max-height: calc(24px + 39px + 39px + 39px + 39px); overflow-y: auto;">
          <a-descriptions title="" :column="{ xs: 1, sm: 3, md: 4}">
            <a-descriptions-item v-for="(equipmentData, index) in equipmentLatitude" :key="index"
                                 :label="equipmentData.paramName">
              <div v-if="equipmentDatas && equipmentDatas[equipmentData.paramCode]">
                {{equipmentDatas[equipmentData.paramCode]}}
              </div>
              <div v-else>0</div>
              {{ equipmentData.unit }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </div>

      <div style="margin-top: 10px; width: 100%; display: flex;align-items: center;justify-content: flex-start;">
        <div style="width: 20%">
          <a-select v-model:value="timeValue" style="width: 100%" placeholder="请选择" @change="handleTimeChange">
            <a-select-option v-if="!(recordEntity.type == 1 && recordEntity.meterType == 3)" :value="1">分钟数据</a-select-option>
            <a-select-option v-if="!(recordEntity.type == 1 && recordEntity.meterType == 3)" :value="2">15分钟数据</a-select-option>
            <a-select-option v-if="!(recordEntity.type == 1 && recordEntity.meterType == 3)" :value="3">小时数据</a-select-option>
            <a-select-option :value="4">日数据</a-select-option>
            <a-select-option :value="5">月数据</a-select-option>
            <a-select-option :value="6">年数据</a-select-option>
          </a-select>
        </div>
        <div style="width: 30%">
          <a-range-picker
              v-if="timeValue == 1 || timeValue == 2 || timeValue == 3 || timeValue == 4"
              v-model:value="rangeValue"
              style="margin-left: 15px;"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :placeholder="['开始时间', '结束时间']"
              @change="findEquipmentData"
          />

          <a-range-picker
              v-if="timeValue == 5"
              format="YYYY-MM"
              value-format="YYYY-MM"
              style="margin-left: 15px;"
              v-model:value="rangeValue" picker="month"
              :placeholder="['开始时间', '结束时间']"
              @change="findEquipmentData"
          />
          <a-range-picker
              v-if="timeValue == 6"
              format="YYYY"
              value-format="YYYY"
              style="margin-left: 15px;"
              v-model:value="rangeValue" picker="year"
              :placeholder="['开始时间', '结束时间']"
              @change="findEquipmentData"
          />
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
            <a-select-option v-for="(item, index) in equipmentLatitude" :key="index" :value="item.paramCode">{{item.paramName}}</a-select-option>
          </a-select>
        </div>
      </div>

      <div style="margin-top: 10px;">
        <a-descriptions title="数据趋势"></a-descriptions>
      </div>

      <div>
        <div id="main" style="width: 100%; height: 400px;"></div>
      </div>


      <div style="margin-top: 10px;display: flex;align-items: center;justify-content: space-between;">
        <div>
          <a-descriptions title="数据明细"></a-descriptions>
        </div>
        <div >
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
  import {ref} from 'vue';
  import * as echarts from 'echarts';
  import {defineExpose} from "vue/dist/vue";
  import {useUserStore} from "@/store/modules/user";
  import {useGlobSetting} from "@/hooks/setting";
  import {exportDeviceDataApi} from "@/api/equipment/equipment";
  import { DownloadOutlined } from '@ant-design/icons-vue';
  import dayjs from "dayjs";
  import {calculate} from "@/views/energy/meter/CyEquipment.api";

  const emit = defineEmits(['goBack']);

  //全局缓存
  const userStore = useUserStore();
  const glob = useGlobSetting();

  //设备数据
  const recordEntity = ref({
    name: null,//设备名称
    equipmentCode: null//设备号
  })

  //全部值
  const isType = ref(0)
  //设备的实时数据
  const equipmentDatas = ref({})
  const realTime = ref(dayjs().format('YYYY-MM-DD HH:mm'))
  //维度值的选中值
  const latitudeValue = ref([])
  //设备的维度值
  const equipmentLatitude = ref([])
  //设备数据集合
  const equipmentLatitudeDataList = ref([])
  //设备
  const equipmentName = ref([])
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


  //数据明细时间维度
  const timeValue = ref()
  //时间筛选
  const rangeValue = ref([])

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
   * 实时查询
   */
  async function realTimeQuery() {
    let type = 1
    realTime.value = dayjs().format('YYYY-MM-DD HH:mm');
    if (recordEntity.value.type == 1 && recordEntity.value.meterType == 3) {
      type = 4
      realTime.value = dayjs().format('YYYY-MM-DD');
    }
    // let nowTime = '2025-12-12 10:32'
    let param = {
      deviceSn: recordEntity.value.equipmentCode,
      type: type,
      startTime: realTime.value,
      endTime: realTime.value,
      isType: 0
    }
    const data = await calculate(param);
    if (data.dataList.length > 0) {
      equipmentDatas.value = data.dataList[0].deviceParam;
    } else {
      equipmentDatas.value = undefined
    }
  }


  /**
   * 时间类型选择回调
   */
  function handleTimeChange(){
    rangeValue.value = [];
  }

  /**
   * 多选下拉框选中回调
   */
  function handleChange(){
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
  function initEcharts(){
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
          const unit = equipmentLatitude.value.find(item => item.paramName === param.seriesName)?.unit || '';
          result += `${param.seriesName}:     ${param.value}${unit}<br/>`;
        });
        return result;
      }
    };

    console.log('图表最后的数据', echartsOption.value)
    myChart.setOption(echartsOption.value, true);
  }

  /**
   * 下载数据
   */
  function handleDownload(){
    //这里走下载的接口
    let startTime = rangeValue.value[0];
    let endTime = rangeValue.value[1];
    if(timeValue.value == 2){
      startTime = startTime + " 00:00"
      endTime = endTime + " 23:59"
    } else if(timeValue.value == 3){
      startTime = startTime + " 00"
      endTime = endTime + " 23"
    }
    let param = {
      deviceSn: recordEntity.value.equipmentCode,
      type: timeValue.value,
      startTime: startTime,
      endTime: endTime,
      latitudeValue: latitudeValue.value,
      isType: isType.value
    }
    const data = exportDeviceDataApi('设备数据.xlsx', param);
  }

  /**
   * 获取设备数据
   */
  async function findEquipmentData() {
    console.log("rangeValue", rangeValue)
    let startTime = rangeValue.value[0];
    let endTime = rangeValue.value[1];
    if(timeValue.value == 2){
      startTime = startTime + " 00:00"
      endTime = endTime + " 23:59"
    } else if(timeValue.value == 3){
      startTime = startTime + " 00"
      endTime = endTime + " 23"
    }
    let param = {
      deviceSn: recordEntity.value.equipmentCode,
      type: timeValue.value,
      startTime: startTime,
      endTime: endTime,
      isType: 0
    }
    const data = await calculate(param);
    // const data = await findDeviceDataApi(param);
    console.log(data);
    equipmentLatitude.value = data.parameterPositions;
    if (equipmentLatitude.value.length > 0 && (!latitudeValue || latitudeValue.value.length == 0)) {
      latitudeValue.value.push(equipmentLatitude.value[0].paramCode);
    }
    equipmentLatitudeDataList.value = data.dataList;
    equipmentName.value = data.equipmentList[0].title;
    handleChange();
  }

  /**
   * 初始化
   * @param record
   */
  function init(record) {
    latitudeValue.value = []
    recordEntity.value = record

    if (record.type == 1 && record.meterType == 3) {
      timeValue.value = 4
      console.log(4444444, timeValue)
    } else {
      timeValue.value = 1
      console.log(111111, timeValue)
    }
    //rangeValue 默认设置今日
    rangeValue.value = [dayjs().startOf('day').format('YYYY-MM-DD'),
      dayjs().endOf('day').format('YYYY-MM-DD')];
    realTimeQuery()
    findEquipmentData();
  }

  defineExpose({
    init,
  });

</script>

<style scoped lang="less">

</style>
