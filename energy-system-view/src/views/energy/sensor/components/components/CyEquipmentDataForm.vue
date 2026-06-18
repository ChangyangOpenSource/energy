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
              <a-form-item label="数据点类型" v-bind="validateInfos.dataType" id="CyDataForm-dataType" name="dataType">
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
            <a-col :span="24">
              <a-form-item v-bind="validateInfos.formula" id="CyDataForm-formula"
                           name="formula" v-if="formData.dataType != 3">
                <template #label>
                  <span style="display: inline-flex; align-items: center;">
                    计算公式
                    <a-tooltip v-if="formData.dataType == 1" title="通过计算公式可调整设备测量值的倍率 例如,实际值为测量值的3倍,则计算公式喂 a x 3">
                      <ExclamationCircleOutlined style="margin-left: 4px; font-size: 14px;"/>
                    </a-tooltip>
                  </span>
                </template>
                <a-input v-model:value="formData.formula" placeholder="请输入计算公式"
                         allow-clear></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <div v-if="formData.dataType == 2">
            <a-table :columns="meterDatasColumns" :data-source="formData.datas" :pagination="false">
              <template #bodyCell="{ column, record, index}">
                <template v-if="column.key === 'equipmentId'">
                  <a-select
                    style="width: 100%"
                    v-model:value="record.equipmentId"
                    :options="sensors"
                    :field-names="{ label: 'name', value: 'id', options: 'children' }"
                    @change="changeEquipment(record)"
                    placeholder="请选择传感器"
                    allow-clear
                    show-search
                    :option-filter-prop="'name'"
                  >
                  </a-select>
                </template>
                <template v-if="column.key === 'dataId'">
                  <a-select
                    style="width: 100%"
                    v-model:value="formData.datas[index].dataId"
                    :options="record.dataList"
                    :field-names="{ label: 'dataName', value: 'id', options: 'children' }"
                    @change="changeData(record)"
                    placeholder="请选择数据点"
                    allow-clear
                    show-search
                    :option-filter-prop="'dataName'"
                  >
                  </a-select>
                </template>
                <template v-if="column.key === 'action'">
                  <span>
                    <a @click="deleteProtocolData(record, index)">删除</a>
                  </span>
                </template>
              </template>
            </a-table>
            <a-button type="primary" @click="addProtocolData()">添加变量</a-button>
          </div>
        </a-form>
      </template>
    </JFormContainer>
  </a-spin>
</template>

<script lang="ts" setup>
import {defineComponent, ref, reactive, defineExpose, nextTick, defineProps, computed} from 'vue';
import {useMessage} from '/@/hooks/web/useMessage';
import {addData, getDatas, list} from '../../../protocol/components/CyProtocolData.api';
import {Form} from 'ant-design-vue';
import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
import {ExclamationCircleOutlined, PlusOutlined} from '@ant-design/icons-vue';
import JDictSelectTag from "@/components/Form/src/jeecg/components/JDictSelectTag.vue";
import form from "@/views/demo/form/index.vue";
import {
  detailListByIds,
  detailListByType,
  equipmentList
} from "@/views/energy/meter/CyEquipment.api";
import {listByEquipmentId} from "@/views/energy/meter/components/CyEquipmentData.api";
import {getDictItems} from "@/api/common/api";

const props = defineProps({
  equipmentTypeId: String
});
const formRef = ref();
const formDataRecord = ref(''); //计量表的
const datas = ref([]); //基础数据点
const dataTypes = ref([]); //数据点类型 字典
const sensors = ref([]); //计量表列表
const name = ref();
const inputRef = ref();
const useForm = Form.useForm;
const emit = defineEmits(['register', 'ok']);
const formData = ref({
  id: '',
  dataId: undefined,
  dataName: '',
  dataType: '2',
  unit: '',
  formula: undefined,
  protocolId: '',
  type: '',
  datas: [{
    name: "a1",
    equipmentId: undefined,
    dataId: undefined,
    unit: undefined,
    dataList: [],
  }],
});
const {createMessage} = useMessage();
const labelCol = ref<any>({xs: {span: 24}, sm: {span: 5}});
const wrapperCol = ref<any>({xs: {span: 24}, sm: {span: 16}});
const confirmLoading = ref<boolean>(false);
//表单验证
const validatorRules = computed(() => {
  const baseRules = {
    dataId: [{required: true, message: '请选择数据点'}],
    dataType: [{required: true, message: '请选择数据点类型'}],
    unit: [{required: true, message: '请输入单位'}]
  };

  if (formData.value.dataType != 3) {
    baseRules.formula =  [{required: true, message: '请输入计算公式'}]
  }
  return baseRules;
})

