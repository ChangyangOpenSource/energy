<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    @close="close"
    destroyOnClose
    :visible="visible">
    <cy-supplier-form ref="realFormRef" @ok="submitCallback" :disabled="disableSubmit" normal></cy-supplier-form>
    <div class="drawer-footer">
      <a-button @click="handleCancel" style="margin-bottom: 0;">{{ t('carbon.message.Close') }}</a-button>
      <a-button v-if="type!='detail' && model.status !=2"  @click="handleOk(1)" type="primary" style="margin-bottom: 0;">
        {{ t(model.status > 0 ? 'carbon.message.Invite_again' : 'carbon.message.Go_invite_me') }}
      </a-button>
      <a-button v-if="type!='detail'"  @click="handleOk()" type="primary" style="margin-bottom: 0;">{{ t('carbon.message.Save') }}</a-button>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, reactive,nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import CySupplierForm from './CySupplierForm.vue'

// 国际化
const { t } = useI18n()

// 组件引用
const realFormRef = ref()

// 响应式数据
const type = ref('')
const model = reactive({})
const title = ref('操作')
const width = ref(800)
const visible = ref(false)
const disableSubmit = ref(false)

// 方法定义
const add = () => {
  type.value = 'add'
  visible.value = true
  nextTick(() => {
    realFormRef.value.add()
  })
}

const edit = (record) => {
  type.value = 'edit'
  Object.assign(model, record)
  visible.value = true
  nextTick(() => {
    realFormRef.value.edit(record)
  })
}

const detail = (record) => {
  type.value = 'detail'
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

const handleOk = (status) => {
  realFormRef.value.submitForm(status)
}

const handleCancel = () => {
  close()
}

// 定义事件发射
const emit = defineEmits(['close', 'ok'])

// 暴露方法给父组件
defineExpose({
  add,
  edit,
  detail,
  close,
  submitCallback,
  handleOk,
  handleCancel
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
