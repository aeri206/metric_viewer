import { Typography, Box } from '@mui/material';
import React, { useState } from 'react';
import SplotCanvas from './SplotCanvas';
import './Scatterplot.css';

const Scatterplot = (props) => {

	const [checked, setChecked] = useState(props.doneCheck);
	

	const { size, projectionIdx, dataName, filtered	} = props;
	
	
	const ld = require(`/public/data/ld/${dataName}/ld_${projectionIdx}.json`);
	const metadata = require(`/public/data/ld/${dataName}/metadata_${projectionIdx}.json`);

	

	return (
		<div>
			<Typography variant='body2' sx={{fontSize: "15"}} >
				{projectionIdx + ' (' + props.method + ')'}
			</Typography>
			<input className="sct-check" type="checkbox" id={`sct${dataName}-${projectionIdx}`} checked={checked? true: false} 
			onChange={() => {
				setChecked(!checked);
				if (!checked){
					props.push();
				}
				else {
					props.pop();
				}

			}}
				/>
			<label htmlFor={`sct${dataName}-${projectionIdx}`}>
			<SplotCanvas
				bgColor={filtered ? 'white': 'rgba(0, 0, 0, 0.2)'}
				projectionIdx={projectionIdx}
				dataName={dataName}
				size={size}
				ld={ld}
				label={props.label}
				radius={props.radius}
			/>
			</label>
			<Box sx={{height: "36px"}}>
			<Typography variant='body2' sx={{fontSize: "12px"}} >
				{Object.entries(metadata).map(v => (
							v[0] !== 'method' ? v[0] + ': ' + v[1] + ' / ': '')							)}
			</Typography>
			</Box>
		</div>
	)

};

export default Scatterplot;