import React, { useState } from 'react';
import { DataTable, Box, Grommet, Button, Paragraph } from "grommet";
import {  Tooltip } from '@mui/material';
import Scatterplot from "./Scatterplot";


let x = 'metric'
    
const metricData = require(`/public/data/${x}_some.json`);
    
const getRange = (idx, range) => {

    if (idx > 9){
        return '~' + range[idx].toString();
    } else {
        return range[idx].toString() + '~' + range[idx + 1].toString();
    }
}


const MDPRow = (mdps, labels, ifRandom) => {

    let MDPs = mdps.split('/')
    MDPs.pop();
    if (ifRandom){
        MDPs.sort(() => Math.random() - 0.5);
    }
    
    return(

    <Box>
            {MDPs.length > 0 && (
            <Box style={{display:"inline-block"}}>
                {MDPs.map((m) => {
                    const dataName = m.split('_')[0];
                    const projectionIdx = m.split('_')[1];
                    return(
                       <Tooltip title={dataName + '(' + projectionIdx + ')'} key={`mdpsct-${m}`} sx={{fontSize: '12px'}}>
                           <Box style={{display: "inline-block", margin: "5px"}}>
                                <Scatterplot
                                    dataName={dataName}
                                    projectionIdx={parseInt(projectionIdx)}
                                    label={labels[dataName]}
                                    size={150}
                                    radius={3}
                                    filtered={true}
                                    doneCheck={-1}
                                />
                                <Box>
                                    {Object.entries(metricData[m]).map(([key, value]) => {
                                        return(<Box>{key}: {Math.round(value*1000) / 1000}</Box>)
                                    })
                                    }
                                </Box>
                            </Box>
                        </Tooltip>
                    )
                }
                )
                }
    </Box>
    )}
</Box> 
    )
}

const MetricViewer = (props) => {

    const [ifRandom, setIfRandom] = useState(false);

    const clickRandom = () => setIfRandom(!ifRandom);



    const { labels } = props;
    let x = 'metric'
    const bucketData = require(`/public/data/${x}_binned.json`);
    const metricData = require(`/public/data/${x}_some.json`);
    

    const T_bins = [-0.  ,  0.07,  0.14,  0.21,  0.28,  0.35,  0.42,  0.49,  0.56,
        0.63,  0.7 ];
    const C_bins = [-0.  ,  0.09,  0.17,  0.26,  0.35,  0.43,  0.52,  0.61,  0.69,
        0.78,  0.86];
    const K_bins = [-0. ,  0.1,  0.2,  0.3,  0.4,  0.5,  0.6,  0.7,  0.8,  0.9,  1. ];

    const columns = [{
        property: "idx",
        header: "idx",
        size: "xsmall",
        sortable: true,
        primary: true
    },{
        property: "T",
        header: "Trustworthiness",
        size: "xsmall",
        sortable: true,
    },{
        property: "C",
        header: "Cohesiveness",
        size: "small",
        sortable: true,
    },{
        property: "K",
        header: "DTM_KL01",
        size: "xsmall",
        sortable: true,
    },
    {
        header: "#",
        size: "xsmall",
        property: "count",
        sortable: true,
        render: datum => datum.mdps.split('/').length - 1,

    },
            {
                property: "MDP",
                header: (<Button  primary label={ifRandom ? "sort by dataset" : "random order"} onClick={clickRandom}/>),
                size: "100%",
                sortable: false,
            }
    ]
    

    const theme = {
        global: {
            font: {
                size: "13px"
            }
        },
        dataTable: {
            pin: 'header',
            body: {
                extend: `font-size: 13px !important`,
                border: 'horizontal',
            },
            header: {
                pin:true,
                pad: "3px 3px 3px 3px",
                gap: "small",
                units: {
                    color: "text-xweak",
                    margin: 0
                  },
                  font: {
                      size: "10px",
                      weight: 400
                  }

            }

        }
    }

    return (<Grommet style={{position: "absolute", top: "50px"}} theme={theme}>
        <DataTable style={{zIndex: 30, backgroundColor: 'white'}} sortable fill={true}
            columns={columns}
            data={bucketData.map((instance, index) => {
                // let MDPs = instance.mdp.split('/')
                return({
                    ...instance,
                    idx: index,
                    T: getRange(parseInt(instance.T), T_bins),
                    C: getRange(parseInt(instance.C), C_bins),
                    K: getRange(parseInt(instance.K), K_bins),
                    
                    count: instance.mdps.split('/').length - 1,
                    MDP : MDPRow(instance.mdps ,labels, ifRandom)
                
                })
            })}
             />

    </Grommet>)
}

export default MetricViewer;