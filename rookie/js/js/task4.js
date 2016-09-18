function fetchdata(){
	var city = document.getElementById('aqi-city-input').value;
	var index = document.getElementById('aqi-value-input').value;
	var array = [city,index];
	return array;
}
function testdata(data){
	var isCity = data[0].trim().replace(/[A-Za-z\u4e00-\u9fa5]+/,'');
	var isNum  = parseInt(data[1].trim());
	isNum = (isNum == data[1].trim());
	var ret = [];

	if(!isCity && isNum) return data;
	else return null;
}
function renderdata(data){
	var res = '<td>' + data[0] + '</td><td>' + data[1] + '</td><td>' + 
		"<button class='rmv-btn' onclick='removeitem()'>删除</button>" + '</td>';
	var tr = document.createElement("TR");
	tr.innerHTML = res;
	document.getElementById('aqi-table').appendChild(tr);
}
function flow(){
	var data = fetchdata();
	if(testdata(data)){renderdata(data)} ; 
}
function removeitem(ev){
	var ev = ev || window.event;
	var target = ev.srcElement;
	target.parentNode.parentNode.parentNode.removeChild(target.parentNode.parentNode);
}
function init(){
	var add = document.getElementById('add-btn');
	if(add)
		add.addEventListener('click',flow,false);
}
init()