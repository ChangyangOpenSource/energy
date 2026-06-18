<!-- src/views/carbon/template/modules/templateDrawer.vue -->
<template>
  <a-drawer
      :title="title"
      :width="width"
      :visible="visible"
      @ok="handleOk"
      :footer-style="{ textAlign: 'right' }"
      @close="handleCancel">
    <templateForm ref="registerForm" @ok="submitCallback" :disabled="disableSubmit"></templateForm>
    <template #footer>
      <a-button @click="handleCancel">{{ t('carbon.message.Close') }}</a-button>
      <a-button v-if="!disableSubmit" type="primary" @click="handleOk">{{ t('carbon.message.submit') }}</a-button>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import templateForm from './templateForm.vue'

const { t } = useI18n();
const title = ref<string>('操作');
const width = ref<number>(700);
const visible = ref<boolean>(false);
const disableSubmit = ref<boolean>(false);
const registerForm = ref();

const emit = defineEmits(['register', 'success']);

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
 * @param record
 */
function edit(record) {
  title.value = t('carbon.message.Edit');
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
