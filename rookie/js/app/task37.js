var $ = function(el){ return document.querySelector(el); };
function sAlert(id,title,content,opts){
	var _this = this;
	this.id = id;
	this.title = title;
	this.content = content;
	this.width = opts.width ? opts.width : "400px";
	this.height = opts.height ? opts.height : "150px";
	if(opts.fixed === "absolute") this.fixed = "absolute";
	else this.fixed = "fixed";
	this.callback = opts.callback ? opts.callback : undefined;
	window.onresize = function(){_this.setBkg();};
}
String.prototype.replaceSpecial = function(){
	return this.replace(new RegExp(/\\\<\>/g),"");
}
sAlert.prototype = {
	create : function(){
		this.frame = document.createElement("div");
		this.alert_bkg = document.createElement("div");
		this.alert_dlg = document.createElement("div");
		this.frame.id = (this.id == "" ? "mess" : this.id);
		this.alert_bkg.className = "alert_bkg";
		this.alert_dlg.className = "alert_dlg";
		document.body.appendChild(this.frame);
		this.box = $("#"+this.id);
		this.box.appendChild(this.alert_bkg);
		this.box.appendChild(this.alert_dlg);
		this.alert_ttl = document.createElement("div");
		this.alert_con = document.createElement("div");
		this.alert_btn = document.createElement("div");
		this.alert_ttl.className = "alert_ttl";
		this.alert_con.className = "alert_con";
		this.alert_btn.className = "alert_btn";
		this.con = $(".alert_dlg");
		this.con.appendChild(this.alert_ttl);
		this.con.appendChild(this.alert_con);
		this.con.appendChild(this.alert_btn);
		this.fillCon();
		this.reSize();
		this.fixPos();
		this.frame.style.opacity = "1";
		this.alert_bkg.style.opacity = "0.5";
		this.alert_dlg.style.opacity = "1";
	},
	fillCon : function(){
		var _this = this;
		var h4 = document.createElement("h4");
		h4.innerHTML = (this.title == "" ? "提示内容" : this.title);
		this.alert_ttl.appendChild(h4);
		this.alert_con.innerHTML = (this.content == "" ? "确认点击确认么？" : this.content.replaceSpecial());
		this.btn_yes = document.createElement("button");
		this.btn_nop = document.createElement("button");
		this.btn_yes.innerHTML = "确认";
		this.btn_nop.innerHTML = "取消";
		this.btn_yes.onclick = function(e){_this.close(1);};
		this.btn_nop.onclick = function(e){_this.close(0);};
		this.btn_yes.className = "right";
		this.alert_btn.appendChild(this.btn_yes);
		this.alert_btn.appendChild(this.btn_nop);
	},
	reSize : function(){
		this.alert_dlg.style.minWidth = parseInt(this.width) + "px";
		this.alert_dlg.style.marginRight = (parseInt(this.width) - 400) / 2 + "px";
		this.alert_ttl.style.minWidth = parseInt(this.width) - 10 + "px";
		this.alert_dlg.style.minHeight = parseInt(this.height) + "px";
		this.alert_dlg.style.marginBottom = (parseInt(this.height) - 150) / 2 + "px";
	},
	setBkg : function() {
		var _this = this;
		//兼容性考虑
		this.oScrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
		this.oScrollWidth = document.body.scrollWidth || document.documentElement.scrollWidth;
		this.alert_bkg.style.width = document.documentElement.clientWidth + (this.oScrollWidth - document.documentElement.clientWidth) +'px';
		this.alert_bkg.style.height = document.documentElement.clientHeight + (this.oScrollHeight - document.documentElement.clientHeight) +'px';
		this.alert_bkg.onclick = function(e){
			e = e || window.event;
			if(e.target.className === "alert_dlg") return false;
			_this.close(0);
		};
	},
	fixPos : function(){
		if(this.fixed != "fixed") return false;
		var _this = this;
		this.alert_dlg.style.cursor = "move";
		this.alert_dlg.style.position = "fixed";
		this.alert_dlg.onmousedown = function(e){
			var _thisE = this;
			e = e || window.event;
			this.X = e.clientX - _this.alert_dlg.offsetLeft;
			this.Y = e.clientY - _this.alert_dlg.offsetTop;
			document.onmousemove = function(e){
				e = e || event;
				this.L = e.clientX - _thisE.X;
				this.T = e.clientY - _thisE.Y;
				//出界处理
				if(this.L < 0) this.L = 0;
				else if(this.L + _this.alert_dlg.offsetWidth > document.body.scrollWidth)
					this.L = document.body.scrollWidth - _this.alert_dlg.offsetWidth;
				if(this.T < 0) this.T = 0;
				else if(this.T + _this.alert_dlg.offsetHeight > document.body.scrollHeight)
					this.T = document.body.scrollHeight - _this.alert_dlg.offsetHeight;
				_this.alert_dlg.style.left = this.L + "px";
				_this.alert_dlg.style.top  = this.T + "px";
				_this.alert_dlg.style.margin = 0;
				return false;
			}
			document.onmouseup = function(){
				document.onmouseup = null;
				document.onmousemove = null;
			};
			return false;
		};
	},
	close : function(flag) {
		var _this = this;
		this.flag = flag;
		this.frame.removeAttribute("style");
		this.alert_bkg.removeAttribute("style");
		document.body.removeChild(this.frame);
		if(this.callback) this.callback(this.flag);
	}
};
function adialog(id,title,content,opts){
	if(!id || !title || !content){
		alert("请使用必选项！");
		return false;
	}
	if(!opts) 
		opts={
			width: "400px",
			height: "150px",
			fixed: "fixed"
		};
	var dialog = new sAlert(id,title,content,opts);
	dialog.create();
	dialog.setBkg();
}
function test(flag){
	if(flag) alert("点击了确认!");
	else alert("点击了取消、遮罩或其他!");
	return false;
}
window.onload = function(){
	$("#demo1").onclick = function(e){
		adialog("message","提示内容","这是一个浮出层",{
			width: "",
			height: "",
			fixed: "fixed",
			callback: test
		});
	};
	$("#demo2").onclick = function(e){
		adialog("message","警告内容","这是一个警告浮出层",{
			width: "450px",
			height: "200px",
			fixed: "absolute"
		});
	}
}