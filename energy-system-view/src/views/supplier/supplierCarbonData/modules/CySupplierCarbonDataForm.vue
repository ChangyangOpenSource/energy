<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form ref="formRef" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item :label="t('carbon.message.FillInType')" :labelCol="labelCol" :wrapperCol="wrapperCol" name="fillInType">
              <a-radio-group v-model:value="model.fillInType">
                <a-radio :value="1">{{ t('carbon.message.Product_carbon_footprint') }}</a-radio>
                <a-radio :value="2">{{ t('carbon.message.Organize_carbon_inventory') }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item :label="t('carbon.message.Supplier')" :labelCol="labelCol" :wrapperCol="wrapperCol" name="fillInUserId">
              <a-select optionFilterProp="children" v-model:value="model.fillInUserId" :placeholder="t('carbon.message.SelectSupplier')" show-search style='width: 100%;' @change="supplierChange">
                <a-select-option v-for="supplier in supplierList" :key="supplier.id" :value="supplier.id">
                  {{ supplier.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="24" v-if="model.fillInType == 1">
            <a-form-item :label="t('carbon.message.Product')" :labelCol="labelCol" :wrapperCol="wrapperCol" name="supplierProductId">
              <a-select optionFilterProp="children" v-model:value="model.supplierProductId" :placeholder="t('carbon.message.SelectSupplierProduct')" show-search style='width: 100%;' @change="productChange">
                <a-select-option v-for="product in supplierProductList" :key="product.id" :value="product.id">
                  {{ product.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="24" v-if="model.fillInType == 1">
            <a-form-item :label="t('carbon.message.Unit')" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-model:value="currentSupplierProductunit" disabled></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="24" v-if="model.fillInType == 1">
            <a-form-item :label="t('carbon.message.Model')" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-model:value="currentSupplierProductSpecification" disabled></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item :label="t('carbon.message.FillName')" :labelCol="labelCol" :wrapperCol="wrapperCol" name="fillInName">
              <a-input v-model:value="model.fillInName" :placeholder="t('carbon.message.EnterFillName')"></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item :label="t('carbon.message.FillInRemark')" :labelCol="labelCol" :wrapperCol="wrapperCol" name="fillInRemark">
              <a-textarea v-model:value="model.fillInRemark" :placeholder="t('carbon.message.EnterFillInRemark')" auto-size />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
  </a-spin>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { defHttp } from '/@/utils/http/axios'

// 使用 Composition API 工具
const { t } = useI18n()

const props = defineProps({
  //表单禁用
  disabled: {
    type: Boolean,
    default: false,
    required: false
  }
})

const emit = defineEmits(['ok'])

// refs
const formRef = ref(null)

// 数据定义
const model = ref({
  // 默认填报类型为产品碳足迹
  fillInType: 1,
  // 默认为供应链碳管理
  fillInSource: 3
})

const labelCol = { xs: { span: 24 }, sm: { span: 5 } }
const wrapperCol = { xs: { span: 24 }, sm: { span: 16 } }
const confirmLoading = ref(false)
const url = {
  add: "/cySupplierCarbonData/add",
  edit: "/cySupplierCarbonData/edit",
  queryById: "/cySupplierCarbonData/queryById",
  // 查询本机构全部供应商
  getAllSupplier: "/supplier/all",
  // 查询供应商的采购品
  getSupplierProduct:"/supplierProductRelation/supplierProductList"
}

const validatorRules = {
  fillInUserId: [{ required: true, message: t('carbon.message.SelectSupplier') }],
  fillInType: [{ required: true, message: t('carbon.message.SelectFillInType') }],
  fillInName: [{ required: true, message: t('carbon.message.EnterFillName') }],
  supplierProductId: [{ required: true, message: t('carbon.message.SelectSupplierProduct') }],
}

// 供应商列表
const supplierList = ref([])
// 供应商产品列表
const supplierProductList = ref([])
// 当前选择产品的单位
const currentSupplierProductunit = ref('')
// 当前选择产品的型号
const currentSupplierProductSpecification = ref('')

// 计算属性
const formDisabled = computed(() => props.disabled)

// 备份model原始值
let modelDefault = {}

// 生命周期
onMounted(() => {
  //备份model原始值
  modelDefault = JSON.parse(JSON.stringify(model.value));
  getAllSupplier();
})

// 方法定义
const supplierChange = (e) => {
  defHttp.get({url: url.getSupplierProduct, params: {supplierId: e, status: 1}}, { isTransformResponse: false}).then((res) => {
    supplierProductList.value = res.result
  })
  // 重置供应商商品
  model.value.supplierProductId = undefined
}

const productChange = (e) => {
  let index = supplierProductList.value.findIndex(item => item.id === e)
  // 当前选择产品的单位
  currentSupplierProductunit.value = supplierProductList.value[index].productUnitId_dictText
  // 当前选择产品的型号
  currentSupplierProductSpecification.value = supplierProductList.value[index].specification
}

// 查询所有供应商
const getAllSupplier = () => {
  defHttp.get({url: url.getAllSupplier}, { isTransformResponse: false}).then((res) => {
    supplierList.value = res.result;
  })
}

const add = () => {
  edit(modelDefault);
}

const edit = (record) => {
  model.value = Object.assign({}, record);
  // 注意：visible 在原代码中未定义，此处保留逻辑但注释说明
  // visible = true;
}

const submitForm = () => {
  // 触发表单验证
  formRef.value.validate().then(() => {
    confirmLoading.value = true;
    let httpurl = '';
    let method = '';
    if(!model.value.id){
      httpurl += url.add;
      method = 'post';
    }else{
      httpurl += url.edit;
      method = 'put';
    }
    defHttp[method]({url: httpurl, params: model.value}, { isTransformResponse: false}).then((res)=>{
      if(res.success){
        // 消息提示需要相应调整
        emit('ok');
      }else{
        // 消息提示需要相应调整
      }
    }).finally(() => {
      confirmLoading.value = false;
    })
  }).catch(error => {
    console.log('表单验证失败:', error);
  });
}

// 暴露给父组件的方法
defineExpose({
  add,
  edit,
  submitForm
})
</script>
