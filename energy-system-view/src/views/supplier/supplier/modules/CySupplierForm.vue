<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form ref="formRef" :model="model" :rules="validatorRules" layout="vertical" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <!-- 供应商名称 -->
        <a-form-item :label="t('carbon.message.Form_Label_SupplierName')" required prop="name">
          <a-input v-model:value="model.name" :placeholder="t('carbon.message.Please_enter_supplier_name')" />
        </a-form-item>

        <!-- 行业选择 -->
        <a-form-item :label="t('carbon.message.industry')" prop="industryId">
          <a-select v-model:value="model.industryId" allowClear
                    :placeholder="t('carbon.message.Please_select')"
                    show-search :filter-option="filterOption"
                    style="width: 100%">
            <a-select-option :value="item.id" v-for="(item,index) in industryData" :key="index">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- 地区选择 -->
        <a-form-item :label="t('carbon.message.Table_Column_Area')" prop="area">
          <JAreaLinkage type="cascader" v-model:value="model.area" :placeholder="t('carbon.message.Please_enter_province_city_district')" style="width: 100%" />
        </a-form-item>

        <!-- 联系人手机 -->
        <a-form-item :label="t('carbon.message.Table_Column_ContactPhone')" required prop="phone">
          <a-input :disabled="model.status == 2" v-model:value="model.phone" :placeholder="t('carbon.message.Please_enter_contact_phone')" @change="onPhoneChange" />
        </a-form-item>

        <!-- 联系人姓名 -->
        <a-form-item :label="t('carbon.message.Contact_person')" required prop="contactsName">
          <a-input v-model:value="model.contactsName" :placeholder="t('carbon.message.Please_enter_contact_name')" />
        </a-form-item>

        <!-- 邮箱 -->
        <a-form-item :label="t('carbon.message.email')" required prop="email">
          <a-input v-model:value="model.email" :placeholder="t('carbon.message.Please_enter_contact_email')" />
        </a-form-item>

        <!-- 产品选择 -->
        <a-form-item :label="t('carbon.message.Form_Label_SupplierProducts')">
          <a-button type="primary" style="margin-right: 8px" @click="handleProductAdd">{{ t('carbon.message.Button_SelectProducts') }}</a-button>
        </a-form-item>

        <!-- 产品列表表格 -->
        <a-form-item label="" :wrapper-col="{ span: 24 }">
          <a-table
            :columns="supplierProductColumns"
            :data-source="supplierProductList"
            :pagination="false"
            size="middle"
            class="product-table"
            :bordered="true">

            <template #action="{text, record}">
              <a @click="handleProductDelete(record)">{{ t('carbon.message.Delete') }}</a>
            </template>

          </a-table>
        </a-form-item>
      </a-form>

      <select-supplier-product-modal ref="selectSupplierProductModalRef" :supplierProductIdList="supplierProductIdList" @ok="handleProductOk"></select-supplier-product-modal>
    </j-form-container>
  </a-spin>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { defHttp } from '/@/utils/http/axios'
import { useMessage } from '/@/hooks/web/useMessage'
import SelectSupplierProductModal from '../../supplierProduct/modules/SelectSupplierProductModal.vue'
import { INDUSTRY } from '@/common/constKey'
import JAreaLinkage from '/@/components/Form/src/jeecg/components/JAreaLinkage.vue'
// 国际化
const { t } = useI18n()
// 消息提示
const { createMessage } = useMessage()

// 组件引用
const formRef = ref()
const selectSupplierProductModalRef = ref()

// Props
const props = defineProps({
  //表单禁用
  disabled: {
    type: Boolean,
    default: false
  }
})

// 数据定义
const supplierProductList = ref([]) //供应商商品列表
const supplierProductIdList = ref([]) //供应商商品ID列表
const industryData = ref([]) //行业数据
const model = reactive({})
const modelDefault = reactive({})
const confirmLoading = ref(false)
const visible = ref(false)

// 布局配置
const labelCol = {
  xs: { span: 24 },
  sm: { span: 5 },
}
const wrapperCol = {
  xs: { span: 24 },
  sm: { span: 16 },
}

// 计算属性
const formDisabled = computed(() => props.disabled)

// 表单验证规则
const validatorRules = {
  name: [
    { required: true, message: t('carbon.message.Please_enter_supplier_name') },
  ],
  contactsName: [
    { required: true, message: t('carbon.message.ContactsName_Required') },
  ],
  phone: [
    { required: true, message: t('carbon.message.SupplierPhone_Required') },
    { pattern: /^1[3456789]\d{9}$/, message: t('carbon.message.SupplierPhone_FormatError') },
  ],
  email: [
    { required: true, message: t('carbon.message.SupplierEmail_Required') },
    { pattern: /^([\w]+\.*)([\w]+)@[\w]+\.\w{3}(\.\w{2}|)$/, message: t('carbon.message.SupplierEmail_FormatError') },
  ]
}

