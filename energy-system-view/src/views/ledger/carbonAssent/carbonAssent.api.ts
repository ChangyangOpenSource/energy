// src/views/ledger/carbonAssent/carbonAssent.api.ts
import { defHttp } from '/@/utils/http/axios';

enum Api {
    list = '/carbonAssetFlow/list',
    delete = '/carbonAssetFlow/delete',
    typeAndChildren = '/sys/category/loadTreeRoot',
    topLeft = '/carbonAssetFlow/topLeft',
    topRight = '/carbonAssetFlow/topRight',
    getCreateYear = '/carbonAssetFlow/getCreateYear',
    getMidScreen = '/carbonAssetFlow/getMidScreen',
    getCreateBy = '/sys/user/appQueryByDepartId',
    getCount = '/carbonAssetFlow/getCount',
    orgListByUser = '/sys/sysDepart/getMyDepartList',
    queryOrgDepartTreeList = '/sys/sysDepart/getMyDepartList',
    getLogDetail = '/carbonAssetFlow/getLogDetail',
    saveOrUpdateAssetFlow = '/carbonAssetFlow/saveOrUpdateAssetFlow',
}

/**
 * 获取碳资产流水列表
 */
export const getCarbonAssetFlowList = (params) => defHttp.get({ url: Api.list, params }, { isTransformResponse: false});

/**
 * 删除碳资产流水
 */
export const deleteCarbonAssetFlow = (params) => defHttp.delete({ url: Api.delete, params }, { isTransformResponse: false});

/**
 * 获取类型和子项
 */
export const getTypeAndChildren = (params) => defHttp.get({ url: Api.typeAndChildren, params }, { isTransformResponse: false});

/**
 * 获取左上角数据
 */
export const getTopLeft = (params) => defHttp.get({ url: Api.topLeft, params }, { isTransformResponse: false});

/**
 * 获取右上角数据
 */
export const getTopRight = (params) => defHttp.get({ url: Api.topRight, params }, { isTransformResponse: false});

/**
 * 获取创建年份
 */
export const getCreateYear = (params) => defHttp.get({ url: Api.getCreateYear, params }, { isTransformResponse: false});

/**
 * 获取中间屏幕数据
 */
export const getMidScreen = (params) => defHttp.get({ url: Api.getMidScreen, params }, { isTransformResponse: false,joinParamsToUrl: true});

/**
 * 获取创建人列表
 */
export const getCreateBy = (params) => defHttp.get({ url: Api.getCreateBy, params }, { isTransformResponse: false});

/**
 * 获取合计数据
 */
export const getCount = (params) => defHttp.get({ url: Api.getCount, params }, { isTransformResponse: false});

/**
 * 获取用户关联的组织列表
 */
export const getOrgListByUser = () => defHttp.get({ url: Api.orgListByUser }, { isTransformResponse: false});

/**
 * 查询组织部门树列表
 */
export const queryOrgDepartTreeList = () => defHttp.get({ url: Api.queryOrgDepartTreeList }, { isTransformResponse: false});

/**
 * 获取日志详情
 */
export const getLogDetail = (params) => defHttp.get({ url: Api.getLogDetail, params }, { isTransformResponse: false});

/**
 * 保存或更新资产流水
 */
export const saveOrUpdateAssetFlow = (params) => defHttp.post({ url: Api.saveOrUpdateAssetFlow, params }, { isTransformResponse: false});
