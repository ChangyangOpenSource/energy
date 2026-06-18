<template>
  <div class="">
    <div class="cardHeader">
      <img class="cardHeader_icon m_hoverCP" :src="img28" alt="" @click="onBack"/>
      <span class="m_hoverCP" @click="onBack">{{ $t('carbon.message.Add_carbon_emission_factor') }}</span>
    </div>
    <section class="cardBox">
      <div class="cardBox_title">{{ $t('carbon.message.Carbon_emission_factor_information') }}</div>
      <div class="table-page-search-wrapper">
        <a-form :model="queryParam" layout="inline">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item :label="$t('carbon.message.Factor_name')" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }" required>
                <a-input v-model:value="queryParam.name" allow-clear :placeholder="$t('carbon.message.Please_enter')" :max-length="32"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="$t('carbon.message.Specifications_and_models')" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                <a-input v-model:value="queryParam.model" allow-clear :placeholder="$t('carbon.message.Please_enter')" :max-length="32"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="$t('carbon.message.Applicable_industries')" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                <a-select v-model:value="queryParam.industryId" allow-clear :placeholder="$t('carbon.message.Please_select')" show-search
                          :filter-option="filterOption" @change="onChangeIndustryId">
                  <a-select-option :value="item.id" v-for="(item,index) in industryData" :key="index">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="$t('carbon.message.Product_classification')" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                <a-select v-model:value="queryParam.productClassification" allow-clear :placeholder="$t('carbon.message.Please_select')" show-search
                          :filter-option="filterOption">
                  <a-select-option :value="item.value" v-for="(item,index) in product_typeData" :key="item.value">
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="$t('carbon.message.Applicable_scenario')" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                <a-input v-model:value="queryParam.scene" allow-clear :placeholder="$t('carbon.message.Please_enter')" :max-length="256"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="$t('carbon.message.Factor_description')" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                <a-input v-model:value="queryParam.instruction" allow-clear :placeholder="$t('carbon.message.Please_enter')" :max-length="512"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </section>
    <section class="cardBox" style="">
      <div class="cardBox_title">{{ $t('carbon.message.Data_details') }}</div>
      <div class="table-page-search-wrapper">
        <a-form :model="queryParam" layout="inline">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item :label="$t('carbon.message.Factor_unit')" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }" required>
                <div class="m_cFlex">
                  <a-select v-model:value="queryParam.numeratorUnitId" :placeholder="$t('carbon.message.Please_select')" show-search
                            :filter-option="filterOption" @change="onChangeNumeratorUnitId">
                    <a-select-option :value="item.id" v-for="(item,index) in fzData" :key="index">
                      {{ item.factorUnit }}
                    </a-select-option>
                  </a-select>
                  <span style="margin: 0 10px;">/</span>
                  <!-- <a-select v-model:value="queryParam.denominatorUnitId" :placeholder="$t('carbon.message.Please_select')" show-search
                            :filter-option="filterOption" @change="onChangeDenominatorUnitId">
                    <a-select-option :value="item.id" v-for="(item,index) in fmData" :key="index">
                      {{ item.unitCode }}
                    </a-select-option>
                  </a-select> -->
                  <UnitCascader :unitId="queryParam.denominatorUnitId" v-model:value="queryParam.denominatorUnitId" @change="(value, label) => onChangeDenominatorUnitId(value, label)"></UnitCascader>
                </div>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="`${$t('carbon.message.Factor_value')}（${$t('carbon.message.Carbon_dioxide_equivalent')}）`" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }" required>
                <div class="m_cFlex">
                  <a-input-number v-model:value="queryParam.factorValue" :step="0.0001" :precision="4"
                                  :disabled="queryParam.computerType == 2" allow-clear :placeholder="$t('carbon.message.Please_enter')"
                                  style="width: 200px"/>
                  <div class="switchBtn m_hoverCP" @click="onChangeComputerType"
                       v-if="queryParam.computerType == 1">
                    <img class="switchBtn_icon " :src="img29" alt=""/>{{ $t('carbon.message.Switch_ratio_calculation') }}
                  </div>
                  <div class="switchBtn m_hoverCP" @click="() => { queryParam.computerType = 1 }"
                       v-if="queryParam.computerType == 2">
                    <img class="switchBtn_icon " :src="img29" alt=""/>{{ $t('carbon.message.Switch_manual_transmission') }}
                  </div>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div style="margin-top: 20px;width: 1300px;" v-if="queryParam.computerType == 2">
        <a-table :columns="columns" :data-source="queryParam.gasList" :pagination="false" :bordered="false"
                 size="middle">
          <template #gasName="{ text, record }">
            <a-select v-model:value="record.gasName" :placeholder="$t('carbon.message.Please_select')" show-search :filter-option="filterOption"
                      @change="(e) => onChangeGas(e, record)" style="width: 100%;">
              <a-select-option :value="item.gasName" :disabled="item.disabled" v-for="(item,index) in gasData"
                               :key="item.gasName">
                {{ item.gasName }}
              </a-select-option>
            </a-select>
          </template>
          <template #factorValue="{ text, record }">
            <a-input-number v-model:value="record.factorValue" :step="0.0001" :precision="4" :placeholder="$t('carbon.message.Please_enter')"
                            @change="computeFactorValue" style="width: 100%;"/>
          </template>
          <template #gwpValue="{ text, record }">
            <a-input-number v-model:value="record.gwpValue" :step="0.01" :precision="4" :placeholder="$t('carbon.message.Please_enter')"
                            @change="computeFactorValue" style="width: 100%;"/>
          </template>
          <template #action="{ text, record, index }">
            <div class="m_ccFlex">
              <a-popconfirm :title="$t('carbon.message.Confirm_delete')" :cancel-text="$t('carbon.message.Cancel')"
                            :ok-text="$t('carbon.message.Confirm')" @confirm="() => onDel(index)">
                <a>{{ $t('carbon.message.Delete') }}</a>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
        <div class="addBtn m_hoverCP" @click="onAdd">
          <img class="addBtn_icon " :src="img30" alt=""/>{{ $t('carbon.message.Add_gas') }}
        </div>
      </div>
    </section>
    <section class="cardBox" :style="{'paddingBottom':paddingBottom}">
      <div class="cardBox_title">{{ $t('carbon.message.Source_information') }}</div>
      <div class="table-page-search-wrapper">
        <a-form :model="queryParam" layout="inline">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item :label="$t('carbon.message.Release_organization')" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                <a-input v-model:value="queryParam.releaseOrg" allow-clear :placeholder="$t('carbon.message.Please_enter')" :max-length="64"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="$t('carbon.message.Release_year')" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                <a-select v-model:value="queryParam.releaseYear" allow-clear :placeholder="$t('carbon.message.Please_select')" show-search
                          :filter-option="filterOption">
                  <a-select-option :value="item" v-for="(item,index) in yearData" :key="item">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="$t('carbon.message.Source_type')" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                <a-select v-model:value="queryParam.sourceType" allow-clear :placeholder="$t('carbon.message.Please_select')" show-search
                          :filter-option="filterOption">
                  <a-select-option :value="item.value" v-for="(item,index) in source_typeData" :key="item.value">
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="$t('carbon.message.Document_type')" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                <a-select v-model:value="queryParam.docType" allow-clear :placeholder="$t('carbon.message.Please_select')" show-search
                          :filter-option="filterOption">
                  <a-select-option :value="item.value" v-for="(item,index) in document_typeData" :key="item.value">
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="$t('carbon.message.Country_organization')" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                <a-input v-model:value="queryParam.ownership" allow-clear :placeholder="$t('carbon.message.Please_enter')" :max-length="128"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="$t('carbon.message.Source_file')" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                <a-input v-model:value="queryParam.sourceFile" allow-clear :placeholder="$t('carbon.message.Please_enter')" :max-length="128"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="$t('carbon.message.Source_URL_link')" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                <a-input v-model:value="queryParam.sourceUrlLink" allow-clear :placeholder="$t('carbon.message.Please_enter')" :max-length="128"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item :label="$t('carbon.message.Attachment')">
                <j-upload v-model:value="queryParam.attachments" :number="3"></j-upload>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </section>
    <div class="optionBox">
      <div class="optionItem optionItem_cancel m_hoverCP" @click="onBack"> {{ $t('carbon.message.Cancel') }}</div>
      <a-button class="optionItem optionItem_confirm m_hoverCP" type="primary" @click="onSubmit">{{ $t('carbon.message.Confirm') }}</a-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { defHttp } from '/@/utils/http/axios'
