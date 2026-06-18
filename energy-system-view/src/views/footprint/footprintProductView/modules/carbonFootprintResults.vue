<!--  产品碳足迹-碳足迹结果  -->
<template>
  <div class="">

    <div v-if="!isGenerateAss&&!GenerateAcar">
      <section class="cardBox2">
        <div class="box1">
          <div class="box1_left">
            <div class="box1_left_tr1">
              <div class="box1_left_tr1_text1"> {{ generateResultData.productName }}</div>
              <div class="box1_left_tr1_text2">
                <img class="box1_left_tr1_text2_icon" :src="img39" alt="" />
                {{ t('carbon.message.Data_cycle') }}：
                {{ generateResultData.beginTime ? generateResultData.beginTime.slice(0, 10) : '' }}
                {{ t('carbon.message.to') }}
                {{ generateResultData.endTime ? generateResultData.endTime.slice(0, 10) : '' }}
              </div>
            </div>
            <div class="box1_left_tr2">
              <div class="box1_left_tr2_text1">
                {{ queryParam.calculateNumber }}{{ queryParam.productUnitName }}{{ generateResultData.productName }}
                <span v-if="generateResultData.lifeCycleType == 1">{{ t('carbon.message.From_cradle_to_gate') }}</span>
                <span v-else-if="generateResultData.lifeCycleType == 2">{{ t('carbon.message.From_cradle_to_grave') }}</span>
                <span v-else-if="generateResultData.lifeCycleType == 3">{{ t('carbon.message.Customize') }}</span>
              </div>
              <div class="box1_left_tr2_text2">
                <div class="box1_left_tr2_text2_label"> {{ t('carbon.message.Accountant') }}：</div>
                <div class="box1_left_tr2_text2_text"> {{ generateResultData.createBy }}</div>
              </div>
              <div class="box1_left_tr2_text2">
                <div class="box1_left_tr2_text2_label"> {{ t('carbon.message.Result_generation_date') }}：</div>
                <div class="box1_left_tr2_text2_text"> {{ generateResultData.updateTime }}</div>
              </div>
            </div>
          </div>
          <div class="box1_right">
            <!-- 查看碳足迹报告 -->
            <div class="box1_right_btn1 m_hoverCP" @click="openReportModal(1)" v-if="generateResultData.reportAddress">
              {{ t('carbon.message.View_the_carbon_footprint_report') }}
            </div>
            <!-- 生成碳足迹报告 -->
            <div class="box1_right_btn1 m_hoverCP" @click="openReportModal(2)" v-if="!generateResultData.reportAddress">
              {{ t('carbon.message.Generate_a_carbon_footprint_report') }}
            </div>
            <!-- 生成碳足迹标签 -->
            <div class="box1_right_btn1 m_hoverCP" @click="openReportModal(3)" v-if="!generateResultData.labelAddress">
              {{ t('carbon.message.Generate_carbon_footprint_labels') }}
            </div>
            <!-- 查看碳足迹标签 -->
            <div class="box1_right_btn1 m_hoverCP" @click="openReportModal(4)" v-if="generateResultData.labelAddress">
              {{ t('carbon.message.Check_the_carbon_footprint_label') }}
            </div>
            <a-popconfirm
              :title="t('carbon.message.Confirm_filing')"
              :cancel-text="t('carbon.message.Cancel')"
              :ok-text="t('carbon.message.Confirm')"
              @confirm="() => onArchive()"
              v-if="queryParam.calculateArchived === '0'"
            >
              <div class="box1_right_btn2 m_hoverCP"> {{ t('carbon.message.Archive') }} </div>
            </a-popconfirm>
            <div class="box1_right_btn2" v-if="queryParam.calculateArchived === '1'"> {{ t('carbon.message.Archived') }} </div>
          </div>
        </div>
      </section>
      <!--  碳足迹结果-产品碳足迹  -->
      <section class="cardBox2">
        <div class="cardBox2_title"> {{ t('carbon.message.Product_carbon_footprint') }}</div>
        <div class="box2">
          <div class="box2_tr1"> {{ t('carbon.message.Greenhouse_gas_emissions_generated_during_the_product_life_cycle') }}</div>
          <div class="box2_tr2">
            <div class="box2_tr2_text1"> {{ t('carbon.message.Total_emission') }}</div>
            <div class="box2_tr2_text2"> {{ generateResultData.cptzjValue }}</div>
            <div class="box2_tr2_text3"> kgCO₂e</div>
          </div>
          <div class="box2_tr3">
            <div class="box2_tr3_item" v-for="(itemA, indexA) in generateResultData.detailList" :key="indexA">
              <div class="box2_tr3_item_tr1">
                <div class="box2_tr3_item_tr1_left">
                  <img class="box2_tr3_item_tr1_left_icon" :src="img40" alt="" v-if="itemA.name == '原材料获取'" />
                  <img class="box2_tr3_item_tr1_left_icon" :src="img41" alt="" v-else-if="itemA.name == '生产制造'" />
                  <img class="box2_tr3_item_tr1_left_icon" :src="img42" alt="" v-else-if="itemA.name == '分销和储存'" />
                  <img class="box2_tr3_item_tr1_left_icon" :src="img37" alt="" v-else-if="itemA.name == '产品使用'" />
                  <img class="box2_tr3_item_tr1_left_icon" :src="img38" alt="" v-else-if="itemA.name == '废弃处置'" />
                  <div class="box2_tr3_item_tr1_left_text"> {{ itemA.name }}</div>
                </div>
                <div class="box2_tr3_item_tr1_right"> {{ itemA.proportion || 0 }}%</div>
              </div>
              <div class="box2_tr3_item_tr2">
                <div class="box2_tr3_item_tr2_text1"> {{ itemA.total }}</div>
                <div class="box2_tr3_item_tr2_text2"> kgCO₂e</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!--  碳足迹结果-排放排行  -->
      <section class="cardBox2">
        <div class="cardBox2_title"> {{ t('carbon.message.Emission_rank') }}</div>
        <section class="chartBox">
          <a-tabs v-model:activeKey="activeKey" @change="onChangeActiveKey">
            <a-tab-pane key="1" :tab="`${t('carbon.message.by_emission_source')}（${t('carbon.message.top_10')}）`" force-render>
              <div class="tabInnerBox">
                <div class="chart1" id="chart_bar_qd"></div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" :tab="`${t('carbon.message.By_type')}`" force-render>
              <div class="tabInnerBox">
                <div class="chart1" id="chart_bar_lx"></div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="3" :tab="`${t('carbon.message.By_process')}（${t('carbon.message.top_10')}）`" force-render>
              <div class="tabInnerBox">
                <div class="chart1" id="chart_bar_gx"></div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="4" :tab="`${t('carbon.message.by_stages')}`" force-render>
              <div class="tabInnerBox">
                <div class="chart1" id="chart_bar_hj"></div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </section>
      </section>
      <!--  碳足迹结果-碳足迹清单  -->
      <section class="cardBox2">
        <div class="m_cbFlex">
          <div class="cardBox2_title"> {{ t('carbon.message.Carbon_footprint_list') }}</div>
          <div class="uploadBtn m_hoverCP" @click="onExport">
            {{ t('carbon.message.Export') }}
          </div>
        </div>
        <div class="collapseBox">
          <a-collapse v-model:activeKey="activeCollapseKey" :bordered="false">
            <template #expandIcon="{ isActive }">
              <img class="collapseIcon" :src="img46" alt="" v-if="isActive" />
              <img class="collapseIcon" :src="img48" alt="" v-else />
            </template>
            <a-collapse-panel :header="itemA.name" :style="customStyle" v-for="(itemA, indexA) in generateResultData.detailList" :key="String(indexA)">
              <template #extra>
                <div class="collapseExtraText">
                  <div class="collapseExtraText_text1">{{ itemA.name }}{{ t('carbon.message.stage_carbon_footprint') }}：</div>
                  <div class="collapseExtraText_text2">{{ t('carbon.message.subtotal') }}</div>
                  <div class="collapseExtraText_text3">{{ itemA.total }}</div>
                  <div class="collapseExtraText_text4">kgCO₂e</div>
                </div>
              </template>
              <div class="collapseInnerBox">
                <a-collapse v-model:activeKey="itemA.activeCollapseKey" :bordered="false">
                  <template #expandIcon="{ isActive }">
                    <img class="collapseIcon" :src="img46" alt="" v-if="isActive" />
                    <img class="collapseIcon" :src="img48" alt="" v-else />
                  </template>
                  <a-collapse-panel
                    :header="itemB.name ? itemB.name : '空工序'"
                    :style="customStyle"
                    v-for="(itemB, indexB) in itemA.childList"
                    :key="String(indexB)"
                  >
                    <template #extra>
                      <div class="collapseExtraText2">
                        <div class="collapseExtraText2_text1">{{ itemB.name ? itemB.name : '空工序' }}：</div>
                        <div class="collapseExtraText2_text2">{{ t('carbon.message.subtotal') }}</div>
                        <div class="collapseExtraText2_text3">{{ itemB.total }}</div>
                        <div class="collapseExtraText2_text4">kgCO₂e</div>
                      </div>
                    </template>
                    <div class="collapseInnerBox2">
                      <a-table
                        :columns="columns"
                        :data-source="itemB.detailList"
                        :pagination="false"
                        :bordered="false"
                        size="middle"
                        style="background: #ffffff"
                      >
                      </a-table>
                    </div>
                  </a-collapse-panel>
                </a-collapse>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </section>
    </div>

    <!--  碳足迹报告弹窗  -->
    <a-modal :title="t('carbon.message.Carbon_footprint_report')" :visible="reportModalVisible" @ok="closeReportModal" @cancel="closeReportModal">
      <a-spin :spinning="createReportIng">
        <div class="flecCenter">
          <div class="modalFlexs">
            <img :src="img14" alt="" />
            <div>{{ generateResultData.productName }}-{{ t('carbon.message.Carbon_footprint_report') }}</div>
          </div>
          <a-button type="primary" icon="download" size="large" @click="onDownloadReport" v-if="generateResultData.reportAddress">{{
            t('carbon.message.Download')
          }}</a-button>
          <a-button type="primary" icon="download" size="large" @click="onCreateReport" v-else>{{ t('carbon.message.Generate') }}</a-button>
          <div class="modalFlexs1 m_hoverCP" @click="onReStart">
            <div>{{ t('carbon.message.Regenerate') }}</div>
            <img :src="img15" alt="" />
          </div>
          <div class="flwMondes">{{ t('carbon.message.Last_generation_date') }}：{{ generateResultData.reportTime }}</div>
        </div>
      </a-spin>
    </a-modal>

    <!--  碳足迹标签弹窗  -->
    <a-modal
      :title="t('carbon.message.Check_the_carbon_footprint_label')"
      ok-text="下载"
      :visible="isGenerateAssIng"
      @ok="onDareUrl(generateResultData)"
      @cancel="closeReportModal"
    >
      <a-spin :spinning="createReportIng">
        <div class="flecCenter">
          <img :src="getAvatarView(generateResultData.labelAddress)" class="theCarbonImg" alt="" />
          <div class="flwMondes"> {{ t('carbon.message.Generation_time') }}:{{ generateResultData.labelTime }} </div>
        </div>
      </a-spin>
    </a-modal>

    <!--  碳足迹标签弹窗  -->
    <section class="m_popupBox" v-if="isGenerateAss">
      <GenerateAcarbonfootprintReport ref="generatresRef" @back="onBack" />
    </section>

    <!--  碳足迹报告弹窗  -->
    <section class="m_popupBox" style="overflow: hidden" v-if="GenerateAcar">
      <!--      搬运代码时暂时先注释，因为目前还没有搬该模块的代码-->
      <GenerateAcarbonfoot ref="eratecaresRef" @back="onBack" />
    </section>
  </div>
