<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer :disabled="disabled">
      <template #detail>
        <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol"
                name="CyEquipmentForm" :ruler="validatorRules">
          <a-row>
            <a-col :span="24">
              <a-form-item label="设备名称" v-bind="validateInfos.name" id="CyEquipmentForm-name"
                           name="name">
                <a-input v-model:value="formData.name" placeholder="请输入设备名称"
                         allow-clear></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="计量表类型" v-bind="validateInfos.meterType"
                           id="CyEquipmentForm-meterType" name="meterType">
                <j-dict-select-tag type='radio' v-model:value="formData.meterType"
                                   dictCode="meter_type" placeholder="请选择计量表类型" allow-clear
                                   @change="changeMeterType" :disabled="!!formData.id"/>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="数据接入方式" v-if="formData.meterType == 1"
                           v-bind="validateInfos.dataAccess" id="CyEquipmentForm-dataAccess"
                           name="dataAccess">
                <a-radio-group v-model:value="formData.dataAccess" @change="changeDataAccess"
                               :disabled="!!formData.id">
                  <template v-for="item in dataAccesses" :key="`${item.value}`">
                    <a-radio :value="item.value" :disabled="item.value != 1">
                      {{ item.label }}
                    </a-radio>
                  </template>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="品牌" v-bind="validateInfos.brandId" id="CyEquipmentForm-brandId"
                           name="brandId">
                <a-select
                  v-model:value="formData.brandId"
                  :options="brands"
                  :field-names="{ label: 'brandName', value: 'id', options: 'children' }"
                  placeholder="请选择品牌"
                  allow-clear
                  @change="getModels">
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="型号" v-bind="validateInfos.modelId" id="CyEquipmentForm-modelId"
                           name="modelId">
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
              <a-form-item label="设备编码" v-bind="validateInfos.equipmentCode"
                           id="CyEquipmentForm-equipmentCode" name="equipmentCode">
                <a-input v-model:value="formData.equipmentCode" placeholder="请输入设备编码"
                         @blur="checkEquipmentCode" allow-clear></a-input>
                <div style="color: red" v-if="noEquipmentCode">设备编码不存在</div>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="设备类型" v-bind="validateInfos.equipmentTypeId"
                           id="CyEquipmentForm-equipmentTypeId" name="equipmentTypeId">
                <a-select
                  v-model:value="formData.equipmentTypeId"
                  :options="equipmentTypes"
                  :field-names="{ label: 'title', value: 'key'}"
                  placeholder="请选择设备类型"
                  @change="changeEquipmentTypeId"
                  allow-clear>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="能源类型" v-bind="validateInfos.energyType"
                           id="CyEquipmentForm-energyType" name="energyType">
                <a-select
                  v-model:value="formData.energyType"
                  :options="energyTypes"
                  :field-names="{ label: 'title', value: 'value'}"
                  placeholder="请选择能源类型"
                  allow-clear>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="关联场站" v-bind="validateInfos.stationId"
                           id="CyEquipmentForm-stationId" name="stationId">
                <select-station-no-clear v-model:value="formData.stationId"
                                      :disabled="true"></select-station-no-clear>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="上级设备" v-bind="validateInfos.parentId"
                           id="CyEquipmentForm-parentId" name="parentId">
                <a-tree-select
                  v-model:value="formData.parentId"
                  show-search
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  placeholder="请选择上级设备"
                  allow-clear
                  tree-default-expand-all
                  :tree-data="meters"
                  :field-names="{
                      children: 'meters',
                      label: 'name',
                      value: 'id',
                    }"
                  tree-node-filter-prop="label"
                >
                </a-tree-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="安装位置" v-bind="validateInfos.position"
                           id="CyEquipmentForm-position" name="position">
                <a-input v-model:value="formData.position" placeholder="请输入安装位置"
                         allow-clear></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="组态图" v-bind="validateInfos.diagram"
                           id="CyEquipmentForm-diagram" name="diagram">
                <j-image-upload v-model:value="formData.diagram" text="上传svg图"
                                :uploadUrl="uploadSvg"></j-image-upload>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="协议" v-if="formData.meterType == 1"
                           v-bind="validateInfos.protocolId"
                           id="CyEquipmentForm-protocolId"
                           name="protocolId">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span v-if="formData.protocolId"
                        style="flex: 1; display: flex; align-items: center; height: 32px;">
                    <a-input :disabled="true"
                             :value="`${formData.protocolBrandName}/${formData.protocolModelName}/${formData.protocolName}`"></a-input>
                  </span>
                  <span v-else style="flex: 1; height: 32px;">
                    <a-input :disabled="true"></a-input>
                  </span>
                  <a-button type="primary" @click="initProtocol" style="margin-left: 8px;"
                            :disabled="!!formData.id">选择协议
                  </a-button>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
    </JFormContainer>
  </a-spin>
  <select-protocol-modal ref="registerSelectProtocolModal" :protocolId="formData.protocolId"
                         @success="changeProtocol"></select-protocol-modal>

