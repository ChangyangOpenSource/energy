<!-- src/views/neutrality/overview/index.vue -->
<template>
  <div class="psoqe">
    <!-- 查询区域 -->
    <div class="tablse">
      <a-select
          v-model:value="listId"
          :placeholder="t('carbon.message.Please_select')"
          show-search
          :filter-option="filterOption"
          style="width: 256px"
          @change="updateProvince"
      >
        <a-select-option
            v-for="(item, index) in productTypeData"
            :key="index"
            :value="item.id"
        >
          {{ item.planName }}
        </a-select-option>
      </a-select>
      <img
          src="@/assets/cptzj/img15.png"
          class="img15"
          alt=""
          @click="changeToPlan(listId)"
      />
    </div>
    <div class="centers">
      <div class="topOne">
        <div class="flexs">
          <div class="title motBottm">
            {{ t("carbon.message.CarbonNeutralTargetTime") }}
          </div>
          <div class="title1">
            {{ queryParam.carbonEmissionPlan.carbonNeutralYear
            }}{{ t("carbon.message.YearUnit") }}
          </div>
        </div>
        <div class="flexs">
          <div class="title motBottm">
            {{ t("carbon.message.TargetEmissionReduction") }}
          </div>
          <div class="title1">
            {{ queryParam.carbonEmissionPlan.baseYearCarbonEmissions }}tCO₂e
          </div>
        </div>
        <div>
          <div class="title motBottm">
            {{ t("carbon.message.CurrentReductionProgress") }}
          </div>
          <el-progress
              :text-inside="true"
              :stroke-width="20"
              :percentage="carBonseValue"
              color="#56C08D"
          ></el-progress>
        </div>
      </div>
      <div class="topTwo motBottm2">
        <div class="title2 motBottm2">
          {{ t("carbon.message.Base_year") }}：
          <span>{{ queryParam.carbonEmissionPlan.baseYear }}{{ t("carbon.message.YearUnit") }}</span>
        </div>
        <div class="flexs1 gaps">
          <div class="lefts">
            <div>
              <div class="title4 motBottm">
                {{ t("carbon.message.CarbonEmissionSituation") }}
              </div>
              <div class="title3">
                {{ queryParam.carbonEmissionPlan.baseYearCarbonEmissions }}
              </div>
            </div>
            <div>
              <div class="title4 motBottm">
                <span>{{ t("carbon.message.CarbonEmissionIntensityUnit") }}</span>
              </div>
              <div class="title3">
                {{ queryParam.carbonEmissionPlan.baseYearRevenueIntensity }}
              </div>
            </div>
          </div>
          <div class="rights">
            <div class="flexs1 " v-if="listArr.length > 0">
              <div class="title5" v-for="(item, index) in listArr" :key="index">
                {{ item.title.split('：')[0]  }}：<span>{{ item.childrenStandardValue }}tCO₂e</span>
              </div>
            </div>
            <div class="flexs1 motBottm1" v-if="listArr2.length > 0">
              <div
                  class="title5"
                  v-for="(item, index) in listArr2"
                  :key="index"
              >
                {{ item.title
                }}<span>{{ item.childrenStandardValue }}tCO₂e</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="concan motBottm2">
        <div class="table-page-search-wrapper">
          <a-form >
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item :label="t('carbon.message.StageTargetYear')">
                  <a-select
                      :placeholder="t('carbon.message.Please_select')"
                      show-search
                      :filter-option="filterOption"
                      style="width: 100%"
                      @change="updatestageListe"
                      v-model:value="stageYears"
                  >
                    <a-select-option
                        :value="item.stageYear"
                        v-for="(item, index) in queryParam.carbonEmissionPlan.stageList"
                        :key="index"
                    >
                      {{ item.stageYear }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6"></a-col>
              <a-col :span="6"></a-col>
              <a-col :span="6">
                <div class="text">
                  {{ t("carbon.message.ActualDataCurrentYear") }}
                </div>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="concanFlex">
          <div class="leftse">
            <div class="text1 motBottm3">
              {{ t("carbon.message.CarbonEmissionSituation") }}
            </div>
            <div class="flexs">
              <el-progress
                  :percentage="listArr3.targetYearCarbonEmissions >= listArr3.thisYearCarbonEmissions ? 100 : (listArr3.targetYearCarbonEmissions / listArr3.thisYearCarbonEmissions).toFixed(4) * 100"
                  :stroke-width="20"
                  :text-inside="true"
                  :format="() => progressFormat('目标:', listArr3.targetYearCarbonEmissions)"
                  text-color="#333333"
                  color="#56C08D"
                  class="motBottm2"
              ></el-progress>
              <el-progress
                  :percentage="listArr3.targetYearCarbonEmissions < listArr3.thisYearCarbonEmissions ? 100 : (listArr3.thisYearCarbonEmissions / listArr3.targetYearCarbonEmissions).toFixed(4) * 100"
                  :stroke-width="20"
                  :text-inside="true"
                  :format="() => progressFormat('实际:', listArr3.thisYearCarbonEmissions)"
                  text-color="#333333"
                  color="#DADADA"
                  class="motBottm2"
              ></el-progress>
            </div>
          </div>
          <div class="rightse">
            <div style="width: 100%; display: flex; flex-direction: row">
              <div style="width: 50%; text-align: center">实际</div>
              <div style="width: 50%; text-align: center">目标</div>
            </div>
            <div
                v-for="(item, index) in listArr3.stageCarbonEmissionScopeList"
                :key="index"
                class="wigths"
            >
              <div class="flexs1">
                <div class="progress-group reverse">
                  <el-progress
                      :percentage="item.thisYearChildrenStandardCarbonEmissions >= item.childrenStandardValue ? 100 : (item.thisYearChildrenStandardCarbonEmissions /item.childrenStandardValue) *100"
                      :stroke-width="20"
                      :text-inside="true"
                      :format="() => progressFormat('', item.thisYearChildrenStandardCarbonEmissions)"
                      text-color="#333333"
                      color="#DADADA"
                      class="reverseProgress"
                  ></el-progress>
                </div>
                <div class="progress-title">{{ item.title.split('：')[0] }}</div>
                <div class="progress-group">
                  <el-progress
                      :percentage="item.thisYearChildrenStandardCarbonEmissions < item.childrenStandardValue ? 100 : (item.childrenStandardValue /item.thisYearChildrenStandardCarbonEmissions) *100"
                      :stroke-width="20"
                      :text-inside="true"
                      :format="() => progressFormat('', item.childrenStandardValue)"
                      text-color="#333333"
                      color="#56C08D"
                  ></el-progress>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ofane motBottm1">
        <div class="text1 motBottm3">
          {{ t("carbon.message.CarbonEmissionIntensityUnit") }}
        </div>
        <div class="flexs">
          <el-progress
              :percentage="listArr3.targetYearRevenueIntensity >= listArr3.thisYearRevenueIntensity ? 100 : (listArr3.targetYearRevenueIntensity / listArr3.thisYearRevenueIntensity).toFixed(4) * 100"
              :stroke-width="20"
              :text-inside="true"
              :format="() => progressFormat('目标:', listArr3.targetYearRevenueIntensity)"
              text-color="#333333"
              color="#FFA504"
              class="motBottm2"
          ></el-progress>
          <el-progress
              :percentage="listArr3.targetYearRevenueIntensity < listArr3.thisYearRevenueIntensity ? 100 : (listArr3.thisYearRevenueIntensity / listArr3.targetYearRevenueIntensity).toFixed(4) * 100"
              :stroke-width="20"
              :text-inside="true"
              :format="() => progressFormat('实际:', listArr3.thisYearRevenueIntensity)"
              text-color="#333333"
              color="#DADADA"
              class="motBottm2"
          ></el-progress>
        </div>
      </div>
      <div class="concanBotom motBottm1">
        <div class="left">
          <div class="text1 motBottm2">
            {{ t("carbon.message.EmissionReductionProjects") }}
          </div>
          <div class="tosne motBottm2">
            {{ t("carbon.message.CarbonReductionProjects")
            }}<span style="color: #3056ee">{{
              listObj.reduceProgressResponse.projectNumber
            }}</span>
          </div>
          <div class="tosne motBottm2">
            {{ t("carbon.message.Completed")
            }}<span style="color: #148958">{{
              listObj.reduceProgressResponse.endProjectNumber
            }}</span>
          </div>
          <div class="tosne">
            {{ t("carbon.message.InProgress")
            }}<span style="color: #e37318">{{
              listObj.reduceProgressResponse.noEndProjectNumber
            }}</span>
          </div>
        </div>
        <div class="contentes">
          <div class="text1">
            {{ t("carbon.message.CarbonReductionAnalysis") }}
          </div>
          <div class="flexs2" style="justify-content: space-evenly">
            <div class="posje2">
              <div id="operating" ref="operatingChartRef"></div>
              <div class="postose">
                <div class="toaw">
                  {{ listObj.reduceProgressResponse.carbonReduceValue }}tCO₂e
                </div>
                <div class="toaw1">
                  {{ t("carbon.message.ExpectedCarbonReduction") }}
                </div>
              </div>
            </div>
          </div>
          <div class="flexs2" style="justify-content: space-evenly">
            <div class="yiwanc">
              <span class="bor"></span>{{ t("carbon.message.Completed") }}
            </div>
            <div class="yiwanc">
              <span class="bor1"></span>{{ t("carbon.message.Uncompleted") }}
            </div>
          </div>
        </div>
        <div class="contentes1">
          <div class="text1">
            {{ t("carbon.message.CarbonReductionProjectTypeDistribution") }}
          </div>
          <div class="flexs2" style="justify-content: center">
            <div class="posje2">
              <div id="CarbonReductionProject" ref="carbonReductionProjectChartRef"></div>
            </div>
          </div>
          <div class="flexs2" style="justify-content: center">
            <div
                class="yiwanc"
                v-for="(item, index) in listObj.carbonReduceTypePieResponse"
                :key="index"
            >
                  <span
                      class="bor"
                      :style="{ backgroundColor: colorArr[index] }"
                  ></span
                  >{{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="">
        <div class="text1 motBottm4">
          {{ t("carbon.message.CarbonReductionProjectCategoryTotal") }}
        </div>
        <a-table
            :columns="columns"
            :pagination="false"
            :data-source="data"
            :rowClassName="getRowClassname"
        >
        </a-table>
      </div>
    </div>
    <div class="bottons">
      <div class="text1 motBottm3">
        {{ t("carbon.message.AnnualDataAndTargetTrendChart(tCO₂e)") }}
      </div>
      <div id="lineQushi" ref="lineQushiChartRef"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useRouter } from 'vue-router';
import * as echarts from 'echarts';
import {
  getPlanList,
  getProjectScreen,
  queryDictItemsByCode,
  getPlanAndProjectScreen,
  getBottomScreen
} from './overview.api';
import { useMessage } from '/@/hooks/web/useMessage';

const { t } = useI18n();
const router = useRouter();
const { createMessage } = useMessage();

// refs
const operatingChartRef = ref<HTMLDivElement | null>(null);
const carbonReductionProjectChartRef = ref<HTMLDivElement | null>(null);
const lineQushiChartRef = ref<HTMLDivElement | null>(null);
let operatingChartInstance: echarts.ECharts | null = null;
let carbonReductionProjectChartInstance: echarts.ECharts | null = null;
let lineQushiChartInstance: echarts.ECharts | null = null;

// reactive data
const switchShow = ref(false);
const queryParam = reactive({
  carbonEmissionPlan: {
    planCarbonEmissionScopeList: [],
  },
  carbonReduceScreen: {},
});

const listArr = ref<any[]>([]);
const listArr2 = ref<any[]>([]);
const listArr3 = ref<any>({});
const listObj = reactive({
  reduceProgressResponse: {
    endProjectNumber: 0,
    noEndProjectNumber: 0,
    projectNumber: 0,
    carbonReduceValue: 0,
    endProjectCarbonReduceValue: 0,
    noEndProjectCarbonReduceValue: 0,
  },
});

const data = ref<any[]>([]);
const productTypeData = ref<any[]>([]);
const deptId = ref<string>('');
const listId = ref<string>('');
const stageYears = ref<number>(0);
const carBonseValue = ref<number>(0);
const IntensityValue = ref<number>(0);
const EmissionsValue = ref<number>(0);

const columns = ref([
  {
    title: t('carbon.message.StandardTitle'),
    dataIndex: 'childrenStandardName',
    key: 'childrenStandardName',
    align: 'center',
  },
]);

const colorArr = ['#1BC08A', '#81E0DB', '#FFC439', '#FF8C73', '#2C57FF'];

// lifecycle
onMounted(() => {
  getData();
  // 监听窗口大小变化，重新调整图表大小
  window.addEventListener('resize', resizeCharts);
});

// watch
watch(() => listObj.carbonReduceTypePieResponse, () => {
  nextTick(() => {
    CarbonReductionProject();
  });
}, { deep: true });

watch(() => listObj.reduceProgressResponse, () => {
  nextTick(() => {
    operatingCostAnalysis();
  });
}, { deep: true });

// methods
/**
 * 跳转到摊牌计划页面
 */
function toAddPlan() {
  let url = window._CONFIG['viewBaseUrl'] + '/module_neutrality/carbonEmissionPlan/CyCarbonEmissionPlanList';
  window.open(url, '_blank');
}

/**
 * 双进度条动态格式化方法
 * @param {string} type - 显示类型('目标'或'实际')
 * @param {number} value - 数值
 */
function progressFormat(text: string, value: number) {
  // 生成格式化文本
  return `${text} ${value}`;
}

/**
 * 跳转到碳排计划的详情页面
 * @param id
 */
function changeToPlan(id: string) {
  let path = '/neutrality/carbonEmissionPlan/CyCarbonEmissionPlanList';
  let query = { id: id };
  router.push({ path: path, query: query });
}

function getRowClassname(record: any, index: number) {
  console.log(record, index, ';getRowClassname');
  if (index % 2 == 0) {
    return 'data-rule-invalid';
  } else {
    return 'data-rule-invalid1';
  }
}

//阶段年份
function updatestageListe(e: any) {
  queryParam.carbonEmissionPlan.stageList.forEach((res) => {
    if (res.stageYear == e) {
      listArr3.value = res;
      projectScreen();
      carBonseEmissions();
      carBonseIntensity();
    }
  });
  console.log(listArr3.value);
}

//碳排强度
function carBonseIntensity() {
  IntensityValue.value =
      (listArr3.value.thisYearRevenueIntensity /
          listArr3.value.targetYearRevenueIntensity) *
      100;
}

//碳排情况
function carBonseEmissions() {
  EmissionsValue.value =
      (listArr3.value.thisYearCarbonEmissions /
          listArr3.value.targetYearCarbonEmissions) *
      100;
}

//当前减排进度
function carBonse() {
  if (queryParam.carbonEmissionPlan.thisYearCarbonEmissions == 0) {
    carBonseValue.value = 0;
  } else {
    carBonseValue.value = (
        (queryParam.carbonEmissionPlan.thisYearCarbonEmissions /
            queryParam.carbonEmissionPlan.baseYearCarbonEmissions) *
        100
    ).toFixed(2) as any * 1;
  }
}

//选择目标
function updateProvince(value: string) {
  //更换选择目标 需要把选中的 planDeptId 重新赋值给deptId
  console.log(value);
  productTypeData.value.forEach((c) => {
    if (c.id === value) {
      deptId.value = c.planDeptId;
    }
  });
  planAndProjectScreen();
}

async function getData() {
  try {
    const res = await getPlanList();
    if (res.success){
      productTypeData.value = res.result || [];
      if (res.result.length > 0) {
        listId.value = res.result[0].id;
        deptId.value = res.result[0].planDeptId;
        planAndProjectScreen();
        tableOpensd();
        operatingClineQushi();
      }
    }
  } catch (error) {
    console.error('Failed to get plan list:', error);
  }
}

//减碳管理-概览项目详情
async function projectScreen() {
  try {
    const res = await getProjectScreen({
      deptId: deptId.value,
      year: stageYears.value,
    });
    console.log(res, 'projectScreen');
    if (res.success) {
      nextTick(() => {
        Object.assign(listObj, res.result);
        data.value = res.result.carbonReduceStandardResponse;
        operatingCostAnalysis();
        CarbonReductionProject();
      });
    }
  } catch (error) {
    console.error('Failed to get project screen:', error);
  }
}

//表格数据
async function tableOpensd() {
  try {
    const res = await queryDictItemsByCode({
      code: 'project_carbon_reduce_type',
    });

    res.forEach((item: any, index: number) => {
      columns.value.push({
        title: item.text,
        dataIndex: item.value,
        key: item.value,
        align: 'center',
      });
    });
    console.log(columns.value);
  } catch (error) {
    console.error('Failed to get table data:', error);
  }
}

//获取详情
async function planAndProjectScreen() {
  try {
    const res = await getPlanAndProjectScreen({
      id: listId.value,
    });
    console.log(res, 'planAndProjectScreen');
    if (res.success) {
      nextTick(() => {
        Object.assign(queryParam, res.result);
        if (res.result.carbonEmissionPlan.stageList.length != 0) {
          listArr3.value = queryParam.carbonEmissionPlan.stageList[0];
          stageYears.value =queryParam.carbonEmissionPlan.stageList[0].stageYear;
          projectScreen();
        }
        console.log(listArr3.value, 'listArr3');
        console.log(listObj, 'listArr3');
        if (
            queryParam.carbonEmissionPlan.planCarbonEmissionScopeList
                .length >= 3
        ) {
          listArr.value =
              queryParam.carbonEmissionPlan.planCarbonEmissionScopeList.splice(
                  0,
                  3
              );
        }
        if (
            queryParam.carbonEmissionPlan.planCarbonEmissionScopeList.length > 3
        ) {
          listArr2.value =
              queryParam.carbonEmissionPlan.planCarbonEmissionScopeList.splice(
                  3,
                  6
              );
        }
        carBonse();
        carBonseEmissions();
        carBonseIntensity();
        operatingClineQushi();
      });
    }
  } catch (error) {
    console.error('Failed to get plan and project screen:', error);
  }
}

function CarbonReductionProject() {
  if (!carbonReductionProjectChartRef.value) return;

  if (carbonReductionProjectChartInstance) {
    carbonReductionProjectChartInstance.dispose();
  }

  carbonReductionProjectChartInstance = echarts.init(
      carbonReductionProjectChartRef.value
  );

  let arr: any[] = [];
  if (listObj.carbonReduceTypePieResponse) {
    listObj.carbonReduceTypePieResponse.forEach((res: any) => {
      arr.push({
        value: res.value,
        name: res.name,
      });
    });
  }

  let option = {
    color: colorArr,
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'pie',
        radius: '80%',
        data: arr,
        label: {
          show: true,
          position: 'outside',
          formatter: '{d}%',
        },
        labelLine: {
          show: true,
        },
      },
    ],
  };

  carbonReductionProjectChartInstance.setOption(option);
}

