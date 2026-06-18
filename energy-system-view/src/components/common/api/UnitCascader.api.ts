// UnitCascader.api.ts
import { defHttp } from '/src/utils/http/axios';

enum Api {
    getAllUnitByGroup = '/emission/factor/cyEmissionUnit/getAllUnitByGroup',
}

/**
 * 获取所有单位分组
 * @returns
 */
export const getUnitGroups = () =>
    defHttp.get({ url: Api.getAllUnitByGroup },{isTransformResponse: false});
