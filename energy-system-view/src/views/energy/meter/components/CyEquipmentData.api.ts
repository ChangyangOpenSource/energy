import { defHttp } from '/@/utils/http/axios';

enum Api {
  listByEquipmentId = '/cyEquipmentData/listByEquipmentId',
  detailListByEquipmentIds = '/cyEquipmentData/detailListByEquipmentIds',
  saveHandData = '/cyEquipmentData/saveHandData',
  exportXlsHandData = '/cyEquipmentData/exportXlsHandData',
  importExcelHandData = '/cyEquipmentData/importExcelHandData',
  calData = '/cyEquipmentData/calData',
  saveOrUpdate = '/cyEquipmentData/saveOrUpdate',
  delete = '/cyEquipmentData/delete',
}

/**
 * 导出api
 * @param params
 */
export const getExportUrlHandData = Api.exportXlsHandData;

/**
 * 导入api
 */
export const getImportUrlHandData = Api.importExcelHandData;
/**
 * 计算多设备 单参数值
 */
export const getCalData = (params) => defHttp.post({ url: Api.calData, params });

/**
 * 查询单个设备下绑定的数据点
 * @param params
 */
export const listByEquipmentId = (params) => defHttp.get({ url: Api.listByEquipmentId, params });

/**
 * 添加/编辑数据点
 * @param params
 */
export const saveOrUpdate = (params) => defHttp.post({ url: Api.saveOrUpdate, params });

/**
 * 删除单个
 * @param params
 */
export const deleteOne = (params) => defHttp.delete({url: Api.delete, params}, {joinParamsToUrl: true});

/**
 *查询多个设备下的数据点
 */
export const detailListByEquipmentIds = (params) => defHttp.post({ url: Api.detailListByEquipmentIds, params });

/**
 * 保存手工填报数据
 * @param params
 */
export const saveHandData = (params) => defHttp.post({ url: Api.saveHandData, params });



