<template>
  <div class="energyConsumptionAnalysis">
    <div class="topBox">
      <div class="title marBottom"> 用能消费分析 </div>
      <div class="flex ">
        <a-form :model="queryParam" style="width: 100%;">
          <a-row :gutter="28">
            <a-col :span="4.5">
              <a-form-item label="用能场站">
                <select-station-no-clear style="width: 200px" v-model:value="queryParam.stationId"></select-station-no-clear>
              </a-form-item>
            </a-col>
            <a-col :span="4.5">
              <a-form-item label="用能分组">
                <select-group-no-clear
                  :stationId="queryParam.stationId"
                  v-model:value="queryParam.groupId"
                  style="width: 200px"
                ></select-group-no-clear>
              </a-form-item>
            </a-col>
            <a-col :span="4.5">
              <a-form-item label="时间维度">
                <a-select ref="select" v-model:value="queryParam.type" @change="changeType" style="width: 200px" placeholder="请选择">
                  <a-select-option value="2">按年</a-select-option>
                  <a-select-option value="1">按月</a-select-option>
                  <a-select-option value="0">按日</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="4.5">
              <a-form-item label="基准期">
                <a-date-picker
                  v-model:value="queryParam.baseEnergyDate"
                  v-if="queryParam.type == '0' || queryParam.type == null"
                  style="width: 200px"
                  placeholder="请选择"
                  valueFormat="YYYY-MM-DD"
                />
                <a-date-picker
                  v-model:value="queryParam.baseEnergyDate"
                  v-if="queryParam.type == '2'"
                  picker="year"
                  style="width: 200px"
                  placeholder="请选择"
                  valueFormat="YYYY"
                />
                <a-date-picker
                  v-model:value="queryParam.baseEnergyDate"
                  v-if="queryParam.type == '1'"
                  picker="month"
                  style="width: 200px"
                  placeholder="请选择"
                  valueFormat="YYYY-MM"
                />
              </a-form-item>
            </a-col>
            <a-col :span="4.5">
              <a-form-item label="统计期">
                <a-date-picker
                  v-model:value="queryParam.statisticalDate"
                  v-if="queryParam.type == '0' || queryParam.type == null"
                  style="width: 200px"
                  placeholder="请选择"
                  valueFormat="YYYY-MM-DD"
                />
                <a-date-picker
                  v-model:value="queryParam.statisticalDate"
                  v-if="queryParam.type == '2'"
                  picker="year"
                  style="width: 200px"
                  placeholder="请选择"
                  valueFormat="YYYY"
                />
                <a-date-picker
                  v-model:value="queryParam.statisticalDate"
                  v-if="queryParam.type == '1'"
                  picker="month"
                  style="width: 200px"
                  placeholder="请选择"
                  valueFormat="YYYY-MM"
                />
              </a-form-item>
            </a-col>
            <a-col :span="2">
              <a-form-item label="" style="">
                <div style="width: 100%; display: flex; gap: 24px">
                  <a-button type="primary" @click="onHandleAdd">查询</a-button>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>

    <div class="indicatorTypeBox" v-if="isAssigned">
      <div class="arrow arrow-left" @click="scrollLeft">
        <a-icon type="left" />
      </div>
      <div ref="indicatorContent" class="indicatorContent">
        <div class="indicatorTypeInner backgrouund" style="justify-content: space-around" v-for="(item, index) in cumulativeList" :key="index">
          <div class="flex">
            <div class="w-100" style="text-align: center">
              <div class="font-bold">{{ item.indicatorName }}({{index>0?item.indicatorUnit:'kgce'}})</div>
              <div class="total">{{ item.countValue }}</div>
            </div>
            <div class="verticalLine"></div>
            <div class="w-100">
              <div class="flex marBootom" style="justify-content: space-around">
                <div style="flex:1;display: flex;justify-content: center">同比</div>
                <div style="flex:1;display: flex;justify-content: center">
                  <Icon style="color: #f5222d" icon="ant-design:caret-up-outlined" v-if="item.samePeriodRateValue > 0" />
                  <Icon style="color: #52c41a" icon="ant-design:caret-down-outlined" v-if="item.samePeriodRateValue < 0" />
                  {{ item.samePeriodRateValue }}%</div
                >
              </div>
              <div class="flex" style="justify-content: space-around">
                <div style="flex:1;display: flex;justify-content: center">环比</div>
                <div style="flex:1;display: flex;justify-content: center">
                  <Icon style="color: #f5222d" icon="ant-design:caret-up-outlined" v-if="item.rateValue > 0" />
                  <Icon style="color: #52c41a" icon="ant-design:caret-down-outlined" v-if="item.rateValue < 0" />

                  {{ item.rateValue }}%</div
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

    <div class="zhibiao1 marBootom" v-if="isAssigned">
      <div class="flex borderBottom">
        <div class="textf"
          >用能分析
          <a-tooltip>
            <template #title>用能消费，所有能源类型统一为折标煤进行统计</template>
            <Icon icon="ant-design:question-circle-outlined" />
          </a-tooltip>
        </div>
        <div class="flex gap">
          <a-select ref="select" v-model:value="value1" style="width: 120px" @change="handleChange">
            <a-select-option value="1">能源类型</a-select-option>
            <a-select-option value="2">子分组</a-select-option>
          </a-select>
        </div>
      </div>
      <div class="flex gap padding-24" v-if="value1 == 1 || (value1 == '2' && consumeObj.groupEnergyUsagePieChart.length > 0)">
        <div id="Analysisbar" v-show="value1 == 1"></div>
        <div id="AnalysisbarTwos" v-show="value1 == 2"></div>
        <div class="post" style="justify-content: space-around">
          <div id="Analysispie"></div>
          <div class="postAbsout">
            <div class="postTitle">总消耗(kgce)</div>
            <div class="postTitle1">{{ totalEnergyConsume }} </div>
          </div>
          <!-- value1.value == 1 ? res.energyUsagePieChart : res.groupEnergyUsagePieChart -->
          <div v-if="value1 == '1'">
            <div v-for="(item, index) in consumeObj.energyUsagePieChart" :key="index" style="margin-bottom: 3px" class="flex gap">
              <div class="brders" :style="{ backgroundColor: colorArr[index % colorArr.length] }"></div>
              <div style="width: 60px">{{ item.name }}</div>
              <div>|</div>
              <div style="width: 80px"> {{ item.value }}</div>
            </div>
          </div>
          <div v-if="value1 == '2'">
            <div v-for="(item, index) in consumeObj.groupEnergyUsagePieChart" :key="index" style="margin-bottom: 3px" class="flex gap">
              <div class="brders" :style="{ backgroundColor: colorArr[index % colorArr.length] }"></div>
              <div style="width: 60px">{{ item.name }}</div>
              <div>|</div>
              <div style="width: 80px"> {{ item.value }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <a-result status="404" title="暂无数据" sub-title="当前分组没有子分组"> </a-result>
      </div>
    </div>

    <div class="antsonow" v-if="isAssigned">
      <a-tabs v-model:activeKey="activeKey" @change="handleTabsChange">
        <a-tab-pane v-for="item in energtType" :key="item.value" :tab="item.label"></a-tab-pane>
      </a-tabs>
      <div class="zhibiao marBootom">
        <div class="flex borderBottom">
          <div class="textf">能耗对比 </div>
        </div>
        <div class="flex gap padding-24px">
          <div class="timeBox borderFlex">
            <div class="imgs">
              <img src="@/assets/images/zdz.png" alt="" />
            </div>
            <div>
              <div class="title">最大值</div>
              <div class="title2">{{ listObjs.max }}</div>
            </div>
          </div>
          <div class="timeBox borderFlex">
            <div class="imgs">
              <img src="@/assets/images/zxz.png" alt="" />
            </div>
            <div>
              <div class="title">最小值</div>
              <div class="title2">{{ listObjs.min }}</div>
            </div>
          </div>
          <div class="timeBox borderFlex">
            <div class="imgs">
              <img src="@/assets/images/pjs.png" alt="" />
            </div>
            <div>
              <div class="title">平均值</div>
              <div class="title2">{{ listObjs.avg }}</div>
            </div>
          </div>
          <div class="timeBox borderFlex">
            <div class="imgs">
              <img src="@/assets/images/zws.png" alt="" />
            </div>
            <div>
              <div class="title">中位数</div>
              <div class="title2">{{ listObjs.median }}</div>
            </div>
          </div>
        </div>
        <div class="flex padding-24px1" style="gap: 128px">
          <div>
            <div class="title3 nowrap">基准期_{{ texts }}{{ texts == '电' ? '（kwh）' : texts == '水' ? '（t）' : 'm³' }}</div>
            <div class="title2 marBootom">{{ listObjs.baseEnergyConsume }}</div>
            <div class="title3 nowrap">统计期_{{ texts }}{{ texts == '电' ? '（kwh）' : texts == '水' ? '（t）' : 'm³' }}</div>
            <div class="title2 marBootom">{{ listObjs.energyUse }}</div>
            <div class="title3">增长率</div>
            <div class="title2 flex gap">
              <Icon style="color: #f5222d" icon="ant-design:caret-up-outlined" v-if="listObjs.growth > 0" />
              <Icon style="color: #52c41a" icon="ant-design:caret-down-outlined" v-if="listObjs.growth < 0" />{{ listObjs.growth }}%</div
            >
          </div>
          <div id="consumptionCurve"></div>
        </div>
      </div>
    </div>

    <div class="timeBox marBootom" v-if="isAssigned">
      <div class="zhibiao1" style="flex: 1; margin-right: 0">
        <div class="flex borderBottom">
          <div class="textf">子分组占比 </div>
        </div>
        <div class="post w-100" v-if="listObjs.subGroupRatio.length > 0">
          <div id="proportionOf"></div>
          <div class="postAbsout2">
            <div class="postTitle">{{ texts }}（kwh）</div>
            <div class="postTitle1">{{ listObjs.energyUse }} </div>
          </div>
          <div>
            <div v-for="(item, index) in listObjs.subGroupRatio" :key="index" style="margin-bottom: 3px" class="flex gap">
              <div class="brders" :style="{ backgroundColor: colorArr[index % colorArr.length] }"></div>
              <div style="width: 80px">{{ item.name }}</div>
              <div>|</div>
              <div style="width: 80px"> {{ item.value }}</div>
            </div>
          </div>
        </div>
        <div v-else>
          <a-result status="404" title="暂无数据" sub-title="当前分组没有子分组"> </a-result>
        </div>
      </div>
      <div class="zhibiao1" style="flex: 1; margin-left: 0">
        <div class="flex borderBottom">
          <div class="textf">用能设备排行榜 </div>
        </div>
        <div style="padding: 24px">
          <a-table :columns="columns" :data-source="listObjs.deviceRank" :pagination="ipagination" @change="handleTableChange"> </a-table>
        </div>
      </div>
    </div>

    <div class="zhibiao marBootom marginSer" v-if="listObjs.rateType == 1 && isAssigned">
      <div class="flex borderBottom">
        <div class="textf">分时用能 </div>
      </div>
      <div class="padding-24px">
        <div id="timeConsumption"></div>
      </div>
    </div>

    <div class="timeBox marBootom" v-if="isAssigned && listObjs.rateType == 1">
      <div class="zhibiao1" style="flex: 1; margin-right: 0" v-if="listObjs.rateType != 3">
        <div class="flex borderBottom">
          <div class="textf">用能占比 </div>
        </div>
        <div class="flex paddingDssde juSCpace" v-if="listObjs.timeEnergyRatio.length > 0">
          <div class="boxShouw padding-24" style="min-width: 120px" v-for="(item, index) in listObjs.timeEnergyRatio" :key="index">
            <div class="textf marBootom1"> {{ item.name }}时段 </div>
            <div class="textf"> {{ item.value }}kwh </div>
            <div
              class="total"
              style="background: transparent"
              :class="{ color: index == 0, color1: index == 1, color2: index == 2, color3: index == 3, color14: index == 4 }"
            >
              {{ item.percent }}%
            </div>
          </div>
        </div>
        <div class="flex paddingDssde" style="height: 32px" v-if="listObjs.timeEnergyRatio.length > 0">
          <div
            style="height: 32px"
            :class="{
              color: index == 0,
              color1: index == 1,
              color2: index == 2,
              color3: index == 3,
              color14: index == 4,
              borderRadiun: index == 0,
              borderRadiun1: index == listObjs.timeEnergyRatio.length - 1,
            }"
            :style="{ width: item.percent + '%' }"
            v-for="(item, index) in listObjs.timeEnergyRatio"
            :key="index"
          ></div>
        </div>
        <div v-else>
          <a-result status="404" title="暂无数据" sub-title=""> </a-result>
        </div>
      </div>
      <div class="zhibiao1" style="flex: 1" :style="{ 'margin-left': listObjs.rateType != 3 ? '0' : '24px' }">
        <div class="flex borderBottom">
          <div class="textf"
            >用能负荷率
            <a-tooltip>
              <template #title>用能负荷率 = 小时平均负荷 ÷ 最大小时平均负荷 × 100%，</template>
              <Icon icon="ant-design:question-circle-outlined" /> </a-tooltip
          ></div>
        </div>
        <div class="paddingDssde">
          <div id="electricityLoadRate"></div>
        </div>
      </div>
    </div>
    <div class="timeBox marBootom" v-if="isAssigned && listObjs.rateType == 2">
      <div class="zhibiao1" style="flex: 1; margin-right: 0" v-if="listObjs.rateType != 3">
        <div class="flex borderBottom">
          <div class="textf">用能占比 </div>
        </div>
        <div class="flex paddingDssde juSCpace" v-if="listObjs.ladderRate.length > 0">
          <div class="boxShouw padding-24" style="min-width: 120px" v-for="(item, index) in listObjs.ladderRate" :key="index">
            <div class="textf marBootom1"> {{ item.name }}时段 </div>
            <div class="textf"> {{ item.value }}kwh </div>
            <div
              class="total"
              style="background: transparent"
              :class="{ color: index == 0, color1: index == 1, color2: index == 3, color3: index == 2, color14: index == 4 }"
            >
              {{ item.percent }}%
            </div>
          </div>
        </div>
        <div class="flex paddingDssde" style="height: 32px" v-if="listObjs.ladderRate.length > 0">
          <div
            style="height: 32px"
            :class="{
              color: index == 0,
              color1: index == 1,
              color2: index == 3,
              color3: index == 2,
              color14: index == 4,
              borderRadiun: index == 0,
              borderRadiun1: index == listObjs.ladderRate.length - 1,
            }"
            :style="{ width: item.percent + '%' }"
            v-for="(item, index) in listObjs.ladderRate"
            :key="index"
            ladderRate
          ></div>
        </div>
        <div v-else>
          <a-result status="404" title="暂无数据" sub-title=""> </a-result>
        </div>
      </div>
      <div class="zhibiao1" style="flex: 1" :style="{ 'margin-left': listObjs.rateType != 3 ? '0' : '24px' }">
        <div class="flex borderBottom">
          <div class="textf"
            >用能负荷率
            <a-tooltip>
              <template #title>用能负荷率 = 小时平均负荷 ÷ 最大小时平均负荷 × 100%，反映用能在时间维度上的集中程度及负荷稳定性</template>
              <Icon icon="ant-design:question-circle-outlined" /> </a-tooltip
          ></div>
        </div>
        <div class="paddingDssde">
          <div id="electricityLoadRate"></div>
        </div>
      </div>
    </div>
    <div v-if="!isAssigned">
      <a-result status="404" title="暂无数据" sub-title="请输入查询条件进行查询"> </a-result>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted, reactive, ref, nextTick } from 'vue';
