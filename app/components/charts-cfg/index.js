export const chartOptions = {
  statistic_pie: (data) => {
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
        // data: (data.list || []).map(it => it.state),
        data: [ "活跃环境数量", "部署中环境数量", "失败环境数量", "不活跃环境数量", "待审批环境数量" ],
        icon: 'circle',
        selected: [{ "活跃环境数量": true }, { "部署中环境数量": true }, { "不活跃环境数量": true }, { "失败环境数量": true }, { "待审批环境数量": true }]
      },
      series: [
        {
          name: '姓名',
          type: 'pie',
          left: '50%',
          radius: [ '40%', '70%' ],
          // center: [ '50%', '50%' ],
          data: [{ name: "活跃环境数量", value: 8710 }
            , { name: "部署中环境数量", value: 58889 }
            , { name: "不活跃环境数量", value: 3747 }
            , { name: "失败环境数量", value: 26008 }
            , { name: "待审批环境数量", value: 2220 }],
          label: { 
            show: true, 
            formatter: ' {b}\n{d}%'
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
        // {
        //   name: '请求项状态分布',
        //   type: 'pie',
        //   radius: [ '40%', '50%' ],
        //   avoidLabelOverlap: false,
        //   label: {
        //     formatter: '{b}：{d}%'
        //   },
        //   labelLine: {
        //     smooth: true,
        //     length: 10,
        //     length2: 20
        //   },
        //   // data: (data.list || []).map(it => ({ value: it.num, name: it.state }))
        //   data: data.seriesData
        // }
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
