<!-- src/views/carbon/invitationFillIn/CyInvitationFillInList.vue -->
<template>
  <div class="p-2">
    <a-card :bordered="false">
      <!--引用表格-->
      <BasicTable @register="registerTable">
        <!--插槽:table标题-->
        <template #tableTitle>
          <a-tabs :activeKey="queryParam.status.toString()" @change="callback" size="small">
            <a-tab-pane key="1" :tab="t('carbon.message.Pending_data') + '(' + recordCountObject.pendingCount + ')'"></a-tab-pane>
            <a-tab-pane key="2" :tab="t('carbon.message.all_data') + '(' + recordCountObject.finishedCount + ')'"></a-tab-pane>
          </a-tabs>
        </template>

        <!--操作栏-->
        <template #action="{ record }">
          <div style="display: flex; align-items: center; justify-content: center">
            <j-upload
                v-if="record.status == 1"
                v-model="record.dataVoucher"
                :buttonVisible="false"
                :showUploadList="false"
                :number="1"
                style="max-width: 100px"
            />
            <a-divider v-if="record.status == 1" type="vertical" />
            <a v-if="record.status == 1" @click="toEdit(record)">{{ t('carbon.message.submit') }}</a>
            <a v-else @click="openEditModel(record)">{{ t('carbon.message.modify') }}</a>
          </div>
        </template>

        <!-- 自定义列渲染 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'targetName'">
            {{ record.targetName }} | {{ record.year }}
          </template>
          <template v-else-if="column.dataIndex === 'data'">
            <div v-if="record.status == 1">
              <a-input
                  v-model:value="record.data"
                  style="width: 80px; text-align: center"
              />
              <span style="margin-left:5px">
                {{ record.dataUnit_dictText }}
              </span>
            </div>
            <div v-else>
              <a-input
                  v-model:value="record.data"
                  style="width: 80px; text-align: center"
                  disabled
              />
              <span style="margin-left:5px">
                {{ record.dataUnit_dictText }}
              </span>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'dataVoucher'">
            <j-upload
                v-model="record.dataVoucher"
                :number="1"
                style="max-width: 100px"
                :disabled="true"
            />
          </template>
          <template v-else-if="column.dataIndex === 'carbonData'">
            {{ record.carbonData }} {{ record.carbonMolecule }}/{{ record.carbonDenomintor }}
          </template>
          <template v-else-if="column.dataIndex === 'emissionAmount'">
            {{ record.emissionAmount }} {{ record.carbonMolecule }}
          </template>
        </template>
      </BasicTable>
    </a-card>

    <a-modal
        :title="t('carbon.message.modify')"
        :visible="editModelVisible"
        @ok="handleOk"
        @cancel="handleCancel"
    >
      <a-form>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="t('carbon.message.Active_data') + ':'">
          <a-input-number
              v-model:value="currentEditObject.data"
              style="width: 100%; text-align: center"
          />
          {{ currentEditObject.dataUnitText }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="t('carbon.message.Datavoucher') + ':'">
          <j-upload
              v-model:value="currentEditObject.dataVoucher"
              :maxCount="1"
              style="max-width: 100px"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" name="cyInvitationFillIn-cyInvitationFillIn" setup>
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { BasicTable, useTable } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { columns } from './InvitationFillIn.data';
import JUpload from '@/components/Form/src/jeecg/components/JUpload/JUpload.vue';
import {
  list,
  editData,
  getRecordCount,
  getStandard,
  getAllActivity,
  getOrgAllSubjectOfCostCalc, queryDepartTreeSync
} from './InvitationFillIn.api';

const { t } = useI18n();

// refs
const editModelVisible = ref(false);
const currentEditObject = ref<any>({});

const labelCol = ref<any>({ xs: { span: 24 }, sm: { span: 5 } });
const wrapperCol = ref<any>({ xs: { span: 24 }, sm: { span: 16 } });

// 数据列表
const recordCountObject = reactive({
  pendingCount: 0,
  finishedCount: 0
});

const queryParam = reactive({
  status: 1,
  machineId: undefined,
  targetId: undefined,
  emissionSourceName: undefined,
  year: undefined,
  calculationCode: undefined,
  categoryId: undefined
});

//注册table数据
const { tableContext } = useListPage({
  tableProps: {
    title: t('carbon.message.invitation_fill_in_management'),
    api: list,
    columns,
    canResize: true,
    useSearchForm: true,
    formConfig: {
      schemas: [
        {
          field: 'year',
          label: t('carbon.message.Accounting_year'),
          component: 'DatePicker',
          componentProps: {
            picker: 'year',
            valueFormat: 'YYYY',
            placeholder: t('carbon.message.Please_enter')
          },
        },
        {
          field: 'targetId',
          label: t('carbon.message.Accounting_entity'),
          component: 'ApiTreeSelect',
          componentProps: {
            api: queryDepartTreeSync,
            params: { pcode: "A01", async: true },
            labelField: 'title',
            valueField: 'key',
            resultField: 'result'
          }
        },
        {
          field: 'categoryId',
          label: t('carbon.message.Accounting_standard'),
          component: 'ApiSelect',
          componentProps: {
            api: getStandard,
            params: { pcode: "A01", async: true },
            labelField: 'title',
            valueField: 'key',
            resultField: 'result'
          }
        },
      ],
    },
    actionColumn: {
      width: 147,
      fixed: 'right',
    },
    beforeFetch: (params) => {
      Object.assign(queryParam, params);
      return params;
    },
  },
});

const [registerTable, { reload }] = tableContext;

/**
 * 查询记录统计数
 */
async function getRecordCountData() {
  try {
    const res = await getRecordCount();
    Object.assign(recordCountObject, res.result);
  } catch (error) {
    console.error('获取记录统计数失败:', error);
  }
}




/**
 * 提交编辑
 */
async function toEdit(record: any) {
  try {
    const res = await editData(record);
    if (res.success) {
      queryParam.status = 1;
      reload();
      getRecordCountData();
    }
  } catch (error) {
    console.error('提交编辑失败:', error);
  }
}

/**
 * 打开修改对话框
 */
function openEditModel(record: any) {
  if (record.accountingStatus == 1) {
    // carbon.message.error('当前核算已归档，无法修改');
    return;
  }
  editModelVisible.value = true;
  currentEditObject.value = record;
}

/**
 * 关闭模态框
 */
function handleCancel() {
  editModelVisible.value = false;
}

/**
 * 确认修改
 */
async function handleOk() {
  editModelVisible.value = false;
  try {
    const res = await editData(currentEditObject.value);
    if (res.success) {
      queryParam.status = 2;
      reload();
    }
  } catch (error) {
    console.error('确认修改失败:', error);
  }
}

/**
 * 切换状态选项事件
 */
function callback(key: string) {
  queryParam.status = parseInt(key);
  reload();
  getRecordCountData();
}

/**
 * 下载文件
 */
function downloadFile(text: string) {
  // 实现文件下载逻辑
}

/**
 * 获取图片视图
 */
function getImgView(text: string) {
  // 实现图片路径处理逻辑
  return text;
}

// 生命周期
onMounted(() => {
  // 查询活动设施
  // 查询记录统计数
  getRecordCountData();
});
</script>

<style lang="less" scoped>
.jeecg-basic-table-form-container {
  padding: 0;
  .table-page-search-submitButtons {
    display: block;
    margin-bottom: 24px;
    white-space: nowrap;
  }
  .query-group-cust{
    min-width: 100px !important;
  }
  .query-group-split-cust{
    width: 30px;
    display: inline-block;
    text-align: center
  }
  .ant-form-item:not(.ant-form-item-with-help){
    margin-bottom: 16px;
    height: 32px;
  }
  :deep(.ant-picker),:deep(.ant-input-number){
    width: 100%;
  }
}
</style>
