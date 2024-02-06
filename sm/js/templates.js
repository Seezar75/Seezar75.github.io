
// transform the template coordinates to scale and rotate it (fixes cell density and orientation
function templateTarnsform(scale, rot) {
	templateRels = jsonCopy(templateRels);
	for (let t of templateRels) {
		for (let e of t) {
			let xTemp = e.dx;
			e.dx = scale * (Math.cos(rot) * e.dx - Math.sin(rot) * e.dy);
			e.dy = scale * (Math.sin(rot) * xTemp + Math.cos(rot) * e.dy);
			if (e.props) {
				e.props.rot += rot;
				if (e.props.scale) e.props.scale *= scale;
			}
		}
	}
	xTemp = offsX;
	offsX = scale * (Math.cos(rot) * offsX - Math.sin(rot) * offsY);
	offsY = scale * (Math.sin(rot) * xTemp + Math.cos(rot) * offsY);
}

function setSquare() {
  // push one type of cell into the template of relationchips
	templateRels.push([]);
  // add all the related cells for this type of cell
	templateRels[0].push({dx:1,dy:0,t:0,shape:1,ref:null});
	templateRels[0].push({dx:0,dy:1,t:0,shape:1,ref:null});
	templateRels[0].push({dx:-1,dy:0,t:0,shape:1,ref:null});
	templateRels[0].push({dx:0,dy:-1,t:0,shape:1,ref:null});
	templateRels[0].push({dx:1,dy:1,t:0,shape:1,ref:null});
	templateRels[0].push({dx:-1,dy:1,t:0,shape:1,ref:null});
	templateRels[0].push({dx:-1,dy:-1,t:0,shape:1,ref:null});
	templateRels[0].push({dx:1,dy:-1,t:0,shape:1,ref:null});
}

function setBiSquare() {
  // push two types of cell into the template of relationchips
	templateRels.push([]);
	templateRels.push([]);

  // set the properties of each shape
	let props0 = {scale:2,sides:4,rot:Math.PI/4};
	let props1 = {scale:1,sides:4,rot:Math.PI/4};
	
	let sq2 = Math.sqrt(2);
	// add all the related cells for the first type of cell
	templateRels[0].push({dx:1.5/sq2,dy:0.5/sq2,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:1/sq2,dy:2/sq2,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:-0.5/sq2,dy:1.5/sq2,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-2/sq2,dy:1/sq2,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:-1.5/sq2,dy:-0.5/sq2,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-1/sq2,dy:-2/sq2,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:0.5/sq2,dy:-1.5/sq2,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:2/sq2,dy:-1/sq2,t:0,shape:3,props:props0,ref:null});
	
	// add all the related cells for the second type of cell
	templateRels[1].push({dx:1.5/sq2,dy:0.5/sq2,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-0.5/sq2,dy:1.5/sq2,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-1.5/sq2,dy:-0.5/sq2,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:0.5/sq2,dy:-1.5/sq2,t:0,shape:3,props:props0,ref:null});
	
  // transform the template to adapt to the density and orientation by scaling and rotating
	templateTarnsform(0.9034, 0);
}

function setCubes() {
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);
	let pts = [];
	let c30 = Math.cos(Math.PI/6);
	let c3030 = c30*c30;
	pts.push({x:c30,y:0});
	pts.push({x:0,y:0.5});
	pts.push({x:-1*c30,y:0});
	pts.push({x:0,y:-0.5});
	let props0 = {scale:1,rot:0,points:pts};
	let props1 = {scale:1,rot:Math.PI/3,points:pts};
	let props2 = {scale:1,rot:-Math.PI/3,points:pts};
	templateRels[0].push({dx:2*c30,dy:0,t:0,shape:5,props:props0,ref:null});	
	templateRels[0].push({dx:1.5*c30,dy:c3030,t:1,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:0.5*c30,dy:c3030,t:2,shape:5,props:props2,ref:null});
	templateRels[0].push({dx:-0.5*c30,dy:c3030,t:1,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:-1.5*c30,dy:c3030,t:2,shape:5,props:props2,ref:null});
	templateRels[0].push({dx:-2*c30,dy:0,t:0,shape:5,props:props0,ref:null});
	templateRels[0].push({dx:-1.5*c30,dy:-1*c3030,t:1,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:-0.5*c30,dy:-1*c3030,t:2,shape:5,props:props2,ref:null});
	templateRels[0].push({dx:0.5*c30,dy:-1*c3030,t:1,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:1.5*c30,dy:-1*c3030,t:2,shape:5,props:props2,ref:null});
	
	templateRels[1].push({dx:c30,dy:0,t:2,shape:5,props:props2,ref:null});
	templateRels[1].push({dx:1.5*c30,dy:c3030,t:0,shape:5,props:props0,ref:null});
	templateRels[1].push({dx:c30,dy:2*c3030,t:1,shape:5,props:props1,ref:null});
	templateRels[1].push({dx:0,dy:2*c3030,t:2,shape:5,props:props2,ref:null});
	templateRels[1].push({dx:-0.5*c30,dy:c3030,t:0,shape:5,props:props0,ref:null});
	templateRels[1].push({dx:-1*c30,dy:0,t:2,shape:5,props:props2,ref:null});
	templateRels[1].push({dx:-1.5*c30,dy:-1*c3030,t:0,shape:5,props:props0,ref:null});
	templateRels[1].push({dx:-1*c30,dy:-2*c3030,t:1,shape:5,props:props1,ref:null});
	templateRels[1].push({dx:0,dy:-2*c3030,t:2,shape:5,props:props2,ref:null});
	templateRels[1].push({dx:0.5*c30,dy:-1*c3030,t:0,shape:5,props:props0,ref:null});
	
	templateRels[2].push({dx:-1*c30,dy:0,t:1,shape:5,props:props1,ref:null});
	templateRels[2].push({dx:-1.5*c30,dy:c3030,t:0,shape:5,props:props0,ref:null});
	templateRels[2].push({dx:-1*c30,dy:2*c3030,t:2,shape:5,props:props2,ref:null});
	templateRels[2].push({dx:0,dy:2*c3030,t:1,shape:5,props:props1,ref:null});
	templateRels[2].push({dx:0.5*c30,dy:c3030,t:0,shape:5,props:props0,ref:null});
	templateRels[2].push({dx:c30,dy:0,t:1,shape:5,props:props1,ref:null});
	templateRels[2].push({dx:1.5*c30,dy:-1*c3030,t:0,shape:5,props:props0,ref:null});
	templateRels[2].push({dx:c30,dy:-2*c3030,t:2,shape:5,props:props2,ref:null});
	templateRels[2].push({dx:0,dy:-2*c3030,t:1,shape:5,props:props1,ref:null});
	templateRels[2].push({dx:-0.5*c30,dy:-1*c3030,t:0,shape:5,props:props0,ref:null});
	
	templateTarnsform(1.06796, 0);

}

