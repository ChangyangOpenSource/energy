<!-- 产品碳足迹-碳足迹报告 -->

<template>
  <div>
    <div class="m_contentBox" ref="contentBox">
      <a-card :bordered="false">
        <div class="m_aCardBox">
          <div class="tabBox">
            <div class="table-page-search-wrapper">
              <a-form :model="queryParam" @keyup.enter="searchQuery">
                <a-row :gutter="24">
                  <a-col :span="6">
                    <a-form-item label="维度">
                      <a-select ref="select" v-model:value="Dimension" @change="changeType" style="width: 100%" placeholder="请选择">
                        <a-select-option value="2">场站维度</a-select-option>
                        <a-select-option value="1">公司维度</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="场站" v-if="Dimension == '2'">
                      <select-station-no-clear
                        style="width: 100%"
                        v-model:value="stationId"
                        :stationId="stationId"
                        @change="onChangeStation"
                      ></select-station-no-clear>
                    </a-form-item>
                    <a-form-item label="公司" v-if="Dimension == '1'">
                      <a-select
                        style="width: 100%"
                        v-model:value="stationId"
                        :options="CompanyLIst"
                        :field-names="{ label: 'title', value: 'value' }"
                        placeholder="请选择关联场站"
                        allow-clear
                      >
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="" style="">
                      <div style="width: 100%; display: flex; gap: 24px">
                        <a-button type="primary" @click="onChaxun">查询</a-button>
                      </div>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </div>
          </div>
          <div class="zhibiao">
            <div class="flex marBootom">
              <a-radio-group v-model:value="type" @change="countTimeTypeChange">
                <a-radio-button value="1">本月</a-radio-button>
                <a-radio-button value="2">本年</a-radio-button>
              </a-radio-group>
              <!-- <Icon style="color: #f5222d;" icon="ant-design:caret-up-outlined" />
                <Icon style="color: #52c41a;" icon="ant-design:caret-down-outlined" /> -->
            </div>
            <div class="flex marBootom gap">
              <div class="flex paddigns" style="justify-content: space-around">
                <div class="w-100" style="text-align: center">
                  <div class="font-bold">累计能耗(kgce)</div>
                  <div class="total">{{ cumulative.totalEnergyConsume }}</div>
                </div>
                <div class="verticalLine"></div>
                <div class="w-100">
                  <div class="flex marBootom" style="justify-content: space-around">
                    <div style="flex: 1; display: flex; justify-content: center">同比</div>
                    <div style="flex: 1; display: flex; justify-content: center">
                      <Icon style="color: #f5222d" icon="ant-design:caret-up-outlined" v-if="cumulative.totalEnergyConsumeTb > 0" />
                      <Icon style="color: #52c41a" icon="ant-design:caret-down-outlined" v-if="cumulative.totalEnergyConsumeTb < 0" />
                      {{ cumulative.totalEnergyConsumeTb }}%</div
                    >
                  </div>
                  <div class="flex" style="justify-content: space-around">
                    <div style="flex: 1; display: flex; justify-content: center">环比</div>
                    <div style="flex: 1; display: flex; justify-content: center">
                      <Icon style="color: #f5222d" icon="ant-design:caret-up-outlined" v-if="cumulative.totalEnergyConsumeHb > 0" />
                      <Icon style="color: #52c41a" icon="ant-design:caret-down-outlined" v-if="cumulative.totalEnergyConsumeHb < 0" />
                      {{ cumulative.totalEnergyConsumeHb }}%</div
                    >
                  </div>
                </div>
              </div>
              <div class="flex paddigns" style="justify-content: center">
                <div class="w-100" style="text-align: center">
                  <div class="font-bold">累计碳排(kgCO₂e)</div>
                  <div class="total">{{ cumulative.totalCarbon }}</div>
                </div>
                <div class="verticalLine"></div>
                <div class="w-100" style="justify-content: space-around">
                  <div class="flex marBootom" style="justify-content: space-around">
                    <div style="flex: 1; display: flex; justify-content: center">同比</div>
                    <div style="flex: 1; display: flex; justify-content: center">
                      <Icon style="color: #f5222d" icon="ant-design:caret-up-outlined" v-if="cumulative.totalCarbonTb > 0" />
                      <Icon style="color: #52c41a" icon="ant-design:caret-down-outlined" v-if="cumulative.totalCarbonTb < 0" />
                      {{ cumulative.totalCarbonTb }}%</div
                    >
                  </div>
                  <div class="flex" style="justify-content: space-around">
                    <div style="flex: 1; display: flex; justify-content: center">环比</div>
                    <div style="flex: 1; display: flex; justify-content: center">
                      <Icon style="color: #f5222d" icon="ant-design:caret-up-outlined" v-if="cumulative.totalCarbonHb > 0" />
                      <Icon style="color: #52c41a" icon="ant-design:caret-down-outlined" v-if="cumulative.totalCarbonHb < 0" />
                      {{ cumulative.totalCarbonHb }}%</div
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="indicatorTypeBox">
              <!-- 左箭头 -->
              <div class="arrow arrow-left" @click="scrollLeft">
                <a-icon type="left" />
              </div>
              <!-- 内容容器 -->
              <div class="indicatorContent" ref="indicatorContent">
                <div class="indicatorTypeInner" v-for="(item, index) in IndexPagLst" :key="index">
                  <div class="header">
                    <span>{{ item.indicatorName }}({{ item.indicatorUnit }})</span>
                  </div>
                  <div class="value bose">{{ item.countValue }}</div>
                  <div class="flex gap">
                    <div class="trend">
                      <span>上月</span>
                      <span>{{ item.beforeValue }}</span>
                    </div>
                    <div class="trend">
                      <span>环比</span>
                      <Icon style="color: #f5222d" icon="ant-design:caret-up-outlined" v-if="item.rateValue > 0" />
                      <Icon style="color: #52c41a" icon="ant-design:caret-down-outlined" v-if="item.rateValue < 0" />
                      <span>{{ item.rateValue }}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 右箭头 -->
              <div class="arrow arrow-right" @click="scrollRight">
                <a-icon type="right" />
              </div>
            </div>
          </div>
          <div class="zhibiao1">
            <div class="flex borderBottom">
              <div class="textf">
                能源类型分析
                <a-tooltip>
                  <template #title>用能消费，所有能源类型统一为折标煤进行统计</template>
                  <Icon icon="ant-design:question-circle-outlined" />
                </a-tooltip>
              </div>
              <div class="flex gap">
                <a-radio-group v-model:value="type1" @change="countTimeTypeChangeTwo">
                  <a-radio-button value="0">按日</a-radio-button>
                  <a-radio-button value="1">按月</a-radio-button>
                  <a-radio-button value="2">按年</a-radio-button>
                </a-radio-group>
                <a-date-picker
                  v-model:value="statisticalDate"
                  v-if="type1 == '0'"
                  style="width: 200px"
                  placeholder="请选择"
                  valueFormat="YYYY-MM-DD"
                  @change="onPickerChange"
                />
                <a-date-picker
                  v-model:value="statisticalDate"
                  v-if="type1 == '2'"
                  picker="year"
                  style="width: 200px"
                  placeholder="请选择"
                  valueFormat="YYYY"
                  @change="onPickerChange"
                />
                <a-date-picker
                  v-model:value="statisticalDate"
                  v-if="type1 == '1'"
                  picker="month"
                  style="width: 200px"
                  placeholder="请选择"
                  valueFormat="YYYY-MM"
                  @change="onPickerChange"
                />
                <a-select ref="select" v-model:value="nengYuanValue" style="width: 120px" @change="handleChange">
                  <a-select-option value="1">用能消耗</a-select-option>
                  <a-select-option value="2">用能碳排</a-select-option>
                </a-select>
              </div>
            </div>
            <div class="flex gap padding-24">
              <div id="Analysisbar"></div>
              <div class="post">
                <div id="Analysispie"></div>
                <div class="postAbsout2">
                  <div class="postTitle">{{ nengYuanValue == '1' ? '总消耗(kgce)' : '总碳排(kgCO₂e)' }}</div>
                  <div class="postTitle1">{{ nengYuanValue == '1' ? energyTypeObj.totalUse : energyTypeObj.totalCarbon }} </div>
                </div>
                <div v-if="nengYuanValue == '1'">
                  <div v-for="(item, index) in energyTypeObj.usePie" :key="index" style="margin-bottom: 3px; gap: 12px" class="flex">
                    <div class="brders" :style="{ backgroundColor: colorArr[index % colorArr.length] }"></div>
                    <div style="width: 60px">{{ item.name }}</div>
                    <div>|</div>
                    <div style="width: 80px"> {{ item.value }}</div>
                  </div>
                </div>
                <div v-if="nengYuanValue == '2'">
                  <div v-for="(item, index) in energyTypeObj.carbonPie" :key="index" style="margin-bottom: 3px; gap: 12px" class="flex">
                    <div class="brders" :style="{ backgroundColor: colorArr[index % colorArr.length] }"></div>
                    <div style="width: 60px">{{ item.name }}</div>
                    <div>|</div>
                    <div style="width: 80px"> {{ item.value }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="zhibiao1">
            <div class="flex borderBottom">
              <div class="textf">用能比较 </div>
              <div class="flex gap">
                <a-radio-group v-model:value="type2" @change="countTimeTypeChangeThree">
                  <a-radio-button value="0">按日</a-radio-button>
                  <a-radio-button value="1">按月</a-radio-button>
                  <a-radio-button value="2">按年</a-radio-button>
                </a-radio-group>
                <a-date-picker
                  v-model:value="statisticalDate1"
                  v-if="type2 == '0'"
                  style="width: 200px"
                  placeholder="请选择"
                  valueFormat="YYYY-MM-DD"
                  @change="onPickerChangeThree"
                />
                <a-date-picker
                  v-model:value="statisticalDate1"
                  v-if="type2 == '2'"
                  picker="year"
                  style="width: 200px"
                  placeholder="请选择"
                  valueFormat="YYYY"
                  @change="onPickerChangeThree"
                />
                <a-date-picker
                  v-model:value="statisticalDate1"
                  v-if="type2 == '1'"
                  picker="month"
                  style="width: 200px"
                  placeholder="请选择"
                  valueFormat="YYYY-MM"
                  @change="onPickerChangeThree"
                />
              </div>
            </div>
            <div class="flex gap padding-24">
              <div id="comparisonbar"></div>
            </div>
          </div>
          <div class="zhibiao1">
            <div class="flex borderBottom">
              <div class="textf flex gap">用能分析<div class="xianqiang" @click="handleClickTwo()" v-if="Dimension == '2'">详情</div> </div>
              <div class="flex gap">
                <a-radio-group v-model:value="type3" @change="countTimeTypeChangeFour">
                  <a-radio-button value="0">按日</a-radio-button>
                  <a-radio-button value="1">按月</a-radio-button>
                  <a-radio-button value="2">按年</a-radio-button>
                </a-radio-group>
                <a-date-picker
                  v-model:value="statisticalDate2"
                  v-if="type3 == '0'"
                  style="width: 200px"
                  placeholder="请选择"
                  valueFormat="YYYY-MM-DD"
                  @change="onPickerChangeFour"
                />
                <a-date-picker
                  v-model:value="statisticalDate2"
                  v-if="type3 == '2'"
                  picker="year"
                  style="width: 200px"
                  placeholder="请选择"
                  valueFormat="YYYY"
                  @change="onPickerChangeFour"
                />
                <a-date-picker
                  v-model:value="statisticalDate2"
                  v-if="type3 == '1'"
                  picker="month"
                  style="width: 200px"
                  placeholder="请选择"
                  valueFormat="YYYY-MM"
                  @change="onPickerChangeFour"
                />
                <a-select
                  v-if="Dimension == '2'"
                  style="width: 220px"
                  v-model:value="oarendId"
                  :options="parendLiast"
                  :field-names="{ label: 'groupName', value: 'id' }"
                  placeholder="请选择"
                  allow-clear
                  @change="oarendIdChange"
                >
                </a-select>
                <a-select ref="select" v-model:value="stationSelectValue" style="width: 120px" @change="handleChangeTwo">
                  <a-select-option value="1">用能消耗</a-select-option>
                  <a-select-option value="2">用能碳排</a-select-option>
                </a-select>
              </div>
            </div>
            <div class="flex gap padding-24">
              <div class="post">
                <div id="energyConsumptionPie"></div>
                <div class="postAbsout2">
                  <div class="postTitle">{{ stationSelectValue == '1' ? '总消耗(kgce)' : '总碳排(kgCO₂e)' }}</div>
                  <div class="postTitle1">{{ stationSelectValue == '1' ? stationSelectObj.totalUse : stationSelectObj.totalCarbon }} </div>
                </div>
                <div class="postAbsout1" v-if="stationSelectValue == '1'">
                  <div v-for="(item, index) in stationSelectObj.childUsePie" :key="index" style="margin-bottom: 3px" class="flex gap">
                    <div class="brders" :style="{ backgroundColor: colorArr[index % colorArr.length] }"></div>
                    <div style="width: 80px">{{ item.name }}</div>
                    <div>|</div>
                    <div style="width: 80px"> {{ item.value }}</div>
                    <div class="xianqiang" @click="handleClick(item)" v-if="Dimension == '1'">详情</div>
                  </div>
                </div>
                <div class="postAbsout1" v-if="stationSelectValue == '2'">
                  <div v-for="(item, index) in stationSelectObj.childCarbonPie" :key="index" style="margin-bottom: 3px" class="flex gap">
                    <div class="brders" :style="{ backgroundColor: colorArr[inde % colorArr.lengthx] }"></div>
                    <div style="width: 80px"> {{ item.name }} </div>
                    <div>|</div>
                    <div style="width: 80px"> {{ item.value }}</div>
                    <div class="xianqiang" @click="handleClick(item)" v-if="Dimension == '1'">详情</div>
                  </div>
                </div>
              </div>
              <div id="energyConsumptionBar"></div>
            </div>
          </div>
          <div class="zhibiao1">
            <div class="flex borderBottom">
              <div class="textf">用能强度排名 </div>
              <div class="flex gap">
                <div class="flex">
                  <!-- <div class="title borders">按日</div>
                  <div class="title borders2">按月</div>
                  <div class="title1 borders1">按年</div> -->
                  <a-radio-group v-model:value="type4" @change="countTimeChange">
                    <a-radio-button value="1">按月</a-radio-button>
                    <a-radio-button value="2">按年</a-radio-button>
                  </a-radio-group>
                </div>
                <a-date-picker
                  v-model:value="statisticalDate3"
                  v-if="type4 == '2'"
                  picker="year"
                  style="width: 200px"
                  placeholder="请选择"
                  valueFormat="YYYY"
                  @change="indicatorChange"
                />
                <a-date-picker
                  v-model:value="statisticalDate3"
                  v-if="type4 == '1'"
                  picker="month"
                  style="width: 200px"
                  placeholder="请选择"
                  valueFormat="YYYY-MM"
                  @change="indicatorChange"
                />

                <a-select
                  v-if="Dimension == '2'"
                  style="width: 220px"
                  v-model:value="oarendIdTwo"
                  :options="parendLiast"
                  :field-names="{ label: 'groupName', value: 'id' }"
                  placeholder="请选择"
                  allow-clear
                  @change="countTimeTypeChangeFive"
                >
                </a-select>

                <a-select
                  style="width: 220px"
                  v-model:value="indicatorId"
                  :options="qiangDuompanyLIst"
                  :field-names="{ label: 'indicatorName', value: 'id' }"
                  placeholder="请选择"
                  allow-clear
                  @change="indicatorChange"
                >
                </a-select>
              </div>
            </div>
            <div class="flex gap padding-24" v-if="listQiangDUa.length > 0">
              <div class="wihts">
                <a-table :columns="columns" :pagination="false" :data-source="listQiangDUa[0].valueList" @change="handleTableChange">
                  <template #bodyCell="{ column, text, index }">
                    <template v-if="column.dataIndex === 'name'">
                      <span class="amrgs" :class="{ color: index == 0, color1: index == 1, color2: index == 2 }">{{ index + 1 }}.</span
                      >{{ text ? text : '无' }}
                    </template>
                  </template>
                </a-table>
              </div>
              <div class="wihts">
                <a-table :columns="columns1" :pagination="false" :data-source="listQiangDUa[1].valueList" @change="handleTableChange">
                  <template #bodyCell="{ column, text, index }">
                    <template v-if="column.dataIndex === 'name'"
                      ><span class="amrgs" :class="{ color: index == 0, color1: index == 1, color2: index == 2 }">{{ index + 1 }}.</span
                      >{{ text ? text : '无' }}
                    </template>
                  </template>
                </a-table>
              </div>
            </div>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { useRouter, useRoute } from 'vue-router';
import { defHttp } from '/@/utils/http/axios';
import * as echarts from 'echarts';
import SelectStationNoClear from '@/components/station/SelectStationNoClear.vue';
import dayjs from 'dayjs';
// 使用 Composition API 工具
const { createMessage } = useMessage();
const router = useRouter();

// Reactive 数据
const loading = ref(false);
const queryParam = reactive({});
const indicatorContent = ref(null);
const indicatorTypeList = ref([123, 123, 123, 123, 123, 123]); // 指标类型列表
const colorArr = ref(['#1890FF', '#2FC25B', '#FACC14', '#F04864', '#8543E0', '#13C2C2']);
const columns = [
  {
    title: '',
    dataIndex: 'name',
  },
  {
    title: '单位：tce',
    dataIndex: 'carbonEmission',
  },
];
const columns1 = [
  {
    title: '单位产值碳排',
    dataIndex: 'name',
  },
  {
    title: '单位：tce/m2',
    dataIndex: 'carbonEmission',
  },
];
const columns2 = [
  {
    title: '单位产值成本',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '单位：tce/t',
    dataIndex: 'age',
    align: 'center',
  },
];
const dataSource = [
  {
    name: '123',
    age: '12354',
  },
];

const Dimension = ref('2'); //维度
const stationId = ref(''); //id

const type = ref('1'); // 1按月 2按年
const type1 = ref('0'); //0按日 1按月 2按年
const type2 = ref('0'); //0按日 1按月 2按年
const type3 = ref('0'); //0按日 1按月 2按年
const type4 = ref('1'); // 1按月 2按年

const statisticalDate = ref(''); //统计日期
const statisticalDate1 = ref(''); //统计日期
const statisticalDate2 = ref(''); //统计日期
const statisticalDate3 = ref(''); //统计日期

const nengYuanValue = ref('1'); // 能源筛选
const stationSelectValue = ref('1'); //场站筛选
const cumulative = ref({}); //累计能耗
const energyTypeObj = ref({}); //能源类型分析
// Methods
const back = () => {
  isAss.value = false;
};
//用能比较
const energyComparisonObj = ref({}); //用能比较
//场站选择器
const stationSelectObj = ref({
  childUsePie: ['1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
  childCarbonPie: ['1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
}); //场站

// -----------------------图表
const Analysisbar = ref(null); //能源类型分享柱状图
const Analysispie = ref(null); //能源类型分享饼图

const energyConsumptionPies = ref(null); //场站类型分享饼图
const energyConsumptionBars = ref(null); //场站类型分享柱状图
const CompanyLIst = ref([]); //公司列表
const qiangDuompanyLIst = ref([]); //强度下拉框列表
const listQiangDUa = ref([]);

const indicatorId = ref(''); //指标id
const IndexPagLst = ref([]); //累计轮播

const parendLiast = ref([]); //分组
const oarendId = ref(''); //父id
const oarendIdTwo = ref(''); //父id
const contentBox = ref(null); //内容区域
const onClose = () => {};
const handleTableChange = () => {};

//获取场站分组
function getQueryByParentId() {
  defHttp
    .get({
      url: '/cyGroup/queryByParentId',
      params: {
        groupId: stationId.value,
      },
    })
    .then((res) => {
      console.log(res, 'getQueryByParentId');
      if (res) {
        parendLiast.value = res;
        oarendId.value = res[0].id;
        oarendIdTwo.value = res[0].id;
        // 根据分组来获取分组下的指标
        defHttp
          .get({
            url: '/cyEnergyConsumptionAnalysisIndicator/getAllByParentId',
            params: {
              parentId: oarendIdTwo.value,
            },
          })
          .then((res) => {
            console.log(res, 'res');
            if (res) {
              qiangDuompanyLIst.value = res;
              indicatorId.value = res[0].id;
            }
            getEnergyIntensityRanking();
          });
        getEnergyenChildEnergyUsen();
      }
    });
}
//场站跳转
function handleClickTwo(item) {
  console.log(item, 'item');
  if (stationSelectValue.value == '1') {
    router.push({
      path: '/energy/energyConsumptionAnalysis/index',
      query: { type: type3.value, baseEnergyDate: statisticalDate2.value, stationId: stationId.value, groupId: oarendId.value },
    });
  } else {
    router.push({
      path: '/energy/carbonEmissionAnalysis/index',
      query: { type: type3.value, baseEnergyDate: statisticalDate2.value, stationId: stationId.value, groupId: oarendId.value },
    });
  }
}

//用能强度下拉框
function getAllByParentId() {
  defHttp
    .get({
      url: '/cyEnergyConsumptionAnalysisIndicator/getAllByParentId',
      params: {
        parentId: stationId.value,
      },
    })
    .then((res) => {
      console.log(res, 'res');
      if (res) {
        qiangDuompanyLIst.value = res;
        indicatorId.value = res[0].id;
        if (Dimension.value == 2) {
          getQueryByParentId();
        } else {
          getEnergyIntensityRanking();
        }
      }
    });
}

//详情
function handleClick(item) {
  console.log(item, 'item');
  if (Dimension.value == '1') {
    stationId.value = item.other;
    Dimension.value = '2';
    onGete();
    console.log(stationId.value, 'stationId.value');
  }

  contentBox.value.scrollTo({
    top: 0,
    behavior: 'smooth', // 平滑滚动
  });
}

//查询
function onChaxun() {
  type.value = '1'; // 1按月 2按年
  type1.value = '0'; //0按日 1按月 2按年
  type2.value = '0'; //0按日 1按月 2按年
  type3.value = '0'; //0按日 1按月 2按年
  type4.value = '1'; // 1按月 2按年
  onGete();
  createMessage.success('查询成功');
}

function onGete() {
  const currentDate = new Date();
  const formattedTime = currentDate.toISOString().split('T')[0];
  const formattedTimeTwo = currentDate.toISOString().split('T')[0];
  statisticalDate.value = formattedTime;
  statisticalDate1.value = formattedTime;
  statisticalDate2.value = formattedTime;
  statisticalDate3.value = dayjs().format('YYYY-MM');
  console.log('现在的时间', statisticalDate3.value);
  setTimeout(() => {
    getAllByParentId();
    getTotalEnergyConsumption();
    getAllIndicatorByIndexPage();
    getEnergyTypeAnalysis();
    getEnergyenErgyComparison();
  }, 300);
}

//累计轮播
function getAllIndicatorByIndexPage() {
  defHttp
    .get({
      url: '/cyEnergyStatistics/getAllIndicatorByIndexPage',
      params: {
        parentDimension: Dimension.value,
        parentId: stationId.value,
        timeDimension: type.value,
      },
    })
    .then((res) => {
      console.log(res, 'res');
      if (res) {
        IndexPagLst.value = res;
      }
    });
}

// 生命周期
onMounted(() => {
  onGete();
});

//切换维度
function changeType() {
  stationId.value = '';
  if (Dimension.value == 1) {
    queryTreeListVaue();
  }
}

//排行
function countTimeTypeChangeFive() {
  defHttp
    .get({
      url: '/cyEnergyConsumptionAnalysisIndicator/getAllByParentId',
      params: {
        parentId: oarendIdTwo.value,
      },
    })
    .then((res) => {
      console.log(res, 'res');
      if (res) {
        qiangDuompanyLIst.value = res;
        indicatorId.value = res[0].id;
      }
      getEnergyIntensityRanking();
    });
}

function countTimeChange() {
  console.log(type4.value, 'type4.value');
   if (type4.value == '1') {
    statisticalDate3.value = dayjs().format('YYYY-MM');
  } else if (type4.value == '2') {
    statisticalDate3.value = dayjs().format('YYYY');
  }
  console.log(statisticalDate3.value, 'statisticalDate3.value');
  getEnergyIntensityRanking();
}

function indicatorChange() {
  getEnergyIntensityRanking();
}

//用能排行
function getEnergyIntensityRanking() {
  console.log(oarendIdTwo.value, 'oarendIdTwo');
  defHttp
    .get({
      url: '/cyEnergyStatistics/getEnergyIntensityRanking',
      params: {
        parentDimension: Dimension.value,
        parentId: Dimension.value == '1' ? stationId.value : oarendIdTwo.value,
        timeDimension: type4.value,
        dateTime: statisticalDate3.value,
        indicatorId: indicatorId.value,
      },
    })
    .then((res) => {
      console.log(res, 'res');
      if (res) {
        listQiangDUa.value = res;
        columns[1].title = listQiangDUa.value[0].title + '(' + listQiangDUa.value[0].unit + ')';
        columns1[1].title = listQiangDUa.value[1].title + '(' + listQiangDUa.value[1].unit + ')';
        if (Dimension.value == '1') {
          columns[0].title = '场站';
          columns1[0].title = '场站';
        } else {
          columns[0].title = '子分组';
          columns1[0].title = '子分组';
        }
        if (listQiangDUa.value[0].type == 1) {
          columns[1].dataIndex = 'energyConsumption';
        } else {
          columns[1].dataIndex = 'carbonEmission';
        }

        if (listQiangDUa.value[1].type == 1) {
          columns1[1].dataIndex = 'energyConsumption';
        } else {
          columns1[1].dataIndex = 'carbonEmission';
        }
        console.log(columns, 'columns1');
        console.log(columns1, 'columns1');
      }
    });
}

//公司
function queryTreeListVaue() {
  defHttp
    .get({
      url: '/sys/sysDepart/queryTreeList',
    })
    .then((res) => {
      console.log(res, 'res');
      if (res) {
        CompanyLIst.value = res;
        stationId.value = res[0].value;
      }
    });
}

// 场站选择器改变事件
function onChangeStation() {}

//累计能耗
function getTotalEnergyConsumption() {
  console.log(stationId.value, 'stationId');
  defHttp
    .get({
      url: '/cyEnergyIndexStatistics/indexStatistics',
      params: {
        type: type.value,
        parentId: stationId.value,
        parentType: Dimension.value,
      },
    })
    .then((res) => {
      console.log(res, 'res');
      if (res) {
        cumulative.value = res;
      }
    });
}

//累计筛选切换
function countTimeTypeChange() {
  getTotalEnergyConsumption();
  getAllIndicatorByIndexPage();
}

//能源筛选切换
function handleChange() {
  if (Analysisbar.value != null) {
    Analysisbar.value.dispose();
  }
  if (Analysispie.value != null) {
    Analysispie.value.dispose();
  }
  getDataByMonthType(energyTypeObj.value);
  getAnalysispie(energyTypeObj.value);
}

//能源筛选切换
function countTimeTypeChangeTwo() {
  if (type1.value == 0) {
    statisticalDate.value = dayjs().format('YYYY-MM-DD');
  } else if (type1.value == 1) {
    statisticalDate.value = dayjs().format('YYYY-MM');
  } else if (type1.value == 2) {
    statisticalDate.value = dayjs().format('YYYY');
  }
  console.log(statisticalDate.value, 'statisticalDate.value');
  getEnergyTypeAnalysis();
}

//能源时间筛选
function onPickerChange() {
  getEnergyTypeAnalysis();
}

//能源类型分析
function getEnergyTypeAnalysis() {
  defHttp
    .get({
      url: '/cyEnergyIndexStatistics/energyUse',
      params: {
        statisticalDate: statisticalDate.value,
        parentId: stationId.value,
        type: type1.value,
      },
    })
    .then((res) => {
      console.log(res, 'res');
      if (res) {
        energyTypeObj.value = res;
        getDataByMonthType(energyTypeObj.value);
        getAnalysispie(energyTypeObj.value);
      }
    });
}

//用能比较时间筛选
function countTimeTypeChangeThree() {
  if (type2.value == 0) {
    statisticalDate1.value = dayjs().format('YYYY-MM-DD');
  } else if (type2.value == 1) {
    statisticalDate1.value = dayjs().format('YYYY-MM');
  } else if (type2.value == 2) {
    statisticalDate1.value = dayjs().format('YYYY');
  }
  console.log(statisticalDate1.value, 'statisticalDate1.value');
  getEnergyenErgyComparison();
}

//用能时间筛选
function onPickerChangeThree() {
  getEnergyenErgyComparison();
}

//用能比较
function getEnergyenErgyComparison() {
  defHttp
    .get({
      url: '/cyEnergyIndexStatistics/energyComparison',
      params: {
        statisticalDate: statisticalDate1.value,
        parentId: stationId.value,
        parentType: Dimension.value,
        type: type2.value,
      },
    })
    .then((res) => {
      console.log(res, 'res');
      if (res) {
        energyComparisonObj.value = res;
        comparisonbarVlue(energyComparisonObj.value);
      }
    });
}

//场站切换类型
function handleChangeTwo() {
  if (energyConsumptionPies.value != null) {
    energyConsumptionPies.value.dispose();
  }
  if (energyConsumptionBars.value != null) {
    energyConsumptionBars.value.dispose();
  }
  setTimeout(() => {
    energyConsumptionPie(stationSelectObj.value);
    energyConsumptionBar(stationSelectObj.value);
  }, 300);
}

//场站比较时间筛选
function countTimeTypeChangeFour() {
  if (type3.value == 0) {
    statisticalDate2.value = dayjs().format('YYYY-MM-DD');
  } else if (type3.value == 1) {
    statisticalDate2.value = dayjs().format('YYYY-MM');
  } else if (type3.value == 2) {
    statisticalDate2.value = dayjs().format('YYYY');
  }
  console.log(statisticalDate2.value, 'statisticalDate2.value');
  getEnergyenChildEnergyUsen();
}

//场站时间筛选
function onPickerChangeFour() {
  getEnergyenChildEnergyUsen();
}

function oarendIdChange() {
  getEnergyenChildEnergyUsen();
}

//场站
function getEnergyenChildEnergyUsen() {
  if (energyConsumptionPies.value != null) {
    energyConsumptionPies.value.dispose();
  }
  if (energyConsumptionBars.value != null) {
    energyConsumptionBars.value.dispose();
  }
  defHttp
    .get({
      url: '/cyEnergyIndexStatistics/childEnergyUse',
      params: {
        statisticalDate: statisticalDate2.value,
        parentId: Dimension.value == '1' ? stationId.value : oarendId.value,
        parentType: Dimension.value,
        type: type3.value,
      },
    })
    .then((res) => {
      console.log(res, 'res');
      if (res) {
        stationSelectObj.value = res;
        energyConsumptionPie(stationSelectObj.value);
        energyConsumptionBar(stationSelectObj.value);
      }
    });
}

/**
 *能源类型分享柱状图
 */
function getDataByMonthType(res) {
  console.log(res, 'getDataByMonthType');
  if (nengYuanValue.value == '1') {
    if (res.useBarY.length > 0) {
      res.useBarY.forEach((item) => {
        item.type = 'bar';
      });
    }
  } else {
    if (res.carbonBarY.length > 0) {
      res.carbonBarY.forEach((item) => {
        item.type = 'bar';
      });
    }
  }

  let Analysisbar = echarts.init(document.getElementById('Analysisbar'));
  let optionPie = {
    color: colorArr.value,
    title: [
      {
        left: 'left',
        left: '0%',
        top: '1.25%',
        subtext: '单位tce', // 这里应该使用 t('carbon.message.UnitTco2e')
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
      data: res.barX,
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
    },
    series: nengYuanValue.value == '1' ? res.useBarY : res.carbonBarY,
  };
  Analysisbar.setOption(optionPie);
  window.addEventListener('resize', function () {
    Analysisbar.resize();
  });
}

/**
 *能源类型分享饼状图
 */
function getAnalysispie(res) {
  console.log(res, 'getAnalysispie');
  Analysispie.value = echarts.init(document.getElementById('Analysispie'));
  console.log(Analysispie.value);
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
        data: nengYuanValue.value == '1' ? res.usePie : res.carbonPie,
      },
    ],
  };
  Analysispie.value.setOption(optionPie);
  window.addEventListener('resize', function () {
    Analysispie.value.resize();
  });
}

/**
 *用能比较
 */
function comparisonbarVlue(res) {
  res.barY.forEach((item, index) => {
    item.type = 'bar';
    if (index == 1) {
      item.yAxisIndex = index;
    }
  });
  let salesProportionChart = echarts.init(document.getElementById('comparisonbar'));
  console.log(salesProportionChart);
  const colors = ['#5070dd', '#b6d634', '#b6d634'];
  let optionPie = {
    color: colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    grid: {
      right: '10%',
      left: '5%',
      bottom: '15%',
    },
    legend: {},
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
        // prettier-ignore
        data: res.barX,
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: res.barY[0].name,
        position: 'left',
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[0],
          },
        },
        axisLabel: {
          formatter: '{value} kgce',
        },
      },
      {
        type: 'value',
        name: res.barY[1].name,
        position: 'right',
        alignTicks: true,
        offset: 80,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[1],
          },
        },
        axisLabel: {
          formatter: '{value} kgCO₂e',
        },
      },
    ],
    series: res.barY,
  };

  salesProportionChart.setOption(optionPie);
  window.addEventListener('resize', function () {
    salesProportionChart.resize();
  });
}

