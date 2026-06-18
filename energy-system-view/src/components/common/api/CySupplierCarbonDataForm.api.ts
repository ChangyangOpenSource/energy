// CySupplierCarbonDataForm.api.ts
import { defHttp } from '/src/utils/http/axios';

enum Api {
    // 供应商碳数据相关接口
    addSupplierCarbonData = '/cySupplierCarbonData/add',
    editSupplierCarbonData = '/cySupplierCarbonData/edit',
    querySupplierCarbonDataById = '/cySupplierCarbonData/queryById',

    // 碳数据填报任务相关接口
    saveOrConfirmSubmit = '/cySupplierCarbonDataItem/saveOrConfirmSubmit',

    // 系统分类相关接口
    loadTreeRoot = '/sys/category/loadTreeRoot',

    // 因子单位相关接口
    getFactorUnits = '/CyFactorUnit/cyFactorUnit/list',
}

/**
 * 添加供应商碳数据
 * @param params
 * @returns
 */
export const addSupplierCarbonData = (params) =>
    defHttp.post({ url: Api.addSupplierCarbonData, params });

/**
 * 编辑供应商碳数据
 * @param params
 * @returns
 */
export const editSupplierCarbonData = (params) =>
    defHttp.put({ url: Api.editSupplierCarbonData, params });

/**
 * 根据ID查询供应商碳数据
 * @param params
 * @returns
 */
export const querySupplierCarbonDataById = (params) =>
    defHttp.get({ url: Api.querySupplierCarbonDataById, params });

/**
 * 保存或确认提交碳数据填报任务
 * @param params
 * @returns
 */
export const saveOrConfirmSubmitCarbonData = (params) =>
    defHttp.post({ url: Api.saveOrConfirmSubmit, params });

/**
 * 加载树形根节点数据
 * @param params
 * @returns
 */
export const loadCategoryTreeRoot = (params) =>
    defHttp.get({ url: Api.loadTreeRoot, params });

/**
 * 获取因子单位列表
 * @returns
 */
export const getFactorUnits = () =>
    defHttp.get({ url: Api.getFactorUnits });
