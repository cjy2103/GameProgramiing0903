(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
  

var Game = new function() {
       //게임 실행을 위해 만든 함수                                                              
  var boards = [];

  // Game Initialization
    this.initialize = function(canvasElementId,sprite_data,callback) {
    this.canvas = document.getElementById(canvasElementId); //ID 호출 : canvas에 그림들이   

    this.playerOffset = 10;
    this.canvasMultiplier= 1;
    this.setupMobile();

    this.width = this.canvas.width;
    this.height= this.canvas.height;

    this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
    if(!this.ctx) { return alert("Please upgrade your browser to play"); }

    this.setupInput();

    this.loop(); 

    if(this.mobile) {
      this.setBoard(4,new TouchControls());
    }

    SpriteSheet.load(sprite_data,callback);
  };      //모바일 환경에서도 실행 가능하게 한다. 
  

  // Handle Input
  var KEY_CODES = { 37:'left', 39:'right', 32 :'fire', 38: 'up', 40: 'down' };  //움직임 
  this.keys = {};

  this.setupInput = function() {
    window.addEventListener('keydown',function(e) {
      if(KEY_CODES[e.keyCode]) {
       Game.keys[KEY_CODES[e.keyCode]] = true;
       e.preventDefault();
      }
    },false);

    window.addEventListener('keyup',function(e) {
      if(KEY_CODES[e.keyCode]) {
       Game.keys[KEY_CODES[e.keyCode]] = false; 
       e.preventDefault();
      }
    },false);
  };


  var lastTime = new Date().getTime();
  var maxTime = 1/30;     //최대 시간 30초  30초가 지나면 게임을 종료한다. 
  // Game Loop
  this.loop = function() { 
    var curTime = new Date().getTime();
    requestAnimationFrame(Game.loop);
    var dt = (curTime - lastTime)/1000;
    if(dt > maxTime) { dt = maxTime; }

    for(var i=0,len = boards.length;i<len;i++) {
      if(boards[i]) { 
        boards[i].step(dt);
        boards[i].draw(Game.ctx);
      }
    }
    lastTime = curTime;
  };
   
  // Change an active game board
  this.setBoard = function(num,board) { boards[num] = board; }; //보드 세팅 번호에 맞는 보드들 (게임시작,게임종료)


  this.setupMobile = function() {     //화면 출력 
    var container = document.getElementById("container"),
        hasTouch =  !!('ontouchstart' in window),
        w = window.innerWidth, h = window.innerHeight;
      
    if(hasTouch) { this.mobile = true; }    //화면에 띄운다. 

    if(screen.width >= 1280 || !hasTouch) { return false; }   

    if(w > h) {
      alert("Please rotate the device and then click OK");
      w = window.innerWidth; h = window.innerHeight;
    }

    container.style.height = h*2 + "px";
    window.scrollTo(0,1);

    h = window.innerHeight + 2;
    container.style.height = h + "px";
    container.style.width = w + "px";
    container.style.padding = 0;

    if(h >= this.canvas.height * 1.75 || w >= this.canvas.height * 1.75) {
      this.canvasMultiplier = 2;
      this.canvas.width = w / 2;
      this.canvas.height = h / 2;
      this.canvas.style.width = w + "px";
      this.canvas.style.height = h + "px";
    } else {
      this.canvas.width = w;
      this.canvas.height = h;
    }

    this.canvas.style.position='absolute';
    this.canvas.style.left="0px";
    this.canvas.style.top="0px";

  };

};  // var Game 함수 종료 


var SpriteSheet = new function() {  //이미지들 로드 하는 함수 
  this.map = { };   //맵으로 구성 

  this.load = function(spriteData,callback) { 
    this.map = spriteData;
    this.image = new Image();
    this.image.onload = callback;
    this.image.src = 'images/sprites.png';
  };

  this.draw = function(ctx,sprite,x,y,frame) {
    var s = this.map[sprite];
    if(!frame) frame = 0;
    ctx.drawImage(this.image,
                     s.sx + frame * s.w, 
                     s.sy, 
                     s.w, s.h, 
                     Math.floor(x), Math.floor(y),
                     s.w, s.h);
  };

  return this;
};

var TitleScreen = function TitleScreen(title,subtitle,callback) {   //타이틀 화면 글들을 띄우고 스페이스바 입력시 게임 시작을 하게 하는 함수 
  var up = false;
  
  this.step = function(dt) {
    if(!Game.keys['fire']) up = true;
    if(up && Game.keys['fire'] && callback) callback(); //fire 가 스페이스바로 설정 되있기 때문에 스페이스바 누르면 게임시작한다.

  };

  this.draw = function(ctx) {
    ctx.fillStyle = "#FFFFFF";

    ctx.font = "bold 40px bangers";
    var measure = ctx.measureText(title);  
    ctx.fillText(title,Game.width/2 - measure.width/2,Game.height/2);

    ctx.font = "bold 20px bangers";
    var measure2 = ctx.measureText(subtitle);
    ctx.fillText(subtitle,Game.width/2 - measure2.width/2,Game.height/2 + 40);
  };
};
var loopBack = function() {
  this.currentTime = 0;
  this.play();
}
var GameBoard = function() {  //게임 시작시 적들을 생성,유저 생성, 미사일 등등의 객채들을 생성하기 위해 작성한 함수 
  var board = this;   
    
    if (gameVars.music.enabled) {
    
      if (gameVars.music.bg instanceof Audio) {
      gameVars.music.bg.pause();
    }

    gameVars.music.bg = new Audio(document.getElementById(gameVars.music.track).src);
    gameVars.music.bg.play();
    gameVars.music.bg.addEventListener('ended', loopBack, false);
  }

  // 현재 리스트의 오브젝트들 
  this.objects = [];
  this.cnt = {};

  // 새로운 오브젝트가 추가될때 오브젝트를 추가한다. 
  this.add = function(obj) { 
    obj.board=this; 
    this.objects.push(obj); 
    this.cnt[obj.type] = (this.cnt[obj.type] || 0) + 1;
    return obj; 
  };

  // 삭제될 오브젝트들 마크 
  this.remove = function(obj) {   //객체가 제거되었을때 응답들 (적이 제거되면 제거되는 이벤트 등등.. )
    var idx = this.removed.indexOf(obj);
    if(idx == -1) {
      this.removed.push(obj); 
      return true;
    } else {
      return false;
    }
  };

  // 제거된 객체들의 리스트 리셋  
  this.resetRemoved = function() { this.removed = []; };  // -> 리셋을 위한 배열 

  // 목록에서 제거대상으로 마크된 객체들 제거 
  this.finalizeRemoved = function() {       
    for(var i=0,len=this.removed.length;i<len;i++) {
      var idx = this.objects.indexOf(this.removed[i]);
      if(idx != -1) {
        this.cnt[this.removed[i].type]--;
        this.objects.splice(idx,1);
      }
    }
  };

  // 현재 객체에서 같은 모든 메서드들 호출 
  this.iterate = function(funcName) {
     var args = Array.prototype.slice.call(arguments,1);
     for(var i=0,len=this.objects.length;i<len;i++) {
       var obj = this.objects[i];
       obj[funcName].apply(obj,args);
     }
  };

  //func 변수가 참인 첫번째 객체를 찾는다.
  this.detect = function(func) {
    for(var i = 0,val=null, len=this.objects.length; i < len; i++) {
      if(func.call(this.objects[i])) return this.objects[i];
    }
    return false;
  };

  // 객체에서 모든 스텝을 호출하면 제거대상으로 마크된 모든 객체 삭제 
  this.step = function(dt) { 
    this.resetRemoved();
    this.iterate('step',dt);
    this.finalizeRemoved();
  };

  // 모든 객체를 그린다.
  this.draw= function(ctx) {
    this.iterate('draw',ctx);
  };

  // 두 객체 사이의 경계사이의 충돌(매칭)이 발생하는지 확인
  this.overlap = function(o1,o2) {
    return !((o1.y+o1.h-1<o2.y) || (o1.y>o2.y+o2.h-1) ||
             (o1.x+o1.w-1<o2.x) || (o1.x>o2.x+o2.w-1));
  };

  // 첫번째로 매칭이 되는 오브젝트를 찾는다.
  this.collide = function(obj,type) {
    return this.detect(function() {
      if(obj != this) {
       var col = (!type || this.type & type) && board.overlap(obj,this);
       return col ? this : false;
      }
    });
  };


};

var Sprite = function() { };  // 이미지들 삽입 

Sprite.prototype.setup = function(sprite,props) {
  this.sprite = sprite;
  this.merge(props);
  this.frame = this.frame || 0;
  this.w =  SpriteSheet.map[sprite].w;
  this.h =  SpriteSheet.map[sprite].h;
};

Sprite.prototype.merge = function(props) {
  if(props) {
    for (var prop in props) {
      this[prop] = props[prop];
    }
  }
};

Sprite.prototype.draw = function(ctx) {
  SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame);
};
Sprite.prototype.hit = function(damage) {
  this.board.remove(this);
};