</template>

<script setup>
import { ref, nextTick, defineProps, defineEmits } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { defHttp } from '/@/utils/http/axios';
import { getFileAccessHttpUrl } from '@/utils/common/compUtils';
import * as echarts from 'echarts';
import { commonBarChartOption } from '@/common/constKey';
import GenerateAcarbonfootprintReport from '@/views/footprint/carbonFootprintLabel/module/index.vue';
// 搬运代码时暂时先注释，因为目前还没有搬该模块的代码-
import GenerateAcarbonfoot from '@/views/module_managePlatform/GenerateAcarbonfoot/index.vue';

// 导入图片资源
import img39 from '@/assets/img/img39.png';
import img31 from '@/assets/img/img31.png';
import img46 from '@/assets/img/img46.png';
import img48 from '@/assets/img/img48.png';
import img40 from '@/assets/img/img40.png';
import img41 from '@/assets/img/img41.png';
import img42 from '@/assets/img/img42.png';
import img37 from '@/assets/img/img37.png';
import img38 from '@/assets/img/img38.png';
import img14 from '@/assets/carbon/img14.png';
import img15 from '@/assets/carbon/img15.png';

// i18n
const { t } = useI18n();
const { createMessage } = useMessage();

// 定义 props
const props = defineProps({
  generateResultData: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  queryParam: {
    type: Object,
    default: () => ({}),
  },
});

