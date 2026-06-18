import { defHttp } from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";
import {downloadFile} from "@/api/common/api";

const { createConfirm } = useMessage();

enum Api {
  list = '/cyEnergyConsumptionAnalysisIndicator/list',
  indexList = '/cyEnergyStatistics/energyEfficiencyAnalysisList',
  save='/cyEnergyConsumptionAnalysisIndicator/add',
  edit='/cyEnergyConsumptionAnalysisIndicator/edit',
  deleteOne = '/cyEnergyConsumptionAnalysisIndicator/delete',
  deleteBatch = '/cyEnergyConsumptionAnalysisIndicator/deleteBatch',
  importExcel = '/cyEnergyConsumptionAnalysisIndicator/importExcel',
  exportXls = '/cyEnergyStatistics/exportEnergyEfficiencyAnalysis',
  getAllOperateData = '/CyDataManage/cyDataManage/getAllOperateData',
  energyEfficiencyAnalysisTableColumnList = '/cyEnergyStatistics/energyEfficiencyAnalysisTableColumnList',
  // 查询指标卡片盒子数据
  getIndicatorCardBoxData = '/cyEnergyStatistics/getIndicatorCardBoxData',
  // 查询图表数据
  getEnergyEfficiencyAnalysisChartData = '/cyEnergyStatistics/getEnergyEfficiencyAnalysisChartData',
}

/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;

/**
 * 用能强度分析页面导出
 * @param params
 */
export const exportEnergyEfficiencyAnalysis = (fileName, params) => downloadFile(Api.exportXls, fileName, params);

/**
 * 导入api
 */
export const getImportUrl = Api.importExcel;

/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 查询指标卡片盒子数据
 * @param params
 */
export const getIndicatorCardBoxData = (params) => defHttp.get({ url: Api.getIndicatorCardBoxData, params });

/**
 * 查询图表数据
 * @param params
 */
export const getEnergyEfficiencyAnalysisChartData = (params) => defHttp.get({ url: Api.getEnergyEfficiencyAnalysisChartData, params });

/**
 * 查询用能强度分析table列
 * @param params
 */
export const energyEfficiencyAnalysisTableColumnList = (params) => defHttp.get({ url: Api.energyEfficiencyAnalysisTableColumnList, params });


/**
 * 列表接口
 * @param params
 */
export const indexList = (params) => defHttp.get({ url: Api.indexList, params });

/**
 * 查询所有运营数据
 */
export const getAllOperateData = (params) => defHttp.get({ url: Api.getAllOperateData, params});

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
