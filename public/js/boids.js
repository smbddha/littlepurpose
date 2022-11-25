function _dist(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function spanify(parent) {
  const spans = [];
  const s = parent.innerText;
  for (let i = 0; i < s.length; i++) {
    let sp = document.createElement("span");
    let c = s.charAt(i);

    sp.innerHTML = c;
    if (c === " ") {
      sp.innerHTML = "&nbsp;";
    }

    sp.classList.add("inlineblock");
    spans.push(sp);
  }

  parent.innerText = "";
  parent.append(...spans);

  return parent;
}

const MOUSE_DISTANCE_THRESHOLD = 80;
let boids = null;

window.onload = () => {
  let running = true;

  let el = document.getElementById("boid-chars");
  if (!el) return;

  boids = new Boids(window.innerWidth, window.innerHeight);
  boids.off();
  // boids.flock();
  boids.home();

  let mouseActivity = 0.0;

  let rect = el.getBoundingClientRect();
  let boidsCenter = [
    (rect.right - rect.left) / 2 + rect.left,
    (rect.bottom - rect.top) / 2 + rect.top,
  ];
  window.addEventListener("mousemove", (e) => {
    boids.mouse = [e.clientX, e.clientY];

    let d = _dist(e.clientX, e.clientY, boidsCenter[0], boidsCenter[1]);
    if (d < MOUSE_DISTANCE_THRESHOLD) {
      boids.flock();
    }

    mouseActivity = 1.0;
  });

  let letterSpans = Array.from(spanify(el).children);
  // let letterSpans = [];

  let chars = letterSpans.map((e) => {
    let rect = e.getBoundingClientRect();
    return {
      home: [rect.left, rect.top],
      el: e,
    };
  });

  chars.forEach((c) => {
    boids.addBoid(c.home[0], c.home[1]);
  });

  boids.on();

  let animId = 0;
  const step = () => {
    if (mouseActivity < 0.0) boids.home();

    boids.tick();

    for (let i = 0; i < boids.bodies.length; i++) {
      let b = boids.bodies[i];

      let [bvx, bvy] = b.v;
      let a = Math.acos(bvy / Math.sqrt(bvx * bvx + bvy * bvy));
      if (isNaN(a)) {
        a = 0.0;
      }

      // to avoid NaN 's
      if (bvx === 0 && bvy == 0) a = 0.0;

      if (i < chars.length) {
        let c = chars[i];
        let x = b.p[0] - c.home[0];
        let y = b.p[1] - c.home[1];

        c.el.style.transform = `translate(${x}px, ${y}px)`;
        c.el.style.transform += `rotate(${a}rad)`;
      }
    }

    mouseActivity -= 0.01;

    if (running) {
      animId = window.requestAnimationFrame(step);
    }
  };

  animId = window.requestAnimationFrame(step);
};
