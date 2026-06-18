<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    @close="close"
    destroyOnClose
    v-model:visible="visible">
    <CySupplierProductForm ref="realForm" @ok="submitCallback" :disabled="disableSubmit" normal></CySupplierProductForm>
    <div class="drawer-footer">
      <a-button v-if="!disableSubmit" @click="handleOk" type="primary" style="margin-bottom: 0;"> {{ t('carbon.message.Confirm') }}</a-button>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import CySupplierProductForm from './CySupplierProductForm.vue'

// 使用 i18n
const { t } = useI18n()

// 数据定义
const title = ref(t('carbon.message.Handle'))
const width = ref(800)
const visible = ref(false)
const disableSubmit = ref(false)
const realForm = ref()

// 方法定义
const add = () => {
  visible.value = true
  setTimeout(() => {
    realForm.value.add()
  }, 0)
}

const edit = (record) => {
  visible.value = true
  setTimeout(() => {
    realForm.value.edit(record)
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
  realForm.value.submitForm()
}

const handleCancel = () => {
  close()
}

// 定义事件发射器
const emit = defineEmits(['close', 'ok'])

// 暴露方法给父组件
defineExpose({
  add,
  edit,
  title,
  disableSubmit
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
