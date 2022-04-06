
import './App.css';
import {  useEffect, useRef, useState } from 'react';
import {  VegaLite } from 'react-vega'
import Scatterplot from './components/Scatterplot';

import { ToggleButtonGroup, ToggleButton, Box, InputLabel, MenuItem, FormControl, Select,FormControlLabel, Switch, Typography } from '@mui/material';

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

  

function App() {

  const [dataset, setDataset] = useState('mnist64');
  const [showChart, setShowChart] = useState(true);

  const [clusterType, SetClusterType] = useState('hdbscan');


  const [numLine, setNumLine] = useState(0);
  const [lineUpdate, setLineUpdate] = useState(false);
  
  const list = useRef([]);
  
  
  const metric = require(`/public/data/metric/${dataset}_metrics.json`);
  const kmeans = require(`/public/data/kmeans/clustering_${dataset}.json`);
  const hdbscan = require(`/public/data/hdbscan/clustering_${dataset}.json`);
  const label = require(`/public/data/ld/${dataset}/label.json`);

  

  

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


  return (
    <div className="App">
      <Box alignItems="left">
        <Box sx={{position: "fixed", height: "250px", zIndex: 10, top: '10px', backgroundColor: "white", width: "100%"}}>
          {pcpSpecArr.map(pcpSpec => {
            const data = Object.entries(metric).map(x => ({idx: parseInt(x[0]), ...x[1]})).map(
              x => ({...x, "cluster": x["cluster_"+clusterType] })
            );
            console.log(data);
            
            if (clusterType === "hdbscan") {
              pcpSpec.transform = [...pcpSpec.transform, {"filter":"datum.cluster_hdbscan != '-1'"}]
            };
          
            console.log(lineUpdate, list.current)
            if (numLine > 0 && lineUpdate)
              pcpSpec.transform = [...pcpSpec.transform, {"filter":{"field": "idx", "oneOf": list.current}}]
            
            // lineUpdate.current = false;
            
            return(<VegaLite key={`pcp-vega-${numLine}`} spec={pcpSpec} data={{table: data}}/>)
          })
          }
        </Box>
        <Box sx={{paddingTop: '260px'}}>
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
                // console.log(indicies, metrics)
                indicies.map((i, index) => {return (
                <div  style={{margin: 3}} key={`${dataset}-${i}`}>
										<Scatterplot
                      doneCheck = {list.current.includes(i)}
                      push={() =>{
                        list.current.push(i)
                        setLineUpdate(true);
                        setNumLine(list.current.length)
                        // console.log(list)
                        // console.log(cluster)
                      }}
                      pop={() => {
                        list.current.pop(i)
                        setLineUpdate(true);
                        setNumLine(list.current.length)
                        // console.log(list)
                      }}
											projectionIdx={i}
											size={150}
											dataName={dataset}
											label={label}
                      method={metrics[index][1].method}
											// isLabel={props.isLabel}
											radius={radius}
										/>
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
