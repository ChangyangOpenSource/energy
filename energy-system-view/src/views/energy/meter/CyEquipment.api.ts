import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/cyEquipment/list',
  detailListByType = '/cyEquipment/detailListByType',
  detailListByIds = '/cyEquipment/detailListByIds',
  saveOrUpdate='/cyEquipment/saveOrUpdate',
  queryById = '/cyEquipment/queryById',
  deleteOne = '/cyEquipment/deleteById',
  deleteBatch = '/cyEquipment/deleteBatch',
  importExcel = '/cyEquipment/importExcel',
  exportXls = '/cyEquipment/exportXls',
  equipmentCount='/cyEquipment/count',
  treeListByEquipmentTypeId = '/cyEquipment/treeListByEquipmentTypeId',
  getSameParameters = '/cyEquipment/getSameParameters',
  getAllParameters = '/cyEquipment/getAllParameters',
  calculate = '/cyEquipment/calculate',
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
export const equipmentList = (params) => defHttp.get({ url: Api.list, params });
export const detailListByType = (params) => defHttp.get({ url: Api.detailListByType, params });
export const detailListByIds = (params) => defHttp.get({ url: Api.detailListByIds, params });
//实时监控
export const calculate = (params) => defHttp.post({ url: Api.calculate, params });
/**
 * 获取树型结构的计量表
 * @param params
 */
export const treeListByEquipmentTypeId = (params) => defHttp.get({ url: Api.treeListByEquipmentTypeId, params });

/**
 * 获取不同设备的相同参数
 * @param params
 */
export const getSameParameters = (params) => defHttp.get({ url: Api.getSameParameters, params });
/**
 * 获取不同设备的相同参数
 * @param params
 */
export const getAllParameters = (params) => defHttp.get({ url: Api.getAllParameters, params });

/**
 * 统计
 * @param params
 */
export const equipmentCount = (params) => defHttp.get({ url: Api.equipmentCount, params });

/**
 * 查询详情
 * @param params
 */
export const queryById = (params) => {
  return defHttp.get({url: Api.queryById, params });
}
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