//减碳量 分析
function operatingCostAnalysis() {
  console.log(listObj, 'listObj');
  if (!operatingChartRef.value) return;

  if (operatingChartInstance) {
    operatingChartInstance.dispose();
  }

  operatingChartInstance = echarts.init(
      operatingChartRef.value
  );

  let option = {
    color: ['#1BC08A', '#D5FCFA', '#20E6A4', '#F76666', '#07D1FA'],
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'outside',
          formatter: '{d}%',
        },
        data: [
          {
            value:
            listObj.reduceProgressResponse
                .endProjectCarbonReduceValue,
            name: '已完成',
          },
          {
            value:
            listObj.reduceProgressResponse
                .noEndProjectCarbonReduceValue,
            name: '未完成',
          },
        ],
      },
    ],
  };

  operatingChartInstance.setOption(option);
}

//年度数据与目标趋势
async function operatingClineQushi() {
  console.log(lineQushiChartRef.value,'operatingClineQushi');
  if (!lineQushiChartRef.value) return;

  try {
    const res = await getBottomScreen({ id: listId.value });
    console.log(res,'operatingClineQushi');
    if (res.success) {
      console.log(lineQushiChartInstance,'lineQushiChartInstance');
      if (lineQushiChartInstance) {
        lineQushiChartInstance.dispose();
      }

      lineQushiChartInstance = echarts.init(
          lineQushiChartRef.value
      );

      let valueLists: any[] = [];
      let legendList: any[] = [];

      res.result.valueList.forEach((item: any) => {
        item.type = 'line';
        item.stack = 'Total';
        item.data = item.values;
        if (item.name == '减排后预期值') {
          item.areaStyle = {
            color: 'RGBA(252, 255, 225, 1)',
          };
        }
        valueLists.push(item);
        legendList.push(item.name);
      });

      valueLists[0].markLine = {
        data: [
          {
            yAxis:
            queryParam.carbonEmissionPlan.baseYearCarbonEmissions,
            lineStyle: {
              color: '#CF0D66',
              type: 'dotted',
              width: 2,
            },
            label: {
              show: true,
              position: 'end',
              formatter: '{c}',
            },
          },
        ],
      };

      console.log(valueLists);
      let option = {
        title: {
          subtext: '单位：tCO₂e',
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params: any[]) {
            var html: string[] = [];
            params.forEach(function (param: any) {
              html.push(`<div style="min-width:208px">
                                <p style="padding:2px 0;display: flex;justify-content: space-between;align-items: center;">
                                    <span style="display: flex;align-items: center;">
                                    <i style="display:inline-block;
                                    border-radius:50%;width:4px;height:4px;background-color: ${param.color};margin-right:6px;"></i>
                                    ${param.seriesName}:</span>
                                    <span >
                                    ${param.value}
                                    </span>
                                </p>
                            </div'<br/>`);
            });
            html.push(`<div style="min-width:208px">
                                <p style="padding:2px 0;display: flex;justify-content: space-between;align-items: center;">
                                    <span style="display: flex;align-items: center;">
                                    <i style="display:inline-block;width:8px;height:4px;background-color: red;margin-right:6px;"></i>
                                    基准线:</span>
                                    <span >
                                    ${queryParam.carbonEmissionPlan.baseYearCarbonEmissions}
                                    </span>
                                </p>
                            </div'<br/>`);
            return html.join('');
          },
        },
        legend: {
          right: 20,
          data: legendList,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: res.xvalue,
        },
        yAxis: {
          type: 'value',
        },
        series: valueLists,
      };

      lineQushiChartInstance.setOption(option);
    }
  } catch (error) {
    console.error('Failed to get bottom screen data:', error);
  }
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