const {
  resetFields,
  validate,
  validateInfos
} = useForm(formData, validatorRules, {immediate: false});

//添加变量的下标
const index = ref(1);
const meterDatasColumns = [
  {
    title: '变量名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '计量表',
    dataIndex: 'equipmentId',
    key: 'equipmentId',
  },
  {
    title: '数据点',
    dataIndex: 'dataId',
    key: 'dataId',
  },
  {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    customRender: ({text}) => {
      if (text == 1) {
        return '瞬时'
      } else if (text == 2) {
        return '累计'
      }
    }
  },
  {
    title: '操作',
    key: 'action',
  },
];


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
 * 选择数据点 回显名称
 */
function changeBaseData() {
  formData.value.dataName = datas.value.filter(item => item.id === formData.value.dataId)[0].name
}

/**
 * 更换数据点类型
 */
function changeDataType() {
  if (formData.value.dataType == 2) {
    index.value = 1
    formData.value.datas = [{
      name: "a1",
      equipmentId: undefined,
      dataId: undefined,
      unit: undefined,
      dataList: [],
    }]
  } else {
    formData.value.datas = []
  }
  formData.value.formula = undefined
}

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
  console.log('addItemName', param);
  addData(param).then((res) => {
    name.value = undefined
    initBaseDatas()
    setTimeout(() => {
      inputRef.value?.focus();
    }, 0);
  })
};

/**
 * 添加变量
 */
function addProtocolData() {
  index.value = index.value + 1
  formData.value.datas.push({
    name: "a" + index.value,
    equipmentId: undefined,
    dataId: undefined,
    unit: undefined
  })
}

/**
 * 添加变量
 */
function deleteProtocolData(record, index) {
  formData.value.datas.splice(index, 1);
}

/**
 * 选择数据点 回显单位
 */
function changeData(record) {
  record.unit = record.dataList.filter(item => item.id === record.dataId)[0].unit
  record.type = record.dataList.filter(item => item.id === record.dataId)[0].type
}

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
        dataType: '2',
        unit: '',
        formula: '',
        protocolId: '',
        type: '',
        datas: [{
          name: "a1",
          equipmentId: undefined,
          dataId: undefined,
          unit: undefined,
          dataList: [],
        }],
      }
    }
    if (record.datas) {
      //x变量名称的参数
      index.value = record.datas.length
    } else {
      index.value = 1
    }
    initBaseDatas()
    initEquipment()
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
 * 获取设备以及设备下数据点
 */
function initEquipment() {
  // detailListByType({type: 2}).then((res) => {
  //   Object.assign(sensors.value, res);
  //   formData.value.datas.forEach(item => {
  //     if (item.equipmentId) {
  //       item.dataList = sensors.value.filter(item2 => item2.id == item.equipmentId)[0].dataList;
  //     }
  //   })
  // });

  detailListByIds({ids: formDataRecord.value.id}).then((res) => {
    Object.assign(sensors.value, res);
    formData.value.datas.forEach(item => {
      item.dataList = sensors.value.filter(item2 => item2.id == item.equipmentId)[0].dataList;
    })
  })
}

/**
 * 更换设备 将dataList放到formData里
 */
function changeEquipment(record) {
  record.dataList = sensors.value.filter(item => item.id === record.equipmentId)[0].dataList;
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

  // 检查 type 是否一致
  const types = formData.value.datas.map(item => String(item.type));
  const uniqueTypes = [...new Set(types)];

  if (uniqueTypes.length > 1) {
    createMessage.error('数据点类型必须相同！');
    return
  }
  formData.value.type = uniqueTypes[0]

  formData.value.dataTypeName = '运算数据'
  emit('ok', formData.value);
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
