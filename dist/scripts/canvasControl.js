// trackball rotation
class CanvasControl{
    zoom = 1;
    minZoom = 1;
    maxZoom = 1;
    camera;
    cameraFocus;
    mouseSensitivity;
    enabled = true;
    azimuthAngle = 0;
    elevationAngle = 0;
    mouseDown = false;
    mouseX = 0;
    mouseY = 0;

    constructor(canvas, camera, cameraFocus, mouseSensitivity, minZoom = 2, maxZoom = 15) {
        this.camera = camera;
        this.cameraFocus = cameraFocus;
        this.mouseSensitivity = mouseSensitivity;
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
        this.addEventListeners(canvas);
    }

    addEventListeners(canvas) {
        canvas.addEventListener("mousemove", this.onMouseMove.bind(this), false);
        canvas.addEventListener("mousedown", this.onMouseDown.bind(this), false);
        canvas.addEventListener("mouseup", this.onMouseUp.bind(this), false);
        canvas.addEventListener("wheel", this.onWheel.bind(this), false);
    }
    
    onWheel(e) {
        e.preventDefault();
        this.zoom = clamp(this.zoom + e.deltaY * 0.01, this.minZoom, this.maxZoom);
        console.log(this.zoom);
    }
    
    onMouseMove(e) {
        if (!this.mouseDown) return;
        console.log("roo");
        //if (this.enabled) {
            e.preventDefault();
            console.log("wow");
            var deltaX = (e.clientX - this.mouseX) * 0.001;
            var deltaY = (e.clientY - this.mouseY) * 0.001;
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.rotateCamera(this.camera, deltaX, deltaY);
        //}
    }
    
    onMouseDown(e) {
        e.preventDefault();
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.mouseDown = true;
    }
    
    onMouseUp(e) {
        e.preventDefault();
        this.mouseDown = false;
    }

    rotateCamera(camera, deltaX, deltaY) {
        this.azimuthAngle += deltaX * this.mouseSensitivity;
        this.elevationAngle = clamp(this.elevationAngle + deltaY * this.mouseSensitivity, -Math.PI / 2, Math.PI / 2);
        camera.position.x = Math.cos(this.azimuthAngle) * Math.cos(this.elevationAngle) * this.zoom;
        camera.position.y = Math.sin(this.elevationAngle) * this.zoom;
        camera.position.z = Math.sin(this.azimuthAngle) * Math.cos(this.elevationAngle) * this.zoom;
        camera.lookAt(this.cameraFocus);
    }
}
export default CanvasControl;