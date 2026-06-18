<!-- progessDrawer.vue -->
<template>
  <a-drawer
      :title="title"
      :width="width"
      placement="right"
      :closable="false"
      @close="close"
      destroy-on-close
      :visible="visible">
    <progessForm ref="realFormRef" @ok="submitCallback" :disabled="disableSubmit" normal></progessForm>
    <div class="drawer-footer">
      <a-button @click="handleCancel" style="margin-bottom: 0;">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref } from 'vue';
import progessForm from './progessForm.vue';

// Refs
const realFormRef = ref();
const emit = defineEmits(['close', 'ok']);

// Reactive data
const title = ref("操作");
const width = ref(1000);
const visible = ref(false);
const disableSubmit = ref(false);

// Methods
function add() {
  visible.value = true;
  setTimeout(() => {
    realFormRef.value.add();
  }, 0);
}

function edit(record) {
  visible.value = true;
  setTimeout(() => {
    realFormRef.value.edit(record);
  }, 0);
}

function close() {
  emit('close');
  visible.value = false;
}

function submitCallback() {
  emit('ok');
  visible.value = false;
}

function handleOk() {
  realFormRef.value.submitForm();
}

function handleCancel() {
  close();
}

// Expose methods
defineExpose({
  add,
  edit
});
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
