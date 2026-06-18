<template>
  <j-modal :title="title" maxHeight="500px" :width="800" :visible="visible" @ok="handleOk" :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }" @cancel="handleCancel" cancelText="关闭">
    <CyEnergyConsumeEquipmentTypeParamForm ref="registerForm" @ok="handleCancel" :formDisabled="disableSubmit" :formBpm="false" :energyConsumeEquipmentTypeId="props.energyConsumeEquipmentTypeId"></CyEnergyConsumeEquipmentTypeParamForm>
   <template #footer>
     <a-button :class="{ 'jee-hidden': disableSubmit }" type="primary" @click="saveAndAdd">保存并新增</a-button>
     <a-button @click="handleCancel">取消</a-button>
     <a-button :class="{ 'jee-hidden': disableSubmit }" type="primary" @click="handleOk">确认</a-button>
   </template>
  </j-modal>
</template>

<script lang="ts" setup>
  import { ref, nextTick, defineExpose } from 'vue';
  import CyEnergyConsumeEquipmentTypeParamForm from './CyEnergyConsumeEquipmentTypeParamForm.vue'
  import JModal from '/src/components/Modal/src/JModal/JModal.vue';
  import { useMessage } from '/src/hooks/web/useMessage';
  const { createMessage } = useMessage();
  const title = ref<string>('');
  const width = ref<number>(800);
  const visible = ref<boolean>(false);
  const disableSubmit = ref<boolean>(false);
  const registerForm = ref();
  const emit = defineEmits(['register', 'success']);
  const props = defineProps({
    energyConsumeEquipmentTypeId: String,
  });
  /**
   * 新增
   */
  function add() {
    title.value = '新增';
    visible.value = true;
    nextTick(() => {
      registerForm.value.add();
    });
  }

  /**
   * 编辑
   * @param record
   */
  function edit(record) {
    title.value = disableSubmit.value ? '详情' : '编辑';
    visible.value = true;
    nextTick(() => {
      registerForm.value.edit(record);
    });
  }

  /**
   * 确定按钮点击事件
   */
  function handleOk() {
    registerForm.value.submitForm("save");
  }

  /**
   * 保存并新增按钮点击事件
   */
  function saveAndAdd() {
    registerForm.value.submitForm("saveAndAdd");
  }

  /**
   * 取消按钮回调事件
   */
  function handleCancel() {
    visible.value = false;
    emit('success');
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
