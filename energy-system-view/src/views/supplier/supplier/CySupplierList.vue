<template>
  <div class="m_contentBox">
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter="searchQuery">
          <a-row :gutter="24">
            <!-- 供应商名称 -->
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item
                :label="t('carbon.message.Form_Label_SupplierName')"
                :labelCol="{ span: 8 }"
                :wrapperCol="{ span: 16 }"
              >
                <a-input style="width: 200px" :placeholder="t('carbon.message.Please_enter_supplier_name')" v-model:value="queryParam.name" />
              </a-form-item>
            </a-col>

            <!-- 行业 -->
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item
                :label="t('carbon.message.industry')"
                :labelCol="{ span: 8 }"
                :wrapperCol="{ span: 16 }"
              >
                <a-select
                  v-model:value="queryParam.industryId"
                  allowClear
                  :placeholder="t('carbon.message.Please_select')"
                  show-search
                  :filter-option="filterOption"
                  style="width: 200px"
                >
                  <a-select-option :value="item.id" v-for="(item, index) in industryData" :key="index">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <!-- 邀请状态 -->
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item
                :label="t('carbon.message.Form_Label_InviteStatus')"
                :labelCol="{ span: 10 }"
                :wrapperCol="{ span: 14 }"
              >
                <JDictSelectTag style="width: 200px" :placeholder="t('carbon.message.Please_select_invite_status')" dictCode="supplier_status" v-model:value="queryParam.status"/>
              </a-form-item>
            </a-col>

            <!-- 操作按钮 -->
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
        <span style="float: right; display: flex; gap: 8px;">
          <a-button type="primary"  preIcon="ant-design:search-outlined" @click="searchQuery">{{ t('carbon.message.Search') }}</a-button>
          <a-button type="primary" preIcon="ant-design:reload-outlined" @click="searchReset">{{ t('carbon.message.Reset') }}</a-button>
        </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- 查询区域-END -->

      <!-- 操作按钮区域 -->
      <div class="table-operator">
        <a-button style="float: right;margin-right: 10px; margin-bottom: 10px; " preIcon="ant-design:plus-outlined" @click="handleAdd" type="primary" >{{ t('carbon.message.Add') }}</a-button>
      </div>

      <!-- table区域-begin -->
      <div>
        <a-table
          ref="tableRef"
          size="middle"
          :scroll="{x:true}"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          class="j-table-force-nowrap"
          @change="handleTableChange">

          <template v-slot:bodyCell="{ column, record, index, text }">


            <template v-if="column.dataIndex === 'enableStatus'">
              <a-switch
                :checked="typeof text === 'boolean' ? text : text === 1"
                @change="handleEnableStatusChange(record.id, !text)"
              />
            </template>

            <template v-if="column.dataIndex === 'action'">
              <a @click="handleEdit(record)">{{ t('carbon.message.Edit') }}</a>
              <a-divider type="vertical"/>
              <a @click="handleDetail(record)">{{ t('carbon.message.Detail') }}</a>
            </template>

            <template v-if="column.dataIndex === 'status'">
              <JTag v-if="text === 0" :text="t('carbon.message.To_be_invited')" color="green"/>
              <JTag v-else-if="text === 1" :text="t('carbon.message.Pending_processing')" color="blue"/>
              <JTag v-else-if="text === 2" :text="t('carbon.message.Completed')" color="orange"/>
              <JTag v-else-if="text === 3" :text="t('carbon.message.Refused')" color="red"/>
            </template>
          </template>
        </a-table>
      </div>

      <cy-supplier-modal ref="modalFormRef" @ok="modalFormOk"></cy-supplier-modal>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed,nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import '@/assets/less/TableExpand.less'
import CySupplierModal from './modules/CySupplierModal.vue'
import { INDUSTRY } from '@/common/constKey'
import JAreaSelect from '/@/components/Form/src/jeecg/components/JAreaSelect.vue'
import JDictSelectTag from "@/components/Form/src/jeecg/components/JDictSelectTag.vue";
import JTag from "@/components/jeecg/JTag.vue";
// 导入API
import { list, updateEnableStatus } from './supplier.api'
import { defHttp } from '/@/utils/http/axios'

// 使用 i18n
const { t } = useI18n()

// 引用模板元素
const tableRef = ref()
const modalFormRef = ref()

// 数据定义
const description = ref('供应商表管理页面')
const queryParam = reactive({})
const dataSource = ref([])
const ipagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})
const loading = ref(false)
const dictOptions = reactive({})
const superFieldList = ref([])
const industryData = ref([])

