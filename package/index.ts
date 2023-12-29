import * as THREE from 'three'


interface Map<T> {
    [key: string]: T
}

interface ExtensionRef {
    ref: any
    prop: string
}


const scenes: THREE.Scene[] = []
const renderers: THREE.WebGLRenderer[] = []

{
    (window as any).__THREE_DEVTOOLS__ = {
        dispatchEvent: (event: any) => {
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
}


class Detective {

    time: number = 0
    frame: number = 0
    extensions: Map<ExtensionRef> = {}
    renderer: THREE.WebGLRenderer
    channel: BroadcastChannel

    constructor(renderer: THREE.WebGLRenderer) {
        this.renderer = renderer
        this.channel = new BroadcastChannel('detective')
    }

    update() {
        const info: any = this.renderer.info
        const time: number = (performance || Date).now()

        if (this.time > 0) {
            info.render.fps = (info.render.frame - this.frame) / (time - this.time) * 1000
        }

        if (performance) {
            const memory = (performance as any).memory
            info.memory.used = memory.usedJSHeapSize
            info.memory.total = memory.jsHeapSizeLimit
        }

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

        this.time = time
        this.frame = info.render.frame

        this.channel.postMessage(JSON.stringify(info))
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