import {BasicColumn} from '/src/components/Table';
import {FormSchema} from '/src/components/Table';
import { rules} from '/src/utils/helper/validator';
import { render } from '/src/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/src/utils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '品牌名称',
    align: "center",
    dataIndex: 'brandName'
  },
];

// 高级查询数据
export const superQuerySchema = {
  brandName: {title: '品牌名称',order: 0,view: 'text', type: 'string',},
};
