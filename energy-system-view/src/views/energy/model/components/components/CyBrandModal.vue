<template>
  <j-modal
    :maxHeight="250"
    :title="title"
    :width="800"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <CyBrandForm ref="registerForm" @ok="submitCallback" :formDisabled="disableSubmit"
                 :formBpm="false"></CyBrandForm>
    <template #footer>
      <a-button style="margin-right: 8px" @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="handleOk">确认</a-button>
    </template>
  </j-modal>
</template>

<script lang="ts" setup>
import {ref, nextTick, defineExpose} from 'vue';
import CyBrandForm from './CyBrandForm.vue'
import JModal from '/src/components/Modal/src/JModal/JModal.vue';
import {useMessage} from '/src/hooks/web/useMessage';

const title = ref<string>('');
const visible = ref<boolean>(false);
const disableSubmit = ref<boolean>(false);
const registerForm = ref();
const emit = defineEmits(['register', 'success']);

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
