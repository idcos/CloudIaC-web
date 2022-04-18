import isArray from 'lodash/isArray';
import { ENV_STATUS } from 'constants/types';
import moment from 'moment';
import { t } from 'utils/i18n';

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
        data: [ t('define.charts.project_statistics.activeEnvNum'), t('define.charts.project_statistics.failedEnvNum'), t('define.charts.project_statistics.inactiveEnvNum') ],
        icon: 'circle',
        selected: [{ [t('define.charts.project_statistics.activeEnvNum')]: true }, { [t('define.charts.project_statistics.inactiveEnvNum')]: true }, { [t('define.charts.project_statistics.failedEnvNum')]: true }]
      },
      series: [
        {
          name: t('define.charts.project_statistics.envProportion'),
          type: 'pie',
          left: '50%',
          radius: [ '40%', '70%' ],
          data: [
            { name: t('define.charts.project_statistics.activeEnvNum'), value: envActive || 0 },
            { name: t('define.charts.project_statistics.inactiveEnvNum'), value: envInactive || 0 },
            { name: t('define.charts.project_statistics.failedEnvNum'), value: envFailed || 0 }
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
  proportion_of_results: (inputData) => {
    inputData = isArray(inputData) ? inputData : [];
    const nameMap = {
      passed: {
        text: t('define.charts.proportion_of_results.status.passed'),
        color: '#52CCA3'
      },
      violated: {
        text: t('define.charts.proportion_of_results.status.violated'),
        color: '#FF4D4F'
      },
      suppressed: {
        text: t('define.charts.proportion_of_results.status.suppressed'),
        color: '#B3CDFF'
      },
      failed: {
        text: t('define.charts.proportion_of_results.status.failed'),
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
        text: t('define.charts.proportion_of_results.title'),
        subtext: `${names.join('/')}${t('define.charts.proportion_of_results.proportion')}`,
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
          return `${name}${name !== nameMap.violated.text ? '   ' : ''}   ${p}%`;

        },
        data: names
      },
      series: [
        {
          name: t('define.charts.proportion_of_results.title'),
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
        text: t('define.charts.source_has_been_executed.title'),
        subtext: t('define.charts.source_has_been_executed.subTitle'),
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
        text: t('define.charts.policy_running_trend.title'),
        subtext: t('define.charts.policy_running_trend.subTitle')
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
        text: t('define.charts.detect_pass_rate.title'),
        subtext: t('define.charts.detect_pass_rate.subTitle')
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
      high: t('define.charts.unsolved_rate.name.high'),
      medium: t('define.charts.unsolved_rate.name.medium'),
      low: t('define.charts.unsolved_rate.name.low')
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
        data: [ t('define.charts.unsolved_rate.name.high'), t('define.charts.unsolved_rate.name.medium'), t('define.charts.unsolved_rate.name.low') ],
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
          name: t('define.charts.unsolved_rate.name.proportion'),
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
      destroyed: '#24292F',
      inactive: '#faad14',
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
          name: t('define.charts.overview_envs_state.envStateProportion'),
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
          name: t('define.charts.overview_resouces_type.resoucesTypeProportion'),
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
  overview_pro_resource: ({ last_month = [], this_month = [] } = {}) => {
    const xData = last_month.map((it) => it.resType);
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
          data: xData,
          axisTick: { show: false },
          splitLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          axisTick: { show: false },
          type: 'value'
        }
      ],
      series: [
        {
          name: t('define.lastMonth'),
          barWidth: '8%',
          barGap: '0%',
          type: 'bar',
          data: last_month.map(it => it.count)
        },
        {
          name: t('define.thisMonth'),
          barWidth: '8%',
          barGap: '0%',
          type: 'bar',
          data: this_month.map(it => it.count)
        }
      ]
    };
  },
  overview_resource_tendency: (data = []) => {
    const xData = data.map(it => moment(it.date).format('MM/DD'));
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
          data: xData,
          axisTick: { show: false },
          splitLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisTick: { show: false }
        }
      ],
      series: [
        {
          type: 'line',
          stack: 'Total',
          smooth: false,
          showSymbol: false,
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: data.map(it => it.count)
        }
      ]
    };
  },

  cost_type_pie: ({ costTypeStat = [] }) => {
    if (costTypeStat.length === 0) {
      return {
        title: {
          text: t('define.noData'),
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
        text: t('define.charts.cost_type_pie.title'),
        textStyle: {
          fontSize: 12
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: `{b}: {c} (${t('define.money.yuan')})`
      },
      series: [
        {
          type: 'pie',
          radius: [ '50%', '70%' ],
          avoidLabelOverlap: false,
          data: costTypeStat.map(d => ({ name: d.resType, value: d.amount })),
          label: {
            show: true,
            formatter: ' {b}：{d}%',
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
          text: t('define.noData'),
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
        show: false
      },
      tooltip: {
        trigger: 'axis',
        formatter: `{a} <br/>{b}: {c} (${t('define.money.yuan')})`,
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
          name: t('define.thisMonth'),
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
  },
  project_trend_Line: ({ costTypeStat = [] }) => {
    return {
      grid: {
        top: '12px',
        left: "2px",
        right: "2px",
        bottom: "2px",
        height: "50px"
      },
      xAxis: {
        type: 'category',
        data: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ],
        show: false
      },
      yAxis: {
        type: 'value',
        show: false
      },
      series: [
        {
          data: [ 150, 230, 224, 218, 135, 147, 260 ],
          type: 'line',
          symbol: "none",
          itemStyle: {
            normal: {
              lineStyle: {
                width: 2
              }
            }
          }
        },
        {
          data: [ 100, 111, 113, 115, 116, 222, 333 ],
          type: 'line',
          symbol: "none",
          itemStyle: {
            normal: {
              lineStyle: {
                width: 2
              }
            }
          }
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
