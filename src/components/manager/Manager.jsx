import React, {Component} from 'react';
import ManagerComponent from './ManagerComponent';

import editorService from '../../service/EditorService';
import fileService from "../../service/FileService";
import gameService from "../../service/GameService";


class Manager extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {};
		this.handleChange = this.handleChange.bind(this);
		this.onLoadGameFileChange = this.onLoadGameFileChange.bind(this);
		this.onCloneGameFileClick = this.onCloneGameFileClick.bind(this);
		this.onDownloadEditedFileClick = this.onDownloadEditedFileClick.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}

	componentDidMount()
	{
		document.addEventListener("keydown", this.handleKeyDown)
	}

	shouldComponentUpdate(nextProps, nextState)
	{
		const extras = nextProps.actionExtras;

		if(extras && extras.actionSuccessful)
		{
			gameService.setGame(nextProps.actionData);
			editorService.forceComponentToUpdateByKey("app");
			delete nextProps.actionExtras.actionSuccessful;
		}

		return true;
	}

	handleChange(event)
	{
		editorService.openWindow(event.target.value);
	}

	onLoadGameFileChange(event)
	{
		const extras = {};
		extras.successCallback = this.props.onActionResult;
		extras.errorCallback = this.props.onActionResult;
		extras.successMessage = "Game loaded!";
		extras.errorMessage = "Problems loading the game!";
		extras.file = event.target.files[0];
		fileService.readFileAsBytes(extras);
	}

	onCloneGameFileClick(event)
	{
		const extras = {};

		try
		{
			gameService.cloneGame();
			extras.successMessage = "Game cloned!";
			editorService.forceComponentToUpdateByKey("app");
		}
		catch(e)
		{
			console.log(e.message);
			console.log(e);
			extras.errorMessage = e.message;
		}

		this.props.onActionResult(extras);
	}

	onDownloadEditedFileClick(event)
	{
		const extras = {};
		extras.errorCallback = this.props.onActionResult;
		extras.errorMessage = "Problems downloading the edited file!";
		
		try
		{
			let gameFile = gameService.getClonedGame();
			let contentType = "application/octet-stream";
			let name = "game_hack";
			editorService.downloadFile(gameFile, name, contentType);
		}
		catch(e)
		{
			console.log(e.message);
			console.log(e);
			this.props.onActionResult(extras);
		}
	}
	
	handleKeyDown(event)
	{
		editorService.forceFocusToElement(
				event, "Numpad0", "colorEditorContent");
		editorService.forceFocusToElement(
				event, "NumpadDecimal", "colorConverterContent");
	}

	render()
	{
		return (
			<ManagerComponent
				handleChange={this.handleChange}
				requestFile={editorService.requestFile}
				onCloneGameFileClick={this.onCloneGameFileClick}
				onLoadGameFileChange={this.onLoadGameFileChange}
				onDownloadEditedFileClick={this.onDownloadEditedFileClick}
			/>
		);
	} 
}


export default Manager;