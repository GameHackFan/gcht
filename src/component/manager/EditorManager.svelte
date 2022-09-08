<script>
  import { EditorManager } from "./editor-manager";

  export let props;
  let data;
  const setData = (newData) => {data = newData};
  const editorManager = new EditorManager(props, setData);
</script>

<style>@import url("./editor-manager.css");</style>


<div class="manager flex-row">
  <span class={`window-text${data.componentData.showHintText ? "" : " hidden"}`}>
    This is the main window of the editor. Here you can enable all 
    the features this editor offers. Here you can also load, clone 
    and download the game file. Before start editing the game file, 
    you need to load and clone it. After doing all the changes 
    desired, you need to click on Download Edited File to download 
    the edited game file.
  </span>
  <div class="window-content-line flex-col">
    <span>Window Selector: </span>
    <select
      class="button-solid"
      on:change={editorManager.onWindowSelected}
    >
      <option value="">
        Select a window
      </option>
      {#each editorManager.getValidWindowComponentDataList() as cd}
        <option value={cd.key}>{cd.title}</option>
      {/each}
    </select>
  </div>
  <div>
    <button
      class="button-solid"
      on:click={editorManager.requestFile}
    >
      Load Game File
      <input
        type="file"
        value=""
        on:change={editorManager.onLoadGameFileChange}
      />
    </button>
    <button
      class="button-solid"
      on:click={editorManager.cloneGame}
    >
      Clone Game File
    </button>
    <button
      class="button-solid"
      on:click={editorManager.downloadEditedGame}
    >
      Download Modified File
    </button>
  </div>
</div>