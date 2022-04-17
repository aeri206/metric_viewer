import { DataTable, Box, Grommet, Button } from "grommet";
import MDPRow from "./subcomponents/MDPRow";
import { useRef } from "react";

const scagKey = ["outlying","convex","skinny","skewed","clumpy","striated","sparse"];


const Selector = props => {

    const selectedMDPs = useRef({});

    
    let x = 'scag'
    const bucketData = require(`/public/data/${x}_bin.json`);
    
    const columns = [{
        property: "idx",
        header: "idx",
        sortable: true,
        primary: true
    },
        {
            property: "outlying",
            sortable: true,
            header: "outlying",
            render: datum => datum.outlying === "True" ? (<Box style={{fontWeight: 800, color: 'blue'}}>O</Box>) : <Box style={{fontWeight: 800, color:'red'}}>X</Box>
        },
        {
            property: "convex",
            sortable: true,
            header: "convex",
            render: datum => datum.convex === "True" ? (<Box style={{fontWeight: 800, color: 'blue'}}>O</Box>) : <Box style={{fontWeight: 800, color:'red'}}>X</Box>
        },
        {
            property: "skinny",
            sortable: true,
            header: "skinny",
            render: datum => datum.skinny === "True" ? (<Box style={{fontWeight: 800, color: 'blue'}}>O</Box>) : <Box style={{fontWeight: 800, color:'red'}}>X</Box>
        },
        {
            property: "skewed",
            sortable: true,
            header: "skewed",
            render: datum => datum.skewed === "True" ? (<Box style={{fontWeight: 800, color: 'blue'}}>O</Box>) : <Box style={{fontWeight: 800, color:'red'}}>X</Box>
        },
        {
            property: "clumpy",
            sortable: true,
            header: "clumpy",
            render: datum => datum.clumpy === "True" ? (<Box style={{fontWeight: 800, color: 'blue'}}>O</Box>) : <Box style={{fontWeight: 800, color:'red'}}>X</Box>
        },
        {
            property: "striated",
            sortable: true,
            header: "striated",
            render: datum => datum.striated === "True" ? (<Box style={{fontWeight: 800, color: 'blue'}}>O</Box>) : <Box style={{fontWeight: 800, color:'red'}}>X</Box>
        },
        {
            property: "sparse",
            sortable: true,
            header: "sparse",
            render: datum => datum.sparse === "True" ? (<Box style={{fontWeight: 800, color: 'blue'}}>O</Box>) : <Box style={{fontWeight: 800, color:'red'}}>X</Box>

        },{
            header: "#",
            property: "count",
            sortable: true,
            render: datum => (parseInt(datum.mdp.split('/').length - 1))
        },
            {
                property: "MDP",
                header: "MDP",
                sortable: false,
            }
    ]
    
    console.log('selector')
    const theme = {
        global: {
            // font: {
            //     size: "13px"
            // }
        },
        dataTable: {
            body: {
                extend: `font-size: 15px`
            },
    
            header: {
                pad: "3px 0 3px 3px",
                // gap: "small",
                units: {
                    color: "text-xweak",
                    margin: 0
                  },
                  font: {
                      size: "12px",
                      weight: 900
                  }

            }

        }
    }

    return (<Grommet theme={theme}>
        <Box>
            <Button style={{zIndex: 30}} primary label="save selected mdps" onClick={async () => {
                const data = Object.entries(selectedMDPs.current).reduce((acc, curr) => {
                    const key = curr[0];
                    const mdps = curr[1];
                    
                    const base = scagKey.reduce((acc, curr, idx) => {
                        acc[curr] = (key[idx] === "T" ? true : false);
                        return acc;
                    }, {});

                    return acc.concat(mdps.map(mdp => {
                        return({
                            ...base,
                            MDP: mdp
                        })
                    }))
                }, []);
                    const fileName = "selected_mdps.json"
                    const json = JSON.stringify(data);
                    const blob = new Blob([json],{type:'application/json'});
                    const href = await URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = href;
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                
            }}/>
        </Box>
        <DataTable style={{zIndex: 30, backgroundColor: 'white'}}  resizeable sortable 
            columns={columns}
            data={bucketData.map((instance, index) => {
                let MDPs = instance.mdp.split('/')
                MDPs = MDPs.slice(0,MDPs.length-1);
                MDPs.sort(() => (Math.random() - 0.5));
                const scagValue = scagKey.reduce((acc, curr, idx) => {
                    acc += instance[curr] === 'True' ? 'T' : 'F';
                    return acc;
                },"")
                if (selectedMDPs.current[scagValue] === undefined) {
                    selectedMDPs.current[scagValue] = [];
                }
                return({
                    ...instance,
                    idx: index,
                    MDP : (<MDPRow
                        key={`mdprow-${index}`}
                        selection={selectedMDPs.current[scagValue]}
                        scagValue={scagValue}
                        reset={(key, li) => {
                            selectedMDPs.current[key] = selectedMDPs.current[key].filter(item => (!li.includes(item)))
                        }}
                        push={(key, d) => {
                            selectedMDPs.current[key].push(d);
                            selectedMDPs.current[key] = [...new Set(selectedMDPs.current[key])]
                        }}
                        pop={(key, d) => {
                            selectedMDPs.current[key].splice(selectedMDPs.current[key].findIndex(item => item == d), 1);
                        }}
                        MDPs={MDPs} 
                        labels={props.labels}
                        />)
                })
            })}
             />

    </Grommet>)
};

export default Selector;