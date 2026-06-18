// src/views/neutrality/carbonEmissionPlan/CyCarbonEmissionPlan.data.ts
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

// 列表数据
export const columns: BasicColumn[] = [
    {
        title: t('carbon.message.Target_name'),
        align: "center",
        dataIndex: 'planName'
    },
    {
        title: t('carbon.message.Related_organizations'),
        align: "center",
        dataIndex: 'planDeptId_dictText'
    },
    {
        title: t('carbon.message.Base_year'),
        align: "center",
        dataIndex: 'baseYear'
    },
    {
        title: t('carbon.message.Carbon_neutral_year'),
        align: "center",
        dataIndex: 'carbonNeutralYear'
    },
    {
        title: t('carbon.message.Founder'),
        align: "center",
        dataIndex: 'createBy_dictText'
    },
    {
        title: t('carbon.message.Create_date'),
        align: "center",
        dataIndex: 'createTime'
    },
];

// 搜索表单配置
export const searchFormSchema: FormSchema[] = [
    {
        field: 'planName',
        label: t('carbon.message.Target_name'),
        component: 'Input',
        colProps: { span: 6 },
    }
];
