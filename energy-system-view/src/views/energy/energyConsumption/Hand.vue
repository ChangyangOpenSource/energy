<template>
  <a-card :bordered='false'>
    <div style="display: flex; justify-content: space-between; align-items: center; height: 100%">
      <div style="width: 25%; background-color: rgba(247, 247, 247, 0.9294117647058824); height: calc(100vh - 60px - 56px - 24px - 24px); padding: 0 10px">
        <div style="margin-top: 10px">
          <a-descriptions title="手工填报"></a-descriptions>
        </div>
        <div>
          <div>场站</div>
          <select-station-no-clear v-model:value="stationId"></select-station-no-clear>
        </div>
        <div>
          <div>能源类型</div>
          <select-equipment-type v-model:value="equipmentTypeId"></select-equipment-type>
        </div>

        <div>
          <div>选择设备</div>
          <div style="height: 44vh;">
            <select-off-meter :equipmentTypeId="equipmentTypeId" :stationId="stationId" v-model:value="selectedEquipmentIds"></select-off-meter>
          </div>
        </div>

        <div>
          <div style="margin-top: 10px">填报方式</div>
          <div>
            <a-select v-model:value="timeValue" style="width: 100%" @change="handleTimeChange">
              <a-select-option value="1"> 按年</a-select-option>
              <a-select-option value="2"> 按月</a-select-option>
              <a-select-option value="3"> 按日</a-select-option>
            </a-select>
          </div>
        </div>


        <div>
          <div>时间</div>
          <div>
            <a-range-picker
              v-if="timeValue == 1"
              format="YYYY"
              value-format="YYYY"
              style="width: 100%"
              v-model:value="rangeValue" picker="year"
              :placeholder="['开始时间', '结束时间']"
            />
            <a-range-picker
              v-if="timeValue == 2"
              format="YYYY-MM"
              value-format="YYYY-MM"
              style="width: 100%"
              v-model:value="rangeValue" picker="month"
              :placeholder="['开始时间', '结束时间']"
            />
            <a-range-picker
              v-if="timeValue == 3"
              v-model:value="rangeValue"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
              :placeholder="['开始时间', '结束时间']"
            />
          </div>
        </div>
        <a-button type="primary" @click="query" style="width: 100%; margin-top: 10px">填报</a-button>
      </div>
      <div style="width: 75%; height: calc(100vh - 60px - 56px - 24px - 24px);">
        <template v-if="visable">
          <div style="margin-left: 15px">
            <div style="display: flex; justify-content: flex-end;  gap: 10px">
              <a-button preIcon="ant-design:export-outlined" @click="handleExportXls">下载模板
              </a-button>
              <j-upload-button preIcon="ant-design:import-outlined" @click="handleImportExcel">导入
              </j-upload-button>
              <a-button @click="save" type="primary">保存</a-button>
            </div>
            <div class="responsive-table">
              <a-table
                :columns="newColumns"
                :data-source="equipmentDatas"
                :pagination="false"
                :scroll="{ x: scrollX}"
                size="middle"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.dataIndex && column.dataIndex.includes('dataTime')">
                    <a-input-number
                      v-model:value="record[column.dataIndex]"
                      @change="sumData(record)"
                      style="width: 100%; min-width: 60px;"
                    />
                  </template>
                </template>
              </a-table>
            </div>
          </div>
        </template>
        <!-- 空状态居中 -->
        <div v-else style="
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <a-empty description="暂无数据"/>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>

import SelectEquipmentType from "@/components/SelectEquipmentType/selectEquipmentType.vue";
import SelectOffMeter from "@/components/SelectEquipment/SelectOffMeter.vue";
import {onMounted, ref, watch} from "vue";
import {
  detailListByEquipmentIds, getExportUrlHandData,
  saveHandData
} from "@/views/energy/meter/components/CyEquipmentData.api";
import {message} from "ant-design-vue";
import {useGlobSetting} from "@/hooks/setting";
import {useMessage} from "@/hooks/web/useMessage";
import {defHttp} from "@/utils/http/axios";
import SelectStationNoClear from "@/components/station/SelectStationNoClear.vue";
import dayjs from "dayjs";

