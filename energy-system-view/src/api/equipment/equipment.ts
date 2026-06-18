import { defHttp } from '/@/utils/http/axios';
import {downloadFile} from "@/api/common/api";
enum Api {
  FIND_DEVICE_DATA = '/iotAgreementApi/findDeviceData',//获取设备数据接口
  FIND_DEVICE_LIST_DATA = '/iotAgreementApi/findDeviceListData',//多设备数据查询
  EXPORT_DEVICE_DATA = '/iotAgreementApi/exportXls',//导出设备数据接口
  EXPORT_DEVICE_LIST_DATA = '/iotAgreementApi/exportDeviceListXls',//导出设备数据接口
  FIND_ENERGY_TYPE_ENUM = '/iotAgreementApi/findEnergyTypeEnum',//根据能源查询字段
  FIND_PROTOCOL_LIST = '/iotAgreementApi/findProtocolList',//获取协议接口
  FIND_USEFUL_PROTOCOL_POSITION_LIST = '/iotAgreementApi/findUsefulProtocolPositionsList',//根据协议查询字段
  FIND_DEVICE_SN_LIST = '/iotAgreementApi/findDeviceSnList',//获取设备接口
}

/**
 * @description: Get sample options value
 */
export const findDeviceDataApi = (params) => defHttp.post({ url: Api.FIND_DEVICE_DATA, params });
export const findDeviceListData = (params) => defHttp.post({ url: Api.FIND_DEVICE_LIST_DATA, params });
export const exportDeviceDataApi = (fileName, params) => downloadFile(Api.EXPORT_DEVICE_DATA, fileName, params);

export const exportDeviceListDataApi = (fileName, params) => downloadFile(Api.EXPORT_DEVICE_LIST_DATA, fileName, params);

export const findEnergyTypeEnumApi = (params) => defHttp.get({ url: Api.FIND_ENERGY_TYPE_ENUM, params });

export const findProtocolList = (params) => defHttp.get({ url: Api.FIND_PROTOCOL_LIST, params });
export const findUsefulProtocolPositionsList = (params) => defHttp.get({ url: Api.FIND_USEFUL_PROTOCOL_POSITION_LIST, params });
export const findDeviceSnList = (params) => defHttp.get({ url: Api.FIND_DEVICE_SN_LIST, params });
