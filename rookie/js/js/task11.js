var $ = function(el) { return document.querySelector(el); }
var nodes = [];
var t;
//get another elment node(nodetype == 1)
function getNextElement(node){
	var ele = node;
	while(ele.nextSibling){
		ele = ele.nextSibling
		if(ele.nodeType == 1 && ele.childNodes.length != 0) return ele;
	}
	return null;
}
//reset interval
function restart(){
	nodes.length = 0;
	clearInterval(t);
}
//deep-first search
//fl: found flag
function deeporder(root, str="",fl = false){
	if(fl == 1) return;
	if(str != "" && root.firstChild.nodeValue.trim() == str){
		root.id = "target";
		fl = 1;
	} 
	nodes.push(root);
	if(root.children.length != 0) deeporder(root.children[0],str,fl);
	if(getNextElement(root)) deeporder(getNextElement(root),str,fl);
}
//breath-first search
function breaorder(root, str=""){
	var arr = [root];
	while(arr.length != 0){
		var curr = arr.shift();
		if(curr.children.length != 0)
			for(var n = curr.children[0]; n; n = getNextElement(n))
				arr.push(n);
		if(str != "" && curr.firstChild.nodeValue.trim() == str){
			curr.id = "target";
			nodes.push(curr);
			break;
		} 
		nodes.push(curr);
	}
	arr.length = 0;
}
//clear the css style
function clear(){
	var n = $('#active'), m = $('#found');
	if(n != null) n.removeAttribute("id");
	if(m != null) m.removeAttribute("id");
}
//one-step animate
function animate(type){
	clear();
	if(nodes.length == 0){
		clearInterval(t);
		if(type) alert("搜索内容未找到~");
		return;
	} 
	var n = nodes.shift();
	if(n.id == "target"){
		n.setAttribute("id", "found");
		clearInterval(t);
		return;
	}
	n.setAttribute("id","active");
}
//following code can be encapsulated ;
$('#deeporder').onclick = function(){
	if(typeof(t) != "undefined") restart();
	deeporder($('.root'));
	t = setInterval("animate()",500);
}
$("#breaorder").onclick = function(){
	if(typeof(t) != "undefined") restart();
	breaorder($('.root'));
	t = setInterval("animate()",500);
}
$("#submit").onclick = function(){
	if(typeof(t) != "undefined") restart();
	var type = $("#searchtype").value;
	if(type == "deep")
		deeporder($('.root'),$("#search").value.trim());
	else
		breaorder($('.root'),$("#search").value.trim());
	t = setInterval("animate(1)",500);
} 