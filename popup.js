var responseObject;

$(function(){
  $("#typeDropdown").bind("change", getOSList);
  $("#osDropdown").bind("change", getTypeSpecific);
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
  var type = $('#typeDropdown').val();
  osList = getOSFromJSON(type);
  $('#osDropdown').find('option').remove();
  for(var iter=0; iter < osList.length; iter++){
    $('#osDropdown').append('<option value='+JSON.stringify(osList[iter]['os_display_name'])+'>'+osList[iter]['os_display_name']+'</option>');
  }
  if(type == 'mobile'){
    $('#devicesDropdown').show();
    $('#browserDropdown').hide();
  }else{
    $('#devicesDropdown').hide();
    $('#browserDropdown').show();
  }
};

function getTypeSpecific(){
  var type = $('#typeDropdown').val();
  var os_display_name = $('#osDropdown').val();
  if(type == 'mobile'){
    devicesList = getDevicesOrBrowsersFromJSON(type, os_display_name, 'devices');
    $('#devicesDropdown').find('option').remove();
    for(var iter=0; iter < devicesList.length; iter++){
      $('#devicesDropdown').append('<option value='+JSON.stringify(devicesList[iter]['device'])+'>'+devicesList[iter]['display_name']+'</option>');
    }
  }else{
    browsersList = getDevicesOrBrowsersFromJSON(type, os_display_name, 'browsers');
    $('#browserDropdown').find('option').remove();
    for(var iter=0; iter<browsersList.length; iter++){
      $('#browserDropdown').append('<option value='+JSON.stringify(browsersList[iter]['display_name'])+'>'+browsersList[iter]['display_name']+'</option>');
    };
  }
};

function goTest(){
  chrome.tabs.create({url: getURL(), selected: true});
};

function getURL(){
  var type = $('#typeDropdown').val();
  if(type == 'mobile'){
    deviceDict = getCompleteDetails(type, $('#osDropdown').val(), $('#devicesDropdown').val());
  }else{
    deviceDict = getCompleteDetails(type, $('#osDropdown').val(), $('#browserDropdown').val());
  }
  urlString = "https://www.browserstack.com/start#";
  urlString += "os="+deviceDict['os'];
  urlString += "&os_version="+deviceDict['os_version'];
  if(type == 'mobile'){
    urlString += "&device="+deviceDict['device'];
  }else{
    urlString += "&browser="+deviceDict['browser'];
    urlString += "&browser_version="+deviceDict['browser_version'];
  }
  urlString += "&scale_to_fit=true";
  urlString += "&url="+($('#urlInput').val() == "" ? 'www.google.com' : $('#urlInput').val());
  urlString += "&resolution=1024x768&speed=1&start=true";
  return urlString;
};

function getOSFromJSON(type){
  return responseObject[type];
};

function getDevicesOrBrowsersFromJSON(type, os_display_name, typeToRetrieve){
  osList = getOSFromJSON(type);
  for(var iter=0; iter<osList.length; iter++){
    if(osList[iter]['os_display_name'] == os_display_name){
      return osList[iter][typeToRetrieve];
    }
  };
  return [];
};

function getCompleteDetails(type, os_display_name, value){
  if(type == "mobile"){
    devicesList = getDevicesOrBrowsersFromJSON(type, os_display_name, 'devices');
    for(var iter=0; iter<devicesList.length; iter++){
      if(devicesList[iter]['device'] == value){
        returnDict = devicesList[iter];
        osList = getOSFromJSON(type);
        for(var iter = 0; iter<osList.length; iter++){
          if(osList[iter]['os_display_name'] == os_display_name){
            returnDict['os'] = osList[iter]['os'];
            return returnDict;
          }
        }
      }
    };
  }else{
    browsersList = getDevicesOrBrowsersFromJSON(type, os_display_name, 'browsers');
    for(var iter=0; iter<browsersList.length; iter++){
      if(browsersList[iter]['display_name'] == value){
        returnDict = browsersList[iter];
        osList = getOSFromJSON(type);
        for(var iter=0; iter<osList.length; iter++){
          if(osList[iter]['os_display_name'] == os_display_name){
            returnDict['os'] = osList[iter]['os'];
            returnDict['os_version'] = osList[iter]['os_version'];
            return returnDict;
          };
        };
      }
    };
  }
};
