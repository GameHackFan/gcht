<script>
  import { ColorConverter } from "./color-converter";

  export let props;
  let data;
  const setData = (newData) => {data = newData};
  const colorConverter = new ColorConverter(props, setData);
</script>

<style>@import url("./color-converter.css");</style>


<div
  id="colorConverterContent"
  tabIndex="0"
  class="color-converter flex-row"
>
  <span class={`window-text${data.componentData.showHintText ? "" : " hidden"}`}>
    Use this window to convert one type of color to another one.
  </span>
  <span class={`window-text${data.componentData.showHintText ? "" : " hidden"}`}>
    Select the all the properties of the channels for the main 
    color and the one you want to convert, type the values of 
    each channel, type an append or not and press convert to
    make the conversion.
  </span>
  <span class={`window-text${data.componentData.showHintText ? "" : " hidden"}`}>
    Some color encodings do not use all bits, but they are set 
    anyways, so you can use the append field to inform the value 
    of those bits. The append field only accepts an hex value, 
    and it will be added to the color. Considering the append 
    value will be added to the color, you can use it to inform 
    the whole color, it will also work, and it can be used like 
    that in case you have the hex value of the color.
  </span>
  <div class="flex-col">
    <div class="channel-area flex-row">
      <div class="title window-content-line flex-col">
        <h3>FROM</h3>
      </div>
      <div class="window-content-line flex-col">
        <span>Channel Order: </span>
        <select
          class="button-solid"
          value={data.fromChannelOrder}
          on:input={(e) => colorConverter.onValueChange(e, "setFromChannelOrder")}
        >
          <option value="">
            Select a color order
          </option>
          {#each data.channelOrderList as col}
            <option value={col.key}>{col.label}</option>
          {/each}
        </select>
      </div>
      <div class="window-content-line flex-col">
        <span>Channel Size: </span>
        <select
          class="button-solid"
          value={data.fromChannelSize}
          on:input={(e) => colorConverter.onValueChange(e, "setFromChannelSize")}
        >
          <option value="">
            Select a channel size
          </option>
          {#each data.channelSizeList as csl}
            <option value={csl.key}>{csl.label}</option>
          {/each}
        </select>
      </div>
      <div class="title window-content-line flex-col">
        <h3>TO</h3>
      </div>
      <div class="window-content-line flex-col">
        <span>Channel Order: </span>
        <select
          class="button-solid"
          value={data.toChannelOrder}
          on:input={(e) => colorConverter.onValueChange(e, "setToChannelOrder")}
        >
          <option value="">
            Select a color order
          </option>
          {#each data.channelOrderList as col}
            <option value={col.key}>{col.label}</option>
          {/each}
        </select>
      </div>
      <div class="window-content-line flex-col">
        <span>Channel Size: </span>
        <select
          class="button-solid"
          value={data.toChannelSize}
          on:input={(e) => colorConverter.onValueChange(e, "setToChannelSize")}
        >
          <option value="">
            Select a channel size
          </option>
          {#each data.channelSizeList as csl}
            <option value={csl.key}>{csl.label}</option>
          {/each}
        </select>
      </div>
    </div>
    <div class={`converter-area flex-row ${data.showConverter ? "" : "hidden"}`}>
      <div class="title window-content-line flex-col">
        <h3>CONVERTER</h3>
      </div>
      <div class="window-content-line flex-col">
        <span>Color Red: </span>
        <input
          id="colorConverterRed"
          type="text"
          class="textfield"
          value={data.red}
          on:input={(e) => colorConverter.onInputColor(e, "setRed")}
        />
        <button
          class="button-solid"
          on:click={(e) => colorConverter.swapFromTo()}
        >
          Swap From-To
        </button>
      </div>
      <div class="window-content-line flex-col">
        <span>Color Green: </span>
        <input
          type="text"
          class="textfield"
          value={data.green}
          on:input={(e) => colorConverter.onInputColor(e, "setGreen")}
        />
      </div>
      <div class="window-content-line flex-col">
        <span>Color Blue: </span>
        <input
          type="text"
          class="textfield"
          value={data.blue}
          on:input={(e) => colorConverter.onInputColor(e, "setBlue")}
        />
      </div>
      <div class="window-content-line flex-col">
        <span>Append: </span>
        <input
          type="text"
          class="textfield"
          value={data.append}
          on:input={(e) => colorConverter.onValueChange(e, "setAppend")}
        />
        <button
          class="button-solid"
          on:click={(e) => colorConverter.convertColor()}
        >
          Convert Color
        </button>
      </div>
      <div class="window-content-line flex-col">
        <div style={`background-color: #${data.searchColorHex}`}></div>
      </div>
    </div>
  </div>  
  <div class={`flex-col ${data.showConverter ? "" : "hidden"}`}>
    <div class="flex-row">
      <div class="title window-content-line flex-col">
        <h3>NOTES</h3>
      </div>
      <div class="window-content-line flex-col">
        <textarea id="colorConverterTextArea"></textarea>
      </div>
    </div>
    <div class={`conversion-area flex-row ${data.conversionData?.hasData ? "" : "hidden"}`}>
      <div class="title window-content-line flex-col">
        <h3>CONVERSION</h3>
      </div>
      <div class="window-content-line flex-row">
        <span>TO: </span>
        <span>RGB({data.conversionData?.toColor}).</span>
        <span>HEX({data.conversionData?.toHex}).</span>
        <span>DEC({data.conversionData?.toDecimal}).</span>
        <span>{data.conversionData?.toColorSize} bits color.</span>
      </div>
      <div class="window-content-line flex-row">
        <span>FROM: </span>
        <span>RGB({data.conversionData?.fromColor}).</span>
        <span>HEX({data.conversionData?.fromHex}).</span>
        <span>DEC({data.conversionData?.fromDecimal}).</span>
        <span>{data.conversionData?.fromColorSize} bits color.</span>
      </div>
    </div>
  </div>
</div>