import THREE from "three";
import _ from "underscore";

class Timer {
    constructor(opts) {
        this.target_date = new Date(opts.date);
        this.cursor = opts.cursor || {};
        this.cursor.text = this.cursor.text || "|";
        this.mesh = new THREE.Object3D();
        this.size = opts.size;

        this.make_text = (text, size) => {
            return new THREE.TextGeometry(text, {
                font: new THREE.Font(opts.font),
                size: size,
                height: opts.height,
                curveSegments: opts.curveSegments,
                material: 0,
                extrudeMaterial: 1
            });
        };

        this.material = new THREE.MultiMaterial([
            // Font face material
            new THREE.MeshBasicMaterial({
                color: opts.color.font,
                shading: THREE.FlatShading
            }),

            // Side of font material
            new THREE.MeshBasicMaterial({
                color: opts.color.font_side || opts.color.font,
                shading: THREE.SmoothShading
            }),
        ]);

        this.geometry = this.make_text("", 10);
        this.text_mesh = new THREE.Mesh(this.geometry, this.material);
        this.update_time();
        this.final_geometry = this.geometry;
        this.mesh.add(this.text_mesh);
    }

    update_time() {
        let diff = Math.abs(new Date() - this.target_date);

        if (this.old_diff != diff) {
            // Cleanup old mesh
            this.mesh.remove(this.text_mesh);
            this.text_mesh.geometry.dispose();

            const millis  = diff % 1000;
            const seconds = ("00" + (Math.floor(diff / 1000) % 60)).slice(-2);
            const minutes = ("00" + (Math.floor(diff / 1000 / 60) % 60)).slice(-2);
            const hours   = Math.floor(diff / 1000 / 60 / 60) % 24;
            const days    = Math.floor(diff / 1000 / 60 / 60 / 24);

            // Create new mesh
            this.geometry = this.make_text(
                `${days} days ${hours}:${minutes}:${seconds}`,
                this.size * window.innerWidth / window.innerHeight
            );
            this.text_mesh = new THREE.Mesh(this.geometry, this.material);

            // Get the middle of the text to offset.
            this.geometry.computeBoundingBox();
            const text_bb = this.geometry.boundingBox;
            const middle = -0.5 * (text_bb.max.x - text_bb.min.x);

            this.text_mesh.position.x = middle;

            // Add it back to the group
            this.mesh.add(this.text_mesh);

            this.old_diff = diff;
        }
    }

    update(global) {
        this.update_time();
    }
}

export default Timer;