// 定义 emits
const emit = defineEmits(['changeStep', 'archive']);

// refs
const generatresRef = ref(null);
const eratecaresRef = ref(null);

// 数据状态
const isGenerateAss = ref(false);
const activeKey = ref('1'); // 1按清单/ 2按类型/ 3按工序 / 4按环节
const customStyle = 'background: #FFFFFF;border-radius: 0px;margin-bottom: 0;border-bottom: none;overflow: hidden;';
const reportModalVisible = ref(false); // 碳足迹报告弹窗是否显示
const createReportIng = ref(false); // 碳足迹报告弹窗加载状态
const isGenerateAssIng = ref(false); // 标签
const GenerateAcar = ref(false); // 报告
const activeCollapseKey = ref([]);

// 表格列定义
const columns = [
  {
    title: t('carbon.message.Name'),
    align: 'center',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: t('carbon.message.Type'),
    align: 'center',
    dataIndex: 'type',
    width: 150,
  },
  {
    title: t('carbon.message.Quantity_unit'),
    align: 'center',
    dataIndex: 'numberUnit',
    width: 150,
  },
  {
    title: t('carbon.message.Factor_value'),
    align: 'center',
    dataIndex: 'factorValue',
    width: 200,
  },
  {
    title: t('carbon.message.Emissions_volume'),
    align: 'center',
    dataIndex: 'emissionsVolume',
    width: 150,
  },
  {
    title: t('carbon.message.Transport_volume'),
    align: 'center',
    dataIndex: 'transportVolume',
    width: 150,
  },
  {
    title: t('carbon.message.Total_proportion'),
    align: 'center',
    dataIndex: 'proportion',
    width: 150,
  },
];

