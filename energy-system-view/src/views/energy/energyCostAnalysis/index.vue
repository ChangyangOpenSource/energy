<template>
  <div class="energyConsumptionAnalysis">
    <div class="topBox">
      <div class="title marBottom"> 用能成本分析 </div>
      <div class="flex juSCpace">
        <div class="timeBox">
          <div class="flex">
            <div class="title1 marginRight">用能场站:</div>
            <a-select ref="select" v-model:value="value1" style="width: 150px" @focus="focus" @change="handleChange">
              <a-select-option value="jack">Jack</a-select-option>
              <a-select-option value="lucy">Lucy</a-select-option>
              <a-select-option value="disabled" disabled>Disabled</a-select-option>
              <a-select-option value="Yiminghe">yiminghe</a-select-option>
            </a-select>
          </div>
          <div class="flex">
            <div class="title1 marginRight">能源类型:</div>
            <a-select ref="select" v-model:value="value1" style="width: 150px" @focus="focus" @change="handleChange">
              <a-select-option value="jack">Jack</a-select-option>
              <a-select-option value="lucy">Lucy</a-select-option>
              <a-select-option value="disabled" disabled>Disabled</a-select-option>
              <a-select-option value="Yiminghe">yiminghe</a-select-option>
            </a-select>
          </div>
          <div class="flex">
            <div class="title1 marginRight">用能分组:</div>
            <a-select ref="select" v-model:value="value1" style="width: 150px" @focus="focus" @change="handleChange">
              <a-select-option value="jack">Jack</a-select-option>
              <a-select-option value="lucy">Lucy</a-select-option>
              <a-select-option value="disabled" disabled>Disabled</a-select-option>
              <a-select-option value="Yiminghe">yiminghe</a-select-option>
            </a-select>
          </div>
          <div class="flex">
            <div class="title1 marginRight">时间维度:</div>
            <a-select ref="select" v-model:value="value1" style="width: 150px" @focus="focus" @change="handleChange">
              <a-select-option value="jack">Jack</a-select-option>
              <a-select-option value="lucy">Lucy</a-select-option>
              <a-select-option value="disabled" disabled>Disabled</a-select-option>
              <a-select-option value="Yiminghe">yiminghe</a-select-option>
            </a-select>
          </div>
          <div class="flex">
            <div class="title1 marginRight">基准期:</div>
            <a-date-picker v-model:value="value1" style="width: 150px" />
          </div>
          <div class="flex">
            <div class="title1 marginRight">统计期:</div>
            <a-date-picker v-model:value="value1" style="width: 150px" />
          </div>
        </div>
        <a-button type="primary" @click="handleAdd">查询</a-button>
      </div>
    </div>
    <div class="indicatorTypeBox">
      <div class="arrow arrow-left" @click="scrollLeft">
        <a-icon type="left" />
      </div>
      <div ref="indicatorContent" class="indicatorContent">
        <div class="indicatorTypeInner backgrouund" style="justify-content: space-around" v-for="(item, index) in indicatorTypeList" :key="index">
          <div class="flex">
            <div class="w-100" style="text-align: center">
              <div class="font-bold">累计能耗(tCO₂e)</div>
              <div class="total">1234</div>
            </div>
            <div class="verticalLine"></div>
            <div class="w-100">
              <div class="flex marBootom" style="justify-content: space-around">
                <div>同比</div>
                <div>
                  <Icon style="color: #f5222d" icon="ant-design:caret-up-outlined" />
                  <Icon style="color: #52c41a" icon="ant-design:caret-down-outlined" />
                  11%</div
                >
              </div>
              <div class="flex" style="justify-content: space-around">
                <div>环比</div>
                <div>
                  <Icon style="color: #f5222d" icon="ant-design:caret-up-outlined" />
                  <Icon style="color: #52c41a" icon="ant-design:caret-down-outlined" />
                  11%</div
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右箭头 -->
      <div class="arrow arrow-right" @click="scrollRight">
        <a-icon type="right" />
      </div>
    </div>

    <div class="zhibiao1 marBootom">
      <div class="flex borderBottom">
        <div class="textf"
          >用能成本分析
          <a-tooltip>
            <template #title>用能消费，所有能源类型统一为折标煤进行统计</template>
            <Icon icon="ant-design:question-circle-outlined" />
          </a-tooltip>
        </div>
        <div class="flex gap">
          <a-select ref="select" v-model:value="value1" style="width: 120px" @focus="focus" @change="handleChange">
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
            <a-select-option value="disabled" disabled>Disabled</a-select-option>
            <a-select-option value="Yiminghe">yiminghe</a-select-option>
          </a-select>
        </div>
      </div>
      <div class="flex gap padding-24">
        <div id="Analysisbar"></div>
        <div class="post">
          <div id="Analysispie"></div>
          <div class="postAbsout">
            <div class="postTitle">总消耗(tCOe)</div>
            <div class="postTitle1">123224 </div>
          </div>
        </div>
      </div>
    </div>

    <div class="antsonow">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="电"></a-tab-pane>
        <a-tab-pane key="2" tab="水"></a-tab-pane>
        <a-tab-pane key="3" tab="天然气"></a-tab-pane>
      </a-tabs>
      <div class="zhibiao marBootom flex w-100 hiddons paddingDssde gap">
        <div class="grid scoller" style="width: 49%">
          <div class="borderFlex padding-24" v-for="(item, index) in 10" :key="index">
            <div class="timeBox marBottom" style="align-items: center">
              <div class="imgs1"></div>
              <div class="title5">最大值</div>
            </div>
            <div class="timeBox">
              <div style="flex: 1">
                <div class="marBootom1">电量（KWh）</div>
                <div class="title marBootom1">1,234,234</div>
                <div class="title1">11％</div>
              </div>
              <div style="flex: 1">
                <div class="marBootom1">电量（KWh）</div>
                <div class="title marBootom1">1,234,234</div>
                <div class="title1">11％</div>
              </div>
            </div>
          </div>
        </div>
        <div style="width: 49%" class="dianBorders">
          <div class="borderBottom">
            <div class="textf">电费分析 </div>
          </div>
          <div class="padding-24">
            <div id="electricityBillAnalysis"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="antsonow">
      <div class="zhibiao marBootom">
        <div class="flex borderBottom">
          <div class="textf">成本趋势 </div>
        </div>
        <div class="flex padding-24px" style="gap: 128px">
          <div>
            <div class="title3 nowrap">基准期_电（kwh）</div>
            <div class="title2 marBootom">4320</div>
            <div class="title3 nowrap">统计期_电（kwh）</div>
            <div class="title2 marBootom">342</div>
            <div class="title3">增长率</div>
            <div class="title2">12.00%</div>
          </div>
          <div id="consumptionCurve"></div>
        </div>
      </div>
    </div>

    <div class="zhibiao marBootom marginSer">
      <div class="flex borderBottom">
        <div class="textf">分时用电 </div>
      </div>
      <div class="padding-24px">
        <div id="timeConsumption"></div>
      </div>
    </div>
  </div>
