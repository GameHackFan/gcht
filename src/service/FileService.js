class FileService
{
  readTextFile = (extras) =>
  {
    if(extras.file)
    {
      const reader = new FileReader();
      reader.readAsText(extras.file, "UTF-8");
      reader.onload = (event) =>
      {
        this.dispatchSuccess(extras, event.target.result);
      }
      reader.onerror = (event) => {this.dispatchError(extras);}
    }
  }

  readFileAsBytes = (extras) =>
  {
    if(extras.file)
    {
      const reader = new FileReader();
      reader.readAsArrayBuffer(extras.file);
      reader.onload = (event) =>
      {
        const arrayBuffer = event.target.result;
        const data = new Uint8Array(arrayBuffer);
        this.dispatchSuccess(extras, data);
      };
      reader.onerror = (event) => {this.dispatchError(extras);};
    }
  }

  dispatchSuccess = (extras, data) =>
  {
    extras.actionData = data;
    extras.actionSuccessful = true;
    extras.errorMessage = null;

    if(extras.successCallback)
      extras.successCallback(extras);     
  }

  dispatchError = (extras) =>
  {
    extras.actionSuccessful = false;
    extras.successMessage = null;

    if(extras.errorCallback)
      extras.errorCallback(extras);
  }
}


export const fileService = new FileService();