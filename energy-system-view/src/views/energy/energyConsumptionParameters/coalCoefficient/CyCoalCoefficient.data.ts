// @ts-ignore
import {BasicColumn} from '/src/components/Table';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '能源类型',
    align: "center",
    dataIndex: 'energyType_dictText'
  },
  {
    title: '单位',
    align: "center",
    dataIndex: 'unit'
  },
  {
    title: '折标煤系数',
    align: "center",
    dataIndex: 'coefficient',
    customRender:({text}) =>{
      //显示四位小数
      return text.toFixed(4);
    },
  },
  {
    title: '折标煤系数单位',
    align: "center",
    dataIndex: 'coefficientUnit'
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
    customRender: ({ record }) => {
      if (record.isDeadline == 0){
        return "至今";
      }
      return !record.endTime ? "" : (record.endTime.length > 10 ? record.endTime.substr(0,10) : record.endTime);
    }
  }
];

// 高级查询数据
export const superQuerySchema = {
  energyType: {title: '能源类型',order: 0,view: 'text', type: 'string',},
  unit: {title: '单位',order: 1,view: 'text', type: 'string',},
  coefficient: {title: '折标煤系数',order: 2,view: 'number', type: 'number',},
  coefficientUnit: {title: '折标煤系数单位',order: 3,view: 'text', type: 'string',},
  effectiveTime: {title: '生效时间',order: 4,view: 'datetime', type: 'string',},
  stationId: {title: '关联场站id',order: 5,view: 'text', type: 'string',},
};
