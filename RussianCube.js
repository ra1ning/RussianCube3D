// 俄罗斯方块类
function RussianCube() {
	this.moving = true // 方块运动状态
	THREE.Mesh.call(this, this.oGeo, this.oMate) //this继承Mesh
	this.init() // 初始化方块
	this.drop() // 方块下降
}

RussianCube.prototype = {
	constructor: RussianCube,

	oGeo: new THREE.Geometry(),

	oMate: new THREE.MeshBasicMaterial(),

	// 类型种类(三维空间不存在二维手性结构)
	catagories: ["I", "Z", "L", "T", "X"],

	// 投影
	castShape: function(){
		var newRussianCube = new THREE.Mesh(this.geometry,new THREE.MeshBasicMaterial({wireframe:true}))
		this.init.call(newRussianCube,true,this.catagory)
		newRussianCube.position.y = this.position.y-this.collisionCheck().bottomDistance+1
		newRussianCube.position.x = this.position.x
		newRussianCube.position.z = this.position.z
		// 保障变形时投影正常
		newRussianCube.children.forEach( (el,index) =>{
			var position = this.children[index].position
			el.position.set(position.x,position.y,position.z)
		});
		return this.cast = newRussianCube
	},
	drop: function( accelerate ){
		if(!accelerate){
			// 正常下落
			this.timer = setInterval(() => {
				if (!this.collisionCheck().bottom) {
					this.position.y -= 1
				} else {
					this.moving = false
					newoCan.remove(this.cast)
					clearInterval(this.timer)
				}
			}, 1000)
		}else{
			// 加速下落
			clearInterval(this.timer)
			this.timer = setInterval(() => {
				if (!this.collisionCheck().bottom) {
					this.position.y -= 1
				} else {
					this.moving = false
					newoCan.remove(this.cast)
					clearInterval(this.timer)
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
			movingCube.forEach( function(el, index) {
				arr.bottomDistance[i]=[]
				el.getFixd()[1] === -20 && (arr.bottom = true)
				el.getFixd()[2] === 5 && (arr.far = true)
				el.getFixd()[2] === -5 && (arr.near = true)
				el.getFixd()[0] === -5 && (arr.left = true)
				el.getFixd()[0] === 5 && (arr.right = true)

				arr.bottomDistance[i]=el.getFixd()[1]+19
				// 变形后伸出了墙外则判定此处不可变形
				if (el.getFixd()[1] < -20 || el.getFixd()[2] > 5 ||
					el.getFixd()[2] < -5 || el.getFixd()[0] < -5 ||
					el.getFixd()[0] > 5
				) {
					arr.canTransform = false
				}
			});
			arr.bottomDistance=arr.bottomDistance.sort((a,b)=>a-b)[0]
			console.log(arr.bottomDistance)
			return arr

		} else {
			movingCube.forEach( (movingEl,index)=> {
				arr.bottomDistance[index]=[]
				movingEl.isFaceFloor=false
				staticCubes.forEach( (staticEl)=> {
					
					function compare(i){
						return movingEl.getFixd()[i] - staticEl.getFixd()[i]
					}

					// 存储小方块与其下方 static 小方块们之间的距离,排除过渡干扰
					if(!compare(0)&&!compare(2) && movingEl.parent!==staticEl.parent){
						arr.bottomDistance[index].push(compare(1))	
					}

					(!compare(0)&&!compare(2)&&compare(1)===1||movingEl.getFixd()[1]===-20)&&(arr.bottom = true);
					(!compare(0)&&!compare(1)&&compare(2)===-1||movingEl.getFixd()[2]===5)&&(arr.far = true);
					(!compare(0)&&!compare(1)&&compare(2)===1||movingEl.getFixd()[2]===-5)&&(arr.near = true);
					(!compare(2)&&!compare(1)&&compare(0)===1||movingEl.getFixd()[0]===-5)&&(arr.left = true);
					(!compare(2)&&!compare(1)&&compare(0)===-1||movingEl.getFixd()[0]===5)&&(arr.right = true);
					
					(	// 变形后与其他方块重叠或变形后伸出了墙外则判定此处不可变形
						!compare(0)&&!compare(1)&&!compare(2)||
						movingEl.getFixd()[1] < -20 || 
						movingEl.getFixd()[2] > 5   ||
						movingEl.getFixd()[2] < -5  ||
						movingEl.getFixd()[0] < -5  ||
						movingEl.getFixd()[0] > 5   
					) && (arr.canTransform = false)
				});
					if(!arr.bottomDistance[index].length){
						arr.bottomDistance[index]=movingEl.getFixd()[1]+21
					}else{
						arr.bottomDistance[index] = arr.bottomDistance[index].sort((a,b)=>a-b)[0]
					}
			});
			var temp = arr.bottomDistance
			// 取俄罗斯方块距落定点的距离
			arr.bottomDistance=arr.bottomDistance.sort((a,b)=>a-b)[0]
			console.log(arr.bottomDistance)
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
			this.add(cube)
			this.position.set(0, 20, 0)

		}

	},

	// 位移/变形/加速
	moveCtrl: function(e) {
		newoCan.remove(this.cast)
		
		// 位移:更新坐标
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
		// 变形:不能使用框架自带方法
		else if (e.key == "1") {
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
			console.log(e)
			this.drop(true)
		}
		if(!this.collisionCheck().bottom){
			newoCan.add(this.castShape())
		}
	},

	__proto__: new THREE.Mesh()
}