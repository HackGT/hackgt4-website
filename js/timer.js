import THREE from "three";
import _ from "underscore";

class Timer {
    constructor(opts) {
        this.target_date = new Date(opts.date);
        this.cursor = opts.cursor || {};
        this.cursor.text = this.cursor.text || "|";
        this.mesh = new THREE.Object3D();

        this.make_text = (text) => {
            return new THREE.TextGeometry(text, {
                font: new THREE.Font(opts.font),
                size: opts.size,
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

        this.geometry = this.make_text("");
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

            let millis  = diff % 1000;
            let seconds = ("00" + (Math.floor(diff / 1000) % 60)).slice(-2);
            let minutes = ("00" + (Math.floor(diff / 1000 / 60) % 60)).slice(-2);
            let hours   = Math.floor(diff / 1000 / 60 / 60) % 24;
            let days    = Math.floor(diff / 1000 / 60 / 60 / 24);

            // Create new mesh
            this.geometry = this.make_text(
                `${days} days ${hours}:${minutes}:${seconds}`);
            this.text_mesh = new THREE.Mesh(this.geometry, this.material);

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

