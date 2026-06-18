import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/cyEnergyConsumeEquipmentTypeParam/list',
  save='/cyEnergyConsumeEquipmentTypeParam/add',
  copy='/cyEnergyConsumeEquipmentTypeParam/copy',
  updateParamToEquipment='/cyEnergyConsumeEquipmentTypeParam/updateParamToEquipment',
  edit='/cyEnergyConsumeEquipmentTypeParam/edit',
  deleteOne = '/cyEnergyConsumeEquipmentTypeParam/delete',
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
export const deleteOne = (params,handleSuccess) => {
  return defHttp.delete({url: Api.deleteOne, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}

/**
 * 复制
 * @param params
 * @param handleSuccess
 */
export const copy = (params,handleSuccess) => {
  return defHttp.get({url: Api.copy, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}

/**
 * 更新参数
 * @param params
 * @param handleSuccess
 */
export const updateParamToEquipment = (params,handleSuccess) => {
  return defHttp.get({url: Api.updateParamToEquipment, params}, {joinParamsToUrl: true}).then(() => {
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
