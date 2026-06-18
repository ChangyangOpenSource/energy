<template>
  <div class="centeet">
    <div
      class="cardHeader"
      style="display: flex; align-items: center; cursor: pointer"
      v-if="examineId"
    >
      <img
        class="cardHeader_icon m_hoverCP"
        src="@/assets/img/img28.png"
        alt=""
      />
      <span @click="onBack">{{t('carbon.message.Return')}}</span>
    </div>
    <a-card :bordered="false">
      <div class="bonReport" v-if="examineId && twoType == 2">
        <a-button
          @click="viewCancel"
          v-if="downloadObj.id"
          class="leftChaxun wigthsP"
        >
          {{t('carbon.message.view_carbon_report')}}</a-button
        >
        <a-button
          @click="generateCarbonReport"
          v-else
          class="leftChaxun wigthsP"
        >
          {{t('carbon.message.carbon_generation_report')}}</a-button
        >
      </div>
      <div class="topFlex" v-if="!examineId">
        <div class="letftRacharts">
          <div class="title">{{ t('carbon.message.Inventory_situation') }}</div>
          <div class="lists">
            {{t('carbon.message.All')}} <span class="color">{{ checkStatistic["全部"] }}</span>
          </div>
          <div class="lists">
            {{t('carbon.message.Filled_in')}}<span class="color1">{{ checkStatistic["已填报"] }}</span>
          </div>
          <div class="lists">
            {{t('carbon.message.Filling_in')}}<span class="color2">{{ checkStatistic["填报中"] }}</span>
          </div>
          <div class="lists">
            {{t('carbon.message.Archived')}}<span class="color3">{{ checkStatistic["已归档"] }}</span>
          </div>
        </div>
        <div class="rightRacharts">
          <div class="title flex">
            {{t('carbon.message.Is_being_questioned')}}
            <div class="gengduo m_hoverCP" @click="onOrganize">
              {{t('carbon.message.more')}} <img src="@/assets/carbon/img8.png" alt="" />
            </div>
          </div>
          <a-table
            :customRow="customRow"
            :columns="columns"
            :data-source="fenestraData"
            :pagination="false"
            size="middle"
          >
            <template #operation="{ record }">
              <div class="editable-row-operations">
                <a @click="() => submitAform(record)">{{t('carbon.message.fill_in')}}</a>
              </div>
            </template>
          </a-table>
        </div>
      </div>
      <div class="testFlex" v-else>
        <div class="letftRacharts">
          <div class="title msw">{{t('carbon.message.carbon_emissions')}}</div>
          <div class="letfwFlex">
            <div>
              <span class="valueLeft">{{ carbonObj.total }}</span>
              <span class="valueRight">tCO₂e</span>
            </div>
            <div class="vauFlexs">
              <div>
                <span class="value1">{{t('carbon.message.last_year')}}：</span>
                <span class="value2">{{ carbonObj.preTotal }}tCO₂e</span>
              </div>
              <div>
                <span class="value1">{{t('carbon.message.year_on_year')}}：</span>
                <span class="value3">{{ carbonObj.increase }}%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="rightRacharts">
          <div class="oneFlex">
            <span class="titleTws">{{t('carbon.message.energy_using_carbon_emission')}}</span>
            <div>
              <span class="valueLeft">{{ carbonObj.cost }}</span>
              <span class="valueRight">tCO₂e</span>
            </div>
          </div>
          <div class="oneFlex">
            <span class="titleTws">{{t('carbon.message.Green_emission_reduction')}}</span>
            <div>
              <span class="valueLeft">{{ carbonObj.green }}</span>
              <span class="valueRight">tCO₂e</span>
            </div>
          </div>
        </div>
      </div>
      <div class="setins" v-if="!examineId">
        <a-tree-select
          v-model:value="form.orgId"
          show-search
          style="width: 130px"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="Please select"
          allow-clear
          tree-default-expand-all
          :tree-data="costCalcProvinceData"
          tree-node-filter-prop="label"
          @change="loadorgId"
        >
          <template #title="{ value: val, title }">
            <b v-if="val === 'parent 1-1'" style="color: #08c">sss</b>
            <template v-else>{{ title }}</template>
          </template>
        </a-tree-select>

        <a-date-picker
          style="width: 130px"
          v-model:value="form.year"
          :format="monthFormat"
          :valueFormat="monthFormat"
          mode="year"
          :open="yearOpen"
          :allowClear="false"
          @panelChange="opanelChange"
          @openChange="onopenelChange"
        />
        <a-select
          style="width: 200px"
          :placeholder="t('carbon.message.please_select_accounting_standard')"
          v-model:value="form.standraId"
          @change="loadorgId"
        >
          <a-select-option
            v-for="province in provinceData"
            :key="province.key"
            :value="province.key"
          >
            {{ province.title }}
          </a-select-option>
        </a-select>
      </div>
      <div :class="{ paddingx: !examineId, paddingx1: examineId }" v-if="isShow && isAss">
        <div class="sansTyles" v-if="!examineId">
          <div class="flex collaose-center">
            <div class="title1" style="font-weight: bold !important">
              {{ form.year }}{{t('carbon.message.carbon_emission_data')}}
            </div>
            <div class="flex1">
              <a-button @click="onRapidFilling" class="leftChaxun wigthsP">
                {{t('carbon.message.fill_in_quickly')}}</a-button
              ><a-button @click="ondsataSubmitAform" class="leftChaxun wigthsP">
              {{t('carbon.message.data_reporting')}}</a-button
            >
            </div>
          </div>
          <div class="tpfstyle">
            <div class="leftTpfstyle">
              <div class="title1 marbons" style="font-weight: 400 !important">
                {{t('carbon.message.fill_in_the_progress')}}
              </div>
              <div style="display: flex; justify-content: center">
                <a-progress
                  :strokeWidth="20"
                  :percent="statisticObj.percent"
                  :strokeColor="'#56C08D'"
                  :showInfo="false"
                  style="width: 588px"
                />
              </div>
              <div class="progress">
                <div class="left">
                  <div class="borer"></div>
                  <div class="twxt">
                    {{t('carbon.message.completed_item')}} <span>{{ statisticObj.completeItemNo }}</span>
                  </div>
                </div>
                <div class="right">
                  <div class="borer"></div>
                  <div class="twxt">
                    {{t('carbon.message.unreported_item')}} <span>{{ statisticObj.noCompleteItemNo }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="rightTpfstyle">
              <div class="title1" style="font-weight: 400 !important">
                {{t('carbon.message.carbon_emissions')}}
              </div>
              <div class="fleisonw">
                <div class="left">
                  <div class="flexsw">
                    <div class="texts">{{ carbonObj.total }}</div>
                    <div class="texts1">tCO₂e</div>
                  </div>
                  <div class="bottom32">
                    <div class="boLeft">
                      {{t('carbon.message.last_year')}}： <span>{{ carbonObj.preTotal }}tCO₂e</span>
                    </div>
                    <div class="boRight">
                      {{t('carbon.message.year_on_year')}}： <span>{{ carbonObj.increase }}%</span>
                    </div>
                  </div>
                </div>
                <div class="right">
                  <div class="tighTiles">{{t('carbon.message.energy_using_carbon_emission')}}</div>
                  <div class="tighTile1 marbons1">
                    {{ carbonObj.cost }}tCO₂e
                  </div>
                  <div class="tighTiles">{{t('carbon.message.emission_reduction_measures')}}</div>
                  <div class="tighTile1">{{ carbonObj.green }}tCO₂e</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="fourTyles">
          <div class="letffour">
            <div class="title1 fourFlex">
              {{t('carbon.message.carbon_emission_analysis')}}
            </div>
            <div class="fourswFlex">
              <div id="leftFourpie"></div>
            </div>
          </div>
          <div class="righfour">
            <div class="title1 fourFlex">{{t('carbon.message.Emissions_from_emission_sources')}}（TOP5）</div>
            <div id="salesfour"></div>
          </div>
        </div>
        <div class="sanchitouScna">
          <div class="title1">{{t('carbon.message.carbon_emission_and_diversion_diagram_of_enterprises')}}</div>
          <div id="sanchitou"></div>
        </div>
        <div class="tabse">
          <a-tabs default-active-key="1" @tabClick="callback">
            <a-tab-pane
              :key="item.categoryId"
              :tab="item.name"
              v-for="item in category"
            ></a-tab-pane>
          </a-tabs>
          <div class="tabseFlex">
            <div class="sanchLefts">
              <div class="title1">{{t('carbon.message.carbon_emissions')}}</div>
              <div class="sanchTxt">
                {{ threeoBj.left.totalCarbon }}
                <span>tCO₂e</span>
              </div>
              <div class="boLeft marb">
                {{t('carbon.message.last_year')}}： <span>{{ threeoBj.left.lastYearTotalCarbon }}tCO₂e</span>
              </div>
              <div class="boRight">
                {{t('carbon.message.year_on_year')}}： <span>{{ threeoBj.left.percent }}%</span>
              </div>
            </div>
            <div class="sanchCenter">
              <div class="title1">{{t('carbon.message.share_of_greenhouse_gas_emissions')}}</div>
              <div class="ovflowe">
                <div
                  class="sanchProgress"
                  v-for="(item, index) in threeoBj.mid"
                  :key="index"
                >
                  <div class="leftPRopgrss">{{ item.name }}</div>
                  <div class="swFlex">
                    <a-progress
                      :strokeWidth="10"
                      :percent="item.percent"
                      :showInfo="false"
                      style="width: 250px"
                      :strokeColor="'#56C08D'"
                    />
                    <div style="margin-left:10px">{{ item.percent }}%</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="sanchRights">
              <div class="title1">{{t('carbon.message.carbon_emission_analysis')}}</div>
              <div id="sanchRBars"></div>
            </div>
          </div>
        </div>
        <div class="sanchitouLines">
          <div class="title1 flex">
            {{t('carbon.message.trend_analysis')}}
            <a-select
              style="width: 84px; height: 40px !important"
              v-model:value="timeType"
              @change="getDataByMonthType"
            >
              <a-select-option
                v-for="province in timeProvinceData"
                :key="province.value"
              >
                {{ province.title }}
              </a-select-option>
            </a-select>
          </div>
          <div id="sanchitouLines"></div>
        </div>
        <div class="sanchitouLines ovflowe">
          <div class="swFlex" style="justify-content: space-between;">
            <div class="title1 flex">{{t('carbon.message.composition_analysis')}}</div>
            <a-button type="primary" icon="download" @click="onExport">{{t('carbon.message.Export')}}</a-button>
          </div>
          <div class="collapse-tpyz">
            <a-collapse v-model:activeKey="activeCollapseKey">
              <a-collapse-panel
                v-for="(item, idex) in collapseData"
                :key="item.id"
                :header="item.name"
              >
                <div
                  class="collaose-center"
                  v-for="(value, idese) in item.children"
                  :key="idese"
                >
                  <div
                    class="collaoseFlex collaose-marn"
                    style="justify-content: space-between"
                  >
                    <div class="collaose-title">
                      <img src="@/assets/carbon/img1.png" alt="" />
                      {{ value.name }}
                    </div>
                    <div class="collaoseFlex">
                      <div class="collaose-texts collaoseFlex collaose-rights">
                        <div>{{t('carbon.message.proportion_of_total_emission_reduction')}}：</div>
                        <div class="posrs">
                          <el-progress
                            :stroke-width="15"
                            :color="'#FFB98C'"
                            :percentage="value.greenPer"
                            style="width: 200px"
                          ></el-progress>
                          <div class="colosw1">
                            {{ value.green }}
                          </div>
                        </div>
                      </div>
                      <div class="collaose-texts collaoseFlex collaose-ris">
                        <div>{{t('carbon.message.total_carbon_emission')}}：</div>
                        <div class="posrs">
                          <el-progress
                            :stroke-width="15"
                            :color="'#92DAB2'"
                            :percentage="value.costPer"
                            style="width: 200px"
                          ></el-progress>
                          <div class="colosw">
                            {{ value.carbon }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="collapse-table">
                    <a-table
                      :columns="columns1"
                      :data-source="value.emissionSourceList"
                      :pagination="false"
                      rowKey="id"
                    >
                      <template #type="{ text }">
                        {{ t(text ==2 ?'carbon.message.reduce_harmful_emissions':"carbon.message.Emission") }}
                      </template>
                      <template
                        #operation="{ record }"
                      >
                        <div
                          style="display: flex; align-items: center"
                          v-if="record.type == 1"
                        >
                          <div class="coloT1">{{ record.costPer }}%</div>
                          <el-progress
                            :show-text="false"
                            :stroke-width="8"
                            :color="'#92DAB2'"
                            :percentage="record.costPer"
                            style="width: 200px"
                          ></el-progress>
                        </div>
                        <div style="display: flex; align-items: center" v-else>
                          <div class="coloT2">{{ record.greenPer }}%</div>
                          <el-progress
                            :show-text="false"
                            :stroke-width="8"
                            :color="'#FFB98C'"
                            :percentage="record.greenPer"
                            style="width: 200px"
                          ></el-progress>
                        </div>
                      </template>
                    </a-table>
                  </div>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </div>
      </div>
      <!-- 底部数据 -->
      <div class="bottom" v-if="examineId && isAss">
        <div class="flex2">
          <div class="bottom-flex">
            <div class="text">{{t('carbon.message.total_release')}}：</div>
            <div class="text1">{{ carbonObj.total }}</div>
            <div class="text2">tCO₂e</div>
          </div>
          <div class="bottom-flex">
            <div class="text3">{{t('carbon.message.total_energy_carbon_emission')}}：</div>
            <div class="text4">{{ carbonObj.cost }}</div>
            <div class="text5">tCO₂e</div>
          </div>
          <div class="bottom-flex">
            <div class="text3">{{t('carbon.message.reduce_harmful_emissions')}}：</div>
            <div class="text4">{{ carbonObj.green }}</div>
            <div class="text5">tCO₂e</div>
          </div>
        </div>
        <div class="flex1" v-if="twoType == 2">
          <a-button
            @click="onArchivist"
            v-if="!guidangIsAss"
            class="leftChaxun wigthsP"
          >
            {{t('carbon.message.Archive')}}</a-button
          >
          <a-button
            @click="revocationOnArchivist"
            v-else-if="guidangIsAss && isOrgAdmin"
            class="leftChaxun2 wigthsP"
          >
            {{t('carbon.message.withdraw_archive')}}</a-button
          >
        </div>
      </div>
      <div class="kongs" v-if="!isAss">
        <img src="@/assets/carbon/img13.png" alt="" />
        <div class="zanuw">{{t('carbon.message.No_data')}}</div>
        <div class="zanuwTitle">{{t('carbon.message.please_click_on_the_button_below_to_fill_in')}}</div>
        <div class="nuisw" @click="dataSubmitAform">{{t('carbon.message.start_reporting')}}</div>
      </div>
    </a-card>
    <section class="m_popupBox" v-if="isShowDetailPopup">
      <tpyzDetail
        ref="tpyzDetailRef"
        @back="back"
        :newForm="newForm">
      </tpyzDetail>
    </section>
    <a-modal
      :title="t('carbon.message.Carbon_inventory_report')"
      :visible="visible"
      @ok="handleCancel"
      @cancel="handleCancel"
    >
      <div class="flecCenter">
        <div class="modalFlexs">
          <img src="@/assets/carbon/img14.png" alt="" />
          <div>
            {{ downloadObj.targetName }}-{{ downloadObj.year }}-{{t('carbon.message.Carbon_inventory_report')}}
          </div>
        </div>
        <a-button
          type="primary"
          icon="download"
          :size="size"
          @click="exportXlsTemplate"
        >
          {{t('carbon.message.Download')}}
        </a-button>
        <div class="modalFlexs1" @click="generateCarbonReport">
          <div>{{t('carbon.message.Regenerate')}}</div>
          <img src="@/assets/carbon/img15.png" alt="" />
        </div>
        <div class="flwMondes">{{t('carbon.message.Last_generation_date')}}：{{ downloadObj.updateTime }}</div>
      </div>
    </a-modal>
    <section class="m_popupBox" v-if="rapidFillingShow">
      <rapidFilling
        ref="rapidFillingRef"
        :examineId="form.examineId"
        @onRapoidBack="onRapoidBack"
      ></rapidFilling>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import * as echarts from "echarts";
import dayjs from 'dayjs';
import rapidFilling from "/@/components/common/rapidFilling.vue";
import tpyzDetail from "/@/components/common/carbonReportingDetail.vue";
import { kanbanApi } from './kanban.api';
import {useI18n} from '/@/hooks/web/useI18n';
const { t } = useI18n();

// Props
const props = defineProps({
  examineId: {
    type: String,
    default: "",
  },
  twoType: {
    type: Number,
    default: 0,
  },
});

// Emits
const emit = defineEmits(['onKanbanBack']);

// 响应式数据
const size = ref('large');
const visible = ref(false);
const rapidFillingShow = ref(false);
const isShowDetailPopup = ref(false);
const provinceData = ref([]);
const colorList = ref([
  "#1BC08A",
  "#81E0DB",
  "#FFC439",
  "#FF8C73",
  "#F35571",
  "#2C57FF",
]);
const costCalcProvinceData = ref([]);
const timeProvinceData = ref([
  {
    title: '季度', // 这里应该使用 t('carbon.message.quarter')
    value: "2",
  },
  {
    title: '月度', // 这里应该使用 t('carbon.message.month')
    value: "3",
  },
]);
const timeType = ref("2");
const monthFormat = ref("YYYY");
const yearOpen = ref(false);
const form = ref({
  examineId: "",
  year: "",
  standraId: undefined,
  orgId: undefined,
});
const columns = ref([
  {
    title: '会计主体', // 这里应该使用 t('carbon.message.Accounting_entity')
    dataIndex: "targetName",
    align: "center",
  },
  {
    title: '会计标准', // 这里应该使用 t('carbon.message.Accounting_standard')
    align: "center",
    dataIndex: "standardName",
  },
  {
    title: '会计日期', // 这里应该使用 t('carbon.message.Accounting_date')
    align: "center",
    dataIndex: "year",
  },
  {
    title: '操作', // 这里应该使用 t('carbon.message.Handle')
    align: "center",
    dataIndex: "operation",
    slots: { customRender: "operation" },
  },
]);
const columns1 = ref([
  {
    title: '排放源', // 这里应该使用 t('carbon.message.Emission_source')
    dataIndex: 'emissionSourceName',
    align: 'center'
  },
  {
    title: '设施/活动', // 这里应该使用 t('carbon.message.facilities_activities')
    dataIndex: 'activitieName',
    align: 'center'
  },
  {
    title: '排放类型', // 这里应该使用 t('carbon.message.Emission_type')
    dataIndex: 'type',
    align: 'center',
    slots: { customRender: 'type' }
  },
  {
    title: '活动数据', // 这里应该使用 t('carbon.message.Active_data')
    align: "center",
    dataIndex: "data",
  },
  {
    title: `CO₂e排放因子值`, // 这里应该使用 t('carbon.message.Emission_factor_value')
    dataIndex: 'cost',
    align: 'center'
  },
  {
    title: '碳排放/减排比例', // 这里应该使用 t('carbon.message.carbon_emission_emission_reduction_ratio')
    align: "center",
    width: 280,
    dataIndex: "operation",
    slots: { customRender: "operation" },
  },
]);
const fenestraData = ref([]);
const carbonObj = ref({}); // 碳排放量
const analysisArr = ref([]); // 碳排分析
const analysSelectValue = ref(1);
const analysSelect = ref([
  {
    value: 1,
    title: '类别', // 这里应该使用 t('carbon.message.category')
  },
  {
    value: 2,
    title: '排放源', // 这里应该使用 t('carbon.message.Emission_source')
  },
]); // 碳排下拉框
const cateId = ref(""); // 查询id中部三合一
const category = ref([]);
const threeoBj = ref({
  left: {},
  mid: [],
  right: [],
}); // 中部三合一数据
const collapseData = ref([]); // 底部数据
const activeCollapseKey = ref([]);
const checkStatistic = ref({});
const isAss = ref(true);
const statisticObj = ref({});
const newForm = ref({});
const guidangIsAss = ref(false); // 归档按钮切换
const downloadObj = ref({});
const isOrgAdmin = ref(false);
const isShow = ref(false);

// Refs
const tpyzDetailRef = ref();
const rapidFillingRef = ref();

// 初始化
onMounted(() => {
  // 这里应该从用户存储中获取 isOrgAdmin，例如：Vue.ls.get("isOrgAdmin")
  // isOrgAdmin.value = Vue.ls.get("isOrgAdmin");
  form.value.examineId = props.examineId;

  if (props.examineId) {
    unify();
    if (props.twoType == 2) {
      queryByCheckCheckId();
      getDetail();
    }
  } else {
    queryTreeList();
    getCheckStatistic(); // 盘查情况
    getNoSubmitCheck(); // 正在排查
  }
});

// 方法定义
const onExport = () => {
  kanbanApi.createPdf({
    orgCheckCheckId: form.value.examineId
  }).then(res => {
    if (res.success) {
      // 这里应该使用 this.$message.success
      // this.$message.success('导出构成分析成功')
      setTimeout(() => {
        let url = window._CONFIG['domianURL'] + res.result;
        window.open(url, '_blank');
      }, 500);
    } else {
      // this.$message.error(res.message)
    }
  });
};

const onRapoidBack = () => {
  rapidFillingShow.value = false;
  unify();
};

/**
 * 下载报告
 */
const exportXlsTemplate = () => {
  // 使用 fileApi 下载文件
  kanbanApi.downloadFile(window._CONFIG["domianURL"] + downloadObj.value.downloadUrl);
};

const viewCancel = () => {
  visible.value = true;
};

const handleCancel = () => {
  visible.value = false;
};

/**
 * 撤回归档
 */
const revocationOnArchivist = () => {
  kanbanApi.republish({
    id: form.value.examineId,
  }).then((res) => {
    if (res.success) {
      // this.$message.success(res.message);
      guidangIsAss.value = false;
    }
  });
};

/**
 * 归档
 */
const onArchivist = () => {
  kanbanApi.publish({
    id: form.value.examineId,
  }).then((res) => {
    if (res.success) {
      // this.$message.success(res.message);
      guidangIsAss.value = true;
    }
  });
};

/**
 * 查询是否生成过报告
 */
const queryByCheckCheckId = () => {
  kanbanApi.queryByCheckCheckId({
    orgCheckCheckId: form.value.examineId,
  }).then((res) => {
    if (res.success) {
      downloadObj.value = res.result;
    }
  });
};

/**
 * 生成碳报告
 */
const generateCarbonReport = () => {
  kanbanApi.saveOrUpdateReport({
    orgCheckCheckId: form.value.examineId,
  }).then((res) => {
    if (res.success) {
      visible.value = true;
      downloadObj.value = res.result;
      // this.$message.success(this.t('carbon.message.operation_success'))
    }
  });
};

/**
 * 快速填报
 */
const onRapidFilling = () => {
  rapidFillingShow.value = true;
  nextTick(() => {
    rapidFillingRef.value.changeCheckTemplateId(form.value.examineId);
  });
};

/**
 * 统一接口调用
 */
const unify = () => {
  carbonCheckSubmitData(); // 碳排放量统计部分
  carbonCheckChartRightData(); // 设施/活动碳排放
  getSangJiTable(); // 桑基图
  getHasDataCategory(); // 中部三合一获取有类别分类
  getDataByMonthType(); // 趋势分析
  bottomTable(); // 底部数据
  statisticCompleteItem();
};

const onBack = () => {
  emit("onKanbanBack");
};

const customRow = (record: any, index: number) => {
  return {
    style: {
      // 背景颜色
      "background-color": (index + 1) % 2 === 1 ? "#F3F3F3" : "#ffffff",
    },
  };
};

const callback = (e: any) => {
  console.log(e);
  cateId.value = e;
  carbonCategoryGasRes();
};

const back = () => {
  isShowDetailPopup.value = false;
  if (form.value.examineId) {
    unify();
  } else {
    getCheckStatistic(); // 盘查情况
    getNoSubmitCheck(); // 正在排查
  }
};

const ondsataSubmitAform = () => {
  newForm.value.checkId = form.value.examineId;
  newForm.value.standardId = form.value.standraId;
  newForm.value.targetId = form.value.orgId;
  newForm.value.year = form.value.year;
  isShowDetailPopup.value = true;
};

/**
 * 开始填报
 */
const dataSubmitAform = (value: any) => {
  console.log(value);
  kanbanApi.createNewCommonCheck({
    standardId: form.value.standraId,
    checkTargetId: form.value.orgId,
    year: form.value.year,
  }).then((res) => {
    if (res.success) {
      newForm.value.standardId = form.value.standraId;
      newForm.value.targetId = form.value.orgId;
      newForm.value.year = form.value.year;
      newForm.value.checkId = res.result.id;
      isShowDetailPopup.value = true;
    } else {
      // this.$message.warning(res.message);
    }
  });
};

/**
 * 填报
 */
const submitAform = (value: any) => {
  newForm.value.checkId = value.id;
  newForm.value.standardId = value.standardId;
  newForm.value.targetId = value.targetId;
  newForm.value.year = value.year;
  newForm.value.targetName = value.targetName;
  isShowDetailPopup.value = true;
};

/**
 * 更多
 */
const onOrganize = () => {
  // this.$router.push({
  //   path: "/carbonInventory/organize/index",
  // });
};

/**
 * 填报进度
 */
const statisticCompleteItem = () => {
  kanbanApi.getStatisticCompleteItem({
    id: form.value.examineId,
  }).then((res) => {
    if (res.success) {
      statisticObj.value = res.result;
    }
  });
};

/**
 * 根据主体标准和年份查询id
 */
const getCheckIdByYearAndStadranIdc = () => {
  isShow.value = false;
  kanbanApi.getCheckIdByYearAndStadranId(form.value).then(
    (res) => {
      if (res.success) {
        form.value.year = res.result.year;
        form.value.orgId = res.result.targetId;
        form.value.examineId = res.result.id;
        form.value.standraId = res.result.standardId;
        if (form.value.examineId) {
          isShow.value = true;
          unify();
          isAss.value = true;
        } else {
          isAss.value = false;
        }
      } else {
        isAss.value = false;
        // this.$message.error(res.message);
      }
    }
  );
};

/**
 * 正在排查
 */
const getNoSubmitCheck = () => {
  kanbanApi.getNoSubmitCheck().then((res) => {
    if (res.success) {
      fenestraData.value = res.result ? res.result.slice(0, 4) : [];
    }
  });
};

/**
 * 盘查情况
 */
const getCheckStatistic = () => {
  kanbanApi.getCheckStatistic().then((res) => {
    if (res.success) {
      checkStatistic.value = res.result;
    }
  });
};

/**
 * 底部数据
 */
const bottomTable = () => {
  kanbanApi.getBottomTable({
    id: form.value.examineId,
  }).then((res) => {
    if (res.success) {
      let resData = res.result || [];
      collapseData.value = resData;
      let activeCollapseKeyArr = [];
      resData.forEach((item) => {
        activeCollapseKeyArr.push(item.id);
      });
      activeCollapseKey.value = activeCollapseKeyArr;
    }
  });
};

/**
 * 趋势分析
 */
const getDataByMonthType = () => {
  kanbanApi.getDataByMonthType({
    id: form.value.examineId,
    type: timeType.value,
  }).then((res) => {
    if (res.success) {
      let salesProportionChart = echarts.init(
        document.getElementById("sanchitouLines")!
      );
      console.log(salesProportionChart);
      let optionPie = {
        color: ["#FA9550"],
        grid: {
          left: "1%",
          right: "0%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [],
            type: "line",
          },
        ],
      };
      for (var key in res.result) {
        optionPie.xAxis.data.push(key);
        optionPie.series[0].data.push(res.result[key]);
      }
      salesProportionChart.setOption(optionPie);
      window.addEventListener("resize", function () {
        salesProportionChart.resize();
      });
    }
  });
};

/**
 * 中部三合一获取
 */
const carbonCategoryGasRes = () => {
  kanbanApi.getCarbonCategoryGasRes({
    id: form.value.examineId,
    cateId: cateId.value,
  }).then((res) => {
    if (res.success) {
      threeoBj.value.left = res.result.left;
      threeoBj.value.mid = res.result.mid;
      threeoBj.value.right = res.result.right;
      let salesProportionChart = echarts.init(
        document.getElementById("sanchRBars")!
      );
      console.log(salesProportionChart);
      let optionPie = {
        color: ["#FA9550"],
        title: [
          {
            left: "left",
            left: "0%",
            top: "1.25%",
            subtext: '单位tCO₂e', // 这里应该使用 t('carbon.message.UnitTco2e')
            subtextStyle: {
              fontSize: 14,
            },
          },
        ],
        legend: {},
        grid: {
          left: "2%",
          right: "2%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 0, 0],
              },
            },
            type: "bar",
            data: [],
          },
        ],
      };
      threeoBj.value.right.forEach((item) => {
        optionPie.xAxis.data.push(item.name);
        optionPie.series[0].data.push(item.value);
      });
      salesProportionChart.setOption(optionPie);
      window.addEventListener("resize", function () {
        salesProportionChart.resize();
      });
    }
  });
};

