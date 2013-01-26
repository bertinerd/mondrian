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
				rectData.newW = rectData.oldW + rectData.oldW/4;
				rectData.newH = rectData.oldH + rectData.oldH/4;
				rectData.newX = rectData.oldX - (rectData.newW - rectData.oldW)/2;
				rectData.newY = rectData.oldY - (rectData.newH - rectData.oldH)/2;

				for(var i=0; i<rectangles[rectData.row][rectData.col].adj.length; i++){
					var newW, newH, newX, newY, sign, neighData = neighboursData(i, rectData);
					newW = ((i==1)||(i==6)) ? (rectData.newW) : (neighData.oldW - (rectData.newW - rectData.oldW)/2);	
					newH = ((i==3)||(i==4))	? (rectData.newH) : (neighData.oldH - (rectData.newH - rectData.oldH)/2);
					sign = ((i==1)||(i==6)) ? -1 : +1;
					newX = ((i==0)||(i==3)||(i==5)) ? (neighData.oldX) : (neighData.oldX + sign*(rectData.newW - rectData.oldW)/2);
					sign = ((i==3)||(i==4)) ? -1 : +1;
					newY = ((i==0)||(i==1)||(i==2)) ? (neighData.oldY) : (neighData.oldY + sign*(rectData.newH - rectData.oldH)/2);
					neighData.adjRect.transition().duration(1000).attr("width", newW).attr("height", newH).attr("x", newX).attr("y", newY);
				}	
				rectData.rectSelection.transition().duration(1000).attr("width", rectData.newW).attr("height", rectData.newH).attr("x", rectData.newX).attr("y", rectData.newY);	
			},

			"A" : function(rectData){
				rectData.newW = rectData.oldW + rectData.oldW/8;
				rectData.newH = rectData.oldH + rectData.oldH/8;
				rectData.newX = rectData.oldX;
				rectData.newY = rectData.oldY;

				for(var i=0; i<rectangles[rectData.row][rectData.col].adj.length; i++){
					var newW, newH, newX, newY, neighData = neighboursData(i, rectData);
					newW = (i==1) ? (rectData.newW) : (neighData.oldW - (rectData.newW - rectData.oldW)/2);	
					newH = (i==0) ? (rectData.newH) : (neighData.oldH - (rectData.newH - rectData.oldH)/2);
					newX = (i==1) ? (neighData.oldX) : (neighData.oldX + (rectData.newW - rectData.oldW)/2);
					newY = (i==0) ? (neighData.oldY) : (neighData.oldY + (rectData.newH - rectData.oldH)/2);
					neighData.adjRect.transition().duration(1000).attr("width", newW).attr("height", newH).attr("x", newX).attr("y", newY);					
				}
				rectData.rectSelection.transition().duration(1000).attr("width", rectData.newW).attr("height", rectData.newH).attr("x", rectData.newX).attr("y", rectData.newY);		
			},

			"B" : function(rectData){
				rectData.newW = rectData.oldW + rectData.oldW/4;
				rectData.newH = rectData.oldH + rectData.oldH/8;
				rectData.newX = rectData.oldX - (rectData.newW - rectData.oldW)/2;
				rectData.newY = rectData.oldY;

				for(var i=0; i<rectangles[rectData.row][rectData.col].adj.length; i++){
					var newW, newH, newX, newY, sign, neighData = neighboursData(i, rectData);
					newW = (i==3) ? (rectData.newW) : (neighData.oldW - (rectData.newW - rectData.oldW)/2);
					newH = ((i==0)||(i==1)) ? (rectData.newH) : (neighData.oldH - (rectData.newH - rectData.oldH)/2);
					sign = (i==3) ? - 1 : +1;
					newX = ((i==0)||(i==2)) ? (neighData.oldX) : (neighData.oldX + sign*(rectData.newW - rectData.oldW)/2);
					newY = ((i==0)||(i==1)) ? (neighData.oldY) : (neighData.oldY + (rectData.newH - rectData.oldH)/2);
					neighData.adjRect.transition().duration(1000).attr("width", newW).attr("height", newH).attr("x", newX).attr("y", newY);
				}				
				rectData.rectSelection.transition().duration(1000).attr("width", rectData.newW).attr("height", rectData.newH).attr("x", rectData.newX).attr("y", rectData.newY);		
			},

			"C" : function(rectData){
				rectData.newW = rectData.oldW + rectData.oldW/8;
				rectData.newH = rectData.oldH + rectData.oldH/8;
				rectData.newX = rectData.oldX - (rectData.newW - rectData.oldW);
				rectData.newY = rectData.oldY;

				for(var i=0; i<rectangles[rectData.row][rectData.col].adj.length; i++){
					var newW, newH, newX, newY, neighData = neighboursData(i, rectData);
					newW = (i==2) ? (rectData.newW) : (neighData.oldW - (rectData.newW - rectData.oldW)/2);	
					newH = (i==0) ? (rectData.newH) : (neighData.oldH - (rectData.newH - rectData.oldH)/2);
					newX = (i==2) ? (rectData.newX) : (neighData.oldX - (rectData.newW - rectData.oldW)/2);
					newY = (i==0) ? (rectData.newY) : (neighData.oldY + (rectData.newH - rectData.oldH)/2);
					neighData.adjRect.transition().duration(1000).attr("width", newW).attr("height", newH).attr("x", newX).attr("y", newY);					
				}
				rectData.rectSelection.transition().duration(1000).attr("width", rectData.newW).attr("height", rectData.newH).attr("x", rectData.newX).attr("y", rectData.newY);		
			},

			"D" : function(rectData){
				rectData.newW = rectData.oldW + rectData.oldW/8;
				rectData.newH = rectData.oldH + rectData.oldH/4;
				rectData.newX = rectData.oldX;
				rectData.newY = rectData.oldY - (rectData.newH - rectData.oldH)/2;

				for(var i=0; i<rectangles[rectData.row][rectData.col].adj.length; i++){
					var newW, newH, sign, newX, newY, neighData = neighboursData(i, rectData);
					newW = ((i==0)||(i==3)) ? (rectData.newW) : (neighData.oldW - (rectData.newW - rectData.oldW)/2);
					newH = (i==2) ? (rectData.newH) : (neighData.oldH - (rectData.newH - rectData.oldH)/2);
					sign = (i==2) ? -1 : +1;
					newX = ((i==0)||(i==3)) ? (neighData.oldX) : (neighData.oldX + (rectData.newW - rectData.oldW)/2);
					newY = ((i==0)||(i==1)) ? (neighData.oldY) : (neighData.oldY + sign*(rectData.newH - rectData.oldH)/2);
					neighData.adjRect.transition().duration(1000).attr("width", newW).attr("height", newH).attr("x", newX).attr("y", newY);					
				}
				rectData.rectSelection.transition().duration(1000).attr("width", rectData.newW).attr("height", rectData.newH).attr("x", rectData.newX).attr("y", rectData.newY);		
			},

			"F" : function(rectData){
				rectData.newW = rectData.oldW + rectData.oldW/8;
				rectData.newH = rectData.oldH + rectData.oldH/4;
				rectData.newX = rectData.oldX - (rectData.newW - rectData.oldW);
				rectData.newY = rectData.oldY - (rectData.newH - rectData.oldH)/2;

				for(var i=0; i<rectangles[rectData.row][rectData.col].adj.length; i++){
					var newW, newH, sign, newX, newY, neighData = neighboursData(i, rectData);
					newW = ((i==1)||(i==4)) ? (rectData.newW) : (neighData.oldW - (rectData.newW - rectData.oldW)/2);
					newH = (i==2) ? (rectData.newH) : (neighData.oldH - (rectData.newH - rectData.oldH)/2);
					sign = (i==2) ? -1 : +1;
					newX = ((i==0)||(i==2)||(i==3)) ? (neighData.oldX) : (neighData.oldX - (rectData.newW - rectData.oldW));
					newY = ((i==0)||(i==1)) ? (neighData.oldY) : (neighData.oldY + sign*(rectData.newH - rectData.oldH)/2);
					neighData.adjRect.transition().duration(1000).attr("width", newW).attr("height", newH).attr("x", newX).attr("y", newY);					
				}
				rectData.rectSelection.transition().duration(1000).attr("width", rectData.newW).attr("height", rectData.newH).attr("x", rectData.newX).attr("y", rectData.newY);		
			},

			"G" : function(rectData){
				rectData.newW = rectData.oldW + rectData.oldW/8;
				rectData.newH = rectData.oldH + rectData.oldH/8;
				rectData.newX = rectData.oldX;
				rectData.newY = rectData.oldY - (rectData.newH - rectData.oldH);

				for(var i=0; i<rectangles[rectData.row][rectData.col].adj.length; i++){
					var newW, newH, newX, newY, neighData = neighboursData(i, rectData);
					newW = (i==0) ? (rectData.newW) : (neighData.oldW - (rectData.newW - rectData.oldW)/2);	
					newH = (i==2) ? (rectData.newH) : (neighData.oldH - (rectData.newH - rectData.oldH)/2);
					newX = (i==0) ? (neighData.oldX) : (neighData.oldX + (rectData.newW - rectData.oldW)/2);
					newY = ((i==0)||(i==1)) ? (neighData.oldY) : (neighData.oldY - (rectData.newH - rectData.oldH));
					neighData.adjRect.transition().duration(1000).attr("width", newW).attr("height", newH).attr("x", newX).attr("y", newY);					
				}
				rectData.rectSelection.transition().duration(1000).attr("width", rectData.newW).attr("height", rectData.newH).attr("x", rectData.newX).attr("y", rectData.newY);		
			},

			"H" : function(rectData){
				rectData.newW = rectData.oldW + rectData.oldW/4;
				rectData.newH = rectData.oldH + rectData.oldH/8;
				rectData.newX = rectData.oldX - (rectData.newW - rectData.oldW)/2;
				rectData.newY = rectData.oldY - (rectData.newH - rectData.oldH);

				for(var i=0; i<rectangles[rectData.row][rectData.col].adj.length; i++){
					var newW, newH, newX, newY, neighData = neighboursData(i, rectData);
					newW = (i==1) ? (rectData.newW) : (neighData.oldW - (rectData.newW - rectData.oldW)/2);	
					newH = ((i==3)||(i==4)) ? (rectData.newH) : (neighData.oldH - (rectData.newH - rectData.oldH)/2);
					sign = (i==1) ? -1 : +1;
					newX = ((i==0)||(i==3)) ? (neighData.oldX) : (neighData.oldX + sign*(rectData.newW - rectData.oldW)/2);
					newY = ((i==0)||(i==1)||(i==2)) ? (neighData.oldY) : (neighData.oldY - (rectData.newH - rectData.oldH));
					neighData.adjRect.transition().duration(1000).attr("width", newW).attr("height", newH).attr("x", newX).attr("y", newY);					
				}
				rectData.rectSelection.transition().duration(1000).attr("width", rectData.newW).attr("height", rectData.newH).attr("x", rectData.newX).attr("y", rectData.newY);		
			},

			"I" : function(rectData){
				rectData.newW = rectData.oldW + rectData.oldW/8;
				rectData.newH = rectData.oldH + rectData.oldH/8;
				rectData.newX = rectData.oldX - (rectData.newH - rectData.oldH)*2;
				rectData.newY = rectData.oldY - (rectData.newH - rectData.oldH);

				for(var i=0; i<rectangles[rectData.row][rectData.col].adj.length; i++){
					var newW, newH, newX, newY, neighData = neighboursData(i, rectData);
					newW = (i==1) ? (rectData.newW) : (neighData.oldW - (rectData.newW - rectData.oldW)/2);	
					newH = (i==2) ? (rectData.newH) : (neighData.oldH - (rectData.newH - rectData.oldH)/2);
					newX = ((i==0)||(i==2)) ? (neighData.oldX) : (neighData.oldX - (rectData.newW - rectData.oldW));
					newY = ((i==0)||(i==1)) ? (neighData.oldY) : (neighData.oldY - (rectData.newH - rectData.oldH));
					neighData.adjRect.transition().duration(1000).attr("width", newW).attr("height", newH).attr("x", newX).attr("y", newY);					
				}
				rectData.rectSelection.transition().duration(1000).attr("width", rectData.newW).attr("height", rectData.newH).attr("x", rectData.newX).attr("y", rectData.newY);		
			},
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

function neighboursData(n, rectData){
	
		var data = {}, row, col;
		row = rectangles[rectData.row][rectData.col].adj[n].row;
		col = rectangles[rectData.row][rectData.col].adj[n].col;
		data.adjRect = rectangles[row][col].rect;
		data.oldW = parseFloat(data.adjRect.attr("width"));
		data.oldH = parseFloat(data.adjRect.attr("height"));
		data.oldX = parseFloat(data.adjRect.attr("x"));
		data.oldY = parseFloat(data.adjRect.attr("y"));
		return data;
}											