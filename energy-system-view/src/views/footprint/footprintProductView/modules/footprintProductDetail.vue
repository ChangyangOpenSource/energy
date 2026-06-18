<template>
  <div class="">
    <div class="cardHeader" v-if="!isShowFormPopup">
      <img class="cardHeader_icon m_hoverCP" :src="img28" alt="" @click="onBack" />
      <span class="m_hoverCP" @click="onBack">{{ t('carbon.message.Return') }}</span>
    </div>
    <section class="contentBox" v-if="!isShowFormPopup">
      <section class="content_left">
        <a-spin :spinning="savaLoading" :tip="t('carbon.message.Saving')">
          <div class="box1">
            <div class="box1_text">{{ t('carbon.message.Product_information') }}</div>
            <div class="box1_btn2 m_hoverCP" @click="onEditEnd" v-if="isEdit">{{ t('carbon.message.Complete') }}</div>
            <div class="box1_btn m_hoverCP" @click="onEdit" v-else>
              <img class="box1_btn_icon" :src="img36" alt="" />{{ t('carbon.message.Edit') }}
            </div>
          </div>
          <j-image-upload class="content_left_img" v-model:value="formObj.productPic" :disabled="!isEdit"></j-image-upload>
          <section class="box2">
            <div class="box2_item" style="width: 100%">
              <div class="box2_item_label">{{ t('carbon.message.Product_name') }}:</div>
              <div class="box2_item_text" v-if="isEdit">
                <a-input v-model:value="formObj.productName" allow-clear placeholder="请输入"></a-input>
              </div>
              <div class="box2_item_text" v-else>{{ formObj.productName }}</div>
            </div>
            <div class="box2_item">
              <div class="box2_item_label">{{ t('carbon.message.Specifications_and_models') }}:</div>
              <div class="box2_item_text" v-if="isEdit">
                <a-input v-model:value="formObj.productSpecification" allow-clear placeholder="请输入"></a-input>
              </div>
              <div class="box2_item_text" v-else>{{ formObj.productSpecification }}</div>
            </div>
            <div class="box2_item">
              <div class="box2_item_label">{{ t('carbon.message.Unit') }}:</div>
              <div class="box2_item_text" v-if="isEdit">
                <a-select v-model:value="formObj.productUnitId" allow-clear placeholder="请选择" @change="onChangeProductUnitId" style="width: 100%">
                  <a-select-opt-group :key="key" :label="key" v-for="(value, key) in getAllUnitByGroupData">
                    <a-select-option :key="itemA.id" :value="itemA.id" v-for="itemA in value">
                      {{ itemA.unitCode }}
                    </a-select-option>
                  </a-select-opt-group>
                </a-select>
              </div>
              <div class="box2_item_text" v-else>{{ formObj.productUnitName }}</div>
            </div>
            <div class="box2_item">
              <div class="box2_item_label">{{ t('carbon.message.Product_weight') }}:</div>
              <div class="box2_item_text" v-if="isEdit">
                <a-input-number
                  v-model:value="formObj.productWeight"
                  allow-clear
                  placeholder="请输入"
                  :step="0.01"
                  :precision="2"
                  style="width: 100%"
                ></a-input-number>
              </div>
              <div class="box2_item_text" v-else>{{ formObj.productWeight }}{{ formObj.productWeightUnit }}</div>
            </div>
            <div class="box2_item">
              <div class="box2_item_label">{{ t('carbon.message.productCategory') }}:</div>
              <div class="box2_item_text" v-if="isEdit">
                <a-select v-model:value="formObj.productClassificationId" @change="handleClassificationChange">
                  <a-select-option v-for="item in productClassificationList" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </div>
              <div class="box2_item_text" v-else>{{ formObj.productClassificationName }}</div>
            </div>
            <div class="box3_item">
              <div class="box2_item_label">{{ t('carbon.message.Product_Introduction') }}:</div>
              <div class="box2_item_text" v-if="isEdit">
                <div style="position: relative" class="flexOne">
                  <textarea
                    v-model="formObj.productIntroduction"
                    class="textarea flexOne"
                    placeholder="请输入内容"
                    name=""
                    id=""
                    cols="30"
                    rows="10"
                  ></textarea>
                  <div class="length"> {{ formObj.productIntroduction.length }}/500 </div>
                </div>
              </div>
              <div class="box2_item_text" v-else>{{ formObj.productIntroduction }}</div>
            </div>
          </section>
        </a-spin>
      </section>
      <section class="content_right">
        <div class="box3">
          <div class="box3_text">{{ t('carbon.message.Product_carbon_footprint') }}</div>
          <div class="box3_btn m_hoverCP" @click="onAdd">{{ t('carbon.message.new_accounting') }} </div>
        </div>
        <div class="tabBox">
          <a-tabs :activeKey="activeKey" @change="onChangeActiveKey">
            <a-tab-pane key="all" :tab="t('carbon.message.All')"></a-tab-pane>
            <a-tab-pane key="1" :tab="t('carbon.message.Accounting_has_been_created')"></a-tab-pane>
            <a-tab-pane key="2" :tab="t('carbon.message.Model_creation')"></a-tab-pane>
            <a-tab-pane key="3" :tab="t('carbon.message.Accounting_completion')"></a-tab-pane>
            <a-tab-pane key="4" :tab="t('carbon.message.Archived')"></a-tab-pane>
          </a-tabs>
          <div class="tabInnerBox" v-if="getCalculateListData && getCalculateListData.length > 0">
            <div class="itemBox" v-for="(item, index) in getCalculateListData" :key="index">
              <itemCard :item="item" @back="getData" @copy="onCopy" @detail="onDetail" />
            </div>
          </div>
        </div>
      </section>
    </section>
    <!-- 详情弹窗 -->
    <div class="m_popupBox padwdd" v-if="isShowFormPopup">
      <footprintProductForm ref="footprintProductFormRef" @back="back"></footprintProductForm>
    </div>
  </div>
