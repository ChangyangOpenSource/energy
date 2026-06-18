<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    @close="close"
    destroy-on-close
    v-model:visible="visible">
    <CySupplierCarbonDataForm ref="realFormRef" @ok="submitCallback" :disabled="disableSubmit" normal></CySupplierCarbonDataForm>
    <div class="drawer-footer">
      <a-button @click="handleCancel" style="margin-bottom: 0;">{{ t('carbon.message.Close') }}</a-button>
      <a-button v-if="!disableSubmit"  @click="handleOk" type="primary" style="margin-bottom: 0;">{{ t('carbon.message.submit') }}</a-button>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, reactive,nextTick } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import CySupplierCarbonDataForm from './CySupplierCarbonDataForm.vue'

// 使用i18n
const { t } = useI18n()

// 定义组件名称
defineOptions({
  name: 'CySupplierCarbonDataModal'
})

// 响应式数据
const title = ref("操作")
const width = ref(800)
const visible = ref(false)
const disableSubmit = ref(false)
const realFormRef = ref(null)

// 方法定义
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
  emit('ok')
}

const handleCancel = () => {
  close()
}

// 定义暴露给父组件的方法
defineExpose({
  add,
  edit
})

// 定义emits
const emit = defineEmits(['close', 'ok'])
</script>

<script>

</script>

<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
.drawer-footer{
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
