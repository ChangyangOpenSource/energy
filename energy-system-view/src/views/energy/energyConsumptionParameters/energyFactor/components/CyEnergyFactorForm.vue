<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer :disabled="disabled">
      <template #detail>
        <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol" name="CyEnergyFactorForm">
          <a-row>
            <a-col :span="12">
              <a-form-item label="能源类型" v-bind="validateInfos.energyType" name="energyType">
                <j-dict-select-tag :disabled="formData.id != ''" @change="energyTypeOnChange" v-model:value="formData.energyType" :showChooseOption="false" dictCode="energy_type" placeholder="请选择能源类型" allow-clear/>
              </a-form-item>
            </a-col>
						<a-col :span="12">
							<a-form-item label="单位类型" v-bind="validateInfos.unit" id="CyEnergyFactorForm-unit" name="unit">
								<a-input :disabled="true" v-model:value="formData.unit" placeholder="请输入单位类型"  allow-clear ></a-input>
							</a-form-item>
						</a-col>
            <a-col :span="12">
              <a-form-item label="开始时间" v-bind="validateInfos.startTime" id="CyCoalCoefficientForm-startTime" name="startTime">
                <a-date-picker placeholder="请选择开始时间" v-model:value="formData.startTime" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="结束时间" v-bind="validateInfos.endTime" id="CyCoalCoefficientForm-endTime" name="endTime">
                <a-radio-group v-model:value="formData.isDeadline" style="width: 50%" @change="endTimeOnChange">
                  <a-radio value="0">至今</a-radio>
                  <a-radio value="1">固定时间</a-radio>
                </a-radio-group>
                <a-date-picker  style="width: 50%" v-if="formData.isDeadline == 1" placeholder="请选择结束时间" v-model:value="formData.endTime" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD"/>
              </a-form-item>
            </a-col>


            <a-col :span="24">
              <a-form-item v-bind="validateInfos.factorId" :label="t('carbon.message.Carbon_emission_factor')" name="factorId">
                <div class="tianjia" v-if="!formData.factorId">
                  <div class="color">{{ t('carbon.message.please_add_factor') }}</div>
                  <div>
                    <a-button @click="handleAdd" class="leftShoudong">
                      {{ t('carbon.message.Manually_add') }}
                    </a-button>
                    <a-button @click="handleAdd(1)" class="leftChaxun marRight">
                      {{ t('carbon.message.Select_factor') }}
                    </a-button>
                  </div>
                </div>
                <div v-else>
                  <yzCard :item="selectedRows"/>
                  <div class="manual">
                    <div class="manualOperation" @click="handleAdd" v-if="!formDisabled">
                      <img src="@/assets/carbon/img9.png" alt=""/>
                      {{ t('carbon.message.Manually_add') }}
                    </div>
                    <div class="manualOperation" @click="handleAdd(1)" v-if="!formDisabled">
                      <img src="@/assets/carbon/img10.png" alt=""/>
                      {{ t('carbon.message.Add_again') }}
                    </div>
                  </div>
                </div>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item v-bind="validateInfos.ratio" :label="t('carbon.message.Unit_proportional_conversion')" name="ratio">
                <div class="">
                  1{{ formData.unit }}
                  <span class="color1">({{ t('carbon.message.Energy_type_unit') }})</span>=
                  <a-input-number
                      id="error"
                      v-model:value="formData.ratio"
                      :precision="4"
                      :min="0"
                      class="inpts"
                      :placeholder="t('carbon.message.Please_enter')"
                  />
                  {{ selectedRows.denominatorUnit }}
                  <span class="color1"> ({{ t('carbon.message.Factor_denominator_unit') }})</span>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
    </JFormContainer>
  </a-spin>

  <!--选择碳排因子弹窗-->
  <a-modal
      :title="t('carbon.message.selective_carbon_emission_factor')"
      :visible="visible2"
      @ok="handleOk2"
      @cancel="handleCancel"
      :width="1524"
  >
    <yzChooseView @onselectedRows="onselectedRows" v-if="visible2"/>
  </a-modal>

  <a-modal
      :title="t('carbon.message.manually_add_carbon_emission_factors')"
      :visible="visible3"
      @ok="handleOk3"
      @cancel="handleCancel"
      :width="1000"
  >
    <yzAddView ref="yzAddViewRef" v-if="visible3"/>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, defineExpose, nextTick, defineProps, computed, onMounted } from 'vue';
  import { defHttp } from '/@/utils/http/axios';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getDateByPicker, getValueType } from '/@/utils';
  import { saveOrUpdate,checkTime} from '../CyEnergyFactor.api';
  import {Form, Modal} from 'ant-design-vue';
  import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
  import JDictSelectTag from "@/components/Form/src/jeecg/components/JDictSelectTag.vue";
  import { useI18n } from '/@/hooks/web/useI18n';
  import yzCard from '/@/components/common/yzCard2.vue'
  import yzChooseView from '/@/components/common/yzChooseView.vue';
  import yzAddView from '/@/components/common/yzAddView.vue';
  import {addEmissionFactorCheck, getUnitConvertValue, getFactorInfo} from "@/components/common/api/basicDrawer";
  import { h } from 'vue'
  const { t } = useI18n();
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
    factorId: '',
    startTime: '',
    endTime: '',
    stationId: '',
    isDeadline: '',
    factorId: '',
    ratio: '',
  });
  const { createMessage } = useMessage();
  const labelCol = ref<any>({ xs: { span: 24 }, sm: { span: 5 } });
  const wrapperCol = ref<any>({ xs: { span: 24 }, sm: { span: 16 } });
  const confirmLoading = ref<boolean>(false);
  //表单验证
  const validatorRules = reactive({
    energyType: [{ required: true, message: '请输入能源类型!'},],
    unit: [{ required: true, message: '请输入单位类型!'},],
    factorId: [{ required: true, message: '请输入因子id!'},],
    startTime: [{ required: true, message: '请选择开始时间!'},],
    endTime: [{ required: true, message: '请选择结束时间!'},],
    stationId: [{ required: true, message: '请输入关联场站id!'},],
    factorId: [{ required: true, message: '请选择碳排因子!'},],
    ratio: [{ required: true, message: '请输入单位比例换算系数!'},],
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

  const visible2 = ref(false);
  const visible3 = ref(false);
  const selectedRows = ref({});
  const cachesSlectedRows = ref({});
  const province = ref({ unitCode: '' });
  const yzAddViewRef = ref();

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
      listInfo();
    });
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
      if (!res.success){
        createMessage.error(res.message);
        confirmLoading.value = false;
      }else {
        if (res.message){
          Modal.confirm({
            title: '时间空缺',
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
        }else {
          submitForm()
        }
      }
    }) .finally(() => {
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

    model.carbonMolecule = selectedRows.value.numeratorUnit;
    model.carbonDenomintor = selectedRows.value.denominatorUnit;
    model.factorValue = selectedRows.value.factorValue;
    console.log(selectedRows,"model")
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

  //打开抽屉
  const handleAdd = (value?: number) => {
    if (value == 1) {
      // 选择因子
      visible2.value = true;
    } else {
      // 手动添加
      visible3.value = true;
    }
  };

  const handleOk2 = () => {
    selectedRows.value = cachesSlectedRows.value;
    formData.factorId = cachesSlectedRows.value.id;
    formData.factorValue = cachesSlectedRows.value.factorValue;
    unitChange();
    visible2.value = false;
  };

  const unitChange = () => {
    if (province.value?.unitCode && selectedRows.value.denominatorUnit) {
      if (province.value.unitCode == selectedRows.value.denominatorUnit) {
        formData.ratio = '1';
      } else {
        getUnitConvertValue({
          sourceUnit: province.value.unitCode,
          targetUnit: selectedRows.value.denominatorUnit
        }).then((res) => {
          if (res.success) {
            formData.ratio = res.result;
          }
        });
      }
    }
  };

  const handleCancel = () => {
    visible2.value = false;
    visible3.value = false;
  };

  const handleOk3 = () => {
    if (yzAddViewRef.value && !yzAddViewRef.value.checkFormData()) {
      return;
    }

    const queryParam = yzAddViewRef.value.queryParam;
    if (!queryParam) return;

    addEmissionFactorCheck(queryParam).then((res) => {
      if (res.success) {
        createMessage.success(t('carbon.message.operation_success'));
        formData.factorId = res.result;
        console.log("form.factorId:", formData.factorId)
        listInfo();
      }
    });
  };

  /**
   * 获取因子数据
   */
  const listInfo = () => {
    if (!formData.factorId) {
      return;
    }

    getFactorInfo({
      id: formData.factorId
    }).then((res) => {
      if (res.success) {
        selectedRows.value = {
          id: res.result.emissionFactorObject.id,
          name: res.result.emissionFactorObject.name,
          model: res.result.emissionFactorObject.model,
          factorValue: res.result.emissionFactorDataObject.factorValue,
          numeratorUnit: res.result.emissionFactorDataObject.numeratorUnit,
          denominatorUnit: res.result.emissionFactorDataObject.denominatorUnit,
          releaseOrg: res.result.emissionFactorObject.releaseOrg,
          releaseYear: res.result.emissionFactorObject.releaseYear,
        };
        visible3.value = false;
        formData.factorValue = res.result.emissionFactorDataObject.factorValue;
      }
    });
  };

  const onselectedRows = (value) => {
    cachesSlectedRows.value = value;
  };

  function endTimeOnChange(){
    if (formData.isDeadline == 0){
      formData.endTime = new Date();
    }else {
      formData.endTime = ''
    }
  }

  function energyTypeOnChange(){
    switch (formData.energyType)
    {
      case '1'://水
        formData.unit = 't';
        break;
      case '2'://电
        formData.unit = 'kWh';
        break;
      case '3'://气
        formData.unit = 'm³';
        break;
      default:
        formData.unit = '';
        formData.coefficientUnit =  '';
    }
  }

  defineExpose({
    add,
    edit,
    submitForm,
    submitCheckTime
  });
</script>

<style lang="less" scoped>
  .antd-modal-form {
    padding: 14px 20px;
  }
  .tianjia {
    width: 380px;
    height: 156px;
    background: #f8f8f8;
    border-radius: 3px 3px 3px 3px;
    border: 1px solid #d9d9d9;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .color {
      color: #888888;
    }

    .leftShoudong {
      background: #fff !important;
      border-color: #148958 !important;
      color: #148958 !important;
    }

    .marRight {
      margin-left: 16px;
    }
  }

  .leftChaxun {
    background: #148958 !important;
    color: #fff !important;
  }

  .leftChaxun:hover {
    background: #148958 !important;
    color: #fff !important;
  }

  .manualOperation {
    background: #ffffff;
    border-radius: 3px 3px 3px 3px;
    font-weight: 400;
    font-size: 12px;
    color: #148958;
    line-height: 0;
    border: 1px solid #148958;
    padding: 4px 8px;
    display: flex;
    align-items: center;

    img {
      width: 14px;
      height: 14px;
      margin-right: 8px;
    }
  }

  .manual {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
  }
  .inpts {
    width: 80px !important;
  }

</style>
