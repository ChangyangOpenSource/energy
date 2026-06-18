import {BasicColumn} from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '设备名称',
    align: "center",
    dataIndex: 'energyConsumeEquipmentName'
  },
  {
    title: '设备编码',
    align: "center",
    dataIndex: 'energyConsumeEquipmentCode'
  },
  {
    title: '设备分类',
    align: "center",
    dataIndex: 'energyConsumeCategory_dictText'
  },
  {
    title: '设备类型',
    align: "center",
    dataIndex: 'energyConsumeEquipmentTypeId_dictText'
  },
  {
    title: '品牌型号',
    align: "center",
    dataIndex: 'modelId_dictText'
  },
  {
    title: '状态',
    align: "center",
    dataIndex: 'status_enumText',
  },
];

// 高级查询数据
export const superQuerySchema = {
  energyConsumeEquipmentName: {title: '设备名称',order: 0,view: 'text', type: 'string',},
  energyConsumeEquipmentCode: {title: '设备编码',order: 1,view: 'text', type: 'string',},
  energyConsumeCategory: {title: '设备分类',order: 2,view: 'list', type: 'string',dictCode: '',},
  energyConsumeEquipmentTypeId: {title: '设备类型',order: 3,view: 'list', type: 'string',dictCode: '',},
  modelId: {title: '品牌型号',order: 4,view: 'list', type: 'string',dictCode: '',},
  status: {title: '状态(0正常 1离线 2异常)',order: 8,view: 'text', type: 'string',},
};
