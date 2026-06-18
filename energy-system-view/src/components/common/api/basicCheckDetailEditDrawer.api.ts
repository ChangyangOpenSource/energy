// src/api/basicCheckDetail.api.ts
import { defHttp } from '/src/utils/http/axios';

enum Api {
    getAllUnitByGroup = '/emission/factor/cyEmissionUnit/getAllUnitByGroup',
    getAllActivities = '/orgActivitie/getAll',
    getConvertValue = '/emission/factor/cyEmissionFactor/api/getConvertValue',
    saveOrUpdate = '/orgCheckCheckDetail/saveOrUpdate',
    listInfo = '/emission/factor/cyEmissionFactor/listInfo',
    addEmissionByCarbonCheck = '/emission/factor/cyEmissionFactor/addEmissionByCarbonCheck',
    getSupplierCarbonDataById = '/footprintProduct/cyFootprintProduct/getSupplierCarbonDataById'
}

/**
 * 获取所有单位分组数据
 * @returns 单位分组数据
 */
export const getAllUnitByGroup = () =>
    defHttp.get({ url: Api.getAllUnitByGroup },{ isTransformResponse: false});

/**
 * 获取所有活动设施
 * @returns 活动设施列表
 */
export const getAllActivities = () =>
    defHttp.get({ url: Api.getAllActivities },{ isTransformResponse: false});

/**
 * 获取单位转换值
 * @param params 转换参数
 * @returns 转换比例
 */
export const getConvertValue = (params: { sourceUnit: string; targetUnit: string }) =>
    defHttp.get({ url: Api.getConvertValue, params },{ isTransformResponse: false});

/**
 * 保存或更新检查详情
 * @param params 表单数据
 * @returns 操作结果
 */
export const saveOrUpdate = (params: any) =>
    defHttp.post({ url: Api.saveOrUpdate, params },{ isTransformResponse: false});

/**
 * 获取因子数据详情
 * @param params 因子ID
 * @returns 因子详情
 */
export const getFactorInfo = (params: { id: string }) =>
    defHttp.get({ url: Api.listInfo, params },{ isTransformResponse: false});

/**
 * 添加碳排放因子
 * @param params 因子参数
 * @returns 操作结果
 */
export const addEmissionFactor = (params: any) =>
    defHttp.post({ url: Api.addEmissionByCarbonCheck, params },{ isTransformResponse: false});

/**
 * 根据ID获取供应商碳数据
 * @param params 供应商碳数据ID
 * @returns 供应商碳数据详情
 */
export const getSupplierCarbonDataById = (params: { supplierCarbonDataId: string }) =>
    defHttp.get({ url: Api.getSupplierCarbonDataById, params },{ isTransformResponse: false});
