//alert("자바 스크립트 대화상자");

var dan = prompt("원하는 단 ",2)
//confirm("참 거짓을 결정하는 대화상자");
//for(var i =2 ; i < 10 ; i++)
//{
	document.write("<br><br>" +dan+"단 <br><br>");
	for(var j = 1; j < 10; j++)
	{
		document.write(dan+" x "+j+" = "+dan*j+"<br>");
	}
	document.writeln("");
//}