const {createMessage, createWarningModal} = useMessage();
const glob = useGlobSetting();

const visable = ref(false)//右侧页面是否显示
const timeValue = ref('2')//数据明细时间维度
const rangeValue = ref([])//时间筛选
const equipmentIds = ref() //查询的设备
const selectedEquipmentIds = ref() //选中的设备
const equipmentTypeId = ref()
const stationId = ref()

const newColumns = ref([])
const equipmentDatas = ref()
// 添加计算属性动态设置滚动宽度
const scrollX = ref('100%')

onMounted(() => {
  // 初始化时根据 timeValue 设置默认值
  const currentYear = dayjs().year()
  if (timeValue.value === '2') {
    rangeValue.value = [`${currentYear}-01`, `${currentYear}-12`]
  }
})

// 监听列数变化，动态调整滚动宽度
watch(() => newColumns.value.length, (columnCount) => {
  // 每列大概120px，加上固定列
  const estimatedWidth = (columnCount - 2) * 120 + 100 + 160
  scrollX.value = estimatedWidth > window.innerWidth * 0.8 ? estimatedWidth : '100%'
})

// 监听窗口大小变化
onMounted(() => {
  window.addEventListener('resize', () => {
    const estimatedWidth = (newColumns.value.length - 2) * 120 + 100 + 160 //100是额外预留的
    scrollX.value = estimatedWidth > window.innerWidth * 0.8 ? estimatedWidth : '100%'
  })
})

/**
 * 保存
 */
function save() {
  saveHandData({
    equipmentIds: equipmentIds.value,
    type: timeValue.value,
    startTime: rangeValue.value[0],
    endTime: rangeValue.value[1],
    datas: equipmentDatas.value
  }).then((res) => {

  })
}

/**
 * 求和
 */
function sumData(record) {
  record.sum = 0
  for (let key in record) {
    if (key.includes("dataTime")) {
      record.sum = record.sum * 1 + record[key] * 1
    }
  }
}

/**
 * 初始化数据源
 */
function initData() {
  detailListByEquipmentIds({
    equipmentIds: equipmentIds.value,
    type: timeValue.value,
    startTime: rangeValue.value[0],
    endTime: rangeValue.value[1]
  }).then((res => {
    equipmentDatas.value = res

    newColumns.value = initColumns()
  }))
}

/**
 * 初始化表头
 */
function initColumns() {
  const columns = [
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
      fixed: 'left',
      width: 120
    },
    {
      title: '数据点',
      dataIndex: 'dataName',
      key: 'dataName',
      fixed: 'left',
      width: 120
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      fixed: 'left',
      width: 60
    },
    {
      title: '合计',
      dataIndex: 'sum',
      key: 'sum',
      fixed: 'left',
      width: 100
    }
  ]

  if (!rangeValue.value || rangeValue.value.length !== 2) {
    return columns;
  }

  const [start, end] = rangeValue.value;

  // 根据timeValue生成时间序列
  const timePeriods = generateTimePeriods(start, end, timeValue.value);


  // 为每个时间段生成列
  for (let i = 0; i < timePeriods.length; i++) {
    columns.push({
      title: timePeriods[i],
      dataIndex: "dataTime" + timePeriods[i],
      key: "dataTime" + timePeriods[i],
    });

  }
  // 初始化数据 (改为从接口获取数据)
  // for (let j = 0; j < equipmentDatas.value.length; j++) {
  //   // 为每个设备添加时间段数据，初始值为0
  //   for (let i = 0; i < timePeriods.length; i++) {
  //     equipmentDatas.value[j][`dataTime${timePeriods[i]}`] = 0;
  //   }
  // }

  return columns;
}

