<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    @close="close"
    destroy-on-close
    :visible="visible">
    <cy-history-reference-value-form ref="realFormRef" @ok="submitCallback" :disabled="disableSubmit" normal></cy-history-reference-value-form>
    <div class="drawer-footer">
      <a-button @click="handleCancel" style="margin-bottom: 0;">{{ t('carbon.message.Close') }}</a-button>
      <a-button v-if="!disableSubmit" @click="handleOk" type="primary" style="margin-bottom: 0;">{{ t('carbon.message.submit') }}</a-button>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import CyHistoryReferenceValueForm from './CyHistoryReferenceValueForm.vue'

// 使用i18n
const { t } = useI18n()

// 定义组件名称
defineOptions({
  name: 'CyHistoryReferenceValueModal'
})

// refs
const realFormRef = ref()

// reactive data
const title = ref("操作")
const width = ref(800)
const visible = ref(false)
const disableSubmit = ref(false)

// methods
const add = () => {
  visible.value = true
  nextTick(() => {
    realFormRef.value.add()
  })
}

const edit = (record) => {
  visible.value = true
  nextTick(() => {
    realFormRef.value.edit(record)
  })
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
  realFormRef.value.submitForm()
}

const handleCancel = () => {
  close()
}

// emits
const emit = defineEmits(['close', 'ok'])

// expose methods to parent component
defineExpose({
  add,
  edit,
  disableSubmit,
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
