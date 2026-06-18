<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    @close="close"
    destroyOnClose
    :visible="visible">
    <cy-emission-unit-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" normal></cy-emission-unit-form>
    <div class="drawer-footer" style="float:right">
      <span style="margin-right: 10px;">
        <a-button @click="handleCancel" style="margin-bottom: 0;">关闭</a-button>
      </span>

      <span style="margin-right: 10px;">
        <a-button v-if="!disableSubmit"  @click="handleOk" type="primary" style="margin-bottom: 0;">提交</a-button>
      </span>

    </div>
  </a-drawer>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import CyEmissionUnitForm from './CyEmissionUnitForm.vue'

// 定义组件名称
defineOptions({
  name: 'CyEmissionUnitModal'
})

// 声明子组件
const realForm = ref()

// 响应式数据
const title = ref('')
const width = ref(600)
const visible = ref(false)
const disableSubmit = ref(false)

// 定义事件发射器
const emit = defineEmits(['close', 'ok'])

// 方法定义
const add = () => {
  visible.value = true
  nextTick(() => {
    realForm.value.add()
  })
}

const edit = (record) => {
  visible.value = true
  nextTick(() => {
    realForm.value.edit(record)
  })
}

const close = () => {
  emit('close')
  visible.value = false
}

const handleOk = () => {
  realForm.value.submitForm()
}

const submitCallback = () => {
  emit('ok')
  visible.value = false
}

const handleCancel = () => {
  close()
}

// 暴露方法给父组件
defineExpose({
  add,
  edit
})
</script>
