import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import basicVertex from './shaders/basicVertex.js';
import basicFragment from './shaders/basicFragment.js';

class DemoScene {
    scene;
    oCamera;
    pCamera;
    camera;
    renderer;

    pCameraEnabled;
    sceneObjects = [];
    frustumAspectRatio;
    zoom = 4;

    matrix = new THREE.Matrix4();
    
    uniforms = {
        transformation: { type: 'mat4', value: this.matrix },
        color: { type: 'vec3', value: new THREE.Vector3(1, 1, 1) }
    };

    mouseSensitivity = 1;
    scrollSensitivity = 1;
    mouseDown = false;
    azimuthAngle = 0;
    elevationAngle = 0;
    mouseX;
    mouseY;
    minZoom = 1;
    maxZoom = 15;

    constructor(canvas, canvasContainer, displayScale, cellSize, gridSize, axisWidth) {
        this.frustumAspectRatio = canvas.offsetWidth / canvas.offsetHeight;

        // create scene
        this.scene = new THREE.Scene();

        // create cameras
        this.oCamera = new THREE.OrthographicCamera(this.frustumAspectRatio * this.zoom / -2, this.frustumAspectRatio * this.zoom / 2, 
        this.zoom / 2, this.zoom / -2, 0.1, 1000);
        this.pCamera = new THREE.PerspectiveCamera(75, this.frustumAspectRatio, 0.1, 1000);
        this.setCamera2D();

        // create renderer
        this.renderer = new THREE.WebGLRenderer({canvas: canvas});
        this.renderer.setClearColor(0x252525, 1);
        this.renderer.setSize(window.innerWidth * displayScale, window.innerHeight * displayScale);
        canvasContainer.appendChild(this.renderer.domElement);

        // position cameras
        this.pCamera.position.y = 5;
        this.oCamera.position.y = 5;
        this.pCamera.lookAt(0, 0, 0);
        this.oCamera.lookAt(0, 0, 0);

        // create materials
        this.matrix.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        const baseMaterial = new THREE.ShaderMaterial({
            fragmentShader: basicFragment,
            vertexShader: basicVertex,
            uniforms: this.uniforms
        });

        const axisMaterial = baseMaterial.clone();
        const lineMaterial = baseMaterial.clone();
        lineMaterial.uniforms.color = {type: 'vec3', value: new THREE.Vector3(0.4, 0.4, 0.4)};
        const arrowMaterial = baseMaterial.clone();
        arrowMaterial.uniforms.color = {type: 'vec3', value: new THREE.Vector3(1.0, 0.0, 0.0)};
        
        // create objects
        this.sceneObjects.push(createGridMesh(this.scene, lineMaterial, cellSize, gridSize));
        this.sceneObjects.push(createBoxMesh(this.scene, axisMaterial, gridSize * 2, axisWidth, axisWidth));
        this.sceneObjects.push(createBoxMesh(this.scene, axisMaterial, axisWidth, gridSize * 2, axisWidth));
        this.sceneObjects.push(createBoxMesh(this.scene, axisMaterial, axisWidth, axisWidth, gridSize * 2));
        this.sceneObjects.push(createArrowMesh(this.scene, arrowMaterial, 0.05, 0.4, 0.8));

        // bind canvas control event handlers
        this.addMouseMoveHandler(canvas, this);
        this.addMouseDownHandler(canvas, this);
        this.addMouseUpHandler(canvas, this);
        this.addWheelHandler(canvas, this);
    }

    setCamera2D() {
        console.log(this);
        this.camera = this.oCamera;
        this.pCameraEnabled = false;
    }

    setCamera3D() {
        this.camera = this.pCamera;
        this.pCameraEnabled = true;
    }

    // canvas trackball rotation control
    rotateCamera(deltaX, deltaY) {
        this.azimuthAngle += deltaX * this.mouseSensitivity;
        this.elevationAngle = clamp(this.elevationAngle + deltaY * this.mouseSensitivity, -Math.PI / 2, Math.PI / 2);
        this.camera.position.x = Math.cos(this.azimuthAngle) * Math.cos(this.elevationAngle) * this.zoom;
        this.camera.position.y = Math.sin(this.elevationAngle) * this.zoom;
        this.camera.position.z = Math.sin(this.azimuthAngle) * Math.cos(this.elevationAngle) * this.zoom;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    addMouseMoveHandler(element, thisObj) {
        element.addEventListener('mousemove', function(e) {
            if (!thisObj.mouseDown) return;
            if (!thisObj.pCameraEnabled) return;

            e.preventDefault();
            var deltaX = (e.clientX - thisObj.mouseX) * 0.001;
            var deltaY = (e.clientY - thisObj.mouseY) * 0.001; 
            thisObj.mouseX = e.clientX;
            thisObj.mouseY = e.clientY;
            thisObj.rotateCamera(deltaX, deltaY);
        })
    }

    addMouseDownHandler(element, thisObj) {
        element.addEventListener('mousedown', function(e) {
            e.preventDefault();
            thisObj.mouseX = e.clientX;
            thisObj.mouseY = e.clientY;
            thisObj.mouseDown = true;
        });
    }

    addMouseUpHandler(element, thisObj) {
        element.addEventListener('mouseup', function(e) {
            e.preventDefault();
            thisObj.mouseDown = false;
        })
    }

    addWheelHandler(element, thisObj) {
        element.addEventListener('wheel', function(e) {
            e.preventDefault();
            thisObj.zoom = clamp(thisObj.zoom + e.deltaY * 0.01 * thisObj.scrollSensitivity, thisObj.minZoom, thisObj.maxZoom);
        })
    }
}
export default DemoScene;