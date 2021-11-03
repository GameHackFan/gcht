import React from 'react';

import "./ColorConverter.css";


const ColorConverterComponent = (props) =>
{
	const orderOptions = [];
	const sizeOptions = [];

	let validFromChannelOrder = props.fromChannelOrder in props.channelOrderMap;
	let validFromChannelSize = props.fromChannelSize in props.channelSizeMap;
	let validToChannelOrder = props.toChannelOrder in props.channelOrderMap;
	let validToChannelSize = props.toChannelSize in props.channelSizeMap;
	let red = isNaN(parseInt(props.red)) ? "" : props.red;
	let green = isNaN(parseInt(props.green)) ? "" : props.green;
	let blue = isNaN(parseInt(props.blue)) ? "" : props.blue;

	const hidden = {display: "none"};
	const conversionStyle = props.conversionData.hasData ? {} : hidden;
	let editOn = validFromChannelOrder && validFromChannelSize &&
			validToChannelOrder && validToChannelSize;
	const editOnStyle = editOn ? {} : hidden;

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


	return (
		<div
			id="colorConverterContent"
			tabIndex="0"
			className="colorConverter rowLinedFlex"
			onKeyDown={props.handleKeyDown}
		>
			<label className="windowText">
				Use this window to convert one type of color to another one.
			</label>
			<label className="windowText">
				Select the all the properties of the channels for the main 
				color and the one you want to convert, type the values of 
				each channel, type an append or not and press convert to
				make the conversion.			
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
			<div className="colLinedFlex">
				<div className="rowLinedFlex channelArea">
					<div className="title windowContentLine colLinedFlex">
						<span>FROM</span>
					</div>
					<div className="windowContentLine colLinedFlex">
						<label>Channel Order: </label>
						<select
							className="buttonSolid"
							name="fromChannelOrder"
							value={props.fromChannelOrder}
							onChange={props.handleChange}
						>
							<option key="none" value="none">
								Select a color order
							</option>
							{orderOptions}
						</select>
					</div>
					<div className="windowContentLine colLinedFlex">
						<label>Channel Size: </label>
						<select
							className="buttonSolid"
							name="fromChannelSize"
							value={props.fromChannelSize}
							onChange={props.handleChange}
						>
							<option key="none" value="none">
								Select a channel size
							</option>
							{sizeOptions}
						</select>
					</div>
					<div className="title windowContentLine colLinedFlex">
						<span>TO</span>
					</div>
					<div className="windowContentLine colLinedFlex">
						<label>Channel Order: </label>
						<select
							className="buttonSolid"
							name="toChannelOrder"
							value={props.toChannelOrder}
							onChange={props.handleChange}
						>
							<option key="none" value="none">
								Select a color order
							</option>
							{orderOptions}
						</select>
					</div>
					<div className="windowContentLine colLinedFlex">
						<label>Channel Size: </label>
						<select
							className="buttonSolid"
							name="toChannelSize"
							value={props.toChannelSize}
							onChange={props.handleChange}
						>
							<option key="none" value="none">
								Select a channel size
							</option>
							{sizeOptions}
						</select>
					</div>
				</div>
				<div className="converterArea rowLinedFlex" style={editOnStyle}>
					<div className="title windowContentLine colLinedFlex">
						<span>CONVERTER</span>
					</div>
					<div className="windowContentLine colLinedFlex">
						<label>Color Red: </label>
						<input
							id="colorConverterRed"
							type="text"
							name="red"
							className="textfield"
							value={red}
							onChange={props.handleChange}
						/>
						<button
							className="buttonSolid"
							onClick={props.onSwapFromToClick}
						>
							Swap From-To
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
							onClick={props.onConvertColor}
						>
							Convert Color
						</button>
					</div>
					<div className="windowContentLine colLinedFlex">
						<div style={{backgroundColor: "#" + props.searchColorHex}}></div>
					</div>
				</div>
			</div>
			<div className="colLinedFlex" style={editOnStyle}>
				<div className="rowLinedFlex">
					<div className="title windowContentLine colLinedFlex">
						<span>NOTES</span>
					</div>
					<div className="windowContentLine colLinedFlex">
						<textarea id="colorConverterTextArea"></textarea>
					</div>
				</div>
				<div className="conversionArea rowLinedFlex" style={conversionStyle}>
					<div className="title windowContentLine colLinedFlex">
						<span>CONVERSION</span>
					</div>
					<div className="windowContentLine rowLinedFlex">
						<label>TO: </label>
						<label>RGB({props.conversionData.toColor}).</label>
						<label>HEX({props.conversionData.toHex}).</label>
						<label>DEC({props.conversionData.toDecimal}).</label>
						<label>{props.conversionData.toColorSize} bits color.</label>
					</div>
					<div className="windowContentLine rowLinedFlex">
						<label>FROM: </label>
						<label>RGB({props.conversionData.fromColor}).</label>
						<label>HEX({props.conversionData.fromHex}).</label>
						<label>DEC({props.conversionData.fromDecimal}).</label>
						<label>{props.conversionData.fromColorSize} bits color.</label>
					</div>
				</div>
			</div>
		</div>
	);
}


export default ColorConverterComponent;