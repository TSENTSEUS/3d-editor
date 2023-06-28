import Experience from "../Experience.js";
import * as THREE from "three";

export default class InputMaster {
    constructor() {

        this.experience = new Experience();
        this.resources = this.experience.resources;

        this.boxHelper = this.experience.boxHelper;
        this.transformControls = this.experience.transformControls;
        this.modelInput = document.getElementById('model');
        this.colorInput = document.getElementById('color');
        this.opacityInput = document.getElementById('opacity');
        this.roughnessInput = document.getElementById('roughness');
        this.metalnessInput = document.getElementById('metalness');
        this.normalMapInput = document.getElementById('normals');
        this.normalMapInputLabel = document.getElementById('normalsMapLabel');
        this.aoMapInput = document.getElementById('aoMap');
        this.aoMapInputLabel = document.getElementById('aomapInputLabel');
        this.envMapInput = document.getElementById('envMap');
        this.colorLabel = document.getElementById('colorLabel');
        this.menuItems = document.querySelectorAll('.menu');
        this.worldMaterial = this.experience.world.world;
        this.envMap = null

        this.menuPropagation();
        this.modelInputHandler();
        this.modelInputListener();
        this.colorInputHandler();
        this.opacityInputHandler();
        this.roughnessInputHandler();
        this.metalnessInputHandler();
        this.normalMapInputHandler();
        this.aoMapInputHandler();
        this.envMapInputHandler();
    }

    menuPropagation() {
        this.menuItems.forEach(function (menuItem) {
            menuItem.addEventListener('click', function (event) {
                event.stopPropagation();
            });
        });
    }

    modelInputHandler() {
        this.modelInput.addEventListener('input', async (event) => {
            const file = event.target.files[0];
            const fileType = file.name.split('.')[1];
            this.result = await this.resources.loadModel(URL.createObjectURL(file), fileType).then(res => res);
            if (this.result) {
                if (this.experience.activeMesh) {
                    this.boxHelper.detachBoxHelper();
                }
                this.activeMesh = this.resources.sources[this.resources.sources.length - 1].scene;
                this.experience.activeMesh = this.activeMesh;
                this.experience.scene.add(this.activeMesh);
                this.transformControls.attachControls();
                this.boxHelper.attachBoxHelper()
                this.experience.menu.updateInputValues()
            }
        })
    }

    modelInputListener() {
        this.modelInput.addEventListener('click', (event) => {
            event.target.value = "";
        })
    }


    colorInputHandler() {
        this.colorInput.addEventListener('input', (event) => {
            if (this.colorLabel.textContent === 'Color') {
                this._inputHelper(event, (child, value) => {
                    child.material.color.set(value);
                })
            } else {
                this.worldMaterial.material.color.set(event.target.value)
            }
        })
    }

    opacityInputHandler() {
        this.opacityInput.addEventListener('input', (event) => {
            this._inputHelper(event, (child, value) => {
                child.material.transparent = true;
                child.material.needsUpdate = true;
                child.material.opacity = value;
            })
        })
    }

    roughnessInputHandler() {
        this.roughnessInput.addEventListener('input', (event) => {
            this._inputHelper(event, (child, value) => {
                child.material.roughness = value;
            })
        })
    }

    metalnessInputHandler() {
        this.metalnessInput.addEventListener('input', (event) => {
            this._inputHelper(event, (child, value) => {
                child.material.metalness = value;
            })
        })
    }

    normalMapInputHandler() {
        this.normalMapInput.addEventListener('input', async (event) => {
            this.uploadedFile = event.target.files[0];
            this.result = await this.resources.loadModel(URL.createObjectURL(this.uploadedFile), 'texture')
            if (this.result) {
                this._inputHelper(event, (child, value) => {
                    child.material.normalMap = this.result;
                    child.userData.normalMapName = this.uploadedFile.name;
                })
                this.normalMapInputLabel.textContent = this.uploadedFile.name;
            }
        })
    }

    aoMapInputHandler() {
        this.aoMapInput.addEventListener('input', async (event) => {
            this.uploadedFile = event.target.files[0];
            this.result = await this.resources.loadModel(URL.createObjectURL(this.uploadedFile), 'texture')
            if (this.result) {
                this._inputHelper(event, (child, value) => {
                    child.material.aoMap = this.result;
                    child.material.needsUpdate = true;
                    child.userData.aoMapName = this.uploadedFile.name;
                })
                this.aoMapInputLabel.textContent = this.uploadedFile.name;
            }
        })
    }

    envMapInputHandler() {
        this.envMapInput.addEventListener('input', async (event) => {
            this.uploadedFiles = event.target.files;
            if (this.uploadedFiles.length === 6) {
                this.envMapOrder = ["px", "nx", "py", "ny", "pz", "nz"];
                this.envMapImages = Array.from(this.uploadedFiles);
                this.orderedEnvMap = this.envMapOrder.map(key => {
                    this.file = this.envMapImages.find(image => image.name.includes(key))
                    return URL.createObjectURL(this.file);
                })

                this.envMap = await this.resources.loadModel(this.orderedEnvMap, 'cubeTexture');
            } else {
                this.name = this.uploadedFiles[0].name.split('.')[1]
                if (this.name === 'hdr') {
                    this.envMap = await this.resources.loadModel(URL.createObjectURL(this.uploadedFiles[0]), 'hdr');
                    this.envMap.mapping = THREE.EquirectangularReflectionMapping
                } else if (this.name === "png" || "jpg") {
                    this.envMap = await this.resources.loadModel(URL.createObjectURL(this.uploadedFiles[0]), this.name);
                    this.envMap.mapping = THREE.EquirectangularReflectionMapping
                }
            }
        })
    }

    _inputHelper(event, callback) {
        this.activeMesh = this.experience.activeMesh;
        if (this.activeMesh) {
            this.activeMesh.traverse((child) => {
                if (child.isMesh) {
                    callback(child, event.target.value);
                }
            });
        }
    }

    updateEnvironment() {
        this.experience.scene.background = this.envMap;
        this.experience.scene.environment = this.envMap;
    }
}