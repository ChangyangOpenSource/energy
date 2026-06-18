<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer :disabled="disabled">
      <template #detail>
        <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol" name="CyEnergyConsumptionAnalysisIndicatorForm">
          <a-row>
            <a-col :span="12">
              <a-form-item label="指标名称" v-bind="validateInfos.indicatorName" id="CyEnergyConsumptionAnalysisIndicatorForm-indicatorName" name="indicatorName">
                <a-input v-model:value="formData.indicatorName" placeholder="请输入指标名称"  allow-clear ></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="指标单位">
                <a-input v-model:value="formData.indicatorUnit" placeholder="请输入指标单位" disabled></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="说明" v-bind="validateInfos.instruction" id="CyEnergyConsumptionAnalysisIndicatorForm-instruction" name="instruction">
                <a-textarea style="width: 400px"  :rows="4" v-model:value="formData.instruction" placeholder="请输入说明" />
              </a-form-item>
            </a-col>

            <a-col :span="12">
            </a-col>

            <a-col :span="12">
              <a-form-item label="能耗数据" v-bind="validateInfos.energyConsumeDataId" id="CyEnergyConsumptionAnalysisIndicatorForm-energyConsumeDataId" name="energyConsumeDataId">
                <a-select style="width: 100%" v-model:value="formData.energyConsumeDataId" placeholder="请选择能耗数据" @change="energyConsumeDataChange"  >
                  <a-select-option :value="item.value" v-for="(item,index) in energyTypeList" :key="item.value">
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="单位" v-bind="validateInfos.energyConsumeDataUnitName" id="CyEnergyConsumptionAnalysisIndicatorForm-energyConsumeDataUnitName" name="energyConsumeDataUnitName">
                <a-input v-model:value="formData.energyConsumeDataUnitName" disabled></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="运营数据" v-bind="validateInfos.operationalDataId" id="CyEnergyConsumptionAnalysisIndicatorForm-operationalDataId" name="operationalDataId">
                <a-select style="width: 100%" v-model:value="formData.operationalDataId" placeholder="请选择运营数据" @change="operateDataChange">
                  <a-select-option :value="item.value" v-for="(item,index) in OperateDataList" :key="item.id">
                    {{ item.dataItemName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="单位" v-bind="validateInfos.operationalDataUnitName" id="CyEnergyConsumptionAnalysisIndicatorForm-operationalDataUnitName" name="operationalDataUnitName">
                <a-input v-model:value="formData.operationalDataUnitName" disabled></a-input>
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
  import { defHttp } from '/@/utils/http/axios';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getDateByPicker, getValueType } from '/@/utils';
  import {getAllOperateData, saveOrUpdate} from '../CyEnergyConsumptionAnalysisIndicator.api';
  import { Form } from 'ant-design-vue';
  import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
  import {
    energyTypeDict,
    energyTypeUnitDict
  } from "@/views/energy/energyDeviceStatistics/CyEnergyDeviceStatistics.api";
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
    indicatorName: '',
    instruction: '',
    energyConsumeDataId: '',
    energyConsumeDataName: '',
    energyConsumeDataUnitId: '',
    energyConsumeDataUnitName: '',
    operationalDataId: '',
    operationalDataName: '',
    operationalDataUnitId: '',
    operationalDataUnitName: '',
  });
  const { createMessage } = useMessage();
  const labelCol = ref<any>({ xs: { span: 24 }, sm: { span: 5 } });
  const wrapperCol = ref<any>({ xs: { span: 24 }, sm: { span: 16 } });
  const confirmLoading = ref<boolean>(false);
  //表单验证
  const validatorRules = reactive({
    indicatorName: [{ required: true, message: '请输入指标名称!' }],
    energyConsumeDataId: [{ required: true, message: '请选择能耗数据!' }],
    operationalDataId: [{ required: true, message: '请选择运营数据!' }],
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
  const energyTypeList = ref([]);
  const energyTypeUnitList = ref([]);
  const OperateDataList = ref([]);


  /**
   * 新增
   */
  function add(stationId,type) {
    edit({},stationId,type);
  }

  /**
   * 编辑
   */
  function edit(record,stationId,type) {
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
      formData.indicatorUnit = formData.energyConsumeDataUnitName + "/" + formData.operationalDataUnitName
      formData.parentId = stationId
    });
    // 查询能耗数据类型字典
    energyTypeDict().then(res => {
      energyTypeList.value = res
    })
    // 查询能耗数据类型对应单位字典
    energyTypeUnitDict().then(res => {
      energyTypeUnitList.value = res
    })
    // 查询所有运营数据
    getAllOperateData({deptId:stationId,type:type}).then(res => {
      OperateDataList.value = res
    })
  }

  /**
   * 运营数据修改，放置对应的单位数据
   */
  function operateDataChange(e){
    const findItem = OperateDataList.value.find(item => item.id == e);
    // 放置运营数据名称
    formData.operationalDataName = findItem.dataItemName
    // 放置运营数据单位名称
    formData.operationalDataUnitName = findItem.unitName
    // 组装总体单位
    if(formData.operationalDataUnitName && formData.energyConsumeDataUnitName){
      formData.indicatorUnit = formData.energyConsumeDataUnitName + "/" + formData.operationalDataUnitName
    }
  }

  /**
   * 能耗数据修改，放置对应的单位数据
   */
  function energyConsumeDataChange(e){
    // 放置能耗数据名称
    const findItem = energyTypeList.value.find(item => item.value == e);
    formData.energyConsumeDataName = findItem.title
    // 放置能耗数据单位名称
    const findUnitItem = energyTypeUnitList.value.find(item => item.value == e);
    formData.energyConsumeDataUnitName = findUnitItem.title
    // 组装总体单位
    if(formData.operationalDataUnitName && formData.energyConsumeDataUnitName){
      formData.indicatorUnit = formData.energyConsumeDataUnitName + "/" + formData.operationalDataUnitName
    }
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
