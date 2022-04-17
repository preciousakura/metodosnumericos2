let laplaceKernel = [[0, 1, 0], [1, -4, 1], [0, 1, 0]]

let gaussKernel = [[1/16, 2/16, 1/16], [2/16, 4/16, 2/16],[1/16, 2/16, 1/16]]

function preload() {
  img = loadImage("emma.jpg");
}

function setup() {
  createCanvas(img.width + 2, img.height + 2)
  noLoop();
}

function applyConvulation(kernel, x, y) {
  let startX = x - 1;
  let starY = y - 1;
  
  let result = 0 
  
  let k = 0, l = 0;
  for(let i = startX; i < (kernel.length + startX); i++) {
    l = 0;
    for(let j = starY; j < (kernel.length + starY); j++) {
      let pixels = get(i, j)
      result += kernel[k][l] * pixels[0]
      l += 1
    }
    k += 1
  }
  return result
}

function draw() {
  background(0)
  
  image(img, 1, 1)
  loadPixels()

  let result = []

  // filtro de suavização gaussiana
  for(let x = 0; x < img.width; x++) {
    let l = []
    for(let y = 0; y < img.height; y++) {
      l.push(applyConvulation(gaussKernel, x, y))
    }
    result.push(l)
  } 
  
  for(let x = 0; x < img.width; x++) {
    for(let y = 0; y < img.height; y++) {
      set(x, y, result[x][y])
    }
  }
  
  result = []
  
  // filtro de laplace
  for(let x = 0; x < img.width; x++) {
    let l = []
    for(let y = 0; y < img.height; y++) {
      l.push(applyConvulation(laplaceKernel, x, y))
    }
    result.push(l)
  } 
  
  // 0 = preto
  // 255 = branco
  
  // aplicação do treshold
  for(let x = 0; x < img.width; x++) {
    for(let y = 0; y < img.height; y++) {
      let px = result[x][y];
      result[x][y] = px < 0 ? 0 : px // alguns pixel são negativos
      result[x][y] = px < 15 ? 0 : 255
    }
  }
  
  for(let x = 0; x < img.width; x++) {
    for(let y = 0; y < img.height; y++) {
      set(x, y, result[x][y])
    }
  }
  
  updatePixels()
}