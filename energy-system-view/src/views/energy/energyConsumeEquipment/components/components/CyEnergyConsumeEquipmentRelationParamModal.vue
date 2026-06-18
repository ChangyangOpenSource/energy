<template>
  <j-modal :title="title" maxHeight="500px" :width="800" :visible="visible" @ok="handleOk" :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }" @cancel="handleCancel" cancelText="关闭">
    <CyEnergyConsumeEquipmentRelationParamForm ref="registerForm" @ok="submitCallback" :formDisabled="disableSubmit" :formBpm="false"></CyEnergyConsumeEquipmentRelationParamForm>
   <template #footer>
     <a-button @click="handleCancel">取消</a-button>
     <a-button :class="{ 'jee-hidden': disableSubmit }" type="primary" @click="handleOk">确认</a-button>
   </template>
  </j-modal>
</template>

<script lang="ts" setup>
  import { ref, nextTick, defineExpose } from 'vue';
  import CyEnergyConsumeEquipmentRelationParamForm from './CyEnergyConsumeEquipmentRelationParamForm.vue'
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
   * 编辑
   * @param record
   */
  function edit(record, equipmentIds) {
    title.value = '编辑';
    visible.value = true;
    nextTick(() => {
      registerForm.value.edit(record, equipmentIds);
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
  function submitCallback(formData) {
    handleCancel();
    emit('success', formData);
  }

  /**
   * 取消按钮回调事件
   */
  function handleCancel() {
    visible.value = false;
  }
  defineExpose({
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
