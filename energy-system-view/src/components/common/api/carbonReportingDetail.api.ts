// src/views/carbon/carbonReportingDetail.api.ts
import { defHttp } from '/src/utils/http/axios';

enum Api {
  getOrgAllSubjectOfCostCalc = '/orgDept/getOrgAllSubjectOfCostCalc',
  getDetailTree = '/orgCheckCheckDetail/getDetailTree',
  loadTreeRoot = '/sys/category/loadTreeRoot',
  updateProvinceTemplate = '/orgCheckTemplate/updateProvince',
  updateProvinceCheck = '/orgCheckCheck/updateProvince',
  deleteCheckDetail = '/orgCheckCheckDetail/delete',
  submitCheck = '/orgCheckCheck/submit',
  queryCheckById = '/orgCheckCheck/queryById',
  addFromLibrary = '/orgCheckCheckDetail/addFromLibrary',
  updateDetailData = '/orgCheckCheckDetail/updateDetailData',
  updateInformant = '/orgCheckCheckDetail/updateInformant',
  uploadDataVoucher = '/orgCheckCheckDetail/uploadDataVoucher',
  uploadFile = '/orgCheckCheckDetail/upload'
}


/**
 * 获取详情树
 */
export const getDetailTree = (params: { checkId: string; standardId: string }) =>
  defHttp.get({ url: Api.getDetailTree, params }, { isTransformResponse: false });

/**
 * 加载树根节点
 */
export const loadTreeRoot = (params: { pcode: string; async: boolean }) =>
  defHttp.get({ url: Api.loadTreeRoot, params }, { isTransformResponse: false });

/**
 * 更新省份标准
 */
export const updateProvince = (isTemplate: boolean, params: any) => {
  const url = isTemplate ? Api.updateProvinceTemplate : Api.updateProvinceCheck;
  return defHttp.post({ url, params }, { isTransformResponse: false });
};

/**
 * 删除检查详情
 */
export const deleteCheckDetail = (params: { checkId: string; ids: string }) =>
  defHttp.get({ url: Api.deleteCheckDetail, params }, { isTransformResponse: false });

/**
 * 提交检查
 */
export const submitCheck = (params: { id: string }) =>
  defHttp.get({ url: Api.submitCheck, params }, { isTransformResponse: false });

/**
 * 查询检查详情
 */
export const queryCheckById = (params: { id: string }) =>
  defHttp.get({ url: Api.queryCheckById, params }, { isTransformResponse: false });

/**
 * 从库中添加排放源
 */
export const addFromLibrary = (params: any) =>
  defHttp.post({ url: Api.addFromLibrary, params }, { isTransformResponse: false });

/**
 * 更新详细数据
 */
export const updateDetailData = (params: { data: number | null; checkId: string; id: string }) =>
  defHttp.post({ url: Api.updateDetailData, params }, { isTransformResponse: false });

/**
 * 更新填报人
 */
export const updateInformant = (params: {
  checkId: string;
  detailIds: string[];
  informantUserId: string | null;
  informantUserName: string | null
}) => defHttp.post({ url: Api.updateInformant, params }, { isTransformResponse: false });

/**
 * 上传数据凭证
 */
export const uploadDataVoucher = (params: { checkId: string; id: string; savePath: string | null }) =>
  defHttp.get({ url: Api.uploadDataVoucher, params }, { isTransformResponse: false });

/**
 * 获取文件访问HTTP URL
 */
export const getFileAccessHttpUrl = (fileName: string) => {
  // 根据项目实际情况调整
  return `${window._CONFIG['domianURL']}/sys/common/static/${fileName}`;
};

/**
 * 上传文件URL
 */
export const getUploadAction = () => {
  return `${window._CONFIG['domianURL']}${Api.uploadFile}`;
};
