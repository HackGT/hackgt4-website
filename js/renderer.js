import _ from "underscore";
import THREE from "three";
import RenderPass from "../lib/postprocessing/RenderPass.js";
import EffectComposer from "../lib/postprocessing/EffectComposer.js";

class Renderer {
    constructor(opts) {
        // Create scene
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            antialias: !! opts.antialias,
        });
        this.camera = new THREE.PerspectiveCamera(
            opts.camera.fov || 75,
            window.innerWidth / window.innerHeight,
            opts.camera.near || 0.1,
            opts.camera.far || 1000
        );

        // Append to DOM
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.id = "splash-canvas";
        let parent = document.getElementById("splash-parent");
        parent.appendChild(this.renderer.domElement);
        parent.insertBefore(this.renderer.domElement, parent.firstChild);

        // document.body.appendChild(this.renderer.domElement);
        // document.body.insertBefore(
        //     this.renderer.domElement, document.body.firstChild);

        // Start to render
        this.renderables = {};
        this.state = {
            ticks: 0,
        };

        // Add effect-composer
        this.composer = new EffectComposer(this.renderer);
        let original = new RenderPass(this.scene, this.camera);
        // original.renderToScreen = true;
        this.composer.addPass(original);

        // Manage resizing
        window.addEventListener("resize", () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            if (this.controls) {
                this.controls.handleResize();
            }
        }, false);
    }

    render() {
        // Render
        requestAnimationFrame(this.render.bind(this));
        this.composer.render();

        // Update objects
        setImmediate(() => {
            _.each(this.renderables, (update) => {
                update(this.state);
            });
            this.state.ticks += 1;

            if (this.controls) {
                this.controls.update();
            }
        });
    }

    add(object) {
        if (object.mesh && object.mesh.id && object.update) {
            this.renderables[object.mesh.id] = object.update.bind(object);
            this.scene.add(object.mesh);
        } else {
            throw new Error("Object did not have a mesh id or update.");
        }
    }
}

export default Renderer;

