import { componentService } from "../../service/ComponentService";
import { gameService } from "../../service/GameService";
import { fileService } from "../../service/FileService";


class EditorManager
{
  onWindowSelected = (event) =>
  {
    const key = event.target.value;
    event.target.value = "";

    if(!componentService.isComponentActive(key))
      componentService.openWindow(key);
  }

  onLoadGameFileChange = (event) =>
  {
    const file = event.target.files[0];

    if(file)
    {
      const extras = {};
      extras.successCallback = this.onActionResult;
      extras.errorCallback = this.onActionResult;
      extras.contentCallback = this.onGameFileLoaded;
      extras.successMessage = "Game loaded!";
      extras.errorMessage = "Problems loading the game!";
      extras.file = file;
      fileService.readFileAsBytes(extras);
    }

    event.target.value = "";
  }

  onGameFileLoaded = (extras) =>
  {
    if(extras && extras.actionSuccessful)
    {
      gameService.setGame(extras.actionData);
      componentService.callMethod("windowList", "updateActiveWindowList");
    }
  }

  cloneGame = () =>
  {
    const extras = {};

    try
    {
      extras.successMessage = "Game cloned!";
      gameService.cloneGame();
      componentService.callMethod("windowList", "updateActiveWindowList");
    }
    catch(e)
    {
      console.log(e.message);
      console.log(e);
      extras.errorMessage = "Problems cloning the game!";
    }

    this.onActionResult(extras);
  }

  downloadEditedGame = () =>
  {
    const extras = {};
    extras.errorCallback = this.onActionResult;
    extras.errorMessage = "Problems downloading the edited game!";
    
    try
    {
      const gameFile = gameService.getClonedGame();
      const contentType = "application/octet-stream";
      const name = "game_hack";
      componentService.downloadFile(gameFile, name, contentType);
    }
    catch(e)
    {
      console.log(e.message);
      console.log(e);
      this.onActionResult(extras);
    }
  }

  getValidWindowComponentDataList = () =>
  {
    const vwcdl = [];
    
    componentService.getKeys().forEach((k) =>
    {
      const cd = componentService.getComponentData(k);
  
      if(k !== "manager" && cd.type === "windowContent")
        vwcdl.push(cd);
    });

    return vwcdl;
  }

  getViewData = () =>
  {
    return {componentData: this.componentData};
  }

  updateViewData = () =>
  {
    this.window.updateViewData();
    this.setViewData(this.getViewData());
  }

  constructor(props, setViewData)
  {
    componentService.setController(props.key, this);
    document.removeEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleKeyDown);
    this.setViewData = setViewData;
    this.key = props.key;
    this.window = props.window;
    this.onActionResult = props.window.onActionResult;
    this.componentData = componentService.getComponentData(this.key);
    this.requestFile = componentService.requestFile;
    this.updateZoom = props.window.updateZoom;
    this.updateViewData();
  }
}


const handleKeyDown = (event) =>
{
  componentService.forceFocusToElement(
      event, "Numpad0", "colorEditorContent");
  componentService.forceFocusToElement(
      event, "NumpadDecimal", "colorConverterContent");
}


export { EditorManager };