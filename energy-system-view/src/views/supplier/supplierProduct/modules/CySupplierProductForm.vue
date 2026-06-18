<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer :disabled="formDisabled">
      <a-form ref="formRef" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item :label="t('carbon.message.PurchasedItem')" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model:value="model.name" :placeholder="t('carbon.message.Please_enter_the_purchase_item_name')" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :label="t('carbon.message.Unit')" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
              <UnitCascader :unitId="model.productUnitId" v-model:value="model.productUnitId" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :label="t('carbon.message.SpecificationModel')" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="specification">
              <a-input-number v-model:value="model.specification" :placeholder="t('carbon.message.Please_enter_specification_model')" style="width: 200px" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :label="t('carbon.message.Table_Column_UnitPrice')" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="price">
              <a-input-number v-model:value="model.price" :placeholder="t('carbon.message.Please_enter_unit_price')" style="width: 200px" /> {{ t('carbon.message.Currency_unit_yuan') }}
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :label="t('carbon.message.Form_Label_ProductRemark')" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-textarea v-model:value="model.remark" rows="4" :placeholder="t('carbon.message.Please_enter_product_remark')" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </JFormContainer>
  </a-spin>
</template>

<script setup>
import { ref, reactive, computed, onMounted,nextTick } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { defHttp } from '/@/utils/http/axios'
import UnitCascader from "/@/components/common/UnitCascader.vue"
import JFormContainer from "@/components/Form/src/jeecg/components/JFormContainer.vue";
import { message } from 'ant-design-vue'

// 使用 i18n
const { t } = useI18n()

// 数据定义
const model = reactive({
  name: '',
  productUnitId: '',
  specification: '',
  price: '',
  remark: ''
})

const labelCol = {
  xs: { span: 24 },
  sm: { span: 5 }
}

const wrapperCol = {
  xs: { span: 24 },
  sm: { span: 16 }
}

const confirmLoading = ref(false)
const formDisabled = computed(() => disabled.value)

const validatorRules = {
  name: [
    { required: true, message: t('carbon.message.Please_enter_the_purchase_item_name') }
  ],
  weightUnit: [
    { required: true, message: t('carbon.message.Validate_Message_WeightUnit') }
  ]
}

const url = {
  add: '/supplierProduct/add',
  edit: '/supplierProduct/edit',
  queryById: '/supplierProduct/queryById'
}

const getAllUnitByGroupData = ref({})

// props 定义
const disabled = defineProps({
  disabled: {
    type: Boolean,
    default: false,
    required: false
  }
})

// emit 定义
const emit = defineEmits(['ok'])

// 引用模板元素
const formRef = ref()

// 方法定义
const getData = () => {
  defHttp.get({
    url: '/emission/factor/cyEmissionUnit/getAllUnitByGroup'
  }).then((res) => {
    if (res.success) {
      getAllUnitByGroupData.value = res.result || {}
    }
  })
}

const add = () => {
  edit(model)
}

const edit = (record) => {
  console.log("这是最后的地方，有数据额", record)
  // 使用 Vue 的响应式更新方式
  Object.assign(model, record)
  console.log("这是最后地方，有数据", model)
}

const submitForm = () => {
  // 触发表单验证
  formRef.value.validate().then(() => {
      confirmLoading.value = true
      let httpurl = ''
      let method = ''
      if (!model.id) {
        httpurl += url.add
        method = 'post'
      } else {
        httpurl += url.edit
        method = 'put'
      }

      defHttp[method]({
        url: httpurl,
        params: model
      }, { isTransformResponse: false}).then((res) => {
        if (res.success) {
          message.success(res.message)
          emit('ok')
        } else {
          message.error(res.message)
        }
      }).finally(() => {
        confirmLoading.value = false
      })
  })
}

// 生命周期钩子
onMounted(() => {
  getData()
})

// 暴露方法给父组件
defineExpose({
  add,
  edit,
  submitForm
})

</script>
