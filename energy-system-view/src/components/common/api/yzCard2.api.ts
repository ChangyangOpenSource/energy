// yzCard2.api.ts
import { defHttp } from '/src/utils/http/axios';

enum Api {
    // 供应商碳数据相关接口（根据实际情况补充具体的接口地址）
    getSupplierCarbonDataDetail = '/supplier/carbon/data/detail', // 示例接口，需根据实际项目调整
}

/**
 * 获取供应商碳数据详情
 * @param params
 * @returns
 */
export const getSupplierCarbonDataDetail = (params) =>
    defHttp.get({ url: Api.getSupplierCarbonDataDetail, params });
