<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    @close="close"
    destroy-on-close
    :visible="visible">
    <cy-gas-store-form ref="realFormRef" @ok="submitCallback" :disabled="disableSubmit" normal></cy-gas-store-form>
    <div class="drawer-footer" style="float:right">
      <span style="margin-right:20px">
        <a-button @click="handleCancel" style="margin-bottom: 0;">关闭</a-button>
      </span>

      <span style="margin-right:20px">
        <a-button v-if="!disableSubmit" @click="handleOk" type="primary" style="margin-bottom: 0;">提交</a-button>
      </span>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import CyGasStoreForm from './CyGasStoreForm.vue'

// 定义组件名称
defineOptions({
  name: 'CyGasStoreModal'
})

// refs
const realFormRef = ref()

// reactive data
const title = ref('新增气体')
const width = ref(600)
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

const handleOk = () => {
  realFormRef.value.submitForm()
}

const submitCallback = () => {
  emit('ok')
  visible.value = false
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
  title
})
</script>
