<!-- src/views/carbon/activitie/modules/CyOrgActivitieForm.vue -->
<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer :disabled="disabled">
      <template #detail>
        <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol"
                name="CyOrgActivitieForm" :rules="validatorRules">
          <a-row>
            <a-col :span="24">
              <a-form-item :label="t('carbon.message.facilities_activities')" v-bind="validateInfos.name"
                           name="name">
                <a-input v-model:value="formData.name" :placeholder="t('carbon.message.Please_enter')" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
    </JFormContainer>
  </a-spin>
</template>

<script lang="ts" setup>
import { ref, reactive, defineExpose, nextTick } from 'vue';
import { Form } from 'ant-design-vue';
import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
import { saveOrUpdate, queryById } from '../activitie.api';
import {useI18n} from "@/hooks/web/useI18n";
const { t } = useI18n();

const props = defineProps({
  formDisabled: { type: Boolean, default: false },
});

const formRef = ref();
const useForm = Form.useForm;
const emit = defineEmits(['register', 'ok']);

const formData = reactive({
  id: '',
  name: '',
});

const labelCol = { xs: { span: 24 }, sm: { span: 5 } };
const wrapperCol = { xs: { span: 24 }, sm: { span: 16 } };
const confirmLoading = ref<boolean>(false);

// 表单验证规则
const validatorRules = {
  name: [{ required: true, message: '请输入活动设施名称' }]
};

const { resetFields, validate, validateInfos } = useForm(formData, validatorRules, { immediate: false });

// 表单禁用
const disabled = ref<boolean>(false);

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
    if (record.id) {
      queryById({ id: record.id }).then(res => {
        Object.assign(formData, res);
      });
    } else {
      Object.assign(formData, record);
    }
  });
}

/**
 * 提交数据
 */
async function submitForm() {
  try {
    await validate();
  } catch (error) {
    return Promise.reject(error);
  }

  confirmLoading.value = true;
  const isUpdate = !!formData.id;

  console.log(11111111111)
  await saveOrUpdate(formData, isUpdate)
    .then((res) => {
      console.log(22222222)
      console.log(res)
      if (res.success) {
        console.log(3333333)
        emit('ok');
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
