<template>
  <a-modal
    :title="title"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :mask-closable="false"
  >
    <a-form
      ref="formRef"
      :model="model"
      :rules="rules"
      layout="vertical"
      style="padding: 24px"
    >
      <a-form-item :label="t('carbon.message.categoryName')" name="name">
        <a-input v-model:value="model.name" :placeholder="t('carbon.message.Please_enter')" />
      </a-form-item>
      <a-form-item :label="t('carbon.message.sortField')" name="sort">
        <a-input-number v-model:value="model.sort" :placeholder="t('carbon.message.Please_enter')" style="width: 100%" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'

const { t } = useI18n()

// Refs
const formRef = ref()

// Reactive data
const title = ref(t('carbon.message.addProductCategory'))
const visible = ref(false)
const confirmLoading = ref(false)
const isEdit = ref(false)

const model = reactive({
  id: null,
  name: '',
  sort: null,
  organizationId: ''
})

const rules = {
  name: [
    { required: true, message: t('carbon.message.pleaseInputCategoryName'), trigger: 'blur' }
  ],
  sort: [
    { required: true, message: t('carbon.message.pleaseInputSort'), trigger: 'blur' },
    { type: 'number', message: t('carbon.message.sortMustBeNumber'), trigger: 'blur' }
  ]
}

// Methods
const open = () => {
  isEdit.value = false
  title.value = t('carbon.message.addProductCategory')
  visible.value = true

  nextTick(() => {
    if (formRef.value) {
      formRef.value.clearValidate()
      formRef.value.resetFields()

      // Reset model
      model.id = null
      model.name = ''
      model.sort = null
      model.organizationId = ''
    }
  })
}

const openEdit = (record) => {
  isEdit.value = true
  title.value = t('carbon.message.editProductCategory')
  visible.value = false

  nextTick(() => {
    // Copy data
    Object.assign(model, record)
    visible.value = true

    nextTick(() => {
      if (formRef.value) {
        formRef.value.clearValidate()
      }
    })
  })
}

const handleOk = () => {
  formRef.value.validate().then(() => {
    confirmLoading.value = true

    // 触发提交事件，传递数据和操作类型
    emit('submit', {
      data: { ...model },
      isEdit: isEdit.value
    }, () => {
      confirmLoading.value = false
      visible.value = false
    })
  }).catch(error => {
    console.log('Validation failed:', error)
  })
}

const handleCancel = () => {
  visible.value = false

  if (formRef.value) {
    formRef.value.clearValidate()
  }

  // Reset model
  model.id = null
  model.name = ''
  model.sort = null
  model.organizationId = ''
}

// Expose methods to parent components
defineExpose({
  open,
  openEdit
})

// 暴露给父组件的方法
const emit = defineEmits(['submit'])
</script>
