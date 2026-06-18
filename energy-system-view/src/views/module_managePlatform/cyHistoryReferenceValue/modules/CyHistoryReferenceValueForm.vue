<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer :disabled="formDisabled">
      <a-form ref="formRef" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item :label="$t('carbon.message.industry')" :label-col="labelCol" :wrapper-col="wrapperCol" prop="industry">
              <a-input v-model:value="model.industry" :placeholder="$t('carbon.message.industry')"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :label="$t('carbon.message.year')" :label-col="labelCol" :wrapper-col="wrapperCol" prop="year">
              <a-date-picker
                v-model:value="model.year"
                allow-clear
                :format="monthFormat"
                :value-format="monthFormat"
                mode="year"
                :open="yearOpen"
                @panelChange="opanelChange"
                @openChange="onopenelChange"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :label="$t('carbon.message.Reference_Value')" :label-col="labelCol" :wrapper-col="wrapperCol" prop="referenceValue">
              <a-input-number v-model:value="model.referenceValue" :placeholder="$t('carbon.message.Reference_Value')" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </JFormContainer>
  </a-spin>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { message } from 'ant-design-vue'
import { defHttp } from '/@/utils/http/axios'
import dayjs from "dayjs";
import JFormContainer from "@/components/Form/src/jeecg/components/JFormContainer.vue";

// i18n
const { t } = useI18n()

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
const yearOpen = ref(false)

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
  add: "/cyHistoryReferenceValue/cyHistoryReferenceValue/add",
  edit: "/cyHistoryReferenceValue/cyHistoryReferenceValue/edit",
  queryById: "/cyHistoryReferenceValue/cyHistoryReferenceValue/queryById"
}

const monthFormat = "YYYY"

// Computed
const formDisabled = computed(() => props.disabled)

// Methods
// 时间选择
const onopenelChange = (status) => {
  yearOpen.value = status
}

const opanelChange = (value) => {
  model.year = dayjs(value).format("YYYY")
  yearOpen.value = false
}

const add = () => {
  edit(JSON.parse(JSON.stringify(model)))
}

const edit = (record) => {
  Object.assign(model, record)
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

    defHttp.request({ url: httpurl, method, data: model }, { isTransformResponse: false }).then((res) => {
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
