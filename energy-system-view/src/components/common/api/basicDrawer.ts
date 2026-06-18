// emissionSource.api.ts
import { defHttp } from '/src/utils/http/axios';

enum Api {
    // 排放源相关接口
    getDetail = '/orgCarbonEmissionSource/getDetail',
    add = '/orgCarbonEmissionSource/add',
    edit = '/orgCarbonEmissionSource/edit',

    // 标准转换相关接口
    queryByMainStandardId = '/carbonOrg/cyOrgCarbonStandardConversionDetail/queryByMainStandardId',

    // 单位相关接口
    getAllUnitByGroup = '/emission/factor/cyEmissionUnit/getAllUnitByGroup',
    getConvertValue = '/emission/factor/cyEmissionFactor/api/getConvertValue',

    // 因子相关接口
    listInfo = '/emission/factor/cyEmissionFactor/listInfo',
    addEmissionByCarbonCheck = '/emission/factor/cyEmissionFactor/addEmissionByCarbonCheck',

    // 分类相关接口
    loadTreeRoot = '/sys/category/loadTreeRoot',

    // 活动设施相关接口
    getAllActivities = '/orgActivitie/getAll',
}

/**
 * 获取排放源详情
 * @param params
 * @returns
 */
export const getEmissionSourceDetail = (params) =>
    defHttp.get({ url: Api.getDetail, params },{ isTransformResponse: false});

/**
 * 添加排放源
 * @param params
 * @returns
 */
export const addEmissionSource = (params) =>
    defHttp.post({ url: Api.add, params },{ isTransformResponse: false});

/**
 * 编辑排放源
 * @param params
 * @returns
 */
export const editEmissionSource = (params) =>
    defHttp.post({ url: Api.edit, params },{ isTransformResponse: false});

/**
 * 根据主标准ID查询转换标准
 * @param params
 * @returns
 */
export const queryConversionByMainStandardId = (params) =>
    defHttp.get({ url: Api.queryByMainStandardId, params },{ isTransformResponse: false});

/**
 * 获取所有单位分组数据
 * @returns
 */
export const getAllUnitGroups = () =>
    defHttp.get({ url: Api.getAllUnitByGroup },{ isTransformResponse: false});

/**
 * 获取单位转换值
 * @param params
 * @returns
 */
export const getUnitConvertValue = (params) =>
    defHttp.get({ url: Api.getConvertValue, params },{ isTransformResponse: false});

/**
 * 获取因子详细信息
 * @param params
 * @returns
 */
export const getFactorInfo = (params) =>
    defHttp.get({ url: Api.listInfo, params },{ isTransformResponse: false});

/**
 * 添加碳排放检查
 * @param params
 * @returns
 */
export const addEmissionFactorCheck = (params) =>
    defHttp.post({ url: Api.addEmissionByCarbonCheck, params },{ isTransformResponse: false});

/**
 * 加载树形根节点
 * @param params
 * @returns
 */
export const loadCategoryTreeRoot = (params) =>
    defHttp.get({ url: Api.loadTreeRoot, params },{ isTransformResponse: false});

/**
 * 获取所有活动设施
 * @returns
 */
export const getAllActivities = () =>
    defHttp.get({ url: Api.getAllActivities },{ isTransformResponse: false});
