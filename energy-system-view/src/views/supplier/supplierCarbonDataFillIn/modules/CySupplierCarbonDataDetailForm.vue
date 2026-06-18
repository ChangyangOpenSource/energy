<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form
        ref="formRef"
        :model="model"
        :rules="validatorRules"
      >
        <div style="margin-left: 70px">
          <a-row>
            <a-col :span="24">
              <span class="spanTitle">{{ t('carbon.message.BasicInfoDetail') }}</span>
            </a-col>

            <div style="padding: 40px 0px 40px 0px">
              <a-row :gutter="[128, 128]">
                <a-col :span="8">
                  <a-form-item :label="t('carbon.message.FillName')">
                    {{ model.fillInName }}
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="t('carbon.message.FillInType')">
                    {{ model.fillInType == 1 ? t('carbon.message.Product_carbon_footprint') : t('carbon.message.Organization_carbon_inventory') }}
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    :label="t('carbon.message.Form_Label_SupplierName')"
                    :labelCol="{ span: 14 }"
                    :wrapperCol="{ span: 10 }"      style="white-space: nowrap;"
                  >
                    {{ model.fillInUserId_dictText }}
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="[128, 128]">
                <a-col :span="8" v-if="model.fillInType == 1" >
                  <a-form-item
                    :label="t('carbon.message.FillName')">
                    {{ model.supplierProductId_dictText }}
                  </a-form-item>
                </a-col>

                <a-col :span="8" v-if="model.fillInType == 1">
                  <a-form-item
                    :label="t('carbon.message.Specifications_and_models')">
                    {{ model.productSpecification }}
                  </a-form-item>
                </a-col>

                <a-col :span="8" v-if="model.fillInType == 1">
                  <a-form-item
                    :label="t('carbon.message.Unit')">
                    {{ model.productUnitId_dictText }}
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="[128, 128]">
                <a-col :span="8">
                  <a-form-item
                    :label="t('carbon.message.FillingRequirements')">
                    {{ model.fillInRemark }}
                  </a-form-item>
                </a-col>

                <a-col :span="8">
                  <a-form-item
                    :label="t('carbon.message.Inviter')">
                    {{ model.promoterId_dictText }}
                  </a-form-item>
                </a-col>

                <a-col :span="8">
                  <a-form-item
                    :label="t('carbon.message.Invitation_time')" style="white-space: nowrap;">
                    {{ model.promoteTime }}
                  </a-form-item>
                </a-col>
              </a-row>

            </div>
          </a-row>

          <!-- 碳排数据填报标题 -->
          <div class="marBotrtom">
            <span class="spanTitle">{{ t('carbon.message.CarbonDataFilling') }}</span>
          </div>

          <div class=" marBotrtom flex flexOne" >
            <div v-if="model.fillInType == 1">
              <div class="select">
                <a-radio-group
                  :default-value="0"
                  v-model:value="model.standardType"
                  button-style="solid"
                  @change="standardTypeChange"
                >
                  <a-radio-button value="1"> {{ t('carbon.message.SystemMatching') }} </a-radio-button>
                  <a-radio-button value="2"> {{ t('carbon.message.ManualFilling') }} </a-radio-button>
                </a-radio-group>
              </div>
            </div>
            <div v-if="model.fillInType == 1 && model.standardType == 1" style="margin-left: 420px" >
              <a-button type="primary" @click="selectCalculateProduct()">{{ t('carbon.message.SelectCalculationProduct') }}</a-button>
            </div>
          </div>

          <div class="marps">
            <div v-if="model.fillInType == 1" class="flex">
              <div class="marright" style="transform: translateY(5px);">
                <span style="color:red ">*</span>
                {{ t('carbon.message.accounting_cycle') }}:
              </div>
              <a-range-picker v-model:value="dateRange" @change="onChange" :disabled="selectExistCalculateDataDisabled" />
            </div>
            <div v-if="model.fillInType == 2" class="flex">
              <div style="transform: translateY(5px);" class="marright">
                <span style="color:red ">*</span>
                {{ t('carbon.message.CalculationYear') }}:
              </div>
              <a-date-picker
                :placeholder="t('carbon.message.SelectYear')"
                v-model:value="model.calculateYear"
                allowClear
                :format="yearFormat"
                :valueFormat="yearFormat"
                mode="year"
                :open="yearOpen"
                @panelChange="opanelChange"
                @openChange="onopenelChange"
              />
            </div>
            <div class="flex">
              <div class="marright" style="transform: translateY(5px);">
                <span style="color:red ">*</span>
                {{ t('carbon.message.CarbonEmissions') }}:
              </div>
              <div class="marright" style="display: flex; align-items: center">
                <a-input-number
                  v-model:value="model.carbonEmissions"
                  :placeholder="t('carbon.message.EnterCarbonEmissions')"
                  style="margin-right: 10px; width:220px"
                  :disabled="selectExistCalculateDataDisabled"
                ></a-input-number>
                <a-select
                  v-model:value="model.carbonEmissionsUnitId"
                  :placeholder="t('carbon.message.Please_select')"
                  show-search
                  @change="totalUnitChange"
                  :disabled="selectExistCalculateDataDisabled"
                >
                  <a-select-option
                    :value="item.id"
                    v-for="(item, index) in unitList"
                    :key="index"
                  >
                    {{ item.factorUnit }}
                  </a-select-option>
                </a-select>
              </div>

              <div v-if="model.fillInType == 1" class="flex">
                <div class="marright" style="transform: translateY(5px); margin-left:10px">
                  <span style="color:red ">*</span>
                  {{ t('carbon.message.accountingUnit') }}:
                </div>
                <a-input-number v-model:value="model.calculateUnitNumber" :placeholder="t('carbon.message.Please_enter')" class="marright"></a-input-number>
                <a-input v-model:value="model.productUnitId_dictText" style="width: 100px"  disabled ></a-input>
              </div>

            </div>
          </div>

          <!-- 核算标准 -->
          <div class=" flex marBotrtom" v-if="model.fillInType == 2">
            <div style="transform: translateY(5px);">{{ t('carbon.message.Accounting_standard') }}：</div>
            <div class="select">
              <a-radio-group
                :default-value="0"
                v-model:value="model.standardId"
                button-style="solid"
                @change="standardChange()"
              >
                <a-radio-button value="A01A02"> ISO </a-radio-button>
                <a-radio-button value="A01A01"> GHG </a-radio-button>
              </a-radio-group>
            </div>
          </div>

          <!-- 组织碳盘查类别 -->
          <div class="marps" v-if="model.fillInType == 2" >
            <div
              v-for="item in treeDate"
              :key="item.categoryId"
              class="flex flexOne"
            >
              <div class="text">{{ item.title }}</div>
              <!-- 排放源 -->
              <a-input-number
                v-model:value="item.carbonEmissions"
                :placeholder="t('carbon.message.Please_enter')"
              ></a-input-number>
              <!-- 排放源单位 -->
              <a-select
                v-model:value="item.carbonEmissionsUnitId"
                :placeholder="t('carbon.message.Please_select')"
                show-search
                style="width: 200px; margin-left: 5px"
                :disabled="itemUnitDisabled"
              >
                <a-select-option
                  :value="unitItem.id"
                  v-for="(unitItem, index) in unitList"
                  :key="index"
                >
                  {{ unitItem.factorUnit }}
                </a-select-option>
              </a-select>
            </div>
          </div>

          <!-- 产品碳足迹类别 -->
          <a-form :model="model" layout="horizontal" v-if="model.fillInType == 1">
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-item :label="t('carbon.message.Life_cycle_boundary')" required>
                  <div class="lifeCycleTypeBox">
                    <div
                      class="lifeCycleTypeBox_item"
                      :class="{'lifeCycleTypeBox_item_active':model.lifeCycleType == 1 && selectExistCalculateDataDisabled == false ,'m_hoverCP':!selectExistCalculateDataDisabled}"
                      @click="onChangeLifeCycleType(1)">
                      <img class="lifeCycleTypeBox_item_icon" :src="img44" alt=""/>
                      <div class="lifeCycleTypeBox_item_text1">{{ t('carbon.message.From_cradle_to_gate') }}</div>
                      <div class="lifeCycleTypeBox_item_text2">{{ t('carbon.message.From_the_acquisition_of_raw_materials_to_the_delivery_of_products') }}</div>
                    </div>
                    <div
                      class="lifeCycleTypeBox_item"
                      :class="{'lifeCycleTypeBox_item_active':model.lifeCycleType == 2 && selectExistCalculateDataDisabled == false,'m_hoverCP':!selectExistCalculateDataDisabled}"
                      @click="onChangeLifeCycleType(2)">
                      <img class="lifeCycleTypeBox_item_icon" :src="img44" alt=""/>
                      <div class="lifeCycleTypeBox_item_text1">{{ t('carbon.message.From_cradle_to_grave') }}</div>
                      <div class="lifeCycleTypeBox_item_text2">{{ t('carbon.message.From_raw_material_acquisition_to_product_abandonment') }}</div>
                    </div>
                    <div
                      class="lifeCycleTypeBox_item"
                      :class="{'lifeCycleTypeBox_item_active':model.lifeCycleType == 3,'m_hoverCP':!disabled}">
                      <img class="lifeCycleTypeBox_item_icon" :src="img44" alt=""/>
                      <div class="lifeCycleTypeBox_item_text1">{{ t('carbon.message.Custom_life_cycle') }}</div>
                      <div class="lifeCycleTypeBox_item_content">
                        <a-checkbox-group
                          v-model:value="model.customizeCacheLifeCycleItem"
                          :disabled="selectExistCalculateDataDisabled"
                          @change="onChangeLifeCycleItem">
                          <a-row :gutter="[0,8]">
                            <a-col :span="8">
                              <a-checkbox value="1">{{ t('carbon.message.Raw_material_acquisition') }}</a-checkbox>
                            </a-col>
                            <a-col :span="8">
                              <a-checkbox value="2">{{ t('carbon.message.Production_manufacturing') }}</a-checkbox>
                            </a-col>
                            <a-col :span="8">
                              <a-checkbox value="3">{{ t('carbon.message.Distribution_and_storage') }}</a-checkbox>
                            </a-col>
                            <a-col :span="8">
                              <a-checkbox value="4">{{ t('carbon.message.Product_use') }}</a-checkbox>
                            </a-col>
                            <a-col :span="8">
                              <a-checkbox value="5">{{ t('carbon.message.Abandoned_disposal') }}</a-checkbox>
                            </a-col>
                          </a-row>
                        </a-checkbox-group>
                      </div>
                    </div>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>

          <div class="marps" v-if="model.fillInType == 1" >
            <!-- 循环生命周期总数组 -->
            <div v-for="(item,index) in productLifeCycle" :key="item.categoryId">
              <!-- 如果选择了对应的生命周期则渲染，否则不渲染 -->

              <div v-if="model.lifeCycleType == 3">
                <div
                  v-if="model.customizeCacheLifeCycleItem && model.customizeCacheLifeCycleItem.includes(item.categoryId)"
                  class="flex flexOne">
                  <div style="width:80px; transform: translateY(5px);" >{{ item.text }}:</div>
                  <!-- 排放源 -->
                  <a-input-number
                    v-model:value="item.carbonEmissions"
                    :placeholder="t('carbon.message.Please_enter')"
                    :disabled="selectExistCalculateDataDisabled"
                  ></a-input-number>
                  <!-- 排放源单位 -->
                  <a-select
                    v-model:value="item.carbonEmissionsUnitId"
                    :placeholder="t('carbon.message.Please_select')"
                    show-search
                    style="width: 200px; margin-left: 5px"
                    :disabled="itemUnitDisabled"
                  >
                    <a-select-option
                      :value="unitItem.id"
                      v-for="(unitItem, index) in unitList"
                      :key="index"
                    >
                      {{ unitItem.factorUnit }}
                    </a-select-option>
                  </a-select>
                </div>

              </div>
              <div v-else>
                <div
                  v-if="model.cacheLifeCycleItem && model.cacheLifeCycleItem.includes(item.categoryId)"
                  class="flex flexOne">
                  <div style="width:80px; transform: translateY(5px);" >{{ item.text }}:</div>
                  <!-- 排放源 -->
                  <a-input-number
                    v-model:value="item.carbonEmissions"
                    :placeholder="t('carbon.message.Please_enter')"
                    :disabled="selectExistCalculateDataDisabled"
                  ></a-input-number>
                  <!-- 排放源单位 -->
                  <a-select
                    v-model:value="item.carbonEmissionsUnitId"
                    :placeholder="t('carbon.message.Please_select')"
                    show-search
                    style="width: 200px; margin-left: 5px"
                    :disabled="itemUnitDisabled"
                  >
                    <a-select-option
                      :value="unitItem.id"
                      v-for="(unitItem, index) in unitList"
                      :key="index"
                    >
                      {{ unitItem.factorUnit }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
            </div>
          </div>

          <!-- //上传 -->
          <div class=" flex">
            <div style="transform: translateY(5px); margin-right:10px ">
              {{ t('carbon.message.Data_certificate') + ":" }}
            </div>
            <JUpload v-model:value="model.attachment" :number="3"></JUpload>
          </div>
        </div>
      </a-form>

      <!-- 选择核算产品对话框 -->
      <a-modal
        v-model:visible="calculateProductModalVisible"
        :title="t('carbon.message.SelectCalculationProduct')"
        :width="900"
        @ok="handleOk"
      >

        <div style="padding: 20px">
          <a-table
            ref="tableRef"
            size="middle"
            :scroll="{x:true}"
            rowKey="id"
            :columns="columns"
            :data-source="calculateDataList"
            :pagination="ipagination"
            :row-selection="{type: 'radio',selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            class="j-table-force-nowrap"
            @change="handleTableChange"
          >

            <template #calculatePeriodSlot="{text, record}">
              {{ record.beginTime }}-{{ record.endTime }}
            </template>

            <template #lifeCycleTypeSlot="{text, record}">
              {{ record.lifeCycleType == 1 ? t('carbon.message.From_cradle_to_gate') : record.lifeCycleType == 2 ? t('carbon.message.From_cradle_to_grave') : record.lifeCycleType == 3 ? t('carbon.message.Customize') : "" }}
            </template>

            <template #totalCarbonEmissionSlot="{text, record}">
              {{ record.totalCarbonEmission }} kgCO₂e
            </template>

            <template #calculateNumberSlot="{text, record}">
              {{ record.calculateNumber }}{{ record.productUnitName }}
            </template>

            <template #unitProductCarbonEmissionSlot="{text, record}">
              {{ (record.totalCarbonEmission/ record.calculateNumber).toFixed(4) }} kgCO₂e/{{ record.productUnitName }}
            </template>

          </a-table>
        </div>
      </a-modal>

    </j-form-container>
  </a-spin>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { defHttp } from '/@/utils/http/axios'
import dayjs from "dayjs";
import _ from 'lodash'
import img44 from '@/assets/img/img44.png'
import { message } from 'ant-design-vue'
import JUpload from "@/components/Form/src/jeecg/components/JUpload/JUpload.vue";

// 国际化
const { t } = useI18n()

// 引用元素
const formRef = ref(null)
const tableRef = ref(null)

// Props
const props = defineProps({
  // 表单禁用
  disabled: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['ok'])

// 响应式数据
const model = reactive({})
const confirmLoading = ref(false)
const calculateProductModalVisible = ref(false)
const dateRange = ref([])
const unitList = ref([])
const treeDate = ref([])
const productBoundaryList = ref([])
const calculateDataList = ref([])
const selectedRowKeys = ref([])
const selectionRows = ref([])
const yearOpen = ref(false)
const itemUnitDisabled = ref(true)
const selectExistCalculateDataDisabled = ref(false)

// 分页参数
const ipagination = reactive({
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['10', '20', '30'],
  showTotal: (total, range) => {
    return range[0] + '-' + range[1] + ' 共' + total + '条'
  },
  showQuickJumper: true,
  showSizeChanger: true,
  total: 0
})

// 布局配置
const labelCol = {
  xs: { span: 24 },
  sm: { span: 5 }
}
const wrapperCol = {
  xs: { span: 24 },
  sm: { span: 16 }
}

// 验证规则
const validatorRules = reactive({
  calculateYear: [{ required: true, message: t('carbon.message.SelectCalculationYear') }],
  carbonEmissions: [{ required: true, message: t('carbon.message.EnterCarbonEmissions') }]
})

// URL配置
const url = {
  add: '/cySupplierCarbonData/add',
  edit: '/cySupplierCarbonData/edit',
  queryById: '/cySupplierCarbonData/queryById',
  // 碳数据填报任务--保存或确认提交接口
  saveOrConfirmSubmit: '/cySupplierCarbonDataItem/saveOrConfirmSubmit',
  // 选择已有的核算产品
  getAllCalculateList: '/cySupplierCarbonData/getAllCalculateList'
}

// 年份格式
const yearFormat = 'YYYY'

// 产品生命周期
const productLifeCycle = ref([
  {
    'categoryId': '1',
    'text': t('carbon.message.RawMaterialAcquisition'),
    'carbonEmissions': undefined,
    'carbonEmissionsUnitId': undefined
  },
  {
    'categoryId': '2',
    'text': t('carbon.message.ProductionManufacturing'),
    'carbonEmissions': undefined,
    'carbonEmissionsUnitId': undefined
  },
  {
    'categoryId': '3',
    'text': t('carbon.message.DistributionStorage'),
    'carbonEmissions': undefined,
    'carbonEmissionsUnitId': undefined
  },
  {
    'categoryId': '4',
    'text': t('carbon.message.ProductUsage'),
    'carbonEmissions': undefined,
    'carbonEmissionsUnitId': undefined
  },
  {
    'categoryId': '5',
    'text': t('carbon.message.WasteDisposal'),
    'carbonEmissions': undefined,
    'carbonEmissionsUnitId': undefined
  }
])

// 表格列定义
const columns = [
  {
    title: t('carbon.message.Product_name'),
    align: 'center',
    dataIndex: 'productName'
  },
  {
    title: t('carbon.message.Accounting_quantity'),
    align: 'center',
    dataIndex: 'calculateNumber',
    slots: { customRender: 'calculateNumberSlot' }
  },
  {
    title: t('carbon.message.Discharge_Amount'),
    align: 'center',
    dataIndex: 'totalCarbonEmission',
    slots: { customRender: 'totalCarbonEmissionSlot' }
  },
  {
    title: t('carbon.message.EmissionsPerUnitProduct'),
    align: 'center',
    dataIndex: 'unitProductCarbonEmission',
    slots: { customRender: 'unitProductCarbonEmissionSlot' }
  },
  {
    title: t('carbon.message.accounting_cycle'),
    align: 'center',
    dataIndex: 'calculatePeriod',
    slots: { customRender: 'calculatePeriodSlot' }
  },
  {
    title: t('carbon.message.Accounting_boundary'),
    align: 'center',
    dataIndex: 'lifeCycleType',
    slots: { customRender: 'lifeCycleTypeSlot' }
  }
]

// 计算属性
const formDisabled = computed(() => {
  return props.disabled
})

// 方法定义
// 系统填报或手动填报类型转变
const standardTypeChange = (e) => {
  // 如果是系统匹配，则不允许修改数据
  if (model.standardType == 1) {
    selectExistCalculateDataDisabled.value = true
  } else {
    selectExistCalculateDataDisabled.value = false
  }
  model.carbonEmissions = undefined
  model.carbonEmissionsUnitId = undefined
  model.calculateUnitNumber = undefined
  dateRange.value = []
  // 清空生命周期明细的数据
  for (let i = 0; i < productLifeCycle.value.length; i++) {
    productLifeCycle.value[i].carbonEmissions = undefined
    productLifeCycle.value[i].carbonEmissionsUnitId = undefined
  }
}

// 当主单位id改变时，所有子单位也改变
const totalUnitChange = (e) => {
  if (model.fillInType == 1) {
    for (let i = 0; i < productLifeCycle.value.length; i++) {
      productLifeCycle.value[i].carbonEmissionsUnitId = e
    }
  } else {
    for (let i = 0; i < treeDate.value.length; i++) {
      treeDate.value[i].carbonEmissionsUnitId = e
    }
  }
}

/**
 * 基本信息-生命周期边界
 * @param e
 */
const onChangeLifeCycleType = (e) => {
  if (selectExistCalculateDataDisabled.value == true) {
    return
  }
  console.log('onChangeLifeCycleType', e)
  model.lifeCycleType = e
  if (e == 1) {
    model.cacheLifeCycleItem = ['1', '2', '3']
    // 清除自定义中选择的生命周期item
    model.customizeCacheLifeCycleItem = []
  } else if (e == 2) {
    model.cacheLifeCycleItem = ['1', '2', '3', '4', '5']
    // 清除自定义中选择的生命周期item
    model.customizeCacheLifeCycleItem = []
  }
  // 切换类型时，将所有值全部清除
  for (let i = 0; i < productLifeCycle.value.length; i++) {
    productLifeCycle.value[i].carbonEmissions = undefined
    productLifeCycle.value[i].carbonEmissionsUnitId = model.carbonEmissionsUnitId
  }
}

/**
 * 基本信息-生命周期边界
 * @param e
 */
const onChangeLifeCycleItem = (e) => {
  console.log('onChangeLifeCycleItem', e)
  // 将不是自定义生命周期的数组清空
  model.cacheLifeCycleItem = undefined

  // 如果只有一个单独清除清除值
  if(e.length == 1){
    productLifeCycle.value[e[0] - 1].carbonEmissions = undefined
    productLifeCycle.value[e[0] - 1].carbonEmissionsUnitId = model.carbonEmissionsUnitId
  }
  // 如果那个子项被去除了，就清空那个子项的值
  for (let i = 0; i < productLifeCycle.value.length; i++) {
    if (!e.includes(productLifeCycle.value[i].categoryId)) {
      productLifeCycle.value[i].carbonEmissions = undefined
      productLifeCycle.value[i].carbonEmissionsUnitId = model.carbonEmissionsUnitId
    }
  }
  model.lifeCycleType = 3
}

const onSelectChange = (selectedRowKeys, selectionRows) => {
  selectedRowKeys.value = selectedRowKeys
  selectionRows.value = selectionRows
}

const handleTableChange = (pagination, filters, sorter) => {
  // 分页、排序、筛选变化时触发
  // TODO 筛选
  console.log(pagination)
  if (Object.keys(sorter).length > 0) {
    // 这里应该有 isorter 的定义，但原代码中未定义
  }
  ipagination.current = pagination.current
  ipagination.pageSize = pagination.pageSize
  defHttp.get({
    url: url.getAllCalculateList,
    params: {
      pageNo: ipagination.current,
      pageSize: ipagination.pageSize
    }
  }, { isTransformResponse: false}).then((res) => {
    console.log(res.result.records)
    calculateDataList.value = res.result.records
  })
}

// 提交选择的产品核算数据
const handleOk = () => {
  if (selectionRows.value.length < 1) {
    message.warning(t('carbon.message.Please_select_one_calculation'))
  } else {
    console.log(selectionRows.value)
    // 目前是单选框，所以直接取第一个就行
    model.carbonEmissions = selectionRows.value[0].totalCarbonEmission
    model.carbonEmissionsUnitId = '2'
    model.calculateBeginTime = selectionRows.value[0].beginTime
    model.calculateEndTime = selectionRows.value[0].endTime
    model.lifeCycleType = selectionRows.value[0].lifeCycleType
    // 清理子项内部数据
    for (let i = 0; i < productLifeCycle.value.length; i++) {
      productLifeCycle.value[i].carbonEmissions = undefined
      productLifeCycle.value[i].carbonEmissionsUnitId = model.carbonEmissionsUnitId
    }
    // 将查询出的生命周期明细值,赋值到输入框中
    for (let i = 0; i < selectionRows.value[0].lifeCycleItemList.length; i++) {
      const existingIndex = productLifeCycle.value.findIndex(item => item.categoryId == selectionRows.value[0].lifeCycleItemList[i].lifeCycleTypeId)
      if (existingIndex != -1) {
        productLifeCycle.value[existingIndex].carbonEmissions = selectionRows.value[0].lifeCycleItemList[i].carbonEmission
        // 由于产品碳足迹那边每个生命周期的值单位固定为kg，所以默认给kg
        productLifeCycle.value[existingIndex].carbonEmissionsUnitId = '2'
        // selectionRows.value[0].lifeCycleItemList[i].carbonEmissionsUnitId
      }
    }
    model.cacheLifeCycleItem = selectionRows.value[0].lifeCycleItem.split(',')
    calculateProductModalVisible.value = false
  }
}

/**
 * 产品边界改变时获取所有子级
 */
const productBoundaryChange = (pcode) => {
  defHttp.get({
    url: '/sys/category/loadTreeRoot',
    params: {
      pcode: pcode,
      async: false
    }
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      // 将对象进行重构
      res.result.forEach((item, index, array) => {
        // 完全替换原对象
        array[index] = {
          supplierCarbonDataId: model.id, // 供应商碳数据id
          fillInType: model.fillInType, // 填报类型
          categoryId: item.key, // 类别id
          title: item.title, // 类别标题
          carbonEmissions: 0, // 排放量
          carbonEmissionsUnitId: undefined // 排放量单位
        }
        // 查找匹配的索引
        const existingIndex =
          model.cySupplierCarbonDataItemList.findIndex(
            (dataItem) => dataItem.categoryId == item.key
          )
        // 如果找到匹配项,重新赋值排放量和单位
        if (existingIndex !== -1) {
          array[index].carbonEmissions =
            model.cySupplierCarbonDataItemList[
              existingIndex
              ].carbonEmissions
          array[index].carbonEmissionsUnitId =
            model.cySupplierCarbonDataItemList[
              existingIndex
              ].carbonEmissionsUnitId
        }
      })
      treeDate.value = res.result
    }
  })
}

/**
 * 获取产品边界
 */
const getProductBoundary = () => {
  defHttp.get({
    url: '/sys/category/loadTreeRoot',
    params: {
      pcode: 'A05',
      async: false
    }
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      productBoundaryList.value = res.result
    }
  })
}

