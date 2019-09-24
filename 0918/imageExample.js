var imgWarrior = new Image();
imgWarrior.src = "warrior.png";
imgWarrior.addEventListener("load", drawScreen, false);

function drawScreen()
{
	var theCanvas = document.getElementById("GameCanvas");
	var Context = theCanvas.getContext("2d");

	Context .fillStyle ="#000000";
	Context .fillRect(0,0,400,300);

	Context.drawImage(imgWarrior,0,0);
}