export default class Matrix {
    elements = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);

    reset() {
        this.elements = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        return this;
    }

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

    /**
     * @description 缩放
     * @param rx 
     * @param ry 
     * @param rz 
     */
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

    /**
     * @description 视图变换
     * @param eyeX 
     * @param eyeY 
     * @param eyeZ 
     * @param centerX 
     * @param centerY 
     * @param centerZ 
     * @param upX 
     * @param upY 
     * @param upZ 
     */
    lookAt(eyeX: number, eyeY: number, eyeZ: number, centerX: number, centerY: number, centerZ: number, upX: number, upY: number, upZ: number) {
        var e, fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;

        fx = centerX - eyeX;
        fy = centerY - eyeY;
        fz = centerZ - eyeZ;

        rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
        fx *= rlf;
        fy *= rlf;
        fz *= rlf;

        sx = fy * upZ - fz * upY;
        sy = fz * upX - fx * upZ;
        sz = fx * upY - fy * upX;

        rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
        sx *= rls;
        sy *= rls;
        sz *= rls;

        ux = sy * fz - sz * fy;
        uy = sz * fx - sx * fz;
        uz = sx * fy - sy * fx;

        e = new Float32Array(16);
        e[0] = sx;
        e[1] = ux;
        e[2] = -fx;
        e[3] = 0;

        e[4] = sy;
        e[5] = uy;
        e[6] = -fy;
        e[7] = 0;

        e[8] = sz;
        e[9] = uz;
        e[10] = -fz;
        e[11] = 0;

        e[12] = 0;
        e[13] = 0;
        e[14] = 0;
        e[15] = 1;

        return this._multiply(e).translate(-eyeX, -eyeY, -eyeZ);
    }

    /**
     * @description 正交（正射）投影
     * @param right 
     * @param left 
     * @param bottom 
     * @param top 
     * @param near 
     * @param far 
     */
    ortho(right: number, left: number, bottom: number, top: number, near: number, far: number) {
        var e, rw, rh, rd;

        if (left === right || bottom === top || near === far) {
            throw 'null frustum';
        }

        rw = 1 / (right - left);
        rh = 1 / (top - bottom);
        rd = 1 / (far - near);

        e = new Float32Array(16);

        e[0] = 2 * rw;
        e[1] = 0;
        e[2] = 0;
        e[3] = 0;

        e[4] = 0;
        e[5] = 2 * rh;
        e[6] = 0;
        e[7] = 0;

        e[8] = 0;
        e[9] = 0;
        e[10] = -2 * rd;
        e[11] = 0;

        e[12] = -(right + left) * rw;
        e[13] = -(top + bottom) * rh;
        e[14] = -(far + near) * rd;
        e[15] = 1;

        this._multiply(e);
        return this;
    }

    /**
     * @description 透视投影
     * @param fovy 垂直角
     * @param aspect 裁剪面宽高比
     * @param near 近裁剪面
     * @param far 远裁剪面
     */
    perspective(fovy: number, aspect: number, near: number, far: number) {
        var e, rd, s, ct;

        if (near === far || aspect === 0) {
            throw 'null frustum';
        }
        if (near <= 0) {
            throw 'near <= 0';
        }
        if (far <= 0) {
            throw 'far <= 0';
        }

        fovy = Math.PI * fovy / 180 / 2;
        s = Math.sin(fovy);
        if (s === 0) {
            throw 'null frustum';
        }

        rd = 1 / (far - near);
        ct = Math.cos(fovy) / s;

        e = new Float32Array(16);

        e[0] = ct / aspect;
        e[1] = 0;
        e[2] = 0;
        e[3] = 0;

        e[4] = 0;
        e[5] = ct;
        e[6] = 0;
        e[7] = 0;

        e[8] = 0;
        e[9] = 0;
        e[10] = -(far + near) * rd;
        e[11] = -1;

        e[12] = 0;
        e[13] = 0;
        e[14] = -2 * near * far * rd;
        e[15] = 0;

        this._multiply(e);
        return this;
    }
}