<template>
  <div>
    <div class="m_contentBox">
      <a-card>
        <div class="m_aCardBox">
          <div class="tabBox">
            <a-tabs style="margin-left: 10px" :active-key="activeKey" @change="onChangeActiveKey">
              <a-tab-pane key="1" tab="碳排因子">
                <div class="tabInnerBox">
                  <div class="table-page-search-wrapper">
                    <a-form :model="queryParam" layout="inline" @keyup.enter.native="searchQuery">
                      <a-row :gutter="24">
                        <a-col :span="6">
                          <a-form-item label="因子名称">
                            <a-input v-model:value="queryParam.name" allowClear placeholder="请输入"></a-input>
                          </a-form-item>
                        </a-col>
                        <a-col :span="6">
                          <a-form-item label="因子分类">
                            <a-select v-model:value="queryParam.productClassification" allowClear placeholder="请选择" show-search
                                      :filter-option="filterOption">
                              <a-select-option :value="item.value" v-for="(item, index) in product_typeData" :key="item.value">
                                {{ item.text }}
                              </a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-col>
                        <a-col :span="6">
                          <a-form-item label="适用场景">
                            <a-input v-model:value="queryParam.scene" allowClear placeholder="请输入"></a-input>
                          </a-form-item>
                        </a-col>
                        <a-col :span="6">
                          <a-form-item label="适用行业">
                            <a-select v-model:value="queryParam.industryId" allowClear placeholder="请选择"
                                      show-search :filter-option="filterOption">
                              <a-select-option :value="item.id" v-for="(item, index) in industryData" :key="index">
                                {{ item.name }}
                              </a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-col>
                        <a-col :span="6">
                          <a-form-item label="发布机构">
                            <a-input v-model:value="queryParam.releaseOrg" allowClear placeholder="请输入"></a-input>
                          </a-form-item>
                        </a-col>
                        <a-col :span="6">
                          <a-form-item label="适用地区">
                            <a-input v-model:value="queryParam.ownership" allowClear placeholder="请输入"></a-input>
                          </a-form-item>
                        </a-col>
                        <a-col :span="6">
                          <a-form-item label="排放系数种类">
                            <a-select v-model:value="queryParam.category" allowClear placeholder="请选择" show-search
                                      :filter-option="filterOption">
                              <a-select-option :value="item.value" v-for="(item, index) in emission_factor_category" :key="item.value">
                                {{ item.text }}
                              </a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-col>
                        <a-col :span="6">
                          <a-form-item label="碳排因子数据库">
                            <a-select v-model:value="queryParam.emissionFactorDatabase" allowClear placeholder="请选择" show-search
                                      :filter-option="filterOption">
                              <a-select-option :value="item.value" v-for="(item, index) in emission_factor_database" :key="item.value">
                                {{ item.text }}
                              </a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-col>
                        <a-col :span="6">
                          <a-form-item label="">
                            <a-button type="primary" preIcon="ant-design:search-outlined" @click="searchQuery">查询</a-button>
                            <a-button style="margin-left: 8px" preIcon="ant-design:reload-outlined" @click="searchReset">重置</a-button>
                          </a-form-item>
                        </a-col>
                      </a-row>
                    </a-form>
                  </div>
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>

          <!-- 组织因子 -->
          <div class="cardBox" v-if="activeKey == '1'">
            <a-button class="addBtn m_hoverCP"  preIcon="ant-design:plus-outlined" type="primary" @click="onAdd">新增因子</a-button>
            <div class="m_mt24" v-if="addListData && addListData.length > 0">
              <a-table ref="table" :columns="columns" :data-source="addListData" :loading="loading"
                       :pagination="ipagination" :scroll="{ x: true }" :bordered="false" class="" row-key="id"
                       size="middle" @change="handleTableChange">

                <template v-slot:bodyCell="{ column, record, index, text }">
                  <template v-if="column.dataIndex === 'factorValue'">
                    {{ (Number(record.factorValue)).toFixed(4) }}
                  </template>

                  <template v-if="column.dataIndex === 'Unit'">
                    {{ record.numeratorUnit }}/{{ record.denominatorUnit }}
                  </template>

                  <template v-if="column.dataIndex === 'state'">
                    <div class="stateBox stateBox1" v-if="text === '1'">已发布</div>
                    <div class="stateBox stateBox2" v-if="text === '0'">未发布</div>
                  </template>

                  <template v-if="column.dataIndex === 'action'">
                    <a @click="onDetail(record)">详情</a>
                    <a-divider type="vertical" />
                    <a @click="onChangeStatus(record)" v-if="record.state === '1'">取消发布</a>
                    <a @click="onChangeStatus(record)" v-if="record.state === '0'">发布</a>
                    <a-divider type="vertical" />
                    <a-popconfirm title="确定删除吗?" cancel-text="取消" ok-text="确定" @confirm="() => onDelete(record)">
                      <a>删除</a>
                    </a-popconfirm>
                    <a-divider type="vertical" />
                    <a @click="onCopy(record, 1)">编辑</a>
                    <a-divider type="vertical" />
                    <a @click="onCopy(record, 2)">复制</a>
                  </template>

                </template>

              </a-table>
            </div>
            <empty-box text1="暂无搜索结果" @change="onAdd" v-else></empty-box>
          </div>
        </div>
      </a-card>
    </div>

    <!-- 详情弹窗 -->
    <section class="m_popupBox" v-if="isShowDetailPopup">
      <tpyz-detail ref="tpyzDetailRef" @back="back"></tpyz-detail>
    </section>

    <!-- 表单弹窗 -->
    <section class="m_popupBox" v-if="isShowFormPopup">
      <tpyz-form ref="tpyzFormRef" @back="back" :edit-flag="editFlag"></tpyz-form>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch,nextTick } from 'vue'
