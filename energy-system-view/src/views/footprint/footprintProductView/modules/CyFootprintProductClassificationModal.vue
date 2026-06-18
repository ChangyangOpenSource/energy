<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    @close="close"
    destroyOnClose
    v-model:visible="visible">
    <a-row>
      <a-col :span="24">
        <div style="margin-bottom: 16px; text-align: right;">
          <a-button @click="showAddModal" type="primary" preIcon="ant-design:plus-outlined" style="cursor: pointer; padding: 0 12px;">
            {{ t('carbon.message.Add') }}
          </a-button>
        </div>

        <a-table
          :columns="columns"
          :data-source="dataSource"
          :pagination="false"
          size="middle"
          :scroll="{ y: 'calc(100vh - 300px)' }">
          <template #action="{ record }">
            <a @click="handleEdit(record)">{{ t('carbon.message.Edit') }}</a>
          </template>
        </a-table>
      </a-col>
    </a-row>

    <div class="drawer-footer">
      <a-button @click="close">{{ t('carbon.message.Close') }}</a-button>
      <a-button type="primary" @click="handleConfirm" style="margin-left: 8px;">
        {{ t('carbon.message.Confirm') }}
      </a-button>
    </div>

    <classification-add-modal
      ref="classificationAddModal"
      @submit="handleSubmit"
    />
  </a-drawer>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { defHttp } from '/@/utils/http/axios'
import ClassificationAddModal from "../modules/ClassificationAddModal.vue";
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'

const { t } = useI18n()
const { createMessage } = useMessage()

const title = ref(t('carbon.message.productCategoryManagement'))
const width = ref(800)
const visible = ref(false)
const dataSource = ref([])
const columns = reactive([
  {
    title: t('carbon.message.categoryName'),
    align: 'center',
    dataIndex: 'name'
  },
  {
    title: t('carbon.message.Update_person'),
    align: 'center',
    dataIndex: 'updateBy'
  },
  {
    title: t('carbon.message.Update_date'),
    align: "center",
    dataIndex: 'updateTime'
  },
  {
    title: t('carbon.message.Handle'),
    dataIndex: 'action',
    align: "center",
    fixed: "right",
    width: 147,
    slots: { customRender: 'action' }
  }
])

// 方法
const handleConfirm = () => {
  emit('confirm')
  close()
}

const showAddModal = () => {
  if (classificationAddModal.value) {
    classificationAddModal.value.open()
  } else {
    console.error('未找到classificationAddModal组件')
  }
}

const handleEdit = (record) => {
  if (classificationAddModal.value) {
    classificationAddModal.value.openEdit(record)
  } else {
    console.error('未找到classificationAddModal组件')
  }
}

const handleSubmit = ({ data, isEdit }, callback) => {
  const url = isEdit
    ? '/cyFootprintProductClassification/cyFootprintProductClassification/edit'
    : '/cyFootprintProductClassification/cyFootprintProductClassification/add'

  const requestMethod = isEdit ? defHttp.put : defHttp.post

  requestMethod({
    url,
    params: data
  }).then(res => {
    if (res.message) {
      createMessage[res.success ? 'success' : 'error'](res.message)
    }

    if (res.success) {
      loadData() // 刷新当前组件的分类列表
      emit('refreshPage') // 仅在成功时触发父组件刷新
    }
    callback()
  }).catch(error => {
    console.error('提交失败', error)
    createMessage.error('网络异常，请稍后重试')
    callback()
  })
}

const open = () => {
  console.log('打开分类管理')
  loadData()
  visible.value = true
}

const close = () => {
  emit('back')
  visible.value = false
}

const handleCancel = () => {
  close()
}

const loadData = () => {
  defHttp.get({
    url: '/cyFootprintProductClassification/cyFootprintProductClassification/list'
  }).then(res => {
    if (res) {
      dataSource.value = res
    }
  }).catch(error => {
    console.error('加载数据失败', error)
  })
}

// 暴露给父组件的方法
const emit = defineEmits(['confirm', 'back', 'refreshPage'])
const classificationAddModal = ref(null)

//暴露方法
defineExpose({
  open,
  close
})

// 生命周期钩子
onMounted(() => {
  loadData()
})
</script>

<style lang="less" scoped>
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
.drawer-footer{
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>
