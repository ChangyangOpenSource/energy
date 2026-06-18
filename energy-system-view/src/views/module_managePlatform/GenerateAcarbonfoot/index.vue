<template>
  <div class="centers">
    <a-card>
      <div class="bnoasif" v-if="type === 2">
        <div class="cardHeader">
          <div class="cardHeader_backBox m_hoverCP" @click="onBack">
            <img
              class="cardHeader_icon m_hoverCP"
              :src="img28"
              alt=""
            />
            <span class="m_hoverCP">{{ t('carbon.message.Return') }}</span>
          </div>
          <a-anchor @change="onChange" :get-container="getContainerBox">
            <a-anchor-link
              :href="'#' + item.name"
              v-for="(item, index) in list"
              :key="index"
              @click="onColisw(index)"
              class="table"
              :title="t(`message.${item.name}`)"
            >
            </a-anchor-link>
          </a-anchor>
        </div>
      </div>
      <div class="conters" ref="containerBox">
        <!-- 概况 -->
        <div class="gaikuao marBottom" id="Overview">
          <div class="title">{{ t('carbon.message.Overview') }}</div>
          <div
            class="marBottom"
            style="display: flex; gap: 24px"
            v-if="type === 2"
          >
            <div class="flexOne">
              <div class="text marBom">
                <span class="red">*</span>{{ t('carbon.message.Product_image') }}
              </div>
              <JImageUpload
                v-if="gonsixx.a"
                class="avatar-uploader"
                :text="t('message.Click_Upload_File')"
                v-model:value="gonsixx.a"
              ></JImageUpload>
              <img :src="gonsixx.a" alt="" v-else>
            </div>
            <div class="flexOne">
              <div class="text marBom">
                <span class="red">*</span>{{ t('carbon.message.Process_flow_chart') }}
              </div>
              <JImageUpload
                v-if="gonsixx.b"
                class="avatar-uploader"
                :text="t('carbon.message.Click_Upload_File')"
                v-model:value="gonsixx.b"
              ></JImageUpload>
              <img :src="gonsixx.b" alt="" v-else>
            </div>
          </div>
          <div class="marBottom" v-if="type === 2">
            <div class="text marBom">
              {{ t('carbon.message.Product_Introduction') }}
            </div>
            <div style="display: flex">
              <textarea
                class="textarea flexOne"
                v-model="gonsixx.c"
                disabled="true"
                name=""
                id=""
                cols="30"
                rows="10"
              ></textarea>
            </div>
          </div>
          <div class="flex marBottom" style="gap: 24px" v-if="type === 2">
            <div class="flexOne">
              <div class="text marBom">
                {{ t('carbon.message.Company_Address') }}
              </div>
              <textarea
                class="textarea flexOne"
                disabled="true"
                v-model="gonsixx.e"
                name=""
                id=""
                cols="30"
                rows="10"
              ></textarea>
            </div>
          </div>
          <div class="marBottom">
            <div class="text marBom">
              {{ t('carbon.message.The_purpose_of_report_production') }}
            </div>
            <div style="display: flex">
              <div style="position: relative" class="flexOne">
                <a-textarea
                  class="textarea flexOne"
                  :placeholder="t('carbon.message.Please_enter')"
                  v-model:value="formObj.reportIntention"
                  :maxLength="500"
                />
                <div class="length">
                  {{ formObj.reportIntention.length }}/500
                </div>
              </div>
            </div>
          </div>
          <div class="">
            <div class="text marBom">
              {{ t('carbon.message.Normative_references') }}
            </div>
            <div class="warp">
              <div
                class="flex widrhts"
                v-for="(rews, index) in formObj.normativeReferenceDocumentList"
                :key="index"
              >
                <a-input
                  class="input"
                  type="text"
                  :placeholder="t('carbon.message.Please_enter')"
                  v-model:value="formObj.normativeReferenceDocumentList[index]"
                />
                <img
                  class="img2"
                  @click="normatAdd"
                  v-if="
                    index === formObj.normativeReferenceDocumentList.length - 1
                  "
                  :src="img2"
                  alt=""
                />
                <img
                  class="img2"
                  @click="normatDelter(index)"
                  :src="img13"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 报告范围 -->
        <div class="gaikuao marBottom" id="Report_scope">
          <div class="title">{{ t('carbon.message.Report_scope') }}</div>
          <div class="flex marBottom" style="gap: 24px">
            <div class="flexOne">
              <div class="text marBom">
                {{ t('carbon.message.The_greenhouse_gases_contained') }}
              </div>
              <a-textarea
                class="textarea1 flexOne"
                :placeholder="t('carbon.message.Please_enter')"
                v-model:value="formObj.containsGreenhouseGases"
              />
            </div>
            <div class="flexOne">
              <div class="text marBom">
                {{ t('carbon.message.Evaluation_methods_and_databases') }}
              </div>
              <a-textarea
                class="textarea1 flexOne"
                :placeholder="t('carbon.message.Please_enter')"
                v-model:value="formObj.evaluationMethodsAndDatabases"
              />
            </div>
          </div>
          <div class="marBottom">
            <div class="text marBom">
              {{ t('carbon.message.Data_selection_principles_and_stage_items') }}
            </div>
            <div style="display: flex">
              <a-textarea
                class="textarea1 flexOne"
                v-model:value="formObj.principlesOfDataSelectionAndStageItems"
                :placeholder="t('carbon.message.Please_enter')"
              />
            </div>
          </div>
        </div>

        <!-- 模型描述 -->
        <div class="gaikuao marBottom" id="Model_description">
          <div class="title">{{ t('carbon.message.Model_description') }}</div>
          <div class="">
            <div class="text marBom">
              {{ t('carbon.message.Model_description') }}
            </div>
            <div style="display: flex">
              <div style="position: relative" class="flexOne">
                <a-textarea
                  v-model:value="formObj.modelDescription"
                  class="textarea flexOne"
                  :placeholder="t('carbon.message.Please_enter')"
                  :maxLength="500"
                />
                <div class="length">
                  {{ formObj.modelDescription.length }}/500
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 数据质量评价与管理 -->
        <div
          class="gaikuao marBottom"
          id="Data_quality_evaluation_and_management"
        >
          <div class="title">
            {{ t('carbon.message.Data_quality_evaluation_and_management') }}
          </div>
          <div class="flex marBottom" style="gap: 24px">
            <div class="flexOne">
              <div class="text marBom">
                {{ t('carbon.message.Data_quality_evaluation') }}
              </div>
              <div style="position: relative" class="flexOne">
                <a-textarea
                  v-model:value="formObj.dataQualityEvaluation"
                  class="textarea2 flexOne"
                  :placeholder="t('carbon.message.Please_enter')"
                  :maxLength="500"
                />
                <div class="length">
                  {{ formObj.dataQualityEvaluation.length }}/500
                </div>
              </div>
            </div>
            <div class="flexOne">
              <div class="text marBom">
                {{ t('carbon.message.Data_quality_requirements') }}
              </div>
              <div style="position: relative" class="flexOne">
                <a-textarea
                  v-model:value="formObj.dataQualityRequirements"
                  class="textarea2 flexOne"
                  :placeholder="t('carbon.message.Please_enter')"
                  :maxLength="500"

                />
                <div class="length">
                  {{ formObj.dataQualityRequirements.length }}/500
                </div>
              </div>
            </div>
          </div>
          <div class="marBottom">
            <div class="text marBom">
              {{ t('carbon.message.Data_Quality_management') }}
            </div>
            <div style="display: flex">
              <div style="position: relative" class="flexOne">
                <a-textarea
                  v-model:value="formObj.dataQualityManagement"
                  class="textarea2 flexOne"
                  :placeholder="t('carbon.message.Please_enter')"
                  :maxLength="500"
                />
                <div class="length">
                  {{ formObj.dataQualityManagement.length }}/500
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 碳足迹评价结果分析 -->
        <div
          class="gaikuao marBottom"
          id="Analysis_of_Carbon_footprint_Evaluation_results"
        >
          <div class="title">
            {{ t('carbon.message.Analysis_of_Carbon_footprint_Evaluation_results') }}
          </div>
          <div class="flex marBottom" style="gap: 24px">
            <div class="flexOne">
              <div class="text marBom">
                {{ t('carbon.message.Integrity_and_consistency_check') }}
              </div>
              <div style="position: relative" class="flexOne">
                <a-textarea
                  v-model:value="formObj.integrityAndConsistencyCheck"
                  class="textarea2 flexOne"
                  :placeholder="t('carbon.message.Please_enter')"
                  :maxLength="500"
                />
                <div class="length">
                  {{ formObj.integrityAndConsistencyCheck.length }}/500
                </div>
              </div>
            </div>
            <div class="flexOne">
              <div class="text marBom">
                {{ t('carbon.message.Uncertainty_analysis') }}
              </div>
              <div style="position: relative" class="flexOne">
                <a-textarea
                  v-model:value="formObj.uncertainty"
                  class="textarea2 flexOne"
                  :placeholder="t('carbon.message.Please_enter')"
                  :maxLength="500"
                />
                <div class="length">{{ formObj.uncertainty.length }}/500</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 碳足迹结论与建议 -->
        <div
          class="gaikuao marBottom"
          id="Conclusions_and_Suggestions_on_Carbon_Footprint"
        >
          <div class="title">
            {{ t('carbon.message.Conclusions_and_Suggestions_on_Carbon_Footprint') }}
          </div>
          <div class="flex marBottom" style="gap: 24px">
            <div class="flexOne">
              <div class="text marBom">
                {{ t('carbon.message.Conclusion_of_carbon_footprint_assessment') }}
              </div>
              <div style="position: relative" class="flexOne">
                <a-textarea
                  v-model:value="formObj.conclusionOfCarbonFootprintAssessment"
                  class="textarea2 flexOne"
                  :placeholder="t('carbon.message.Please_enter')"
                  :maxLength="500" />
                <div class="length">
                  {{ formObj.conclusionOfCarbonFootprintAssessment.length }}/500
                </div>
              </div>
            </div>
            <div class="flexOne">
              <div class="text marBom">
                {{ t('carbon.message.Suggestions_for_carbon_footprint_assessment') }}
              </div>
              <div style="position: relative" class="flexOne">
                <a-textarea
                  class="textarea2 flexOne"
                  v-model:value="formObj.suggestionsForCarbonFootprintAssessment"
                  :placeholder="t('carbon.message.Please_enter')"
                  :maxLength="500" />
                <div class="length">
                  {{
                    formObj.suggestionsForCarbonFootprintAssessment.length
                  }}/500
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="button">
        <div class="boots" @click="onParams">
          {{ formObj.calculateId ? t('carbon.message.Determine_and_generate_the_report') : t('carbon.message.save_template') }}
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { defHttp } from '/@/utils/http/axios'

