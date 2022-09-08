import { channelEditorData } from "../data/ChannelEditorData";


class ColorConverterService
{
  convertColor = (from, to) =>
  {
    let fd = this.getColorMainData(from);
    let td = this.getColorMainData(to);
    
    if(this.isValidColorMainData(fd) && this.isValidColorMainData(td))
    {
      let fc = this.getColor(from.red, from.green, from.blue);
      let append = parseInt(from.append, 16);
      append = isNaN(append) ? 0 : append;
      let fDec = this.convertAnyBitsColorToDecimal(
          fc, fd.channelIndexes, fd.channelSize) + append;
      fc = this.convertDecimalToAnyBitsColor(fDec,
          fd.channelIndexes, fd.channelSize);
      let c32 = this.convertAnyBitsTo32BitsColor(fc, fd.channelSize);
      let tc = this.convert32BitsToAnyBitsColor(c32, td.channelSize);
      let tDec = this.convertAnyBitsColorToDecimal(
          tc, td.channelIndexes, td.channelSize);

      let conversionData = {};
      conversionData.fromColor = fc;
      conversionData.fromHex = this.getHexValue(fDec, fd.colorSize, 6);
      conversionData.fromDecimal = fDec;
      conversionData.fromColorSize = fd.colorSize * 8;
      conversionData.toColor = tc;
      conversionData.toHex = this.getHexValue(tDec, td.colorSize, 6);
      conversionData.toDecimal = tDec;
      conversionData.toColorSize = td.colorSize * 8;
      return conversionData;
    }

    return null;
  }

  getColorHex32 = (colorData, channelOrderKey, channelSizeKey) =>
  {
    const cd = {channelOrder: channelOrderKey, channelSize: channelSizeKey};
    const cmd = colorConverterService.getColorMainData(cd);

    if(colorConverterService.isValidColorMainData(cmd))
    {
      let ca = colorConverterService.getColor(
          colorData[0], colorData[1], colorData[2], 10);
      let da = colorConverterService.convertAnyBitsColorToDecimal(
          ca, cmd.channelIndexes, cmd.channelSize);
      let append = parseInt(colorData[3], 16);
      append = isNaN(append) ? 0 : append;
      da = isNaN(parseInt(da?.toString())) ? 0 : da + append;
      ca = colorConverterService.convertDecimalToAnyBitsColor(
          da, cmd.channelIndexes, cmd.channelSize);
      let c32 = colorConverterService.convertAnyBitsTo32BitsColor(
          ca, cmd.channelSize);
      let d = colorConverterService.convertAnyBitsColorToDecimal(
          c32, [2, 1, 0], 8);
      return colorConverterService.getHexValue(d, 4, 6);
    }

    return "FF00FF00";
  }
  
  getColorMainData = (colorData) =>
  {
    let channelIndexes = this.getChannelIndexes(colorData.channelOrder);
    let channelSize = this.getChannelSize(colorData.channelSize);
    let colorSize = this.getColorSize(colorData.channelSize);
    channelIndexes = channelIndexes ? channelIndexes.indexes : [];
    channelSize = channelSize ? channelSize.size : 0;
    colorSize = colorSize ? colorSize.size : 0;
    let cmd = {channelSize: channelSize, colorSize: colorSize};
    cmd.channelIndexes = channelIndexes;
    return cmd;
  }

  convertHexToAnyBitsColor = (hex, channelIndexes, channelSize) =>
  {
    if(hex)
    {
      let d = parseInt(hex, 16);
      return this.convertDecimalToAnyBitsColor(d, channelIndexes, channelSize);
    }

    return null;
  }

  convertDecimalToAnyBitsColor = (decimal, channelIndexes, channelSize) =>
  {
    if(this.isValidDecimal(decimal))
    {
      let max = Math.pow(2, channelSize) - 1;
      let color = [];

      for(let i = 0; i < 3; i++)
        color.push((decimal >> channelSize * channelIndexes[i]) & max);

      return color;
    }

    return null;
  }

  convertAnyBitsColorToDecimal = (color, channelIndexes, channelSize) =>
  {
    if(this.isValidColor(color))
    {
      let decimal = 0;
      color.forEach((c, i) =>
      {
        decimal |= c << (channelSize * channelIndexes[i]);
      });

      return decimal;
    }

    return null;
  }

  convertAnyBitsTo32BitsColor = (color, channelSize) =>
  {
    if(this.isValidColor(color))
    {
      let factor = 255 / (Math.pow(2, channelSize) - 1);
      return color.map((v) => Math.round(v * factor));
    }
    
    return null;
  }

  convert32BitsToAnyBitsColor = (color, channelSize) =>
  {
    if(this.isValidColor(color))
    {
      let factor = 255 / (Math.pow(2, channelSize) - 1);
      return color.map((c) => Math.round(c / factor));
    }
    
    return null;
  }

  getChannelIndexes = (key) =>
  {
    return channelEditorData.channelOrderMap[key];
  }

  getChannelSize = (key) =>
  {
    return channelEditorData.channelSizeMap[key];
  }

  getColorSize = (channelSize) =>
  {
    return channelEditorData.colorSizeMap[channelSize];
  }

  getColor = (red, green, blue, base = 10) =>
  {
    return [this.getValidChannelValue(red, base),
        this.getValidChannelValue(green),
        this.getValidChannelValue(blue)];
  }

  getValidChannelValue = (value, base = 10) =>
  {
    let cv = parseInt(value, base);
    return !isNaN(cv) ? cv : 0;
  }

  getHexValue = (decimal, colorSize, maxCharacters) =>
  {
    if(this.isValidDecimal(decimal))
    {
      let length = Math.min(colorSize * 2, maxCharacters);
      let hex = decimal.toString(16).padStart(length, "0");
      hex = hex.toUpperCase();
      return hex;
    }

    return null;
  }

  isValidColor = (color) =>
  {
    return color != null && color != undefined && color.length === 3;
  }

  isValidDecimal = (decimal) =>
  {
    return !isNaN(decimal) && decimal !== null && decimal > -1;
  }

  isValidColorMainData = (colorMainData) =>
  {
    return colorMainData.channelIndexes &&
        colorMainData.channelSize && colorMainData.colorSize;
  }
}


export const colorConverterService = new ColorConverterService();