import * as echarts from 'echarts';
import SelectStationNoClear from '@/components/station/SelectStationNoClear.vue';
import SelectGroupNoClear from '@/components/group/SelectGroupNoClear.vue';
import { initDictOptions } from '/@/utils/dict';
import { useMessage } from '/@/hooks/web/useMessage';
import { defHttp } from '/@/utils/http/axios';
import { useRouter, useRoute } from 'vue-router';
import { constant } from 'lodash-es';
const isAssigned = ref(false);

const queryParam = ref({
  stationId: null,
  groupId: null,
  statisticalDate: '',
  type: null,
  baseEnergyDate: '',
  statisticsType: 1,
});
const activeKey = ref('1');
const indicatorContent = ref(null);
const indicatorTypeList = ref([123, 123, 123, 123, 123, 123]); // 指标类型列表
const ipagination = ref({
  current: 1,
  pageSize: 5,
  pageSizeOptions: ['5', '10', '15'],
  showTotal: (total: number, range: number[]) => {
    return range[0] + '-' + range[1] + ' 共' + total + '条';
  },
  showQuickJumper: true,
  showSizeChanger: true,
  total: 0,
});
const value1 = ref('1');
const colorArr = ref(['#F04864', '#FACC14', '#2FC25B', '#1890FF', '#8543E0', '#13C2C2']);
const columns = ref([
  {
    title: '排名',
    dataIndex: 'indexs',
    align: 'center',
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '用电量(kwh)',
    dataIndex: 'value',
    align: 'center',
  },
]);
const { createMessage } = useMessage();

