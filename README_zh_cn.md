<h1 align="center">detective</h1>

![](/docs/preview.gif)

语言: [English](README.md) | 中文简体

## detective 是什么 ?

`threejs`性能监控器，提供多种3D信息，帮助开发者分析。

> 该插件与`threejs`开发工具发生冲突（如：[three-devtools](https://github.com/threejs/three-devtools)），因为争抢`window.__THREE_DEVTOOLS__`使用权。因此，请不要让它们在同一个运行环境共存。

## 特性

- 轻量易用

- 监控面板存在于新标签页，自由度高

- 支持监控自定义属性

- 支持`typescript`

## 安装

```
npm i @dreamoment/detective
```

## 示例

```
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Detective from "@dreamoment/detective"


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const ambientLight = new THREE.AmbientLight(0xffffff)
const directionalLight = new THREE.DirectionalLight(0xffffff)
directionalLight.position.set(1, 1, 1)
scene.add(ambientLight, directionalLight)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

camera.position.set(5, 5, 5)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial()
const material1 = new THREE.MeshStandardMaterial()
const cube = new THREE.Mesh(geometry, material)
const cube1 = new THREE.Mesh(geometry, material1)
scene.add(cube, cube1)


const detective = new Detective(renderer)

// extend the custom prop
const extensionRef1 = detective.ref(camera.position, 'x')
const extensionRef2 = detective.ref(camera.position, 'y')
const extensionRef3 = detective.ref(camera.position, 'z')
detective.extend('CameraPosX', extensionRef1)
detective.extend('CameraPosY', extensionRef2)
detective.extend('CameraPosZ', extensionRef3)

const animate = () => {
  controls.update()
  detective.update()
  renderer.render(scene, camera)
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', onWindowResize)

renderer.setAnimationLoop(animate)
```

## API

```
new Detective(renderer: THREE.WebGLRenderer)
```

### update

更新内部状态。应该始终在渲染循环中被使用。

```
update(): void
```

### ref

创建一个对象属性引用，作为`extend`方法的参数。

```
ref(ref: any, prop: string): ExtensionRef
```

### extend

扩展自定义属性，使得该属性能被监控。

```
extend(name: string, extensionRef: ExtensionRef): Detective
```