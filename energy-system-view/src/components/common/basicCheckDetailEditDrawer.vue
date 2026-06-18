<template>
  <div class="centeet">
    <a-drawer
        :title="basicDrawerString"
        placement="right"
        :visible="basicCheckDetailEditVisible"
        :width="600"
        @close="onClose"
    >
      <a-form
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :rules="rules"
          ref="formRef"
          :model="form"
          labelAlign="left"
      >
        <a-form-item :label="t('carbon.message.Emission_source')" name="emissionSourceName">
          <a-input
              id="error"
              :placeholder="t('carbon.message.Please_enter')"
              v-model:value="form.emissionSourceName"
              :disabled="formDisabled"
          />
        </a-form-item>

        <a-form-item :label="t('carbon.message.facilities_activities')" name="activitieId">
          <a-select
              @change="onChangeActivitie"
              v-model:value="form.activitieId"
              :disabled="formDisabled"
              :placeholder="t('carbon.message.Please_select')"
          >
            <a-select-option v-for="item in activitieList" :key="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :label="t('carbon.message.Emission_type')" name="type">
          <j-dict-select-tag
              style="width: 100%"
              v-model:value="form.type"
              dict-code="emission_type"
              :showChooseOption="false"
              :placeholder="t('carbon.message.Please_select')"
              :disabled="formDisabled"
          />
        </a-form-item>

        <a-form-item :label="t('carbon.message.Active_data_unit')" name="dataUnit">
          <UnitCascader
              v-if="basicCheckDetailEditVisible"
              :disabled="formDisabled"
              :unitId="form.dataUnit"
              v-model:value="form.dataUnit"
              @change="(value, label) => dataUnitChange(value, label)"
          />
        </a-form-item>

        <a-form-item :label="t('carbon.message.Emission_factor')" required>
          <div v-if="!form.carbonDataId" class="tianjia">
            <div class="color">{{ t('carbon.message.please_add_factor') }}</div>
            <div>
              <a-button
                  class="leftShoudong"
                  @click="handleAdd('addYZ')"
              >
                {{ t('carbon.message.Manually_add') }}
              </a-button>
              <a-button
                  class="leftChaxun"
                  @click="handleAdd('chooseYZ')"
              >
                {{ t('carbon.message.Select_factor') }}
              </a-button>
              <a-button
                  class="leftChaxun"
                  @click="handleAdd('Supplier')"
              >
                {{ t('carbon.message.Select_supplier_data') }}
              </a-button>
            </div>
          </div>

          <div v-else>
            <yzCard :item="selectedRows"/>
            <div v-if="!formDisabled" class="manual">
              <div class="manualOperation m_hoverCP" @click="handleAdd('addYZ')">
                <img alt="" src="@/assets/carbon/img9.png"/>{{ t('carbon.message.Manually_add') }}
              </div>
              <div
                  v-if="!formDisabled"
                  class="manualOperation m_hoverCP"
                  @click="handleAdd('chooseYZ')"
              >
                <img alt="" src="@/assets/carbon/img10.png"/>{{ t('carbon.message.Select_again') }}
              </div>
              <div
                  v-if="!formDisabled"
                  class="manualOperation m_hoverCP"
                  @click="handleAdd('Supplier')"
              >
                <img alt="" src="@/assets/carbon/img10.png"/>{{ t('carbon.message.Select_supplier_data') }}
              </div>
            </div>
          </div>
        </a-form-item>

        <a-form-item :label="t('carbon.message.Unit_proportional_conversion')" name="ratio">
          <div></div>
          <div class="">
            1{{ province?.unitCode || '' }}
            <span class="color1">({{ t('carbon.message.Active_data_unit') }})</span>=
            <a-input
                id="error"
                v-model:value="form.ratio"
                class="inpts"
                :placeholder="t('carbon.message.Please_enter')"
                :disabled="formDisabled"
            />
            {{ selectedRows.denominatorUnit }}
            <span class="color1"> ({{ t('carbon.message.Factor_denominator_unit') }})</span>
          </div>
        </a-form-item>

        <a-form-item :label="t('carbon.message.Active_data')" v-if="!isTemplate">
          <div class="">
            <a-input
                id="error"
                v-model:value="form.data"
                class="inpts"
                :placeholder="t('carbon.message.Please_enter')"
                :disabled="formDisabled"
            />
            1{{ province?.unitCode || '' }}
          </div>
        </a-form-item>

        <a-form-item :label="t('carbon.message.Attachment')" v-if="!isTemplate">
          <j-upload
              v-model:value="form.dataVoucher"
              :disabled="formDisabled"
              :number="1"
          />
        </a-form-item>

        <div class="drawerOptionBox">
          <a-button style="margin-right: 8px" @click="onClose" :disabled="formDisabled">
            {{ t('carbon.message.Cancel') }}
          </a-button>
          <a-button type="primary" @click="onSubmit" :disabled="formDisabled">
            {{ t('carbon.message.Confirm') }}
          </a-button>
        </div>
      </a-form>
    </a-drawer>

    <!--选择碳排因子弹窗-->
    <a-modal
        :title="t('carbon.message.selective_carbon_emission_factor')"
        :visible="visible2"
        @ok="handleOk2"
        @cancel="handleCancel"
        :width="1524"
    >
      <yzChooseView @onselectedRows="onselectedRows" v-if="visible2"/>
    </a-modal>

    <!--手动添加碳排因子弹窗-->
    <a-modal
        :title="t('carbon.message.manually_add_carbon_emission_factors')"
        :visible="visible3"
        @ok="handleOk3"
        @cancel="handleCancel"
        :width="1000"
    >
      <yzAddView ref="yzAddViewRef" v-if="visible3"/>
    </a-modal>

    <!--选择供应数据弹窗-->
    <a-modal
        :visible="visible4"
        :width="1000"
        :title="t('carbon.message.Select_supplier_data')"
        @cancel="handleCancel"
        @ok="handleOk4"
    >
      <Supplier v-if="visible4" ref="supplierRef" @onselectedRows="onselecGysx"/>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import {
  getAllUnitByGroup,
  getAllActivities,
  getConvertValue,
  saveOrUpdate,
  getFactorInfo,
  addEmissionFactor,
  getSupplierCarbonDataById
} from './api/basicCheckDetailEditDrawer.api.ts';
import yzAddView from './yzAddView.vue';
import yzChooseView from './/yzChooseView.vue';
import yzCard from './/yzCard2.vue';
import Supplier from './Supplier.vue';
import UnitCascader from "./UnitCascader.vue";
import JDictSelectTag from '@/components/Form/src/jeecg/components/JDictSelectTag.vue';
import JUpload from '@/components/Form/src/jeecg/components/JUpload/JUpload.vue';



