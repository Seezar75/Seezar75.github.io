window.onload= function() {
	canvas = document.getElementById("myCanvas");
	//canvas.width  = 800; // in pixels
	//canvas.height = 600; // in pixels
	ctx = canvas.getContext("2d");
	mousePos = { x: canvas.width/2, y: canvas.height/2};
	//document.addEventListener("keydown", keyDownHandler, false);
	//document.addEventListener("keyup", keyUpHandler, false);
	canvas.addEventListener('mousemove', mouseMoveHandler, false);
	canvas.addEventListener('mousedown', mouseDownHandler, false);
	canvas.addEventListener('mouseup', mouseUpHandler, false);
	setInterval(loop, 20);
	setup();
}

let n = 3;
let r1 = 11;
let r2 = 11;
let r3 = 15;
let d1 = 30;
let d2 = 40;
let t = 4;

let r4 = 0;
let d12 = 0;
let a1 = 0;
let b1 = 0;
let rBody = 0;
let alfa2 = 0;

let mousePos;
let locked = false;
let deltaAngle = 0.0;
let startAngle = 0.0;
let rotSpeed = 0.4;

let svg;


function setup() {
	ctx.translate(canvas.width/2,canvas.height/2);
	ctx.scale(2,2);
}

function loop() {
	ctx.fillStyle="grey";
	ctx.fillRect(-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);
	calculate();
	drawSpinner();
}

function calculate() {
	r3 = r2 + t;
	
	if (!locked) {
		if ((rotSpeed > 0.01) || (rotSpeed < -0.01)) {
			rotSpeed *= 0.99;
		}
	}
  
	r4 = Math.sqrt(Math.pow(d2*Math.sin(Math.PI/n),2) + Math.pow(d2*Math.cos(Math.PI/n)-d1,2) ) - r3;
	d12 = r4+r3;
	a1 = d2*Math.sin((0.5)*(Math.PI*2)/n) * r3 / d12;
	b1 = (d2*Math.cos((Math.PI*2)/n*(0.5))-d1) * r3 / d12;
	rBody = Math.sqrt(Math.pow(a1,2)+Math.pow((d1)+b1), 2);
	alfa2 = Math.atan(d1*Math.sin(Math.PI/n)/(d1*Math.cos(Math.PI/n)-d2));
	if (alfa2 < 0) {
		alfa2 = alfa2 + Math.PI;
	}
}

function drawSpinner() {
	ctx.rotate(rotSpeed);
	ctx.beginPath();
	ctx.arc(0, 0, r1, 0, 2*Math.PI);
	ctx.strokeStyle = "rgb(0, 0, 0)"; 
	ctx.stroke();
	ctx.closePath();
	
	let alfa = Math.atan(d2*Math.sin(Math.PI/n)/(d2*Math.cos(Math.PI/n)-d1));
	if (alfa < 0) {
		alfa = alfa + Math.PI;
	}
	
	for (var i = 0; i < n; i++) {
		var xc1 = d1*Math.cos(i*2*Math.PI/n);
		var yc1 = d1*Math.sin(i*2*Math.PI/n);
		ctx.beginPath();
		ctx.arc(xc1, yc1, r2, 0, 2*Math.PI);
		ctx.stroke();
		
		ctx.beginPath();
		ctx.arc(xc1, yc1, r3, -alfa+(i*2*Math.PI/n), alfa+(i*2*Math.PI/n));
		ctx.stroke();
    
		var xc2 = d2*Math.cos((i+0.5)*2*Math.PI/n);
		var yc2 = d2*Math.sin((i+0.5)*2*Math.PI/n);
		
		ctx.beginPath();
		ctx.arc(xc2, yc2, r4, alfa2+((i+0.5)*2*Math.PI/n), -alfa2+((i+0.5)*2*Math.PI/n)+(2*Math.PI));
		ctx.stroke();
	}
}

