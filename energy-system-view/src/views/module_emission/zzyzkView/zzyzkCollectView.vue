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
                      <a-form-item :label="$t('carbon.message.Release_organization')">
                        <a-input v-model:value="queryParam.releaseOrg" allow-clear
                                 :placeholder="$t('carbon.message.Please_enter')"></a-input>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item :label="$t('carbon.message.Release_country_organization')">
                        <a-input v-model:value="queryParam.ownership" allow-clear
                                 :placeholder="$t('carbon.message.Please_enter')"></a-input>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item :label="$t('carbon.message.Emission_factor_category')">
                        <a-select v-model:value="queryParam.category" allow-clear :placeholder="$t('carbon.message.Please_enter')" show-search
                                  :filter-option="filterOption">
                          <a-select-option :value="item.value" v-for="(item,index) in emission_factor_category" :key="item.value">
                            {{ item.text }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item :label="$t('carbon.message.Emission_factor_database')">
                        <a-select v-model:value="queryParam.emissionFactorDatabase" allow-clear :placeholder="$t('carbon.message.Please_enter')" show-search
                                  :filter-option="filterOption">
                          <a-select-option :value="item.value" v-for="(item,index) in emission_factor_database" :key="item.value">
                            {{ item.text }}
                          </a-select-option>
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
          <!-- 收藏因子 -->
          <div class="cardBox">
            <a-table :columns="columns" :data-source="collectListData" :loading="loading"
                     :pagination="ipagination" :scroll="{ x: true }" :bordered="false" rowKey="id"
                     size="middle"
                     @change="handleTableChange">
              <template #factorValue="{ text, record }">
                {{ (Number(record.factorValue)).toFixed(4) }}
              </template>
              <template #Unit="{ text, record }">
                {{ record.numeratorUnit }}/{{ record.denominatorUnit }}
              </template>
              <template #action="{ text, record }">
                <div class="m_cbFlex">
                  <a @click="onDetail(record,'ShouCang')">{{ $t('carbon.message.Detail') }}</a>
                  <a-popconfirm :title="$t('carbon.message.Cancel_collect')" :cancel-text="$t('carbon.message.Cancel')"
                                :ok-text="$t('carbon.message.Confirm')" @confirm="() => onDelCollect(record)">
                    <a>{{ $t('carbon.message.Cancel_collect') }}</a>
                  </a-popconfirm>
                </div>
              </template>
            </a-table>
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
import { cloneObject } from '/@/utils/index';
import { defHttp } from '/@/utils/http/axios'
import tpyzDetail from '../tpfyzkView/modules/tpyzDetail.vue'
import tpyzForm from './modules/tpyzForm.vue'
import { INDUSTRY } from '@/common/constKey'

// 国际化和消息提示
const { t } = useI18n()
const $message = useMessage()

// 引用元素
const tpyzDetailRef = ref(null)
const tpyzFormRef = ref(null)

// 响应式数据
const loading = ref(false)
const queryParam = reactive({})
const collectListData = ref([])
const isShowDetailPopup = ref(false)
const isShowFormPopup = ref(false)
const fmData = ref([])
const product_typeData = ref([])
const emission_factor_category = ref([])
const emission_factor_database = ref([])
const industryData = ref([])
const getCreatePeopleData = ref([])

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
    title: t('carbon.message.Emission_factor_database'),
    align: 'center',
    dataIndex: 'emissionFactorDatabase_dictText',
  }, {
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
    title: t('carbon.message.Release_organization'),
    align: 'center',
    dataIndex: 'releaseOrg',
  }, {
    title: t('carbon.message.Release_date'),
    align: 'center',
    dataIndex: 'releaseYear',
    sorter: (a, b) => a.releaseYear - b.releaseYear,
  }, {
    title: t('carbon.message.Release_country_organization'),
    align: 'center',
    dataIndex: 'ownership',
  }, {
    title: t('carbon.message.Emission_factor_category'),
    align: 'center',
    dataIndex: 'category_dictText',
  }, {
    title: t('carbon.message.Handle'),
    dataIndex: 'action',
    align: 'center',
    fixed: 'right',
    width: 120,
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
 * 取消收藏碳排因子库
 */
const onDelCollect = (item) => {
  defHttp.delete({
    url: '/CyEmissionFactorCollect/cyEmissionFactorCollect/delete',
    params: { id: item.id }
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      $message.createMessage.success(t('carbon.message.delete_collect_success'))
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
  console.log('searchQuery')
  ipagination.current = 1
  getData()
}

/**
 * 重置
 */
const searchReset = () => {
  // 收藏因子
  Object.assign(queryParam, {})
  ipagination.current = 1
  getData()
}

const back = () => {
  isShowDetailPopup.value = false
  isShowFormPopup.value = false
  getData()
}

const handleTableChange = (pagination, filters, sorter) => {
  console.log(pagination)
  Object.assign(ipagination, pagination)
  getData()
}

const getData = () => {
  // 收藏因子
  let reqData = cloneObject(queryParam)
  reqData.pageNo = ipagination.current
  reqData.pageSize = ipagination.pageSize
  loading.value = true
  defHttp.get({
    url: '/CyEmissionFactorCollect/cyEmissionFactorCollect/list',
    params: reqData
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      collectListData.value = res.result.records || []
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
  background: #148958;
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
