<template>
  <a-card :bordered='false' >
    <div>
      <a-page-header
        v-if="isScreen"
        title="实时监测"
        :sub-title="recordEntity.name"
        @back="handleClick"
      >
        <template #extra>
          <a-button type="primary" @click="realTimeQuery">刷新</a-button>
        </template>
      </a-page-header>
      <div v-if="!isScreen" style="font-size: xx-large; margin-bottom: 10px;">
        {{recordEntity.name}}
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
            <a-select-option :value="1">分钟数据</a-select-option>
            <a-select-option :value="2">15分钟数据</a-select-option>
            <a-select-option :value="3">小时数据</a-select-option>
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

  //是否有返回按钮
  const isScreen = ref(false)

  //设备数据
  const recordEntity = ref({
    name: null,//设备名称
    equipmentCode: null//设备号
  })

  //全部值
  const isType = ref(0)

  //设备的实时数据
  const equipmentDatas = ref({})

  //维度值的选中值
  const latitudeValue = ref([])
  //设备的维度值
  const equipmentLatitude = ref([])
  //设备数据集合
  const equipmentLatitudeDataList = ref([])
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
  const timeValue = ref(1)
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
   * 时间类型选择回调
   */
  function handleTimeChange(){
    if (timeValue.value == 1 || timeValue.value == 2 || timeValue.value == 3 || timeValue.value == 4) {
      rangeValue.value = [dayjs().startOf('day').format('YYYY-MM-DD'),
        dayjs().endOf('day').format('YYYY-MM-DD')];
    } else if (timeValue.value == 5) {
      rangeValue.value = [dayjs().startOf('month').format('YYYY-MM'),
        dayjs().endOf('month').format('YYYY-MM')];
    } else if (timeValue.value == 6) {
      rangeValue.value = [dayjs().startOf('year').format('YYYY'),
        dayjs().endOf('year').format('YYYY')];
    }
    findEquipmentData()
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
   * 返回的点击事件
   */
  function handleClick() {
    emit("goBack")
  }


  // // 初始化 WebSocket
  // function initWebSocket() {
  //   let userId = unref(userStore.getUserInfo).id;
  //   let token = getToken();
  //   let sn = recordEntity.value.equipmentCode;
  //   // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
  //   let url = glob.domainUrl?.replace('https://', 'wss://').replace('http://', 'ws://') + '/iotDataWebsocket/' + userId + '/' + sn + '/' + isType.value;
  //   connectWebSocket(url);
  //   onWebSocket(onWebSocketMessage);
  // }

  // /**
  //  * 获取到数据
  //  * @param data
  //  */
  // function onWebSocketMessage(data) {
  //   equipmentData.value = data.data;
  // }

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
      startTime = startTime + " 00:00"
      endTime = endTime + " 23:59"
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
   * 实时查询
   */
  async function realTimeQuery() {
    let nowTime = dayjs().format('YYYY-MM-DD HH:mm');
    // let nowTime = '2025-12-12 10:32'
    let param = {
      deviceSn: recordEntity.value.equipmentCode,
      type: 1,
      startTime: nowTime,
      endTime: nowTime,
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
   * 获取设备数据
   */
  async function findEquipmentData() {
    let startTime = rangeValue.value[0];
    let endTime = rangeValue.value[1];
    if(timeValue.value == 1){
      startTime = startTime + " 00:00"
      endTime = endTime + " 23:59"
    }
    if(timeValue.value == 2){
      startTime = startTime + " 00:00"
      endTime = endTime + " 23:59"
    } else if(timeValue.value == 3){
      startTime = startTime + " 00:00"
      endTime = endTime + " 23:59"
    }
    let param = {
      stationId: recordEntity.value.stationId,
      deviceSn: recordEntity.value.equipmentCode,
      type: timeValue.value,
      startTime: startTime,
      endTime: endTime,
      isType: 0
    }
    const data = await calculate(param);
    // const data = await findDeviceDataApi(param);
    equipmentLatitude.value = data.parameterPositions;
    if (equipmentLatitude.value.length > 0 && (!latitudeValue || latitudeValue.value.length == 0)) {
      latitudeValue.value.push(equipmentLatitude.value[0].paramCode);
    }
    equipmentLatitudeDataList.value = data.dataList;
    handleChange();
  }

  /**
   * 初始化
   * @param record
   * @param isScreen  true 是左上角带返回的   false是纯页面
   */
  function init(record, isScreenFlg) {
    recordEntity.value = record
    isScreen.value = isScreenFlg
    console.log("isScreenFlg", isScreenFlg, isScreen)
    //rangeValue 默认设置今日
    rangeValue.value = [dayjs().startOf('day').format('YYYY-MM-DD'),
      dayjs().endOf('day').format('YYYY-MM-DD')];
    // initWebSocket();
    realTimeQuery()
    findEquipmentData();
  }

  defineExpose({
    init,
  });

</script>

<style scoped lang="less">

:deep(.ant-page-header){
  padding: 20px 0px;
}
</style>
