import { defHttp } from '/@/utils/http/axios';

enum Api {
  // 碳排放量统计部分
  carbonCheckSubmitData = '/orgCheckCheck/carbonCheckSubmitData',
  // 设施/活动碳排放
  carbonCheckChartRightData = '/orgCheckCheck/carbonCheckChartRightData',
  // 桑基图数据
  getSangJiTable = '/orgCheckCheck/getSangJiTable',
  // 中部三合一获取有类别分类
  getHasDataCategory = '/orgCheckCheck/getHasDataCategory',
  // 趋势分析
  getDataByMonthType = '/orgCheckCheck/getDataByMonthType',
  // 底部数据
  bottomTable = '/orgCheckCheck/bottomTable',
  // 填报进度
  statisticCompleteItem = '/orgCheckCheck/statisticCompleteItem',
  // 根据主体标准和年份查询id
  getCheckIdByYearAndStadranId = '/orgCheckCheck/getCheckIdByYearAndStadranId',
  // 正在排查
  getNoSubmitCheck = '/orgCheckCheck/getNoSubmitCheck',
  // 盘查情况
  getCheckStatistic = '/orgCheckCheck/getCheckStatistic',
  // 中部三合一获取
  carbonCategoryGasRes = '/orgCheckCheck/carbonCategoryGasRes',
  // 开始填报
  createNewCommonCheck = '/orgCheckCheck/createNewCommonCheck',
  // 核算标准
  loadTreeRoot = '/sys/category/loadTreeRoot',
  // 核算主体
  queryTreeList = '/sys/sysDepart/queryTreeList',
  // 归档
  publish = '/orgCheckCheck/publish',
  // 撤回归档
  republish = '/orgCheckCheck/republish',
  // 生成碳报告
  saveOrUpdateReport = '/cyOrgCarbonReport/saveOrUpdateReport',
  // 查询是否生成过报告
  queryByCheckCheckId = '/cyOrgCarbonReport/queryByCheckCheckId',
  // 导出构成分析
  createPdf = '/cyOrgCarbonReport/createPdf',
}

// 碳排放看板相关接口
export const kanbanApi = {
  /**
   * 碳排放量统计部分
   */
  getCarbonCheckSubmitData: (params) =>
    defHttp.get({ url: Api.carbonCheckSubmitData, params }, { isTransformResponse: false }),

  /**
   * 设施/活动碳排放
   */
  getCarbonCheckChartRightData: (params) =>
    defHttp.get({ url: Api.carbonCheckChartRightData, params }, { isTransformResponse: false }),

  /**
   * 桑基图数据
   */
  getSangJiTable: (params) =>
    defHttp.get({ url: Api.getSangJiTable, params }, { isTransformResponse: false }),

  /**
   * 中部三合一获取有类别分类
   */
  getHasDataCategory: (params) =>
    defHttp.get({ url: Api.getHasDataCategory, params }, { isTransformResponse: false }),

  /**
   * 趋势分析
   */
  getDataByMonthType: (params) =>
    defHttp.get({ url: Api.getDataByMonthType, params }, { isTransformResponse: false }),

  /**
   * 底部数据
   */
  getBottomTable: (params) =>
    defHttp.get({ url: Api.bottomTable, params }, { isTransformResponse: false }),

  /**
   * 填报进度
   */
  getStatisticCompleteItem: (params) =>
    defHttp.get({ url: Api.statisticCompleteItem, params }, { isTransformResponse: false }),

  /**
   * 根据主体标准和年份查询id
   */
  getCheckIdByYearAndStadranId: (params) =>
    defHttp.get({ url: Api.getCheckIdByYearAndStadranId, params }, { isTransformResponse: false }),

  /**
   * 正在排查
   */
  getNoSubmitCheck: () =>
    defHttp.get({ url: Api.getNoSubmitCheck }, { isTransformResponse: false }),

  /**
   * 盘查情况
   */
  getCheckStatistic: () =>
    defHttp.get({ url: Api.getCheckStatistic }, { isTransformResponse: false }),

  /**
   * 中部三合一获取
   */
  getCarbonCategoryGasRes: (params) =>
    defHttp.get({ url: Api.carbonCategoryGasRes, params }, { isTransformResponse: false }),

  /**
   * 开始填报
   */
  createNewCommonCheck: (params) =>
    defHttp.post({ url: Api.createNewCommonCheck, params }, { isTransformResponse: false }),

  /**
   * 核算标准
   */
  loadTreeRoot: (params) =>
    defHttp.get({ url: Api.loadTreeRoot, params }, { isTransformResponse: false }),

  /**
   * 核算主体getOrgAllSubjectOfCostCalc
   */
  queryTreeList: () =>
    defHttp.get({ url: Api.queryTreeList }, { isTransformResponse: false }),

  /**
   * 归档
   */
  publish: (params) =>
    defHttp.get({ url: Api.publish, params }, { joinParamsToUrl: true,isTransformResponse: false}),

  /**
   * 撤回归档
   */
  republish: (params) =>
    defHttp.get({ url: Api.republish, params }, { joinParamsToUrl: true,isTransformResponse: false}),

  /**
   * 生成碳报告
   */
  saveOrUpdateReport: (params) =>
    defHttp.post({ url: Api.saveOrUpdateReport, params }, { isTransformResponse: false }),

  /**
   * 查询是否生成过报告
   */
  queryByCheckCheckId: (params) =>
    defHttp.get({ url: Api.queryByCheckCheckId, params }, { isTransformResponse: false }),

  /**
   * 导出构成分析
   */
  createPdf: (params) =>
    defHttp.get({ url: Api.createPdf, params }, { isTransformResponse: false }),

  /**
   * 文件下载接口
   */
  downloadFile: (url: string) => {
    // 使用 window.open 直接下载文件
    window.open(url, '_blank');
  }
};


