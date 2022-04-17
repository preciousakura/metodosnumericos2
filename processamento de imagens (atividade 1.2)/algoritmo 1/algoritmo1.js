let img;

let sobelXKernel = [[-1 , 0 , 1], [-2, 0, 2], [-1, 0, 1]]
let sobelYKernel = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]

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
  
  // aplicação do filtro gaussiano na imagem
  for(let x = 0; x < result.length; x++) {
    for(let y = 0; y < result[x].length; y++) {
      set(x, y, result[x][y])
    }
  }
  
  let resultXSobel = []
  // derivada sobel no eixo X
  for(let x = 0; x < img.width; x++) {
    let l = []
    for(let y = 0; y < img.height; y++) {
      l.push(applyConvulation(sobelXKernel, x, y))
    }
    resultXSobel.push(l)
  } 
  
  let resultYSobel = []
  // derivada sobel no eixo Y
  for(let x = 0; x < img.width; x++) {
    let l = []
    for(let y = 0; y < img.height; y++) {
      l.push(applyConvulation(sobelYKernel, x, y))
    }
    resultYSobel.push(l)
  } 
  
  // elevar ao quadrado e tirar a raiz
  for(let x = 0; x < img.width; x++) {
    for(let y = 0; y < img.height; y++) {
      let valueX = resultXSobel[x][y] * resultXSobel[x][y]
      let valueY = resultYSobel[x][y] * resultYSobel[x][y]
      result[x][y] = sqrt(valueX + valueY)
    }
  }
  
  // aplicação do treshold
  for(let x = 0; x < img.width; x++) {
    for(let y = 0; y < img.height; y++) {
      let px = result[x][y];
      result[x][y] = px < 150 ? 0 : 255
    }
  }
  
  
  // atualização dos pixels na imagem
  for(let x = 0; x < img.width; x++) {
    for(let y = 0; y < img.height; y++) {
      set(x, y, result[x][y])
    }
  }
  
  updatePixels()
}