<template>
  <div class="p-2">
    <div class="m_contentBox">
      <a-card :bordered="false">
        <div class="centeet">
          <div class="left" v-show="isAss">
            <div class="select">
              <a-radio-group :default-value="0" v-model:value="formState.standardCode" button-style="solid"
                             @change="standardChange">
                <a-radio-button value="A01A02">
                  ISO
                </a-radio-button>
                <a-radio-button value="A01A01">
                  GHG
                </a-radio-button>
              </a-radio-group>
            </div>
            <a-tree
                @select="onSelect"
                :tree-data="treeData"
                :selected-keys="selectedKeys"
                :expanded-keys="expandedKeys"
                @expand="onExpand"
            >
              <template #title="{ title }">
                <span :title="title">
                  {{ ellipsis(title) }}
                </span>
              </template>
            </a-tree>
            <!-- 展开 -->
            <div class="sizeStyle m_hoverCP" @click="onSizeLeft(false)">
              <img src="@/assets/carbon/img4.png" alt=""/>
            </div>
          </div>
          <div class="right">
            <div class="top">
              <div class="jeecg-basic-table-form-container">
                <a-form @keyup.enter.native="reload" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-row :gutter="24">
                    <a-col :lg="10">
                      <a-form-item :label="t('carbon.message.facilities_activities')">
                        <a-select
                            style="width: 100%"
                            v-model:value="formState.activitieId"
                            :placeholder="t('carbon.message.Please_select')"
                            allow-clear
                        >
                          <a-select-option
                              v-for="activity in activityList"
                              :key="activity.id"
                              :value="activity.id"
                          >
                            {{ activity.name }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="10">
                      <a-form-item :label="t('carbon.message.Emission_source')+':'">
                        <a-input v-model:value="formState.name" :placeholder="t('carbon.message.Please_enter')"
                                 allow-clear></a-input>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="4">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" preIcon="ant-design:search-outlined" @click="reload">{{ t('carbon.message.Search') }}</a-button>
              <a-button type="primary" preIcon="ant-design:reload-outlined" @click="searchReset" style="margin-left: 8px">{{ t('carbon.message.Reset') }}</a-button>
            </span>
                    </a-col>
                  </a-row>
                </a-form>
              </div>
            </div>

            <div class="tables">
              <!-- 替换 a-table 为 BasicTable -->
              <BasicTable @register="registerTable">
                <template #tableTitle>
                  <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined">
                    {{ t('carbon.message.New_emission_source') }}
                  </a-button>
                </template>
                <template #bodyCell="{ column, record }">
                  <template v-if="column.dataIndex === 'carbonMolecule'">
                    <div class="editable-row-operations">
                      {{ record.carbonMolecule }}/{{ record.carbonDenomintor }}
                    </div>
                  </template>
                  <template v-else-if="column.dataIndex === 'operation'">
                    <div class="editable-row-operations">
                      <a style="margin-right: 24px" @click="update(record.id)">{{ t('carbon.message.Edit') }}</a>
                      <a-popconfirm
                          :title="t('carbon.message.Confirm_delete')"
                          @confirm="handleDelete(record.id)"
                          :ok-text="t('carbon.message.Yes')"
                          :cancel-text="t('carbon.message.No')"
                      >
                        <a>{{ t('carbon.message.Delete') }}</a>
                      </a-popconfirm>
                    </div>
                  </template>
                </template>
              </BasicTable>
            </div>
            <div class="sizeStyle1 m_hoverCP" @click="onSizeLeft(true)" v-if="!isAss">
              <img src="@/assets/carbon/img5.png" alt=""/>
            </div>
          </div>
          <!--添加的新增详情弹框 -->
          <EmissionSourceBasicDrawer
              :standardCode="formState.standardCode"
              :standardDetailId="standardDetailId"
              ref="basicDrawerRef"
              @onCloseBasicDrawerVisible="onCloseBasicDrawerVisible"
          />
        </div>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { cloneObject } from '/@/utils/index';
import { useMessage } from '/@/hooks/web/useMessage';
// 引入 BasicTable 组件
import { BasicTable, useTable } from '/@/components/Table';
import { columns } from './CyOrgEmissionSource.data';
// 引入 API 方法
import { getList, deleteById, getAllActivities, loadTreeRoot } from './CyOrgEmissionSource.api';
import JInput from "@/components/Form/src/jeecg/components/JInput.vue";
import EmissionSourceBasicDrawer from '/src/components/common/basicDrawer.vue';;

const { t } = useI18n();
const { createMessage } = useMessage();

// 响应式数据
const isAss = ref<boolean>(true);
const treeData = ref<any[]>([]);
const selectedKeys = ref<string[]>([]);
const expandedKeys = ref<string[]>([]);
const activityList = ref<any[]>([]);
const standardDetailId = ref<string | null>(null);
const basicDrawerRef = ref();

// 表单状态
const formState = reactive({
  standardCode: "A01A02",
  activitieId: undefined,
  name: undefined,
  standardGhgDetailIds: undefined,
  standardIsoDetailIds: undefined
});

const labelCol = { xs: 24, sm: 4, xl: 6, xxl: 4 };
const wrapperCol = { xs: 24, sm: 20 };

// 注册表格
const [registerTable, { reload, getDataSource }] = useTable({
  columns,
  api: ({ pageNo, pageSize, ...otherParams }) => {
    const reqData = cloneObject(formState);
    reqData.pageNo = pageNo;
    reqData.pageSize = pageSize;
    Object.assign(reqData, otherParams);
    return getList(reqData);
  },
  pagination: true,
  showIndexColumn: false,
  useSearchForm: false,
  bordered: true,
  actionColumn: {
    width: 120,
    title: t('carbon.message.Handle'),
    dataIndex: 'operation',
  },
});

// 初始化数据
onMounted(() => {
  initDate();
  loadTreeRootData(formState.standardCode);
  reload();
});

// 获取活动设施列表
async function initDate() {
  try {
    const res = await getAllActivities();
    if (res.success) {
      activityList.value = res.result;
    }
  } catch (error) {
    console.error(error);
  }
}

// 标准切换处理
function standardChange() {
  selectedKeys.value = [];
  standardDetailId.value = null;
  formState.standardGhgDetailIds = undefined;
  formState.standardIsoDetailIds = undefined;
  loadTreeRootData(formState.standardCode);
  reload();
}

// 加载树形数据
async function loadTreeRootData(pcode: string) {
  try {
    const res = await loadTreeRoot({
      pcode: pcode,
      async: false,
    });
    if (res.success) {
      treeData.value = res.result;
      expandedKeys.value = treeData.value.map((item) => item.key);
    }
  } catch (error) {
    console.error(error);
  }
}

// 控制左侧栏显示隐藏
function onSizeLeft(value: boolean) {
  isAss.value = value;
}

// 删除排放源
async function handleDelete(id: string) {
  try {
    const res = await deleteById({ id });
    if (res.success) {
      createMessage.success(res.message);
      await reload();
    }
  } catch (error) {
    console.error(error);
  }
}

// 编辑排放源
function update(id: string) {
  basicDrawerRef.value.edit(id);
}

// 关闭抽屉回调
function onCloseBasicDrawerVisible() {
  reload();
}

// 重置搜索条件
function searchReset() {
  selectedKeys.value = [];
  Object.assign(formState, {
    standardCode: "A01A02",
    activitieId: undefined,
    name: undefined,
    standardGhgDetailIds: undefined,
    standardIsoDetailIds: undefined
  });
  reload();
}

// 添加新排放源
function handleAdd() {
  basicDrawerRef.value.add();
}

// 树节点选择处理
function onSelect(keys: string[], info: any) {
  standardDetailId.value = null;
  selectedKeys.value = keys;
  let standardDetailIds = "";

  if (info.selectedNodes[0].leaf) {
    standardDetailIds = keys[0];
    standardDetailId.value = keys[0];
  } else {
    standardDetailIds = info.selectedNodes[0].dataRef.children.map((item: any) => item.key).join(',') || "";
  }

  if (formState.standardCode == 'A01A01') {
    formState.standardGhgDetailIds = standardDetailIds;
  } else {
    formState.standardIsoDetailIds = standardDetailIds;
  }

  reload();
}

// 树展开处理
function onExpand(keys: string[]) {
  expandedKeys.value = keys;
}

// 文本过长省略处理
function ellipsis(value: string) {
  return value.split(' ').map(v => v.length > 18 ? v.substr(0, 18) + '...' : v).join(' ');
}
</script>

<style lang="less" scoped>
/deep/.ant-tree {
  overflow-y: auto;
}

.centeet {
  display: flex;
  height: 100%;
}

/* 新增外层容器样式 */
/*.m_contentBox {
  padding: 24px;
  background: #f0f2f5;
}*/

.color1 {
  color: #888888;
}

.inpts {
  width: 80px !important;
}

.tianjia {
  width: 380px;
  height: 156px;
  background: #f8f8f8;
  border-radius: 3px 3px 3px 3px;
  border: 1px solid #d9d9d9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .color {
    color: #888888;
  }

  .leftShoudong {
    background: #fff !important;
    border-color: #148958 !important;
    color: #148958 !important;
  }

  .marRight {
    margin-left: 16px;
  }
}

