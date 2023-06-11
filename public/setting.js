window.onload=function()
{
    var cvs=document.getElementById("canvas");
    var ctx=cvs.getContext("2d");   
	cvsw=cvs.width;
	cvsh=cvs.height;
	var snakew=10;
	var snakeh=10;
	var direction="right";
	var score=0;
	document.addEventListener("keydown",getDirection);
	function getDirection(e)
	{
		if(e.keyCode==37 && direction!="right")
		{
			direction="left";
		}
		else if(e.keyCode==38 && direction!="down")
		{
			direction="up";
		}
		else if(e.keyCode==39 && direction!="left")
		{
			direction="right";
		}
		else if(e.keyCode==40 && direction!="up")
		{
			direction="down";
		}
	}
	function drawsnake(x,y)
	{
		ctx.fillStyle="yellow";
		ctx.fillRect(x*snakew, y*snakeh, snakew, snakeh);
		ctx.fillStyle="black";
		ctx.strokeRect(x*snakew, y*snakeh, snakew, snakeh);
		ctx.fill();
	}
	var len=4;
	var snake=[];
	for(var i=len-1;i>=0;i--)
	{
		snake.push({x:i,y:0});
	}
	var food={
		x:Math.round((Math.random()*(cvsw/snakew-1))+1),
		y:Math.round((Math.random()*(cvsh/snakeh-1))+1)
	}
	function drawfood(x,y)
	{
		ctx.fillStyle="red";
		ctx.fillRect(x*snakew, y*snakeh, snakew, snakeh);
		ctx.fillStyle="black";
		ctx.strokeRect(x*snakew, y*snakeh, snakew, snakeh);
		ctx.fill();
	}	
	function checkCollision(x,y,array)
	{
		for(var i=0;i<array.length;i++)
		{
		    if(x==array[i].x && y==array[i].y)
		    {
				return true;
			}
		}
	return false;
	}
	function drawScore(x)
	{
		ctx.fillStyle="white";
		ctx.font="20px";
		ctx.fillText("score: "+x,5,cvsh-5);
	}
	function draw()
	{
		ctx.clearRect(0,0,cvsw,cvsh);
		for(var i=0;i<snake.length;i++)
		{
			var x=snake[i].x;
			var y=snake[i].y;
			drawsnake(x,y);
		}
		drawfood(food.x,food.y);
		var snakex=snake[0].x;
		var snakey=snake[0].y;
		if(direction=="left") snakex--;
		else if(direction=="up") snakey--;
		else if(direction=="right") snakex++;
		else if(direction=="down") snakey++;
                if(snakex<0 || snakey<0|| snakex>=cvsw/snakew || snakey>=cvsh/snakeh || checkCollision(snakex, snakey, snake))
		{
			var xml = new XMLHttpRequest();
			xml.onreadystatechange = function() {
				if( this.readyState === 4 && this.status === 200 ) {
				}
			}
			
            xml.open( 'POST', '/postscore', true );
            xml.setRequestHeader( 'Content-Type',  'application/json')
			xml.send( '{"score":' + score + '}' );
		    clearInterval(canvas);
		}
		if(snakex==food.x && snakey==food.y)
		{
			food={
				x: Math.round((Math.random()*(cvsw/snakew-1))+1),
				y: Math.round((Math.random()*(cvsh/snakeh-1))+1)
			}
			var newhead={
				x: snakex,
				y: snakey
			};
			score++;
		}
		else{
			snake.pop();
			var newhead={
				x: snakex,
				y: snakey
			};
		   
			
		}
snake.unshift(newhead);
		    drawScore(score);

	}
		
	let canvas=setInterval(draw,100);	
};

