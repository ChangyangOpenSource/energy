<template>
  <j-modal :title="title" :height="500" :width="800" :visible="visible" @ok="handleOk"
           :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }" @cancel="handleCancel"
           cancelText="关闭">
    <CyEquipmentDataOneForm ref="registerForm" @ok="submitCallback" :formDisabled="disableSubmit"
                            :protocolId="props.protocolId"
                            :equipmentTypeId="props.equipmentTypeId"></CyEquipmentDataOneForm>
    <template #footer>
      <a-button @click="handleCancel">取消</a-button>
      <a-button :class="{ 'jee-hidden': disableSubmit }" type="primary" @click="handleOk">确认
      </a-button>
    </template>
  </j-modal>
</template>

<script lang="ts" setup>
import {ref, nextTick, defineExpose, defineProps} from 'vue';
import CyEquipmentDataOneForm from './CyEquipmentDataOneForm.vue'
import JModal from '/@/components/Modal/src/JModal/JModal.vue';
import {useMessage} from '/@/hooks/web/useMessage';

const {createMessage} = useMessage();
const title = ref<string>('');
const width = ref<number>(800);
const visible = ref<boolean>(false);
const disableSubmit = ref<boolean>(false);
const props = defineProps({
  protocolId: String,
  equipmentTypeId: String,
});
const registerForm = ref();
const emit = defineEmits(['register', 'success']);

/**
 * 新增
 */
function add(formData) {
  title.value = '添加数据点';
  visible.value = true;
  nextTick(() => {
    registerForm.value.add(formData);
  });
}

/**
 * 编辑
 * @param record
 */
function edit(record, formData) {
  //将record深copy一下
  let data = JSON.parse(JSON.stringify(record))
  title.value = '编辑';
  visible.value = true;
  nextTick(() => {
    registerForm.value.edit(data, formData);
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
function submitCallback(formData, parentIndex) {
  handleCancel();
  emit('success', formData, parentIndex);
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