/**
 * 中部三合一获取有类别分类
 */
const getHasDataCategory = () => {
  kanbanApi.getHasDataCategory({
    id: form.value.examineId,
  }).then((res) => {
    if (res.success) {
      category.value = res.result;
      cateId.value = category.value[0].categoryId;
      carbonCategoryGasRes();
    }
  });
};

/**
 * 桑基图
 */
const getSangJiTable = () => {
  kanbanApi.getSangJiTable({
    id: form.value.examineId,
  }).then((res) => {
    if (res.success) {
      let myChart = echarts.init(document.getElementById("sanchitou")!);
      myChart.hideLoading();
      let option = {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
          formatter: "{b}{c}tCO₂e",
        },
        series: [
          {
            type: "sankey",
            data: res.result.nodes,
            links: res.result.links,
            emphasis: {
              focus: "adjacency",
            },
            levels: [
              {
                depth: 0,
                itemStyle: {
                  color: "#fbb4ae",
                },
                lineStyle: {
                  color: "source",
                  opacity: 0.6,
                },
              },
              {
                depth: 1,
                itemStyle: {
                  color: "#b3cde3",
                },
                lineStyle: {
                  color: "source",
                  opacity: 0.6,
                },
              },
              {
                depth: 2,
                itemStyle: {
                  color: "#ccebc5",
                },
                lineStyle: {
                  color: "source",
                  opacity: 0.6,
                },
              },
              {
                depth: 3,
                itemStyle: {
                  color: "#decbe4",
                },
                lineStyle: {
                  color: "source",
                  opacity: 0.6,
                },
              },
            ],
            lineStyle: {
              curveness: 0.5,
            },
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    }
  });
};

/**
 * 设施/活动碳排放
 */
const carbonCheckChartRightData = () => {
  kanbanApi.getCarbonCheckChartRightData({
    id: form.value.examineId,
  }).then((res) => {
    if (res.success) {
      let salesProportionChart = echarts.init(
        document.getElementById("salesfour")!
      );
      console.log(salesProportionChart);
      let optionPie = {
        color: ["#2BA471"],
        title: [
          {
            left: "left",
            left: "0%",
            top: "1.25%",
            subtext: '单位tCO₂e', // 这里应该使用 t('carbon.message.UnitTco2e')
            subtextStyle: {
              fontSize: 14,
            },
          },
        ],
        legend: {},
        grid: {
          left: "0%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: [],
        },
        series: [
          {
            label: {
              show: true,
              position: "right",
            },
            itemStyle: {
              normal: {
                barBorderRadius: [0, 10, 10, 0],
              },
            },
            type: "bar",
            data: [],
          },
        ],
      };
      res.result.forEach((item) => {
        optionPie.yAxis.data.push(item.name);
        optionPie.series[0].data.push(item.value);
      });
      salesProportionChart.setOption(optionPie);
      window.addEventListener("resize", function () {
        salesProportionChart.resize();
      });
    }
  });
};

/**
 * 碳排分析
 */
const carbonCheckChartLeftData = (value?: any) => {
  kanbanApi.getCarbonCheckSubmitData({
    id: form.value.examineId,
    type: analysSelectValue.value,
  }).then((res) => {
    if (res.success) {
      analysisArr.value = res.result;
      console.log(analysisArr.value, "analysisArr");
      let salesProportionChart = echarts.init(
        document.getElementById("leftFourpie")!
      );
      let optionPie = {
        //格式化名称
        title : {
          show:true,
          text: carbonObj.value.total+'tCO₂e', // \n可以换行
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
            console.log( params.split('：'),666666666);
            //切割到冒号
            return params.split('：')[0];
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            return params.name.split('：')[0] + '：' + params.value + 'tCO₂e';
          },
        },
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 5
        },
        color: colorList.value,
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
            data:res.result,
            emphasis: {
              label: {
                show: true,
                fontSize: 15,
                fontWeight: 'bold'
              }
            },
          }
        ],
      };
      salesProportionChart.setOption(optionPie);
      window.addEventListener("resize", function () {
        salesProportionChart.resize();
      });
    }
  });
};

