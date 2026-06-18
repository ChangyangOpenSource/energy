// yzChooseView.api.ts
import { defHttp } from '/src/utils/http/axios';

enum Api {
    // 碳排放因子相关接口
    getPrivateFactorList = '/emission/factor/cyEmissionFactor/api/privateList',

    // 收藏相关接口
    addFactorCollect = '/CyEmissionFactorCollect/cyEmissionFactorCollect/add',
    deleteFactorCollect = '/CyEmissionFactorCollect/cyEmissionFactorCollect/delete',

    // 系统数据接口
    getChildList = '/sys/category/childList',
    getDictItems = '/sys/api/getDictItems',
}

/**
 * 获取私有因子列表
 * @param params
 * @returns
 */
export const getPrivateFactorList = (params) =>
    defHttp.get({ url: Api.getPrivateFactorList, params },{isTransformResponse: false});

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
    defHttp.delete({ url: Api.deleteFactorCollect, params },{isTransformResponse: false});

/**
 * 获取子列表
 * @param params
 * @returns
 */
export const getChildList = (params) =>
    defHttp.get({ url: Api.getChildList, params },{isTransformResponse: false});

/**
 * 获取字典项
 * @param params
 * @returns
 */
export const getDictItems = (params) =>
    defHttp.get({ url: Api.getDictItems, params },{isTransformResponse: false});
