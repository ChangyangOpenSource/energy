import { defHttp } from '/@/utils/http/axios';

enum Api {
  queryCompanyAndSubsidiaryByTenantIdResult = '/sys/api/queryCompanyAndSubsidiaryByTenantIdResult',
}

/**
 * 根据id删除
 * @param params
 */
export const queryCompanyAndSubsidiaryByTenantIdResult = (params) => defHttp.get({ url: Api.queryCompanyAndSubsidiaryByTenantIdResult, params });
