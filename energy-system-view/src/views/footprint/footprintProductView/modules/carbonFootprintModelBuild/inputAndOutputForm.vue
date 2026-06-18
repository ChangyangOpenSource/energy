<template>
  <div>
    <a-drawer :body-style="{ paddingBottom: '80px' }" :title="drawerTitle" :visible="visible" :width="600"
              @close="onClose">
      <a-tabs :activeKey="activeKey" @change="onChangeActiveKey">
        <a-tab-pane key="1" forceRender :tab="t('carbon.message.Basic_information')">
          <a-form  :model="formObj"  >
            <a-form-item :label="t('carbon.message.Belonging_process')" required>
              <a-input v-model:value="formObj.processName" :disabled="disabled"></a-input>
            </a-form-item>
            <a-form-item :label="t('carbon.message.Type')" required>
              <a-select v-model:value="formObj.flowType" :disabled="disabled" :filter-option="filterOption" allow-clear
                        :placeholder="t('carbon.message.Please_select')" show-search style="width: 100%;" @change="onChangeFlowType">
                <a-select-option v-for="(item,index) in product_typeData" :key="index" :value="item.value">
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="t('carbon.message.Name')" required>
              <a-input v-model:value="formObj.flowName" :disabled="disabled" allow-clear :placeholder="t('carbon.message.Please_enter')"></a-input>
            </a-form-item>
            <a-form-item :label="t('carbon.message.Number')" required v-if="!disabled">
              <a-input-number v-model:value="formObj.flowNumber" :disabled="disabled" allow-clear :placeholder="t('carbon.message.Please_enter')"
                              style="width: 100%"></a-input-number>
            </a-form-item>
            <a-form-item :label="t('carbon.message.Unit')" required>
              <UnitCascader v-if="visible" :unit-id="formObj.flowUnit" v-model:value="formObj.flowUnit" @change="onChangeFlowUnit"></UnitCascader>
            </a-form-item>
            <a-form-item :label="t('carbon.message.Data_source')" required>
              <a-select v-model:value="formObj.flowDataSources" :disabled="disabled" :filter-option="filterOption" allow-clear
                        :placeholder="t('carbon.message.Please_select')" show-search @change="onChangeFlowDataSources">
                <a-select-option v-for="(item,index) in flow_data_sourcesData" :key="index" :value="item.value">
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="t('carbon.message.Data_description')">
              <a-input v-model:value="formObj.flowDataDescription" :disabled="disabled" allow-clear
                       :placeholder="t('carbon.message.Please_enter')"></a-input>
            </a-form-item>
            <a-form-item :label="t('carbon.message.Data_certificate')" v-if="!disabled">
              <j-image-upload class="avatar-uploader" :text="t('carbon.message.upload_attachment')" :disabled="disabled" v-model:value="formObj.attachment"></j-image-upload>
              <div class="textse">{{ t('carbon.message.Only_pdf_png_jpg_and_peg_formats_are_supported_for_upload_with_a_maximum_of_one_file_The_size_of_each_file_should_not_exceed_5M') }}</div>
            </a-form-item>
            <a-form-item :label="t('carbon.message.Emission_factor')" required>
              <div v-if="!formObj.emissionFactorId" class="tianjia">
                <div class="color">{{ t('carbon.message.please_add_factor') }}</div>
                <div>
                  <a-button class="leftShoudong"  @click="handleAdd('addYZ')">{{ t('carbon.message.Manually_add') }}</a-button>
                  <a-button class="leftChaxun"  @click="handleAdd('chooseYZ')">{{ t('carbon.message.Select_factor') }}</a-button>
                  <a-button class="leftChaxun"  @click="handleAdd('Supplier')">{{ t('carbon.message.Select_supplier_data') }}</a-button>
                </div>
              </div>
              <div v-else>
                <yzCard :item="selectedRows"/>
                <div v-if="!disabled" class="manual">
                  <div class="manualOperation m_hoverCP" @click="handleAdd('addYZ')">
                    <img alt="" :src="img9" />{{ t('carbon.message.Manually_add') }}
                  </div>
                  <div class="manualOperation m_hoverCP" @click="handleAdd('chooseYZ')">
                    <img alt="" :src="img10" />{{ t('carbon.message.Select_again') }}
                  </div>
                  <div class="manualOperation m_hoverCP" @click="handleAdd('Supplier')">
                    <img alt="" :src="img10" />{{ t('carbon.message.Select_supplier_data') }}
                  </div>
                </div>
              </div>
            </a-form-item>
            <a-form-item :label="t('carbon.message.Unit_proportional_conversion')" required>
              <div class="box1">
                <div class="fleWarp">
                  <div class="box1_text1">1{{ formObj.flowUnitName }}</div>
                  <div class="box1_text2">（{{ t('carbon.message.Active_data_unit') }}）</div>
                </div>
                <div class="box1_text3">=</div>
                <a-input-number v-model:value="formObj.factorRatio" :disabled="disabled" allow-clear :placeholder="t('carbon.message.Please_enter')"
                                style="width: 100px;margin-right: 4px;"></a-input-number>
                <div class="fleWarp">
                  <div class="box1_text1">{{ formObj.emissionFactorId ? selectedRows.denominatorUnit : '' }}</div>
                  <div class="box1_text2">（{{ t('carbon.message.Factor_denominator_unit') }}）</div>
                </div>
              </div>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2" forceRender :tab="t('carbon.message.Transport_information')">
          <a-form :label-col="labelCol" :model="formObj" :wrapper-col="wrapperCol" labelAlign="left">
            <a-form-item :label="t('carbon.message.Need_or_no_need_transportation')" required>
              <a-radio-group v-model:value="formObj.isTransport" :disabled="disabled" button-style="solid"
                             @click="onChangeIsTransport">
                <a-radio-button :value="false">{{ t('carbon.message.No_need_to_transport') }}</a-radio-button>
                <a-radio-button :value="true">{{ t('carbon.message.Need_transportation') }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item v-if="formObj.isTransport" :label="t('carbon.message.Weight_of_goods')" required>
              <a-input-number v-model:value="formObj.weight" :disabled="disabled" :precision="2" :step="0.01"
                              allow-clear :placeholder="t('carbon.message.Please_enter')" style="width: 49%;" v-if="!disabled"/>
              <div style="display: inline-block; margin-left: 10px;">
                <UnitCascader :unit-id="formObj.weightUnit" :filter-name="'质量'" v-model:value="formObj.weightUnit" @change="onChangeWeightUnit"></UnitCascader>
              </div>
            </a-form-item>
          </a-form>
          <template v-if="formObj.isTransport">
            <a-collapse v-model:activeKey="activeCollapseKey" :bordered="false">
              <template #expandIcon="props">
                <img v-if="props.isActive" alt="" class="collapseIcon" :src="img47" />
                <img v-else alt="" class="collapseIcon" :src="img46" />
              </template>
              <a-collapse-panel v-for="(transportItem,transportIndex) in formObj.transportList" :key="String(transportIndex)" :header="'路段' + (transportIndex + 1)">
                <img v-if="transportIndex > 0" slot="extra" alt="" class="collapseIcon"
                     :src="img33" @click="onDelTransport(transportIndex)"/>
                <a-form-model :label-col="labelCol" :model="formObj" :wrapper-col="wrapperCol" labelAlign="left">
                  <a-form-item :label="t('carbon.message.Distance')+'(km)'" required v-if="!disabled">
                    <a-input-number v-model:value="transportItem.distance" :disabled="disabled" :precision="2"
                                    :step="0.01" allow-clear :placeholder="t('carbon.message.Please_enter')"
                                    style="width: 100%"></a-input-number>
                  </a-form-item>
                  <a-form-item :label="t('carbon.message.Means_of_transportation')" required>
                    <a-select v-model:value="transportItem.vehicleId" :disabled="disabled" :filter-option="filterOption"
                              allow-clear :placeholder="t('carbon.message.Please_select')" show-search @change="onChangeVehicleId($event,transportItem)">
                      <a-select-option v-for="(item,index) in vehicle_codeData" :key="index" :value="item.value">
                        {{ item.text }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item :label="t('carbon.message.Emission_factor')" required>
                    <div v-if="!transportItem.emissionFactorId" class="tianjia">
                      <div class="color">{{ t('carbon.message.please_add_factor') }}</div>
                      <div v-if="!disabled">
                        <a-button class="leftShoudong"  @click="handleAdd('addYZ',transportIndex)">{{ t('carbon.message.Manually_add') }}
                        </a-button>
                        <a-button class="leftChaxun marRight"  @click="handleAdd('chooseYZ',transportIndex)">
                          {{ t('carbon.message.Select_factor') }}
                        </a-button>
                      </div>
                    </div>
                    <div v-else>
                      <yzCard :item="transportItem.selectedRows"/>
                      <div v-if="!disabled" class="manual">
                        <div class="manualOperation m_hoverCP" @click="handleAdd('addYZ',transportIndex)">
                          <img alt="" :src="img9" />{{ t('carbon.message.Manually_add') }}
                        </div>
                        <div class="manualOperation m_hoverCP" @click="handleAdd('chooseYZ',transportIndex)">
                          <img alt="" :src="img10" />{{ t('carbon.message.Add_again') }}
                        </div>
                      </div>
                    </div>
                  </a-form-item>
                  <a-form-item :label="t('carbon.message.Unit_proportional_conversion')" required>
                    <div class="box1">
                      <div class="fleWarp">
                        <div class="box1_text1">1{{ formObj.weightUnitName }}*km</div>
                        <div class="box1_text2">（{{ t('carbon.message.Active_data_unit') }}）</div>
                      </div>
                      <div class="box1_text3">=</div>
                      <a-input-number v-model:value="transportItem.factorRatio" :disabled="disabled" allow-clear
                                      :placeholder="t('carbon.message.Please_enter')" style="width: 100px;margin-right: 4px;"></a-input-number>
                      <div class="fleWarp">
                        <div class="box1_text1">
                          {{ transportItem.emissionFactorId ? transportItem.selectedRows.denominatorUnit : '' }}
                        </div>
                        <div class="box1_text2">（{{ t('carbon.message.Factor_denominator_unit') }}）</div>
                      </div>

                    </div>
                  </a-form-item>
                </a-form-model>
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
        <a-button v-if="!disabled" style="margin-left: 8px;" type="primary" @click="onSubmit"> {{ t('carbon.message.Confirm') }}</a-button>
      </div>
    </a-drawer>
    <!--选择碳排因子弹窗-->
    <a-modal :visible="visible2" :width="1524" :title="t('carbon.message.selective_carbon_emission_factor')" @cancel="handleCancel" @ok="handleOk2">
      <yzChooseView v-if="visible2" @onselectedRows="onselectedRows"/>
    </a-modal>
    <!--手动添加碳排因子弹窗-->
    <a-modal :visible="visible3" :width="1000" :title="t('carbon.message.manually_add_carbon_emission_factors')" @cancel="handleCancel" @ok="handleOk3">
      <yzAddView v-if="visible3" ref="yzAddViewRef"/>
    </a-modal>
    <!--选择供应链碳排因子弹窗-->
    <a-modal :visible="visible4" :width="1000" :title="t('carbon.message.Select_supplier_data')" @cancel="handleCancel" @ok="handleOk4">
      <Supplier v-if="visible4" ref="supplierRef" @onselectedRows="onselecGysx"/>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, defineProps, defineEmits } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { defHttp } from '/@/utils/http/axios'
import { cloneObject } from '/@/utils/index';
import yzCard from "/@/components/common/yzCard2.vue"
import yzChooseView from "/@/components/common/yzChooseView.vue"
import yzAddView from "/@/components/common/yzAddView.vue"
import Supplier from "/@/components/common/Supplier.vue"
import UnitCascader from "/@/components/common/UnitCascader.vue"
import JImageUpload from "@/components/Form/src/jeecg/components/JImageUpload.vue";
// 导入图片资源
import img9 from '@/assets/carbon/img9.png'
import img10 from '@/assets/carbon/img10.png'
import img30 from '@/assets/img/img30.png'
import img33 from '@/assets/img/img33.png'
import img46 from '@/assets/img/img46.png'
import img47 from '@/assets/img/img47.png'

// 使用 Composition API 工具
const { t } = useI18n()
const { createMessage } = useMessage()

// 定义props
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

// 定义emits
const emit = defineEmits(['back'])

// 定义ref
const yzAddViewRef = ref(null)
const supplierRef = ref(null)

// 响应式数据
const visible = ref(false)
const drawerTitle = ref('')
const activeKey = ref('1') // 1基础信息 2运输信息
const formObj = reactive({
  transportList: [{
    selectedRows: {}
  }], // 路段数据
  isTransport: false,
})
const activeCollapseKey = ref(['0'])
const labelCol = {span: 5}
const wrapperCol = {span: 19}
const flow_data_sourcesData = ref([]) // 数据来源
const vehicle_codeData = ref([]) // 交通工具
const unit_product_weightData = ref([]) // 单位产品重量
const product_typeData = ref([]) // 产品类型
const getAllUnitByGroupData = ref({}) // 单位分组数据
// ===============================================================碳排因子
const cachesSlectedRows = ref({}) // 暂存碳排因子
const selectedRows = ref({})
const visible2 = ref(false) // 选择因子弹窗
const visible3 = ref(false) // 手动添加因子弹窗
const visible4 = ref(false) // 手动添加因子弹窗
const transportIndex = ref(undefined)
// ===============================================================碳排因子

// ===============================================================碳排因子
/**
 * 打开选择碳排因子弹窗
 * 手动添加碳排因子弹窗
 */
function handleAdd(type, index) {
  if (index !== undefined) {
    transportIndex.value = index
  } else {
    transportIndex.value = undefined
  }
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
}

/**
 * 选择因子
 * @param value
 */
function onselectedRows(value) {
  console.log('onselectedRows', value);
  if (transportIndex.value !== undefined) {
    // 运输路段-碳排因子
    formObj.transportList[transportIndex.value].cachesSlectedRows = value
  } else {
    // 基本信息-碳排因子
    cachesSlectedRows.value = value;
  }
}

/**
 * 选择供应链
 * @param value
 */
function onselecGysx(value){
  console.log('onselectedRows', value);
  cachesSlectedRows.value = value;
}

function handleOk4(){
  console.log('handleOk4', supplierRef.value?.queryParam);
  nextTick(()=>{
    cachesSlectedRows.value.emissionFactorType = 2
    cachesSlectedRows.value.denominatorUnit = cachesSlectedRows.value.productUnitId_dictText
    selectedRows.value = cachesSlectedRows.value
  })
  console.log('handleOk4', selectedRows.value);

  formObj.emissionFactorId = cachesSlectedRows.value.id;
  formObj.factorValue = cachesSlectedRows.value.carbonEmissions
  formObj.emissionFactorUnit = cachesSlectedRows.value.carbonEmissionsUnitId_dictText
  formObj.emissionFactorType = 2
  unitChange(formObj.flowUnitName, selectedRows.value.productUnitId_dictText)
  visible4.value = false;
}

/**
 * 关闭选择碳排因子弹窗
 * 关闭手动添加碳排因子弹窗
 */
function handleCancel() {
  visible2.value = false;
  visible3.value = false;
  visible4.value = false;
}

/**
 * 选择碳排因子弹窗-确定
 */
function handleOk2() {
  if (transportIndex.value !== undefined) {
    // 运输路段-碳排因子
    let theObj = formObj.transportList[transportIndex.value]
    theObj.selectedRows = theObj.cachesSlectedRows
    theObj.emissionFactorId = theObj.cachesSlectedRows.id;
    theObj.factorValue = theObj.cachesSlectedRows.factorValue
    theObj.emissionFactorUnit = theObj.cachesSlectedRows.numeratorUnit
    unitChange('km', theObj.selectedRows.denominatorUnit, transportIndex.value)
  } else {
    // 基本信息-碳排因子
    selectedRows.value = cachesSlectedRows.value
    formObj.emissionFactorId = cachesSlectedRows.value.id;
    formObj.factorValue = cachesSlectedRows.value.factorValue
    formObj.emissionFactorUnit = cachesSlectedRows.value.numeratorUnit
    formObj.emissionFactorType = 1
    unitChange(formObj.flowUnitName, selectedRows.value.denominatorUnit)
  }
  visible2.value = false;
}

/**
 * 手动添加碳排因子弹窗-确定
 */
function handleOk3() {
  if (!yzAddViewRef.value?.checkFormData()) {
    return
  }
  console.log('handleOk3', yzAddViewRef.value?.queryParam);
  defHttp.post({
    url: "/emission/factor/cyEmissionFactor/addEmissionByCarbonCheck",
    params: yzAddViewRef.value?.queryParam
  }, { isTransformResponse: false }).then((res) => {
    if (res.success) {
      createMessage.success("添加成功");
      formObj.emissionFactorId = res.result
      listInfo();
    }
  });
}

/**
 * 获取因子数据
 */
function listInfo() {
  console.log('emissionFactorId', formObj);
  defHttp.get({
    url: "/emission/factor/cyEmissionFactor/listInfo",
    params: {
      id: formObj.emissionFactorId
    }
  }, { isTransformResponse: false }).then((res) => {
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
      if (transportIndex.value !== undefined) {
        // 运输路段-碳排因子
        let theObj = formObj.transportList[transportIndex.value]
        theObj.selectedRows = selectedRowsData
        theObj.emissionFactorId = selectedRowsData.id;
        theObj.factorValue = selectedRowsData.factorValue
        theObj.emissionFactorUnit = selectedRowsData.numeratorUnit
        unitChange('km', theObj.selectedRows.denominatorUnit, transportIndex.value)
      } else {
        // 基本信息-碳排因子
        selectedRows.value = selectedRowsData;
        formObj.emissionFactorId = selectedRowsData.id
        formObj.factorValue = selectedRowsData.factorValue
        formObj.emissionFactorUnit = selectedRowsData.numeratorUnit
        unitChange(formObj.flowUnitName, selectedRows.value.denominatorUnit)
      }
      console.log('listInfo formObj', formObj);
      visible3.value = false;
    }
  });
}

