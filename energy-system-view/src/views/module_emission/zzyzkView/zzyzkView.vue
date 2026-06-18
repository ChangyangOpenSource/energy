<template>
  <div>
    <div class="m_contentBox">
      <a-card :bordered="false">
        <div class="m_aCardBox">
          <div class="tabBox">
            <div class="tabInnerBox">
              <div class="table-page-search-wrapper">
                <a-form :model="queryParam" layout="inline" @keyup.enter="searchQuery">
                  <a-row :gutter="24">
                    <a-col :span="6">
                      <a-form-item :label="$t('carbon.message.Factor_name')">
                        <a-input v-model:value="queryParam.name" allow-clear
                                 :placeholder="$t('carbon.message.Please_enter')"></a-input>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item :label="$t('carbon.message.Product_classification')">
                        <a-select v-model:value="queryParam.productClassification" allow-clear
                                  :placeholder="$t('carbon.message.Please_select')"
                                  show-search :filter-option="filterOption">
                          <a-select-option :value="item.value" v-for="(item,index) in product_typeData" :key="index">
                            {{ item.text }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item :label="$t('carbon.message.Applicable_scenario')">
                        <a-input v-model:value="queryParam.scene" allow-clear
                                 :placeholder="$t('carbon.message.Please_enter')"></a-input>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item :label="$t('carbon.message.Applicable_industries')">
                        <a-select v-model:value="queryParam.industryId" allow-clear
                                  :placeholder="$t('carbon.message.Please_select')"
                                  show-search :filter-option="filterOption">
                          <a-select-option :value="item.id" v-for="(item,index) in industryData" :key="index">
                            {{ item.name }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item :label="$t('carbon.message.Founder')">
                        <a-select v-model:value="queryParam.createBy" allow-clear
                                  :placeholder="$t('carbon.message.Please_select')" show-search
                                  :filter-option="filterOption">
                          <a-select-option :value="item" v-for="(item,index) in getCreatePeopleData" :key="index">
                            {{ item }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item :label="$t('carbon.message.State')">
                        <a-select v-model:value="queryParam.state" allow-clear :placeholder="$t('carbon.message.Please_select')">
                          <a-select-option value="1">{{ $t('carbon.message.Start_use') }}</a-select-option>
                          <a-select-option value="0">{{ $t('carbon.message.Stop_use') }}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item>
                        <a-button type="primary" @click="searchQuery">{{ $t('carbon.message.Search') }}</a-button>
                        <a-button style="margin-left: 8px" @click="searchReset">{{ $t('carbon.message.Reset') }}</a-button>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-form>
              </div>
            </div>
          </div>
          <!-- 组织因子 -->
          <div class="cardBox">
            <a-button class="addBtn m_hoverCP" type="primary" @click="onAdd">{{ $t('carbon.message.New_factor') }}</a-button>
            <div class="m_mt24" v-if="addListData && addListData.length > 0">
              <a-table :columns="columns" :data-source="addListData" :loading="loading"
                       :pagination="ipagination" :scroll="{ x: true }" rowKey="id"
                       size="middle" @change="handleTableChange">
                <template #factorValue="{ text, record }">
                  {{ (Number(record.factorValue)).toFixed(4) }}
                </template>
                <template #Unit="{ text, record }">
                  {{ record.numeratorUnit }}/{{ record.denominatorUnit }}
                </template>
                <template #state="{ text, record }">
                  <div class="stateBox stateBox1" v-if="text == 1"> {{ $t('carbon.message.In_use') }}</div>
                  <div class="stateBox stateBox2" v-if="text == 0"> {{ $t('carbon.message.Deactivated') }}</div>
                </template>
                <template #action="{ text, record }">
                  <div class="m_cbFlex">
                    <a @click="onDetail(record)">{{ $t('carbon.message.Detail') }}</a>
                    <a @click="onChangeStatus(record)" v-if="record.state == 1">{{ $t('carbon.message.Stop_use') }}</a>
                    <a @click="onChangeStatus(record)" v-if="record.state == 0">{{ $t('carbon.message.Start_use') }}</a>
                    <a-popconfirm :title="$t('carbon.message.Confirm_delete')" :cancel-text="$t('carbon.message.Cancel')"
                                  :ok-text="$t('carbon.message.Confirm')" @confirm="() => onDelete(record)">
                      <a>{{ $t('carbon.message.Delete') }}</a>
                    </a-popconfirm>
                    <a @click="onCopy(record)">{{ $t('carbon.message.Copy') }}</a>
                  </div>
                </template>
              </a-table>
            </div>
            <emptyBox :text1="$t('carbon.message.You_haven_t_added_any_factors')"
                      :text2="$t('carbon.message.Carbon_emission_factors_within_the_organization_need_to_be_added_here')"
                      :btnText="$t('carbon.message.Add_now')"
                      @change="onAdd" v-else></emptyBox>
          </div>
        </div>
      </a-card>
    </div>
    <!-- 详情弹窗 -->
    <section class="m_popupBox" v-if="isShowDetailPopup">
            <tpyzDetail ref="tpyzDetailRef" @back="back"></tpyzDetail>
    </section>
    <!-- 表单弹窗 -->
    <section class="m_popupBox" v-if="isShowFormPopup">
      <tpyzForm ref="tpyzFormRef" @back="back"></tpyzForm>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { ACCESS_TOKEN } from "@/store/mutation-types";
import { cloneObject } from '/@/utils/index';
import { defHttp } from '/@/utils/http/axios'
import { getToken } from "/@/utils/auth"

import emptyBox from '/@/components/common/emptyBox.vue'
import tpyzDetail from '../tpfyzkView/modules/tpyzDetail.vue'
import tpyzForm from './modules/tpyzForm.vue'
import { INDUSTRY } from '@/common/constKey'
import img27 from '@/assets/img/img27.png'

// 国际化和消息提示
const { t } = useI18n()
const $message = useMessage()

// 引用元素
const tpyzDetailRef = ref(null)
const tpyzFormRef = ref(null)

// 响应式数据
const loading = ref(false)
const addListData = ref([])
const collectListData = ref([])
const isShowDetailPopup = ref(false)
const isShowFormPopup = ref(false)
const fmData = ref([])
const product_typeData = ref([])
const emission_factor_category = ref([])
const emission_factor_database = ref([])
const industryData = ref([])
const getCreatePeopleData = ref([])

// 查询参数
const queryParam = reactive({
  emissionFactorDatabase: 9, // 类型（9组织因子库）
  token: getToken(),
})

// 分页配置
const ipagination = reactive({
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['10', '20', '30'],
  showTotal: (total, range) => {
    return range[0] + '-' + range[1] + ' 共' + total + '条'
  },
  showQuickJumper: true,
  showSizeChanger: true,
  total: 0,
})

// 表格列定义
const columns = [
  {
    title: t('carbon.message.Factor_name'),
    align: 'center',
    dataIndex: 'name',
  }, {
    title: t('carbon.message.Factor_value'),
    align: 'center',
    dataIndex: 'factorValue',
    slots: { customRender: 'factorValue' },
  }, {
    title: t('carbon.message.Unit'),
    align: 'center',
    slots: { customRender: 'Unit' },
  }, {
    title: t('carbon.message.State'),
    align: 'center',
    dataIndex: 'state',
    width: 70,
    slots: { customRender: 'state' },
  }, {
    title: t('carbon.message.Product_classification'),
    align: 'center',
    dataIndex: 'productClassification_dictText',
  }, {
    title: t('carbon.message.Applicable_scenario'),
    align: 'center',
    dataIndex: 'scene',
  }, {
    title: t('carbon.message.Applicable_industries'),
    align: 'center',
    dataIndex: 'industry',
  }, {
    title: t('carbon.message.Founder'),
    align: 'center',
    dataIndex: 'createBy',
  }, {
    title: t('carbon.message.Create_date'),
    align: 'center',
    dataIndex: 'createTime',
    sorter: (a, b) => (new Date(a.createTime)).getTime() - (new Date(b.createTime)).getTime(),
  }, {
    title: t('carbon.message.Handle'),
    dataIndex: 'action',
    align: 'center',
    fixed: 'right',
    width: 200,
    slots: { customRender: 'action' },
  }
]

// 方法定义
/**
 * 下拉框数据过滤
 */
const filterOption = (input, option) => {
  return (
    option.children[0].innerHTML.toLowerCase().indexOf(input.toLowerCase()) >= 0
  )
}

/**
 * 复制组织因子库
 */
const onCopy = (item) => {
  console.log('onCopy', item)
  defHttp.get({
    url: '/emission/factor/cyEmissionFactor/listInfo',
    params: { id: item.id }
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      let resData = res.result || {}
      console.log('resData', resData)
      resData.gasList = resData.gasList || []
      resData.gasList.forEach(gasItem => {
        delete gasItem.id
      })
      let formData = {
        name: resData.emissionFactorObject.name, // 因子名称
        type: resData.emissionFactorObject.type, // 数据库
        model: resData.emissionFactorObject.model, // 规格型号
        industryId: resData.emissionFactorObject.industryId, // 适用行业
        industry: resData.emissionFactorObject.industry, // 适用行业
        productClassification: resData.emissionFactorObject.productClassification, // 因子分类
        scene: resData.emissionFactorObject.scene, // 适用场景
        instruction: resData.emissionFactorObject.instruction, // 因子说明
        numeratorUnit: resData.emissionFactorDataObject.numeratorUnit, // 分子
        numeratorUnitId: resData.emissionFactorDataObject.numeratorUnitId, // 分子
        denominatorUnit: resData.emissionFactorDataObject.denominatorUnit, // 分母
        denominatorUnitId: resData.emissionFactorDataObject.denominatorUnitId, // 分母
        factorValue: resData.emissionFactorDataObject.factorValue, // 因子值
        computerType: resData.emissionFactorDataObject.type, // 手动|配比
        releaseOrg: resData.emissionFactorObject.releaseOrg, // 发布机构
        releaseYear: resData.emissionFactorObject.releaseYear, // 发布年份
        sourceType: resData.emissionFactorObject.sourceType, // 来源类型
        docType: resData.emissionFactorObject.docType, // 文献类型
        ownership: resData.emissionFactorObject.ownership, // 适用地区
        sourceFile: resData.emissionFactorObject.sourceFile, // 来源文件
        sourceUrlLink: resData.emissionFactorObject.sourceUrlLink, // 来源网址链接
        attachments: resData.emissionFactorObject.attachments, // 附件
        gasList: resData.gasList,
      }
      isShowFormPopup.value = true
      nextTick(() => {
        console.log('tpyzForm', tpyzFormRef.value)
        Object.assign(tpyzFormRef.value.queryParam, formData)
        // tpyzFormRef.value.queryParam = formData
        if (formData.computerType == 2) {
          console.log('tpyzForm computerType2')
          // 分子
          defHttp.get({ url: '/CyFactorUnit/cyFactorUnit/list' }, { isTransformResponse: false}).then((resA) => {
            if (resA.success) {
              let fzData = resA.result.records || []
              let theIndex = fzData.findIndex(ele => ele.id == formData.numeratorUnitId)
              if (theIndex > -1) {
                defHttp.get({
                  url: '/gas/cyGasStore/listGasName',
                  params: { factorRealUnit: fzData[theIndex].factorRealUnit }
                }, { isTransformResponse: false}).then((resB) => {
                  if (resB.success) {
                    Object.assign(tpyzFormRef.value.gasData, resB.result || [])
                    // tpyzFormRef.value.gasData = resB.result || []
                    tpyzFormRef.value.computeFactorValue()
                  }
                })
              }
            }
          })
        }
      })
    }
  })
}

/**
 * 停用/启用组织因子库
 */
const onChangeStatus = (item) => {
  let theItem = cloneObject(item)
  if (theItem.state == 1) {
    theItem.state = 0
  } else if (theItem.state == 0) {
    theItem.state = 1
  }
  defHttp.get({
    url: '/emission/factor/cyEmissionFactor/changeStatus',
    params: theItem
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      $message.createMessage.success(t('carbon.message.operation_success'))
      getData()
    }
  })
}

/**
 * 删除组织因子库
 */
const onDelete = (item) => {
  defHttp.delete({
    url: '/emission/factor/cyEmissionFactor/delete',
    params: { id: item.id }
  }, { isTransformResponse: false, joinParamsToUrl: true}).then((res) => {
    if (res.success) {
      $message.createMessage.success(t('carbon.message.delete_success'))
      getData()
    }
  })
}

/**
 * 详情
 */
const onDetail = (item, ShouCang) => {
  isShowDetailPopup.value = true
  nextTick(() => {
    console.log('onDetail', tpyzDetailRef.value)
    tpyzDetailRef.value.detailIndex = 0
    tpyzDetailRef.value.detailKeys = [item.id]
    tpyzDetailRef.value.getData(ShouCang)
  })
}

/**
 * 查询
 */
const searchQuery = () => {
  ipagination.current = 1
  getData()
}

/**
 * 重置
 */
const searchReset = () => {
  // 实现重置逻辑
  Object.keys(queryParam).forEach(key => {
    queryParam[key] = undefined
  })
  // 组织因子
  Object.assign(queryParam, {
    emissionFactorDatabase: 9, // 类型（1=碳排因子库，2=组织因子库）
    token: getToken(),
  })
  ipagination.current = 1
  getData()
}

const back = () => {
  isShowDetailPopup.value = false
  isShowFormPopup.value = false
  getData()
}

/**
 * 新增因子
 */
const onAdd = () => {
  console.log('onAdd')
  isShowFormPopup.value = true
}

const handleTableChange = (pagination, filters, sorter) => {
  console.log(pagination)
  Object.assign(ipagination, pagination)
  getData()
}

const getData = () => {
  // 组织因子
  let reqData = cloneObject(queryParam)
  reqData.pageNo = ipagination.current
  reqData.pageSize = ipagination.pageSize
  loading.value = true
  defHttp.get({
    url: '/emission/factor/cyEmissionFactor/list',
    params: reqData
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      addListData.value = res.result.records || []
      ipagination.total = res.result.total
    }
  }).finally(() => {
    loading.value = false
  })
}

