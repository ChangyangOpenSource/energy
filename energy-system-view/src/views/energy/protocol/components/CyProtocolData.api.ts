import { defHttp } from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/cyProtocolData/list',
  getDatas = '/cyData/list',
  addData = '/cyData/add',
  save='/cyProtocolData/add',
  edit='/cyProtocolData/edit',
  delete = '/cyProtocolData/deleteById',
  deleteBatch = '/cyProtocolData/deleteBatch',
  importExcel = '/cyProtocolData/importExcel',
  exportXls = '/cyProtocolData/exportXls',
}

/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });
export const protocolDataList = (params) => defHttp.get({ url: Api.list, params });

/**
 * 删除单个
 * @param params
 * @param handleSuccess
 */
export const deleteOne = (params) => defHttp.delete({url: Api.delete, params}, {joinParamsToUrl: true});


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

/**
 * 保存或者更新
 * @param params
 * @param isUpdate
 */
export const getDatas = (params) => defHttp.get({ url: Api.getDatas, params });

/**
 * 保存
 * @param params
 */
export const addData = (params) => defHttp.post({ url: Api.addData, params });