</template>

<script lang="ts" setup>
import {ref, reactive, defineExpose, nextTick, defineProps, computed} from 'vue';
import {useMessage} from '/@/hooks/web/useMessage';
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import {saveOrUpdate, treeListByEquipmentTypeId} from '../CyEquipment.api';
import {Form} from 'ant-design-vue';
import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
import {modelList} from "@/views/energy/model/CyModel.api";
import {loadTreeRootNoTenant} from "@/views/system/category/category.api";
import JImageUpload from "@/components/Form/src/jeecg/components/JImageUpload.vue";
import {findDeviceSnList} from "@/api/equipment/equipment";
import SelectProtocolModal
  from "@/views/energy/meter/components/components/SelectProtocolModal.vue";
import {brandList} from "@/views/energy/model/components/components/CyBrand.api";
import {getEnergyType} from "@/views/energy/station/CyStation.api";
import {getDictItems, uploadSvgUrl} from "@/api/common/api";
import SelectStationNoClear from "@/components/station/SelectStationNoClear.vue";

const props = defineProps({
  formDisabled: {type: Boolean, default: false},
  formData: {type: Object, default: () => ({})},
  formBpm: {type: Boolean, default: true}
});
const formRef = ref();
const registerSelectProtocolModal = ref();
const dataAccesses = ref([]);//字典 数据接入方式
const brands = ref([]);//品牌
const models = ref([]);//型号
const meters = ref([]);//计量表
const energyTypes = ref([]);//能源类型
const equipmentTypes = ref([]);//设备类型
const noEquipmentCode = ref(false);//设备编码不存在
const uploadSvg = ref(uploadSvgUrl);//上传svg图 (只支持svg后缀的)
const useForm = Form.useForm;
const emit = defineEmits(['register', 'ok']);
const formData = reactive<Record<string, any>>({
  id: undefined,
  name: '',
  meterType: '',
  dataAccess: undefined,
  equipmentCode: '',
  brandId: undefined,
  modelId: undefined,
  equipmentTypeId: undefined,
  energyType: undefined,
  stationId: undefined,
  parentId: undefined,
  position: '',
  diagram: '',
  protocolId: undefined,
  protocolBrandName: undefined,
  protocolModelName: undefined,
  protocolName: undefined,
  status: 0,
  type: 1,
  dataList: [],
});
const {createMessage} = useMessage();
const labelCol = ref<any>({xs: {span: 24}, sm: {span: 5}});
const wrapperCol = ref<any>({xs: {span: 24}, sm: {span: 16}});
const confirmLoading = ref<boolean>(false);
const allEquipmentCodes = ref([])
//表单验证
const validatorRules = computed(() => {
  const baseRules = {
    name: [{required: true, message: '请输入设备名称'}],
    meterType: [{required: true, message: '请选择计量表类型'}],
    brandId: [{required: true, message: '请选择品牌'}],
    modelId: [{required: true, message: '请选择型号'}],
    equipmentCode: [{required: true, message: '请输入设备编码'}],
    equipmentTypeId: [{required: true, message: '请选择设备类型'}],
    energyType: [{required: true, message: '请选择能源类型'}],
  };

  // 只有当 meterType = 1 时才添加 dataAccess 和 protocolId 的验证
  if (formData.meterType == 1) {
    baseRules.dataAccess = [{required: true, message: '请选择数据接入方式'}];
    baseRules.protocolId = [{required: true, message: '请选择协议'}];
  }

  return baseRules;
});
const {
  resetFields,
  validate,
  validateInfos
} = useForm(formData, validatorRules, {immediate: false});

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
 * 选择协议按钮 弹窗
 */
