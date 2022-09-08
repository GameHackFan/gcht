import { componentService } from "../../service/ComponentService";
import { zoomService } from "../../service/ZoomService";
import appIcon from "../../image/base/gcht_icon.png";


class Header
{
  updateZoom = () =>
  {
    this.zoom = zoomService.getValidZoom("header");
    this.setViewData(this.getViewData());
  }

  getViewData = () =>
  {
    return {zoom: this.zoom, appIcon};
  }

  constructor(setViewData)
  {
    componentService.setController("header", this);
    this.setViewData = setViewData;
    this.updateZoom();
  }
}


export { Header };