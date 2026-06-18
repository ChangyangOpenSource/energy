<template>
  <JModal :title="title" maxHeight="500px" :width="800" :visible="visible" @ok="handleOk" :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }" @cancel="handleCancel" cancelText="关闭">
    <CyEnergyConsumptionAnalysisIndicatorForm ref="registerForm" @ok="submitCallback" :formDisabled="disableSubmit" :formBpm="false"></CyEnergyConsumptionAnalysisIndicatorForm>
    <template #footer>
      <a-button @click="handleCancel">取消</a-button>
      <a-button :class="{ 'jee-hidden': disableSubmit }" type="primary" @click="handleOk">确认</a-button>
    </template>
  </JModal>
</template>

<script lang="ts" setup>
import { ref, nextTick, defineExpose } from 'vue';
import CyEnergyConsumptionAnalysisIndicatorForm from './CyEnergyConsumptionAnalysisIndicatorForm.vue'
import JModal from '/@/components/Modal/src/JModal/JModal.vue';
import { useMessage } from '/@/hooks/web/useMessage';
const { createMessage } = useMessage();
const title = ref<string>('');
const width = ref<number>(800);
const visible = ref<boolean>(false);
const disableSubmit = ref<boolean>(false);
const registerForm = ref();
const emit = defineEmits(['register', 'success']);

/**
 * 新增
 */
function add(stationId,type) {
  title.value = '指标配置';
  visible.value = true;
  nextTick(() => {
    registerForm.value.add(stationId,type);
  });
}

/**
 * 编辑
 * @param record
 */
function edit(record,stationId,type) {
  title.value = disableSubmit.value ? '详情' : '编辑';
  visible.value = true;
  nextTick(() => {
    registerForm.value.edit(record,stationId,type);
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
function submitCallback() {
  handleCancel();
  emit('success');
}

/**
 * 取消按钮回调事件
 */
function handleCancel() {
  visible.value = false;
}
defineExpose({
  add,
  edit,
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
