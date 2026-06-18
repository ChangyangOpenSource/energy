// src/api/componentsKanban.api.ts
import { defHttp } from '/@/utils/http/axios';
import {downloadFile} from "@/api/common/api";

enum Api {
    // 看板相关接口
    getCheckStatistic = '/orgCheckCheck/getCheckStatistic',
    getNoSubmitCheck = '/orgCheckCheck/getNoSubmitCheck',
    getOrgAllSubjectOfCostCalc = '/orgDept/getOrgAllSubjectOfCostCalc',
    loadTreeRoot = '/sys/category/loadTreeRoot',
    getCheckIdByYearAndStadranId = '/orgCheckCheck/getCheckIdByYearAndStadranId',
    createNewCommonCheck = '/orgCheckCheck/createNewCommonCheck',

    // 碳排放数据接口
    carbonCheckSubmitData = '/orgCheckCheck/carbonCheckSubmitData',
    carbonCheckChartLeftData = '/orgCheckCheck/carbonCheckChartLeftData',
    carbonCheckChartRightData = '/orgCheckCheck/carbonCheckChartRightData',
    getSangJiTable = '/orgCheckCheck/getSangJiTable',
    getHasDataCategory = '/orgCheckCheck/getHasDataCategory',
    carbonCategoryGasRes = '/orgCheckCheck/carbonCategoryGasRes',
    getDataByMonthType = '/orgCheckCheck/getDataByMonthType',
    bottomTable = '/orgCheckCheck/bottomTable',
    statisticCompleteItem = '/orgCheckCheck/statisticCompleteItem',

    // 归档相关接口
    publish = '/orgCheckCheck/publish',
    republish = '/orgCheckCheck/republish',

    // 碳报告相关接口
    queryByCheckCheckId = '/cyOrgCarbonReport/queryByCheckCheckId',
    saveOrUpdateReport = '/cyOrgCarbonReport/saveOrUpdateReport',
    createPdf = '/cyOrgCarbonReport/createPdf'
}

// 盘查情况相关
export const getCheckStatistic = () => defHttp.get({ url: Api.getCheckStatistic }, { isTransformResponse: false });
export const getNoSubmitCheck = () => defHttp.get({ url: Api.getNoSubmitCheck }, { isTransformResponse: false });
export const getOrgAllSubjectOfCostCalc = () => defHttp.get({ url: Api.getOrgAllSubjectOfCostCalc }, { isTransformResponse: false });
export const loadTreeRoot = (params: any) => defHttp.get({ url: Api.loadTreeRoot, params }, { isTransformResponse: false });
export const getCheckIdByYearAndStadranId = (params: any) => defHttp.get({ url: Api.getCheckIdByYearAndStadranId, params }, { isTransformResponse: false });
export const createNewCommonCheck = (params: any) => defHttp.post({ url: Api.createNewCommonCheck, params }, { isTransformResponse: false });

// 碳排放数据相关
export const carbonCheckSubmitData = (params: { id: string }) => defHttp.get({ url: Api.carbonCheckSubmitData, params }, { isTransformResponse: false });
export const carbonCheckChartLeftData = (params: { id: string; type: number }) => defHttp.get({ url: Api.carbonCheckChartLeftData, params }, { isTransformResponse: false });
export const carbonCheckChartRightData = (params: { id: string }) => defHttp.get({ url: Api.carbonCheckChartRightData, params }, { isTransformResponse: false });
export const getSangJiTable = (params: { id: string }) => defHttp.get({ url: Api.getSangJiTable, params }, { isTransformResponse: false });
export const getHasDataCategory = (params: { id: string }) => defHttp.get({ url: Api.getHasDataCategory, params }, { isTransformResponse: false });
export const carbonCategoryGasRes = (params: { id: string; cateId: string }) => defHttp.get({ url: Api.carbonCategoryGasRes, params }, { isTransformResponse: false });
export const getDataByMonthType = (params: { id: string; type: string }) => defHttp.get({ url: Api.getDataByMonthType, params }, { isTransformResponse: false });
export const bottomTable = (params: { id: string }) => defHttp.get({ url: Api.bottomTable, params }, { isTransformResponse: false });
export const statisticCompleteItem = (params: { id: string }) => defHttp.get({ url: Api.statisticCompleteItem, params }, { isTransformResponse: false });

// 归档相关
export const publishCheck = (params: { id: string }) => defHttp.get({ url: Api.publish, params }, { isTransformResponse: false });
export const republishCheck = (params: { id: string }) => defHttp.get({ url: Api.republish, params }, { isTransformResponse: false });

// 碳报告相关
export const queryCarbonReport = (params: { orgCheckCheckId: string }) => defHttp.get({ url: Api.queryByCheckCheckId, params }, { isTransformResponse: false });
export const generateCarbonReport = (params: { orgCheckCheckId: string }) => defHttp.post({ url: Api.saveOrUpdateReport, params }, { isTransformResponse: false });
export const exportPdf = (params: { orgCheckCheckId: string }) => defHttp.get({ url: Api.createPdf, params }, { isTransformResponse: false });

// 文件下载
export const download = (url: string, params?: any) => downloadFile(url, params);
