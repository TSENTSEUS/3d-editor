import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'
import {TransformControls} from 'three/addons/controls/TransformControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

/**
 * Base
 */
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/*
  RayCaster
 */

const raycaster = new THREE.Raycaster();
/**
 * Loaders
 */

// Texture loader
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader();
// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
let gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
const ambientLight = new THREE.AmbientLight("white",1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight("white", 1);
scene.add(directionalLight)
/**
 * Textures
 */
const fileInput = document.getElementById("import");
let selectedModel, selectedHelper


const handleFileChange = () => {
    const selectedFile = fileInput.files[0];
    const fileType = selectedFile.name.split('.')[1]; // not secure
    if (fileType === 'glb') {
        gltfLoader = new GLTFLoader();
        console.log('here');
    }
    if(fileType === 'fbx') {
        gltfLoader = new FBXLoader();
    }
    gltfLoader.load(URL.createObjectURL(selectedFile), (gltf) => {
        selectedModel = fileType === 'glb' ? gltf.scene : gltf
        objectsToTest.push(selectedModel);
        selectedHelper = new THREE.BoxHelper(selectedModel, "orange");
        scene.add(selectedHelper);
        scene.add(selectedModel);
        control.attach( selectedModel );
    });
}
fileInput.addEventListener('change', handleFileChange)
fileInput.addEventListener('click', (event) =>
{
    event.target.value = "";
})

/**
 * Materials
 */

scene.add( new THREE.GridHelper( 100, 10 , 0x888888, 0x444444 ));

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 400)
camera.position.z = 50;
camera.position.y = 4;
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const roughnessInput = document.getElementById('roughness');
const materialHandler = document.getElementById("materialSettings");
const colorInput = document.getElementById("color");
const aomapInputLabel = document.getElementById("aomapInputLabel");
const opacityInput = document.getElementById("opacity");
const aoMapInput = document.getElementById('aoMap');
const metalnessInput = document.getElementById('metalness');
const normalMapInput = document.getElementById('normals');
const normalMapLabel = document.getElementById('normalsMapLabel');
const envMapInput = document.getElementById("envMap");

window.addEventListener('click', () => {
    raycaster.setFromCamera(mouse,camera);
    if(objectsToTest.length > 0) {
        const intersets = raycaster.intersectObjects(objectsToTest);
        if(intersets.length > 0){
            selectedModel = intersets[0].object
            selectedHelper.visible = true;
            control.attach( selectedModel );
            materialHandler.classList.add("visible");
            aomapInputLabel.textContent = selectedModel.userData.aoMapName || "Choose AO Maps..."
            normalMapLabel.textContent = selectedModel.userData.normalMapName || "Choose normal map";
            opacityInput.value = selectedModel.material.opacity;
            roughnessInput.value = selectedModel.material.roughness;
            metalnessInput.value = selectedModel.material.metalness;
        } else {
            aomapInputLabel.textContent =  "Choose AO Maps...";
            normalMapLabel.textContent = "Choose normal map";

            selectedHelper.visible = false;
            control.detach(selectedModel);
        }
    }
});

colorInput.addEventListener('input', (event) => {
    if (selectedModel) {
        selectedModel.traverse((child) => {
            if (child.isMesh) {
                child.material.color.set(event.target.value);
            }
        });
    }
})

opacityInput.addEventListener('input', (event) => {
    if(selectedModel) {
        selectedModel.traverse((child) => {
            if(child.isMesh) {
                child.material.transparent = true;
                child.material.needsUpdate = true;
                child.material.opacity = event.target.value;
            }
        })
    }
})

aoMapInput.addEventListener('input', (event) => {
    const selectedFile = aoMapInput.files[0];
    const material = textureLoader.load(selectedFile)
    if(selectedModel) {
        selectedModel.traverse((child) => {
            if(child.isMesh) {
                child.material.aoMap = material;
                child.material.needsUpdate = true;
                child.userData.aoMapName = selectedFile.name;
                aomapInputLabel.textContent = selectedFile.name;
            }
        })
    }
});

aoMapInput.addEventListener('click', (event) =>
{
    event.target.value = "";
})

roughnessInput.addEventListener('input', (event) => {
    if(selectedModel) {
        selectedModel.traverse((child) => {
            if(child.isMesh) {
                child.material.roughness = event.target.value;
            }
        })
    }
})
metalnessInput.addEventListener('input', (event) => {
    if(selectedModel) {
        selectedModel.traverse((child) => {
            if(child.isMesh) {
                child.material.metalness = event.target.value;
            }
        })
    }
})
normalMapInput.addEventListener('input', () => {
    const selectedFile = normalMapInput.files[0];
    const normalMap = textureLoader.load(selectedFile)
    selectedModel && selectedModel.traverse((child) => {
            if(child.isMesh) {
                child.material.normalMap = normalMap
                child.userData.normalMapName = selectedFile.name;
                normalMapLabel.textContent = selectedFile.name;
            }
        })
});
normalMapInput.addEventListener('click', (event) =>
{
    event.target.value = "";
});
let environmentMap = null;
envMapInput.addEventListener('change', () =>
{
    const selectedFiles = envMapInput.files;
    if(selectedFiles.length === 6)
    {
        const envMapOrder = ["px", "nx", "py", "ny", "pz", "nz"];
        const imageFiles = Array.from(selectedFiles)
        const orderedEnvMap = envMapOrder.map(key => {
            const file = imageFiles.find(item => item.name.includes(key));
            return URL.createObjectURL(file);
        });
        environmentMap = cubeTextureLoader.load(orderedEnvMap)
    } else {
        console.log('Selected 6 images for environment map.');
    }
})
/**
 * Animate
 */

const render = () =>
{
    renderer.render(scene, camera)
}
const clock = new THREE.Clock()
const objectsToTest = [];
    const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    if(selectedModel)
    {
        selectedHelper.setFromObject(selectedModel);
    }
    scene.background = environmentMap;
    scene.environment = environmentMap;
    // Update controls
    controls.update()

    // Render
    render();
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()

const control = new TransformControls( camera, canvas );
control.addEventListener( 'change',render );

control.addEventListener( 'dragging-changed', function ( event ) {

    controls.enabled = ! event.value;

} );


scene.add( control );


