import {BasicColumn} from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '设备类型',
    align: "center",
    dataIndex: 'energyConsumeEquipmentTypeId'
  },
  {
    title: '参数名称',
    align: "center",
    dataIndex: 'name'
  },
  {
    title: '参数类型',
    align: "center",
    dataIndex: 'paramType_dictText'
  },
  {
    title: '参数单位',
    align: "center",
    dataIndex: 'unit'
  },
];

// 高级查询数据
export const superQuerySchema = {
  energyConsumeEquipmentTypeId: {title: '设备类型',order: 0,view: 'text', type: 'string',},
  name: {title: '参数名称',order: 1,view: 'text', type: 'string',},
  paramType: {title: '参数类型',order: 2,view: 'list', type: 'string',dictCode: '',},
  unit: {title: '参数单位',order: 3,view: 'text', type: 'string',},
};
