<!-- 单位管理 -->
<template>
  <div>
    <div class="m_contentBox">
      <a-card :bordered="false">
        <div class="m_aCardBox">
          <!-- 查询区域 -->
          <div class="tabBox">
            <div class="table-page-search-wrapper">
              <a-form layout="inline" @keyup.enter="searchQuery">
                <a-row :gutter="24">
                  <a-col :span="8">
                    <a-form-item label="单位分组" :labelCol="{ span: 12}" :wrapperCol="{ span: 12 }">
                      <a-select
                        placeholder="请选择"
                        option-filter-prop="label"
                        v-model:value="queryParam.parentId"
                        show-search
                        allow-clear
                        style="width: 150px"
                      >
                        <a-select-option
                          v-for="item in unitGroupList"
                          :key="item.id"
                          :label="item.groupName"
                          :value="item.id"
                        >
                          {{ item.groupName }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="单位名称" :labelCol="{ span: 12}" :wrapperCol="{ span: 12 }">
                      <a-input
                        placeholder="请输入"
                        v-model:value="queryParam.unitCode"
                        allow-clear
                        style="width: 150px"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="">
                      <div style="width: 100%; display: flex; justify-content: flex-end;">
                        <a-button type="primary" preIcon="ant-design:search-outlined" @click="searchQuery()">查询</a-button>
                        <a-button @click="searchReset()" preIcon="ant-design:reload-outlined" style="margin-left: 8px">重置</a-button>
                      </div>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </div>
          </div>
          <!-- 查询区域-END -->

          <!-- table区域-begin -->
          <div class="cardBox">
            <div class="m_mb24">
              <a-button @click="openAddUnitGroupDrawer" preIcon="ant-design:plus-outlined" type="primary" >新增分组</a-button>
              <a-button @click="handleAdd" type="primary" preIcon="ant-design:plus-outlined"  style="margin-left: 8px">新增单位</a-button>
              <a-button
                type="primary"
                preIcon="ant-design:export-outlined"
                @click="handleExportXls('碳排因子单位表')"
                style="margin-left: 8px"
              >
                导出
              </a-button>
              <a-upload
                name="file"
                :show-upload-list="false"
                :multiple="false"
                :headers="tokenHeader"
                :action="importExcelUrl"
                @change="handleImportExcel"
                style="margin-left: 8px"
              >
                <a-button preIcon="ant-design:import-outlined" type="primary">导入</a-button>
              </a-upload>

              <a-upload
                name="file"
                :show-upload-list="false"
                :multiple="false"
                :headers="tokenHeader"
                :action="synchronousEmissionFactorUnit"
                @change="handleImportExcel"
                style="margin-left: 8px"
              >
                <a-button preIcon="ant-design:import-outlined" type="primary">同步碳排因子单位</a-button>
              </a-upload>
            </div>

            <a-table
              ref="tableRef"
              size="middle"
              :scroll="{x:true}"
              row-key="id"
              :columns="columns"
              :data-source="dataSource"
              :pagination="ipagination"
              :loading="loading"
              :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
              class="j-table-force-nowrap"
              @change="handleTableChange"
            >
              <template #htmlSlot="{ text }">
                <div v-html="text"></div>
              </template>

              <template #fileSlot="{ text }">
                <span v-if="!text" style="font-size: 12px; font-style: italic;">无文件</span>
                <a-button
                  v-else
                  :ghost="true"
                  type="primary"
                  icon="download"
                  size="small"
                  @click="downloadFile(text)"
                >
                  下载
                </a-button>
              </template>

              <template #action="{ text, record }">
                <a @click="handleDetail(record)">详情</a>
                <a-divider type="vertical" />
                <a @click="handleEdit(record)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </template>

              <!-- 展示单位换算的插槽 -->
              <template #convert="{ record }">
                <div v-for="(item, index) in record.cyEmissionUnitConvert" :key="index">
                  1 {{ item.sourceUnit }} = {{ item.value }} {{ item.targetUnit }}
                </div>
              </template>
            </a-table>
          </div>

          <!-- 新增分组的抽屉 -->
          <a-drawer
            title="单位分组管理"
            :width="800"
            placement="right"
            :closable="false"
            @close="onClose"
            destroy-on-close
            :visible="addUnitGroupVisible"
          >
            <cy-unit-group-drawer v-show="addUnitGroupVisible" />
          </a-drawer>

          <!-- 单位管理详情和编辑抽屉 -->
          <a-drawer
            :title="detailFlag === 1 ? '单位详情' : '编辑单位'"
            :width="700"
            placement="right"
            :closable="false"
            @close="onClose"
            destroy-on-close
            :visible="unitDetailVisible"
          >
            <cy-unit-detail-form
              ref="unitdetailFormRef"
              :detail-data-source="detailDataSource"
              :detail-flag="detailFlag"
              :forward-list="forwardList"
              :contrary-list="contraryList"
              @get-all-convert="getAllConvert"
            />

            <span style="float: right">
              <a-button type="primary" @click="onClose()">关闭</a-button>
              <a-button
                type="primary"
                v-show="detailFlag !== 1"
                @click="editUnit()"
                style="margin-left: 8px"
              >
                提交
              </a-button>
            </span>
          </a-drawer>

          <!-- 系统生成时的新增单位抽屉组件 -->
          <cy-emission-unit-modal ref="modalFormRef" @ok="modalFormOk" />
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, getCurrentInstance } from 'vue'
import { message } from 'ant-design-vue'
import '@/assets/less/TableExpand.less'
import CyEmissionUnitModal from './modules/CyEmissionUnitModal.vue'
import CyUnitGroupDrawer from './modules/CyUnitGroupDrawer.vue'
import CyUnitDetailForm from './modules/CyUnitDetailForm.vue'
import { defHttp } from '@/utils/http/axios'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import { getFileAccessHttpUrl } from '/@/utils/common/compUtils';
import axios from 'axios'