</template>
  
  
<script setup lang="ts">
import { onMounted, reactive, ref, nextTick } from 'vue';
import * as echarts from 'echarts';
const queryParam = ref({});
const activeKey = ref('1');
const indicatorContent = ref(null);
const indicatorTypeList = ref([123, 123, 123, 123, 123, 123]); // 指标类型列表
const ipagination = ref({
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['10', '20', '30'],
  showTotal: (total: number, range: number[]) => {
    return range[0] + '-' + range[1] + ' 共' + total + '条';
  },
  showQuickJumper: true,
  showSizeChanger: true,
  total: 0,
});
const columns = ref([
  {
    title: '排名',
    dataIndex: 'name',
  },
  {
    title: '计量表名称',
    dataIndex: 'name',
  },
  {
    title: '用电量(kwh)',
    dataIndex: 'name',
  },
  {
    title: '环比',
    dataIndex: 'chinese',
    sorter: {
      compare: (a, b) => a.chinese - b.chinese,
    },
  },
]);

function handleTableChange(pagination) {
  console.log(pagination);
}

/**
 * 向左滚动
 */
function scrollLeft() {
  if (indicatorContent.value) {
    indicatorContent.value.scrollBy({
      left: -450,
      behavior: 'smooth',
    });
  }
}

/**
 * 向右滚动
 */
