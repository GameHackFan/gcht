import React, {Component} from 'react';
import ColorEditorComponent from './ColorEditorComponent';

import editorService from '../../service/EditorService';
import fileService from "../../service/FileService";
import gameService from "../../service/GameService";
import colorEditorService from '../../service/ColorEditorService';
import channelEditorData from '../../data/ChannelEditorData';
import colorConverterService from '../../service/ColorConverterService';


class ColorEditor extends Component
{
	constructor(props)
	{
		super(props);
		let cm = {channelOrder: true, channelSize: true, colorIndex: false};
		this.state = {colorIndex: 0, searchIndex: null, changeMap: cm};
		this.updateColorMap = this.updateColorMap.bind(this);
		this.updateSelectedColor = this.updateSelectedColor.bind(this);
		this.getEditColorHex = this.getEditColorHex.bind(this);
		this.shiftSelectedColor = this.shiftSelectedColor.bind(this);
		this.shiftSelectedSearchResult = this.shiftSelectedSearchResult.bind(this);
		this.applyPatch = this.applyPatch.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onColorClick = this.onColorClick.bind(this);
		this.onReloadColorClick = this.onReloadColorClick.bind(this);
		this.onApplyColorClick = this.onApplyColorClick.bind(this);
		this.onSearchColorClick = this.onSearchColorClick.bind(this);
		this.onSearchResultClick = this.onSearchResultClick.bind(this);
		this.onLoadPatchFileChange = this.onLoadPatchFileChange.bind(this);
		this.onGeneratePatchFileClick = this.onGeneratePatchFileClick.bind(this);
	}

	handleKeyDown(event)
	{
		editorService.executeKeyEvent({"1": "ArrowDown", "-1": "ArrowUp"}, 
				true, event, this.shiftSelectedSearchResult);
		editorService.executeKeyEvent({"1": "NumpadAdd", "-1": "NumpadSubtract"}, 
				true, event, this.shiftSelectedColor);
		editorService.forceFocusToElement(
				event, "NumpadDivide", "colorEditorRed");
		editorService.forceFocusToElement(
				event, "NumpadMultiply", "colorEditorSearchRed");
	}

	handleChange(event)
	{
		const {name, value} = event.target;
		const {changeMap, searchIndex} = this.state;
		let u = name in changeMap;
		let s = {[name]: value};
		s.searchIndex = changeMap[name] ? null : searchIndex;
		this.setState(s, u ? this.updateColorMap : null);
	}

	onColorClick(event)
	{
		let s = {colorIndex: event.target.getAttribute("color-index")};
		this.setState(s, this.updateColorMap);
	}

	onReloadColorClick(event)
	{
		this.updateColorMap();
	}

