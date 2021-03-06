

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
		/* Échelle: 1mm = 50 pixels */
		const SCALE = 20;
		var xPup = Number(document.getElementById("xPup").value) * SCALE;
		var yPup = -Number(document.getElementById("yPup").value) * SCALE;
		var rPup = Number(document.getElementById("diamPup").value) * SCALE;
		
		
		/* ... et de la lentille */
		var rIntLen = Number(document.getElementById("diamIntLen").value) * SCALE;
		var rExtLen = Number(document.getElementById("diamExtLen").value) * SCALE;
		var alpha = Number(document.getElementById("alpha").value) / 180 * Math.PI;
		var beta = (Number(document.getElementById("beta").value) / 180 * Math.PI);
		/**/
		
		
		
		/* Tachons maintenant de tracer les axes */
		ctx.beginPath();
		ctx.moveTo(-260, 0);
		ctx.lineTo(260, 0);
		ctx.stroke();
		ctx.closePath();

		ctx.beginPath();
		ctx.moveTo(0, 260);
		ctx.lineTo(0, -260);
		ctx.stroke();
		ctx.closePath();
		
		
		for(i = 1; i <= 12; i++)
		{
			ctx.beginPath();
			ctx.moveTo(i * SCALE, 5);
			ctx.lineTo(i * SCALE, -5);
			ctx.stroke();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.moveTo(-(i * SCALE), 5);
			ctx.lineTo(-(i * SCALE), -5);
			ctx.stroke();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.moveTo(-5, i*SCALE);
			ctx.lineTo(5, i*SCALE);
			ctx.stroke();
			ctx.closePath();
			
			
			ctx.beginPath();
			ctx.moveTo(-5, -(i*SCALE));
			ctx.lineTo(5, -(i*SCALE));
			ctx.stroke();
			ctx.closePath();
		}
		
		
		/* on trace la lentille */
		ctx.beginPath();
		ctx.arc(0, 0, rExtLen, 0, 2 * Math.PI, false);
		ctx.lineWidth = 1;
		ctx.strokeStyle = '0000000';
		ctx.stroke();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.arc(0, 0, rIntLen, ((Math.PI - alpha)/2) + beta , ((Math.PI + alpha)/2) + beta, false);
		ctx.lineWidth = 1;
		ctx.strokeStyle = '0000000';
		ctx.stroke();
		ctx.closePath();
		
		
		console.log("angle beta: " + beta);
		
		
		/* segments de droites qui déterminent la frontière de la partie focale */
		var angleTmp = ((Math.PI - alpha)/2) + beta;
		var xInTmp = rIntLen*Math.cos(angleTmp);
		var yInTmp = rIntLen*Math.sin(angleTmp);
		
		var xOutTmp = rExtLen*Math.cos(angleTmp);
		var yOutTmp = rExtLen*Math.sin(angleTmp);
		
		
		ctx.beginPath();
		ctx.moveTo(xInTmp, yInTmp);
		ctx.lineTo(xOutTmp, yOutTmp);
		ctx.stroke();
		ctx.closePath();
		
		angleTmp = Math.PI - ((Math.PI - alpha)/2) + beta;
		xInTmp = rIntLen*Math.cos(angleTmp);
		yInTmp = rIntLen*Math.sin(angleTmp);
		
		xOutTmp = rExtLen*Math.cos(angleTmp);
		yOutTmp = rExtLen*Math.sin(angleTmp);
	
		
		ctx.beginPath();
		ctx.moveTo(xInTmp, yInTmp);
		ctx.lineTo(xOutTmp, yOutTmp);
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
		var focalCoeff = computeCoeff(ctx, rIntLen, rExtLen, alpha, beta, xPup, yPup, rPup, 10);

		ctx.translate(-xOrigin, -yOrigin);
		 
		var textZone = document.getElementById('output_text');
		textZone.innerHTML = "Coefficient focal: " + focalCoeff;
		
}

function computeCoeff(ctx, rIntLen, rExtLen, alpha, beta, xPup, yPup, rPup, nbSamplePoints)
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
				if(isFocalPoint(rIntLen, rExtLen, alpha, beta, currX, currY))
				{
					ctx.fillRect(currX,currY, 1,1);
					focalPointsCount++;
				}
					
			}
			
			
		}
		
	}
	/*var xtest = 10;
	var ytest = -10;
	console.log("angle: " + Math.atan2(ytest, xtest));
	ctx.fillRect(xtest,ytest, 5,5);*/
	
	focalCoeff = focalPointsCount / diskPointsCount;
	console.log("coeffiencient focal: " + focalCoeff);
	
	return focalCoeff;
	
	
	
}


function isFocalPoint(rIntLen, rExtLen, alpha, beta, x, y)
{
	
	/* On commence par convertir x, y en coordonnées polaires */
	var r = Math.sqrt(x*x + y*y); 
	var theta = Math.atan2(y,x);
	
	if(theta <= 0)
		theta += 2*Math.PI;
	
	var tau = (Math.PI - alpha)/2;
	
	
	if(rIntLen <= r && r <= rExtLen && theta <= (Math.PI - tau + beta) && theta >= (tau + beta))
		return true;
	else
		return false;
	
}