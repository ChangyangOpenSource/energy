<!-- OrganizeInventoryList.vue -->
<template>
  <div>
    <div class="m_contentBox">
      <a-card :bordered="false">
        <div class="centeet">
          <!-- 左侧树形区域 -->
          <div class="left-tree">
            <a-tree
                v-if="deptTreeData.length > 0"
                :tree-data="deptTreeData"
                :selected-keys="selectedDeptKeys"
                @select="handleDeptSelect"
                show-line
                :default-expand-all="true"
            >
              <template #title="{ title }">
                {{ title }}
              </template>
            </a-tree>
            <a-empty v-else :description="t('carbon.message.no_department_data')" />
          </div>

          <div class="right">
            <!--引用表格-->
            <BasicTable style="width: auto" @register="registerTable">
              <!--插槽:table标题-->
              <template #tableTitle>
                <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> {{ t('carbon.message.new_inventory') }}</a-button>
              </template>
              <!--操作栏-->
              <template #action="{ record }">
                <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)"/>
              </template>
              <template #status="{ record }">
                <div class="statusStyle" v-if="record.status == 1">{{ t('carbon.message.Archived') }}</div>
                <div class="statusStyle1" v-if="record.status == 2">{{ t('carbon.message.Filled_in') }}</div>
                <div class="statusStyle2" v-if="record.status == 0">{{ t('carbon.message.Filling_in') }}</div>
              </template>
            </BasicTable>

            <!-- 表单区域 -->
            <OrganizeInventoryModal ref="registerModal" @success="handleSuccess"></OrganizeInventoryModal>

            <!-- 填报进度抽屉 -->
            <progessDrawer ref="progessDrawerRef"/>
          </div>
        </div>
      </a-card>
    </div>
    <!-- 详情弹窗 -->
    <section class="m_popupBox" v-if="isShowDetailPopup">
      <carbonReportingDetail
          ref="carbonReportingDetailRef"
          @back="back"
          :new-form="newForm"
      />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { BasicTable, TableAction } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { columns, searchFormSchema } from './OrganizeInventory.data';
import {
  getOrganizeInventoryList,
  deleteInventory,
  getOrgDepartTree,
  publishInventory,
  republishInventory
} from './OrganizeInventory.api';
import OrganizeInventoryModal from './components/OrganizeInventoryModal.vue';
import progessDrawer from './components/progessDrawer.vue'
import { useMessage } from '/@/hooks/web/useMessage';
import {useI18n} from '/@/hooks/web/useI18n';
import carbonReportingDetail from '/@/components/common/carbonReportingDetail.vue';
const { t } = useI18n();

const { createMessage } = useMessage();
const registerModal = ref();
const progessDrawerRef = ref();
const carbonReportingDetailRef = ref();

// 部门树数据
const deptTreeData = ref([]);
const selectedDeptKeys = ref([]);
const selectedDeptId = ref('');

// 详情弹窗相关
const isShowDetailPopup = ref(false);
const newForm = reactive({
  targetId: "",
  standardId: undefined,
  year: undefined,
  checkId: "",
  status: "",
  targetName: ""
});

//注册table数据
const { tableContext } = useListPage({
  tableProps: {
    title: t('carbon.message.organization_carbon_inventory'),
    api: getOrganizeInventoryList,
    columns,
    formConfig: {
      schemas: searchFormSchema,
    },
    useSearchForm: true,
    actionColumn: {
      width: 120,
      title: t('carbon.message.Handle'),
      fixed: 'right',
    },
    beforeFetch: (params) => {
      // 添加部门筛选条件
      params.targetId = selectedDeptId.value;
      return params;
    }
  }
});

const [registerTable, { reload }] = tableContext;

// 生命周期
onMounted(() => {
  loadDeptTree(); // 加载部门树
});

/**
 * 加载部门树形数据
 */
function loadDeptTree() {
  getOrgDepartTree()
      .then(res => {
        if (res.success) {
          deptTreeData.value = convertToTreeData(res.result);
          // 默认选中第一个部门
          if (deptTreeData.value.length > 0) {
            handleDeptSelect([deptTreeData.value[0].key]);
          }
        } else {
          createMessage.error(res.message || t('carbon.message.load_department_tree_failed'));
        }
      })
      .catch(error => {
        console.error(t('carbon.message.load_department_tree_failed'), error);
        createMessage.error(t('carbon.message.load_department_tree_failed'));
      });
}

/**
 * 转换部门数据为树形组件格式
 */
function convertToTreeData(data) {
  return data.map(item => ({
    title: item.departName,
    key: item.id,
    value: item.id,
    children: item.children ? convertToTreeData(item.children) : []
  }));
}

/**
 * 处理部门选择事件
 */
