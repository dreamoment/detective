<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Detective from "../package/index"


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
detective
    .extend('CameraPosX', extensionRef1)
    .extend('CameraPosY', extensionRef2)
    .extend('CameraPosZ', extensionRef3)

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
</script>

<template>
</template>

<style scoped>
</style>