/**
 *场站用能分析饼状图
 */
function energyConsumptionPie(res) {
  energyConsumptionPies.value = echarts.init(document.getElementById('energyConsumptionPie'));
  console.log(energyConsumptionPies.value, 'energyConsumptionPies');
  let optionPie = {
    color: colorArr.value,
    tooltip: {
      trigger: 'item',
    },
    // legend: {
    //   right: 60,
    //   top: 'middle',
    //   type: 'scroll',
    //   orient: 'vertical',
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
        data: stationSelectValue.value == '1' ? res.childUsePie : res.childCarbonPie,
      },
    ],
  };
  energyConsumptionPies.value.setOption(optionPie);
  window.addEventListener('resize', function () {
    energyConsumptionPies.value.resize();
  });
}

/**
 *场站用能分析柱状图
 */
function energyConsumptionBar(res) {
  console.log(res.childUseBarY, 'childUseBarY');
  console.log(res.childCarbonBarY, 'childCarbonBarY');
  if (stationSelectValue.value == '1') {
    if (res.childUseBarY.length > 0) {
      res.childUseBarY.forEach((item) => {
        item.type = 'line';
      });
    }
  } else {
    if (res.childCarbonBarY.length > 0) {
      res.childCarbonBarY.forEach((item) => {
        item.type = 'line';
      });
    }
  }
  let energyConsumptionBars = echarts.init(document.getElementById('energyConsumptionBar'));
  let optionPie = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {},
    grid: {
      left: '3%',
      right: '0%',
      bottom: '3%',
      containLabel: true,
    },
    toolbox: {},
    xAxis: {
      type: 'category',
      data: res.childBarX,
    },
    yAxis: {
      type: 'value',
    },
    series: stationSelectValue.value == '1' ? res.childUseBarY : res.childCarbonBarY,
  };
  energyConsumptionBars.setOption(optionPie);
  window.addEventListener('resize', function () {
    energyConsumptionBars.resize();
  });
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

