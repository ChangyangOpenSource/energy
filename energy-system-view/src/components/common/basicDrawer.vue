<template>
  <div class="centeet">
    <a-drawer
        :title="title"
        placement="right"
        :visible="visible"
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
        <a-form-item :label="t('carbon.message.Emission_source')" name="name">
          <a-input
              :disabled="formDisabled"
              :placeholder="t('carbon.message.Please_enter')"
              v-model:value="form.name"
          />
        </a-form-item>

        <div class="standard" v-if="standardCode == 'A01A01' && visible">
          <div class="standard-select">
            {{ t('carbon.message.GHG_category') }}
            <a-tree-select
                :disabled="formDisabled"
                allowClear
                style="width: 100%"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :placeholder="t('carbon.message.Please_select')"
                v-model:value="form.standardGhgDetailId"
                :treeData="standardGhgData"
                @change="onChange"
                treeDefaultExpandAll
            />
          </div>
          <img src="@/assets/carbon/img9.png"/>

          <div class="standard-select">
            {{ t('carbon.message.ISO_category')}}
            <a-tree-select
                :disabled="true"
                allowClear
                style="width: 100%"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :placeholder="t('carbon.message.Please_select')"
                v-model:value="form.standardIsoDetailId"
                :treeData="standardIsoData"
                treeDefaultExpandAll
            />
          </div>
        </div>

        <div class="standard" v-if="standardCode == 'A01A02' && visible">
          <div class="standard-select">
            {{ t('carbon.message.ISO_category')}}
            <a-tree-select
                allowClear
                style="width: 100%"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :placeholder="t('carbon.message.Please_select')"
                v-model:value="form.standardIsoDetailId"
                :treeData="standardIsoData"
                treeDefaultExpandAll
                @change="onChange"
            />
          </div>
          <img src="@/assets/carbon/img9.png"/>
          <div class="standard-select">
            {{ t('carbon.message.GHG_category') }}
            <a-tree-select
                :disabled="true"
                allowClear
                style="width: 100%"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :placeholder="t('carbon.message.Please_select')"
                v-model:value="form.standardGhgDetailId"
                :treeData="standardGhgData"
                treeDefaultExpandAll
            />
          </div>
        </div>

        <a-form-item :label="t('carbon.message.facilities_activities')" name="activitieId">
          <a-select
              style="width: 100%"
              v-model:value="form.activitieId"
              :placeholder="t('carbon.message.Please_select')"
              :disabled="formDisabled"
              optionFilterProp="children"
              showSearch
              allowClear
          >
            <a-select-option
                v-for="activity in activitieList"
                :key="activity.id"
                :value="activity.id"
            >
              {{ activity.name }}
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
              v-if="visible"
              :disabled="formDisabled"
              :unitId="form.dataUnit"
              v-model:value="form.dataUnit"
              @change="dataUnitChange"
          />
        </a-form-item>

        <a-form-item :label="t('carbon.message.Carbon_emission_factor')" name="carbonDataId">
          <div class="tianjia" v-if="!form.carbonDataId">
            <div class="color">{{ t('carbon.message.please_add_factor') }}</div>
            <div>
              <a-button @click="handleAdd" class="leftShoudong">
                {{ t('carbon.message.Manually_add') }}
              </a-button>
              <a-button @click="handleAdd(1)" class="leftChaxun marRight">
                {{ t('carbon.message.Select_factor') }}
              </a-button>
            </div>
          </div>
          <div v-else>
            <yzCard :item="selectedRows"/>
            <div class="manual">
              <div class="manualOperation" @click="handleAdd" v-if="!formDisabled">
                <img src="../../assets/carbon/img9.png" alt=""/>
                {{ t('carbon.message.Manually_add') }}
              </div>
              <div class="manualOperation" @click="handleAdd(1)" v-if="!formDisabled">
                <img src="../../assets/carbon/img10.png" alt=""/>
                {{ t('carbon.message.Add_again') }}
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
      </a-form>

      <div class="drawerOptionBox">
        <a-button style="margin-right: 8px" @click="onClose">
          {{ t('carbon.message.Cancel') }}
        </a-button>
        <a-button type="primary" @click="onSubmit" :disabled="formDisabled">
          {{ t('carbon.message.Confirm') }}
        </a-button>
      </div>
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

    <a-modal
        :title="t('carbon.message.manually_add_carbon_emission_factors')"
        :visible="visible3"
        @ok="handleOk3"
        @cancel="handleCancel"
        :width="1000"
    >
      <yzAddView ref="yzAddViewRef" v-if="visible3"/>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import yzAddView from './yzAddView.vue';
