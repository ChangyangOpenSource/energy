/**
 * 适用行业  是从 分类字典表中拿到的 id
 */
export const INDUSTRY = '1910278279225225217'

/**
 * 大生命周期
 */
export const LIFE_CYCLE_TYPE_DATA = [
    {name: '从摇篮到大门', value: '1'}, // 相当于小生命周期1，2，3
    {name: '从摇篮到坟墓', value: '2'}, // 相当于小生命周期1，2，3，4，5
    {name: '自定义', value: '3'},
]

/**
 * 小生命周期
 */
export const LIFE_CYCLE_ITEM_DATA = [
    {name: '原材料获取', value: '1'},
    {name: '生产制造', value: '2'},
    {name: '分销和储存', value: '3'},
    {name: '产品使用', value: '4'},
    {name: '废弃处置', value: '5'},
]

/**
 * 柱状图配置项
 * @param barColor  柱状图颜色
 * @param labelData  标签
 * @param valueData  数据
 */
export function commonBarChartOption(barColor, labelData, valueData) {
    return {
        grid: {
            top: 45, // 默认60
            left: '5%', // 默认10%
            right: '2%', // 默认10%
            bottom: 45, // 默认60
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            data: labelData,
            axisLabel: {  // 坐标轴刻度标签
                show: true,
                textStyle: {  // 更改x轴文字样式的配置
                    color: '#777777', // 更改x轴文字颜色
                }
            },
            axisLine: { // x坐标轴轴线
                lineStyle: {
                    color: '#cccccc', // x坐标轴轴线颜色
                    width: 1,  // 网格线的加粗程度
                    type: 'dashed' // 设置为虚线
                }
            },
            axisTick: { //坐标轴刻度
                show: false // 不显示刻度点
            }
        },
        yAxis: {
            type: 'value',
            name: '单位：kgCO₂e',
            splitLine: {  // 坐标轴在grid区域中的分割线
                show: true,  // 是否显示
                lineStyle: { // 网格线样式
                    color: '#cccccc', //网格线颜色
                    width: 1,  //网格线的加粗程度
                    type: 'dashed'    //网格线类型
                }
            },
        },
        series: [
            {
                data: valueData,
                type: 'bar',
                barWidth: 40,
                itemStyle: {
                    color: barColor,
                    // TODO
                    borderRadius: [6, 6, 0, 0] //（顺时针左上，右上，右下，左下）

                    // TODO
                    // 使用回调函数根据数值大小设置圆角
                    // borderRadius: function (params) {
                    //   console.log('borderRadius',params)
                    //   if (params.value > 0) {
                    //     // 正数的圆角在上边
                    //     return [6, 6, 0, 0] //（顺时针左上，右上，右下，左下）
                    //   } else {
                    //     // 负数的圆角在下边
                    //     return [6, 6, 0, 0] //（顺时针左上，右上，右下，左下）
                    //   }
                    // }
                },
                tooltip: {
                    valueFormatter: function (value) {
                        return value + ' kgCO₂e'
                    }
                }
            }
        ]
    }
}