const init = () => {
  // 创建人
  defHttp.get({
    url: '/emission/factor/cyEmissionFactor/getCreatePeople',
    params: { pid: INDUSTRY }
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      getCreatePeopleData.value = res.result || []
    }
  })
  // 行业
  defHttp.get({
    url: '/sys/category/childList',
    params: { pid: INDUSTRY }
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      industryData.value = res.result || []
    }
  })
  // 分母单位
  defHttp.get({ url: '/emission/factor/cyEmissionUnit/getAllUnit' }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      fmData.value = res.result || []
    }
  })
  // 因子分类
  defHttp.get({
    url: '/sys/api/getDictItems',
    params: { dictCode: 'product_type' }
  }, { isTransformResponse: false}).then((res) => {
    product_typeData.value = res || []
    console.log('getDictItems product_type =>', res)
  })
  //排放洗漱种类
  defHttp.get({
    url: '/sys/api/getDictItems',
    params: { dictCode: 'emission_factor_category' }
  }, { isTransformResponse: false}).then((res) => {
    emission_factor_category.value = res || []
    console.log('getDictItems document_type =>', res)
  })
  //碳排因子数据库
  defHttp.get({
    url: '/sys/api/getDictItems',
    params: { dictCode: 'emission_factor_database' }
  }, { isTransformResponse: false}).then((res) => {
    emission_factor_database.value = res || []
    console.log('getDictItems document_type =>', res)
  })
}

// 生命周期钩子
onMounted(() => {
  init()
  getData()
})
</script>

<style lang="less" scoped>
.colorse{
  color: @primary-color !important;
}
:deep(.ant-card-body) {
  background: #F5F8F7;

  .ant-form-item {
    margin-bottom: 20px !important;
  }
}

.tabBox {
  background: #FFFFFF;
  border-radius: 3px;
}

.tabInnerBox {
  padding: 8px 24px 0;
}

.cardBox {
  margin-top: 24px;
  padding: 24px;
  background: #FFFFFF;
  border-radius: 3px;
}

.addBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 112px;
  height: 32px;
  border-radius: 3px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);

  .addBtn_icon {
    width: 16px;
    height: 16px;
  }
}

.stateBox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 66px;
  height: 32px;
  border-radius: 3px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
}

.stateBox1 {
  background: #E3F9E9;
  border: 1px solid #2BA471;
  color: #2BA471;
}

.stateBox2 {
  background: #FFF0ED;
  border: 1px solid #D54941;
  color: #D54941;
}
</style>
