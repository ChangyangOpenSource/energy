// src/views/supplier/supplier/supplier.api.ts
import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/supplier/querySupplierPageList',
  delete = '/supplier/delete',
  deleteBatch = '/supplier/deleteBatch',
  exportXls = '/supplier/exportXls',
  importExcel = 'supplier/importExcel',
  updateEnableStatus = '/supplier/editEnableStatus'
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
  return defHttp.delete({ url: Api.delete, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
}

/**
 * 批量删除
 * @param params
 * @param handleSuccess
 */
export const deleteBatch = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteBatch, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
}

/**
 * 导出excel
 * @param params
 */
export const exportXls = (params) => defHttp.get({ url: Api.exportXls, params }, { responseType: 'blob' });

/**
 * 导入excel
 * @param params
 */
export const importExcel = (params) => defHttp.uploadFile({ url: Api.importExcel }, params);

/**
 * 更新启用状态
 * @param params
 */
export const updateEnableStatus = (params) => defHttp.get({ url: Api.updateEnableStatus, params }, { isTransformResponse: false});
