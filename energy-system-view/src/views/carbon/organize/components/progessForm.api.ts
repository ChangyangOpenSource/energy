// progessForm.api.ts
import { defHttp } from '/@/utils/http/axios';

enum Api {
    processList = '/CyInvitationFillIn/cyInvitationFillIn/processList',
    add = '/CyInvitationFillIn/cyInvitationFillIn/add',
    edit = '/CyInvitationFillIn/cyInvitationFillIn/edit',
    queryById = '/CyInvitationFillIn/cyInvitationFillIn/queryById'
}

/**
 * 获取填报进度列表
 * @param params
 * @returns
 */
export const getProcessList = (params) =>
    defHttp.get({ url: Api.processList, params }, { isTransformResponse: false });

/**
 * 添加填报数据
 * @param params
 * @returns
 */
export const addProcessData = (params) =>
    defHttp.post({ url: Api.add, params }, { isTransformResponse: false });

/**
 * 编辑填报数据
 * @param params
 * @returns
 */
export const editProcessData = (params) =>
    defHttp.put({ url: Api.edit, params }, { isTransformResponse: false });

/**
 * 根据ID查询数据
 * @param params
 * @returns
 */
export const queryProcessById = (params) =>
    defHttp.get({ url: Api.queryById, params }, { isTransformResponse: false });
