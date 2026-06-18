<template>
  <a-spin :spinning="confirmLoading">
    <div style="display: flex; height: 100vh;">
      <!-- 左侧区域 -->
      <div style="width: 20%; padding: 20px; background-color: white;">

        <a-tabs v-model:activeKey="activeKey" tab-position="left">
          <a-tab-pane v-if="currentRecord.dataFillInType === '2'" key="1" tab="一月值"></a-tab-pane>
          <a-tab-pane v-if="currentRecord.dataFillInType === '2'" key="2" tab="二月值"></a-tab-pane>
          <a-tab-pane v-if="currentRecord.dataFillInType === '2'" key="3" tab="三月值"></a-tab-pane>
          <a-tab-pane v-if="currentRecord.dataFillInType === '2'" key="4" tab="四月值"></a-tab-pane>
          <a-tab-pane v-if="currentRecord.dataFillInType === '2'"  key="5" tab="五月值"></a-tab-pane>
          <a-tab-pane v-if="currentRecord.dataFillInType === '2'" key="6" tab="六月值"></a-tab-pane>
          <a-tab-pane v-if="currentRecord.dataFillInType === '2'" key="7" tab="七月值"></a-tab-pane>
          <a-tab-pane v-if="currentRecord.dataFillInType === '2'" key="8" tab="八月值"></a-tab-pane>
          <a-tab-pane v-if="currentRecord.dataFillInType === '2'" key="9" tab="九月值"></a-tab-pane>
          <a-tab-pane v-if="currentRecord.dataFillInType === '2'" key="10" tab="十月值"></a-tab-pane>
          <a-tab-pane v-if="currentRecord.dataFillInType === '2'" key="11" tab="十一月值"></a-tab-pane>
          <a-tab-pane v-if="currentRecord.dataFillInType === '2'" key="12" tab="十二月值"></a-tab-pane>
          <a-tab-pane v-if="currentRecord.dataFillInType === '1'" key="13" tab="年度值"></a-tab-pane>
        </a-tabs>
      </div>

      <!-- 右侧区域 -->
      <div style="width: 80%; padding: 20px; background-color: white;">
        <JUpload v-if="activeKey === '1'"  v-model:value="currentRecord.januaryValueAttechment" :number="3"></JUpload>
        <JUpload v-if="activeKey === '2'" v-model:value="currentRecord.februaryValueAttechment" :number="3"></JUpload>
        <JUpload v-if="activeKey === '3'" v-model:value="currentRecord.marchValueAttechment" :number="3"></JUpload>
        <JUpload v-if="activeKey === '4'" v-model:value="currentRecord.aprilValueAttechment" :number="3"></JUpload>
        <JUpload v-if="activeKey === '5'" v-model:value="currentRecord.mayValueAttechment" :number="3"></JUpload>
        <JUpload v-if="activeKey === '6'" v-model:value="currentRecord.juneValueAttechment" :number="3"></JUpload>
        <JUpload v-if="activeKey === '7'" v-model:value="currentRecord.julyValueAttechment" :number="3"></JUpload>
        <JUpload v-if="activeKey === '8'" v-model:value="currentRecord.augustValueAttechment" :number="3"></JUpload>
        <JUpload v-if="activeKey === '9'" v-model:value="currentRecord.septemberValueAttechment" :number="3"></JUpload>
        <JUpload v-if="activeKey === '10'" v-model:value="currentRecord.octoberValueAttechment" :number="3"></JUpload>
        <JUpload v-if="activeKey === '11'" v-model:value="currentRecord.novemberValueAttechment" :number="3"></JUpload>
        <JUpload v-if="activeKey === '12'" v-model:value="currentRecord.decemberValueAttechment" :number="3"></JUpload>
        <JUpload v-if="activeKey === '13'" v-model:value="currentRecord.annualValueAttechment" :number="3"></JUpload>
      </div>
    </div>
  </a-spin>
</template>

<script lang="ts" setup>
import { ref, reactive, defineExpose, nextTick, defineProps, computed, onMounted } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { getDateByPicker, getValueType } from '/@/utils';
import {dataFillInTypeDict, dataGetTypeDict, getAllUnit, saveOrUpdate} from '../CyDataManage.api';
import { Form } from 'ant-design-vue';
import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
import UnitCascader from "@/components/common/UnitCascader.vue";
import JUpload from "../../../../components/Form/src/jeecg/components/JUpload/JUpload.vue";
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
  orgCode: '',
  departId: '',
  fillInYear: '',
  dataItemName: '',
  unitId: '',
  unitName: '',
  dataFillInType: '1',
  dataGetType: '1',
});
const { createMessage } = useMessage();
const labelCol = ref<any>({ xs: { span: 24 }, sm: { span: 5 } });
const wrapperCol = ref<any>({ xs: { span: 24 }, sm: { span: 16 } });
const confirmLoading = ref<boolean>(false);
const currentRecord = ref({});
const activeKey = ref();

//表单验证
const validatorRules = reactive({
  dataItemName: [
    {
      required: true,
      message: '请输入数据项名称',
      trigger: 'blur'
    }
  ]
});
const { resetFields, validate, validateInfos } = useForm(formData, validatorRules, { immediate: false });
//日期个性化选择
const fieldPickers = reactive({
});
const dataGetType = ref([]);
const dataFillInType = ref([]);
const getAllUnitByGroupData = ref([]);


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


/**
 * 新增
 */
function add(record) {
  currentRecord.value = record;

  if(currentRecord.value.dataFillInType === "1"){
    activeKey.value = '1';
  }else{
    activeKey.value = '13';
  }
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
      if(record.hasOwnProperty(key)){
        tmpData[key] = record[key]
      }
    })
    //赋值
    Object.assign(formData, tmpData);
  });
}

/**
 * 提交数据
 */
async function submitForm() {
  confirmLoading.value = true;
  saveOrUpdate(currentRecord.value, true).then(res =>{
    if(res.success){
      createMessage.success(res.message);
      emit('ok');
    }else{
      createMessage.error(res.message);
    }
  }).finally(() => {
    confirmLoading.value = false;
  });
}



// 生命周期钩子
onMounted(() => {
  dataGetTypeDict().then(res => {
    dataGetType.value = res
  })

  dataFillInTypeDict().then(res => {
    dataFillInType.value = res
  })

  getAllUnit().then(res => {
    getAllUnitByGroupData.value = res.result || {}
  })


})


defineExpose({
  add,
  edit,
  submitForm,
  formData
});
</script>

<style lang="less" scoped>
.antd-modal-form {
  padding: 14px 20px;
}
</style>
