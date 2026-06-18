<!-- src/views/carbon/asset/modules/CyOrgAssetModal.vue -->
<template>
  <a-drawer
      :title="title"
      :width="width"
      :visible="visible"
      @ok="handleOk"
      :footer-style="{ textAlign: 'right' }"
      @close="handleCancel">
    <CyOrgAssetForm ref="registerForm" @ok="submitCallback" :formDisabled="disableSubmit" :defaultDeptId="defaultDeptId"></CyOrgAssetForm>
    <template #footer>
      <a-button @click="handleCancel" style="margin-right: 5px">{{ t('carbon.message.Close') }}</a-button>
      <a-button v-if="!disableSubmit" type="primary" @click="handleOk">{{ t('carbon.message.submit') }}</a-button>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref, nextTick, defineProps, defineEmits } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import CyOrgAssetForm from './CyOrgAssetForm.vue';

const { t } = useI18n();
const props = defineProps({
  defaultDeptId: { type: String, default: '' }
});

const emit = defineEmits(['register', 'success']);

const title = ref<string>(t('carbon.message.operation'));
const width = ref<number>(800);
const visible = ref<boolean>(false);
const disableSubmit = ref<boolean>(false);
const registerForm = ref();

/**
 * 新增
 */
function add() {
  title.value = t('carbon.message.Add');
  visible.value = true;
  nextTick(() => {
    registerForm.value.add();
  });
}

/**
 * 编辑
 */
function edit(record: any) {
  title.value = disableSubmit.value ? t('carbon.message.Detail') : t('carbon.message.Edit');
  visible.value = true;
  nextTick(() => {
    registerForm.value.edit(record);
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
  title,
  disableSubmit,
});
</script>

<style lang="less" scoped>
.drawer-footer{
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
