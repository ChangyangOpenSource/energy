import { defHttp } from '/@/utils/http/axios';

enum Api {
  stationList = '/cyStation/list',
  getStationTree = '/cyStation/getStationTree',
  queryById = '/cyStation/queryById',
  saveOrUpdate = '/cyStation/saveOrUpdate',
  delete = '/cyStation/delete',
  getEnergyType = '/cyStation/getEnergyType',
}

/**
 * 列表接口
 * @param params
 */
export const stationList = (params) => defHttp.get({ url: Api.stationList, params });
/**
 * 列表接口
 * @param params
 */
export const getEnergyType = (params) => defHttp.get({ url: Api.getEnergyType, params });

/**
 * 树形列表接口
 * @param params
 */
export const getStationTree = (params) => defHttp.get({ url: Api.getStationTree, params });

/**
 * 查询详情
 * @param params
 */
export const saveOrUpdate = (params) => defHttp.post({ url: Api.saveOrUpdate, params });


/**
 * 查询详情
 * @param params
 */
export const queryById = (params) => defHttp.get({ url: Api.queryById, params });

/**
 * 根据id删除
 * @param params
 */
export const deleteById = (params) => defHttp.delete({ url: Api.delete, params }, { joinParamsToUrl: true });
