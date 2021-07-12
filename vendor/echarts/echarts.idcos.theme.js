(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([ 'exports', 'echarts' ], factory);
  } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    // CommonJS
    factory(exports, require('echarts'));
  } else {
    // Browser globals
    factory({}, root.echarts);
  }
}(this, function (exports, echarts) {
  var log = function (msg) {
    if (typeof console !== 'undefined') {
      console && console.error && console.error(msg);
    }
  };
  if (!echarts) {
    log('ECharts is not Loaded');
    return;
  }
  echarts.registerTheme('echarts.idcos.theme', {
    "color": [
      "#4589FF",
      "#47D6CF",
      "#597EF7",
      "#73D13D",
      "#FF7A45",
      "#9254DE",
      "#747E8A",
      "#BAE637",
      "#FFC53D",
      "#FF7875",
      "#FFA940",
      "#F759AB"
    ],
    "backgroundColor": "rgba(0,0,0,0)",
    "textStyle": {},
    "title": {
      "textStyle": {
        "color": "#242424"
      },
      "subtextStyle": {
        "color": "#898989"
      }
    },
    "line": {
      "itemStyle": {
        "borderWidth": 1
      },
      "lineStyle": {
        "width": "2"
      },
      "symbolSize": "4",
      "symbol": "emptyCircle",
      "smooth": true
    },
    "radar": {
      "itemStyle": {
        "borderWidth": 1
      },
      "lineStyle": {
        "width": "2"
      },
      "symbolSize": "4",
      "symbol": "emptyCircle",
      "smooth": true
    },
    "bar": {
      "itemStyle": {
        "barBorderWidth": 0,
        "barBorderColor": "#ffffff"
      }
    },
    "pie": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ffffff"
      }
    },
    "scatter": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ffffff"
      }
    },
    "boxplot": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ffffff"
      }
    },
    "parallel": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ffffff"
      }
    },
    "sankey": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ffffff"
      }
    },
    "funnel": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ffffff"
      }
    },
    "gauge": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ffffff"
      }
    },
    "candlestick": {
      "itemStyle": {
        "color": "#c23531",
        "color0": "#314656",
        "borderColor": "#c23531",
        "borderColor0": "#314656",
        "borderWidth": 1
      }
    },
    "graph": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ffffff"
      },
      "lineStyle": {
        "width": 1,
        "color": "#aaa"
      },
      "symbolSize": "4",
      "symbol": "emptyCircle",
      "smooth": true,
      "color": [
        "#4589FF",
        "#47D6CF",
        "#597EF7",
        "#73D13D",
        "#FF7A45",
        "#9254DE",
        "#747E8A",
        "#BAE637",
        "#FFC53D",
        "#FF7875",
        "#FFA940",
        "#F759AB"
      ],
      "label": {
        "color": "#fafafa"
      }
    },
    "map": {
      "itemStyle": {
        "normal": {
          "areaColor": "#dddddd",
          "borderColor": "#eeeeee",
          "borderWidth": 0.5
        },
        "emphasis": {
          "areaColor": "#fe994e",
          "borderColor": "#444",
          "borderWidth": 1
        }
      },
      "label": {
        "normal": {
          "textStyle": {
            "color": "#c1232b"
          }
        },
        "emphasis": {
          "textStyle": {
            "color": "rgb(100,0,0)"
          }
        }
      }
    },
    "geo": {
      "itemStyle": {
        "normal": {
          "areaColor": "#dddddd",
          "borderColor": "#eeeeee",
          "borderWidth": 0.5
        },
        "emphasis": {
          "areaColor": "#fe994e",
          "borderColor": "#444",
          "borderWidth": 1
        }
      },
      "label": {
        "normal": {
          "textStyle": {
            "color": "#c1232b"
          }
        },
        "emphasis": {
          "textStyle": {
            "color": "rgb(100,0,0)"
          }
        }
      }
    },
    "categoryAxis": {
      "axisLine": {
        "show": true,
        "lineStyle": {
          "color": "#d6d6d6"
        }
      },
      "axisTick": {
        "show": true,
        "lineStyle": {
          "color": "#d6d6d6"
        }
      },
      "axisLabel": {
        "show": true,
        "textStyle": {
          "color": "#333"
        }
      },
      "splitLine": {
        "show": true,
        "lineStyle": {
          "color": [
            "#ebebeb"
          ]
        }
      },
      "splitArea": {
        "show": false,
        "areaStyle": {
          "color": [
            "rgba(250,250,250,0.3)",
            "rgba(200,200,200,0.3)"
          ]
        }
      }
    },
    "valueAxis": {
      "axisLine": {
        "show": true,
        "lineStyle": {
          "color": "#d6d6d6"
        }
      },
      "axisTick": {
        "show": true,
        "lineStyle": {
          "color": "#d6d6d6"
        }
      },
      "axisLabel": {
        "show": true,
        "textStyle": {
          "color": "#333"
        }
      },
      "splitLine": {
        "show": true,
        "lineStyle": {
          "color": [
            "#ebebeb"
          ]
        }
      },
      "splitArea": {
        "show": false,
        "areaStyle": {
          "color": [
            "rgba(250,250,250,0.3)",
            "rgba(200,200,200,0.3)"
          ]
        }
      }
    },
    "logAxis": {
      "axisLine": {
        "show": true,
        "lineStyle": {
          "color": "#d6d6d6"
        }
      },
      "axisTick": {
        "show": true,
        "lineStyle": {
          "color": "#d6d6d6"
        }
      },
      "axisLabel": {
        "show": true,
        "textStyle": {
          "color": "#333"
        }
      },
      "splitLine": {
        "show": true,
        "lineStyle": {
          "color": [
            "#ebebeb"
          ]
        }
      },
      "splitArea": {
        "show": false,
        "areaStyle": {
          "color": [
            "rgba(250,250,250,0.3)",
            "rgba(200,200,200,0.3)"
          ]
        }
      }
    },
    "timeAxis": {
      "axisLine": {
        "show": true,
        "lineStyle": {
          "color": "#27727b"
        }
      },
      "axisTick": {
        "show": true,
        "lineStyle": {
          "color": "#333"
        }
      },
      "axisLabel": {
        "show": true,
        "textStyle": {
          "color": "#333"
        }
      },
      "splitLine": {
        "show": true,
        "lineStyle": {
          "color": [
            "#ccc"
          ]
        }
      },
      "splitArea": {
        "show": false,
        "areaStyle": {
          "color": [
            "rgba(250,250,250,0.3)",
            "rgba(200,200,200,0.3)"
          ]
        }
      }
    },
    "toolbox": {
      "iconStyle": {
        "normal": {
          "borderColor": "#c1232b"
        },
        "emphasis": {
          "borderColor": "#e87c25"
        }
      }
    },
    "legend": {
      "textStyle": {
        "color": "#555555"
      }
    },
    "tooltip": {
      "axisPointer": {
        "lineStyle": {
          "color": "#898989",
          "width": "1"
        },
        "crossStyle": {
          "color": "#898989",
          "width": "1"
        }
      }
    },
    "timeline": {
      "lineStyle": {
        "color": "#293c55",
        "width": 1
      },
      "itemStyle": {
        "normal": {
          "color": "#27727b",
          "borderWidth": "1"
        },
        "emphasis": {
          "color": "#72d4e0"
        }
      },
      "controlStyle": {
        "normal": {
          "color": "#27727b",
          "borderColor": "#27727b",
          "borderWidth": 0.5
        },
        "emphasis": {
          "color": "#27727b",
          "borderColor": "#27727b",
          "borderWidth": 0.5
        }
      },
      "checkpointStyle": {
        "color": "#c1232b",
        "borderColor": "rgba(194,53,49,0.5)"
      },
      "label": {
        "normal": {
          "textStyle": {
            "color": "#293c55"
          }
        },
        "emphasis": {
          "textStyle": {
            "color": "#293c55"
          }
        }
      }
    },
    "visualMap": {
      "color": [
        "#ef5350",
        "rgba(41,182,246,0.86)"
      ]
    },
    "dataZoom": {
      "backgroundColor": "rgba(0,0,0,0)",
      "dataBackgroundColor": "rgba(47,69,84,0.3)",
      "fillerColor": "rgba(167,183,204,0.4)",
      "handleColor": "#a7b7cc",
      "handleSize": "100%",
      "textStyle": {
        "color": "#575757"
      }
    },
    "markPoint": {
      "label": {
        "color": "#eeeeee"
      },
      "emphasis": {
        "label": {
          "color": "#eeeeee"
        }
      }
    }
  });
}));
