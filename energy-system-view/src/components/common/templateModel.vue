<template>
  <j-modal
      :title="title"
      :width="width"
      :visible="visible"
      switchFullscreen
      @ok="handleOk"
      :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
      @cancel="handleCancel"
      :cancelText="t('carbon.message.Close')">
    <templateForm
        ref="realFormRef"
        @ok="submitCallback"
        :disabled="disableSubmit"
        normal
    ></templateForm>
  </j-modal>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import templateForm from './templateForm.vue';
import { useI18n } from '/@/hooks/web/useI18n';
import JModal from '/@/components/Modal/src/JModal/JModal.vue';
const { t } = useI18n();

// Reactive data
const title = ref("操作");
const width = ref(700);
const visible = ref(false);
const disableSubmit = ref(false);

// Refs
const realFormRef = ref<any>(null);

// Methods
const add = () => {
  visible.value = true;
  nextTick(() => {
    realFormRef.value.add();
  });
};

const edit = (record: any) => {

  visible.value = true;
  console.log(222222222222,visible.value)
  nextTick(() => {
    realFormRef.value.edit(record);
  });
};

const close = () => {
  emit('close');
  visible.value = false;
};

const submitCallback = () => {
  emit('ok');
  visible.value = false;
};

const handleOk = () => {
  realFormRef.value.submitForm();
};

const handleCancel = () => {
  close();
};

// Emits
const emit = defineEmits(['close', 'ok']);

// Expose methods
defineExpose({
  add,
  edit,
  title
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
