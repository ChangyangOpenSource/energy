import { defHttp } from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/CyDataManage/cyDataManage/list',
  save='/CyDataManage/cyDataManage/add',
  edit='/CyDataManage/cyDataManage/edit',
  deleteOne = '/CyDataManage/cyDataManage/delete',
  deleteBatch = '/CyDataManage/cyDataManage/deleteBatch',
  importExcel = '/CyDataManage/cyDataManage/importExcel',
  exportXls = '/CyDataManage/cyDataManage/exportXls',
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

export const dataGetTypeDict = () => defHttp.get({url: '/sys/dict/getDictItems/data_get_type'})


export const dataFillInTypeDict = () => defHttp.get({url: '/sys/dict/getDictItems/data_fill_in_type'})


export const getAllUnit = () => defHttp.get({url: '/emission/factor/cyEmissionUnit/getAllUnitByGroup'})


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
