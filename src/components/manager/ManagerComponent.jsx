import React from 'react';

import componentService from '../../service/ComponentService';

import "./Manager.css";


const ManagerComponent = (props) =>
{
	let options = new Array();
	let im = componentService.getInfoMap();

	Object.keys(im).forEach((e) =>
	{
		let ci = im[e];

		if(e !== "manager" && ci.type === "windowContent")
		{
			options.push(
				<option key={e} value={e}>
					{ci.title}
				</option>
			);
		}
	});

	return (
		<div className="manager rowLinedFlex">
			<label className="windowText">
				This is the main window of the editor. Here you can enable all 
				the features this editor offers. Here you can also load, clone 
				and download the game file. Before start editing the game file, 
				you need to load and clone it. After doing all the changes 
				desired, you need to click on Download Edited File to download 
				the edited game file.
			</label>
			<div className="colLinedFlex windowContentLine">
				<label>Window Selector: </label>
				<select
					className="buttonSolid"
					onChange={props.handleChange}
				>
					<option key="none" value="none">
						Select a window
					</option>
					{options}
				</select>
			</div>
			<div>
				<button
					className="buttonSolid"
					onClick={props.requestFile}
				>
					Load Game File
					<input
						type="file"
						value=""
						onChange={props.onLoadGameFileChange}
					/>
				</button>
				<button
					className="buttonSolid"
					onClick={props.onCloneGameFileClick}
				>
					Clone Game File
				</button>
				<button
					className="buttonSolid"
					onClick={props.onDownloadEditedFileClick}
				>
					Download Edited File
				</button>
			</div>
		</div>
	);
}


export default ManagerComponent;