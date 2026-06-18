import {BasicColumn} from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '设备类型',
    align: "center",
    dataIndex: 'name'
  },
  {
    title: '设备分类',
    align: "center",
    dataIndex: 'energyConsumeCategory_dictText'
  },
  {
    title: '参数',
    align: "center",
    dataIndex: 'params',
    customRender: ({ record }) => {
      let params = '';
      record.energyConsumeEquipmentTypeParams.forEach(param => {
        params = params + param.name + ","
      })
      return params.substring(0, params.length - 1);
    },
  },
];

// 高级查询数据
export const superQuerySchema = {
  name: {title: '类型名称',order: 0,view: 'text', type: 'string',},
  energyConsumeCategory: {title: '设备分类',order: 1,view: 'list', type: 'string',dictCode: '',},
};
