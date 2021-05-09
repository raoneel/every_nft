let cnv;
let zoomBy = 1;
let xOffset = 0;
let yOffset = 0;
let mx = 0;
let my = 0;

let w = 500;
let h = w;
let numRow = 5;
let numBlocks = numRow * numRow;
let blockWidth= w / numRow;
let blockHeight = h / numRow;
let blocks =[];

let framesPerSecond = 10;

//P5 Setup function
function setup() {
  cnv = createCanvas(w, h);
  cnv.parent('sketch-holder');
  frameRate(framesPerSecond);    
  windowResized();
  initializeBlockData();
}
//Setup a data structure that contains every block as a data object, with its width, height and "state"
function initializeBlockData() {
  const initBlock = {w: blockWidth, h: blockHeight, index: 0};
  for(let i=0; i< numRow; i++) {
    for(let j=0; j<numRow;j ++){
      let copiedBlock = {}
      Object.assign(copiedBlock, initBlock);
      copiedBlock["x"] = j * blockWidth;
      copiedBlock["y"] = i * blockHeight;
      blocks.push(copiedBlock);
    }
  }
  console.log(blocks);
}

//Draw each block and enumerate the next state
function draw() {
  background(50);
  ellipse(50,50,50,50);
  noStroke();
  drawBlockData();
  enumerateBlockData();
}

//Just draw each block based on the state within blocks
function drawBlockData() {
  blocks.forEach((block) => {
    push();
    blackWhiteColorGenerator(block.index);
    rect(block.x, block.y, block.w, block.h);
    pop();
  })
}

// Replace with different function if you need more colors.
// Make sure to edit MAX_INDEX to reflect correct number of colors
function blackWhiteColorGenerator(index) {
  if (index === 0) {
    fill(0)
  } else {
    fill(255);
  }
}

// Treat each block as digit in a base N number
// where N is the number of colors per block
const MAX_INDEX = 1;
function enumerateBlockData() {
  let cursor = 0;

  while (true) {
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


//resize function, by @pitaru
function windowResized() {
  //zoomBy = (windowWidth / windowHeight + w/h < windowHeight / windowWidth) ? windowWidth / w : windowHeight / h;
  zoomBy = windowWidth > windowHeight ? windowHeight / h : windowWidth / w;
  cnv.style("zoom", zoomBy);
  xOffset = document.getElementById("sketch-holder").offsetLeft;
  yOffset = document.getElementById("sketch-holder").offsetTop;
}