function setArrow() {
	offsX = 0.375;
	offsY = 0.375;
	templateRels.push([]);
	templateRels.push([]);
	let pts = [];
	pts.push({x:0.75,y:0});
	pts.push({x:0,y:0.75});
	pts.push({x:0,y:0.375});
	pts.push({x:-0.75,y:0.375});
	pts.push({x:-0.75,y:-0.375});
	pts.push({x:0,y:-0.375});
	pts.push({x:0,y:-0.75});
	let props0 = {scale:1,rot:0,points:pts};
	let props1 = {scale:1,rot:Math.PI,points:pts};
	templateRels[0].push({dx:1.5,dy:0,t:0,shape:5,props:props0,ref:null});
	templateRels[0].push({dx:0.75,dy:0.75,t:1,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:0,dy:1.5,t:0,shape:5,props:props0,ref:null});
	templateRels[0].push({dx:-0.75,dy:0.75,t:1,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:-1.5,dy:0,t:0,shape:5,props:props0,ref:null});
	templateRels[0].push({dx:-0.75,dy:-0.75,t:1,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:0,dy:-1.5,t:0,shape:5,props:props0,ref:null});
	templateRels[0].push({dx:0.75,dy:-0.75,t:1,shape:5,props:props1,ref:null});
	
	templateRels[1].push({dx:1.5,dy:0,t:1,shape:5,props:props1,ref:null});
	templateRels[1].push({dx:0.75,dy:0.75,t:0,shape:5,props:props0,ref:null});
	templateRels[1].push({dx:0,dy:1.5,t:1,shape:5,props:props1,ref:null});
	templateRels[1].push({dx:-0.75,dy:0.75,t:0,shape:5,props:props0,ref:null});
	templateRels[1].push({dx:-1.5,dy:0,t:1,shape:5,props:props1,ref:null});
	templateRels[1].push({dx:-0.75,dy:-0.75,t:0,shape:5,props:props0,ref:null});
	templateRels[1].push({dx:0,dy:-1.5,t:1,shape:5,props:props1,ref:null});
	templateRels[1].push({dx:0.75,dy:-0.75,t:0,shape:5,props:props0,ref:null});
	
	templateTarnsform(0.92415, 0);
}

function setTriHex() {
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);

	let props0 = {scale:2,sides:6,rot:0};
	let props1 = {scale:1.15,sides:3,rot:-Math.PI/6};
	let props2 = {scale:1.15,sides:3,rot:Math.PI/6};

	let d2 = 1/(2*Math.cos(Math.PI/6));

	templateRels[0].push({dx:2,dy:0,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:1,dy:d2,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:1,dy:3*d2,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:0,dy:2*d2,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-1,dy:3*d2,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:-1,dy:d2,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:-2,dy:0,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:-1,dy:-d2,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-1,dy:-3*d2,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:0,dy:-2*d2,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:1,dy:-3*d2,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:1,dy:-d2,t:1,shape:3,props:props1,ref:null});

	templateRels[1].push({dx:1,dy:d2,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:0,dy:2*d2,t:2,shape:3,props:props2,ref:null});
	templateRels[1].push({dx:-1,dy:d2,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-1,dy:-d2,t:2,shape:3,props:props2,ref:null});
	templateRels[1].push({dx:0,dy:-2*d2,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:1,dy:-d2,t:2,shape:3,props:props2,ref:null});

	templateRels[2].push({dx:1,dy:-d2,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:0,dy:-2*d2,t:1,shape:3,props:props1,ref:null});
	templateRels[2].push({dx:-1,dy:-d2,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:-1,dy:d2,t:1,shape:3,props:props1,ref:null});
	templateRels[2].push({dx:0,dy:2*d2,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:1,dy:d2,t:1,shape:3,props:props1,ref:null});

	templateTarnsform(0.93288277413, 0);
}

