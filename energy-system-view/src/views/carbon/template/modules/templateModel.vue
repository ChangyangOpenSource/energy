<!-- src/views/carbon/template/modules/templateModel.vue -->
<template>
  <j-modal
      :title="title"
      :width="width"
      :visible="visible"
      switchFullscreen
      @ok="handleOk"
      :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
      @cancel="handleCancel"
      :cancelText="t('carbon.message.Close')"
  >
    <templateForm ref="realFormRef" @ok="submitCallback" :disabled="disableSubmit" normal />
  </j-modal>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import templateForm from './templateForm.vue'; // 修正导入路径

const { t } = useI18n();

// 响应式数据
const title = ref<string>('操作');
const width = ref<number>(700);
const visible = ref<boolean>(false);
const disableSubmit = ref<boolean>(false);

// 模板引用
const realFormRef = ref();

// 定义 emits
const emit = defineEmits(['close', 'ok']);

/**
 * 添加操作
 */
const add = async () => {
  visible.value = true;
  await nextTick();
  realFormRef.value?.add();
};

/**
 * 编辑操作
 */
const edit = async (record: any) => {
  visible.value = true;
  await nextTick();
  realFormRef.value?.edit(record);
};

/**
 * 关闭操作
 */
const close = () => {
  emit('close');
  visible.value = false;
};

/**
 * 提交回调
 */
const submitCallback = () => {
  emit('ok');
  visible.value = false;
};

/**
 * 确定按钮处理
 */
const handleOk = () => {
  realFormRef.value?.submitForm();
};

/**
 * 取消按钮处理
 */
const handleCancel = () => {
  close();
};

// 暴露方法给父组件
defineExpose({
  add,
  edit,
  title,
  disableSubmit,
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
