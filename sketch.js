//key from mapbox account
const key = 'pk.eyJ1IjoiYWFyamF2YyIsImEiOiJjazBwbGkzd2swNnRvM2xxbGUyd3J5d3p3In0.g-pcOPmMcYV48Bnx99NODA'

//map options created online on mapbox
const options = {
  lat: 28.6,
  lng: 77.200000,
  zoom: 6,
  studio: true,
  style: 'mapbox://styles/aarjavc/ck3eqwmky34511cmlx997i4rg',
};

// Create an instance of Mapbox
const mappa = new Mappa('Mapbox', key);
let myMap;
let canvas;

//array storing pixel locations of viewable capitals
let capitalArray = [];
let countriesDisplayed = []

function preload() {
  data = loadJSON('country_capitals.json')
  fullData = loadJSON('data.json')
}

function setup() {
  canvas = createCanvas(700, 700);

  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  myMap.onChange(mapCapitals);
}

function draw() {
  clear()
  drawCircles()
}

function drawCircles(){

  let yearMap = Math.ceil(map(mouseX, 0, width, 0, 40))
  if(yearMap > 39)
  {
    yearMap = 39
  }
  push()
  fill(0, 0, 0)
  textAlign(CENTER)
  textSize(32)
  text(1980+yearMap, mouseX, mouseY-10)
  pop()

  drawText()

  displayLegend()

  push()
  noStroke()
  for (var i = 0; i < capitalArray.length; i++) {
    var latitude = capitalArray[i][0];
    var longitude = capitalArray[i][1];
    var radius = capitalArray[i][2][yearMap]/500;

    var lowColor = color(0, 142, 204, 125)
    var highColor = color(194,24,7, 125)

    var lowValue = 2000
    var highValue = 82000

    let mapColor = map(capitalArray[i][2][yearMap], lowValue, highValue, 0, 1)

    let displayColor = lerpColor(lowColor, highColor, mapColor)

    fill(displayColor)
    circle(latitude, longitude, radius)
  }
  pop()
}

//read JSON file
//get the latitudes and longitudes of the capitals
//convert and map them to pixels on the canvas
//store them in the capitalArray
function mapCapitals(){

  capitalArray.length = 0;

  for (var i = 0; i < 240; i++) {
    const latitude = Number(data[i].CapitalLatitude);
    const longitude = Number(data[i].CapitalLongitude);

    var yearArray = []

    for (var j = 1980; j <= 2019; j++) {
      if(data[i].hasOwnProperty(""+j+"")){
        yearArray.push(parseFloat(trim(data[i][""+j+""]).replace(/,/g, '')))
      }
      else {
        yearArray.push(0)
      }
    }

    if (myMap.map.getBounds().contains([latitude, longitude])) {
      const position = myMap.latLngToPixel(latitude, longitude);
      capitalArray.push([position.x, position.y, yearArray]);
    }
  }
}

function drawText(){
  push()
    fill(0, 0, 0)
    textSize(32)
    textAlign(CENTER)
    text('Remittance Inflow', width/2, height/10)
  pop()
}

function displayLegend(){
  push()
    noStroke()
    var startColor = color(0, 142, 204, 125)
    var endColor = color(194,24,7, 125)
    setGradient(width/5, height-height/10, 3*width/5, height/40, startColor, endColor, "X")
  pop()
}

//p5js example function to create gradients with colors over a length or height
function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();  if (axis == "Y") {  // Top to bottom gradient
    for (let i = y; i <= y+h; i++) {
      var inter = map(i, y, y+h, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x+w, i);
    }
  }
  else if (axis == "X") {  // Left to right gradient
    for (let j = x; j <= x+w; j++) {
      var inter2 = map(j, x, x+w, 0, 1);
      var d = lerpColor(c1, c2, inter2);
      stroke(d);
      line(j, y, j, y+h);
    }
  }
}