import { INDUSTRY } from '@/common/constKey'
import UnitCascader from "/@/components/common/UnitCascader.vue"
import img28 from '@/assets/img/img28.png'
import img29 from '@/assets/img/img29.png'
import img30 from '@/assets/img/img30.png'

// 国际化和消息提示
const { t } = useI18n()
const $message = useMessage()

// 引用元素
const artifactItem = ref(null)

// 响应式数据
const columns = ref([{
  title: t('carbon.message.greenhouse_gas'),
  align: 'center',
  dataIndex: 'gasName',
  width: 150,
  slots: { customRender: 'gasName' },
}, {
  title: t('carbon.message.Factor_value'),
  align: 'center',
  dataIndex: 'factorValue',
  width: 100,
  slots: { customRender: 'factorValue' },
}, {
  title: t('carbon.message.Factor_molecular_unit'),
  align: 'center',
  dataIndex: 'molecularUnit',
  width: 100,
}, {
  title: t('carbon.message.Factor_denominator_unit'),
  align: 'center',
  dataIndex: 'denominatorUnit',
  width: 100,
}, {
  title: t('carbon.message.GWP_value'),
  align: 'center',
  dataIndex: 'gwpValue',
  width: 100,
  slots: { customRender: 'gwpValue' },
}, {
  title: t('carbon.message.Handle'),
  align: 'center',
  width: 100,
  slots: { customRender: 'action' },
}])