function scrollRight() {
  console.log(indicatorContent.value, indicatorContent.value);
  if (indicatorContent.value) {
    indicatorContent.value.scrollBy({
      left: 450,
      behavior: 'smooth',
    });
  }
}

// 生命周期
onMounted(() => {
  getDataByMonthType();
  getAnalysispie();
  timeConsumption();
  electricityBillAnalysis();
  getConsumptionCurve();
});

//能耗曲线
const getConsumptionCurve = () => {
  let salesProportionChart = echarts.init(document.getElementById('consumptionCurve'));
  console.log(salesProportionChart);
  let optionPie = {
    color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
    legend: {
    },
    grid: {
      left: '1%',
      right: '1%',
      top: '18%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '单位：元',
        position: 'right',
        alignTicks: true,
        axisLine: {
          show: true,
          // lineStyle: {
          //   color: colors[0],
          // },
        },
        axisLabel: {
          formatter: '{value} k',
        },
      },
      {
        type: 'value',
        name: '单位：kwh',
        position: 'left',
        alignTicks: true,
        axisLine: {
          show: true,
          // lineStyle: {
          //   color: colors[1],
          // },
        },
        axisLabel: {
          formatter: '{value} k',
        },
      },
    ],
    series: [
      {
        data: [10, 46, 64, 10, 0, 10, 0],
        type: 'bar',
        name: 'a',
      },
      {
        data: [10, 46, 64, 10, 0, 10, 0],
        type: 'bar',
        name: 'b',
      },
      {
        data: [10, 46, 64, 10, 0, 10, 0],
        type: 'line',
        smooth: true,
        stack: 'b',
        yAxisIndex: 1,
        name: 'e',
      },
      {
        data: [10, 46, 64, 10, 0, 10, 0],
        type: 'line',
        smooth: true,
        stack: 'b',
        yAxisIndex: 1,
        name: 'e',
      },
    ],
  };

  salesProportionChart.setOption(optionPie);
  window.addEventListener('resize', function () {
    salesProportionChart.resize();
  });
};

/**
 *电费分析柱状图
 */
const electricityBillAnalysis = () => {
  let salesProportionChart = echarts.init(document.getElementById('electricityBillAnalysis'));
  console.log(salesProportionChart);
  const colors = ['#5070dd', '#b6d634', '#505372'];
  let optionPie = {
    color: colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    grid: {
      left: '4%',
      right: '4%',
      bottom: '6%',
      containLabel: true,
    },
    legend: {
      data: ['Evaporation', 'Precipitation', 'Temperature'],
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
        // prettier-ignore
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '单位：元',
        position: 'right',
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[0],
          },
        },
        axisLabel: {
          formatter: '{value} k',
        },
      },
      {
        type: 'value',
        name: '单位：kwh',
        position: 'left',
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[1],
          },
        },
        axisLabel: {
          formatter: '{value} k',
        },
      },
    ],
    series: [
      {
        name: '用电费用',
        type: 'bar',
        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
      },
      {
        name: '用电量',
        type: 'bar',
        yAxisIndex: 1,
        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
      },
    ],
  };
  salesProportionChart.setOption(optionPie);
  window.addEventListener('resize', function () {
    salesProportionChart.resize();
  });
};

/**
 *分时用电柱状图
 */