/**
 * 碳排放量统计部分
 */
const carbonCheckSubmitData = (value?: any) => {
  console.log(value);
  kanbanApi.getCarbonCheckSubmitData({
    id: form.value.examineId,
  }).then((res) => {
    if (res.success) {
      carbonObj.value = res.result;
      carbonCheckChartLeftData(); //碳排分析
    }
  });
};

/**
 * 时间选择
 */
const onopenelChange = (status: boolean) => {
  yearOpen.value = status;
};

/**
 * 时间选择
 */
const opanelChange = (value: any, mode: any) => {
  console.log(value, mode);
  form.value.year = dayjs(value).format("YYYY");
  yearOpen.value = false;
  getCheckIdByYearAndStadranIdc();
};

/**
 * 下拉框
 */
const loadorgId = () => {
  if (form.value.year && form.value.orgId && form.value.standraId) {
    getCheckIdByYearAndStadranIdc();
  }
};

/**
 * 核算标准
 */
const loadTreeRoot = (value?: any) => {
  console.log(value);
  kanbanApi.loadTreeRoot({
    pcode: "A01",
    async: true,
  }).then((res) => {
    if (res.success) {
      provinceData.value = res.result;
      getCheckIdByYearAndStadranIdc();
    }
  });
};

/**
 * 核算主体
 */
