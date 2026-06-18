import {BasicColumn} from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '数据点名称',
    align: "center",
    dataIndex: 'dataName'
  },
  {
    title: '设备类型id',
    align: "center",
    dataIndex: 'equipmentTypeId'
  },
  {
    title: '数据点类型',
    align: "center",
    dataIndex: 'dataType'
  },
  {
    title: '单位',
    align: "center",
    dataIndex: 'unit'
  },
  {
    title: '计算公式',
    align: "center",
    dataIndex: 'formula'
  },
  {
    title: '协议id',
    align: "center",
    dataIndex: 'protocolId'
  },
];


