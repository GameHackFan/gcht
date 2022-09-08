<script>
  import { ColorEditor } from "./color-editor";

  export let props;
  let data;
  const setData = (newData) => {data = newData};
  const colorEditor = new ColorEditor(props, setData);
</script>

<style>@import url("./color-editor.css");</style>


<div
  id="colorEditorContent"
  tabIndex="0"
  class="color-editor flex-row"
>
  <span class={`window-text${data.componentData.showHintText ? "" : " hidden"}`}>
    Use this window to edit the colors of the game file you loaded.
  </span>
  <span class={`window-text${data.componentData.showHintText ? "" : " hidden"}`}>
    To edit a color, you need to select it, type the values for 
    red, green and blue and click in apply to set the new values 
    in the cloned game file. After clicking apply, the old value 
    of the color is lost.
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
  <span class={`window-error-message warning${data.gameReady ? " hidden": ""}`}>
    No game file ready to edit.
  </span>
  <div
    class={`channel-area window-content-line flex-col${data.gameReady ? "": " hidden"}`}
  >
    <span>Channel Order: </span>
    <select
      class="button-solid"
      value={data.channelOrder}
      on:change={(e) => colorEditor.onValueChange(e, "setChannelOrder")}
    >
      <option value="">
        Select a color order
      </option>
      {#each data.channelOrderList as col}
        <option value={col.key}>{col.label}</option>
      {/each}
    </select>
  </div>
  <div
    class={`channel-area window-content-line flex-col${data.gameReady ? "": " hidden"}`}
  >
    <span>Channel Size: </span>
    <select
      class="button-solid"
      value={data.channelSize}
      on:change={(e) => colorEditor.onValueChange(e, "setChannelSize")}
    >
      <option value="">
        Select a channel size
      </option>
      {#each data.channelSizeList as csl}
        <option value={csl.key}>{csl.label}</option>
      {/each}
    </select>
  </div>
  <div
    class={`color-list window-content-line flex-col${data.allowEditing ? "" : " hidden"}`}
  >
    {#each data.colorHex32List as h32, index}
      <button
        style={`background-color: #${h32 !== null ? h32 : "00000000"}`}
        color-index={data.colorByteIndexList[index]}
        on:click={h32 ? (e) => colorEditor.setColorIndex(data.colorByteIndexList[index]) : null}
      >
      </button>
    {/each}
  </div>
  <div
    class={`select-area window-content-line flex-col${data.allowEditing ? "" : " hidden"}`}
  >
    <span>Select Color: </span>
    <input
      type="number"
      class="textfield"
      min="0"
      max={data.colorAmount}
      value={data.colorIndex}
      on:input={(e) => colorEditor.onValueChange(e, "setColorIndex")}
    />
    <div class={`window-content-line flex-row${data.colorInfo ? "" : " hidden"}`}>
      <span>
        HEX: {data.colorInfo?.hexAny}, HEX32: {data.colorInfo?.hex32}, 
        RGB32: ({data.colorInfo?.rgb32}).
      </span>
      <span>
        HEX ADDRESS: {data.colorInfo?.hexByteIndex}, 
        DEC ADDRESS: {data.colorInfo?.byteIndex}.
      </span>
    </div>
  </div>
  <div class={`flex-col${data.allowEditing ? "" : " hidden"}`}>
    <div class="edit-area flex-row">
      <div class="title window-content-line flex-col">
        <h3>EDIT</h3>
      </div>
      <div class="window-content-line flex-col">
        <span>Color Red: </span>
        <input
          id="colorEditorRed"
          type="text"
          class="textfield"
          value={data.red}
          on:input={(e) => colorEditor.onInputColor(e, "setRed")}
        />
        <button
          class="button-solid"
          on:click={(e) => colorEditor.updateColorMap()}
        >
          Reload Color
        </button>
      </div>
      <div class="window-content-line flex-col">
        <span>Color Green: </span>
        <input
          type="text"
          class="textfield"
          value={data.green}
          on:input={(e) => colorEditor.onInputColor(e, "setGreen")}
        />
      </div>
      <div class="window-content-line flex-col">
        <span>Color Blue: </span>
        <input
          type="text"
          class="textfield"
          value={data.blue}
          on:input={(e) => colorEditor.onInputColor(e, "setBlue")}
        />
      </div>
      <div class="window-content-line flex-col">
        <span>Append: </span>
        <input
          type="text"
          class="textfield"
          value={data.append}
          on:input={(e) => colorEditor.onValueChange(e, "setAppend")}
        />
        <button
          class="button-solid"
          on:click={(e) => colorEditor.applyColor()}
        >
          Apply Color
        </button>
      </div>
      <div class="window-content-line flex-col">
        <div style={`background-color: #${data.editColorHex}`}></div>
      </div>
    </div>
    <div class="search-area flex-row">
      <div class="title window-content-line flex-col">
        <h3>SEARCH</h3>
      </div>
      <div
        class={`window-content-line flex-col${data.allowEditing ? "" : " hidden"}`}
      >
        <span>Color Red: </span>
        <input
          id="colorEditorSearchRed"
          type="text"
          class="textfield"
          value={data.searchRed}
          on:input={(e) => colorEditor.onInputColor(e, "setSearchRed")}
        />
      </div>
      <div
        class={`window-content-line flex-col${data.allowEditing ? "" : " hidden"}`}
      >
        <span>Color Green: </span>
        <input
          type="text"
          class="textfield"
          value={data.searchGreen}
          on:input={(e) => colorEditor.onInputColor(e, "setSearchGreen")}
        />
      </div>
      <div
        class={`window-content-line flex-col${data.allowEditing ? "" : " hidden"}`}
      >
        <span>Color Blue: </span>
        <input
          type="text"
          class="textfield"
          value={data.searchBlue}
          on:input={(e) => colorEditor.onInputColor(e, "setSearchBlue")}
        />
      </div>
      <div class={`flex-col${data.allowEditing ? "" : " hidden"}`}></div>
      <div
        class={`window-content-line flex-col${data.allowEditing ? "" : " hidden"}`}
      >
        <span>Append: </span>
        <input
          type="text"
          class="textfield"
          value={data.searchAppend}
          on:input={(e) => colorEditor.onValueChange(e, "setSearchAppend")}
        />
        <button
          class="button-solid"
          on:click={(e) => colorEditor.searchColor()}
        >
          Search Color
        </button>
      </div>
      <div class="search-result">
        {#each data.searchResults as sr, index}
          <button
            class={sr.index.toString() === data.colorIndex.toString() ? "selected" : ""}
            on:click={(e) => colorEditor.setSearchIndex(index)}
          >
            {sr.label}
          </button>
        {/each}        
      </div>
    </div>
  </div>
  <div
    class={`patch-area window-content-line flex-col${data.gameReady ? "" : " hidden"}`}
  >
    <button
      class="button-solid"
      on:click={colorEditor.requestFile}
    >
      Apply Patch
      <input
        type="file"
        value=""
        on:change={colorEditor.onLoadPatchFileChange}
      />
    </button>
    <button
      class="button-solid"
      on:click={(e) => colorEditor.generatePatch()}
    >
      Generate Patch
    </button>
  </div>
</div>