const totalEnergyConsume = ref(0);
const cumulativeList = ref([]); //累计消耗
const energtType = ref([]); //能源类型
const dataSource = ref([]);

const listObjs = ref({
  rateType: 1,
  deviceRank: [],
  subGroupRatio: [],
  timeEnergyRatio:[]
}); // 能源数据

const consumeObj = ref({});
const texts = ref('');
const AnalysisbarEach = ref(null); //用能分析-柱状图
const AnalysispieEach = ref(null); //用能分析-饼图
const consumptionCurveEach = ref(null); //能耗曲线
const electricityLoadRateEach = ref(''); //用能负荷率
const timeConsumptionEach = ref(null); //分时用电柱状图
const proportionOfEach = ref(null); //子分组占比饼状图

function handleTableChange(pagination) {
  console.log(pagination);
  (ipagination.value.current = pagination.current),
    (ipagination.value.pageSize = pagination.pageSize),
    (ipagination.value.pageSizeOptions = pagination.pageSizeOptions),
    (ipagination.value.showTotal = (total: number, range: number[]) => {
      return range[0] + '-' + range[1] + ' 共' + total + '条';
    }),
    (ipagination.value.showQuickJumper = pagination.showQuickJumper),
    (ipagination.value.showSizeChanger = pagination.showSizeChanger),
    (ipagination.value.total = pagination.total);
}

