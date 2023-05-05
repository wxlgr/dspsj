import * as echarts from "echarts";
export default {
  install: (app, options) => {
    // 柱状图
    app.config.globalProperties.$bar = (eleId, data = []) => {
      const bar = echarts.init(document.getElementById(eleId));
      const colors = ["#3498db", "#9b59b6", "#d35400"];
      const titles = data.map((item) => item.title);
      const counts = data.map((item, index) => {
        return {
          value: item.count * 8000,
          itemStyle: {
            color: colors[index],
          },
        };
      });
      const option = {
        title: {
          text: "柱状统计",
        },
        tooltip: {
          trigger: "axis",
        },
        // 往里面缩，类似padding
        grid: {
          left: "2%",
          right: "2%",
          bottom: "2%",
          // 连坐标轴一起
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: titles,
          axisTick: {
            show: true,
            alignWithLabel: true,
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: counts,
            type: "bar",
            barWidth: "50%",
          },
        ],
      };
      bar.setOption(option);
      window.addEventListener("resize", function () {
        bar.resize();
      });
    };

    // 饼状图
    app.config.globalProperties.$pie = (eleId, data = []) => {
      const pie = echarts.init(document.getElementById(eleId));
      const colors = ["#3498db", "#9b59b6", "#d35400"];
      const counts = data.map((item, index) => {
        return {
          value: item.count * 8000,
          name: item.title,
          itemStyle: {
            color: colors[index],
          },
        };
      });
      const option = {
        title: {
          text: "饼状统计",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "right",
        },
        series: [
          {
            type: "pie",
            radius: "60%",
            bottom: "-20%",
            data: counts,
            // 悬浮着重阴影
            emphasis: {
              itemStyle: {
                shadowBlur: 5,
                shadowOffsetX: 3,
                shadowOffsetY: 2,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      pie.setOption(option);
      window.addEventListener("resize", function () {
        pie.resize();
      });
    };
    // 饼状图2
    app.config.globalProperties.$pie2 = (eleId, data = []) => {
      const pie = echarts.init(document.getElementById(eleId));
      const colors = ["#3498db", "#9b59b6", "#d35400"];
      const counts = data.map((item, index) => {
        return {
          value: item.count * 8000,
          name: item.title,
          itemStyle: {
            color: colors[index],
          },
        };
      });
      const option = {
        title: {
          text: "环状统计",
          left:"right"
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "60%"],
            bottom:'-20%',
            label: {
              position: 'inside',
            },
            emphasis: {
              label: {
                show: true,
                fontWeight: 'bold',
                fontSize:36,
              },
              itemStyle: {
                shadowBlur: 5,
                shadowOffsetX: 3,
                shadowOffsetY: 2,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            
            data: counts,
          },
        ],
      };
      pie.setOption(option);
      window.addEventListener("resize", function () {
        pie.resize();
      });
    };
  },
};
