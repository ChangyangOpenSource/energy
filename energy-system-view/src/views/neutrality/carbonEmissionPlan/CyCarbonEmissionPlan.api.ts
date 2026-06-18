import { defHttp } from '/@/utils/http/axios';

enum Api {
    list = '/carbonEmissionPlan/list',
    save = '/carbonEmissionPlan/saveOrUpdatePlane',
    edit = '/carbonEmissionPlan/edit',
    deleteOne = '/carbonEmissionPlan/delete',
    queryById = '/carbonEmissionPlan/queryById',
    orgListByUser = '/sys/sysDepart/getMyDepartList',
    standardList = '/sys/category/loadTreeRoot',
    orgCarbonEmission = '/orgCheckCheck/getTotalCarbonEmission',
    orgRevenue = '/cyOrgAsset/cyOrgAsset/queryRevenue',
}

/**
 * 列表接口
 * @param params 查询参数
 */
export const listPlans = (params) => defHttp.get({ url: Api.list, params }, { isTransformResponse: false});

/**
 * 删除单个
 * @param params 删除参数 {id: string}
 * @param handleSuccess 删除成功回调
 */
export const deleteOne = (params, handleSuccess) => {
    return defHttp.delete({ url: Api.deleteOne, params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
    });
}

/**
 * 保存或者更新
 * @param params 表单数据
 * @param isUpdate 是否为更新操作
 */
export const saveOrUpdate = (params, isUpdate) => {
    let url = isUpdate ? Api.edit : Api.save;
    return defHttp.post({ url: url, params }, { isTransformResponse: false});
}

/**
 * 查询详情
 * @param params 查询参数 {id: string}
 */
export const queryById = (params) => defHttp.get({ url: Api.queryById, params }, { isTransformResponse: false});

/**
 * 获取组织列表（包含下级组织）
 */
export const getOrgListByUser = () => defHttp.get({ url: Api.orgListByUser }, { isTransformResponse: false});

/**
 * 获取核算标准树
 * @param params 查询参数 {pcode: string, async: boolean}
 */
export const getStandardList = (params) => defHttp.get({ url: Api.standardList, params }, { isTransformResponse: false});

/**
 * 获取组织碳排放数据
 * @param params 查询参数 {deptId: string, standardId: string, year: string}
 */
export const getOrgCarbonEmission = (params) => defHttp.get({ url: Api.orgCarbonEmission, params }, { isTransformResponse: false});

/**
 * 获取组织营收数据
 * @param params 查询参数 {deptId: string, year: string}
 */
export const getOrgRevenue = (params) => defHttp.get({ url: Api.orgRevenue, params }, { isTransformResponse: false});
