import {BasicColumn} from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '状态',
    align: "center",
    dataIndex: 'status_enumText',
  },
  {
    title: '计量表名称',
    align: "center",
    dataIndex: 'name'
  },
  {
    title: '设备编码',
    align: "center",
    dataIndex: 'equipmentCode'
  },
  {
    title: '计量表类型',
    align: "center",
    dataIndex: 'meterType_dictText'
  },
  {
    title: '能源类型',
    align: "center",
    dataIndex: 'energyType_dictText'
  },
  {
    title: '上级设备',
    align: "center",
    dataIndex: 'parentId_dictText'
  },
];