/**
 * 查询
 */
const searchQuery = () => {
  console.log('searchQuery');
  ipagination.current = 1;
  getData();
};
</script>

<style lang="less" scoped>
.fontSizes {
  font-size: 28px;
  font-weight: bold;
}
.amrgs {
  margin-right: 12px;
}
.color {
  color: #f04864;
}
.color1 {
  color: #facc14;
}
.color2 {
  color: #2fc25b;
}
.color3 {
  color: #1890ff;
}
.color14 {
  color: #8543e0;
}
.flex {
  display: flex;
  align-items: center;
}

.w-100 {
  width: 100%;
}

.wihts {
  flex: 1;
}

.gap {
  gap: 24px;
}

.padding-24 {
  padding: 16px;
}
.xianqiang {
  color: #4ca1ff;
  cursor: pointer;
}
.brders {
  width: 20px;
  height: 10px;
  border-radius: 6px;
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
  display: flex;
  align-items: center;
}

.postAbsout {
  position: absolute;
  top: 42%;
  right: 66%;
  text-align: center;
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

.postAbsout1 {
  position: absolute;
  top: 20%;
  right: 0%;
  text-align: center;
}

#energyConsumptionBar {
  width: 58%;
  height: 400px;
}
#energyConsumptionPie {
  width: 400px;
  height: 400px;
}

