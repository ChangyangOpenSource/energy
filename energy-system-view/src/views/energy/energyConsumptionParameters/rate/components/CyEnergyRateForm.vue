<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer :disabled="disabled">
      <template #detail>
        <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol" name="CyEnergyRateForm">
          <a-row>
            <a-col :span="12">
              <a-form-item label="名称" v-bind="validateInfos.rateName" id="CyEnergyRateForm-rateName" name="rateName">
                <a-input v-model:value="formData.rateName" placeholder="请输入名称"  allow-clear ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="能源类型" v-bind="validateInfos.energyType" name="energyType">
                <j-dict-select-tag v-model:value="formData.energyType" :showChooseOption="false" dictCode="energy_type" placeholder="请选择能源类型" @change="energyTypeOnChange" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="费率类型" v-bind="validateInfos.rateType" id="CyEnergyRateForm-rateType" name="rateType">
                <j-dict-select-tag v-model:value="formData.rateType" :showChooseOption="false" dictCode="rate_type" placeholder="请选择费率类型" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="单位" v-bind="validateInfos.unit" id="CyEnergyRateForm-unit" name="unit">
                <a-input :disabled="true" v-model:value="formData.unit" placeholder="请输入单位"  allow-clear ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">

              <a-form-item label="有效时间" v-bind="validateInfos.startTime" id="CyEnergyRateForm-startTime" name="startTime">
                <a-space direction="horizontal">
                  <a-month-picker
                    v-model:value="formData.startTime"
                    format="YYYY-MM"
                    value-format="YYYY-MM"
                    placeholder="开始时间"
                    @change="onStartTimeChange"
                  />
                  <span>-</span>
                  <a-month-picker
                    v-model:value="formData.endTime"
                    format="YYYY-MM"
                    value-format="YYYY-MM"
                    placeholder="结束时间"
                    @change="onEndTimeChange"
                  />
                </a-space>
              </a-form-item>

            </a-col>
            <a-col :span="12" v-if="formData.rateType === '2'">
              <a-form-item label="计费周期" name="billingCycle" v-bind="validateInfos.billingCycle">
                <a-select
                    v-model:value="formData.billingCycle"
                    placeholder="请选择计费周期"
                    allow-clear>
                  <a-select-option value="month">月</a-select-option>
                  <a-select-option value="year">年</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!-- 将 v-else-if 改为独立的 v-if 条件 -->
            <a-col :span="24" v-if="formData.rateType === '1'">
              <div style="display: flex;justify-content: space-between;margin-bottom: 5px">
                <div>费率明细</div>
                <a-button type="primary" @click="addTimeOfUseRate">添加</a-button>
              </div>
              <a-table
                  :columns="timeOfUseRateColumns"
                  :dataSource="timeOfUseRateList"
              >
                <template #action="{ record }">
                  <a type="primary" @click="editTimeOfUseRate(record)">编辑</a>
                  <a-divider type="vertical"/>
                  <a-popconfirm title="确定删除吗?" @confirm="deleteTimeOfUseRate(record)">
                    <a>删除</a>
                  </a-popconfirm>
                </template>
              </a-table>
            </a-col>
            <a-col :span="24" v-if="formData.rateType === '2'">
              <div style="display: flex;justify-content: space-between;margin-bottom: 5px">
                <div>费率明细</div>
                <a-button type="primary" @click="addTieredRate">添加</a-button>
              </div>
              <a-table
                  :columns="tieredRateColumns"
                  :dataSource="tieredRateList"
              >
                <template #action="{ record }">
                  <a type="primary" @click="editTieredRate(record)">编辑</a>
                  <a-divider type="vertical"/>
                  <a-popconfirm title="确定删除吗?" @confirm="deleteTieredRate(record)">
                    <a>删除</a>
                  </a-popconfirm>
                </template>
              </a-table>
            </a-col>
            <a-col :span="12" v-if="formData.rateType === '3'">
              <a-form-item label="单价" v-bind="validateInfos.unitPrice" id="CyEnergyRateForm-unitPrice" name="unitPrice">
                <a-input-number v-model:value="formData.unitPrice" :min="0" :precision="4" placeholder="请输入单价" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
    </JFormContainer>
  </a-spin>

  <!-- 分时费率表单组件 -->
  <TimeSlotRateForm
      ref="timeSlotRateFormRef"
      :timeOfUseRateList="timeOfUseRateList"
      @ok="handleTimeSlotRateOk"
  />

  <!-- 阶梯费率表单组件 -->
  <TieredRateForm
      ref="tieredRateFormRef"
      @ok="handleTieredRateOk"
  />
</template>
<script lang="ts" setup>
import { ref, reactive, defineExpose, nextTick, defineProps, computed, onMounted } from 'vue';
import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';
import { getDateByPicker, getValueType } from '/@/utils';
import {checkTime, saveOrUpdate} from '../CyEnergyRate.api';
import {Form, Modal} from 'ant-design-vue';
import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
import JDictSelectTag from "@/components/Form/src/jeecg/components/JDictSelectTag.vue";
import { timeOfUseRateColumns, tieredRateColumns } from '../CyEnergyRate.data';
import { initDictOptions } from "@/utils/dict";
// 导入新组件
import TimeSlotRateForm from './TimeSlotRateForm.vue';
import TieredRateForm from './TieredRateForm.vue';
import {deleteThirdAppConfig} from "@/views/system/appconfig/ThirdApp.api";
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
  rateName: '',
  energyType: '',
  rateType: '',
  unit: '',
  startTime: '',
  endTime: '',
  unitPrice: undefined,
  timeOfUseRate: '',
  tieredRate: '',
  billingCycle: '',
  stationId:''
});

