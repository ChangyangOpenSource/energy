// src/views/neutrality/carbonReduceManagement/CyCarbonReduceManagement.data.ts
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

// 列表数据
export const columns: BasicColumn[] = [
    {
        title: t('carbon.message.ProjectName'),
        align: "center",
        dataIndex: 'projectName'
    },
    {
        title: t('carbon.message.AffiliatedOrganization'),
        align: "center",
        dataIndex: 'projectDeptId_dictText'
    },
    {
        title: t('carbon.message.ProjectReductionType'),
        align: "center",
        dataIndex: 'carbonReduceTypeId_dictText'
    },
    {
        title: t('carbon.message.ExpectedCarbonReduction') + '(tCO₂e)',
        align: "center",
        dataIndex: 'carbonEmission'
    },
    {
        title: t('carbon.message.ProjectCycle'),
        align: "center",
        dataIndex: 'startAndEndYear',
        customRender: function ({record }) {
            return record.startYear + '-' + record.endYear;
        }
    },
    {
        title: t('carbon.message.Leader'),
        align: "center",
        dataIndex: 'projectUserId_dictText'
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
        field: 'projectName',
        label: t('carbon.message.TargetName'),
        component: 'Input',
        colProps: { span: 6 },
    },
    {
        field: 'carbonReduceTypeId',
        label: t('carbon.message.EmissionReductionType'),
        component: 'JDictSelectTag',
        componentProps: {
            dictCode: "project_carbon_reduce_type"
        },
        colProps: { span: 6 },
    }
];

// 高级查询数据
export const superQuerySchema = {
    projectName: { title: t('carbon.message.ProjectName'), order: 0, view: 'text', type: 'string', },
    carbonReduceTypeId: { title: t('carbon.message.EmissionReductionType'), order: 1, view: 'select', type: 'string', dictCode: 'project_carbon_reduce_type' },
};
