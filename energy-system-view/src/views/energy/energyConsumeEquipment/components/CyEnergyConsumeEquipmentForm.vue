<template>
  <a-spin :spinning="confirmLoading">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="基础信息"></a-tab-pane>
      <a-tab-pane key="2" tab="关联计量表"></a-tab-pane>
      <a-tab-pane key="3" tab="关联传感器"></a-tab-pane>
      <a-tab-pane key="4" tab="关联参数"></a-tab-pane>
    </a-tabs>
    <JFormContainer :disabled="disabled">
      <template #detail>
        <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol"
                name="CyEnergyConsumeEquipmentForm" :rules="validatorRules">
          <div v-if="activeKey == 1">
            <a-row>
              <a-col :span="24">
                <a-form-item label="设备名称" v-bind="validateInfos.energyConsumeEquipmentName"
                             id="CyEnergyConsumeEquipmentForm-energyConsumeEquipmentName"
                             name="energyConsumeEquipmentName">
                  <a-input v-model:value="formData.energyConsumeEquipmentName"
                           placeholder="请输入设备名称" allow-clear></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="设备编码" v-bind="validateInfos.energyConsumeEquipmentCode"
                             id="CyEnergyConsumeEquipmentForm-energyConsumeEquipmentCode"
                             name="energyConsumeEquipmentCode">
                  <a-input v-model:value="formData.energyConsumeEquipmentCode"
                           placeholder="请输入设备编码" allow-clear></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="设备类型" v-bind="validateInfos.energyConsumeEquipmentTypeId"
                             id="CyEnergyConsumeEquipmentForm-energyConsumeEquipmentTypeId"
                             name="energyConsumeEquipmentTypeId">
                  <a-select
                    v-model:value="formData.energyConsumeEquipmentTypeId"
                    :options="energyConsumeEquipmentTypes"
                    :field-names="{ label: 'name', value: 'id'}"
                    placeholder="请选择设备类型"
                    @change="changeEnergyConsumeEquipmentType"
                    allow-clear>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="品牌" v-bind="validateInfos.brandId" id="CyEnergyConsumeEquipmentForm-brandId"
                             name="brandId">
                  <a-select
                    v-model:value="formData.brandId"
                    :options="brands"
                    :field-names="{ label: 'brandName', value: 'id', options: 'children' }"
                    placeholder="请选择品牌"
                    allow-clear
                    @change="getModels"
                  >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="型号" v-bind="validateInfos.modelId" id="CyEnergyConsumeEquipmentForm-modelId" name="modelId">
                  <a-select
                    v-model:value="formData.modelId"
                    :options="models"
                    :field-names="{ label: 'modelName', value: 'id', options: 'children' }"
                    placeholder="请选择品牌型号"
                    allow-clear>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="关联场站" v-bind="validateInfos.stationId"
                             id="CyEnergyConsumeEquipmentForm-stationId" name="stationId">
                  <select-station-no-clear v-model:value="formData.stationId" :disabled="true"></select-station-no-clear>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="安装位置" v-bind="validateInfos.position"
                             id="CyEnergyConsumeEquipmentForm-position" name="position">
                  <a-input v-model:value="formData.position" placeholder="请输入安装位置"
                           allow-clear></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="组态图" v-bind="validateInfos.diagram"
                             id="CyEnergyConsumeEquipmentForm-diagram" name="diagram">
                  <j-image-upload v-model:value="formData.diagram" text="上传svg图" :uploadUrl="uploadSvg"></j-image-upload>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <div v-show="activeKey == 2">
            <a-button @click="addEquipment(1)" type="primary">添加计量表</a-button>
            <a-table :columns="meterColumns" :data-source="formData.meters" :pagination="false" style="margin-top: 8px">
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'action'">
                    <span>
                      <a @click="handleEditEquipment(record, index)">编辑</a>
                      <a-divider type="vertical"/>
                      <a @click="handleDeleteEquipment(formData.meters, index, record)">删除</a>
                    </span>
                </template>
              </template>
            </a-table>
          </div>
          <div v-show="activeKey == 3">
            <a-button @click="addEquipment(2)" type="primary">添加传感器</a-button>
            <a-table :columns="sensorColumns" :data-source="formData.sensors" :pagination="false" style="margin-top: 8px">
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'action'">
                    <span>
                      <a @click="handleEditEquipment(record, index)">编辑</a>
                      <a-divider type="vertical"/>
                      <a @click="handleDeleteEquipment(formData.sensors, index, record)">删除</a>
                    </span>
                </template>
              </template>
            </a-table>
          </div>
          <div v-show="activeKey == 4">
            <a-table :columns="paramColumns" :data-source="formData.params" :pagination="false">
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'action'">
                    <span>
                      <a v-if="!record.status || record.status == 2"
                         @click="updateParamStatus(record, 1)">启用</a>
                      <a v-if="record.status == 1" @click="updateParamStatus(record, 2)">停用</a>
                      <a-divider type="vertical"/>
                      <a @click="handleEditParam(record, index)">编辑</a>
                    </span>
                </template>
              </template>
            </a-table>
          </div>
        </a-form>
      </template>
    </JFormContainer>
  </a-spin>

  <cy-energy-consume-equipment-relation-equipment-modal ref="registerModal"
                                                        @success="handleSuccess"></cy-energy-consume-equipment-relation-equipment-modal>
  <cy-energy-consume-equipment-relation-param-modal ref="registerParamModal"
                                                    @success="handleParamSuccess"></cy-energy-consume-equipment-relation-param-modal>