function set3464() {
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);

	let props0 = {scale:2,sides:6,rot:0};
	let props1 = {scale:Math.sqrt(2),sides:4,rot:-Math.PI/12};
	let props2 = {scale:Math.sqrt(2),sides:4,rot:Math.PI/4};
	let props3 = {scale:Math.sqrt(2),sides:4,rot:Math.PI/12};
	let props4 = {scale:1.15,sides:3,rot:0};
	let props5 = {scale:1.15,sides:3,rot:-Math.PI/3};

	let d2 = 1/(2*Math.cos(Math.PI/6));
	let d1 = d2/2;

	templateRels[0].push({dx:1+Math.sin(Math.PI/12)/Math.sqrt(2),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-1-Math.sin(Math.PI/12)/Math.sqrt(2),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:3,shape:3,props:props3,ref:null});
	templateRels[0].push({dx:-1-Math.sin(Math.PI/12)/Math.sqrt(2),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:1+Math.sin(Math.PI/12)/Math.sqrt(2),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:3,shape:3,props:props3,ref:null});
	templateRels[0].push({dx:0,dy:0.5+d1+d2,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:0,dy:-0.5-d1-d2,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:1+d2,dy:0,t:5,shape:3,props:props5,ref:null});
	templateRels[0].push({dx:-1-d2,dy:0,t:4,shape:3,props:props4,ref:null});
	templateRels[0].push({dx:0.5+d1,dy:0.5+d1+d2,t:4,shape:3,props:props4,ref:null});
	templateRels[0].push({dx:-0.5-d1,dy:0.5+d1+d2,t:5,shape:3,props:props5,ref:null});
	templateRels[0].push({dx:0.5+d1,dy:-0.5-d1-d2,t:4,shape:3,props:props4,ref:null});
	templateRels[0].push({dx:-0.5-d1,dy:-0.5-d1-d2,t:5,shape:3,props:props5,ref:null});

	templateRels[1].push({dx:1+Math.sin(Math.PI/12)/Math.sqrt(2),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-1-Math.sin(Math.PI/12)/Math.sqrt(2),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:0,dy:2*Math.cos(Math.PI/12)/Math.sqrt(2),t:3,shape:3,props:props3,ref:null});
	templateRels[1].push({dx:0,dy:-2*Math.cos(Math.PI/12)/Math.sqrt(2),t:3,shape:3,props:props3,ref:null});
	templateRels[1].push({dx:-1-Math.sin(Math.PI/12)/Math.sqrt(2),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:2,shape:3,props:props2,ref:null});
	templateRels[1].push({dx:1+Math.sin(Math.PI/12)/Math.sqrt(2),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:2,shape:3,props:props2,ref:null});
	templateRels[1].push({dx:-(0.5+d1)*Math.sin(Math.PI/6),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:4,shape:3,props:props4,ref:null});
	templateRels[1].push({dx:(0.5+d1)*Math.sin(Math.PI/6),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:5,shape:3,props:props5,ref:null});

	templateRels[2].push({dx:0,dy:0.5+d1+d2,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:0,dy:-0.5-d1-d2,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:0.5+d1,dy:0,t:4,shape:3,props:props4,ref:null});
	templateRels[2].push({dx:-0.5-d1,dy:0,t:5,shape:3,props:props5,ref:null});
	templateRels[2].push({dx:1+Math.sin(Math.PI/12)/Math.sqrt(2),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:1,shape:3,props:props1,ref:null});
	templateRels[2].push({dx:-1-Math.sin(Math.PI/12)/Math.sqrt(2),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:1,shape:3,props:props1,ref:null});
	templateRels[2].push({dx:1+Math.sin(Math.PI/12)/Math.sqrt(2),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:3,shape:3,props:props3,ref:null});
	templateRels[2].push({dx:-1-Math.sin(Math.PI/12)/Math.sqrt(2),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:3,shape:3,props:props3,ref:null});


	templateRels[3].push({dx:1+Math.sin(Math.PI/12)/Math.sqrt(2),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:0,shape:3,props:props0,ref:null});
	templateRels[3].push({dx:-1-Math.sin(Math.PI/12)/Math.sqrt(2),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:0,shape:3,props:props0,ref:null});
	templateRels[3].push({dx:0,dy:2*Math.cos(Math.PI/12)/Math.sqrt(2),t:1,shape:3,props:props1,ref:null});
	templateRels[3].push({dx:0,dy:-2*Math.cos(Math.PI/12)/Math.sqrt(2),t:1,shape:3,props:props1,ref:null});
	templateRels[3].push({dx:-1-Math.sin(Math.PI/12)/Math.sqrt(2),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:2,shape:3,props:props2,ref:null});
	templateRels[3].push({dx:1+Math.sin(Math.PI/12)/Math.sqrt(2),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:2,shape:3,props:props2,ref:null});
	templateRels[3].push({dx:-(0.5+d1)*Math.sin(Math.PI/6),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:4,shape:3,props:props4,ref:null});
	templateRels[3].push({dx:(0.5+d1)*Math.sin(Math.PI/6),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:5,shape:3,props:props5,ref:null});

	templateRels[4].push({dx:1+d2,dy:0,t:0,shape:3,props:props0,ref:null});
	templateRels[4].push({dx:-0.5-d1,dy:0.5+d1+d2,t:0,shape:3,props:props0,ref:null});
	templateRels[4].push({dx:-0.5-d1,dy:-0.5-d1-d2,t:0,shape:3,props:props0,ref:null});
	templateRels[4].push({dx:-0.5-d1,dy:0,t:2,shape:3,props:props2,ref:null});
	templateRels[4].push({dx:(0.5+d1)*Math.sin(Math.PI/6),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:1,shape:3,props:props1,ref:null});
	templateRels[4].push({dx:(0.5+d1)*Math.sin(Math.PI/6),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:3,shape:3,props:props3,ref:null});

	templateRels[5].push({dx:-1-d2,dy:0,t:0,shape:3,props:props0,ref:null});
	templateRels[5].push({dx:0.5+d1,dy:0.5+d1+d2,t:0,shape:3,props:props0,ref:null});
	templateRels[5].push({dx:0.5+d1,dy:-0.5-d1-d2,t:0,shape:3,props:props0,ref:null});
	templateRels[5].push({dx:0.5+d1,dy:0,t:2,shape:3,props:props2,ref:null});
	templateRels[5].push({dx:-(0.5+d1)*Math.sin(Math.PI/6),dy:-Math.cos(Math.PI/12)/Math.sqrt(2),t:3,shape:3,props:props3,ref:null});
	templateRels[5].push({dx:-(0.5+d1)*Math.sin(Math.PI/6),dy:Math.cos(Math.PI/12)/Math.sqrt(2),t:1,shape:3,props:props1,ref:null});

	templateTarnsform(0.9698146939, 0);
}

