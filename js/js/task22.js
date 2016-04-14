var $ = function(el){ return document.querySelector(el); };
/*
	@pos: array; use x-axis and y-axis to describe the positon of the block
	@dir: enum(int); 0 for top, 1 for right, 2 for bottom, 3 for left
*/
function block(pos=[5,5], dir=0){
	this.pos = pos;
	this.dir = dir;
}
/*
	@step: int; the step little block move forward
*/
block.prototype.go = function(step=1,dir=this.dir) {
	if(dir == 3 && this.pos[0]-step >= 0) this.pos[0] -= step;
	else if(dir == 1 && this.pos[0]+step <= 9) this.pos[0] += step;
	else if(dir == 0 && this.pos[1]-step >= 0) this.pos[1] -= step;
	else if(dir == 2 && this.pos[1]+step <= 9) this.pos[1] += step;
	else throw new Error("Unknown direction or unillegal step.");
};
/*
	@angle: string; define how to turn this block
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
var bl = new block();
$("#oper").onclick = function(){
	var text = $("#oper_t").value;
	var ang_arr = ["LEF","RIG","BAC"];
	var dir_arr = ["TOP","RIG","BOT","LEF"];
	if(text == "GO") bl.go();
	else if(text.substr(0,3) == "TUN"){
		var ang = text.substr(-3);		
		if(ang_arr.indexOf(ang) != -1) bl.turn(ang_arr.indexOf(ang));
		else alert("不合法的转向命令");
	} else if(text.substr(0,3) == "TRA"){		
		if(dir_arr.indexOf(text.substr(-3)) != -1) bl.go(1,dir_arr.indexOf(text.substr(-3)));
		else alert("不合法的移动方向");
	} else if(text.substr(0,3) == "MOV"){
		var dir = dir_arr.indexOf(text.substr(-3));
		if(dir != -1){
			bl.turn(dir+3);
			bl.render();
			bl.go();
		} else alert("不合法的旋转方向");
	}
	else alert("未知命令");
	bl.render();
};