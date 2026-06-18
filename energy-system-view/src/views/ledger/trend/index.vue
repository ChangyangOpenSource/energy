<!-- src/views/ledger/trend/index.vue -->
<template>
  <div>
    <div class="m_contentBox">
      <a-card :bordered="false">
        <div class="m_aCardBox">
          <!-- 选择产品筛选 -->
          <div class="tabBox">
            <div class="flex">
              <div class="twst">
                {{ t("carbon.message.DataFromCarbonExchanges") }}
              </div>
              <div
                  class="weixz"
                  :class="{ xzs: index == 1 }"
                  @click="onWeiXz(1)"
              >
                {{ t("carbon.message.Last_month") }}
              </div>
              <div
                  class="weixz"
                  :class="{ xzs: index == 2 }"
                  @click="onWeiXz(2)"
              >
                {{ t("carbon.message.Last_three_months") }}
              </div>
              <div
                  class="weixz"
                  :class="{ xzs: index == 3 }"
                  @click="onWeiXz(3)"
              >
                {{ t("carbon.message.Last_six_months") }}
              </div>
              <div
                  class="weixz"
                  :class="{ xzs: index == 4 }"
                  @click="onWeiXz(4)"
              >
                {{ t("carbon.message.Last_year") }}
              </div>
            </div>
          </div>
          <!-- 统计部分 -->
          <a-spin :spinning="loading">
            <div id="linse" ref="linseChartRef" v-if="!loading"></div>
            <div id="zhuse" ref="zhuseChartRef" v-if="!loading"></div>
          </a-spin>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick, onUnmounted } from 'vue';
import * as echarts from "echarts";
import dayjs from "dayjs";
import { useI18n } from '/@/hooks/web/useI18n';
import { scanCarbonMarket, getDictItems } from './trend.api';

const { t } = useI18n();

// refs
const linseChartRef = ref<HTMLDivElement | null>(null);
const zhuseChartRef = ref<HTMLDivElement | null>(null);
let linseChartInstance: echarts.ECharts | null = null;
let zhuseChartInstance: echarts.ECharts | null = null;

// reactive data
const activeKey = ref<string>("1"); // 1排放量排行（排放清单）/ 2排放量排行（阶段）/ 3排放量排行（工序）
const queryParam = reactive({}); // 查询请求数据
const productData = ref<any[]>([]); // 产品数据
const dataSource = ref({}); //
const loading = ref<boolean>(false);
const city = ref<any[]>([]);
const marketCityCodeList = ref<string[]>([]);
const marketCityCodeName = ref<string[]>([]);
const startTime = ref<string>("");
const endTime = ref<string>("");
const index = ref<number>(1);
const listObj = ref<any>({});

// lifecycle
onMounted(() => {
  getData();

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // 清理事件监听器和图表实例
  window.removeEventListener('resize', handleResize);
  if (linseChartInstance) {
    linseChartInstance.dispose();
  }
  if (zhuseChartInstance) {
    zhuseChartInstance.dispose();
  }
});

// methods
function handleChange(value: any) {
  console.log(`selected ${value}`);
  getCalculateModel();
}

/**
 * 下拉框数据过滤
 */
function filterOption(input: string, option: any) {
  return (
      option.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
  );
}

//碳价格趋势
function operatingCostAnalysis() {
  console.log(listObj.value, "listObj");
  if (!linseChartRef.value) return;

  // 销毁之前的实例
  if (linseChartInstance) {
    linseChartInstance.dispose();
  }

  linseChartInstance = echarts.init(linseChartRef.value);
  let option = {
    title: {
      text: t("carbon.message.CarbonPriceTrend"),
      left: "0.5%",
      subtext: t("carbon.message.UnitYuanPerTco2e"),
      itemGap: 24,
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      right: "1%",
      data: marketCityCodeName.value,
    },
    grid: {
      left: "1%",
      right: "1%",
      bottom: "3%",
      top: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: listObj.value.date,
    },
    yAxis: {
      type: "value",
    },
    dataZoom: [
      {
        type: "slider",
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 100,
      },
    ],
    series: listObj.value.unitPriceList,
  };

  linseChartInstance.setOption(option);
}

//碳交易量
function operazhusetAnalysis() {
  console.log(listObj.value, "listObj");
  if (!zhuseChartRef.value) return;

  // 销毁之前的实例
  if (zhuseChartInstance) {
    zhuseChartInstance.dispose();
  }

  zhuseChartInstance = echarts.init(zhuseChartRef.value);
  let option = {
    title: {
      text: t("carbon.message.CarbonTradingVolumeComparison"),
      left: "0.5%",
      subtext: t("carbon.message.UnitTco2e"),
      itemGap: 24,
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      right: "1%",
      data: marketCityCodeName.value,
    },
    grid: {
      left: "1%",
      right: "1%",
      bottom: "3%",
      top: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: listObj.value.date,
    },
    yAxis: {
      type: "value",
    },
    dataZoom: [
      {
        type: "slider",
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 100,
      },
    ],
    series: listObj.value.totalNumberList,
  };

  zhuseChartInstance.setOption(option);
}

async function getCalculateModel() {
  marketCityCodeName.value = [];
  loading.value = true;

  try {
    const res = await scanCarbonMarket({
      startTime: startTime.value,
      endTime: endTime.value,
      marketCityCodeList: marketCityCodeList.value,
    });

    loading.value = false;

    res.result.unitPriceList.forEach((item: any) => {
      item.type = "line";
      marketCityCodeName.value.push(item.name);
    });

    res.result.totalNumberList.forEach((item: any) => {
      item.type = "bar";
    });

    listObj.value = res.result;

    nextTick(() => {
      operatingCostAnalysis();
      operazhusetAnalysis();
    });
  } catch (error) {
    loading.value = false;
    console.error('Failed to get calculate model:', error);
  }
}