import yzChooseView from './yzChooseView.vue';
import yzCard from './yzCard2.vue';
import UnitCascader from './UnitCascader.vue';
import JDictSelectTag from '@/components/Form/src/jeecg/components/JDictSelectTag.vue';
// 导入API方法
import {
  getEmissionSourceDetail,
  addEmissionSource,
  editEmissionSource,
  queryConversionByMainStandardId,
  getAllUnitGroups,
  getUnitConvertValue,
  getFactorInfo,
  addEmissionFactorCheck,
  loadCategoryTreeRoot,
  getAllActivities
} from './api/basicDrawer';

// Props
const props = defineProps({
  formDisabled: {
    type: Boolean,
    default: false,
  },
  standardCode: {
    type: String,
    default: undefined,
  },
  standardDetailId: {
    type: String,
    default: undefined,
  },
});

// Emits
const emit = defineEmits(['onCloseBasicDrawerVisible']);

// 国际化和消息
const { t } = useI18n();
const { createMessage } = useMessage();

// Refs
const formRef = ref();
const yzAddViewRef = ref();

// Reactive data
const title = ref('');
const visible = ref(false);
const standardIsoData = ref([]);
const standardGhgData = ref([]);
const selectedRows = ref({});
const cachesSlectedRows = ref({});
const province = ref({ unitCode: '' });
const getAllUnitByGroupData = ref({});
const activitieList = ref([]);
const visible2 = ref(false);
const visible3 = ref(false);

const labelCol = { span: 6 };
const wrapperCol = { span: 18 };

const form = reactive({
  id: '',
  name: '', //设施/活动名称
  source: '', //排放源
  type: undefined, //排放类型(emission_type字典)
  dataUnit: undefined, //活动数据单位
  carbonDataId: undefined, //选择的碳排因子id
  ratio: '', //转换倍率
  standardIsoDetailId: '',
  standardGhgDetailId: '',
  carbonData: '',
  carbonMolecule: '',
  carbonDenomintor: '',
  dataUnitText: '',
  activitieId: undefined,
});

const rules = {
  name: [{ required: true, message: t('carbon.message.Please_enter_the_name_of_the_emission_source'), trigger: 'blur' }],
  activitieId: [{ required: true, message: t('carbon.message.please_select_activitie'), trigger: 'blur' }],
  type: [
    { required: true, message: t('carbon.message.please_select_the_emission_type'), trigger: 'blur' },
  ],
  dataUnit: [
    { required: true, message: t('carbon.message.please_select_the_active_data_unit'), trigger: 'blur' },
  ],
  carbonDataId: [
    { required: true, message: t('carbon.message.please_select_a_carbon_emission_factor'), trigger: 'blur' },
  ],
  ratio: [{ required: true, message: t('carbon.message.please_fill_in_the_conversion_ratio'), trigger: 'blur' }],
};

// Methods
const add = () => {
  Object.keys(form).forEach(key => {
    form[key] = '';
  });

  console.log("standardDetailId:", props.standardDetailId)
  if (props.standardCode != null) {
    if (props.standardCode == "A01A02") {
      form.standardIsoDetailId = props.standardDetailId;
    } else {
      form.standardGhgDetailId = props.standardDetailId;
    }
    queryByMainStandardId(props.standardDetailId);
  }

  province.value = { unitCode: '' };
  title.value = t('carbon.message.New_emission_source');
  visible.value = true;
};

const edit = (id) => {
  getEmissionSourceDetail({ id: id }).then((res) => {
    if (res.success) {
      Object.assign(form, res.result);
      listInfo();
      initUnit(form.dataUnit);
    }
  });
  title.value = t('carbon.message.edit_facilities_activities');
  visible.value = true;
};

const onChange = (val) => {
  if (!val) {
    return;
  }
  queryByMainStandardId(val);
};

const queryByMainStandardId = (id) => {
  queryConversionByMainStandardId({ mainStandardId: id }).then(res => {
    if (res.success) {
      // 设置字段值
      if (props.standardCode == "A01A02") {
        form.standardGhgDetailId = res.result.convertId;
      } else {
        form.standardIsoDetailId = res.result.convertId;
      }
    } else {
      if (props.standardCode == "A01A02") {
        form.standardGhgDetailId = '';
      } else {
        form.standardIsoDetailId = '';
      }
    }
  });
};