function exportSVG() {
  
  svg = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n";
  svg = svg + "<svg xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" width=\"210mm\" height=\"297mm\" viewBox=\"0 0 210 297\" >\n";
  svg = svg + "\t<defs>\n\t\t<style type=\"text/css\">\n\t\t\tellipse { fill:rgb(255,255,255); stroke:rgb(0,0,0); stroke-width:0.15; fill-opacity:0; } \n\t\t</style>\n\t</defs>\n";  
  svg = svg + "\t<g id=\"Spinner\" transform=\"translate(105,148)\">\n";
  
  drawCross(0,0);
  
  svg = svg + "\t\t<ellipse cx=\"0\" cy=\"0\" rx=\"" + r1 + "\" ry=\"" + r1 + "\"/>\n";
  
  var flag = 0;
  if (b1<0) {
    flag = 1;
  }
  
  var alfa3 = Math.atan(a1/(d1+b1));
  if (alfa3 < 0) {
    alfa3 = alfa3 + Math.PI;
  }
  
  var flag2 = 0;
  if (alfa2*2<Math.PI) {
    flag2 = 1;
  }

   for (var i = 0; i < n; i++) {
     var xc1 = d1*Math.cos(i*2*Math.PI/n);
     var yc1 = d1*Math.sin(i*2*Math.PI/n);
     svg = svg + "\t\t<ellipse cx=\"" + xc1 + "\" cy=\"" + yc1 + "\" rx=\"" + r2 + "\" ry=\"" + r2 + "\"/>\n";
     drawCross(xc1, yc1);
   }
  
  var x1 = rBody*Math.cos(-alfa3);
  var y1 = rBody*Math.sin(-alfa3);
  
  svg = svg + "\t\t<path d=\"M" + x1 + "," + y1 + " ";
  
  for (var i = 0; i < n; i++) {

    var x2 = rBody*Math.cos(alfa3+(i*2*Math.PI/n));
    var y2 = rBody*Math.sin(alfa3+(i*2*Math.PI/n));
    var x3 = rBody*Math.cos(-alfa3+((i+1)*2*Math.PI/n));
    var y3 = rBody*Math.sin(-alfa3+((i+1)*2*Math.PI/n));
    
    svg = svg + "\n\t\t\tA " + r3 + " " + r3 + " 0 " + flag + " 1 " + x2 + " " + y2 + " ";
    svg = svg + "\n\t\t\tA " + r4 + " " + r4 + " 0 " + flag2 + " 0 " + x3 + " " + y3 + " ";
    
  }
  
  svg = svg + "\n\t\t\tZ\" ";
  svg = svg + "\n\t\t\tfill=\"none\" stroke=\"black\" stroke-width=\"0.15\"/>\n";
  

  svg = svg + "\t</g>\n";
  svg = svg + "</svg>";

  alert(svg);
  //svgArea.value(svg);
}

function drawCross(x, y) {
  svg = svg + "\t\t<line x1=\"" + (x-3) + "\" y1=\"" + y + "\" x2=\"" + (x+3) + "\" y2=\"" + y + "\" style=\"stroke:rgb(0,0,0);stroke-width:0.15\" />\n";
  svg = svg + "\t\t<line x1=\"" + x + "\" y1=\"" + (y-3) + "\" x2=\"" + x + "\" y2=\"" + (y+3) + "\" style=\"stroke:rgb(0,0,0);stroke-width:0.15\" />\n";
}

function mouseDownHandler(evt) {
	mousePos = getMousePos(canvas, evt);
	locked = true; 
	startAngle = angleCalc(mousePos.x, mousePos.y);
	rotSpeed = 0;
}

function mouseUpHandler(evt) {
	locked = false;
	deltaAngle = 0;
}

function mouseMoveHandler(evt) {
	mousePos = getMousePos(canvas, evt);
	if(mousePos.x > canvas.width || mousePos.y > canvas.height) return;
	if(locked) {
		rotSpeed = angleCalc(mousePos.x, mousePos.y) - startAngle - deltaAngle;
		deltaAngle = angleCalc(mousePos.x, mousePos.y) - startAngle;
	}
}

function getMousePos(canvas, evt) {
	let rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function angleCalc() {
  var angle = Math.atan((mousePos.y-(canvas.height/2))/(mousePos.x-(canvas.width/2)));
  if((mousePos.y-(canvas.height/2))*(mousePos.x-(canvas.width/2)) < 0) {
    angle = Math.PI + angle;
  }
  if((mousePos.y-(canvas.height/2)) < 0) {
    angle = Math.PI + angle;
  }
  return angle;
}