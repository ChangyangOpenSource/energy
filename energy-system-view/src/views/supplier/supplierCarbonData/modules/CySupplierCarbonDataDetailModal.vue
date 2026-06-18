<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    @close="close"
    destroy-on-close
    v-model:visible="visible">
    <CySupplierCarbonDataDetailForm ref="realFormRef" @ok="submitCallback" :disabled="disableSubmit" normal></CySupplierCarbonDataDetailForm>
    <div class="drawer-footer">
      <!-- v-if="!disableSubmit" -->
      <a-button v-if="!buttonDisabled" @click="handleReject()" type="primary" style="margin-bottom: 0;">{{ t('carbon.message.Reject') }}</a-button>
      <a-button v-if="!buttonDisabled" @click="handleOk" type="primary" style="margin-bottom: 0;">{{ t('carbon.message.Approved') }}</a-button>
      <a-button @click="handleCancel" style="margin-bottom: 0;">{{ t('carbon.message.GoBack') }}</a-button>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import CySupplierCarbonDataDetailForm from './CySupplierCarbonDataDetailForm.vue'

// 使用i18n
const { t } = useI18n()

// 定义组件名称
defineOptions({
  name: 'CySupplierCarbonDataModal'
})

// 响应式数据
const title = ref("操作")
const width = ref(1300)
const visible = ref(false)
const disableSubmit = ref(false)
const buttonDisabled = ref(false)
const realFormRef = ref(null)

// 定义emits
const emit = defineEmits(['close', 'ok'])

// 方法定义
const add = () => {
  visible.value = true
  setTimeout(() => {
    realFormRef.value.add()
  }, 0)
}

const edit = (record) => {
  visible.value = true
  setTimeout(() => {
    realFormRef.value.edit(record)
  }, 0)
}

const close = () => {
  emit('close')
  visible.value = false
}

const submitCallback = () => {
  emit('ok')
  visible.value = false
}

const handleOk = () => {
  realFormRef.value.examineThrough()
  submitCallback()
}

const handleReject = () => {
  realFormRef.value.reject()
}

const handleCancel = () => {
  close()
}

// 暴露给父组件的方法
defineExpose({
  add,
  edit,
  disableSubmit,
  buttonDisabled,
  title
})
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}

.drawer-footer {
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>
