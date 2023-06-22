import Experience from "../Experience.js";

export default class Menu {
    constructor() {
        this.experience = new Experience()
        this.aoMapLabel = document.getElementById('aomapInputLabel');
        this.normalMaplabel = document.getElementById('normalsMapLabel');
        this.opacityInput = document.getElementById('opacity');
        this.roughnessInput = document.getElementById('roughness');
        this.metalnessInput = document.getElementById('metalness');
    }

    updateInputValues ()
    {
        this.activeMesh = this.experience.activeMesh
        this.aoMapLabel.textContent = this.activeMesh.userData.aoMapName || "Choose AO Maps..."
        this.normalMaplabel.textContent = this.activeMesh.userData.normalMapName || "Choose normal map";
        this.opacityInput.value = this.activeMesh.material.opacity;
        this.roughnessInput.value = this.activeMesh.material.roughness;
        this.metalnessInput.value = this.activeMesh.material.metalness;
    }

    defaultInputValues()
    {
        this.aoMapLabel.textContent = "Choose AO Maps...";
        this.normalMaplabel.textContent = "Choose normal map";
    }
}