import { useMessage } from '/@/hooks/web/useMessage'
import { defHttp } from '/@/utils/http/axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { cloneObject } from '@/utils/index'
import emptyBox from '/@/components/common/emptyBox.vue'
import tpyzDetail from './modules/tpyzDetail.vue'
import tpyzForm from './modules/tpyzForm.vue'
import img27 from '@/assets/img/img27.png'
import { INDUSTRY } from '@/common/constKey';


const tpyzDetailRef = ref();
const tpyzFormRef = ref();

// 响应式数据
const activeKey = ref('1') // 1我的添加 2我的收藏
const loading = ref(false)
const queryParam = reactive({
  type: 1,
  token: localStorage.getItem(ACCESS_TOKEN),
})
const ipagination = reactive({
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['10', '20', '30'],
  showTotal: (total, range) => {
    return `${range[0]}-${range[1]} 共${total}条`
  },
  showQuickJumper: true,
  showSizeChanger: true,
  total: 0,
})

const addListData = ref([])
const collectListData = ref([])
const isShowDetailPopup = ref(false)
const isShowFormPopup = ref(false)
const fmData = ref([])
const industryData = ref([])
const getCreatePeopleData = ref([])
const product_typeData = ref([])
const emission_factor_category = ref([])
const emission_factor_database = ref([])
const editFlag = ref(null)

// 列表列配置
const columns = [
  {
    title: '碳排因子数据库',
    align: 'center',
    dataIndex: 'emissionFactorDatabase_dictText',
  },
  {
    title: '因子名称',
    align: 'center',
    dataIndex: 'name',
  },
  {
    title: '因子值',
    align: 'center',
    dataIndex: 'factorValue',
    scopedSlots: { customRender: 'factorValue' },
  },
  {
    title: '单位',
    align: 'center',
    scopedSlots: { customRender: 'Unit' },
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'state',
    width: 70,
    scopedSlots: { customRender: 'state' },
  },
  {
    title: '因子分类',
    align: 'center',
    dataIndex: 'productClassification_dictText',
  },
  {
    title: '适用场景',
    align: 'center',
    dataIndex: 'scene',
  },
  {
    title: '适用行业',
    align: 'center',
    dataIndex: 'industry',
  },
  {
    title: '发布机构',
    align: 'center',
    dataIndex: 'releaseOrg',
  },
  {
    title: '发布年份',
    align: 'center',
    dataIndex: 'releaseYear',
    sorter: (a, b) => a.releaseYear - b.releaseYear,
  },
  {
    title: '适用地区',
    align: 'center',
    dataIndex: 'ownership',
  },
  {
    title: '排放系数种类',
    align: 'center',
    dataIndex: 'category_dictText',
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    fixed: 'right',
    width: 200,
    scopedSlots: { customRender: 'action' },
  },
]

