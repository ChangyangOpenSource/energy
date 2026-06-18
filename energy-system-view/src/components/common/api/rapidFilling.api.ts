// src/api/rapidFilling.api.ts
import { defHttp } from '/@/utils/http/axios';

enum Api {
    getDetailAll = '/orgCheckCheckDetail/getDetailAll',
    updateBatchDetailData = '/orgCheckCheckDetail/updateBatchDetailData'
}

/**
 * 获取检查详情所有数据
 * @param params 检查ID参数
 * @returns 检查详情数据
 */
export const getDetailAll = (params: { checkId: string }) =>
    defHttp.get({ url: Api.getDetailAll, params }, { isTransformResponse: false });

/**
 * 批量更新检查详情数据
 * @param params 检查ID和排放源列表
 * @returns 更新结果
 */
export const updateBatchDetailData = (params: { checkId: string; emissionSourceList: any[] }) =>
    defHttp.post({ url: Api.updateBatchDetailData, params }, { isTransformResponse: false });