function setTriQuad() {
	templateRels.push([]);
	templateRels.push([]);
	
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);
	//Squares
	let props0 = {scale:2,sides:4,rot:Math.PI/12};
	let props1 = {scale:2,sides:4,rot:-Math.PI/12};
	//Triangles
	let triScale = 1.62;
	let props2 = {scale:triScale,sides:3,rot:0};
	let props3 = {scale:triScale,sides:3,rot:Math.PI};
	let props4 = {scale:triScale,sides:3,rot:Math.PI/2};
	let props5 = {scale:triScale,sides:3,rot:-Math.PI/2};
	
	let d1 = Math.cos(Math.PI/12)*2;
	let d2 = (1/Math.sqrt(2)*(1+Math.tan(Math.PI/6)))/2;
	let d3 = (1/Math.sqrt(2)*(1+Math.tan(Math.PI/6)))*Math.sin(Math.PI/3);
	let d5 = (Math.sqrt(2)*Math.tan(Math.PI/6))
	let d4 = d2+d5;
	
	
	templateRels[0].push({dx:d1,dy:0,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0,dy:d1,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-d1,dy:0,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0,dy:-d1,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:d4,dy:d3,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:d2,dy:d3,t:3,shape:3,props:props3,ref:null});
	templateRels[0].push({dx:-d3,dy:d4,t:4,shape:3,props:props4,ref:null});
	templateRels[0].push({dx:-d3,dy:d2,t:5,shape:3,props:props5,ref:null});
	templateRels[0].push({dx:-d4,dy:-d3,t:3,shape:3,props:props3,ref:null});
	templateRels[0].push({dx:-d2,dy:-d3,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:d3,dy:-d4,t:5,shape:3,props:props5,ref:null});
	templateRels[0].push({dx:d3,dy:-d2,t:4,shape:3,props:props4,ref:null});
	
	templateRels[1].push({dx:d1,dy:0,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:0,dy:d1,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-d1,dy:0,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:0,dy:-d1,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-d4,dy:d3,t:3,shape:3,props:props3,ref:null});
	templateRels[1].push({dx:-d2,dy:d3,t:2,shape:3,props:props2,ref:null});
	templateRels[1].push({dx:d3,dy:d4,t:4,shape:3,props:props4,ref:null});
	templateRels[1].push({dx:d3,dy:d2,t:5,shape:3,props:props5,ref:null});
	templateRels[1].push({dx:d4,dy:-d3,t:2,shape:3,props:props2,ref:null});
	templateRels[1].push({dx:d2,dy:-d3,t:3,shape:3,props:props3,ref:null});
	templateRels[1].push({dx:-d3,dy:-d4,t:5,shape:3,props:props5,ref:null});
	templateRels[1].push({dx:-d3,dy:-d2,t:4,shape:3,props:props4,ref:null});
	
	
	templateRels[2].push({dx:d2,dy:d3,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:-d4,dy:d3,t:1,shape:3,props:props1,ref:null});
	templateRels[2].push({dx:-d4,dy:-d3,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:d2,dy:-d3,t:1,shape:3,props:props1,ref:null});
	
	templateRels[2].push({dx:d2+d3,dy:d5/2,t:4,shape:3,props:props4,ref:null});
	templateRels[2].push({dx:d2+d3,dy:-d5/2,t:5,shape:3,props:props5,ref:null});
	templateRels[2].push({dx:-d5,dy:0,t:3,shape:3,props:props3,ref:null});
	templateRels[2].push({dx:-d5/2,dy:d2+d3,t:5,shape:3,props:props5,ref:null});
	templateRels[2].push({dx:-d5/2,dy:-d2-d3,t:4,shape:3,props:props4,ref:null});
	
	
	templateRels[3].push({dx:-d2,dy:d3,t:1,shape:3,props:props1,ref:null});
	templateRels[3].push({dx:d4,dy:d3,t:0,shape:3,props:props0,ref:null});
	templateRels[3].push({dx:d4,dy:-d3,t:1,shape:3,props:props1,ref:null});
	templateRels[3].push({dx:-d2,dy:-d3,t:0,shape:3,props:props0,ref:null});
	
	templateRels[3].push({dx:-d2-d3,dy:d5/2,t:4,shape:3,props:props4,ref:null});
	templateRels[3].push({dx:-d2-d3,dy:-d5/2,t:5,shape:3,props:props5,ref:null});
	templateRels[3].push({dx:d5,dy:0,t:2,shape:3,props:props2,ref:null});
	templateRels[3].push({dx:d5/2,dy:d2+d3,t:5,shape:3,props:props5,ref:null});
	templateRels[3].push({dx:d5/2,dy:-d2-d3,t:4,shape:3,props:props4,ref:null});
	
	
	templateRels[4].push({dx:-d3,dy:d2,t:0,shape:3,props:props0,ref:null});
	templateRels[4].push({dx:-d3,dy:-d4,t:1,shape:3,props:props1,ref:null});
	templateRels[4].push({dx:d3,dy:-d4,t:0,shape:3,props:props0,ref:null});
	templateRels[4].push({dx:d3,dy:d2,t:1,shape:3,props:props1,ref:null});
	
	templateRels[4].push({dx:-d5/2,dy:d2+d3,t:3,shape:3,props:props3,ref:null});
	templateRels[4].push({dx:d5/2,dy:d2+d3,t:2,shape:3,props:props2,ref:null});
	templateRels[4].push({dx:0,dy:-d5,t:5,shape:3,props:props5,ref:null});
	templateRels[4].push({dx:-d2-d3,dy:-d5/2,t:2,shape:3,props:props2,ref:null});
	templateRels[4].push({dx:d2+d3,dy:-d5/2,t:3,shape:3,props:props3,ref:null});
	
	
	templateRels[5].push({dx:-d3,dy:-d2,t:1,shape:3,props:props1,ref:null});
	templateRels[5].push({dx:-d3,dy:d4,t:0,shape:3,props:props0,ref:null});
	templateRels[5].push({dx:d3,dy:d4,t:1,shape:3,props:props1,ref:null});
	templateRels[5].push({dx:d3,dy:-d2,t:0,shape:3,props:props0,ref:null});
	
	templateRels[5].push({dx:-d5/2,dy:-d2-d3,t:3,shape:3,props:props3,ref:null});
	templateRels[5].push({dx:d5/2,dy:-d2-d3,t:2,shape:3,props:props2,ref:null});
	templateRels[5].push({dx:0,dy:d5,t:4,shape:3,props:props4,ref:null});
	templateRels[5].push({dx:-d2-d3,dy:d5/2,t:2,shape:3,props:props2,ref:null});
	templateRels[5].push({dx:d2+d3,dy:d5/2,t:3,shape:3,props:props3,ref:null});
	
	templateTarnsform(0.897, 0);
	
}

