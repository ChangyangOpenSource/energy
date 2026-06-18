import {BasicColumn} from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '状态',
    align: "center",
    dataIndex: 'status_enumText'
  },
  {
    title: '传感器名称',
    align: "center",
    dataIndex: 'name'
  },
  {
    title: '设备编码',
    align: "center",
    dataIndex: 'equipmentCode'
  },
  {
    title: '设备类型',
    align: "center",
    dataIndex: 'equipmentTypeId_dictText'
  },
];