// ===============================================================碳排因子
function onChangeIsTransport(e) {
  if (formObj.isTransport == 'yesTransport') {
    // 需要运输

  } else {
    // 不需要运输

  }
}

/**
 * 切换tab
 * @param key 1基础信息 2运输信息
 */
function onChangeActiveKey(key) {
  console.log('onChangeActiveKey', key);
  activeKey.value = key
  if (formObj.processTransportList==null||formObj.processTransportList.length <= 0) {
    formObj.processTransportList=[]
    formObj.processTransportList.push({
      selectedRows: {
        denominatorUnit: "",
      },
    });
  }
}

/**
 * 检查表单数据
 */
function checkFormData() {
  // 基础信息
  if (!formObj.flowType) {
    createMessage.warn('请选择基础信息-类型')
    return false
  }
  if (!formObj.flowName) {
    createMessage.warn('请输入基础信息-名称')
    return false
  }
  if (!formObj.flowNumber) {
    createMessage.warn('请输入基础信息-数量')
    return false
  }
  if (!formObj.flowUnit) {
    createMessage.warn('请选择基础信息-单位')
    return false
  }
  if (!formObj.flowDataSources) {
    createMessage.warn('请选择基础信息-数据来源')
    return false
  }
  if (!formObj.emissionFactorId) {
    createMessage.warn('请选择基础信息-碳排因子')
    return false
  }
  if (!formObj.factorRatio) {
    createMessage.warn('请输入基础信息-单位比例换算')
    return false
  }
  // 运输信息
  if (formObj.isTransport) {
    if (!formObj.weight) {
      createMessage.warn('请输入运输信息-货物重量')
      return false
    }
    if (!formObj.weightUnit) {
      createMessage.warn('请选择运输信息-货物重量单位')
      return false
    }
    let errName = null
    let errIndex = null
    for (let i = 0; i < formObj.transportList.length; i++) {
      let obj = formObj.transportList[i]
      if (!obj.distance) {
        errIndex = i
        errName = '请输入运输信息-路段距离（km）'
        break
      }
      if (!obj.vehicleId) {
        errIndex = i
        errName = '请选择运输信息-路段交通工具'
        break
      }
      if (!obj.emissionFactorId) {
        errIndex = i
        errName = '请选择运输信息-路段排放因子'
        break
      }
      if (!obj.factorRatio) {
        errIndex = i
        errName = '请选择运输信息-单位比例换算'
        break
      }
    }
    if (errIndex !== null) {
      createMessage.warn(`${errName}`)
      return false
    }
  }
  return true
}

