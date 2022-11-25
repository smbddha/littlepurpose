"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MAX_VELOCITY = 20;
var BoidsStateEnum;
(function (BoidsStateEnum) {
  BoidsStateEnum[(BoidsStateEnum["Flock"] = 0)] = "Flock";
  BoidsStateEnum[(BoidsStateEnum["Home"] = 1)] = "Home";
})(BoidsStateEnum || (BoidsStateEnum = {}));
function vec_add(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}
function vec_sub(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}
function vec_scale(a, s) {
  return [a[0] * s, a[1] * s];
}
function clamp(a, lower_bound, upper_bound) {
  if (a < lower_bound) return lower_bound;
  if (a > upper_bound) return upper_bound;
  return a;
}
function dist(v1, v2) {
  let [x1, y1] = v1;
  let [x2, y2] = v2;
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
class Boids {
  constructor(w = 100, h = 100, bodies = []) {
    this.state = BoidsStateEnum.Home;
    this.bodies = bodies;
    this.com = [0, 0];
    this.cov = [0, 0];
    this.mouse = [0, 0];
    this.dt = 0.1;
    this.w = w;
    this.h = h;
    this.margin = 70;
    this.dists = {};
    this.rules = {
      1: [
        (b, _) => {
          return this.rule1(b);
        },
        0.003,
      ],
      2: [
        (b, i) => {
          return this.rule2(b, i);
        },
        0.08,
      ],
      3: [
        (b, _) => {
          return this.rule3(b);
        },
        0.003,
      ],
      4: [
        (b, _) => {
          return this.rule4(b);
        },
        0.2,
      ],
      5: [
        (b, _) => {
          return this.rule5(b);
        },
        0.05,
      ],
      6: [
        (b, _) => {
          return this.rule6(b);
        },
        0.0,
      ],
    };
    this.running = true;
  }
  computeCOM() {
    let c = [0, 0];
    let N = this.bodies.length;
    for (let i = 0; i < N; i++) {
      let [x, y] = this.bodies[i].p;
      c[0] += x;
      c[1] += y;
    }
    return [c[0] / N, c[1] / N];
  }
  computeCOV() {
    let c = [0, 0];
    let N = this.bodies.length;
    for (let i = 0; i < N; i++) {
      let [x, y] = this.bodies[i].v;
      c[0] += x;
      c[1] += y;
    }
    return [c[0] / N, c[1] / N];
  }
  computeDistances() {
    this.dists = {};
    let N = this.bodies.length;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (i === j) continue;
        let id = `${Math.min(i, j)}_${Math.max(i, j)}`;
        if (id in this.dists) continue;
        let [x1, y1] = this.bodies[i].p;
        let [x2, y2] = this.bodies[j].p;
        this.dists[id] = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      }
    }
  }
  getDistance(i, j) {
    let id = `${Math.min(i, j)}_${Math.max(i, j)}`;
    return this.dists[id];
  }
  tick() {
    if (!this.running) return;
    //recompute the center of mass (dont want to do for each boid)
    this.com = this.computeCOM();
    this.cov = this.computeCOV();
    this.computeDistances();
    if (this.state === BoidsStateEnum.Home) {
      for (let i = 0; i < this.bodies.length; i++) {
        let b = this.bodies[i];
        let [px, py] = b.p;
        let [hx, hy] = b.home;
        if (Math.abs(px - hx) < 2.5 && Math.abs(py - hy) < 2.5) {
          b.p = b.home;
          b.v = [0.0, 0.0];
          continue;
        }
        let nv = vec_scale(this.rule6(b), 1.0);
        b.v = [
          clamp(b.v[0] + nv[0], -MAX_VELOCITY, MAX_VELOCITY),
          clamp(b.v[1] + nv[1], -MAX_VELOCITY, MAX_VELOCITY),
        ];
        let d = dist(b.p, b.home) + 0.5;
        b.v = vec_scale(b.v, Math.min(1.0, d / 65 + 0.85));
        b.v = vec_scale(b.v, 0.99);
        b.p = vec_add(b.p, [b.v[0] * this.dt, b.v[1] * this.dt]);
        b.p[0] %= this.w;
        b.p[1] %= this.h;
        if (b.p[0] < 0) b.p[0] += this.w;
        if (b.p[1] < 0) b.p[1] += this.h;
      }
    } else {
      let rules = Object.values(this.rules);
      for (let i = 0; i < this.bodies.length; i++) {
        let b = this.bodies[i];
        let nv = rules
          .map((r) => {
            let [rule, coeff] = r;
            return vec_scale(rule(b, i), coeff);
          })
          .reduce(vec_add);
        b.v = [
          clamp(b.v[0] + nv[0], -MAX_VELOCITY, MAX_VELOCITY),
          clamp(b.v[1] + nv[1], -MAX_VELOCITY, MAX_VELOCITY),
        ];
        b.p = vec_add(b.p, [b.v[0] * this.dt, b.v[1] * this.dt]);
        b.p[0] %= this.w;
        b.p[1] %= this.h;
        if (b.p[0] < 0) b.p[0] += this.w;
        if (b.p[1] < 0) b.p[1] += this.h;
      }
    }
  }
  toggleState() {
    if (this.state === BoidsStateEnum.Flock) this.state = BoidsStateEnum.Home;
    else if (this.state === BoidsStateEnum.Home)
      this.state = BoidsStateEnum.Flock;
  }
  addRule(name, f, coeff = 0.25) {
    this.rules[name] = [f, coeff];
  }
  setCoeff(ruleName, newCoeff) {
    if (!(ruleName in this.rules)) {
      throw new Error("rule doesnt exist");
    }
    this.rules[ruleName][1] = newCoeff;
  }
  rule1(b) {
    // boids tend towards the center of mass (of all boids)
    return vec_sub(this.com, b.p);
  }
  rule2(b, j) {
    // boids want to *slightly* avoid nearby boids
    let c = [0, 0];
    let [bx, by] = b.p;
    for (let i = 0; i < this.bodies.length; i++) {
      let [x, y] = this.bodies[i].p;
      if (x === bx && y === by) continue;
      // let d = Math.sqrt((x - bx) ** 2 + (y - by) ** 2);
      let d = this.getDistance(j, i);
      // console.log(d);
      if (d < 60) {
        // console.log("CLOSE");
        let a = vec_sub(b.p, this.bodies[i].p);
        // c = vec_sub(c, vec_sub(this.bodies[i].p, b.p));
        c = vec_add(
          [(a[0] * 100) / (d * d + 1), (a[1] * 100) / (d * d + 1)],
          c
        );
      }
    }
    return c;
  }
  rule3(b) {
    // boids  want to match the velocity of other boids
    return vec_sub(this.cov, b.v);
  }
  rule4(b) {
    // AVOID MOUSE
    let d = dist(this.mouse, b.p);
    // to avoid dividing by 0
    if (d > 200) {
      return [0, 0];
    }
    let [x, y] = vec_sub(b.p, this.mouse);
    return [x * (100 / (d * d) + 1), y * (100 / (d * d) + 1)];
  }
  rule5(b) {
    // avoid walls
    let [x, y] = b.p;
    let dx = 0;
    if (x < this.margin) {
      dx = x;
    }
    if (x > this.w - this.margin) {
      dx = x - this.w;
    }
    let dy = 0;
    if (y < this.margin) {
      dy = y;
    }
    if (y > this.h - this.margin) {
      dy = y - this.h;
    }
    return [dx * 1000 * (1 / (dx * dx + 1)), dy * 1000 * (1 / (dy * dy + 1))];
  }
  rule6(b) {
    // tendancy towards "home"
    // let [x, y] = b.p;
    let [dx, dy] = vec_sub(b.home, b.p);
    let d = dist(b.p, b.home);
    return [dx * (d / 500), dy * (d / 500)];
  }
  //TODO tendancy towards motionless
  addBoid(x, y) {
    let b = {
      p: [x, y],
      v: [0, 0],
      home: [x, y],
      // v: [Math.random() * 2 - 1, Math.random() * 2 - 1],
    };
    this.bodies.push(b);
  }
  on() {
    this.running = true;
  }
  off() {
    this.running = false;
  }
  flock() {
    this.state = BoidsStateEnum.Flock;
  }
  home() {
    this.state = BoidsStateEnum.Home;
  }
}
exports.default = Boids;
//# sourceMappingURL=boids.js.map
