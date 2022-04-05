
import './App.css';
import { useEffect, useRef, useState } from 'react';
import { Vega, VegaLite } from 'react-vega'
import Scatterplot from './components/Scatterplot';

import { Box, InputLabel, MenuItem, FormControl, Select,FormControlLabel, Switch } from '@mui/material';

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

  const pcpSpec = {
    "data": {"name": "table"},
    "transform":[
      {"window": [{"op": "count", "as": "index"}]},
      {"fold": ["Cohesiveness", "Continuity", "Steadiness", "Trustworthiness"]},
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
      }
    ],
    "layer": [{
      "mark": {"type": "rule", "color": "#ccc"},
      "encoding": {
        "detail": {"aggregate": "count"},
        "x": {"field": "key"}
      }
    }, {
      "mark": "line",
      "encoding": {
        "color": {"type": "nominal", "field": "cluster"},
        "detail": {"type": "nominal", "field": "index"},
        "opacity": {"value": 0.3},
        "x": {"type": "nominal", "field": "key"},
        "y": {"type": "quantitative", "field": "norm_val", "axis": null},
        "tooltip": [{
          "type": "quantitative",
          "field": "Cohesiveness"
        }, {
          "type": "quantitative",
          "field": "Steadiness"
        }, {
          "type": "quantitative",
          "field": "Continuity"
        }, {
          "type": "quantitative",
          "field": "Trustworthiness"
        }]
      }
    }, {
      "encoding": {
        "x": {"type": "nominal", "field": "key"},
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
        "x": {"type": "nominal", "field": "key"},
        "y": {"value": 150}
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
        "x": {"type": "nominal", "field": "key"},
        "y": {"value": 300}
      },
      "layer": [{
        "mark": {"type": "text", "style": "label"},
        "encoding": {
          "text": {"aggregate": "min", "field": "min"}
        }
      }, {
        "mark": {"type": "tick", "style": "tick", "size": 8, "color": "#ccc"}
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
    // "mark": "line",
    // "encoding": {
    //   "x": {"field": "key", "type": "nominal"},
    //   // "y": {"field": "value", "type": "quantitative"},
    //   "y": {"type": "quantitative", "field": "value", "axis": null},
    //   "color": {"field": "cluster", "type": "nominal"}
    // },
    "width":500,
    "height":300
  }
    
//   "layer": [
//   {
//     "mark": "line",
//     "encoding": {
//       "color": {"type": "nominal", "field": "cluster"},
//       "detail": {"type": "nominal", "field": "idx"},
//       "opacity": {"value": 0.3},
//       "x": {"type": "nominal", "field": "key"},
//       "y": {"type": "quantitative", "field": "norm_val", "axis": null},
//       "tooltip": [
//         {"type": "quantitative", "field": "key"}]
//       //   {"type": "quantitative", "field": "Beak Depth (mm)"},
//       //   {"type": "quantitative", "field": "Flipper Length (mm)"},
//       //   {"type": "quantitative", "field": "Body Mass (g)"}
//       // ]
//     }
//   }
// ]


function App() {

  const [dataset, setDataset] = useState('mnist64');
  const [showChart, setShowChart] = useState(true);

  
  
  const handleChange = e => {
    setDataset(e.target.value);
  }

  const metric = require(`/public/data/metric/${dataset}_metrics.json`);
  const kmeans = require(`/public/data/kmeans/clustering_${dataset}.json`);
  const label = require(`/public/data/ld/${dataset}/label.json`);

  let list = [];
  

  const metricIdx = Object.entries(metric).map(x => ({idx: parseInt(x[0]), ...x[1]}))
  const pcpRef = useRef(metricIdx);
  console.log(pcpRef.current)
  



  return (
    <div className="App">
      <Box alignItems="left">
      <FormControlLabel
        sx={{display:''}}
        control={<Switch checked={showChart} onChange={(e) => {setShowChart(e.target.checked)}}/>}
        label="Metrics" />
      <FormControl >
        <InputLabel id="demo-simple-select-label">Dataset</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={dataset}
          label="dataset"
          onChange={handleChange}
        >
          {
            Object.keys(datasets).map(key => {
              return <MenuItem key={key} value={key}>{key}</MenuItem>
            })
          }
        </Select>
        </FormControl>
        {/* PCP HERE! */}
        <Box>
        <VegaLite spec={pcpSpec} data={{table: pcpRef.current}}/>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)' }}>
          {Object.values(kmeans).map((indicies, cluster) => {
            const metrics = Object.entries(metric).filter(([key, value]) => {
              return indicies.includes(parseInt(key))
            })
            return(
              <>
            <Box
              component="div"
              key={`cluster-${cluster}`}
              className="cluster"
              width='100%'
              sx={{
                display: 'inline', m:1
              }}
            >
              <div style={{display: (showChart? 'block': 'none')}}>
              <VegaLite spec={spec} data = {{table: metrics.map(x => x[1])}} />
              </div>
              {
                // console.log(indicies, metrics)
                indicies.map((i, index) => {return (
                <div  style={{margin: 3}} key={`${dataset}-${i}`}>
										<div>
											
										</div>
										<Scatterplot
                      push={() =>{
                        list.push(i)
                        console.log(list)
                        console.log(cluster)
                      }}
                      pop={() => {
                        list.pop(i)
                        console.log(list)
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
                  // <Scatterplot
                  // method={metrics[index][1].method}
                  // dataName={dataset}
                  // projectionIdx={i}
                  // size={150}
                  // label={label}
                  // />
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