const { createMessage } = useMessage();
const labelCol = ref<any>({ xs: { span: 24 }, sm: { span: 5 } });
const wrapperCol = ref<any>({ xs: { span: 24 }, sm: { span: 16 } });
const confirmLoading = ref<boolean>(false);

// 主表单验证
// 创建动态验证规则函数
const getValidatorRules = computed(() => {
  const rules = {
    rateName: [{ required: true, message: '请输入能源费率名称!'}],
    energyType: [{ required: true, message: '请输入能源类型!'}],
    rateType: [{ required: true, message: '请输入费率类型（1分时费率2阶梯费率3固定费率）!'}],
    unit: [{ required: true, message: '请输入单位类型!'}],
    startTime: [{ required: true, message: '请输入开始时间!'}],
    endTime: [{ required: true, message: '请输入结束时间!'}],
  };

  // 根据费率类型添加条件验证
  if (formData.rateType === '3') {
    rules.unitPrice = [{ required: true, message: '请输入单价!' }];
  }

  return rules;
});

// 使用动态规则
const { resetFields, validate, validateInfos } = useForm(formData, getValidatorRules, { immediate: false });

// 日期个性化选择
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

const timeOfUseRateList = ref([]); // 分时价格
const tieredRateList = ref([]); // 阶梯费率列表

const timeSlotRateFormRef = ref();
const tieredRateFormRef = ref();

function energyTypeOnChange(){
  switch (formData.energyType)
  {
    case '1'://水
      formData.unit = '元/t';
      break;
    case '2'://电
      formData.unit = '元/kWh';
      break;
    case '3'://气
      formData.unit = '元/m³';
      break;
    default:
      formData.unit = '';
  }

  tieredRateList.value.forEach(item=> { item.unit = formData.unit;} )

  console.log(tieredRateList.value,"2a")

}


/**
 * 打开分时价格弹窗
 */
function addTimeOfUseRate() {
  timeSlotRateFormRef.value.add()
}

/**
 * 编辑分时价格
 */
function editTimeOfUseRate(record){
  timeSlotRateFormRef.value.edit(record)
}

/**
 * 删除分时价格
 */
function deleteTimeOfUseRate(record) {
  timeOfUseRateList.value = timeOfUseRateList.value.filter(item => item.id !== record.id);
}

/**
 * 分时费率表单确认回调
 */
function handleTimeSlotRateOk(data: any) {
  //新增一个id
  if(!data.id){
    const newId = 'temp_' + Date.now();
    timeOfUseRateList.value.push({
      id: newId,
      startTime: data.startTime,
      endTime: data.endTime,
      timeSlot: data.timeSlot,
      timeSlotText: data.timeSlotText,
      unitPrice: data.unitPrice
    });
  }else {
    timeOfUseRateList.value.forEach((item, index) => {
      if(item.id === data.id){
        timeOfUseRateList.value[index] = data;
      }
    })
  }
}

/**
 * 打开阶梯费率弹窗
 */
function addTieredRate() {
  tieredRateFormRef.value.add()
}

/**
 * 编辑阶梯费率
 */
function editTieredRate(record) {
  tieredRateFormRef.value.edit(record)
}

/**
 * 删除阶梯费率
 */
function deleteTieredRate(record) {
  tieredRateList.value = tieredRateList.value.filter(item => item.id !== record.id);
}

/**
 * 阶梯费率表单确认回调
 */
function handleTieredRateOk(data: any) {
  if(!data.id){
    const newId = 'temp_' + Date.now();
    tieredRateList.value.push({
      id: newId,
      billingCycle: data.billingCycle,
      startUse: data.startUse,
      endUse: data.endUse,
      unit: formData.unit,
      unitPrice: data.unitPrice
    });
  }else {
    tieredRateList.value.forEach((item, index) => {
      if(item.id === data.id){
        tieredRateList.value[index] = data;
      }
    })
  }
}

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
  console.log('编辑记录:', record); // 调试日志
  nextTick(() => {
    resetFields();
    const tmpData = {};
    Object.keys(formData).forEach((key) => {
      if(record.hasOwnProperty(key)){
        tmpData[key] = record[key]
      }
    })
    // 赋值
    Object.assign(formData, tmpData);

    console.log('设置的费率类型:', formData.rateType); // 调试日志

    // 根据费率类型加载对应的数据
    if (formData.rateType === '1') {
      timeOfUseRateList.value = record.timeOfUseRate ? JSON.parse(record.timeOfUseRate) : [];
      tieredRateList.value = [];
    } else if (formData.rateType === '2') {
      tieredRateList.value = record.tieredRate ? JSON.parse(record.tieredRate) : [];
      timeOfUseRateList.value = [];
    } else {
      timeOfUseRateList.value = [];
      tieredRateList.value = [];
    }

    console.log('分时费率列表:', timeOfUseRateList.value); // 调试日志
    console.log('阶梯费率列表:', tieredRateList.value); // 调试日志
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
  // 时间格式化
  let model = formData;
  if (model.id) {
    isUpdate.value = true;
  }
  // 循环数据
  for (let data in model) {
    // 更新个性化日期选择器的值
    model[data] = getDateByPicker(model[data], fieldPickers[data]);
    // 如果该数据是数组并且是字符串类型
    if (model[data] instanceof Array) {
      let valueType = getValueType(formRef.value.getProps, data);
      // 如果是字符串类型的需要变成以逗号分割的字符串
      if (valueType === 'string') {
        model[data] = model[data].join(',');
      }
    }
  }
  //timeOfUseRateList转string
  model.timeOfUseRate = JSON.stringify(timeOfUseRateList.value);
  //tieredRateList转string
  model.tieredRate = JSON.stringify(tieredRateList.value);

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
  submitCheckTime,
});
</script>


<style lang="less" scoped>
.antd-modal-form {
  padding: 14px 20px;
}
</style>
