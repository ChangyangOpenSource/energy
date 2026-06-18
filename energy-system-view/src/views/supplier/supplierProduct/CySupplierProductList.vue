<template>
  <div class="m_contentBox">
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter="searchQuery">
          <a-row :gutter="24">
            <a-col :xl="22" :lg="7" :md="8" :sm="24">
              <a-form-item :label="t('carbon.message.The_purchase_item_name')" :labelCol="{ span: 12 }" :wrapperCol="{ span: 12 }">
                <a-input :placeholder="t('carbon.message.Please_enter_the_purchase_item_name')" v-model:value="queryParam.name" style="width: 200px"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="2" :lg="7" :md="8" :sm="24">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" preIcon="ant-design:search-outlined" @click="searchQuery">{{ t('carbon.message.Button_Search') }}</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 查询区域-END -->

      <!-- 操作按钮区域 -->
      <div class="table-operator" style="display: flex; justify-content: flex-end; margin-bottom: 10px">
        <a-button @click="handleAdd" preIcon="ant-design:plus-outlined"  type="primary">{{ t('carbon.message.Button_AddPurchaseItem') }}</a-button>
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
            <template v-if="column.dataIndex === 'status'">
              <a-switch
                :checked="text"
                @change="handleStatusChange(record.id, $event)"
              />
            </template>

            <template v-if="column.dataIndex === 'action'">
              <a @click="handleEdit(record)">{{ t('carbon.message.Edit') }}</a>
            </template>
          </template>

        </a-table>
      </div>

      <CySupplierProductModal ref="modalFormRef" @ok="modalFormOk"></CySupplierProductModal>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n' // 修改为与itemCard.vue一致的路径
import { defHttp } from '/@/utils/http/axios' // 添加defHttp导入，与itemCard.vue一致
// import imgXX from '@/assets/img/imgXX.png' // 如需引入图片可参考此方式
import JInput from "@/components/Form/src/jeecg/components/JInput.vue";
import JDictSelectTag from "../../../components/Form/src/jeecg/components/JDictSelectTag.vue";
import CySupplierProductModal from "@/views/supplier/supplierProduct/modules/CySupplierProductModal.vue";

// 使用 i18n
const { t } = useI18n()

// 引用模板元素
const tableRef = ref()
const modalFormRef = ref()

// 数据定义
const description = ref('供应商采购品表管理页面')
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
    title: t('carbon.message.PurchasedItem'),
    align: 'center',
    dataIndex: 'name'
  },
  {
    title: t('carbon.message.Table_Column_Specification'),
    align: 'center',
    dataIndex: 'specification'
  },
  {
    title: t('carbon.message.Unit'),
    align: 'center',
    dataIndex: 'productUnitId_dictText'
  },
  {
    title: t('carbon.message.UnitPriceWithYuan'),
    align: 'center',
    dataIndex: 'price'
  },
  {
    title: t('carbon.message.Table_Column_IsActive'),
    align: 'center',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: t('carbon.message.Update_person'),
    align: 'center',
    dataIndex: 'updateBy_dictText'
  },
  {
    title: t('carbon.message.Update_date'),
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

const url = {
  list: '/supplierProduct/list',
  delete: '/supplierProduct/delete',
  deleteBatch: '/supplierProduct/deleteBatch',
  exportXlsUrl: '/supplierProduct/exportXls',
  importExcelUrl: '/supplierProduct/importExcel',
  updateStatus: '/supplierProduct/editStatus'
}

const importExcelUrl = computed(() => {
  return `${window._CONFIG['domianURL']}/${url.importExcelUrl}`
})

// 方法定义
const getSuperFieldList = () => {
  let fieldList = []
  fieldList.push({ type: 'string', value: 'updateBy', text: '更新人', dictCode: '' })
  fieldList.push({ type: 'datetime', value: 'updateTime', text: '更新日期' })
  fieldList.push({ type: 'string', value: 'name', text: '采购品名称', dictCode: '' })
  fieldList.push({ type: 'string', value: 'model', text: '规格型号', dictCode: '' })
  fieldList.push({ type: 'string', value: 'unitName', text: '单位', dictCode: '' })
  fieldList.push({ type: 'BigDecimal', value: 'price', text: '单价', dictCode: '' })
  fieldList.push({ type: 'switch', value: 'status', text: '是否有效（0无效1有效）' })
  fieldList.push({ type: 'Text', value: 'remark', text: '产品说明备注', dictCode: '' })
  superFieldList.value = fieldList
}

const handleStatusChange = (id, status) => {
  console.log('修改状态', id, status)
  const params = {
    id: id,
    status: status
  }
  // 修改为使用 defHttp 方式，与 itemCard.vue 中保持一致
  defHttp.get({
    url: url.updateStatus,
    params
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      // 更新本地数据源
      const index = dataSource.value.findIndex(item => item.id === id)
      if (index !== -1) {
        dataSource.value[index].status = status
      }
      // 刷新列表
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
  // 分页、排序、筛选变化时触发
  if (Object.keys(sorter).length > 0) {
    // 这里需要根据实际需求处理排序
  }
  ipagination.current = pagination.current;
  ipagination.pageSize = pagination.pageSize;
  loadData();
}

const modalFormOk = () => {
  // 新增/修改 成功时，重载列表
  loadData();
  // 清空列表选中（如果需要）
}

const getQueryParams = () => {
  return {
    ...queryParam,
    pageNo: ipagination.current,
    pageSize: ipagination.pageSize
  }
}

const list = (params) => {
  return defHttp.get({
    url: url.list,
    params
  }, { isTransformResponse: false}).then((res) => {
    if (res.success) {
      return res.result;
    } else {
      throw new Error(res.message || '获取数据失败');
    }
  });
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

// 生命周期钩子
onMounted(() => {
  dictOptions.value = {
    status: [{ text: '有效', value: '1' }, { text: '无效', value: '0' }]
  }
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