//查询
function onHandleAdd() {
  console.log(queryParam.value, 'onHandleAdd');
  if (!queryParam.value.stationId) {
    createMessage.error('请选择用能场站');
    return;
  }
  if (!queryParam.value.groupId) {
    createMessage.error('请选择用能分组');
    return;
  }
  if (!queryParam.value.type) {
    createMessage.error('请选择时间维度');
    return;
  }
  if (!queryParam.value.statisticalDate) {
    createMessage.error('请选择统计期');
    return;
  }
  cumulativeList.value = [];
  if (AnalysisbarEach.value != null) {
    AnalysisbarEach.value.dispose();
  }
  if (AnalysispieEach.value != null) {
    AnalysispieEach.value.dispose();
  }
  if (consumptionCurveEach.value != null) {
    consumptionCurveEach.value.dispose();
  }
  if (proportionOfEach.value != null) {
    proportionOfEach.value.dispose();
  }
  if (timeConsumptionEach.value != null) {
    timeConsumptionEach.value.dispose();
  }
  // if (electricityLoadRateEach.value) {
  //   electricityLoadRateEach.value.dispose();
  // }
  initDictOptionsValue();
  value1.value = '1';
  defHttp.get({ url: '/cyEnergyConsumeStatistics/consumeStatistics', params: queryParam.value }).then((res) => {
    if (res) {
      isAssigned.value = true;
      console.log(res);
      consumeObj.value = res;
      totalEnergyConsume.value = res.totalEnergyConsume;
      cumulativeList.value.push({
        indicatorName: '累计能耗',
        countValue: res.totalEnergyConsume,
        rateValue: res.totalEnergyConsumeHb,
        samePeriodRateValue: res.totalEnergyConsumeTb,
      });
      defHttp
        .get({
          url: '/cyEnergyStatistics/getAnalysisIndicatorBoxList',
          params: {
            stationId: queryParam.value.stationId,
            groupId: queryParam.value.groupId,
            countTimeType: queryParam.value.type,
            basePeriodTime: queryParam.value.baseEnergyDate,
          },
        })
        .then((res) => {
          if (res) {
            console.log(res);
            cumulativeList.value = cumulativeList.value.concat(res);
            nextTick(() => {
              getDataByMonthType(consumeObj.value);
              getAnalysispie(consumeObj.value);
            });
          }
        });
    }
  });
}
//上班部分
function handleChange() {
  // AnalysisbarEach.value.dispose();
  AnalysispieEach.value.dispose();
  console.log(value1.value, 'handleChange');
  nextTick(() => {
    getDataByMonthType(consumeObj.value);
    getDataByMonthTypeTwo(consumeObj.value);
    getAnalysispie(consumeObj.value);
  });
}

