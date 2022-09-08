import { componentService } from "./ComponentService";


class ZoomService
{
  createPresetObject = () =>
  {
    const p = {type: "zoom", data: {}};
    Object.keys(dataMap).forEach((k) =>
    {
      const zoom = dataMap[k];

      if(!isNaN(parseFloat(zoom)))
        p.data[k] = zoom.toString();
    });
    return p;
  }

  applyPreset = (preset) =>
  {
    const json = JSON.parse(preset);

    if(json && json.data && json.type === "zoom")
      Object.keys(json.data).forEach((k) => this.setZoom(k, json.data[k]));
  }

  setZoom = (key, value) =>
  {
    if(key in dataMap)
    {
      dataMap[key] = value;
      componentService.callMethod(key, "updateZoom");
    }
  }

  getValidZoom = (key) =>
  {
    const z = dataMap[key];
    const v = z ? parseFloat(z) : 1;
    return v >= 1 ? v : 1;
  }

  getZoom = (key) =>
  {
    return dataMap[key];
  }

  setDataMapToDefault = () =>
  {
    const d = createDefaultDataMap();
    Object.keys(d).forEach((k) => this.setZoom(k, d[k]));
  }

  hasComponentKey = (key) =>
  {
    return (key in dataMap);
  }

  constructor()
  {
    dataMap = createDefaultDataMap();
  }
}


const createDefaultDataMap = () =>
{
  const map = {};
  map.footer = "1";
  map.header = "1";
  map.windowList = "1";
  map.manager = "1";
  map.zoom = "1";
  map.color = "1";
  map.converter = "1";
  return map;
}


let dataMap;


export const zoomService = new ZoomService();