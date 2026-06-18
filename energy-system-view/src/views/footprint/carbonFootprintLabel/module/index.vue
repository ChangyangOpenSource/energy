<template>
  <div class="centers">
    <div class="conters">
      <div class="cardHeader_backBox m_hoverCP marBottom">
        <img
          class="cardHeader_icon m_hoverCP"
          src="@/assets/img/img28.png"
          alt=""
          @click="onBack"
        />
        <span class="m_hoverCP" @click="onBack">{{
            t("carbon.message.Return")
          }}</span>
      </div>
      <div class="tabBox marBottom">
        <div class="table-page-search-wrapper">
          <a-form >
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item :label="t('carbon.message.Product_name')">
                  <a-select
                    v-model:value="queryParam.productId"
                    :placeholder="t('carbon.message.Please_select')"
                    show-search
                    :disabled="disable"
                    :filter-option="filterOption"
                    @change="onChangeNumeratorUnitId"
                    style="width: 100%"
                  >
                    <a-select-option
                      :value="item.id"
                      v-for="(item, index) in productData"
                      :key="index"
                    >
                      {{ item.productName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="t('carbon.message.Calculate_the_batch_code')">
                  <a-select
                    v-model:value="queryParam.calculateId"
                    :placeholder="t('carbon.message.Please_select')"
                    show-search
                    :disabled="disable"
                    :filter-option="filterOption"
                    @change="onChangeNumer"
                    style="width: 100%"
                  >
                    <a-select-option
                      :value="item.id"
                      :disabled="!item.isSelected"
                      v-for="(item, index) in calculateData"
                      :key="index"
                    >
                      {{ item.batchNumber }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6"> </a-col>
              <a-col :span="6"> </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
      <!-- 概况 -->
      <div class="gaikuao marBottom">
        <div class="title">{{ t("carbon.message.Basic_product_information") }}</div>
        <div class="marBottom" style="display: flex; gap: 24px">
          <div class="flexOne">
            <div class="text marBom"><span class="red">*</span>{{ t("carbon.message.Product_image") }}</div>
            <div class="flex">
              <j-image-upload
                v-if="list.productPic"
                class="avatar-uploader"
                :disabled="true"
                :text="t('carbon.message.Click_Upload_File')"
                v-model:value="list.productPic"
              ></j-image-upload>
              <img class="image" src="@/assets/carbon/img16.png" alt="" v-else />
            </div>
          </div>
          <div class="flexOne">
            <div class="text marBom"><span class="red">*</span>{{ t("carbon.message.Process_flow_chart") }}</div>
            <div class="flex">
              <j-image-upload
                v-if="liWt.flowChart"
                class="avatar-uploader"
                :disabled="true"
                :text="t('carbon.message.Click_Upload_File')"
                v-model:value="liWt.flowChart"
              ></j-image-upload>
              <img class="image" src="@/assets/carbon/img16.png" alt="" v-else />
            </div>
          </div>
        </div>
        <div class="marBottom flex">
          <div class="flex widths">
            <div class="leftText">{{ t("carbon.message.Product_name") }}:</div>
            <div class="rightText">{{ list.productName }}</div>
          </div>
          <div class="flex widths">
            <div class="leftText">
              {{ t("carbon.message.Specifications_and_models") }}：
            </div>
            <div class="rightText">{{ list.productSpecification }}</div>
          </div>
          <div class="flex widths">
            <div class="leftText">{{ t("carbon.message.Unit") }}:</div>
            <div class="rightText">{{ list.productUnitName }}</div>
          </div>
          <div class="flex widths">
            <div class="leftText">{{ t("carbon.message.Product_weight") }}:</div>
            <div class="rightText">{{ list.productWeight }}{{ list.productWeightUnit }}</div>
          </div>
        </div>
        <div class="marBottom flex">
          <div class="flex widths">
            <div class="leftText">{{ t("carbon.message.Accounting_boundary") }}:</div>
            <div class="rightText">
              {{
                liWt.lifeCycleType == 1
                  ? t("carbon.message.From_cradle_to_gate")
                  : liWt.lifeCycleType == 2
                    ? t("carbon.message.From_cradle_to_grave")
                    : liWt.lifeCycleType == 3
                      ? t("carbon.message.Customize")
                      : ""
              }}
            </div>
          </div>
          <div class="flex widths">
            <div class="leftText">
              {{ t("carbon.message.Accounting_quantity") }}：
            </div>
            <div class="rightText">{{ liWt.calculateNumber }}</div>
          </div>
          <div class="flex widths">
            <div class="leftText">{{ t("carbon.message.accounting_cycle") }}:</div>
            <div class="rightText">{{ liWt.beginTime }}-{{ liWt.endTime }}</div>
          </div>
          <div class="flex widths">
            <div class="leftText">
              {{ t("carbon.message.Product_carbon_footprint") }}:
            </div>
            <div class="rightText">{{ liWt.totalCarbonEmission }}kgCO₂e</div>
          </div>
        </div>
        <div class="marBottom">
          <div class="flex">
            <div class="leftText">
              {{ t("carbon.message.Product_Introduction") }}:
            </div>
            <div class="rightText">
              {{ list.productIntroduction ? list.productIntroduction : "" }}
            </div>
          </div>
        </div>
      </div>
      <!--  碳足迹认证书 -->
      <div class="gaikuao marBottom">
        <div class="title">
          {{ t("carbon.message.Carbon_footprint_certification") }}
        </div>
        <div class="marBottom">
          <div class="flexOne">
            <div class="flex">
              <j-image-upload
                class="avatar-uploader"
                :text="t('carbon.message.upload_attachment')"
                v-model:value="queryParam.certificate"
              ></j-image-upload>
            </div>
          </div>
          <div class="tishiText">
            {{
              t(
                "carbon.message.Only_pdf_png_jpg_and_peg_formats_are_supported_for_upload_with_a_maximum_of_one_file_The_size_of_each_file_should_not_exceed_5M"
              )
            }}
          </div>
        </div>
      </div>
      <!--  H5信息 -->
      <div class="gaikuao marBottom">
        <div class="title">
          {{ t("carbon.message.H5_Information") }}
        </div>
        <div class="marBottom">
          <div class="flex" style="gap: 172px">
            <!-- <div class="flexOne">
              <div class="text marBom">{{ t("carbon.message.Company_Profile") }}</div>
              <textarea
                class="textarea flexOne"
                v-model:value="queryParam.orgContent"
                name=""
                id=""
                cols="30"
                rows="10"
              ></textarea>
            </div> -->
            <div class="flexOne">
              <div class="text marBom"><span class="red">*</span>{{ t("carbon.message.Label_LOGO") }}</div>
              <j-image-upload
                class="avatar-uploader"
                :text="t('carbon.message.upload_attachment')"
                v-model:value="queryParam.labelImg"
              ></j-image-upload>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="button">
      <div class="boots" @click="onSubime" v-if="type == 1 || type == 3">
        {{ t("carbon.message.Confirm_the_generation") }}
      </div>
      <div class="boots" @click="onSubimeUpdata" v-else>
        {{ t("carbon.message.Regenerate") }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { defHttp } from '/@/utils/http/axios'
import JImageUpload from "@/components/Form/src/jeecg/components/JImageUpload.vue";

// 使用 Composition API 工具
const { t } = useI18n()
const { createMessage } = useMessage()

// 定义 emits
const emit = defineEmits(['back'])

// Reactive 数据
const queryParam = reactive({
  certificate: "",
  labelImg: "",
  productId: undefined,
  calculateId: undefined,
})

const type = ref(1)
const productData = ref([])
const calculateData = ref([])
const list = reactive({
  productPic: ''
})
const liWt = reactive({
  flowChart: ''
})
const disable = ref(false)

// Methods
/**
 * 下拉框数据过滤
 */
const filterOption = (input, option) => {
  return (
    option.componentOptions.children[0].text
      .toLowerCase()
      .indexOf(input.toLowerCase()) >= 0
  )
}

/**
 * 返回
 */
const onBack = () => {
  emit("back")
}

const onChangeNumeratorUnitId = (e) => {
  let arr = 0
  arr = productData.value.findIndex(
    (item) => item.id == queryParam.productId
  )
  console.log(productData.value[arr], 'this.list')
  if (arr != -1) {
    Object.assign(list, productData.value[arr])
  }
  getFinishCalculateList(1)
}

const onChangeNumer = (e) => {
  console.log(queryParam)
  let arr = 0
  arr = calculateData.value.findIndex(
    (item) => item.id == queryParam.calculateId
  )
  if (arr != -1) {
    Object.assign(liWt, calculateData.value[arr])
  }
  console.log(liWt)
}

//产品列表
const getProductList = (value) => {
  defHttp.get({
    url: "/footprintProduct/cyFootprintProduct/getProductList"
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      productData.value = res.result
      if (value == 1) {
        onChangeNumeratorUnitId()
      }
    }
  })
}

//编辑
const getUpdate = () => {
  getProductList(1)
}

//产品核算列表
const getFinishCalculateList = (value) => {
  defHttp.get({
    url: "/footprintProduct/cyFootprintProduct/getFinishCalculateList",
    params: {
      productId: queryParam.productId,
    }
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      calculateData.value = res.result
      if (value == 1 && (type.value == 2 || type.value == 3)) {
        onChangeNumer()
      }
    }
  })
}

//新建
const onSubime = () => {
  if (!queryParam.labelImg) {
    createMessage.error(t("carbon.message.Please_upload_pictures"))
    return
  }
  defHttp.post({
    url: "/footprintProduct/cyFootprintProductCalculateLabel/applyLabel",
    params: queryParam
  }).then((res) => {
    if (res.success) {
      createMessage.success(t("carbon.message.operation_success"))
      emit("back", 1)
    } else {
      createMessage.error(res.message)
    }
  })
}

//编辑
const onSubimeUpdata = () => {
  if (!queryParam.labelImg) {
    createMessage.error(t("carbon.message.Please_upload_pictures"))
    return
  }
  defHttp.post({
    url: "/footprintProduct/cyFootprintProductCalculateLabel/editLabel",
    params: queryParam
  }).then((res) => {
    if (res.success) {
      createMessage.success(t("carbon.message.operation_success"))
      emit("back")
    }
  })
}

// 暴露给父组件的方法
defineExpose({
  getProductList,
  getUpdate,
  type,
  queryParam,
  disable
})
</script>

<style scoped>
</style>

<style lang="less" scoped>
/deep/ .ant-upload-list {
  display: flex;
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

.tishiText {
  font-weight: 400;
  font-size: 12px;
  color: #888888;
  margin-top: 24px;
}

.widths {
  width: 25%;
}

.leftText {
  font-weight: 400;
  font-size: 14px;
  color: #888888;
}

.rightText {
  font-weight: 400;
  font-size: 14px;
  color: #333333;
}

.tabBox {
  padding: 24px 24px 0;
  background: #ffffff;
  border-radius: 3px;
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
    background: @primary-color;
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

:focus-visible {
  outline: 0px;
}

.length {
  font-weight: 400;
  font-size: 12px;
  color: #888888;
  position: absolute;
  right: 8px;
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
}

.textarea1 {
  width: 100%;
  height: 54px;
  font-weight: 400;
  font-size: 14px;
  border: 1px solid #dcdcdc;
  color: #333333;
  resize: none;
}

.textarea2 {
  width: 100%;
  height: 64px;
  font-weight: 400;
  font-size: 14px;
  border: 1px solid #dcdcdc;
  color: #333333;
  resize: none;
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

.marBottom1 {}

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
  padding: 24px 339px;

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
    font-weight: 500;
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
}

.cardHeader {
  position: relative;
  display: flex;
  align-items: center;
  // justify-content: center;
  gap: 16px;
  width: 100%;
  height: 64px;
  background: #ffffff;
}

.cardHeader_backBox {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #000000;
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
</style>
