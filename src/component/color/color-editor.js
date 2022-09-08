import { channelEditorData } from "../../data/ChannelEditorData";
import { componentService } from "../../service/ComponentService";
import { fileService } from "../../service/FileService";
import { gameService } from "../../service/GameService";
import { colorEditorService } from "../../service/ColorEditorService";
import { colorConverterService } from "../../service/ColorConverterService";


class ColorEditor
{
  applyColor = () =>
  {
    try
    {
      const {red, green, blue, append, colorIndex, channelOrder, channelSize} = this;
      const cd = [red, green, blue, append];
      colorEditorService.applyColor(cd, colorIndex, channelOrder, channelSize);
      this.updateColorMap();
    }
    catch(e)
    {
      console.log(e.message);
      console.log(e);
      const extras = {};
      extras.errorMessage = e.message;
      this.onActionResult(extras);
    }
  }

  searchColor = () =>
  {
    try
    {
      const {searchRed, searchGreen, searchBlue, searchAppend} = this;
      const cd = [searchRed, searchGreen, searchBlue, searchAppend];
      this.searchResults = colorEditorService.searchColor(cd,
          this.channelOrder, this.channelSize);
      this.setViewData(this.getViewData());
    }
    catch(e)
    {
      console.log(e.message);
      console.log(e);
      const extras = {};
      extras.errorMessage = e.message;
      this.onActionResult(extras);
    }
  }

  updateColorSelected = () =>
  {
    const cm = colorEditorService.getColorMap();
    const cd = cm ? cm.colorInfo : null;
    
    if(cd)
    {
      this.red = cd.colorAny[0];
      this.green = cd.colorAny[1];
      this.blue = cd.colorAny[2];
      this.append = "";
    }

    this.setViewData(this.getViewData());
  }

  updateColorMap = () =>
  {
    const {colorIndex, channelOrder, channelSize} = this;
    colorEditorService.createColorMap(colorIndex, channelOrder, channelSize);
    this.updateColorSelected();
  }

  generatePatch = () =>
  {
    const extras = {};
    extras.errorCallback = this.onActionResult;
    extras.errorMessage = "Problems generating the patch!";
    
    try
    {
      const patchObject = gameService.generateDifferenceMap();
      const json = JSON.stringify(patchObject, null, "\t");
      const contentType = "text/json;charset=utf-8";
      const filename = "gcht_patch_file.json";
      componentService.downloadFile(json, filename, contentType);
    }
    catch(e)
    {
      console.log(e.message);
      console.log(e);
      this.onActionResult(extras);
    }
  }

  onLoadPatchFileChange = (event) =>
  {
    const file = event.target.files[0];

    if(file)
    {
      const extras = {};
      extras.successCallback = this.onActionResult
      extras.errorCallback = this.onActionResult;
      extras.contentCallback = this.applyPatch;
      extras.successMessage = "Patch loaded!";
      extras.errorMessage = "Problems loading the patch!";
      extras.file = file;
      fileService.readTextFile(extras);
    }

    event.target.value = "";
  }

  applyPatch = (extras) =>
  {
    try
    {
      if(extras && extras.actionSuccessful)
      {
        colorEditorService.applyPatchFile(extras.actionData);
        this.updateColorMap();
        delete extras.contentCallback;
        this.onActionResult(extras);
      }
    }
    catch(e)
    {
      console.log(e.message);
      console.log(e);
      delete extras.successCallback;
      delete extras.actionSuccessful;
      delete extras.contentCallback;
      delete extras.successMessage;
      extras.errorMessage = "Problems applying the patch!";
      this.onActionResult(extras);
    }
  }

  shiftSelectedSearchResult = (shift) =>
  {
    const s = parseInt(shift);
  
    if(!isNaN(s) && s !== 0)
    {
      if(this.searchResults && this.searchResults.length > 0)
      {
        let si = parseInt(this.searchIndex.toString());
        si = isNaN(si) ? 0 : si + s;
        si = Math.min(Math.max(0, si), this.searchResults.length - 1);
        this.searchIndex = si;
        this.colorIndex = this.searchResults[si].index;
        this.updateColorMap();
      }
    }
  }

  shiftSelectedColor = (shift) =>
  {
    const s = parseInt(shift);
  
    if(!isNaN(s) && s !== 0)
    {
      let i = parseInt(this.colorIndex.toString());
      i = isNaN(i) ? 0 : i + s;
      i = Math.min(i, colorEditorService.getColorAmount(this.channelSize));
      this.colorIndex = Math.max(i, 0);
      this.updateColorMap();
    }
  }

  shouldAllowEditing = () =>
  {
    const v1 = this.channelOrder in channelEditorData.channelOrderMap;
    const v2 = this.channelSize in channelEditorData.channelSizeMap;
    return gameService.isGameReady() && v1 && v2;
  }

