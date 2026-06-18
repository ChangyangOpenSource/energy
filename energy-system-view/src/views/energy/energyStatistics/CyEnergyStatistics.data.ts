import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '日期',
    align: "center",
    dataIndex: 'dataTime'
  },
  {
    title: '用能项',
    align: "center",
    dataIndex: 'equipmentCode'
  },
  {
    title: '数据值',
    align: "center",
    dataIndex: 'dataValue'
  }
];

// 高级查询数据
export const superQuerySchema = {
  equipmentId: {title: '设备id',order: 0,view: 'text', type: 'string',},
  equipmentCode: {title: '设备code',order: 1,view: 'text', type: 'string',},
  dataTime: {title: '时间',order: 2,view: 'text', type: 'string',},
  dataValue: {title: '设备数据点值 json',order: 3,view: 'text', type: 'string',},
  type: {title: '1计量表 3传感器',order: 4,view: 'text', type: 'string',},
  parentId: {title: '父级id',order: 5,view: 'text', type: 'string',},
};