</template>

<script  setup>
import { ref, reactive, onMounted, computed, nextTick, getCurrentInstance } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { defHttp } from '/@/utils/http/axios';
import itemCard from '../modules/itemCard.vue';
import footprintProductForm from '../modules/footprintProductForm.vue';
import JImageUpload from '/@/components/Form/src/jeecg/components/JImageUpload.vue';
import img28 from '@/assets/img/img28.png';
import img36 from '@/assets/img/img36.png';

// 使用 Composition API 工具
const { t } = useI18n();
const { createMessage } = useMessage();
let { ctx: that } = getCurrentInstance();

// 定义 refs
const footprintProductFormRef = ref();
const isShowFormPopup = ref(false); // 是否显示表单弹窗

const isShowFormPopupRef = ref(false); // 是否显示表单弹窗

// 定义响应式数据
const isEdit = ref(false);
const formObj = reactive({});
const activeKey = ref('all'); // all全部 1已创建核算 2模型创建中 3核算完成
const getCalculateListData = ref([]); // 核算列表数据
const fangLianDian = ref(true); // 防连点
const savaLoading = ref(false); // 保存产品数据加载框
const ProductI = ref(0); // 当前产品下标
const ProductS = ref([]); // 当前产品
const getAllUnitByGroupData = ref({}); // 单位分组数据
const productClassificationList = ref([]);
// 计算属性
const currentLength = computed(() => {
  return ProductS.value ? ProductS.value.length : 0;
});

/**
 * 获取产品分类列表
 */
function getProductClassificationList() {
  // 调用后端接口获取分类数据
  defHttp
    .get({ url: '/cyFootprintProductClassification/cyFootprintProductClassification/all' })
    .then((res) => {
      console.log('地方1', res);
      if (res.success) {
        productClassificationList.value = res.result || [];
      }
    })
    .catch((error) => {
      console.error('获取产品分类失败', error);
      createMessage.error('获取产品分类失败，请稍后重试');
    });
}

function getAvatarView(avatar) {
  return defHttp.getFileAccessHttpUrl(avatar);
}

/**
 * 上一个产品
 */
function onLast() {
  ProductI.value = ProductI.value - 1;
  getData();
}

/**
 * 下一个产品
 */
function onNext() {
  ProductI.value = ProductI.value + 1;
  getData();
}

/**
 * 切换tab
 * @param key all全部 1已创建核算 2模型创建中 3核算完成
 */
function onChangeActiveKey(key) {
  console.log('onChangeActiveKey', key);
  activeKey.value = key;
  getData();
}

/**
 * 核算表单回调
 */
