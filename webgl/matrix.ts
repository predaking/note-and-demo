export class Matrix {
    elements = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);

    public reset() {
        this.elements = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        return this;
    }

    public multiply(mt: Float32Array) {
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
     * @description 右乘平移矩阵
     * @param {number} tx 
     * @param {number} ty 
     * @param {number} tz 
     */
    public translate(tx: number, ty: number, tz: number) {
        const e = this.elements;
        e[12] += e[0] * tx + e[4] * ty + e[8] * tz;
        e[13] += e[1] * tx + e[5] * ty + e[9] * tz;
        e[14] += e[2] * tx + e[6] * ty + e[10] * tz;
        e[15] += e[3] * tx + e[7] * ty + e[11] * tz;
        return this;
    }

    /**
     * @description 平移矩阵
     * @param {number} tx 
     * @param {number} ty 
     * @param {number} tz 
     */
    public setTranslate(tx: number, ty: number, tz: number) {
        this.elements = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1
        ]);
        return this;
    }

    /**
     * @description 旋转
     * @param {number} angle 旋转角度
     */
    public rotate(angle: number, x: 0 | 1, y: 0 | 1, z: 0 | 1) {
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

        this.elements = mt;
        return this;
    }

    public setRotate(angle: number, x: number, y: number, z: number) {
        var e, s, c, len, rlen, nc, xy, yz, zx, xs, ys, zs;

        angle = Math.PI * angle / 180;
        e = this.elements;

        s = Math.sin(angle);
        c = Math.cos(angle);

        if (0 !== x && 0 === y && 0 === z) {
            // Rotation around X axis
            if (x < 0) {
                s = -s;
            }
            e[0] = 1; e[4] = 0; e[8] = 0; e[12] = 0;
            e[1] = 0; e[5] = c; e[9] = -s; e[13] = 0;
            e[2] = 0; e[6] = s; e[10] = c; e[14] = 0;
            e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
        } else if (0 === x && 0 !== y && 0 === z) {
            // Rotation around Y axis
            if (y < 0) {
                s = -s;
            }
            e[0] = c; e[4] = 0; e[8] = s; e[12] = 0;
            e[1] = 0; e[5] = 1; e[9] = 0; e[13] = 0;
            e[2] = -s; e[6] = 0; e[10] = c; e[14] = 0;
            e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
        } else if (0 === x && 0 === y && 0 !== z) {
            // Rotation around Z axis
            if (z < 0) {
                s = -s;
            }
            e[0] = c; e[4] = -s; e[8] = 0; e[12] = 0;
            e[1] = s; e[5] = c; e[9] = 0; e[13] = 0;
            e[2] = 0; e[6] = 0; e[10] = 1; e[14] = 0;
            e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
        } else {
            // Rotation around another axis
            len = Math.sqrt(x * x + y * y + z * z);
            if (len !== 1) {
                rlen = 1 / len;
                x *= rlen;
                y *= rlen;
                z *= rlen;
            }
            nc = 1 - c;
            xy = x * y;
            yz = y * z;
            zx = z * x;
            xs = x * s;
            ys = y * s;
            zs = z * s;
            e[0] = x * x * nc + c;
            e[1] = xy * nc + zs;
            e[2] = zx * nc - ys;
            e[3] = 0;

            e[4] = xy * nc - zs;
            e[5] = y * y * nc + c;
            e[6] = yz * nc + xs;
            e[7] = 0;

            e[8] = zx * nc + ys;
            e[9] = yz * nc - xs;
            e[10] = z * z * nc + c;
            e[11] = 0;

            e[12] = 0;
            e[13] = 0;
            e[14] = 0;
            e[15] = 1;
        }

        return this;
    }

    /**
     * @description 缩放
     * @param rx 
     * @param ry 
     * @param rz 
     */
    public scale(rx: number, ry: number, rz: number) {
        const mt = new Float32Array([
            rx, 0, 0, 0,
            0, ry, 0, 0,
            0, 0, rz, 0,
            0, 0, 0, 1
        ]);

        this.multiply(mt);
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
    public setLookAt(eyeX: number, eyeY: number, eyeZ: number, centerX: number, centerY: number, centerZ: number, upX: number, upY: number, upZ: number) {
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

        this.elements = new Float32Array([
            sx, ux, -fx, 0,
            sy, uy, -fy, 0,
            sz, uz, -fz, 0,
            0, 0, 0, 1
        ]);

        return this.translate(-eyeX, -eyeY, -eyeZ);
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
    public ortho(right: number, left: number, bottom: number, top: number, near: number, far: number) {
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

        this.multiply(e);
        return this;
    }

    /**
     * @description 透视投影
     * @param fovy 垂直角
     * @param aspect 裁剪面宽高比
     * @param near 近裁剪面
     * @param far 远裁剪面
     */
    public setPerspective(fovy: number, aspect: number, near: number, far: number) {
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

        this.elements = new Float32Array([
            ct / aspect, 0, 0, 0,
            0, ct, 0, 0,
            0, 0, -(far + near) * rd, -1,
            0, 0, -2 * near * far * rd, 0
        ]);

        return this;
    }

    /**
     * @description 求逆矩阵
     * @param m 
     */
    public setInverseOf(m: Matrix) {
        var i, s, d, inv, det;

        s = m.elements;
        d = this.elements;
        inv = new Float32Array(16);

        inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15]
            + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10];
        inv[4] = -s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15]
            - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10];
        inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15]
            + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9];
        inv[12] = -s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14]
            - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9];

        inv[1] = -s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15]
            - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10];
        inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15]
            + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10];
        inv[9] = -s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15]
            - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9];
        inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14]
            + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9];

        inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15]
            + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6];
        inv[6] = -s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15]
            - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6];
        inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15]
            + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5];
        inv[14] = -s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14]
            - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5];

        inv[3] = -s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11]
            - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6];
        inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11]
            + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
        inv[11] = -s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11]
            - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
        inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10]
            + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];

        det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
        if (det === 0) {
            return this;
        }

        det = 1 / det;
        for (i = 0; i < 16; i++) {
            d[i] = inv[i] * det;
        }

        return this;
    }

    /**
     * @description 矩阵转置
     */
    public transpose() {
        const e = this.elements;

        let t = 0;

        t = e[1]; e[1] = e[4]; e[4] = t;
        t = e[2]; e[2] = e[8]; e[8] = t;
        t = e[3]; e[3] = e[12]; e[12] = t;
        t = e[6]; e[6] = e[9]; e[9] = t;
        t = e[7]; e[7] = e[13]; e[13] = t;
        t = e[11]; e[11] = e[14]; e[14] = t;

        return this;
    }
}

export class Vector3 {
    elements = new Float32Array(3);

    constructor(vector3: number[]) {
        this.elements[0] = vector3[0];
        this.elements[1] = vector3[1];
        this.elements[2] = vector3[2];
    }

    /**
     * @description 三维向量归一化
     */
    public normalize() {
        const v0 = this.elements[0];
        const v1 = this.elements[1];
        const v2 = this.elements[2];

        const base = Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2);

        this.elements[0] = v0 / base;
        this.elements[1] = v1 / base;
        this.elements[2] = v2 / base;

        return this;
    }
}