export default class Matrix {
    elements = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);

    _multiply(mt: Float32Array) {
        const ins = this.elements;
        let tmp0, tmp1, tmp2, tmp3;

        for (let i = 0; i < 4; ++i) {
            tmp0 = ins[i],
            tmp1 = ins[i + 4];
            tmp2 = ins[i + 8];
            tmp3 = ins[i + 12];

            ins[i] = mt[0] * tmp0 + mt[1] * tmp1 + mt[2] * tmp2 + mt[3] * tmp3;
            ins[i + 4] = mt[4] * tmp0 + mt[5] * tmp1 + mt[6] * tmp2 + mt[7] * tmp3;
            ins[i + 8] = mt[8] * tmp0 + mt[9] * tmp1 + mt[10] * tmp2 + mt[11] * tmp3;
            ins[i + 12] = mt[12] * tmp0 + mt[13] * tmp1 + mt[14] * tmp2 + mt[15] * tmp3;
        }

        return this;
    }

    /**
     * @description 平移
     * @param {number} tx 
     * @param {number} ty 
     * @param {number} tz 
     */
    translate(tx: number, ty: number, tz: number) {
        const mt = new Float32Array([
            1, 0, 0, tx,
            0, 1, 0, ty,
            0, 0, 1, tz,
            0, 0, 0, 1
        ]);

        this._multiply(mt);
        return this;
    }

    /**
     * @description 旋转
     * @param {number} angle 旋转角度
     */
    rotate(angle: number, x: 0 | 1, y: 0 | 1, z: 0 | 1) {
        if (x + y + z !== 1) {
            console.error('no target axis');
            return this;
        }

        let mt = new Float32Array();

        const radian = angle / 180 * Math.PI;
        const cos = Math.cos(radian);
        const sin = Math.sin(radian);

        if (z === 1) mt = new Float32Array([
            cos, sin, 0, 0,
            -sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);

        if (y === 1) mt = new Float32Array([
            cos, 0, sin, 0,
            0, 1, 0, 0,
            -sin, 0, cos, 0,
            0, 0, 0, 1
        ]);

        if (x === 1) mt = new Float32Array([
            1, 0, 0, 0,
            0, cos, sin, 0,
            0, -sin, cos, 0,
            0, 0, 0, 1
        ]);

        this._multiply(mt);
        return this;
    }

    scale(rx: number, ry: number, rz: number) {
        const mt = new Float32Array([
            rx, 0, 0, 0,
            0, ry, 0, 0,
            0, 0, rz, 0,
            0, 0, 0, 1
        ]);

        this._multiply(mt);
        return this;
    }
}