// 获取当前实例
const instance = getCurrentInstance()

// 响应式数据
const description = ref('碳排因子单位管理页面')
const unitGroupList = ref([])
const addUnitGroupVisible = ref(false)
const unitDetailVisible = ref(false)
const detailDataSource = ref({})
const detailFlag = ref(null)
const forwardList = ref([])
const contraryList = ref([])
const editParam = ref({})
const backObj = ref({})
const dataSource = ref([])
const isorter = reactive({
  column: 'createTime',
  order: 'desc'
})

// 表格引用
const tableRef = ref()
const unitdetailFormRef = ref()
const modalFormRef = ref()

// 查询参数
const queryParam = reactive({
  parentId: undefined,
  unitCode: undefined
})

// 分页配置
const ipagination = reactive({
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['10', '20', '30'],
  showTotal: (total, range) => {
    return range[0] + '-' + range[1] + ' 共' + total + '条'
  },
  showQuickJumper: true,
  showSizeChanger: true,
  total: 0
})

// 加载状态
const loading = ref(false)
const selectedRowKeys = ref([])

// 表头
const columns = [
  {
    title: '单位分组',
    align: "center",
    dataIndex: 'parentName'
  },
  {
    title: '单位名称',
    align: "center",
    dataIndex: 'unitCode'
  },
  {
    title: '单位换算',
    align: "center",
    dataIndex: 'cyEmissionUnitConvert',
    slots: { customRender: 'convert' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: "center",
    fixed: "right",
    width: 147,
    slots: { customRender: 'action' }
  }
]

// URL配置
const url = {
  // 单位分页列表查询
  list: "/emission/factor/cyEmissionUnit/list",
  // 单位分组查询
  unitGroup: "/CyFactorUnitGroup/cyFactorUnitGroup/list",
  // 单位删除
  delete: "/emission/factor/cyEmissionUnit/delete",
  deleteBatch: "/CyEmissionUnit/cyEmissionUnit/deleteBatch",
  exportXlsUrl: "/emission/factor/cyEmissionUnit/exportXls",
  importExcelUrl: "/emission/factor/cyEmissionUnit/importExcel",
  synchronousEmissionFactorUnit: "/emission/factor/cyEmissionUnit/synchronousEmissionFactorUnit",
  // 查询单位详情
  queryById: "/emission/factor/cyEmissionUnit/queryById",
  // 编辑单位
  editUnit: "/emission/factor/cyEmissionUnit/edit",
}

// 计算属性
const importExcelUrl = computed(() => {
  return `${window._CONFIG['domianURL']}/${url.importExcelUrl}`
})

const synchronousEmissionFactorUnit = computed(() => {
  return `${window._CONFIG['domianURL']}/${url.synchronousEmissionFactorUnit}`
})

// token header
const tokenHeader = computed(() => {
  const token = localStorage.getItem(ACCESS_TOKEN)
  return { 'X-Access-Token': token }
})

// 方法定义
const getSuperFieldList = () => {
  // 这里根据实际需求实现
}

// 获取查询参数
const getQueryParams = () => {
  let param = Object.assign({}, queryParam);
  param.field = isorter.column;
  param.order = isorter.order;
  param.pageNo = ipagination.current;
  param.pageSize = ipagination.pageSize;
  return param;
}

// 重新计算分页
const reCalculatePage = (offset) => {
  //重新计算分页
  if (offset === 1) {
    if (ipagination.current > 1) {
      ipagination.current--;
    }
  }
}

// 清空选择
const onClearSelected = () => {
  selectedRowKeys.value = []
}

// 单位分组分页列表查询
const searchGroup = async () => {
  try {
    const res = await defHttp.get({ url: url.unitGroup }, { isTransformResponse: false})
    unitGroupList.value = res.result?.records || []
  } catch (error) {
    console.error(error)
  }
}

// 打开新增单位分组的抽屉
const openAddUnitGroupDrawer = () => {
  addUnitGroupVisible.value = true
}

// 统一的抽屉关闭方法
const onClose = () => {
  addUnitGroupVisible.value = false
  unitDetailVisible.value = false
  searchGroup()
}

// 查询对应单位对象的数据详情
const handleDetail = async (record) => {
  try {
    const res = await defHttp.get({
      url: url.queryById,
      params: { id: record.id }
    }, { isTransformResponse: false})
    detailDataSource.value = res.result
    unitDetailVisible.value = true
    detailFlag.value = 1
  } catch (error) {
    console.error(error)
  }
}

// 编辑对应单位对象的数据详情
const handleEdit = async (record) => {
  try {
    const res = await defHttp.get({
      url: url.queryById,
      params: { id: record.id }
    }, { isTransformResponse: false})
    detailDataSource.value = res.result
    unitDetailVisible.value = true
    detailFlag.value = 0
  } catch (error) {
    console.error(error)
  }
}

// 获取所有转换数据
const getAllConvert = (e1, e2) => {
  console.log('getAllConvert', e1, e2)
  forwardList.value = e1
  contraryList.value = e2

  // 将单位的主体对象赋值给编辑参数对象
  editParam.value = detailDataSource.value.cyEmissionUnit
  detailDataSource.value.cyEmissionUnitConvert = []

  // 将正向转换对象数组和反向转换对象数组中的数据统一到一个数组当中
  for (let i = 0; i < forwardList.value.length; i++) {
    detailDataSource.value.cyEmissionUnitConvert.push(forwardList.value[i])
  }

  for (let i = 0; i < contraryList.value.length; i++) {
    detailDataSource.value.cyEmissionUnitConvert.push(contraryList.value[i])
  }

  // 如果正向和反向数组都为空，则设置合并的数组为空数组
  if (forwardList.value.length < 1 && contraryList.value.length < 1) {
    editParam.value.unitConvertList = []
  } else {
    // 否则就将数据放入编辑对象中，对单位的转换对象进行修改操作
    editParam.value.unitConvertList = detailDataSource.value.cyEmissionUnitConvert
  }

  console.log(editParam.value)

  // 调用接口进行编辑操作
  defHttp.post({
    url: url.editUnit,
    data: editParam.value
  }, { isTransformResponse: false}).then(res => {
    if (res.code === 200) {
      message.success(res.message)
      unitDetailVisible.value = false
      loadData()
    }
  })
}

// 编辑单位
const editUnit = () => {
  console.log('editUnit', unitdetailFormRef.value)
  unitdetailFormRef.value.submitqqqq()
}

// 加载数据
const loadData = async (arg) => {
  if(!url.list){
    message.error("请设置url.list属性!")
    return
  }
  //加载数据 若传入参数1则加载第一页的内容
  if (arg === 1) {
    ipagination.current = 1;
  }
  var params = getQueryParams();//查询条件
  loading.value = true;
  try {
    const res = await defHttp.get({url: url.list, params}, {isTransformResponse: false});
    if (res.success) {
      //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
      dataSource.value = res.result.records||res.result;
      if(res.result.total)
      {
        ipagination.total = res.result.total;
      }else{
        ipagination.total = 0;
      }
      //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
    }else{
      message.warning(res.message)
    }
  } finally {
    loading.value = false
  }
}

// 搜索查询
const searchQuery = () => {
  loadData(1);
}

// 重置搜索
const searchReset = () => {
  Object.keys(queryParam).forEach(key => {
    queryParam[key] = undefined
  })
  loadData(1);
}

// 导出Excel
const handleExportXls = (fileName) => {
  if(!fileName || typeof fileName != "string"){
    fileName = "导出文件"
  }
  let param = getQueryParams();
  if(selectedRowKeys.value && selectedRowKeys.value.length>0){
    param['selections'] = selectedRowKeys.value.join(",")
  }
  console.log("导出参数",param)
  downFile(url.exportXlsUrl,param).then((data)=>{
    if (!data) {
      message.warning("文件下载失败")
      return
    }
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      window.navigator.msSaveBlob(new Blob([data],{type: 'application/vnd.ms-excel'}), fileName+'.xls')
    }else{
      let url = window.URL.createObjectURL(new Blob([data],{type: 'application/vnd.ms-excel'}))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName+'.xls')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    }
  })
}

