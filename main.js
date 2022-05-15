import './style.css'
import 'normalize.css/normalize.css'
ymaps.ready(init);


function init() {
  var coords = [37.6209, 55.7386];
  var profile = "foot";
  var isTree = true;
  var timeDistance = 10;
  var algorithm = 'GRAHAM';
  var smoothingFactor = 1;


  var myMap = new ymaps.Map("map", {
    center: [37.6209, 55.7386],
    zoom: 12
  });

  myMap.events.add('click', function onClick(e) {
    coords = e.get('coords');
    getAndDraw()

  });

  document.getElementById('flexRadioFoot').onchange = function () {
    profile = "foot"
    getAndDraw()

  };

  document.getElementById('flexRadioFoot').onchange = function () {
    profile = "car"
    getAndDraw()

  };

  document.getElementById('flexRadioFoot').onchange = function () {
    profile = "bike"
    getAndDraw()
  };

  document.getElementById('clearMap').addEventListener("click", () => {
    myMap.geoObjects.removeAll();
  })

  document.getElementById('isochrone').onchange = function () {
    isTree = false;
    document.getElementById('algorithm1').disabled = false;
    if(algorithm != "GRAHAM") {
      document.getElementById('customRange').disabled = false;
    }
    getAndDraw()
  };

  document.getElementById('tree').onchange = function () {
    isTree = true;
    document.getElementById('algorithm1').disabled = true;
    document.getElementById('customRange').disabled = true;
    getAndDraw()
  };

  document.getElementById('travelTime').onchange = function (x) {
    timeDistance = x.target.value;
    getAndDraw()
  };

  document.getElementById('algorithm1').onchange = function (x) {
    algorithm = x.target.value;
    if(algorithm == "GRAHAM") {
      document.getElementById('customRange').disabled = true;
    } else {
      document.getElementById('customRange').disabled = false;
    }
    getAndDraw()
  };

  document.getElementById('customRange').onchange = function (x) {
    smoothingFactor = x.target.value;
    getAndDraw()
  };

  function getAndDraw() {
    fetch(`/iso?profile=${profile}&lat=${coords[1].toPrecision(6)}&lon=${coords[0].toPrecision(6)}&time=${timeDistance * 60}&tree=${isTree}&algorithmType=${algorithm}&smoothingFactor=${smoothingFactor}`)
      .then(result => {
        return response.json();
      })
      .then(result => {
        var figure = new ymaps.Polygon(result.coordinates, {}, {
          strokeWidth: 2
        })

        var point = new ymaps.Placemark([
          coords[0].toPrecision(6),
          coords[1].toPrecision(6)
        ], {
          present: 'island#circleIcon',
          iconColor: '#3caa3c'
        })
        myMap.geoObjects.removeAll();
        myMap.geoObjects.add(point);
        myMap.geoObjects.add(figure);
      });
  }
}