// 回调函数
const onBack = (value) => {
  GenerateAcar.value = false;
  isGenerateAss.value = false;
  nextTick(() => {
    emit('changeStep', 3, true);
    if (value == 1) {
      isGenerateAssIng.value = true;
    }
  });
};

/**
 * 碳足迹结果-绘制图表
 */
const drawCharts = (generateResultData) => {
  console.log('drawCharts', generateResultData);
  if (generateResultData.emissionRanking && generateResultData.emissionRanking.length > 0) {
    generateResultData.emissionRanking.forEach((item) => {
      if (item.typeName == '按清单') {
        drawLine1(item.listKey, item.listValue);
      }
      if (item.typeName == '按类型') {
        drawLine2(item.listKey, item.listValue);
      }
      if (item.typeName == '按工序') {
        drawLine3(item.listKey, item.listValue);
      }
      if (item.typeName == '按环节') {
        drawLine4(item.listKey, item.listValue);
      }
    });
  }
};

/**
 * 下载
 */
const onDareUrl = (generateResultData) => {
  console.log(111);
  let url = window._CONFIG['staticDomainURL'] + '/' + generateResultData.labelAddress;
  console.log('onDareUrl', url);
  window.open(url, '_blank');
  // this.downloadImage(url)
};

/**
 * 按清单【柱状图】
 */
