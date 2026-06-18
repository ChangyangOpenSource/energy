<!-- src/views/carbon/activitie/modules/CyOrgActivitieModal.vue -->
<template>
  <a-drawer
    :title="title"
    :width="800"
    :visible="visible"
    @ok="handleOk"
    :footer-style="{ textAlign: 'right' }"
    @close="handleCancel">
    <CyOrgActivitieForm ref="registerForm" @ok="submitCallback" :formDisabled="disableSubmit" :formBpm="false"></CyOrgActivitieForm>
    <template #footer>
      <a-button style="margin-right: 8px" @click="handleCancel">取消</a-button>
      <a-button v-if="!disableSubmit" type="primary" @click="handleOk">提交</a-button>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref, nextTick, defineExpose } from 'vue';
import CyOrgActivitieForm from './CyOrgActivitieForm.vue';

const title = ref<string>('');
const visible = ref<boolean>(false);
const disableSubmit = ref<boolean>(false);
const registerForm = ref();
const emit = defineEmits(['success']);

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
  title.value = '编辑';
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
  console.log(11111111111)
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

<style lang="less" scoped></style>