function set33344() {
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);

	let props0 = {scale:Math.sqrt(2),sides:4,rot:Math.PI/4};
	let props1 = {scale:1.15,sides:3,rot:-Math.PI/6};
	let props2 = {scale:1.15,sides:3,rot:Math.PI/6};

	let d2 = 1/(2*Math.cos(Math.PI/6));
	let d1 = d2/2;

	templateRels[0].push({dx:1,dy:0,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:1,dy:0.5+d1,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0.5,dy:0.5+d2,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:0,dy:0.5+d1,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-0.5,dy:0.5+d2,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:-1,dy:0.5+d1,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-1,dy:0,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:-1,dy:-0.5-d1,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:-0.5,dy:-0.5-d2,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0,dy:-0.5-d1,t:2,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:0.5,dy:-0.5-d2,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:1,dy:-0.5-d1,t:2,shape:3,props:props2,ref:null});

	templateRels[1].push({dx:1,dy:0,t:1,shape:3,props:props1,ref:null});
	templateRels[1].push({dx:0.5,dy:d1,t:2,shape:3,props:props2,ref:null});
	templateRels[1].push({dx:0.5,dy:0.5+d2,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-0.5,dy:0.5+d2,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-0.5,dy:d1,t:2,shape:3,props:props2,ref:null});
	templateRels[1].push({dx:-1,dy:0,t:1,shape:3,props:props1,ref:null});
	templateRels[1].push({dx:-1,dy:-0.5-d1,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:0,dy:-0.5-d1,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:1,dy:-0.5-d1,t:0,shape:3,props:props0,ref:null});

	templateRels[2].push({dx:1,dy:0,t:2,shape:3,props:props2,ref:null});
	templateRels[2].push({dx:0.5,dy:-d1,t:1,shape:3,props:props1,ref:null});
	templateRels[2].push({dx:0.5,dy:-0.5-d2,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:-0.5,dy:-0.5-d2,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:-0.5,dy:-d1,t:1,shape:3,props:props1,ref:null});
	templateRels[2].push({dx:-1,dy:0,t:2,shape:3,props:props2,ref:null});
	templateRels[2].push({dx:-1,dy:0.5+d1,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:0,dy:0.5+d1,t:0,shape:3,props:props0,ref:null});
	templateRels[2].push({dx:1,dy:0.5+d1,t:0,shape:3,props:props0,ref:null});

	templateTarnsform(1.2923893648, 0);
	
}

