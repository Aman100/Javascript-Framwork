function $$$(a)
{}
$$$.modals=new Map();
$$$.setupModals=function(){
document.querySelectorAll("*").forEach(function(node){
var forModal=node.getAttribute("forModal");
if(forModal==null) return;
if(forModal.toUpperCase()!="TRUE") return;
if(!node.id) return;
var existing=$$$.modals.get(node.id);
if(existing)
{
existing.multiple=true;
return;
}
// remove the node from dom
var nodeBackgroundColor=window.getComputedStyle(node,null).getPropertyValue("background-color");
node.remove();
node.style.display="block";
node.style.marginTop="18px";
node.style.marginLeft="5px";
node.style.marginRight="5px";
node.style.marginBottom="5px";
var modalMaskDivision=document.createElement("div");
modalMaskDivision.id="tm$$$modalMask_"+node.id;
modalMaskDivision.classList.add("modalMask");
var modalWindowDivision=document.createElement("div");
modalWindowDivision.id="tm$$$modalWindow_"+node.id;
modalWindowDivision.classList.add("modalWindow");
modalWindowDivision.style.backgroundColor=nodeBackgroundColor;
var modalWindowCloseButtonDivision=document.createElement("div");
modalWindowCloseButtonDivision.id="tm$$$modalWindowCloseButton_"+node.id;
modalWindowCloseButtonDivision.classList.add("modalWindowCloseButton");
var closeButton=document.createElement("i");
closeButton.classList.add("fa");
closeButton.classList.add("fa-window-close");
modalWindowCloseButtonDivision.appendChild(closeButton);
modalWindowDivision.appendChild(modalWindowCloseButtonDivision);
modalWindowDivision.appendChild(node);
modalMaskDivision.appendChild(modalWindowDivision);
$$$.modals.set(node.id,{
"node": node,
"multiple": false,
"modalMask": modalMaskDivision,
"modalWindow" : modalWindowDivision,
"modalWindowCloseButton" : modalWindowCloseButtonDivision
}); // map's setter
document.body.appendChild(modalMaskDivision);
}); // forEach
} // setupModals

$$$.showModal=function(jsonObject){
if(jsonObject.id==undefined) throw "Modal id not specified";
if(typeof jsonObject.id!="string") throw "Modal id should be a string";
var modalId=jsonObject.id.substring(1);
if(!$$$.modals.has(modalId)) throw "Invalid modal id : "+modalId;
var nodeWrapper=$$$.modals.get(modalId);
console.log(nodeWrapper)
if(nodeWrapper.multiple) throw "Multiple modals with same id : "+modalId;
nodeWrapper.jsonObject=jsonObject;

nodeWrapper.onOpen=function(){
if(nodeWrapper.jsonObject.onOpen!=undefined) nodeWrapper.jsonObject.onOpen();
}

nodeWrapper.onCloseButtonClicked=function(){
var modalCloseEvent={
"handled": false
};
if(nodeWrapper.jsonObject.onClose!=undefined)
{
nodeWrapper.jsonObject.onClose(modalCloseEvent);
}
if(!modalCloseEvent.handled)
{
nodeWrapper.modalWindowCloseButton.removeEventListener('click',nodeWrapper.onCloseButtonClicked);
document.removeEventListener('keydown',nodeWrapper.onKeyDown);
nodeWrapper.modalMask.removeEventListener('click',nodeWrapper.onClickedOutside);
nodeWrapper.modalMask.style.display='none';
}
}

nodeWrapper.onKeyDown=function(event){
alert('onKeyDown chala');
if(event.keyCode==27)
{
if(nodeWrapper.jsonObject.closeOnEscape==undefined) return;
if(nodeWrapper.jsonObject.closeOnEscape) nodeWrapper.onCloseButtonClicked();
}
}

nodeWrapper.onClickedOutside=function(event){
alert('onClickedOutside chala');
if(event.target.id!=nodeWrapper.modalMask.id) return;
if(nodeWrapper.jsonObject.closeOnClickedOutside==undefined) return;
if(nodeWrapper.jsonObject.closeOnClickedOutside) nodeWrapper.onCloseButtonClicked();
};

if(jsonObject.onOpen!=undefined)
{
if(typeof jsonObject.onOpen!="function") throw 'onOpen should assigned reference of a function';
}
if(jsonObject.onClose!=undefined)
{
if(typeof jsonObject.onClose!="function") throw 'onClose should assigned reference of a function';
}
if(jsonObject.closeOnEscape!=undefined)
{
if(typeof jsonObject.closeOnEscape!="boolean") throw "closeOnEscape should be boolean";
}
if(jsonObject.closeOnClickedOutside!=undefined)
{ 
if(typeof jsonObject.closeOnClickedOutside!="boolean") throw "closeOnClickedOutside should be boolean";
}

nodeWrapper.modalWindowCloseButton.addEventListener('click',nodeWrapper.onCloseButtonClicked);
document.addEventListener('keydown',nodeWrapper.onKeyDown);
nodeWrapper.modalMask.addEventListener('click',nodeWrapper.onClickedOutside);
nodeWrapper.modalMask.style.display='block';
nodeWrapper.onOpen();
}

