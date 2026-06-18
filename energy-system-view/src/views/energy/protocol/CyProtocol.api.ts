import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/cyProtocol/list',
  saveOrUpdate='/cyProtocol/saveOrUpdate',
  edit='/cyProtocol/edit',
  deleteOne = '/cyProtocol/deleteById',
  importExcel = '/cyProtocol/importExcel',
  exportXls = '/cyProtocol/exportXls',
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
export const protocolList = (params) => defHttp.get({ url: Api.list, params });

/**
 * 删除单个
 * @param params
 * @param handleSuccess
 */
export const deleteOne = (params,handleSuccess) => {
  return defHttp.delete({url: Api.deleteOne, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}


/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params) => {
  return defHttp.post({ url: Api.saveOrUpdate, params }, { isTransformResponse: false });
}
