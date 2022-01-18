import React from 'react';

import "./ColorEditor.css";


const ColorEditorComponent = (props) =>
{
	const colorElements = [];
	const orderOptions = [];
	const sizeOptions = [];
	const indexElements = [];

	let validChannelOrder = props.channelOrder in props.channelOrderMap;
	let validChannelSize = props.channelSize in props.channelSizeMap;
	let colorInfo = props.colorMap ? props.colorMap.colorInfo : {};
	colorInfo = colorInfo ? colorInfo : {};
	let red = isNaN(parseInt(props.red)) ? "" : props.red;
	let green = isNaN(parseInt(props.green)) ? "" : props.green;
	let blue = isNaN(parseInt(props.blue)) ? "" : props.blue;
	let maxColorIndex = parseInt(props.colorAmount - 1);
	maxColorIndex = isNaN(maxColorIndex) ? 0 : maxColorIndex;

	const hidden = {display: "none"};
	const editOn = props.gameReady && validChannelOrder && validChannelSize;
	const editOnStyle = editOn ? {} : hidden;
	const lockStyle = props.gameReady ? {} : hidden;
	const invisible = {backgroundColor: "#FF00FF00", borderWidth: "0"};

	if(props.colorMap)
	{
		let bil = props.colorMap.byteIndexList;
		bil = bil ? bil : [];

		props.colorMap.hex32List.forEach((c, i) =>
		{
			colorElements.push(
				<button
					key={i}
					style={c === null ? invisible : {backgroundColor: `#${c}`}}
					color-index={bil[i]}
					onClick={c === null ? null : props.onColorClick}
				>
				</button>);
		});
	}

	Object.keys(props.channelOrderMap).forEach((cok) =>
	{
		let cod = props.channelOrderMap[cok];

		orderOptions.push(
			<option key={cok} value={cok}>
				{cod.label}
			</option>
		);
	});

	Object.keys(props.channelSizeMap).forEach((csk) =>
	{
		let csd = props.channelSizeMap[csk];

		sizeOptions.push(
			<option key={csk} value={csk}>
				{csd.label}
			</option>
		);
	});

	if(props.searchResults)
	{
		let cn;
		let ci = props.colorIndex.toString();

		props.searchResults.forEach((sr, index) =>
		{
			cn = sr.index.toString() === ci ? "selected" : "";

			indexElements.push(
				<button
					className={cn}
					key={sr.index}
					value={index}
					onClick={props.onSearchResultClick}
				>
					{sr.label}
				</button>
			);
		});
	}


	return (
		<div
			id="colorEditorContent"
			tabIndex="0"
			className="colorEditor rowLinedFlex"
			onKeyDown={props.handleKeyDown}
		>
			<label className="windowText">
				Use this window to edit the colors of the game file you loaded.
			</label>
			<label className="windowText">
				To edit a color, you need to select it, type the values for 
				red, green and blue and click in apply to set the new values 
				in the cloned game file. After clicking apply, the old value 
				of the color is lost.
			</label>
			<label className="windowText">
				Some color encodings do not use all bits, but they are set 
				anyways, so you can use the append field to inform the value 
				of those bits. The append field only accepts an hex value, 
				and it will be added to the color. Considering the append 
				value will be added to the color, you can use it to inform 
				the whole color, it will also work, and it can be used like 
				that in case you have the hex value of the color.
			</label>
			<label
				className="windowErrorMessage warning"
				style={props.gameReady ? hidden : {}}
			>
				No game file ready to edit.
			</label>
			<div
				className="channelArea windowContentLine colLinedFlex"
				style={lockStyle}
			>
				<label>Channel Order: </label>
				<select
					className="buttonSolid"
					name="channelOrder"
					onChange={props.handleChange}
				>
					<option key="none" value="none">
						Select a color order
					</option>
					{orderOptions}
				</select>
			</div>
			<div
				className="channelArea windowContentLine colLinedFlex"
				style={lockStyle}
			>
				<label>Channel Size: </label>
				<select
					className="buttonSolid"
					name="channelSize"
					onChange={props.handleChange}
				>
					<option key="none" value="none">
						Select a channel size
					</option>
					{sizeOptions}
				</select>
			</div>
			<div
				className="colorList windowContentLine colLinedFlex"
				style={editOnStyle}
			>
				{colorElements}
			</div>
			<div
				className="selectArea windowContentLine colLinedFlex"
				style={editOnStyle}
			>
				<label>Select Color: </label>
				<input
					type="number"
					name="colorIndex"
					className="textfield"
					min="0"
					max={maxColorIndex}
					value={props.colorIndex ? props.colorIndex : ""}
					onChange={props.handleChange}
				/>
				<div className="windowContentLine rowLinedFlex">
					<span>
						HEX: {colorInfo.hexAny}, HEX32: {colorInfo.hex32}, 
						RGB32: ({colorInfo.rgb32}).
					</span>
					<span>
						HEX ADDRESS: {colorInfo.hexByteIndex}, 
						DEC ADDRESS: {colorInfo.byteIndex}.
					</span>
				</div>
			</div>
			<div className="colLinedFlex" style={editOnStyle}>
				<div className="editArea rowLinedFlex">
					<div className="title windowContentLine colLinedFlex">
						<span>EDIT</span>
					</div>
					<div className="windowContentLine colLinedFlex">
						<label>Color Red: </label>
						<input
							id="colorEditorRed"
							type="text"
							name="red"
							className="textfield"
							value={red}
							onChange={props.handleChange}
						/>
						<button
							className="buttonSolid"
							onClick={props.onReloadColorClick}
						>
							Reload Color
						</button>
					</div>
					<div className="windowContentLine colLinedFlex">
						<label>Color Green: </label>
						<input
							type="text"
							name="green"
							className="textfield"
							value={green}
							onChange={props.handleChange}
						/>
					</div>
					<div className="windowContentLine colLinedFlex">
						<label>Color Blue: </label>
						<input
							type="text"
							name="blue"
							className="textfield"
							value={blue}
							onChange={props.handleChange}
						/>
					</div>
					<div className="windowContentLine colLinedFlex">
						<label>Append: </label>
						<input
							type="text"
							name="append"
							className="textfield"
							value={props.append ? props.append : ""}
							onChange={props.handleChange}
						/>
						<button
							className="buttonSolid"
							onClick={props.onApplyColorClick}
						>
							Apply Color
						</button>
					</div>
					<div className="windowContentLine colLinedFlex">
						<div style={{backgroundColor: "#" + props.editColorHex}}></div>
					</div>
				</div>
				<div className="searchArea rowLinedFlex">
					<div className="title windowContentLine colLinedFlex">
						<span>SEARCH</span>
					</div>
					<div
						className="windowContentLine colLinedFlex"
						style={editOnStyle}
					>
						<label>Color Red: </label>
						<input
							id="colorEditorSearchRed"
							type="text"
							name="searchRed"
							className="textfield"
							value={props.searchRed ? props.searchRed : ""}
							onChange={props.handleChange}
						/>
					</div>
					<div
						className="windowContentLine colLinedFlex"
						style={editOnStyle}
					>
						<label>Color Green: </label>
						<input
							type="text"
							name="searchGreen"
							className="textfield"
							value={props.searchGreen ? props.searchGreen : ""}
							onChange={props.handleChange}
						/>
					</div>
					<div
						className="windowContentLine colLinedFlex"
						style={editOnStyle}
					>
						<label>Color Blue: </label>
						<input
							type="text"
							name="searchBlue"
							className="textfield"
							value={props.searchBlue ? props.searchBlue : ""}
							onChange={props.handleChange}
						/>
					</div>
					<div
						className="windowContentLine colLinedFlex"
						style={editOnStyle}
					>
						<label>Append: </label>
						<input
							type="text"
							name="searchAppend"
							className="textfield"
							value={props.searchAppend ? props.searchAppend : ""}
							onChange={props.handleChange}
						/>
						<button
							className="buttonSolid"
							onClick={props.onSearchColorClick}
						>
							Search Color
						</button>
					</div>
					<div className="searchResult">
						{indexElements}
					</div>
				</div>
			</div>
			<div
				className="patchArea windowContentLine colLinedFlex"
				style={props.gameReady ? {} : hidden}
			>
				<button
					className="buttonSolid"
					onClick={props.requestFile}
				>
					Apply Patch
					<input
						type="file"
						value=""
						onChange={props.onLoadPatchFileChange}
					/>
				</button>
				<button
					className="buttonSolid"
					onClick={props.onGeneratePatchFileClick}
				>
					Generate Patch
				</button>
			</div>
		</div>
	);
}


export default ColorEditorComponent;