function initProtocol() {
  registerSelectProtocolModal.value.initProtocol()
}

/**
 * 更换数据接入方式
 */
function changeDataAccess() {
  if (formData.dataAccess == 1) {
    //只有直连 需要查询设备编码是否存在
    initAllSn()
    //如果先填写 sn码 后选直连 也需要校验
    if (formData.equipmentCode) {
      checkEquipmentCode()
    }
  } else {
    noEquipmentCode.value = false
  }
}

/**
 * 更换计量表类型
 */
function changeMeterType() {
  //清空数据接入方式
  formData.dataAccess = undefined
  //清空协议
  formData.protocolId = undefined
}

/**
 * 更换协议
 */
function changeProtocol(selectRowKeys) {
  formData.protocolBrandName = selectRowKeys[0].brandName
  formData.protocolModelName = selectRowKeys[0].modelName
  formData.protocolName = selectRowKeys[0].protocolName
  formData.protocolId = selectRowKeys[0].id
}

/**
 * 校验设备编码是否存在
 */
function checkEquipmentCode() {
  //只有计量表 直连 需要校验是否存在
  if (formData.meterType == 1 && formData.dataAccess == 1) {
    if (allEquipmentCodes.value.length == 0 || !allEquipmentCodes.value.includes(formData.equipmentCode)) {
      noEquipmentCode.value = true
    } else {
      noEquipmentCode.value = false
    }
  } else {
    noEquipmentCode.value = false
  }
}

/**
 * 获取数据接入方式
 */
function getDataAccesses() {
  getDictItems("data_access").then((res) => {
    dataAccesses.value = res
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
 * 初始化品牌型号
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
 * 初始化能源类型
 */
function getEnergyTypes() {
  getEnergyType({id: formData.stationId}).then((res) => {
    energyTypes.value = res
  });
}

/**
 * 初始化获取设备
 */
function initAllSn() {
  findDeviceSnList({}).then((res) => {
    allEquipmentCodes.value = res
  })
}

/**
 * 初始化计量表
 */
function changeEquipmentTypeId() {
  treeListByEquipmentTypeId({
    equipmentTypeId: formData.equipmentTypeId,
    stationId: formData.stationId
  }).then((res) => {
    meters.value = res
  });
}


/**
 * 分类字典
 */
function getEquipmentTypes() {
  loadTreeRootNoTenant({pcode: "C03A01", async: false}).then((res) => {
    equipmentTypes.value = res
  });
}

/**
 * 新增
 */
function add(selectStationId) {
  noEquipmentCode.value = false
  formData.dataList = []
  meters.value = []
  edit({}, selectStationId);
}

/**
 * 编辑
 */
function edit(record, selectStationId) {
  nextTick(() => {
    getDataAccesses();
    getBrands();
    getModels();
    getEquipmentTypes();
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

    if (formData && formData.equipmentTypeId) {
      changeEquipmentTypeId()
    }
    getEnergyTypes()
  });
}

/**
 * 提交数据
 */
async function submitForm(type) {
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

  // TODO 先放开
  // if (noEquipmentCode) {
  //   return
  // }
  confirmLoading.value = true;
  //时间格式化
  let model = formData;
  await saveOrUpdate(model)
    .then((res) => {
      if (res.success) {
        formData.id = res.result
        if (type === "save") {
          emit('save');
        } else if (type === "next") {
          emit('next', res.result);
        }
      } else {
        createMessage.warning(res.message);
        return
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
