<template>
  <a-drawer :title="title" maxHeight="500px" :width="800" :visible="visible" @ok="handleOk" @close="handleCancel" :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }" @cancel="handleCancel" cancelText="关闭">
    <uploadAttechmentForm ref="registerForm" @ok="submitCallback" :formDisabled="disableSubmit" :formBpm="false"></uploadAttechmentForm>
    <template #footer>
      <div style="float: right">
        <a-button style="margin-right: 10px" @click="handleCancel">取消</a-button>
        <a-button :class="{ 'jee-hidden': disableSubmit }" type="primary" @click="handleOk">确认</a-button>
      </div>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref, nextTick, defineExpose } from 'vue';
import uploadAttechmentForm from './uploadAttechmentForm.vue'
import { useMessage } from '/@/hooks/web/useMessage';
import UploadAttechmentForm from "@/views/module_emission/dataManage/components/uploadAttechmentForm.vue";
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
function add(record) {
  title.value = '上传附件';
  visible.value = true;
  nextTick(() => {
    registerForm.value.add(record);
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
