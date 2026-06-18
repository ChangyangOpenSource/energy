// src/views/neutrality/overview/overview.api.ts
import { defHttp } from '/@/utils/http/axios';

enum Api {
    planList = '/carbonEmissionPlan/planList',
    projectScreen = '/carbonReduceManagement/projectScreen',
    queryDictItemsByCode = '/sys/api/queryDictItemsByCode',
    planAndProjectScreen = '/carbonEmissionPlan/planAndProjectScreen',
    bottomScreen = '/carbonEmissionPlan/bottomScreen',
}

/**
 * 获取碳排放计划列表
 */
export const getPlanList = () => defHttp.get({ url: Api.planList }, { isTransformResponse: false});

/**
 * 获取减碳项目详情
 * @param params 查询参数 { deptId: string, year: string }
 */
export const getProjectScreen = (params) => defHttp.get({ url: Api.projectScreen, params }, { isTransformResponse: false});

/**
 * 根据字典code获取字典项
 * @param params 查询参数 { code: string }
 */
export const queryDictItemsByCode = (params) => defHttp.get({ url: Api.queryDictItemsByCode, params }, { isTransformResponse: false});

/**
 * 获取计划和项目详情
 * @param params 查询参数 { id: string }
 */
export const getPlanAndProjectScreen = (params) => defHttp.get({ url: Api.planAndProjectScreen, params }, { isTransformResponse: false});

/**
 * 获取底部图表数据
 * @param params 查询参数 { id: string }
 */
export const getBottomScreen = (params) => defHttp.get({ url: Api.bottomScreen, params }, { isTransformResponse: false});
