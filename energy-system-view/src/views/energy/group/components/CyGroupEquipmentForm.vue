<template>
  <a-card :bordered="false">
    <a-tabs v-model:activeKey="queryParam.relationType" @change="queryEquipmentList">
      <a-tab-pane key="1" tab="计量表">
        <div>
          <a-select
            style="width: 150px"
            v-model:value="queryParam.equipmentTypeId"
            :options="equipmentTypes"
            :field-names="{ label: 'title', value: 'key'}"
            placeholder="请选择设备类型"
            @change="queryEquipmentList">
          </a-select>
          <span style="float: right">
          <a-button style="margin-right: 10px" @click="deleteIds">批量删除</a-button>
          <a-button type="primary" @click="addEquipment">添加设备</a-button>
          </span>
        </div>
        <a-table
          style="margin-top: 8px"
          :columns="meterColumn"
          :data-source="dataSource"
          :pagination="false"
          :row-key="record => record.id"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
          <template #bodyCell="{ column, record }">
<!--            <template v-if="column.key === 'energyConsumptionCoefficient'">-->
<!--              <a-input v-if="record.energyConsumptionCoefficientIsEdit" v-model:value="record.energyConsumptionCoefficient"></a-input>-->
<!--              <span v-else>{{record.energyConsumptionCoefficient}}</span>-->
<!--            </template>-->
            <template v-if="column.key === 'action'">
              <span>
<!--                <span v-if="record.energyConsumptionCoefficientIsEdit">-->
<!--                  <a @click="handleEdit(record)">保存</a>-->
<!--                  <a-divider type="vertical"/>-->
<!--                  <a  @click="handleCancel(record)">取消</a>-->
<!--                </span>-->
<!--                <span v-else>-->
<!--                  <a @click="editEquipment(record)">编辑</a>-->
<!--                </span>-->
<!--                <a-divider type="vertical"/>-->
                <a @click="handleDelete(record)">删除关联</a>
              </span>
            </template>
          </template>
        </a-table>
      </a-tab-pane>

      <a-tab-pane key="3" tab="用能设备">
        <div>
          <span style="float: right">
          <a-button style="margin-right: 10px" @click="deleteIds">批量删除</a-button>
          <a-button type="primary" @click="addEquipment">添加设备</a-button>
          </span>
        </div>
        <a-table :columns="energyEquipmentColumn" :data-source="dataSource" :pagination="false">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'energyConsumptionParam'">
              <div>
                <a-select
                  mode="multiple"
                  v-model:value="record.energyConsumptionParams"
                  :disabled="!record.energyConsumptionParamIsEdit"
                  :options="record.params"
                  :field-names="{ label: 'name', value: 'id'}"
                  placeholder="请选择"
                  allow-clear
                  style="width: 100%;">
                </a-select>
              </div>
            </template>
            <template v-if="column.key === 'action'">
              <span>
                <span v-if="record.energyConsumptionParamIsEdit">
                  <a @click="handleEdit(record)">保存</a>
                  <a-divider type="vertical"/>
                  <a  @click="handleCancel(record)">取消</a>
                </span>
                <span v-else>
                  <a @click="editEnergyEquipment(record)">编辑</a>
                </span>
                <a-divider type="vertical"/>
                <a @click="handleDelete(record)">删除关联</a>
              </span>
            </template>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
  </a-card>
  <select-equipment ref="registerModal" @ok="queryEquipmentList"></select-equipment>
</template>

<script lang="ts" setup>

import {ref} from "vue";
import {
  batchDeleteGroupEquipment,
  deleteGroupEquipment, editGroupEquipment,
  groupEquipmentList
} from "@/views/energy/group/CyGroup.api";
import {loadTreeRootNoTenant} from "@/views/system/category/category.api";
import SelectEquipment from "@/views/energy/group/components/components/SelectEquipment.vue";
import {list} from "@/views/energy/energyConsumeEquipment/CyEnergyConsumeEquipment.api";