var Level = function(levelData,callback) {    //레벨 단계 
  this.levelData = [];

  for(var i =0; i<levelData.length; i++) {
    this.levelData.push(Object.create(levelData[i]));
  }
  this.t = 0;
  this.callback = callback;

};    

Level.prototype.step = function(dt) { // 레벨 단계 설정 
  var idx = 0, remove = [], curShip = null;

  // 현재시간 업데이트 
  this.t += dt * 1000;

  //   Start, End,  Gap, Type,   Override
  // [ 0,     4000, 500, 'step', { x: 100 } ]
  while((curShip = this.levelData[idx]) && 
        (curShip[0] < this.t + 2000)) {
    // 종료시간이 끝낫는지 확인  
    if(this.t > curShip[1]) {
      remove.push(curShip);
    } else if(curShip[0] < this.t) {
      // 적에대한 것들을 그린다. 
      var enemy = enemies[curShip[3]],
          override = curShip[4];

      // 새로운 적들 추가 
      this.board.add(new Enemy(enemy,override));

      // gap에 따른 시작시간을 늘림 
      curShip[0] += curShip[2];
    }
    idx++;
  }

  //전달된 leveldata 에서 모든 객체를 삭제 
  for(var i=0,len=remove.length;i<len;i++) {
    var remIdx = this.levelData.indexOf(remove[i]);
    if(remIdx != -1) this.levelData.splice(remIdx,1);
  }

  // 보드안에 적이 더이상 없다면 이번단계의 레벨은 종료 (게임이 끝낫다. 다음레벨로 간다..)
  if(this.levelData.length === 0 && this.board.cnt[OBJECT_ENEMY] === 0) {
    if(this.callback) this.callback();
  }

};

