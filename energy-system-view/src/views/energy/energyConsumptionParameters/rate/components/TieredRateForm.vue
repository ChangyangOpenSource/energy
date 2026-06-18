<template>
  <j-modal
      :title="title"
      :width="500"
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
        name="tieredRateForm">
      <a-row>
        <a-col :span="24">
          <a-form-item label="起使用量" name="startUse" v-bind="validateInfos.startUse">
            <a-input-number
                v-model:value="formModel.startUse"
                :min="0"
                :precision="4"
                placeholder="请输入起使用量"
                style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="结束用量" name="endUse" v-bind="validateInfos.endUse">
            <a-input-number
                v-model:value="formModel.endUse"
                :min="formModel.startUse || 0"
                :precision="4"
                placeholder="请输入结束用量"
                style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="单位价格" name="unitPrice" v-bind="validateInfos.unitPrice">
            <a-input-number
                v-model:value="formModel.unitPrice"
                :min="0"
                :precision="4"
                placeholder="请输入单位价格"
                style="width: 100%" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </j-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, defineProps, defineEmits, computed, watch, onMounted } from 'vue';
import { Form, InputNumber, Select } from 'ant-design-vue';
import JModal from '/@/components/Modal/src/JModal/JModal.vue';

// 定义 props
const props = defineProps({
  title: {
    type: String,
    default: '阶梯费率'
  },
});

const visible = ref(false);

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
  startUse: null,
  endUse: null,
  unitPrice: null
});

// 验证规则
const rules = reactive({
  startUse: [
    { required: true, message: '请输入起使用量!' },
    { type: 'number', min: 0, message: '起使用量不能小于0' }
  ],
  endUse: [
    { required: true, message: '请输入结束用量!' },
    {
      validator: (_rule: any, value: number) => {
        if (value !== null && value <= formModel.startUse) {
          return Promise.reject('结束用量必须大于起使用量');
        }
        return Promise.resolve();
      }
    }
  ],
  unitPrice: [
    { required: true, message: '请输入单位价格!' },
    { type: 'number', min: 0, message: '单位价格不能小于0' }
  ]
});

// 表单验证
const useForm = Form.useForm;
const { validate, validateInfos, clearValidate } = useForm(formModel, rules, { immediate: false });

// 重置表单数据
const resetForm = () => {
  formModel.id = '';
  formModel.startUse = null;
  formModel.endUse = null;
  formModel.unitPrice = null;
  clearValidate();
};

// 打开添加表单
const add = () => {
  resetForm();
  visible.value = true;
};

// 编辑表单
const edit = (record: any) => {
  Object.assign(formModel, record);
  clearValidate();
  visible.value = true;
};

// 确认按钮处理
const handleOk = async () => {
  try {
    // 触发表单验证
    const values = await validate();

    // 返回验证通过的数据
    emit('ok', {
      id: formModel.id,
      ...values
    });

    // 成功后重置表单
    resetForm();
    visible.value = false;
  } catch (error) {
    console.log('验证失败:', error);
    // 不关闭弹窗，让用户修正错误
  }
};

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
