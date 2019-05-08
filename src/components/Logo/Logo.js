import React from 'react';
import Tilt from 'react-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo=()=>{

	return (
			<div className='ma4 mt0' style={{marginTop:'-80px'}} >
			  <Tilt className="Tilt br2 shadow-2 pa3" options={{ max : 50 }} style={{ height: 120, width: 120 }} >
 				<div className="Tilt-inner">
 					<img alt='Logo' src={brain} />
 				</div>
			  </Tilt>
			</div>
		);
}

export default Logo;