//下半部分
function consumeStatisticsValue() {
  defHttp
    .get({
      url: '/cyEnergyConsumeStatistics/consumeStatistics1',
      params: {
        ...queryParam.value,
        energyType: activeKey.value,
      },
    })
    .then((res) => {
      if (res) {
        isAssigned.value = true;
        console.log(res);
        listObjs.value = res;
        listObjs.value.deviceRank.forEach((item, index) => {
          item.indexs = index + 1;
        });
        ipagination.value.total = listObjs.value.deviceRank.length;
        nextTick(() => {
          getConsumptionCurve(res);
          if (listObjs.value.rateType == 1) {
            timeConsumption(res);
          }
          electricityLoadRate(res);
          getProportionOf(res);
        });
      }
    });
}

//获取能源类型
function initDictOptionsValue() {
  defHttp
    .get({
      url: `/cyStation/queryEnergyTypeById?id=${queryParam.value.stationId}`,
    })
    .then((res) => {
      if (res) {
        energtType.value = res;
        texts.value = res[0].label;
        activeKey.value = res[0].value;
        consumeStatisticsValue();
        console.log(energtType.value, activeKey.value, 'initDictOptionsValue');
      }
    });
}

function changeType() {
  queryParam.value.statisticalDate = '';
  queryParam.value.baseEnergyDate = '';
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
  console.log(Object.keys(useRoute().query));
  if (Object.keys(useRoute().query).length > 0) {
    if (useRoute().query.type) {
      queryParam.value.type = useRoute().query.type;
    }
    if (useRoute().query.baseEnergyDate) {
      queryParam.value.baseEnergyDate = useRoute().query.baseEnergyDate;
      queryParam.value.statisticalDate = useRoute().query.baseEnergyDate;
    }
    if (useRoute().query.stationId) {
      queryParam.value.stationId = useRoute().query.stationId;
    }
    if (useRoute().query.groupId) {
      queryParam.value.groupId = useRoute().query.groupId;
    }
    onHandleAdd();
  }
});

