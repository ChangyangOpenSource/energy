<!-- components/OrganizeInventoryForm.vue -->
<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer :disabled="disabled">
      <template #detail>
        <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol" name="OrganizeInventoryForm" :rules="validatorRules">
          <a-row>
            <a-col :span="24">
              <a-form-item :label="t('carbon.message.Accounting_entity')" v-bind="validateInfos.targetId" name="targetId">
                <j-select-dept v-model:value="formData.targetId" :multiple="false"></j-select-dept>
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item :label="t('carbon.message.Accounting_standard')" v-bind="validateInfos.standardId" name="standardId">
                <a-select
                    v-model:value="formData.standardId"
                    :placeholder="t('carbon.message.Please_select')"
                    allow-clear
                    :options="standardOptions"
                    @change="handleStandardChange"
                />
              </a-form-item>
            </a-col>

            <a-col :span="24" v-if="formData.standardId">
              <a-form-item :label="t('carbon.message.Template_name')" v-bind="validateInfos.templateId" name="templateId">
                <a-select
                    v-model:value="formData.templateId"
                    :placeholder="t('carbon.message.Please_select')"
                    allow-clear
                    :options="templateOptions"
                />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item :label="`${t('carbon.message.Accounting_date')}`" v-bind="validateInfos.year" name="year">
                <a-date-picker
                    v-model:value="formData.year"
                    :format="monthFormat"
                    :value-format="monthFormat"
                    mode="year"
                    :open="yearOpen"
                    @panelChange="handlePanelChange"
                    @openChange="handleOpenChange"
                />
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
import { useMessage } from '/@/hooks/web/useMessage';
import { Form } from 'ant-design-vue';
import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
import { loadStandardTree, getOrgTemplateList } from '../OrganizeInventory.api';
import dayjs from 'dayjs';
import { createNewInventory } from '../OrganizeInventory.api';
import {useI18n} from '/@/hooks/web/useI18n';
import JSelectDept from "@/components/Form/src/jeecg/components/JSelectDept.vue";
const { t } = useI18n();

const props = defineProps({
  formDisabled: { type: Boolean, default: false },
  formData: { type: Object, default: () => ({})},
  formBpm: { type: Boolean, default: true }
});

const formRef = ref();
const useForm = Form.useForm;
const emit = defineEmits(['register', 'ok']);
const { createMessage } = useMessage();

const formData = reactive<Record<string, any>>({
  id: '',
  targetId: undefined,
  standardId: undefined,
  templateId: undefined,
  year: undefined,
});

const labelCol = ref<any>({ xs: { span: 24 }, sm: { span: 5 } });
const wrapperCol = ref<any>({ xs: { span: 24 }, sm: { span: 16 } });
const confirmLoading = ref<boolean>(false);
const monthFormat = ref<string>("YYYY");
const yearOpen = ref<boolean>(false);

const standardOptions = ref<any[]>([]);
const templateOptions = ref<any[]>([]);

// 表单验证规则
const validatorRules = {
  targetId: [{ required: true, message: t('carbon.message.please_select_accounting_entity'), trigger: "blur" }],
  standardId: [{ required: true, message: t('carbon.message.please_select_accounting_standard'), trigger: "blur" }],
  year: [{ required: true, message: t('carbon.message.please_select_accounting_time'), trigger: "blur" }],
};

const { resetFields, validate, validateInfos } = useForm(formData, validatorRules, { immediate: false });

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

// 生命周期
onMounted(() => {
  loadStandards();
});

/**
 * 加载核算标准数据
 */
function loadStandards() {
  loadStandardTree({ pcode: "A01", async: true })
      .then(res => {
        if (res.success) {
          standardOptions.value = res.result.map(item => ({
            label: item.title,
            value: item.key
          }));
        }
      });
}

/**
 * 处理核算标准变更
 */
function handleStandardChange(value) {
  if (value) {
    getOrgTemplateList({ standardId: value })
        .then(res => {
          if (res.success) {
            templateOptions.value = res.result.map(item => ({
              label: item.name,
              value: item.id
            }));
          }
        });
  } else {
    templateOptions.value = [];
    formData.templateId = undefined;
  }
}

/**
 * 处理年份面板变更
 */
function handlePanelChange(value) {
  formData.year = dayjs(value).format("YYYY");
  yearOpen.value = false;
}

/**
 * 处理年份面板开关
 */
function handleOpenChange(status) {
  yearOpen.value = status;
}

/**
 * 新增
 */
function add(selectedDeptKeys: any) {
  console.log(selectedDeptKeys)

  edit({targetId: selectedDeptKeys});
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

    // 如果有standardId，则加载模板数据
    if (formData.standardId) {
      handleStandardChange(formData.standardId);
    }
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

  // 构造提交数据
  const params = {
    standardId: formData.standardId,
    checkTargetId: formData.targetId[0],
    templateId: formData.templateId,
    year: formData.year,
  };

  await createNewInventory(params)
      .then((res) => {
        if (res.success) {
          createMessage.success('创建成功');
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