/**
 * 重新调整图表大小
 */
function resizeCharts() {
  if (operatingChartInstance) {
    operatingChartInstance.resize();
  }
  if (carbonReductionProjectChartInstance) {
    carbonReductionProjectChartInstance.resize();
  }
  if (lineQushiChartInstance) {
    lineQushiChartInstance.resize();
  }
}

/**
 * 组件销毁前清理资源
 */
// onUnmounted(() => {
//   window.removeEventListener('resize', resizeCharts);
//   if (operatingChartInstance) {
//     operatingChartInstance.dispose();
//   }
//   if (carbonReductionProjectChartInstance) {
//     carbonReductionProjectChartInstance.dispose();
//   }
//   if (lineQushiChartInstance) {
//     lineQushiChartInstance.dispose();
//   }
// });
</script>

<style lang="less" scoped>
#lineQushi {
  width: 100%;
  height: 500px;
}

.bottons {
  padding: 24px;
  background: #fff;
}

:deep(.data-rule-invalid) {
  background: #f4f4f4;
}

.psoqe {
  position: relative;
  z-index: 9;
}

.posje2 {
  position: relative;
}

.postose {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.toaw {
  font-weight: 600;
  font-size: 18px;
  color: #2b3674;
}

.toaw1 {
  font-weight: 400;
  font-size: 14px;
  color: #777777;
}

#CarbonReductionProject {
  width: 300px;
  height: 300px;
}

