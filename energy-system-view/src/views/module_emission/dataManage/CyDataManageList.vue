<template>
  <div class="p-2" style="display: flex; height: 100vh;">

    <div  style="width: 15%; margin-right: 10px; background-color: white; padding: 20px">
      <a-tree
        v-if="!treeReloading"
        :clickRowToExpand="false"
        :treeData="treeData"
        :selectedKeys="selectedKeys"
        :checkStrictly="checkStrictly"
        :load-data="loadChildrenTreeData"
        v-model:expandedKeys="expandedKeys"
        @check="onCheck"
        @select="onSelect"
        style="overflow-y: auto;height: calc(100vh - 330px);"
      >
      </a-tree>
    </div>

    <div  style="width: 85%;">
      <!--查询区域-->
      <div class="jeecg-basic-table-form-container">
        <a-form ref="formRef" @keyup.enter.native="searchQuery" :model="queryParam" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row :gutter="24">

            <a-col :span="6">
              <a-form-item :label="$t('carbon.message.dataItem')">
                <a-input v-model:value="queryParam.dataItemName" allow-clear
                         :placeholder="$t('carbon.message.Please_enter')"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="$t('carbon.message.dataGetType')"  :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }">
                <a-select v-model:value="queryParam.dataGetType" allow-clear
                          :placeholder="$t('carbon.message.Please_select')">
                  <a-select-option :value="item.value" v-for="(item,index) in dataGetType" :key="index">
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="6">
              <a-form-item>
                <a-button type="primary" @click="searchQuery">{{ $t('carbon.message.Search') }}</a-button>
                <a-button style="margin-left: 8px" @click="searchReset">{{ $t('carbon.message.Reset') }}</a-button>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item style="float: right">
                <a-button type="primary" @click="handleAdd">{{ $t('carbon.message.Add') }}</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div>
        <div style="background-color: white; padding-left: 20px; padding-top: 20px">
          <span>年份：</span>
          <a-date-picker value-format="YYYY" :placeholder="$t('carbon.message.Please_select')" v-model:value="queryParam.fillInYear" picker="year" @change="selectDateChange" />
        </div>

        <!--引用表格-->
        <BasicTable @register="registerTable">
          <!--操作栏-->
          <template #action="{ record }">
            <TableAction :actions="getTableAction(record)" />
          </template>
          <template v-slot:bodyCell="{ column, record, index, text }">
            <div v-if="column.dataIndex === 'dataFillInType'">
              <span v-if="record.dataFillInType === '1'">按年</span>
              <span v-else>按月</span>
            </div>

            <div v-if="column.dataIndex === 'dataGetType'">
              <span v-if="record.dataGetType === '1'">手动填写</span>
              <span v-else-if="record.dataGetType === '2'">api接入</span>
              <span v-else>能耗系统获取</span>
            </div>


            <div v-if="column.dataIndex === 'annualValue'">
              <a-input-number :disabled="record.dataFillInType != '1'" v-model:value="record.annualValue" allow-clear :placeholder="$t('carbon.message.Please_enter')" @blur="changeItemValue(record)" ></a-input-number>
            </div>

            <div v-if="column.dataIndex === 'januaryValue'">
              <a-input-number :disabled="record.dataFillInType != '2'" v-model:value="record.januaryValue" allow-clear :placeholder="$t('carbon.message.Please_enter')" @blur="changeItemValue(record)"></a-input-number>
            </div>

            <div v-if="column.dataIndex === 'februaryValue'">
              <a-input-number :disabled="record.dataFillInType != '2'" v-model:value="record.februaryValue" allow-clear :placeholder="$t('carbon.message.Please_enter')" @blur="changeItemValue(record)"></a-input-number>
            </div>

            <div v-if="column.dataIndex === 'marchValue'">
              <a-input-number :disabled="record.dataFillInType != '2'" v-model:value="record.marchValue" allow-clear :placeholder="$t('carbon.message.Please_enter')" @blur="changeItemValue(record)"></a-input-number>
            </div>

            <div v-if="column.dataIndex === 'aprilValue'">
              <a-input-number :disabled="record.dataFillInType != '2'" v-model:value="record.aprilValue" allow-clear :placeholder="$t('carbon.message.Please_enter')" @blur="changeItemValue(record)"></a-input-number>
            </div>

            <div v-if="column.dataIndex === 'mayValue'">
              <a-input-number :disabled="record.dataFillInType != '2'" v-model:value="record.mayValue" allow-clear :placeholder="$t('carbon.message.Please_enter')" @blur="changeItemValue(record)"></a-input-number>
            </div>

            <div v-if="column.dataIndex === 'juneValue'">
              <a-input-number :disabled="record.dataFillInType != '2'" v-model:value="record.juneValue" allow-clear :placeholder="$t('carbon.message.Please_enter')" @blur="changeItemValue(record)"></a-input-number>
            </div>

            <div v-if="column.dataIndex === 'julyValue'">
              <a-input-number :disabled="record.dataFillInType != '2'" v-model:value="record.julyValue" allow-clear :placeholder="$t('carbon.message.Please_enter')" @blur="changeItemValue(record)"></a-input-number>
            </div>

            <div v-if="column.dataIndex === 'augustValue'">
              <a-input :disabled="record.dataFillInType != '2'" v-model:value="record.augustValue" allow-clear :placeholder="$t('carbon.message.Please_enter')" @blur="changeItemValue(record)"></a-input>
            </div>

            <div v-if="column.dataIndex === 'septemberValue'">
              <a-input :disabled="record.dataFillInType != '2'" v-model:value="record.septemberValue" allow-clear :placeholder="$t('carbon.message.Please_enter')" @blur="changeItemValue(record)"></a-input>
            </div>

            <div v-if="column.dataIndex === 'octoberValue'">
              <a-input-number :disabled="record.dataFillInType != '2'" v-model:value="record.octoberValue" allow-clear :placeholder="$t('carbon.message.Please_enter')" @blur="changeItemValue(record)"></a-input-number>
            </div>

            <div v-if="column.dataIndex === 'novemberValue'">
              <a-input-number :disabled="record.dataFillInType != '2'" v-model:value="record.novemberValue" allow-clear :placeholder="$t('carbon.message.Please_enter')" @blur="changeItemValue(record)"></a-input-number>
            </div>

            <div v-if="column.dataIndex === 'decemberValue'">
              <a-input-number :disabled="record.dataFillInType != '2'" v-model:value="record.decemberValue" allow-clear :placeholder="$t('carbon.message.Please_enter')" @blur="changeItemValue(record)"></a-input-number>
            </div>

            <div v-if="column.dataIndex === 'attechment'">
              <a @click="uploadAttechment(record)">上传</a>
            </div>



          </template>
        </BasicTable>
      </div>
    </div>
    <!-- 表单区域 -->
    <CyDataManageModal ref="registerModal" @success="handleSuccess"></CyDataManageModal>

    <CyDataManageUploadAttechmentModel ref="registerUploadAttechmentModal"></CyDataManageUploadAttechmentModel>

  </div>