const drawLine1 = (labelData, valueData) => {
  console.log('drawLine1');
  let chart_bar_qd = echarts.init(document.getElementById('chart_bar_qd'));
  let option = commonBarChartOption('#F99550', labelData.slice(0, 10), valueData.slice(0, 10));
  //使用制定的配置项和数据显示图表
  chart_bar_qd.setOption(option);
};

/**
 * 按类型【柱状图】
 */
const drawLine2 = (labelData, valueData) => {
  console.log('drawLine2');
  let chart_bar_lx = echarts.init(document.getElementById('chart_bar_lx'));
  let option = commonBarChartOption('#F99550', labelData, valueData);
  //使用制定的配置项和数据显示图表
  chart_bar_lx.setOption(option);
};

/**
 * 按工序【柱状图】
 */
const drawLine3 = (labelData, valueData) => {
  console.log('drawLine3');
  let chart_bar_gx = echarts.init(document.getElementById('chart_bar_gx'));
  let option = commonBarChartOption('#F99550', labelData.slice(0, 10), valueData.slice(0, 10));
  //使用制定的配置项和数据显示图表
  chart_bar_gx.setOption(option);
};

/**
 * 按环节【柱状图】
 */
const drawLine4 = (labelData, valueData) => {
  console.log('drawLine2');
  let chart_bar_hj = echarts.init(document.getElementById('chart_bar_hj'));
  let option = commonBarChartOption('#F99550', labelData, valueData);
  //使用制定的配置项和数据显示图表
  chart_bar_hj.setOption(option);
};

/**
 * 碳足迹结果-碳足迹报告弹窗-打开
 */
const openReportModal = (type) => {
  console.log('openReportModal', props.generateResultData);
  console.log('openReportModal', props.queryParam);
  if (type == 1) {
    reportModalVisible.value = true;
  } else if (type == 2) {
    GenerateAcar.value = true;
    nextTick(() => {
      if (eratecaresRef.value) {
        eratecaresRef.value.type = 2;
        eratecaresRef.value.gonsixx.a = props.generateResultData.productPic;
        eratecaresRef.value.gonsixx.b = props.generateResultData.flowChart;
        eratecaresRef.value.gonsixx.c = props.generateResultData.productIntroduction;
        eratecaresRef.value.gonsixx.d = props.generateResultData.orgContent;
        eratecaresRef.value.gonsixx.e = props.generateResultData.orgAddress;
        eratecaresRef.value.formObj.calculateId = props.queryParam.id;
        eratecaresRef.value.getReportParams();
      }
    });
  } else if (type == 3) {
    isGenerateAss.value = true;
    nextTick(() => {
      if (generatresRef.value) {
        generatresRef.value.type = 3;
        generatresRef.value.getProductList(1);
        generatresRef.value.disable = true;
        generatresRef.value.queryParam.productId = props.generateResultData.productId;
        generatresRef.value.queryParam.calculateId = props.queryParam.id;
        generatresRef.value.getFinishCalculateList(1);
      }
    });
  } else {
    isGenerateAssIng.value = true;
  }
};

/**
 * 碳足迹结果-重新生成
 */
const onReStart = () => {
  console.log('openReportModal', props.queryParam);
  reportModalVisible.value = false;
  GenerateAcar.value = true;
  setTimeout(() => {
    nextTick(() => {
      if (eratecaresRef.value) {
        eratecaresRef.value.type = 2;
        eratecaresRef.value.formObj.calculateId = props.queryParam.id;
        eratecaresRef.value.getReportParams();
      }
    });
  }, 100);
};

