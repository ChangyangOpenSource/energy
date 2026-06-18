<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer>
      <template #detail>
        <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol"
                name="CyDataForm" :ruler="validatorRules">
          <a-row>
            <a-col :span="24">
              <a-form-item label="数据点名称" v-bind="validateInfos.dataId" id="CyDataForm-dataId"
                           name="dataName">
                <a-select
                  v-model:value="formData.dataId"
                  placeholder="请选择数据点"
                  style="width: 300px"
                  :options="datas"
                  :field-names="{ label: 'name', value: 'id', options: 'children' }"
                  @change="changeBaseData"
                  show-search
                  :option-filter-prop="'name'"
                >
                  <template #dropdownRender="{ menuNode: menu }">
                    <v-nodes :vnodes="menu"/>
                    <a-divider style="margin: 4px 0"/>
                    <a-space style="padding: 4px 8px">
                      <a-input ref="inputRef" v-model:value="name" placeholder="添加数据点"/>
                      <a-button type="text" @click="addItemName">
                        <template #icon>
                          <plus-outlined/>
                        </template>
                        添加数据点
                      </a-button>
                    </a-space>
                  </template>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="数据点类型" v-bind="validateInfos.dataType"
                           id="CyDataForm-dataType" name="dataType">
                <a-radio-group v-model:value="formData.dataType">
                  <template v-for="item in dataTypes" :key="`${item.value}`">
                    <a-radio :value="item.value" :disabled="item.value != formData.dataType">
                      {{ item.label }}
                    </a-radio>
                  </template>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="单位" v-bind="validateInfos.unit" id="CyDataForm-unit"
                           name="unit">
                <a-input v-model:value="formData.unit" placeholder="请输入单位"
                         allow-clear></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
    </JFormContainer>
  </a-spin>
</template>

<script lang="ts" setup>
import {defineComponent, ref, reactive, defineExpose, nextTick, defineProps} from 'vue';
import {useMessage} from '/@/hooks/web/useMessage';
import {addData, getDatas, list} from '../../../protocol/components/CyProtocolData.api';
import {Form} from 'ant-design-vue';
import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
import {PlusOutlined} from '@ant-design/icons-vue';
import JDictSelectTag from "@/components/Form/src/jeecg/components/JDictSelectTag.vue";
import {saveOrUpdate} from "@/views/energy/meter/components/CyEquipmentData.api";
import {getDictItems} from "@/api/common/api";

const formRef = ref();
const datas = ref([]); //基础数据点
const dataTypes = ref([]); //字典 数据点类型
const formDataRecord = ref(''); //计量表的
const name = ref();
const inputRef = ref();
const useForm = Form.useForm;
const emit = defineEmits(['register', 'ok']);
const props = defineProps({
  equipmentTypeId: String
});
const formData = ref({
  id: '',
  dataId: undefined,
  dataName: '',
  dataType: '3',
  type: '',
  unit: '',
  formula: '',
});
const {createMessage} = useMessage();
const labelCol = ref<any>({xs: {span: 24}, sm: {span: 5}});
const wrapperCol = ref<any>({xs: {span: 24}, sm: {span: 16}});
const confirmLoading = ref<boolean>(false);
//表单验证
const validatorRules = {
  dataId: [{required: true, message: '请选择数据点'}],
  dataType: [{required: true, message: '请选择数据点类型'}],
  unit: [{required: true, message: '请输入单位'}],
}
const {
  resetFields,
  validate,
  validateInfos
} = useForm(formData, validatorRules, {immediate: false});
//日期个性化选择
const fieldPickers = reactive({});


const VNodes = defineComponent({
  props: {
    vnodes: {
      type: Object,
      required: true,
    },
  },
  render() {
    return this.vnodes;
  },
});

/**
 * 点击添加数据点
 * @param e
 */
const addItemName = e => {
  e.preventDefault();
  let param = {
    name: name.value,
    equipmentTypeId: props.equipmentTypeId
  }
  addData(param).then((res) => {
    name.value = undefined
    initBaseDatas()
    setTimeout(() => {
      inputRef.value?.focus();
    }, 0);
  })
};

/**
 * 获取数据点类型
 */
function getDataTypes() {
  getDictItems("data_type").then((res) => {
    dataTypes.value = res
  })
}

/**
 * 新增
 */
function add(formRecord) {
  edit({}, formRecord);
}

/**
 * 编辑
 */
function edit(record, formRecord) {
  formDataRecord.value = formRecord
  nextTick(() => {
    resetFields();
    getDataTypes();
    if (Object.keys(record).length > 0) {
      //赋值
      formData.value = JSON.parse(JSON.stringify(record))
    } else {
      formData.value = {
        id: '',
        dataId: undefined,
        dataName: '',
        dataType: '3',
        unit: '',
        formula: '',
        protocolId: '',
        type: '',
      }
    }
    initBaseDatas()
  });
}

/**
 * 获取数据点
 */
function initBaseDatas() {
  getDatas({equipmentTypeId: props.equipmentTypeId, pageSize: -1}).then((res) => {
    Object.assign(datas.value, res.records);
  });
}

/**
 * 选择数据点 回显名称
 */
function changeBaseData() {
  formData.value.dataName = datas.value.filter(item => item.id === formData.value.dataId)[0].name
  formData.value.type = datas.value.filter(item => item.id === formData.value.dataId)[0].type
}

/**
 * 提交数据
 */
async function submitForm() {
  formData.value.dataTypeName = '手工录入'
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

  let param = {
    id: formDataRecord.value.id,
    equipmentCode: formDataRecord.value.equipmentCode,
    type: formDataRecord.value.type,
    meterType: formDataRecord.value.meterType,
    dataList: [formData.value]
  }
  confirmLoading.value = false;

  saveOrUpdate(param).then((res) => {
    emit('ok');
  })
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
