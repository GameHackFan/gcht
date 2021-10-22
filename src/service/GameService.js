class GameService
{
	constructor()
	{
		this.gameFile = null;
		this.clonedGame = null;
		this.gameReady = false;
	}

	convertHexArrayToByteArray = (hexArray) =>
	{
		let byteArray = new Array();

		for(let i = 0; i < hexArray.length; i++)
			byteArray.push(parseInt(hexArray[i], 16));

		return byteArray;
	}

	convertHexToByteArray = (hex) =>
	{
		let hexBytes = [];

		for(let i = 0; i < hex.length; i += 2)
			hexBytes.push(hex.substring(i, i + 2));

		return hexBytes.reverse();
	}

	getDecimals = (index, amount, decimalSize) =>
	{
		let value;
		let aux;
		let decimals = [];
		let fixedAmount = amount * decimalSize;

		for(let i = index; i < index + fixedAmount; i += decimalSize)
		{
			value = 0;

			for(let j = 0; j < decimalSize; j++)
			{
				aux = this.clonedGame[i + j];
				
				if(isNaN(aux))
				{
					value = null;
					break;
				}
				else
				{
					value |= aux << (j * 8);
					value = value >>> 0;
				}
			}
			
			decimals.push(value);
		}

		return decimals;
	}

	convertHexBytesToDecimalBytes = (bytes, byteFormat) =>
	{
		return byteFormat === "hex" ?
				this.convertHexArrayToByteArray(bytes) : bytes;
	}

	setByte = (byteIndex, value) =>
	{
		if(this.clonedGame && !isNaN(value) && value > -1 && value < 256)
			this.clonedGame[byteIndex] = value;
	}

	setHexByte = (byteIndex, value) =>
	{
		let hex = parseInt(value, 16);
		this.setByte(byteIndex, hex);
	}

	setBytes = (byteIndex, bytes) =>
	{
		bytes.forEach((byte, index) => this.clonedGame[byteIndex + index] = byte);
	}

	setHexBytes = (byteIndex, bytes) =>
	{
		bytes.forEach((byte, index) => this.setHexByte(byteIndex + index, byte));
	}

	getByte = (byteIndex) =>
	{
		return this.clonedGame[byteIndex];
	}

	getBytes = (byteIndex, amount) =>
	{
		return this.clonedGame.slice(byteIndex, byteIndex + amount);
	}

	indexOfBytes = (bytes, byteFormat, startIndex) =>
	{
		if(this.clonedGame)
		{
			let fbs = this.convertHexBytesToDecimalBytes(bytes, byteFormat);
			return fbs.findIndex(this.checkBytes, startIndex);
		}

		return -1;
	}

	indexesOfBytes = (bytes, byteFormat, startIndex) =>
	{
		let indexes = [];

		if(this.clonedGame)
		{
			let fbs = this.convertHexBytesToDecimalBytes(bytes, byteFormat);	
			let i, j;

			mainLoop:
			for(i = startIndex; i < this.clonedGame.length; i += fbs.length)
			{
				for(j = 0; j < fbs.length; j++)
				{
					if(fbs[j] !== this.clonedGame[i + j])
						continue mainLoop;
				}

				indexes.push(i);
			}
		}

		return indexes;
	}

	generateDifferenceMap = () =>
	{
		if(this.game && this.clonedGame && this.game.length == this.clonedGame.length)
		{
			let diffMap = {};
			this.game.forEach((byte, index) =>
			{
				if(byte !== this.clonedGame[index])
					diffMap[index] = this.clonedGame[index].toString(16);
			});
			return diffMap;
		}

		return {};
	}

	applyDifferenceMap = (differenceMap) =>
	{
		if(this.clonedGame && differenceMap)
		{
			let keys = Object.keys(differenceMap);
			keys.forEach((key) =>
			{
				let value = parseInt(differenceMap[key], 16);
				let index = parseInt(key);

				if(!isNaN(index) && index > -1 && index < this.clonedGame.length)
					this.clonedGame[key] = value & 255;
			});
		}
	}

	checkBytes = (element, index, checkBytes) =>
	{
		for(let i = 0; i < fbs.length; i++)
		{
			if(checkBytes[i] !== clonedGame[index + i])
				return false;
		}
		
		return true;
	}

	cloneGame = () =>
	{
		this.clonedGame = this.game.slice();
	}
	
	setGame = (game) =>
	{
		this.game = game;
	}

	getClonedGame = () =>
	{
		return this.clonedGame;
	}

	isGameReady = () =>
	{
		return this.clonedGame ? true : false;
	}

	isValidIndex = (index) =>
	{
		return index > -1 && index < this.clonedGame.length;
	}
}


let gameService = new GameService();
export default gameService;