const registerModal = ref();
const dataSource = ref();
const equipmentTypes = ref([]);

// 选中行的id数组
const selectedRowKeys = ref([]);

/**
 * 表格选择因子
 * @param id
 * @param record
 */
function onSelectChange(id, record) {
  console.log('onSelectChange', id, record);
  selectedRowKeys.value = id
}

const meterColumn = [
  {
    title: '设备名称',
    dataIndex: 'relationName',
    key: 'relationName',
  },
  {
    title: '设备编码',
    dataIndex: 'relationCode',
    key: 'relationCode',
  },
  {
    title: '设备类型',
    dataIndex: 'equipmentTypeId_dictText',
    key: 'equipmentTypeId_dictText',
  },
  // {
  //   title: '能耗系数',
  //   dataIndex: 'energyConsumptionCoefficient',
  //   key: 'energyConsumptionCoefficient',
  // },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
  },
]
const energyEquipmentColumn = [
  {
    title: '设备名称',
    dataIndex: 'relationName',
    key: 'relationName',
  },
  {
    title: '设备编码',
    dataIndex: 'relationCode',
    key: 'relationCode',
  },
  {
    title: '设备类型',
    dataIndex: 'equipmentTypeName',
    key: 'equipmentTypeName',
  },
  {
    title: '用能值',
    dataIndex: 'energyConsumptionParam',
    key: 'energyConsumptionParam',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
  },
]

const queryParam = ref({
  parentId: undefined,
  parentType: undefined,
  stationId: undefined,
  equipmentTypeId: undefined,
  relationType: '1'
})

function editEquipment(record) {
  record.energyConsumptionCoefficientIsEdit = true
}

function editEnergyEquipment(record) {
  record.energyConsumptionParamIsEdit = true
}

/**
 * 编辑保存按钮
 * @param record
 */
function handleCancel(record) {
  record.energyConsumptionCoefficientIsEdit = false
  record.energyConsumptionParamIsEdit = false
  queryEquipmentList()
}

/**
 * 编辑保存按钮
 * @param record
 */
function handleEdit(record) {
  record.energyConsumptionCoefficientIsEdit = false
  record.energyConsumptionParamIsEdit = false
  editGroupEquipment(record).then((res) => {
    queryEquipmentList()
  })
}

/**
 * init
 */
function init(record) {
  queryParam.value.relationType = '1'
  queryParam.value.parentId = record.id;
  queryParam.value.parentType = record.type;
  queryParam.value.stationId = record.stationId
  getEquipmentTypes() //查询分类字典
}

/**
 * 添加设备
 */
function addEquipment() {
  registerModal.value.init(queryParam.value)
}

/**
 * 分类字典
 */
function getEquipmentTypes() {
  loadTreeRootNoTenant({pcode: "C03A01", async: false}).then((res) => {
    equipmentTypes.value = res
    queryParam.value.equipmentTypeId = res[0].key
    queryEquipmentList() //查询关联设备
  });
}

/**
 * 查询关联设备
 */
function queryEquipmentList() {
  if (queryParam.value.relationType == 3) {
    queryParam.value.equipmentTypeId = undefined
  } else if (queryParam.value.relationType == 1 && !queryParam.value.equipmentTypeId) {
    queryParam.value.equipmentTypeId = equipmentTypes.value[0].key
  }
  groupEquipmentList(queryParam.value).then((res) => {
    dataSource.value = res.records
  })
}

/**
 * 删除关联
 */
function handleDelete(record) {
  deleteGroupEquipment({id: record.id}).then((res) => {
    queryEquipmentList()
  })
}

/**
 * 批量删除选中数据
 */
function deleteIds() {
  batchDeleteGroupEquipment({ids: selectedRowKeys.value}).then((res) => {
    queryEquipmentList()
  })
}

defineExpose({
  init,
})
</script>

<style lang="less" scoped>

</style>