// 生成时间序列
function generateTimePeriods(start, end, timeType) {
  const periods = [];
  const startDate = new Date(start);
  const endDate = new Date(end);


  switch (timeType) {
    case "1": // 年
      for (let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
        periods.push(year.toString());
      }
      break;

    case "2": // 月
      let current = new Date(startDate);
      while (current <= endDate) {
        const year = current.getFullYear();
        const month = current.getMonth() + 1;
        periods.push(`${year}-${month.toString().padStart(2, '0')}`);
        current.setMonth(current.getMonth() + 1);
      }
      break;

    case "3": // 日
      let currentDay = new Date(startDate);
      while (currentDay <= endDate) {
        const year = currentDay.getFullYear();
        const month = currentDay.getMonth() + 1;
        const day = currentDay.getDate();
        periods.push(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
        currentDay.setDate(currentDay.getDate() + 1);
      }
      break;
  }

  return periods;
}

/**
 * 时间类型选择回调
 */
function handleTimeChange() {
  rangeValue.value = [];
}


/**
 * 选中设备
 */
function query() {
  if (!selectedEquipmentIds.value) {
    message.warning("选择设备");
    return
  }
  if (!timeValue.value) {
    message.warning("选择填报方式");
    return
  }
  console.log("rangeValue", rangeValue)
  if (!rangeValue.value || rangeValue.value.length != 2) {
    message.warning("选择时间");
    return
  }

  equipmentIds.value = selectedEquipmentIds.value
  visable.value = true
  initData();
}


/**
 * 下载模板
 */
async function handleExportXls() {
  const response = await defHttp.get(
    {
      url: getExportUrlHandData, params: {
        equipmentIds: equipmentIds.value,
        type: timeValue.value,
        startTime: rangeValue.value[0],
        endTime: rangeValue.value[1]
      }, responseType: 'blob', timeout: 60000
    },
    {isTransformResponse: false, isReturnNativeResponse: true}
  );
  if (!response || !response.data) {
    createMessage.warning('文件下载失败');
    return;
  }
  const data = response.data;

  if (!name || typeof name != 'string') {
    name = '导出文件';
  }
  let blobOptions = {type: 'application/vnd.ms-excel'};
  let fileSuffix = '.xlsx';

  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(new Blob([data], blobOptions), name + fileSuffix);
  } else {
    let url = window.URL.createObjectURL(new Blob([data], blobOptions));
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', name + fileSuffix);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); //下载完成移除元素
    window.URL.revokeObjectURL(url); //释放掉blob对象
  }
}

/**
 * 导入
 * @param info
 */
async function handleImportExcel(data) {
  const isReturn = (fileInfo) => {
    try {
      if (fileInfo.code === 201) {
        let {
          message,
          result: {msg, fileUrl, fileName},
        } = fileInfo;
        let href = glob.uploadUrl + fileUrl;
        createWarningModal({
          title: message,
          centered: false,
          content: `<div>
                                <span>${msg}</span><br/>
                                <span>具体详情请<a href = ${href} download = ${fileName}> 点击下载 </a> </span>
                              </div>`,
        });
        //update-begin---author:wangshuai ---date:20221121  for：[VUEN-2827]导入无权限，提示图标错误------------
      } else if (fileInfo.code === 500 || fileInfo.code === 510) {
        createMessage.error(fileInfo.message || `${data.file.name} 导入失败`);
        //update-end---author:wangshuai ---date:20221121  for：[VUEN-2827]导入无权限，提示图标错误------------
      } else {
        createMessage.success(fileInfo.message || `${data.file.name} 文件上传成功`);
        initData()
      }
    } catch (error) {
      console.log('导入的数据异常', error);
    }
  };

  await defHttp.uploadFile({url: '/cyEquipmentData/importExcelHandData'}, {
    file: data.file,
    data: {
      equipmentIds: equipmentIds.value,
      type: timeValue.value,
      startTime: rangeValue.value[0],
      endTime: rangeValue.value[1],
    }
  }, {success: isReturn});
}
</script>
<style scoped lang="less">
.responsive-table {
  width: 100%;
  overflow: hidden;
  margin-top: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  /* 添加响应式处理 */
  overflow-x: auto;
}

/* 美化滚动条 */
.responsive-table :deep(.ant-table-body)::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.responsive-table :deep(.ant-table-body)::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.responsive-table :deep(.ant-table-body)::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.responsive-table :deep(.ant-table-body)::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

</style>