</template>

<script lang="ts" setup>
import {ref, reactive, defineExpose, nextTick, defineProps, computed} from 'vue';
import {useMessage} from '/@/hooks/web/useMessage';
import {saveOrUpdate} from '../CyEnergyConsumeEquipment.api';
import {Form} from 'ant-design-vue';
import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
import {
  energyConsumeEquipmentTypeList
} from "@/views/energy/energyConsumeEquipmentType/CyEnergyConsumeEquipmentType.api";
import {modelList} from "@/views/energy/model/CyModel.api";
import CyEnergyConsumeEquipmentRelationEquipmentModal
  from "@/views/energy/energyConsumeEquipment/components/components/CyEnergyConsumeEquipmentRelationEquipmentModal.vue";

import CyEnergyConsumeEquipmentRelationParamModal
  from "@/views/energy/energyConsumeEquipment/components/components/CyEnergyConsumeEquipmentRelationParamModal.vue";
import JImageUpload from "@/components/Form/src/jeecg/components/JImageUpload.vue";
import {brandList} from "@/views/energy/model/components/components/CyBrand.api";
import {uploadSvgUrl} from "@/api/common/api";
import SelectStationNoClear from "@/components/station/SelectStationNoClear.vue";

const props = defineProps({
  formDisabled: {type: Boolean, default: false},
  formData: {type: Object, default: () => ({})},
  formBpm: {type: Boolean, default: true}
});
const registerModal = ref();
const uploadSvg = ref(uploadSvgUrl);//上传svg图 (只支持svg后缀的)
const registerParamModal = ref();
const editIndex = ref(undefined);
const formRef = ref();
const activeKey = ref('1'); //tabs
const energyConsumeEquipmentTypes = ref([]);//设备类型
const brands = ref([]);//品牌
const models = ref([]);//型号
const useForm = Form.useForm;
const emit = defineEmits(['register', 'ok']);
const formData = reactive<Record<string, any>>({
  id: '',
  energyConsumeEquipmentName: '',
  energyConsumeEquipmentCode: '',
  energyConsumeCategory: '',
  energyConsumeEquipmentTypeId: undefined,
  brandId: undefined,
  modelId: undefined,
  stationId: undefined,
  position: '',
  diagram: '',
  meters: [],
  sensors: [],
  params: [],
  equipmentIds: [],
});
const {createMessage} = useMessage();
const labelCol = ref<any>({xs: {span: 24}, sm: {span: 5}});
const wrapperCol = ref<any>({xs: {span: 24}, sm: {span: 16}});
const confirmLoading = ref<boolean>(false);
//表单验证
const validatorRules = {
  energyConsumeEquipmentName: [{required: true, message: '请输入设备名称'}],
  energyConsumeEquipmentCode: [{required: true, message: '请输入设备编码'}],
  energyConsumeEquipmentTypeId: [{required: true, message: '请选择设备类型'}],
  brandId: [{required: true, message: '请选择品牌'}],
  modelId: [{required: true, message: '请选择型号'}],
  // stationId:[{required: true, message: '请选择关联场站'}]
}
const {
  resetFields,
  validate,
  validateInfos
} = useForm(formData, validatorRules, {immediate: false});
//日期个性化选择
const fieldPickers = reactive({});