import img28 from '@/assets/img/img28.png'
import img2 from '@/assets/img/img2.png'
import img13 from '@/assets/img/img13.png'
import JImageUpload from '/@/components/Form/src/jeecg/components/JImageUpload.vue'

// 使用 i18n
const { t } = useI18n()
const { createMessage } = useMessage()

// 定义响应式数据
const type = ref(1)
const list = [
  {
    name: 'Overview',
    value: 1,
  },
  {
    name: 'Report_scope',
    value: 2,
  },
  {
    name: 'Model_description',
    value: 3,
  },
  {
    name: 'Data_quality_evaluation_and_management',
    value: 4,
  },
  {
    name: 'Analysis_of_Carbon_footprint_Evaluation_results',
    value: 5,
  },
  {
    name: 'Conclusions_and_Suggestions_on_Carbon_Footprint',
    value: 6,
  },
]

const gonsixx = reactive({
  a: '', //产品图片
  b: '', //工艺流程图
  c: '', //产品简介
  d: '', //公司简介
  e: '', //公司地址
})

const formObj = reactive({
  calculateId: '',
  reportIntention: '', //报告制作目的
  normativeReferenceDocumentList: [''], //规范性引用文件
  containsGreenhouseGases: '', //包含的温室气体
  evaluationMethodsAndDatabases: '', //评价方法和数据库
  principlesOfDataSelectionAndStageItems: '', //数据取舍原则与阶段项
  modelDescription: '', //模型描述
  dataQualityEvaluation: '', //数据质量评价
  dataQualityRequirements: '', //数据质量要求
  dataQualityManagement: '', //数据质量管理
  integrityAndConsistencyCheck: '', //完整性与一致性检查
  uncertainty: '', //不确定性分析
  conclusionOfCarbonFootprintAssessment: '', //碳足迹评价结论
  suggestionsForCarbonFootprintAssessment: '', //碳足迹评价建议
})

