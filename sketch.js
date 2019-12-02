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
  push()
  fill(0, 0, 0)
  textSize(32)
  text(1980+yearMap, mouseX, mouseY-10)
  pop()
  push()
  noStroke()
  for (var i = 0; i < capitalArray.length; i++) {
    var latitude = capitalArray[i][0];
    var longitude = capitalArray[i][1];
    var radius = capitalArray[i][2][yearMap]/500;

    fill(125, 125, 125, 100)
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

    var d1980 = 0
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