const queryParam = reactive({
  gasList: [],
  computerType: 1, // 类型（1=手动输入，2=配比计算）
  type: '2', // 数据库,默认组织因子库,不可更改（1=碳排因子库，2=组织因子库）
})

const fzData = ref([]) // 因子分子数据
const fmData = ref([]) // 因子分母数据
const yearData = ref([]) // 因子分母数据
const gasData = ref([]) // 气体数据
const industryData = ref([]) // 行业数据
const source_typeData = ref([]) // 来源类型
const product_typeData = ref([]) // 因子分类
const document_typeData = ref([]) // 文献类型
const allGasData = ref([]) // 气体二位数组数据

// 计算属性
const paddingBottom = computed(() => {
  if (queryParam.attachments) {
    return queryParam.attachments.split(',').length * 25 + 12 + 'px'
  } else {
    return '12px'
  }
})

// 监听器
watch(
  () => queryParam.gasList,
  (val, oldVal) => {
    // console.log('watch =>', val, oldVal)
    let keyData = []
    val.forEach(item => {
      if (item.gasName) {
        keyData.push(item.gasName)
      }
    })
    // console.log('watch keyData =>', keyData)
    gasData.value.forEach(item => {
      if (keyData.includes(item.gasName)) {
        item.disabled = true
      } else {
        item.disabled = false
      }
    })
    // console.log('watch gasData =>', gasData.value)
  },
  { deep: true }
)

// 方法定义
const onChangeIndustryId = (e) => {
  console.log('onChangeIndustryId', e)
  let theIndex = industryData.value.findIndex(ele => ele.id == e)
  if (theIndex > -1) {
    queryParam.industry = industryData.value[theIndex].name
  }
}

/**
 * 配比计算-根据气体计算因子值
 */
const computeFactorValue = () => {
  let data = 0
  queryParam.gasList.forEach(item => {
    let factorValue = item.factorValue ? Number(item.factorValue) : 0
    let gwpValue = item.gwpValue ? Number(item.gwpValue) : 0
    data = data + (factorValue * gwpValue)
  })
  queryParam.factorValue = Number((data).toFixed(4))
}

const onChangeComputerType = () => {
  if (queryParam.computerType == 1) {
    // 从手动切换到配比计算
    queryParam.computerType = 2
    onChangeNumeratorUnitId(queryParam.numeratorUnitId)
  } else if (queryParam.computerType == 2) {
    // 从配比计算切换到手动
    queryParam.computerType = 1
  }
  queryParam.gasList = []
  computeFactorValue()
}

