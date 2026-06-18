<template>
  <a-drawer
    :title="title"
    :width="800"
    :visible="visible"
    :footer-style="{ textAlign: 'right' }"
    @close="handleCancel">
    <a-steps :current="current" :items="items" size="small" @change="changeCurrent"></a-steps>
    <div v-show="current == 0">
      <CyEquipmentFormOne ref="registerOneForm" @next="queryEquipmentData" @save="handleCancel"
                          :formDisabled="disableSubmit" :formBpm="false"></CyEquipmentFormOne>
    </div>
    <div v-show="current == 1">
      <CyEquipmentFormTwo ref="registerTwoForm" :formDisabled="disableSubmit"
                          :formBpm="false"></CyEquipmentFormTwo>
    </div>
    <template #footer>
      <a-button v-if="current < steps.length - 1" type="primary" @click="save">保存</a-button>
      <a-button @click="handleCancel" style="margin-left: 8px">取消</a-button>
      <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">上一步</a-button>
      <a-button v-if="current < steps.length - 1" type="primary" @click="next" style="margin-left: 8px">下一步</a-button>
      <a-button v-if="current == steps.length - 1" type="primary" @click="handleCancel" style="margin-left: 8px">完成
      </a-button>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
import {ref, nextTick, defineExpose} from 'vue';
import CyEquipmentFormOne from './CyEquipmentFormOne.vue'
import CyEquipmentFormTwo from "./CyEquipmentFormTwo.vue";

const title = ref<string>('');
const visible = ref<boolean>(false);
const disableSubmit = ref<boolean>(false);
const registerOneForm = ref();
const registerTwoForm = ref();
const emit = defineEmits(['register', 'success']);
const current = ref<number>(0);
const steps = [{title: '设备信息',}, {title: '数据点配置',}];
const items = steps.map(item => ({key: item.title, title: item.title}));

/**
 * 新增
 */
function add(stationId) {
  current.value = 0
  title.value = '新增';
  visible.value = true;
  nextTick(() => {
    registerOneForm.value.add(stationId);
  });
}

/**
 * 编辑
 * @param record
 */
function edit(record) {
  current.value = 0
  title.value = disableSubmit.value ? '详情' : '编辑';
  visible.value = true;
  nextTick(() => {
    registerOneForm.value.edit(record);
  });
}

/**
 * 更换页面
 */
function changeCurrent(stepCurrent) {
  if (stepCurrent == 1) {
    registerOneForm.value.submitForm("next");
  } else {
    // 其他步骤直接切换
    current.value = stepCurrent;
  }
}

/**
 * 确定按钮点击事件
 */
function next() {
  registerOneForm.value.submitForm("next");
}

/**
 * 确定按钮点击事件
 */
function save() {
  registerOneForm.value.submitForm("save");
}

/**
 * 协议基础信息添加成功回调
 */
function queryEquipmentData(id) {
  registerTwoForm.value.initFormData(id)
  current.value++;
}

/**
 * 上一步
 */
function prev() {
  current.value--;
}

/**
 * 取消按钮回调事件
 */
function handleCancel() {
  visible.value = false;
  emit('success');
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