const timeConsumption = () => {
  let salesProportionChart = echarts.init(document.getElementById('timeConsumption'));
  console.log(salesProportionChart);
  let optionPie = {
    grid: {
      left: '2%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {},
    xAxis: {
      type: 'category',
      data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World'],
    },
    yAxis: [
      {
        type: 'value',
        name: '单位：元/kwh',
        position: 'right',
        alignTicks: true,
        axisLine: {
          show: true,
          // lineStyle: {
          //   color: colors[0],
          // },
        },
        axisLabel: {
          formatter: '{value} k',
        },
      },
      {
        type: 'value',
        name: '单位：元',
        position: 'left',
        alignTicks: true,
        axisLine: {
          show: true,
          // lineStyle: {
          //   color: colors[1],
          // },
        },
        axisLabel: {
          formatter: '{value} k',
        },
      },
    ],
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        stack: 'a',
        name: 'a',
      },
      {
        data: [10, 46, 64, '-', 0, '-', 0],
        type: 'bar',
        stack: 'a',
        name: 'b',
      },
      {
        data: [30, '-', 0, 20, 10, '-', 0],
        type: 'bar',
        stack: 'a',
        name: 'c',
      },
      {
        data: [30, '-', 0, 20, 10, '-', 0],
        type: 'bar',
        stack: 'a',
        name: 'd',
      },
      {
        data: [10, 20, 150, 0, '-', 50, 10],
        type: 'bar',
        stack: 'a',
        name: 'e',
      },
      {
        data: [10, 20, 150, 0, 10, 50, 10],
        type: 'line',
        smooth: true,
        stack: 'b',
        yAxisIndex: 1,
        name: 'e',
      },
    ],
  };
  salesProportionChart.setOption(optionPie);
  window.addEventListener('resize', function () {
    salesProportionChart.resize();
  });
};

/**
 *能源类型分享柱状图
 */
const getDataByMonthType = () => {
  let salesProportionChart = echarts.init(document.getElementById('Analysisbar'));
  console.log(salesProportionChart);
  let optionPie = {
    title: [
      {
        left: '0%',
        top: '1.25%',
        subtext: '单位tCO₂e', // 这里应该使用 t('carbon.message.UnitTco2e')
        subtextStyle: {
          fontSize: 14,
        },
      },
    ],
    grid: {
      left: '0%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {},
    xAxis: {
      type: 'category',
      data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World'],
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
    },
    series: [
      {
        name: '2011',
        type: 'bar',
        data: [18203, 23489, 29034, 104970, 131744, 630230],
      },
      {
        name: '2012',
        type: 'bar',
        data: [19325, 23438, 31000, 121594, 134141, 681807],
      },
    ],
  };
  salesProportionChart.setOption(optionPie);
  window.addEventListener('resize', function () {
    salesProportionChart.resize();
  });
};

/**
 *能源类型分享饼状图
 */
const getAnalysispie = () => {
  let salesProportionChart = echarts.init(document.getElementById('Analysispie'));
  console.log(salesProportionChart);
  let optionPie = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      right: 10,
      top: 'middle',
      type: 'scroll',
      orient: 'vertical',
      formatter: function (value) {
        console.log(value);
        return name + value;
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        left: -100,
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' },
        ],
      },
    ],
  };
  salesProportionChart.setOption(optionPie);
  window.addEventListener('resize', function () {
    salesProportionChart.resize();
  });
};
</script>
  
<style scoped lang="less">
.nowrap {
  white-space: nowrap;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.title5 {
  font-weight: 500;
  font-size: 24px;
  color: #333333;
}
#Analysisbar {
  width: 58%;
  height: 400px;
}
#Analysispie {
  width: 100%;
  height: 400px;
}

#electricityBillAnalysis {
  width: 100%;
  height: 360px;
}

#timeConsumption {
  width: 100%;
  height: 400px;
}

#proportionOf {
  width: 100%;
  height: 400px;
}

#consumptionCurve {
  width: 85%;
  height: 400px;
}
.flex {
  display: flex;
  align-items: center;
}
.w-100 {
  width: 100% !important;
}

.juSCpace {
  justify-content: space-between;
}

.borderBottom {
  border-bottom: 1px solid #e8e8e8;
  padding: 16px 16px 16px;
  justify-content: space-between;
}

.dianBorders {
  border: 1px solid #e8e8e8;
  border-radius: 6px;
}

.boxShouw {
  border-radius: 6px;
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
}

.font-bold {
  color: #00000073;
  font-size: 14px;
}

.borderFlex {
  flex: 1;
  padding: 16px 0 16px 64px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
}

