var my_job = "학생";

switch(my_job)
{
	case "사장":
		money = 100000;
 		break;
 	case "아르바이트생":
 		money = 100000;
 		break;
	case "학생":
		money = 1020000;
 		break;
 	default:
 		money = 100000;
 		break;
};
document.writeln("");
document.writeln("나의 금액은 :"+ money);