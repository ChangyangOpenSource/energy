// CyOrgEmissionSource.data.ts
import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

/**
 * 列表数据
 */
export const columns: BasicColumn[] = [
    {
        title: t('carbon.message.Emission_source'),
        align: "center",
        dataIndex: 'name'
    },
    {
        title: t('carbon.message.Active_data_unit'),
        align: "center",
        dataIndex: 'dataUnitText'
    },
    {
        title: t('carbon.message.facilities_activities'),
        align: "center",
        dataIndex: 'activitieId_dictText'
    },
    {
        title: t('carbon.message.Emission_type'),
        align: "center",
        dataIndex: 'type_dictText'
    },
    {
        title: 'CO₂e' + t('carbon.message.Emission_factor_value'),
        align: "center",
        dataIndex: 'carbonData'
    },
    {
        title: t('carbon.message.Emission_factor_unit'),
        align: "center",
        dataIndex: 'carbonMolecule',
    },
];
