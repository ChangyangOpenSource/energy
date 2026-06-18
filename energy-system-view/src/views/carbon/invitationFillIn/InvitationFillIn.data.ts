// src/views/carbon/invitationFillIn/InvitationFillIn.data.ts
import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import {getStandard, queryDepartTreeSync} from "@/views/carbon/invitationFillIn/invitationFillIn.api";
import {loadCategoryTreeRoot} from "@/views/carbon/report/CarbonReport.api";

const { t } = useI18n();

// 列表数据
export const columns: BasicColumn[] = [
    {
        title: t('carbon.message.Accounting_entity'),
        align: "center",
        dataIndex: 'targetName',
    },
    {
        title: t('carbon.message.Accounting_standard'),
        align: "center",
        dataIndex: 'categoryId_dictText'
    },
    {
        title: t('carbon.message.Scope_classification'),
        align: "center",
        dataIndex: 'standardId_dictText'
    },
    {
        title: t('carbon.message.Emission_source'),
        align: "center",
        dataIndex: 'emissionSourceName'
    },
    {
        title: t('carbon.message.Active_data'),
        align: "center",
        dataIndex: 'data',
    },
    {
        title: t('carbon.message.Datavoucher'),
        align: "center",
        dataIndex: 'dataVoucher',
    },
    {
        title: t('carbon.message.Emission_factor_values'),
        align: "center",
        dataIndex: 'carbonData',
    },
    {
        title: t('carbon.message.activity/facilities'),
        align: "center",
        dataIndex: 'activitieId_dictText'
    },
    {
        title: t('carbon.message.Inviter'),
        align: "center",
        dataIndex: 'inviter_dictText'
    },
    {
        title: t('carbon.message.Emissions'),
        align: "center",
        dataIndex: 'emissionAmount',
    },
    {
        title: t('carbon.message.Invitation_time'),
        align: "center",
        dataIndex: 'inviteTime'
    },
    {
        title: t('carbon.message.Update_date'),
        align: "center",
        dataIndex: 'updateTime'
    }
];

// 查询表单配置
export const searchFormSchema = [
    {
        field: 'year',
        label: t('carbon.message.Accounting_year'),
        component: 'DatePicker',
        componentProps: {
            picker: 'year',
            valueFormat: 'YYYY',
            placeholder: t('carbon.message.Please_enter')
        },
    },
    {
        field: 'targetId',
        label: t('carbon.message.Accounting_entity'),
        component: 'ApiSelect',
        componentProps: {
            api: queryDepartTreeSync,
            params: { pcode: "A01", async: true },
            labelField: 'title',
            valueField: 'key',
            resultField: 'result'
        }
    },
    {
        field: 'categoryId',
        label: t('carbon.message.Accounting_standard'),
        component: 'ApiSelect',
        componentProps: {
            api: getStandard,
            params: { pcode: "A01", async: true },
            labelField: 'title',
            valueField: 'key',
            resultField: 'result'
        }
    },
];
