// src/views/carbon/activitie/activitie.api.ts
import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/orgActivitie/list',
  save = '/orgActivitie/add',
  edit = '/orgActivitie/edit',
  deleteOne = '/orgActivitie/delete',
  queryById = '/orgActivitie/queryById',
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
  return defHttp.delete({ url: Api.deleteOne, params }, { joinParamsToUrl: true }).then(() => {
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
  return defHttp.post({ url: url, params },{ isTransformResponse: false});
}

/**
 * 根据ID查询
 * @param params
 */
export const queryById = (params) => defHttp.get({ url: Api.queryById, params });
