// src/views/ledger/carbonAssetForecast/carbonAssetForecast.api.ts
import { defHttp } from '/@/utils/http/axios';

enum Api {
    typeAndChildren = '/sys/category/loadTreeRoot',
    topLeft = '/carbonAssetFlow/topLeft',
    getMidScreen = '/carbonAssetFlow/getMidScreen',
    getCreateBy = '/sys/user/appQueryByDepartId',
    orgListByUser = '/sys/sysDepart/getMyDepartList',
    queryAssetData = "/cyOrgAsset/cyOrgAsset/queryAssetData",
    queryPrice = '/carbonMarkrt/queryPrice',
    queryOutput = "/cyOrgAsset/cyOrgAsset/queryOutput",
    getReferenceValue = "/cyHistoryReferenceValue/cyHistoryReferenceValue/list",
    cacheForecastData = "/carbonAssetFlow/cacheForecastData",
    getCacheForecastData = "/carbonAssetFlow/getCacheForecastData",
    carbonReduce = "/carbonReduceManagement/list",
    totalCarbonEmissions = "orgCheckCheck/getCarbonEmissionByYear",
    queryOrgDepartTreeList = '/sys/sysDepart/getMyDepartList',
    getDictItems = "/sys/api/getDictItems",
}

/**
 * 获取类型和子项
 */
export const getTypeAndChildren = (params) => defHttp.get({ url: Api.typeAndChildren, params }, { isTransformResponse: false});

/**
 * 获取左上角数据
 */
export const getTopLeft = (params) => defHttp.get({ url: Api.topLeft, params }, { isTransformResponse: false});

/**
 * 获取中间屏幕数据
 */
export const getMidScreen = (params) => defHttp.get({ url: Api.getMidScreen, params }, { isTransformResponse: false});

/**
 * 获取创建人列表
 */
export const getCreateBy = (params) => defHttp.get({ url: Api.getCreateBy, params }, { isTransformResponse: false});

/**
 * 获取用户关联的组织列表
 */
export const getOrgListByUser = () => defHttp.get({ url: Api.orgListByUser }, { isTransformResponse: false});

/**
 * 查询组织营收数据
 */
export const queryAssetData = (params) => defHttp.get({ url: Api.queryAssetData, params }, { isTransformResponse: false});

/**
 * 根据城市查询价格
 */
export const queryPrice = (params) => defHttp.get({ url: Api.queryPrice, params }, { isTransformResponse: false});

/**
 * 查询碳排强度
 */
export const queryOutput = (params) => defHttp.get({ url: Api.queryOutput, params }, { isTransformResponse: false});

/**
 * 获取历史基准值
 */
export const getReferenceValue = (params) => defHttp.get({ url: Api.getReferenceValue, params }, { isTransformResponse: false});

/**
 * 缓存页面数据
 */
export const cacheForecastData = (params) => defHttp.post({ url: Api.cacheForecastData, params }, { isTransformResponse: false});

/**
 * 获取页面缓存数据
 */
export const getCacheForecastData = (params) => defHttp.get({ url: Api.getCacheForecastData, params }, { isTransformResponse: false});

/**
 * 查询今年的预期碳减排
 */
export const getCarbonReduce = (params) => defHttp.get({ url: Api.carbonReduce, params }, { isTransformResponse: false});

/**
 * 查询核算年的总排放量
 */
export const getTotalCarbonEmissions = (params) => defHttp.get({ url: Api.totalCarbonEmissions, params }, { isTransformResponse: false});

/**
 * 查询组织部门树列表
 */
export const queryOrgDepartTreeList = () => defHttp.get({ url: Api.queryOrgDepartTreeList }, { isTransformResponse: false});

/**
 * 获取字典项
 */
export const getDictItems = (params) => defHttp.get({ url: Api.getDictItems, params }, { isTransformResponse: false});
