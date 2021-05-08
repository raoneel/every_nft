/**
 * NOTE:
 * Please read the README.md file provided in this template.
 */

// If you want to create OBJKT's with different seeds, you can access the creator and viewer wallet ids. This values will only be injected once the piece has been minted
// they will not work locally.
// if the user is not sync, the viewer comes in as false
const creator = new URLSearchParams(window.location.search).get("creator");
const viewer = new URLSearchParams(window.location.search).get("viewer");

console.log("OBJKT created by", creator);
console.log("OBJKT viewed by", viewer);

// Dont forget to add your own resize handler. hicetnunc expects to get content in the whole width and heght
// const resize = () => {
//     console.log('resize')
// }
// window.addEventListener('resize', resize);
var ctx;
var zoomCtx;
var imageData;
var totalImagesSpan;
const startTime = 1620290926578;

// Calculate elapsed time, which will be used to restore state.
let elapsedTime = BigInt(Date.now()) - BigInt(startTime);
// 60 images generated per second.
var totalImages = (elapsedTime / 1000n) * 60n;

document.body.onload = function () {
  var canvas = document.getElementById("canvas");
  totalImagesSpan = document.getElementById("totalImages");
  ctx = canvas.getContext("2d");
  imageData = ctx.createImageData(500, 500);

  var zoom = document.getElementById("zoom");
  zoomCtx = zoom.getContext("2d");

  removeAlpha(imageData);
  restore(imageData);

  loop();
};

function loop() {
  increment(imageData);
  ctx.putImageData(imageData, 0, 0);
  totalImages++;
  totalImagesSpan.textContent = totalImages;
  drawPreview(0, 0, 3, 3);
  requestAnimationFrame(loop);
}

function increment(imageData) {
  let cursor = 0;

  while (true) {
    var value = getValueAtPixel(imageData, cursor);
    if (value < 255) {
      setValueAtPixel(imageData, cursor, value + 1);
      break;
    } else {
      // Carry over
      setValueAtPixel(imageData, cursor, 0);
      cursor++;
    }
  }
}

function getValueAtPixel(imageData, cursor) {
  return imageData.data[cursor];
}

function setValueAtPixel(imageData, cursor, value) {
  imageData.data[cursor] = value;
}

function removeAlpha(imageData) {
  for (var i = 0; i < 1000000; i++) {
    if ((i + 1) % 4 == 0) {
      setValueAtPixel(imageData, i, 255);
    }
  }
}

function restore(imageData) {
  let cursor = 0;
  let elapsed = totalImages;

  while (true) {
    let remainder = elapsed % 256n;
    console.log(cursor, Number(remainder));
    setValueAtPixel(imageData, cursor, Number(remainder));
    cursor++;

    // Skip the alpha value.
    if ((cursor + 1) % 4 == 0) {
      cursor++;
    }

    // Every value has been generated...
    // Should never realistically happen.
    if (cursor >= 1000000) {
      break;
    }

    elapsed = elapsed / 256n;

    if (elapsed == 0) {
      break;
    }
  }
}

const ZOOMED_SIZE = 60;

function drawPreview(x, y, rows, columns) {
  for (var i = x - 1; i < x + rows - 1; i++) {
    for (var j = y - 1; j < y + columns - 1; j++) {
      if (i < 0 || i >= 500 || j < 0 || j >= 500) {
        // Out of bounds
        zoomCtx.fillStyle = "rgb(100, 100, 100)";
        zoomCtx.fillRect(
          i * ZOOMED_SIZE + ZOOMED_SIZE,
          j * ZOOMED_SIZE + ZOOMED_SIZE,
          ZOOMED_SIZE,
          ZOOMED_SIZE
        );
      } else {
        var cursor = i * 500 * 4 + j * 4;
        var r = getValueAtPixel(imageData, cursor);
        var g = getValueAtPixel(imageData, cursor + 1);
        var b = getValueAtPixel(imageData, cursor + 2);

        zoomCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        zoomCtx.fillRect(
          j * ZOOMED_SIZE + ZOOMED_SIZE,
          i * ZOOMED_SIZE + ZOOMED_SIZE,
          ZOOMED_SIZE,
          ZOOMED_SIZE
        );
        zoomCtx.fillStyle = 'rgb(255,255,255)';
        zoomCtx.font = "12px Arial";
        zoomCtx.fillText(
          "R: " + r,
          j * ZOOMED_SIZE + ZOOMED_SIZE,
          i * ZOOMED_SIZE + ZOOMED_SIZE + ZOOMED_SIZE / 4
        );
        zoomCtx.fillText(
          "G: " + g,
          j * ZOOMED_SIZE + ZOOMED_SIZE,
          i * ZOOMED_SIZE + ZOOMED_SIZE + ZOOMED_SIZE / 4 * 2
        );
        zoomCtx.fillText(
          "B: " + b,
          j * ZOOMED_SIZE + ZOOMED_SIZE,
          i * ZOOMED_SIZE + ZOOMED_SIZE + ZOOMED_SIZE / 4 * 3
        );
      }
    }
  }
}