// 导入Excel
const handleImportExcel = (info) => {
  loading.value = true;
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (info.file.status === 'done') {
    loading.value = false;
    if (info.file.response.success) {
      // message.success(`${info.file.name} 文件上传成功`);
      if (info.file.response.code === 201) {
        let { message: msg, result: { msg: resultMsg, fileUrl, fileName } } = info.file.response
        let href = window._CONFIG['domianURL'] + fileUrl
        // 注意：这里需要使用 ant-design-vue 的 Modal 组件来实现警告弹窗
        // this.$warning({
        //   title: msg,
        //   content: (<div>
        //       <span>{resultMsg}</span><br/>
        //       <span>具体详情请 <a href={href} target="_blank" download={fileName}>点击下载</a> </span>
        //     </div>
        //   )
        // })
      } else {
        message.success(info.file.response.message || `${info.file.name} 文件上传成功`)
      }
      loadData()
    } else {
      message.error(`${info.file.name} ${info.file.response.message}.`);
    }
  } else if (info.file.status === 'error') {
    loading.value = false;
    if (info.file.response.status === 500) {
      let data = info.file.response
      const token = localStorage.getItem(ACCESS_TOKEN)
      if (token && data.message.includes("Token失效")) {
        // 注意：这里需要使用 ant-design-vue 的 Modal 组件来实现错误弹窗
        // this.$error({
        //   title: '登录已过期',
        //   content: '很抱歉，登录已过期，请重新登录',
        //   okText: '重新登录',
        //   mask: false,
        //   onOk: () => {
        //     store.dispatch('Logout').then(() => {
        //       localStorage.removeItem(ACCESS_TOKEN)
        //       window.location.reload();
        //     })
        //   }
        // })
      }
    } else {
      message.error(`文件上传失败: ${info.file.msg} `);
    }
  }
}

