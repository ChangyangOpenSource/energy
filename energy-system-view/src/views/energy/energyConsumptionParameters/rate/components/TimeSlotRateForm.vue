<template>
  <j-modal
      :title="title"
      :width="800"
      :visible="visible"
      switchFullscreen
      @ok="handleOk"
      @cancel="handleCancel"
  >
    <a-form
        ref="formRef"
        :model="formModel"
        class="antd-modal-form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        name="timeSlotRateForm">
      <a-row>
        <a-col :span="24">
          <a-form-item label="分时开始时间" name="startTime" v-bind="validateInfos.startTime">
            <a-select
              v-model:value="formModel.startTime"
              placeholder="请选择分时开始时间"
              show-search
            >
              <a-select-option
                v-for="(item, index) in 24"
                :key="index"
                :value="index"
              >
                <span v-if="index>9">{{index}}:00:00</span>
                <span v-else>0{{index}}:00:00</span>
              </a-select-option>
            </a-select>

          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="分时结束时间" name="endTime" v-bind="validateInfos.endTime">
            <a-select
              v-model:value="formModel.endTime"
              placeholder="请选择分时结束时间"
              show-search
            >
              <a-select-option
                v-for="(item, index) in 24"
                :key="index"
                :value="index"
              >
                <span v-if="index>9">{{index}}:00:00</span>
                <span v-else>0{{index}}:00:00</span>
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="峰谷平时段" name="timeSlot" v-bind="validateInfos.timeSlot">
            <j-dict-select-tag
                v-model:value="formModel.timeSlot"
                :showChooseOption="false"
                :options="timeSlotOptions"
                placeholder="请选择峰谷平时段"
                allow-clear/>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="价格（元）" name="unitPrice" v-bind="validateInfos.unitPrice">
            <a-input-number
                v-model:value="formModel.unitPrice"
                :min="0"
                :precision="4"
                placeholder="请输入价格（元）"
                style="width: 100%" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </j-modal>
</template>

<script lang="ts" setup>
import {ref, reactive, defineProps, defineEmits, computed, watch, onMounted} from 'vue';
import { Form } from 'ant-design-vue';
import JModal from '/@/components/Modal/src/JModal/JModal.vue';
import JRangeTime from "@/components/Form/src/jeecg/components/JRangeTime.vue";
import JDictSelectTag from "@/components/Form/src/jeecg/components/JDictSelectTag.vue";
import { initDictOptions } from "@/utils/dict";
import {useMessage} from "@/hooks/web/useMessage";

// 禁用分钟选择，只允许 00 和 30
const disabledMinutes = (hour: number) => {
  // 返回不允许选择的分钟数数组
  const availableMinutes = [0, 30]; // 只允许 00 和 30 分钟
  const allMinutes = Array.from({ length: 60 }, (_, i) => i);
  return allMinutes.filter(minute => !availableMinutes.includes(minute));
};


// 定义 props
const props = defineProps({
  title: {
    type: String,
    default: '分时费率'
  },
  timeOfUseRateList: {
    type: Array,
    default: () => []
  },
});
const visible = ref(false);

const timeSlotOptions = ref([]); // 时间段选项

// 定义 emits
const emit = defineEmits(['ok', 'cancel']);

// 表单引用
const formRef = ref();

// 表单布局
const labelCol = ref<any>({ xs: { span: 24 }, sm: { span: 5 } });
const wrapperCol = ref<any>({ xs: { span: 24 }, sm: { span: 16 } });

// 表单数据模型
const formModel = reactive<Record<string, any>>({
  id: '',
  timeSlot: '',
  unitPrice: null,
  startTime: null,
  endTime: null
});

// 验证规则
const rules = reactive({
  startTime: [{ required: true, message: '请输入分时开始时间!' }],
  endTime: [{ required: true, message: '请输入分时结束时间!' }],
  timeSlot: [{ required: true, message: '请选择峰谷平时段!' }],
  unitPrice: [
    { required: true, message: '请输入价格!' },
    { type: 'number', min: 0, message: '价格不能小于0' }
  ]
});

// 表单验证
const useForm = Form.useForm;
const { validate, validateInfos, clearValidate } = useForm(formModel, rules, { immediate: false });

// 重置表单数据
const resetForm = () => {
  formModel.id = null;
  formModel.timeSlot = '';
  formModel.unitPrice = null;
  formModel.startTime = null;
  formModel.endTime = null;
  clearValidate();
};

const add = () => {
  resetForm();
  visible.value = true;
};

const edit = (record) => {
  Object.assign(formModel, record);
  clearValidate();
  visible.value = true;
};

const { createMessage } = useMessage();

// 确认按钮处理
const handleOk = async () => {
  try {
    // 触发表单验证
    const values = await validate();

    // 获取时间段文本
    const timeSlotOption = timeSlotOptions.value.find(
        (item: any) => item.value === formModel.timeSlot
    );
    const timeSlotText = timeSlotOption ? timeSlotOption.text : '';

    //获取父组件值


    const index = props.timeOfUseRateList
      .findIndex(item =>
        item.id !== formModel.id && ((item.startTime < formModel.startTime && item.endTime > formModel.startTime) || (item.startTime < formModel.endTime && item.endTime > formModel.endTime))
      );

    if (index !== -1){
      createMessage.error("时间交叉,请修改后重试");
      return;
    }
    console.log(index,"aa")

    // 返回验证通过的数据
    emit('ok', {
      id: formModel.id,
      ...values,

      timeSlotText
    });
    // 成功后重置表单
    resetForm();
    visible.value = false;
  } catch (error) {
    console.log('验证失败:', error);
    // 不关闭弹窗，让用户修正错误
  }
};

function initTimeSlotOption() {
  initDictOptions('time_slot').then((data) => {
    timeSlotOptions.value = data;
  });
}

onMounted(() => {
  initTimeSlotOption();
});

// 取消按钮处理
const handleCancel = () => {
  resetForm();
  visible.value = false;
};

// 暴露方法给父组件
defineExpose({
  formModel,
  validate,
  validateInfos,
  clearValidate,
  resetForm,
  add,
  edit
});
</script>

<style lang="less" scoped>
.antd-modal-form {
  padding: 14px 20px;
}
</style>
