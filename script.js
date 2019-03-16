var click_points = [];

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

function drawLine(x1, y1, x2, y2) {
  context.strokeStyle = 'rgb(0, 0, 0)'
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke(); 
}
canvas.addEventListener('click', function(e) {
  var rect = e.target.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  var exist = false;
  for (var idx in click_points) {
    var point = click_points[idx];
    if (point.x == x) {
      point.y = y;
      exist = true;
    }
  }
  if (!exist) {
    click_points.push({"x":x, "y":y});
  }
  reflesh();
}, false);

function reflesh() {
  context.fillStyle = 'rgb(255, 255, 255)'
  context.fillRect(0, 0, canvas.width, canvas.height);
  var prev_x;
  var prev_y;
  for (var x = 0; x < canvas.width; x++) {
    var y = 0;
    for (var idx in click_points) {
      var point = click_points[idx];
      var tmp = 1.0 * point.y;
      for (var idx2 in click_points) {
        var point2 = click_points[idx2];
        if (point != point2) {
          tmp *= (x - point2.x) / (point.x - point2.x);
        }
      }
      y += tmp;
    }
    if (prev_x && prev_y) {
      drawLine(prev_x, prev_y, x, y);
    }
    prev_x = x;
    prev_y = y;
  }
  for (var idx in click_points) {
    var point = click_points[idx];
    context.beginPath();
    context.arc(point.x, point.y, 10, 0 * Math.PI / 180, 360 * Math.PI / 180, false );
    context.strokeStyle = 'rgb(0, 0, 255)';
    context.stroke();
  }
}