</template>

<script lang="ts" name="CyDataManage-cyDataManage" setup>
import {ref, reactive, onMounted, computed, nextTick, watch} from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { columns } from './CyDataManage.data';
  import {
    list,
    deleteOne,
    batchDelete,
    getImportUrl,
    getExportUrl,
    dataGetTypeDict, saveOrUpdate
  } from './CyDataManage.api';

  import CyDataManageModal from './components/CyDataManageModal.vue'
  import CyDataManageUploadAttechmentModel from './components/uploadAttechmentModel.vue'
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getDateByPicker } from '/@/utils';
  import dayjs from 'dayjs';
  import {queryDepartAndPostTreeSync} from "@/views/system/depart/depart.api";

  const fieldPickers = reactive({
  });

  const formRef = ref();
  const queryParam = reactive<any>({});
  const toggleSearchStatus = ref<boolean>(false);
  const registerModal = ref();
  const registerUploadAttechmentModal = ref();
  const userStore = useUserStore();
  const { createMessage } = useMessage();

  const dataGetType = ref([]);

  // 创建一个计算属性用于发送请求
  const requestFillInYear = computed(() => {
    if (queryParam.fillInYear) {
      return dayjs(queryParam.fillInYear).format('YYYY');
    }
    return undefined;
  });

  // 部门树列表数据
  const treeData = ref<any[]>([]);
  // 当前选中的项
  const checkedKeys = ref<any[]>([]);
  // 当前展开的项
  const expandedKeys = ref<any[]>([]);
  // 当前选中的项
  const selectedKeys = ref<any[]>([]);
  // 树组件重新加载
  const treeReloading = ref<boolean>(false);
  // 树父子是否关联
  const checkStrictly = ref<boolean>(true);
  // 当前选中的部门
  const currentDepart = ref<any>(null);



  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '',
      api: list,
      columns,
      canResize:true,
      useSearchForm: false,
      actionColumn: {
        width: 120,
        fixed: 'right',
      },
      beforeFetch: async (params) => {
        for (let key in fieldPickers) {
          if (queryParam[key] && fieldPickers[key]) {
            queryParam[key] = getDateByPicker(queryParam[key], fieldPickers[key]);
          }
        }
        // 确保departId始终存在
        if (selectedKeys.value[0]) {
          queryParam.departId = selectedKeys.value[0];
        }
        return Object.assign(params, queryParam);
      },
    },
    exportConfig: {
      name: "数据管理",
      url: getExportUrl,
      params: queryParam,
    },
	  importConfig: {
	    url: getImportUrl,
	    success: handleSuccess
	  },
  });
  const [registerTable, { reload, collapseAll, updateTableDataRecord, findTableDataRecord, getDataSource }, { rowSelection, selectedRowKeys }] = tableContext;
  const labelCol = reactive({
    xs:24,
    sm:4,
    xl:6,
    xxl:4
  });
  const wrapperCol = reactive({
    xs: 24,
    sm: 20,
  });

  // 加载子级部门信息
  async function loadChildrenTreeData(treeNode) {
    try {
      const result = await queryDepartAndPostTreeSync({
        pid: treeNode.dataRef.id,
      });
      if (result.length == 0) {
        treeNode.dataRef.isLeaf = true;
      } else {
        treeNode.dataRef.children = result;
        if (expandedKeys.value.length > 0) {
          // 判断获取的子级是否有当前展开的项
          let subKeys: any[] = [];
          for (let key of expandedKeys.value) {
            if (result.findIndex((item) => item.id === key) !== -1) {
              subKeys.push(key);
            }
          }
          if (subKeys.length > 0) {
            expandedKeys.value = [...expandedKeys.value];
          }
        }
      }
      treeData.value = [...treeData.value];
    } catch (e) {
      console.error(e);
    }
    return Promise.resolve();
  }

  // 树复选框选择事件
  function onCheck(e) {
    if (Array.isArray(e)) {
      checkedKeys.value = e;
    } else {
      checkedKeys.value = e.checked;
    }
  }

  /**
   * 设置当前选中的行
   */
  function setSelectedKey(key: string, data?: object) {
    selectedKeys.value = [key];
    if (data) {
      currentDepart.value = data;
    }
  }

  /**
   * 年份切换
   */
  function selectDateChange() {
    searchQuery()
  }

  // 树选择事件
  function onSelect(selKeys, event) {
    console.log('select: ', selKeys, event);
    if (selKeys.length > 0 && selectedKeys.value[0] !== selKeys[0]) {
      setSelectedKey(selKeys[0], event.selectedNodes[0]);
    } else {
      // 这样可以防止用户取消选择
      setSelectedKey(selectedKeys.value[0]);
    }
    searchQuery();
  }

  // 重新加载树组件，防止无法默认展开数据
  async function reloadTree() {
    await nextTick();
    treeReloading.value = true;
    await nextTick();
    treeReloading.value = false;
  }

  // 自动展开父节点，只展开一级
  function autoExpandParentNode() {
    let item = treeData.value[0];
    if (item) {
      if (!item.isLeaf) {
        expandedKeys.value = [item.key];
      }
      // 默认选中第一个
      setSelectedKey(item.id, item);
      reloadTree();
    } else {
    }
  }

  // 加载顶级部门信息
  async function loadRootTreeData() {
      treeData.value = [];
      const result = await queryDepartAndPostTreeSync();
      if (Array.isArray(result)) {
        treeData.value = result;
      }
      if (expandedKeys.value.length === 0) {
        autoExpandParentNode();
      } else {
        if (selectedKeys.value.length === 0) {
          let item = treeData.value[0];
          if (item) {
            // 默认选中第一个
            setSelectedKey(item.id, item);
          }
        } else {
        }
      }
  }

  /**
   * 新增事件
   */
  function handleAdd() {
    registerModal.value.disableSubmit = false;
    registerModal.value.add(dayjs(queryParam.fillInYear).format("YYYY"),selectedKeys.value[0]);
  }

  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    registerModal.value.disableSubmit = false;
    registerModal.value.edit(record);
  }

  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    registerModal.value.disableSubmit = true;
    registerModal.value.edit(record);
  }

  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteOne({ id: record.id }, handleSuccess);
  }

  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await batchDelete({ ids: selectedRowKeys.value }, handleSuccess);
  }

  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
  }

  /**
   * 打开上传弹窗
   */
  function uploadAttechment(record) {
    registerUploadAttechmentModal.value.disableSubmit = false;
    registerUploadAttechmentModal.value.add(record);
  }

  /**
   * 打开上传弹窗
   */
  function changeItemValue(record) {

    // 如果是按年填写模式
    if (record.dataFillInType === '1') {
      // 如果年度值发生变化
      if (record.annualValue !== undefined && record.annualValue !== null) {
        const annualValue = Number(record.annualValue);
        const months = [
          'januaryValue', 'februaryValue', 'marchValue', 'aprilValue',
          'mayValue', 'juneValue', 'julyValue', 'augustValue',
          'septemberValue', 'octoberValue', 'novemberValue', 'decemberValue'
        ];
        // 计算每月平均值
        const monthlyAverage = annualValue / 12;
        // 设置所有月份的值为平均值
        months.forEach(month => {
            record[month] = monthlyAverage;
        });
      }
    }
    // 如果是按月填写模式
    else if (record.dataFillInType === '2') {
      // 计算年度总和
      const months = [
        'januaryValue', 'februaryValue', 'marchValue', 'aprilValue',
        'mayValue', 'juneValue', 'julyValue', 'augustValue',
        'septemberValue', 'octoberValue', 'novemberValue', 'decemberValue'
      ];

      let total = 0;
      months.forEach(month => {
        const value = record[month];
        if (value !== undefined && value !== null && typeof value === 'number') {
          total += value;
        }
      });
      // 更新年度值
      record.annualValue = total;
    }
    saveOrUpdate(record, true).then(res =>{
      if(res.success){
        createMessage.success(res.message);
      }else{
        createMessage.error(res.message);
      }
      reload();
    })
  }





  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
      },
      {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
          placement: 'topLeft',
        }
      }
    ];
  }

  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    return [
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      }, {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
          placement: 'topLeft',
        }
      }
    ]
  }

  /**
   * 查询
   */
  function searchQuery() {
    // 设置部门的查询条件
    queryParam.departId = selectedKeys.value[0];
    reload();
  }

  /**
   * 重置
   */
  function searchReset() {
    Object.keys(queryParam).forEach(key => {
      delete queryParam[key]
    })
    selectedRowKeys.value = [];
    // 设置默认为当前年份（Date对象）
    queryParam.fillInYear = dayjs().format('YYYY');
    // 设置部门的查询条件
    if (selectedKeys.value[0]) {
      queryParam.departId = selectedKeys.value[0];
    }
    //刷新数据
    reload();
  }


  // 生命周期钩子
  onMounted(() => {
    dataGetTypeDict().then(res => {
      dataGetType.value = res
    })
    // 设置默认为当前年份（Date对象）
    queryParam.fillInYear = dayjs().format('YYYY');
    // 确保在树数据加载完成后设置部门ID
    loadRootTreeData().then(res => {
      queryParam.departId = selectedKeys.value[0];
      searchQuery();
    })
  })

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
