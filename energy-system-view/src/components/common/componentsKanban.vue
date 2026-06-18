<template>
  <div class="centeet">
    <div class="top">
      <div
          class="cardHeader"
          style="display: flex; align-items: center; cursor: pointer"
          v-if="examineId"
      >
        <img
            class="cardHeader_icon m_hoverCP"
            src="../../assets/img/img28.png"
            alt=""
            @click="onBack"
        />
        <span @click="onBack">{{ t('carbon.message.Return') }}</span>
      </div>
      <div class="bonReport" v-if="examineId && twoType == 2">
        <a-button
            @click="viewCancel"
            v-if="DownloadObj.id"
            class="leftChaxun wigthsP"
        >
          {{ t('carbon.message.view_carbon_report') }}
        </a-button>
        <a-button
            @click="openDownloadPopup"
            v-else
            class="leftChaxun wigthsP"
        >
          {{ t('carbon.message.carbon_generation_report') }}
        </a-button>
      </div>
    </div>

    <a-card>
      <div class="topFlex" v-if="!examineId">
        <div class="letftRacharts">
          <div class="title">{{ t('carbon.message.Inventory_situation') }}</div>
          <div class="lists">
            {{ t('carbon.message.All') }} <span class="color">{{ checkStatistic["全部"] }}</span>
          </div>
          <div class="lists">
            {{ t('carbon.message.Filled_in') }}<span class="color1">{{ checkStatistic["已填报"] }}</span>
          </div>
          <div class="lists">
            {{ t('carbon.message.Filling_in') }}<span class="color2">{{ checkStatistic["填报中"] }}</span>
          </div>
          <div class="lists">
            {{ t('carbon.message.Archived') }}<span class="color3">{{ checkStatistic["已归档"] }}</span>
          </div>
        </div>
        <div class="rightRacharts">
          <div class="title flex">
            {{ t('carbon.message.Is_being_questioned') }}
            <div class="gengduo" @click="onOrganize">
              {{ t('carbon.message.more') }} <img src="../../assets/carbon/img8.png" alt="" />
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
                <a @click="() => submitAform(record)">{{ t('carbon.message.fill_in') }}</a>
              </div>
            </template>
          </a-table>
        </div>
      </div>
      <div class="testFlex" v-else>
        <div class="letftRacharts">
          <div class="title msw">{{ t('carbon.message.carbon_emissions') }}</div>
          <div class="letfwFlex">
            <div>
              <span class="valueLeft">{{ carbonObj.total }}</span>
              <span class="valueRight">tCO₂e</span>
            </div>
            <div class="vauFlexs">
              <div>
                <span class="value1">{{ t('carbon.message.last_year') }}：</span>
                <span class="value2">{{ carbonObj.preTotal }}tCO₂e</span>
              </div>
              <div>
                <span class="value1">{{ t('carbon.message.year_on_year') }}：</span>
                <span class="value3">{{ carbonObj.increase }}%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="rightRacharts">
          <div class="oneFlex">
            <span class="titleTws">{{ t('carbon.message.energy_using_carbon_emission') }}</span>
            <div>
              <span class="valueLeft">{{ carbonObj.cost }}</span>
              <span class="valueRight">tCO₂e</span>
            </div>
          </div>
          <div class="oneFlex">
            <span class="titleTws">{{ t('carbon.message.Green_emission_reduction') }}</span>
            <div>
              <span class="valueLeft">{{ carbonObj.green }}</span>
              <span class="valueRight">tCO₂e</span>
            </div>
          </div>
        </div>
      </div>
      <div class="setins" v-if="!examineId">
        <a-select
            style="width: 147px"
            :placeholder="t('carbon.message.Please_select')"
            v-model:value="form.orgId"
            @change="loadorgId"
        >
          <a-select-option
              v-for="province in costCalcProvinceData"
              :key="province.id"
          >
            {{ province.departName }}
          </a-select-option>
        </a-select>
        <a-date-picker
            style="width: 130px"
            v-model:value="form.year"
            :format="monthFormat"
            :valueFormat="monthFormat"
            :allowClear="false"
            mode="year"
            :open="yearOpen"
            @panelChange="opanelChange"
            @openChange="onopenelChange"
        />
        <a-select
            style="width: 200px"
            :placeholder="t('carbon.message.Please_select')"
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
      <div :class="{ paddingx: !examineId, paddingx1: examineId }" v-if="isAss">
        <div class="sansTyles" v-if="!examineId">
          <div class="flex collaose-center">
            <div class="title1" style="font-weight: bold ! !important">
              {{ form.year }}{{ t('carbon.message.carbon_emission_data') }}
            </div>
            <div class="flex1">
              <a-button @click="onRapidFilling" class="leftChaxun wigthsP">
                {{ t('carbon.message.fill_in_quickly') }}
              </a-button>
              <a-button @click="ondsataSubmitAform" class="leftChaxun wigthsP">
                {{ t('carbon.message.data_reporting') }}
              </a-button>
            </div>
          </div>
          <div class="tpfstyle">
            <div class="leftTpfstyle">
              <div class="title1 marbons" style="font-weight: 400 ! !important">
                {{ t('carbon.message.fill_in_the_progress') }}
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
                    {{ t('carbon.message.completed_item') }} <span>{{ statisticObj.completeItemNo }}</span>
                  </div>
                </div>
                <div class="right">
                  <div class="borer"></div>
                  <div class="twxt">
                    {{ t('carbon.message.unreported_item') }} <span>{{ statisticObj.noCompleteItemNo }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="rightTpfstyle">
              <div class="title1" style="font-weight: 400 !important">
                {{ t('carbon.message.carbon_emissions') }}
              </div>
              <div class="fleisonw">
                <div class="left">
                  <div class="flexsw">
                    <div class="texts">{{ carbonObj.total }}</div>
                    <div class="texts1">tCO₂e</div>
                  </div>
                  <div class="bottom32">
                    <div class="boLeft">
                      {{ t('carbon.message.last_year') }}： <span>{{ carbonObj.preTotal }}tCO₂e</span>
                    </div>
                    <div class="boRight">
                      {{ t('carbon.message.year_on_year') }}： <span>{{ carbonObj.increase }}%</span>
                    </div>
                  </div>
                </div>
                <div class="right">
                  <div class="tighTiles">{{ t('carbon.message.energy_using_carbon_emission') }}</div>
                  <div class="tighTile1 marbons1">
                    {{ carbonObj.cost }}tCO₂e
                  </div>
                  <div class="tighTiles">{{ t('carbon.message.emission_reduction_measures') }}</div>
                  <div class="tighTile1">{{ carbonObj.green }}tCO₂e</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="fourTyles">
          <div class="letffour">
            <div class="title1 fourFlex">
              {{ t('carbon.message.carbon_emission_analysis') }}
            </div>
            <div class="fourswFlex">
              <div id="leftFourpie"></div>
            </div>
          </div>
          <div class="righfour">
            <div class="title1 fourFlex">{{ t('carbon.message.Emissions_from_emission_sources') }}（TOP5）</div>
            <div id="salesfour"></div>
          </div>
        </div>
        <div class="sanchitouScna">
          <div class="title1">{{ t('carbon.message.carbon_emission_and_diversion_diagram_of_enterprises') }}</div>
          <div id="sanchitou"></div>
        </div>
        <div class="tabse">
          <a-tabs v-model:activeKey="activeTabKey" @tabClick="callback">
            <a-tab-pane
                :key="item.categoryId"
                :tab="item.name"
                v-for="item in category"
            ></a-tab-pane>
          </a-tabs>
          <div class="tabseFlex">
            <div class="sanchLefts">
              <div class="title1">{{ t('carbon.message.carbon_emissions') }}</div>
              <div class="sanchTxt">
                {{ threeoBj.left.totalCarbon }}
                <span>tCO₂e</span>
              </div>
              <div class="boLeft marb">
                {{ t('carbon.message.last_year') }}： <span>{{ threeoBj.left.lastYearTotalCarbon}}tCO₂e</span>
              </div>
              <div class="boRight">
                {{ t('carbon.message.year_on_year') }}： <span>{{ threeoBj.left.percent }}%</span>
              </div>
            </div>
            <div class="sanchCenter">
              <div class="title1">{{ t('carbon.message.share_of_greenhouse_gas_emissions') }}</div>
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
              <div class="title1">{{ t('carbon.message.carbon_emission_analysis') }}</div>
              <div id="sanchRBars"></div>
            </div>
          </div>
        </div>
        <div class="sanchitouLines">
          <div class="title1 flex">
            {{ t('carbon.message.trend_analysis') }}
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
            <div class="title1 flex">{{ t('carbon.message.composition_analysis') }}</div>
            <a-button type="primary" preIcon="ant-design:download-outlined" @click="onExport">{{ t('carbon.message.Export') }}</a-button>
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
                      <img src="../../assets/carbon/img1.png" alt="" />
                      {{ value.name }}
                    </div>
                    <div class="collaoseFlex">
                      <div class="collaose-texts collaoseFlex collaose-rights">
                        <div>{{ t('carbon.message.proportion_of_total_emission_reduction') }}：</div>
                        <div class="posrs">
                          <el-progress
                              :stroke-width="15"
                              :color="'@primary-color'"
                              :percentage="value.greenPer"
                              style="width: 200px"
                          ></el-progress>
                        </div>
                      </div>
                      <div class="collaose-texts collaoseFlex collaose-ris">
                        <div>{{ t('carbon.message.total_carbon_emission') }}：</div>
                        <div class="posrs">
                          <el-progress
                              :stroke-width="15"
                              :color="'@primary-color'"
                              :percentage="value.costPer"
                              style="width: 200px"
                          ></el-progress>
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
                        {{ t(text == 2 ? 'carbon.message.reduce_harmful_emissions' : "carbon.message.Emission") }}
                      </template>
                      <template #operation="{ record }">
                        <div
                            style="display: flex; align-items: center"
                            v-if="record.type == 1"
                        >
                          <div class="coloT1">{{ record.costPer }}%</div>
                          <el-progress
                              :show-text="false"
                              :stroke-width="8"
                              :color="'@primary-color'"
                              :percentage="record.costPer"
                              style="width: 200px"
                          ></el-progress>
                        </div>
                        <div style="display: flex; align-items: center" v-else>
                          <div class="coloT2">{{ record.greenPer }}%</div>
                          <el-progress
                              :show-text="false"
                              :stroke-width="8"
                              :color="'@primary-color'"
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
            <div class="text">{{ t('carbon.message.total_release') }}：</div>
            <div class="text1">{{ carbonObj.total }}</div>
            <div class="text2">tCO₂e</div>
          </div>
          <div class="bottom-flex">
            <div class="text3">{{ t('carbon.message.total_energy_carbon_emission') }}：</div>
            <div class="text4">{{ carbonObj.cost }}</div>
            <div class="text5">tCO₂e</div>
          </div>
          <div class="bottom-flex">
            <div class="text3">{{ t('carbon.message.reduce_harmful_emissions') }}：</div>
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
            {{ t('carbon.message.Archive') }}
          </a-button>
          <a-button
              @click="revocationOnArchivist"
              v-else-if="guidangIsAss && isOrgAdmin"
              class="leftChaxun2 wigthsP"
          >
            {{ t('carbon.message.withdraw_archive') }}
          </a-button>
        </div>
      </div>
      <div class="kongs" v-if="!isAss">
        <img src="../../assets/carbon/img13.png" alt="" />
        <div class="zanuw">{{ t('carbon.message.No_data') }}</div>
        <div class="zanuwTitle">{{ t('carbon.message.please_click_on_the_button_below_to_fill_in') }}</div>
        <div class="nuisw" @click="dataSubmitAform">{{ t('carbon.message.start_reporting') }}</div>
      </div>
    </a-card>
    <section class="m_popupBox" v-if="isShowDetailPopup">
      <tpyzDetail
          ref="tpyzDetailRef"
          @back="back"
          :newForm="newForm"
      >
      </tpyzDetail>
    </section>
    <a-modal :title="t('carbon.message.Carbon_inventory_report')" :visible="visible" @ok="handleCancel" @cancel="handleCancel">
      <a-spin :spinning="createReportIng">
        <div class="flecCenter">
          <div class="modalFlexs">
            <img src="../../assets/carbon/img14.png" alt="" />
            <div>
              {{ DownloadObj.targetName }}-{{ DownloadObj.year }}-{{ t('carbon.message.Carbon_inventory_report') }}
            </div>
          </div>
          <a-button type="primary" preIcon="ant-design:download-outlined" :size="size" @click="exportXlsTemplate" v-if="DownloadObj.downloadUrl">{{ t('carbon.message.Download') }}</a-button>
          <a-button type="primary" preIcon="ant-design:download-outlined" :size="size" @click="generateReport(form.examineId)" v-else>{{ t('carbon.message.Generate') }}</a-button>
          <div class="modalFlexs1 m_hoverCP" @click="generateReport(form.examineId)">
            <div>{{ t('carbon.message.Regenerate') }}</div>
            <img src="../../assets/carbon/img15.png" alt="" />
          </div>
          <div class="flwMondes">{{ t('carbon.message.Last_generation_date') }}：{{ DownloadObj.updateTime }}</div>
        </div>
      </a-spin>
    </a-modal>
    <section class="m_popupBox" v-if="isRapidFilling">
      <rapidFilling
          ref="rapidFillingRef"
          :examineId="form.examineId"
          @onRapoidBack="onRapoidBack"
      ></rapidFilling>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import * as echarts from "echarts";
import { useRouter } from 'vue-router';
import dayjs from "dayjs";
import tpyzDetail from "./tpyzDetail.vue";
import rapidFilling from "./rapidFilling.vue";
import {
  getCheckStatistic,
  getNoSubmitCheck,
  getOrgAllSubjectOfCostCalc,
  loadTreeRoot,
  getCheckIdByYearAndStadranId,
  createNewCommonCheck,
  carbonCheckSubmitData,
  carbonCheckChartLeftData,
  carbonCheckChartRightData,
  getSangJiTable,
  getHasDataCategory,
  carbonCategoryGasRes,
  getDataByMonthType,
  bottomTable,
  statisticCompleteItem,
  publishCheck,
  republishCheck,
  queryCarbonReport,
  generateCarbonReport,
  exportPdf
} from './api/componentsKanban.api.ts';
import {getFileAccessHttpUrl} from "@/components/common/api/carbonReportingDetail.api";

// 国际化和消息
const { t } = useI18n();
const { createMessage } = useMessage();
const router = useRouter();

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

// Refs
const tpyzDetailRef = ref<any>(null);
const rapidFillingRef = ref<any>(null);

// Reactive data
const createReportIng = ref(false);
const size = ref("large");
const visible = ref(false);
const isRapidFilling = ref(false);
const isShowDetailPopup = ref(false);
const provinceData = ref<any[]>([]);
const colorList = ref(['#1BC08A','#81E0DB','#FFC439','#FF8C73','#F35571','#2C57FF']);
const costCalcProvinceData = ref<any[]>([]);
const timeProvinceData = ref([
  {
    title: t('carbon.message.quarter'),
    value: "2",
  },
  {
    title: t('carbon.message.month'),
    value: "3",
  },
]);
const timeType = ref("2");
const monthFormat = ref("YYYY");
const yearOpen = ref(false);
const activeTabKey = ref("");
const activeCollapseKey = ref<string[]>([]);

const form = reactive({
  examineId: "",
  year: "",
  standraId: undefined,
  orgId: undefined,
});

const columns = computed(() => [
  {
    title: t('carbon.message.Accounting_entity'),
    dataIndex: "targetName",
    align: "center",
  },
  {
    title: t('carbon.message.Accounting_standard'),
    align: "center",
    dataIndex: "standardName",
  },
  {
    title: t('carbon.message.Accounting_date'),
    align: "center",
    dataIndex: "year",
  },
  {
    title: t('carbon.message.Handle'),
    align: "center",
    dataIndex: "operation",
    slots: { customRender: "operation" },
  },
]);

const columns1 = computed(() => [
  {
    title: t('carbon.message.Emission_source'),
    dataIndex: 'emissionSourceName',
    align: 'center'
  },
  {
    title: t('carbon.message.facilities_activities'),
    dataIndex: 'activitieName',
    align: 'center'
  },
  {
    title: t('carbon.message.Emission_type'),
    dataIndex: 'type',
    align: 'center',
    slots: { customRender: 'type' }
  },
  {
    title: t('carbon.message.Active_data'),
    align: "center",
    dataIndex: "data",
  },
  {
    title: `CO₂e${t('carbon.message.Emission_factor_value')}`,
    dataIndex: 'cost',
    align: 'center'
  },
  {
    title: t('carbon.message.carbon_emission_emission_reduction_ratio'),
    align: "center",
    width: 280,
    dataIndex: "operation",
    slots: { customRender: "operation" },
  },
]);

const fenestraData = ref<any[]>([]);
const carbonObj = ref<any>({});
const analysisArr = ref<any[]>([]);
const analysSelectValue = ref(1);
const cateId = ref("");
const category = ref<any[]>([]);
const threeoBj = ref({
  left: {},
  mid: [],
  right: [],
});
const collapseData = ref<any[]>([]);
const LeftData = ref("");
const checkStatistic = ref({});
const isAss = ref(true);
const statisticObj = ref({});
const newForm = ref<any>({});
const guidangIsAss = ref(false);
const baogaoIsAss = ref(false);
const DownloadObj = ref<any>({});

// Methods
const onRapoidBack = () => {
  isRapidFilling.value = false;
  unify();
};

const openDownloadPopup = () => {
  visible.value = true;
  if (!DownloadObj.value.downloadUrl) {
    generateCarbonReportMethod();
  }
};

const exportXlsTemplate = () => {
  let url = getFileAccessHttpUrl(DownloadObj.value.downloadUrl)
  window.open(url, '_blank');
};

const viewCancel = () => {
  visible.value = true;
};

const handleCancel = () => {
  visible.value = false;
};

const generateReport = (orgCheckCheckId: string) =>{
  generateCarbonReport( {orgCheckCheckId:orgCheckCheckId}).then((res) => {
    if (res.success) {
      DownloadObj.value = res.result;
      createMessage.success(t('carbon.message.operation_success'))
    }else {
      createMessage.error(res.message);
    }
  })
}

const revocationOnArchivist = () => {
  republishCheck({
    id: form.examineId,
  }).then((res) => {
    if (res.success) {
      createMessage.success(t('carbon.message.operation_success'));
      guidangIsAss.value = false;
    }
  });
};

const onArchivist = () => {
  publishCheck({
    id: form.examineId,
  }).then((res) => {
    if (res.success) {
      createMessage.success(t('carbon.message.operation_success'));
      guidangIsAss.value = true;
    }
  });
};

const queryByCheckCheckId = () => {
  queryCarbonReport({
    orgCheckCheckId: form.examineId,
  }).then((res) => {
    if (res.success) {
      DownloadObj.value = res.result;
    }
  });
};

const generateCarbonReportMethod = () => {
  createReportIng.value = true;
  generateCarbonReport({
    orgCheckCheckId: form.examineId,
  }).then((res) => {
    if (res.success) {
      DownloadObj.value = res.result;
      createMessage.success(t('carbon.message.operation_success'));
    } else {
      createMessage.error(res.message);
    }
  }).finally(() => {
    createReportIng.value = false;
  });
};

const onRapidFilling = () => {
  isRapidFilling.value = true;
};

const unify = () => {
  carbonCheckSubmitDataMethod();
  carbonCheckChartRightDataMethod();
  getSangJiTableMethod();
  getHasDataCategoryMethod();
  getDataByMonthTypeMethod();
  bottomTableMethod();
  statisticCompleteItemMethod();
};

const onBack = () => {
  emit("onKanbanBack");
};

const customRow = (record: any, index: number) => {
  return {
    style: {
      "background-color": (index + 1) % 2 === 1 ? "#F3F3F3" : "#ffffff",
    },
  };
};

const callback = (e: string) => {
  cateId.value = e;
  carbonCategoryGasResMethod();
};

const back = () => {
  isShowDetailPopup.value = false;
  if (form.examineId) {
    unify();
  } else {
    getCheckStatisticMethod();
    getNoSubmitCheckMethod();
  }
};

const ondsataSubmitAform = () => {
  newForm.value.checkId = form.examineId;
  newForm.value.standardId = form.standraId;
  newForm.value.targetId = form.orgId;
  newForm.value.year = form.year;
  isShowDetailPopup.value = true;
};

const dataSubmitAform = (value: any) => {
  createNewCommonCheck({
    standardId: form.standraId,
    checkTargetId: form.orgId,
    year: form.year,
  }).then((res) => {
    if (res.success) {
      newForm.value.standardId = form.standraId;
      newForm.value.targetId = form.orgId;
      newForm.value.year = form.year;
      newForm.value.checkId = res.result.id;
      isShowDetailPopup.value = true;
      newForm.value.targetName = value.targetName;
    } else {
      createMessage.warning(res.message);
    }
  });
};

const submitAform = (value: any) => {
  newForm.value.checkId = value.id;
  newForm.value.standardId = value.standardId;
  newForm.value.targetId = value.targetId;
  newForm.value.year = value.year;
  newForm.value.targetName = value.targetName;
  isShowDetailPopup.value = true;
};

const onOrganize = () => {
  router.push({
    path: "/carbonInventory/organize/index",
  });
};

const statisticCompleteItemMethod = () => {
  statisticCompleteItem({
    id: form.examineId,
  }).then((res) => {
    if (res.success) {
      statisticObj.value = res.result;
    }
  });
};

const getCheckIdByYearAndStadranIdc = () => {
  getCheckIdByYearAndStadranId(form).then((res) => {
    if (res.success) {
      form.year = res.result.year;
      form.orgId = res.result.targetId;
      form.examineId = res.result.id;
      form.standraId = res.result.standardId;
      if (form.examineId) {
        unify();
        isAss.value = true;
      } else {
        isAss.value = false;
      }
    } else {
      isAss.value = false;
      createMessage.error(res.message);
    }
  });
};

const getNoSubmitCheckMethod = () => {
  getNoSubmitCheck().then((res) => {
    if (res.success) {
      fenestraData.value = res.result;
    }
  });
};

const getCheckStatisticMethod = () => {
  getCheckStatistic().then((res) => {
    if (res.success) {
      checkStatistic.value = res.result;
    }
  });
};

const bottomTableMethod = () => {
  bottomTable({
    id: form.examineId,
  }).then((res) => {
    if (res.success) {
      let resData = res.result || [];
      collapseData.value = resData;
      let activeCollapseKeyArray: string[] = [];
      resData.forEach((item: any) => {
        activeCollapseKeyArray.push(item.id);
      });
      activeCollapseKey.value = activeCollapseKeyArray;
    }
  });
};

const getDataByMonthTypeMethod = () => {
  getDataByMonthType({
    id: form.examineId,
    type: timeType.value,
  }).then((res) => {
    if (res.success) {
      let salesProportionChart = echarts.init(
          document.getElementById("sanchitouLines")
      );
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
          data: [] as string[],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [] as number[],
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

const carbonCategoryGasResMethod = () => {
  carbonCategoryGasRes({
    id: form.examineId,
    cateId: cateId.value,
  }).then((res) => {
    if (res.success) {
      threeoBj.value.left = res.result.left;
      threeoBj.value.mid = res.result.mid;
      threeoBj.value.right = res.result.right;
      let salesProportionChart = echarts.init(
          document.getElementById("sanchRBars")
      );
      let optionPie = {
        color: ["#FA9550"],
        title: [
          {
            left: "0%",
            top: "1.25%",
            subtext: t('carbon.message.UnitTco2e'),
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
          data: [] as string[],
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
            data: [] as number[],
          },
        ],
      };
      threeoBj.value.right.forEach((item: any) => {
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

const getHasDataCategoryMethod = () => {
  getHasDataCategory({
    id: form.examineId,
  }).then((res) => {
    if (res.success) {
      category.value = res.result;
      cateId.value = category.value[0].categoryId;
      carbonCategoryGasResMethod();
    }
  });
};

const getSangJiTableMethod = () => {
  getSangJiTable({
    id: form.examineId,
  }).then((res) => {
    if (res.success) {
      let myChart = echarts.init(document.getElementById("sanchitou"));
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

const carbonCheckChartRightDataMethod = () => {
  carbonCheckChartRightData({
    id: form.examineId,
  }).then((res) => {
    if (res.success) {
      let salesProportionChart = echarts.init(
          document.getElementById("salesfour")
      );
      let optionPie = {
        color: ["#2BA471"],
        title: [
          {
            left: "left",
            left: "0%",
            top: "1.25%",
            subtext: "单位：tCO₂e",
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
          data: [] as string[],
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
            data: [] as number[],
          },
        ],
      };
      res.result.forEach((item: any) => {
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

const carbonCheckChartLeftDataMethod = () => {
  carbonCheckChartLeftData({
    id: form.examineId,
    type: analysSelectValue.value,
  }).then((res) => {
    if (res.success) {
      analysisArr.value = res.result;
      let salesProportionChart = echarts.init(
          document.getElementById("leftFourpie")
      );
      let optionPie = {
        title: {
          show: true,
          text: carbonObj.value.total + 'tCO₂e',
          x: '50%',
          y: 'center',
          textAlign: 'center',
          textStyle: {
            fontSize: '16',
            fontStyle: 'normal',
            fontWeight: '600',
            lineHeight: '28',
            color: '#333'
          },
        },
        legend: {
          selectedMode: false,
          bottom: '0%',
          left: 'center',
          formatter: (params: string) => {
            return params.split('：')[0];
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params: any) {
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
            center: ['50%', '50%'],
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            labelLayout: {
              hideOverlap: false,
            },
            name: '',
            label: {
              show: true,
              position: 'outside',
              formatter: function (params: any) {
                return params.percent + '%';
              }
            },
            data: res.result,
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

const carbonCheckSubmitDataMethod = () => {
  carbonCheckSubmitData({
    id: form.examineId,
  }).then((res) => {
    if (res.success) {
      carbonObj.value = res.result;
      carbonCheckChartLeftDataMethod();
    }
  });
};

const onopenelChange = (status: boolean) => {
  yearOpen.value = status;
};

const opanelChange = (value: any, mode: any) => {
  form.year = dayjs(value).format("YYYY");
  yearOpen.value = false;
  getCheckIdByYearAndStadranIdc();
};

const loadorgId = () => {
  if (form.year && form.orgId && form.standraId) {
    getCheckIdByYearAndStadranIdc();
  }
};

const loadTreeRootMethod = () => {
  loadTreeRoot({
    pcode: "A01",
    async: true,
  }).then((res) => {
    if (res.success) {
      provinceData.value = res.result;
      getCheckIdByYearAndStadranIdc();
    }
  });
};

const getOrgAllSubjectOfCostCalcMethod = () => {
  getOrgAllSubjectOfCostCalc().then((res) => {
    if (res.success) {
      costCalcProvinceData.value = res.result;
      loadTreeRootMethod();
    }
  });
};

const onExport = () => {
  exportPdf({
    orgCheckCheckId: form.examineId
  }).then(res => {
    if (res.success) {
      createMessage.success('导出构成分析成功');
      let url = getFileAccessHttpUrl(res.result)
      window.open(url, '_blank');
    } else {
      createMessage.error(res.message);
    }
  });
};

const getDetail = () => {
  // 这个方法在原来的代码中没有实现，保留空实现
};

// Lifecycle
onMounted(() => {
  form.examineId = props.examineId;
  if (props.examineId) {
    unify();
    if (props.twoType == 2) {
      queryByCheckCheckId();
      getDetail();
    }
  } else {
    getOrgAllSubjectOfCostCalcMethod();
    getCheckStatisticMethod();
    getNoSubmitCheckMethod();
  }
});

// Emits
const emit = defineEmits(['onKanbanBack']);
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
.flecCenter {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 14px;
}
.top {
  display: flex;
  justify-content: space-between;
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
.kongs {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center ;
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
.swFlex{
  display: flex;
  align-items: center;
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
  color: @primary-color !important;
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
    color: @primary-color !important;
  }
}
.collaose-center {
  margin-bottom: 24px;
  .posrs {
    position: relative;
  }
  .colosw {
    font-size: 10px;
    color: @primary-color !important;
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
  //margin-left: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
  .lisFours {
    width: 8px;
    background: @primary-color !important;
    height: 8px;
    border-radius: 50%;
  }
  .lisFours1 {
    width: 250px;
    font-weight: 400;
    font-size: 16px;
    color: #777777;
  }

  .lisFours2 {
    font-weight: 400;
    font-size: 14px;
    color: @primary-color !important;
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
  color: #2c57ff;
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
  background-color: #f5f7f6;
  padding-bottom: 80px;
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
