export default class Matrix {
    elements = new Float32Array();

    /**
     * @description 旋转
     * @param {number} angle 旋转角度
     */
    rotate(angle: number, x: number, y: number, z: number) {
        const radian = angle / 180 * Math.PI;
        const cos = Math.cos(radian);
        const sin = Math.sin(radian);

        this.elements = new Float32Array([
            cos, sin, 0, 0,
            -sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);

        return this;
    }
}