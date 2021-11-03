import componentService from "./ComponentService";


class EditorService
{
	constructor()
	{
		this.componentMap = {};
	}

	getComponentMap = () =>
	{
		return this.componentMap;
	}

	putComponent = (componentKey, component) =>
	{
		this.componentMap[componentKey] = component;
	}

	forceComponentToUpdateByKey = (componentKey) =>
	{
		let c = this.componentMap[componentKey];
		this.forceComponentToUpdate(c);
	}

	forceComponentToUpdate = (component) =>
	{
		if(component)
			c.setState({rerender: component.rerender === true ? false : true});
	}

	requestFile = (event) =>
	{
		let fb = event.target.querySelector("input");

		if(fb)
			fb.click();
	}

	downloadFile = (content, filename, contentType) =>
	{
		let data = content instanceof Blob ? content :
				new Blob([content], {type: contentType});
		let a = document.createElement('a');
		a.download = filename;
		a.href = window.URL.createObjectURL(data)
		a.dataset.downloadurl = [contentType, a.download, a.href].join(':');
		a.click();
	}

	openWindow = (componentKey) =>
	{
		componentService.setWindowActive(componentKey, true);
		let c = this.componentMap.editor;
		this.forceComponentToUpdate(c);
	}

	toggleWindow = (componentKey, showContent) =>
	{
		let c = this.componentMap[componentKey];

		if(c)
			c.setState({showContent: showContent});
	}

	closeWindow = (componentKey) =>
	{
		componentService.setWindowActive(componentKey, false);
		this.componentMap[componentKey] = null;
		let c = this.componentMap.editor;
		this.forceComponentToUpdate(c);
	}

	forceFocusToElement = (event, code, elementId) =>
	{
		if(event.altKey && event.code === code)
		{
			event.stopPropagation();
			let element = document.getElementById(elementId);

			if(element)
				element.focus();
		}
	}

	executeKeyEvent(codeMap, altKey, event, callback)
	{
		if(codeMap && event && event.altKey === altKey)
		{	
			let keys = Object.keys(codeMap);

			for(let i = 0; i < keys.length; i++)
			{
				if(event.code === codeMap[keys[i]])
				{
					callback(keys[i]);
					break;
				}
			}
		}
	}
}


const editorService = new EditorService;
export default editorService;