/**
 * 碳足迹结果-碳足迹报告弹窗-关闭
 */
const closeReportModal = () => {
  reportModalVisible.value = false;
  isGenerateAssIng.value = false;
};

/**
 * 碳足迹结果-生成碳足迹报告
 */
const onCreateReport = () => {
  createReportIng.value = true;
  defHttp
    .post({
      url: '/cyFootprintReport/saveOrUpdateReport',
      params: {
        calculateId: props.queryParam.id,
      },
    })
    .then((res) => {
      if (res.success) {
        createMessage.success(t('carbon.message.Report_generation_successful'));
        emit('changeStep', 3, true);
      } else {
        createMessage.error(res.message);
      }
    })
    .finally(() => {
      createReportIng.value = false;
    });
};

/**
 * 碳足迹结果-下载碳足迹报告
 */
const onDownloadReport = () => {
  let url = window._CONFIG['staticDomainURL'] + '/' + props.generateResultData.reportAddress;
  console.log('onDownloadReport', url);
  window.open(url, '_blank');
};

/**
 * 碳足迹结果-归档
 */
const onArchive = () => {
  console.log('onArchive', props.generateResultData);
  defHttp
    .post({
      url: '/footprintProduct/cyFootprintProduct/calculateArchived',
      params: {
        calculateId: props.queryParam.id,
      },
    })
    .then((res) => {
      if (res.success) {
        createMessage.success(t('carbon.message.Filing_successful'));
        emit('archive');
      } else {
        createMessage.error(res.message);
      }
    });
};

/**
 * 切换tab
 * @param key 1按清单/ 2按类型/ 3按工序 / 4按环节
 */
const onChangeActiveKey = (key) => {
  console.log('onChangeActiveKey', key);
  activeKey.value = key;
};

/**
 * 获取图片
 * @param avatar
 * @returns {*}
 */
const getAvatarView = (avatar) => {
  return getFileAccessHttpUrl(avatar);
};

/**
 * 碳足迹结果-碳足迹清单-导出
 */
const onExport = () => {
  console.log('onExport', props.generateResultData);
  defHttp
    .get({
      url: '/cyFootprintReport/createPdf',
      params: {
        calculateId: props.queryParam.id,
      },
    })
    .then((res) => {
      if (res.success) {
        createMessage.success(t('carbon.message.Export_carbon_footprint_list_successful'));
        setTimeout(() => {
          let url = window._CONFIG['domianURL'] + res.result;
          console.log('createPdf', url);
          window.open(url, '_blank');
        }, 500);
      } else {
        createMessage.error(res.message);
      }
    });
};

// 暴露方法给父组件
defineExpose({
  drawCharts,
});
</script>

<style lang="less" scoped>
/* 样式部分保持不变 */
.theCarbonImg {
  width: 279px;
  height: 375px;
}
.flecCenter {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 14px;

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
}

.cardBox2 {
  margin: 24px 0px auto;
  overflow: hidden;
  padding: 24px;
  background: #ffffff;
  border-radius: 3px;
}

.cardBox2_title {
  font-family: PingFang SC, PingFang SC;
  font-weight: bold;
  font-size: 16px;
  color: #333333;
}

