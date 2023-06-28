import Experience from "./Experience.js";
import {TransformControls} from 'three/addons/controls/TransformControls.js';

export default class TransformController {
    constructor() {
        this.experience = new Experience()
        this.camera = this.experience.camera;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.boxHelper = this.experience.boxHelper;
        this.activeMesh = this.experience.activeMesh;
        this.instance = new TransformControls(this.camera.instance, this.canvas);

        this.instance.addEventListener( 'change',() =>
        {
            this.experience.renderer.update();
        });

        this.instance.addEventListener( 'dragging-changed', ( event ) => {
            this.experience.camera.controls.enabled = ! event.value;

            this.experience.transformControlsActive = ! event.value;
        } );
        this.scene.add(this.instance);
    }

    attachControls ()
    {
        this.activeMesh = this.experience.activeMesh;
        this.instance.attach(this.activeMesh);
    }

    detachControls()
    {
        this.activeMesh = this.experience.activeMesh;
        this.instance.detach(this.activeMesh);
    }

}