/**
 * 修改分子单位，同时删除温室气体
 */
const onChangeNumeratorUnitId = (value) => {
  console.log('onChangeNumeratorUnitId', value)
  let theIndex = fzData.value.findIndex(ele => ele.id == value)
  if (theIndex > -1) {
    queryParam.numeratorUnit = fzData.value[theIndex].factorUnit
    gasData.value = allGasData.value[theIndex]
    if (queryParam.gasList && queryParam.gasList.length > 0) {
      queryParam.gasList.forEach((gasItem, gasIndex) => {
        gasData.value.forEach((gasItem2, gasIndex2) => {
          if (gasItem.gasName === gasItem2.gasName) {
            console.log('gasItem2', gasItem2)
            gasItem.molecularUnit = gasItem2.gasUnit
          }
        })
      })
    }
    computeFactorValue()
  }
}

/**
 * 修改分母单位，同时修改所有温室气体的因子分母单位
 */
const onChangeDenominatorUnitId = (value) => {
  console.log('onChangeDenominatorUnitId', value)
  let theIndex = fmData.value.findIndex(ele => ele.id == value)
  if (theIndex > -1) {
    queryParam.denominatorUnit = fmData.value[theIndex].unitCode
    queryParam.gasList.forEach(item => {
      item.denominatorUnit = fmData.value[theIndex].unitCode
    })
  }
}

/**
 * 添加气体
 */
const onAdd = () => {
  console.log('onAdd');
  let obj = {}
  if (queryParam.denominatorUnitId) {
    obj.denominatorUnit = queryParam.denominatorUnit
  }
  queryParam.gasList.push(obj)
}

/**
 * 删除气体
 */
const onDel = (index) => {
  console.log('onAdd');
  queryParam.gasList.splice(index, 1)
  computeFactorValue()
}

/**
 * 修改气体
 * @param e
 * @param record
 */
const onChangeGas = (e, record) => {
  console.log('onChangeGas', e, record)
  let theIndex = gasData.value.findIndex(ele => ele.gasName == e)
  if (theIndex > -1) {
    record.molecularUnit = gasData.value[theIndex].gasUnit
    record.gwpValue = gasData.value[theIndex].gwpValue
    computeFactorValue()
  }
}

/**
 * 检查表单数据
 */
const checkFormData = () => {
  if (!queryParam.name) {
    $message.createMessage.warn(t('carbon.message.please_enter_factor_name'))
    return false
  }
  if (!queryParam.numeratorUnitId) {
    $message.createMessage.warn(t('carbon.message.please_select_the_factor_molecular_unit'))
    return false
  }
  if (!queryParam.denominatorUnitId) {
    $message.createMessage.warn(t('carbon.message.please_select_factor_denominator_unit'))
    return false
  }
  if (queryParam.computerType == 1) {
    // 手动输入
    if (!queryParam.factorValue || queryParam.factorValue && queryParam.factorValue < 0) {
      $message.createMessage.warn(t('carbon.message.please_enter_a_factor_value_co2_equivalent_greater_than_0'))
      return false
    }
  }
  if (queryParam.computerType == 2) {
    // 手动输入
    if (!queryParam.gasList || queryParam.gasList && queryParam.gasList.length == 0) {
      $message.createMessage.warn(t('carbon.message.please_add_at_least_one_gas'))
      return false
    }
    let errorIndex = null
    let errorType = null
    for (let i = 0; i < queryParam.gasList.length; i++) {
      let theObj = queryParam.gasList[i]
      if (!theObj.gasName) {
        errorIndex = i
        errorType = 'gasName'
        break
      }
      if (!theObj.factorValue || theObj.factorValue && theObj.factorValue < 0) {
        errorIndex = i
        errorType = 'factorValue'
        break
      }
      if (!theObj.gwpValue) {
        errorIndex = i
        errorType = 'gwpValue'
        break
      }
    }
    if (errorType === 'gasName') {
      $message.createMessage.warn(t('carbon.message.please_select_gas'))
      return false
    }
    if (errorType === 'factorValue') {
      $message.createMessage.warn(t('carbon.message.please_enter_a_factor_value_greater_than_0'))
      return false
    }
    if (errorType === 'gwpValue') {
      $message.createMessage.warn(t('carbon.message.please_enter_gwp_value'))
      return false
    }
  }
  return true
}

