<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form ref="formRef" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="温室气体名称" :label-col="labelCol" :wrapper-col="wrapperCol" prop="gasName" required>
              <a-input v-model:value="model.gasName" placeholder="请输入温室气体名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="GWP值" :label-col="labelCol" :wrapper-col="wrapperCol" prop="gwpValue" required>
              <a-input-number v-model:value="model.gwpValue" placeholder="请输入GWP值" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
  </a-spin>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { defHttp } from '/@/utils/http/axios'

// Props
const props = defineProps({
  //表单禁用
  disabled: {
    type: Boolean,
    default: false
  }
})

// Refs
const formRef = ref()
const confirmLoading = ref(false)

// Reactive data
const model = reactive({})

const labelCol = {
  xs: { span: 24 },
  sm: { span: 5 },
}

const wrapperCol = {
  xs: { span: 24 },
  sm: { span: 16 },
}

const validatorRules = reactive({})

const url = {
  add: "/gas/cyGasStore/add",
  edit: "/gas/cyGasStore/edit",
  queryById: "/gas/cyGasStore/queryById",
  delete: "/gas/cyGasStore/delete"
}

// Computed
const formDisabled = computed(() => props.disabled)

// Methods
const add = () => {
  edit(JSON.parse(JSON.stringify(model)))
}

const edit = (record) => {
  Object.assign(model, record)
}

const submitForm = () => {
  if (!model.gasName) {
    message.warn('请输入温室气体名称')
    return
  }

  if (!model.gasName.includes("(") || !model.gasName.includes(")")) {
    message.warn('请输入正确的温室气体名称')
    return
  }

  if (!model.gwpValue) {
    message.warn('请输入GWP值')
    return
  }

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

    defHttp.request({ url: httpurl, method, data: model }, { isTransformResponse: false}).then((res) => {
      if (res.success) {
        message.success(res.message)
        emit('ok')
      } else {
        message.warning(res.message)
      }
    }).finally(() => {
      confirmLoading.value = false
    })
  }).catch(() => {
    // Validation failed
  })
}

// Emits
const emit = defineEmits(['ok'])

// Expose methods
defineExpose({
  add,
  edit,
  submitForm
})
</script>
