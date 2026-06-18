<!-- src/views/neutrality/carbonEmissionPlan/modules/CyCarbonEmissionPlanForm.vue -->
<template>
  <div class="">
    <div class="cardHeader">
      <div class="cardHeader_backBox m_hoverCP">
        <img class="cardHeader_icon m_hoverCP" src="@/assets/img/img28.png" alt="" @click="onBack" />
        <span class="m_hoverCP" @click="onBack">{{ t('carbon.message.Return') }}</span>
      </div>
      <div>
        <span style="font-size: 18px">{{ t('carbon.message.Carbon_plan_setting') }}</span>
      </div>
    </div>

    <a-spin :spinning="confirmLoading">
      <!--  基本信息  -->
      <section class="cardBox">
        <div class="table-page-search-wrapper">
          <a-form ref="formRef" :model="formData" :rules="validatorRules">
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item :label="t('carbon.message.Target_name')" required name="planName">
                  <a-input-number :precision="4" :placeholder="t('carbon.message.Please_enter_target_name')" v-model:value="formData.planName" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item :label="t('carbon.message.Related_organizations')" required name="planDeptId">
                  <a-select
                    :placeholder="t('carbon.message.Please_select_related_organizations')"
                    v-model:value="formData.planDeptId"
                    @change="getBaseYearOrgData"
                  >
                    <a-select-option v-for="(item, index) in depts" :key="item.id">
                      {{ item.departName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-row>
                  <a-col :span="6">
                    <a-form-item :label="t('carbon.message.Accounting_standard')" required name="standardId">
                      <a-select
                        :placeholder="t('carbon.message.please_select_accounting_standard')"
                        v-model:value="formData.standardId"
                        @change="getChildrenStandardScopes"
                      >
                        <a-select-option v-for="(item, index) in standards" :key="item.key">
                          {{ item.title }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </section>

      <section class="cardBox">
        <div class="table-page-search-wrapper">
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item :label="t('carbon.message.Base_year')" required>
                <el-date-picker
                  :disabled="editBaseYear"
                  v-model="formData.baseYear"
                  type="year"
                  :placeholder="t('carbon.message.Please_select_base_year')"
                  format="YYYY"
                  value-format="YYYY"
                  :disabled-date="baseYearOptions"
                  @change="getBaseYearOrgData"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item :label="t('carbon.message.Base_year_carbon_emissions')" required>
                    <a-input-number :precision="4"
                      :placeholder="t('carbon.message.Please_enter_base_year_carbon_emissions')"
                      v-model:value="formData.baseYearCarbonEmissions"
                      addon-after="tCO₂e"
                      :disabled="true"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="t('carbon.message.Base_year_revenue')" required>
                    <a-input-number :precision="4"
                      :placeholder="t('carbon.message.Please_enter_target_name')"
                      v-model:value="formData.baseYearRevenue"
                      addon-after="W"
                      :disabled="true"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="t('carbon.message.Base_year_revenue_intensity')" required>
                    <a-input-number :precision="4"
                      :placeholder="t('carbon.message.Please_enter_base_year_revenue')"
                      v-model:value="formData.baseYearRevenueIntensity"
                      addon-after="tCO₂e/W"
                      :disabled="true"
                    />
                  </a-form-item>
                </a-col>

                <a-col :span="8" v-for="(item, index) in formData.planCarbonEmissionScopeList" :key="index">
                  <a-form-item :label="item.title" required>
                    <a-input-number :precision="4"
                      :placeholder="t('carbon.message.Please_enter_base_year_revenue_intensity')"
                      v-model:value="item.childrenStandardValue"
                      addon-after="tCO₂e"
                      :disabled="true"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </div>
      </section>

      <section class="cardBox">
        <div class="table-page-search-wrapper">
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item :label="t('carbon.message.Carbon_neutral_year')" required>
                <el-date-picker
                  :disabled="editBaseYear"
                  v-model="formData.carbonNeutralYear"
                  type="year"
                  :placeholder="t('carbon.message.Please_select_carbon_neutral_year')"
                  format="YYYY"
                  value-format="YYYY"
                  :disabled-date="carbonNeutralYearOptions"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="24">
              <a-button @click="onAddStage" style="width: 100%;" class="colorse"> <PlusOutlined />{{ t('carbon.message.Add_stage') }} </a-button>
            </a-col>
          </a-row>

          <a-row :gutter="24" v-for="(item, index) in formData.stageList" :key="index" class="stageClass">
            <a-col :span="20">
              <a-form-item :label="t('carbon.message.Stage')" required>
                <el-date-picker
                  v-model="item.stageYear"
                  type="year"
                  :placeholder="t('carbon.message.Please_select_stage')"
                  format="YYYY"
                  value-format="YYYY"
                  :disabled-date="stageYearOptions"/>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-button type="dashed" @click="deleteStage(index)"> <MinusOutlined />{{ t('carbon.message.Delete_stage') }} </a-button>
            </a-col>

            <a-col :span="8">
              <a-form-item :label="t('carbon.message.Target_year_carbon_emissions')" required>
                <a-input-number :precision="4"
                  :placeholder="t('carbon.message.Please_enter_target_year_carbon_emissions')"
                  v-model:value="item.targetYearCarbonEmissions"
                  addon-after="tCO₂e"
                  @change="() => calStageIntensity(index)"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="t('carbon.message.Target_year_revenue')" required>
                <a-input-number :precision="4"
                  :placeholder="t('carbon.message.Please_enter_target_year_revenue')"
                  v-model:value="item.targetYearRevenue"
                  addon-after="W"
                  @change="() => calStageIntensity(index)"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="t('carbon.message.Target_year_revenue_intensity')" required>
                <a-input-number :precision="4"
                  :placeholder="t('carbon.message.Please_enter_target_year_revenue_intensity')"
                  v-model:value="item.targetYearRevenueIntensity"
                  addon-after="tCO₂e/W"
                  :disabled="true"
                />
              </a-form-item>
            </a-col>

            <a-col :span="8" v-for="(scopeItem, scopeIndex) in item.stageCarbonEmissionScopeList" :key="scopeIndex">
              <a-form-item :label="scopeItem.title" required>
                <a-input-number :precision="4"
                  :placeholder="t('carbon.message.Please_enter_target_name')"
                  v-model:value="scopeItem.childrenStandardValue"
                  addon-after="tCO₂e"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <div class="optionBox">
          <div class="optionItem_save m_hoverCP" @click="onSave()">
            {{ t('carbon.message.Save') }}
          </div>
        </div>
      </section>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, defineExpose, nextTick, defineProps, computed, watch, onMounted } from 'vue';
import { Form } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { useI18n } from '/@/hooks/web/useI18n';
import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue';
import { saveOrUpdate, queryById, getOrgListByUser, getStandardList, getOrgCarbonEmission, getOrgRevenue } from '../CyCarbonEmissionPlan.api';

const props = defineProps({
  formData: { type: Object, default: () => ({}) },
  formBpm: { type: Boolean, default: true },
});

const emit = defineEmits(['register', 'back']);

const { t } = useI18n();
const { createMessage } = useMessage();
const formRef = ref();
const useForm = Form.useForm;

// 表单数据
const formData = ref({
  id: '',
  planName: '',
  planDeptId: undefined,
  standardId: undefined,
  baseYear: undefined,
  carbonNeutralYear: undefined,
  baseYearCarbonEmissions: undefined,
  baseYearRevenue: undefined,
  baseYearRevenueIntensity: undefined,
  planCarbonEmissionScopeList: [],
  stageList: [],
});

// 状态数据
const confirmLoading = ref<boolean>(false);
const editBaseYear = ref<boolean>(false);
const standards = ref<any[]>([]);
const depts = ref<any[]>([]);
const switchShow = ref<boolean>(false);

// 表单验证规则
const validatorRules = ref({
  planName: [{ required: true, message: t('carbon.message.TargetNameRequired'), trigger: 'blur' }],
  baseYear: [{ required: true, message: t('carbon.message.BaseYearRequired'), trigger: 'blur' }],
  carbonNeutralYear: [{ required: true, message: t('carbon.message.CarbonNeutralYearRequired'), trigger: 'blur' }],
});

const { resetFields, validate } = useForm(formData, validatorRules, { immediate: false });

// 日期选择器选项

const baseYearOptions = (time: Date) => {
  if (formData.value.carbonNeutralYear) {
    const maxYear = new Date(formData.value.carbonNeutralYear, 0, 1).getTime();
    return time.getTime() >= maxYear;
  }
  return false;
};


const carbonNeutralYearOptions = (time: Date) => {
  if (formData.value.baseYear) {
    const minYear = new Date(formData.value.baseYear, 12, 1).getTime();
    return time.getTime() <= minYear;
  }
  return false;
};


const stageYearOptions = (time: Date) => {
  const year = new Date(time).getFullYear();
      const baseYear = parseInt(formData.value.baseYear);
      const neutralYear = parseInt(formData.value.carbonNeutralYear);
      return year <= baseYear || year > neutralYear || formData.value.stageList.some((item) => item.stageYear && item.stageYear === year.toString());
};

// 监听器
watch(
  () => formData.value.baseYear,
  (newVal) => {
    if (newVal && formData.value.carbonNeutralYear) {
      if (new Date(newVal) > new Date(formData.value.carbonNeutralYear)) {
        formData.value.carbonNeutralYear = '';
      }
    }
  }
);

watch(
  () => formData.value.carbonNeutralYear,
  (newVal) => {
    if (newVal && formData.value.baseYear) {
      if (new Date(newVal) < new Date(formData.value.baseYear)) {
        formData.value.baseYear = '';
      }
    }
  }
);

// 生命周期
onMounted(() => {
  fetchOrgListByUser();
  fetchStandards();
});

// 方法定义
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
  nextTick(() => {
    resetFields();
    if (record && Object.keys(record).length > 0) {
      console.log(record,'record');
      Object.assign(formData.value, record);
      formData.value.baseYear = '' + formData.value.baseYear;
      formData.value.carbonNeutralYear = '' + formData.value.carbonNeutralYear;

      if (formData.value.stageList) {
        formData.value.stageList.forEach((item) => {
          item.stageYear = '' + item.stageYear;
        });
      }

      editBaseYear.value = true;
    }
  });
}

/**
 * 获取标准的范围
 */
function getChildrenStandardScopes(value) {
  if (value) {
    const selectedStandard = standards.value.find((item) => item.key === value);
    if (selectedStandard && selectedStandard.children) {
      formData.value.planCarbonEmissionScopeList = JSON.parse(JSON.stringify(selectedStandard.children));
      formData.value.planCarbonEmissionScopeList.forEach((item) => {
        item.childrenStandardId = item.key;
        item.childrenStandardChildren = item.children;
        item.childrenStandardValue = null;
      });

      if (formData.value.stageList) {
        formData.value.stageList.forEach((item) => {
          item.stageCarbonEmissionScopeList = JSON.parse(JSON.stringify(formData.value.planCarbonEmissionScopeList));
        });
      }

      // 获取组织 标准 基准年下的数据
      getBaseYearOrgData();
    }
  }
}

/**
 * 获取组织 标准 基准年下的数据
 */
function getBaseYearOrgData() {
  if (formData.value.planDeptId && formData.value.standardId && formData.value.baseYear) {
    // 基准年营收
    getOrgRevenue({
      deptId: formData.value.planDeptId,
      year: formData.value.baseYear,
    }).then((res) => {
      if (res.success) {
        formData.value.baseYearRevenue = res.result;
      } else {
        formData.value.baseYearRevenue = 0;
        formData.value.baseYearRevenueIntensity = 0;
      }
    });

    // 基准年碳排量
    getOrgCarbonEmission({
      deptId: formData.value.planDeptId,
      standardId: formData.value.standardId,
      year: formData.value.baseYear,
    }).then((res) => {
      if (res.success) {
        formData.value.baseYearCarbonEmissions =
          res.result && res.result[formData.value.standardId] !== undefined ? res.result[formData.value.standardId] : 0;

        if (formData.value.baseYearRevenue !== 0 && formData.value.baseYearCarbonEmissions !== 0) {
          formData.value.baseYearRevenueIntensity = (formData.value.baseYearCarbonEmissions / formData.value.baseYearRevenue).toFixed(2);
        }

        formData.value.planCarbonEmissionScopeList.forEach((item) => {
          let childrenStandardValueSum = 0;
          if (item.childrenStandardChildren) {
            item.childrenStandardChildren.forEach((children) => {
              childrenStandardValueSum = childrenStandardValueSum + (res.result[children.key] ? res.result[children.key] : 0);
            });
          }
          item.childrenStandardValue = childrenStandardValueSum;
        });
      } else {
        createMessage.warn(t('carbon.message.No_org_standard_data'));
        formData.value.baseYearCarbonEmissions = 0;
        formData.value.baseYearRevenueIntensity = 0;
        formData.value.planCarbonEmissionScopeList.forEach((item) => {
          item.childrenStandardValue = 0;
        });
      }
    });
  } else {
    formData.value.baseYearCarbonEmissions = 0;
    formData.value.baseYearRevenue = 0;
    formData.value.baseYearRevenueIntensity = 0;
    formData.value.planCarbonEmissionScopeList.forEach((item) => {
      item.childrenStandardValue = 0;
    });
  }
}

/**
 * 计算阶段的单位营收强度
 */
function calStageIntensity(index) {
  const stageItem = formData.value.stageList[index];
  if (stageItem.targetYearCarbonEmissions && stageItem.targetYearRevenue) {
    stageItem.targetYearRevenueIntensity = (stageItem.targetYearCarbonEmissions / stageItem.targetYearRevenue).toFixed(2);
  } else {
    stageItem.targetYearRevenueIntensity = '0';
  }
}

/**
 * 碳排计划-保存
 */
async function onSave() {
  // try {
  //   await validate();
  // } catch ({ errorFields }) {
  //   if (errorFields) {
  //     const firstField = errorFields[0];
  //     if (firstField && formRef.value) {
  //       formRef.value.scrollToField(firstField.name, { behavior: 'smooth', block: 'center' });
  //     }
  //   }
  //   return Promise.reject(errorFields);
  // }

  confirmLoading.value = true;
  await saveOrUpdate(formData.value, false)
    .then((res) => {
      if (res.success) {
        createMessage.success(res.message);
        onBack();
      } else {
        createMessage.error(res.message);
      }
    })
    .finally(() => {
      confirmLoading.value = false;
    });
}

/**
 * 返回
 */
function onBack() {
  emit('back');
}

/**
 * 获取所有下级组织信息(包含本身)
 */
function fetchOrgListByUser() {
  getOrgListByUser().then((res) => {
    if (res.success) {
      depts.value = res.result;
    }
  });
}

/**
 * 获取核算标准
 */
function fetchStandards() {
  getStandardList({
    pcode: 'A01',
    async: false,
  }).then((res) => {
    if (res.success) {
      standards.value = res.result;
    }
  });
}

/**
 * 添加阶段
 */
function onAddStage() {
  // 添加阶段 只校验基准年和碳中和年
  if (!formData.value.baseYear || !formData.value.carbonNeutralYear) {
    createMessage.error('请先选择基准年和碳中和年后添加阶段数据');
    return;
  }

  editBaseYear.value = true;

  if (formData.value.planCarbonEmissionScopeList) {
    const stageCarbonEmissionScopes = JSON.parse(JSON.stringify(formData.value.planCarbonEmissionScopeList));
    stageCarbonEmissionScopes.forEach((item) => {
      item.childrenStandardValue = null;
      item.id = null;
    });

    formData.value.stageList.push({
      stageYear: '',
      targetYearCarbonEmissions: '',
      targetYearRevenue: '',
      targetYearRevenueIntensity: '',
      stageCarbonEmissionScopeList: stageCarbonEmissionScopes,
    });
  } else {
    formData.value.stageList.push({
      stageYear: '',
      targetYearCarbonEmissions: '',
      targetYearRevenue: '',
      targetYearRevenueIntensity: '',
      stageCarbonEmissionScopeList: [{}],
    });
  }
}

/**
 * 删除阶段
 */
function deleteStage(index) {
  setTimeout(() => {
    formData.value.stageList.splice(index, 1);
  }, 100);

  if (formData.value.stageList && formData.value.stageList.length === 0) {
    editBaseYear.value = false;
  }
}

// 暴露方法给父组件
defineExpose({
  add,
  edit,
  switchShow,
  onSave,
  onBack,
});
</script>

<style lang="less" scoped>
.colorse{
  color: @primary-color;
}
.topsw {
  padding: 24px;
  background: #ffffff;
  margin-top: 24px;
}

:deep(.table-page-search-wrapper .ant-form-inline .ant-form-item) {
  margin-bottom: 44px;
}

:deep(.ant-form-item) {
  margin-bottom: 44px;
}

.cardHeader {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
  height: 64px;
  background: #ffffff;

  .cardHeader_backBox {
    position: absolute;
    top: 50%;
    left: 24px;
    transform: translateY(-50%);
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #000000;
  }

  .cardHeader_icon {
    width: 16px;
    height: 16px;
  }

  .cardHeader_numBox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.4);
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.4);
  }

  .cardHeader_numBox_active {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #148958;
    border: 1px solid #148958;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
  }

  .cardHeader_numBox_end {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid #148958;
  }

  .cardHeader_textBox {
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.4);
  }

  .cardHeader_textBox_active {
    color: #148958;
  }

  .cardHeader_hrBox {
    width: 344px;
    height: 2px;
    background: #dcdcdc;
  }

  .cardHeader_hrBox_active {
    background: #148958;
  }
}

.cardBox {
  margin: 24px auto 0;
  width: 100%;
  overflow: hidden;
  padding: 20px 64px;
  background: #ffffff;
  border-radius: 3px;
}

.stageClass {
  background-color: #f5f7f6;
  padding: 10px;
  margin-top: 10px;
}

.optionBox {
  margin-top: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;

  .optionItem_save {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 55px;
    height: 32px;
    background: #ffffff;
    border-radius: 3px;
    border: 1px solid @primary-color;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: @primary-color;
    cursor: pointer;
  }
}
</style>
