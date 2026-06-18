// src/api/template.api.ts
import { defHttp } from '/@/utils/http/axios';

enum Api {
    // 根据实际需要添加模板相关的API端点
    createTemplate = '/orgCheckTemplate/create',
    updateTemplate = '/orgCheckTemplate/update',
    getTemplateById = '/orgCheckTemplate/queryById'
}

/**
 * 创建模板
 * @param params 模板参数
 * @returns 创建结果
 */
export const createTemplate = (params: any) =>
    defHttp.post({ url: Api.createTemplate, params }, { isTransformResponse: false });

/**
 * 更新模板
 * @param params 模板参数
 * @returns 更新结果
 */
export const updateTemplate = (params: any) =>
    defHttp.put({ url: Api.updateTemplate, params }, { isTransformResponse: false });

/**
 * 根据ID获取模板详情
 * @param params 模板ID参数
 * @returns 模板详情
 */
export const getTemplateById = (params: { id: string }) =>
    defHttp.get({ url: Api.getTemplateById, params }, { isTransformResponse: false });
