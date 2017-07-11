import Cube from "./cube.js";
import Renderer from "./renderer.js";
import Timer from "./timer.js";
import GlitchPass from "../lib/postprocessing/GlitchPass.js";
import DotScreenShader from "../lib/shaders/DotScreenShader.js";
import ShaderPass from "../lib/postprocessing/ShaderPass.js";
import * as KenneyFuture from "../assets/fonts/kenney_future.json";
import THREE from "three";

window.onload = () => {
    "use strict";

    const engine = new Renderer({
        camera: {
            fov: 30,
            near: 0.1,
            far: 1500
        },
        antialias: true
        // debug: true
    });

    engine.camera.position.set(0, 0, 1000);
    engine.camera.lookAt(new THREE.Vector3(0, 0, 0));
    engine.render();

    const text = new Timer({
        date: "2017/10/13",
        font: KenneyFuture,
        size: 70,
        height: 10,
        curveSegments: 4,
        speed: 4,
        color: {
            font: 0xffffff,
            font_side: 0xaaaaaa
        },
        cursor: {
            text: "_"
        },
        after: () => {
            // Add glitch effect
            console.log("Animation Finished");
        }
    });

    // Get the middle of the text to offset.
    text.final_geometry.computeBoundingBox();
    const text_bb = text.final_geometry.boundingBox;
    const middle = -0.5 * (text_bb.max.x - text_bb.min.x);

    // instantiate a loader
    var loader = new THREE.TextureLoader();

    // Load the background texture
    loader.load(
	    // resource URL
	    './assets/sky.jpg',
	    // Function when resource is loaded
	    function (texture) {
            var backgroundMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(1000, 1000, 0),
                new THREE.MeshBasicMaterial({
                    map: texture
                }));
            // backgroundMesh.material.depthTest = false;
            // backgroundMesh.material.depthWrite = false;

            backgroundMesh.position.x = 0;
            backgroundMesh.position.y = -50;
            backgroundMesh.position.z = 0;
            backgroundMesh.rotation.x = 0;
            backgroundMesh.rotation.y = Math.PI * 2;

            engine.add({
                mesh: backgroundMesh,
                update: () => {}
            });

            engine.add(text);
	    },
	    // Function called when download progresses
	    function (xhr) {
		    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
	    },
	    // Function called when download errors
	    (xhr) => {
		    console.log('An error happened', xhr);
	    }
    );

    // Position and rotate to face us.
    text.mesh.position.x = middle;
    text.mesh.position.y = 0;
    text.mesh.position.z = 100;
    text.mesh.rotation.x = -0.3;
    text.mesh.rotation.y = Math.PI * 2;

    const glitchPass = new GlitchPass();
    glitchPass.renderToScreen = true;
    engine.composer.addPass(glitchPass);

    document.body.addEventListener("keypress", (event) => {
        let height = Math.max(
            document.documentElement.clientHeight,
            window.innerHeight || 0);
        if (window.scrollY < height / 2) {
            document.querySelector('.event-info').scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
};

