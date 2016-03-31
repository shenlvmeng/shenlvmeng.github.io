var arr;
function put_in(){
	var ev = window.event;
	if(!ev) return;
	var dir =  ev.srcElement.id;
	if(dir != "unshift" && dir != "push") return;
	if(arr.length >= 60) alert("元素超过60个");
	var num = document.getElementById('num_in').value;
	num = parseInt(num);
	if(num){
		if(num > 100 || num < 10){
			alert("请输入10-100间的整数");
			return;
		}
		if(dir == "unshift") arr.unshift(num);
		else arr.push(num);

		var div = document.createElement("DIV");
		div.innerHTML = "<span>" + num + "</span>";
		div.style.height = (200 + (num-10)*2) + "px";

		var container = document.getElementById('container');
		if(dir == "unshift") container.insertBefore(div, container.firstChild);
		else container.appendChild(div);
	}
}
function take_out(){
	var ev = window.event;
	if(!ev || !arr.length) return;
	var dir =  ev.srcElement.id;
	if(dir != "shift" && dir != "pop") return;
	var num;
	var container = document.getElementById('container');
	if(dir == "shift"){
		container.removeChild(container.firstChild);
		num = arr.shift();
	} 
	else{
		container.removeChild(container.lastChild);
		num = arr.pop();
	} 
}
function bubble_sort() {
	if(arr.length == 0){
		alert("数组为空!");
		return;
	}
	len = arr.length;
	var i = 0;
	var j = len - 1;
	var t2;
	t = setInterval('bubble_sort.moveone()', 100);
	bubble_sort.moveone = function(){
		if(i >= len) clearInterval(t);
		j = len - 1;
		t2 = setInterval('bubble_sort.moveonebyone()',100);
		i++;
	}
	bubble_sort.moveonebyone = function(){
		if(j <= i) clearInterval(t2);
			if(arr[j] < arr[j-1]){
				replace_node(j-1,j);
				arr[j] += arr[j-1];
				arr[j-1] = arr[j] - arr[j-1];
				arr[j] -= arr[j-1];
			}
			j--;
	}
}
function replace_node(i,j) {
	var par = document.getElementById('container');
	var node = par.childNodes[i];
	var node2 = par.childNodes[j];
	par.replaceChild(node2,par.childNodes[i]);
	par.childNodes[j-1].nextSibling ? par.insertBefore(node,par.childNodes[j-1].nextSibling) : par.appendChild(node);
	var start = new Date().getTime();
	return;
}

function init() {
	arr = [];
	document.getElementById("unshift").addEventListener("click",put_in,false);
	document.getElementById("push").addEventListener("click",put_in,false);
	document.getElementById("shift").addEventListener("click",take_out,false);
	document.getElementById("pop").addEventListener("click",take_out,false);
	document.getElementById("bubble_sort").addEventListener("click",bubble_sort,false);
}
init();