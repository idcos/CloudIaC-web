import isArray from 'lodash/isArray';

export const chartOptions = {
  project_statistics: ({ envActive, envFailed, envInactive } = {}) => {
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
  policy_group: ({ column = [], value = [] } = {}) => {
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
        data: column
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
        data: value,
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
  proportion_of_results: (inputData) => {
    inputData = isArray(inputData) ? inputData : [];
    const nameMap = {
      passed: {
        text: '通过',
        color: '#73DEB3'
      },
      violated: {
        text: '未通过',
        color: '#FF4D4F'
      },
      suppressed: {
        text: '屏蔽',
        color: '#5D7092'
      },
      failed: {
        text: '失败',
        color: '#000000'
      }
    };
    let data = [], names = [], colors = [];
    inputData.forEach(({ name, value }) => {
      const nameCN = nameMap[name]['text'] || name;
      const color = nameMap[name]['color'];
      names.push(nameCN);
      colors.push(color);
      data.push({ name: nameCN, value });
    });
    return { 
      title: {
        text: '检测结果比例',
        subtext: `${names.join('/')}比例`,
        left: 10
      },
      color: colors,
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        left: 10,
        top: 50,
        data: names
      },
      series: [
        {
          name: '检测结果比例',
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
          data: data
        }
      ]
    };
  }, 
  source_has_been_executed: ({ column = [], value = [] } = {}) => {
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
        data: column
      },
      color: '#5AD8A6',
      yAxis: {
        type: 'value'
      },
      series: [{
        data: value,
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
  policy_running_trend: ({ column = [], value = [] } = {}) => {
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
        data: column
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: value,
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
  detect_pass_rate: ({ column = [], value = [] } = {}) => {
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
        data: column
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: value,
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
