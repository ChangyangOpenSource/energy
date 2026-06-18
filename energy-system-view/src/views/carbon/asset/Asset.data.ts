// src/views/carbon/asset/Asset.data.ts
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

// 列表数据
export const columns: BasicColumn[] = [
    {
        title: t('carbon.message.organization'),
        align: 'center',
        dataIndex: 'deptId_dictText'
    },
    {
        title: t('carbon.message.year'),
        align: 'center',
        dataIndex: 'year'
    },
    {
        title: t('carbon.message.turnover'),
        align: 'center',
        dataIndex: 'revenue'
    },
    {
        title: t('carbon.message.revenue_carbon_intensity'),
        align: 'center',
        dataIndex: 'revenueCarbonIntensity'
    },
    {
        title: t('carbon.message.output'),
        align: 'center',
        dataIndex: 'revenue'
    },
    {
        title: t('carbon.message.output_carbon_intensity'),
        align: 'center',
        dataIndex: 'outputCarbonIntensity'
    },
    {
        title: t('carbon.message.employee_count'),
        align: 'center',
        dataIndex: 'employeeCount'
    },
    {
        title: t('carbon.message.employee_carbon_intensity'),
        align: 'center',
        dataIndex: 'employeeCarbonIntensity'
    },
    {
        title: t('carbon.message.companyArea'),
        align: 'center',
        dataIndex: 'floorArea'
    },
    {
        title: t('carbon.message.area_carbon_intensity'),
        align: 'center',
        dataIndex: 'areaCarbonIntensity'
    },
    {
        title: t('carbon.message.Update_person'),
        align: 'center',
        dataIndex: 'username'
    },
    {
        title: t('carbon.message.UpdateTime'),
        align: 'center',
        dataIndex: 'updateTime'
    }
];

// 查询表单配置
export const searchFormSchema: FormSchema[] = [
    {
        field: 'year',
        label: t('carbon.message.year'),
        component: 'DatePicker',
        componentProps: {
            picker: 'year',
            valueFormat: 'YYYY',
            placeholder: t('carbon.message.SelectYear')
        },
    },
];