/**
 * 提交数据
 */
function onSubmit() {
  console.log('onSubmit', formObj)
  if (checkFormData()) {
    let reqData = cloneObject(formObj)
    if (!reqData.isTransport) {
      // 不需要运输，清除运输数据
      reqData.weight = 0
      delete reqData.weightUnit
      delete reqData.transportList
    } else {
      // 需要运输，清除多余数据
      reqData.transportList.forEach(item => {
        delete item.cachesSlectedRows
        delete item.selectedRows
      })
    }
    console.log('saveFlow reqData', reqData)
    defHttp.post({
      url: '/footprintProduct/cyFootprintProduct/saveFlow',
      params: reqData
    }).then((res) => {
      if (res) {
        createMessage.success(res.message)
        emit('back')
        onClose()
      }
    });
  }
}

function getData() {
  console.log('inputAndOutputForm getData')
  // 数据来源
  defHttp.get({
    url: '/sys/dict/getDictItems/flow_data_sources',
  
  }).then((res) => {
    flow_data_sourcesData.value = res || []
    console.log('getDictItems flow_data_sources =>', res)
  });
  // 交通工具
  defHttp.get({
    url: '/sys/dict/getDictItems/vehicle_code',
 
  }).then((res) => {
    vehicle_codeData.value = res || []
    console.log('getDictItems vehicle_code =>', res)
  });
  // 单位产品重量
  defHttp.get({
    url: "/emission/factor/cyEmissionUnit/getAllUnit"
  }).then((res) => {
    if (res) {
      unit_product_weightData.value = res.result || [];
    }
  });
  // 单位
  defHttp.get({
    url: '/emission/factor/cyEmissionUnit/getAllUnitByGroup'
  }).then((res) => {
    if (res) {
      getAllUnitByGroupData.value = res.result || {}
    }
  });
  // 产品类型
  defHttp.get({
    url: '/sys/dict/getDictItems/product_type',
  }).then((res) => {
    product_typeData.value = res || []
    console.log('getDictItems product_type =>', res)
  });
}

