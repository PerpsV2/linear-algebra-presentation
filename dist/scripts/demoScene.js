import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as Utils from './utils.js';
import * as Objects from './sceneObjects.js';
import basicVertex from './shaders/basicVertex.js';
import basicFragment from './shaders/basicFragment.js';

class DemoScene {
    #bgScene;
    scene;
    #oCamera;
    #pCamera;
    camera;
    renderer;

    pCameraEnabled;
    #materials = {};
    #sceneObjects = {};
    #frustumAspectRatio;
    #displayScale;
    #canvas;
    zoom = 5;

    mouseSensitivity = 1;
    scrollSensitivity = 1;
    minZoom = 1;
    maxZoom = 15;
    #mouseDown = false;
    #mouseX;
    #mouseY;

    matrix = new THREE.Matrix4();
    
    #uniforms = {
        transformation: { type: 'mat4', value: this.matrix },
        color: { type: 'vec3', value: new THREE.Vector3(1, 1, 1) }
    };

    BASE_MATERIAL = new THREE.ShaderMaterial({
        fragmentShader: basicFragment,
        vertexShader: basicVertex,
        uniforms: this.#uniforms
    });

    constructor(canvas, canvasContainer, displayScale, cellSize = 1, gridSize = 20, axisWidth = 0.04) {
        this.#frustumAspectRatio = canvas.offsetWidth / canvas.offsetHeight;
        this.#displayScale = displayScale;
        this.#canvas = canvas;

        // create scene
        this.#bgScene = new THREE.Scene();
        this.scene = new THREE.Scene(); // all objects in scene will be drawn over all objects in bgScene

        // create cameras
        this.#oCamera = new THREE.OrthographicCamera(this.#frustumAspectRatio * this.zoom / -2, this.#frustumAspectRatio * this.zoom / 2, 
        this.zoom / 2, this.zoom / -2, 0.1, 1000);
        this.#pCamera = new THREE.PerspectiveCamera(75, this.#frustumAspectRatio, 0.1, 1000);
        this.setCamera2D();

        // create renderer
        this.renderer = new THREE.WebGLRenderer({canvas: canvas});
        this.renderer.setClearColor(0x252525, 1);
        this.renderer.setSize(window.innerWidth * displayScale, window.innerHeight * displayScale);
        this.renderer.autoClear = false;
        canvasContainer.appendChild(this.renderer.domElement);

        // position cameras
        this.#pCamera.position.y = 5;
        this.#oCamera.position.y = 5;
        this.#pCamera.lookAt(0, 0, 0);
        this.#oCamera.lookAt(0, 0, 0);

        // create materials
        this.matrix.set(1, 0, 0, 0, 0, 1, 0, 0, -0, -0, -1, -0, 0, 0, 0, 1);

        const axisMaterial = this.BASE_MATERIAL.clone();
        const lineMaterial = this.BASE_MATERIAL.clone();
        lineMaterial.uniforms.color = {type: 'vec3', value: new THREE.Vector3(0.4, 0.4, 0.4)};
        const arrowMaterial = this.BASE_MATERIAL.clone();
        arrowMaterial.uniforms.color = {type: 'vec3', value: new THREE.Vector3(0.8, 0.0, 0.6)};
        this.#materials.axisMat = axisMaterial;
        this.#materials.lineMat = lineMaterial;
        this.#materials.arrowMat = arrowMaterial;
        
        // create objects
        this.#sceneObjects.grid = Objects.createGridMesh(this.#bgScene, lineMaterial, cellSize, gridSize);
        this.#sceneObjects.xAxis = Objects.createBoxMesh(this.#bgScene, axisMaterial, gridSize * 2, axisWidth, axisWidth);
        this.#sceneObjects.yAxis = Objects.createBoxMesh(this.#bgScene, axisMaterial, axisWidth, gridSize * 2, axisWidth);
        this.#sceneObjects.zAxis = Objects.createBoxMesh(this.#bgScene, axisMaterial, axisWidth, axisWidth, gridSize * 2);

        // bind canvas control event handlers
        this.addMouseMoveHandler(canvas, this);
        this.addMouseDownHandler(canvas, this);
        this.addMouseUpHandler(canvas, this);
        this.addWheelHandler(canvas, this);
    }

    addMaterial(name) {
        this.#materials[name] = this.BASE_MATERIAL.clone();
        return this.#materials[name];
    }

    addMaterialWithColor(name, color) {
        this.addMaterial(name).uniforms.color = {type: 'vec3', value: color};
    }

    getMaterial(name) {
        return this.#materials[name];
    }

    addObject(name, mesh) {
        this.#sceneObjects[name] = mesh;
    }

    getObject(name) {
        return this.#sceneObjects[name];
    }

    setCamera2D() {
        this.camera = this.#oCamera;
        this.pCameraEnabled = false;
    }

    setCamera3D() {
        this.camera = this.#pCamera;
        this.pCameraEnabled = true;
    }

    // canvas trackball rotation control
    rotateCamera(deltaX, deltaY) {
        if (typeof this.rotateCamera.azimuthAngle == 'undefined') this.rotateCamera.azimuthAngle = 0;
        if (typeof this.rotateCamera.elevationAngle == 'undefined') this.rotateCamera.elevationAngle = 0;
        this.rotateCamera.azimuthAngle += deltaX * this.mouseSensitivity;
        this.rotateCamera.elevationAngle = Utils.clamp(this.rotateCamera.elevationAngle + deltaY * this.mouseSensitivity, -Math.PI / 2, Math.PI / 2);
        this.camera.position.x = Math.cos(this.rotateCamera.azimuthAngle) * Math.cos(this.rotateCamera.elevationAngle) * this.zoom;
        this.camera.position.y = Math.sin(this.rotateCamera.elevationAngle) * this.zoom;
        this.camera.position.z = Math.sin(this.rotateCamera.azimuthAngle) * Math.cos(this.rotateCamera.elevationAngle) * this.zoom;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    addMouseMoveHandler(element, thisObj) {
        element.addEventListener('mousemove', (e) => {
            if (!thisObj.#mouseDown) return;
            if (!thisObj.pCameraEnabled) return;

            e.preventDefault();
            let deltaX = (e.clientX - thisObj.#mouseX) * 0.001;
            let deltaY = (e.clientY - thisObj.#mouseY) * 0.001; 
            thisObj.#mouseX = e.clientX;
            thisObj.#mouseY = e.clientY;
            thisObj.rotateCamera(deltaX, deltaY);
        })
    }

    addMouseDownHandler(element, thisObj) {
        element.addEventListener('mousedown', (e) => {
            e.preventDefault();
            thisObj.#mouseX = e.clientX;
            thisObj.#mouseY = e.clientY;
            thisObj.#mouseDown = true;
        });
    }

    addMouseUpHandler(element, thisObj) {
        element.addEventListener('mouseup', (e) => {
            e.preventDefault();
            thisObj.#mouseDown = false;
        })
    }

    addWheelHandler(element, thisObj) {
        element.addEventListener('wheel', (e) => {
            e.preventDefault();
            thisObj.zoom = Utils.clamp(Math.round(thisObj.zoom) + e.deltaY * 0.01 * thisObj.scrollSensitivity, thisObj.minZoom, thisObj.maxZoom);
        })
    }

    animate(animateFunc) {
        let thisObj = this;
        let animateWrapper = function() {
            requestAnimationFrame(function(){thisObj.animate(animateFunc)}.bind(thisObj));
            thisObj.renderer.setSize(window.innerWidth * thisObj.#displayScale, window.innerHeight * thisObj.#displayScale);
            thisObj.#frustumAspectRatio = thisObj.#canvas.offsetWidth / thisObj.#canvas.offsetHeight;
            if (thisObj.pCameraEnabled) thisObj.rotateCamera(0, 0);
            if(!thisObj.pCameraEnabled) Utils.updateOrthographicCameraSize(thisObj.camera, thisObj.#frustumAspectRatio * thisObj.zoom / -2, +
                thisObj.#frustumAspectRatio * thisObj.zoom / 2, thisObj.zoom / 2, thisObj.zoom / -2);
            thisObj.camera.updateProjectionMatrix();
            animateFunc();
            thisObj.renderer.clear();
            thisObj.renderer.render(thisObj.#bgScene, thisObj.camera);
            thisObj.renderer.clearDepth();
            thisObj.renderer.render(thisObj.scene, thisObj.camera)
        }
        animateWrapper();
    }
}
export default DemoScene;