.tables {
  padding: 24px;
  background: #ffffff;
  border-radius: 3px 3px 3px 3px;
  border: 1px solid #eeeeee;
  margin-top: 24px;
}

.top {
  background: #ffffff;
  border-radius: 3px 3px 3px 3px;
  padding: 24px 24px 0;
}

.left {
  background: #fff;
  position: relative;
  padding: 29px 0px;
  border-right: 1px solid #e7e7e7;
  width: 20%;

  .select {
    margin-bottom: 24px;

    .ant-radio-button-wrapper {
      margin: 10px 20px;
      border-radius: 0;
    }
  }
}

.right {
  background: #fff;
  position: relative;
  flex: 1;
}

.sizeStyle {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  right: -16px;
  width: 16px;
  height: 46px;
  background: #ffffff;
  border-radius: 0px 5px 5px 0px;
  border: 1px solid #e7e7e7;
  z-index: 9;

  img {
    width: 16px;
    height: 16px;
  }
}

.sizeStyle1 {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 0px;
  width: 16px;
  height: 46px;
  background: #ffffff;
  border-radius: 0px 5px 5px 0px;
  border: 1px solid #e7e7e7;
  z-index: 9;

  img {
    width: 16px;
    height: 16px;
  }
}

.ant-tree {
  height: 600px;
}

.jeecg-basic-table-form-container {
  padding: 0;
  .table-page-search-submitButtons {
    display: block;
    margin-bottom: 24px;
    white-space: nowrap;
  }
}
</style>
