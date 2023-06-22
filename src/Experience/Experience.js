import * as THREE from 'three'

import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'

import InputMaster from "./InputMaster/InputMaster.js";
import RayCaster from "./RayCaster.js";
import TransformController from "./TransformController.js";
import BoxHelper from "./Utils/BoxHelper.js";
import Menu from "./InputMaster/Menu.js";

let instance = null

export default class Experience
{
    constructor(_canvas)
    {
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        
        // Global access
        window.experience = this

        // Options
        this.canvas = _canvas

        // Setup
        this.sources = [];
        this.activeMesh = null;
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(this.sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()
        this.boxHelper = new BoxHelper();
        this.transformControls = new TransformController();
        this.inputMaster = new InputMaster();
        this.menu = new Menu();
        this.rayCaster = new RayCaster();

        // Resize event
        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () =>
        {
            this.update()
        })



        window.addEventListener('click', (event) =>
        {
            this.rayCaster.setRaycast();
            this.rayCaster.castRaycast();
        })

    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        this.camera.update()
        this.boxHelper.update()
        this.inputMaster.updateEnvironment()
        this.renderer.update()
    }

    destroy()
    {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) =>
        {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose()

                // Loop through the material properties
                for(const key in child.material)
                {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if(this.debug.active)
            this.debug.ui.destroy()
    }
}