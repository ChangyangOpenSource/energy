import { defHttp } from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";
import {downloadFile} from "@/api/common/api";

const { createConfirm } = useMessage();

enum Api {
  list = '/cyEnergyStatistics/list',
  save='/cyEnergyStatistics/add',
  edit='/cyEnergyStatistics/edit',
  deleteOne = '/cyEnergyStatistics/delete',
  deleteBatch = '/cyEnergyStatistics/deleteBatch',
  importExcel = '/cyEnergyStatistics/importExcel',
  exportXls = '/cyEnergyStatistics/exportXls',
  // 分组用能页面导出
  exportGroupingEnergy = '/cyEnergyStatistics/exportGroupingEnergy',
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
 * 分组用能页面导出
 * @param params
 */
export const exportGroupingEnergy = (fileName, params) => downloadFile(Api.exportGroupingEnergy, fileName, params);


/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

export const countTimeTypeDict = () => defHttp.get({url: '/sys/dict/getDictItems/count_time_type'})


export const energyTypeDict = () => defHttp.get({url: '/sys/dict/getDictItems/energy_type'})

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
 * 批量删除
 * @param params
 * @param handleSuccess
 */
export const batchDelete = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({url: Api.deleteBatch, data: params}, {joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    }
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
