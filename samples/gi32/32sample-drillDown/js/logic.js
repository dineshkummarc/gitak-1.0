jsx3.lang.Package.definePackage(
  "eg.drilldown",                //the full name of the package to create
  function(drilldown) {          //name the argument of this function
 
  var URL_BASE = "xml/";

/**
  * called by toggle event on a node in the tree
  */
  drilldown.lazyLoad = function(objTree,objRecordNode,strRecordId) {  
    // check if the given node has an open state of 2  
    if(objRecordNode.getAttribute("lazy") == 1) {   
      // remove the flag to fetch*/   
      objRecordNode.removeAttribute("lazy");    

      // request the new content, use the ID for the toggled record as the request id  
      var objHttp = new jsx3.net.Request(strRecordId);    

      var strURL = objTree.getServer().resolveURI(URL_BASE + strRecordId + ".xml");   

      objHttp.open("GET",strURL,true);    
      objHttp.subscribe(jsx3.net.Request.EVENT_ON_RESPONSE,drilldown.onLazyResponse);   

      // set a custom properties to be used by the callback to identify where to add the data   
      objHttp.parentrecordid = strRecordId;    
      objHttp.treeid = objTree.getId();    

      // send the request    
      objHttp.send();  
    }
  }

  
/**
 * callback after the data has returned
 */
  drilldown.onLazyResponse = function(objEvent) {  
  // delay on 700 ms to simulate a loading effect.
  setTimeout(function(){
    // get the request that just returned

    var objHttp = objEvent.target;  
    // get the custom properties that we set (the parent record to append the data to)

    var strRecordId = objHttp.parentrecordid;  
    var objTree = sampledrillDown.getJSXById(objHttp.treeid);  
    var objParentNode = objTree.getRecordNode(strRecordId);
  
    // remove the existing place-holder node for the tree (loading...)
    objParentNode.removeChildren();  

    // get the XML data (assume CDF is being returned) 
    var strCDF = objHttp.getResponseText();
    var objCDF = new jsx3.xml.Document();
    objCDF.loadXML(strCDF);
    
    // loop through the records in the response and call native entity methods to transfer
    var objRecords = objCDF.getChildNodes();

    while (objRecords.hasNext()) {
        var objRecord = objRecords.next().cloneNode();
        objParentNode.appendChild(objRecord);
    }
//objCDF.selectNodes("/data/record");  
/*    var maxLen = objRecords.getLength();  

    for(var i=maxLen-1;i>=0;i--) {   
      var objRecord = objRecords.getItem(i);  
      if(i==maxLen-1) {   
        objParentNode.appendChild(objRecord);  
      } 
      else {
        objParentNode.insertBefore(objRecord,myRecord);     
      }    
      var myRecord = objRecord;  
    } 
*/ 
    /*  now that the data model has been modified, repaint just the affected node in the tree to show*/  
   objTree.redrawRecord(strRecordId,jsx3.xml.CDF.UPDATE);
   },700)
  }
  
}
)