function setTri() {
	offsX = 0.8660254037844;
	offsY = -0.5;
	templateRels.push([]);
	templateRels.push([]);
	let props0 = {scale:1.99,sides:3,rot:-Math.PI/6};
	let props1 = {scale:1.99,sides:3,rot:Math.PI/6};
	templateRels[0].push({dx:0.8660254037844,dy:0.5,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0.8660254037844,dy:1.5,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:0,dy:2,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-0.8660254037844,dy:1.5,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:-0.8660254037844,dy:0.5,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-1.7320508075688,dy:0,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:-1.7320508075688,dy:-1,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-0.8660254037844,dy:-1.5,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:0,dy:-1,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0.8660254037844,dy:-1.5,t:0,shape:3,props:props0,ref:null});
	templateRels[0].push({dx:1.7320508075688,dy:-1,t:1,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:1.7320508075688,dy:0,t:0,shape:3,props:props0,ref:null});
	
	templateRels[1].push({dx:0.8660254037844,dy:-0.5,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:0.8660254037844,dy:-1.5,t:1,shape:3,props:props1,ref:null});
	templateRels[1].push({dx:0,dy:-2,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-0.8660254037844,dy:-1.5,t:1,shape:3,props:props1,ref:null});
	templateRels[1].push({dx:-0.8660254037844,dy:-0.5,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-1.7320508075688,dy:0,t:1,shape:3,props:props1,ref:null});
	templateRels[1].push({dx:-1.7320508075688,dy:1,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:-0.8660254037844,dy:1.5,t:1,shape:3,props:props1,ref:null});
	templateRels[1].push({dx:0,dy:1,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:0.8660254037844,dy:1.5,t:1,shape:3,props:props1,ref:null});
	templateRels[1].push({dx:1.7320508075688,dy:1,t:0,shape:3,props:props0,ref:null});
	templateRels[1].push({dx:1.7320508075688,dy:0,t:1,shape:3,props:props1,ref:null});
	
	templateTarnsform(0.876, 0);
}

function setFloor1() {
	templateRels.push([]);
	templateRels.push([]);
	let props1 = {scale:2.15,sides:8,rot:Math.PI/8};
	let props2 = {scale:1.15,sides:4,rot:0};
	templateRels[0].push({dx:2,dy:0,t:0,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0,dy:2,t:0,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-2,dy:0,t:0,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0,dy:-2,t:0,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:1,dy:1,t:1,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:-1,dy:1,t:1,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:-1,dy:-1,t:1,shape:3,props:props2,ref:null});
	templateRels[0].push({dx:1,dy:-1,t:1,shape:3,props:props2,ref:null});
	
	
	templateRels[1].push({dx:1,dy:1,t:0,shape:3,props:props1,ref:null});
	templateRels[1].push({dx:-1,dy:-1,t:0,shape:3,props:props1,ref:null});
	templateRels[1].push({dx:-1,dy:1,t:0,shape:3,props:props1,ref:null});
	templateRels[1].push({dx:1,dy:-1,t:0,shape:3,props:props1,ref:null});
	templateTarnsform(1/Math.sqrt(2), 0);
}

function setFishbone() {
	templateRels.push([]);
	templateRels.push([]);
	let props1 = {scale:2.2,rot:Math.PI/2,sides:4,ratio:0.29516724};
	let props2 = {scale:2.2,rot:0,sides:4,ratio:0.29516724};
	templateRels[0].push({dx:1.5,dy:0.5,t:1,shape:4,props:props2,ref:null});
	templateRels[0].push({dx:0.5,dy:1.5,t:1,shape:4,props:props2,ref:null});
	templateRels[0].push({dx:-1,dy:1,t:0,shape:4,props:props1,ref:null});
	templateRels[0].push({dx:-1.5,dy:-0.5,t:1,shape:4,props:props2,ref:null});
	templateRels[0].push({dx:-0.5,dy:-1.5,t:1,shape:4,props:props2,ref:null});
	templateRels[0].push({dx:1,dy:-1,t:0,shape:4,props:props1,ref:null});
	
	templateRels[1].push({dx:1.5,dy:0.5,t:0,shape:4,props:props1,ref:null});
	templateRels[1].push({dx:0.5,dy:1.5,t:0,shape:4,props:props1,ref:null});
	templateRels[1].push({dx:-1,dy:1,t:1,shape:4,props:props2,ref:null});
	templateRels[1].push({dx:-1.5,dy:-0.5,t:0,shape:4,props:props1,ref:null});
	templateRels[1].push({dx:-0.5,dy:-1.5,t:0,shape:4,props:props1,ref:null});
	templateRels[1].push({dx:1,dy:-1,t:1,shape:4,props:props2,ref:null});
	templateTarnsform(1/Math.sqrt(2), Math.PI/4);
}

