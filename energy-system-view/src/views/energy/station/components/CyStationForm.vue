<template>
  <a-card :bordered="false">
    <div style="display:flex;">
      <div>
        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 44V4H12V20L28 12V20L44 12V44H4Z" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="12" y="28" width="8" height="8" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="28" y="28" width="8" height="8" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div style="margin-left: 10px">
        <a-descriptions :title="titleName"></a-descriptions>
      </div>
    </div>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="基础信息">
        <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol" :disabled="detailVis">
          <a-row>
            <a-col :span="24">
              <a-form-item label="场站名称" name="name">
                <a-input v-model:value="formData.name" placeholder="请输入场站名称"
                         allow-clear></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="上级组织" name="parentId">
                <select-org v-model:value="formData.parentId"></select-org>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="场站类型" name="type">
                <j-dict-select-tag v-model:value="formData.type" dictCode="station_type" placeholder="请选择场站类型" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="能源类型" name="energyType">
                <j-checkbox type="checkbox" v-model:value="formData.energyType" dictCode="energy_type" placeholder="请选择能源类型" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="负责人" name="manager">
                <a-input v-model:value="formData.manager" placeholder="请输入负责人"
                         allow-clear></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="电话" name="phone">
                <a-input v-model:value="formData.phone" placeholder="请输入电话" allow-clear></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="邮箱" name="email">
                <a-input v-model:value="formData.email" placeholder="请输入邮箱" allow-clear></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-tab-pane>
    </a-tabs>
    <a-button type="primary" style="float: right" @click="submit" :disabled="detailVis">保存</a-button>
  </a-card>
</template>

<script lang="ts" setup>

import JDictSelectTag from "@/components/Form/src/jeecg/components/JDictSelectTag.vue";
import JCheckbox from "@/components/Form/src/jeecg/components/JCheckbox.vue";
import {defineExpose, ref} from "vue";
import {saveOrUpdate} from "@/views/energy/station/CyStation.api";
import SelectOrg from "@/components/org/SelectOrg.vue";

const emit = defineEmits(['ok']);
const labelCol = ref<any>({ xs: { span: 24 }, sm: { span: 5 } });
const wrapperCol = ref<any>({ xs: { span: 24 }, sm: { span: 16 } });
const activeKey = ref('1');
const formRef = ref();
const detailVis = ref(false);
const formData = ref({
  id: undefined,
  name: '',
  parentId: '',
  type: '',
  energyType: '',
  manager: '',
  phone: '',
  email: '',
});
const parent = ref()
const titleName = ref()
//表单验证
const validatorRules = {
  name: [{required: true, message: '请输入场站名称!'},],
  parentId: [{required: true, message: '请输入上级子公司id!'},],
  type: [{required: true, message: '请输入场站类型!'},],
  energyType: [{required: true, message: '请输入能源类型!'},],
  phone: [{required: false}, {pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码!'},],
  email: [{required: false}, {
    pattern: /^([\w]+\.*)([\w]+)@[\w]+\.\w{3}(\.\w{2}|)$/,
    message: '请输入正确的电子邮件!'
  },],
}

/**
 * 添加
 */
function add(selectParent) {
  detailVis.value = false
  titleName.value = '未命名'
  parent.value = selectParent
  formData.value = {
    parentId: undefined
  }
  formData.value.parentId = selectParent.id
}

/**
 * 编辑
 */
function edit(record) {
  detailVis.value = false
  titleName.value = record.name
  Object.assign(formData.value, record)
}

/**
 * 编辑
 */
function detail(record) {
  detailVis.value = true
  titleName.value = record.name
  Object.assign(formData.value, record)
}

/**
 * 提交数据
 */
async function submit() {
    // try {
    //   await validate();
    // } catch (error) {
    //   return Promise.reject(error);
    // }


    await saveOrUpdate(formData.value)
      .then((res) => {
        detailVis.value = true
        titleName.value = formData.value.name
        formData.value.id = res
        emit('ok');
      })
}

defineExpose({
  add,
  edit,
  detail
});
</script>

<style lang="less" scoped>
.antd-modal-form {
  padding: 14px 20px;
}
</style>
