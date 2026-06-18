// src/views/carbon/invitationFillIn/InvitationFillIn.api.ts
import { defHttp } from '/@/utils/http/axios';

enum Api {
    list = '/CyInvitationFillIn/cyInvitationFillIn/list',
    delete = '/CyInvitationFillIn/cyInvitationFillIn/delete',
    deleteBatch = '/CyInvitationFillIn/cyInvitationFillIn/deleteBatch',
    exportXlsUrl = '/CyInvitationFillIn/cyInvitationFillIn/exportXls',
    importExcelUrl = 'CyInvitationFillIn/cyInvitationFillIn/importExcel',
    edit = '/CyInvitationFillIn/cyInvitationFillIn/edit',
    countRecord = '/CyInvitationFillIn/cyInvitationFillIn/countRecord',
    loadTreeRoot = '/sys/category/loadTreeRoot',
    getAllActivity = '/orgActivitie/getAll',
    getOrgAllSubjectOfCostCalc = '/orgDept/getOrgAllSubjectOfCostCalc',
    queryDepartTreeSync = '/sys/sysDepart/queryTreeList',
}

/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 编辑接口
 * @param params
 */
export const editData = (params) => defHttp.post({ url: Api.edit, params }, { isTransformResponse: false });

/**
 * 删除接口
 * @param params
 */
export const deleteData = (params) => defHttp.delete({ url: Api.delete, params }, { isTransformResponse: false });

/**
 * 批量删除接口
 * @param params
 */
export const deleteBatch = (params) => defHttp.delete({ url: Api.deleteBatch, params }, { isTransformResponse: false });

/**
 * 获取记录统计数
 */
export const getRecordCount = () => defHttp.get({ url: Api.countRecord }, { isTransformResponse: false });

/**
 * 获取核算标准
 * @param params
 */
export const getStandard = (params) => defHttp.get({ url: Api.loadTreeRoot, params }, { isTransformResponse: false });

/**
 * 获取所有活动设施
 */
export const getAllActivity = () => defHttp.get({ url: Api.getAllActivity }, { isTransformResponse: false });

/**
 * 获取核算主体
 * @param params
 */
export const getOrgAllSubjectOfCostCalc = (params) => defHttp.get({ url: Api.getOrgAllSubjectOfCostCalc, params }, { isTransformResponse: false });

export const queryDepartTreeSync = (params?) => defHttp.get({ url: Api.queryDepartTreeSync, params });

