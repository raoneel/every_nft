let cnv;
let zoomBy = 1;
let xOffset = 0;
let yOffset = 0;
let mx = 0;
let my = 0;

let w = 480;
let h = w;
let numRow = 8;
let numBlocks = numRow * numRow;
let blockWidth = w / numRow;
let blockHeight = h / numRow;
let blocks = [];
let done = false;

const framesPerSecond = 8;
const BASE = 2;
const MAX_INDEX = BASE - 1;
const START_TIME = 1620791847000;

//P5 Setup function
function setup() {
  cnv = createCanvas(w, h);
  cnv.parent("sketch-holder");
  frameRate(framesPerSecond);
  windowResized();
  let initNum = intToBase(
    Math.floor((Date.now() - START_TIME) / framesPerSecond / 1000)
  );
  initializeBlockData(initNum);
}

//Setup a data structure that contains every block as a data object, with its width, height and "state"
function initializeBlockData(initState) {
  let initIndices = initState ? initState : [];
  const initBlock = { w: blockWidth, h: blockHeight };
  let blockIndex = 0;
  for (let i = 0; i < numRow; i++) {
    for (let j = 0; j < numRow; j++) {
      let copiedBlock = {};
      Object.assign(copiedBlock, initBlock);
      copiedBlock["x"] = j * blockWidth;
      copiedBlock["y"] = i * blockHeight;
      copiedBlock.index = initIndices[blockIndex] ? initIndices[blockIndex] : 0;
      blocks.push(copiedBlock);
      blockIndex++;
    }
  }
}

//Draw each block and enumerate the next state
function draw() {
  background(50);
  noStroke();
  drawBlockData();

  if (!done) {
    enumerateBlockData();
  }
}

//Just draw each block based on the state within blocks
function drawBlockData() {
  blocks.forEach((block) => {
    push();
    fillColor(block.index);
    rect(block.x, block.y, block.w, block.h);
    pop();
  });
}

// Replace with different function if you need more colors.
// Make sure to edit MAX_INDEX to reflect correct number of colors
function fillColor(index) {
  switch (index) {
    case 0:
      fill(255);
      break;
    case 1:
      fill(0);
      break;
    default:
      noFill();
  }
}

// Treat INDEX of each block as digit in a base N number
// where N is the number of colors per block
function enumerateBlockData() {
  let cursor = 0;

  while (true) {
    // Reached the end. Need to undo the last step.
    if (cursor >= blocks.length) {
      blocks.forEach((aBlock) => (aBlock.index = MAX_INDEX));
      done = true;
      break;
    }

    let value = blocks[cursor].index;

    if (value < MAX_INDEX) {
      blocks[cursor].index++;
      break;
    } else {
      // Carry over
      blocks[cursor].index = 0;
      cursor++;
    }
  }
}

//Helper functions

//Convert int to arbitary bin
function intToBase(i) {
  let indices = [];
  while (i > 0) {
    indices.push(i % BASE);
    i = Math.floor(i / BASE);
  }
  return indices;
}

//resize function, by @pitaru
function windowResized() {
  //zoomBy = (windowWidth / windowHeight + w/h < windowHeight / windowWidth) ? windowWidth / w : windowHeight / h;
  zoomBy = windowWidth > windowHeight ? windowHeight / h : windowWidth / w;
  cnv.style("zoom", zoomBy);
  xOffset = document.getElementById("sketch-holder").offsetLeft;
  yOffset = document.getElementById("sketch-holder").offsetTop;
}