const loadRoot = () => {
  console.log("loadRoot")
  loadCategoryTreeRoot({ async: false, pcode: 'A01' }).then(res => {
    if (res.success) {
      handleTreeNodeValue(res.result);
      standardIsoData.value = [res.result[1]];
      standardGhgData.value = [res.result[0]];
    } else {
      createMessage.error(res.message);
    }
  });
};

const handleTreeNodeValue = (result) => {
  for (let i of result) {
    i.value = i['key'];
    i.key = i['key'];
    i.isLeaf = (!i.leaf) ? false : true;
    i.selectable = i.leaf ? true : false; //是否可选
    i.checkable = i.leaf ? true : false; //设置独立节点是否展示 Checkbox
    if (i.children && i.children.length > 0) {
      handleTreeNodeValue(i.children);
    }
  }
};

const onselectedRows = (value) => {
  cachesSlectedRows.value = value;
};

const handleOk3 = () => {
  if (yzAddViewRef.value && !yzAddViewRef.value.checkFormData()) {
    return;
  }

  const queryParam = yzAddViewRef.value.queryParam;
  if (!queryParam) return;

  addEmissionFactorCheck(queryParam).then((res) => {
    if (res.success) {
      createMessage.success(t('carbon.message.operation_success'));
      form.carbonDataId = res.result;
      console.log("form.carbonDataId:", form.carbonDataId)
      listInfo();
    }
  });
};

/**
 * 获取因子数据
 */
const listInfo = () => {
  if (!form.carbonDataId) {
    return;
  }

  getFactorInfo({
    id: form.carbonDataId
  }).then((res) => {
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
};

/**
 * 活动数据单位list
 */
const loadData = () => {
  // 单位
  getAllUnitGroups().then((res) => {
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
const onSubmit = async () => {
  try {
    await formRef.value?.validate();

    if (props.standardCode == "A01A02" && !form.standardIsoDetailId) {
      createMessage.error(t('carbon.message.Please_select_category'));
      return;
    }

    if (props.standardCode == "A01A01" && !form.standardGhgDetailId) {
      createMessage.error(t('carbon.message.Please_select_category'));
      return;
    }

    let requestUrl = form.id ? editEmissionSource : addEmissionSource;

    form.carbonData = selectedRows.value.factorValue;
    form.carbonMolecule = selectedRows.value.numeratorUnit;
    form.carbonDenomintor = selectedRows.value.denominatorUnit;

    requestUrl(form).then((res) => {
      if (res.success) {
        createMessage.success(t('carbon.message.operation_success'));
        emit('onCloseBasicDrawerVisible', false);
        visible.value = false;
      }
    });
  } catch (error) {
    console.error('Validation failed:', error);
  }
};

const handleOk2 = () => {
  selectedRows.value = cachesSlectedRows.value;
  form.carbonDataId = cachesSlectedRows.value.id;
  unitChange();
  visible2.value = false;
};

const handleCancel = () => {
  visible2.value = false;
  visible3.value = false;
};

//打开抽屉
const handleAdd = (value?: number) => {
  if (value == 1) {
    // 选择因子
    visible2.value = true;
  } else {
    // 手动添加
    visible3.value = true;
  }
};

const initUnit = (e) => {
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

//活动单位
const initUnitChange = (e) => {
  for (let key in getAllUnitByGroupData.value) {
    let value = getAllUnitByGroupData.value[key];
    for (let index = 0; index < value.length; index++) {
      if (value[index].id == e) {
        province.value = value[index];
      }
    }
  }
};

const dataUnitChange = (e) => {
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

const unitChange = () => {
  if (province.value?.unitCode && selectedRows.value?.denominatorUnit) {
    if (province.value.unitCode == selectedRows.value.denominatorUnit) {
      form.ratio = '1';
    } else {
      getUnitConvertValue({
        sourceUnit: province.value.unitCode,
        targetUnit: selectedRows.value.denominatorUnit
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
  visible.value = false;
};

// Lifecycle
onMounted(() => {
  loadData();
  loadRoot();
});

// Watchers
watch(() => props.standardCode, () => {
  if (visible.value) {
    loadRoot();
  }
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
  width: 380px;
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

  .marRight {
    margin-left: 16px;
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
  background: #148958 !important;
  color: #fff !important;
}

.leftChaxun:hover {
  background: #148958 !important;
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
    //上下居中
    margin-top: 30px;
  }
}
</style>
