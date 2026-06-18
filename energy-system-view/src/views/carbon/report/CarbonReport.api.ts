// src/views/carbon/report/CarbonReport.api.ts
import { defHttp } from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
    list = '/cyOrgCarbonReport/list',
    deleteOne = '/cyOrgCarbonReport/delete',
    exportXls = '/cyOrgCarbonReport/exportXls',
    importExcel = '/cyOrgCarbonReport/importExcel',
    loadTreeRoot = '/sys/category/loadTreeRoot',
    getOrgAllSubjectOfCostCalc = '/orgDept/getOrgAllSubjectOfCostCalc',
    queryDepartTreeSync = '/sys/sysDepart/queryTreeList',
}

/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;

/**
 * 导入api
 */
export const getImportUrl = Api.importExcel;

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
 * 批量删除
 * @param params
 * @param handleSuccess
 */
export const batchDelete = (params, handleSuccess) => {
    createConfirm({
        iconType: 'warning',
        title: '确认删除',
        content: '是否删除选中数据',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
            return defHttp.delete({ url: Api.deleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
                handleSuccess();
            });
        }
    });
}

/**
 * 获取核算标准
 * @param params
 */
export const loadCategoryTreeRoot = (params) => defHttp.get({ url: Api.loadTreeRoot, params });

export const queryDepartTreeSync = (params?) => defHttp.get({ url: Api.queryDepartTreeSync, params });


/**
 * 获取核算主体
 * @param params
 */
export const getOrgAllSubjectOfCostCalc = (params) => defHttp.get({ url: Api.getOrgAllSubjectOfCostCalc, params });
