<!-- 产品碳足迹-产品碳足迹-添加产品弹窗 -->
<template>
  <div>
    <a-drawer
      :title="t('carbon.message.Add_product')"
      :width="600"
      v-model:visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose">
      <div class="table-page-search-wrapper">
        <a-form :model="formObj" layout="vertical" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
          <a-form-item :label="t('carbon.message.productCategory')" required>
            <a-select
              v-model:value="formObj.productClassificationId"
              allow-clear
              :placeholder="t('carbon.message.Please_select')"
              show-search
              :filter-option="filterOption"
            >
              <a-select-option
                :value="item.id"
                v-for="(item) in productClassificationList"
                :key="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item :label="t('carbon.message.Product_name')" required>
            <a-input v-model:value="formObj.productName" allow-clear :placeholder="t('carbon.message.Please_enter')"></a-input>
          </a-form-item>

          <a-form-item :label="t('carbon.message.Specifications_and_models')" required>
            <a-input v-model:value="formObj.productSpecification" allow-clear :placeholder="t('carbon.message.Please_enter')"></a-input>
          </a-form-item>

          <a-form-item :label="t('carbon.message.Unit')" required>
            <UnitCascader
              v-if="visible"
              :unitId="formObj.productUnitId"
              v-model:value="formObj.productUnitId"
              @change="onChangeProductUnitId"
              style="width: 100%;"
            />
          </a-form-item>

          <a-form-item :label="t('carbon.message.Unit_product_weight')" required>
            <div style="display: flex; align-items: center; width: 100%;">
              <a-input-number
                v-model:value="formObj.productWeight"
                :precision="2"
                :step="0.01"
                allow-clear
                :placeholder="t('carbon.message.Please_enter')"
                style="flex: 1; margin-right: 8px;"
              />
              <a-select
                v-model:value="formObj.productWeightUnit"
                :filter-option="filterOption"
                allow-clear
                :placeholder="t('carbon.message.please_select_unit')"
                show-search
                style="flex: 1;"
                @change="onChangeProductWeightUnit"
              >
                <a-select-option v-for="(item, index) in weightUnitData" :key="index" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </div>
          </a-form-item>

          <div class="uploadTitle">{{ t('carbon.message.Product_image') }}</div>
          <div class="uploadContent">
            <j-image-upload
              class="avatar-uploader"
              v-model:value="formObj.productPic"
              style="width: 100%;"
            />
          </div>

          <div class="uploadTitle">{{ t('carbon.message.Product_Introduction') }}</div>
          <div class="uploadContent">
            <div style="position: relative; width: 100%;">
              <textarea
                v-model="formObj.productIntroduction"
                class="textarea"
                :placeholder="t('carbon.message.Please_enter')"
                cols="30"
                rows="5"
                style="width: 100%; height: 119px;"
              ></textarea>
              <div class="length" v-if="formObj.productIntroduction">
                {{ formObj.productIntroduction.length }}/500
              </div>
            </div>
          </div>
        </a-form>
      </div>

      <div class="drawerOptionBox">
        <a-button style="margin-right: 8px;" @click="onClose">{{ t('carbon.message.Cancel') }}</a-button>
        <a-button type="primary" @click="onSubmit"> {{ t('carbon.message.Confirm') }}</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { defHttp } from '/@/utils/http/axios'
import UnitCascader from "/@/components/common/UnitCascader.vue"
import JImageUpload from '/@/components/Form/src/jeecg/components/JImageUpload.vue'

// 使用 Composition API 工具
const { t } = useI18n()
const { createMessage } = useMessage()

// 定义响应式数据
const loading = ref(false)
const dataSource = ref([]) // 我的添加数据
const isShowDetailPopup = ref(false) // 详情弹窗
const productClassificationList = ref([]) // 产品分类列表
const formObj: any = reactive({
  productIntroduction: ''
})
const visible = ref(false)
const labelCol = { span: 4 }
const wrapperCol = { span: 14 }
const product_typeData = ref([]) // 产品类型
const weightUnitData = ref(['g', 'kg', 't']) // 重量单位
const getAllUnitByGroupData = ref({}) // 单位分组数据

