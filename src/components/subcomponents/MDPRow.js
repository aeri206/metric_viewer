import Scatterplot from "../Scatterplot";
import {  Tooltip } from '@mui/material';
import { Box, Button } from "grommet";
import { useRef, useState } from "react";

const MDPRow = props => {
    const { MDPs, labels, scagValue } = props;
    const startIdx = useRef(0);
    
    const [mdpList, updateMDP] = useState(MDPs.slice(0, 5));
    
    return(
    <Box>
        <Box style={{display:"inline-block"}}>
            {
                MDPs.length > 0 && (
                    <Button
                        label="select All"
                        color="lightblue"
                        style={{display:"inline-block"}}
                        onClick={() => {
                            if (mdpList.every(m => document.querySelector(`#sct${m.split('_')[0]}-${parseInt(m.split('_')[1])}`).checked)){
                                mdpList.forEach(m => {
                                    document.querySelector(`#sct${m.split('_')[0]}-${parseInt(m.split('_')[1])}`).click();
                                    
                                })
                            } else {
                                mdpList.forEach(m => {
                                    const btn = document.querySelector(`#sct${m.split('_')[0]}-${parseInt(m.split('_')[1])}`);
                                    if (!btn.checked){
                                        btn.click();
                                    }
                                })
                            }
                        }}
                    />
                )
            }
            {MDPs.length > 5 && (
                <Button   
                label="change"
                color="lightblue"
                style={{display:"inline-block"}}
                onClick={() => {
                    
                    startIdx.current += 5;
                    let newMDPList = [];
                    for (let i = 0 ; i < 5 ; i++){
                        newMDPList.push(MDPs[(startIdx.current + i) % MDPs.length]);
                    }
                    props.reset(scagValue, mdpList.filter(i => !newMDPList.includes(i)));
                    updateMDP(newMDPList);
                }}
            />
            )}
            </Box>
            {MDPs.length > 0 && (
            <Box style={{display:"inline-block"}}>
                {mdpList.map((m) => {
                    const dataName = m.split('_')[0];
                    const projectionIdx = m.split('_')[1];
                    return(
                       <Tooltip title={dataName + '(' + projectionIdx + ')'}>
                           <Box style={{display: "inline-block", margin: "5px"}}>
                                <Scatterplot
                                    doneCheck={props.selection.includes(`${dataName}_${parseInt(projectionIdx)}`)}
                                    key={`mdpsct-${m}`}
                                    dataName={dataName}
                                    projectionIdx={parseInt(projectionIdx)}
                                    label={labels[dataName]}
                                    size={150}
                                    radius={3}
                                    filtered={true}
                                    push={() => props.push(scagValue, `${dataName}_${parseInt(projectionIdx)}`)}
                                    pop={() => props.pop(scagValue, `${dataName}_${parseInt(projectionIdx)}`)}
                                />
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

export default MDPRow;