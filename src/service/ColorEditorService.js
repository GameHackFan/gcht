import gameService from "./GameService";
import colorConverterService from "./ColorConverterService";


class ColorEditorService
{
	constructor()
	{
		this.colorMap = null;
	}

	createColorMap = (colorIndex, channelOrderKey, channelSizeKey, amount = 16) =>
	{
		let cd = {channelOrder: channelOrderKey, channelSize: channelSizeKey}
		let cmd = colorConverterService.getColorMainData(cd);

		if(colorConverterService.isValidColorMainData(cmd))
		{
			const {channelIndexes, channelSize, colorSize} = cmd;
			let fci = parseInt(colorIndex);
			fci = isNaN(fci) ? 0 : fci;
			fci = Math.min(Math.max(fci, 0), this.getColorAmount(channelSize));
			fci = (fci - 7) * colorSize;
			let color32Indexes = [2, 1, 0];
			let decimalAnyList = gameService.getDecimals(fci, amount, colorSize);
			let decimal32List = [];
			let hexAnyList = [];
			let hex32List = [];
			let colorAnyList = [];
			let color32List = [];
			let byteIndexList = [];
			let d32, h32, ha, ca, c32;

			decimalAnyList.forEach((d, i) =>
			{
				ca = colorConverterService.convertDecimalToAnyBitsColor(
						d, channelIndexes, channelSize);
				c32 = colorConverterService.convertAnyBitsTo32BitsColor(
						ca, channelSize);
				d32 = colorConverterService.convertAnyBitsColorToDecimal(
						c32, color32Indexes, 8);
				ha = colorConverterService.getHexValue(d, cmd.colorSize, 6);
				h32 = colorConverterService.getHexValue(d32, 6, 6);
				decimal32List.push(d32);
				hexAnyList.push(ha);
				hex32List.push(h32);
				colorAnyList.push(ca);
				color32List.push(c32);
				byteIndexList.push((fci / colorSize) + i);
			});
			
			fci = parseInt(colorIndex);
			fci = isNaN(colorIndex) ? 0: fci * colorSize;
			this.colorMap = {};
			this.colorMap.decimalAnyList = decimalAnyList;
			this.colorMap.decimal32List = decimal32List;
			this.colorMap.hexAnyList = hexAnyList;
			this.colorMap.hex32List = hex32List;
			this.colorMap.colorAnyList = colorAnyList;
			this.colorMap.color32List = color32List;
			this.colorMap.byteIndexList = byteIndexList;
			this.colorMap.colorInfo = this.getColorInfo(colorAnyList[7],
					hexAnyList[7], color32List[7], hex32List[7], fci);
		}
		else
			this.colorMap = null;
	}

	searchColor = (colorData, channelOrderKey, channelSizeKey) =>
	{
		let cd = {channelOrder: channelOrderKey, channelSize: channelSizeKey}
		let cmd = colorConverterService.getColorMainData(cd);

		if(colorConverterService.isValidColorMainData(cmd))
		{
			let c = colorConverterService.getColor(
					colorData[0], colorData[1], colorData[2], 10);
			let hexBytes = this.getHexBytes(cmd, c, colorData[3]);
			let indexes = gameService.indexesOfBytes(hexBytes, "hex", 0);
			let i, l;
			return indexes.map((index) =>
			{
				i = index / cmd.colorSize;
				l = `Index ${i}, `
				l += `Address ${index.toString(16).toUpperCase()} - ${index}`;
				return {index: i, label: l};
			});
		}
		else
			throw new Error("Inform all channel values (red, green, blue)!");
	}

	applyColor = (colorData, colorIndex, channelOrderKey, channelSizeKey) =>
	{
		let cd = {channelOrder: channelOrderKey, channelSize: channelSizeKey};
		let cmd = colorConverterService.getColorMainData(cd);
		let index = colorIndex * cmd.colorSize;
		
		if(colorConverterService.isValidColorMainData(cmd) &&
				gameService.isValidIndex(index))
		{
			let c = colorConverterService.getColor(
					colorData[0], colorData[1], colorData[2], 10);
			let hexBytes = this.getHexBytes(cmd, c, colorData[3]);
			gameService.setHexBytes(index, hexBytes);
		}
	}

	applyPatchFile = (patchFile) =>
	{
		let json = JSON.parse(patchFile);
		gameService.applyDifferenceMap(json);
	}

	getHexBytes = (colorMainData, color, append) =>
	{
		let cmd = colorMainData;
		let fixedAppend = parseInt(append, 16);
		fixedAppend = isNaN(fixedAppend) ? 0 : fixedAppend;
		let decAny = colorConverterService.convertAnyBitsColorToDecimal(
				color, cmd.channelIndexes, cmd.channelSize) + fixedAppend;
		let hexAny = colorConverterService.getHexValue(
				decAny, cmd.colorSize, 6);
		return gameService.convertHexToByteArray(hexAny);
	}

	getColorAmount = (channelSize) =>
	{
		let cs = colorConverterService.getColorSize(channelSize);
		cs = cs ? cs.size : 0;
		let cg = gameService.getClonedGame();
		let length = cg ? cg.length : 0;
		return cs ? length / cs : 0;
	}

	getColorInfo = (colorAny, hexAny, color32, hex32, byteIndex) =>
	{
		if(!isNaN(parseInt(hexAny, 16)) &&
				!isNaN(parseInt(hex32, 16)) &&
				colorAny && colorAny.length === 3 &&
				color32 && color32.length === 3)
		{
			return {
				colorAny: colorAny, color32: color32,
				hexAny: hexAny, hex32: hex32, byteIndex: byteIndex, 
				hexByteIndex: byteIndex.toString(16).toUpperCase(),
				rgb32: color32.toString().replaceAll(",", ", ")
			};
		}

		return {colorAny: [], color32: []};
	}

	getColorMap = () =>
	{
		return this.colorMap;
	}
}


const colorEditorService = new ColorEditorService;
export default colorEditorService;