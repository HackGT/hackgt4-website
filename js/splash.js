import Cube from "./cube.js";
import Renderer from "./renderer.js";
import Timer from "./timer.js";
import GlitchPass from "../lib/postprocessing/GlitchPass.js";
import DotScreenShader from "../lib/shaders/DotScreenShader.js";
import ShaderPass from "../lib/postprocessing/ShaderPass.js";
import * as KenneyFuture from "../assets/fonts/kenney_future.json";

import THREE from "three";
import jump from "jump.js";

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
        size: 40,
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
    // text.mesh.position.x = middle;
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
            jump('.event-info');
        }
    });

    const isElementInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight
                                || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth
                               || document.documentElement.clientWidth)
        );
    };

    const hexes = document.getElementsByClassName("hex-commands")[0];
    let hexes_animated_in = false;

    const on_scroll = () => {
        if (!hexes_animated_in && isElementInViewport(hexes)) {
            const loading_text = document.querySelector(".hex-commands > p");

            const tiles = document.querySelectorAll(
                ".hex-commands > img.register, " +
                ".hex-commands > img.about, " +
                ".hex-commands > img.sponsor, " +
                ".hex-commands > img.atl, " +
                ".hex-commands > img.share"
            );

            setTimeout(() => {
                loading_text.classList.add("fadeout");
                setTimeout(() => {
                    for (const tile of tiles) {
                        tile.classList.add("animate");
                    }
                }, 500);
            }, 500);

            hexes_animated_in = true;
        }
    };
    window.addEventListener('scroll', on_scroll);
    on_scroll();

    let text_rendering = {};

    const draw_line = (line) => {
        document.querySelector(`.hex-commands > svg.${line}`).classList.add("draw");
        if (document.querySelector("input.prompt").value != line) {
            document.querySelector("input.prompt").value = "";
        }
        text_rendering[line] = setTimeout(() => {
            document.querySelector("input.prompt").value = line;
        }, 400);
    };

    const clear_line = (line) => {
        document.querySelector(`.hex-commands > svg.${line}`).classList.remove("draw");
        clearTimeout(text_rendering[line]);
    };

    document.querySelector(".hex-commands > img.about-on").addEventListener('mouseenter', (e) => {
        draw_line('about');
    });
    document.querySelector(".hex-commands > img.about-on").addEventListener('mouseleave', (e) => {
        clear_line('about');
    });
    document.querySelector(".hex-commands > img.register-on").addEventListener('mouseenter', (e) => {
        draw_line('register');
    });
    document.querySelector(".hex-commands > img.register-on").addEventListener('mouseleave', (e) => {
        clear_line('register');
    });
    document.querySelector(".hex-commands > img.sponsor-on").addEventListener('mouseenter', (e) => {
        draw_line('sponsor');
    });
    document.querySelector(".hex-commands > img.sponsor-on").addEventListener('mouseleave', (e) => {
        clear_line('sponsor');
    });
    document.querySelector(".hex-commands > img.atl-on").addEventListener('mouseenter', (e) => {
        draw_line('atl');
    });
    document.querySelector(".hex-commands > img.atl-on").addEventListener('mouseleave', (e) => {
        clear_line('atl');
    });
    document.querySelector(".hex-commands > img.share-on").addEventListener('mouseenter', (e) => {
        draw_line('share');
    });
    document.querySelector(".hex-commands > img.share-on").addEventListener('mouseleave', (e) => {
        clear_line('share');
    });
};