	onApplyColorClick(event)
	{
		try
		{
			const {red, green, blue, append,
					colorIndex, channelOrder, channelSize} = this.state;
			let cd = [red, green, blue, append];
			colorEditorService.applyColor(cd, colorIndex, channelOrder, channelSize);
			this.updateColorMap();
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

	onSearchColorClick(event)
	{
		try
		{
			const {searchRed, searchGreen, searchBlue, searchAppend,
					channelOrder, channelSize} = this.state;
			let cd = [searchRed, searchGreen, searchBlue, searchAppend];
			let result = colorEditorService.searchColor(cd,
					channelOrder, channelSize);
			this.setState({searchResults: result})
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

	onSearchResultClick(event)
	{
		const {value} = event.target;
		const colorIndex = this.state.searchResults[value].index;
		const attr = {searchIndex: value, colorIndex: colorIndex};
		this.setState(attr, this.updateColorMap);
	}

	onLoadPatchFileChange(event)
	{
		const extras = {};
		extras.successCallback = this.applyPatch;
		extras.errorCallback = this.props.onActionResult;
		extras.successMessage = "Patch loaded!";
		extras.errorMessage = "Problems loading the patch!";
		extras.file = event.target.files[0];
		fileService.readTextFile(extras);
		editorService.forceComponentToUpdateByKey("app");
	}

	onGeneratePatchFileClick(event)
	{
		const extras = {};
		extras.errorCallback = this.props.onActionResult;
		extras.errorMessage = "Problems generating the patch!";
		
		try
		{
			let patchObject = gameService.generateDifferenceMap();
			let json = JSON.stringify(patchObject, null, "\t");
			let contentType = "text/json;charset=utf-8";
			let filename = "gcht_patch_file.json";
			editorService.downloadFile(json, filename, contentType);
		}
		catch(e)
		{
			console.log(e.message);
			console.log(e);
			this.props.onActionResult(extras);
		}
	}

	shiftSelectedSearchResult(shift)
	{
		let s = parseInt(shift);

		if(!isNaN(s) && s !== 0)
		{
			const {searchIndex, searchResults} = this.state;


			if(searchResults && searchResults.length > 0)
			{
				let si = parseInt(searchIndex);
				si = isNaN(si) ? 0 : si + s;
				si = Math.min(Math.max(0, si), searchResults.length - 1);
				const attr = {searchIndex: si, colorIndex: searchResults[si].index};
				this.setState(attr, this.updateColorMap);
			}
		}
	}

	shiftSelectedColor(shift)
	{
		let s = parseInt(shift);

		if(!isNaN(s) && s !== 0)
		{	
			const {colorIndex, channelSize} = this.state;
			let i = parseInt(colorIndex);
			i = isNaN(i) ? 0 : i + s;
			i = Math.min(i, colorEditorService.getColorAmount(channelSize));
			let attr = {colorIndex: Math.max(i, 0)};
			this.setState(attr, this.updateColorMap);
		}
	}

	updateColorMap()
	{
		const {colorIndex, channelOrder, channelSize} = this.state;
		colorEditorService.createColorMap(
				colorIndex, channelOrder, channelSize);
		this.updateSelectedColor();
	}

	updateSelectedColor()
	{
		let cm = colorEditorService.getColorMap();
		let cd = cm ? cm.colorInfo : null;
		
		if(cd)
		{
			let c = {red: cd.colorAny[0],
					green: cd.colorAny[1], blue: cd.colorAny[2]};
			this.setState(c, () =>
			{
				editorService.forceComponentToUpdateByKey("colorEditor");
			});
		}
		else
			editorService.forceComponentToUpdateByKey("colorEditor");
	}

	getEditColorHex()
	{
		const {red, green, blue, append,
					channelOrder, channelSize} = this.state;
		let cd = [red, green, blue, append];
		return colorConverterService.getColorHex32(cd, channelOrder, channelSize);
	}

	applyPatch(extras)
	{
		try
		{
			if(extras && extras.actionSuccessful)
			{
				colorEditorService.applyPatchFile(extras.actionData);
				this.updateColorMap();
				this.props.onActionResult(extras);
			}
		}
		catch(e)
		{
			console.log(e.message);
			console.log(e);
			delete extras.successCallback;
			delete extras.actionSuccessful;
			delete extras.successMessage;
			extras.errorMessage = "Problems applying the patch!";
			this.props.onActionResult(extras);
		}
	}

	render()
	{
		const amount =
				colorEditorService.getColorAmount(this.state.channelSize);

		return (
			<ColorEditorComponent
				gameReady={gameService.isGameReady()}
				channelOrderMap={channelEditorData.channelOrderMap}
				channelSizeMap={channelEditorData.channelSizeMap}
				channelOrder={this.state.channelOrder}
				channelSize={this.state.channelSize}
				colorMap={colorEditorService.getColorMap()}
				colorIndex={this.state.colorIndex}
				colorAmount={amount}
				red={this.state.red}
				green={this.state.green}
				blue={this.state.blue}
				append={this.state.append}
				editColorHex={this.getEditColorHex()}
				searchRed={this.state.searchRed}
				searchGreen={this.state.searchGreen}
				searchBlue={this.state.searchBlue}
				searchAppend={this.state.searchAppend}
				searchResults={this.state.searchResults}
				handleChange={this.handleChange}
				onColorClick={this.onColorClick}
				onReloadColorClick={this.onReloadColorClick}
				onApplyColorClick={this.onApplyColorClick}
				onSearchColorClick={this.onSearchColorClick}
				onSearchResultClick={this.onSearchResultClick}
				handleKeyDown={this.handleKeyDown}
				requestFile={editorService.requestFile}
				onLoadPatchFileChange={this.onLoadPatchFileChange}
				onGeneratePatchFileClick={this.onGeneratePatchFileClick}
			/>
		);
	} 
}


export default ColorEditor;