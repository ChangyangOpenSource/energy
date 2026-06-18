<!-- src/views/neutrality/carbonReduceManagement/modules/CyCarbonReduceManagementModal.vue -->
<template>
  <a-drawer :title="title" width="900" :visible="visible" @close="close">
    <a-form :rules="validatorRules" :model="formState">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item :label="t('carbon.message.ProjectYear')" required name="startYear">
            <el-date-picker
              v-model="formState.startYear"
              type="year"
              :placeholder="t('carbon.message.SelectStartYear')"
              format="YYYY"
              value-format="YYYY"
              :disabled-date="startYearOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="endYear">
            <el-date-picker
              v-model="formState.endYear"
              type="year"
              :placeholder="t('carbon.message.SelectEndYear')"
              format="YYYY"
              value-format="YYYY"
              :disabled-date="endYearOptions"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item required :label="t('carbon.message.EmissionReductionProjectName')" name="projectName">
            <a-input v-model:value="formState.projectName" :placeholder="t('carbon.message.EnterProjectName')" allowClear />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="t('carbon.message.OrganizationScope')" required allowClear name="projectDeptId">
            <a-select :placeholder="t('carbon.message.SelectOrganizationScope')" v-model:value="formState.projectDeptId" @change="selectDeptUser">
              <a-select-option v-for="(item, index) in depts" :key="item.id">
                {{ item.departName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item required :label="t('carbon.message.ProjectCarbonReductionType')" name="carbonReduceTypeId">
            <j-dict-select-tag
              v-model:value="formState.carbonReduceTypeId"
              :placeholder="t('carbon.message.SelectCarbonReductionType')"
              dictCode="project_carbon_reduce_type"
              :showChooseOption="false"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item required :label="t('carbon.message.Feasibility')" name="feasibility">
            <a-radio-group name="可行性" v-model:value="formState.feasibility">
              <a-radio value="high">{{ t('carbon.message.High') }}</a-radio>
              <a-radio value="mid">{{ t('carbon.message.Medium') }}</a-radio>
              <a-radio value="low">{{ t('carbon.message.Low') }}</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <!--具体详情-->
      <div v-for="(item, index) in formState.reduceDetails" :key="index" style="background-color: #f5f7f6; padding: 10px; margin-top: 10px">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item required :label="t('carbon.message.EmissionScopeCategory')">
              <a-tree-select
                allowClear
                style="width: 100%"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :placeholder="t('carbon.message.Please_select')"
                v-model:value="item.childrenStandardId"
                :treeData="childrenStandards"
                treeDefaultExpandAll
              >
              </a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :offset="8">
            <a-button type="dashed" @click="deleteDomain(index)">
              <a-icon type="minus" />
              {{ t('carbon.message.Delete') }}
            </a-button>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item :label="t('carbon.message.ExpectedReductionVolume')" required>
              <a-input-number
                style="width: 100%"
                :placeholder="t('carbon.message.EnterValue')"
                v-model:value="item.reduceValue"
                @change="unitConverterChange(index)"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item>
              <UnitCascader
                v-if="visible"
                :unitId="item.reduceUnitId"
                v-model:value="item.reduceUnitId"
                @change="(value, label) => onChangeProductUnitId(value, label, index)"
              ></UnitCascader>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item :label="t('carbon.message.Emission_factor')" required>
              <div v-if="!item.emissionFactorId" class="tianjia">
                <div class="color">{{ t('carbon.message.please_add_factor') }}</div>
                <div>
                  <a-button class="leftShoudong" @click="handleAdd('addYZ', index)">
                    <a-icon type="plus" />
                    {{ t('carbon.message.Manually_add') }}</a-button
                  >
                  <a-button class="leftChaxun" @click="handleAdd('chooseYZ', index)">
                    <a-icon type="plus" />
                    {{ t('carbon.message.Select_factor') }}</a-button
                  >
                </div>
              </div>
              <div v-else>
                <yzCard :item="selectedRows[index]" />
                <div class="manual">
                  <div class="manualOperation m_hoverCP" @click="handleAdd('addYZ', index)">
                    <img alt="" src="@/assets/carbon/img9.png" />{{ t('carbon.message.Manually_add') }}
                  </div>
                  <div class="manualOperation m_hoverCP" @click="handleAdd('chooseYZ', index)">
                    <img alt="" src="@/assets/carbon/img10.png" />{{ $t('carbon.message.Select_again') }}
                  </div>
                </div>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item :label="t('carbon.message.UnitConverter')" required >
              <div style="display: flex; align-items: center">
                1{{ item.reduceUnitName }} =
                <a-input-number :placeholder="t('carbon.message.EnterValue')" v-model:value="item.unitConverter" @change="unitConverterChange(index)" />
                {{ item.emissionFactorUnit }}
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('carbon.message.ExpectedEmissionReduction')"  :wrapper-col="wrapperCol">
              {{ item.carbonEmission }}tCO₂e
            </a-form-item>
          </a-col>
        </a-row>
      </div>

      <a-form-item>
        <a-button type="dashed" style="width: 100%" @click="addDomain"><a-icon type="plus" /> {{ $t('carbon.message.Add') }} </a-button>
      </a-form-item>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item :label="$t('carbon.message.ExpectedEmissionReduction')"> {{ formState.carbonEmission }}tCO₂e </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item :label="$t('carbon.message.Cost')">
            <a-input-number :placeholder="$t('carbon.message.EnterCost')" v-model:value="formState.cost" />
            {{ $t('carbon.message.Currency_unit_yuan') }}
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('carbon.message.ExpectedProfit')">
            <a-input-number :placeholder="$t('carbon.message.EnterExpectedProfit')" v-model:value="formState.profit" />
            {{ $t('carbon.message.Currency_unit_yuan') }}
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item :label="$t('carbon.message.Leader')">
            <a-select :placeholder="$t('carbon.message.SelectLeader')" v-model:value="formState.projectUserId">
              <a-select-option v-for="item in users" :key="item.id" :value="item.id">
                {{ item.realname }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item :label="$t('carbon.message.description')">
            <a-input :placeholder="$t('carbon.message.EnterDescription')" v-model:value="formState.otherInfo"></a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="drawerOptionBox">
      <a-button class="buttton2" :style="{ marginRight: '8px' }" @click="close">{{ $t('carbon.message.Cancel') }}</a-button>
      <a-button type="primary" @click="onSave">{{ $t('carbon.message.Save') }}</a-button>
    </div>
    <!--选择碳排因子弹窗-->
    <a-modal :visible="visible2" :width="1524" :title="$t('carbon.message.selective_carbon_emission_factor')" @cancel="handleCancel" @ok="handleOk2">
      <yzChooseView v-if="visible2" @onselectedRows="onselectedRows" />
    </a-modal>
    <!--手动添加碳排因子弹窗-->
    <a-modal
      :visible="visible3"
      :width="1000"
      :title="$t('carbon.message.manually_add_carbon_emission_factors')"
      @cancel="handleCancel"
      @ok="handleOk3"
    >
      <yzAddView v-if="visible3" ref="yzAddViewRef" />
    </a-modal>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { useI18n } from '/@/hooks/web/useI18n';
import JDictSelectTag from "@/components/Form/src/jeecg/components/JDictSelectTag.vue";
import yzCard from '/@/components/common/yzCard2.vue';
import yzChooseView from '/@/components/common/yzChooseView.vue';
import yzAddView from '/@/components/common/yzAddView.vue';
import UnitCascader from '/@/components/common/UnitCascader.vue';
// 引入新API
import {
  getOrgListByUser,
  getOrgUsers,
  getStandardList,
  saveOrUpdate,
  getFactorInfo,
  addEmissionFactor,
  getConvertValue,
} from '../CyCarbonReduceManagement.api';
const { t } = useI18n();
const { createMessage } = useMessage();
// refs
const yzAddViewRef = ref();
// emits
const emit = defineEmits(['back']);

// reactive data
const title = ref<string>('减排项目');
const visible = ref<boolean>(false);
const disableSubmit = ref<boolean>(false);
const labelCol = { span: 8 };
const wrapperCol = { span: 16 };
const labelCol2 = { span: 4 };
const wrapperCol2 = { span: 20 };

const formState = ref({
  reduceDetails: [
    {
      childrenStandardId: undefined,
      reduceValue: undefined,
      reduceUnitId: undefined,
      reduceUnitName: undefined,
      emissionFactorId: undefined,
      emissionFactorUnit: undefined,
      carbonEmission: 0,
    },
  ],
  carbonEmission: 0,
});

const index = ref<number>(0); //添加因子的下标
const users = ref<any[]>([]); //组织下的人员
const depts = ref<any[]>([]); //组织
const childrenStandards = ref<any[]>([]); //排放范围-分类

const cachesSlectedRows = ref<any>({}); // 暂存碳排因子
const selectedRows = ref<any[]>([]);
const visible2 = ref<boolean>(false); // 选择因子弹窗
const visible3 = ref<boolean>(false); // 手动添加因子弹窗

/**
 * 开始年
 */
const startYearOptions = (time: Date) => {
  if (formState.value.endYear) {
    const maxYear = new Date(formState.value.endYear, 0, 1).getTime();
    return time.getTime() > maxYear;
  }
  return false;
};

/**
 * 结束年
 */
const endYearOptions = (time: Date) => {
  if (formState.value.startYear) {
    const minYear = new Date(formState.value.startYear, 0, 1).getTime();
    return time.getTime() < minYear;
  }
  return false;
};

// 表单验证规则
const validatorRules = {
  startYear: [{ required: true, message: t('carbon.message.StartYearRequired'), trigger: 'blur' }],
  endYear: [{ required: true, message: t('carbon.message.EndYearRequired'), trigger: 'blur' }],
  projectName: [{ required: true, message: t('carbon.message.ProjectNameRequired'), trigger: 'blur' }],
  projectDeptId: [{ required: true, message: t('carbon.message.OrgScopeRequired'), trigger: 'blur' }],
  feasibility: [{ required: true, message: t('carbon.message.FeasibilityRequired'), trigger: 'blur' }],
  carbonReduceTypeId: [{ required: true, message: t('carbon.message.CarbonTypeRequired'), trigger: 'blur' }],
};

// lifecycle
onMounted(() => {
  fetchOrgListByUser();
  fetchStandards();
});

// =============================================================== 碳排因子相关方法
/**
 * 打开选择碳排因子弹窗
 * 手动添加碳排因子弹窗
 */
function handleAdd(type, idx) {
  index.value = idx;
  if (type == 'chooseYZ') {
    // 选择因子
    visible2.value = true;
  }
  if (type == 'addYZ') {
    // 手动添加因子
    visible3.value = true;
  }
}

/**
 * 选择因子
 * @param value
 */
function onselectedRows(value) {
  console.log('onselectedRows', value);
  // 基本信息-碳排因子
  cachesSlectedRows.value = value;
}

/**
 * 关闭选择碳排因子弹窗
 * 关闭手动添加碳排因子弹窗
 */
function handleCancel() {
  visible2.value = false;
  visible3.value = false;
}

/**
 * 选择碳排因子弹窗-确定
 */
function handleOk2() {
  // 基本信息-碳排因子
  let idx = index.value;
  if (selectedRows.value.length >= idx) {
    selectedRows.value[idx] = cachesSlectedRows.value;
  } else {
    selectedRows.value.push(cachesSlectedRows.value);
  }
  formState.value.reduceDetails[idx].emissionFactorId = cachesSlectedRows.value.id;
  formState.value.reduceDetails[idx].emissionFactorValue = cachesSlectedRows.value.factorValue;
  formState.value.reduceDetails[idx].emissionFactorUnit = cachesSlectedRows.value.denominatorUnit;
  unitChange(formState.value.reduceDetails[idx].reduceUnitName, selectedRows.value.denominatorUnit);
  visible2.value = false;
}

/**
 * 手动添加碳排因子弹窗-确定
 */
async function handleOk3() {
  console.log(cachesSlectedRows.value);
  let idx = index.value;
  if (!yzAddViewRef.value.checkFormData()) {
    return;
  }
  console.log('handleOk3', yzAddViewRef.value.queryParam);

  try {
    const res = await addEmissionFactor(yzAddViewRef.value.queryParam);
    if (res.success) {
      createMessage.success('添加成功');
      formState.value.reduceDetails[idx].emissionFactorId = res.result;
      fetchFactorInfo();
    }
  } catch (error) {
    console.error('Failed to add emission factor:', error);
  }

  unitConverterChange(idx);
}

function unitChange(sourceUnit, targetUnit, transportIndex?) {
  console.log('unitChange', sourceUnit, targetUnit, transportIndex);
  let idx = index.value;
  if (sourceUnit && targetUnit) {
    if (sourceUnit == targetUnit) {
      formState.value.reduceDetails[idx].unitConverter = 1;
    } else {
      getConvertValue({
        sourceUnit,
        targetUnit,
      }).then((res) => {
        if (res.success) {
          formState.value.reduceDetails[idx].unitConverter = res.result;
        }
      });
    }
  }
  unitConverterChange(idx);
}

/**
 * 获取因子数据
 */
async function fetchFactorInfo(id?, idx?) {
  try {
    const res = await getFactorInfo({ id: id || formState.value.reduceDetails[idx].emissionFactorId });
    if (res.success) {
      let selectedRowsData = {
        id: res.result.emissionFactorObject.id,
        name: res.result.emissionFactorObject.name,
        model: res.result.emissionFactorObject.model,
        factorValue: res.result.emissionFactorDataObject.factorValue,
        numeratorUnit: res.result.emissionFactorDataObject.numeratorUnit,
        denominatorUnit: res.result.emissionFactorDataObject.denominatorUnit,
        releaseOrg: res.result.emissionFactorObject.releaseOrg,
        releaseYear: res.result.emissionFactorObject.releaseYear,
      };
      // 基本信息-碳排因子
      selectedRows.value[idx] = selectedRowsData;
      formState.value.reduceDetails[idx].emissionFactorId = selectedRowsData.id;
      formState.value.reduceDetails[idx].emissionFactorValue = selectedRowsData.factorValue;
      formState.value.reduceDetails[idx].emissionFactorUnit = selectedRowsData.denominatorUnit;
      console.log('listInfo formObj', formState.value.reduceDetails[idx]);
      visible3.value = false;
    }
  } catch (error) {
    console.error('Failed to fetch factor info:', error);
  }
}

/**
 * 单位换算修改
 */
function unitConverterChange(idx) {
  let formObj = formState.value.reduceDetails[idx];
  console.log('unitConverterChange', formObj);
  if (formObj.reduceValue && formObj.emissionFactorValue && formObj.unitConverter) {
    if (formObj.emissionFactorUnit === 'gCO₂e') {
      formObj.carbonEmission = ((formObj.reduceValue * formObj.unitConverter * formObj.emissionFactorValue) / 1000 / 1000).toFixed(2);
    } else if (formObj.emissionFactorUnit === 'kgCO₂e') {
      formObj.carbonEmission = ((formObj.reduceValue * formObj.unitConverter * formObj.emissionFactorValue) / 1000).toFixed(2);
    } else {
      formObj.carbonEmission = (formObj.reduceValue * formObj.unitConverter * formObj.emissionFactorValue).toFixed(2);
    }
  }
  let sum = 0;
  formState.value.reduceDetails.forEach((c) => (sum = Number(sum) + Number(c.carbonEmission)));
  formState.value.carbonEmission = sum.toFixed(2);

}

/**
 * 修改产品单位
 */
function onChangeProductUnitId(value, label, idx) {
  console.log('onChangeProductUnitId', value, 'aaa22aaa', label, idx);
  formState.value.reduceDetails[idx].reduceUnitName = label;
  unitConverterChange(idx);
}

/**
 * 获取核算标准
 */
async function fetchStandards() {
  try {
    const res = await getStandardList({
      pcode: 'A01A01',
      async: false,
    });
    if (res.success) {
      handleTreeNodeValue(res.result);
      childrenStandards.value = [...res.result];
    }
  } catch (error) {
    console.error('Failed to fetch standards:', error);
  }
}

function handleTreeNodeValue(result) {
  for (let i of result) {
    i.value = i['key'];
    i.key = i['key'];
    i.isLeaf = !i.leaf ? false : true;
    i.selectable = i.leaf ? true : false; //是否可选
    i.checkable = i.leaf ? true : false; //设置独立节点是否展示 Checkbox
    if (i.children && i.children.length > 0) {
      handleTreeNodeValue(i.children);
    }
  }
}

/**
 * 添加阶段
 */
function addDomain() {
  formState.value.reduceDetails.push({
    childrenStandardId: undefined,
    reduceValue: undefined,
    reduceUnitId: undefined,
    reduceUnitName: undefined,
    emissionFactorId: undefined,
    emissionFactorUnit: undefined,
    carbonEmission: 0,
  });
}

/**
 * 删除阶段
 */
function deleteDomain(idx) {
  if (formState.value.reduceDetails.length > 1) {
    formState.value.carbonEmission = (formState.value.carbonEmission - formState.value.reduceDetails[idx].carbonEmission).toFixed(2);
    nextTick(() => {
      formState.value.reduceDetails.splice(idx, 1);
    });
  } else {
    createMessage.error(t('carbon.message.DeleteFailMinScope'));
    return;
  }
}

/**
 * 获取所有下级组织信息(包含本身)
 */
async function fetchOrgListByUser() {
  try {
    const res = await getOrgListByUser({});
    if (res.success) {
      console.log("res.success", res.result)
      depts.value = res.result;
    }
  } catch (error) {
    console.error('Failed to fetch org list:', error);
  }
}

function add() {
  formState.value = []
  Object.assign(formState.value, {
    startYear: undefined,
    endYear: undefined,
    projectName: undefined,
    projectDeptId: undefined,
    carbonReduceTypeId: undefined,
    feasibility: undefined,
    cost: undefined,
    reduceDetails: [
      {
        unitConverter: undefined,
        childrenStandardId: undefined,
        reduceValue: undefined,
        reduceUnitId: undefined,
        reduceUnitName: undefined,
        emissionFactorId: undefined,
        emissionFactorUnit: undefined,
        carbonEmission: 0,
      },
    ],
    carbonEmission: 0,
  });
  visible.value = true;

  console.log('formState.value', formState.value);
}

function edit(record) {
  record.startYear = '' + record.startYear;
  record.endYear = '' + record.endYear;
  Object.assign(formState.value, record);

  formState.value.reduceDetails.forEach((element, idx) => {
    fetchFactorInfo(element.emissionFactorId, idx);
  });

  selectDeptUser();
  visible.value = true;
}

function close() {
  visible.value = false;
}

/**
 * 减碳项目-保存
 */
async function onSave() {
  try {
    const res = await saveOrUpdate(formState.value);
    if (res.success) {
      createMessage.success(res.message);
      emit('back')
      visible.value = false;
    } else {
      createMessage.error(res.message);
    }
  } catch (error) {
    console.error('Failed to save project:', error);
  }
}

/**
 * 查询组织下的人
 */
async function selectDeptUser() {
  try {
    const res = await getOrgUsers({
      departId: formState.value.projectDeptId,
      pageNo: -1,
      pageSize: 10,
    });
    if (res.success) {
      users.value = res.result;
    }
  } catch (error) {
    console.error('Failed to fetch org users:', error);
  }
}

// expose methods
defineExpose({
  add,
  edit,
  title,
  disableSubmit,
  close,
});
</script>

<style scoped sc>
.drawerOptionBox {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 6px 16px;
  background: #fff;
  text-align: right;
  z-index: 1;
}

/* 强制重置表单容器样式 */
.ant-form-model {
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