/**
 * 时间变换
 * @param date
 * @param dateString
 */
const onChange = (date, dateString) => {
  if (date.length == 2) {
    model.calculateBeginTime = dayjs(date[0].toDate()).format('YYYY-MM-DD')
    model.calculateEndTime = dayjs(date[1].toDate()).format('YYYY-MM-DD')
  } else {
    model.calculateBeginTime = undefined
    model.calculateEndTime = undefined
  }
}

// 选择已有的核算产品
const selectCalculateProduct = () => {
  calculateProductModalVisible.value = true
  defHttp.get({
    url: url.getAllCalculateList,
    params: {
      pageNo: ipagination.current,
      pageSize: ipagination.pageSize
    }
  }, { isTransformResponse: false}).then((res) => {
    console.log(res.result.records)
    calculateDataList.value = res.result.records
  })
}

// 保存或确认提交
const saveOrConfirmSubmit = (flag) => {
  // 产品碳足迹的数据校验
  if(model.fillInType == 1){
    if(!model.calculateBeginTime || !model.calculateEndTime){
      message.warning(t('carbon.message.Please_select_accounting_period'))
      return
    }else if(!model.carbonEmissions){
      message.warning(t('carbon.message.Please_enter_carbon_emissions'))
      return
    }else if(!model.carbonEmissionsUnitId){
      message.warning(t('carbon.message.Please_select_carbon_emissions_unit'))
      return
    }else if(!model.calculateUnitNumber){
      message.warning(t('carbon.message.Please_enter_accounting_unit_quantity'))
      return
    }

    if(model.lifeCycleType != 3){
      if(!model.cacheLifeCycleItem || model.cacheLifeCycleItem.length < 0){
        message.warning(t('carbon.message.Please_select_life_cycle_boundary'))
        return
      }
    }else{
      if(!model.customizeCacheLifeCycleItem || model.customizeCacheLifeCycleItem.length < 0  ){
        message.warning(t('carbon.message.Please_select_life_cycle_boundary'))
        return
      }
    }

  }else{
    // 组织碳盘查的数据校验
    if(!model.calculateYear){
      message.warning(t('carbon.message.Please_select_calculation_year'))
      return
    }else if(!model.carbonEmissions){
      message.warning(t('carbon.message.Please_enter_carbon_emissions'))
      return
    }else if(!model.carbonEmissionsUnitId){
      message.warning(t('carbon.message.Please_select_carbon_emissions_unit'))
      return
    }
  }

  if (model.fillInType == 1) {
    model.cySupplierCarbonDataItemList = productLifeCycle.value
  } else {
    // 赋值碳数据详情数据
    model.cySupplierCarbonDataItemList = treeDate.value
  }
  // 设置保存或确认提交的标致
  model.saveOrSubmitFlag = flag
  // 将选择的生命周期数组数据转为字符串，并重新复制
  let reqData = _.cloneDeep(model)
  if (reqData.fillInType == 1 && reqData.cacheLifeCycleItem && Array.isArray(reqData.cacheLifeCycleItem)) {
    if(reqData.lifeCycleType != "3"){
      reqData.cacheLifeCycleItem = reqData.cacheLifeCycleItem.join(',')
    }
  }else if (reqData.fillInType == 1 && reqData.customizeCacheLifeCycleItem && Array.isArray(reqData.customizeCacheLifeCycleItem)){
    if(reqData.lifeCycleType == "3"){
      reqData.cacheLifeCycleItem = reqData.customizeCacheLifeCycleItem.join(',')
    }
  }
  // 保存
  defHttp.post({
    url: url.saveOrConfirmSubmit,
    params: reqData
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      message.success(res.message)
      emit('ok')
    } else {
      message.warning(res.message)
    }
  })
}