/**
 * 获取产品分类列表
 */
function getProductClassificationList() {
  defHttp.get({ url: '/cyFootprintProductClassification/cyFootprintProductClassification/all' })
    .then(res => {
      if (res) {
        productClassificationList.value = res || [];
      }
    })
    .catch(error => {
      console.error('获取产品分类失败', error);
      createMessage.error('获取产品分类失败，请稍后重试');
    });
}

/**
 * 修改产品类型
 */
function onChangeProductTypeId(e) {
  console.log('onChangeProductTypeId', e)
  let theIndex = product_typeData.value.findIndex((ele: any) => ele.value == e)
  if (theIndex > -1) {
    formObj.productTypeName = product_typeData.value[theIndex].text
  }
}

/**
 * 修改产品单位
 */
function onChangeProductUnitId(e) {
  console.log('onChangeProductUnitId', e, getAllUnitByGroupData.value)
  for (let key in getAllUnitByGroupData.value) {
    let value = getAllUnitByGroupData.value[key]
    for (let index = 0; index < value.length; index++) {
      if (value[index].id == e) {
        formObj.productUnitName = value[index].unitCode
      }
    }
  }
}

/**
 * 修改产品重量单位
 */
function onChangeProductWeightUnit(e) {
  console.log('onChangeProductWeightUnit', e)
}

/**
 * 检查添加产品表单数据
 */
function checkFormData() {
  if (!formObj.productName) {
    createMessage.warn(t('carbon.message.please_select_product_name'))
    return false
  }
  if (!formObj.productSpecification) {
    createMessage.warn(t('carbon.message.please_enter_specification_model'))
    return false
  }
  if (!formObj.productUnitId) {
    createMessage.warn(t('carbon.message.please_select_unit'))
    return false
  }
  if (!formObj.productWeight) {
    createMessage.warn(t('carbon.message.please_select_weight'))
    return false
  }
  if (!formObj.productWeightUnit) {
    createMessage.warn(t('carbon.message.please_select_weight_unit'))
    return false
  }
  return true
}

/**
 * 提交添加产品
 */
function onSubmit() {
  console.log('onSubmit', formObj)
  if (checkFormData()) {
    defHttp.post({ url: '/footprintProduct/cyFootprintProduct/saveProduct', params: formObj }).then((res) => {
      if (res.success) {
        createMessage.success(res.message)
        emit('back')
        onClose()
      }
    });
  }
}

function getData() {
  // 产品类型
  const dictCode = 'product_type'
  defHttp.get({ url: `/sys/dict/getDictItems/${dictCode}` }).then((res) => {
    product_typeData.value = res || []
    console.log('getDictItems product_type =>', res)
  })
  // 单位
  defHttp.get({ url: '/emission/factor/cyEmissionUnit/getAllUnitByGroup' }).then((res) => {
    getAllUnitByGroupData.value = res || {}
  });
  //产品分类
  defHttp.get({ url: '/cyFootprintProductClassification/cyFootprintProductClassification/all' })
    .then(res => {
      productClassificationList.value = res || [];
    })
}

/**
 * 下拉框数据过滤
 */
function filterOption(input, option) {
  return (
    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  );
}

/**
 * 关闭抽屉，初始化数据
 */
function onClose() {
  Object.keys(formObj).forEach(key => {
    delete formObj[key];
  });
  formObj.productIntroduction = '';
  visible.value = false;
}

// 定义 emits
const emit = defineEmits(['back'])

// 生命周期钩子
onMounted(() => {
  getProductClassificationList();
})

// 暴露方法给父组件
defineExpose({
  getData,
  visible
})
</script>

<style lang="less" scoped>
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

:deep(.ant-card-body) {
  background: #F5F8F7;
}

.drawerOptionBox {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: right;
  z-index: 1;
}

.uploadTitle {
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8px;
}

.uploadContent {
  margin-top: 8px;
}

:deep(.ant-form-item-control-wrapper) {
  margin-bottom: 16px;
}
</style>
