<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer>
      <template #detail>
        <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol"
                name="CyEnergyConsumeEquipmentRelationEquipmentForm" :ruler="validatorRules">
          <a-row>
            <a-col :span="24">
              <a-form-item label="能源类型" v-if="formData.equipmentType == '1'"
                           v-bind="validateInfos.energyType"
                           id="CyEnergyConsumeEquipmentRelationEquipmentForm-energyType"
                           name="energyType">
                <a-select
                  v-model:value="formData.energyType"
                  :options="energyTypes"
                  :field-names="{ label: 'title', value: 'value'}"
                  placeholder="请选择能源类型"
                  @change="changeEnergyType"
                  allow-clear>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="设备类型" v-if="formData.equipmentType == '2'"
                           v-bind="validateInfos.equipmentTypeId"
                           id="CyEnergyConsumeEquipmentRelationEquipmentForm-equipmentTypeId"
                           name="equipmentTypeId">
                <a-select
                  v-model:value="formData.equipmentTypeId"
                  :options="equipmentTypes"
                  :field-names="{ label: 'title', value: 'key'}"
                  placeholder="请选择设备类型"
                  @change="changeEquipmentTypeId"
                  allow-clear>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="设备名称" v-bind="validateInfos.equipmentId"
                           id="CyEnergyConsumeEquipmentRelationEquipmentForm-equipmentId"
                           name="equipmentId">
                <a-select
                  v-model:value="formData.equipmentId"
                  :options="equipments"
                  @change="changeEquipment"
                  :field-names="{ label: 'name', value: 'id' }"
                  placeholder="请选择设备"
                  allow-clear>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="类型" v-if="formData.equipmentType == '1'"
                           v-bind="validateInfos.type"
                           id="CyEnergyConsumeEquipmentRelationEquipmentForm-type" name="type">
                <a-radio-group name="radioGroup" v-model:value="formData.type">
                  <a-radio value="1">输入</a-radio>
                  <a-radio value="2">输出</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
    </JFormContainer>
  </a-spin>
</template>

<script lang="ts" setup>
import {ref, defineExpose, nextTick, reactive, computed} from 'vue';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import {Form, message} from 'ant-design-vue';
import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
import {equipmentList} from "@/views/energy/meter/CyEquipment.api";
import {loadTreeRootNoTenant} from "@/views/system/category/category.api";
import {getEnergyType} from "@/views/energy/station/CyStation.api";

const formRef = ref();
const equipments = ref([]);
const equipmentTypes = ref([]);
const allEquipmentIds = ref([]);
const energyTypes = ref([]);//能源类型
const useForm = Form.useForm;
const emit = defineEmits(['register', 'ok']);
const formData = ref({
  id: '',
  equipmentName: undefined,
  equipmentType: undefined,
  equipmentTypeId: undefined,
  equipmentId: undefined,
  energyType: undefined,
  stationId: undefined,
  type: '',
});
const labelCol = ref<any>({xs: {span: 24}, sm: {span: 5}});
const wrapperCol = ref<any>({xs: {span: 24}, sm: {span: 16}});
const confirmLoading = ref<boolean>(false);
//表单验证
const validatorRules = computed(() => {
  const baseRules = {
    equipmentId:[{required: true, message: '请选择设备'}],
  };

  if (formData.value.equipmentType == '1') {
    baseRules.energyType =  [{required: true, message: '请选择能源类型'}]
    baseRules.type = [{required: true, message: '请选择类型'}]
  } else if (formData.value.equipmentType == '2') {
    baseRules.equipmentTypeId =  [{required: true, message: '请选择设备类型'}]
  }
  return baseRules;
})
const {
  resetFields,
  validate,
  validateInfos
} = useForm(formData, validatorRules, {immediate: false});

/**
 * 初始化能源类型
 */
function getEnergyTypes() {
  getEnergyType({id: formData.value.stationId}).then((res) => {
    energyTypes.value = res
  });
}

/**
 * 更换能源类型 查询设备列表
 */
function changeEnergyType() {
  equipmentList({
    type: formData.value.equipmentType,
    energyType: formData.value.energyType,
    stationId: formData.value.stationId,
    pageSize: -1
  }).then((res) => {
    equipments.value = res.records
  })
}

/**
 * 更换设备类型 查询设备列表
 */
function changeEquipmentTypeId() {
  equipmentList({
    type: formData.value.equipmentType,
    equipmentTypeId: formData.value.equipmentTypeId,
    stationId: formData.value.stationId,
    pageSize: -1
  }).then((res) => {
    equipments.value = res.records
  })
}

/**
 * 更换设备
 */
function changeEquipment() {
  formData.value.equipmentName = equipments.value.filter(item => item.id === formData.value.equipmentId)[0].name;
  formData.value.energyTypeName = equipments.value.filter(item => item.id === formData.value.equipmentId)[0].energyType_dictText;
  formData.value.equipmentTypeName = equipments.value.filter(item => item.id === formData.value.equipmentId)[0].equipmentTypeId_dictText;
}

/**
 * 分类字典
 */
function getEquipmentTypes() {
  loadTreeRootNoTenant({pcode: "C03A02", async: false}).then((res) => {
    equipmentTypes.value = res
  });
}

/**
 * 新增
 */
function add(equipmentType, getFormData) {
  edit({}, equipmentType, getFormData);
}

/**
 * 编辑
 */
function edit(record, equipmentType, getFormData) {
  nextTick(() => {
    resetFields();
    if (Object.keys(record).length > 0) {
      //赋值
      formData.value = JSON.parse(JSON.stringify(record))
    } else {
      formData.value = {
        id: '',
        equipmentType: equipmentType,
        equipmentTypeId: undefined,
        equipmentId: undefined,
        energyType: undefined,
        type: '',
      }
    }
    formData.value.stationId = getFormData.stationId
    if (formData.value.equipmentType == '1') {
      //查找能源类型下的设备
      getEnergyTypes();
    } else {
      //查询设备类型
      getEquipmentTypes();
    }

    equipments.value = []

    allEquipmentIds.value = getFormData.equipmentIds
  });
}

/**
 * 提交数据
 */
async function submitForm() {
  try {
    // 触发表单验证
    await validate();
  } catch ({ errorFields }) {
    if (errorFields) {
      const firstField = errorFields[0];
      if (firstField) {
        formRef.value.scrollToField(firstField.name, { behavior: 'smooth', block: 'center' });
      }
    }
    return Promise.reject(errorFields);
  }

  if (allEquipmentIds.value && allEquipmentIds.value.length > 0 && allEquipmentIds.value.includes(formData.value.equipmentId)) {
    message.warning('设备已添加');
    return;
  }
  emit("ok", formData.value)
}

defineExpose({
  add,
  edit,
  submitForm,
});
</script>

<style lang="less" scoped>
.antd-modal-form {
  padding: 14px 20px;
}
</style>
