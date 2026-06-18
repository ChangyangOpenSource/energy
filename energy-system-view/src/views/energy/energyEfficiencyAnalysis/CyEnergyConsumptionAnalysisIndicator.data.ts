import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '指标名称',
    align: "center",
    dataIndex: 'indicatorName',
    key: 'name'
  },
  {
    title: '单位',
    align: "center",
    dataIndex: 'unit'
  },
  {
    title: '说明',
    align: "left",
    dataIndex: 'instruction',
    width: 300
  },
  {
    title: '操作',
    align: "center",
    dataIndex: 'operate'
  }
];

// 高级查询数据
export const superQuerySchema = {
  indicatorName: {title: '指标名称',order: 0,view: 'text', type: 'string',},
  instruction: {title: '说明',order: 1,view: 'text', type: 'string',},
  energyConsumeDataId: {title: '能耗数据id',order: 2,view: 'text', type: 'string',},
  energyConsumeDataName: {title: '能耗数据名称',order: 3,view: 'text', type: 'string',},
  energyConsumeDataUnitId: {title: '能耗数据单位id',order: 4,view: 'text', type: 'string',},
  energyConsumeDataUnitName: {title: '能耗数据单位名称',order: 5,view: 'text', type: 'string',},
  operationalDataId: {title: '运营数据id',order: 6,view: 'text', type: 'string',},
  operationalDataName: {title: '运营数据名称',order: 7,view: 'text', type: 'string',},
  operationalDataUnitId: {title: '运营数据单位id',order: 8,view: 'text', type: 'string',},
  operationalDataUnitName: {title: '运营数据单位名称',order: 9,view: 'text', type: 'string',},
};
