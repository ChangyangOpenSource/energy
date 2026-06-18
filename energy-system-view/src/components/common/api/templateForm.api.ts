// src/api/templateForm.api.ts
import { defHttp } from '/@/utils/http/axios';

enum Api {
    loadTreeRoot = '/sys/category/loadTreeRoot',
    addTemplate = '/orgCheckTemplate/add',
    editTemplate = '/orgCheckTemplate/edit'
}

/**
 * 加载树形根节点数据
 * @param params 查询参数
 * @returns 树形数据
 */
export const loadTreeRoot = (params: { pcode: string; async: boolean }) =>
    defHttp.get({ url: Api.loadTreeRoot, params }, { isTransformResponse: false });

/**
 * 添加模板
 * @param params 模板参数
 * @returns 添加结果
 */
export const addTemplate = (params: any) =>
    defHttp.post({ url: Api.addTemplate, params }, { isTransformResponse: false });

/**
 * 编辑模板
 * @param params 模板参数
 * @returns 编辑结果
 */
export const editTemplate = (params: any) =>
    defHttp.put({ url: Api.editTemplate, params }, { isTransformResponse: false });
