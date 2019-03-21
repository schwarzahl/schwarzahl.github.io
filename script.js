var click_points = [];
var line_x2ys = {};
var target_x2ys = {};

var container = document.getElementById('container');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
canvas.width = container.clientWidth;
canvas.height = container.clientHeight;

function drawLine(x1, y1, x2, y2) {
  context.strokeStyle = 'rgb(0, 0, 0)'
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke(); 
}
function update_target() {
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
    target_x2ys[x] = y;
  }
  reflesh(30);
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

  update_target();
}, false);

function reflesh(rest_frame) {
  if (rest_frame <= 0) {
    return;
  }

  context.fillStyle = 'rgb(255, 255, 255)'
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (line_x2ys[0]) {
    line_x2ys[0] = (line_x2ys[0] * 4 + target_x2ys[0]) / 5;
  } else {
    line_x2ys[0] = target_x2ys[0];
  }
  for (var x = 1; x < canvas.width; x++) {
    if (line_x2ys[x]) {
      line_x2ys[x] = (line_x2ys[x] * 4 + target_x2ys[x]) / 5;
    } else {
      line_x2ys[x] = target_x2ys[x];
    }
    if (line_x2ys[x - 1] && line_x2ys[x]) {
      drawLine(x - 1, line_x2ys[x - 1], x, line_x2ys[x]);
    }
  }

  for (var idx in click_points) {
    var point = click_points[idx];
    context.beginPath();
    context.arc(point.x, point.y, 10, 0 * Math.PI / 180, 360 * Math.PI / 180, false );
    context.strokeStyle = 'rgb(0, 0, 255)';
    context.stroke();
  }
  setTimeout(function() {
    reflesh(rest_frame - 1)
  }, 16);
}