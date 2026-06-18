<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer :disabled="disabled">
      <template #detail>
        <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol" name="CyDataManageForm">
          <a-row>
						<a-col :span="24">
							<a-form-item label="数据项名称" v-bind="validateInfos.dataItemName" id="CyDataManageForm-dataItemName" name="dataItemName">
								<a-input v-model:value="formData.dataItemName" placeholder="请输入数据项名称"  allow-clear ></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="24">
              <a-form-item label="单位" v-bind="validateInfos.unitId">
                <UnitCascader :unitId="formData.unitId" v-model:value="formData.unitId" @change="(value, label) => onChangeDenominatorUnitId(value, label)"  ></UnitCascader>
              </a-form-item>
						</a-col>

						<a-col :span="24">
							<a-form-item label="数据填报方式" v-bind="validateInfos.dataFillInType" id="CyDataManageForm-dataFillInType" name="dataFillInType">
                <a-radio-group :default-value="'1'" v-model:value="formData.dataFillInType">
                  <a-radio
                    v-for="(item, index) in dataFillInType"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.text }}
                  </a-radio>
                </a-radio-group>
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item label="数据采集方式" v-bind="validateInfos.dataGetType" id="CyDataManageForm-dataGetType" name="dataGetType">
                <a-radio-group :default-value="'1'" v-model:value="formData.dataGetType">
                  <a-radio
                    v-for="(item, index) in dataGetType"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.text }}
                  </a-radio>
                </a-radio-group>
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
  import { getDateByPicker, getValueType } from '/@/utils';
  import {dataFillInTypeDict, dataGetTypeDict, getAllUnit, saveOrUpdate} from '../CyDataManage.api';
  import { Form } from 'ant-design-vue';
  import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
  import UnitCascader from "/@/components/common/UnitCascader.vue"
  import {defHttp} from "@/utils/http/axios";
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
    unitId: undefined,
    unitName: '',
    dataFillInType: '1',
    dataGetType: '1',
  });
  const { createMessage } = useMessage();
  const labelCol = ref<any>({ xs: { span: 24 }, sm: { span: 5 } });
  const wrapperCol = ref<any>({ xs: { span: 24 }, sm: { span: 16 } });
  const confirmLoading = ref<boolean>(false);
  //表单验证
  const validatorRules = reactive({
    dataItemName: [
      {
        required: true,
        message: '请输入数据项名称',
        trigger: 'blur'
      }
    ],
    unitId: [
      {
        required: true,
        message: '请选择单位',
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
  const allUnit = ref([]);



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
  function add(year,deptId) {
    edit({
      fillInYear: year,
      departId: deptId
    });
  }

  /**
   * 单位改变事件
   */
  const onChangeDenominatorUnitId = (value) => {
    console.log('1', value)
    let theIndex = allUnit.value.findIndex(ele => ele.id == value)
    if (theIndex > -1) {
      formData.unitName = allUnit.value[theIndex].unitCode
    }
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



  // 生命周期钩子
  onMounted(() => {
    dataGetTypeDict().then(res => {
      dataGetType.value = res
    })

    dataFillInTypeDict().then(res => {
      dataFillInType.value = res
    })
    // 查询所有单位
    defHttp.get({ url: '/emission/factor/cyEmissionUnit/getAllUnit' }, { isTransformResponse: false}).then((res) => {
      if (res.success) {
        allUnit.value = res.result || []
      }
    });


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
