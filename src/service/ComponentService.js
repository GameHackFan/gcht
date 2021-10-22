class ComponentService
{
	constructor()
	{
		this.infoMap = this.createInfoMap();
	}

	getInfoMap = () =>
	{
		return this.infoMap;
	}

	isActiveWindowContent = (componentKey) =>
	{
		let i = this.infoMap[componentKey];
		return i && i.type === "windowContent" && i.active;
	}

	setWindowActive = (componentKey, active) =>
	{
		let ci = this.infoMap[componentKey];
		
		if(ci)
			ci.active = active;
	}

	createInfoMap = () =>
	{
		let im = {};
		im.manager = this.createComponentInfo(
				"windowContent", "Editor Manager", true, false);
		im.colorEditor = this.createComponentInfo(
				"windowContent", "Color Editor", false, true);
		im.colorConverter = this.createComponentInfo(
				"windowContent", "Color Converter", false, true);
		im.zoom = this.createComponentInfo(
				"windowContent", "Component Zoom", false, true);
		return im;
	}

	createComponentInfo = (type, title, active, canClose) =>
	{
		let ci = {}
		ci.type = type;
		ci.title = title;
		ci.active = active;
		ci.canClose = canClose;
		return ci;
	}
}


const componentService = new ComponentService();
export default componentService;