/**
 *tabs切换
 */
function handleTabsChange(key) {
  console.log(key, energtType.value);

  if (consumptionCurveEach.value != null) {
    consumptionCurveEach.value.dispose();
  }
  if (proportionOfEach.value != null) {
    proportionOfEach.value.dispose();
  }
  if (timeConsumptionEach.value != null) {
    timeConsumptionEach.value.dispose();
  }

  let index = energtType.value.findIndex((item) => item.value == key);
  texts.value = energtType.value[index].label;
  console.log(texts.value, 'handleTabsChange');
  if(texts.value == '电'){
    columns.value[2].title = '用电量（kwh）';
  }else if(texts.value == '水'){
    columns.value[2].title = '用水量（t）';
  }else{
    columns.value[2].title = '用气量（m³）';

  }
  consumeStatisticsValue();
}

/**
 *能源类型分享柱状图
 */
function getDataByMonthType(res) {
  console.log(res, value1, 'getDataByMonthType');
  if (res.energyUsageBarChartY.length > 0) {
    res.energyUsageBarChartY.forEach((item) => {
      item.type = 'bar';
    });
  }
  let AnalysisbarEach = echarts.init(document.getElementById('Analysisbar'));
  let optionPie = {
    color: colorArr.value,
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
      bottom: '6%',
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
      data: res.energyUsageBarChartX,
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
    },
    series: res.energyUsageBarChartY,
  };
  AnalysisbarEach.setOption(optionPie);
  window.addEventListener('resize', function () {
    AnalysisbarEach.resize();
  });
}

