<template>
  <a-drawer
      :title="title"
      :width="900"
      :visible="visible"
      @ok="handleOk"
      :footer-style="{ textAlign: 'right' }"
      @close="handleCancel">
    <CyEnergyFactorForm ref="registerForm" @ok="submitCallback" :formDisabled="disableSubmit" :formBpm="false"></CyEnergyFactorForm>
    <template #footer>
      <a-button @click="handleCancel" style="margin-right: 5px">{{ t('carbon.message.Close') }}</a-button>
      <a-button v-if="!disableSubmit" type="primary" @click="handleOk">{{ t('carbon.message.submit') }}</a-button>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { ref, nextTick, defineExpose } from 'vue';
  import CyEnergyFactorForm from './CyEnergyFactorForm.vue'
  import JModal from '/@/components/Modal/src/JModal/JModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
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
  function add(stationId) {
    title.value = '新增';
    visible.value = true;
    nextTick(() => {
      registerForm.value.add(stationId);
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
    registerForm.value.submitCheckTime();
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
