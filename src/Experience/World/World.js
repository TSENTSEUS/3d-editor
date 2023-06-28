import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import * as THREE from "three";

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.floor = new Floor()
        this.environment = new Environment()
        this.createWorld();
    }

    createWorld() {
        this.world = new THREE.Mesh(
            new THREE.SphereGeometry(130,32, 16),
            new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                opacity: .1,
                transparent: true
            })
        )
        this.scene.add(this.world);
    }
}