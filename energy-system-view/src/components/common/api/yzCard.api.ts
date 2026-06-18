// yzCard.api.ts
import { defHttp } from '/src/utils/http/axios';

enum Api {
    // 收藏相关接口
    addFactorCollect = '/CyEmissionFactorCollect/cyEmissionFactorCollect/add',
    deleteFactorCollect = '/CyEmissionFactorCollect/cyEmissionFactorCollect/delete',
}

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
