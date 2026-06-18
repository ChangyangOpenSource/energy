<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer>
      <template #detail>
          <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol"
                  :wrapperCol="wrapperCol" name="CyProtocolForm" :disabled="disabled"
                  :ruler="validatorRules">
            <a-row>
              <a-col :span="24">
                <a-form-item label="品牌" v-bind="validateInfos.brandId" id="CyProtocolForm-brandId"
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
                <a-form-item label="型号" v-bind="validateInfos.modelId" id="CyProtocolForm-modelId"
                             name="modelId">
                  <a-select
                    v-model:value="formData.modelId"
                    :options="models"
                    :field-names="{ label: 'modelName', value: 'id', options: 'children' }"
                    placeholder="请选择型号"
                    allow-clear
                  >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="通讯协议" v-bind="validateInfos.protocolCode"
                             id="CyProtocolForm-protocolCode" name="protocolCode">
                  <a-select
                    v-model:value="formData.protocolCode"
                    :options="allProtocols"
                    :field-names="{ label: 'protocolName', value: 'protocolId', options: 'children' }"
                    placeholder="请选择通讯协议"
                    allow-clear
                    @change="changeProtocolCode"
                  >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="设备类型" v-bind="validateInfos.equipmentTypeId"
                             id="CyProtocolForm-equipmentTypeId" name="equipmentTypeId">
                  <a-tree-select
                    v-model:value="formData.equipmentTypeId"
                    show-search
                    style="width: 100%"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    placeholder="请选择设备类型"
                    allow-clear
                    tree-default-expand-all
                    :tree-data="equipmentTypes"
                    :field-names="{
                      children: 'children',
                      label: 'title',
                      value: 'key',
                      selectable: 'selectable',
                    }"
                    tree-node-filter-prop="title"
                  >
                  </a-tree-select>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="波特率" v-bind="validateInfos.baudRate"
                             id="CyProtocolForm-baudRate" name="baudRate">
                  <a-input v-model:value="formData.baudRate" placeholder="请输入波特率"
                           allow-clear></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="数据位" v-bind="validateInfos.dataBits"
                             id="CyProtocolForm-dataBits" name="dataBits">
                  <a-input v-model:value="formData.dataBits" placeholder="请输入数据位"
                           allow-clear></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="停止位" v-bind="validateInfos.stopBits"
                             id="CyProtocolForm-stopBits" name="stopBits">
                  <a-input v-model:value="formData.stopBits" placeholder="请输入停止位"
                           allow-clear></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="校验位" v-bind="validateInfos.parity" id="CyProtocolForm-parity"
                             name="parity">
                  <a-input v-model:value="formData.parity" placeholder="请输入校验位"
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

import {ref, reactive, defineExpose, nextTick, defineProps} from 'vue';
import {useMessage} from '/@/hooks/web/useMessage';
import {saveOrUpdate} from '../CyProtocol.api';
import {Form} from 'ant-design-vue';
import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
import {brandList} from "@/views/energy/model/components/components/CyBrand.api";
import {modelList} from "@/views/energy/model/CyModel.api";
import {loadTreeRootNoTenant} from "@/views/system/category/category.api";
import {findProtocolList, findUsefulProtocolPositionsList} from "@/api/equipment/equipment";

const props = defineProps({
  formDisabled: {type: Boolean, default: false},
  formData: {type: Object, default: () => ({})},
  formBpm: {type: Boolean, default: true}
});
const formRef = ref();
const brands = ref(); //品牌下拉数据
const models = ref(); //型号下拉数据
const allProtocols = ref([]); //协议下拉数据
const equipmentTypes = ref([]);
const useForm = Form.useForm;
const emit = defineEmits(['ok']);
const registerModal = ref();
const formData = reactive<Record<string, any>>({
  id: '',
  brandId: undefined,
  brandName: '',
  modelId: undefined,
  modelName: '',
  protocolCode: undefined,
  protocolName: undefined,
  equipmentTypeId: undefined,
  baudRate: '',
  dataBits: '',
  stopBits: '',
  parity: '',
  protocolDatas: []
});
const {createMessage} = useMessage();
const labelCol = ref<any>({xs: {span: 24}, sm: {span: 5}});
const wrapperCol = ref<any>({xs: {span: 24}, sm: {span: 16}});
const confirmLoading = ref<boolean>(false);
//表单验证
const validatorRules = {
  brandId: [{required: true, message: '请选择品牌'}],
  modelId: [{required: true, message: '请选择型号'}],
  protocolCode: [{required: true, message: '请输入通讯协议'}],
  equipmentTypeId: [{required: true, message: '请选择设备类型'}],
  baudRate: [{required: true, message: '请输入波特率'}],
  dataBits: [{required: true, message: '请输入数据位'}],
  stopBits: [{required: true, message: '请输入停止位'}],
  parity: [{required: true, message: '请输入校验位'}]
};
const {
  resetFields,
  validate,
  validateInfos
} = useForm(formData, validatorRules, {immediate: false});

// 表单禁用
const disabled = ref(true)

/**
 * 分类字典
 */
function getCategoryTree() {
  loadTreeRootNoTenant({pcode: "C03", async: false}).then((res) => {
    handleTreeNodeValue(res)
    equipmentTypes.value = res
  });
}

/**
 * 处理树形数据
 * @param result
 */
function handleTreeNodeValue(result) {
  for (let i of result) {
    i.value = i['key']
    i.key = i['key']
    i.isLeaf = (!i.leaf) ? false : true
    i.selectable = i.leaf ? true : false //是否可选
    i.checkable = i.leaf ? true : false //设置独立节点是否展示 Checkbox
    if (i.children && i.children.length > 0) {
      handleTreeNodeValue(i.children)
    }
  }
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
 * 获取品牌数据
 */
function getModels() {
  if (formData.brandId) {
    formData.modelId = undefined
  }
  modelList({pageSize: -1, brandId: formData.brandId}).then((res) => {
    models.value = res.records
  })
}

/**
 * 初始化获取设备
 */
function initAllProtocol() {
  findProtocolList({}).then((res) => {
    Object.assign(allProtocols.value, res);
  })
}

/**
 * 校验设备编码是否存在
 */
function changeProtocolCode() {
  let filter = allProtocols.value.filter(item => item.protocolId === formData.protocolCode);
  formData.protocolName = filter[0].protocolName
  formData.protocolDatas = []

  findUsefulProtocolPositionsList({protocolId : filter[0].protocolId}).then((res) => {
    res.forEach(protocolData => {
      formData.protocolDatas.push({
        enumKey: protocolData.paramCode
      })
    })
  })
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
function edit(record) {
  if (record && record.id) {
    disabled.value = true
  } else {
    disabled.value = false
  }
  nextTick(() => {
    getBrands();
    getModels();
    initAllProtocol();
    getCategoryTree();
    resetFields();
    const tmpData = {};
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
  await saveOrUpdate(formData)
    .then((res) => {
      if (res.success) {
        formData.id = res.result
        let record = formData
        emit('ok', record);
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