// ==========================================================基础信息
/**
 * 修改基础信息-类型
 */
function onChangeFlowType(value) {
  console.log('onChangeFlowType', value)
  let theIndex = product_typeData.value.findIndex(ele => ele.value == value)
  if (theIndex > -1) {
    formObj.flowTypeName = product_typeData.value[theIndex].text
  }
}

/**
 * 修改基础信息-单位
 */
function onChangeFlowUnit(e) {
  console.log('onChangeFlowUnit', e, getAllUnitByGroupData.value)
  for (let key in getAllUnitByGroupData.value) {
    let value = getAllUnitByGroupData.value[key]
    for (let index = 0; index < value.length; index++) {
      if (value[index].id == e) {
        formObj.flowUnitName = value[index].unitCode
        unitChange(formObj.flowUnitName, selectedRows.value.denominatorUnit)
      }
    }
  }
  console.log('onChangeFlowUnit', formObj)
}

/**
 * 修改基础信息-数据来源
 */
function onChangeFlowDataSources(value) {
  console.log('onChangeFlowDataSources', value)
  let theIndex = flow_data_sourcesData.value.findIndex(ele => ele.value == value)
  if (theIndex > -1) {
    formObj.flowDataSourcesName = flow_data_sourcesData.value[theIndex].text
  }
}

