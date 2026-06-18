<!-- 产品碳足迹-产品碳足迹-产品核算-模型搭建-输入输出表单 -->

<template>
  <div>
    <a-drawer
      :body-style="{ paddingBottom: '80px' }"
      :title="drawerTitle"
      :visible="visible"
      :width="600"
      @close="onClose"
    >
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
                style="width: 100%;"
                @change="onChangeFlowType"
              >
                <a-select-option
                  v-for="(item,index) in product_typeData"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="t('carbon.message.Number')" required v-if="type!=3">
              <a-input-number
                v-model:value="formObj.emissionSourceNumber"
                :disabled="disabled"
                :precision="2"
                :step="0.01"
                allow-clear
                :placeholder="t('carbon.message.Please_enter')"
                style="width: 100%"
              ></a-input-number>
            </a-form-item>
            <a-form-item :label="t('carbon.message.Unit')" required>
              <UnitCascader
                v-if="visible"
                :unit-id="formObj.emissionSourceUnit"
                v-model:value="formObj.emissionSourceUnit"
                @change="onChangeFlowUnit"
              ></UnitCascader>
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
                <a-select-option
                  v-for="(item,index) in flow_data_sourcesData"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="t('carbon.message.Data_certificate')" v-if="!disabled">
              <j-image-upload
                class="avatar-uploader"
                :text="t('carbon.message.upload_attachment')"
                :disabled="disabled"
                v-model:value="formObj.attachment"
              ></j-image-upload>
              <div class="textse">
                {{ t('carbon.message.Only_pdf_png_jpg_and_peg_formats_are_supported_for_upload_with_a_maximum_of_one_file_The_size_of_each_file_should_not_exceed_5M') }}
              </div>
            </a-form-item>
            <a-form-item :label="t('carbon.message.Emission_factor')" required>
              <div v-if="!formObj.emissionFactorId" class="tianjia">
                <div class="color">{{ t('carbon.message.please_add_factor') }}</div>
                <div>
                  <a-button
                    class="leftShoudong"
                    icon="plus"
                    @click="handleAdd('addYZ')"
                  >
                    {{ t('carbon.message.Manually_add') }}
                  </a-button>
                  <a-button
                    class="leftChaxun"
                    icon="plus"
                    @click="handleAdd('chooseYZ')"
                  >
                    {{ t('carbon.message.Select_factor') }}
                  </a-button>
                </div>
              </div>
              <div v-else>
                <yzCard :item="selectedRows"/>
                <div v-if="!disabled&&type!=3" class="manual">
                  <div
                    class="manualOperation m_hoverCP"
                    @click="handleAdd('addYZ')"
                  >
                    <img alt="" src="@/assets/carbon/img9.png"/>{{ t('carbon.message.Manually_add') }}
                  </div>
                  <div
                    class="manualOperation m_hoverCP"
                    @click="handleAdd('chooseYZ')"
                  >
                    <img alt="" src="@/assets/carbon/img10.png"/>{{ t('carbon.message.Select_again') }}
                  </div>
                </div>
              </div>
            </a-form-item>
            <a-form-item :label="t('carbon.message.Unit_proportional_conversion')" required>
              <div class="box1">
                <div class="fleWarp">
                  <div class="box1_text1">1{{ formObj.emissionSourceUnitName }}</div>
                  <div class="box1_text2">（{{ t('carbon.message.Active_data_unit') }}）</div>
                </div>
                <div class="box1_text3">=</div>
                <a-input-number
                  v-model:value="formObj.factorRatio"
                  :disabled="disabled"
                  allow-clear
                  :placeholder="t('carbon.message.Please_enter')"
                  style="width: 100px;margin-right: 4px;"
                ></a-input-number>
                <div class="fleWarp">
                  <div class="box1_text1" v-if="formObj.emissionFactorId">
                    {{ formObj.emissionFactorId ? selectedRows.denominatorUnit : '' }}
                  </div>
                  <div class="box1_text2">（{{ t('carbon.message.Factor_denominator_unit') }}）</div>
                </div>
              </div>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2" force-render :tab="t('carbon.message.Transport_information')">
          <a-form :label-col="labelCol" :model="formObj" :wrapper-col="wrapperCol" label-align="left">
            <a-form-item :label="t('carbon.message.Need_or_no_need_transportation')" required>
              <a-radio-group
                v-model:value="formObj.isTransport"
                :disabled="disabled"
                button-style="solid"
                @change="onChangeIsTransport"
              >
                <a-radio-button :value="false">{{ t('carbon.message.No_need_to_transport') }}</a-radio-button>
                <a-radio-button :value="true">{{ t('carbon.message.Need_transportation') }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item v-if="formObj.isTransport" :label="t('carbon.message.Weight_of_goods')" required>
              <a-input-number
                v-model:value="formObj.weight"
                :disabled="disabled"
                :precision="2"
                :step="0.01"
                v-if="type!=3"
                allow-clear
                :placeholder="t('carbon.message.Please_enter')"
                style="width: 49%;"
              />
              <div style="display: inline-block; margin-left:10px">
                <UnitCascader
                  :unit-id="formObj.weightUnit"
                  :filter-name="'质量'"
                  v-model:value="formObj.weightUnit"
                  @change="onChangeWeightUnit"
                ></UnitCascader>
              </div>
            </a-form-item>
          </a-form>
          <template v-if="formObj.isTransport">
            <a-collapse v-model:activeKey="activeCollapseKey" :bordered="false">
              <template #expandIcon="{ isActive }">
                <img
                  v-if="isActive"
                  alt=""
                  class="collapseIcon"
                  src="@/assets/img/img47.png"
                />
                <img
                  v-else
                  alt=""
                  class="collapseIcon"
                  src="@/assets/img/img46.png"
                />
              </template>
              <a-collapse-panel
                v-for="(transportItem,transportIndex) in formObj.cyEmissionSourceTransports"
                :key="String(transportIndex)"
                :header="t('carbon.message.Road_section') + (transportIndex + 1)"
              >
                <template #extra>
                  <img
                    v-if="transportIndex > 0"
                    alt=""
                    class="collapseIcon"
                    src="@/assets/img/img33.png"
                    @click="onDelTransport(transportIndex)"
                  />
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
                      @change="onChangeVehicleId($event,transportItem)"
                    >
                      <a-select-option
                        v-for="(item,index) in vehicle_codeData"
                        :key="index"
                        :value="item.value"
                      >
                        {{ item.text }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item :label="`${t('carbon.message.Distance')}（km）`" required v-if="type!=3">
                    <a-input-number
                      v-model:value="transportItem.distance"
                      :disabled="disabled"
                      :precision="2"
                      :step="0.01"
                      allow-clear
                      :placeholder="t('carbon.message.Please_enter')"
                      style="width: 100%"
                    ></a-input-number>
                  </a-form-item>
                  <a-form-item :label="t('carbon.message.Emission_factor')" required>
                    <div v-if="!transportItem.emissionFactorId" class="tianjia">
                      <div class="color">{{ t('carbon.message.please_add_factor') }}</div>
                      <div v-if="!disabled">
                        <a-button
                          class="leftShoudong"
                          icon="plus"
                          @click="handleAdd('addYZ',transportIndex)"
                        >
                          {{ t('carbon.message.Manually_add') }}
                        </a-button>
                        <a-button
                          class="leftChaxun marRight"
                          icon="plus"
                          @click="handleAdd('chooseYZ',transportIndex)"
                        >
                          {{ t('carbon.message.Select_factor') }}
                        </a-button>
                      </div>
                    </div>
                    <div v-else>
                      <yzCard :item="transportItem.selectedRows"/>
                      <div v-if="!disabled&&type!=3" class="manual">
                        <div
                          class="manualOperation m_hoverCP"
                          @click="handleAdd('addYZ',transportIndex)"
                        >
                          <img alt="" src="@/assets/carbon/img9.png"/>{{ t('carbon.message.Manually_add') }}
                        </div>
                        <div
                          class="manualOperation m_hoverCP"
                          @click="handleAdd('chooseYZ',transportIndex)"
                        >
                          <img alt="" src="@/assets/carbon/img10.png"/>{{ t('carbon.message.Select_again') }}
                        </div>
                      </div>
                    </div>
                  </a-form-item>
                  <a-form-item :label="t('carbon.message.Unit_proportional_conversion')" required>
                    <div class="box1">
                      <div class="fleWarp">
                        <div class="box1_text1">1{{formObj.weightUnitName}}*km</div>
                        <div class="box1_text2">（{{ t('carbon.message.Active_data_unit') }}）</div>
                      </div>
                      <div class="box1_text3">=</div>
                      <a-input-number
                        v-model:value="transportItem.factorRatio"
                        :disabled="disabled"
                        allow-clear
                        :placeholder="t('carbon.message.Please_enter')"
                        style="width: 100px;margin-right: 4px;"
                      ></a-input-number>
                      <div class="box1_text1" v-if="transportItem.emissionFactorId&&transportItem.selectedRows">
                        <div class="fleWarp">
                          <div>
                            {{ transportItem.emissionFactorId ? transportItem.selectedRows.denominatorUnit : '' }}
                          </div>
                          <div class="box1_text2">（{{ t('carbon.message.Factor_denominator_unit') }}）</div>
                        </div>
                      </div>
                    </div>
                  </a-form-item>
                </a-form>
              </a-collapse-panel>
            </a-collapse>
            <div
              v-if="!disabled&&type!=3"
              class="addBtn m_hoverCP"
              @click="onAddTransport"
            >
              <img alt="" class="addBtn_icon" src="@/assets/img/img30.png"/>{{ t('carbon.message.Add_road_section') }}
            </div>
          </template>
        </a-tab-pane>
      </a-tabs>
      <div class="drawerOptionBox" v-if="type!=3">
        <a-button @click="onClose">{{ t('carbon.message.Cancel') }}</a-button>
        <a-button
          v-if="!disabled"
          style="margin-left: 8px;"
          type="primary"
          @click="onSubmit"
        >
          {{ t('carbon.message.Confirm') }}
        </a-button>
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
      <yzChooseView v-if="visible2" @onselectedRows="onselectedRows"/>
    </a-modal>
    <!--手动添加碳排因子弹窗-->
    <a-modal
      v-model:visible="visible3"
      :width="1000"
      :title="t('carbon.message.manually_add_carbon_emission_factors')"
      @cancel="handleCancel"
      @ok="handleOk3"
    >
      <yzAddView v-if="visible3" ref="yzAddViewRef"/>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { defHttp } from '/@/utils/http/axios'
import { cloneObject } from '/@/utils/index'
import yzCard from '/@/components/common/yzCard2.vue'
import yzChooseView from '/@/components/common/yzChooseView.vue'
import yzAddView from '/@/components/common/yzAddView.vue'
import UnitCascader from '/@/components/common/UnitCascader.vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 使用 Composition API 工具
const { t } = useI18n()
const { createMessage } = useMessage()

// 定义 emits
const emit = defineEmits(['back'])

// Props
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

// Refs
const yzAddViewRef = ref(null)
const uploadAction = ref(window._CONFIG['domianURL'] + "/sys/common/upload")
const visible = ref(false)
const drawerTitle = ref('')
const activeKey = ref('1') // 1基础信息 2运输信息
const activeCollapseKey = ref(['0'])
const labelCol = { span: 5 }
const wrapperCol = { span: 19 }
const flow_data_sourcesData = ref([]) // 数据来源
const vehicle_codeData = ref([]) // 交通工具
const unit_product_weightData = ref([]) // 单位产品重量
const product_typeData = ref([]) // 产品类型
const getAllUnitByGroupData = ref({}) // 单位分组数据
const visible2 = ref(false) // 选择因子弹窗
const visible3 = ref(false) // 手动添加因子弹窗
const transportIndex = ref(undefined)
const fileList = ref({})
const headers = ref('')
const type = ref(1) //1新建、、2编辑,3查看

// Reactive 数据
const formObj = reactive({
  cyEmissionSourceTransports: [{
    selectedRows: {}
  }], // 路段数据
  isTransport: false,
  attachment: '',
})

// 碳排因子相关
const cachesSlectedRows = ref({}) // 暂存碳排因子
const selectedRows = ref({})

// Methods
// ===============================================================碳排因子
/**
 * 打开选择碳排因子弹窗
 * 手动添加碳排因子弹窗
 */
const handleAdd = (type, index) => {
  if (index !== undefined) {
    transportIndex.value = index
  } else {
    transportIndex.value = undefined
  }
  if (type == 'chooseYZ') {
    // 选择因子
    visible2.value = true
  }
  if (type == 'addYZ') {
    // 手动添加因子
    visible3.value = true
  }
}

/**
 * 选择因子
 * @param value
 */
const onselectedRows = (value) => {
  console.log('onselectedRows', value)
  if (transportIndex.value !== undefined) {
    // 运输路段-碳排因子
    formObj.cyEmissionSourceTransports[transportIndex.value].cachesSlectedRows = value
  } else {
    // 基本信息-碳排因子
    cachesSlectedRows.value = value
  }
}

/**
 * 关闭选择碳排因子弹窗
 * 关闭手动添加碳排因子弹窗
 */
const handleCancel = () => {
  visible2.value = false
  visible3.value = false
}

/**
 * 选择碳排因子弹窗-确定
 */
const handleOk2 = () => {
  if (transportIndex.value !== undefined) {
    // 运输路段-碳排因子
    let theObj = formObj.cyEmissionSourceTransports[transportIndex.value]
    theObj.selectedRows = theObj.cachesSlectedRows
    theObj.emissionFactorId = theObj.cachesSlectedRows.id
    theObj.factorValue = theObj.cachesSlectedRows.factorValue
    theObj.emissionFactorUnit = theObj.cachesSlectedRows.numeratorUnit
    unitChange('km', theObj.selectedRows.denominatorUnit, transportIndex.value)
  } else {
    // 基本信息-碳排因子
    selectedRows.value = cachesSlectedRows.value
    formObj.emissionFactorId = cachesSlectedRows.value.id
    formObj.factorValue = cachesSlectedRows.value.factorValue
    formObj.emissionFactorUnit = cachesSlectedRows.value.numeratorUnit
    unitChange(formObj.flowUnitName, selectedRows.value.denominatorUnit)
  }
  visible2.value = false
}

/**
 * 手动添加碳排因子弹窗-确定
 */
const handleOk3 = () => {
  if (!yzAddViewRef.value?.checkFormData()) {
    return
  }
  console.log('handleOk3', yzAddViewRef.value.queryParam)
  defHttp.post({
    url: "/emission/factor/cyEmissionFactor/addEmissionByCarbonCheck",
    params: yzAddViewRef.value.queryParam
  }).then((res) => {
    if (res) {
      createMessage.success(t('carbon.message.add_success'))
      formObj.emissionFactorId = res
      listInfo()
    }
  })
}

/**
 * 获取因子数据
 */
const listInfo = () => {
  console.log('emissionFactorId', formObj)
  defHttp.get({
    url: "/emission/factor/cyEmissionFactor/listInfo",
    params: {
      id: formObj.emissionFactorId
    }
  }).then((res) => {
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
      }
      if (transportIndex.value !== undefined) {
        // 运输路段-碳排因子
        let theObj = formObj.cyEmissionSourceTransports[transportIndex.value]
        theObj.selectedRows = selectedRowsData
        theObj.emissionFactorId = selectedRowsData.id
        theObj.factorValue = selectedRowsData.factorValue
        theObj.emissionFactorUnit = selectedRowsData.numeratorUnit
        unitChange('km', theObj.selectedRows.denominatorUnit, transportIndex.value)
      } else {
        // 基本信息-碳排因子
        selectedRows.value = selectedRowsData
        formObj.emissionFactorId = selectedRowsData.id
        formObj.factorValue = selectedRowsData.factorValue
        formObj.emissionFactorUnit = selectedRowsData.numeratorUnit
        unitChange(formObj.flowUnitName, selectedRows.value.denominatorUnit)
      }
      console.log('listInfo formObj', formObj)
      visible3.value = false
    }
  })
}