Level.prototype.draw = function(ctx) { };


var TouchControls = function() {    // 이 부분은 데스크 탑 이면 의미 없는 부분 핸드폰 으로 할때 의미있음 

  var gutterWidth = 10;
  var unitWidth = Game.width/5;
  var blockWidth = unitWidth-gutterWidth;

  this.drawSquare = function(ctx,x,y,txt,on) {
    ctx.globalAlpha = on ? 0.9 : 0.6;
    ctx.fillStyle =  "#CCC";
    ctx.fillRect(x,y,blockWidth,blockWidth);

    ctx.fillStyle = "#FFF";
    ctx.globalAlpha = 1.0;
    ctx.font = "bold " + (3*unitWidth/4) + "px arial";

    var txtSize = ctx.measureText(txt);

    ctx.fillText(txt, 
                 x+blockWidth/2-txtSize.width/2, 
                 y+3*blockWidth/4+5);
  };

  this.draw = function(ctx) {
    ctx.save();

    var yLoc = Game.height - unitWidth;
    this.drawSquare(ctx,gutterWidth,yLoc,"\u25C0", Game.keys['left']);
    this.drawSquare(ctx,unitWidth + gutterWidth,yLoc,"\u25B6", Game.keys['right']);
    this.drawSquare(ctx,4*unitWidth,yLoc,"A",Game.keys['fire']);

    ctx.restore();
  };

  this.step = function(dt) { };

    this.trackTouch = function(e) {
    var touch, x;

    e.preventDefault();
    Game.keys['left'] = false;
    Game.keys['right'] = false;
    for(var i=0;i<e.targetTouches.length;i++) {
      touch = e.targetTouches[i];
      x = touch.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft;
      if(x < unitWidth) {
        Game.keys['left'] = true;
      } 
      if(x > unitWidth && x < 2*unitWidth) {
        Game.keys['right'] = true;
      } 
    }

    if(e.type == 'touchstart' || e.type == 'touchend') {
      for(i=0;i<e.changedTouches.length;i++) {
        touch = e.changedTouches[i];
        x = touch.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft;
        if(x > 4 * unitWidth) {
          Game.keys['fire'] = (e.type == 'touchstart');
        }
      }
    }
  };

  Game.canvas.addEventListener('touchstart',this.trackTouch,true);
  Game.canvas.addEventListener('touchmove',this.trackTouch,true);
  Game.canvas.addEventListener('touchend',this.trackTouch,true);

  // For Android
  Game.canvas.addEventListener('dblclick',function(e) { e.preventDefault(); },true);
  Game.canvas.addEventListener('click',function(e) { e.preventDefault(); },true);

  Game.playerOffset = unitWidth + 20;
};
    

var GamePoints = function() {   // 점수판 
  Game.points = 0;

  var pointsLength = 8;

  this.draw = function(ctx) {
    ctx.save();
    ctx.font = "bold 18px arial";
    ctx.fillStyle= "#FFFFFF";

    var txt = "" + Game.points;
    var i = pointsLength - txt.length, zeros = "";
    while(i-- > 0) { zeros += "0"; }

    ctx.fillText(zeros + txt,10,20);
    ctx.restore();

  };

  this.step = function(dt) { };
};

