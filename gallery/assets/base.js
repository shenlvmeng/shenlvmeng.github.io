var res, tag_list = {};

//asynchronical XMLHttpRequest
function loadFile (url, callback) {
	var req = new XMLHttpRequest();
	req.onreadystatechange = function () {
		if (req.readyState == 4) {
			if (req.status == 200) {
				callback.apply(req);
			} else {
				console.log("Error", req.statusText);
			}
		}
	};
	req.open("GET", url, true);
	req.send(null);
}

loadFile("./gallery_info.json", function(){
	res = JSON.parse(this.responseText);
	//print meta data
	console.log(res.name + ": " + res.description);
	console.log("Author: " + res.author);
	//export tags information
	var len = res.content.length;
	for (var i = 0; i < len; i++) {
		//read from res.content[i].date
		var year = Math.floor(res.content[i].date / 10000);
		if (year <= 2012) {
			year = "~2012";
		}
		year += "";
		if (!tag_list[year]) {
			tag_list[year] = [i];
		} else {
			tag_list[year].push(i);
		}
		//read from res.content[i].tags
		res.content[i].tags.forEach(function (val) {
			if (!tag_list[val]) {
				tag_list[val] = [i];
			} else {
				tag_list[val].push(i);
			}
		});
	}
	//console.log(tag_list);


	var Wall = {
			template: '<div id="photos">\
				<figure v-for="item in items" :id="item.id" @click="changeView($event)">\
					<img :src="item.path">\
					<aside><span>{{item.desc}}</span></aside>\
				</figure>\
			</div>',
			props: ['factors'],
			methods: {
				changeView: function (event) {
					this.$emit('toinfo', event.target.parentElement.id);
				}
			},
			computed: {
				items: function () {
					var tmparr = [],
		            	tmp = {},
		            	myarr = Array.apply(null, Array(res.content.length)).map(function (x, i) { return i; });
	            	this.factors.forEach(function(val) {
	            		myarr = _.intersection(tag_list[val], myarr);
	            		if ([] == myarr) {
	            			return;
	            		}
	            		//console.log(myarr);
	            	});

		            for (var i = 0, len = myarr.length; i < len; i++) {
		                if (tmp[myarr[i]] == undefined) {
		                    tmp[myarr[i]] = 1;
		                    tmparr.push({id: myarr[i], desc: res.content[myarr[i]].info, path: "./assets/img/" + myarr[i] + "." + res.content[myarr[i]].type});
		                }
		            }
		            return tmparr;
				}
			}
		},

		Info = {
			template: '<div id="display" :style="{top: scrolltop}">\
				<aside @click="quit" @touchend="quit">×</aside>\
				<figure><img :src="path"></figure>\
					<div id="imginfo">\
						<p><span class="vertical-center">{{info}}</span></p>\
						<div id="imgtags"><span v-for="tag in tags" @touchend="chooseTag($event)" @click="chooseTag($event)">{{tag}}</span>\
						</div>\
						<div id="imgrelated" class="clearfix">\
							<div>相似的图片：</div>\
							<img v-for="relate in relates" :src="relate.path" :id="relate.id" @touchend="choosePic($event)" @click="choosePic($event)">\
						</div>\
					</div>\
				</div>',
			data: function () {
				return {
					scrolltop: "50px",
					id: this.pid
				}
			},
			props: ['pid'],
			created: function () {
				//get scrollY
				var supportPageOffset = window.pageXOffset !== undefined,
					isCSS1Compat = ((document.compatMode || "") === "CSS1Compat"),
					y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
				this.scrolltop = Math.max(50, y) + "px";
			},
			methods: {
				chooseTag: function (event) {
					this.$emit('revisetag', event.target.innerHTML);
				},
				choosePic: function (event) {
					var res = parseInt(event.target.id);
					if (res >= 0){
						this.id = res;
					}
				},
				quit: function () {
					this.$emit('revisetag');
				}
			},
			computed: {
				path: function () {
					return "./assets/img/" + this.id + "." + res.content[this.pid].type;
				},
				info: function () {
					return res.content[this.id].info;
				},
				tags: function () {
					return res.content[this.id].tags;
				},
				relates: function () {
					var t = this.tags,
						result = [parseInt(this.id)];
					for (var i = 0; i < 4; i++) {
						//tag list from a random tag
						var n     = tag_list[t[_.random(t.length-1)]],
							ran   = _.random(n.length-1),
							count = 0;
						//choose a random appropriate id
						while (result.indexOf(n[ran]) != -1) {
							n   = tag_list[t[_.random(t.length-1)]];
							ran = _.random(n.length-1);
							count++;
							//in case of infinite loop
							if (count > 20) {
								result.shift();
								return result.map(function (val) {
									return "./assets/img/" + val + "." + res.content[val].type;
								});
							}
						}
						result.push(n[ran]);
					}
					result.shift();
					return result.map(function (val) {
						return {path: "./assets/img/" + val + "." + res.content[val].type, id: val};
					});
				}
			}
		},


		vm = new Vue({
			data: {
				filter: "",
				pid: 0,
				currView: 'picwall'
			},
			mounted: function () {
				document.querySelectorAll(".list-item").forEach(function (val) {
					val.addEventListener("click", function (e){
						document.querySelectorAll(".list-item").forEach(function (val) {
							val.children[1].style.display = "";
						});
						if (this.children[1].style.display == "") {
							this.children[1].style.display = "block";
						} else {
							this.children[1].style.display = "";
						}

						if (!e){
							var e = window.event;
						}
						e.cancelBubble = true;
						if (e.stopPropagation){
							e.stopPropagation();
						}
					});
					val.addEventListener("touchend", function (e) {
						document.querySelectorAll(".list-item").forEach(function (val) {
							val.children[1].style.display = "";
						});
						if (this.children[1].style.display == "") {
							this.children[1].style.display = "block";
						} else {
							this.children[1].style.display = "";
						}
						if (!e){
							var e = window.event;
						}
						e.cancelBubble = true;
						if (e.stopPropagation){
							e.stopPropagation();
						}
					});
				});
				window.addEventListener("click", function () {
					document.querySelectorAll(".list-item").forEach(function (val) {
						val.children[1].style.display = "";
					});
				});
				window.addEventListener("touchend", function () {
					document.querySelectorAll(".list-item").forEach(function (val) {
						val.children[1].style.display = "";
					});
				});
			},
			methods: {
				addPreface: function () {
					if (this.filter == "") {
						this.filter = "preface";
					}
					if (this.factors.indexOf("preface") == -1) {
						this.filter += ",preface";
					}
				},
				addShot: function () {
					if (this.filter == "") {
						this.filter = "screenshot";
					}
					if (this.factors.indexOf("screenshot") == -1) {
						this.filter += ",screenshot";
					}
				},
				addTag: function (event) {
					var tag = event.target.innerHTML;
					if (this.filter == "") {
						this.filter = tag;
					}
					if (this.factors.indexOf(tag) == -1) {
						this.filter += ("," + tag);
					}
				},
				toInfo: function (id) {
					//console.log(id);
					if (id) {
						this.pid = id;
					}
					this.currView = 'picinfo';
				},
				reviseTag: function (tag) {
					if (tag) {
						this.filter = tag;
					} else {
						this.currView = "picwall";
					}
				}
			},
			computed: {
				factors: function () {
					return this.filter.split(",", 10).filter(function(element){
						return element != "";
					});
				}
			},
			watch: {
				filter: function () {
					this.currView = 'picwall';
				}
			},
			components: {
				picwall: Wall,
				picinfo: Info
			}
		}).$mount("#app");

});