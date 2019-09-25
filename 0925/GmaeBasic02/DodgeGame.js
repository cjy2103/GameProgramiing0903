window.addEventListener("load", drawScreen, false);
window.addEventListener("keydown", onkeydown, true);

var imgBackground = new Image();
imgBackground.src = "img/background.png";
imgBackground.addEventListener("load", drawScreen, false);

var imgPlayer = new Image();
imgPlayer.src = "img/player.png";
imgPlayer.addEventListener("load", drawScreen, false);


var intPlayerX = 350;
var intPlayerY = 250;

function drawScreen()
{
	var theCanvas	=	document.getElementById("GameCanvas");
	var Context = theCanvas.getContext("2d");

	Context.fillStyle	=	"#000000";
	Context.fillRect(0,0,800,600);

	//배경 화면 그리기
	Context.drawImage(imgBackground,0,0);

	//플레이어 그리기
	Context.drawImage(imgPlayer, intPlayerX, intPlayerY);

}

function onkeydown(e)
{
	switch ( e.keyCode )
	{
		case 37: //LEFT
		intPlayerX -= 5;
		if( intPlayerX < 0)
		{
			intPlayerX = 0
		}
		break;
		case 39: //RIGHT
		intPlayerX += 5;
		if(intPlayerX>740)
		{
			intPlayerX =740
		}
		break;
		case 38: //UP
		intPlayerY -= 5;
		if(intPlayerY < 0)
		{
			intPlayerY = 0;
		}
		break;
		case 40: //DOWN
		intPlayerY += 5;
		if(intPlayerY > 540)
		{
			intPlayerY = 540;
		}
		break;
	};
	//화면 갱신 
	drawScreen();
}