$$$.validateGetJSON=function(jsonObject)
{
if(!jsonObject.url) throw '$$$.get({"url": not specified})';
if(typeof jsonObject.url!="string") throw '$$$.get({"url": "not a string"})';
if(jsonObject.onResponse)
{
if(typeof jsonObject.onResponse!="function") throw '$$$.get({"onResponse": function required })';
} if(jsonObject.responseDataType)
{ if(typeof jsonObject.responseDataType!="string") throw '$$$.get({"responseDataType": " string required"})'
var types=["JSON","STRING","TEXT","NUMBER","BOOLEAN"];
var responseDataType=jsonObject.responseDataType.toUpperCase();
if(types.includes(responseDataType)==false) throw '$$$.get({"responseDataType": should be one of [\"'+types.join('","')+'\"]})';
} if(jsonObject.onError)
{ if(typeof jsonObject.onError!="function") throw '$$$.get({"onError": function required })';
} if(jsonObject.ajax!=undefined)
{ if(typeof jsonObject.ajax!="boolean") throw '$$$.get({"ajax": boolean required })';
}}
// validateGetJSON ends
$$$.get=function(jsonObject)
{
$$$.validateGetJSON(jsonObject);
var xmlHttpRequest=new XMLHttpRequest();
xmlHttpRequest.onreadystatechange=function(){
if(xmlHttpRequest.readyState==4)
{ if(xmlHttpRequest.status==200)
{ if(jsonObject.onResponse)
{
var response=xmlHttpRequest.responseText;
if(jsonObject.responseDataType)
{
if(jsonObject.responseDataType.toUpperCase()=="JSON") response=JSON.parse(response);
}
jsonObject.onResponse(response);
}
return;
}
if(xmlHttpRequest.status==404)
{
if(jsonObject.onError)
{
jsonObject.onError();
}
}
}
};
var ajax=true;
if(jsonObject.ajax!=undefined) ajax=jsonObject.ajax;
xmlHttpRequest.open('GET',jsonObject.url,ajax);
xmlHttpRequest.send();
}

$$$.post=function(jsonObject)
{
var xmlHttpRequest=new XMLHttpRequest();
xmlHttpRequest.onreadystatechange=function(){
if(xmlHttpRequest.readyState==4)
{
if(xmlHttpRequest.status==200)
{
if(jsonObject.onResponse)
{
var response=xmlHttpRequest.responseText;
if(jsonObject.responseDataType)
{
if(jsonObject.responseDataType.toUpperCase()=="JSON") response=JSON.parse(response);
}
jsonObject.onResponse(response);
}
return;
}
if(xmlHttpRequest.status==404)
{
if(jsonObject.onError)
{
jsonObject.onError();
}
}
}
};
var ajax=true;
if(jsonObject.ajax!=undefined) ajax=jsonObject.ajax;
xmlHttpRequest.open('POST',jsonObject.url,ajax);
xmlHttpRequest.setRequestHeader("Content-Type","application/json");
xmlHttpRequest.send(JSON.stringify(jsonObject.data));
}//post ends


//Form Validation Code Starts
function $$$(cid){
let element=document.getElementById(cid);
if(!element) throw "Invalid id : "+cid;

let parameter=cid;
if(element.tagName=="FORM")
{
document.getElementById(parameter).isValid=function(obj)
{
var valid=true;
for(var key in obj)
{
var elements=document.getElementsByName(key);
if(elements.length==1)
{
var element=elements[0];
elementType=element.type;
if(elementType=='text')
{
value=element.value.trim();
document.getElementById(obj[key].errorPane).innerHTML="";
if(obj[key].required==true && value=="")
{
valid=false;
document.getElementById(obj[key].errorPane).style="color:red";
document.getElementById(obj[key].errorPane).innerHTML=obj[key].errors.required;
} 
if(value.length>obj[key].maxLength)
{
valid=false;
document.getElementById(obj[key].errorPane).style="color:red";
document.getElementById(obj[key].errorPane).innerHTML=obj[key].errors.maxLength;
}
}
if(elementType=='textarea')
{
value=element.value.trim();
document.getElementById(obj[key].errorPane).style="color:red";
document.getElementById(obj[key].errorPane).innerHTML="";
if(obj[key].required==true && value=="")
{
valid=false;
document.getElementById(obj[key].errorPane).style="color:red";
document.getElementById(obj[key].errorPane).innerHTML=obj[key].errors.required;
}
}
if(elementType=='select-one')
{
value=element.value;
document.getElementById(obj[key].errorPane).style="color:red";
document.getElementById(obj[key].errorPane).innerHTML="";
if(value==obj[key].invalid)
{
valid=false;
document.getElementById(obj[key].errorPane).innerHTML=obj[key].errors.invalid;
}
}
if(elementType=='checkbox')
{
if(obj[key].requiredState!=element.checked && obj[key].displayAlert==true)
{
alert(obj[key].errors.requiredState);
}
}
}// if condition for elementSize==1 ends here
else
{
var firstElement=elements[0];
var secondElement=elements[1];
if(firstElement.type=='radio' && secondElement.type=='radio')
{
document.getElementById(obj[key].errorPane).innerHTML="";
if(obj[key].required==true && firstElement.checked==false && secondElement.checked==false)
{
valid=false;
document.getElementById(obj[key].errorPane).style="color:red";
document.getElementById(obj[key].errorPane).innerHTML=obj[key].errors.required;
}
}
}
}// for loop ends here
return valid;
}// isValid function ends here
return document.getElementById(parameter)
}
//Form Validation Code Starts


$$$.initFramework=function()
{
$$$.setupModals();
}
window.addEventListener('load',function(){
// to boot the framework
$$$.initFramework();
});