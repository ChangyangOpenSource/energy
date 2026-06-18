<!-- src/views/ledger/carbonAssetForecast/index.vue -->
<template>
  <a-card :bordered="false">
    <div class="page-container">
      <div class="right-content">
        <div class="topBox">
          <div style="display: flex; gap:20px">
            <div class="topBox-inner">
              <span class="tex-color">{{ t("carbon.message.CurrentYear") }}：</span>
              <span class="year-text" style="margin-left: 4px">{{ currentYear }}</span>
            </div>
            <div class="topBox-inner">
              <span class="tex-color">{{ t("carbon.message.AccountingCycle") }}：</span>
              <span class="year-text" style="margin-left: 4px">{{ currentYear - 1 }}</span>
            </div>
          </div>

          <div class="topBox-inner" style="margin-right:16px">
            <a-tree-select
                allowClear
                style="width: 200px"
                v-model:value="selectedDeptId"
                :dropdownStyle="{ maxHeight: '600px', overflow: 'auto' }"
                :treeData="deptTreeData"
                @select="handleDeptSelect"
                treeDefaultExpandAll>
            </a-tree-select>
          </div>
        </div>

        <div style="background-color: #ffffff; height: 45px; margin-bottom: 16px; margin-left:16px;padding-left:12px; color:#333333">
          <a-tabs v-model:activeKey="activeKey" @change="tabChange">
            <!-- <a-tab-pane key="1">
              <div style="display: flex; gap:4px" slot="tab">
                <div>
                  {{ t('carbon.message.Current_forecast_cycle') }}
                </div>
              </div>
            </a-tab-pane> -->
            <a-tab-pane key="1" :tab="t('carbon.message.Current_forecast_cycle')" force-render></a-tab-pane>
            <a-tab-pane key="2" :tab="t('carbon.message.next_forecast_cycle')" force-render></a-tab-pane>
          </a-tabs>
        </div>

        <div class="innerBox" v-if="activeKey == '1'">
          <div class="text-style" style="margin-bottom:40px;">
            {{ t('carbon.message.Carbon_offset_process_node') }}
          </div>

          <a-steps progress-dot :current="-1" direction="horizontal">
            <a-step
                v-for="(step, index) in steps"
                :key="index">
              <!-- 自定义步骤内容 -->
              <template #title>
                <div style="text-align: center;">
                  <!-- 日期显示在顶部 -->
                  <div style="font-size: 12px; color: black; margin-bottom: 4px; font-weight: 400; transform: translateY(-40px);">
                    {{ currentYear }}年{{ step.date }}
                  </div>

                  <!-- 主标题 -->
                  <div style="font-size: 14px; color:#333333; font-weight: 400; transform: translateY(-25px);">
                    {{ step.title }}
                  </div>
                </div>
              </template>

              <!-- 描述信息 -->
              <template #description>
                <div style="font-size: 10px; color: #888888; text-align: center; font-weight: 400; transform: translateY(-25px);">
                  <div v-html="step.description"></div>
                </div>
              </template>
            </a-step>
          </a-steps>
        </div>

        <div class="innerBox" v-if="activeKey == '1'">
          <div class="text-style">
            {{ t("carbon.message.Current_status_of_carbon_emissions_carbon_assets") }}
          </div>
          <div>
            <a-row :gutter="24">
              <a-col :span="6">
                <div class="cardBox" style="background-color: #F3F6FF">
                  <div class="tex-color">{{ currentYear - 1 }} {{ t("carbon.message.Carbon_emissions") }}（tCO₂e）</div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-end">
                    <div class="colorse" style="font-size: 38px; color: #1874E6; font-weight: 600;">{{ calculateYearTotalEmission }}</div>
                    <div class="colorse" style="color: #377ACE; cursor: pointer;" @click="toOrgCarbonDetail()">{{ t("carbon.message.Detail") }}</div>
                  </div>
                </div>
              </a-col>

              <a-col :span="9">
                <div class="cardBox" style="background-color: #F7FDF9">
                  <div class="tex-color">{{ t("carbon.message.Currently_available_carbon_assets") }}（tCO₂e）</div>

                  <div style="display: flex; justify-content: space-between; align-items: flex-end">
                    <div class="colorse" style="font-size: 38px; color: #148958; font-weight: 600;">{{ topLeft.left.total }}</div>
                    <div style="display: flex; gap: 16px">
                      <div class="tex-color">{{ t("carbon.message.Carbon_quota") }}：{{ topLeft.left.carbonQuota }} </div>
                      <div class="tex-color">{{ t("carbon.message.Carbon_Credit") }}：{{ topLeft.left.carbonCredit }} </div>
                    </div>
                  </div>
                </div>
              </a-col>

              <a-col :span="9">
                <div class="cardBox" style="background-color: #FDF5F1">
                  <!-- 标题和下拉框部分 -->
                  <div style="display: flex; justify-content: space-between; align-items: center">
                    <!-- 标题 -->
                    <div class="tex-color">{{ t("carbon.message.Expected_value_of_currently_available_carbon_assets") }}
                      <a-popconfirm
                          :visible="popconfirmVisible"
                          @visibleChange="handleOpenChange(1)"
                          :cancel-button-props="{ style: { display: 'none' } }"
                          :ok-button-props="{ style: { display: 'none' } }">
                        <template #title>
                          <div style="margin-bottom: 6px">{{ t("carbon.message.Instructions") }}<InfoCircleOutlined style="color: green" /></div>
                          <div style="color: #888888;">
                            {{ t("carbon.message.remind1") }}
                          </div>
                        </template>
                        <template #icon>
                          <InfoCircleOutlined style="color: green" />
                        </template>
                        <img style="object-fit: contain;" src="@/assets/img/img91.png" @mouseenter="showPopconfirm(1)" @mouseleave="hidePopconfirm(1)">
                      </a-popconfirm>
                    </div>

                    <!-- 下拉框 -->
                    <div style="width: 120px;">
                      <a-select
                          v-model:value="marketCityCode"
                          style="width: 100%"
                          @change="cityChange">
                        <a-select-option
                            v-for="(item, index) in city"
                            :key="index"
                            :value="item.value">
                          {{ item.title }} - {{ item.value }}元
                        </a-select-option>
                      </a-select>
                    </div>
                  </div>

                  <div style="display: flex; gap:12px; justify-content: space-between; align-items: flex-end">
                    <div class="colorse" style="font-size: 38px; color: #148958; font-weight: 600;">{{ valueOfAssets }}</div>

                    <div style="display: flex; gap: 12px">
                      <div class="tex-color">{{ t("carbon.message.Carbon_quota") }}：{{ CarbonQuota }} </div>
                      <div class="tex-color">{{ t("carbon.message.Carbon_Credit") }}：- </div>
                    </div>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>

        <div class="innerBox" style="display: flex;justify-content: space-between;" v-if="activeKey == '2'">
          <div style="display: flex; gap: 20px;">
            <div>
              <span class="tex-color">{{ t("carbon.message.AccountingCycle") }}：</span>
              <span class="year-text">{{ currentYear }}</span>
            </div>
            <div>
              <span class="tex-color">{{ t("carbon.message.Clearance_time") }}：</span>
              <span class="year-text">{{ currentYear + 1 }}</span>
            </div>
          </div>

          <div style="display:flex; gap: 16px; background-color: #FBFBFB; padding: 5px 16px 5px 16px ">
            <div class="tex-color">
              {{ t("carbon.message.Expected_available_carbon_assets") }}<span class="year-text" style="color:#148958; margin-left: 4px">{{ (forecastDistributeValue + topLeft.left.carbonQuota - calculateYearTotalEmission) > 0 ? Number((forecastDistributeValue + topLeft.left.carbonQuota - calculateYearTotalEmission + topLeft.left.carbonCredit).toFixed(4)) : 0 }} tCO₂e</span>
            </div>
            <div class="tex-color">
              {{ t("carbon.message.Carbon_quota") }} {{ (forecastDistributeValue + topLeft.left.carbonQuota - calculateYearTotalEmission) > 0 ? Number((forecastDistributeValue + topLeft.left.carbonQuota - calculateYearTotalEmission).toFixed(4)) : 0 }}
            </div>
            <div class="tex-color">
              {{ t("carbon.message.Carbon_Credit") }} {{ topLeft.left.carbonCredit }}
            </div>
          </div>
        </div>

        <div class="innerBox" v-if="activeKey == '2'">
          <div class="text-style">{{ currentYear }} {{ t("carbon.message.year_carbon_asset_carbon_emission_forecast") }}</div>

          <div style="padding:16px">
            <div>
              <a-row :gutter="24">
                <a-col :span="6">
                  <div class="forecastBox" :class="{ 'active': active1 }" @click="toggleActive(1)">
                    {{ t("carbon.message.Multiple_Linear_Regression(MLR)_prediction") }}
                  </div>
                  <div class="forecastBox" :class="{ 'active': active2 }" @click="toggleActive(2)">
                    {{ t("carbon.message.Weighted_Moving_Average(WMA)_prediction") }}
                  </div>
                  <div class="forecastBox" :class="{ 'active': active3 }" @click="toggleActive(3)">
                    {{ t("carbon.message.Grey_Prediction") }}
                  </div>
                </a-col>

                <!-- 多元线性回归(MLR)预测 -->
                <a-col :span="18" v-if="active1 == true" style="background-color:#FBFBFB;padding:12px">
                  <div style="font-size: 12px; margin-bottom: 12px; color:#A4A4A4">
                    *{{ t("carbon.message.long_text1") }}
                  </div>

                  <a-table
                      ref="tableRef"
                      size="middle"
                      :scroll="{x:true}"
                      bordered
                      rowKey="id"
                      :columns="foreCastColumns"
                      :dataSource="orgAssetTableData"
                      :pagination="false"
                      :loading="loading"
                      class="j-table-force-nowrap">

                    <template #carbonCountSlot="{ text, record }">
                      <div v-if="!record.carbonCount || record.carbonCount == 0">
                        <div style="color: #148857; cursor: pointer;" @click="toOrgCarbonDetail()">
                          {{ t("carbon.message.goToFill") }}
                        </div>
                      </div>

                      <div v-else>
                        {{ record.carbonCount }}
                      </div>
                    </template>

                    <template #outputSlot="{ text, record, index }">
                      <div v-if="index == orgAssetTableData.length - 1">
                        <a-input v-model:value="record.output" style="width: 80px; text-align: center"></a-input>
                      </div>

                      <div v-else-if="!record.output || record.output == 0">
                        <div style="color: #148857; cursor: pointer;" @click="gotoFillIn()">
                          {{ t("carbon.message.goToFill") }}
                        </div>
                      </div>

                      <div v-else>
                        {{ record.output }}
                      </div>
                    </template>

                    <template #revenueSlot="{ text, record, index }">
                      <div v-if="index == orgAssetTableData.length - 1">
                        <a-input v-model:value="record.revenue" style="width: 80px; text-align: center"></a-input>
                      </div>

                      <div v-else-if="!record.revenue || record.revenue == 0">
                        <div style="color: #148857; cursor: pointer;" @click="gotoFillIn()">
                          {{ t("carbon.message.goToFill") }}
                        </div>
                      </div>

                      <div v-else>
                        {{ record.revenue }}
                      </div>
                    </template>
                  </a-table>

                  <div style="margin-top: 12px; display: flex; justify-content: space-between">
                    <div style="display: flex; gap: 12px; align-items: center">
                      <div>{{ currentYear }} {{ t("carbon.message.year_planned_emission_reduction") }}</div>
                      <a-input v-model:value="totalReduceCarbon" style="width: 100px; height: 32px;border-radius: 4px" disabled></a-input>
                      <div style="color: #148857; cursor: pointer;" @click="openReductCarbonDetailModel()">
                        {{ t("carbon.message.Detail") }}
                      </div>
                    </div>
                    <div style="display: flex; gap:24px">
                      <a-button type="primary" @click="predict()">{{ t("carbon.message.StartPredicting") }}</a-button>
                      <div style="font-size: 24px; color: #148857">{{ currentYear }} {{ t("carbon.message.year_forecast_value") }}：{{ Number(prediction.toFixed(4)) }} tCO₂e</div>
                    </div>
                  </div>
                </a-col>

                <!-- 加板移动平均(WMA)预测 -->
                <a-col :span="18" v-if="active2 == true" style="background-color:#FBFBFB;padding:12px">
                  <div style="font-size: 12px; margin-bottom: 12px; color:#A4A4A4">
                    *{{ t("carbon.message.long_text2") }}
                  </div>

                  <div style="margin-bottom: 12px">
                    {{ t("carbon.message.Historical_data_range") }}
                  </div>

                  <a-radio-group v-model:value="historyDataScope" style="margin-bottom: 12px" @change="historyDataScopeChange">
                    <a-radio :value="3">{{ t("carbon.message.the_past_three_years") }}</a-radio>
                    <a-radio :value="5">{{ t("carbon.message.the_past_five_years") }}</a-radio>
                    <a-radio :value="8">{{ t("carbon.message.the_past_eight_years") }}</a-radio>
                  </a-radio-group>

                  <div style="padding:12px; display:flex; gap:12px; justify-content: space-between">
                    <div style="background-color:white; width: 100%; max-width: 475px; padding: 12px">
                      <div style="margin-bottom: 12px; display:flex; gap:14px">
                        <div>
                          {{ t("carbon.message.Weight_configuration") }}
                        </div>
                        <div style="font-size: 12px; color:#A4A4A4; text-align: center">
                          {{ t("carbon.message.weight_Waring") }}
                        </div>
                      </div>
                      <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
                        <div v-for="(item, index) in orgAssetData" :key="index"
                             style="display: flex; align-items: center; white-space: nowrap;">
                          {{ item.year }}年:
                          <a-input-number v-model:value="item.weight"
                                          style="width: 80px; height: 32px; border-radius: 4px; margin-left: 4px"
                                          step="0.01" min="0.1" max="1"
                                          @blur="saveWeight(item.year, item.weight)"></a-input-number>
                        </div>
                      </div>
                    </div>

                    <div style="background-color:white; width: 100%; max-width: 475px; padding: 12px">
                      <div style="display:flex; gap:24px; margin-bottom: 12px">
                        <div>
                          {{ t("carbon.message.Historical_carbon_emission_data") }}
                        </div>

                        <div v-if="historyDataScope == 8" style="color: #148857; cursor: pointer; font-size: 12px; text-align: center" @click="gotoSeeAll()">
                          {{ t("carbon.message.ViewMore") }}
                        </div>
                      </div>
                      <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
                        <div v-for="(item, index) in orgAssetData" :key="index"
                             style="display: flex; align-items: center; white-space: nowrap;">
                          {{ item.year }}年:
                          <span v-if="item.carbonCount">
                            <a-input-number v-model:value="item.carbonCount"
                                            style="width: 80px; height: 32px; border-radius: 4px; margin-left: 4px" disabled></a-input-number>
                          </span>
                          <span style="color: #148857; cursor: pointer; margin-left: 4px" @click="toOrgCarbonDetail()" v-else>
                            {{ t("carbon.message.goToFill") }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style="margin-top: 12px; display: flex; justify-content: space-between">
                    <div style="display: flex; gap: 12px; align-items: center">
                      <div>{{ currentYear }} {{ t("carbon.message.year_planned_emission_reduction") }}</div>
                      <a-input v-model:value="totalReduceCarbon" style="width: 100px; height: 32px;border-radius: 4px" disabled></a-input>
                      <div style="color: #148857; cursor: pointer;" @click="openReductCarbonDetailModel()">
                        {{ t("carbon.message.Detail") }}
                      </div>
                    </div>
                    <div style="display: flex; gap:24px">
                      <a-button type="primary" @click="calculateWMA()">{{ t("carbon.message.StartPredicting") }}</a-button>
                      <div style="font-size: 24px; color: #148857">{{ currentYear }} {{ t("carbon.message.year_forecast_value") }}：{{ Number(wmaPrediction.toFixed(4)) }} tCO₂e</div>
                    </div>
                  </div>
                </a-col>

                <!-- 灰色预测 -->
                <a-col :span="18" v-if="active3 == true" style="background-color:#FBFBFB;padding:12px">
                  <div style="font-size: 12px; margin-bottom: 12px; color:#A4A4A4">
                    *{{ t("carbon.message.long_text3") }}
                  </div>

                  <div style="margin-bottom: 12px">
                    {{ t("carbon.message.Historical_data_range") }}
                  </div>

                  <a-radio-group v-model:value="historyDataScope" style="margin-bottom: 12px" @change="historyDataScopeChange">
                    <a-radio :value="3">{{ t("carbon.message.the_past_three_years") }}</a-radio>
                    <a-radio :value="5">{{ t("carbon.message.the_past_five_years") }}</a-radio>
                    <a-radio :value="8">{{ t("carbon.message.the_past_eight_years") }}</a-radio>
                  </a-radio-group>

                  <div style="background-color:white; width: 100%; padding: 12px">
                    <div style="display:flex; gap:24px; margin-bottom: 12px">
                      <div>
                        {{ t("carbon.message.Historical_carbon_emission_data") }}
                      </div>

                      <div v-if="historyDataScope == 8" style="color: #148857; cursor: pointer; font-size: 12px; text-align: center" @click="gotoSeeAll()">
                        {{ t("carbon.message.ViewMore") }}
                      </div>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
                      <div v-for="(item, index) in orgAssetData" :key="index"
                           style="display: flex; align-items: center; white-space: nowrap;">
                        {{ item.year }}年:
                        <span v-if="item.carbonCount && item.carbonCount != 0">
                          <a-input-number v-model:value="item.carbonCount"
                                          style="width: 80px; height: 32px; border-radius: 4px; margin-left: 4px" disabled></a-input-number>
                        </span>
                        <span style="color: #148857; cursor: pointer; margin-left: 4px" @click="toOrgCarbonDetail()" v-else>
                          {{ t("carbon.message.goToFill") }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style="margin-top: 12px; display: flex; justify-content: space-between">
                    <div style="display: flex; gap: 12px; align-items: center">
                      <div>{{ currentYear }} {{ t("carbon.message.year_planned_emission_reduction") }}</div>
                      <a-input v-model:value="totalReduceCarbon" style="width: 100px; height: 32px;border-radius: 4px" disabled></a-input>
                      <div style="color: #148857; cursor: pointer;" @click="openReductCarbonDetailModel()">
                        {{ t("carbon.message.Detail") }}
                      </div>
                    </div>
                    <div style="font-size: 24px; color: #148857">
                      <div>{{ currentYear }} {{ t("carbon.message.year_forecast_value") }}：{{ Number(predictedValue.toFixed(4)) }} tCO₂e</div>
                    </div>
                  </div>
                </a-col>
              </a-row>
            </div>
          </div>
        </div>

        <div class="innerBox" style="margin-bottom:12px">
          <div class="text-style">{{ t("carbon.message.Carbon_quota_forecasting") }}</div>
          <div>
            <a-row :gutter="24">
              <a-col :span="24">
                <div class="select">
                  <a-radio-group
                      v-model:value="forecastType"
                      button-style="solid">
                    <a-radio-button value="1">{{ t("carbon.message.Baseline_method_prediction") }}</a-radio-button>
                    <a-radio-button value="2">{{ t("carbon.message.Prediction_based_on_historical_strength_criterion") }}</a-radio-button>
                  </a-radio-group>
                </div>
              </a-col>
            </a-row>

            <a-row :gutter="24" v-if="forecastType == '1' && activeKey == '1'">
              <a-col :span="24">
                <div style="display: flex; gap:32px; align-items: center; background-color:#FBFBFB; margin-top:12px; padding:12px">
                  <div>
                    <div style="display:flex; gap:4px; margin:12px 12px 4px 12px">
                      <div>{{ t("carbon.message.Reference_Value") }}</div>
                      <div>
                        <a-popconfirm
                            :visible="popconfirmVisible2"
                            @visibleChange="handleOpenChange(2)"
                            :cancel-button-props="{ style: { display: 'none' } }"
                            :ok-button-props="{ style: { display: 'none' } }">
                          <template #title>
                            <div style="margin-bottom: 6px">{{ t("carbon.message.Instructions") }}<InfoCircleOutlined style="color: green" /></div>
                            <div style="color: #888888; width: 300px; word-wrap: break-word; white-space: normal;">
                              {{ t("carbon.message.remind2") }}
                            </div>
                          </template>
                          <template #icon>
                            <InfoCircleOutlined style="color: green" />
                          </template>
                          <img style="object-fit: contain; transform: translateY(-2px); margin-left:2px" src="@/assets/img/img91.png" @mouseenter="showPopconfirm(2)" @mouseleave="hidePopconfirm(2)">
                        </a-popconfirm>
                      </div>
                    </div>

                    <div style="display: flex; align-items: center">
                      <div style="margin:12px"><a-input v-model:value="basisValue" style="width:80px; margin-right:4px" @blur="basisValueChange()"></a-input></div>
                      <div class="colorse" style="color:#148857; font-size:12px; cursor: pointer" @click="openReferenceValueModel()">
                        {{ t("carbon.message.Select_historical_benchmark_values") }}
                      </div>
                    </div>
                  </div>

                  <div style="font-size:18px; color:#888888">X</div>

                  <div>
                    <div style="margin:12px">{{ t("carbon.message.Actual_Output") }}</div>
                    <div style="display:flex; align-items: center; margin:12px">
                      <a-input v-model:value="actualOutputValue" style="width:80px" :disabled="actualOutputValueDisable" @blur="actualOutputValueChange()"></a-input>
                      <div style="margin-left:6px" @click="changeDisabled()">
                        <img style="object-fit: contain;" src="@/assets/img/img90.png">
                      </div>
                    </div>
                  </div>

                  <div style="font-size:26px; color:#888888">=</div>

                  <div>
                    <div style="margin:12px">{{ t("carbon.message.Anticipated_allocation_of_carbon_quotas") }}</div>
                    <div style="margin:12px"><a-input v-model:value="forecastDistributeValue" style="width:80px; margin-right:4px" disabled></a-input>tCO₂e</div>
                  </div>
                </div>
              </a-col>
            </a-row>

            <a-row :gutter="24" v-if="forecastType == '1' && activeKey == '2'">
              <a-col :span="24">
                <div style="display: flex; gap:32px; align-items: center; background-color:#FBFBFB; margin-top:12px; padding:12px">
                  <div>
                    <div style="display:flex; gap:4px; margin:12px 12px 4px 12px">
                      <div>{{ t("carbon.message.Reference_Value") }}</div>
                      <div>
                        <a-popconfirm
                            :visible="popconfirmVisible2"
                            @visibleChange="handleOpenChange(2)"
                            :cancel-button-props="{ style: { display: 'none' } }"
                            :ok-button-props="{ style: { display: 'none' } }">
                          <template #title>
                            <div style="margin-bottom: 6px">{{ t("carbon.message.Instructions") }}<InfoCircleOutlined style="color: green" /></div>
                            <div style="color: #888888; width: 300px; word-wrap: break-word; white-space: normal;">
                              {{ t("carbon.message.remind2") }}
                            </div>
                          </template>
                          <template #icon>
                            <InfoCircleOutlined style="color: green" />
                          </template>
                          <img style="object-fit: contain; transform: translateY(-2px); margin-left:2px" src="@/assets/img/img91.png" @mouseenter="showPopconfirm(2)" @mouseleave="hidePopconfirm(2)">
                        </a-popconfirm>
                      </div>
                    </div>

                    <div style="display: flex; align-items: center">
                      <div style="margin:12px"><a-input v-model:value="nextYearBasisValue" style="width:80px; margin-right:4px" @blur="basisValueChange()"></a-input></div>
                      <div style="color:#148857; font-size:12px; cursor: pointer" @click="openReferenceValueModel()">
                        {{ t("carbon.message.Select_historical_benchmark_values") }}
                      </div>
                    </div>
                  </div>

                  <div style="font-size:18px; color:#888888">X</div>

                  <div>
                    <div style="margin:12px">{{ t("carbon.message.Actual_Output") }}</div>
                    <div style="display:flex; align-items: center; margin:12px">
                      <a-input v-model:value="nextYearactualOutputValue" style="width:80px" :disabled="actualOutputValueDisable" @blur="actualOutputValueChange()"></a-input>
                      <div style="margin-left:6px" @click="changeDisabled()">
                        <img style="object-fit: contain;" src="@/assets/img/img90.png">
                      </div>
                    </div>
                  </div>

                  <div style="font-size:26px; color:#888888">=</div>

                  <div>
                    <div style="margin:12px">{{ t("carbon.message.Anticipated_allocation_of_carbon_quotas") }}</div>
                    <div style="margin:12px"><a-input v-model:value="nextYearForecastDistributeValue" style="width:80px; margin-right:4px" disabled></a-input>tCO₂e</div>
                  </div>
                </div>
              </a-col>
            </a-row>

            <a-row :gutter="24" v-if="forecastType == '2' && activeKey == '1'">
              <a-col :span="24">
                <div style="display: flex; gap:32px; align-items: center; background-color:#FBFBFB; margin-top:12px; padding:12px">
                  <div>
                    <div style="margin:12px">{{ t("carbon.message.Historical_unit_carbon_emissions") }}
                      <a-popconfirm
                          :visible="popconfirmVisible3"
                          @visibleChange="handleOpenChange(3)"
                          :cancel-button-props="{ style: { display: 'none' } }"
                          :ok-button-props="{ style: { display: 'none' } }">
                        <template #title>
                          <div style="margin-bottom: 6px">{{ t("carbon.message.Instructions") }}<InfoCircleOutlined style="color: green" /></div>
                          <div style="color: #888888; width: 300px; word-wrap: break-word; white-space: normal;">
                            {{ t("carbon.message.remind3") }}
                          </div>
                        </template>
                        <template #icon>
                          <InfoCircleOutlined style="color: green" />
                        </template>
                        <img style="object-fit: contain; transform: translateY(-2px); margin-left:2px" src="@/assets/img/img91.png" @mouseenter="showPopconfirm(3)" @mouseleave="hidePopconfirm(3)">
                      </a-popconfirm>
                    </div>
                    <div style="margin:12px"><a-input v-model:value="historyUnitCarbonEmissions" style="width:80px; margin-right:4px" disabled></a-input>tCO₂e/t</div>
                  </div>

                  <div style="font-size:18px; color:#888888">X</div>

                  <div>
                    <div style="margin:12px 12px 0px 12px">{{ t("carbon.message.Actual_Output") }}</div>
                    <div style="display:flex; align-items: center;">
                      <div style="margin:12px"><a-input v-model:value="actualOutputValue" style="width:80px" :disabled="actualOutputValueDisable" @blur="actualOutputValueChange()"></a-input></div>
                      <div style="margin-left:6px" @click="changeDisabled()">
                        <img style="object-fit: contain;" src="@/assets/img/img90.png">
                      </div>
                    </div>
                  </div>

                  <div style="font-size:18px; color:#888888">X</div>

                  <div>
                    <div style="display:flex; gap:4px; margin:12px">
                      <div>{{ t("carbon.message.Adjustment_coefficient") }}</div>
                      <a-popconfirm
                          :visible="popconfirmVisible4"
                          @visibleChange="handleOpenChange(4)"
                          :cancel-button-props="{ style: { display: 'none' } }"
                          :ok-button-props="{ style: { display: 'none' } }">
                        <template #title>
                          <div style="margin-bottom: 6px">{{ t("carbon.message.Instructions") }}<InfoCircleOutlined style="color: green" /></div>
                          <div style="color: #888888; width: 300px; word-wrap: break-word; white-space: normal;">
                            {{ t("carbon.message.remind4") }}
                          </div>
                        </template>
                        <template #icon>
                          <InfoCircleOutlined style="color: green" />
                        </template>
                        <img style="object-fit: contain;" src="@/assets/img/img91.png" @mouseenter="showPopconfirm(4)" @mouseleave="hidePopconfirm(4)">
                      </a-popconfirm>
                    </div>

                    <div style="margin:12px"><a-input v-model:value="adjustmentValue" style="width:80px" @blur="adjustmentValueChange()"></a-input></div>
                  </div>

                  <div style="font-size:26px; color:#888888">=</div>

                  <div>
                    <div style="margin:12px">{{ t("carbon.message.Anticipated_allocation_of_carbon_quotas") }}</div>
                    <div style="margin:12px"><a-input v-model:value="forecastDistributeValue" style="width:80px; margin-right:4px" disabled></a-input>tCO₂e</div>
                  </div>
                </div>
              </a-col>
            </a-row>

            <a-row :gutter="24" v-if="forecastType == '2' && activeKey == '2'">
              <a-col :span="24">
                <div style="display: flex; gap:32px; align-items: center; background-color:#FBFBFB; margin-top:12px; padding:12px">
                  <div>
                    <div style="margin:12px">{{ t("carbon.message.Historical_unit_carbon_emissions") }}
                      <a-popconfirm
                          :visible="popconfirmVisible3"
                          @visibleChange="handleOpenChange(3)"
                          :cancel-button-props="{ style: { display: 'none' } }"
                          :ok-button-props="{ style: { display: 'none' } }">
                        <template #title>
                          <div style="margin-bottom: 6px">{{ t("carbon.message.Instructions") }}<InfoCircleOutlined style="color: green" /></div>
                          <div style="color: #888888; width: 300px; word-wrap: break-word; white-space: normal;">
                            {{ t("carbon.message.remind3") }}
                          </div>
                        </template>
                        <template #icon>
                          <InfoCircleOutlined style="color: green" />
                        </template>
                        <img style="object-fit: contain; transform: translateY(-2px); margin-left:2px" src="@/assets/img/img91.png" @mouseenter="showPopconfirm(3)" @mouseleave="hidePopconfirm(3)">
                      </a-popconfirm>
                    </div>
                    <div style="margin:12px"><a-input v-model:value="nextYearHistoryUnitCarbonEmissions" style="width:80px; margin-right:4px" disabled></a-input>tCO₂e/t</div>
                  </div>

                  <div style="font-size:18px; color:#888888">X</div>

                  <div>
                    <div style="margin:12px 12px 0px 12px">{{ t("carbon.message.Actual_Output") }}</div>
                    <div style="display:flex; align-items: center;">
                      <div style="margin:12px"><a-input v-model:value="nextYearactualOutputValue" style="width:80px" :disabled="actualOutputValueDisable" @blur="actualOutputValueChange()"></a-input></div>
                      <div style="margin-left:6px" @click="changeDisabled()">
                        <img style="object-fit: contain;" src="@/assets/img/img90.png">
                      </div>
                    </div>
                  </div>

                  <div style="font-size:18px; color:#888888">X</div>

                  <div>
                    <div style="display:flex; gap:4px; margin:12px">
                      <div>{{ t("carbon.message.Adjustment_coefficient") }}</div>
                      <a-popconfirm
                          :visible="popconfirmVisible4"
                          @visibleChange="handleOpenChange(4)"
                          :cancel-button-props="{ style: { display: 'none' } }"
                          :ok-button-props="{ style: { display: 'none' } }">
                        <template #title>
                          <div style="margin-bottom: 6px">{{ t("carbon.message.Instructions") }}<InfoCircleOutlined style="color: green" /></div>
                          <div style="color: #888888; width: 300px; word-wrap: break-word; white-space: normal;">
                            {{ t("carbon.message.remind4") }}
                          </div>
                        </template>
                        <template #icon>
                          <InfoCircleOutlined style="color: green" />
                        </template>
                        <img style="object-fit: contain;" src="@/assets/img/img91.png" @mouseenter="showPopconfirm(4)" @mouseleave="hidePopconfirm(4)">
                      </a-popconfirm>
                    </div>

                    <div style="margin:12px"><a-input v-model:value="nextYearAdjustmentValue" style="width:80px" @blur="adjustmentValueChange()"></a-input></div>
                  </div>

                  <div style="font-size:26px; color:#888888">=</div>

                  <div>
                    <div style="margin:12px">{{ t("carbon.message.Anticipated_allocation_of_carbon_quotas") }}</div>
                    <div style="margin:12px"><a-input v-model:value="nextYearForecastDistributeValue" style="width:80px; margin-right:4px" disabled></a-input>tCO₂e</div>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>

        <div style="margin:16px 0px 16px 16px; padding: 16px; background-color: #ffffff;">
          <div style="margin-bottom: 16px; display:flex; justify-content: space-between">
            <div class="text-style" style="margin-bottom: 0px">
              {{ t("carbon.message.Carbon_asset_preset_and_conclusion") }}
            </div>
          </div>
          <div style="margin-bottom: 16px">
            <a-row :gutter="24">
              <a-col :span="8">
                <div class="cardBox" style="background-color: #FBFBFB">
                  <div style="font-size:16px">{{ t("carbon.message.Predict_carbon_asset_volume") }}（tCO₂e）</div>
                  <div v-if="activeKey == '1'">
                    <div style="font-size: 38px; text-align: center">{{ Number((forecastDistributeValue + topLeft.left.carbonQuota).toFixed(4)) }}</div>
                  </div>
                  <div v-else>
                    <div style="font-size: 38px; text-align: center">{{ Number((nextYearForecastDistributeValue + topLeft.left.carbonQuota).toFixed(4)) }}</div>
                  </div>
                </div>
              </a-col>

              <a-col :span="1" style="display: flex; align-items: center; justify-content: center; height: 100%;">
                <div class="cardBox">
                  <div style="font-size: 38px; color:#888888; margin: 0; padding: 0;">-</div>
                </div>
              </a-col>

              <a-col :span="7">
                <div class="cardBox" style="background-color: #FBFBFB">
                  <div style="font-size:16px">{{ t("carbon.message.Carbon_emissions") }}（tCO₂e）</div>
                  <div v-if="activeKey == '1'">
                    <div style="font-size: 38px; text-align: center">{{ calculateYearTotalEmission }}</div>
                  </div>
                  <div v-else>
                    <div v-if="active1 == true" style="font-size: 38px; text-align: center">{{ Number(prediction.toFixed(4)) }}</div>
                    <div v-if="active2 == true" style="font-size: 38px; text-align: center">{{ Number(wmaPrediction.toFixed(4)) }}</div>
                    <div v-if="active3 == true" style="font-size: 38px; text-align: center">{{ Number(predictedValue.toFixed(4)) }}</div>
                  </div>
                </div>
              </a-col>

              <a-col :span="1" style="display: flex; align-items: center; justify-content: center; height: 100%;">
                <div class="cardBox">
                  <div style="font-size: 38px; color:#888888; margin: 0; padding: 0;">=</div>
                </div>
              </a-col>

              <a-col :span="7">
                <div class="cardBox" style="background-color: #FBFBFB">
                  <div style="font-size:16px">{{ t("carbon.message.surplus") }}</div>

                  <div v-if="Number(surplus) >= 0" style="color: #148958; text-align: center">
                    <span style="font-size: 38px;">{{ Number(surplus.toFixed(4)) }}</span>
                    <span>tCO₂e</span>
                  </div>

                  <div v-else style="color: #D54941; text-align: center">
                    <span style="font-size: 38px;">{{ Number(surplus.toFixed(4)) }}</span>
                    <span>tCO₂e</span>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>

          <div style="padding:12px; background-color: #FEF2F2; margin-bottom: 16px" v-if="Number(surplus) < 0">
            <div class="colorse" style="color:#D64A41;font-size: 24px; font-weight: 500; font-family: PingFang SC, PingFang SC;">{{ t("carbon.message.Conclusion") }}</div>

            <div v-if="topLeft.left.carbonCredit > 0" style="margin:12px 12px 12px 0px;">
              1、{{ t("carbon.message.Current_carbon_credits") }} {{ topLeft.left.carbonCredit }}&nbsp;
              <span v-if="activeKey == '1'">{{ t("carbon.message.Expected_deductible_amount") }} {{ calculateYearTotalEmission }} * 5% = {{ Number((calculateYearTotalEmission * 0.05).toFixed(4)) }}</span>
              <span v-else>
                {{ t("carbon.message.Expected_deductible_amount") }}
                <span v-if="active1 == true">{{ Number(prediction.toFixed(4)) }} * 5% = {{ Number((prediction * 0.05).toFixed(4)) }}</span>
                <span v-if="active2 == true">{{ Number(wmaPrediction.toFixed(4)) }} * 5% = {{ Number((wmaPrediction * 0.05).toFixed(4)) }}</span>
                <span v-if="active3 == true">{{ Number(predictedValue.toFixed(4)) }} * 5% = {{ Number((predictedValue * 0.05).toFixed(4)) }}</span>
              </span>

              <a-popconfirm
                  :visible="popconfirmVisible5"
                  @visibleChange="handleOpenChange(5)"
                  :cancel-button-props="{ style: { display: 'none' } }"
                  :ok-button-props="{ style: { display: 'none' } }">
                <template #title>
                  <div style="margin-bottom: 6px">{{ t("carbon.message.Instructions") }}<InfoCircleOutlined style="color: green" /></div>
                  <div style="color: #888888; width: 300px; word-wrap: break-word; white-space: normal;">
                    {{ t("carbon.message.remind5") }}
                  </div>
                </template>
                <template #icon>
                  <InfoCircleOutlined style="color: green" />
                </template>
                <img style="object-fit: contain; transform: translateY(-2px); margin-left:4px" src="@/assets/img/img91.png" @mouseenter="showPopconfirm(5)" @mouseleave="hidePopconfirm(5)">
              </a-popconfirm>
            </div>

            <div style="margin:12px 12px 12px 0px">
              <span v-if="topLeft.left.carbonCredit > 0">2、</span>
              <span v-else>1、</span>
              ⚠️ {{ t("carbon.message.analysis2") }}
              <span v-if="activeKey == '1'">
                {{ currentYear - 1 }}
              </span>
              <span v-else>
                {{ currentYear }}
              </span>
              {{ t("carbon.message.purchase2") }} {{ Number((surplus * -1).toFixed(4)) }} tCO₂e;

              <span v-if="topLeft.left.carbonCredit > 0">
                <span v-if="activeKey == '1'">
                  <span>{{ t("carbon.message.availability") }} {{ Number((calculateYearTotalEmission * 0.05).toFixed(4)) < topLeft.left.carbonCredit ? Number((calculateYearTotalEmission * 0.05).toFixed(4)) : topLeft.left.carbonCredit }} {{ t("carbon.message.Deduction") }}</span>
                </span>
                <span v-else>
                  <span v-if="active1 == true">{{ t("carbon.message.availability") }} {{ Number((prediction * 0.05).toFixed(4)) < topLeft.left.carbonCredit ? Number(prediction.toFixed(4) * 0.05) : topLeft.left.carbonCredit }} {{ t("carbon.message.Deduction") }}</span>
                  <span v-if="active2 == true">{{ t("carbon.message.availability") }} {{ Number((wmaPrediction * 0.05).toFixed(4)) < topLeft.left.carbonCredit ? Number(wmaPrediction.toFixed(4) * 0.05) : topLeft.left.carbonCredit }} {{ t("carbon.message.Deduction") }}</span>
                  <span v-if="active3 == true">{{ t("carbon.message.availability") }} {{ Number((predictedValue * 0.05).toFixed(4)) < topLeft.left.carbonCredit ? Number(predictedValue.toFixed(4) * 0.05) : topLeft.left.carbonCredit }} {{ t("carbon.message.Deduction") }}</span>
                </span>
              </span>
            </div>

            <div style="margin:12px 12px 12px 0px">
              <span v-if="topLeft.left.carbonCredit > 0">3、</span>
              <span v-else>2、</span>
              {{ t("carbon.message.Suggest") }}「<a href="https://www.chinacrc.net.cn/" target="_blank">{{ t("carbon.message.NCTS") }}</a>」{{ t("carbon.message.PurchaseCarbon") }}
            </div>

            <div style="margin:12px 12px 12px 0px">
              <span v-if="topLeft.left.carbonCredit > 0">4、</span>
              <span v-else>3、</span>
              {{ t("carbon.message.SuggestLogging") }}<a href="https://www.chinacrc.net.cn/" target="_blank">碳中登</a>{{ t("carbon.message.CarbonEmissionsExchange") }}{{ t("carbon.message.perform") }}{{ currentYear - 1 }}{{ t("carbon.message.AnnualPayment") }}
            </div>
          </div>

          <div style="padding:12px; background-color: #F7FDF9; margin-bottom: 16px" v-if="Number(surplus) >= 0">
            <div  class="colorse" style="color:#148958;font-size: 24px; font-weight: 500; font-family: PingFang SC, PingFang SC;">{{ t("carbon.message.Conclusion") }}</div>

            <div style="margin:12px 12px 12px 0px">
              1、{{ t("carbon.message.analysis") }}「
              <span v-if="activeKey == '1'">
                {{ currentYear - 1 }}
              </span>
              <span v-else>
                {{ currentYear }}
              </span>
              年」{{ t("carbon.message.purchase") }}
            </div>

            <div style="margin:12px 12px 12px 0px">
              2、{{ t("carbon.message.ExpectedRemaining") }} 「{{ Number((surplus).toFixed(4)) }} tco2e」 {{ t("carbon.message.CarbonAssetQuota") }}，{{ t("carbon.message.value") }} 「{{ surplusValue }}」万元； {{ t("carbon.message.recording") }}
            </div>

            <div style="margin:12px 12px 12px 0px">
              3、{{ t("carbon.message.SuggestLogging") }}<a href="https://www.chinacrc.net.cn/" target="_blank">碳中登</a>{{ t("carbon.message.CarbonEmissionsExchange") }}{{ t("carbon.message.perform") }}{{ currentYear - 1 }}{{ t("carbon.message.AnnualPayment") }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <a-modal :width="1000" v-model:visible="selectReferenceValueModel" :title="t('carbon.message.Select_historical_benchmark_values')" @ok="handleOk">
      <a-table
          ref="tableRef"
          size="middle"
          :scroll="{x:true}"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="referenceValueDataList"
          :rowSelection="{selectedRowKeys: selectedRowKey, onChange: onSelectChange, type:'radio'}"
          :pagination="ipagination"
          :loading="loading"
          class="j-table-force-nowrap">
      </a-table>
    </a-modal>

    <!-- 计划减排量明细 -->
    <a-modal :width="1000" v-model:visible="reductCarbonDetailModel" :title="t('carbon.message.Detail')">
      <template #footer>
        <a-button key="back" @click="handleCancel">关闭</a-button>
      </template>

      <a-table
          ref="tableRef"
          size="middle"
          :scroll="{x:true}"
          bordered
          rowKey="id"
          :columns="reduceCarbonColumns"
          :dataSource="carbonReduceDetailList"
          :pagination="ipagination"
          :loading="loading"
          class="j-table-force-nowrap">
        <template #yearSlot="{ text, record }">
          <div>{{ record.startYear }} - {{ record.endYear }}</div>
        </template>
      </a-table>
    </a-modal>
  </a-card>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import * as math from 'mathjs';
import _ from 'lodash';
import {
  getTypeAndChildren,
  getTopLeft,
  getMidScreen,
  getCreateBy,
  getOrgListByUser,
  queryAssetData,
  queryPrice,
  queryOutput,
  getReferenceValue,
  cacheForecastData,
  getCacheForecastData,
  getCarbonReduce,
  getTotalCarbonEmissions,
  queryOrgDepartTreeList,
  getDictItems
} from './carbonAssetForecast.api';
import { useRouter } from 'vue-router'

const { t } = useI18n();

// refs
const tableRef = ref();

// reactive data
const router = useRouter()
const description = ref<string>('碳资产预测管理页面');
const isAss = ref<boolean>(true);
const queryParam = reactive({});
const dataSource = ref<any[]>([]);
const ipagination = reactive({
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['10', '20', '30'],
  showTotal: (total, range) => {
    return range[0] + '-' + range[1] + ' 共' + total + '条'
  },
  total: 0
});
const tab = ref<string>('1');

// 表头
const foreCastColumns = ref([
  {
    title: '时间',
    align: 'center',
    dataIndex: 'year'
  },
  {
    title: '碳排放量（tCO₂e）',
    align: 'center',
    dataIndex: 'carbonCount',
    slots: { customRender: 'carbonCountSlot' }
  },
  {
    title: '应收（万元）',
    align: 'center',
    dataIndex: 'revenue',
    slots: { customRender: 'revenueSlot' }
  },
  {
    title: '产量（个）',
    align: 'center',
    dataIndex: 'output',
    slots: { customRender: 'outputSlot' }
  },
]);

// 减排明细表头
const reduceCarbonColumns = ref([
  {
    title: '减排类型',
    align: "center",
    dataIndex: 'carbonReduceTypeId_dictText'
  },
  {
    title: '预期减碳量',
    align: "center",
    dataIndex: 'carbonEmission'
  },
  {
    title: '项目名称',
    align: "center",
    dataIndex: 'projectName'
  },
  {
    title: '项目周期',
    align: "center",
    dataIndex: 'endYear',
    slots: { customRender: 'yearSlot' }
  }
]);

// 基准值表头
const columns = ref([
  {
    title: '行业',
    align: "center",
    dataIndex: 'industry'
  },
  {
    title: '年份',
    align: "center",
    dataIndex: 'year'
  },
  {
    title: '基准值',
    align: "center",
    dataIndex: 'referenceValue'
  }
]);

const loading = ref<boolean>(false);
const topLeft = reactive({
  left: {
    total: 0,
    carbonQuota: 0,
    carbonCredit: 0
  },
  right: {
    total: 0,
    carbonQuota: 0,
    carbonCredit: 0
  },
});

// 组织营收数据列表
const orgAssetData = ref<any[]>([]);
// 组织营收数据表格列表
const orgAssetTableData = ref<any[]>([]);

const year = ref<any>(null);
const years = ref<any[]>([]);
const countValue = ref<any[]>([]);
const depts = ref<any[]>([]); //组织

// 左侧部门树相关
const deptTreeData = ref<any[]>([]); // 部门树形数据
const selectedDeptKeys = ref<any[]>([]); // 选中的部门ID（树形组件用）
const selectedDeptId = ref<string>(''); // 选中的部门ID（用于查询）

// 核算年的总排放量
const calculateYearTotalEmission = ref<number>(0);
// 当前可用碳资产
const CurrentlyAvailableCarbonAssets = ref<number>(0);
// 动态获取当前年份
const currentYear = ref<number>(new Date().getFullYear());
// tab值
const activeKey = ref<string>("1");
// 步骤信息
const steps = ref([
  { date: '-2月之前', title: '碳排数据填报', description: `平台<a href="${window._CONFIG['viewBaseUrl']}/carbonInventory/organize/index" target="_blank" >「组织碳排查」</a>填报` },
  { date: '-3月之前', title: '数据报送与核查', description: '登录<a href="https://www.chinacrc.net.cn/" target="_blank" >「中碳登」</a>提交碳排放报告' },
  { date: '-5月31日之前', title: '第三方核查', description: '核定最终确认的排放报告' },
  { date: '7月-9月', title: '获取政府分配碳配额', description: '关注生态环境部文件' },
  { date: '10月-12月', title: '碳资产分析', description: '根据配额与碳排提前规划碳资产' },
  { date: '-12月31日之前', title: '配额清缴', description: '<div>登录 <a href="https://www.chinacrc.net.cn/ " target="_blank" >「中碳登」</a>进行配额清缴</div>' },
]);
const city = ref<any[]>([]);
const marketCityCode = ref<any>(undefined);
const marketCityCodeName = ref<any[]>([]);
// 预测类型
const forecastType = ref<string>('1');
// 基准值
const basisValue = ref<number>(0);
// 下一周期基准值
const nextYearBasisValue = ref<number>(0);
// 实际产量
const actualOutputValue = ref<number>(0);
// 下一周期实际产量
const nextYearactualOutputValue = ref<number>(0);
// 调整系数
const adjustmentValue = ref<number>(0);
// 下一周期调整系数
const nextYearAdjustmentValue = ref<number>(0);
// 历史单位碳排
const historyUnitCarbonEmissions = ref<number>(0);
// 下一年历史单位碳排
const nextYearHistoryUnitCarbonEmissions = ref<number>(0);

// 预测类型样式的激活状态
const active1 = ref<boolean>(true);
const active2 = ref<boolean>(false);
const active3 = ref<boolean>(false);
// 历史数据范围
const historyDataScope = ref<number>(3);
// 当前价格
const currentPrice = ref<number>(0);
// 实际产量的禁用状态
const actualOutputValueDisable = ref<boolean>(true);
// 训练出的数值
const coefficients = ref<any>(undefined);

// 选择历史基准值
const selectReferenceValueModel = ref<boolean>(false);
// 计划减排量明细
const reductCarbonDetailModel = ref<boolean>(false);
// 历史基准值表格数据
const referenceValueDataList = ref<any[]>([]);
// 减排明细表格数据
const carbonReduceDetailList = ref<any[]>([]);
const selectedRowKey = ref<any[]>([]);
const selectionRow = ref<any[]>([]);
// 线性回归预测值
const prediction = ref<number>(0);
// 加权移动平均预测值
const wmaPrediction = ref<number>(0);
// 灰色预测值
const predictedValue = ref<number>(0);
// 计划减排量
const totalReduceCarbon = ref<number>(0);
// 权重map
const weightMap = ref<Map<any, any>>(new Map());
// 提示框
const popconfirmVisible = ref<boolean>(false);
const popconfirmVisible2 = ref<boolean>(false);
const popconfirmVisible3 = ref<boolean>(false);
const popconfirmVisible4 = ref<boolean>(false);
const popconfirmVisible5 = ref<boolean>(false);

// computed
// 计算预计分配碳配额
const forecastDistributeValue = computed(() => {
  if (forecastType.value == '1') {
    return basisValue.value * actualOutputValue.value;
  } else {
    return historyUnitCarbonEmissions.value * actualOutputValue.value * adjustmentValue.value;
  }
});

// 计算下一年预计分配碳配额
const nextYearForecastDistributeValue = computed(() => {
  if (forecastType.value == '1') {
    return nextYearBasisValue.value * nextYearactualOutputValue.value;
  } else {
    return nextYearHistoryUnitCarbonEmissions.value * nextYearactualOutputValue.value * nextYearAdjustmentValue.value;
  }
});

// 计算预测碳资产量
const forecastTotalCarbonValue = computed(() => {
  return forecastDistributeValue.value + topLeft.left.total;
});

// 计算剩余碳配额
const surplus = computed(() => {
  if (activeKey.value == "1") {
    return (forecastDistributeValue.value + topLeft.left.carbonQuota) - calculateYearTotalEmission.value;
  } else {
    if (active1.value == true) {
      return (nextYearForecastDistributeValue.value + topLeft.left.carbonQuota) - prediction.value;
    } else if (active2.value == true) {
      return (nextYearForecastDistributeValue.value + topLeft.left.carbonQuota) - wmaPrediction.value;
    } else {
      return (nextYearForecastDistributeValue.value + topLeft.left.carbonQuota) - predictedValue.value;
    }
  }
});

// 剩余资产价值
const surplusValue = computed(() => {
  return (surplus.value * currentPrice.value / 10000).toFixed(4);
});

// 计算当前可用碳资产预期价值
const valueOfAssets = computed(() => {
  return Number(CarbonCredit.value) + Number(CarbonQuota.value);
});

// 计算当前碳信用
const CarbonCredit = computed(() => {
  return (topLeft.left.carbonCredit * 0).toFixed(2);
});

// 计算当前碳配额
const CarbonQuota = computed(() => {
  return (topLeft.left.carbonQuota * currentPrice.value).toFixed(2);
});

// lifecycle
onMounted(() => {
  loadDeptTree(); // 加载部门树形数据
  getOrgListByUserFunc();
  getCreateBy();
  // 获取城市字典数据
  getData();
});

// methods
function showPopconfirm(flag: number) {
  if (flag == 1) {
    popconfirmVisible.value = true;
  } else if (flag == 2) {
    popconfirmVisible2.value = true;
  } else if (flag == 3) {
    popconfirmVisible3.value = true;
  } else if (flag == 4) {
    popconfirmVisible4.value = true;
  } else {
    popconfirmVisible5.value = true;
  }
}

function hidePopconfirm(flag: number) {
  if (flag == 1) {
    popconfirmVisible.value = false;
  } else if (flag == 2) {
    popconfirmVisible2.value = false;
  } else if (flag == 3) {
    popconfirmVisible3.value = false;
  } else if (flag == 4) {
    popconfirmVisible4.value = false;
  } else {
    popconfirmVisible5.value = false;
  }
}

function handleOpenChange(visible: boolean, flag?: number) {
  // 防止 Popconfirm 内部操作（如点击确认/取消）影响显示状态
  if (flag === 1) {
    popconfirmVisible.value = visible;
  } else if (flag === 2) {
    popconfirmVisible2.value = visible;
  } else if (flag === 3) {
    popconfirmVisible3.value = visible;
  } else if (flag === 4) {
    popconfirmVisible4.value = visible;
  } else if (flag === 5) {
    popconfirmVisible5.value = visible;
  }
}

// 去查看所有
function gotoSeeAll() {
  let url = window._CONFIG['viewBaseUrl'] + "/carbonInventory/asset/CyOrgAssetList"
  window.open(url, '_blank')
}

// 去填写
function gotoFillIn() {
  let url = window._CONFIG['viewBaseUrl'] + "/carbonInventory/asset/CyOrgAssetList"
  window.open(url, '_blank')
}

// 打开计划减排量明细对话框
function openReductCarbonDetailModel() {
  reductCarbonDetailModel.value = true;
}

// 缓存页面数据
async function cachePageData() {
  let cacheData = {
    orgId: undefined,
    deptId: queryParam.deptId,
    year: currentYear.value - 1,
    cycleType: activeKey.value,
    forecastType: forecastType.value,
    // 基准值
    basisValue: basisValue.value,
    // 下一周期基准值
    nextYearBasisValue: nextYearBasisValue.value,
    // 实际产量
    actualOutputValue: actualOutputValue.value,
    // 下一周期实际产量
    nextYearactualOutputValue: nextYearactualOutputValue.value,
    // 调整系数
    adjustmentValue: adjustmentValue.value,
    // 下一周期调整系数
    nextYearAdjustmentValue: nextYearAdjustmentValue.value,
    // 历史单位碳排
    historyUnitCarbonEmissions: historyUnitCarbonEmissions.value,
    // 下一年历史单位碳排
    nextYearHistoryUnitCarbonEmissions: nextYearHistoryUnitCarbonEmissions.value,
    currentYearRevenue: orgAssetTableData.value[orgAssetTableData.value.length - 1].revenue,
    currentYearOutput: orgAssetTableData.value[orgAssetTableData.value.length - 1].output,
    weightMap: Object.fromEntries(weightMap.value) // 将 Map 转为普通对象
  }

  try {
    const res = await cacheForecastData(cacheData);
    console.log(res);
  } catch (error) {
    console.error('Failed to cache page data:', error);
  }
}

function calculateGreyPrediction() {
  // 1. 累加生成（AGO）
  // 将原始数据转换为累加序列，弱化随机性，凸显规律性
  const ago = [orgAssetData.value[0].carbonCount];
  for (let i = 1; i < orgAssetData.value.length; i++) {
    ago.push(ago[i - 1] + orgAssetData.value[i].carbonCount);
  }

  try {
    // 2. 构建矩阵 B 和 向量 Y
    // 构建灰色微分方程的系数矩阵
    const B = [];
    // 向量 Y(存储原始数据,作为方程右侧的常数项)
    const Y = [];

    for (let i = 1; i < ago.length; i++) {
      const z = (ago[i] + ago[i - 1]) / 2; // 均值生成
      B.push([-z, 1]);
      Y.push(orgAssetData.value[i].carbonCount);
    }

    // 使用 math.js 计算
    const Bt = math.transpose(B);  // B 的转置
    const BtB = math.multiply(Bt, B);  // Bt * B
    // const BtBInv = math.inv(BtB);  // 求逆矩阵 (原代码)
    const BtBInv = math.pinv(BtB); // 求伪逆矩阵（遇到矩阵不可逆时修改的代码）
    const BtY = math.multiply(Bt, math.transpose([Y])); // Bt * Y（列向量）

    const a_b = math.multiply(BtBInv, BtY).flat();  // 解方程 [a, b]^T
    const a = a_b[0];
    const b = a_b[1];

    // 4. 预测下一个值（2025年）
    const t = ago.length; // 当前时间点
    const nextAgo = (orgAssetData.value[0].carbonCount - b / a) * Math.exp(-a * (t + 1)) + b / a;
    predictedValue.value = nextAgo - ago[ago.length - 1]; // 累减还原（IAGO）

    console.log("预测后", predictedValue.value)

  } catch (error) {
    console.error("灰色预测计算失败:", error);
  }
}

// 以下为矩阵运算辅助函数（简化版，实际可用数值计算库）
function matrixTranspose(matrix: any[][]) {
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

function matrixMultiply(a: any[][], b: any[][]) {
  const result = [];
  for (let i = 0; i < a.length; i++) {
    result[i] = [];
    for (let j = 0; j < b[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < a[0].length; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

function matrixInverse(matrix: any[][]) {
  // 简化版 2x2 矩阵求逆（实际需更通用实现）
  if (matrix.length === 2 && matrix[0].length === 2) {
    const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    return [
      [matrix[1][1] / det, -matrix[0][1] / det],
      [-matrix[1][0] / det, matrix[0][0] / det],
    ];
  }
  throw new Error("仅支持 2x2 矩阵求逆");
}

function solveLinearEquation(A: any[][], b: any[]) {
  // 解线性方程 Ax = b（简化版，假设 A 是 2x2）
  if (A.length === 2 && A[0].length === 2 && b.length === 2) {
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    const x0 = (b[0] * A[1][1] - b[1] * A[0][1]) / det;
    const x1 = (b[1] * A[0][0] - b[0] * A[1][0]) / det;
    return [x0, x1];
  }
  throw new Error("仅支持 2x2 线性方程");
}

// 保存权重
function saveWeight(year: any, weight: any) {
  weightMap.value.set(year, weight)
  console.log(weightMap.value)
  cachePageData();
}

// 进行预测
function calculateWMA() {
  // 校验权重
  let totalWeight = 0;
  for (let i = 0; i < orgAssetData.value.length; i++) {
    const weight = orgAssetData.value[i].weight;
    totalWeight += weight || 0;
  }
  // 处理精度问题
  totalWeight = Math.round(totalWeight * 100) / 100; // 四舍五入到两位小数
  console.log(totalWeight); // 现在应该是 1.00

  if (totalWeight > 1) {
    // this.$message.error('权重总和不能大于1');
    console.error('权重总和不能大于1');
    wmaPrediction.value = 0
    console.log("权重未校验通过")
    return
  } else {
    if (totalWeight < 1) {
      // this.$message.error('权重总和不能小于1');
      console.error('权重总和不能小于1');
      wmaPrediction.value = 0
      console.log("权重未校验通过")
      return
    }
  }

  console.log("权重校验通过了")
  // 校验数据完整
  for (let i = 0; i < orgAssetData.value.length - 1; i++) {
    if (!orgAssetData.value[i].carbonCount || orgAssetData.value[i].carbonCount == 0) {
      // this.$message.error('数据不完整，请先填写');
      console.error('数据不完整，请先填写');
      return
    }
  }

  // 计算加权和
  let weightedSum = 0;

  for (let i = 0; i < orgAssetData.value.length; i++) {
    weightedSum += (orgAssetData.value[i].weight ? orgAssetData.value[i].weight : 0) * (orgAssetData.value[i].carbonCount ? orgAssetData.value[i].carbonCount : 0)
  }

  // 计算 WMA
  wmaPrediction.value = weightedSum
}

function toOrgCarbonDetail() {
  router.push({
    path: "/carbon/organize/OrganizeInventoryList",
  });
}

// 关闭碳减排明细详情对话框
function handleCancel() {
  reductCarbonDetailModel.value = false
}

// 提交历史基准值
function handleOk() {
  console.log(selectionRow.value)
  if (forecastType.value == '1') {
    basisValue.value = selectionRow.value[0].referenceValue
  } else {
    nextYearBasisValue.value = selectionRow.value[0].referenceValue
  }
  selectReferenceValueModel.value = false

  cachePageData();
}

// 改变历史基准值
function onSelectChange(selectedRowKeyVal: any[], selectionRowVal: any[]) {
  selectedRowKey.value = selectedRowKeyVal;
  selectionRow.value = selectionRowVal;
}

// 基准值改变时，修改redis值
function basisValueChange() {
  // 更新redis中的值
  cachePageData();
}

// 实际产量改变时，修改redis值
function actualOutputValueChange() {
  // 更新redis中的值
  cachePageData();
}

// 调整系数改变时，修改redis值
function adjustmentValueChange() {
  // 更新redis中的值
  cachePageData();
}

// 选择历史基准值
async function openReferenceValueModel() {
  try {
    const res = await getReferenceValue();
    referenceValueDataList.value = res.result.records
  } catch (error) {
    console.error('Failed to get reference value:', error);
  }
  selectReferenceValueModel.value = true;
}

// 使用数据集对数据进行训练
function trainModel() {
  const X = [];
  const y = [];

  for (let i = 0; i < orgAssetData.value.length - 1; i++) {
    X.push([orgAssetData.value[i].revenue, orgAssetData.value[i].output])
    y.push(orgAssetData.value[i].carbonCount)
  }

  // 添加截距项（一列1）
  for (let i = 0; i < X.length; i++) {
    X[i].unshift(1);
  }

  // 计算回归系数: (X'X)^(-1)X'y
  const XT = math.transpose(X);
  const XTX = math.multiply(XT, X);
  // const XTX_inv = math.inv(XTX);  // 原代码
  const XTX_pinv = math.pinv(XTX);  // 使用伪逆（遇到矩阵不可逆的报错时修改的代码）
  const XTy = math.multiply(XT, y);
  // coefficients.value = math.multiply(XTX_inv, XTy);  // 原代码
  coefficients.value = math.multiply(XTX_pinv, XTy);  //（遇到矩阵不可逆的报错时修改的代码）
}

// 多元线性回归(MLR)预测
function predict() {
  // 校验数据
  for (let i = 0; i < orgAssetTableData.value.length - 1; i++) {
    if (!orgAssetTableData.value[i].revenue || !orgAssetTableData.value[i].output || !orgAssetTableData.value[i].carbonCount) {
      // this.$message.error('数据不完整，请先填写');
      console.error('数据不完整，请先填写');
      return
    }
  }
  // 数据通过后，再进行训练
  trainModel();
  // 预测公式: y = b0 + b1*x1 + b2*x2
  const [b0, b1, b2] = coefficients.value;
  // 新数据也需要添加截距项对应的1
  const x1 = orgAssetTableData.value[orgAssetTableData.value.length - 1].revenue;
  const x2 = orgAssetTableData.value[orgAssetTableData.value.length - 1].output;
  prediction.value = b0 + b1 * x1 + b2 * x2;
  // 修改redis中25年的应收与产量值
  cachePageData();
}

// 改变编辑状态
function changeDisabled() {
  actualOutputValueDisable.value = !actualOutputValueDisable.value
}

function tabChange() {
  queryOutputFunc();
}

// 查询碳排强度
async function queryOutputFunc() {
  try {
    // 如果是当前履约周期预测，则查询前一年的
    if (activeKey.value == '1') {
      const res = await queryOutput({ deptId: queryParam.deptId, year: currentYear.value - 1 });
      if (res.success) {
        actualOutputValue.value = res.result.output
        historyUnitCarbonEmissions.value = res.result.outputCarbonIntensity
      }
    } else {
      // 如果是下一履约周期预测，则查询当前年的
      const res = await queryOutput({ deptId: queryParam.deptId, year: currentYear.value });
      if (res.success) {
        nextYearactualOutputValue.value = res.result.output ? res.result.output : 0
        nextYearHistoryUnitCarbonEmissions.value = res.result.outputCarbonIntensity ? res.result.outputCarbonIntensity : 0
      }
    }
  } catch (error) {
    console.error('Failed to query output:', error);
  }
}

async function getOrgListByUserFunc() {
  try {
    const res = await getOrgListByUser();
    if (res.success) {
      depts.value = res.result
    }
  } catch (error) {
    console.error('Failed to get org list by user:', error);
  }
}

// 城市切换重新查询价格
function cityChange() {
  if (marketCityCode.value) {
    queryPriceFunc()
  }
}

// 根据城市查询价格
async function queryPriceFunc() {
  try {
    const res = await queryPrice({ marketCityCode: marketCityCode.value });
    if (res.success) {
      currentPrice.value = res.result
    }
  } catch (error) {
    console.error('Failed to query price:', error);
  }
}

async function getData() {
  try {
    // 获取城市字典
    const res = await getDictItems({
      dictCode: "market_city",
    });
    city.value = res || [];
    marketCityCode.value = res[0].value
    // 根据城市查询价格
    queryPriceFunc();

    marketCityCodeName.value.push(res[0].text);
    console.log("getDictItems product_type =>", res);
  } catch (error) {
    console.error('Failed to get data:', error);
  }
}

// 切换预测类型样式
function toggleActive(flag: number) {
  if (flag == 1) {
    active1.value = true;
    active2.value = false;
    active3.value = false;
    // 切换为多元线性回归(MLR)预测类型时，只需要查询近三年的数据
    historyDataScope.value = 3
    queryAssetDataFunc();
  } else if (flag == 2) {
    active1.value = false;
    active2.value = true;
    active3.value = false;
    queryAssetDataFunc();
  } else {
    active1.value = false;
    active2.value = false;
    active3.value = true;
    queryAssetDataFunc();
  }
}

// 加载部门树形数据
async function loadDeptTree() {
  try {
    const res = await queryOrgDepartTreeList();
    if (res.success) {
      deptTreeData.value = convertToTreeData(res.result)
      let selectedDeptKeysId = []
      selectedDeptKeysId.push(deptTreeData.value[0].key)
      selectedDeptKeys.value = selectedDeptKeysId
      selectedDeptId.value = deptTreeData.value[0].key
      queryParam.deptId = selectedDeptId.value

      // 查询组织应收数据
      queryAssetDataFunc();
      // 查询组织的当前可用碳资产
      getTopLeftFunc();
      // 查询碳排强度
      queryOutputFunc();
      // 查询今年计划减排量
      carbonReduceFunc();
      // 查询核算年的总排放量
      totalCarbonEmissionsFunc();
    }
  } catch (error) {
    console.error('加载部门树失败', error)
  }
}

// 转换部门数据为树形组件格式
function convertToTreeData(data: any[]) {
  return data.map(item => ({
    title: item.departName,
    key: item.id,
    value: item.id,
    children: item.children ? convertToTreeData(item.children) : []
  }))
}

// 切换到该类型时，直接进行预测
function loadForecast() {
  // 校验权重
  let totalWeight = 0;

  for (let i = 0; i < orgAssetData.value.length; i++) {
    if (!orgAssetData.value[i].weight) {
      totalWeight += 0
    } else {
      totalWeight += orgAssetData.value[i].weight
    }
  }

  if (totalWeight > 1) {
    // this.$message.error('权重总和不能大于1');
    console.error('权重总和不能大于1');
    return
  } else {
    if (totalWeight < 1) {
      // this.$message.error('权重总和不能小于1');
      console.error('权重总和不能小于1');
      return
    }
  }

  // 计算加权和
  let weightedSum = 0;

  for (let i = 0; i < orgAssetData.value.length; i++) {
    weightedSum += (orgAssetData.value[i].weight ? orgAssetData.value[i].weight : 0) * (orgAssetData.value[i].carbonCount ? orgAssetData.value[i].carbonCount : 0)
  }

  // 计算 WMA
  wmaPrediction.value = weightedSum;
}

// 处理部门选择事件
async function handleDeptSelect(selectedKeys: string) {
  let selectedDeptKeysId = []
  selectedDeptKeysId.push(selectedKeys)
  selectedDeptKeys.value = selectedDeptKeysId
  selectedDeptId.value = selectedKeys

  // 切换部门后自动查询该部门数据
  queryParam.deptId = selectedDeptId.value
  // 查询组织应收数据
  queryAssetDataFunc();
  // 查询组织的当前可用碳资产
  getTopLeftFunc();
  // 查询碳排强度
  queryOutputFunc();

  // 查询今年计划减排量
  carbonReduceFunc();
  // 查询核算年的总排放量
  totalCarbonEmissionsFunc();
  // 构造请求对象
  let forecastDataCacheRequest =
      {
        deptId: queryParam.deptId,
        year: currentYear.value - 1
      }
  // 加载页面数据
  try {
    const res = await getCacheForecastData(forecastDataCacheRequest);
    console.log("页面缓存的数据", res)

    if (res.result.deptId == queryParam.deptId && res.result.year == currentYear.value - 1) {
      activeKey.value = res.result.cycleType ? res.result.cycleType : "1";
      forecastType.value = res.result.forecastType ? res.result.forecastType : "1";
      basisValue.value = res.result.basisValue ? res.result.basisValue : 0;
      nextYearBasisValue.value = res.result.nextYearBasisValue ? res.result.nextYearBasisValue : 0;

      // 缓存中有数据，则读取缓存中的数据。缓存中没有数据则读取接口的数据

      if (res.result.actualOutputValue) {
        actualOutputValue.value = res.result.actualOutputValue
      }
      if (res.result.nextYearactualOutputValue) {
        nextYearactualOutputValue.value = res.result.nextYearactualOutputValue
      }
      if (res.result.adjustmentValue) {
        adjustmentValue.value = res.result.adjustmentValue
      }
      if (res.result.nextYearAdjustmentValue) {
        nextYearAdjustmentValue.value = res.result.nextYearAdjustmentValue
      }
      if (res.result.historyUnitCarbonEmissions) {
        historyUnitCarbonEmissions.value = res.result.historyUnitCarbonEmissions
      }
      if (res.result.nextYearHistoryUnitCarbonEmissions) {
        nextYearHistoryUnitCarbonEmissions.value = res.result.nextYearHistoryUnitCarbonEmissions
      }

      weightMap.value = new Map(Object.entries(res.result.weightMap));
      const map = new Map(Object.entries(res.result.weightMap));
      // 循环赋值对应的权重
      for (let i = 0; i < orgAssetData.value.length; i++) {
        if (map.get(orgAssetData.value[i].year)) {
          // this.$set(orgAssetData.value[i], 'weight', map.get(orgAssetData.value[i].year))
          orgAssetData.value[i].weight = map.get(orgAssetData.value[i].year);
        }
      }
    }
  } catch (error) {
    console.error('Failed to get cache forecast data:', error);
  }
}

// 查询核算年的总排放量
async function totalCarbonEmissionsFunc() {
  try {
    const res = await getTotalCarbonEmissions({ deptId: queryParam.deptId, year: currentYear.value - 1 });
    if (res.result) {
      calculateYearTotalEmission.value = res.result.totalCarbon
    } else {
      calculateYearTotalEmission.value = 0
    }
  } catch (error) {
    console.error('Failed to get total carbon emissions:', error);
  }
}

// 查询今年计划减排量
async function carbonReduceFunc() {
  try {
    const res = await getCarbonReduce({ projectDeptId: queryParam.deptId, endYear: currentYear.value, pageNo: 1, pageSize: -1 });
    carbonReduceDetailList.value = res.result.records
    // 计算所有明细的总值
    let total = 0
    for (let i = 0; i < carbonReduceDetailList.value.length; i++) {
      total += carbonReduceDetailList.value[i].carbonEmission
    }
    totalReduceCarbon.value = total
  } catch (error) {
    console.error('Failed to get carbon reduce:', error);
  }
}

function handleTableChange(pagination: any, filters: any, sorter: any) {
  //分页、排序、筛选变化时触发
  //TODO 筛选
  console.log(pagination)
  // this.ipagination = pagination
  Object.assign(ipagination, pagination);
}

/**
 * 获取所有组织下的人
 */
async function getCreateBy() {
  try {
    const res = await getCreateBy({
      pageNo: 1,
      pageSize: -1
    });
    if (res.success) {
      // this.createBys = res.result.records
    } else {
      // this.$message.warn(res.message)
      console.warn(res.message)
    }
  } catch (error) {
    console.error('Failed to get create by:', error);
  }
}

// 历史数据范围改变
function historyDataScopeChange(e: any) {
  queryAssetDataFunc();
}

/**
 * 查询组织营收数据
 */
async function queryAssetDataFunc() {
  try {
    const res = await queryAssetData({ deptId: queryParam.deptId, count: historyDataScope.value });
    if (res.success) {
      // 构造今年的预测对象
      let currentYearData = {
        year: currentYear.value + "年预测值",
        carbonCount: "-",
        revenue: 0,
        output: 0,
      }

      // 构造请求对象
      let forecastDataCacheRequest =
          {
            deptId: queryParam.deptId,
            year: currentYear.value - 1
          }
      // 加载页面数据
      try {
        const cacheRes = await getCacheForecastData(forecastDataCacheRequest);
        console.log("页面缓存的数据", cacheRes)

        // this.activeKey = cacheRes.result.cycleType ? cacheRes.result.cycleType : "1";
        forecastType.value = cacheRes.result.forecastType ? cacheRes.result.forecastType : "1";
        basisValue.value = cacheRes.result.basisValue ? cacheRes.result.basisValue : 0;
        nextYearBasisValue.value = cacheRes.result.nextYearBasisValue ? cacheRes.result.nextYearBasisValue : 0;

        // 缓存中有数据，则读取缓存中的数据。缓存中没有数据则读取接口的数据

        if (cacheRes.result.actualOutputValue) {
          actualOutputValue.value = cacheRes.result.actualOutputValue
        }
        if (cacheRes.result.nextYearactualOutputValue) {
          nextYearactualOutputValue.value = cacheRes.result.nextYearactualOutputValue
        }
        if (cacheRes.result.adjustmentValue) {
          adjustmentValue.value = cacheRes.result.adjustmentValue
        }
        if (cacheRes.result.nextYearAdjustmentValue) {
          nextYearAdjustmentValue.value = cacheRes.result.nextYearAdjustmentValue
        }
        if (cacheRes.result.historyUnitCarbonEmissions) {
          historyUnitCarbonEmissions.value = cacheRes.result.historyUnitCarbonEmissions
        }
        if (cacheRes.result.nextYearHistoryUnitCarbonEmissions) {
          nextYearHistoryUnitCarbonEmissions.value = cacheRes.result.nextYearHistoryUnitCarbonEmissions
        }

        if (cacheRes.result.deptId == queryParam.deptId && cacheRes.result.year == currentYear.value - 1) {
          currentYearData.revenue = cacheRes.result.currentYearRevenue ? cacheRes.result.currentYearRevenue : 0;
          currentYearData.output = cacheRes.result.currentYearOutput ? cacheRes.result.currentYearOutput : 0;
          weightMap.value = new Map(Object.entries(cacheRes.result.weightMap));
          const map = new Map(Object.entries(cacheRes.result.weightMap));
          // 循环赋值对应的权重
          for (let i = 0; i < orgAssetData.value.length; i++) {
            if (map.get(orgAssetData.value[i].year)) {
              // this.$set(orgAssetData.value[i], 'weight', map.get(orgAssetData.value[i].year))
              orgAssetData.value[i].weight = map.get(orgAssetData.value[i].year);
            }
          }
        }
      } catch (error) {
        console.error('Failed to get cache forecast data:', error);
      }
      // 设置其他类型的预测的数据
      orgAssetData.value = res.result
      // 灰度预测
      calculateGreyPrediction();

      // // 设置多元线性回归(MLR)预测类型的数据
      orgAssetTableData.value = _.cloneDeep(res.result)
      orgAssetTableData.value.push(currentYearData)
    } else {
      // this.$message.warn(res.message)
      console.warn(res.message)
    }
  } catch (error) {
    console.error('Failed to query asset data:', error);
  }
}

/**
 * 查询组织的当前可用碳资产
 */
async function getTopLeftFunc() {
  try {
    const res = await getTopLeft({ deptId: queryParam.deptId });
    if (res.success) {
      Object.assign(topLeft, res.result);
    } else {
      // this.$message.warn(res.message)
      console.warn(res.message)
    }
  } catch (error) {
    console.error('Failed to get top left:', error);
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/less/common.less';


.colorse{
  color: @primary-color !important;
}
.text-style {
  margin-bottom: 16px;
  font-size: 16px;
  color: #333333;
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-style: normal;
}

.tex-color {
  color: #333333;
}

.year-text {
  color: @primary-color;
  font-weight: bold;
  font-family: DIN, DIN;
}

:deep(.ant-tabs-tab) {
  color: rgba(0, 0, 0, 0.6);
}

:deep(.ant-tree .ant-tree-node-selected) {
  background-color: #ECFFF7 !important;
  color: @primary-color !important;
}

.page-container {
  display: flex;
  background-color: #F5F8F7;
}

.left-tree {
  background: #fff;
  position: relative;
  padding: 10px;
  border-right: 1px solid #e8e8e8;
  width: 12%;

  .select {
    margin-bottom: 10px;
  }
}

.sizeStyle {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  right: -16px;
  width: 16px;
  height: 46px;
  background: #ffffff;
  border-radius: 0px 5px 5px 0px;
  border: 1px solid #e7e7e7;
  z-index: 9;

  img {
    width: 16px;
    height: 16px;
  }
}

.sizeStyle1 {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 0px;
  width: 16px;
  height: 46px;
  background: #ffffff;
  border-radius: 0px 5px 5px 0px;
  border: 1px solid #e7e7e7;
  z-index: 9;

  img {
    width: 16px;
    height: 16px;
  }
}

.right-content {
  flex: 1;
  min-width: 0;
}

.text1 {
  font-weight: 400;
  font-size: 16px;
  color: #333333;
}

.tip {
  font-size: 12px;
  color: #777777;
  margin-left: auto;
  margin-right: 30px;
}

.totalOneCard {
  background-color: #E3F9E9;
  color: #148958;
  height: 32px;
  display: flex;
  align-items: center;
  border-radius: 3px;
}

.totalTwoCard {
  background-color: #FFF1E9;
  color: #E37318;
  height: 32px;
  display: flex;
  align-items: center;
  margin-left: 20px;
  border-radius: 3px;
}

#carbonAssetTrend {
  height: 300px;
}

#assetHoldingAnalysis {
  height: 300px;
}

.innerBox {
  margin: 16px 0px 0px 16px;
  padding: 16px;
  background-color: #ffffff;
}

.card {
  height: 138px;
  background-color: #FDF5F2;
  padding: 12px;
}

.topBox {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  height: 50px;
  background-color: #ffffff;
  padding-left: 15px;
  margin-left: 16px;
  border-bottom: 1px solid #e8e8e8
}

.topBox-inner {
  line-height: 50px;
}

.top-tree {
  background: white;
  position: relative;
  padding: 10px;
  margin-left: 16px;

  .select {
    margin-bottom: 10px;
  }
}

.forecastBox {
  height: 80px;
  text-align: center;
  line-height: 80px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.forecastBox.active {
  background-color: #FBFBFB;
}

:deep(.ant-card-body) {
  padding: 16px;
  background-color: #F5F8F7;
}

.cardBox {
  height: 138px;
  padding: 28px;
}
</style>
