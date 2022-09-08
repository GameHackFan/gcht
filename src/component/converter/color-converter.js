import { channelEditorData } from "../../data/ChannelEditorData";
import { componentService } from "../../service/ComponentService";
import { colorConverterService } from "../../service/ColorConverterService";


class ColorConverter
{
  swapFromTo = () =>
  {
    let aux = this.fromChannelOrder;
    this.fromChannelOrder = this.toChannelOrder;
    this.toChannelOrder = aux;
    aux = this.fromChannelSize;
    this.fromChannelSize = this.toChannelSize;
    this.toChannelSize = aux;
    this.setViewData(this.getViewData());
  }

  convertColor = () =>
  {
    try
    {
      const {fromChannelOrder, fromChannelSize, red, green, blue, append} = this;
      const from = createColorData(fromChannelOrder,
          fromChannelSize, red, green, blue, append);
      const to = createColorData(this.toChannelOrder, this.toChannelSize);
      this.conversionData = colorConverterService.convertColor(from, to);
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

  getSearchColorHex = () =>
  {
    const cd = [this.red, this.green, this.blue, this.append];
    return colorConverterService.getColorHex32(
        cd, this.fromChannelOrder, this.fromChannelSize);
  }
  
  shouldShowConverter = () =>
  {
    const v1 = this.fromChannelOrder in channelEditorData.channelOrderMap;
    const v2 = this.fromChannelSize in channelEditorData.channelSizeMap;
    const v3 = this.toChannelOrder in channelEditorData.channelOrderMap;
    const v4 = this.toChannelSize in channelEditorData.channelSizeMap;
    return v1 && v2 && v3 && v4;
  }

  getViewData = () =>
  {
    const {componentData, channelOrderList, channelSizeList,
        red, green, blue, append, fromChannelOrder, toChannelOrder,
        fromChannelSize, toChannelSize} = this;
    return {
      componentData, channelOrderList, channelSizeList, red, green, blue, append,
      fromChannelOrder, toChannelOrder, fromChannelSize, toChannelSize,
      conversionData: fixConversionData(this.conversionData),
      showConverter: this.shouldShowConverter(),
      searchColorHex: this.getSearchColorHex()
    };
  }

  updateViewData = () =>
  {
    this.window.updateViewData();
    this.setViewData(this.getViewData());
  }

  setRed = (r) =>
  {
    this.red = r;
    this.setViewData(this.getViewData());
  }

  setGreen = (g) =>
  {
    this.green = g;
    this.setViewData(this.getViewData());
  }

  setBlue = (b) =>
  {
    this.blue = b;
    this.setViewData(this.getViewData());
  }

  setAppend = (a) =>
  {
    this.append = a;
    this.setViewData(this.getViewData());
  }

  setFromChannelOrder = (channelOrder) =>
  {
    this.fromChannelOrder = channelOrder;
    this.setViewData(this.getViewData());
  }

  setToChannelOrder = (channelOrder) =>
  {
    this.toChannelOrder = channelOrder;
    this.setViewData(this.getViewData());
  }

  setFromChannelSize = (channelSize) =>
  {
    this.fromChannelSize = channelSize;
    this.setViewData(this.getViewData());
  }

  setToChannelSize = (channelSize) =>
  {
    this.toChannelSize = channelSize;
    this.setViewData(this.getViewData());
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
    document.removeEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleKeyDown);
    this.setViewData = setViewData;
    this.key = props.key;
    this.window = props.window;
    this.onActionResult = props.window.onActionResult;
    this.componentData = componentService.getComponentData(this.key);
    this.channelOrderList = createChannelOrderList();
    this.channelSizeList = createChannelSizeList();
    this.red = "";
    this.green = "";
    this.blue = "";
    this.append = "";
    this.fromChannelOrder = "";
    this.toChannelOrder = "";
    this.fromChannelSize = "";
    this.toChannelSize = "";
    this.conversionData = null;
    this.updateZoom = props.window.updateZoom;
    this.requestFile = componentService.requestFile;
    this.updateViewData();
  }
}


const createColorData = (channelOrder, channelSize, red, green, blue, append) =>
{
  return {red, green, blue, append, channelOrder, channelSize};
}

const fixConversionData = (conversionData) =>
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

const handleKeyDown = (event) =>
{
  componentService.forceFocusToElement(
      event, "NumpadDivide", "colorConverterRed");
  componentService.forceFocusToElement(
      event, "NumpadMultiply", "colorConverterTextArea");
}


export { ColorConverter };