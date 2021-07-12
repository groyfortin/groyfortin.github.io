

function draw()
{
	  var canvas = document.getElementById('circle');
		var ctx = canvas.getContext('2d'); 
		
		/* on effaxce tout */
		ctx.clearRect(0,0, canvas.width, canvas.height)

		/* 	Ok on va se créer un plan cartésien qui a de l'allure en plaçant
				l'origine au centre du canvas. */
		var xOrigin = canvas.width / 2;
		var yOrigin = canvas.height / 2;
		ctx.translate(xOrigin, yOrigin);

		/* On charge les infos de la pupille */
		var xPup = Number(document.getElementById("xPup").value);
		var yPup = -Number(document.getElementById("yPup").value);
		var rPup = Number(document.getElementById("diamPup").value);
		
		
		/* ... et de la lentille */
		var rIntLen = Number(document.getElementById("diamIntLen").value);
		var rExtLen = Number(document.getElementById("diamExtLen").value);
		var alpha = Number(document.getElementById("alpha").value);
	
		
		
		/* on trace la lentille */
		ctx.beginPath();
		ctx.arc(0, 0, rExtLen, 0, 2 * Math.PI, false);
		ctx.lineWidth = 1;
		ctx.strokeStyle = '0000000';
		ctx.stroke();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.arc(0, 0, rIntLen, (Math.PI - alpha)/2, (Math.PI + alpha)/2, false);
		ctx.lineWidth = 1;
		ctx.strokeStyle = '0000000';
		ctx.stroke();
		ctx.closePath();
		
		/* segments de droites qui déterminent la frontière de la partie focale */
		var angleTmp = (Math.PI - alpha)/2;
		var xInTmp = rIntLen*Math.cos(angleTmp);
		var yInTmp = rIntLen*Math.sin(angleTmp);
		
		var xOutTmp = rExtLen*Math.cos(angleTmp);
		var yOutTmp = rExtLen*Math.sin(angleTmp);
		
		
		ctx.beginPath();
		ctx.moveTo(xInTmp, yInTmp);
		ctx.lineTo(xOutTmp, yOutTmp);
		ctx.stroke();
		ctx.closePath();
		
		
		ctx.beginPath();
		ctx.moveTo(-xInTmp, yInTmp);
		ctx.lineTo(-xOutTmp, yOutTmp);
		ctx.stroke();
		ctx.closePath();
		/* ... et la pupille */
		ctx.beginPath();
		ctx.arc(xPup, yPup, rPup, 0, 2 * Math.PI, false);
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#FF0000';
		ctx.stroke();
		ctx.closePath();
		
		
		
		console.log("isfocal point: 5, -5" + isFocalPoint(rIntLen, rExtLen, alpha, 0, 5));
		var focalCoeff = computeCoeff(ctx, rIntLen, rExtLen, alpha, xPup, yPup, rPup, 10);

		ctx.translate(-xOrigin, -yOrigin);
		 
		var textZone = document.getElementById('output_text');
		textZone.innerHTML = "Coefficient focal: " + focalCoeff;
		
}

function computeCoeff(ctx, rIntLen, rExtLen, alpha, xPup, yPup, rPup, nbSamplePoints)
{
	
	/* On va gonfler le disque de la pupille */
	var currX = 0;
	var currY = 0;
	var focalPointsCount = 0;
	var diskPointsCount = 0;
	
	
	for(xStep =-100; xStep <= 100; xStep++)
	{
		for(yStep =-100; yStep <= 100; yStep++)
		{
			/* Sommes-nous dans le disque ? */
			if( Math.sqrt(xStep*xStep + yStep*yStep) <= 100)
			{
				diskPointsCount++;
				/* on fait une homothétie et une translation pour obtenir un point de la pupille */
				currX = (xStep / 100 * rPup) + xPup;
				currY = (yStep / 100 * rPup) + yPup;
				if(isFocalPoint(rIntLen, rExtLen, alpha, currX, -currY))
				{
					ctx.fillRect(currX,currY, 1,1);
					focalPointsCount++;
				}
					
			}
			
			
		}
		
	}
	
	focalCoeff = focalPointsCount / diskPointsCount;
	console.log("coeffiencient focal: " + focalCoeff);
	
	return focalCoeff;
	
	
	
}


function isFocalPoint(rIntLen, rExtLen, alpha, x, y)
{
	
	/* On commence par convertir x, y en coordonnées polaires */
	var r = Math.sqrt(x*x + y*y);
	if(x!=0)
	{
		var theta= Math.atan(y/x);
	}
	else
	{
		var theta = Math.PI / 2;
	}
	
	/* On va transformer le theta recu pour qui'il corresponde à la manière usuelle de mesurer en radion */
	if(x*y >= 0) 
	{
		if(x <= 0) 
			theta += Math.PI;
	}
	else
	{
		if(x <= 0)
			theta += Math.PI;
		else
			theta += (2*Math.PI);
	}
	
	/* arctan nous a retourné un angle dans le 4ème ou 1er quadrant. Si c'est dans le premier, 
	 on veut décaler par un offset de pi pour revenir dans la 3ème */
	 /*if(theta <= 0)
	 	theta += Math.PI;*/
	
	if(rIntLen <= r && r <= rExtLen && theta <= (3*Math.PI + alpha)/2 && theta >= (3*Math.PI - alpha)/2 )
		return true;
	else
		return false;
	
}