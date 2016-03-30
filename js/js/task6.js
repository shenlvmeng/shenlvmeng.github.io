var arr;
function put_in(dir){
	var ev = window.event;
	if(!ev) return;
	var dir =  ev.srcElement.id;
	if(dir != "left_in" && dir != "right_in") return;
	var num = document.getElementById('num_in').value;
	num = parseInt(num);
	if(num){
		if(dir == "left_in") arr.unshift(num);
		else arr.push(num);

		var div = document.createElement("DIV");
		div.innerHTML = num;
		div.onclick=remove;

		var container = document.getElementById('container');
		if(dir == "left_in") container.insertBefore(div, container.firstChild);
		else container.appendChild(div);
	}
}
function take_out(dir){
	var ev = window.event;
	if(!ev || !arr.length) return;
	var dir =  ev.srcElement.id;
	if(dir != "left_out" && dir != "right_out") return;
	var num;
	var container = document.getElementById('container');
	if(dir == "left_out"){
		container.removeChild(container.firstChild);
		num = arr.shift();
	} 
	else{
		container.removeChild(container.lastChild);
		num = arr.pop();
	} 
	alert(num);
}
function remove(ev){
	var ev = ev || window.event;
	var target =  ev.srcElement;
	target.parentNode.removeChild(target);
}
function init() {
	arr = [];
	document.getElementById("left_in").addEventListener("click",put_in,false);
	document.getElementById("right_in").addEventListener("click",put_in,false);
	document.getElementById("left_out").addEventListener("click",take_out,false);
	document.getElementById("right_out").addEventListener("click",take_out,false);
}
init();