function setHex() {
	templateRels.push([]);
	let props1 = {scale:1.15,sides:6,rot:0};
	templateRels[0].push({dx:0,dy:1,t:0,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0,dy:-1,t:0,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0.86602540378,dy:0.5,t:0,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-0.86602540378,dy:0.5,t:0,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:0.86602540378,dy:-0.5,t:0,shape:3,props:props1,ref:null});
	templateRels[0].push({dx:-0.86602540378,dy:-0.5,t:0,shape:3,props:props1,ref:null});
	templateTarnsform(1.07, 0);
}

function setWall() {
	templateRels.push([]);
	templateRels[0].push({dx:1,dy:0,t:0,shape:1,ref:null});
	templateRels[0].push({dx:-1,dy:0,t:0,shape:1,ref:null});
	templateRels[0].push({dx:0.5,dy:1,t:0,shape:1,ref:null});
	templateRels[0].push({dx:-0.5,dy:1,t:0,shape:1,ref:null});
	templateRels[0].push({dx:0.5,dy:-1,t:0,shape:1,ref:null});
	templateRels[0].push({dx:-0.5,dy:-1,t:0,shape:1,ref:null});
}

function setCairo() {
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);
	templateRels.push([]);
	
	let d1 = Math.sin(Math.PI/8);
	let d2 = Math.cos(Math.PI/8);
	
	offsX = 0;
	offsY = d1-d2;
	
	let pts = [];
	pts.push({x:0,y:2*d1});
	pts.push({x:-d2,y:d1});
	pts.push({x:d1-d2,y:d1-d2});
	pts.push({x:d2-d1,y:d1-d2});
	pts.push({x:d2,y:d1});
	let props0 = {scale:1,rot:0,points:pts};
	let props1 = {scale:1,rot:Math.PI,points:pts};
	let props2 = {scale:1,rot:Math.PI/2,points:pts};
	let props3 = {scale:1,rot:-Math.PI/2,points:pts};
	
	templateRels[0].push({dx:2*d2,dy:2*d1,t:1,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:d2-d1,dy:d1+d2,t:3,shape:5,props:props3,ref:null});
	templateRels[0].push({dx:d1-d2,dy:d1+d2,t:2,shape:5,props:props2,ref:null});
	templateRels[0].push({dx:-2*d2,dy:2*d1,t:1,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:-d2-d1,dy:d1-d2,t:3,shape:5,props:props3,ref:null});
	templateRels[0].push({dx:0,dy:2*(d1-d2),t:1,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:d2+d1,dy:d1-d2,t:2,shape:5,props:props2,ref:null});
	
	templateRels[1].push({dx:-2*d2,dy:-2*d1,t:0,shape:5,props:props0,ref:null});
	templateRels[1].push({dx:d1-d2,dy:-d1-d2,t:2,shape:5,props:props2,ref:null});
	templateRels[1].push({dx:d2-d1,dy:-d1-d2,t:3,shape:5,props:props3,ref:null});
	templateRels[1].push({dx:2*d2,dy:-2*d1,t:0,shape:5,props:props0,ref:null});
	templateRels[1].push({dx:d1+d2,dy:d2-d1,t:2,shape:5,props:props2,ref:null});
	templateRels[1].push({dx:0,dy:2*(d2-d1),t:0,shape:5,props:props0,ref:null});
	templateRels[1].push({dx:-d1-d2,dy:d2-d1,t:3,shape:5,props:props3,ref:null});
	
	templateRels[2].push({dx:-2*d1,dy:2*d2,t:3,shape:5,props:props3,ref:null});
	templateRels[2].push({dx:-d1-d2,dy:d2-d1,t:0,shape:5,props:props0,ref:null});
	templateRels[2].push({dx:-d1-d2,dy:d1-d2,t:1,shape:5,props:props1,ref:null});
	templateRels[2].push({dx:-2*d1,dy:-2*d2,t:3,shape:5,props:props3,ref:null});
	templateRels[2].push({dx:d2-d1,dy:-d2-d1,t:0,shape:5,props:props0,ref:null});
	templateRels[2].push({dx:2*(d2-d1),dy:0,t:3,shape:5,props:props3,ref:null});
	templateRels[2].push({dx:d2-d1,dy:d2+d1,t:1,shape:5,props:props1,ref:null});
	
	templateRels[3].push({dx:2*d1,dy:-2*d2,t:2,shape:5,props:props2,ref:null});
	templateRels[3].push({dx:d1+d2,dy:d1-d2,t:1,shape:5,props:props1,ref:null});
	templateRels[3].push({dx:d1+d2,dy:d2-d1,t:0,shape:5,props:props0,ref:null});
	templateRels[3].push({dx:2*d1,dy:2*d2,t:2,shape:5,props:props2,ref:null});
	templateRels[3].push({dx:d1-d2,dy:d2+d1,t:1,shape:5,props:props1,ref:null});
	templateRels[3].push({dx:-2*(d2-d1),dy:0,t:2,shape:5,props:props2,ref:null});
	templateRels[3].push({dx:d1-d2,dy:-d2-d1,t:0,shape:5,props:props0,ref:null});
	
	templateTarnsform(0.75337, Math.PI/4);
}

