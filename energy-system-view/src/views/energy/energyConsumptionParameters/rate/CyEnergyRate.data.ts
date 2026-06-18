import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '名称',
    align: "center",
    dataIndex: 'rateName'
  },
  {
    title: '能源类型',
    align: "center",
    dataIndex: 'energyType_dictText'
  },
  {
    title: '费率类型',
    align: "center",
    dataIndex: 'rateType_dictText'
  },
  {
    title: '单位',
    align: "center",
    dataIndex: 'unit'
  },
  {
    title: '开始时间',
    align: "center",
    dataIndex: 'startTime',
    customRender:({text}) =>{
      text = !text ? "" : (text.length > 10 ? text.substr(0,10) : text);
      return text;
    },
  },
  {
    title: '结束时间',
    align: "center",
    dataIndex: 'endTime',
    customRender:({text}) =>{
      text = !text ? "" : (text.length > 10 ? text.substr(0,10) : text);
      return text;
    },
  },
];

export const timeOfUseRateColumns: BasicColumn[] = [
  {
    title: '分时开始时间',
    align: "center",
    dataIndex: 'startTime',
    customRender:({text}) =>{
      if (text>10){
        text = text + ":00:00";
      }else {
        text = "0"+text + ":00:00";
      }
      return text;
    },
  },
    {
    title: '分时结束时间',
    align: "center",
    dataIndex: 'endTime',
      customRender:({text}) =>{
        if (text>10){
          text = text + ":00:00";
        }else {
          text = "0"+text + ":00:00";
        }
        return text;
      },
  },
    {
    title: '峰谷平时段',
    align: "center",
    dataIndex: 'timeSlotText'
  },
    {
    title: '价格(元)',
    align: "center",
    dataIndex: 'unitPrice'
  },
  {
    width: 160,
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
  }
]

export const tieredRateColumns: BasicColumn[] = [
  {
    title: '起使用量',
    align: "center",
    dataIndex: 'startUse'
  },
  {
    title: '结束用量',
    align: "center",
    dataIndex: 'endUse'
  },
  {
    title: '用量单位',
    align: "center",
    dataIndex: 'unit'
  },
  {
    title: '单位价格',
    align: "center",
    dataIndex: 'unitPrice'
  },
  {
    width: 160,
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
  }
]


// 高级查询数据
export const superQuerySchema = {
  rateName: {title: '能源费率名称',order: 0,view: 'text', type: 'string',},
  energyType: {title: '能源类型',order: 1,view: 'text', type: 'string',},
  rateType: {title: '费率类型（1分时费率2阶梯费率3固定费率）',order: 2,view: 'text', type: 'string',},
  unit: {title: '单位类型',order: 3,view: 'text', type: 'string',},
  startTime: {title: '开始时间',order: 4,view: 'date', type: 'string',},
  endTime: {title: '结束时间',order: 5,view: 'text', type: 'string',},
};