// 过长省略
const ellipsis = (value) => {
  return value
    .split(' ')
    .map((v) => (v.length > 18 ? v.substr(0, 18) + '...' : v))
    .join(' ')
}

const standardChange = () => {
  model.standardGhgDetailIds = null
  model.standardIsoDetailIds = null
  loadTreeRoot(model.standardId)
}

/**
 * 核算标准
 */
const loadTreeRoot = (pcode) => {
  defHttp.get({
    url: '/sys/category/loadTreeRoot',
    params: {
      pcode: pcode,
      async: false
    }
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      // 将对象进行重构
      res.result.forEach((item, index, array) => {
        // 完全替换原对象
        array[index] = {
          supplierCarbonDataId: model.id, // 供应商碳数据id
          fillInType: model.fillInType, // 填报类型
          categoryId: item.key, // 类别id
          title: item.title, // 类别标题
          carbonEmissions: 0, // 排放量
          carbonEmissionsUnitId: model.carbonEmissionsUnitId // 排放量单位
        }
        // 查找匹配的索引
        const existingIndex =
          model.cySupplierCarbonDataItemList.findIndex(
            (dataItem) => dataItem.categoryId == item.key
          )
        // 如果找到匹配项,重新赋值排放量和单位
        if (existingIndex !== -1) {
          array[index].carbonEmissions =
            model.cySupplierCarbonDataItemList[
              existingIndex
              ].carbonEmissions
          array[index].carbonEmissionsUnitId =
            model.cySupplierCarbonDataItemList[
              existingIndex
              ].carbonEmissionsUnitId
        }
      })
      treeDate.value = res.result
    }
  })
}

