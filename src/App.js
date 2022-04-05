
import './App.css';
import MetricChart from './components/MetricChart';
import { useState } from 'react';
import { VegaLite } from 'react-vega'
import Scatterplot from './components/Scatterplot';

import { Box, InputLabel, MenuItem, FormControl, Select } from '@mui/material';

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
    "data": {"name": "table"}
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



function App() {

  const [dataset, setDataset] = useState('mnist64');

  const handleChange = e => {
    setDataset(e.target.value);
  }

  const metric = require(`/public/data/metric/${dataset}_metrics.json`);
  const kmeans = require(`/public/data/kmeans/clustering_${dataset}.json`);
  const label = require(`/public/data/ld/${dataset}/label.json`);

  return (
    <div className="App">
      <Box alignItems="left">
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
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)' }}>
          {Object.values(kmeans).map((indicies, cluster) => {
            const metrics = Object.entries(metric).filter(([key, value]) => {
              return indicies.includes(parseInt(key))
            })
            return(
            <Box
              component="div"
              key={`cluster-${cluster}`}
              className="cluster"
              width='100%'
              sx={{
                display: 'inline', m:1
              }}
            >
              <VegaLite spec={spec} data = {{table: metrics.map(x => x[1])}} />
              {
                // console.log(indicies, metrics)
                indicies.map((i, index) => 
                  <Scatterplot
                  method={metrics[index][1].method}
                  dataName={dataset}
                  projectionIdx={i}
                  size={150}
                  label={label}
                  />
                  )
              }
            </Box>)
          })}
        </Box>
      </FormControl>
      </Box>
    </div>
  );
}

export default App;
