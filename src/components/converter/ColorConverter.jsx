import React, {Component} from 'react';
import ColorConverterComponent from './ColorConverterComponent';

import colorConverterService from '../../service/ColorConverterService';
import channelEditorData from '../../data/ChannelEditorData';
import editorService from '../../service/EditorService';


class ColorConverter extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {};
		this.getSearchColorHex = this.getSearchColorHex.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onConvertColor = this.onConvertColor.bind(this);
		this.createColorData = this.createColorData.bind(this);
		this.fixConversionData = this.fixConversionData.bind(this);
	}

	handleKeyDown(event)
	{
		editorService.forceFocusToElement(
				event, "NumpadDivide", "colorConverterRed");
		editorService.forceFocusToElement(
				event, "NumpadMultiply", "colorConverterTextArea");
	}

	handleChange(event)
	{
		const {name, value} = event.target;
		this.setState({[name]: value});
	}

	createColorData(channelOrder, channelSize, red, green, blue, append)
	{
		let cd = {red: red, green: green, blue: blue, append: append};
		cd.channelOrder = channelOrder;
		cd.channelSize = channelSize;
		return cd;
	}

	onConvertColor(event)
	{
		try
		{
			const {fromChannelOrder, fromChannelSize, toChannelOrder,
					toChannelSize, red, green, blue, append} = this.state;
			let from = this.createColorData(fromChannelOrder,
					fromChannelSize, red, green, blue, append);
			let to = this.createColorData(toChannelOrder, toChannelSize);
			let conversionData = colorConverterService.convertColor(from, to);
			this.setState({conversionData: conversionData});
		}
		catch(e)
		{
			console.log(e.message);
			console.log(e);
			const extras = {};
			extras.errorMessage = e.message;
			this.props.onActionResult(extras);
		}
	}

	fixConversionData(conversionData)
	{
		let cd = conversionData ? conversionData : {};
		cd.fromColor = cd.fromColor ? cd.fromColor : "";
		cd.fromColor = cd.fromColor.toString().replaceAll(",", ", ");
		cd.toColor = cd.toColor ? cd.toColor : "";
		cd.toColor = cd.toColor.toString().replaceAll(",", ", ");
		cd.fromHex = cd.fromHex ? cd.fromHex : "";
		cd.toHex = cd.toHex ? cd.toHex : "";
		cd.hasData = conversionData ? true : false;
		return cd;
	}

	getSearchColorHex()
	{
		const {red, green, blue, append,
					fromChannelOrder, fromChannelSize} = this.state;
		let cd = [red, green, blue, append];
		return colorConverterService.getColorHex32(
				cd, fromChannelOrder, fromChannelSize);
	}
	

	render()
	{
		return (
			<ColorConverterComponent
				channelOrderMap={channelEditorData.channelOrderMap}
				channelSizeMap={channelEditorData.channelSizeMap}
				fromChannelOrder={this.state.fromChannelOrder}
				fromChannelSize={this.state.fromChannelSize}
				toChannelOrder={this.state.toChannelOrder}
				toChannelSize={this.state.toChannelSize}
				red={this.state.red}
				green={this.state.green}
				blue={this.state.blue}
				append={this.state.append}
				searchColorHex={this.getSearchColorHex()}
				conversionData={this.fixConversionData(this.state.conversionData)}
				handleChange={this.handleChange}
				onConvertColor={this.onConvertColor}
				handleKeyDown={this.handleKeyDown}
			/>
		);
	} 
}


export default ColorConverter;