const onSelect = (selectedKeys, e) => {
  // 这里的 selectedKeys 应该是响应式的，但原代码中未定义
  let standardDetailIds = ''

  if (e.selectedNodes[0].data.props.dataRef.leaf) {
    standardDetailIds = selectedKeys[0]
  } else {
    standardDetailIds = e.selectedNodes[0].data.props.dataRef.children
      .map((item) => item.key)
      .join(',')
  }
  if (model.standardId == 'A01A01') {
    // 这里的 form 应该是指 model，但原代码中有歧义
    model.standardGhgDetailIds = standardDetailIds
  } else {
    model.standardIsoDetailIds = standardDetailIds
  }
  // getData(1) 在原代码中未定义
}

// 获取所有单位
const getAllUnit = () => {
  defHttp.get({
    url: '/CyFactorUnit/cyFactorUnit/list'
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      unitList.value = res.result.records || []
    }
  })
}

/**
 *时间选择
 */
const onopenelChange = (status) => {
  yearOpen.value = status
}

const opanelChange = (value, mode) => {
  console.log(value, mode)
  model.calculateYear = dayjs(value).format('YYYY')
  yearOpen.value = false
}

const add = () => {
  // modelDefault 在原代码中未定义，这里使用空对象替代
  edit({})
}

const edit = (record) => {
  Object.assign(model, record)
  // visible 在原代码中未定义，这里不需要设置

  // 如果是产品碳足迹类型的，则查询产品边界
  if (model.fillInType == 1) {
    // 设置默认类型为系统填报
    if (!model.standardType) {
      // 如果没有类型，则默认设置为系统匹配
      model.standardType = '1'
      selectExistCalculateDataDisabled.value = true
    } else if (model.standardType == '1') {
      selectExistCalculateDataDisabled.value = true
    } else if (model.standardType == '2') {
      selectExistCalculateDataDisabled.value = false
    }
    // 查询产品边界
    getProductBoundary()
    // 如果产品边界不为空，则查询出产品边界下的所有分类
    if (model.standardId) {
      loadTreeRoot(model.standardId)
    }
    // 将生命周期明细字符串，切割为数组
    if (model.cacheLifeCycleItem && model.cacheLifeCycleItem != '') {
      if(model.lifeCycleType != 3){
        model.cacheLifeCycleItem = model.cacheLifeCycleItem.split(',')
      }else{
        model.customizeCacheLifeCycleItem = model.cacheLifeCycleItem.split(',')
      }
    }
    // 循环赋值，用于回显生命周期详细
    if (model.cySupplierCarbonDataItemList && model.cySupplierCarbonDataItemList.length > 0) {
      for (let i = 0; i < model.cySupplierCarbonDataItemList.length; i++) {
        for (let j = 0; j < productLifeCycle.value.length; j++) {
          if (productLifeCycle.value[j].categoryId == model.cySupplierCarbonDataItemList[i].categoryId) {
            productLifeCycle.value[j].carbonEmissions = model.cySupplierCarbonDataItemList[i].carbonEmissions
            productLifeCycle.value[j].carbonEmissionsUnitId = model.cySupplierCarbonDataItemList[i].carbonEmissionsUnitId
          }
        }
      }
    }
    // 如果是组织碳盘查类型的，则查询核算标准
    dateRange.value[0] = model.calculateBeginTime
    dateRange.value[1] = model.calculateEndTime
  } else {
    selectExistCalculateDataDisabled.value = false
    // 如果是查看页面，那么核算标准的id就不为空，就直接查询核算id下的所有分类
    if (model.standardId) {
      loadTreeRoot(model.standardId)
    } else {
      // 如果是新增页面，那么核算标准的id为空，则给出一个默认的核算标准值（iso标准）
      model.standardId = 'A01A02'
      loadTreeRoot(model.standardId)
    }
  }
}