.gap {
  gap: 24px !important;
}

.padding-24 {
  padding: 16px;
}

.paddingDssde {
  padding: 24px;
}

.padding-24px {
  padding: 24px 42px;
}

.padding-24px1 {
  padding: 0 42px 24px;
}

.scoller {
  overflow-y: scroll;
  height: 100%;
}

.hiddons {
  height: 500px;
  overflow: hidden;
}

.imgs {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: red;
}
.imgs1 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: red;
}

.postTitle {
  font-weight: 400;
  color: #00000073;
  font-size: 16px;
}

.postTitle1 {
  font-weight: 400;
  color: #333;
  font-size: 30px;
}
.post {
  width: 38%;
  position: relative;
}

.postAbsout {
  position: absolute;
  top: 42%;
  right: 50%;
  text-align: center;
}

.postAbsout2 {
  position: absolute;
  top: 42%;
  left: 25%;
  text-align: center;
}

.total {
  margin-top: 4px;
  font-size: 24px;
  font-weight: bold;
}

.zhibiao1 {
  background: #ffffff;
  border-radius: 6px;
  margin: 0 24px;
}

.antsonow {
  margin: 0 24px;
  /deep/ .ant-tabs-nav-list {
  }
  /deep/ .ant-tabs-tab {
    padding: 16px 64px;
    background: #ffffff;
    margin: 0;
  }

  /deep/ .ant-tabs-nav {
    margin: 0;
  }
}

.zhibiao {
  background: #ffffff;
  border-radius: 6px;
}

.topBox {
  background: #fff;
  padding: 16px;
}

.marginSer {
  margin: 0 24px;
}

.marBootom {
  margin-bottom: 24px;
}

.marBootom1 {
  margin-bottom: 4px;
}
.marBottom {
  margin-bottom: 14px;
}

.marginRight {
  margin-right: 14px;
}

.timeBox {
  display: flex;
  gap: 42px;
}

.paddigns {
  padding: 16px;
  border: 1px solid #e8e8e8;
  width: 28%;
  border-radius: 6px;
}

.textf {
  color: rgba(51, 51, 51, 1);
  font-weight: 600;
  font-size: 16px;
}

.title {
  font-weight: 500;
  font-size: 18px;
  color: #333333;
}

.title1 {
  font-weight: 500;
  font-size: 14px;
  color: #333333;
}

.title2 {
  font-weight: 500;
  font-size: 32px;
  color: #333333;
}
.title3 {
  font-weight: 400;
  font-size: 18px;
  color: #888888;
}
.verticalLine {
  width: 1px;
  height: 100%;
  background: #e8e8e8;
  height: -webkit-fill-available;
}
.trend-icon {
  font-size: 12px;
  &.up,
  &.down {
    margin-left: 4px;
    position: relative;
    top: 1px;

    i {
      font-size: 12px;
      transform: scale(0.83);
    }
  }

  &.up {
    color: #f5222d;
  }

  &.down {
    color: #52c41a;
    top: -1px;
  }
}

.indicatorTypeBox {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  .backgrouund {
    background: #ffffff;
  }
  .arrow {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;

    &:hover {
      background: #e8e8e8;
    }

    &.arrow-left {
      order: -1;
    }
  }

  .indicatorContent {
    flex: 1;
    overflow-x: hidden;
    padding: 0 10px;
    white-space: nowrap;
    .indicatorTypeInner {
      width: 390px;
      // height: 180px;
      border: 1px solid #e9e9e9;
      border-radius: 6px;
      padding: 20px;
      display: inline-block;
      vertical-align: top;
      margin-right: 24px;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        span {
          font-size: 14px;
          color: #666;
        }
      }

      .value {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .trend {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 14px;
        color: #666;

        .anticon {
          font-size: 12px;
        }
      }
    }
  }
}

.color {
  color: #d9001b;
}
.color1 {
  color: #f59a23;
}
.color2 {
  color: #13c2c2;
}
.color3 {
  color: #4bc26e;
}
.color4 {
  color: #1890ff;
}
</style>
  