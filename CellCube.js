		// 俄罗斯方块中的单元格
		function CellCube(parent,isCast){
			this.parent = parent
			var oMaterial = this.getcubeMate(isCast)
			var oGeo = this.cubeGeo
			THREE.Mesh.call(this,oGeo,oMaterial)
		}

		CellCube.prototype={
			constructor: CellCube,
			// 获取小方块几何体
			cubeGeo: new THREE.CubeGeometry(1,1,1),
			// 判断小方块材质颜色，取得对应材质
			getcubeMate: function(isCast){
				var color,mate
				if(this.parent.catagory == "L"){
					color = 0xff0000
				}else if(this.parent.catagory == "X"){
					color = 0x00ff00
				}else if(this.parent.catagory == "T"){
					color = 0x0000ff
				}else if(this.parent.catagory == "I"){
					color = 0xff00ff
				}else if(this.parent.catagory == "Z"){
					color = 0xffff00
				}
				isCast?mate={}:mate={color: color}
				var cubeMaterial = new THREE.MeshLambertMaterial(mate)
				return cubeMaterial
			},
			// 判断小方块所在层数
			getFixd: function(){
				return [this.position.x+this.parent.position.x, this.position.y+this.parent.position.y, this.position.z+this.parent.position.z]
			},
			__proto__: new THREE.Mesh()
		}
