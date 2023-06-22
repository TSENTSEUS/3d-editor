import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Floor
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.setMesh()
    }

    setMesh()
    {
        this.mesh = new THREE.GridHelper( 25, 25 , 0x888888, 0x444444 )
        this.scene.add(this.mesh)
    }
}