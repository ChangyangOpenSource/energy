<template>
  <div>
    <a-drawer :body-style="{ paddingBottom: '80px' }" :title="drawerTitle" :visible="visible" :width="700" @close="onClose">
      <a-tabs v-model:activeKey="activeKey" @change="onChangeActiveKey">
        <a-tab-pane key="1" force-render :tab="t('carbon.message.Basic_information')">
          <a-form :label-col="labelCol" :model="formObj" :wrapper-col="wrapperCol" label-align="left">
            <a-form-item :label="t('carbon.message.Name')" required>
              <a-input
                v-model:value="formObj.emissionSourceName"
                :disabled="disabled"
                allow-clear
                :placeholder="t('carbon.message.Please_enter')"
              ></a-input>
            </a-form-item>

            <a-form-item :label="t('carbon.message.Type')" required>
              <a-select
                v-model:value="formObj.emissionSourceType"
                :disabled="disabled"
                :filter-option="filterOption"
                allow-clear
                :placeholder="t('carbon.message.Please_select')"
                show-search
                style="width: 100%"
                @change="onChangeFlowType"
              >
                <a-select-option v-for="(item, index) in product_typeData" :key="index" :value="item.value">
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item :label="t('carbon.message.Unit')" required>
              <UnitCascader
                v-if="visible"
                :unit-id="formObj.emissionSourceUnit"
                v-model:value="formObj.emissionSourceUnit"
                @change="onChangeFlowUnit"
              />
            </a-form-item>

            <a-form-item :label="t('carbon.message.Data_source')" required>
              <a-select
                v-model:value="formObj.dataSources"
                :disabled="disabled"
                :filter-option="filterOption"
                allow-clear
                :placeholder="t('carbon.message.Please_select')"
                show-search
                @change="onChangeFlowDataSources"
              >
                <a-select-option v-for="(item, index) in flow_data_sourcesData" :key="index" :value="item.value">
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item :label="t('carbon.message.Emission_factor')" required>
              <div v-if="!formObj.emissionFactorId" class="tianjia">
                <div class="color">{{ t('carbon.message.please_add_factor') }}</div>
                <div>
                  <a-button class="leftShoudong" @click="handleAdd('addYZ')">{{ t('carbon.message.Manually_add') }}</a-button>
                  <a-button class="leftChaxun" @click="handleAdd('chooseYZ')">{{ t('carbon.message.Select_factor') }}</a-button>
                </div>
              </div>
              <div v-else>
                <yz-card :item="selectedRows" />
                <div v-if="!disabled" class="manual">
                  <div class="manualOperation m_hoverCP" @click="handleAdd('addYZ')">
                    <img alt="" :src="img9" />{{ t('carbon.message.Manually_add') }}
                  </div>
                  <div class="manualOperation m_hoverCP" @click="handleAdd('chooseYZ')">
                    <img alt="" :src="img10" />{{ t('carbon.message.Select_again') }}
                  </div>
                </div>
              </div>
            </a-form-item>

            <a-form-item required>
              <template #label>
                {{ t('carbon.message.Unit_proportional_conversion') }}
                <a-tooltip :title="t('carbon.message.The_conversion_of_activity_data_units_to_factor_denominator_units_for_example_1t1000kg')">
                  <a-icon type="question-circle-o" />
                </a-tooltip>
              </template>
              <div class="box1">
                <div class="fleWarp">
                  <div class="box1_text1"> 1{{ formObj.emissionSourceUnitName }} </div>
                  <div class="box1_text2"> （{{ t('carbon.message.Active_data_unit') }}） </div>
                </div>
                <div class="box1_text3">=</div>
                <a-input-number
                  v-model:value="formObj.factorRatio"
                  :disabled="disabled"
                  allow-clear
                  :placeholder="t('carbon.message.Please_enter')"
                  style="width: 100px; margin-right: 4px"
                ></a-input-number>
                <div class="fleWarp">
                  <div class="box1_text1">
                    {{ formObj.emissionFactorId ? selectedRows.denominatorUnit : '' }}
                  </div>
                  <div class="box1_text2"> （{{ t('carbon.message.Factor_denominator_unit') }}） </div>
                </div>
              </div>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2" force-render :tab="t('carbon.message.Transport_information')">
          <a-form :label-col="labelCol" :model="formObj" :wrapper-col="wrapperCol" label-align="left">
            <a-form-item :label="t('carbon.message.Need_or_no_need_transportation')" required>
              <a-radio-group v-model:value="formObj.isTransport" :disabled="disabled" button-style="solid" @change="onChangeIsTransport">
                <a-radio-button :value="false">{{ t('carbon.message.No_need_to_transport') }}</a-radio-button>
                <a-radio-button :value="true">{{ t('carbon.message.Need_transportation') }}</a-radio-button>
              </a-radio-group>
            </a-form-item>

            <a-form-item v-if="formObj.isTransport" :label="t('carbon.message.Unit_of_weight_of_goods')" required>
              <div style="display: flex">
                <UnitCascader :unit-id="formObj.weightUnit" filter-name="质量" v-model:value="formObj.weightUnit" @change="onChangeWeightUnit" />
                <a-input-number
                  v-model:value="qianm"
                  :disabled="true"
                  :precision="2"
                  :step="0.01"
                  allow-clear
                  :placeholder="t('carbon.message.Please_enter')"
                  style="width: 41%"
                />
                <div style="width: 2%; display: inline-block"></div>
              </div>
            </a-form-item>
          </a-form>

          <template v-if="formObj.isTransport">
            <a-collapse v-model:activeKey="activeCollapseKey" :bordered="false">
              <template #expandIcon="props">
                <img v-if="props.isActive" alt="" class="collapseIcon" :src="img47" />
                <img v-else alt="" class="collapseIcon" :src="img46" />
              </template>
              <a-collapse-panel
                v-for="(transportItem, transportIndex) in formObj.transportList"
                :key="String(transportIndex)"
                :header="t('carbon.message.Road_section') + (transportIndex + 1)"
              >
                <template #extra>
                  <img v-if="transportIndex > 0" alt="" class="collapseIcon" :src="img33" @click="onDelTransport(transportIndex)" />
                </template>
                <a-form :label-col="labelCol" :model="formObj" :wrapper-col="wrapperCol" label-align="left">
                  <a-form-item :label="t('carbon.message.Means_of_transportation')" required>
                    <a-select
                      v-model:value="transportItem.vehicleId"
                      :disabled="disabled"
                      :filter-option="filterOption"
                      allow-clear
                      :placeholder="t('carbon.message.Please_select')"
                      show-search
                      @change="onChangeVehicleId($event, transportItem)"
                    >
                      <a-select-option v-for="(item, index) in vehicle_codeData" :key="index" :value="item.value">
                        {{ item.text }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-form-item :label="t('carbon.message.Emission_factor')" required>
                    <div v-if="!transportItem.emissionFactorId" class="tianjia">
                      <div class="color">
                        {{ t('carbon.message.please_add_factor') }}
                      </div>
                      <div v-if="!disabled">
                        <a-button class="leftShoudong" @click="handleAdd('addYZ', transportIndex)">{{ t('carbon.message.Manually_add') }} </a-button>
                        <a-button class="leftChaxun marRight" @click="handleAdd('chooseYZ', transportIndex)">
                          {{ t('carbon.message.Select_factor') }}
                        </a-button>
                      </div>
                    </div>
                    <div v-else>
                      <yz-card :item="transportItem.selectedRows" />
                      <div v-if="!disabled" class="manual">
                        <div class="manualOperation m_hoverCP" @click="handleAdd('addYZ', transportIndex)">
                          <img alt="" :src="img9" />{{ t('carbon.message.Manually_add') }}
                        </div>
                        <div class="manualOperation m_hoverCP" @click="handleAdd('chooseYZ', transportIndex)">
                          <img alt="" :src="img10" />{{ t('carbon.message.Select_again') }}
                        </div>
                      </div>
                    </div>
                  </a-form-item>

                  <a-form-item :label="t('carbon.message.Unit_proportional_conversion')" required>
                    <div class="box1">
                      <div class="fleWarp">
                        <div class="box1_text1"> 1{{ formObj.weightUnitName }}*{{ qianm }} </div>
                        <div class="box1_text2"> （{{ t('carbon.message.Active_data_unit') }}） </div>
                      </div>

                      <div class="box1_text3">=</div>
                      <a-input-number
                        v-model:value="transportItem.factorRatio"
                        :disabled="disabled"
                        allow-clear
                        :placeholder="t('carbon.message.Please_enter')"
                        style="width: 100px; margin-right: 4px"
                      ></a-input-number>
                      <div class="fleWarp">
                        <div class="box1_text1" v-if="transportItem.selectedRows">
                          {{ transportItem.emissionFactorId ? transportItem.selectedRows.denominatorUnit : '' }}
                        </div>
                        <div class="box1_text2"> （{{ t('carbon.message.Factor_denominator_unit') }}） </div>
                      </div>
                    </div>
                  </a-form-item>
                </a-form>
              </a-collapse-panel>
            </a-collapse>
            <div v-if="!disabled" class="addBtn m_hoverCP" @click="onAddTransport">
              {{ t('carbon.message.Add_road_section') }}
            </div>
          </template>
        </a-tab-pane>
      </a-tabs>
      <div class="drawerOptionBox">
        <a-button @click="onClose">{{ t('carbon.message.Cancel') }}</a-button>
        <a-button v-if="!disabled" style="margin-left: 8px" type="primary" @click="onSubmit"> {{ t('carbon.message.Confirm') }}</a-button>
      </div>
    </a-drawer>

    <!--选择碳排因子弹窗-->
    <a-modal
      v-model:visible="visible2"
      :width="1524"
      :title="t('carbon.message.selective_carbon_emission_factor')"
      @cancel="handleCancel"
      @ok="handleOk2"
    >
      <yz-choose-view v-if="visible2" @onselected-rows="onselectedRows" />
    </a-modal>

    <!--手动添加碳排因子弹窗-->
    <a-modal
      v-model:visible="visible3"
      :width="1000"
      :title="t('carbon.message.manually_add_carbon_emission_factors')"
      @cancel="handleCancel"
      @ok="handleOk3"
    >
      <yz-add-view v-if="visible3" ref="yzAddViewRef" />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { defHttp } from '/@/utils/http/axios';
import { cloneObject } from '/@/utils/index';
import yzCard from '/@/components/common/yzCard2.vue';
import yzChooseView from '/@/components/common/yzChooseView.vue';
import yzAddView from '/@/components/common/yzAddView.vue';
import UnitCascader from '/@/components/common/UnitCascader.vue';

// 导入图片资源
import img9 from '@/assets/carbon/img9.png';
import img10 from '@/assets/carbon/img10.png';
import img30 from '@/assets/img/img30.png';
import img33 from '@/assets/img/img33.png';
import img46 from '@/assets/img/img46.png';
import img47 from '@/assets/img/img47.png';

// 使用 Composition API 工具
const { t } = useI18n();
const { createMessage } = useMessage();

// Props定义
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

// Emit定义
const emit = defineEmits(['back']);

// Refs
const yzAddViewRef = ref(null);

// Reactive数据
const visible = ref(false);
const drawerTitle = ref('');
const activeKey = ref('1'); // 1基础信息 2运输信息
const formObj = reactive({
  transportList: [
    {
      selectedRows: {
        denominatorUnit: '',
      },
    },
  ], // 路段数据
  isTransport: false,
});
const activeCollapseKey = ref(['0']);
const labelCol = { span: 6 };
const wrapperCol = { span: 18 };
const flow_data_sourcesData = ref([]); // 数据来源
const vehicle_codeData = ref([]); // 交通工具
const unit_product_weightData = ref([]); // 单位产品重量
const product_typeData = ref([]); // 产品类型
const getAllUnitByGroupData = ref({}); // 单位分组数据

// 碳排因子相关
const cachesSlectedRows = ref({}); // 暂存碳排因子
const selectedRows = ref({
  denominatorUnit: '',
});
const visible2 = ref(false); // 选择因子弹窗
const visible3 = ref(false); // 手动添加因子弹窗
const transportIndex = ref(undefined);
const isAss = ref(1); //1新增2修改
const qianm = ref('km');
const emissionFactorId = ref('');

// 方法定义
/**
 * 打开选择碳排因子弹窗
 * 手动添加碳排因子弹窗
 */
const handleAdd = (type, index) => {
  if (index !== undefined) {
    transportIndex.value = index;
  } else {
    transportIndex.value = undefined;
  }

  if (type == 'chooseYZ') {
    // 选择因子
    visible2.value = true;
  }
  if (type == 'addYZ') {
    // 手动添加因子
    visible3.value = true;
  }
};

/**
 * 选择因子
 * @param value
 */
const onselectedRows = (value) => {
  console.log('onselectedRows', value);
  if (transportIndex.value !== undefined) {
    // 运输路段-碳排因子
    formObj.transportList[transportIndex.value].cachesSlectedRows = value;
  } else {
    // 基本信息-碳排因子
    cachesSlectedRows.value = value;
  }
};

/**
 * 关闭选择碳排因子弹窗
 * 关闭手动添加碳排因子弹窗
 */
const handleCancel = () => {
  visible2.value = false;
  visible3.value = false;
};

/**
 * 选择碳排因子弹窗-确定
 */
const handleOk2 = () => {
  if (transportIndex.value !== undefined) {
    // 运输路段-碳排因子
    let theObj = formObj.transportList[transportIndex.value];
    theObj.selectedRows = theObj.cachesSlectedRows;
    theObj.emissionFactorId = theObj.cachesSlectedRows.id;
    theObj.factorValue = theObj.cachesSlectedRows.factorValue;
    theObj.emissionFactorUnit = theObj.cachesSlectedRows.numeratorUnit;
    unitChange('km', theObj.selectedRows.denominatorUnit, transportIndex.value);
  } else {
    // 基本信息-碳排因子
    selectedRows.value = cachesSlectedRows.value;
    formObj.emissionFactorId = cachesSlectedRows.value.id;
    formObj.factorValue = cachesSlectedRows.value.factorValue;
    formObj.emissionFactorUnit = cachesSlectedRows.value.numeratorUnit;
    unitChange(formObj.flowUnitName, selectedRows.value.denominatorUnit);
  }
  visible2.value = false;
};

/**
 * 手动添加碳排因子弹窗-确定
 */
const handleOk3 = () => {
  if (!yzAddViewRef.value?.checkFormData()) {
    return;
  }

  console.log('handleOk3', yzAddViewRef.value.queryParam);
  defHttp
    .post({
      url: '/emission/factor/cyEmissionFactor/addEmissionByCarbonCheck',
      params: yzAddViewRef.value.queryParam,
    })
    .then((res) => {
      if (res) {
        createMessage.success(t('carbon.message.add_success'));
        console.log('listInfo formObj', activeKey.value);
        emissionFactorId.value = res;
        listInfo(2);
      }
    });
};

/**
 * 获取因子数据
 */
const listInfo = (value) => {
  console.log('emissionFactorId', formObj);
  defHttp
    .get({
      url: '/emission/factor/cyEmissionFactor/listInfo',
      params: {
        id: value === 2 ? emissionFactorId.value : formObj.emissionFactorId,
      },
    })
    .then((res) => {
      console.log("这是哪个因子",res)
      if (res) {
        let selectedRowsData = {
          id: res.emissionFactorObject.id,
          name: res.emissionFactorObject.name,
          model: res.emissionFactorObject.model,
          factorValue: res.emissionFactorDataObject.factorValue,
          numeratorUnit: res.emissionFactorDataObject.numeratorUnit,
          denominatorUnit: res.emissionFactorDataObject.denominatorUnit,
          releaseOrg: res.emissionFactorObject.releaseOrg,
          releaseYear: res.emissionFactorObject.releaseYear,
        };

        if (transportIndex.value !== undefined && formObj.transportList.length > 0) {
          // 运输路段-碳排因子
          let theObj = formObj.transportList[transportIndex.value];
          theObj.selectedRows = selectedRowsData;
          theObj.emissionFactorId = selectedRowsData.id;
          theObj.factorValue = selectedRowsData.factorValue;
          theObj.emissionFactorUnit = selectedRowsData.numeratorUnit;
        } else {
          // 基本信息-碳排因子
          selectedRows.value = selectedRowsData;
          formObj.emissionFactorId = selectedRowsData.id;
          formObj.factorValue = selectedRowsData.factorValue;
          formObj.emissionFactorUnit = selectedRowsData.numeratorUnit;
        }

        nextTick(() => {
          console.log('listInfo formObj', formObj);
          console.log('selectedRows', selectedRows.value);
          visible3.value = false;
          if (value == 1) {
            visible.value = true;
          }
        });
      }
    });
};

/**
 * 编辑获取运输因子数据
 */
const listInfoSelectedRows = (uid, index) => {
  console.log('emissionFactorId', formObj);
  defHttp
    .get({
      url: '/emission/factor/cyEmissionFactor/listInfo',
      params: {
        id: uid,
      },
    })
    .then((res) => {
      if (res) {
        let selectedRowsData = {
          id: res.emissionFactorObject.id,
          name: res.emissionFactorObject.name,
          model: res.emissionFactorObject.model,
          factorValue: res.emissionFactorDataObject.factorValue,
          numeratorUnit: res.emissionFactorDataObject.numeratorUnit,
          denominatorUnit: res.emissionFactorDataObject.denominatorUnit,
          releaseOrg: res.emissionFactorObject.releaseOrg,
          releaseYear: res.emissionFactorObject.releaseYear,
        };

        // 运输路段-碳排因子
        let theObj = formObj.transportList[index];
        theObj.selectedRows = selectedRowsData;
        theObj.emissionFactorId = selectedRowsData.id;
        theObj.factorValue = selectedRowsData.factorValue;
        theObj.emissionFactorUnit = selectedRowsData.numeratorUnit;

        console.log('listInfo formObj', formObj);
        visible3.value = false;
      }
    });
};

const listObjUpdate = (value) => {
  if (formObj.transportList.length > 0) {
    formObj.transportList.forEach((item, index) => {
      listInfoSelectedRows(item.emissionFactorId, index);
    });
    visible.value = true;
  } else {
    visible.value = true;
  }
  nextTick();
};

const onChangeIsTransport = (e) => {
  console.log(e);
  console.log(formObj);
  if (formObj.isTransport) {
    // 需要运输
    if (formObj.transportList.length <= 0) {
      formObj.transportList.push({
        selectedRows: {
          denominatorUnit: '',
        },
      });
    }
  } else {
    // 不需要运输
  }
};

/**
 * 切换tab
 * @param key 1基础信息 2运输信息
 */
const onChangeActiveKey = (key) => {
  console.log('onChangeActiveKey', key);
  activeKey.value = key;
  if (formObj.transportList.length <= 0) {
    formObj.transportList.push({
      selectedRows: {
        denominatorUnit: '',
      },
    });
  }
};

/**
 * 检查表单数据
 */
const checkFormData = () => {
  // 基础信息
  if (!formObj.emissionSourceType) {
    createMessage.warn(t('carbon.message.please_select_basic_information_type'));
    return false;
  }
  if (!formObj.emissionSourceName) {
    createMessage.warn(t('carbon.message.please_enter_basic_information_name'));
    return false;
  }
  if (!formObj.emissionSourceUnit) {
    createMessage.warn(t('carbon.message.please_select_basic_information_unit'));
    return false;
  }
  if (!formObj.dataSources) {
    createMessage.warn(t('carbon.message.please_select_basic_information_data_source'));
    return false;
  }
  if (!formObj.emissionFactorId) {
    createMessage.warn(t('carbon.message.please_select_basic_information_carbon_emission_factor'));
    return false;
  }
  if (!formObj.factorRatio) {
    createMessage.warn(t('carbon.message.please_enter_basic_information_unit_scale_conversion'));
    return false;
  }

  // 运输信息
  if (formObj.isTransport) {
    if (!formObj.weightUnit) {
      createMessage.warn(t('carbon.message.please_select_transportation_information_cargo_weight_unit'));
      return false;
    }

    let errName = null;
    let errIndex = null;
    for (let i = 0; i < formObj.transportList.length; i++) {
      let obj = formObj.transportList[i];
      if (!obj.vehicleId) {
        errIndex = i;
        errName = t('carbon.message.please_select_transportation_information_section_transportation');
        break;
      }
      if (!obj.emissionFactorId) {
        errIndex = i;
        errName = t('carbon.message.please_select_transportation_information_link_emission_factor');
        break;
      }
      if (!obj.factorRatio) {
        errIndex = i;
        errName = t('carbon.message.please_select_transportation_information_company_proportion_conversion');
        break;
      }
    }

    if (errIndex !== null) {
      createMessage.warn(`${errName}`);
      return false;
    }
  }
  return true;
};

/**
 * 提交数据
 */
const onSubmit = () => {
  console.log('onSubmit', formObj);
  console.log('isAss ', isAss.value);

  if (checkFormData()) {
    let reqData = cloneObject(formObj);
    if (!reqData.isTransport) {
      // 不需要运输，清除运输数据
      reqData.weight = 0;
      delete reqData.weightUnit;
      delete reqData.transportList;
    } else {
      // 需要运输，清除多余数据
      reqData.transportList.forEach((item) => {
        delete item.cachesSlectedRows;
        delete item.selectedRows;
      });
    }

    console.log('saveFlow reqData', reqData);

    if (isAss.value == 1) {
      defHttp
        .post({
          url: '/CyEmissionSourceLibrary/cyEmissionSourceLibrary/add',
          params: reqData,
        })
        .then((res) => {
          if (res) {
            createMessage.success('新增成功');
            emit('back');
            onClose();
          } else {
            createMessage.error(res.message);
          }
        });
    } else {
      defHttp
        .post({
          url: '/CyEmissionSourceLibrary/cyEmissionSourceLibrary/edit',
          params: reqData,
        })
        .then((res) => {
          if (res) {
            createMessage.success('编辑成功');
            emit('back');
            onClose();
          }
        });
    }
  }
};

const getData = () => {
  console.log('inputAndOutputForm getData');

  // 数据来源
  defHttp
    .get({
      url: '/sys/dict/getDictItems/flow_data_sources',
    })
    .then((res) => {
      flow_data_sourcesData.value = res || [];
      console.log('getDictItems flow_data_sources =>', res);
    });

// 交通工具
  defHttp
    .get({
      url: '/sys/dict/getDictItems/vehicle_code',
    })
    .then((res) => {
      vehicle_codeData.value = res || [];
      console.log('getDictItems vehicle_code =>', res);
    });

  // 单位产品重量
  defHttp
    .get({
      url: '/emission/factor/cyEmissionUnit/getAllUnit',
    })
    .then((res) => {
      if (res) {
        unit_product_weightData.value = res || [];
      }
    });

  // 单位
  defHttp
    .get({
      url: '/emission/factor/cyEmissionUnit/getAllUnitByGroup',
    })
    .then((res) => {
      if (res) {
        getAllUnitByGroupData.value = res || {};
      }
    });

// 产品类型
  defHttp
    .get({
      url: '/sys/dict/getDictItems/product_type',
    })
    .then((res) => {
      product_typeData.value = res || [];
      console.log('getDictItems product_type =>', res);
    });

  nextTick();
};

// ==========================================================基础信息
/**
 * 修改基础信息-类型
 */
const onChangeFlowType = (value) => {
  console.log('onChangeFlowType', value);
  let theIndex = product_typeData.value.findIndex((ele) => ele.value == value);
  if (theIndex > -1) {
    formObj.emissionSourceTypeName = product_typeData.value[theIndex].text;
  }
};

/**
 * 修改基础信息-单位
 */
const onChangeFlowUnit = (e) => {
  console.log('onChangeFlowUnit', e, getAllUnitByGroupData.value);
  for (let key in getAllUnitByGroupData.value) {
    let value = getAllUnitByGroupData.value[key];
    for (let index = 0; index < value.length; index++) {
      if (value[index].id == e) {
        formObj.emissionSourceUnitName = value[index].unitCode;
        unitChange(formObj.flowUnitName, selectedRows.value.denominatorUnit);
      }
    }
  }
  console.log('onChangeFlowUnit', formObj);
};

/**
 * 修改基础信息-数据来源
 */
const onChangeFlowDataSources = (value) => {
  console.log('onChangeFlowDataSources', value);
  let theIndex = flow_data_sourcesData.value.findIndex((ele) => ele.value == value);
  if (theIndex > -1) {
    formObj.dataSourcesName = flow_data_sourcesData.value[theIndex].text;
  }
};

// ==========================================================运输信息
/**
 * 修改重量单位
 */
const onChangeWeightUnit = (value) => {
  console.log('onChangeWeightUnit', value);
  let theIndex = unit_product_weightData.value.findIndex((ele) => ele.id == value);
  console.log('onChangeWeightUnit', theIndex);

  if (theIndex > -1) {
    formObj.weightUnitName = unit_product_weightData.value[theIndex].unitCode;
    nextTick();
  }
};

/**
 * 修改交通工具
 */
const onChangeVehicleId = (value, transportItem) => {
  console.log('onChangeVehicleId', value, vehicle_codeData.value);
  let theIndex = vehicle_codeData.value.findIndex((ele) => ele.value == value);
  if (theIndex > -1) {
    transportItem.vehicleName = vehicle_codeData.value[theIndex].text;
  }
};

/**
 * 添加路段
 */
const onAddTransport = () => {
  formObj.transportList.push({
    selectedRows: {},
  });
  let data1 = formObj.transportList.length - 1;
  activeCollapseKey.value.push(String(data1));
  console.log('onAddTransport', activeCollapseKey.value);
};

/**
 * 删除路段
 * @param transportIndex
 */
const onDelTransport = (transportIndex) => {
  formObj.transportList.splice(transportIndex, 1);
};

const unitChange = (sourceUnit, targetUnit, transportIndexVal) => {
  console.log('unitChange', sourceUnit, targetUnit, transportIndexVal);
  if (sourceUnit && targetUnit) {
    if (sourceUnit == targetUnit) {
      formObj.factorRatio = 1;
    } else {
      defHttp
        .get({
          url: '/emission/factor/cyEmissionFactor/api/getConvertValue',
          params: {
            sourceUnit,
            targetUnit,
          },
        })
        .then((res) => {
          if (res) {
            if (transportIndexVal !== undefined) {
              formObj.transportList[transportIndexVal].factorRatio = res;
            } else {
              formObj.factorRatio = res;
            }
          }
        });
    }
  }
};

// ==============================================================================
/**
 * 下拉框数据过滤
 */
const filterOption = (input, option) => {
  return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

/**
 * 关闭抽屉，初始化数据
 */
const onClose = () => {
  Object.assign(formObj, {
    transportList: [
      {
        selectedRows: {},
      },
    ], // 路段数据
    isTransport: false,
  });
  selectedRows.value = {};
  visible.value = false;
};

// 暴露给父组件的方法
defineExpose({
  getData,
  listInfo,
  listObjUpdate,
  isAss,
  formObj,
  visible,
});
</script>

<style lang="less" scoped>
.fleWarp {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
}
.flexs {
  display: flex;
  align-items: center;
  gap: 24px;
}

.textse {
  font-weight: 400;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
}
.butons {
  display: inline-flex;
  align-items: center;
  background: #ffffff;
  border-radius: 3px 3px 3px 3px;
  border: 1px solid #dcdcdc;
  font-weight: 400;
  font-size: 14px;
  color: #148958;
  padding: 5px 16px;
  img {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
}

:deep(.ant-collapse-content > .ant-collapse-content-box) {
  padding: 16px 24px 0;
  overflow: hidden;
}

:deep(.ant-collapse > .ant-collapse-item) {
  border-bottom: none;
}

:deep(.ant-collapse) {
  background: #fff;
}

:deep(.ant-collapse-item) {
  margin-bottom: 16px;
}

:deep(.ant-collapse-header) {
  background: #f5f7f6;
}

:deep(.ant-collapse-content) {
  background: #f5f7f6;
}

:deep(.ant-collapse-content-box) {
  background: #f5f7f6;
}

.box1 {
  display: flex;
  align-items: center;

  .box1_text1 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    transform: translateY(2px);
  }

  .box1_text2 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #888888;
  }

  .box1_text3 {
    margin: 0 4px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }
}

.collapseIcon {
  width: 16px;
  height: 16px;
}

.addBtn {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: fit-content;
  padding: 5px 16px;
  background: #ffffff;
  border-radius: 3px;
  border: 1px solid @primary-color;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: @primary-color;

  .addBtn_icon {
    width: 16px;
    height: 16px;
  }
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

.drawerOptionBox {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: right;
  z-index: 12;
}
</style>
