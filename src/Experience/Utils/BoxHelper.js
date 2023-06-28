import Experience from "../Experience.js";
import * as THREE from 'three'

export default class BoxHelper {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.activeHelper = null;
    }

    attachBoxHelper(activeMesh)
    {
        this.activeMesh = activeMesh;
        this.activeHelper = new THREE.BoxHelper(this.activeMesh, "orange");
        this.scene.add(this.activeHelper);
    }

    detachBoxHelper()
    {
        this.activeHelper.visible = false;
    }

    showBoxHelper()
    {
        this.activeHelper.visible = true;
    }

    update() {
        this.activeMesh = this.experience.activeMesh;
        this.activeHelper = this.experience.boxHelper.activeHelper;
        if(this.activeMesh && this.activeHelper)
        {
            this.activeHelper.setFromObject(this.activeMesh);
        }
    }
}