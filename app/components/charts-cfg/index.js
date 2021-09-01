export const chartOptions = {
  project_statistics: ({ envActive, envFailed, envInactive }) => {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        extraCssText: 'z-index: 2'
      },
      legend: {
        left: 1,
        top: 'center',
        width: 300,
        itemGap: 10,
        textStyle: {
          width: 60
        },
        data: [ "活跃环境数量", "失败环境数量", "不活跃环境数量" ],
        icon: 'circle',
        selected: [{ "活跃环境数量": true }, { "不活跃环境数量": true }, { "失败环境数量": true }]
      },
      series: [
        {
          name: '环境占比',
          type: 'pie',
          left: '50%',
          radius: [ '40%', '70%' ],
          data: [
            { name: "活跃环境数量", value: envActive || 0 },
            { name: "不活跃环境数量", value: envInactive || 0 },
            { name: "失败环境数量", value: envFailed || 0 }
          ],
          label: { 
            show: true, 
            formatter: ' {b}\n{d}%',
            overflow: 'break'
          },
          labelLine: {
            smooth: true
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  },
  policy_group: (props) => {
    return {
      grid: {
        x: 50,
        y: 60,
        x2: '2%',
        y2: 30
      },
      title: {
        text: '策略组检测通过率',
        subtext: '30天内'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ]
      },
      yAxis: {
        type: 'value',
        max: 100,
        min: 0,
        interval: 25,
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [{
        data: [ 12, 22, 33, 55, 77, 88, 99 ],
        type: 'line',
        areaStyle: {},
        symbolSize: 12,
        itemStyle: {
          normal: {
            label: {
              show: true,
              position: 'top',
              formatter: function(params) {
                return `${params.value}%`;
              }
            },
            color: "#D6F5E9", //折线点的颜色
            lineStyle: {
              width: 6,
              color: "#1890ff" //折线的颜色
            }
          }
        },
        smooth: true
      }]
    };
  },
  proportion_of_results: () => {
    return { 
      title: {
        text: '检测结果比例',
        subtext: '通过/未通过/屏蔽比例',
        left: 10
      },
      color: [ '#73DEB3', '#FF4D4F', '#5D7092' ],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        left: 10,
        top: 50,
        data: [ '通过', '未通过', '屏蔽' ]
      },
      series: [
        {
          name: '数据',
          type: 'pie', //设为饼图
          radius: [ '45%', '75%' ], //可调整大小
          center: [ "50%", "60%" ], 
          clockWise: true, //默认逆时针
          hoverAnimation: false, //移入放大
          avoidLabelOverlap: false, //避免标注重叠
          label: {
            position: 'inside',
            formatter: '{a|{d}%} ',
            rich: {
              a: {
                fontSize: 12,
                color: '#fff'
              }
            }
          },
          data: [
            { value: 100, name: '通过' },
            { value: 100, name: '未通过' },
            { value: 1000, name: '屏蔽' }
          ]
        }
      ]
    };
  }, 
  source_has_been_executed: () => {
    return {
      grid: {
        x: 50,
        y: 60,
        x2: '2%',
        y2: 30
      },
      title: {
        text: '检测源执行次数',
        subtext: '近5天',
        left: 10
      },
      xAxis: {
        type: 'category',
        data: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ]
      },
      color: '#5AD8A6',
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [ 120, 111, 150, 80, 70, 110, 111 ],
        type: 'bar',
        itemStyle: {
          normal: {
            label: {
              show: true,
              position: 'top'
            }
          }
        }
      }]
    };
  },
  policy_running_trend: () => {
    return {
      grid: {
        x: 50,
        y: 60,
        x2: 30,
        y2: 30
      },
      title: {
        text: '策略组检测通过率',
        subtext: '近5天'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ]
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [ 12, 22, 33, 55, 77, 88, 99 ],
        type: 'line',
        areaStyle: {},
        symbolSize: 12,
        itemStyle: {
          normal: {
            label: {
              show: true,
              position: 'top'
            },
            color: "#D6F5E9", //折线点的颜色
            lineStyle: {
              width: 6,
              color: "#17C3C2" //折线的颜色
            }
          }
        },
        smooth: true
      }]
    };
  },
  detect_pass_rate: () => {
    return {
      grid: {
        x: 50,
        y: 60,
        x2: 30,
        y2: 30
      },
      title: {
        text: '检测通过率趋势',
        subtext: '近5天'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ]
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [ 12, 24, 36, 48, 52, 66, 88 ],
        type: 'line',
        areaStyle: {},
        symbolSize: 12,
        itemStyle: {
          normal: {
            label: {
              show: true,
              position: 'top'
            },
            color: "#D6F5E9", //折线点的颜色
            lineStyle: {
              width: 6,
              color: "#17C3C2" //折线的颜色
            }
          }
        },
        smooth: true
      }]
    };
  }
};

export const chartUtils = {

  /**
   * 初始化或更新图表。初始化后无需再次初始化，直接更新即可
   * @param chart 图表描述
   * @param externalData 图表数据
   */
  update: (chartDescriptor, externalData = {}) => {
    const { domRef, key } = chartDescriptor;
    // eslint-disable-next-line no-undef
    chartDescriptor.ins = chartDescriptor.ins || (domRef.current && echarts.init(domRef.current, 'echarts.idcos.theme'));
    if (!chartDescriptor.ins) {
      return;
    }
    if (!chartOptions[key]) {
      throw new Error(`chartId: ${key} not found`);
    }
    chartDescriptor.ins.setOption(chartOptions[key](externalData), true);
  },

  /**
   * @param CHARTS
   * @param externalData
   * 一组值::[any]  Or
   * 所有图表适用的单一值:: any
   */
  updateBatch: (CHARTS, externalData) => {
    if (Array.isArray(externalData)) {
      CHARTS.forEach((chart, I) => chartUtils.update(chart, externalData[I]));
    } else {
      CHARTS.forEach(chart => chartUtils.update(chart, externalData));
    }
  },
  resizeEvent: (CHARTS) => {
    const RESIZE_HANDLE = () => CHARTS.forEach(chart => {
      chart.ins && chart.ins.resize();
    });
    return {
      attach: () => window.addEventListener('resize', RESIZE_HANDLE),
      remove: () => window.removeEventListener('resize', RESIZE_HANDLE),
      resize: RESIZE_HANDLE
    };
  }
};
