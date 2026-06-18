<template>
  <j-modal :title="title" :height="500" :width="1200" :visible="visible" @ok="handleOk"
           :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }" @cancel="handleCancel"
           cancelText="关闭">
    <select-protocol-form ref="registerForm" @ok="selectProtocol"></select-protocol-form>
    <template #footer>
      <a-button @click="handleCancel">取消</a-button>
      <a-button :class="{ 'jee-hidden': disableSubmit }" type="primary" @click="handleOk">确认
      </a-button>
    </template>
  </j-modal>
</template>

<script lang="ts" setup>
import {ref, nextTick, defineExpose, defineProps} from 'vue';
import JModal from '/@/components/Modal/src/JModal/JModal.vue';
import SelectProtocolForm from "@/views/energy/meter/components/components/SelectProtocolForm.vue";

const title = ref<string>('');
const width = ref<number>(800);
const visible = ref<boolean>(false);
const disableSubmit = ref<boolean>(false);
const props = defineProps({
  equipmentTypeId: String,
});
const registerForm = ref();
const emit = defineEmits(['register', 'success']);

/**
 * 新增
 */
function initProtocol(protocolId) {
  title.value = '选择协议';
  visible.value = true;
  nextTick(() => {
    registerForm.value.initProtocol(protocolId);
  });
}


/**
 * 确定按钮点击事件
 */
function handleOk() {
  registerForm.value.submitForm();
}

/**
 * form保存回调事件
 */
function selectProtocol(selectedRows) {
  handleCancel();
  emit('success', selectedRows);
}

/**
 * 取消按钮回调事件
 */
function handleCancel() {
  visible.value = false;
}

defineExpose({
  initProtocol,
  disableSubmit,
});
</script>

<style lang="less">
/**隐藏样式-modal确定按钮 */
.jee-hidden {
  display: none !important;
}
</style>
<style lang="less" scoped></style>