function onWeiXz(value: number) {
  index.value = value;
  if (value == 1) {
    console.log(dayjs().format("YYYY-MM-DD"));
    startTime.value = dayjs().subtract(30, "days").format("YYYY-MM-DD");
    endTime.value = dayjs().format("YYYY-MM-DD");
  } else if (value == 2) {
    startTime.value = dayjs().subtract(90, "days").format("YYYY-MM-DD");
    endTime.value = dayjs().format("YYYY-MM-DD");
  } else if (value == 3) {
    startTime.value = dayjs().subtract(180, "days").format("YYYY-MM-DD");
    endTime.value = dayjs().format("YYYY-MM-DD");
  } else {
    startTime.value = dayjs().subtract(365, "days").format("YYYY-MM-DD");
    endTime.value = dayjs().format("YYYY-MM-DD");
  }
  getCalculateModel();
}

async function getData() {
  try {
    // 获取城市字典
    const res = await getDictItems({
      dictCode: "market_city",
    });

    city.value = res || [];
    res.forEach((item: any) => {
      marketCityCodeList.value.push(item.value);
      marketCityCodeName.value.push(item.text);
    });

    onWeiXz(1);
    console.log("getDictItems product_type =>", res);
  } catch (error) {
    console.error('Failed to get data:', error);
  }
}

// 处理窗口大小变化
function handleResize() {
  if (linseChartInstance) {
    linseChartInstance.resize();
  }
  if (zhuseChartInstance) {
    zhuseChartInstance.resize();
  }
}
</script>

<style lang="less" scoped>
:deep(.ant-select) {
  width: auto !important;
  min-width: 200px;
}

#linse {
  width: 100%;
  height: 610px;
  background: #ffffff;
  border-radius: 3px 3px 3px 3px;
  margin-top: 24px;
  padding: 24px;
}

#zhuse {
  width: 100%;
  height: 610px;
  background: #ffffff;
  border-radius: 3px 3px 3px 3px;
  margin-top: 24px;
  padding: 24px;
}

.twst {
  font-weight: 400;
  font-size: 12px;
  color: #888888;
}

.flex {
  display: flex;
  align-items: center;
  gap: 16px;
}

.weixz {
  background: #ffffff;
  border-radius: 3px 3px 3px 3px;
  border: 1px solid #888888;
  font-weight: 400;
  font-size: 14px;
  color: #333333;
  padding: 5px 16px;
  cursor: pointer;
}

.xzs {
  background: @primary-color !important;
  border-radius: 3px 3px 3px 3px;
  padding: 5px 16px;
  font-weight: 400;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9) !important;
}

:deep(.ant-card-body) {
  background: #f5f8f7;
}

.tabBox {
  padding: 24px 24px;
  background: #ffffff;
  border-radius: 3px;
}

.selectProductBox {
  display: flex;
  align-items: center;
  padding: 0 24px;
  width: 100%;
  height: 66px;
  background: #ffffff;
  border-radius: 3px;

  .selectProductBox_label {
    margin-right: 10px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
  }

  .selectProductBox_content {
    width: 230px;
  }
}

.tabInnerBox {
  //padding: 8px 24px 0;
}

.statisticsBox {
  box-sizing: border-box;
  margin-top: 24px;
  padding: 24px;
  width: 100%;
  background: #ffffff;
  border-radius: 3px;

  .statisticsBox_box1 {
    padding: 0 253px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .statisticsBox_box1_item {
  }

  .statisticsBox_box1_item_label {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }

  .statisticsBox_box1_item_text {
    margin-top: 20px;
    font-family: DIN_MEDIUM;
    font-weight: 500;
    font-size: 38px;
    color: #148958;
  }

  .statisticsBox_hr {
    margin-top: 24px;
    width: 100%;
    height: 1px;
    background: #e7e7e7;
  }

  .statisticsBox_dateRange {
    margin-top: 24px;
    display: flex;
    align-items: center;
  }

  .statisticsBox_dateRange_text1 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #888888;
  }

  .statisticsBox_dateRange_text2 {
    margin-left: 14px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #333333;
  }

  .statisticsBox_dateRange_text3 {
    margin-left: 14px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #148958;
  }

  .statisticsBox_box2 {
    box-sizing: border-box;
    margin-top: 24px;
    padding: 0 119px;
    width: 100%;
    height: 145px;
    background: #fbfbfb;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .statisticsBox_box2_item {
  }

  .statisticsBox_box2_item_label {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #888888;
  }

  .statisticsBox_box2_item_text {
    margin-top: 24px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 18px;
    color: #333333;
  }

  .statisticsBox_tab {
    margin-top: 24px;
    width: 100%;
  }
}

.chart1 {
  width: 100%;
  height: 400px;
  //border: 1px solid red;
}

.chartBox {
  display: flex;
  justify-content: space-between;
}

.chart2 {
  flex: 1;
  height: 400px;
  //border: 1px solid red;
}

.chart3 {
  flex: 1;
  height: 400px;
  //border: 1px solid red;
}

#chart_bar_pfqd {
}

#chart_bar_jd {
}

#chart_pie_jd {
}

#chart_bar_gx {
}

#chart_pie_gx {
}
</style>
