// 俄罗斯方块类
function RussianCube() {
	this.moving = true // 方块运动状态
	THREE.Mesh.call(this, this.oGeo, this.oMate) //this继承Mesh
	this.init() // 初始化方块
	this.drop(false) // 方块下降
	window.castShape&&this.castShape() // 投影
}

RussianCube.prototype = {
	constructor: RussianCube,
	oGeo: new THREE.Geometry(),
	oMate: new THREE.MeshBasicMaterial(),
	// 类型种类(三维空间不存在二维手性结构)
	catagories: ["I", "Z", "L", "T", "X"],
	// 投影
	castShape: function(){
		var that = this
		newoCan.remove(that.cast)
		var newRussianCube = new THREE.Mesh(that.geometry,new THREE.MeshBasicMaterial({wireframe:true}))
		that.init.call(newRussianCube,true,that.catagory)
		newRussianCube.position.y = that.position.y-that.collisionCheck().bottomDistance+1
		newRussianCube.position.x = that.position.x
		newRussianCube.position.z = that.position.z
		// 保障变形时投影正常
		newRussianCube.children.forEach( function(el,index){
			var position = that.children[index].position
			el.position.set(position.x,position.y,position.z)
		});
		that.cast = newRussianCube
		newoCan.add(that.cast)
	},
	pause: function(){
		window.pause = !window.pause
		console.log(window.pause)
		this.drop(window.pause)
	},
	// 消层
	destroy: function(){
		this.moveCtrl = function(){}
		var cubes = oCantainer.children,
		floor = (function(){var arr = [];for (var i = 0;i < 40; i++) {arr.push([])}return arr})()
		cubes.forEach(function(outterEl){
			outterEl.children.forEach(function(innerEl){
				floor.forEach( function(floorArr,index){
					if(innerEl.getFixd()[1] == index-10){
						floorArr.push(innerEl)
					}
				})
			})
		})

		floor.forEach(function(floorArr,index){
			if(floorArr.length == 49){
				window.a+=49
				floorArr.forEach(function(cube){
					cube.parent.remove(cube)
				})
				floor.forEach(function(floorArr,innerIndex){
					if(innerIndex>index){
						floorArr.forEach(function(cube){
							cube.position.y -= 1
						})
					}
				})
				// 可在此处更新分数
				document.querySelector("#score").innerHTML="得分"+window.score
			}
		})
	},
	// 下落与加速下落
	drop: function( accelerate ){
		var that = this
		clearInterval(that.timer)
		if( accelerate===false ){
			// 正常下落
			that.timer = setInterval(function(){
				if (!that.collisionCheck().bottom) {
					that.position.y -= 1
				} else {
					that.moving = false
					that.destroy()
					newoCan.remove(that.cast)
					clearInterval(that.timer)
				}
			}, 1600)
		}else if( accelerate=="accelerate" ){
			// 加速下落
			that.timer = setInterval(function(){
				if (!that.collisionCheck().bottom) {
					that.position.y -= 1
				} else {
					that.moving = false
					that.destroy()
					newoCan.remove(that.cast)
					clearInterval(that.timer)
				}
			}, 5)
		}
	},
	// 碰撞检测
	collisionCheck: function() {
		var arr = {
			canTransform: true,
			bottomDistance: []
		}
		var movingCube = this.children
		var staticRussianCubes = oCantainer.children,
			staticCubes = []
		for (var i = 0; i < staticRussianCubes.length; i++) {
			if (!staticRussianCubes[i].moving) {
				staticCubes = staticCubes.concat(staticRussianCubes[i].children)
			}
		}

		if (staticCubes.length == 0) {
			movingCube.forEach( function(el) {
				el.getFixd()[1] === -10 && (arr.bottom = true)
				el.getFixd()[2] === 3 && (arr.far = true)
				el.getFixd()[2] === -3 && (arr.near = true)
				el.getFixd()[0] === -3 && (arr.left = true)
				el.getFixd()[0] === 3 && (arr.right = true)
				if(el.parent.catagory=="X"||el.parent.catagory=="T"){
					arr.bottomDistance=el.getFixd()[1]+10	
				}else if (el.parent.catagory=="I") {
					arr.bottomDistance=el.getFixd()[1]+8
				}else{
					arr.bottomDistance=el.getFixd()[1]+9
				}
				
				// 变形后伸出了墙外则判定此处不可变形
				if (el.getFixd()[1] < -10 || el.getFixd()[2] > 3 ||
					el.getFixd()[2] < -3 || el.getFixd()[0] < -3 ||
					el.getFixd()[0] > 3
				) {
					arr.canTransform = false
				}
			});
			return arr
		} else {
			movingCube.forEach( function(movingEl,index){
				arr.bottomDistance[index]=[]
				movingEl.isFaceFloor=false
				staticCubes.forEach( function(staticEl) {
					
					function compare(i){
						return movingEl.getFixd()[i] - staticEl.getFixd()[i]
					}

					// 存储小方块与其下方 static 小方块们之间的距离,排除过渡干扰,其上方小方块不计入内
					if(!compare(0)&&!compare(2)&&compare(1)>0 && movingEl.parent!==staticEl.parent){
						arr.bottomDistance[index].push(compare(1))	
					}

					(!compare(0)&&!compare(2)&&compare(1)===1||movingEl.getFixd()[1]===-10)&&(arr.bottom = true);
					(!compare(0)&&!compare(1)&&compare(2)===-1||movingEl.getFixd()[2]===3)&&(arr.far = true);
					(!compare(0)&&!compare(1)&&compare(2)===1||movingEl.getFixd()[2]===-3)&&(arr.near = true);
					(!compare(2)&&!compare(1)&&compare(0)===1||movingEl.getFixd()[0]===-3)&&(arr.left = true);
					(!compare(2)&&!compare(1)&&compare(0)===-1||movingEl.getFixd()[0]===3)&&(arr.right = true);
					
					(	// 变形后与其他方块重叠或变形后伸出了墙外则判定此处不可变形
						!compare(0)&&!compare(1)&&!compare(2)||
						movingEl.getFixd()[1] < -10 || 
						movingEl.getFixd()[2] > 3   ||
						movingEl.getFixd()[2] < -3  ||
						movingEl.getFixd()[0] < -3  ||
						movingEl.getFixd()[0] > 3   
					) && (arr.canTransform = false)
				});
					if(!arr.bottomDistance[index].length){
						arr.bottomDistance[index]=movingEl.getFixd()[1]+11
					}else{
						arr.bottomDistance[index] = arr.bottomDistance[index].sort(function(a,b){return a-b})[0]
					}
			});
			var temp = arr.bottomDistance
			// 取俄罗斯方块距落定点的距离
			arr.bottomDistance=arr.bottomDistance.sort(function(a,b){return a-b})[0]
		}
		return arr
	},
	// 判断类型，添加小方块
	init: function(isclone, catagory) {
		if(!isclone){
			this.catagory = this.catagories[Math.floor(Math.random() * 5)]	
		}else{
			this.catagory = catagory
		}
		for (var i = 0; i < 4; i++) {
			var cube = new CellCube(this,isclone)
			if (this.catagory == "L") {
				if (i == 0) {
					cube.position.x = 0
					cube.position.y = 0
					cube.position.z = 0
				} else if (i == 1) {
					cube.position.x = 1
					cube.position.y = 0
					cube.position.z = 0
				} else if (i == 2) {
					cube.position.x = 0
					cube.position.y = 1
					cube.position.z = 0
				} else if (i == 3) {
					cube.position.x = 0
					cube.position.y = 2
					cube.position.z = 0
				}
			} else if (this.catagory == "X") {
				if (i == 0) {
					cube.position.x = 0
					cube.position.y = 0
					cube.position.z = 0
				} else if (i == 1) {
					cube.position.x = 1
					cube.position.y = 0
					cube.position.z = 0
				} else if (i == 2) {
					cube.position.x = 0
					cube.position.y = 1
					cube.position.z = 0
				} else if (i == 3) {
					cube.position.x = 1
					cube.position.y = 1
					cube.position.z = 0
				}
			} else if (this.catagory == "Z") {
				if (i == 0) {
					cube.position.x = 0
					cube.position.y = 0
					cube.position.z = 0
				} else if (i == 1) {
					cube.position.x = 0
					cube.position.y = 1
					cube.position.z = 0
				} else if (i == 2) {
					cube.position.x = 1
					cube.position.y = 1
					cube.position.z = 0
				} else if (i == 3) {
					cube.position.x = 1
					cube.position.y = 2
					cube.position.z = 0
				}
			} else if (this.catagory == "I") {
				if (i == 0) {
					cube.position.x = 0
					cube.position.y = 0
					cube.position.z = 0
				} else if (i == 1) {
					cube.position.x = 0
					cube.position.y = 1
					cube.position.z = 0
				} else if (i == 2) {
					cube.position.x = 0
					cube.position.y = 2
					cube.position.z = 0
				} else if (i == 3) {
					cube.position.x = 0
					cube.position.y = 3
					cube.position.z = 0
				}
			} else if (this.catagory == "T") {
				if (i == 0) {
					cube.position.x = 0
					cube.position.y = 0
					cube.position.z = 0
				} else if (i == 1) {
					cube.position.x = 0
					cube.position.y = 1
					cube.position.z = 0
				} else if (i == 2) {
					cube.position.x = 0
					cube.position.y = 2
					cube.position.z = 0
				} else if (i == 3) {
					cube.position.x = 1
					cube.position.y = 1
					cube.position.z = 0
				}
			}
			this.add(cube) // 添加小方块到内部
		}
		this.position.set(0, 10, 0) // 将俄罗斯方块放到容器顶部
	},
	moveCtrl: function(e, p) {
		// 内部条件为视觉跟随判断
		if(p.position.x==3){
			if (e.key == "d") {
				if (!this.collisionCheck().near) {
					this.position.z -= 1
				}
			} else if (e.key == "s") {
				if (!this.collisionCheck().right) {
					this.position.x += 1
				}
			} else if (e.key == "w") {
				if (!this.collisionCheck().left) {
					this.position.x -= 1
				}
			} else if (e.key == "a") {
				if (!this.collisionCheck().far) {
					this.position.z += 1
				}
			}
		}else if(p.position.x==-3){
			if (e.key == "a") {
				if (!this.collisionCheck().near) {
					this.position.z -= 1
				}
			} else if (e.key == "s") {
				if (!this.collisionCheck().left) {
					this.position.x -= 1
				}
			} else if (e.key == "w") {
				if (!this.collisionCheck().right) {
					this.position.x += 1
				}
			} else if (e.key == "d") {
				if (!this.collisionCheck().far) {
					this.position.z += 1
				}
			}

		}else if(p.position.z==3){
			if (e.key == "a") {
				if (!this.collisionCheck().left) {
					this.position.x -= 1
				}
			} else if (e.key == "s") {
				if (!this.collisionCheck().far) {
					this.position.z += 1
				}
			} else if (e.key == "w") {
				if (!this.collisionCheck().near) {
					this.position.z -= 1
				}
			} else if (e.key == "d") {
				if (!this.collisionCheck().right) {
					this.position.x += 1
				}
			}
		}else if(p.position.z==-3){
			if (e.key == "a") {
				if (!this.collisionCheck().right) {
					this.position.x += 1
				}
			} else if (e.key == "s") {
				if (!this.collisionCheck().near) {
					this.position.z -= 1
				}
			} else if (e.key == "w") {
				if (!this.collisionCheck().far) {
					this.position.z += 1
				}
			} else if (e.key == "d") {
				if (!this.collisionCheck().left) {
					this.position.x -= 1
				}
			}
		}
		if (e.key == "1") {
			// 变形:不能使用框架自带方法
			console.log(1)
			// 先变形,判断是否有重叠
			this.children.forEach(function(el) {
				var temp = el.position.x
				el.position.x = el.position.y
				el.position.y = -temp
			});
			// 若变形后有重叠则恢复变形前的状态
			if (!this.collisionCheck().canTransform) {
				this.children.forEach(function(el) {
					var temp = el.position.x
					el.position.x = -el.position.y
					el.position.y = temp
				});
			}
		} else if (e.key == "2") {
			// 先变形,判断是否有重叠
			this.children.forEach(function(el) {
				var temp = el.position.x
				el.position.x = el.position.z
				el.position.z = -temp
			});
			// 若变形后有重叠则恢复变形前的状态
			if (!this.collisionCheck().canTransform) {
				this.children.forEach(function(el) {
					var temp = el.position.x
					el.position.x = -el.position.z
					el.position.z = temp
				});
			}
		} else if (e.key == "3") {
			// 先变形,判断是否有重叠
			this.children.forEach(function(el) {
				var temp = el.position.z
				el.position.z = el.position.y
				el.position.y = -temp
			});
			// 若变形后有重叠则恢复变形前的状态
			if (!this.collisionCheck().canTransform) {
				this.children.forEach(function(el) {
					var temp = el.position.z
					el.position.z = -el.position.y
					el.position.y = temp
				});
			}
		} else if(e.key == "Enter"){
			this.drop("accelerate")
		}else if(e.key == "8"){
			this.pause()
		}else if(e.key == "7"){
			window.castShape=!window.castShape
		}
		if(this.moving&&window.castShape){
			this.castShape()
		}else{
			newoCan.remove(this.cast)
		}
	},
	__proto__: new THREE.Mesh()
}
