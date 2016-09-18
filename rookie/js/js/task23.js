var $ = function(el){ return document.querySelector(el); };
/*
	@param pos: array; use x-axis and y-axis to describe the positon of the block
	@param dir: enum(int); 0 for top, 1 for right, 2 for bottom, 3 for left
*/
function block(pos=[5,5], dir=0){
	this.pos = pos;
	this.dir = dir;
}
/*
	@param step: int; the step little block move forward
*/
block.prototype.go = function(step=1,dir=this.dir) {
	if(dir == 3) this.pos[0] -= step;
	else if(dir == 1) this.pos[0] += step;
	else if(dir == 0) this.pos[1] -= step;
	else if(dir == 2) this.pos[1] += step;
	else throw new Error("Unknown direction or unillegal step.");

	if(dir == 0 || dir == 3) {
		this.pos[0] = Math.max(this.pos[0],0);
		this.pos[1] = Math.max(this.pos[1],0);
	}
	else if(dir == 1 || dir == 2) {
		this.pos[0] = Math.min(this.pos[0],9);
		this.pos[1] = Math.min(this.pos[1],9);
	};
};
/*
	@param angle: string; define how to turn this block
			0 for turn left, 1 for turn right, 2 for turn back, 
			3 for to top, 4 for to right, 5 for to bottom, 6 for to left
*/
block.prototype.turn = function(angle){
	if(angle == 0) this.dir = (this.dir + 3) % 4;
	else if(angle == 1) this.dir = (this.dir + 1) % 4;
	else if(angle == 2) this.dir = (this.dir + 2) % 4;
	else if(angle > 2 && angle < 7) this.dir = angle - 3;
	else throw new Error("Illegal parameter for function turn.");
}
/*
	render the new block positon and direction
*/
block.prototype.render = function() {
	$("#square").style.left = this.pos[0] * 50 + "px";
	$("#square").style.top = this.pos[1] * 50 + "px";
	var dir = ["top","right","bottom","left"];
	$("#square").setAttribute("class",dir[this.dir]);
};
/*
	test commands users typing in
	@return bool 
*/
function test(command){
	var num = "";
	if(command == "") return true;
	if(command.substr(0,2) == "GO"){
		num = command.substr(3);
	} else if(command.substr(0,3) == "TUN"){
		if(["LEF","RIG","BAC"].indexOf(command.substr(4,3)) != -1) return true;
		else return false;
	} else if(command.substr(0,3) == "TRA" || command.substr(0,3) == "MOV"){
		if(["LEF","RIG","TOP","BOT"].indexOf(command.substr(4,3)) == -1) return false;
		num = command.substr(8);
	} else return false;
	return new RegExp(/^[0-9]*$/g).test(num);
}
/*
	test a single command string
	@param text: command in a line
	@return null
*/
function exec(text){
	var ang_arr = ["LEF","RIG","BAC"];
	var dir_arr = ["TOP","RIG","BOT","LEF"];
	if(text.substr(0,2) == "GO"){
		var s = parseInt(text.substr(3));
		if(s > 0) bl.go(s);
		else if(text.substr(3).trim() == "") bl.go();
		else alert("不合理的步数");
	}
	else if(text.substr(0,3) == "TUN"){
		var ang = text.substr(4,3);		
		if(ang_arr.indexOf(ang) != -1) bl.turn(ang_arr.indexOf(ang));
		else alert("不合法的转向命令");
	} else if(text.substr(0,3) == "TRA"){
		var s = parseInt(text.substr(8));
		if(s < 0 && text.substr(8).trim() != "") alert("不合理的步数");
		else {
			if(text.substr(8).trim() == "") s = undefined;
			if(dir_arr.indexOf(text.substr(4,3)) != -1) bl.go(s,dir_arr.indexOf(text.substr(4,3)));
			else alert("不合法的移动方向");
		}
	} else if(text.substr(0,3) == "MOV"){
		var dir = dir_arr.indexOf(text.substr(4,3));
		var s = parseInt(text.substr(8));
		if(s < 0 && text.substr(8).trim() != "") alert("不合理的步数");
		else{
			if(text.substr(8).trim() == "") s = undefined;
			if(dir != -1){
				bl.turn(dir+3);
				bl.render();
				bl.go(s);
			} else alert("不合法的旋转方向");
		}
	}
	else alert("未知命令");
	bl.render();
	if(commands.length == 0) clearInterval(t);
};
var bl = new block(),
	commands = [],
	t;
$("#opers").onscroll = function(){
	$('#rows').scrollTop = this.scrollTop;
}
$("#opers").onkeyup = function(e){
	if($("#rows").innerHTML == "" || e.keyCode == 13 || e.keyCode == 8){
		var text = $("#opers").value.replace(/\r/gi,"");
		commands = text.split("\n");
		var num = "";
		commands.forEach(function(el,index){
			el = el.trim();
			if(test(el)) num += index + 1 + '\n';
			else num += "<span class='error'>" + (index + 1) + "</span>" + '\n';
		});
		$("#rows").innerHTML = num;
	}
}
$("#refresh").onclick = function(){
	bl = new block();
	bl.render();
	$("#opers").value = "";
	$("#rows").innerHTML = "";
}
$("#oper").onclick = function(){
	var text = $("#opers").value.replace(/\r/gi,""),
		flag = false,
		num = "";
	commands = text.split("\n");
	commands.forEach(function(el,index){
		el = el.trim();
		if(test(el)) num += index + 1 + '\n';
		else{
			flag = true;
			num += "<span class='error'>" + (index + 1) + "</span>" + '\n';
		}
	});
	$("#rows").innerHTML = num;
	if(flag){
		alert("输入命令有误！");
		return false;
	} else if(commands == []){
		alert("命令为空！");
		return false;
	}
	commands = commands.filter(function(el){
		return el != "";
	});
	t = setInterval(function(){
		exec(commands.shift());
	},1000);
}