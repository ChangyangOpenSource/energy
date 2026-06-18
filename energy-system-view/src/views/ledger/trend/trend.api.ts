// src/views/ledger/trend/trend.api.ts
import { defHttp } from '/@/utils/http/axios';

enum Api {
    scan = '/carbonMarkrt/scan',
    getDictItems = '/sys/api/getDictItems',
}

/**
 * 扫描碳市场数据
 * @param params 查询参数
 */
export const scanCarbonMarket = (params) => defHttp.get({ url: Api.scan, params }, { isTransformResponse: false});

/**
 * 获取字典项
 * @param params 查询参数 { dictCode: string }
 */
export const getDictItems = (params) => defHttp.get({ url: Api.getDictItems, params }, { isTransformResponse: false});