#comparisonbar {
  width: 100%;
  height: 400px;
}
#Analysisbar {
  width: 58%;
  height: 400px;
}
#Analysispie {
  width: 400px;
  height: 400px;
}
.borderBottom {
  border-bottom: 1px solid #e8e8e8;
  padding: 16px 16px 16px;
  justify-content: space-between;
}

.bose {
  border-bottom: 1px solid #e8e8e8;
}

.textf {
  color: rgba(51, 51, 51, 0.88);
  font-weight: 600;
  font-size: 16px;
}

.marBootom {
  margin-bottom: 24px;
}

.paddigns {
  padding: 16px;
  border: 1px solid #e8e8e8;
  width: 50%;
  border-radius: 6px;
}

.font-bold {
  color: #00000073;
  font-size: 14px;
}

.total {
  margin-top: 4px;
  font-size: 24px;
  font-weight: bold;
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
.borders {
  border-radius: 6px 0 0 6px;
  padding: 4px 12px;
  border: 1px solid #e5e5e5;
}

.borders1 {
  border-radius: 0 6px 6px 0;
  padding: 4px 12px;
  border: 1px solid #e5e5e5;
}

.borders2 {
  padding: 4px 12px;
  border: 1px solid #e5e5e5;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: #888888;
}

.title1 {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  background: #f3f3f3;
}

.zhibiao {
  background: #ffffff;
  border-radius: 3px;
  padding: 16px;
  margin-top: 12px;
}

.zhibiao1 {
  background: #ffffff;
  border-radius: 3px;
  margin-top: 12px;
}

/deep/ .ant-card-body {
  background: #f5f8f7;
}

.tabBox {
  padding: 24px 24px 0;
  background: #ffffff;
  border-radius: 3px;
}

.indicatorTypeBox {
  margin-top: 20px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;

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
</style>
