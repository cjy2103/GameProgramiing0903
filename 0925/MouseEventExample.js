window.addEventListener("load", drawScreen, false);
window.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("mousedown",onMouseDown,false);
window.addEventListener("mouseup", onMouseUp, false);
//onclick, ondbclick, onmousedown, onmouseup, onmousemove, onmouseout
//onmouseover, onmousewheel, onscroll
//button(0: 왼쪽, 1: 휠, 2: 오른쪽 ),포인터 위치의 값 clientX, clientY

var imgIcon = new Image();
imgIcon.src = "icon.png";
imgIcon.addEventListener("load", drawScreen, false);

var bMouseClicked = false;
var intMouseX = 60;
var intMouseY = 60;
var strMouseStatus = "None";

function drawScreen()
{
	var theCanvas = document.getElementById("GameCanvas");
	var Context = theCanvas.getContext("2d");

	Context.fillStyle = "#000000";
	Context.fillRect(0,0,800,600);

	Context.drawImage( imgIcon, intMouseX, intMouseY);

	Context.fillStyle = "#ffffff";
	Context.font = '25px Arial';
	Context.textBaseline = "top";;
	Context.fillText( "발생한 마우스 포인터 : " + strMouseStatus, 5, 5);
	Context.fillText( "마우스 좌표 : x : " +intMouseX + " y : " + intMouseY, 5 ,30);
}

function onMouseMove (e)
{
	// 마우스가 움직일 때 
	strMouseStatus = "Move!!";

	if(bMouseClicked)
	{
		// 마우스가 클릭 상태일 때만
		var theCanvas = document.getElementById("GameCanvas");
		intMouseX = e.clientX - theCanvas.offsetLeft;
		intMouseY = e.clientY - theCanvas.offsetTop;

		//화면 갱신
		drawScreen();
	}
}

function onMouseDown (e)
{
	// 마우스 눌렀을 때
	strMouseStatus = "Down!!";

	var theCanvas = document.getElementById("GameCanvas");
	intMouseX = e.clientX - theCanvas.offsetLeft;
	intMouseY = e.clientY - theCanvas.offsetTop;

	bMouseClicked = true;

	//화면 갱신
	drawScreen();
}

function onMouseUp (e)
{
	//마우스에서 손을 땟을 때
	strMouseStatus = "Up!!";

	bMouseClicked = false;
	intMouseX = 0;
	intMouseY = 0;

	//화면 갱신
	drawScreen();
}
