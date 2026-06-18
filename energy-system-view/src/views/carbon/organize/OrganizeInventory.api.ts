// OrganizeInventory.api.ts
import { defHttp } from '/@/utils/http/axios';

enum Api {
    getPageList = '/orgCheckCheck/getPageList',
    createNewCommonCheck = '/orgCheckCheck/createNewCommonCheck',
    deleteById = '/orgCheckCheck/deleteById',
    publish = '/orgCheckCheck/publish',
    republish = '/orgCheckCheck/republish',
    loadTreeRoot = '/sys/category/loadTreeRoot',
    queryOrgDepartTreeList = '/sys/sysDepart/queryTreeList',
    queryOrgList = '/orgCheckTemplate/queryOrgList',
    processList = '/CyInvitationFillIn/cyInvitationFillIn/processList',
}

/**
 * 获取组织碳盘查列表
 * @param params
 * @returns
 */
export const getOrganizeInventoryList = (params) => defHttp.get({ url: Api.getPageList, params });

/**
 * 创建新的碳盘查
 * @param params
 * @returns
 */
export const createNewInventory = (params) => defHttp.post({ url: Api.createNewCommonCheck, params }, { isTransformResponse: false });

/**
 * 删除碳盘查记录
 * @param params
 * @param handleSuccess
 * @returns
 */
export const deleteInventory = (params, handleSuccess) => {
    return defHttp.get({ url: Api.deleteById, params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
    });
}

/**
 * 归档碳盘查
 * @param params
 * @returns
 */
export const publishInventory = (params) => defHttp.get({ url: Api.publish, params }, { joinParamsToUrl: true,isTransformResponse: false});

/**
 * 撤销归档
 * @param params
 * @returns
 */
export const republishInventory = (params) => defHttp.get({ url: Api.republish, params }, { joinParamsToUrl: true,isTransformResponse: false});

/**
 * 加载核算标准树
 * @param params
 * @returns
 */
export const loadStandardTree = (params) => defHttp.get({ url: Api.loadTreeRoot, params }, { isTransformResponse: false});

/**
 * 获取组织部门树
 * @returns
 */
export const getOrgDepartTree = () => defHttp.get({ url: Api.queryOrgDepartTreeList }, { isTransformResponse: false});

/**
 * 获取组织模板列表
 * @param params
 * @returns
 */
export const getOrgTemplateList = (params) => defHttp.get({ url: Api.queryOrgList, params }, { isTransformResponse: false});

/**
 * 获取填报进度列表
 * @param params
 * @returns
 */
export const getProcessList = (params) => defHttp.get({ url: Api.processList, params });
