import Experience from "./Experience.js";
import * as THREE from 'three'

export default class RayCaster {
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.experience = new Experience();
        this.camera = this.experience.camera;
        this.sizes = this.experience.sizes;
        this.objectsToTest = this.experience.sources;
        this.mouse = new THREE.Vector2();
        this.transformControls = this.experience.transformControls;
        this.boxHelper = this.experience.boxHelper;
        this.menu = this.experience.menu;
        this.setListener();
    }

    setListener ()
    {
        window.addEventListener('mousemove', (event) =>
        {
            this.mouse.x = event.clientX / this.sizes.width * 2 - 1;
            this.mouse.y = - (event.clientY / this.sizes.height) * 2 + 1;
        })
    }
    setRaycast() {
        this.raycaster.setFromCamera(this.mouse,this.camera.instance);
    }

    castRaycast() {
        if(this.objectsToTest.length > 0) {
            this.array = this.objectsToTest.map((model) => model.scene);
            this.intersects = this.raycaster.intersectObjects(this.array);
            if(this.intersects.length > 0)
            {
                this.experience.activeMesh = this.intersects[0].object;
                this.boxHelper.showBoxHelper();
                this.transformControls.attachControls();
                this.menu.updateInputValues()

            } else {
                this.menu.defaultInputValues();
                this.boxHelper.hideBoxHelper();
                this.transformControls.detachControls();
            }
        }
    }
}