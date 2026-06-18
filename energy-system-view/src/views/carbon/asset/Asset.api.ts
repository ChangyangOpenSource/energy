// src/views/carbon/asset/Asset.api.ts
import { defHttp } from '/@/utils/http/axios';


enum Api {
    list = '/cyOrgAsset/cyOrgAsset/list',
    save = '/cyOrgAsset/cyOrgAsset/add',
    edit = '/cyOrgAsset/cyOrgAsset/edit',
    deleteOne = '/cyOrgAsset/cyOrgAsset/delete',
    queryOrgDepartTreeList = '/sys/sysDepart/queryTreeList',
    chartData = '/cyOrgAsset/cyOrgAsset/chartData',
}

/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 删除单个
 * @param params
 * @param handleSuccess
 */
export const deleteOne = (params, handleSuccess) => {
    return defHttp.delete({ url: Api.deleteOne, params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
    });
}

/**
 * 保存或者更新
 * @param params
 * @param isUpdate
 */
export const saveOrUpdate = (params, isUpdate) => {
    let url = isUpdate ? Api.edit : Api.save;
    return defHttp.post({ url: url, params }, { isTransformResponse: false });
}

/**
 * 获取部门树形数据
 */
export const queryOrgDepartTreeList = () => defHttp.get({ url: Api.queryOrgDepartTreeList },{isTransformResponse:false});

/**
 * 获取图表数据
 * @param params
 */
export const getChartData = (params) => defHttp.get({ url: Api.chartData, params },{isTransformResponse:false});
