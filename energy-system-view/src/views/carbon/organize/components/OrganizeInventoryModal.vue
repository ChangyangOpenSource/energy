<!-- components/OrganizeInventoryModal.vue -->
<template>
  <a-drawer
      :title="title"
      :width="800"
      :visible="visible"
      @ok="handleOk"
      :footer-style="{ textAlign: 'right' }"
      @close="handleCancel">
    <OrganizeInventoryForm ref="registerForm" @ok="submitCallback" :formDisabled="disableSubmit"
                           :formBpm="false"></OrganizeInventoryForm>
    <template #footer>
      <a-button style="margin-right: 8px" @click="handleCancel">{{ t('carbon.message.Close') }}</a-button>
      <a-button v-if="!disableSubmit" type="primary" @click="handleOk">{{ t('carbon.message.submit') }}</a-button>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
import {ref, nextTick, defineExpose} from 'vue';
import OrganizeInventoryForm from './OrganizeInventoryForm.vue'
import JModal from '/@/components/Modal/src/JModal/JModal.vue';
import {useMessage} from '/@/hooks/web/useMessage';
import {useI18n} from '/@/hooks/web/useI18n';
const { t } = useI18n();

const {createMessage} = useMessage();
const title = ref<string>('');
const width = ref<number>(800);
const visible = ref<boolean>(false);
const disableSubmit = ref<boolean>(false);
const registerForm = ref();
const emit = defineEmits(['register', 'success']);

/**
 * 新增
 */
function add(selectedDeptKeys: any) {
  title.value = t('carbon.message.new_organization_carbon_inventory');
  visible.value = true;
  nextTick(() => {
    registerForm.value.add(selectedDeptKeys);
  });
}

/**
 * 编辑
 * @param record
 */
function edit(record) {
  title.value = disableSubmit.value ? t('carbon.message.Examine') : t('carbon.message.edit_inventory');
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