function handleDeptSelect(selectedKeys) {
  selectedDeptKeys.value = selectedKeys;
  selectedDeptId.value = selectedKeys[0] || '';
  reload(); // 重新加载表格数据
}

/**
 * 新增事件
 */
function handleAdd() {
  registerModal.value.disableSubmit = false;
  registerModal.value.add(selectedDeptKeys.value);
}

/**
 * 编辑事件（填报）
 */
function handleEdit(record: Recordable) {
  registerModal.value.disableSubmit = false;
  registerModal.value.edit(record);
}

/**
 * 详情（查看）
 */
function handleDetail(record: Recordable) {
  registerModal.value.disableSubmit = true;
  registerModal.value.edit(record);
}

/**
 * 删除事件
 */
async function handleDelete(record) {
  await deleteInventory({ id: record.id }, handleSuccess);
}

/**
 * 查看填报进度
 */
function handleViewProgress(record: Recordable) {
  progessDrawerRef.value.edit(record);
  progessDrawerRef.value.title = t('carbon.message.report_Progress');
}

/**
 * 撤回归档
 */
function handleRevocation(record: Recordable) {
  republishInventory( { id: record.id })
      .then((res) => {
        if (res.success) {
          createMessage.success(t('撤销成功'));
          reload();
        } else {
          createMessage.error('撤销失败');
        }
      });
}

/**
 * 归档
 */
function handlePublish(record: Recordable) {
  publishInventory( { id: record.id })
      .then((res) => {
        if (res.success) {
          createMessage.success(t('归档成功'));
          reload();
        } else {
          createMessage.error(res.message || t('归档失败'));
        }
      });
}

/**
 * 填报
 */
function submitAform(record) {
  newForm.checkId = record.id;
  newForm.standardId = record.standardId;
  newForm.year = record.year;
  newForm.status = record.status;
  newForm.targetName = record.targetName;
  isShowDetailPopup.value = true;
}

/**
 * 查看
 */
function saveView(record) {
  newForm.checkId = record.id;
  newForm.standardId = record.standardId;
  newForm.status = record.status;
  newForm.year = record.year;
  newForm.targetName = record.targetName;
  isShowDetailPopup.value = true;
}

/**
 * 返回
 */
function back() {
  isShowDetailPopup.value = false;
  reload();
}

/**
 * 成功回调
 */
function handleSuccess() {
  reload();
}

/**
 * 操作栏
 */
function getTableAction(record) {
  return [
    {
      label: record.status != 1 ? t('carbon.message.fill_in') : t('carbon.message.Examine'),
      onClick: record.status != 1 ? () => submitAform(record) : () => saveView(record),
    },
  ];
}

/**
 * 下拉操作栏
 */
function getDropDownAction(record) {
  const actions = [
    {
      label: t('carbon.message.report_Progress'),
      onClick: () => handleViewProgress(record),
    }
  ];

  // 根据状态添加操作
  if (record.status == 2) {
    actions.push({
      label: t('carbon.message.Archive'),
      onClick: () => handlePublish(record),
    });
  }

  if (record.status == 0) {
    actions.push({
      label: t('carbon.message.Delete'),
      popConfirm: {
        title: t('carbon.message.Confirm_delete'),
        confirm: () => handleDelete(record),
        placement: 'topLeft',
      },
    });
  }

  actions.push({
    label: t('carbon.message.withdraw_archive'),
    onClick: () => handleRevocation(record),
  });

  return actions;
}
</script>

<style lang="less" scoped>
.m_contentBox {
  background: #f0f2f5;

  .centeet {
    display: flex;
    height: 100%;

    .left-tree {
      width: 20%;
      min-width: 20%; /* 添加最小宽度 */
      min-height: 600px;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      padding: 16px;
      overflow: auto;
      background: #fff;
      margin-right: 16px;
    }

    .right {
      width: 20%;
      min-width: 20%;
      flex: 1;
      position: relative;
      background: #fff;
      border-radius: 4px;
      padding: 24px;
    }
  }
}
.statusStyle {
  padding: 5px 12px;
  font-weight: 400;
  font-size: 14px;
  color: #2ba471;
  width: 66px;
  background: #e3f9e9;
  border-radius: 3px;
  border: 1px solid #2ba471;
  margin: 0 auto;
  white-space: nowrap;
}

.statusStyle1 {
  padding: 5px 12px;
  font-weight: 400;
  width: 66px;
  font-size: 14px;
  margin: 0 auto;
  color: #0052d9;
  background: #f2f3ff;
  border-radius: 3px;
  white-space: nowrap;
  border: 1px solid #0052d9;
}

.statusStyle2 {
  padding: 5px 12px;
  width: 66px;
  margin: 0 auto;
  font-weight: 400;
  font-size: 14px;
  color: #e37318;
  white-space: nowrap;
  background: #fff1e9;
  border-radius: 3px;
  border: 1px solid #e37318;
}
</style>