  getEditColorHex = () =>
  {
    const {red, green, blue, append, channelOrder, channelSize} = this;
    let cd = [red, green, blue, append];
    return colorConverterService.getColorHex32(cd, channelOrder, channelSize);
  }
  
  handleKeyDown = (event) =>
  {
    componentService.executeKeyEvent({"1": "ArrowDown", "-1": "ArrowUp"}, 
        true, event, this.shiftSelectedSearchResult);
    componentService.executeKeyEvent({"1": "NumpadAdd", "-1": "NumpadSubtract"}, 
        true, event, this.shiftSelectedColor);
    componentService.forceFocusToElement(
        event, "NumpadDivide", "colorEditorRed");
    componentService.forceFocusToElement(
        event, "NumpadMultiply", "colorEditorSearchRed");
  }

  getViewData = () =>
  {
    const colorMap = colorEditorService.getColorMap();
    const {componentData, red, green, blue, append, searchRed,
        searchGreen, searchBlue, searchAppend, colorIndex,
        channelOrder, channelSize} = this;
    return {
      gameReady: gameService.isGameReady(), 
      channelOrderList: this.channelOrderList,
      channelSizeList: this.channelSizeList,
      editColorHex: this.getEditColorHex(),
      allowEditing: this.shouldAllowEditing(),
      colorAmount: colorEditorService.getColorAmount(channelSize) - 1,
      colorMap: colorMap, colorInfo: colorMap?.colorInfo,
      searchResults: this.searchResults ? this.searchResults : [],
      colorByteIndexList: colorMap?.byteIndexList ? colorMap?.byteIndexList : [],
      colorHex32List: colorMap?.hex32List ? colorMap?.hex32List : [],
      componentData, red, green, blue, append, searchRed,
      searchGreen, searchBlue, searchAppend, colorIndex,
      channelOrder, channelSize, 
    }
  }

  updateViewData = () =>
  {
    this.window.updateViewData();
    this.updateColorMap();
  }

  setChannelOrder = (channelOrder) =>
  {
    this.channelOrder = channelOrder;
    this.updateColorMap();
  }

  setChannelSize = (channelSize) =>
  {
    this.channelSize = channelSize;
    this.updateColorMap();
  }

  setColorIndex = (colorIndex) =>
  {
    this.colorIndex = colorIndex;
    this.updateColorMap();
  }

  setRed = (red) =>
  {
    this.red = red;
    this.setViewData(this.getViewData());
  }

  setGreen = (green) =>
  {
    this.green = green;
    this.setViewData(this.getViewData());
  }

  setBlue = (blue) =>
  {
    this.blue = blue;
    this.setViewData(this.getViewData());
  }

  setAppend = (append) =>
  {
    this.append = append;
    this.setViewData(this.getViewData());
  }

  setSearchRed = (red) =>
  {
    this.searchRed = red;
    this.setViewData(this.getViewData());
  }

  setSearchGreen = (green) =>
  {
    this.searchGreen = green;
    this.setViewData(this.getViewData());
  }

  setSearchBlue = (blue) =>
  {
    this.searchBlue = blue;
    this.setViewData(this.getViewData());
  }

  setSearchAppend = (append) =>
  {
    this.searchAppend = append;
    this.setViewData(this.getViewData());
  }

  setSearchIndex = (index) =>
  {
    this.searchIndex = index
    this.colorIndex = this.searchResults[index]?.index ?? 0;
    this.updateColorMap();
  }

  onValueChange = (event, methodName) =>
  {
    componentService.onElementValueChange(event, this, methodName);
  }

  onInputColor = (event, methodName) =>
  {
    componentService.onElementDecimalValueChange(event, this, methodName);
  }

  constructor(props, setViewData)
  {
    componentService.setController(props.key, this);
    document.removeEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keydown", this.handleKeyDown);
    this.setViewData = setViewData;
    this.key = props.key;
    this.window = props.window;
    this.onActionResult = props.window.onActionResult;
    this.componentData = componentService.getComponentData(this.key);
    this.channelOrderList = createChannelOrderList();
    this.channelSizeList = createChannelSizeList();
    this.colorIndex = 0;
    this.red = "";
    this.green = "";
    this.blue = "";
    this.append = "";
    this.channelOrder = "";
    this.channelSize = "";
    this.searchRed = "";
    this.searchGreen = "";
    this.searchBlue = "";
    this.searchAppend = "";
    this.searchIndex = 0;
    this.searchResults = [];
    this.updateZoom = props.window.updateZoom;
    this.requestFile = componentService.requestFile;
    this.updateViewData();
  }
}


const createChannelOrderList = () =>
{
  const keys = Object.keys(channelEditorData.channelOrderMap);
  return keys.map((key) => channelEditorData.channelOrderMap[key]);
}

const createChannelSizeList = () =>
{
  const keys = Object.keys(channelEditorData.channelSizeMap);
  return keys.map((key) => channelEditorData.channelSizeMap[key]);
}


export { ColorEditor };