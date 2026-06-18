// OrganizeInventory.data.ts
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import {loadStandardTree} from "@/views/carbon/organize/OrganizeInventory.api";

const { t } = useI18n();

// 列表数据
export const columns: BasicColumn[] = [
    {
        title: t('carbon.message.Accounting_entity'),
        align: "center",
        dataIndex: 'targetName'
    },
    {
        title: t('carbon.message.Accounting_standard'),
        align: "center",
        dataIndex: 'standardName'
    },
    {
        title: t('carbon.message.Accounting_date'),
        align: "center",
        dataIndex: 'year'
    },
    {
        title: t('carbon.message.State'),
        align: "center",
        dataIndex: 'status',
        slots: { customRender: 'status' },
    },
    {
        title: `${t('carbon.message.Total_carbon_emissions')}（tCO₂e）`,
        align: "center",
        dataIndex: 'totalCarbon'
    },
    {
        title: `${t('carbon.message.energy_consumption_and_emission')}（tCO₂e）`,
        align: "center",
        dataIndex: 'costCarbon'
    },
    {
        title: `${t('carbon.message.Green_emission_reduction')}（tCO₂e）`,
        align: "center",
        dataIndex: 'greenCarbon'
    },
    {
        title: t('carbon.message.Accountant'),
        align: "center",
        dataIndex: 'checkPeople_dictText'
    },
    {
        title: t('carbon.message.Update_date'),
        align: "center",
        dataIndex: 'updateTime'
    },
];

// 查询条件表单配置
export const searchFormSchema: FormSchema[] = [
    {
        label: t('carbon.message.Accounting_standard'),
        field: 'standardId',
        component: 'ApiSelect',
        colProps: { span: 6 },
        componentProps: {
            api: loadStandardTree,
            params: { pcode: "A01", async: true },
            labelField: 'title',
            valueField: 'key',
            resultField: 'result'
        },
    },
    {
        label: t('carbon.message.Accounting_date'),
        field: 'year',
        component: 'DatePicker',
        componentProps: {
            picker: 'year',
            valueFormat: 'YYYY',
        },
        colProps: { span: 6 },
    },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
    {
        label: t('carbon.message.Accounting_entity'),
        field: 'targetId',
        component: 'Select',
        required: true,
        colProps: { span: 24 },
    },
    {
        label: t('carbon.message.Accounting_standard'),
        field: 'standardId',
        component: 'Select',
        required: true,
        colProps: { span: 24 },
    },
    {
        label: t('carbon.message.Template_name'),
        field: 'templateId',
        component: 'Select',
        colProps: { span: 24 },
    },
    {
        label: t('carbon.message.Accounting_date'),
        field: 'year',
        component: 'DatePicker',
        componentProps: {
            format: 'YYYY',
            valueFormat: 'YYYY',
            mode: 'year',
        },
        required: true,
        colProps: { span: 24 },
    },
];
