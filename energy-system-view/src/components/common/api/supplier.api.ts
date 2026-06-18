// src/api/supplier.api.ts
import { defHttp } from '/@/utils/http/axios';

enum Api {
    getAllSupplierCarbonData = 'footprintProduct/cyFootprintProduct/getAllSupplierCarbonData',
    getAllSuppliers = '/supplier/all'
}

/**
 * 获取所有供应商碳数据
 * @param params 查询参数
 * @returns 供应商碳数据列表
 */
export const getAllSupplierCarbonData = (params: any) =>
    defHttp.get({ url: Api.getAllSupplierCarbonData, params: params }, { isTransformResponse: false });

/**
 * 获取所有供应商
 * @param params 查询参数
 * @returns 供应商列表
 */
export const getAllSuppliers = (params: { pid: string }) =>
    defHttp.get({ url: Api.getAllSuppliers, params }, { isTransformResponse: false });
