import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Selector from './components/Selector';
import reportWebVitals from './reportWebVitals';
import { HashRouter as Router, useRoutes } from "react-router-dom";



let x = 'scag'
const bucketData = require(`/public/data/${x}_bin.json`);

const datasets = [
  'boston', 
  'breastcancercoimbra',
  'breastcancerwisconsinprognostic',
  'covertype',
  'dermatology',
  'drybean',
  'echocardiogram',
  'ecoli',
  'extyaleb',
  'glassidentification',
  'heartdisease',
  'hepatitis',
  'housing', 'iris', 'mnist64', 'olive', 'weather', 'wine', 'world12d']

  const labels = {};

  datasets.forEach(d => {
      labels[d] = require(`/public/data/ld/${d}/label.json`);
  });

  const Pages = () => useRoutes([
    { path: "/", element: <Selector 
      bucketData={bucketData}
      labels={labels}
    />},
    { path: "/clustering", element: <App labels={labels}/> },
  ])

  ReactDOM.render(
  <Router basename={process.env.PUBLIC_URL}>
    <Pages />
  </Router>,
  
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
