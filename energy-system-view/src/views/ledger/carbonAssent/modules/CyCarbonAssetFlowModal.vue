<!-- src/views/ledger/carbonAssent/modules/CyCarbonAssetFlowModal.vue -->
<template>
  <a-drawer
      :title="title"
      width="600"
      :visible="visible"
      @close="close">
    <a-form :rules="validatorRules" :model="model" labelAlign='left'>
      <div>
        <span>{{ t('carbon.message.BaseInfo') }}</span>
        <a-row :gutter="24">
          <a-col :span="16">
            <a-form-item required :label-col="labelCol" :wrapper-col="wrapperCol" :label="t('carbon.message.FlowType')">
              <a-radio-group v-model:value="model.typeId" :options="types" @change="selectAsset" :disabled="editDisabel"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="16">
            <a-form-item :label="t('carbon.message.FlowTime')" required :label-col="labelCol" :wrapper-col="wrapperCol"
                         prop="flowTime">
              <a-date-picker v-model:value="model.flowTime" format="YYYY-MM-DD" value-format="YYYY-MM-DD"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="16">
            <a-form-item :label="t('carbon.message.OrganizationScope')" required :label-col="labelCol" allowClear
                         :wrapper-col="wrapperCol" prop="deptId">
              <a-select :placeholder="t('carbon.message.SelectOrganizationScope')" v-model:value="model.deptId"
                        @change="selectAsset">
                <a-select-option v-for="(item, index) in depts" :key="item.id">
                  {{ item.departName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <a-divider/>
      <div>
        <span>{{ t('carbon.message.FlowInfo') }}</span>
        <a-row :gutter="24">
          <a-col :span="16">
            <a-form-item required :label-col="labelCol" :wrapper-col="wrapperCol" :label="t('carbon.message.AssetCode')"
                         prop="assetCode">
              <a-input v-if="model.typeId !== types[1].value" :placeholder="t('carbon.message.Please_enter')"
                       v-model:value="model.assetCode"></a-input>
              <a-select v-else :placeholder="t('carbon.message.Please_select')" v-model:value="model.assetCode"
                        :disabled="!model.deptId" @change="changeAsset">
                <a-select-option v-for="item in assetCodes" :key="item.assetCode" :value="item.assetCode">
                  {{ item.assetCode }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="16">
            <a-form-item required :label-col="labelCol" :wrapper-col="wrapperCol"
                         :label="t('carbon.message.TypesOfCarbonAssets')" prop="carbonAssetTypeId">
              <a-radio-group v-model:value="model.carbonAssetTypeId" :options="carbonAssetTypes" @change="selectFlowTypes"
                             :disabled="model.typeId === types[1].value && model.assetCode"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="16">
            <a-form-item :label="t('carbon.message.FlowMethod')" required :label-col="labelCol" allowClear
                         :wrapper-col="wrapperCol" prop="flowTypeId">
              <a-select :placeholder="t('carbon.message.Please_select')" v-model:value="model.flowTypeId"
                        :disabled="!model.carbonAssetTypeId" @change="changeFlowType">
                <a-select-option v-for="item in flowTypes" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="16">
            <a-form-item :label="t('carbon.message.TotalCarbonAsset')" required :label-col="labelCol" allowClear
                         :wrapper-col="wrapperCol" prop="totalCarbonAsset">
              <a-input-number :min="0" :placeholder="t('carbon.message.Please_enter')" v-model:value="model.totalCarbonAsset"
                              @change="changeTotalCarbonAsset"></a-input-number>
              tCO₂e
              <div>
                <span
                    v-if="model.typeId === types[1].value">可用碳额为{{ availableCarbonAssets }}tCO₂e</span>
              </div>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="16">
            <a-form-item :label="t('carbon.message.ExpireTime')" required :label-col="labelCol"
                         :wrapper-col="wrapperCol"
                         v-if="model.typeId === types[0].value" prop="expireTime">
              <a-date-picker v-model:value="model.expireTime" format="YYYY-MM-DD" value-format="YYYY-MM-DD"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="16">
            <a-form-item :label="t('carbon.message.Counterparty')" required :label-col="labelCol" allowClear
                         :wrapper-col="wrapperCol" prop="counterparty">
              <a-input :placeholder="t('carbon.message.Please_enter')" v-model:value="model.counterparty"></a-input>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="16">
            <a-form-item :label="t('carbon.message.FlowImg')" :label-col="labelCol" allowClear
                         :wrapper-col="wrapperCol">
              <j-image-upload class="avatar-uploader" :text="t('carbon.message.Upload')"
                              v-model:value="model.flowImg"></j-image-upload>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <div class="drawerOptionBox">
      <a-button class="buttton2" :style="{ marginRight: '8px' }" @click="close">{{ t('carbon.message.Cancel') }}</a-button>
      <a-button type="primary" @click="onSave">{{ t('carbon.message.Save') }}</a-button>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { getCarbonAssetFlowList, saveOrUpdateAssetFlow } from '../carbonAssent.api';
import JImageUpload from '/@/components/Form/src/jeecg/components/JImageUpload.vue'
const { t } = useI18n();

// props
const props = defineProps({
  types: {
    type: Array,
    default: () => []
  },
  depts: {
    type: Array,
    default: () => []
  }
});

// emits
const emit = defineEmits(['back']);

// refs
const visible = ref<boolean>(false);
const disableSubmit = ref<boolean>(false);
const labelCol = { span: 8 };
const wrapperCol = { span: 16 };
const typeId = ref<any>(undefined);
const model = ref<any>({});
const carbonAssetTypes = ref<any[]>([]); //碳资产类型
const flowTypes = ref<any[]>([]); //流水方式
const assetCodes = ref<any[]>([]); //资产编号
const availableCarbonAssets = ref<any>(undefined); //可用碳资产
const editDisabel = ref<boolean>(false);

const title = computed(() => t('carbon.message.Add'));

const validatorRules = reactive({
  flowTime: [{ required: true, message: t('carbon.message.FlowTimeRequired'), trigger: 'blur' }],
  deptId: [{ required: true, message: t('carbon.message.OrgScopeRequired'), trigger: 'blur' }],
  assetCode: [{ required: true, message: t('carbon.message.AssetCodeRequired'), trigger: 'blur' }],
  carbonAssetTypeId: [{ required: true, message: t('carbon.message.CarbonAssetTypeRequired'), trigger: 'blur' }],
  flowTypeId: [{ required: true, message: t('carbon.message.FlowTypeRequired'), trigger: 'blur' }],
  totalCarbonAsset: [{ required: true, message: t('carbon.message.TotalCarbonAssetRequired'), trigger: 'blur' }],
  expireTime: [{ required: true, message: t('carbon.message.ExpireTimeRequired'), trigger: 'blur' }],
  counterparty: [{ required: true, message: t('carbon.message.CounterpartyRequired'), trigger: 'blur' }],
});

/**
 * 修改碳额
 */
function changeTotalCarbonAsset() {
  if (model.value.totalCarbonAsset && model.value.typeId === props.types[1].value) {
    if (model.value.totalCarbonAsset > availableCarbonAssets.value) {
      // this.$message.error('可用碳额不足')
      console.error('可用碳额不足');
    }
  }
}

/**
 * 修改碳资产编号
 * @param value
 */
function changeAsset(value: any) {
  assetCodes.value.forEach(item => {
    if (item.assetCode === value) {
      availableCarbonAssets.value = item.availableCarbonAssets
      carbonAssetTypes.value.forEach(carbonAssetType => {
        if (carbonAssetType.label === item.carbonAssetTypeName) {
          model.value.carbonAssetTypeId = carbonAssetType.value
          model.value.carbonAssetTypeName = carbonAssetType.label
          flowTypes.value = []
          model.value.flowTypeId = undefined
          carbonAssetType.children.forEach(children => {
            flowTypes.value.push({
              label: children.title,
              value: children.key,
              children: children.children,
            })
          })
        }
      })
    }
  })
}

/**
 * 如果是减少 需要查询组织下查询增持的资产编号
 */
async function selectAsset() {
  //查询流水类型下的碳资产类型
  if (model.value.typeId && typeId.value != model.value.typeId) {
    props.types.forEach((item: any) => {
      if (item.value === model.value.typeId) {
        model.value.typeName = item.label
        carbonAssetTypes.value = []
        flowTypes.value = []
        model.value.carbonAssetTypeId = undefined
        model.value.flowTypeId = undefined
        item.children.forEach(children => {
          carbonAssetTypes.value.push({
            label: children.title,
            value: children.key,
            children: children.children,
          })
        })
      }
    })
  }
  typeId.value = model.value.typeId

  //流水类型为减少  筛选出来有可用数量的资产编号
  console.log(model.value.typeId)
  console.log(props.types)
  console.log(props.types[1].value)
  console.log(model.value.typeId === props.types[1].value)
  if (model.value.typeId === props.types[1].value && model.value.deptId) {
    let param = {
      pageSize: -1,
      typeId: props.types[0].value,
      availableCarbonAssets: 0,
      deptId: model.value.deptId
    }
    try {
      const res = await getCarbonAssetFlowList(param);
      if (res.success) {
        console.log(22222)
        assetCodes.value = res.result.records
      } else {
        console.log(111111)
        // this.$message.error('该组织下没有可用碳资产')
        console.error('该组织下没有可用碳资产')
      }
    } catch (error) {
      console.error('查询资产编号失败', error);
    }
  }
}

/**
 * 获取流水方式
 */
function selectFlowTypes() {
  carbonAssetTypes.value.forEach(item => {
    if (item.value === model.value.carbonAssetTypeId) {
      model.value.carbonAssetTypeName = item.label
      flowTypes.value = []
      model.value.flowTypeId = undefined
      item.children.forEach(children => {
        flowTypes.value.push({
          label: children.title,
          value: children.key,
          children: children.children,
        })
      })
    }
  })
}

/**
 * 更换流水方式
 */
function changeFlowType() {
  flowTypes.value.forEach(item => {
    if (item.value === model.value.flowTypeId) {
      model.value.flowTypeName = item.label
    }
  })
}

/**
 * 添加
 */
function add() {
  console.log('add:', props.types)
  editDisabel.value = false
  model.value = {
    typeId: props.types[0].value,
    flowTypeId: undefined,
  }
  typeId.value = model.value.typeId
  model.value.typeName = props.types[0].label
  carbonAssetTypes.value = []
  flowTypes.value = []
  props.types[0].children.forEach(children => {
    carbonAssetTypes.value.push({
      label: children.title,
      value: children.key,
      children: children.children,
    })
  })
  visible.value = true
}

/**
 * 编辑
 */
function edit(record: any) {
  editDisabel.value = true
  carbonAssetTypes.value = []
  flowTypes.value = []
  props.types.forEach((item: any) => {
    if (item.value === record.typeId) {
      item.children.forEach(children => {
        carbonAssetTypes.value.push({
          label: children.title,
          value: children.key,
          children: children.children,
        })
      })
    }
  })

  carbonAssetTypes.value.forEach((item: any) => {
    if (item.value === record.carbonAssetTypeId) {
      item.children.forEach(children => {
        flowTypes.value.push({
          label: children.title,
          value: children.key,
          children: children.children,
        })
      })
    }
  })
  model.value = record
  visible.value = true
}

/**
 * 关闭
 */
function close() {
  emit('back')
  visible.value = false
}

/**
 * 保存
 */
async function onSave() {
  if (!model.value.flowTime) {
    // this.$message.error(this.$t('carbon.message.FlowTimeRequired'))
    console.error(t('carbon.message.FlowTimeRequired'))
    return
  }
  if (!model.value.deptId) {
    // this.$message.error(this.$t('carbon.message.OrgScopeRequired'))
    console.error(t('carbon.message.OrgScopeRequired'))
    return
  }
  if (!model.value.assetCode) {
    // this.$message.error(this.$t('carbon.message.AssetCodeRequired'))
    console.error(t('carbon.message.AssetCodeRequired'))
    return
  }
  if (!model.value.carbonAssetTypeId) {
    // this.$message.error(this.$t('carbon.message.CarbonAssetTypeRequired'))
    console.error(t('carbon.message.CarbonAssetTypeRequired'))
    return
  }
  if (!model.value.flowTypeId) {
    // this.$message.error(this.$t('carbon.message.FlowTypeRequired'))
    console.error(t('carbon.message.FlowTypeRequired'))
    return
  }
  if (!model.value.totalCarbonAsset) {
    // this.$message.error(this.$t('carbon.message.TotalCarbonAssetRequired'))
    console.error(t('carbon.message.TotalCarbonAssetRequired'))
    return
  }
  if (model.value.typeId === props.types[0].value && !model.value.expireTime) {
    // this.$message.error(this.$t('carbon.message.ExpireTimeRequired'))
    console.error(t('carbon.message.ExpireTimeRequired'))
    return
  }
  if (!model.value.counterparty) {
    // this.$message.error(this.$t('carbon.message.CounterpartyRequired'))
    console.error(t('carbon.message.CounterpartyRequired'))
    return
  }

  try {
    const res = await saveOrUpdateAssetFlow(model.value);
    if (res.success) {
      // this.$message.success(res.message)
      console.log(res.message)
      emit('back')
      visible.value = false
    } else {
      // this.$message.error(res.message)
      console.error(res.message)
    }
  } catch (error) {
    console.error('保存失败', error);
  }
}

// expose methods
defineExpose({
  add,
  edit,
  title,
  disableSubmit
});
</script>

<style scoped>
.drawerOptionBox {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: right;
  z-index: 1;
}

/* 强制重置表单容器样式 */
.ant-form {
  width: 100%;
  margin: 0;
  padding: 0;
}

/* 覆盖栅格系统默认间距 */
.ant-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

/* 处理混合组件库的样式冲突 */
.el-date-picker {
  width: 100%;
}

.tianjia {
  height: 156px;
  background: #f8f8f8;
  border-radius: 3px 3px 3px 3px;
  border: 1px solid #d9d9d9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .color {
    color: #888888;
  }

  .leftShoudong {
    background: #fff !important;
    border-color: #148958 !important;
    color: #148958 !important;
  }

  .leftChaxun {
    margin-left: 16px;
    background: #148958 !important;
    color: #fff !important;
  }

  .leftChaxun:hover {
    background: #148958 !important;
    color: #fff !important;
  }
}

.manual {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;

  .manualOperation {
    background: #ffffff;
    border-radius: 3px 3px 3px 3px;
    font-weight: 400;
    font-size: 12px;
    color: #148958;
    line-height: 0;
    border: 1px solid #148958;
    padding: 4px 8px;
    display: flex;
    align-items: center;

    img {
      width: 14px;
      height: 14px;
      margin-right: 8px;
    }
  }
}
</style>
