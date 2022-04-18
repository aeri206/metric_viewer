
import './App.css';
import {  useEffect, useRef, useState } from 'react';
import {  VegaLite } from 'react-vega'
import Scatterplot from './components/Scatterplot';

import embed from 'vega-embed';

import { Tooltip, ToggleButtonGroup, Button, ToggleButton, Box, InputLabel, MenuItem, FormControl, Select,FormControlLabel, Switch } from '@mui/material';


const spec = {
  "config": {"view": {"continuousWidth": 400, "continuousHeight": 300}},
  "repeat": {
    "row": [
      "DTM_KL1",
      "DTM_KL01",
      "DTM_KL001",
      "RMSE",
      "Sammon",
      "Spearman",
      "Trustworthiness",
      "Continuity",
      "Steadiness",
      "Cohesiveness"
    ],
  },
  "spec": {
    "layer": [
      {
        "mark": "bar",
        "encoding": {
          "color": {"value": "lightgray"},
          "x": {
            "axis": {"labelFontSize": 7, "tickSize": 1, "titleFontSize": 8},
            "bin": {"maxbins": 20},
            "field": {"repeat": "row"},
            "type": "quantitative"
          },
          "y": {"aggregate": "count", "title": null, "type": "quantitative","axis": {"tickMinStep": 1}}
        },
        "height": 50,
        "selection": {"selector009": {"type": "interval", "encodings": ["x"]}},
        "width": 100
      },
      {
        "mark": "bar",
        "encoding": {
          "color": {
            "field": "method",
            "legend": {
              "direction": "vertical",
              "labelFontSize": 8,
              "orient": "top",
              "padding": 0,
              "rowPadding": 0
            },
            "scale": {
              "domain": [
                "densmap",
                "isomap",
                "lda",
                "lle",
                "mds",
                "tsne",
                "pca",
                "trimap",
                "umap"
              ],
              "scheme": "tableau10"
            },
            "type": "nominal"
          },
          "x": {
            "axis": {"labelFontSize": 7, "tickSize": 1, "titleFontSize": 8},
            "bin": {"maxbins": 20},
            "field": {"repeat": "row"},
            "type": "quantitative"
          },
          "y": {"aggregate": "count", "title": null, "type": "quantitative", "axis": {"tickMinStep": 1}}
        },
        "height": 50,
        "transform": [{"filter": {"selection": "selector009"}}],
        "width": 100
      }
    ],
    "data": {"name": "table"},
    "height": 1900
    
  },
  "spacing": 0
  
};
const datasets = {
  "boston": 70,
  "breastcancercoimbra": 70,
  "breastcancerwisconsinprognostic": 70,
  "covertype": 65,
  "dermatology": 70,
  "drybean": 65,
  "echocardiogram": 70,
  "ecoli": 70,
  "extyaleb": 70,
  "glassidentification": 70,
  "heartdisease": 70,
  "hepatitis": 65,
  "housing": 65,
  "iris": 70,
  "mnist64": 70,
  "olive": 70, 
  "weather": 70,
  "wine": 70, 
  "world12d": 70
  }


  const radius = 2.5;

  const metricType = [
    'DTM_KL1',
    'DTM_KL01',
    'DTM_KL001',
    'RMSE',
    'Sammon',
    'Spearman',
    'Trustworthiness',
    'Continuity',
    'Steadiness',
    'Cohesiveness'
    ];

  const metricTooltip = metricType.map(x => {
    return ({
    "type": "quantitative",
    "field": x
  })}).concat([{
    "type": "nominal",
    "field": "idx"
  }, {
    "type": "nominal",
    "field": "method"
  }]);

  

  const filtereds = 
  {"boston": [0, 1, 2, 10, 11, 20, 24, 25, 26, 30, 37, 45, 46, 57, 58, 66],
"breastcancercoimbra": [1, 4, 5, 9, 17, 20, 22, 29, 30, 34, 37, 46, 47, 54, 60],
"breastcancerwisconsinprognostic": [0, 5, 8, 24, 30, 32, 34, 38, 46, 54, 64],
"covertype": [0, 2, 10, 20, 23, 26, 35, 44, 47, 49, 60, 64],
"dermatology": [1, 4, 5, 8, 11, 23, 28, 33, 40, 46, 50, 55, 61, 65, 68],
"drybean": [0, 3, 6, 10, 14, 20, 21, 26, 29, 33, 38, 45, 50, 54, 61, 62, 64],
"echocardiogram": [0, 16, 17, 20, 52, 54, 61],
"ecoli": [0, 1, 10, 18, 20, 21, 22, 23, 46, 47, 55, 62, 66, 67],
"extyaleb": [5, 22, 25, 27, 39, 46, 50, 53, 55, 65, 68],
"glassidentification": [0, 2, 6, 8, 10, 20, 22, 30, 39, 40, 43, 51, 62, 63, 68],
"heartdisease": [0, 2, 8, 10, 11, 13, 21, 31, 33, 43, 45, 64, 68],
"hepatitis": [0, 6, 15, 23, 25, 27, 28, 31, 33, 34, 42, 47, 58],
"housing": [1, 12, 13, 14, 23, 25, 29, 38, 49, 50, 61],
"iris": [0, 3, 20, 21, 22, 29, 37, 46, 53, 66],
"mnist64": [0, 6, 12, 20, 25, 35, 39, 45, 50, 57, 68],
"olive": [0, 9, 10, 20, 33, 34, 47, 49, 59],
"weather": [0, 6, 15, 20, 21, 31, 35, 45, 67, 69],
"wine": [0, 3, 9, 12, 18, 20, 32, 36, 44, 49, 50, 66],
"world12d": [0, 10, 12, 14, 15, 20, 22, 23, 24, 35, 37, 45, 50, 51, 59, 62, 66, 69]}
  function App(props) {

  const [dataset, setDataset] = useState('mnist64');
  const [showChart, setShowChart] = useState(true);

  const [clusterType, SetClusterType] = useState('hdbscan');

  const [drType, setDrType] = useState('tsne');


  const [numLine, setNumLine] = useState(0);
  const [lineUpdate, setLineUpdate] = useState(false);
  
  const list = useRef([]);
  
  
  const metric = require(`/public/data/metric/${dataset}_metrics.json`);
  const kmeans = require(`/public/data/kmeans/clustering_${dataset}.json`);
  const hdbscan = require(`/public/data/hdbscan/clustering_${dataset}.json`);
  // const label = require(`/public/data/ld/${dataset}/label.json`);
  const label = props.labels[dataset];
  
  
  // 

  

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pcpSpecArr = [{
    "data": {"name": "table"},
    "transform":[
      {"window": [{"op": "count", "as": "index"}]},
      {"fold": metricType},
      {
        "joinaggregate": [
          {"op": "min", "field": "value", "as": "min"},
          {"op": "max", "field": "value", "as": "max"}
        ],
        "groupby": ["key"]
      },
      {
        "calculate": "(datum.value - datum.min) / (datum.max-datum.min)",
        "as": "norm_val"
      },
      {
        "calculate": "(datum.min + datum.max) / 2",
        "as": "mid"
      },
    ],
    "layer": [
      {
      "mark": {"type": "rule", "color": "#ccc"},
      "encoding": {
        "detail": {"aggregate": "count"},
        "x": {"field": "key", "sort": metricType}
      }
    },{
      "encoding": {
        "x": {"type": "nominal", "field": "key", "sort": metricType},
        "y": {"value": 0}
      },
      "layer": [{
        "mark": {"type": "text", "style": "label"},
        "encoding": {
          "text": {"aggregate": "max", "field": "max"}
        }
      }, {
        "mark": {"type": "tick", "style": "tick", "size": 8, "color": "#ccc"}
      }]
    },{
      "encoding": {
        "x": {"type": "nominal", "field": "key", "sort": metricType},
        "y": {"value": 100}
      },
      "layer": [{
        "mark": {"type": "text", "style": "label"},
        "encoding": {
          "text": {"aggregate": "min", "field": "mid"}
        }
      }, {
        "mark": {"type": "tick", "style": "tick", "size": 8, "color": "#ccc"}
      }]
    },{
      "encoding": {
        "x": {"type": "nominal", "field": "key", "sort": metricType},
        "y": {"value": 200}
      },
      "layer": [{
        "mark": {"type": "text", "style": "label"},
        "encoding": {
          "text": {"aggregate": "min", "field": "min"}
        }
      }, {
        "mark": {"type": "tick", "style": "tick", "size": 8, "color": "#ccc", "thickness": 3,}
      }]
    },{
      "mark": "line",
      "encoding": {
        "color":{"type": "nominal", "field": "cluster", "legend": {"title": null, "orient": "bottom", "direction": "horizontal","symbolStrokeWidth": 5,"labelFontSize":15, "labelFontWeight":400}},
        "opacity": {"condition": {"param": "select-cluster", "value": 0.6}, "value": 0.1},
        "detail": {"type": "nominal", "field": "index"},
        "x": {"type": "nominal", "field": "key", "sort": metricType},
        "y": {"type": "quantitative", "field": "norm_val", "axis": null},
        "tooltip": metricTooltip
      },
      "params":[{
        "name": "select-cluster",
        "select": {"type": "point", "fields": ["cluster"]},
        "bind": "legend"
      }]
    }
  ],"config": {
    "axisX": {"domain": false, "labelAngle": 0, "tickColor": "#ccc", "title": null},
    "view": {"stroke": null},
    "style": {
      "label": {"baseline": "middle", "align": "right", "dx": -5},
      "tick": {"orient": "horizontal"}
    }
  },
    "width":1200,
    "height":200,
    
  }];

  

  useEffect(async () => {
    
    
    const dr_data = require(`/public/data/${drType}/${dataset}_${drType}.json`);

    const testSpec = {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "description": "A basic bar chart example, with value labels shown upon mouse hover.",
      "width": 300,
      "height": 300,
      "padding": 5,
      "data": [
        {
          "name": "table",
          "values": 
          Object.values(dr_data)
        }
      ],
    
      
    
      "scales": [
        {
          "name": "x",
          "type": "linear",
          "round": true,
          "nice": true,
          "zero": true,
          "domain": {"data": "table", "field": "xpos"},
          "range": "width",
        },
        {
          "name": "y",
          "type": "linear",
          "round": true,
          "nice": true,
          "zero": true,
          "domain": {"data": "table", "field": "ypos"},
          "range": "height"
        },
        {
          "name": "cscale",
          "type": "ordinal",
          "range": "category",
          "domain": {"data": "table", "field": "method"}
        }
      ],
    
      "axes": [
        { "orient": "bottom", "scale": "x" },
        { "orient": "left", "scale": "y" }
      ],
      "legends": [
        {
          "stroke": "cscale",
          "title": "method",
          "padding": 4,
          "encode": {
            "symbols": {
              "enter": {
                "strokeWidth": {"value": 2},
                "size": {"value": 50}
              }
            }
          }
        }
      ],
    
      "marks": [
        {
          "type": "symbol",
          "from": {"data":"table"},
          "encode": {
            "update": {
              "x": {"scale": "x", "field": "xpos"},
              // "width": {"scale": "xscale", "band": 1},
              "y": {"scale": "y", "field": "ypos"},
              "shape": {"value": "circle"},
              // "fill": {"value": "steelblue"}
              "fill": {"scale": "cscale", "field": "method"},
              "stroke": {"scale": "cscale", "field": "method"},
              "strokeWidth": {"value": 2},
              // "stroke": {"field": "method"},
              "opacity": {"value": 0.5},
              "size": {"value":200}
            },
            "hover": {
              "fill": {"value": "red"},
              "stroke": {"value": "red"}
            }
          }
        },
      ]
    }
    const result = await embed('#vis-dr-metric', testSpec);
    
    result.view.addEventListener('click', async (_, item) => { 
      if (item){
        if (item.datum){
          
          const projectionIdx = item.datum.idx;
          const sct = document.querySelector(`#sct${dataset}-${projectionIdx}`);
          if (sct.checked){
            sct.checked = false;
          } else {
            sct.click();
          }
          const ld = require(`/public/data/ld/${dataset}/ld_${projectionIdx}.json`);
          
          const mdpData = ld.map((x, i) =>{return({'xpos': x[0], 'ypos': x[1], 'label': label[i]})})
          const mdpSpec = {
            "$schema": "https://vega.github.io/schema/vega/v5.json",
            "description": "A basic bar chart example, with value labels shown upon mouse hover.",
            "width": 300,
            "height": 300,
            "padding": 5,
            "data": [
              {
                "name": "table",
                "values": mdpData
              }
            ],
          
            
          
            "scales": [
              {
                "name": "x",
                "type": "linear",
                "round": true,
                "nice": true,
                "zero": true,
                "domain": {"data": "table", "field": "xpos"},
                "range": "width",
              },
              {
                "name": "y",
                "type": "linear",
                "round": true,
                "nice": true,
                "zero": true,
                "domain": {"data": "table", "field": "ypos"},
                "range": "height"
              },
              {
                "name": "cscale",
                "type": "ordinal",
                "range": "category",
                "domain": {"data": "table", "field": "label"}
              }
            ],
          
            "axes": [
              { "orient": "bottom", "scale": "x" },
              { "orient": "left", "scale": "y" }
            ],
            "legends": [
              {
                "stroke": "cscale",
                "title": "method",
                "padding": 4,
                "encode": {
                  "symbols": {
                    "enter": {
                      "strokeWidth": {"value": 2},
                      "size": {"value": 50}
                    }
                  }
                }
              }
            ],
          
            "marks": [
              {
                "type": "symbol",
                "from": {"data":"table"},
                "encode": {
                  "update": {
                    "x": {"scale": "x", "field": "xpos"},
                    // "width": {"scale": "xscale", "band": 1},
                    "y": {"scale": "y", "field": "ypos"},
                    "shape": {"value": "circle"},
                    // "fill": {"value": "steelblue"}
                    "fill": {"scale": "cscale", "field": "label"},
                    // "stroke": {"scale": "cscale", "field": "label"},
                    // "strokeWidth": {"value": 2},
                    // "stroke": {"field": "method"},
                    "opacity": {"value": 0.5},
                    "size": {"value":40}
                  },
                }
              },
            ]
          }
          await embed('#vis-mdp', mdpSpec);

        }
      }
    })

  }, [dataset, drType]);
  


  

  return (
    <div className="App">
      <Box alignItems="left">
        <Box sx={{position: "fixed", height: "250px", zIndex: 10, top: '60px', backgroundColor: "white", width: "100%"}}>
          {pcpSpecArr.map(pcpSpec => {
            const data = Object.entries(metric).map(x => ({idx: parseInt(x[0]), ...x[1]})).map(
              x => ({...x, "cluster": x["cluster_"+clusterType] })
            );
            
            // if (clusterType === "hdbscan") {
            //   pcpSpec.transform = [...pcpSpec.transform, {"filter":"datum.cluster_hdbscan != '-1'"}]
            // };
          
            if (numLine > 0 && lineUpdate)
              pcpSpec.transform = [...pcpSpec.transform, {"filter":{"field": "idx", "oneOf": list.current}}]
            
            // lineUpdate.current = false;
            
            return(<VegaLite key={`pcp-vega-${numLine}`} spec={pcpSpec} data={{table: data}}/>)
          })
          }
        </Box>
        <Box sx={{paddingTop: '310px'}}>
        <ToggleButtonGroup
      color="primary"
      value={clusterType}
      exclusive
      onChange={e => {
        SetClusterType(e.target.value);
      }}
    >
      <ToggleButton value="kmeans">K-means</ToggleButton>
      <ToggleButton value="hdbscan">hdbscan</ToggleButton>
    </ToggleButtonGroup>
      <FormControlLabel
        sx={{display:''}}
        control={<Switch checked={showChart} onChange={(e) => {setShowChart(e.target.checked)}}/>}
        label="Metrics" />
      <FormControl 
      >
        <InputLabel id="demo-simple-select-label">Dataset</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={dataset}
          label="dataset"
          onChange={e => {
            setDataset(e.target.value);
            setLineUpdate(false);
            setNumLine(0);
            list.current.forEach(i => {
              
              document.querySelector(`input#sct${dataset}-${i}`).checked = false;
            })
            list.current = [];

          }}
        >
          {
            Object.keys(datasets).map(key => {
              return <MenuItem key={key} value={key}>{key}</MenuItem>
            })
          }
        </Select>
        </FormControl>
        <ToggleButtonGroup
      color="primary"
      value={drType}
      exclusive
      onChange={e => {
        setDrType(e.target.value);
      }}
    >
      <ToggleButton value="tsne">t-SNE</ToggleButton>
      <ToggleButton value="umap">UMAP</ToggleButton>
    </ToggleButtonGroup>
    <Button onClick={
      () => {
        console.log('reset')
        setLineUpdate(false);
        setNumLine(0);
        list.current.forEach(i => {
          document.querySelector(`input#sct${dataset}-${i}`).checked = false;
        })
        list.current = [];
      }
    }>Reset selection</Button>
    <Button>Save selection</Button>
        </Box>
        <Box>
        <Box id="vis-dr-metric" sx={{display:"inline-block"}}>

        </Box>
        <Box id="vis-mdp" sx={{display:"inline-block"}} >

        </Box>
        </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)' }}>
            {Object.entries((clusterType === "hdbscan")? hdbscan: kmeans).map(([cluster, indicies]) => {
            
            const metrics = Object.entries(metric).filter(([key, value]) => {
              return indicies.includes(parseInt(key))
            })

            return(
              <>
              <Box
              component="div"
              key={`cluster-${cluster}`}
              id={`cluster-${cluster}`}
              className="cluster"
              width='100%'
              sx={{
                display: 'inline', m:1
              }}
            >
              <div style={{display: (showChart? 'block': 'none')}}>
              {(cluster === '-1' ? 
              <VegaLite spec={{title: 'outlier', ...spec}} data = {{table: metrics.map(x => x[1])}} />
              :<VegaLite spec={{title: `cluster-${cluster}`, ...spec}} data = {{table: metrics.map(x => x[1])}} />)}
              </div>
              {
                
                indicies.map((i, index) => {
                  return (
                <div  style={{margin: 3}} key={`${dataset}-${i}`}>
                  <Tooltip title={i + ' (' + metrics[index][1].method + ')'}>
                    <Box>
										<Scatterplot
                      doneCheck = {list.current.includes(i)}
                      filtered = {filtereds[dataset].includes(i)}
                      push={() =>{
                        list.current.push(i)
                        setLineUpdate(true);
                        setNumLine(list.current.length)
                      }}
                      pop={() => {
                        list.current.splice(list.current.findIndex(item => item == i), 1)
                        setLineUpdate(true);
                        setNumLine(list.current.length)
                      }}
											projectionIdx={i}
											size={150}
											dataName={dataset}
											label={label}
                      method={metrics[index][1].method}
											radius={radius}
										/>
                    </Box>
                    </Tooltip>
									</div>)
              }

                  )}
            </Box>
            </>)

          })}
            
          </Box>
      </Box>
    </div>
  );
}

export default App;