// ===============================================================碳排因子
const onChangeIsTransport = (e) => {
  console.log(e)
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
const onChangeActiveKey = (key) => {
  console.log('onChangeActiveKey', key)
  activeKey.value = key
  if (formObj.cyEmissionSourceTransports == null || formObj.cyEmissionSourceTransports.length <= 0) {
    formObj.cyEmissionSourceTransports = []
    formObj.cyEmissionSourceTransports.push({
      selectedRows: {
        denominatorUnit: "",
      },
    })
  }
}

/**
 * 检查表单数据
 */
const checkFormData = () => {
  // 基础信息
  if (!formObj.emissionSourceType) {
    createMessage.warn(t('carbon.message.please_select_basic_information_type'))
    return false
  }
  if (!formObj.emissionSourceName) {
    createMessage.warn(t('carbon.message.please_enter_basic_information_name'))
    return false
  }
  if (!formObj.emissionSourceNumber) {
    createMessage.warn(t('carbon.message.please_enter_basic_information_quantity'))
    return false
  }
  if (!formObj.emissionSourceUnit) {
    createMessage.warn(t('carbon.message.please_select_basic_information_unit'))
    return false
  }
  if (!formObj.dataSources) {
    createMessage.warn(t('carbon.message.please_select_basic_information_data_source'))
    return false
  }
  if (!formObj.emissionFactorId) {
    createMessage.warn(t('carbon.message.please_select_basic_information_carbon_emission_factor'))
    return false
  }
  if (!formObj.factorRatio) {
    createMessage.warn(t('carbon.message.please_enter_basic_information_unit_scale_conversion'))
    return false
  }
  // 运输信息
  if (formObj.isTransport) {
    if (!formObj.weight) {
      createMessage.warn(t('carbon.message.please_enter_shipping_information_cargo_weight'))
      return false
    }
    if (!formObj.weightUnit) {
      createMessage.warn(t('carbon.message.please_select_transportation_information_cargo_weight_unit'))
      return false
    }
    let errName = null
    let errIndex = null
    for (let i = 0; i < formObj.cyEmissionSourceTransports.length; i++) {
      let obj = formObj.cyEmissionSourceTransports[i]
      if (!obj.distance) {
        errIndex = i
        errName = t('carbon.message.please_enter_transportation_information_link_distance')
        break
      }
      if (!obj.vehicleId) {
        errIndex = i
        errName = t('carbon.message.please_select_transportation_information_section_transportation')
        break
      }
      if (!obj.emissionFactorId) {
        errIndex = i
        errName = t('carbon.message.please_select_transportation_information_link_emission_factor')
        break
      }
      if (!obj.factorRatio) {
        errIndex = i
        errName = t('carbon.message.please_select_transportation_information_company_proportion_conversion')
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
const onSubmit = () => {
  if (type.value == 1) {
    console.log('onSubmit', formObj)
    if (checkFormData()) {
      let reqData = cloneObject(formObj)
      if (!reqData.isTransport) {
        // 不需要运输，清除运输数据
        reqData.weight = 0
        delete reqData.weightUnit
        delete reqData.cyEmissionSourceTransports
      } else {
        // 需要运输，清除多余数据
        reqData.cyEmissionSourceTransports.forEach(item => {
          delete item.cachesSlectedRows
          delete item.selectedRows
        })
      }
      console.log('saveFlow reqData', reqData)
      defHttp.post({
        url: '/CyWorkmanshipEmissionSource/cyWorkmanshipEmissionSource/add',
        params: reqData
      }).then((res) => {
        if (res) {
          createMessage.success(res.message)
          emit('back')
          onClose()
        }
      })
    }
  } else if (type.value == 2) {
    console.log('onSubmit', formObj)
    if (checkFormData()) {
      let reqData = cloneObject(formObj)
      if (!reqData.isTransport) {
        // 不需要运输，清除运输数据
        reqData.weight = 0
        delete reqData.weightUnit
        delete reqData.cyEmissionSourceTransports
      } else {
        // 需要运输，清除多余数据
        reqData.cyEmissionSourceTransports.forEach(item => {
          delete item.cachesSlectedRows
          delete item.selectedRows
        })
      }
      console.log('saveFlow reqData', reqData)
      defHttp.post({
        url: '/CyWorkmanshipEmissionSource/cyWorkmanshipEmissionSource/edit',
        params: reqData
      }).then((res) => {
        if (res) {
          createMessage.success(res.message)
          emit('back')
          onClose()
        }
      })
    }
  }
}

const getData = () => {
  console.log('inputAndOutputForm getData')
  // 数据来源
  defHttp.get({
    url: '/sys/api/getDictItems',
    params: {
      dictCode: 'flow_data_sources'
    }
  }).then((res) => {
    flow_data_sourcesData.value = res || []
    console.log('getDictItems flow_data_sources =>', res)
  })

  // 交通工具
  defHttp.get({
    url: '/sys/api/getDictItems',
    params: {
      dictCode: 'vehicle_code'
    }
  }).then((res) => {
    vehicle_codeData.value = res || []
    console.log('getDictItems vehicle_code =>', res)
  })

  // 单位产品重量
  defHttp.get({
    url: "/emission/factor/cyEmissionUnit/getAllUnit"
  }).then((res) => {
    if (res) {
      unit_product_weightData.value = res || []
    }
  })

  // 单位
  defHttp.get({
    url: '/emission/factor/cyEmissionUnit/getAllUnitByGroup'
  }).then((res) => {
    if (res) {
      getAllUnitByGroupData.value = res || {}
    }
  })

  // 产品类型
  defHttp.get({
    url: '/sys/api/getDictItems',
    params: {
      dictCode: 'product_type'
    }
  }).then((res) => {
    product_typeData.value = res || []
    console.log('getDictItems product_type =>', res)
  })

  const token = localStorage.getItem(ACCESS_TOKEN)
  headers.value = {"X-Access-Token": token}
}

// ==========================================================基础信息
/**
 * 修改基础信息-类型
 */
const onChangeFlowType = (value) => {
  console.log('onChangeFlowType', value)
  let theIndex = product_typeData.value.findIndex(ele => ele.value == value)
  if (theIndex > -1) {
    formObj.emissionSourceTypeName = product_typeData.value[theIndex].text
  }
}

/**
 * 修改基础信息-单位
 */
const onChangeFlowUnit = (e) => {
  console.log('onChangeFlowUnit', e, getAllUnitByGroupData.value)
  for (let key in getAllUnitByGroupData.value) {
    let value = getAllUnitByGroupData.value[key]
    for (let index = 0; index < value.length; index++) {
      if (value[index].id == e) {
        formObj.emissionSourceUnitName = value[index].unitCode
        unitChange(formObj.flowUnitName, selectedRows.value.denominatorUnit)
      }
    }
  }
  console.log('onChangeFlowUnit', formObj)
}

/**
 * 修改基础信息-数据来源
 */
const onChangeFlowDataSources = (value) => {
  console.log('onChangeFlowDataSources', value)
  let theIndex = flow_data_sourcesData.value.findIndex(ele => ele.value == value)
  if (theIndex > -1) {
    formObj.dataSourcesName = flow_data_sourcesData.value[theIndex].text
  }
}

// ==========================================================运输信息
/**
 * 修改重量单位
 */
const onChangeWeightUnit = (value) => {
  console.log('onChangeWeightUnit', value)
  let theIndex = unit_product_weightData.value.findIndex(ele => ele.id == value)
  if (theIndex > -1) {
    formObj.weightUnitName = unit_product_weightData.value[theIndex].unitCode
  }
}

/**
 * 修改交通工具
 */
const onChangeVehicleId = (value, transportItem) => {
  console.log('onChangeVehicleId', value, vehicle_codeData.value)
  let theIndex = vehicle_codeData.value.findIndex(ele => ele.value == value)
  if (theIndex > -1) {
    transportItem.vehicleName = vehicle_codeData.value[theIndex].text
  }
}

/**
 * 添加路段
 */
const onAddTransport = () => {
  if (formObj.cyEmissionSourceTransports == null) {
    formObj.cyEmissionSourceTransports = []
  }
  formObj.cyEmissionSourceTransports.push({
    selectedRows: {}
  })
  let data1 = formObj.cyEmissionSourceTransports.length - 1
  activeCollapseKey.value.push(String(data1))
  console.log('onAddTransport', activeCollapseKey.value)
}

/**
 * 删除路段
 * @param transportIndex
 */
const onDelTransport = (index) => {
  formObj.cyEmissionSourceTransports.splice(index, 1)
}

const unitChange = (sourceUnit, targetUnit, transportIndexVal) => {
  console.log('unitChange', sourceUnit, targetUnit, transportIndexVal)
  if (sourceUnit && targetUnit) {
    if (sourceUnit == targetUnit) {
      formObj.factorRatio = 1
    } else {
      defHttp.get({
        url: "/emission/factor/cyEmissionFactor/api/getConvertValue",
        params: {
          sourceUnit,
          targetUnit
        }
      }).then((res) => {
        if (res) {
          if (transportIndexVal !== undefined) {
            formObj.cyEmissionSourceTransports[transportIndexVal].factorRatio = res
          } else {
            formObj.factorRatio = res
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
const filterOption = (input, option) => {
  return (
    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  )
}

/**
 * 关闭抽屉，初始化数据
 */
const onClose = () => {
  Object.assign(formObj, {
    cyEmissionSourceTransports: [{
      selectedRows: {}
    }], // 路段数据
    isTransport: false,
  })
  selectedRows.value = {}
  visible.value = false
}

// 暴露给父组件的方法
defineExpose({
  getData,
  listInfo,
  type,
  formObj,
  visible,
  drawerTitle
})
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

  :deep(.ant-upload) {
    width: 120px !important;
    height: 120px !important;
  }

  :deep(.ant-upload-text) {
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
  }
}

.butons{
  display: inline-flex;
  align-items: center;
  background: #FFFFFF;
  border-radius: 3px 3px 3px 3px;
  border: 1px solid #DCDCDC;
  font-weight: 400;
  font-size: 14px;
  color: #148958;
  padding: 5px 16px;

  img{
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
  background: #F5F7F6;
}

:deep(.ant-collapse-content) {
  background: #F5F7F6;
}

:deep(.ant-collapse-content-box) {
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
  border: 1px solid #148958;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #148958;

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
