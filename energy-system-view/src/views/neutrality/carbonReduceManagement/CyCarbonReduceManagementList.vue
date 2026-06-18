<!-- src/views/neutrality/carbonReduceManagement/CyCarbonReduceManagementList.vue -->
<template>
  <div class="p-2">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form>
        <a-row :gutter="24">
          <a-col :span="5">
            <a-form-item :label="t('carbon.message.TargetName')">
              <a-input class="input" type="text" :placeholder="t('carbon.message.EnterTargetName')" v-model:value="queryParam.projectName" />
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item :label="t('carbon.message.EmissionReductionType')">
              <j-dict-select-tag
                v-model:value="queryParam.carbonReduceTypeId"
                :placeholder="t('carbon.message.SelectCarbonReductionType')"
                dictCode="project_carbon_reduce_type"
              />
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item :label="t('carbon.message.ProjectCycle')">
              <el-date-picker
                  v-model="queryParam.startYear"
                  type="year"
                  :placeholder="t('carbon.message.SelectStartYear')"
                  format="YYYY"
                  value-format="YYYY"
                  :disabled-date="carbonNeutralYearOptions"
              />
              -
              <el-date-picker
                  v-model="queryParam.endYear"
                  type="year"
                  :placeholder="t('carbon.message.SelectEndYear')"
                  format="YYYY"
                  value-format="YYYY"
                  :disabled-date="endYearOptions"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="" style="">
              <a-button type="primary" @click="searchQuery">{{ t('carbon.message.Search') }}</a-button>
              <a-button style="margin-left: 8px" @click="searchReset">{{ t('carbon.message.Reset') }}</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <div style="display: flex; justify-content: space-between; align-items: center">
        <div style="display: flex; gap: 16px">
          <a-card class="totalOneCard">{{ t('carbon.message.ProjectCount') }}{{ ipagination.total }}</a-card>
          <a-card class="totalTwoCard"
            >{{ t('carbon.message.ExpectedEmissionReduction') }}{{ totalCarbonEmission }}
            tCO₂e
          </a-card>
        </div>
        <div>
          <a-button @click="handleAdd" type="primary"><a-icon type="plus" />{{ t('carbon.message.AddReductionProject') }}</a-button>
        </div>
      </div>
    </div>

    <!-- 查询区域-END -->
    <!-- 操作按钮区域 -->
    <div class="table-operator"> </div>
    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        :scroll="{ x: true }"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
        @change="handleTableChange"
      >
        <!-- <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">{{ $t('carbon.message.Edit') }}</a>

          <a-divider type="vertical" />
          <a-popconfirm :title="$t('carbon.message.Confirm_delete')" @confirm="() => handleDelete(record.id)">
            <a>{{ $t('carbon.message.Delete') }}</a>
          </a-popconfirm>
        </span> -->
        <template #operation="{ record }">
          <div class="editable-row-operations">
            <a @click="handleEdit(record)">{{ t('carbon.message.Edit') }}</a>
            <a-divider type="vertical" />
            <a-popconfirm :title="t('carbon.message.Confirm_delete')" @confirm="() => handleDelete(record.id)">
              <a>{{ t('carbon.message.Delete') }}</a>
            </a-popconfirm>
          </div>
        </template>
      </a-table>
    </div>
    <!-- 表单区域 -->
    <CyCarbonReduceManagementModal ref="modalForm" @back="handleSuccess"></CyCarbonReduceManagementModal>
  </div>
</template>

<script lang="ts" name="CyCarbonReduceManagementList" setup>
import CyCarbonReduceManagementModal from './modules/CyCarbonReduceManagementModal.vue';
import { ref, reactive, onMounted } from 'vue';
import { useListPage } from '/@/hooks/system/useListPage';
import { useMessage } from '/@/hooks/web/useMessage';
import { useI18n } from '/@/hooks/web/useI18n';
import { listProjects, deleteOne, queryById, getExportUrl, getImportUrl, getCount } from './CyCarbonReduceManagement.api';
import JDictSelectTag from '@/components/Form/src/jeecg/components/JDictSelectTag.vue';
const { t } = useI18n();
const { createMessage } = useMessage();
const modalForm = ref();
const queryParam = ref({
  projectName: '',
  carbonReduceTypeId: '',
  endYear: '',
  startYear: '',
});
const totalCarbonEmission = ref(0);
const dataSource = ref([]);
const ipagination = ref({
  total: 0,
  current: 1,
  pageSize: 10,
});
// 表头
const columns = ref([
  {
    title: t('carbon.message.ProjectName'),
    align: 'center',
    dataIndex: 'projectName',
  },
  {
    title: t('carbon.message.AffiliatedOrganization'),
    align: 'center',
    dataIndex: 'projectDeptId_dictText',
  },
  {
    title: t('carbon.message.ProjectReductionType'),
    align: 'center',
    dataIndex: 'carbonReduceTypeId_dictText',
  },
  {
    title: t('carbon.message.ExpectedCarbonReduction') + '(tCO₂e)',
    align: 'center',
    dataIndex: 'carbonEmission',
  },
  {
    title: t('carbon.message.ProjectCycle'),
    align: 'center',
    dataIndex: 'startAndEndYear',
    customRender: ({ record }) => {
      return record.startYear - record.endYear;
    },
  },
  {
    title: t('carbon.message.Leader'),
    align: 'center',
    dataIndex: 'projectUserId_dictText',
  },
  {
    title: t('carbon.message.Founder'),
    align: 'center',
    dataIndex: 'createBy_dictText',
  },
  {
    title: t('carbon.message.Create_date'),
    align: 'center',
    dataIndex: 'createTime',
  },
  {
    title: t('carbon.message.Handle'),
    align: 'center',
    fixed: 'right',
    width: 147,
    dataIndex: "operation",
    slots: { customRender: "operation" },

  },
]);

