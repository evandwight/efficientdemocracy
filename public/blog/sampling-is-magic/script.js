var redPersonImg = null;
var bluePersonImg = null;
var imagesLoaded = 0;

var percentBlue = 50;

function sample() {
  var n = parseInt(document.getElementById("sample-size").value);
  var population = Array(10000);
  for (var i = 0; i < 10000; i ++) {
    population[i] = i > 100*percentBlue ? "red" : "blue";
  }
  var persons = [];
  for (var i = 0; i < n; i++) {
    var selectI = Math.floor(Math.random() * population.length);
    persons.push(population[selectI]);
    population.splice(selectI, 1);
  }
  return persons;
}

function calcBluePercent(persons) {
  var blueCount = persons.filter(function(v) { return v == "blue"}).length;
  return Math.round(blueCount*100/persons.length);
}

function runOne(event) {
  var persons = sample();

  drawSampleCanvas(persons);

  var sampleBluePercent = calcBluePercent(persons);
  document.getElementById("run-one-result").style.display = "block";
  document.getElementById("sample-percent").innerText = sampleBluePercent;
  document.getElementById("sample-percent-difference").innerText = Math.abs(percentBlue - sampleBluePercent);
}

function drawSampleCanvas(persons) {
  var canvas = document.getElementById('sample-canvas');
  canvas.height = Math.ceil((persons.length+1)/100)*5;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 500, 500);
  for (var i = 0; i < persons.length; i++) {
    var x = i % 95;
    var y = (i - x)/95;
    ctx.drawImage(persons[i] == "blue" ? bluePersonImg : redPersonImg, x*5, y*5);
  }
}

function runSamplesRecursive(i) {
  return new Promise(function (resolve, reject) {
    var samples = [];
    for (var j = 0; j < 100; j++) {
      samples.push(calcBluePercent(sample()));
    }
    i = i - 100;
    document.getElementById("run-it-a-bunch-tries").textContent = 10000 - i;
    console.log("set to " + (10000- i))
    if (i <= 0) {
      resolve(samples);
    } else {
      setTimeout(function() {
        runSamplesRecursive(i).then(function (nextSamples) {
          resolve(samples.concat(nextSamples));
        }); 
      }, 1);
    }
  });
}
  
function runItABunch(event) {
  var samples = []
  // for (var i = 0; i < 10000; i++) {
  //   samples.push(calcBluePercent(sample()));
  // }
  document.getElementById("run-it-a-bunch-result").style.display = "block";
  runSamplesRecursive(10000).then(function(samples) {
    console.log("done");
    var overPercent = samples.filter(function(v) { return Math.abs(percentBlue - v) > 10}).length/100;
    var element = document.getElementById("sample-big-difference-percent");
    element.innerText = (100 - overPercent) + "%";
    element.style.fontWeight = "bold";
    var color = element.style.color;
    element.style.color = "red";
    setTimeout(function () { 
      element.style.fontWeight = "normal";
      element.style.color = color;
    }, 1000);
  });
}

function setPercentBlue(event) {
  console.log("setPercentBlue");
  percentBlue = parseInt(document.getElementById('people-percent-blue').value);
  maybeDrawPeopleCanvas();
}

function loadAnImage() {
  imagesLoaded += 1;
  maybeDrawPeopleCanvas();
}
function maybeDrawPeopleCanvas() {
  if (imagesLoaded < 2) {
    redPersonImg = document.getElementById('red-person-img');
    redPersonImg.onload = loadAnImage;
    bluePersonImg = document.getElementById('blue-person-img');
    bluePersonImg.onload = loadAnImage;
  } else {
    drawPeopleCanvas();
  }
}

function drawPeopleCanvas() {
  var canvas = document.getElementById('people-canvas');
  const ctx = canvas.getContext('2d');
  for (var y = 0; y < 100; y++) {
    for (var x = 0; x < 100; x++) {
      var i = y * 100 + x;
      var person = i> 100*percentBlue ? redPersonImg : bluePersonImg;
      ctx.drawImage(person, x*5, y*5);
    }
  }
}

function initialize() {
  console.log("initialize");
  maybeDrawPeopleCanvas();
}
  
// Attach listeners
document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM ContentLoaded");
  document.getElementById('run-one').addEventListener('click', runOne);
  document.getElementById('run-it-a-bunch').addEventListener('click', runItABunch);
  document.getElementById('people-percent-blue').addEventListener('input', setPercentBlue);
  initialize();
});