/**
 *能源类型分享柱状图
 */
function getDataByMonthTypeTwo(res) {
  console.log(res, value1, 'getDataByMonthType');

  if (res.groupEnergyUsageBarChartY.length > 0) {
    res.groupEnergyUsageBarChartY.forEach((item) => {
      item.type = 'bar';
    });
  }
  console.log(res.energyUsageBarChartY, 'getDataByMonthType');

  let AnalysisbarEach = echarts.init(document.getElementById('AnalysisbarTwos'));
  let optionPie = {
    color: colorArr.value,
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
      bottom: '6%',
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
      data: res.energyUsageBarChartX,
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
    },
    series: res.groupEnergyUsageBarChartY,
  };
  AnalysisbarEach.setOption(optionPie);
  window.addEventListener('resize', function () {
    AnalysisbarEach.resize();
  });
}

/**
 *能源类型分享饼状图
 */
function getAnalysispie(res) {
  console.log(res, value1.value, 'getAnalysispie');
  AnalysispieEach.value = echarts.init(document.getElementById('Analysispie'));
  let optionPie = {
    color: colorArr.value,
    tooltip: {
      trigger: 'item',
    },
    // legend: {
    //   right: 10,
    //   top: 'middle',
    //   type: 'scroll',
    //   orient: 'vertical',
    //   textStyle: {
    //     fontSize: 16,
    //   },
    //   formatter: function (value) {
    //     console.log(value, 'getAnalysispie');
    //     if (value1.value == '1') {
    //       if (res.energyUsagePieChart.length > 0) {
    //         return value + '     |     ' + res.energyUsagePieChart.find((item) => item.name === value).value;
    //       } else {
    //         return '';
    //       }
    //     } else {
    //       if (res.groupEnergyUsagePieChart.length > 0) {
    //         return value + '     |     ' + res.groupEnergyUsagePieChart.find((item) => item.name === value).value;
    //       } else {
    //         return '';
    //       }
    //     }
    //   },
    // },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
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
        data: value1.value == 1 ? res.energyUsagePieChart : res.groupEnergyUsagePieChart,
      },
    ],
  };
  AnalysispieEach.value.setOption(optionPie);
  window.addEventListener('resize', function () {
    AnalysispieEach.value.resize();
  });
}

/**
 *用能负荷率
 */
function electricityLoadRate(res) {
  let electricityLoadRateEach = echarts.init(document.getElementById('electricityLoadRate'));
  let optionPie = {
    color: colorArr.value,
    title: [
      {
        left: '0%',
        top: '0%',
        subtext: '单位:%', // 这里应该使用 t('carbon.message.UnitTco2e')
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
      data: res.loadRateBarX,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: res.loadRateBarY,
        type: 'bar',
      },
    ],
  };
  electricityLoadRateEach.setOption(optionPie);
  window.addEventListener('resize', function () {
    electricityLoadRateEach.resize();
  });
}