function setTestShape() {
	templateRels.push([]);
	let d1 = Math.sin(Math.PI/8);
	let d2 = Math.cos(Math.PI/8);
	let pts = [];
	pts.push({x:0,y:2*d1});
	pts.push({x:-d2,y:d1});
	pts.push({x:d1-1,y:d1-d2});
	pts.push({x:1-d1,y:d1-d2});
	pts.push({x:d2,y:d1});
	let props1 = {scale:1,rot:0,points:pts};
	templateRels[0].push({dx:3,dy:0,t:0,shape:5,props:props1,ref:null});
	templateRels[0].push({dx:0,dy:3,t:0,shape:0,props:props1,ref:null});
	templateRels[0].push({dx:-3,dy:0,t:0,shape:0,props:props1,ref:null});
	templateRels[0].push({dx:0,dy:-3,t:0,shape:0,props:props1,ref:null});
	templateRels[0].push({dx:3,dy:3,t:0,shape:0,props:props1,ref:null});
	templateRels[0].push({dx:3,dy:-3,t:0,shape:0,props:props1,ref:null});
	templateRels[0].push({dx:-3,dy:3,t:0,shape:0,props:props1,ref:null});
	templateRels[0].push({dx:-3,dy:-3,t:0,shape:0,props:props1,ref:null});
	console.log(JSON.stringify(templateRels));
}

// test for storing templates in JSON format
function JSONShape() {
	let str = `
[[
	{
		"dx":3, "dy":0, "t":0, "shape":5, "ref":null,
		"props":{
			"scale":2,
			"rot":0.7853981633974483,
			"points":[
				{ "x":0.5, "y":0.5 },
				{ "x":-0.5, "y":0.5 },
				{ "x":-0.5, "y":-0.5 },
				{ "x":0.5, "y":-0.5 },
				{ "x":1, "y":0 }
			]
		}
	},
	{
		"dx":0, "dy":3, "t":0, "shape":0, "ref":null,
		"props":{
			"scale":2,
			"rot":0
		}
	},
	{
		"dx":-3, "dy":0, "t":0, "shape":0, "ref":null,
		"props":{
			"scale":2,
			"rot":0.7853981633974483,
			"points":[
				{ "x":0.5, "y":0.5 },
				{ "x":-0.5, "y":0.5 },
				{ "x":-0.5, "y":-0.5 },
				{ "x":0.5, "y":-0.5 },
				{ "x":1, "y":0 }
			]
		}
	},
	{
		"dx":0, "dy":-3, "t":0, "shape":0,
		"props":{
			"scale":2,
			"rot":0.7853981633974483,
			"points":[
				{ "x":0.5, "y":0.5 },
				{ "x":-0.5, "y":0.5 },
				{ "x":-0.5, "y":-0.5 },
				{ "x":0.5, "y":-0.5 },
				{ "x":1, "y":0 }
			]
		},
		"ref":null
	},
	{
		"dx":3, "dy":3, "t":0, "shape":0,
		"props":{
			"scale":2,
			"rot":0.7853981633974483,
			"points":[
				{ "x":0.5, "y":0.5 },
				{ "x":-0.5, "y":0.5 },
				{ "x":-0.5, "y":-0.5 },
				{ "x":0.5, "y":-0.5 },
				{ "x":1, "y":0 }
			]
		},
		"ref":null
	},
	{
		"dx":3, "dy":-3, "t":0, "shape":0,
		"props":{
			"scale":2,
			"rot":0.7853981633974483,
			"points":[
				{ "x":0.5, "y":0.5 },
				{ "x":-0.5, "y":0.5 },
				{ "x":-0.5, "y":-0.5 },
				{ "x":0.5, "y":-0.5 },
				{ "x":1, "y":0 }
			]
		},
		"ref":null
	},
	{
		"dx":-3, "dy":3, "t":0, "shape":0,
		"props":{
			"scale":2,
			"rot":0.7853981633974483,
			"points":[
				{ "x":0.5, "y":0.5 },
				{ "x":-0.5, "y":0.5 },
				{ "x":-0.5, "y":-0.5 },
				{ "x":0.5, "y":-0.5 },
				{ "x":1, "y":0 }
			]
		},
		"ref":null
	},
	{
		"dx":-3, "dy":-3, "t":0, "shape":0,
		"props":{
			"scale":2,
			"rot":0.7853981633974483,
			"points":[
				{ "x":0.5, "y":0.5 },
				{ "x":-0.5, "y":0.5 },
				{ "x":-0.5, "y":-0.5 },
				{ "x":0.5, "y":-0.5 },
				{ "x":1, "y":0 }
			]
		},
		"ref":null
	}
]]
	`
	templateRels = JSON.parse(str);
}