function back(value) {
  try {
    isShowFormPopupRef.value = false;
    isShowFormPopup.value = false;
    getData();
    // console.log('back', isShowFormPopup.value);
    console.log('back', that, isShowFormPopup.value, isShowFormPopupRef.value);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

/**
 * 复制核算成功触发
 */
function onCopy() {
  getData('copy');
}

/**
 * 核算详情/核算编辑
 * @param item
 */
function onDetail(item, copy) {
  console.log('核算详情/核算编辑', item);
  isShowFormPopup.value = true;
  isShowFormPopupRef.value = true;
  nextTick(() => {
    console.log('核算详情/核算编辑', footprintProductFormRef.value);
    let theObj = {
      productId: formObj.id,
      productName: formObj.productName,
      functionalUnit: item.functionalUnit,
      batchNumber: item.batchNumber,
      productUnitId: formObj.productUnitId,
      productUnitName: formObj.productUnitName,
      productClassificationId: formObj.productClassificationId,
      productClassificationName: formObj.productClassificationName,
      calculateNumber: item.calculateNumber,
      dataRange: [item.beginTime, item.endTime],
      beginTime: item.beginTime,
      endTime: item.endTime,
      lifeCycleType: item.lifeCycleType,
      flowChart: item.flowChart,
      id: item.id,
      calculateArchived: item.calculateArchived, // 是否归档
      reportAddress: item.reportAddress, // 第三步查看碳足迹报告链接
      cacheLifeCycleItem: '',
    };
    if (item.lifeCycleType == 3) {
      theObj.cacheLifeCycleItem = item.lifeCycleItem.split(',');
    }
    console.log('theObj', theObj);
    console.log('footprintProductFormRef', footprintProductFormRef.value.queryParam);

    // 设置表单数据
    Object.assign(footprintProductFormRef.value.queryParam, theObj);
    footprintProductFormRef.value.getData();

    let step = '';
    if (copy) {
      // 复制并打开详情到第一阶段
      step = 1;
    } else {
      // 打开详情到当前阶段
      step = item.calculateStatus;
    }
    footprintProductFormRef.value.onChangeStep(step, item.calculateArchived === '1');
  });
}

/**
 * 添加核算
 */
function onAdd() {
  console.log('onAdd');
  isShowFormPopup.value = true;
  nextTick(() => {
    console.log('onAdd', footprintProductFormRef.value);
    footprintProductFormRef.value.queryParam.productId = formObj.id;
    footprintProductFormRef.value.queryParam.productName = formObj.productName;
    footprintProductFormRef.value.queryParam.productUnitId = formObj.productUnitId;
    footprintProductFormRef.value.queryParam.productUnitName = formObj.productUnitName;
    footprintProductFormRef.value.getData();
  });
}

function getData(copy) {
  Object.assign(formObj, ProductS.value[ProductI.value]);
  console.log('getData', formObj);

  // 单位
  defHttp.get({ url: '/emission/factor/cyEmissionUnit/getAllUnitByGroup' }).then((res) => {
    getAllUnitByGroupData.value = res || {};
  });

  // 核算数据
  let reqData = {
    productId: formObj.id,
  };
  if (activeKey.value != 'all') {
    reqData.calculateStatus = activeKey.value;
  }
  getCalculateListData.value = [];
  fangLianDian.value = false;

  defHttp
    .get({ url: '/footprintProduct/cyFootprintProduct/getCalculateList', params: reqData })
    .then((res) => {
      if (res) {
        let resData = res || [];
        // 计算每一条的总碳排
        resData.forEach((item) => {
          let totalCarbonEmission = 0;
          if (item.calculateLifeCycle && item.calculateLifeCycle.length > 0) {
            item.calculateLifeCycle.forEach((itemA) => {
              totalCarbonEmission = totalCarbonEmission + itemA.carbonEmission;
            });
          }
          item.totalCarbonEmission = totalCarbonEmission.toFixed(4);
        });
        getCalculateListData.value = resData;
        if (copy) {
          // 复制核算后，打开详情，跳转到第一阶段
          onDetail(getCalculateListData.value[0], 'copy');
        }
      }
    })
    .finally(() => {
      fangLianDian.value = true;
    });
}

// ============================================================编辑产品
/**
 * 修改产品分类
 * @param e 分类id
 */
function handleClassificationChange(e) {
  console.log('handleClassificationChange', e, productClassificationList.value);
  for (let i = 0; i < productClassificationList.value.length; i++) {
    let item = productClassificationList.value[i];
    if (item.id == e) {
      formObj.productClassificationName = item.name;
    }
  }
  console.log('handleClassificationChange2', formObj);
}

/**
 * 编辑产品单位
 */
function onChangeProductUnitId(e) {
  console.log('onChangeProductUnitId', e, getAllUnitByGroupData.value);
  for (let key in getAllUnitByGroupData.value) {
    let value = getAllUnitByGroupData.value[key];
    for (let index = 0; index < value.length; index++) {
      if (value[index].id == e) {
        formObj.productUnitName = value[index].unitCode;
      }
    }
  }
}

/**
 * 编辑产品
 */
function onEdit() {
  console.log('onEdit');
  isEdit.value = true;
}

/**
 * 检查编辑产品表单数据
 */
function checkFormData() {
  if (!formObj.productName) {
    createMessage.warn(t('carbon.message.please_select_product_name'));
    return false;
  }
  if (!formObj.productSpecification) {
    createMessage.warn(t('carbon.message.please_enter_specification_model'));
    return false;
  }
  if (!formObj.productUnitId) {
    createMessage.warn(t('carbon.message.please_select_unit'));
    return false;
  }
  if (!formObj.productWeight) {
    createMessage.warn(t('carbon.message.please_select_weight'));
    return false;
  }
  return true;
}

/**
 * 确定编辑产品
 */
function onEditEnd() {
  console.log('onEditEnd');
  if (checkFormData()) {
    savaLoading.value = true;
    defHttp
      .post({ url: '/footprintProduct/cyFootprintProduct/saveProduct', params: formObj })
      .then((res) => {
        if (res=='操作成功！') {
          createMessage.success(res.message);
          isEdit.value = false;
          emit('update');
        }
      })
      .finally(() => {
        savaLoading.value = false;
      });
  }
}

// ============================================================通用

function throttle(func, wait) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      func.apply(this, args);
    }
  };
}

