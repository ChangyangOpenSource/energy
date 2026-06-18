// src/views/neutrality/carbonReduceManagement/CyCarbonReduceManagement.api.ts
import { defHttp } from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
    list = '/carbonReduceManagement/list',
    save = '/carbonReduceManagement/saveOrUpdateReduce',
    edit = '/carbonReduceManagement/saveOrUpdateReduce',
    deleteOne = '/carbonReduceManagement/delete',
    deleteBatch = '/carbonReduceManagement/deleteBatch',
    queryById = '/carbonReduceManagement/queryById',
    count = '/carbonReduceManagement/count',
    orgListByUser = '/sys/sysDepart/getListByUser',
    orgUser = '/sys/user/appQueryByDepartId',
    standardList = '/sys/category/loadTreeRoot',
    unit = '/emission/factor/cyEmissionUnit/getAllUnitByGroup',
    getConvertValue = '/emission/factor/cyEmissionFactor/api/getConvertValue',
    listInfo = '/emission/factor/cyEmissionFactor/listInfo',
    addEmissionFactor = '/emission/factor/cyEmissionFactor/addEmissionByCarbonCheck',
    exportXls = '/carbonReduceManagement/exportXls',
    importExcel = '/carbonReduceManagement/importExcel',
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
export const listProjects = (params) => defHttp.get({ url: Api.list, params });

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
 * 保存或者更新
 * @param params
 * @param isUpdate
 */
export const saveOrUpdate = (params, isUpdate) => {
    let url = isUpdate ? Api.edit : Api.save;
    return defHttp.post({ url: url, params }, { isTransformResponse: false});
}

/**
 * 查询详情
 * @param params
 */
export const queryById = (params) => defHttp.get({ url: Api.queryById, params }, { isTransformResponse: false});

/**
 * 获取统计数量
 * @param params
 */
export const getCount = (params) => defHttp.get({ url: Api.count, params }, { isTransformResponse: false});

/**
 * 获取组织列表（包含下级组织）
 * @param params
 */
export const getOrgListByUser = (params) => defHttp.get({ url: Api.orgListByUser, params }, { isTransformResponse: false});

/**
 * 获取组织下的用户列表
 * @param params
 */
export const getOrgUsers = (params) => defHttp.get({ url: Api.orgUser, params }, { isTransformResponse: false});

/**
 * 获取核算标准树
 * @param params
 */
export const getStandardList = (params) => defHttp.get({ url: Api.standardList, params }, { isTransformResponse: false});

/**
 * 获取单位列表
 * @param params
 */
export const getAllUnits = (params) => defHttp.get({ url: Api.unit, params }, { isTransformResponse: false});

/**
 * 获取单位转换值
 * @param params
 */
export const getConvertValueApi = (params) => defHttp.get({ url: Api.getConvertValue, params }, { isTransformResponse: false});

/**
 * 获取因子数据
 * @param params
 */
export const getFactorInfo = (params) => defHttp.get({ url: Api.listInfo, params }, { isTransformResponse: false});

/**
 * 添加排放因子
 * @param params
 */
export const addEmissionFactorApi = (params) => defHttp.post({ url: Api.addEmissionFactor, params }, { isTransformResponse: false});

// 在现有的 API 枚举中已经定义了这些接口，需要导出它们
/**
 * 获取单位转换值
 * @param params 查询参数 {sourceUnit: string, targetUnit: string}
 */
export const getConvertValue = (params) => defHttp.get({ url: Api.getConvertValue, params }, { isTransformResponse: false});

/**
 * 添加排放因子
 * @param params 表单数据
 */
export const addEmissionFactor = (params) => defHttp.post({ url: Api.addEmissionFactor, params }, { isTransformResponse: false});
