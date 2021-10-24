import React from 'react';

import gchpIcon from "../../images/base/gchp_icon.png";

import "./Header.css";


const HeaderComponent = (props) =>
{
	let logoTitle = "Pretty Soldier Sailor Moon Editor (Arcade)";
			
	return (
		<header
			className="header colLinedFlex"
			style={{zoom: props.zoom}}
		>
			<div>
				<img src={gchpIcon} />
				<label>Game Color Helper Tool</label>
			</div>
		</header>
	);
}


export default HeaderComponent;