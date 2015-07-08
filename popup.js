var responseObject;

$(function(){
  $("#typeDropdown").bind("change", getOSList);
  $("#osDropdown").bind("change", getDevice);
  $("#devicesDropdown").bind("change", getURL);
  $("#redirectButton").bind("click", goTest);
  document.getElementById("yey").innerHTML += "asdqwe";
  $.ajax({
    'url' : 'https://www.browserstack.com/list-of-browsers-and-platforms.json?product=live',
    'type' : 'GET',
    'dataType' : 'json',
    'success' : function(response) {
      responseObject = response;
      getTypes();
    }
  });
});

function getTypes(){
  var types = Object.keys(responseObject);
  for(var iter=0; iter < types.length; iter++){
    $('#typeDropdown').append('<option value='+types[iter]+'>'+types[iter]+'</option>');
  }
};

function getOSList(){
  osList = getOSFromJSON($('#typeDropdown').val());
  $('#osDropdown').find('option').remove();
  for(var iter=0; iter < osList.length; iter++){
    $('#osDropdown').append('<option value='+JSON.stringify(osList[iter]['os'])+'>'+osList[iter]['os_display_name']+'</option>');
  }
};

function getDevice(){
  devicesList = getDevicesFromJSON($('#typeDropdown').val(), $('#osDropdown').val());
  $('#devicesDropdown').find('option').remove();
  for(var iter=0; iter < devicesList.length; iter++){
    $('#devicesDropdown').append('<option value='+JSON.stringify(devicesList[iter]['device'])+'>'+devicesList[iter]['display_name']+'</option>');
  }
};

function goTest(){
  chrome.tabs.create({url: getURL(), selected: true});
};

function getURL(){
  deviceDict = getCompleteDetails($('#typeDropdown').val(), $('#osDropdown').val(), $('#devicesDropdown').val());
  urlString = "https://www.browserstack.com/start#";
  urlString += "os="+$('#osDropdown').val();
  urlString += "&os_version="+deviceDict['os_version'];
  urlString += "&device="+deviceDict['device'];
  //urlString += "&browser=IE";
  //urlString += "&browser_version=8.0";
  urlString += "&scale_to_fit=true";
  urlString += "&url="+($('#urlInput').val() == "" ? 'www.google.com' : $('#urlInput').val());
  urlString += "&resolution=1024x768&speed=1&start=true";
  return urlString;
};

function getOSFromJSON(type){
  return responseObject[type];
};

function getDevicesFromJSON(type, os){
  osList = getOSFromJSON(type);
  for(var iter=0; iter<osList.length; iter++){
    if(osList[iter]['os'] == os){
      return osList[iter]['devices'];
    }
  };
  return [];
};

function getCompleteDetails(type, os, device){
  devicesList = getDevicesFromJSON(type, os);
  for(var iter=0; iter<devicesList.length; iter++){
    if(devicesList[iter]['device'] == device){
      return devicesList[iter];
    }
  };
};