// 表格选择变化
const onSelectChange = (selectedKeys) => {
  selectedRowKeys.value = selectedKeys
}

// 表格变化处理
const handleTableChange = (pagination, filters, sorter) => {
  //分页、排序、筛选变化时触发
  //TODO 筛选
  console.log(pagination)
  if (Object.keys(sorter).length > 0) {
    isorter.column = sorter.field;
    isorter.order = "ascend" == sorter.order ? "asc" : "desc"
  }
  Object.assign(ipagination, pagination);
  loadData();
}

// 删除处理
const handleDelete = async (id) => {
  if(!url.delete){
    message.error("请设置url.delete属性!")
    return
  }
  try {
    const res = await defHttp.delete({url: url.delete, params: {id: id}}, {isTransformResponse: false,joinParamsToUrl: true});
    if (res.success) {
      //重新计算分页问题
      reCalculatePage(1)
      message.success(res.message);
      loadData();
    } else {
      message.warning(res.message);
    }
  } catch (error) {
    console.error(error);
  }
}

// modal确认回调
const modalFormOk = () => {
  // 新增/修改 成功时，重载列表
  loadData();
  //清空列表选中
  onClearSelected()
}

// 下载文件
const downloadFile = (text) => {
  if(!text){
    message.warning("未知的文件")
    return;
  }
  if(text.indexOf(",")>0){
    text = text.substring(0,text.indexOf(","))
  }
  let url = getFileAccessHttpUrl(text)
  window.open(url);
}

// 新增单位
const handleAdd = () => {
  modalFormRef.value.add();
}


/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
async function downFile(url, parameter, method = 'get') {
  const config = {
    url: url,
    method: method,
    responseType: 'blob'
  };

  if (method.toLowerCase() === 'get') {
    config.params = parameter;
  } else {
    config.data = parameter;
  }

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw new Error(`文件下载失败: ${error.message}`);
  }
}



// 生命周期钩子
onMounted(() => {
  getSuperFieldList()
  // 调用查询单位分组方法
  searchGroup()
  // 加载数据
  loadData()
})
</script>

<style lang="less" scoped>

/deep/ .ant-card-body {
  background: #F5F8F7;

  .ant-form-item {
    margin-bottom: 20px !important;
  }
}

.tabBox {
  padding: 24px 24px 0;
  background: #FFFFFF;
  border-radius: 3px;
}

.cardBox {
  margin-top: 24px;
  padding: 24px;
  background: #FFFFFF;
  border-radius: 3px;
}
</style>
