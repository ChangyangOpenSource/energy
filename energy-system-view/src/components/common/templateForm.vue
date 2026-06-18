<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form
          ref="formRef"
          :model="model"
          :rules="validatorRules"
          slot="detail"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item :label="t('carbon.message.template_name')" :labelCol="labelCol" :wrapperCol="wrapperCol" name="name">
              <a-input v-model:value="model.name" :placeholder="t('carbon.message.template_name')"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :label="t('carbon.message.Accounting_standard')" :labelCol="labelCol" :wrapperCol="wrapperCol" name="standardId">
              <a-select :disabled="model.checkId" v-model:value="model.standardId" :placeholder="t('carbon.message.Please_select')" allow-clear>
                <a-select-option v-for="province in provinceData" :key="province.key" :value="province.key">
                  {{ province.title }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :label="t('carbon.message.industry')" :labelCol="labelCol" :wrapperCol="wrapperCol" name="profession">
              <a-select v-model:value="model.profession" :placeholder="t('carbon.message.Please_select')" allow-clear>
                <a-select-option v-for="profession in professionData" :key="profession.key" :value="profession.key">
                  {{ profession.title }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
  </a-spin>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { loadTreeRoot, addTemplate, editTemplate } from './api/templateForm.api.ts';

// Props
const props = defineProps({
  //表单禁用
  disabled: {
    type: Boolean,
    default: false
  }
});

// 国际化和消息
const { t } = useI18n();
const { createMessage } = useMessage();

// Refs
const formRef = ref<any>(null);

// Reactive data
const model = reactive<any>({
  name: '',
  standardId: undefined,
  profession: undefined,
  checkId: undefined
});

const provinceData = ref<any[]>([]);
const professionData = ref<any[]>([]);
const confirmLoading = ref(false);
const modelDefault = ref<any>({});

const labelCol = {
  xs: { span: 24 },
  sm: { span: 5 },
};

const wrapperCol = {
  xs: { span: 24 },
  sm: { span: 16 },
};

const validatorRules = {
  name: [
    { required: true, message: t('carbon.message.Please_enter_template_name') },
  ],
  standardId: [
    { required: true, message: t('carbon.message.please_select_accounting_standard') },
  ],
};

// Computed
const formDisabled = computed(() => props.disabled);

// Methods
const initDictConfig = () => {
  console.log("initDictConfig")
  // 加载核算标准数据
  loadTreeRoot({
    pcode: "A01",
    async: true,
  }).then((res) => {
    if (res.success) {
      provinceData.value = res.result;
    }
  });

  // 加载行业数据
  loadTreeRoot({
    pcode: "A04",
    async: true,
  }).then((res) => {
    if (res.success) {
      professionData.value = res.result;
    }
  });
};

const add = () => {
  edit(modelDefault.value);
};

const edit = (record: any) => {
  Object.assign(model, record);
};

const submitForm = () => {
  formRef.value?.validate().then(() => {
    confirmLoading.value = true;

    let requestPromise;
    if (!model.id) {
      requestPromise = addTemplate(model);
    } else {
      requestPromise = editTemplate(model);
    }

    requestPromise.then((res) => {
      if (res.success) {
        createMessage.success(res.message);
        emit('ok');
      } else {
        createMessage.warning(res.message);
      }
    }).finally(() => {
      confirmLoading.value = false;
    });
  }).catch(() => {
    // Validation failed
  });
};

// Lifecycle
onMounted(() => {
  // 备份model原始值
  modelDefault.value = JSON.parse(JSON.stringify(model));
  initDictConfig();
});

// Emits
const emit = defineEmits(['ok']);

// Expose methods
defineExpose({
  add,
  edit,
  submitForm
});
</script>