// ==========================================================运输信息
/**
 * 修改重量单位
 */
function onChangeWeightUnit(value) {
  console.log('onChangeWeightUnit', value)
  let theIndex = unit_product_weightData.value.findIndex(ele => ele.id == value)
  if (theIndex > -1) {
    formObj.weightUnitName = unit_product_weightData.value[theIndex].unitCode
  }
}

/**
 * 修改交通工具
 */
function onChangeVehicleId(value, transportItem) {
  console.log('onChangeVehicleId', value, vehicle_codeData.value)
  let theIndex = vehicle_codeData.value.findIndex(ele => ele.value == value)
  if (theIndex > -1) {
    transportItem.vehicleName = vehicle_codeData.value[theIndex].text
  }
}

/**
 * 添加路段
 */
function onAddTransport() {
  formObj.transportList.push({
    selectedRows: {}
  })
  let data1 = formObj.transportList.length - 1
  activeCollapseKey.value.push(String(data1))
  console.log('onAddTransport', activeCollapseKey.value)
}

/**
 * 删除路段
 * @param transportIndex
 */
function onDelTransport(index) {
  formObj.transportList.splice(index, 1)
}

function unitChange(sourceUnit, targetUnit, index) {
  console.log('unitChange', sourceUnit, targetUnit, index)
  if (sourceUnit && targetUnit) {
    if (sourceUnit == targetUnit){
      formObj.factorRatio = 1
    }else {
      defHttp.get({
        url: "/emission/factor/cyEmissionFactor/api/getConvertValue",
        params: {
          sourceUnit,
          targetUnit
        }
      }).then((res) => {
        if (res.success) {
          if (index !== undefined) {
            formObj.transportList[index].factorRatio = res.result
          } else {
            formObj.factorRatio = res.result
          }
        }
      })
    }
  }
}

