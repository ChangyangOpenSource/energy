import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '年份',
    align: "center",
    dataIndex: 'fillInYear'
  },
  {
    title: '数据项',
    align: "center",
    dataIndex: 'dataItemName'
  },
  {
    title: '单位',
    align: "center",
    dataIndex: 'unitName'
  },
  {
    title: '数据填报方式',
    align: "center",
    dataIndex: 'dataFillInType'
  },
  {
    title: '数据采集方式',
    align: "center",
    dataIndex: 'dataGetType'
  },
  {
    title: '年度值',
    align: "center",
    dataIndex: 'annualValue'
  },
  {
    title: '一月值',
    align: "center",
    dataIndex: 'januaryValue'
  },
  {
    title: '二月值',
    align: "center",
    dataIndex: 'februaryValue'
  },
  {
    title: '三月值',
    align: "center",
    dataIndex: 'marchValue'
  },

  {
    title: '四月值',
    align: "center",
    dataIndex: 'aprilValue'
  },
  {
    title: '五月值',
    align: "center",
    dataIndex: 'mayValue'
  },
  {
    title: '六月值',
    align: "center",
    dataIndex: 'juneValue'
  },
  {
    title: '七月值',
    align: "center",
    dataIndex: 'julyValue'
  },
  {
    title: '八月值',
    align: "center",
    dataIndex: 'augustValue'
  },
  {
    title: '九月值',
    align: "center",
    dataIndex: 'septemberValue'
  },
  {
    title: '十月值',
    align: "center",
    dataIndex: 'octoberValue'
  },
  {
    title: '十一月值',
    align: "center",
    dataIndex: 'novemberValue'
  },
  {
    title: '十二月值',
    align: "center",
    dataIndex: 'decemberValue'
  },
  {
    title: '附件',
    align: "center",
    dataIndex: 'attechment'
  }
];

// 高级查询数据
export const superQuerySchema = {
  orgCode: {title: '组织code',order: 0,view: 'text', type: 'string',},
  departId: {title: '部门id',order: 1,view: 'text', type: 'string',},
  fillInYear: {title: '填报年份',order: 2,view: 'text', type: 'string',},
  dataItemName: {title: '数据项名称',order: 3,view: 'text', type: 'string',},
  unitId: {title: '单位id',order: 4,view: 'text', type: 'string',},
  unitName: {title: '单位名称',order: 5,view: 'text', type: 'string',},
  dataFillInType: {title: '数据填报方式（1：按月，2按年）',order: 6,view: 'text', type: 'string',},
  dataGetType: {title: '数据采集方式（1：手动填写，2：api接入，3：能耗系统获取）',order: 7,view: 'text', type: 'string',},
};
