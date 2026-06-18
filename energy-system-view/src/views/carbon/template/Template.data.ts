// src/views/carbon/template/Template.data.ts
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import {loadCategoryTreeRoot} from "@/views/carbon/report/CarbonReport.api";

// 列表数据
export const columns: BasicColumn[] = [
    {
        title: '模板名称',
        align: "center",
        dataIndex: "name",
    },
    {
        title: '核算标准',
        dataIndex: "standardId_dictText",
        align: "center",
    },
    {
        align: "center",
        title: '行业',
        dataIndex: "profession_dictText",
    },
    {
        align: "center",
        title: '创建人',
        dataIndex: "createBy_dictText",
    },
    {
        align: "center",
        title: '更新日期',
        dataIndex: "createTime",
    }
];

// 查询表单配置
export const searchFormSchema: FormSchema[] = [
    {
        field: 'name',
        label: '模板名称',
        component: 'Input',
        componentProps: {
            placeholder: '请输入模板名称',
        },
    },
    {
        field: 'standardId',
        label: '核算标准',
        component: 'ApiSelect',
        componentProps: {
            api: loadCategoryTreeRoot,
            params: { pcode: "A01", async: true },
            labelField: 'title',
            valueField: 'key',
            resultField: 'result'
        }
    },
];
