var rectBorder = 16,
	nColumn = 4,
	nRow = 4,
	rectW = (document.width*3/4)/nColumn,
	rectH = (document.height*3/4)/nRow,
	colors = ["blue", "red", "yellow"],
	r = 0,
	rectangles = Array(nColumn);

// Entry point
$(document).ready(function(){
	
	for (var i = 0; i < nRow; i++) {
		rectangles[i] = Array(nColumn);
		for (var j = 0; j < nColumn; j++) {
			var color = choseColor();
			rectangles[i][j] = {};
			rectangles[i][j].rect = appendRectangle(rectW, rectH, rectBorder + j*rectW, rectBorder + i*rectH, color, r, i, j);
			rectangles[i][j].index = r;
			rectangles[i][j].adj = computeAdjacencies(i,j);
			r++;		
		}
	}

	rectangles[0][0].type = "A";
	rectangles[0][nColumn-1].type = "C";
	rectangles[nRow-1][0].type = "G";
	rectangles[nRow-1][nColumn-1].type = "I";
	for(var i=1; i < nColumn-1; i++){
		rectangles[0][i].type = "B";
		rectangles[nRow-1][i].type = "H";
	}	
	for(var i=1; i < nRow-1; i++){
		rectangles[i][0].type = "D";
		rectangles[i][nColumn-1].type = "F";
	}
	for(var i=1; i<nRow-1; i++)
		for(var j=1; j<nColumn-1; j++)
			rectangles[i][j].type = "E";
});

function appendRectangle(width, height, x, y, color, r, i, j){

	return d3.select("#svgContainer")
		.append("rect")
		.attr("id", "rect"+r)
		.attr("row", i)
		.attr("column", j)
		.attr("width", width)
		.attr("height", height)
		.attr("x", x)
		.attr("y", y)
		.attr("fill", color)
		.attr("stroke","black")
		.attr("stroke-width", rectBorder+"px")
		.on("click", function(){
			onMouseOver(this);
		});
}



function choseColor(){
	if(!Math.floor(Math.random()*2)){
		return "white";
	}
	else{
		var primary = Math.floor(Math.random()*3);
		return colors[primary];
	}
}


function onMouseOver(currentRect){

	var rectData = {},
		// switch on rectangle type
		actions = {
			"E" : function(rectData){
				rectData.newW = rectData.oldW + rectData.oldW/4,
				rectData.newH = rectData.oldH + rectData.oldH/4,
				rectData.newX = rectData.oldX - (rectData.newW - rectData.oldW)/2,
				rectData.newY = rectData.oldY - (rectData.newH - rectData.oldH)/2;

				for(var i=0; i<rectangles[rectData.row][rectData.col].adj.length; i++){
					adjustNeighbours(i, rectData);
				}	

				rectData.rectSelection
						// .transition().duration(1000)
						.attr("width", rectData.newW)
						.attr("height", rectData.newH)
						.attr("x", rectData.newX)
						.attr("y", rectData.newY);	
			},

			"A" : function(rectData){
				rectData.newW = rectData.oldW + rectData.oldW/8,
				rectData.newH = rectData.oldH + rectData.oldH/8,
				rectData.newX = rectData.oldX,
				rectData.newY = rectData.oldY;

				for(var i=0; i<rectangles[rectData.row][rectData.col].adj.length; i++){
					adjustNeighboursA(i, rectData);
				}

				rectData.rectSelection
						// .transition().duration(1000)
						.attr("width", rectData.newW)
						.attr("height", rectData.newH)
						.attr("x", rectData.newX)
						.attr("y", rectData.newY);		
			}
		};

	rectData.rectSelection = d3.select(currentRect);	
	rectData.oldW = parseFloat(rectData.rectSelection.attr("width"));
	rectData.oldH = parseFloat(rectData.rectSelection.attr("height"));
	rectData.oldX = parseFloat(rectData.rectSelection.attr("x"));
	rectData.oldY = parseFloat(rectData.rectSelection.attr("y"));
	rectData.row = rectData.rectSelection.attr("row");
	rectData.col = rectData.rectSelection.attr("column");
	rectData.type = rectangles[rectData.row][rectData.col].type;

	if(typeof actions[rectData.type] !== 'function'){
		throw new Error("! The actioned rectangle has an invalid type !");
	}
	
	return actions[rectData.type](rectData);
}

function computeAdjacencies(row, col){

	var adj = [];
	for(var i=row-1; i<=row+1; i++){
		for(var j=col-1; j<=col+1; j++){
			if((i>=0)&&(i<nRow)&&(j>=0)&&(j<nColumn)){
				if(!((i==row)&&(j==col))){
					var pair = {};
					pair.row = i;
					pair.col = j;
					adj.push(pair);
				}
			}
		}
	}
	return adj;
}	

function adjustNeighbours(n, rectData){
	
	var row = rectangles[rectData.row][rectData.col].adj[n].row,
		col = rectangles[rectData.row][rectData.col].adj[n].col,
		adjRect = rectangles[row][col].rect,
		oldW = parseFloat(adjRect.attr("width")),
		oldH = parseFloat(adjRect.attr("height")),
		oldX = parseFloat(adjRect.attr("x")),
		oldY = parseFloat(adjRect.attr("y")),
		newW, newH, newX, newY, sign;

	newW = ((n==1)||(n==6)) ? (rectData.newW) : (oldW - (rectData.newW - rectData.oldW)/2);	
	newH = ((n==3)||(n==4))	? (rectData.newH) : (oldH - (rectData.newH - rectData.oldH)/2);
	sign = ((n==1)||(n==6)) ? -1 : +1;
	newX = ((n==0)||(n==3)||(n==5)) ? (oldX) : (oldX + sign*(rectData.newW - rectData.oldW)/2);
	sign = ((n==3)||(n==4)) ? -1 : +1;
	newY = ((n==0)||(n==1)||(n==2)) ? (oldY) : (oldY + sign*(rectData.newH - rectData.oldH)/2);

	adjRect
		   // .transition.duration(1000)
		   .attr("width", newW)
		   .attr("height", newH)
		   .attr("x", newX)
		   .attr("y", newY);
}

function adjustNeighboursA(n, rectData){
	
	var row = rectangles[rectData.row][rectData.col].adj[n].row,
		col = rectangles[rectData.row][rectData.col].adj[n].col,
		adjRect = rectangles[row][col].rect,
		oldW = parseFloat(adjRect.attr("width")),
		oldH = parseFloat(adjRect.attr("height")),
		oldX = parseFloat(adjRect.attr("x")),
		oldY = parseFloat(adjRect.attr("y")),
		newW, newH, newX, newY, sign;

	newW = (n==1) ? (oldW + (rectData.newW - rectData.oldW)/2) : (oldW - (rectData.newW - rectData.oldW)/2);	
	newH = (n==0) ? (oldH + (rectData.newH - rectData.oldH)/2) : (oldH - (rectData.newH - rectData.oldH)/2);
	newX = (n==1) ? (oldX) : (oldX + (rectData.newW - rectData.oldW)/2);
	newY = (n==0) ? (oldY) : (oldY + (rectData.newH - rectData.oldH)/2);

	adjRect
		   // .transition.duration(1000)
		   .attr("width", newW)
		   .attr("height", newH)
		   .attr("x", newX)
		   .attr("y", newY);
}											