const containerBox = ref(null)

// 方法定义
function getContainerBox() {
  return containerBox.value
}

function onColisw(value) {
  console.log('Anchor:OnChange', value)
  type.value = value
}

function onChange(link) {
  console.log('Anchor:OnChange', link)
}

function normatAdd() {
  formObj.normativeReferenceDocumentList.push('')
}

function normatDelter(index) {
  if (formObj.normativeReferenceDocumentList.length > 1) {
    formObj.normativeReferenceDocumentList.splice(index, 1)
  }
}

function getReportParams() {
  console.log(formObj)
  defHttp.get({
    url: '/footprintProduct/cyFootprintProductCalculateReportParams/getReportParams',
    params: { calculateId: formObj.calculateId }
  },{isTransformResponse: false}).then((res) => {
    if (res.success) {
      Object.assign(formObj, res.result)
    } else {
      createMessage.error(res.message)
    }
  })
}

function onParams() {
  console.log(formObj.calculateId)
  formObj.a = gonsixx.a
  formObj.b = gonsixx.b
  formObj.c = gonsixx.c
  formObj.d = gonsixx.d
  formObj.e = gonsixx.e

  defHttp.post({
    url: '/footprintProduct/cyFootprintProductCalculateReportParams/saveOrUpdateReportParams',
    data: formObj
  }).then((res) => {
    if (res.success) {
      createMessage.success(t('message.operation_success'))
      if (formObj.calculateId) {
        emit('back')
      }
    } else {
      createMessage.error(res.message)
    }
  })
}

