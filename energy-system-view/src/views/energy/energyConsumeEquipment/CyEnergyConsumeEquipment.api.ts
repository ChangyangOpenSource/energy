import { defHttp } from '/@/utils/http/axios';
import {downloadFile} from "@/api/common/api";

enum Api {
  list = '/cyEnergyConsumeEquipment/list',
  updateStatus='/cyEnergyConsumeEquipment/updateStatus',
  save='/cyEnergyConsumeEquipment/add',
  edit='/cyEnergyConsumeEquipment/edit',
  deleteOne = '/cyEnergyConsumeEquipment/delete',
  count = '/cyEnergyConsumeEquipment/count',
  menuList = '/cyEnergyConsumeEquipment/menuList',
  analysis = '/cyEnergyConsumeEquipment/analysis',
  calDynamicParam = '/cyEnergyConsumeEquipment/calDynamicParam',
  exportXlsDynamicParam = '/cyEnergyConsumeEquipment/exportXlsDynamicParam',
}

/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });
/**
 * 修改状态
 * @param params
 */
export const updateStatus = (params) => defHttp.get({ url: Api.updateStatus, params });

/**
 * 树结构 只有key  title 和children
 * @param params
 */
export const menuList = (params) => defHttp.get({ url: Api.menuList, params });

/**
 * 设备分析
 * @param params
 */
export const analysis = (params) => defHttp.get({ url: Api.analysis, params });
/**
 * 设备分析
 * @param params
 */
export const calDynamicParam = (params) => defHttp.get({ url: Api.calDynamicParam, params });

/**
 * 计数
 * @param params
 */
export const consumeEquipmentCount = (params) => defHttp.get({ url: Api.count, params });

/**
 * 导出动态参数
 * @param fileName
 * @param params
 */
export const exportXlsDynamicParam = (fileName, params) => downloadFile(Api.exportXlsDynamicParam, fileName, params);

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
 * @param isUpdate
 */
export const saveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url: url, params }, { isTransformResponse: false });
}
