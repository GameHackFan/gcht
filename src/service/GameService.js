class GameService
{
  constructor()
  {
    clonedGame = null;
    game = null;
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
        aux = clonedGame[i + j];
        
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
    if(clonedGame && !isNaN(value) && value > -1 && value < 256)
      clonedGame[byteIndex] = value;
  }

  setHexByte = (byteIndex, value) =>
  {
    let hex = parseInt(value, 16);
    this.setByte(byteIndex, hex);
  }

  setBytes = (byteIndex, bytes) =>
  {
    bytes.forEach((byte, index) => clonedGame[byteIndex + index] = byte);
  }

  setHexBytes = (byteIndex, bytes) =>
  {
    bytes.forEach((byte, index) => this.setHexByte(byteIndex + index, byte));
  }

  getByte = (byteIndex) =>
  {
    return clonedGame[byteIndex];
  }

  getBytes = (byteIndex, amount) =>
  {
    return clonedGame.slice(byteIndex, byteIndex + amount);
  }

  indexOfBytes = (bytes, byteFormat, startIndex) =>
  {
    if(clonedGame)
    {
      let fbs = this.convertHexBytesToDecimalBytes(bytes, byteFormat);
      return clonedGame.findIndex(fbs, startIndex);
    }

    return -1;
  }

  indexesOfBytes = (bytes, byteFormat, startIndex) =>
  {
    let indexes = [];

    if(clonedGame)
    {
      let fbs = this.convertHexBytesToDecimalBytes(bytes, byteFormat);
      let i, j;

      mainLoop:
      for(i = startIndex; i < clonedGame.length; i += fbs.length)
      {
        for(j = 0; j < fbs.length; j++)
        {
          if(fbs[j] !== clonedGame[i + j])
            continue mainLoop;
        }

        indexes.push(i);
      }
    }

    return indexes;
  }

  generateDifferenceMap = () =>
  {
    if(game && clonedGame && game.length == clonedGame.length)
    {
      let diffMap = {};
      game.forEach((byte, index) =>
      {
        if(byte !== clonedGame[index])
          diffMap[index] = clonedGame[index].toString(16);
      });
      return diffMap;
    }

    return {};
  }

  applyDifferenceMap = (differenceMap) =>
  {
    if(clonedGame && differenceMap)
    {
      let keys = Object.keys(differenceMap);
      keys.forEach((key) =>
      {
        let value = parseInt(differenceMap[key], 16);
        let index = parseInt(key);

        if(!isNaN(index) && index > -1 && index < clonedGame.length)
          clonedGame[key] = value & 255;
      });
    }
  }

  cloneGame = () =>
  {
    clonedGame = game.slice();
  }
  
  setGame = (newGame) =>
  {
    game = newGame;
  }

  getClonedGame = () =>
  {
    return clonedGame;
  }

  isGameReady = () =>
  {
    return clonedGame ? true : false;
  }

  isValidIndex = (index) =>
  {
    return index > -1 && index < clonedGame.length;
  }
}


let clonedGame, game;


export const gameService = new GameService();