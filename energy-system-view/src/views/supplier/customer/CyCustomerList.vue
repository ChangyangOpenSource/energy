<template>
  <div class="m_contentBox">
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper" style="margin-bottom: 20px">
        <a-form layout="inline" @keyup.enter="searchQuery">
          <a-row :gutter="24">
            <a-col :xl="8" :lg="8" :md="8" :sm="24">
              <a-form-item
                :label="t('carbon.message.CustomerName')"
                :labelCol="{ span: 10 }"
                :wrapperCol="{ span: 14 }">
                <a-input :placeholder="t('carbon.message.CustomerName')" v-model="queryParam.customerName" style="width: 150px"></a-input>
              </a-form-item>
            </a-col>

            <a-col :xl="8" :lg="8" :md="8" :sm="24">
              <a-form-item :label="t('carbon.message.Form_Label_InviteStatus')"
                           :labelCol="{ span: 10 }"
                           :wrapperCol="{ span: 14 }">
                <JDictSelectTag :placeholder="t('carbon.message.Please_select_invite_status')" dictCode="customer_status" v-model="queryParam.status" style="width: 150px" />
              </a-form-item>
            </a-col>
            <a-col :xl="8" :lg="8" :md="8" :sm="24">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" preIcon="ant-design:search-outlined" @click="searchQuery" style="margin-right: 8px">{{ t('carbon.message.Search') }}</a-button>
                <a-button type="primary" preIcon="ant-design:reload-outlined" @click="searchReset">{{ t('carbon.message.Reset') }}</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 查询区域-END -->

      <!-- table区域-begin -->
      <div>
        <a-table
          ref="table"
          size="middle"
          :scroll="{x:true}"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          class="j-table-force-nowrap"
          @change="handleTableChange">

          <template v-slot:bodyCell="{ column, record, index, text }">
            <template v-if="column.dataIndex === 'action'">
              <div v-if="record.status == 1">
                <a @click="handleStatusChange(record.id,2)">{{ t('carbon.message.AgreeInvitation') }}</a>
                <a-divider type="vertical"/>
                <a @click="handleStatusChange(record.id,3)">{{ t('carbon.message.RefuseInvitation') }}</a>
              </div>
            </template>
          </template>

        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { defHttp } from '/@/utils/http/axios'
import JDictSelectTag from "@/components/Form/src/jeecg/components/JDictSelectTag.vue";
import JTag from "@/components/jeecg/JTag.vue";

// 使用 i18n
const { t } = useI18n()

// 数据定义
const description = ref('客户管理页面')
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

// 表头定义
const columns = computed(() => [
  {
    title: t('carbon.message.CustomerName'),
    align: 'center',
    dataIndex: 'customerName'
  },
  {
    title: t('carbon.message.SupplierInvitationStatus'),
    align: 'center',
    dataIndex: 'status_dictText'
  },
  {
    title: t('carbon.message.Inviter'),
    align: 'center',
    dataIndex: 'inviterName'
  },
  {
    title: t('carbon.message.InviterPhone'),
    align: 'center',
    dataIndex: 'inviterPhone'
  },
  {
    title: t('carbon.message.InviterEmail'),
    align: 'center',
    dataIndex: 'inviterEmail'
  },
  {
    title: t('carbon.message.Invitation_time'),
    align: 'center',
    dataIndex: 'industryTime'
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

const url = {
  list: '/supplier/customerList',
  editStatus: '/supplier/editStatus'
}

const importExcelUrl = computed(() => {
  return `${window._CONFIG['domianURL']}/${url.importExcelUrl}`
})

// 方法定义
const getSuperFieldList = () => {
  let fieldList = []
  fieldList.push({ type: 'string', value: 'customerName', text: '客户名称', dictCode: '' })
  fieldList.push({ type: 'string', value: 'inviterName', text: '邀请人', dictCode: '' })
  fieldList.push({ type: 'string', value: 'inviterPhone', text: '邀请人电话', dictCode: '' })
  fieldList.push({ type: 'string', value: 'inviterEmail', text: '邀请人邮箱', dictCode: '' })
  fieldList.push({ type: 'datetime', value: 'industryTime', text: '邀请时间' })
  fieldList.push({ type: 'switch', value: 'status', text: '邀请状态（0待处理，1已同意，2已拒绝）' })
  superFieldList.value = fieldList
}

const handleStatusChange = (id, status) => {
  const params = {
    id: id,
    status: status
  }
  defHttp.post({
    url: url.editStatus,
    params
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      console.log(t('carbon.message.Message_StatusUpdateSuccess'))
      loadData()
    } else {
      console.warn(res.message)
    }
  })
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

const loadData = (arg) => {
  // 加载数据 若传入参数1则加载第一页的内容
  if (arg === 1) {
    ipagination.current = 1;
  }

  const params = {
    ...queryParam,
    page: ipagination.current,
    pageSize: ipagination.pageSize
  };

  loading.value = true;

  defHttp.get({
    url: url.list,
    params
  }, { isTransformResponse: false}).then((res) => {
    if (res) {
      console.log("这既是查询结果",res)

      dataSource.value = res.result.records || res || [];
      if (res.result.total) {
        ipagination.total = res.result.total;
      } else {
        ipagination.total = 0;
      }
    } else {
      console.warn(res?.message || "获取数据失败");
    }
  }).finally(() => {
    loading.value = false;
  });
}

// 生命周期钩子
onMounted(() => {
  getSuperFieldList()
  searchQuery();
})
</script>

<style scoped>
.m_contentBox {
  padding: 24px;
  background: #f0f2f5;
}
</style>
