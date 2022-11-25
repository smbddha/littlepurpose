// use "strict";

function main() {
  let eyesEl = document.getElementById("eyes-avatar");
  if (!eyesEl) console.error("couldn't find eyes div");

  let rect = eyesEl.getBoundingClientRect();
  let eyesCenter = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };

  window.addEventListener("mousemove", function (e) {
    let mx = e.clientX;
    let my = e.clientY;

    let constraint = 20;
    // transform eyes perspective
    let rotateX = -(my - eyesCenter.y - rect.height / 2) / constraint;
    let rotateY = (mx - eyesCenter.x - rect.width / 2) / constraint;

    eyesEl.style.transform = "perspective(400px)";
    eyesEl.style.transform += `rotateX(${rotateX}deg)`;
    eyesEl.style.transform += `rotateY(${rotateY}deg)`;
  });
}

window.addEventListener("load", main);