const startYearOptions = (time: Date) => {
  if (queryParam.value.endYear) {
    const maxYear = new Date(queryParam.value.endYear, 0, 1).getTime();
    return time.getTime() > maxYear;
  }
  return false;
};

const endYearOptions = (time: Date) => {
  if (queryParam.value.startYear) {
    const minYear = new Date(queryParam.value.startYear, 0, 1).getTime();
    return time.getTime() < minYear;
  }
  return false;
};

onMounted(() => {
  loadData();
});

function searchQuery() {
  loadData(1);
}
function searchReset() {
  queryParam.value = {
    projectName: '',
    carbonReduceTypeId: '',
    endYear: '',
    startYear: '',
  };
  console.log(queryParam.value,66666666666)
  loadData(1);
}

async function getCountList() {
  getCount(queryParam.value).then((res) => {
    if (res.success) {
      totalCarbonEmission.value = res.result || 0;
    } else {
      createMessage.error(res.message);
    }
  });
}

/**
 * 列表查询
 */
function loadData(arg) {
  getCountList();
  //加载数据 若传入参数1则加载第一页的内容
  if (arg === 1) {
    ipagination.value.current = 1;
  }
  var params = queryParam.value;
  (params.pageNo = ipagination.value.current),
    (params.pageSize = ipagination.value.pageSize),
    listProjects(params).then((res) => {
      console.log(res);
      if (res.records.length > 0) {
        //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
        dataSource.value = res.records;
        if (res.total) {
          ipagination.value.total = res.total;
        } else {
          ipagination.value.total = 0;
        }
      }
    });
}

/**
 * 新增事件
 */
function handleAdd() {
  modalForm.value.add();
  modalForm.value.title = t('carbon.message.addReduceProject');
  modalForm.value.disableSubmit = false;
}

/**
 * 编辑事件
 */
function handleEdit(record) {
  queryById({ id: record.id }).then((res) => {
    if (res.success) {
      modalForm.value.edit(res.result);
      modalForm.value.title = t('carbon.message.editReduceProject');
      modalForm.value.disableSubmit = false;
    } else {
      createMessage.error(res.message);
    }
  });
}

/**
 * 详情
 */
function handleDetail(record) {
  queryById({ id: record.id }).then((res) => {
    if (res.success) {
      modalForm.value.edit(res.result);
      modalForm.value.title = t('carbon.message.View_Details');
      modalForm.value.disableSubmit = true;
    } else {
      createMessage.error(res.message);
    }
  });
}

/**
 * 删除事件
 */
async function handleDelete(record) {
  await deleteOne({ id: record.id }, handleSuccess);
}

/**
 * 成功回调
 */
function handleSuccess() {
  loadData(1);
}

/**
 * 操作栏
 */
function getTableAction(record) {
  return [
    {
      label: t('carbon.message.Edit'),
      onClick: handleEdit.bind(null, record),
    },
  ];
}

/**
 * 下拉操作栏
 */
function getDropDownAction(record) {
  return [
    {
      label: t('carbon.message.Details'),
      onClick: handleDetail.bind(null, record),
    },
    {
      label: t('carbon.message.Delete'),
      popConfirm: {
        title: t('carbon.message.Confirm_delete'),
        confirm: handleDelete.bind(null, record),
        placement: 'topLeft',
      },
    },
  ];
}
</script>

<style lang="less" scoped>
.jeecg-basic-table-form-container {
  .table-page-search-submitButtons {
    display: block;
    margin-bottom: 24px;
    white-space: nowrap;
  }
}

.table-page-search-wrapper {
  background: #fff;
  padding: 16px;
}

.m_contentBox {
  padding: 24px;
  background: #fff;
}

.totalOneCard {
  background-color: #e3f9e9;
  color: #148958;
  height: 32px;
  display: flex;
  align-items: center; /* 文字垂直居中 */
  border-radius: 3px;
}

.totalTwoCard {
  background-color: #fff1e9;
  color: #e37318;
  height: 32px;
  display: flex;
  align-items: center; /* 文字垂直居中 */
  margin-left: 20px;
  border-radius: 3px;
}
</style>
