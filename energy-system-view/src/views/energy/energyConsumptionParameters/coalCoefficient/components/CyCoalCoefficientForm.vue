<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer :disabled="disabled">
      <template #detail>
        <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol" name="CyCoalCoefficientForm">
          <a-row>
						<a-col :span="12">
              <a-form-item label="能源类型" v-bind="validateInfos.energyType" name="energyType">
                <j-dict-select-tag :disabled="formData.id != ''" v-model:value="formData.energyType" @change="energyTypeOnChange" :showChooseOption="false" dictCode="energy_type" placeholder="请选择能源类型" allow-clear/>
              </a-form-item>
						</a-col>
            <a-col :span="12">
              <a-form-item label="单位" v-bind="validateInfos.unit" id="CyCoalCoefficientForm-unit" name="unit">
                <a-input :disabled="true" v-model:value="formData.unit" placeholder="请输入单位"  allow-clear ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="折标煤系数单位" v-bind="validateInfos.coefficientUnit" id="CyCoalCoefficientForm-coefficientUnit" name="coefficientUnit">
                <a-input :disabled="true" v-model:value="formData.coefficientUnit" placeholder="请输入折标煤系数单位"  allow-clear ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="折标煤系数" v-bind="validateInfos.coefficient" id="CyCoalCoefficientForm-coefficient" name="coefficient">
                <a-input-number v-model:value="formData.coefficient" :min="0" :precision="4"  placeholder="请输入折标煤系数" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="开始时间" v-bind="validateInfos.startTime" id="CyCoalCoefficientForm-startTime" name="startTime">
                <a-month-picker placeholder="请选择开始时间" v-model:value="formData.startTime" format="YYYY-MM" valueFormat="YYYY-MM"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="结束时间" v-bind="validateInfos.endTime" id="CyCoalCoefficientForm-endTime" name="endTime">
                <a-radio-group v-model:value="formData.isDeadline" style="width: 50%" @change="endTimeOnChange">
                  <a-radio value="0">至今</a-radio>
                  <a-radio value="1">固定时间</a-radio>
                </a-radio-group>
                <a-month-picker style="width: 50%" v-if="formData.isDeadline == 1" placeholder="请选择结束时间" v-model:value="formData.endTime" format="YYYY-MM" valueFormat="YYYY-MM"/>
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
  import { getDateByPicker, getValueType } from '/src/utils';
  import { saveOrUpdate,checkTime } from '../CyCoalCoefficient.api';
  import {Form, Modal} from 'ant-design-vue';
  import JFormContainer from '/src/components/Form/src/container/JFormContainer.vue';
  import JCheckbox from "@/components/Form/src/jeecg/components/JCheckbox.vue";
  import JDictSelectTag from "@/components/Form/src/jeecg/components/JDictSelectTag.vue";
  import { h } from 'vue'
  const props = defineProps({
    formDisabled: { type: Boolean, default: false },
    formData: { type: Object, default: () => ({})},
    formBpm: { type: Boolean, default: true }
  });
  const formRef = ref();
  const useForm = Form.useForm;
  const emit = defineEmits(['register', 'ok']);
  const formData = reactive<Record<string, any>>({
    id: '',
    energyType: '',
    unit: '',
    coefficient: undefined,
    coefficientUnit: '',
    startTime: '',
    endTime: '',
    isDeadline: '',
    stationId: '',
  });
  const { createMessage } = useMessage();
  const labelCol = ref<any>({ xs: { span: 24 }, sm: { span: 8 } });
  const wrapperCol = ref<any>({ xs: { span: 24 }, sm: { span: 16 } });
  const confirmLoading = ref<boolean>(false);
  //表单验证
  const validatorRules = reactive({
    energyType: [{ required: true, message: '请输入能源类型!'},],
    unit: [{ required: true, message: '请输入单位!'},],
    coefficientUnit: [{ required: true, message: '请输入折标煤系数单位!'},],
    coefficient: [{ required: true, message: '请输入折标煤系数!'},],
    startTime: [{ required: true, message: '请选择开始时间!'},],
    endTime: [{ required: true, message: '请选择结束时间!'},],
  });
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
  function add(stationId) {
    edit({stationId:stationId});
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
    });
  }

  function energyTypeOnChange(){
    switch (formData.energyType)
    {
      case '1'://水
        formData.unit = 't';
        formData.coefficientUnit = 'kgce/t';
        break;
      case '2'://电
        formData.unit = 'kWh';
        formData.coefficientUnit = 'kgce/kWh';
        break;
      case '3'://气
        formData.unit = 'm³';
        formData.coefficientUnit = 'kgce/m³';
        break;
      default:
        formData.unit = '';
        formData.coefficientUnit =  '';
    }
  }

  async function submitCheckTime() {
    try {
      // 触发表单验证
      await validate();
    } catch ({errorFields}) {
      if (errorFields) {
        const firstField = errorFields[0];
        if (firstField) {
          formRef.value.scrollToField(firstField.name, {behavior: 'smooth', block: 'center'});
        }
      }
      return Promise.reject(errorFields);
    }
    confirmLoading.value = true;
    // 时间格式化
    let model = formData;
    checkTime(model).then((res: { message: any; }) => {
      if (!res.success) {
        createMessage.error(res.message);
        confirmLoading.value = false;
      } else {
        if (res.message) {
          Modal.confirm({
            title: '提示',
            content: h('div', {
              innerHTML: res.message.replace(/\n/g, '<br/>')
            }),
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
              submitForm()
            },
          });
          return
        } else {
          submitForm()
        }
      }
    }).finally(() => {
      confirmLoading.value = false;
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
          emit('ok');
        } else {
          createMessage.warning(res.message);
        }
      })
      .finally(() => {
        confirmLoading.value = false;
      });
  }

  function endTimeOnChange(){
    if (formData.isDeadline == 0){
      formData.endTime = new Date();
    }else {
      formData.endTime = ''
    }
  }

  defineExpose({
    add,
    edit,
    submitCheckTime,
  });
</script>

<style lang="less" scoped>
  .antd-modal-form {
    padding: 14px 20px;
  }
</style>
