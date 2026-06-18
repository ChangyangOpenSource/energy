<!-- src/views/carbon/asset/modules/CyOrgAssetForm.vue -->
<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer :disabled="formDisabled">
      <template #detail>
        <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol" name="CyOrgAssetForm" :rules="validatorRules">
          <a-row>
            <a-col :span="24">
              <a-form-item :label="t('carbon.message.organization')" v-bind="validateInfos.deptId" name="deptId">
                <a-tree-select
                    :disabled="formDisabled"
                    allowClear
                    style="width: 100%"
                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                    :placeholder="t('carbon.message.pleaseSelectDept')"
                    v-model:value="formData.deptId"
                    :treeData="deptTreeData"
                    treeDefaultExpandAll
                    :filterTreeNode="filterDeptNode"
                    @change="handleDeptChange"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item :label="t('carbon.message.time')" v-bind="validateInfos.year" name="year">
                <a-date-picker
                    v-model:value="formData.year"
                    :format="monthFormat"
                    :value-format="monthFormat"
                    mode="year"
                    :open="yearOpen"
                    @panelChange="handlePanelChange"
                    @openChange="handleOpenChange"
                    style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item :label="t('carbon.message.revenue')" v-bind="validateInfos.revenue" name="revenue">
                <a-input-number v-model:value="formData.revenue" :placeholder="t('carbon.message.Please_enter')" style="width: 100%" addon-after="万元"/>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item :label="t('carbon.message.output')" v-bind="validateInfos.harvest" name="harvest">
                <a-input-number v-model:value="formData.harvest" :placeholder="t('carbon.message.Please_enter')" style="width: 100%" addon-after="t"/>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item :label="t('carbon.message.EmployeeCount')" v-bind="validateInfos.employeeCount" name="employeeCount">
                <a-input-number v-model:value="formData.employeeCount" :placeholder="t('carbon.message.Please_enter')" style="width: 100%" addon-after="人"/>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item :label="t('carbon.message.FloorArea')" v-bind="validateInfos.floorArea" name="floorArea">
                <a-input-number v-model:value="formData.floorArea" :placeholder="t('carbon.message.Please_enter')" style="width: 100%" addon-after="m³"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
    </JFormContainer>
  </a-spin>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch, defineProps, defineEmits, nextTick } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { Form } from 'ant-design-vue';
import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
import { saveOrUpdate, queryOrgDepartTreeList } from '../Asset.api';
import dayjs from 'dayjs';
import { useMessage } from '/@/hooks/web/useMessage';
const { createMessage } = useMessage();
const monthFormat = ref<string>("YYYY");
const { t } = useI18n();
const props = defineProps({
  formDisabled: { type: Boolean, default: false },
  formDataProp: { type: Object, default: () => ({}) },
  defaultDeptId: { type: String, default: '' }
});

const emit = defineEmits(['register', 'ok']);

const formRef = ref();
const useForm = Form.useForm;
const yearOpen = ref<boolean>(false);

const formData = reactive<Record<string, any>>({
  id: '',
  deptId: '',
  year: undefined,
  revenue: undefined,
  harvest: undefined,
  employeeCount: undefined,
  floorArea: undefined,
});

const deptTreeData = ref<any[]>([]);

const labelCol = ref<any>({ xs: { span: 24 }, sm: { span: 5 } });
const wrapperCol = ref<any>({ xs: { span: 24 }, sm: { span: 16 } });
const confirmLoading = ref<boolean>(false);

// 表单验证
const validatorRules = {
  year: [
    { required: true, message: t('carbon.message.please_select_date'), trigger: 'change' }
  ],
  deptId: [
    { required: true, message: t('carbon.message.please_select_organization'), trigger: 'change' }
  ],
  revenue: [
    { required: true, message: t('carbon.message.please_enter_revenue'), trigger: 'change' }
  ],
  harvest: [
    { required: true, message: t('carbon.message.please_enter_output'), trigger: 'change' }
  ],
  employeeCount: [
    { required: true, message: t('carbon.message.please_enter_employeeCount'), trigger: 'change' }
  ],
  floorArea: [
    { required: true, message: t('carbon.message.please_enter_floorArea'), trigger: 'change' }
  ]
};

const { resetFields, validate, validateInfos } = useForm(formData, validatorRules, { immediate: false });

// 表单禁用
const formDisabled = computed(() => {
  return props.formDisabled;
});

/**
 * 监听外部传入的defaultDeptId变化
 */
watch(
    () => props.defaultDeptId,
    (val) => {
      if (val) {
        formData.deptId = val;
      }
    },
    { immediate: true }
);

/**
 * 加载部门树形数据
 */
async function loadDeptTree() {
  try {
    const res = await queryOrgDepartTreeList();
    if (res.success) {
      deptTreeData.value = convertToTreeData(res.result);
    }
  } catch (error) {
    console.error('加载部门树失败', error);
  }
}

/**
 * 转换部门数据为树形选择器格式
 */
function convertToTreeData(data: any[]) {
  return data.map(item => ({
    title: item.departName,
    value: item.id,
    key: item.id,
    children: item.children ? convertToTreeData(item.children) : []
  }));
}

/**
 * 部门搜索过滤方法
 */
function filterDeptNode(inputValue: string, treeNode: any) {
  if (!inputValue) return true;
  return treeNode.title.toLowerCase().includes(inputValue.toLowerCase());
}

/**
 * 部门选择变化处理
 */
function handleDeptChange(value: string) {
  formData.deptId = value;
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
function edit(record: any) {
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
      if (firstField && formRef.value) {
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
      emit('ok');
    }else {
      createMessage.error(res.message);
      console.log(res.message)
    }
  } finally {
    confirmLoading.value = false;
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

onMounted(() => {
  loadDeptTree();
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
