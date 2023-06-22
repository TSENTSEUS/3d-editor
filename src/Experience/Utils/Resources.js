import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from './EventEmitter.js'
import { DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader.js";

export default class Resources extends EventEmitter
{
    constructor(sources)
    {
        super()

        this.sources = sources

        this.toLoad = this.sources.length

        this.setLoaders()

    }

    setLoaders()
    {
        this.loaders = {}
        this.loaders.dracoLoader = new DRACOLoader()
        this.loaders.dracoLoader.setDecoderPath('/draco/')
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
    }

    loadModel(path,type)
    {
        // Load each source

            if(type === 'glb')
            {
                return new Promise((resolve,reject) =>
                {
                    this.loaders.gltfLoader.load(
                    path,
                    (file) =>
                    {
                        this.sources.push(file);
                        resolve(200)
                    }
                )
                })
            }
            else if(type === 'texture')
            {
                return new Promise((resolve,reject) =>
                {
                    this.loaders.textureLoader.load(
                        path,
                        (file) =>
                        {
                            resolve(file);
                        }
                    )
                })
            }
            else if(type === 'cubeTexture')
            {
                return new Promise((resolve,reject) =>
                {
                    this.loaders.cubeTextureLoader.load(
                        path,
                        (file) =>
                        {
                            resolve(file);
                        }
                    )
                })
        }
    }

}