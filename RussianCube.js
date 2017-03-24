// 俄罗斯方块类
function RussianCube() {
	THREE.Mesh.call(this, this.oGeo, this.oMate)
	this.moving = true
	this.init()
	setInterval(() => {
		this.drop()
	}, 1000)
}

RussianCube.prototype = {
	oGeo: new THREE.Geometry(),
	oMate: new THREE.MeshBasicMaterial(),
	constructor: RussianCube,
	// 类型种类(三维空间不存在二维手性结构)
	catagories: ["I", "Z", "L", "T", "X"],
	// 变形
	transform: function() {

	},
	// 下降
	drop: function() {
		this.getStatus()
		if (this.moving) {
			this.position.y -= 1
		}
	},
	// 获取状态：下落中/已落定
	getStatus: function() {
		if ("...") {
			// 已落定
			this.moving = true
		} else {
			// 下落中
			this.moving = false
		}
	},
	// 判断类型，添加小方块
	init: function() {
		this.catagory = this.catagories[Math.floor(Math.random() * 5)]
		for (var i = 0; i < 4; i++) {
			var cube = new CellCube(this)
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
	moveCtrl: function(e) {
		if (e.key == "a") {
			this.position.x -= 1
		} else if (e.key == "w") {
			this.position.z += 1
		} else if (e.key == "s") {
			this.position.z -= 1
		} else if (e.key == "d") {
			this.position.x += 1
		} else if (e.key == "1") {
			this.rotation.x += Math.PI / 2
		} else if (e.key == "2") {
			this.rotation.y += Math.PI / 2
		} else if (e.key == "3") {
			this.rotation.z += Math.PI / 2
		}
	},
	__proto__: new THREE.Mesh()
}