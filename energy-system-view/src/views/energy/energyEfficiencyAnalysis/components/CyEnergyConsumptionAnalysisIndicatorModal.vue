<template>
  <a-drawer :title="title" maxHeight="500px" :width="800" :visible="visible" @ok="handleOk" :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }" @close="handleCancel" cancelText="关闭">
    <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleAdd">新增指标</a-button>

    <a-table
      ref="tableRef"
      size="middle"
      :scroll="{x:true}"
      :columns="columns"
      :dataSource="data"
      :pagination="ipagination"
      @change="handleTableChange"
      style="margin-top: 20px">
      <template v-slot:bodyCell="{ column, record, index, text }">
        <div v-if="column.dataIndex === 'unit'">
          {{record.energyConsumeDataUnitName}}/{{record.operationalDataUnitName}}
        </div>

        <div v-if="column.dataIndex === 'instruction'" style="word-wrap: break-word; white-space: normal; max-width: 300px;">
          {{record.instruction}}
        </div>

        <div v-if="column.dataIndex === 'operate'">
          <a style="margin-right: 10px" @click="handleEdit(record)">编辑</a>
          <a @click="handleDelete(record)">删除</a>
        </div>

      </template>
    </a-table>

    <template #footer>
     <div style="float: right"><a-button @click="handleCancel">取消</a-button></div>
   </template>
  </a-drawer>

  <AddIndicatorModel ref="registerModal" @success="handleSuccess"></AddIndicatorModel>

</template>

<script lang="ts" setup>
import {ref, nextTick, defineExpose, onMounted, reactive} from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import AddIndicatorModel
    from "@/views/energy/energyEfficiencyAnalysis/components/AddIndicatorModel.vue";
  import {
    list
  } from "@/views/energy/energyEfficiencyAnalysis/CyEnergyConsumptionAnalysisIndicator.api";
  import { columns } from '../CyEnergyConsumptionAnalysisIndicator.data';
  import { deleteOne } from "@/views/energy/energyEfficiencyAnalysis/CyEnergyConsumptionAnalysisIndicator.api";
  const { createMessage } = useMessage();
  const title = ref<string>('');
  const width = ref<number>(800);
  const visible = ref<boolean>(false);
  const disableSubmit = ref<boolean>(false);
  const registerForm = ref();
  const emit = defineEmits(['register', 'success']);
  const registerModal = ref()
  const data = ref([]);
  const outSideStationId = ref();
  const currentClickNodeType = ref();
  const ipagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const queryParam = reactive({
    parentId: ''
  })


  /**
   * 新增
   */
  function add(stationId,type) {
    currentClickNodeType.value = type;
    outSideStationId.value = stationId;
    title.value = '指标配置';
    visible.value = true;
    queryParam.parentId = stationId;
    searchQuery();
  }

  function handleAdd() {
    registerModal.value.disableSubmit = false;
    registerModal.value.add(outSideStationId.value,currentClickNodeType.value);
  }

  /**
   * 编辑事件
   */
  const handleEdit = (record) => {
    registerModal.value.edit(record,outSideStationId.value,currentClickNodeType.value);
    registerModal.value.title = '编辑';
    registerModal.value.disableSubmit = false;
  }

  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteOne({ id: record.id }, handleSuccess)
  }

const handleTableChange = (pagination, filters, sorter) => {
  ipagination.current = pagination.current;
  ipagination.pageSize = pagination.pageSize;
  searchQuery();
}


  /**
   * 成功回调
   */
  function handleSuccess() {
    searchQuery()
  }

  /**
   * 编辑
   * @param record
   */
  function edit(record) {
    title.value = disableSubmit.value ? '详情' : '编辑';
    visible.value = true;
    nextTick(() => {
      registerForm.value.edit(record);
    });
  }

  /**
   * 确定按钮点击事件
   */
  function handleOk() {
    registerForm.value.submitForm();
  }

  /**
   * form保存回调事件
   */
  function submitCallback() {
    handleCancel();
    emit('success');
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


    list(params).then((res) => {
      if (res) {
        // 适配不分页的数据列表
        data.value = res.records || res || [];
        if (res.total) {
          ipagination.total = res.total;
        } else {
          ipagination.total = 0;
        }
      } else {
        console.warn(res?.message || "获取数据失败");
      }
    }).finally(() => {
    })
  }

  function searchQuery() {
    loadData()
  }

  /**
   * 取消按钮回调事件
   */
  function handleCancel() {
    visible.value = false;
    // 触发 success 事件，通知父组件重新加载数据
    emit('success');
  }

  defineExpose({
    add,
    edit,
    disableSubmit,
  });
</script>

<style lang="less">
  /**隐藏样式-modal确定按钮 */
  .jee-hidden {
    display: none !important;
  }
</style>
<style lang="less" scoped></style>
