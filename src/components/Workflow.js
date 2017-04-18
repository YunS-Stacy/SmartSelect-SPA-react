import React, { Component } from 'react';
import g2, { Shape, Layout, Stat } from 'g2';
import createG2 from 'g2-react';

import {Row,Col} from 'antd';


function renderTree(nodes, edges, dx, chart) {
      chart.clear();
      var height = Math.max(500, 26 / dx); // 最小高度 500
      chart.changeSize(1000, height);
      // 首先绘制 edges，点要在边的上面
      // 创建单独的视图
      var edgeView = chart.createView();
      edgeView.source(edges);
      edgeView.coord().transpose().scale(1, -1); //
      edgeView.axis(false);
      edgeView.tooltip(false);
      // Stat.link 方法会生成 ..x, ..y的字段类型，数值范围是 0-1
      edgeView.edge()
        .position(Stat.link('source*target',nodes))
        .shape('smooth')
        .color('#ccc');
      function strLen(str) {
        var len = 0;
        for (var i = 0; i < str.length; i ++) {
          if(str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
            len ++;
          } else {
            len += 2;
          }
        }
        return len;
      }
      // 创建节点视图
      var nodeView = chart.createView();
      nodeView.coord().transpose().scale(1, -1); //'polar'
      nodeView.axis(false);
      // 节点的x,y范围是 0，1
      // 因为边的范围也是 0,1所以正好统一起来
      nodeView.source(nodes, {
        x: {min: 0,max:1},
        y: {min: 0, max:1},
        value: {min: 0}
      },['id','x','y','name','children','collapsed']); // 由于数据中没有 'collapsed' 字段，所以需要设置所有的字段名称
      nodeView.point().position('x*y').color('steelblue').size('name', function(name) {
        var length = strLen(name);
        return length * 6 + 5 * 2;
      }).label('name', {
        offset: 6,
        labelEmit: true
      })
      .shape('children*collapsed', function(children,collapsed) {
        if (children) {
          if (collapsed) {
            return 'collapsed';
          } else {
            return 'expanded';
          }
        }
        return 'leaf';
      })
      .tooltip('name*id');
      chart.render();
    }
    function drawNode(cfg, group, collapsed, isLeaf) {
      var x = cfg.x;
      var y = cfg.y;
      var pointSize = 5;
      var width = cfg.size;
      var height = 18;
      var label = cfg.label;
      var shape = group.addShape('rect', {
        attrs: {
          x: x,
          y: y - height / 2 ,
          width: width,
          height: height,
          fill: '#fff',
          cursor: isLeaf ? '' : 'pointer',
          stroke: cfg.color
        }
      });
      if (!isLeaf) {
        x = x - pointSize;
        group.addShape('circle', {
          attrs: {
            r: pointSize,
            x: x,
            y: y,
            fill: '#fff',
            stroke: cfg.color // 可以直接设置颜色 cfg.color，也可以使用映射
          }
        });
        var path = [];
        path.push(['M', x - pointSize/2, y]);
        path.push(['L', x + pointSize/2, y]);
        if (collapsed) {
          path.push(['M', x, y - pointSize/2]);
          path.push(['L', x, y + pointSize/2]);
        }
        group.addShape('path', {
          attrs: {
            path: path,
            stroke: cfg.color
          }
        });
      }
      return shape;
    }
    const Chart = createG2(chart => {
      Shape.registShape('point', 'collapsed', {
        drawShape: function(cfg, group) {
          return drawNode(cfg, group, true)
        }
      });
      Shape.registShape('point', 'expanded', {
        drawShape: function(cfg, group) {
          return drawNode(cfg, group, false);
        }
      });
      Shape.registShape('point', 'leaf', {
        drawShape: function(cfg, group) {
          return drawNode(cfg, group, false, true);
        }
      });
      var data = chart.get('data').data;
      // 使用layout，用户可以自己编写自己的layout
      // 仅约定输出的节点 存在 id,x，y字段即可
      var layout = new Layout.Tree({
        nodes: data
      });
      var dx = layout.dx;
      var nodes = layout.getNodes();
      var edges = layout.getEdges();
      chart.animate(false);
      // 不显示title
      chart.tooltip({
        title: null
      });
      chart.legend('children', false);
      chart.legend('name', false);
      renderTree(nodes, edges, dx, chart);
      chart.on('plotclick', function(ev){
        var shape = ev.shape;
        if (shape) {
          var obj = shape.get('origin');
          var id = obj._origin.id;
          var node = layout.findNode(id);
          if (node && node.children) {
            node.collapsed = !node.collapsed ? 1 : 0;
            layout.reset();
            nodes = layout.getNodes();
            edges = layout.getEdges();
            dx = layout.dx;
            renderTree(nodes, edges, dx, chart);
          }
        }
      });
    });

export default class Workflow extends Component {
  state = {
    data: [
      {
        "name": "Predicted Price",
        "children": [
          {
            "name": "Dataset Input",
            "children": [
              {
                "name": "OPA Property Record ",
                "children": [
                  {
                    "name": "SODA API -> CartoDB ",
                    "children": [
                      {
                        "name": "SQL Query ",
                        "children": [
                          {
                            "name": 'Apartment Address'
                          },
                          {
                            "name": 'Vacant Address'
                          },
                          {
                            "name": 'Missing Address'
                          },

                        ]
                      }
                    ]
                  },


                ]
              },
              {
                "name": "Google Geocode API ",
                "children": [
                  {
                    "name": "Geocode Address "
                  }
                ]
              },
              {
                "name": "Zillow API",
                "children": [
                  {
                    "name": "Housing Condition",
                  },
                  {
                    "name": "ZPID ",
                  }
                ]
              },
              {
                "name": "OpenData Philly",
                "children": [
                  {
                    "name": "Location Factors",
                    "children": [
                      {
                        "name": 'Crime Data'
                      },
                      {
                        "name": '311 Request'
                      },
                      {
                        "name": 'Public Transit'
                      },
                      {
                        "name": 'L&I Record'
                      },
                      {
                        "name": 'Zoning'
                      },
                      {
                        "name": 'Amenities'
                      },
                      {
                        "name": 'School Catchment'
                      },

                    ]
                  }
                ]
              },

            ]
          },
          {
            "name": "Variable Selection",
            "children": [
              {
                "name": "Numerical",
                "children": [
                  {
                    "name": "Correlation Coefficient",
                  },
                  {
                    "name": "Boruta Feature Selection",
                  },

                ]
              },

              {
                "name": "Categorical",
                "children": [
                  {
                    "name": "Boruta Feature Selection",
                  },
                ]

              }
            ]
          },
          {
            "name": "Model Selection",
            "children": [
              {
                "name": "OLS Regression",
              },
              {
                "name": "Gradient Boost",
              },
              {
                "name": "Random Forests ",
                "children": [
                  {'name': 'Statistics Index'},
                  {'name': 'K-Fold Cross-Validation'},
                ]
              }
            ]
          }
        ]
      },
    ],
    forceFit: true,
    width: 1500,
    height: 500,
    plotCfg: {
      margin: [20,50]
    },
  }
render(){
  return (
      <Col span={22} offset={1}>
        <Chart
          data={this.state.data}
          width={this.state.width}
          height={this.state.height}
          plotCfg={this.state.plotCfg}
          forceFit={this.state.forceFit}
        />
      </Col>
    );
  }
};