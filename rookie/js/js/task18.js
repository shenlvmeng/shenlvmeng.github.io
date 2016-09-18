var $ = function(el) { return document.querySelector(el); };
function test(){
	if(test_n() + test_p() + test_r() + test_e() + test_m() == 5)
		return 1;
	else return 0;
}
function test_n(){
	var text = $("#uname").value;
	if(!new RegExp(/^\S+$/g).test(text)){render(3);return 0;}
	if(text.replace(/[\u0100-\uffff]/g,"--").length > 16){render(2);return 0;}
	if(text.length < 4) {render(1);return 0;}
	render(0); return 1;
}
function test_p() {
	var text = $("#upass").value;
	if(!new RegExp(/[\w.-]+/g).test(text)) {render(4);return 0;}
	if(text.length > 16 || text.length < 6) {render(5);return 0;}
	render(6);return 1;
}
function test_r() {
	var text = $("#reupass").value;
	if(text != $("#upass").value) {render(7);return 0;}
	render(8);return 1;
}
function test_e() {
	var text = $("#uemail").value;
	if(!new RegExp(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/g).test(text)) {render(9);return 0;}
	render(10);return 1;
}
function test_m() {
	var text = $("#umonum").value;
	if(!new RegExp(/^1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|70)\d{8}$/g).test(text)) {render(11);return 0;}
	render(12);return 1;
}
function render(code){
	switch(code){
		case 0:
			$("#hint_n").innerHTML = "名称可用";
			$("#hint_n").className = "right";
			$("#uname").className = "right";
			break;
		case 1:
			$("#hint_n").innerHTML = "名称过长";
			$("#hint_n").className = "error";
			$("#uname").className = "error";
			break;
		case 2:
			$("#hint_n").innerHTML = "名称过短";
			$("#hint_n").className = "error";
			$("#uname").className = "error";
			break;
		case 3:
			$("#hint_n").innerHTML = "名称中有不合法符号";
			$("#hint_n").className = "error";
			$("#uname").className = "error";
			break;
		case 4:
			$("#hint_p").innerHTML = "密码中有不合法符号";
			$("#hint_p").className = "error";
			$("#upass").className = "error";
			break;
		case 5:
			$("#hint_p").innerHTML = "密码长度不合法";
			$("#hint_p").className = "error";
			$("#upass").className = "error";
			break;
		case 6:
			$("#hint_p").innerHTML = "密码可用";
			$("#hint_p").className = "right";
			$("#upass").className = "right";
			break;
		case 7:
			$("#hint_r").innerHTML = "两次密码输入不一致";
			$("#hint_r").className = "error";
			$("#reupass").className = "error";
			break;
		case 8:
			$("#hint_r").innerHTML = "两次密码输入一致";
			$("#hint_r").className = "right";
			$("#reupass").className = "right";
			break;
		case 9:
			$("#hint_e").innerHTML = "邮箱格式不正确";
			$("#hint_e").className = "error";
			$("#uemail").className = "error";
			break;
		case 10:
			$("#hint_e").innerHTML = "邮箱格式正确";
			$("#hint_e").className = "right";
			$("#uemail").className = "right";
			break;
		case 11:
			$("#hint_m").innerHTML = "手机格式不正确";
			$("#hint_m").className = "error";
			$("#umonum").className = "error";
			break;
		case 12:
			$("#hint_m").innerHTML = "手机格式正确";
			$("#hint_m").className = "right";
			$("#umonum").className = "right";
			break;
		default:
			alert("未知错误");
	}
}
$("#uname").onfocus = function(){
	this.removeAttribute("class");
	$("#hint_n").innerHTML = "名称需在6~16个字符间";
	$("#hint_n").className = "info";
}
$("#upass").onfocus = function(){
	this.removeAttribute("class");
	$("#hint_p").innerHTML = "密码需在6~16位间的英文（包含. -）";
	$("#hint_p").className = "info";
}
$("#reupass").onfocus = function(){
	this.removeAttribute("class");
	$("#hint_r").innerHTML = "再输入一次密码";
	$("#hint_r").className = "info";
}
$("#uemail").onfocus = function() {
	this.removeAttribute("class");
	$("#hint_e").innerHTML = "请输入正确格式的邮箱";
	$("#hint_e").className = "info";
}
$("#umonum").onfocus = function() {
	this.removeAttribute("class");
	$("#hint_m").innerHTML = "请输入正确格式的手机号码";
	$("#hint_m").className = "info";
}
$("#uname").onblur = function(){
	test_n();
}
$("#upass").onblur = function(){
	test_p();
}
$("#reupass").onblur = function(){
	test_r();
}
$("#uemail").onblur = function(){
	test_e();
}
$("#umonum").onblur = function(){
	test_m();
}
$("#info").onsubmit = function() {
	if(test()) alert("提交成功！");
	else alert("输入有误！");
	return false;
}