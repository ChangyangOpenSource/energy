// CyOrgEmissionSource.api.ts
import { defHttp } from '/@/utils/http/axios';

enum Api {
    list = '/orgCarbonEmissionSource/list',
    delete = '/orgCarbonEmissionSource/deleteById',
    getAllActivities = '/orgActivitie/getAll',
    loadTreeRoot = '/sys/category/loadTreeRoot',
}

/**
 * 列表接口
 * @param params
 */
export const getList = (params) => defHttp.get({ url: Api.list, params });

/**
 * 删除单个排放源
 * @param params
 */
export const deleteById = (params) => defHttp.get({ url: Api.delete, params },{ isTransformResponse: false});

/**
 * 获取所有活动设施
 */
export const getAllActivities = () => defHttp.get({ url: Api.getAllActivities },{ isTransformResponse: false});

/**
 * 加载树形根节点
 * @param params
 */
export const loadTreeRoot = (params) => defHttp.get({ url: Api.loadTreeRoot, params },{ isTransformResponse: false});