// 方法定义
const filterOption = (input, option) => {
  return (
    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  )
}

const onCopy = (item, flag) => {
  editFlag.value = flag
  console.log('onCopy', item)
  defHttp.get({
    url: '/emission/factor/cyEmissionFactor/listInfo',
    params: { id: item.id }
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      let resData = res.result || {}
      let formData = null

      resData.gasList = resData.gasList || []
      resData.gasList.forEach(gasItem => {
        delete gasItem.id
      })

      if (flag === 1) {
        formData = {
          id: resData.emissionFactorObject.id,
          organizationId: resData.emissionFactorObject.organizationId,
          deptId: resData.emissionFactorObject.deptId,
          name: resData.emissionFactorObject.name,
          type: resData.emissionFactorObject.type,
          model: resData.emissionFactorObject.model,
          industryId: resData.emissionFactorObject.industryId,
          industry: resData.emissionFactorObject.industry,
          productClassification: resData.emissionFactorObject.productClassification,
          scene: resData.emissionFactorObject.scene,
          instruction: resData.emissionFactorObject.instruction,
          numeratorUnit: resData.emissionFactorDataObject.numeratorUnit,
          numeratorUnitId: resData.emissionFactorDataObject.numeratorUnitId,
          denominatorUnit: resData.emissionFactorDataObject.denominatorUnit,
          denominatorUnitId: resData.emissionFactorDataObject.denominatorUnitId,
          factorValue: resData.emissionFactorDataObject.factorValue,
          computerType: resData.emissionFactorDataObject.type,
          releaseOrg: resData.emissionFactorObject.releaseOrg,
          releaseYear: resData.emissionFactorObject.releaseYear,
          sourceType: resData.emissionFactorObject.sourceType,
          docType: resData.emissionFactorObject.docType,
          ownership: resData.emissionFactorObject.ownership,
          sourceFile: resData.emissionFactorObject.sourceFile,
          sourceUrlLink: resData.emissionFactorObject.sourceUrlLink,
          attachments: resData.emissionFactorObject.attachments,
          emissionFactorDatabase: resData.emissionFactorObject.emissionFactorDatabase,
          gwpVersion: resData.emissionFactorObject.gwpVersion,
          category: resData.emissionFactorObject.category,
          gasList: resData.gasList,
        }
      } else {
        formData = {
          name: resData.emissionFactorObject.name,
          type: resData.emissionFactorObject.type,
          model: resData.emissionFactorObject.model,
          industryId: resData.emissionFactorObject.industryId,
          industry: resData.emissionFactorObject.industry,
          productClassification: resData.emissionFactorObject.productClassification,
          scene: resData.emissionFactorObject.scene,
          instruction: resData.emissionFactorObject.instruction,
          numeratorUnit: resData.emissionFactorDataObject.numeratorUnit,
          numeratorUnitId: resData.emissionFactorDataObject.numeratorUnitId,
          denominatorUnit: resData.emissionFactorDataObject.denominatorUnit,
          denominatorUnitId: resData.emissionFactorDataObject.denominatorUnitId,
          factorValue: resData.emissionFactorDataObject.factorValue,
          computerType: resData.emissionFactorDataObject.type,
          releaseOrg: resData.emissionFactorObject.releaseOrg,
          releaseYear: resData.emissionFactorObject.releaseYear,
          sourceType: resData.emissionFactorObject.sourceType,
          docType: resData.emissionFactorObject.docType,
          ownership: resData.emissionFactorObject.ownership,
          sourceFile: resData.emissionFactorObject.sourceFile,
          sourceUrlLink: resData.emissionFactorObject.sourceUrlLink,
          attachments: resData.emissionFactorObject.attachments,
          gasList: resData.gasList,
        }
      }

      isShowFormPopup.value = true
      nextTick(() => {
        Object.assign(tpyzFormRef.value.queryParam, formData);
        if (formData.computerType === 2) {
          defHttp.get({ url: '/CyFactorUnit/cyFactorUnit/list' }, { isTransformResponse: false}).then((resA) => {
            if (resA.success) {
              let fzData = resA.result.records || []
              let theIndex = fzData.findIndex(ele => ele.id === formData.numeratorUnitId)
              if (theIndex > -1) {
                defHttp.get({
                  url: '/gas/cyGasStore/listGasName',
                  params: { factorRealUnit: fzData[theIndex].factorRealUnit }
                }, { isTransformResponse: false}).then((resB) => {
                  if (resB.success) {
                    tpyzFormRef.value.gasData = resB.result || []
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

const onChangeStatus = (item) => {
  const theItem = cloneObject(item)
  if (theItem.state === '1') {
    theItem.state = '0'
  } else {
    theItem.state = '1'
  }
  defHttp.get({
    url: '/emission/factor/cyEmissionFactor/changeStatus',
    params: theItem
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      useMessage().createMessage.success(res.message)
      getData()
    }
  })
}

const onDelete = (item) => {
  defHttp.delete({
    url: '/emission/factor/cyEmissionFactor/delete',
    params: { id: item.id }
  }, {joinParamsToUrl: true, isTransformResponse: false}).then((res) => {
    if (res.success) {
      useMessage().createMessage.success(res.message)
      getData()
    }
  })
}

const onDelCollect = (item) => {
  defHttp.delete({
    url: '/CyEmissionFactorCollect/cyEmissionFactorCollect/delete',
    params: { id: item.id }
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      useMessage().createMessage.success(res.message)
      getData()
    }
  })
}

const onDetail = (item, ShouCang) => {
  isShowDetailPopup.value = true
  nextTick(() => {
    tpyzDetailRef.value.detailIndex = 0
    tpyzDetailRef.value.detailKeys = [item.id]
    tpyzDetailRef.value.getData(ShouCang)
  })
}

const searchQuery = () => {
  ipagination.current = 1
  getData()
}

const searchReset = () => {
  if (activeKey.value === '1') {
    queryParam.name = ''
    queryParam.productClassification = ''
    queryParam.scene = ''
    queryParam.industryId = ''
    queryParam.releaseOrg = ''
    queryParam.ownership = ''
    queryParam.category = ''
    queryParam.emissionFactorDatabase = ''
  }
  ipagination.current = 1
  getData()
}

const back = () => {
  isShowDetailPopup.value = false
  isShowFormPopup.value = false
  getData()
}

const onAdd = () => {
  isShowFormPopup.value = true
}

const handleTableChange = (pagination, filters, sorter) => {
  Object.assign(ipagination, pagination)
  getData()
}

const onChangeActiveKey = (key) => {
  activeKey.value = key
  getData()
}

const getData = () => {
  if (activeKey.value === '1') {
    const reqData = cloneObject(queryParam)
    reqData.pageNo = ipagination.current
    reqData.pageSize = ipagination.pageSize
    defHttp.get({
      url: '/emission/factor/cyEmissionFactor/emissionList',
      params: reqData
    }, { isTransformResponse: false}).then((res) => {
      if (res.success) {
        addListData.value = res.result.records || []
        ipagination.total = res.result.total
      }
    })
  }
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
  defHttp.get({
    url: '/emission/factor/cyEmissionUnit/getAllUnit'
  }, { isTransformResponse: false}).then((res) => {
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
  })

  // 排放系数种类
  defHttp.get({
    url: '/sys/api/getDictItems',
    params: { dictCode: 'emission_factor_category' }
  }, { isTransformResponse: false}).then((res) => {
    emission_factor_category.value = res || []
  })

  // 碳排因子数据库
  defHttp.get({
    url: '/sys/api/getDictItems',
    params: { dictCode: 'emission_factor_database' }
  }, { isTransformResponse: false}).then((res) => {
    emission_factor_database.value = res || []
  })
}

// 生命周期
onMounted(() => {
  init()
  getData()
})
</script>

<style lang="less" scoped>
/deep/ .ant-card-body {
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