// 提交表单（保存或确认提交页面数据）
const submitForm = () => {
  // 触发表单验证
  formRef.value.validate().then(() => {
    confirmLoading.value = true
    let httpurl = ''
    let method = ''
    if (!model.id) {
      httpurl += url.add
      method = 'post'
    } else {
      httpurl += url.edit
      method = 'put'
    }
    defHttp[method]({
      url: httpurl,
      params: model
    }, { isTransformResponse: false}).then((res) => {
      if (res.success) {
        message.success(res.message)
        emit('ok')
      } else {
        message.warning(res.message)
      }
    }).finally(() => {
      confirmLoading.value = false
    })
  }).catch(error => {
    console.log('表单验证失败:', error)
    confirmLoading.value = false
  })
}

// 生命周期钩子
onMounted(() => {
  // 备份model原始值
  // modelDefault 在原代码中未定义，这里跳过
  getAllUnit()
})

// 暴露方法给父组件
defineExpose({
  edit,
  saveOrConfirmSubmit
})
</script>

<style lang="less" scoped>
.nowarp{
  white-space: nowrap;
}
.marright {
  margin-right: 8px;
}
.marBotrtom {
  margin-bottom: 24px;
}
.marGina {
  margin-left: 12px;
}
.text {
  width: 350px;
}
.marps {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 24px;
}