const queryTreeList = (value?: any) => {
  console.log(value);
  kanbanApi.queryTreeList().then((res) => {
    if (res.success) {
      costCalcProvinceData.value = res.result;
      loadTreeRoot(); //核算标准
    }
  });
};

// 为了兼容原有的方法名，添加别名
const getDetail = () => {
  // 这里应该实现具体逻辑
  console.log('getDetail method');
};
</script>

<style lang="less">
.collapse-tpyz {
  .ant-collapse {
    background: #fff !important;
    border: none !important;
    border-radius: 0 !important;
  }
  .ant-collapse-item {
    border: none !important;
  }
  .ant-collapse-content {
    background: #f5f7f6 !important;
  }
  .ant-collapse-content-box {
    padding: 24px 0 24px 48px !important;
  }
}
</style>

<style lang="less" scoped>
.swFlex{
  display: flex;
  align-items: center;
}
.flecCenter {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 14px;
}
.flwMondes {
  font-weight: 400;
  font-size: 12px;
  color: #888888;
}
.modalFlexs {
  display: flex;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }
  div {
    font-weight: 400;
    font-size: 16px;
    color: #333333;
  }
}

.modalFlexs1 {
  display: flex;
  align-items: center;
  img {
    width: 12px;
    height: 12px;
    margin-left: 6px;
  }
  div {
    font-weight: 400;
    font-size: 12px;
    color: #888888;
  }
}
.bonReport {
  display: flex;
  align-items: center;
  justify-content: end;
  margin-top: 24px;
  margin-right: 24px;
}
.kongs {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #F0F2F5;

  .zanuw {
    margin: 23px 0 8px;
    font-weight: 600;
  }
  .zanuwTitle {
    font-weight: 400;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
  }
  .nuisw {
    width: 88px;
    height: 32px;
    background: @primary-color !important;
    border-radius: 3px 3px 3px 3px;
    font-weight: 400;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 32px;
    cursor: pointer;
  }
}
.flex1 {
  display: flex;
  align-items: center;
  gap: 24px;
}
.flex2 {
  display: flex;
  align-items: baseline;
  gap: 54px;
}
.bottom {
  width: 100%;
  padding: 0px 24px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #e7e7e7;
  background: #ffffff;
  position: absolute;
  bottom: 24px;

  .bottom-flex {
    display: flex;
    align-items: baseline;
  }
  .text {
    font-weight: 400;
    font-size: 18px;
    color: #333333;
  }

  .text1 {
    font-weight: 500;
    font-size: 32px;
    color: @primary-color !important;
    margin-right: 14px;
  }

  .text2 {
    font-weight: 400;
    font-size: 22px;
    color: @primary-color !important;
  }

  .text3 {
    font-weight: 400;
    font-size: 16px;
    color: #333333;
  }

  .text4 {
    font-weight: 500;
    margin-right: 14px;
    font-size: 18px;
    color: 333333;
  }

  .text5 {
    font-weight: 400;
    font-size: 16px;
    color: 333333;
  }
}
.ovflowe {
  overflow-y: scroll;
}
.coloT1 {
  font-weight: 500;
  font-size: 12px;
  color: @primary-color !important;
  margin-right: 8px;
  white-space: nowrap;
}
.coloT2 {
  font-weight: 500;
  font-size: 12px;
  margin-right: 8px;
  color: #be5a00;
  white-space: nowrap;
}
.collaose-ris {
  /deep/.el-progress__text {
    font-size: 10px !important;
    color: @primary-color !important;
  }
}

