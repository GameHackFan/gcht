<script>
  import EditorManager from "../manager/EditorManager.svelte";
  import ZoomManager from "../zoom/ZoomManager.svelte";
  import ColorEditor from "../color/ColorEditor.svelte";
  import ColorConverter from "../converter/ColorConverter.svelte";

  export let componentProps;
  const componentMap =
  {
    "manager": EditorManager, "zoom": ZoomManager,
    "color": ColorEditor, "converter": ColorConverter
  }
  const component = componentMap[componentProps.key];
</script>


{#if component}
  <svelte:component this={component} props={componentProps} />
{/if}
