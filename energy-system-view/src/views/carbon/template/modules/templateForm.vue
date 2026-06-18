<!-- src/views/carbon/template/modules/templateForm.vue -->
<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer :disabled="formDisabled">
      <template #detail>
        <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol" name="TemplateForm" :rules="validatorRules">
          <a-row>
            <a-col :span="24">
              <a-form-item :label="t('carbon.message.template_name')" v-bind="validateInfos.name" name="name">
                <a-input v-model:value="formData.name" :placeholder="t('carbon.message.template_name')" allow-clear></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item :label="t('carbon.message.Accounting_standard')" v-bind="validateInfos.standardId" name="standardId">
                <a-select :disabled="!!formData.checkId" v-model:value="formData.standardId" :placeholder="t('carbon.message.Please_select')" allow-clear>
                  <a-select-option v-for="province in provinceData" :key="province.key" :value="province.key">
                    {{ province.title }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item :label="t('carbon.message.industry')" v-bind="validateInfos.profession" name="profession">
                <a-select v-model:value="formData.profession" :placeholder="t('carbon.message.Please_select')" allow-clear>
                  <a-select-option v-for="profession in professionData" :key="profession.key" :value="profession.key">
                    {{ profession.title }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
    </JFormContainer>
  </a-spin>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, defineProps, defineEmits, nextTick } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { Form } from 'ant-design-vue';
import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
import { saveOrUpdate, loadCategoryTreeRoot } from '../Template.api';
import {useMessage} from "@/hooks/web/useMessage";
const { createMessage, createWarningModal } = useMessage();

const { t } = useI18n();
const props = defineProps({
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(['register', 'ok']);

const formRef = ref();
const useForm = Form.useForm;

const formData = reactive<Record<string, any>>({
  id: '',
  name: '',
  standardId: undefined,
  profession: undefined,
  checkId: undefined,
});

const provinceData = ref<any[]>([]);
const professionData = ref<any[]>([]);

const labelCol = ref<any>({ xs: { span: 24 }, sm: { span: 5 } });
const wrapperCol = ref<any>({ xs: { span: 24 }, sm: { span: 16 } });
const confirmLoading = ref<boolean>(false);

// 表单验证
const validatorRules = {
  name: [{ required: true, message: t('carbon.message.Please_enter_template_name') }],
  standardId: [{ required: true, message: t('carbon.message.please_select_accounting_standard') }],
};

const { resetFields, validate, validateInfos } = useForm(formData, validatorRules, { immediate: false });

// 表单禁用
const formDisabled = computed(() => {
  return props.disabled;
});

/**
 * 初始化字典配置
 */
async function initDictConfig() {
  try {
    // 获取核算标准
    const res1 = await loadCategoryTreeRoot({
      pcode: "A01",
      async: true,
    });
    if (res1.success) {
      provinceData.value = res1.result;
    }

    // 获取行业数据
    const res2 = await loadCategoryTreeRoot({
      pcode: "A04",
      async: true,
    });
    if (res2.success) {
      professionData.value = res2.result;
    }
  } catch (error) {
    console.error('Failed to load dict config:', error);
  }
}

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
      if (record.hasOwnProperty(key)) {
        tmpData[key] = record[key];
      }
    });
    // 赋值
    Object.assign(formData, tmpData);
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
  const isUpdate = !!formData.id;

  try {
    const res = await saveOrUpdate(formData, isUpdate);
    if (res.success) {
      createMessage.success(res.message);
      emit('ok');
    } else {
      createMessage.warning(res.message);
    }
  } finally {
    confirmLoading.value = false;
  }
}

onMounted(() => {
  initDictConfig();
});

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