#operating {
  width: 300px;
  height: 300px;
}

.concanBotom {
  display: flex;
  align-items: center;
  gap: 24px;
  height: 368px;

  .contentes1 {
    background: rgba(250, 222, 208, 0.3);
    padding: 24px 0px 24px 22px;
    flex: auto;
    border-radius: 2px 2px 2px 2px;

    .yiwanc {
      font-weight: 400;
      font-size: 12px;
      color: #777777;
      display: flex;
      align-items: center;
      margin-left: 10px;

      span {
        font-weight: 500;
        font-size: 16px;
        color: #2b7450;
        margin: 0 4px;
      }
    }

    .bor {
      width: 7px;
      height: 7px;
      background: #1bc08a;
      border-radius: 50%;
    }
  }

  .contentes {
    background: rgba(227, 249, 233, 0.3);
    padding: 24px;
    flex: auto;

    border-radius: 2px 2px 2px 2px;

    .yiwanc {
      font-weight: 400;
      font-size: 12px;
      display: flex;
      align-items: center;
      color: #1c212b;

      span {
        font-weight: 500;
        font-size: 16px;
        color: #3e3e41;
        margin: 0 4px;
      }
    }

    .bor {
      width: 7px;
      height: 7px;
      background: #1bc08a;
      border-radius: 1px 1px 1px 1px;
    }

    .bor1 {
      width: 7px;
      height: 7px;
      background: #d5fcfa;
      border-radius: 1px 1px 1px 1px;
    }
  }

  .left {
    min-width: 230px;
    flex: auto;
    padding: 24px;
    background: #d6ddff;
    border-radius: 2px;
  }

  .tosne {
    font-weight: 400;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.6);
    background: #e6e9f8;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      font-weight: bold;
      font-size: 34px;
    }
  }
}

