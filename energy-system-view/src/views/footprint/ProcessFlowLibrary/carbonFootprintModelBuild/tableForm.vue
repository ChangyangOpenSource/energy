<!-- 产品碳足迹-产品碳足迹-产品核算-模型搭建-工序表单 -->

<template>
  <div>
    <a-drawer
      :title="t('carbon.message.Working_procedure')"
      :width="600"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <div class="table-page-search-wrapper">
        <div class="flexs">
          <a-input-search
            :placeholder="t('carbon.message.Search_for_emission_sources')"
            style="width: 200px"
          />
          <div class="flexbuttons" @click="onProcessForm">
            <img src="@/assets/cptzj/img8.png" alt="" />
            {{ t("carbon.message.Add_new_processes_procedures") }}
          </div>
        </div>
        <a-table
          :row-selection="rowSelection"
          :columns="columns"
          :data-source="dataSource"
        >
          <template #action="{ text, record, index }">
            <div class="m_ccFlex">
              <a>{{ t("carbon.message.Examine") }}</a>
            </div>
          </template>
        </a-table>
      </div>
      <div class="drawerOptionBox">
        <a-button @click="onClose">{{ t("carbon.message.Cancel") }}</a-button>
        <a-button
          type="primary"
          style="margin-left: 8px"
          @click="onSubmit"
          v-if="!disabled"
        >
          {{ t("carbon.message.Confirm") }}</a-button
        >
      </div>
    </a-drawer>
    <processForm ref="processFormRef" @back="back" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import processForm from './processForm.vue'

// 使用 Composition API 工具
const { t } = useI18n()

// 定义 emits
const emit = defineEmits(['back'])

// Props
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

// Refs
const processFormRef = ref(null)
const visible = ref(false)
const drawerTitle = ref("")

// Reactive 数据
const formObj = reactive({
  // 产出物数据,第一条为主产出物，其他为副产出物
  artifactList: [{}],
})

const labelCol = { span: 4 }
const wrapperCol = { span: 14 }
const activeCollapseKey = ref(["0"])
const getAllUnitByGroupData = ref({}) // 单位分组数据

const columns = computed(() => [
  {
    title: t("carbon.message.Process_name"),
    dataIndex: "name",
    slots: { customRender: "name" },
    align: "center",
  },
  {
    title: t("carbon.message.Handle"),
    dataIndex: "age",
    slots: { customRender: "action" },
    align: "center",
  },
])

const dataSource = ref([{ name: "1", age: "2" }])

const rowSelection = ref({
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    )
  },
})

// Methods
const back = () => {
  emit('back')
}

const onSubmit = () => {
  // 提交逻辑
}

const onClose = () => {
  visible.value = false
}

const onProcessForm = () => {
  processFormRef.value.visible = true
  processFormRef.value.drawerTitle = t("carbon.message.Add_new_processes_procedures")
}

// 暴露给父组件的方法
defineExpose({
  visible,
  drawerTitle
})
</script>

<style lang="less" scoped>
.flexs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.flexbuttons {
  display: flex;
  align-items: center;
  padding: 5px 16px;
  font-weight: 400;
  font-size: 14px;
  color: #148958;
  background: #ffffff;
  border-radius: 3px 3px 3px 3px;
  border: 1px solid #148958;
  img {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
}

.addBtn {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: fit-content;
  padding: 5px 16px;
  background: #ffffff;
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

.drawerOptionBox {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: right;
  z-index: 1;
}
</style>
