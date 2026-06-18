import { defHttp } from '/@/utils/http/axios';

enum Api {
  treeList = '/cyGroup/treeList',
  groupEquipmentList = '/cyGroupEquipment/list',
  addGroupEquipment = '/cyGroupEquipment/add',
  editGroupEquipment = '/cyGroupEquipment/edit',
  deleteGroupEquipment = '/cyGroupEquipment/delete',
  batchDeleteGroupEquipment = '/cyGroupEquipment/batchDelete',
  saveOrUpdate = '/cyGroup/saveOrUpdate',
  delete = '/cyGroup/delete',
  groupTree = '/cyGroup/groupTree',
}

/**
 * 树形列表接口
 * @param params
 */
export const treeList = (params) => defHttp.get({ url: Api.treeList, params });

/**
 * 树形列表接口
 * @param params
 */
export const groupTree = (params) => defHttp.get({ url: Api.groupTree, params });

/**
 * 树形列表接口
 * @param params
 */
export const groupEquipmentList = (params) => defHttp.get({ url: Api.groupEquipmentList, params });

/**
 * 保存/编辑
 * @param params
 */
export const saveOrUpdate = (params) => defHttp.post({ url: Api.saveOrUpdate, params });

/**
 * 绑定设备
 * @param params
 */
export const addGroupEquipment = (params) => defHttp.post({ url: Api.addGroupEquipment, params });
/**
 * 编辑设备
 * @param params
 */
export const editGroupEquipment = (params) => defHttp.post({ url: Api.editGroupEquipment, params });



/**
 * 根据id删除
 * @param params
 */
export const deleteById = (params) => defHttp.delete({ url: Api.delete, params }, { joinParamsToUrl: true });
/**
 * 根据id删除
 * @param params
 */
export const deleteGroupEquipment = (params) => defHttp.delete({ url: Api.deleteGroupEquipment, params }, { joinParamsToUrl: true });
/**
 * 根据id删除
 * @param params
 */
export const batchDeleteGroupEquipment = (params) => defHttp.delete({ url: Api.batchDeleteGroupEquipment, params }, { joinParamsToUrl: true });