.ofane {
  padding: 16px 24px;
  flex: 1;
  height: 188px;
  margin-top: 24px;
  background: #fbfbfb;

  :deep(.el-progress) {
    width: 80%;
  }

  :deep(.el-progress-bar__outer) {
    width: 100%;
    background-color: #fbfbfb !important;
  }

  .fleGap {
    display: flex;
    align-items: center;
    gap: 53px;
  }
}

.concanFlex {
  display: flex;
  align-items: center;
  gap: 24px;

  .leftse {
    padding: 16px 24px;
    flex: 1;
    height: 238px;
    background: #fbfbfb;

    :deep(.el-progress) {
      width: 80%;
    }

    :deep(.el-progress-bar__outer) {
      width: 100%;
      background-color: #FBFBFB !important;
    }

    .fleGap {
      display: flex;
      align-items: center;
      gap: 53px;
    }
  }

  .rightse {
    padding: 16px 24px;
    flex: 1;
    height: 238px;
    background: #fbfbfb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    row-gap: 24px;
    column-gap: 34px;

    :deep(.el-progress) {
      width: 100%;
    }

    :deep(.el-progress-bar__outer) {
      background-color: #FBFBFB !important;
    }

    .wigths {
      width: 100%;
    }

    .progress-group {
      display: flex;
      width: 100%;
      flex-direction: column;
      align-items: center;
      margin-left: 10px;
      margin-right: 10px;
    }

    .progress-title {
      white-space: nowrap;
    }

    .fleGap {
      display: flex;
      align-items: center;
      gap: 23px;
    }
  }
}