/**
 * 提交
 */
const onSubmit = () => {
  console.log('queryParam', queryParam)
  queryParam.emissionFactorDatabase = '9'
  if (checkFormData()) {
    defHttp.post({
      url: '/emission/factor/cyEmissionFactor/add',
      params: queryParam
    }, { isTransformResponse: false}).then((res) => {
      if (res.success) {
        $message.createMessage.success(t('carbon.message.operation_success'))
        onBack()
      }
    });
  }
}

const getData = () => {
  // 来源类型
  defHttp.get({
    url: '/sys/api/getDictItems',
    params: { dictCode: 'source_type' }
  }, { isTransformResponse: false}).then((res) => {
    source_typeData.value = res || []
    console.log('getDictItems source_type =>', res)
  });
  // 因子分类
  defHttp.get({
    url: '/sys/api/getDictItems',
    params: { dictCode: 'product_type' }
  }, { isTransformResponse: false}).then((res) => {
    product_typeData.value = res || []
    console.log('getDictItems product_type =>', res)
  });
  // 文献类型
  defHttp.get({
    url: '/sys/api/getDictItems',
    params: { dictCode: 'document_type' }
  }, { isTransformResponse: false}).then((res) => {
    document_typeData.value = res || []
    console.log('getDictItems document_type =>', res)
  });
  // 行业
  defHttp.get({
    url: '/sys/category/childList',
    params: { pid: INDUSTRY }
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      industryData.value = res.result || []
    }
  });
  // 分子
  defHttp.get({ url: '/CyFactorUnit/cyFactorUnit/list' }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      fzData.value = res.result.records || []
      allGasData.value = []
      fzData.value.forEach((item, index) => {
        defHttp.get({
          url: '/gas/cyGasStore/listGasName',
          params: { factorRealUnit: item.factorRealUnit }
        }, { isTransformResponse: false}).then((res) => {
          if (res.success) {
            allGasData.value[index] = res.result || []
          }
        });
      })
    }
  });
  // 分母
  defHttp.get({ url: '/emission/factor/cyEmissionUnit/getAllUnit' }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      fmData.value = res.result || []
    }
  });
  // 年份
  let yearDataTemp = []
  for (let i = 1950; i < 2100; i++) {
    yearDataTemp.push(String(i))
  }
  yearData.value = yearDataTemp
}

/**
 * 下拉框数据过滤
 */
const filterOption = (input, option) => {
  return (
    option.children[0].innerHTML.toLowerCase().indexOf(input.toLowerCase()) >= 0
  );
}

/**
 * 返回
 */
const onBack = () => {
  emit('back')
}

// 定义事件
const emit = defineEmits(['back'])

// 生命周期钩子
onMounted(() => {
  getData()
})

defineExpose({
  queryParam,
  gasData,
  computeFactorValue
})
</script>

<style lang="less" scoped>
.cardHeader {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #000000;

  .cardHeader_icon {
    width: 16px;
    height: 16px;
  }
}

.cardBox {
  margin-top: 24px;
  overflow: hidden;
  padding: 32px 24px 12px;
  background: #FFFFFF;
  border-radius: 3px;

  .ant-form-item {
    margin-bottom: 20px !important;
  }

  .cardBox_title {
    margin-bottom: 24px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 20px;
    color: #333333;
  }
}

.switchBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-left: 8px;
  padding: 0 16px;
  // width: 140px;
  height: 32px;
  background: #FFFFFF;
  border-radius: 3px;
  border: 1px solid #148958;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #148958;
  white-space: nowrap;

  .switchBtn_icon {
    width: 16px;
    height: 16px;
  }
}

.addBtn {
  margin-top: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 112px;
  height: 32px;
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

.optionBox {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;

  .optionItem {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 103px;
    height: 32px;
    border-radius: 3px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
  }

  .optionItem_cancel {
    background: #E7E7E7;
    color: rgba(0, 0, 0, 0.9);
  }

  .optionItem_confirm {
    color: rgba(255, 255, 255, 0.9);
  }
}
</style>