const meterColumns = [
  {
    title: '设备名称',
    dataIndex: 'equipmentName',
    key: 'equipmentName',
  },
  {
    title: '能源类型',
    dataIndex: 'energyTypeName',
    key: 'energyTypeName',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    customRender: ({text}) => {
      let re = '';
      if (text === '1') {
        re = '输入表';
      } else if (text === '2') {
        re = '输出表';
      }
      return re;
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
  },
]
const sensorColumns = [
  {
    title: '传感器名称',
    dataIndex: 'equipmentName',
    key: 'equipmentName',
  },
  {
    title: '设备类型',
    dataIndex: 'equipmentTypeName',
    key: 'equipmentTypeName',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
  },
]

const paramColumns = [
  {
    title: '参数名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '参数类型',
    dataIndex: 'paramTypeName',
    key: 'paramTypeName',
  },
  {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
  },
  {
    title: '参数值/参数来源',
    dataIndex: 'value',
    key: 'value',
    customRender: ({text, record}) => {
      if (record.paramType == 1) {
        return record.value
      } else {
        return record.equipmentName
      }
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({text}) => {
      let re = '';
      if (text == 1) {
        re = '启用中';
      } else if (!text || text == 2) {
        re = '已停用';
      }
      return re;
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
  },
]

// 表单禁用
const disabled = computed(() => {
  if (props.formBpm === true) {
    if (props.formData.disabled === false) {
      return false;
    } else {
      return true;
    }
  }
  return props.formDisabled;
});

/**
 * 修改参数状态
 */
function updateParamStatus(record, editStatus) {
  if (editStatus == 1) {
    //改为启用 需要配置参数值/参数来源
    if (record.paramType == 1) {
      //参数值
      if (!record.value) {
        createMessage.warn('请填写参数值');
        return
      }
    } else {
      //参数来源
      if (!record.equipmentName) {
        createMessage.warn('请填写参数来源');
        return
      }
    }
  }
  record.status = editStatus
}

/**
 * 添加关联设备
 */
function addEquipment(equipmentType) {
  registerModal.value.add(equipmentType, formData)
  editIndex.value = undefined
}

/**
 * 编辑参数
 */
function handleEditEquipment(record, index) {
  registerModal.value.edit(record, record.equipmentType, formData)
  editIndex.value = index
}

/**
 * 编辑参数
 */
function handleDeleteEquipment(array, index, record) {
  array.splice(index, 1);
  const idIndex = formData.equipmentIds.indexOf(record.equipmentId);
  if (idIndex !== -1) {
    formData.equipmentIds.splice(idIndex, 1);
  }
}

/**
 * 编辑参数
 */
function handleEditParam(record, index) {
  if (record.paramType != 1 && (!formData.equipmentIds || formData.equipmentIds.length == 0)) {
    createMessage.warn('没有关联计量表或传感器');
    return
  }
  registerParamModal.value.edit(record, formData.equipmentIds)
  editIndex.value = index
}

/**
 * 获取用能设备类型
 */
function getEnergyConsumeEquipmentTypes() {
  energyConsumeEquipmentTypeList({pageSize: -1}).then((res) => {
    energyConsumeEquipmentTypes.value = res.records
  })
}

/**
 * 获取品牌数据
 */
function getBrands() {
  brandList({pageSize: -1}).then((res) => {
    brands.value = res.records
  })
}

/**
 * 获取品牌型号
 */
function getModels() {
  if (formData.brandId) {
    formData.modelId = undefined
  }
  modelList({pageSize: -1, brandId: formData.brandId}).then((res) => {
    models.value = res.records
  });
}

/**
 * 更换用能设备类型事件
 */
function changeEnergyConsumeEquipmentType() {
  let filter = energyConsumeEquipmentTypes.value.filter(item => item.id === formData.energyConsumeEquipmentTypeId)
  formData.energyConsumeCategory = filter[0].energyConsumeCategory
  formData.params = filter[0].energyConsumeEquipmentTypeParams
}

/**
 * 成功回调
 */
function handleSuccess(data) {
  var newData = JSON.parse(JSON.stringify(data));
  if (newData.equipmentType == '1') {
    if (editIndex.value === undefined) { //必须用undefined  不然下标为0 也会进入
      formData.meters.push(newData)
    } else {
      formData.meters[editIndex.value] = newData
    }
  } else if (newData.equipmentType == '2') {
    if (editIndex.value === undefined) { //必须用undefined  不然下标为0 也会进入
      formData.sensors.push(newData)
    } else {
      formData.sensors[editIndex.value] = newData
    }
  }
  formData.equipmentIds.push(newData.equipmentId)
}

/**
 * 成功回调
 */
function handleParamSuccess(data) {
  formData.params[editIndex.value] = data
  console.log("formData", formData)
}

/**
 * 新增
 */
function add(selectStationId) {
  edit({}, selectStationId);
}

/**
 * 编辑
 */
function edit(record, selectStationId) {
  activeKey.value = '1'
  nextTick(() => {
    getEnergyConsumeEquipmentTypes();
    getBrands();
    getModels();
    resetFields();
    const tmpData = {
      stationId: selectStationId
    };
    Object.keys(formData).forEach((key) => {
      if (record.hasOwnProperty(key)) {
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
  const isUpdate = ref<boolean>(false);
  //时间格式化
  let model = formData;
  if (model.id) {
    isUpdate.value = true;
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
