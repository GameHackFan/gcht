import { componentService } from "../../service/ComponentService";
import { zoomService } from "../../service/ZoomService";


class Footer
{  
  updateZoom = () =>
  {
    this.zoom = zoomService.getValidZoom("footer");
    this.setViewData(this.getViewData());
  }

  getViewData = () =>
  {  
    return {zoom: this.zoom, appVersion: this.appVersion};
  }

  constructor(setViewData)
  {
    componentService.setController("footer", this);
    this.setViewData = setViewData;
    this.appVersion = "Version 0.5, \u00A9 2022";
    this.updateZoom();
  }
}


export { Footer };