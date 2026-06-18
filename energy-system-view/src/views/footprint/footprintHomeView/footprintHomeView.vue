<!-- 产品碳足迹-碳足迹看板 -->
<template>
  <div>
    <div class="m_contentBox">
      <a-card :bordered="false">
        <div class="m_aCardBox">
          <!-- 选择产品筛选 -->
          <div class="tabBox">
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <a-row :gutter="24">
                  <a-col :span="24">
                    <a-form-item
                      :label="t('carbon.message.Select_products')"
                      :label-col="{ span: 12 }"
                      :wrapper-col="{ span: 12 }"
                    >
                      <a-select
                        v-model:value="queryParam.productId"
                        :placeholder="t('carbon.message.Please_enter')"
                        show-search
                        :filter-option="filterOption"
                        @change="onChangeNumeratorUnitId"    style="width: 200px;"
                      >
                        <a-select-option :value="item.id" v-for="(item, index) in productData" :key="index">
                          {{ item.productName }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
<!--                  <a-col :span="6">-->
<!--                  </a-col>-->
<!--                  <a-col :span="6">-->
<!--                  </a-col>-->
<!--                  <a-col :span="6">-->
<!--                  </a-col>-->
                </a-row>
              </a-form>
            </div>
          </div>
          <!-- 统计部分 -->
          <a-spin :spinning="loading">
            <section class="statisticsBox" v-if="queryParam.productId">
              <section class="statisticsBox_box1">
                <div class="statisticsBox_box1_item">
                  <div class="statisticsBox_box1_item_label">
                    {{t('carbon.message.Accounting_has_been_created')}}（{{ t('carbon.message.single') }}）
                  </div>
                  <div class="statisticsBox_box1_item_text" style="color: #2c57ff;">
                    {{ dataSource.accountingTotal || "0" }}
                  </div>
                </div>
                <div class="statisticsBox_box1_item">
                  <div class="statisticsBox_box1_item_label">
                    {{t('carbon.message.Model_creation')}}（{{ t('carbon.message.single') }}）
                  </div>
                  <div class="statisticsBox_box1_item_text" style="color: #148958;">
                    {{ dataSource.modelTotal || "0" }}
                  </div>
                </div>
                <div class="statisticsBox_box1_item">
                  <div class="statisticsBox_box1_item_label">
                    {{t('carbon.message.Accounting_completion')}}（{{ t('carbon.message.single') }}）
                  </div>
                  <div class="statisticsBox_box1_item_text" style="color: #E37318;">
                    {{ dataSource.completeTotal || "0" }}
                  </div>
                </div>
                <div class="statisticsBox_box1_item">
                  <div class="statisticsBox_box1_item_label">
                    {{t('carbon.message.Archived')}}（{{ t('carbon.message.single') }}）
                  </div>
                  <div class="statisticsBox_box1_item_text" style="color: #333333;">
                    {{ dataSource.archivedTotal || "0" }}
                  </div>
                </div>
              </section>
              <div class="statisticsBox_hr">
              </div>
              <div class="statisticsBox_dateRange">
                <div class="statisticsBox_dateRange_text1">{{ t('carbon.message.Latest_accounting_cycle') }}：
                </div>
                <div class="statisticsBox_dateRange_text2">
                  {{ dataSource.beginTime ? dataSource.beginTime.slice(0, 10) : '' }}
                  {{ t('carbon.message.to') }}
                  {{ dataSource.endTime ? dataSource.endTime.slice(0, 10) : '' }}
                </div>
                <div class="statisticsBox_dateRange_text3 m_hoverCP" @click="onViewMore">
                  {{ t('carbon.message.View_more') }}
                </div>
              </div>
              <section class="statisticsBox_box2">
                <div class="statisticsBox_box2_item">
                  <div class="statisticsBox_box2_item_label">{{ t('carbon.message.Life_cycle_boundary') }}
                  </div>
                  <div class="statisticsBox_box2_item_text" v-if="dataSource.lifeCycleType == 1">
                    {{ t('carbon.message.From_cradle_to_gate') }}
                  </div>
                  <div class="statisticsBox_box2_item_text" v-else-if="dataSource.lifeCycleType == 2">
                    {{ t('carbon.message.From_cradle_to_grave') }}
                  </div>
                  <div class="statisticsBox_box2_item_text" v-else-if="dataSource.lifeCycleType == 3">
                    {{ t('carbon.message.Customize') }}
                  </div>
                  <div class="statisticsBox_box2_item_text" v-else> -</div>
                </div>
                <div class="statisticsBox_box2_item">
                  <div class="statisticsBox_box2_item_label">
                    {{ t('carbon.message.Product_carbon_footprint') }}（kg CO₂e）
                  </div>
                  <div class="statisticsBox_box2_item_text">{{ dataSource.cptzjValue || "-" }}
                  </div>
                </div>
                <div class="statisticsBox_box2_item">
                  <div class="statisticsBox_box2_item_label">
                    {{ t('carbon.message.Maximum_emission_stage') }}：{{ dataSource.zdpfljdName || "-" }}（kg CO₂e）
                  </div>
                  <div class="statisticsBox_box2_item_text">{{ dataSource.zdpfljdValue || "-" }}
                  </div>
                </div>
                <div class="statisticsBox_box2_item">
                  <div class="statisticsBox_box2_item_label">
                    {{ t('carbon.message.Maximum_emission_type') }}：{{ dataSource.zdpfllxName || "-" }}（kg CO₂e）
                  </div>
                  <div class="statisticsBox_box2_item_text">
                    {{ dataSource.zdpfllxValue || "-" }}
                  </div>
                </div>
              </section>
              <section class="statisticsBox_tab">
                <div class="cardBox2_title"> {{t('carbon.message.Emission_rank')}}</div>

                <a-tabs :activeKey="activeKey" @change="onChangeActiveKey">
                  <a-tab-pane key="2" :tab="`${t('carbon.message.by_stages')}`" forceRender>
                    <div class="tabInnerBox">
                      <div class="chartBox">
                        <div class="chart2" id="chart_bar_jd"></div>
                        <div class="chart3" id="chart_pie_jd"></div>
                      </div>
                    </div>
                  </a-tab-pane>
                  <a-tab-pane key="3" :tab="`${t('carbon.message.By_process')}（${t('carbon.message.top_5')}）`" forceRender>
                    <div class="tabInnerBox">
                      <div class="chartBox">
                        <div class="chart2" id="chart_bar_gx"></div>
                        <div class="chart3" id="chart_pie_gx"></div>
                      </div>
                    </div>
                  </a-tab-pane>
                  <a-tab-pane key="1" :tab="`${t('carbon.message.by_emission_source')}（${t('carbon.message.top_10')}）`" forceRender>
                    <div class="tabInnerBox">
                      <div class="chart1" id="chart_bar_pfqd"></div>
                    </div>
                  </a-tab-pane>
                </a-tabs>
              </section>
            </section>
          </a-spin>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import * as echarts from 'echarts'
import { commonBarChartOption } from "@/common/constKey"
import {
  set_TPYZ_ProductId,
  set_From_Flag
} from "@/common/storage"
import { useI18n } from '/@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import {defHttp} from "@/utils/http/axios";

// 使用 i18n 和 router
const { t } = useI18n();
const router = useRouter()

// 定义响应式数据
const activeKey = ref('2') // 1排放量排行（排放清单）/ 2排放量排行（阶段）/ 3排放量排行（工序）
const queryParam = reactive({}) // 查询请求数据
const productData = ref([]) // 产品数据
const dataSource = ref({}) //
const loading = ref(false)

/**
 * 查看更多
 */
function onViewMore() {
  set_TPYZ_ProductId(queryParam.productId)
  // 设置跳转来源为碳足迹看板
  set_From_Flag(1)
  router.push(`/footprint/footprintProductView/footprintProductView`)
}

/**
 * 切换tab
 * @param key 1排放量排行（排放清单）/ 2排放量排行（阶段）/ 3排放量排行（工序）
 */
function onChangeActiveKey(key) {
  console.log('onChangeActiveKey', key);
  activeKey.value = key
}

/**
 * 修改产品
 */
function onChangeNumeratorUnitId(value) {
  console.log('onChangeNumeratorUnitId', value)
  // 获取数据
  dataSource.value = {}
  loading.value = true
  defHttp.get( {url:'/footprintProduct/cyFootprintProduct/getViewData', productId: queryParam.productId}).then((res) => {
      let resData = res || {}
      let theIndex = productData.value.findIndex(ele => ele.id == value)
      if (theIndex > -1) {
        let obj = productData.value[theIndex]
        resData.accountingTotal = obj.accountingTotal
        resData.modelTotal = obj.modelTotal
        resData.completeTotal = obj.completeTotal
        resData.archivedTotal = obj.archivedTotal
      }
      let cptzjValue = 0
      resData.zdpfljdValue = 0
      resData.zdpfllxValue = 0
      if (resData.detailList && resData.detailList.length > 0) {
        resData.detailList.forEach(item => {
          cptzjValue = cptzjValue + item.total
          if (item.total > resData.zdpfljdValue) {
            resData.zdpfljdName = item.name
            resData.zdpfljdValue = item.total
          }
          item.childList.forEach(itemA => {
            itemA.detailList.forEach(itemB => {
              if (itemB.emissionsVolume > resData.zdpfllxValue) {
                resData.zdpfllxName = itemB.type
                resData.zdpfllxValue = itemB.emissionsVolume
              }
            })
          })
        })
      }
      resData.cptzjValue = cptzjValue.toFixed(4)
      resData.zdpfljdValue = resData.zdpfljdValue.toFixed(4)
      resData.zdpfllxValue = resData.zdpfllxValue.toFixed(4)
      if (resData.emissionRanking && resData.emissionRanking.length > 0) {
        resData.emissionRanking.forEach(item => {
          if (item.typeName == '按清单') {
            drawLine1(item.listKey, item.listValue)
          }
          if (item.typeName == '按环节') {
            drawLine2(item.listKey, item.listValue)
            drawLine3(computePieData(item))
          }
          if (item.typeName == '按工序') {
            drawLine4(item.listKey, item.listValue)
            drawLine5(computePieData(item, 5))
          }
        })
      }
      dataSource.value = resData
  }).finally(() => {
    loading.value = false
  });
}

/**
 * 处理饼图数据
 */
function computePieData(item, max) {
  // 总数
  let totalNum = 0
  item.listValue.forEach((itemA, indexA) => {
    if (max) {
      if (indexA < max) {
        totalNum = totalNum + itemA
      }
    } else {
      totalNum = totalNum + itemA
    }
  })
  // 拼接数据
  let valueData = []
  item.listKey.forEach((itemA, indexA) => {
    if (max) {
      if (indexA < max) {
        valueData.push({
          name: itemA,
          value: item.listValue[indexA],
          proportion: totalNum === 0 ? 0 : Number(((item.listValue[indexA] / totalNum) * 100).toFixed(2))
        })
      }
    } else {
      valueData.push({
        name: itemA,
        value: item.listValue[indexA],
        proportion: totalNum === 0 ? 0 : Number(((item.listValue[indexA] / totalNum) * 100).toFixed(2))
      })
    }
  })
  console.log('valueData', valueData)
  return valueData
}

/**
 * 排放量排行（排放清单）【柱状图】
 */
function drawLine1(labelData, valueData) {
  console.log('drawLine1')
  let chart_bar_pfqd = echarts.init(
    document.getElementById('chart_bar_pfqd')
  )
  let option = commonBarChartOption('#148958', labelData.slice(0, 10), valueData.slice(0, 10))
  //使用制定的配置项和数据显示图表
  chart_bar_pfqd.setOption(option)
}

/**
 * 排放量排行（阶段）【柱状图】
 */
function drawLine2(labelData, valueData) {
  console.log('drawLine2')
  let chart_bar_jd = echarts.init(
    document.getElementById('chart_bar_jd')
  )
  let option = commonBarChartOption('#F99550', labelData, valueData)
  //使用制定的配置项和数据显示图表
  chart_bar_jd.setOption(option)
}

/**
 * 排放量排行（阶段）【饼图】
 */
function drawLine3(valueData) {
  console.log('drawLine3')
  let chart_pie_jd = echarts.init(
    document.getElementById('chart_pie_jd')
  )
  let option = commonPieOption(valueData)
  //使用制定的配置项和数据显示图表
  chart_pie_jd.setOption(option)
}

/**
 * 排放量排行（工序）【柱状图】
 */
function drawLine4(labelData, valueData) {
  console.log('drawLine2')
  let chart_bar_gx = echarts.init(
    document.getElementById('chart_bar_gx')
  )
  let option = commonBarChartOption('#F99550', labelData.slice(0, 5), valueData.slice(0, 5))
  //使用制定的配置项和数据显示图表
  chart_bar_gx.setOption(option)
}

/**
 * 排放量排行（工序）【饼图】
 */
function drawLine5(valueData) {
  console.log('drawLine5', valueData)
  let chart_pie_gx = echarts.init(
    document.getElementById('chart_pie_gx')
  )
  let option = commonPieOption(valueData)
  //使用制定的配置项和数据显示图表
  chart_pie_gx.setOption(option)
}

/**
 * 饼图配置
 */
function commonPieOption(valueData) {
  // 计算总值
  let total = 0;
  for (let i = 0; i < valueData.length; i++) {
    total += Number(valueData[i].value)
  }

  return {
    color: ['#1BC08A', '#81E0DB', '#FFC439', '#FF8C73', '#F35571'],
    title : {
      show:true,
      text: Number(total.toFixed(4)) +'tCO₂e', // \n可以换行
      x:'50%', // center
      y: 'center',
      textAlign: 'center',
      textStyle: {
        fontSize: '16',
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: '28',
        color:'#333'
      },
    },
    legend: {
      selectedMode:false,
      bottom:'0%',
      left: 'center',
      formatter: params => {
        //切割到冒号
        return params
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        return params.name + '：' + params.value + 'tCO₂e';
      },
    },
    itemStyle: {
      borderRadius: 10,
      borderColor: '#fff',
      borderWidth: 5
    },
    series: [
      {
        type: 'pie',
        center: ['50%', '50%'], // 左移20%（原默认值50%）
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        labelLayout: {
          hideOverlap: false, // 不隐藏重叠标签
        },
        name: '',
        label: {
          show: true,
          position: 'outside',
          formatter: function (params) {
            return params.percent + '%';
          }
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 15,
            fontWeight: 'bold'
          }
        },
        data: valueData
      }
    ]
  }
}

/**
 * 下拉框数据过滤
 */
function filterOption(input, option) {
  return (
    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  );
}

function getData() {
  // 产品
  defHttp.get({url:'/footprintProduct/cyFootprintProduct/getProductListByTime'}).then((res) => {
      productData.value = res || []
      if (productData.value.length > 0) {
        queryParam.productId = res[0].id
        onChangeNumeratorUnitId(res[0].id)
      }
  });
}

// 生命周期钩子
onMounted(() => {
  getData()
})
</script>

<style lang="less" scoped>
/deep/ .ant-card-body {
  background: #F5F8F7;
}

.tabBox {
  padding: 24px 24px;
  background: #FFFFFF;
  border-radius: 3px;
}

.selectProductBox {
  display: flex;
  align-items: center;
  padding: 0 24px;
  width: 100%;
  height: 66px;
  background: #FFFFFF;
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
  background: #FFFFFF;
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
    background: #E7E7E7;
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
    background: #FBFBFB;
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

.cardBox2_title {
  font-family: PingFang SC, PingFang SC;
  font-weight: bold;
  font-size: 16px;
  color: #333333;
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