.reverse {
  :deep(.el-progress) {
    transform: scaleX(-1);
  }

  :deep(.el-progress-bar__innerText) {
    transform: scaleX(-1);
  }
}

.bordrtr {
  width: 7px;
  height: 7px;
  background: #148958;
  margin-right: 8px;
  border-radius: 1px 1px 1px 1px;
}

.bordrtr1 {
  width: 7px;
  height: 7px;
  background: #f0f0f0;
  margin-right: 8px;
  border-radius: 1px 1px 1px 1px;
}

.text {
  font-weight: 400;
  font-size: 12px;
  color: #888888;
  text-align: right;
}

.text1 {
  font-weight: 400;
  font-size: 16px;
  color: #333333;
}

.text2 {
  font-weight: 400;
  font-size: 12px;
  color: #1c212b;

  span {
    font-weight: 500;
    font-size: 16px;
    color: #3e3e41;
  }
}

.gaps {
  gap: 24px;
}

.tablse {
  background: #fff;
  padding: 9px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 999999;
  margin-top: 16px;
  margin-right: 24px;
  margin-left: 24px;
}

.concan {
  padding: 24px;
  background: #fff;
}

.centers {
  padding: 24px;
}

.img15 {
  width: 20px;
  height: 20px;
}

.lefts {
  background: #fbfbfb;
  padding: 24px;
  display: flex;
  width: 40%;
  justify-content: space-between;
  align-items: center;
}