// ==============================================================================
/**
 * 下拉框数据过滤
 */
function filterOption(input, option) {
  return (
    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  );
}


defineExpose({
  getData,
  visible,
  formObj,
  drawerTitle
});


/**
 * 关闭抽屉，初始化数据
 */
function onClose() {
  Object.assign(formObj, {
    transportList: [{
      selectedRows: {}
    }], // 路段数据
    isTransport: false,
  })
  selectedRows.value = {}
  visible.value = false;
}
</script>

<style lang="less" scoped>
.fleWarp{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.avatar-uploader {
  display: block;
  width: 120px;
  height: 120px;
  /deep/.ant-upload {
    width: 120px !important;
    height: 120px !important;
  }

  /deep/.ant-upload-text {
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
  }
}

/deep/ .ant-collapse-content > .ant-collapse-content-box {
  padding: 16px 24px 0;
  overflow: hidden;
}

/deep/ .ant-collapse > .ant-collapse-item {
  border-bottom: none;
}

/deep/ .ant-collapse {
  background: #fff;
}

/deep/ .ant-collapse-item {
  margin-bottom: 16px;
}

/deep/ .ant-collapse-header {
  background: #F5F7F6;
}

/deep/ .ant-collapse-content {
  background: #F5F7F6;
}

/deep/ .ant-collapse-content-box {
  background: #F5F7F6;
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
  background: #FFFFFF;
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