// 表头定义
const columns = computed(() => [
  {
    title: t('carbon.message.Form_Label_SupplierName'),
    align: 'center',
    dataIndex: 'name'
  },
  {
    title: t('carbon.message.Table_Column_Area'),
    align: 'center',
    dataIndex: 'area',
    scopedSlots: { customRender: 'pcaSlot' }
  },
  {
    title: t('carbon.message.industry'),
    align: 'center',
    dataIndex: 'industryId_dictText'
  },
  {
    title: t('carbon.message.Contact_person'),
    align: 'center',
    dataIndex: 'contactsName'
  },
  {
    title: t('carbon.message.Table_Column_ContactPhone'),
    align: 'center',
    dataIndex: 'phone'
  },
  {
    title: t('carbon.message.email'),
    align: 'center',
    dataIndex: 'email'
  },
  {
    title: t('carbon.message.Form_Label_InviteStatus'),
    align: 'center',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: t('carbon.message.Table_Column_ProductCount'),
    align: 'center',
    dataIndex: 'productCount'
  },
  {
    title: t('carbon.message.Table_Column_EnableStatus'),
    align: 'center',
    dataIndex: 'enableStatus',
    scopedSlots: { customRender: 'enableStatus' }
  },
  {
    title: t('carbon.message.Update_person'),
    align: 'center',
    dataIndex: 'updateBy_dictText'
  },
  {
    title: t('carbon.message.UpdateTime'),
    align: 'center',
    dataIndex: 'updateTime'
  },
  {
    title: t('carbon.message.Handle'),
    dataIndex: 'action',
    align: 'center',
    fixed: 'right',
    width: 147,
    scopedSlots: { customRender: 'action' }
  }
])

// 方法定义
const filterOption = (input, option) => {
  return (
    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  )
}

const getData = () => {
  // 行业
  defHttp.get({
    url: '/sys/category/childList',
    params: {
      pid: INDUSTRY
    }
  }).then((res) => {
    if (res) {
      industryData.value = res || []
    }
  })
}

const getSuperFieldList = () => {
  let fieldList = []
  fieldList.push({ type: 'string', value: 'createBy', text: '创建人', dictCode: '' })
  fieldList.push({ type: 'datetime', value: 'createTime', text: '创建日期' })
  fieldList.push({ type: 'string', value: 'updateBy', text: '更新人', dictCode: '' })
  fieldList.push({ type: 'datetime', value: 'updateTime', text: '更新日期' })
  fieldList.push({ type: 'string', value: 'name', text: '供应商名称', dictCode: '' })
  fieldList.push({ type: 'string', value: 'phone', text: '供应商手机号', dictCode: '' })
  fieldList.push({ type: 'string', value: 'email', text: '供应商邮箱', dictCode: '' })
  fieldList.push({ type: 'pca', value: 'area', text: '地区' })
  fieldList.push({ type: 'string', value: 'industryId', text: '行业id', dictCode: '' })
  fieldList.push({
    type: 'list_multi',
    value: 'status',
    text: '邀请状态（0待处理，1已完成，2已拒绝）',
    dictTable: '',
    dictText: '',
    dictCode: ''
  })
  fieldList.push({ type: 'switch', value: 'enableStatus', text: '是否启用（0否1是）' })
  superFieldList.value = fieldList
}

const handleEnableStatusChange = (id, enableStatus) => {
  const params = {
    id: id,
    enableStatus: enableStatus ? 1 : 0
  }
  updateEnableStatus(params).then((res) => {
    if (res) {
      console.log(t('carbon.message.Message_StatusUpdateSuccess'));
      loadData(); // 刷新列表
    } else {
      console.warn(res.message);
    }
  })
}

const handleDetail = (record) => {
  modalFormRef.value.detail(record)
  modalFormRef.value.title = t('carbon.message.Detail')
  modalFormRef.value.disableSubmit = true
}

const searchQuery = () => {
  loadData();
}

const searchReset = () => {
  Object.keys(queryParam).forEach(key => {
    delete queryParam[key]
  })
  loadData(1);
}

const handleAdd = () => {
  modalFormRef.value.add();
  modalFormRef.value.title = t('carbon.message.Add');
  modalFormRef.value.disableSubmit = false;
}

const handleEdit = (record) => {
  modalFormRef.value.edit(record);
  modalFormRef.value.title = t('carbon.message.Edit');
  modalFormRef.value.disableSubmit = false;
}

const handleTableChange = (pagination, filters, sorter) => {
  console.log(pagination)
  Object.assign(ipagination, pagination)
  queryParam.pageNo = pagination.current
  queryParam.pageSize = pagination.pageSize
  loadData()
}

const getQueryParams = () => {
  return {
    ...queryParam,
    pageNo: ipagination.current,
    pageSize: ipagination.pageSize
  }
}

const loadData = (arg) => {
  // 加载数据 若传入参数1则加载第一页的内容
  if (arg === 1) {
    ipagination.current = 1;
  }

  const params = getQueryParams(); // 查询条件
  loading.value = true;

  list(params).then((res) => {
    if (res) {
      // 适配不分页的数据列表
      dataSource.value = res.records || res || [];
      if (res.total) {
        ipagination.total = res.total;
      } else {
        ipagination.total = 0;
      }
    } else {
      console.warn(res?.message || "获取数据失败");
    }
  }).finally(() => {
    loading.value = false
  })
}

const modalFormOk = () => {
  // 新增/修改 成功时，重载列表
  loadData();
  // 清空列表选中（如果需要）
}

const onClearSelected = () => {
  // 如果有选中项清除逻辑，在此处添加
}

// 生命周期钩子
onMounted(() => {
  dictOptions.value = {
    enableStatus: [{ text: '是', value: 'Y' }, { text: '否', value: 'N' }]
  }
  getData()
  loadData()
})
</script>

<style scoped>
.m_contentBox {
  padding: 24px;
  background: #f0f2f5;
}
</style>