// Props
const props = defineProps({
  isTemplate: {
    type: Boolean,
    default: false
  },
  formDisabled: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(['onCloseBasicCheckDetailEditVisible']);

// 国际化和消息
const { t } = useI18n();
const { createMessage } = useMessage();

// Refs
const formRef = ref<any>(null);
const yzAddViewRef = ref<any>(null);
const supplierRef = ref<any>(null);

// Reactive data
const basicDrawerString = ref('');
const basicCheckDetailEditVisible = ref(false);
const selectedRows = ref<any>({});
const cachesSlectedRows = ref<any>({});
const province = ref<any>({ unitCode: '' });
const getAllUnitByGroupData = ref<Record<string, any[]>>({});
const activitieList = ref<any[]>([]);
const visible2 = ref(false);
const visible3 = ref(false);
const visible4 = ref(false);

const labelCol = { span: 6 };
const wrapperCol = { span: 18 };

let form = reactive<any>({
  emissionSourceName: '',
  activitieId: undefined,
  type: undefined,
  dataUnit: undefined,
  carbonDataId: undefined,
  ratio: '',
  data: '',
  dataVoucher: '',
  dataUnitText: '',
  activitieName: ''
});

const rules = {
  emissionSourceName: [{
    required: true,
    message: t('carbon.message.please_fill_in_the_template_name'),
    trigger: 'blur'
  }],
  activitieId: [{
    required: true,
    message: t('carbon.message.please_select_activitie'),
    trigger: 'blur'
  }],
  type: [
    {
      required: true,
      message: t('carbon.message.please_select_the_emission_type'),
      trigger: 'blur'
    },
  ],
  dataUnit: [
    {
      required: true,
      message: t('carbon.message.please_select_the_active_data_unit'),
      trigger: 'blur'
    },
  ],
  carbonDataId: [
    {
      required: true,
      message: t('carbon.message.please_select_a_carbon_emission_factor'),
      trigger: 'blur'
    },
  ],
  ratio: [{
    required: true,
    message: t('carbon.message.please_fill_in_the_conversion_ratio'),
    trigger: 'blur'
  }],
};

// Methods
const add = (from: any) => {
  console.log("add1111111111",from)
  basicDrawerString.value = t('carbon.message.New_emission_source');
  Object.assign(form, from);
  form = from;
  province.value = {};
  basicCheckDetailEditVisible.value = true;
};

const edit = (from: any) => {
  basicDrawerString.value = t('carbon.message.Edit_emission_sources');
  Object.assign(form, JSON.parse(JSON.stringify(from)));
  listInfo();
  initUnit(form.dataUnit);
  basicCheckDetailEditVisible.value = true;
};

/**
 * 打开选择碳排因子弹窗
 * 手动添加碳排因子弹窗
 */
const handleAdd = (type: string) => {
  if (type == 'chooseYZ') {
    // 选择因子
    visible2.value = true;
  }
  if (type == 'addYZ') {
    // 手动添加因子
    visible3.value = true;
  }
  if (type == 'Supplier') {
    // 手动添加因子
    visible4.value = true;
  }
};

const onselectedRows = (value: any) => {
  cachesSlectedRows.value = value;
};

const handleOk3 = () => {
  if (yzAddViewRef.value && !yzAddViewRef.value.checkFormData()) {
    return;
  }

  const queryParam = yzAddViewRef.value?.queryParam;
  if (!queryParam) return;

  addEmissionFactor(queryParam).then((res) => {
    if (res.success) {
      createMessage.success(t('carbon.message.operation_success'));
      form.carbonDataId = res.result;
      listInfo();
    }
  });
};

const handleOk4 = () => {
  cachesSlectedRows.value.emissionFactorType = 2;
  cachesSlectedRows.value.denominatorUnit = cachesSlectedRows.value.productUnitId_dictText;
  selectedRows.value = cachesSlectedRows.value;

  form.carbonDataId = cachesSlectedRows.value.id;
  form.factorValue = cachesSlectedRows.value.carbonEmissions;
  form.emissionFactorUnit = cachesSlectedRows.value.carbonEmissionsUnitId_dictText;
  form.emissionFactorType = 2;
  unitChange(form.flowUnitName, selectedRows.value.productUnitId_dictText);
  visible4.value = false;
};

/**
 * 选择供应链
 * @param value
 */
const onselecGysx = (value: any) => {
  cachesSlectedRows.value = value;
};

/**
 * 获取因子数据
 */
const listInfo = () => {
  if (!form.carbonDataId) {
    return;
  }

  if (form.emissionFactorType == 2) {
    // 基本信息-碳排因子(查询供应商碳数据详情)
    getSupplierCarbonDataById({ supplierCarbonDataId: form.carbonDataId }).then((res) => {
      selectedRows.value = res.result;
      selectedRows.value.emissionFactorType = 2;
    });
  } else {
    getFactorInfo({ id: form.carbonDataId }).then((res) => {
      if (res.success) {
        selectedRows.value = {
          id: res.result.emissionFactorObject.id,
          name: res.result.emissionFactorObject.name,
          model: res.result.emissionFactorObject.model,
          factorValue: res.result.emissionFactorDataObject.factorValue,
          numeratorUnit: res.result.emissionFactorDataObject.numeratorUnit,
          denominatorUnit: res.result.emissionFactorDataObject.denominatorUnit,
          releaseOrg: res.result.emissionFactorObject.releaseOrg,
          releaseYear: res.result.emissionFactorObject.releaseYear,
        };
        visible3.value = false;
      }
    });
  }
};

/**
 * 活动数据单位list
 */
const initDate = () => {
  // 单位
  getAllUnitByGroup().then((res) => {
    if (res.success) {
      getAllUnitByGroupData.value = res.result || {};
      initUnitChange(form.dataUnit);
    }
  });

  /**
   * 查询所有活动设施
   */
  getAllActivities().then((res) => {
    if (res.success) {
      activitieList.value = res.result;
    }
  });
};

/**
 * 添加修改
 */
const onSubmit = () => {
  formRef.value?.validate().then(() => {
    form.carbonData = selectedRows.value.factorValue;
    form.carbonMolecule = selectedRows.value.numeratorUnit;
    form.carbonDenomintor = selectedRows.value.denominatorUnit;
    form.divisor = selectedRows.value.numeratorUnit;

    saveOrUpdate(form).then((res) => {
      if (res.success) {
        createMessage.success(t('carbon.message.operation_success'));
        onClose();
      }
    });
  }).catch(() => {
    // Validation failed
  });
};

const handleOk2 = () => {
  selectedRows.value = cachesSlectedRows.value;
  form.carbonDataId = cachesSlectedRows.value.id;
  form.emissionFactorType = 1;
  unitChange();
  visible2.value = false;
};

const handleCancel = () => {
  visible2.value = false;
  visible3.value = false;
  visible4.value = false;
};

//活动单位
const initUnitChange = (e: string) => {
  for (let key in getAllUnitByGroupData.value) {
    let value = getAllUnitByGroupData.value[key];
    for (let index = 0; index < value.length; index++) {
      if (value[index].id == e) {
        province.value = value[index];
      }
    }
  }
};

const initUnit = (e: string) => {
  for (let key in getAllUnitByGroupData.value) {
    let value = getAllUnitByGroupData.value[key];
    for (let index = 0; index < value.length; index++) {
      if (value[index].id == e) {
        province.value = value[index];
      }
    }
  }
  form.dataUnitText = province.value.unitCode;
};

const dataUnitChange = (e: string) => {
  for (let key in getAllUnitByGroupData.value) {
    let value = getAllUnitByGroupData.value[key];
    for (let index = 0; index < value.length; index++) {
      if (value[index].id == e) {
        province.value = value[index];
        unitChange();
      }
    }
  }
  form.dataUnitText = province.value.unitCode;
};

const unitChange = (sourceUnit?: string, targetUnit?: string) => {
  if (province.value?.unitCode && selectedRows.value?.denominatorUnit) {
    const source = sourceUnit || province.value.unitCode;
    const target = targetUnit || selectedRows.value.denominatorUnit;

    if (source == target) {
      form.ratio = '1';
    } else {
      getConvertValue({
        sourceUnit: source,
        targetUnit: target
      }).then((res) => {
        if (res.success) {
          form.ratio = res.result;
        }
      });
    }
  }
};

//关闭
const onClose = () => {
  basicCheckDetailEditVisible.value = false;
  emit('onCloseBasicCheckDetailEditVisible', false);
};

const onChangeActivitie = () => {
  const selectedActivity = activitieList.value.find(item => item.id == form.activitieId);
  if (selectedActivity) {
    form.activitieName = selectedActivity.name;
  }
};

// Lifecycle
onMounted(() => {
  initDate();
});

// Expose methods
defineExpose({
  add,
  edit
});
</script>

<style lang="less" scoped>
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

.manual {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
}

.color1 {
  color: #888888;
}

.inpts {
  width: 80px !important;
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
    border-color: @primary-color !important;
    color: @primary-color !important;
  }

  .leftChaxun {
    margin-left: 16px;
    background: @primary-color !important;
    color: #fff !important;
  }

  .leftChaxun:hover {
    background: @primary-color !important;
    color: #fff !important;
  }
}

.tables {
  padding: 24px;
  background: #ffffff;
  border-radius: 3px 3px 3px 3px;
  border: 1px solid #eeeeee;
  margin-top: 24px;
}

.top {
  background: #ffffff;
  border-radius: 3px 3px 3px 3px;
  padding: 24px 24px 0;
}

.marbton {
  margin-bottom: 24px;
}

.leftChaxun {
  background: @primary-color !important;
  color: #fff !important;
}

.leftChaxun:hover {
  background: @primary-color !important;
  color: #fff !important;
}

.standard {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-bottom: 24px;

  .standard-select {
    width: 45%;
  }

  img {
    height: 100%;
    margin-top: 30px;
  }
}
</style>