.collaose-rights {
  /deep/.el-progress__text {
    font-size: 10px !important;
    color: #be5a00 !important;
  }
}
.collaose-center {
  margin-bottom: 24px;
  .posrs {
    position: relative;
  }
  .colosw {
    font-size: 10px;
    color: #008858;
    position: absolute;
    top: 0;
    left: 35%;
  }
  .colosw1 {
    font-size: 10px;
    color: #be5a00;
    position: absolute;
    top: 0;
    left: 35%;
  }
  .collaoseFlex {
    display: flex;
    align-items: center;
  }
  .collaose-marn {
    margin-bottom: 14px;
  }
  .collaose-rights {
    margin-right: 50px;
  }
  .collaose-texts {
    font-weight: 400;
    font-size: 12px;
    color: #888888;
  }
  .collaose-title {
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
    img {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }
  }
  .collapse-table {
    margin-bottom: 14px;
  }

  .collapse-tian {
    border-radius: 3px 3px 3px 3px;
    border: 1px solid @primary-color !important;
    font-weight: 400;
    font-size: 12px;
    color: @primary-color !important;
    padding: 2px 8px;
    background: #ffffff;
    display: flex;
    align-items: center;
    img {
      width: 14px;
      height: 14px;
    }
  }
}
.collapse-tpyz {
  margin-top: 16px;
}
.cardHeader {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #000000;
  margin-bottom: 24px;

  .cardHeader_icon {
    width: 16px;
    height: 16px;
  }
}
.testFlex {
  display: flex;
  padding: 24px 24px 0;
  gap: 24px;
  .letftRacharts {
    padding: 16px 24px 31px;
    width: 50%;

    background: #ffffff;
    .msw {
      margin-bottom: 41px !important;
    }
    .vauFlexs {
      display: flex;
      align-items: center;
      gap: 37px;
    }
    .title {
      font-weight: 400;
      font-size: 16px;
      color: #333333;
    }
    .valueLeft {
      font-weight: 600;
      font-size: 38px;
      color: @primary-color !important;
    }
    .valueRight {
      font-weight: 400;
      font-size: 14px;
      color: #333333;
    }
    .value1 {
      font-weight: 400;
      font-size: 14px;
      color: #888888;
    }
    .value2 {
      font-weight: 400;
      font-size: 14px;
      color: #333333;
    }
    .value3 {
      font-weight: 400;
      font-size: 14px;
      color: #d54941;
    }
  }

  .rightRacharts {
    width: 50%;
    display: flex;
    flex-direction: column;
    row-gap: 17px;
    .titleTws {
      font-weight: 400;
      font-size: 16px;
      color: #333333;
    }
    .oneFlex {
      padding: 24px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .valueLeft {
      font-weight: 600;
      font-size: 28px;
      color: @primary-color !important;
    }
    .valueRight {
      font-weight: 400;
      font-size: 14px;
      color: #333333;
    }
  }
  .letfwFlex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
#sanchitouLines {
  width: 98%;
  height: 550px;
}
.tabse {
  background: #ffffff;
  margin-top: 24px;
}
.tabseFlex {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 24px 24px;
}
#sanchRBars {
  width: 90%;
  height: 300px;
}
.sanchRights {
  width: 58%;
  height: 368px;
  background: rgba(250, 222, 208, 0.29);
  border-radius: 2px 2px 2px 2px;
  padding: 24px 24px 19px 24px;
}
.sanchCenter {
  width: 29%;
  height: 368px;
  background: rgba(227, 249, 233, 0.29);
  border-radius: 2px 2px 2px 2px;
  padding: 24px 24px 26px 24px;
  overflow: hidden;
  .ovflowe {
    height: 300px;
  }
  // overflow-y: scroll;
  /deep/.ant-progress-inner {
    background: #ececec !important;
  }
  .sanchProgress {
    display: flex;
    align-items: center;
    .leftPRopgrss {
      width: 40%;
    }
    div {
      font-weight: 400;
      font-size: 16px;
      color: #888888;
    }
  }
}
.sanchLefts {
  width: 20%;
  height: 368px;
  background: rgba(214, 221, 255, 0.3);
  border-radius: 2px 2px 2px 2px;
  padding: 24px 24px 60px 24px;
  .marb {
    margin-bottom: 21px;
  }
  .sanchTxt {
    font-weight: 600;
    font-size: 38px;
    color: @primary-color !important;
    display: flex;
    align-items: baseline;
    margin-top: 71px;
    margin-bottom: 71px;
    span {
      font-weight: 400;
      font-size: 14px;
      color: #333333;
    }
  }
  .boLeft {
    font-weight: 400;
    font-size: 14px;
    color: #888888;
    span {
      font-weight: 400;
      font-size: 14px;
      color: #333333;
    }
  }
  .boRight {
    font-weight: 400;
    font-size: 14px;
    color: #888888;
    span {
      font-weight: 400;
      font-size: 14px;
      color: #d54941;
    }
  }
}
.sanchitouScna {
  height: 614px;
  background: #ffffff;
  padding: 24px;
  margin-top: 24px;
}

