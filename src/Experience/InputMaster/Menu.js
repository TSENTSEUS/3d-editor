import Experience from "../Experience.js";
import * as THREE from 'three'
export default class Menu {
    constructor() {
        this.experience = new Experience();
        this.aoMapLabel = document.getElementById('aomapInputLabel');
        this.normalMaplabel = document.getElementById('normalsMapLabel');
        this.opacityInput = document.getElementById('opacity');
        this.roughnessInput = document.getElementById('roughness');
        this.metalnessInput = document.getElementById('metalness');
        this.materialLabel = document.getElementById('materialLabel')
        this.typeLabel = document.getElementById('typeLabel');
        this.colorLabel = document.getElementById('colorLabel');
        this.materialsDiv = document.getElementById('materialsDiv');
        this.colorInput = document.getElementById('color');
        this.nameLabel = document.getElementById('name');

        this.defaultInputValues();
    }

    componentToHex(c) {
        this.hex = c.toString(16);
        return this.hex.length === 1 ? "0" + this.hex : this.hex;
    }

    rgbToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    updateInputValues ()
    {

        this.activeMesh = this.experience.activeMesh
        this.aoMapLabel.textContent = this.activeMesh.userData.aoMapName || "Choose AO Maps..."
        this.normalMaplabel.textContent = this.activeMesh.userData.normalMapName || "Choose normal map";
        this.opacityInput.value = this.activeMesh.material?.opacity || 1;
        this.roughnessInput.value = this.activeMesh.material?.roughness || 1;
        this.metalnessInput.value = this.activeMesh.material?.metalness || 1;
        this.typeLabel.textContent =  this.activeMesh.type || this.activeMesh.name;
        this.colorLabel.textContent = this.activeMesh.name ? "Color" : "Background color";
        this.materialLabel.textContent = this.activeMesh?.material?.type || "None"
        if(this.activeMesh.material)
        {
            this.color = new THREE.Color(this.activeMesh.material.color)
        }
        this.colorInput.value = this.activeMesh.material?.color ? "#" + this.color.getHexString() : "#000000";
        this.materialsDiv.style.display = 'flex'
        this.nameLabel.textContent = this.activeMesh.name === "" ? "Empty" : this.activeMesh.name;
    }

    defaultInputValues()
    {
        this.aoMapLabel.textContent = "Choose AO Maps...";
        this.normalMaplabel.textContent = "Choose normal map";
        this.typeLabel.textContent = "Scene";
        this.colorLabel.textContent = "Background color"
        this.materialLabel.textContent = "None";
        this.nameLabel.textContent = "Main Scene";
        if(this.typeLabel.textContent === "Scene")
        {
            this.materialsDiv.style.display = 'none'
        }
    }
}