.rights {
  background: #fbfbfb;
  padding: 24px;
  flex: 1;
  height: 137px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.topTwo {
  padding: 24px;
  background: #fff;
  margin-top: 24px;
}

.title4 {
  font-weight: 400;
  font-size: 16px;
  color: #333333;
}

.title5 {
  font-weight: 400;
  font-size: 16px;
  color: #888888;

  span {
    font-weight: 400;
    font-size: 16px !important;
    color: #333333 !important;
  }
}

.title3 {
  font-weight: 600;
  font-size: 38px;
  color: @primary-color;

  span {
    font-weight: 400;
    font-size: 14px !important;
    color: #333333 !important;
  }
}

.title2 {
  font-weight: 400;
  font-size: 14px;
  color: #888888;

  span {
    font-weight: 400;
    font-size: 18px !important;
    color: #333333 !important;
  }
}

.topOne {
  background: #fff;
  padding: 24px 124px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  :deep(.el-progress-bar__outer) {
    width: 587px;
  }
}

.motBottm {
  margin-bottom: 8px;
}

.motBottm1 {
  margin-bottom: 41px;
}

.motBottm11 {
  margin-top: 41px;
}

.motBottm2 {
  margin-bottom: 24px;
}

.motBottm3 {
  margin-bottom: 59px;
}

.motBottm4 {
  margin-bottom: 12px;
}

.motRight {
  margin-right: 24px;
}

.title {
  font-weight: 400;
  font-size: 14px;
  color: #888888;
}

.title1 {
  font-weight: 500;
  font-size: 18px;
  color: @primary-color;
}

.flexs {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.flexs1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flexs2 {
  display: flex;
  align-items: center;
}
</style>
