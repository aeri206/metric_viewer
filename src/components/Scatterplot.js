import React from 'react';
import SplotCanvas from './SplotCanvas';


const Scatterplot = (props) => {

	const size = props.size;
	const projectionIdx = props.projectionIdx;
	const dataName = props.dataName;
	const method = props.method;

	const ld = require(`/public/data/ld/${dataName}/ld_${projectionIdx}.json`);

	console.log(ld, props.label)

	return (
		<div>
			<div>{method}</div>
			<SplotCanvas
				projectionIdx={projectionIdx}
				dataName={dataName}
				size={size}
				ld={ld}
				label={props.label}
				// isLabel={props.isLabel}
				radius={props.radius}
			/>
		</div>
	)

};

export default Scatterplot;