.box1 {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .box1_left {
    font-family: PingFang SC, PingFang SC;
    font-weight: bold;
    font-size: 16px;
    color: #333333;
  }

  .box1_left_tr1 {
    display: flex;
    align-items: center;
  }

  .box1_left_tr1_text1 {
  }

  .box1_left_tr1_text2 {
    display: flex;
    align-items: center;
    margin-left: 26px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #888888;
  }

  .box1_left_tr1_text2_icon {
    margin-right: 4px;
    width: 14px;
    height: 14px;
  }

  .box1_left_tr2 {
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 34px;
  }

  .box1_left_tr2_text1 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }

  .box1_left_tr2_text2 {
    display: flex;
    align-items: center;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
  }

  .box1_left_tr2_text2_label {
    color: #777777;
  }

  .box1_left_tr2_text2_text {
    color: #333333;
  }

  .box1_right {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
  }

  .box1_right_btn1 {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    // width: 132px;
    height: 32px;
    background: #ffffff;
    border-radius: 3px;
    border: 1px solid @primary-color;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: @primary-color;
  }

  .box1_right_btn2 {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    // width: 89px;
    height: 32px;
    background: @primary-color;
    border-radius: 3px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
  }
}

.box2 {
  .box2_tr1 {
    margin-top: 10px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #888888;
  }

  .box2_tr2 {
    margin-top: 24px;
    display: flex;
    align-items: flex-end;
  }

  .box2_tr2_text1 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }

  .box2_tr2_text2 {
    margin-left: 9px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 24px;
    color: @primary-color;
    line-height: 24px;
  }

  .box2_tr2_text3 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 14px;
    color: #333333;
  }

  .box2_tr3 {
    margin-top: 24px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 24px;

    .box2_tr3_item {
      box-sizing: border-box;
      padding: 14px 16px;
      background: #fafafa;
      border-radius: 2px;
    }

    .box2_tr3_item_tr1 {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .box2_tr3_item_tr1_left {
      display: flex;
      align-items: center;
    }

    .box2_tr3_item_tr1_left_icon {
      margin-right: 4px;
      width: 16px;
      height: 16px;
    }

    .box2_tr3_item_tr1_left_text {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 12px;
      color: #333333;
    }

    .box2_tr3_item_tr1_right {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 12px;
      color: #333333;
    }

    .box2_tr3_item_tr2 {
      margin-top: 15px;
      display: flex;
      align-items: center;
    }

    .box2_tr3_item_tr2_text1 {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 16px;
      color: #333333;
    }

    .box2_tr3_item_tr2_text2 {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 12px;
      color: #777777;
    }
  }
}

.chartBox {
  margin-top: 14px;
  width: 100%;

  .tabInnerBox {
    //padding: 8px 24px 0;
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

  #chart_bar_qd {
  }

  #chart_bar_lx {
  }

  #chart_bar_gx {
  }

  #chart_bar_hj {
  }
}

.uploadBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 84px;
  height: 32px;
  background: #ffffff;
  border-radius: 3px;
  border: 1px solid @primary-color;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: @primary-color;

  .uploadBtn_icon {
    width: 16px;
    height: 16px;
  }
}

.collapseBox {
  margin-top: 22px;

  /deep/ .ant-collapse-header {
    border-bottom: 1px solid #e7e7e7;
  }

  /deep/ .ant-collapse-content-box {
    //padding: 0;
    padding: 0 0 0 22px !important;
  }

  .collapseIcon {
    width: 16px;
    height: 16px;
  }

  .collapseInnerBox {
    /deep/ .ant-collapse-content-box {
      padding: 0 !important;
    }
  }

  .collapseInnerBox2 {
    padding: 24px;
    background: #f5f7f6;
  }

  .collapseExtraText {
    display: flex;
    align-items: flex-end;

    .collapseExtraText_text1 {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
    }

    .collapseExtraText_text2 {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 12px;
      color: #333333;
    }

    .collapseExtraText_text3 {
      margin-left: 4px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 14px;
      color: @primary-color;
    }

    .collapseExtraText_text4 {
      margin-left: 4px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.9);
    }
  }

  .collapseExtraText2 {
    display: flex;
    align-items: center;

    .collapseExtraText2_text1 {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #888888;
    }

    .collapseExtraText2_text2 {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 12px;
      color: #888888;
    }

    .collapseExtraText2_text3 {
      margin-left: 4px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 14px;
      color: #333333;
    }

    .collapseExtraText2_text4 {
      margin-left: 4px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 12px;
      color: #888888;
    }
  }
}
</style>
