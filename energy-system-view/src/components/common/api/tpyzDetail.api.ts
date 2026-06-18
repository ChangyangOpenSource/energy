// tpyzDetail.api.ts
import { defHttp } from '/src/utils/http/axios';

enum Api {
    // 排放因子相关接口
    getEmissionFactorInfo = '/emission/factor/cyEmissionFactor/listInfo',
    getTopSearchFactor = '/emission/factor/cyEmissionFactor/topSearchFactor',

    // 收藏相关接口
    addFactorCollect = '/CyEmissionFactorCollect/cyEmissionFactorCollect/add',
    deleteFactorCollect = '/CyEmissionFactorCollect/cyEmissionFactorCollect/delete',

    // 收藏因子查询接口
    getCollectFactorInfo = '/CyEmissionFactorCollect/cyEmissionFactorCollect/queryById',
}

/**
 * 获取排放因子信息
 * @param params
 * @returns
 */
export const getEmissionFactorInfo = (params) =>
    defHttp.get({ url: Api.getEmissionFactorInfo, params },{isTransformResponse: false});

/**
 * 获取热门搜索因子
 * @param params
 * @returns
 */
export const getTopSearchFactor = (params) =>
    defHttp.get({ url: Api.getTopSearchFactor, params },{isTransformResponse: false});

/**
 * 添加因子收藏
 * @param params
 * @returns
 */
export const addFactorCollect = (params) =>
    defHttp.get({ url: Api.addFactorCollect, params },{isTransformResponse: false});

/**
 * 删除因子收藏
 * @param params
 * @returns
 */
export const deleteFactorCollect = (params) =>
    defHttp.delete({ url: Api.deleteFactorCollect, params },{isTransformResponse: false,joinParamsToUrl: true});

/**
 * 获取收藏因子信息
 * @param params
 * @returns
 */
export const getCollectFactorInfo = (params) =>
    defHttp.get({ url: Api.getCollectFactorInfo, params },{isTransformResponse: false});
