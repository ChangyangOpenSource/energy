// src/api/emissionSource.api.ts
import { defHttp } from '/src/utils/http/axios';

enum Api {
    list = '/orgCarbonEmissionSource/list'
}

/**
 * 获取排放源列表
 * @param params 查询参数
 * @returns 排放源列表数据
 */
export const getEmissionSourceList = (params: any) =>
    defHttp.get({ url: Api.list, params }, { isTransformResponse: false });
