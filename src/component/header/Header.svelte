<script>
  import { Header } from "./header";

  let data;
  const setData = (newData) => {data = newData};
  const header = new Header(setData);
</script>

<style>@import url("./header.css");</style>


<!-- svelte-ignore component-name-lowercase -->
<header class="header flex-col" style={`zoom: ${data.zoom}`}>
  <div>
    <img src={data.appIcon} alt="Tool Logo" />
    <span>Game Color Helper Tool</span>
  </div>
</header>