function onBack() {
  emit('back')
}

// 暴露给父组件的方法
defineExpose({
  getReportParams,
  type,
  gonsixx,
  formObj
})

// 生命周期钩子
onMounted(() => {
  if (type.value === 1) {
    getReportParams()
  }
})

// 定义 emits
const emit = defineEmits(['back'])
</script>

<style lang="less" scoped>
/deep/ .ant-upload-list{
  display: flex;
}
/deep/.ant-anchor-link-active{
  font-weight: 400;
  font-size: 14px;
  color: #148958 !important;
  border-bottom: 3px solid #148958;
}
/deep/.ant-affix{
  position: absolute !important;
  top: 0 !important;
}
.centers{

}
/deep/.ant-anchor {
  display: flex;
  align-items: center;
  margin-left: 315px;
}
/deep/.ant-anchor-ink {
  display: none;
}
.avatar-uploader {
  display: block;
  width: 120px;
  height: 120px;
  /deep/.ant-upload {
    width: 120px !important;
    height: 120px !important;
  }

  /deep/.ant-upload-text {
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
  }
}
/deep/.ant-card-bordered {
  border: none !important;
}
/deep/.ant-card-body {
  background: #f5f7f6;
  // padding: 88px 24px !important;
}
.button {
  width: 100%;
  height: 80px;
  margin-top: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  .boots {
    background: #148958;
    border-radius: 3px 3px 3px 3px;
    font-weight: 400;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    padding: 9px 29px;
    cursor: pointer;
  }
}
.widrhts {
  width: 50%;
  margin-bottom: 16px;
}
.warp {
  display: flex;
  flex-wrap: wrap;
}
.input {
  width: 100%;
  height: 32px;
  background: #ffffff;
  border-radius: 3px 3px 3px 3px;
  border: 1px solid #dcdcdc;
  padding-left: 8px;
}
.img2 {
  width: 18px;
  height: 18px;
  margin-left: 12px;
}