/**
 *分时用电柱状图
 */
function timeConsumption(res) {
  let seriesArr = [];
  res.timeEnergyBarY.forEach((item) => {
    item.type = 'bar';
    item.stack = 'usage';
    seriesArr.push(item);
  });
  let timeConsumptionEach = echarts.init(document.getElementById('timeConsumption'));
  let optionPie = {
    color: colorArr.value,
    title: [
      {
        left: '0%',
        top: '0%',
        subtext: '单位kwh', // 这里应该使用 t('carbon.message.UnitTco2e')
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
      data: res.timeEnergyBarX,
    },
    yAxis: {
      type: 'value',
    },
    series: seriesArr,
  };
  timeConsumptionEach.setOption(optionPie);
  window.addEventListener('resize', function () {
    timeConsumptionEach.resize();
  });
}

/**
 *子分组占比饼状图
 */
function getProportionOf(res) {
  console.log(res, 'getProportionOf');

  proportionOfEach.value = echarts.init(document.getElementById('proportionOf'));
  console.log(proportionOfEach.value);
  let optionPie = {
    color: colorArr.value,
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
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
        data: res.subGroupRatio,
      },
    ],
  };
  proportionOfEach.value.setOption(optionPie);
  window.addEventListener('resize', function () {
    proportionOfEach.value.resize();
  });
}

//能耗曲线
function getConsumptionCurve(res) {
  console.log(res, 'getConsumptionCurve');
  let consumptionCurveEach = echarts.init(document.getElementById('consumptionCurve'));

  let optionPie = {
    color: colorArr.value,
    title: {
      text: '能耗曲线',
      top: 0,
      left: -5,
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      top: 30,
      left: -10,
    },
    grid: {
      left: '0%',
      right: '2%',
      top: '18%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: res.energyLineX,
      },
    ],
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: res.energyLineY[0].name,
        type: 'line',
        smooth: true,
        data: res.energyLineY[0].data,
      },
      {
        name: res.energyLineY[1].name,
        type: 'line',
        smooth: true,
        data: res.energyLineY[1].data,
      },
    ],
  };

  consumptionCurveEach.setOption(optionPie);
  window.addEventListener('resize', function () {
    consumptionCurveEach.resize();
  });
}
</script>

<style scoped lang="less">
.nowrap {
  white-space: nowrap;
}

#Analysisbar {
  width: 58%;
  height: 400px;
}
#AnalysisbarTwos {
  width: 58%;
  height: 400px;
}
#Analysispie {
  width: 400px;
  height: 400px;
}

#electricityLoadRate {
  width: 100%;
  height: 300px;
}

#timeConsumption {
  width: 100%;
  height: 400px;
}

#proportionOf {
  width: 400px;
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
  justify-content: space-evenly;
}

.borderBottom {
  border-bottom: 1px solid #e8e8e8;
  padding: 16px 16px 16px;
  justify-content: space-between;
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

.imgs {
  img {
    width: 60px;
    height: 60px;
  }
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
  position: relative;
  display: flex;
  align-items: center;
}

.postAbsout {
  position: absolute;
  top: 0%;
  left: 0%;
  text-align: center;
  width: 400px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.brders {
  width: 20px;
  height: 10px;
  border-radius: 6px;
}

.postAbsout2 {
  position: absolute;
  top: 0%;
  left: 0%;
  text-align: center;
  width: 400px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  white-space: nowrap;
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

.borderRadiun {
  border-radius: 12px 0 0 12px;
}
.borderRadiun1 {
  border-radius: 0 12px 12px 0;
}

.color {
  color: #F04864;
  background: #F04864;
}
.color1 {
  color: #FACC14;
  background: #FACC14;
}
.color2 {
  color: #2FC25B;
  background: #2FC25B;
}
.color3 {
  color: #1890FF;
  background: #1890FF;
}
.color14 {
  color: #8543E0;
  background: #8543E0;
}

</style>
