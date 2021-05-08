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
  const initBlock = {w: blockWidth, h: blockHeight, state: 0};
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
    let blockColor = 255 * block.state;
    fill(blockColor);
    rect(block.x, block.y, block.w, block.h);
    pop();
  })
}


//Update the state for each block (called every frame for now)
//@THIS ALGORITHM SUCKS AND IS BROKEN -  WE NEED TO IMPROVE IT.
//IDEALLY IT CAN GO FROM SOME BIGINT -> STATE FOR EACH BLOCK.
let primaryBlockIndex = 0, secondaryBlockIndex = 1;
let totalStates = 2;
function enumerateBlockData() {
  

  let primaryBlock = blocks[primaryBlockIndex];
  let secondaryBlock = blocks[secondaryBlockIndex];
  if (primaryBlock.currentState >= totalStates) {
    //Move to next primary block if ive explored all my states
    primaryBlock.state = 0;
    primaryBlockIndex++;
  } else if (secondaryBlockIndex == blocks.length - 1) {
    //All secondary blocks have been explored, change primary block state
    secondaryBlock.state = 0;
    secondaryBlockIndex = primaryBlockIndex == 0 ? 1 : 0;
    primaryBlock.state += 1;
  } else if (secondaryBlock.state >= totalStates) {
    //Explored all states for secondary block, move on, skipping primary block
    secondaryBlock.state = 0;
    secondaryBlockIndex++;
    if (secondaryBlockIndex == primaryBlockIndex) {secondaryBlockIndex++};
  } else {
    //Otherwise flip the secondary block
    secondaryBlock.state += 1;
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