&:focus-visible {
  outline: 0px;
}

.length {
  font-weight: 400;
  font-size: 12px;
  color: #888888;
  position: absolute;
  right: 14px;
  bottom: 10px;
}
.textarea {
  width: 100%;
  height: 119px;
  font-weight: 400;
  font-size: 14px;
  border: 1px solid #dcdcdc;
  color: #333333;
  resize: none;
  padding-left: 8px;
}
.textarea1 {
  width: 100%;
  height: 80px;
  font-weight: 400;
  font-size: 14px;
  border: 1px solid #dcdcdc;
  color: #333333;
  resize: none;
  padding-left: 8px;
}

.textarea2 {
  width: 100%;
  height: 80px;
  font-weight: 400;
  font-size: 14px;
  border: 1px solid #dcdcdc;
  color: #333333;
  resize: none;
  padding-left: 8px;
}
.fily {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.marBottom {
  margin-bottom: 24px;
}
.marBottom1 {
}
.image {
  width: 120px;
  height: 120px;
  background: #f3f3f3;
  border-radius: 0px 0px 0px 0px;
  .img {
    width: 24px;
    height: 24px;
    margin-bottom: 10px;
  }
  div {
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
  }
}
.flexOne {
  flex: 1;
}
.conters {
  // padding: 24px 339px;
  overflow-y: scroll;
  height: calc(100vh - 320px);
  margin-top: 64px;
  .red {
    color: red;
  }
  .marBom {
    margin-bottom: 11px;
  }
  .text {
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }
  .gaikuao {
    background: #ffffff;
    padding: 25px 24px;
  }
  .title {
    font-weight: bold;
    font-size: 16px;
    color: #333333;
    margin-bottom: 16px;
  }
}
.flex {
  display: flex;
  align-items: center;
}
.border {
  font-weight: 400;
  font-size: 14px;
  color: #148958 !important;
  border-bottom: 3px solid #148958;
}
.amar {
  margin-left: 315px;
}
.table {
  width: 207px;
  padding: 20px 0;
  font-weight: 400;
  font-size: 14px;
  display: flex;
  justify-content: center;
  color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
}
.bnoasif {
  position: absolute;
  top: 0px;
  left: 24px;
  width: 98.5%;
  // padding: 24px 24px 0;
  z-index: 999;
}
.cardHeader {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 98.7%;
  height: 64px;
  background: #ffffff;
  box-sizing: border-box;
  position: relative;
  /deep/.ant-anchor-wrapper{
    background: transparent !important;
  }
  .cardHeader_backBox {
    position: absolute;
    // top: 50%;
    left: 48px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #000000;
    z-index: 999999;
  }

  .cardHeader_icon {
    width: 16px;
    height: 16px;
  }

  .cardHeader_numBox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.4);
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.4);
  }

  .cardHeader_numBox_active {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #148958;
    border: 1px solid #148958;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
  }

  .cardHeader_numBox_end {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid #148958;

    img {
      width: 16px;
      height: 16px;
    }
  }

  .cardHeader_textBox {
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.4);
  }

  .cardHeader_textBox_active {
    color: #148958;
  }

  .cardHeader_hrBox {
    width: 344px;
    height: 2px;
    background: #dcdcdc;
  }

  .cardHeader_hrBox_active {
    background: #148958;
  }
}
</style>