.sanchitouLines {
  height: 621px;
  background: #ffffff;
  padding: 24px;
  margin-top: 24px;
}
#sanchitou {
  width: 100%;
  height: 500px;
  margin-top: 38px;
}
.listFour {
  display: flex;
  align-items: center;
  gap: 12px;
  .lisFours {
    width: 8px;
    background: #1bc08a;
    height: 8px;
    border-radius: 50%;
  }
  .lisFours1 {
    font-weight: 400;
    font-size: 16px;
    color: #777777;
  }

  .lisFours2 {
    font-weight: 400;
    font-size: 14px;
    color: #2b7450;
  }
}
#leftFourpie {
  height: 400px;
  width: 100%
}
#salesfour {
  width: 90%;
  //   flex: 1;
  height: 400px;
}
/deep/ .ant-card-body {
  background: #f5f8f7;
  padding: 0 !important;
}
.fourTyles {
  display: flex;
  width: 100%;
  gap: 24px;
  .letffour {
    padding: 24px;
    background: #fff;
    width: 50%;
    .fourFlex {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .righfour {
    width: 50%;
    padding: 24px;
    background: #fff;
    display: flex;
    flex-direction: column;
  }
}
.marbons {
  margin-bottom: 45px;
}
.paddingx {
  padding: 24px;
}

.paddingx1 {
  padding: 24px 24px 125px;
}

.marbons1 {
  margin-bottom: 26px;
}
.sansTyles {
  background-color: #fff;
  padding: 24px 24px 46px;
  margin-bottom: 24px;

  .tpfstyle {
    display: flex;
    gap: 24px;
    .leftTpfstyle {
      flex: 1;
      padding: 16px 24px;
      background-color: #fbfbfb;
      .progress {
        display: flex;
        align-items: center;
        gap: 53px;
        justify-content: center;
        margin-top: 27px;
        .left {
          display: flex;
          align-items: center;
          .borer {
            width: 7px;
            height: 7px;
            background: @primary-color !important;
            border-radius: 1px 1px 1px 1px;
            margin-right: 4px;
          }

          .twxt {
            font-weight: 400;
            font-size: 12px;
            line-height: 0;
            color: #1c212b;
            span {
              font-weight: 500;
              font-size: 16px;
              color: #3e3e41;
            }
          }
        }
        .right {
          display: flex;
          align-items: center;
          .borer {
            width: 7px;
            height: 7px;
            background: #f0f0f0;
            border-radius: 1px 1px 1px 1px;
            margin-right: 4px;
          }

          .twxt {
            font-weight: 400;
            font-size: 12px;
            color: #1c212b;
            line-height: 0;
            span {
              font-weight: 500;
              font-size: 16px;
              color: #3e3e41;
            }
          }
        }
      }
    }
    .rightTpfstyle {
      flex: 1;
      padding: 16px 24px;
      background-color: #fbfbfb;
      .fleisonw {
        display: flex;
        align-items: end;
        gap: 153px;
        .left {
          display: flex;
          flex-direction: column;
          justify-content: end;
          .flexsw {
            display: flex;
            align-items: baseline;
            .texts {
              font-weight: 600;
              font-size: 38px;
              color: @primary-color !important;
            }
            .texts1 {
              font-weight: 400;
              font-size: 14px;
              color: #333333;
            }
          }
          .bottom32 {
            display: flex;
            align-items: center;
            margin-top: 23px;
            gap: 37px;
            .boLeft {
              font-weight: 400;
              font-size: 14px;
              color: #888888;
              span {
                font-weight: 400;
                font-size: 14px;
                color: #333333;
              }
            }
            .boRight {
              font-weight: 400;
              font-size: 14px;
              color: #888888;
              span {
                font-weight: 400;
                font-size: 14px;
                color: #d54941;
              }
            }
          }
        }
        .right {
          .tighTiles {
            font-weight: 400;
            font-size: 14px;
            color: #888888;
            margin-bottom: 17px;
          }
          .tighTile1 {
            font-weight: 400;
            font-size: 14px;
            color: #333333;
          }
        }
      }
    }
  }
}

.setins {
  background: #ffffff;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 9px 48px;
  margin-right: 24px;
  margin-left: 24px;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.gengduo {
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  img {
    width: 16px;
    height: 16px;
  }
}
.color {
  color: #2c57ff;
  font-weight: bold;
  font-size: 34px !important;
  line-height: 0 !important;
}
.color1 {
  color: @primary-color !important;
  font-weight: bold;
  font-size: 34px !important;
  line-height: 0 !important;
}
.color2 {
  color: #e37318;
  font-weight: bold;
  font-size: 34px !important;
  line-height: 0 !important;
}
.color3 {
  color: #333333;
  font-weight: bold;
  font-size: 34px !important;
  line-height: 0 !important;
}
.title {
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  margin-bottom: 21px;
}
.title1 {
  font-weight: bold;
  font-size: 16px;
  color: #333333;
}
.centeet {
  overflow-y: scroll;
  background-color: #f5f7f6;
}

.topFlex {
  padding: 24px;
  display: flex;
  gap: 24px;
  .letftRacharts {
    background: #ffffff;
    border-radius: 6px 6px 6px 6px;
    padding: 22px 24px;
    width: 483px;
    .lists {
      font-weight: 400;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 64px;
      background: #f5f7f6;
      margin-bottom: 18px;
    }
  }

  .rightRacharts {
    background: #ffffff;
    border-radius: 6px 6px 6px 6px;
    padding: 22px 24px;
    flex: 1;
  }
}

.leftChaxun {
  background: @primary-color !important;
  color: #fff !important;
}
.leftChaxun:hover {
  background: @primary-color !important;
  color: #fff !important;
}

.leftChaxun2 {
  background: red !important;
  color: #fff !important;
}
.leftChaxun2.ant-collapse {
  background: red !important;
  color: #fff !important;
}
</style>
