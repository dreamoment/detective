import * as THREE from 'three'
import '../public/index.css'


interface Map<T> {
    [key: string]: T
}

interface ExtensionRef {
    ref: any
    prop: string
}


const scenes = []
const renderers = []

window.__THREE_DEVTOOLS__ = {
    dispatchEvent(event) {
        if (event.type === 'observe') {
            if (event.detail instanceof THREE.Scene) {
                scenes.push(event.detail)
            }
            else if (event.detail instanceof THREE.WebGLRenderer) {
                renderers.push(event.detail)
            }
        }
    }
}


class Detective {

    beginTime: number
    fps: number = 0
    extensions: Map<ExtensionRef> = {}
    renderer: THREE.WebGLRenderer
    channel: BroadcastChannel

    constructor(renderer: THREE.WebGLRenderer) {
        this.renderer = renderer
        this.beginTime = (performance || Date).now()
        this.channel = new BroadcastChannel('detective')
    }

    update() {
        const info = this.renderer.info
        const time: number = (performance || Date).now()
        this.fps = (info.render.frame * 1000) / (time - this.beginTime)

        const memory = performance.memory
        info.memory.used = memory.usedJSHeapSize / 1048576
        info.memory.limit = memory.jsHeapSizeLimit / 1048576
        info.render.fps = 0

        const lights = []
        const meshes = []
        const materials = []
        scenes.forEach(scene => {
            scene.traverse(e => {
                if (e instanceof THREE.Light) {
                    lights.push(e)
                }
                else if (e instanceof THREE.Mesh) {
                    meshes.push(e)
                    if (e.material instanceof THREE.Material) {
                        materials.push(e.material)
                    }
                    else if (Array.isArray(e.material)) {
                        e.material.forEach(m => {
                            materials.push(m)
                        })
                    }
                }
            })
        })

        info.asset = {
            renderer: renderers.length,
            scene: scenes.length,
            light: lights.length,
            mesh: meshes.length,
            material: materials.length,
            shader: info.programs.length,
        }

        info.extensions = {}
        for (const name in this.extensions) {
            const prop = this.extensions[name]['prop']
            info.extensions[name] = this.extensions[name]['ref'][prop]
        }

        console.log(info)


        this.channel.postMessage(JSON.stringify(info))

        this.beginTime = time
    }

    ref(ref: any, prop: string) {
        return { ref, prop }
    }

    extend(name: string, extensionRef: ExtensionRef) {
        this.extensions[name] = extensionRef
        return this
    }
}


export default Detective