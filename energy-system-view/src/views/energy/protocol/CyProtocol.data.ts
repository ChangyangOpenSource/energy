import {BasicColumn} from '/@/components/Table';

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '通讯协议',
    align: "center",
    dataIndex: 'protocolName'
  },
  {
    title: '品牌',
    align: "center",
    dataIndex: 'brandName'
  },
  {
    title: '型号',
    align: "center",
    dataIndex: 'modelName'
  },
  {
    title: '设备类型',
    align: "center",
    dataIndex: 'equipmentTypeId_dictText'
  },
];
