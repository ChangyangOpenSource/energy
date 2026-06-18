// src/views/carbon/template/Template.api.ts
import { defHttp } from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
    list = '/orgCheckTemplate/queryOrgPageList',
    save = '/orgCheckTemplate/add',
    edit = '/orgCheckTemplate/edit',
    deleteOne = '/orgCheckTemplate/delete',
    loadTreeRoot = '/sys/category/loadTreeRoot',
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
    return defHttp.post({ url: url, params }, { isTransformResponse: false });
}

/**
 * 获取核算标准
 * @param params
 */
export const loadCategoryTreeRoot = (params) => defHttp.get({ url: Api.loadTreeRoot, params }, { isTransformResponse: false});
