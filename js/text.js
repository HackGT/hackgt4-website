import THREE from "three";

class Text {
    constructor(opts) {
        this.text = opts.text;
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

        this.needs_update = true;
        this.update();

        // Manage resizing
        this.needs_update = false;
        window.addEventListener("resize", () => {
            this.needs_update = true;
        }, false);
    }

    update(global) {
        if (this.needs_update) {
            if (this.text_mesh !== undefined) {
                this.mesh.remove(this.text_mesh);
                this.text_mesh.geometry.dispose();
            }

            // Create new mesh
            this.geometry = this.make_text(
                this.text,
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
        }
    }
}

export default Text;