.flex {
  display: flex;
  // align-items: center;
}
.flexOne {
  flex: 1;
}
.spanTitle {
  margin: 100px 0 500px 0;
  font-size: 20px;
  font-weight: 900;
}

.lifeCycleTypeBox {
  display: flex;
  justify-content: space-between;
  gap: 20px;

  .lifeCycleTypeBox_item {
    position: relative;
    flex: 1;
    box-sizing: border-box;
    padding: 24px;
    height: 132px;
    background: #FFFFFF;
    border-radius: 3px;
    border: 1px solid #DCDCDC;

    .lifeCycleTypeBox_item_icon {
      display: none;
    }

    .lifeCycleTypeBox_item_text1 {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
      line-height: 22px;
    }

    .lifeCycleTypeBox_item_text2 {
      margin-top: 12px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 12px;
      color: #888888;
      line-height: 22px;
    }

    .lifeCycleTypeBox_item_content {
      margin-top: 12px;
    }
  }

  .lifeCycleTypeBox_item_active {
    position: relative;
    background: #F7FDF8;
    border: 1px solid #148958;

    .lifeCycleTypeBox_item_icon {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      width: 45px;
      height: 39.5px;
    }

    .lifeCycleTypeBox_item_text1 {
      color: #148958;
    }

    .lifeCycleTypeBox_item_text2 {
    }

    .lifeCycleTypeBox_item_content {
      margin-top: 12px;
    }
  }
}
</style>