// URL配置
const url = {
  add: '/supplier/add',
  addOrEdit: '/supplier/addOrEdit',
  querySupplierProductList: '/supplierProductRelation/supplierProductList',
}

// 供应商商品表格列定义
const supplierProductColumns = computed(() => [
  {
    title: t('carbon.message.Table_Column_PurchaseItemName'),
    dataIndex: 'name',
    align: 'center',
    width: 200,
  },
  {
    title: t('carbon.message.Specifications_and_models'),
    dataIndex: 'specification',
    align: 'center',
    width: 180,
  },
  {
    title: t('carbon.message.Unit'),
    dataIndex: 'productUnitId_dictText',
    align: 'center',
    width: 120,
  },
  {
    title: t('carbon.message.Table_Column_UnitPrice'),
    dataIndex: 'price',
    align: 'center',
    width: 120,
  },
  {
    title: t('carbon.message.Handle'),
    dataIndex: 'action',
    align: 'center',
    fixed: 'right',
    width: 147,
    slots: { customRender: 'action' }
  },
])

// 方法定义
const add = () => {
  Object.assign(model, modelDefault)
}

const edit = (record) => {
  Object.assign(model, record)
  if (model.id) {
    querySupplierProductList(model.id)
  }
  visible.value = true
}

const submitForm = (status) => {
  // 触发表单验证
  formRef.value.validate().then(() => {
    confirmLoading.value = true
    model.status = status
    model.productIds = supplierProductIdList.value
    // 转为字符串保存
    model.area = model.area + ""

    defHttp.post({
      url: url.addOrEdit,
      params: model
    }, { isTransformResponse: false}).then((res) => {
      if (res.success) {
        createMessage.success(res.message)
        emit('ok')
      } else {
        createMessage.warning(res.message)
      }
    }).finally(() => {
      confirmLoading.value = false
    })
  })
}

const getData = () => {
  // 行业
  defHttp.get({
    url: '/sys/category/childList',
    params: { pid: INDUSTRY }
  }).then((res) => {
    if (res) {
      industryData.value = res || []
    }
  })
}

/**
 * 下拉框数据过滤
 */
const filterOption = (input, option) => {
  return (
    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  )
}

const onPhoneChange = () => {
  model.supplierOrgId = null
  const reg = /^1[3456789]\d{9}$/
  if (reg.test(model.phone)) {
    console.log('onPhoneChange', '手机号正确')
    // defHttp.get({
    //   url: '/api/queryOrgByPhone',
    //   params: { phone: model.phone }
    // }).then((res) => {
    //   if (res) {
    //     if (res != null) {
    //       model.email = res.contactMail
    //       model.contactsName = res.contactUser
    //       model.supplierOrgId = res.id
    //     }
    //   }
    // })
  }
}

/**
 * 查询供应商商品列表
 */
const querySupplierProductList = (supplierId) => {
  confirmLoading.value = true
  defHttp.get({
    url: url.querySupplierProductList,
    params: { supplierId: supplierId }
  }).then((res) => {
    if (res) {
      supplierProductList.value = res
      supplierProductIdList.value = res.map(item => item.id)
    } else {
      createMessage.warning(res.message)
    }
  }).finally(() => {
    confirmLoading.value = false
  })
}

/**
 * 删除供应商商品
 */
const handleProductDelete = (record) => {
  const index = supplierProductList.value.indexOf(record)
  if (index > -1) {
    supplierProductList.value.splice(index, 1)
    supplierProductIdList.value = supplierProductList.value.map(item => item.id)
  }
}

/**
 * 添加供应商商品
 */
const handleProductAdd = () => {
  selectSupplierProductModalRef.value.open()
}

/**
 * 添加方法
 */
const handleProductOk = (selectedRowKeys, selectionRows) => {
  console.log('handleProductOk', selectionRows)
  supplierProductIdList.value = selectedRowKeys
  supplierProductList.value = selectionRows
}

// 定义事件发射
const emit = defineEmits(['ok'])

// 生命周期钩子
onMounted(() => {
  //备份model原始值
  Object.assign(modelDefault, JSON.parse(JSON.stringify(model)))
  getData()
})

// 暴露方法给父组件
defineExpose({
  add,
  edit,
  submitForm
})
</script>

<style scoped>
/* 表格样式优化 */
.product-table {
  margin-top: 16px;
  border: 1px solid #e8e8e8;
}

/* 表格头部样式 */
.product-table .ant-table-thead > tr > th {
  background-color: #f8f8f8;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

/* 表格内容样式 */
.product-table .ant-table-tbody > tr > td {
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
}

/* 空数据样式 */
.product-table .ant-empty-description {
  font-size: 14px;
  color: #888;
  text-align: center;
}

/* 操作按钮样式 */
.product-table .ant-table-cell {
  white-space: nowrap;
}
</style>
