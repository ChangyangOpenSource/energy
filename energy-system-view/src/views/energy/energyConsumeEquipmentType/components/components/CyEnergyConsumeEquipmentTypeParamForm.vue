<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer :disabled="disabled">
      <template #detail>
        <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol" name="CyEnergyConsumeEquipmentTypeParamForm" :ruler="validatorRules">
          <a-row>
						<a-col :span="24">
							<a-form-item label="参数名称" v-bind="validateInfos.name" id="CyEnergyConsumeEquipmentTypeParamForm-name" name="name">
								<a-input v-model:value="formData.name" placeholder="请输入参数名称"  allow-clear ></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item label="参数类型" v-bind="validateInfos.paramType" id="CyEnergyConsumeEquipmentTypeParamForm-paramType" name="paramType">
								<j-dict-select-tag v-model:value="formData.paramType" dictCode="param_type" placeholder="请选择参数类型"  allow-clear />
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item label="参数单位" v-bind="validateInfos.unit" id="CyEnergyConsumeEquipmentTypeParamForm-unit" name="unit">
								<a-input v-model:value="formData.unit" placeholder="请输入参数单位"  allow-clear ></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item label="参数说明" v-bind="validateInfos.remark" id="CyEnergyConsumeEquipmentTypeParamForm-remark" name="remark">
								<a-textarea v-model:value="formData.remark" placeholder="请输入参数说明" allow-clear :rows="6"></a-textarea>
							</a-form-item>
						</a-col>
          </a-row>
        </a-form>
      </template>
    </JFormContainer>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref, reactive, defineExpose, nextTick, defineProps, computed, onMounted } from 'vue';
  import { defHttp } from '/src/utils/http/axios';
  import { useMessage } from '/src/hooks/web/useMessage';
  import JDictSelectTag from '/src/components/Form/src/jeecg/components/JDictSelectTag.vue';
  import { getDateByPicker, getValueType } from '/src/utils';
  import { saveOrUpdate } from '../CyEnergyConsumeEquipmentTypeParam.api';
  import { Form } from 'ant-design-vue';
  import JFormContainer from '/src/components/Form/src/container/JFormContainer.vue';
  const props = defineProps({
    formDisabled: { type: Boolean, default: false },
    formData: { type: Object, default: () => ({})},
    formBpm: { type: Boolean, default: true },
    energyConsumeEquipmentTypeId: String,
  });
  const formRef = ref();
  const useForm = Form.useForm;
  const emit = defineEmits(['register', 'ok']);
  const formData = reactive<Record<string, any>>({
    id: '',
    energyConsumeEquipmentTypeId: '',
    name: '',
    paramType: '',
    unit: '',
    copyId: '',
  });
  const { createMessage } = useMessage();
  const labelCol = ref<any>({ xs: { span: 24 }, sm: { span: 5 } });
  const wrapperCol = ref<any>({ xs: { span: 24 }, sm: { span: 16 } });
  const confirmLoading = ref<boolean>(false);
  //表单验证
  const validatorRules = {
    name: [{required: true, message:'请输入参数名称'}],
    paramType: [{required: true, message:'请选择参数类型'}],
    unit: [{required: true, message:'请输入参数单位'}]
  }
  const { resetFields, validate, validateInfos } = useForm(formData, validatorRules, { immediate: false });
  //日期个性化选择
  const fieldPickers = reactive({
  });

  // 表单禁用
  const disabled = computed(()=>{
    if(props.formBpm === true){
      if(props.formData.disabled === false){
        return false;
      }else{
        return true;
      }
    }
    return props.formDisabled;
  });


  /**
   * 新增
   */
  function add() {
    edit({});
  }

  /**
   * 编辑
   */
  function edit(record) {
    nextTick(() => {
      resetFields();
      const tmpData = {};
      Object.keys(formData).forEach((key) => {
        if(record.hasOwnProperty(key)){
          tmpData[key] = record[key]
        }
      })
      //赋值
      Object.assign(formData, tmpData);
      formData.energyConsumeEquipmentTypeId = props.energyConsumeEquipmentTypeId
    });
  }

  /**
   * 提交数据
   */
  async function submitForm(type) {
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
    confirmLoading.value = true;
    const isUpdate = ref<boolean>(false);
    //时间格式化
    let model = formData;
    if (model.id) {
      isUpdate.value = true;
    }
    //循环数据
    for (let data in model) {
      // 更新个性化日期选择器的值
      model[data] = getDateByPicker(model[data], fieldPickers[data]);
      //如果该数据是数组并且是字符串类型
      if (model[data] instanceof Array) {
        let valueType = getValueType(formRef.value.getProps, data);
        //如果是字符串类型的需要变成以逗号分割的字符串
        if (valueType === 'string') {
          model[data] = model[data].join(',');
        }
      }
    }
    await saveOrUpdate(model, isUpdate.value)
      .then((res) => {
        if (res.success) {
          createMessage.success(res.message);
          if (type === "saveAndAdd") {
            add()
          }
          if (type === "save") {
            emit('ok');
          }
        } else {
          createMessage.warning(res.message);
        }
      })
      .finally(() => {
        confirmLoading.value = false;
      });
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
