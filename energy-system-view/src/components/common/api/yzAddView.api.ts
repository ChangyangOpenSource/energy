// yzAddView.api.ts
import { defHttp } from '/src/utils/http/axios';

enum Api {
    // 因子单位相关接口
    getFactorUnits = '/CyFactorUnit/cyFactorUnit/list',
    getAllEmissionUnits = '/emission/factor/cyEmissionUnit/getAllUnit',

    // 气体相关接口
    getGasListByName = '/gas/cyGasStore/listGasName',

    // 碳排放因子相关接口
    addEmissionFactorCheck = '/footprintProduct/cyFootprintProduct/addEmissionByCarbonCheck',
}

/**
 * 获取因子单位列表
 * @returns
 */
export const getFactorUnits = () =>
    defHttp.get({ url: Api.getFactorUnits },{isTransformResponse: false});

/**
 * 获取所有排放单位
 * @returns
 */
export const getAllEmissionUnits = () =>
    defHttp.get({ url: Api.getAllEmissionUnits },{isTransformResponse: false});

/**
 * 根据因子真实单位获取气体列表
 * @param params
 * @returns
 */
export const getGasListByName = (params) =>
    defHttp.get({ url: Api.getGasListByName, params },{isTransformResponse: false});

/**
 * 添加碳排放因子检查
 * @param params
 * @returns
 */
export const addEmissionFactorCheck = (params) =>
    defHttp.post({ url: Api.addEmissionFactorCheck, params },{isTransformResponse: false});