function debounce(func, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
}

/**
 * 返回上一级
 */
function onBack() {
  if (fangLianDian.value) {
    emit('back');
  }
}

// 定义 emits
const emit = defineEmits(['back', 'update']);

defineExpose({
  getData,
  onEdit,
  onBack,
  ProductI, // 暴露 ProductI
  ProductS, // 暴露 ProductS
});

// 生命周期钩子
onMounted(() => {
  getProductClassificationList();
});
</script>

<style lang="less" scoped>
.padwdd {
  padding: 56px 24px !important;
}

&:focus-visible {
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
  padding: 8px;
}

.flexOne {
  flex: 1;
}

.content_left_img {
  :deep(.ant-upload-list-picture-card-container) {
    width: 229px;
    height: 196px;
  }

  :deep(.ant-upload-list-picture-card .ant-upload-list-item) {
    width: 229px;
    height: 196px;
  }

  :deep(.ant-upload.ant-upload-select-picture-card) {
    width: 229px;
    height: 196px;
  }
}

.cardHeader {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #000000;

  .cardHeader_icon {
    width: 16px;
    height: 16px;
  }
}

.contentBox {
  margin-top: 24px;
  display: flex;
  gap: 24px;

  .content_left {
    position: relative;
    box-sizing: border-box;
    width: 410px;
    padding: 24px;
    background: #ffffff;
    height: calc(100vh - 59px - 24px - 24px - 24px - 21px);
  }

  .content_left_img {
    display: block;
    margin: 24px auto 0;
    width: 229px;
    height: 196px;
  }

  .content_left_btnBox {
    position: absolute;
    left: 24px;
    bottom: 24px;
    width: 362px;
  }

  .content_right {
    flex: 1;
    padding: 24px;
    background: #ffffff;
  }
}

.box1 {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .box1_text {
    font-family: PingFang SC, PingFang SC;
    font-weight: bold;
    font-size: 16px;
    color: #333333;
  }

  .box1_btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 79px;
    height: 24px;
    border-radius: 3px;
    border: 1px solid #888888;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #333333;

    img {
      width: 14px;
      height: 14px;
    }
  }

  .box1_btn2 {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 59px;
    height: 24px;
    background: #ffffff;
    border-radius: 3px;
    border: 1px solid @primary-color;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: @primary-color;
  }
}

.box2 {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  .box2_item {
    width: 49%;
    margin-top: 24px;
  }

  .box3_item {
    width: 100%;
    margin-top: 24px;
  }

  .box2_item_label {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #777777;
  }

  .box2_item_text {
    margin-top: 8px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }
}

.box3 {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .box3_text {
    font-family: PingFang SC, PingFang SC;
    font-weight: bold;
    font-size: 16px;
    color: #333333;
  }

  .box3_btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 115px;
    height: 32px;
    background: @primary-color;
    border-radius: 3px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
  }
}

.tabBox {
  .tabInnerBox {
    padding: 8px 0 0;
  }

  .itemBox {
    margin-bottom: 24px;
  }

  .itemBox:last-child {
    margin-bottom: 0;
  }
}
</style>
