// src/views/carbon/report/CarbonReport.data.ts
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import {loadCategoryTreeRoot, queryDepartTreeSync} from "@/views/carbon/report/CarbonReport.api";
import {loadStandardTree} from "@/views/carbon/organize/OrganizeInventory.api";

// 列表数据
export const columns: BasicColumn[] = [
    {
        title: '报告编号',
        align: "center",
        dataIndex: "reportCode",
    },
    {
        align: "center",
        title: '核算实体',
        dataIndex: "targetName",
    },
    {
        align: "center",
        title: '核算标准',
        dataIndex: "standardName",
    },
    {
        align: "center",
        title: '核算日期',
        dataIndex: "year",
    },
    {
        title: '更新日期',
        align: "center",
        dataIndex: "updateTime",
    }
];

// 查询表单配置
export const searchFormSchema: FormSchema[] = [
    {
        field: 'targetName',
        label: '核算实体',
        component: 'ApiTreeSelect',
        componentProps: {
            api: queryDepartTreeSync,
            params: { primaryKey: "key" },
            labelField: 'title',
            valueField: 'key',
            resultField: 'result'
        }
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
    {
        field: 'year',
        label: '核算日期',
        component: 'DatePicker',
        componentProps: {
            picker: 'year',
            valueFormat: 'YYYY',
            placeholder: '请选择年份'
        },
    },
];
