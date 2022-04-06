import isArray from 'lodash/isArray';
import { ENV_STATUS } from 'constants/types';
// eslint-disable-next-line no-undef
let colorConfig = new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
  offset: 0,
  color: '#f1f6ff'
}, {
  offset: 0.4,
  color: '#659df7'
}, {
  offset: 0.8,
  color: '#4ec5a9'
}, {
  offset: 1,
  color: '#a6e4d1'

}]);

const formatPercent = (value) => {
  return Math.round(parseFloat(value) * 10000) / 100;
};

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
        areaStyle: {
          normal: {
            //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
            color: colorConfig
          }
        },
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
            color: '#D6F5E9', //折线点的颜色
            lineStyle: {
              width: 6,
              color: colorConfig //折线的颜色
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
        color: '#52CCA3'
      },
      violated: {
        text: '不通过',
        color: '#FF4D4F'
      },
      suppressed: {
        text: '屏蔽',
        color: '#B3CDFF'
      },
      failed: {
        text: '失败',
        color: '#A7282A'
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
        orient: 'vertical',
        right: 10,
        top: 110,
        icon: 'circle',
        formatter: (name) => {
          let total = 0;
          let tarValue;
          for (let i = 0, l = data.length; i < l; i++) {
            total += data[i].value;
            if (data[i].name == name) {
              tarValue = data[i].value;
            }
          }
          const p = formatPercent(total === 0 ? 0 : tarValue / total);
          return `${name}${name !== '不通过' ? '   ' : ''}   ${p}%`;

        },
        data: names
      },
      series: [
        {
          name: '检测结果比例',
          type: 'pie', //设为饼图
          radius: [ '30%', '50%' ], //可调整大小
          center: [ "30%", "50%" ],
          clockWise: true, //默认逆时针
          hoverAnimation: true, //移入放大
          avoidLabelOverlap: false, //避免标注重叠
          label: false,
          data
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
        y2: 100
      },
      title: {
        text: '检测源执行次数',
        subtext: '近5天',
        left: 10
      },
      xAxis: {
        type: 'category',
        data: column,
        show: true,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        splitArea: { show: false },
        axisLabel: { //坐标轴刻度标签的相关设置。
          interval: 0,
          rotate: "45",
          formatter: (val) => {
            return (val || '').length > 10 ? `${val.substring(0, 10)}...` : `${val}`;
          }
        }
      },
      color: '#5AD8A6',
      yAxis: {
        show: false
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
        text: '策略运行趋势',
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
        areaStyle: {
          normal: {
            //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
            color: colorConfig
          }
        },
        symbolSize: 12,
        itemStyle: {
          normal: {
            label: {
              show: true,
              position: 'top'
            },
            color: '#D6F5E9', //折线点的颜色
            lineStyle: {
              width: 6,
              color: colorConfig //折线的颜色
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
        axisLabel: {
          formatter: function (val) {
            return val * 100 + '%';
          }
        },
        axisPointer: {
          label: {
            formatter: function (params) {
              return (params.value * 100).toFixed(1) + '%';
            }
          }
        }
      },
      label: {
        show: true,
        formatter: (params) => {
          return (params.value * 100).toFixed(1) + '%';
        },
        overflow: 'break'
      },
      series: [{
        data: value,
        type: 'line',
        areaStyle: {
          normal: {
            //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
            color: colorConfig
          }
        },
        symbolSize: 12,
        itemStyle: {
          normal: {
            label: {
              show: true,
              position: 'top'
            },
            color: '#D6F5E9', //折线点的颜色
            lineStyle: {
              width: 6,
              color: colorConfig //折线的颜色
            }
          }
        },
        smooth: true
      }]
    };
  },
  unsolved_rate: ({ summary = [] }) => {
    const namemap = {
      high: '高',
      medium: '中',
      low: '低'
    };
    let datas = (summary || []).map(d => ({ name: namemap[d.name], value: d.value }));
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      color: [ '#6699FF', '#A1E6CE', '#52CCA3' ],
      legend: {
        x: 'right', //可设定图例在左、右、居中
        y: 'center', //可设定图例在上、下、居中
        padding: [ 0, 20, 0, 0 ],
        data: [ '高', '中', '低' ],
        width: 50,
        icon: "circle",
        formatter: (name) => {
          let value = datas.find(d => d.name === name).value;
          return `${name}   ${value}`;
        },
        textStyle: {
          fontFamily: 'iacNumberFont'
        }
      },
      series: [
        {
          name: '占比',
          type: 'pie',
          center: [ '40%', '50%' ],
          roseType: 'area',
          label: {
            show: false
          },
          data: datas
        }
      ]
    };
  },
  overview_envs_state: (envStat = []) => {
    const nameMap = {
      active: '#85C836',
      failed: '#FC4E66',
      approving: '#357DFA',
      inactive: '#24292F',
      running: '#26D880'
    };
    const colors = [];
    const showData = envStat.map((val => {
      colors.push(nameMap[val.status]);
      return { name: ENV_STATUS[val.status], value: val.count };
    }));
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        extraCssText: 'z-index: 2'
      },
      color: colors,
      series: [
        {
          name: '环境状态占比',
          type: 'pie',
          // left: '50%',
          radius: [ '50%', '70%' ],
          data: showData,
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
  overview_resouces_type: (resStat = []) => {
    const showData = resStat.map((val) => {
      return { name: val.resType, value: val.count };
    });
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        extraCssText: 'z-index: 2'
      },
      series: [
        {
          name: '资源类型占比',
          type: 'pie',
          // left: '50%',
          radius: [ '50%', '70%' ],
          data: showData,
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
  overview_pro_resource: ({ last_month, this_month } = {}) => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        itemHeight: 6,
        itemWidth: 6,
        left: 11,
        top: 14
      },
      grid: {
        left: 23,
        right: 20,
        top: 52,
        bottom: 31,
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ],
          splitLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '上个月',
          barWidth: '8%',
          barGap: '0%',
          type: 'bar',
          data: last_month
        },
        {
          name: '当月',
          barWidth: '8%',
          barGap: '0%',
          type: 'bar',
          data: this_month
        }
      ]
    };
  },
  overview_resource_tendency: ({ last_month, this_month } = {}) => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        itemHeight: 6,
        itemWidth: 6,
        icon: "rect",
        left: 11,
        top: 14
      },
      grid: {
        left: 23,
        right: 20,
        top: 52,
        bottom: 31,
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ],
          splitLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '上个月',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          smooth: false,
          showSymbol: false,
          emphasis: {
            focus: 'series'
          },
          data: last_month
        },
        {
          name: '当月',
          type: 'line',
          stack: 'Total',
          smooth: false,
          showSymbol: false,
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: this_month
        }
      ]
    };
  },

  cost_type_pie: ({ costTypeStat = [] }) => {
    if (costTypeStat.length === 0) {
      return {
        title: {
          text: '暂无数据',
          x: 'center',
          y: 'center',
          textStyle: {
            fontSize: 12
          }
        }
      };
    }
    return {
      title: {
        text: '当月费用占比',
        textStyle: {
          fontSize: 12
        }
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: [ '50%', '70%' ],
          avoidLabelOverlap: false,
          data: costTypeStat.map(d => ({ name: d.resType, value: d.amount })),
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
  cost_stacked_area: ({ costTrendStat = [] }) => {
    if (costTrendStat.length === 0) {
      return {
        title: {
          text: '暂无数据',
          x: 'center',
          y: 'center',
          textStyle: {
            fontSize: 12
          }
        }
      };
    }
    return {
      legend: {
        itemHeight: 6,
        itemWidth: 6,
        icon: "rect",
        left: 11
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: costTrendStat.map(d => d.date),
          splitLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '当月',
          type: 'line',
          stack: 'Total',
          smooth: false,
          showSymbol: false,
          areaStyle: {},
          itemStyle: {
            normal: {
              lineStyle: {
                width: 2
              }
            }
          },
          emphasis: {
            focus: 'series'
          },
          data: costTrendStat.map(d => d.amount)
        }
      ]
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
