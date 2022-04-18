'use strict';

// настройки

 var RAF=
        // находим, какой requestAnimationFrame доступен
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        // ни один не доступен - будем работать просто по таймеру
        function(callback)
            { window.setTimeout(callback, 1000 / 60); }
        ;

function closeWindow(){
	if (confirm('Вы действительно хотите закрыть страницу?')) {
		window.close();
	}
    else return false;
}



 window.onbeforeunload = function() {
     return "Игра будет завершена. Точно перейти?";
   }


var canvas=document.getElementById('canvas');

//функция для изменения размеров поля в соответствии с изменением ширины экрана
function resize_canvas(){
    if (canvas.width < window.innerWidth)
    {
        canvas.width  = window.innerWidth;
    }

    if (window.innerHeight < canvas.height)
    {
        canvas.height = window.innerHeight;
    }
}


var ctx = canvas.getContext("2d");

//коструктор построения игрового поля
class Ground {
    constructor(name,src, y){
        this.name=name;
        this.x=0;
        this.y=y;
        this.img = new Image;
        this.img.src = src;
    }

    Init = function (canvas) {
        if (canvas != null && canvas != undefined) {
            this.ctx = canvas.getContext("2d");
        }
    }
}

Ground.prototype.drawing = function() {
    var x=0;
    var y=0;
    ctx.drawImage(this.img, x, y, canvas.width, canvas.height);
};

// построение дополнительных элементов игры - змеи и лестницы
class SnakeLadders {
    constructor(name, src, x, y, width, height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.name=name;
        this.img=new Image();
        this.img.src= src;
    }
}

SnakeLadders.prototype.drawing = function() {
    var snY=this.y;
    var snX=this.x;
    var snW=this.width;
    var snH=this.height;
    ctx.drawImage(this.img, snX, snY, snW, snH);
    };

    var field =new Ground(canvas,'./img/field.jpg', 0);
    window.onload = update;
    
var snakesladdersA= [
    new SnakeLadders('snake2','./img/s2.png', 120, 360, 130, 130),
    new SnakeLadders('snake3','./img/s3.png', 350, 180, 150, 150),
    new SnakeLadders('snake4','./img/s4.png', 408, 60, 80, 90),
    new SnakeLadders('snake5','./img/s5.png', 350, 350, 150, 150),
    new SnakeLadders('snake7','./img/s7.png', 250, 250, 150, 150),
    new SnakeLadders('snake8','./img/s8.png', 150, 100, 150, 150),
    new SnakeLadders('snake8','./img/s2.png', 350, 350, 150, 150),
    new SnakeLadders('ladder1','./img/ladder1.png', 110, 60, 25, 75),
    new SnakeLadders('ladder2','./img/ladder1.png', 510, 120, 25, 200),
    new SnakeLadders('ladder3','./img/ladder1.png', 210, 260, 25, 130),
    new SnakeLadders('ladder4','./img/ladder1.png', 260, 410, 25, 130),
    new SnakeLadders('ladder5','./img/ladder1.png', 110, 210, 25, 80),
    new SnakeLadders('ladder6','./img/ladder1.png', 110, 410, 25, 80),
    new SnakeLadders('ladder7','./img/ladder1.png', 310, 60, 25, 80)
];

// игроки
let player1H={
    mLeft: 0,
    mTop: 0,
    updatePlayer1: function(){
        var player1=document.querySelector('.player1');
        player1.style.marginLeft=this.mLeft + 'vmin';
        player1.style.marginTop=this.mTop + 'vmin';
        player1.setAttribute('id', 'gray');
    }
}

let player2H={
    mLeft: 0,
    mTop: 0,
    updatePlayer2: function(){
        var player2=document.querySelector('.player2');
        player2.style.marginLeft=this.mLeft + 'vmin';
        player2.style.marginTop=this.mTop + 'vmin';
        player2.setAttribute('id', 'green');
    }
}

// начало игры




function onGame(){
    let searchMenu=document.querySelector('.menu');
    searchMenu.style.display='none';

    let searchGame=document.getElementById('wrapper_game');
    searchGame.style.visibility='visible';
    update();
}    
    player1H.updatePlayer1();
    player2H.updatePlayer2();

function update(){
    field.drawing();
    for (var i=0; i < snakesladdersA.length; i++){
        snakesladdersA[i].drawing();
    }
    RAF(update); 
}


let turn = 'gray';
let stopEvent = false;

// тачскрин -бросок кубика
let TouchEl=document.getElementById('side');
TouchEl.addEventListener('touchstart', checkTouch, false);
 
function checkTouch(){
 if ( !stopEvent)
      GoRoll();
}

// бросок кубика - нажатие клавиши S
document.addEventListener('keydown', checkKey, false);
function checkKey(e){
      if (e.code=='KeyS' && !stopEvent) 
      GoRoll();
}


// бросок кубика

async function GoRoll(){
        stopEvent = true;
        let diceNum = await roll();
        let isOut= checkOut(diceNum);
        await new Promise(resolve => setTimeout(resolve,400)); //before run
        if(!isOut){
            await run(diceNum);
            await new Promise(resolve => setTimeout(resolve,400)); //after run
            changeTurn();
            stopEvent=false;
        }
        else if(isOut) {
             let diceNumWin=marginLeft() - Number(diceNum*6.1)+ Number((diceNum-(diceNum-1))*6.1);
             await run(diceNumWin);
                 if (marginLeft()==0 && marginTop()== -54.9) {
                 document.querySelector('#p_turn').innerHTML= `Finish!`;
                 if (!mute) {new Audio('./sound/fanfare.mp3').play();}
                 await new Promise(resolve => setTimeout(resolve,400)); //WIN
                
                 stopEvent=false;
                 var finishGame= confirm('Начать сначала?');
                     if (finishGame){
                        restart();
                     }
                     else {
                        closeWindow();
                     }
                 }
        }
    }



function restart(){
    document.querySelector('#gray').style.marginLeft= '0vmin';
    document.querySelector('#gray').style.marginTop= '0vmin';
    document.querySelector('#green').style.marginLeft= '0vmin';
    document.querySelector('#green').style.marginTop= '0vmin';
    turn ='gray';
    document.querySelector('#p_turn').innerHTML = "gray player's turn";
}

function checkOut(diceNum) {
    let isOut=false;
    if(marginTop()== -54.9 && (marginLeft() + Number((diceNum*-6.1).toFixed(1)))<0){
        isOut=true;
    }
    return isOut;
}

function changeTurn(){
    if (turn == 'green') {
        document.querySelector('#p_turn').innerHTML = "gray player's turn";
        turn= 'gray';
    }
    else if (turn == 'gray') {
        document.querySelector('#p_turn').innerHTML = "green player's turn";
        turn= 'green';
    }
    return turn;
}


function run(diceNum){
    return new Promise(async(resolve,reject) => {
        for(let i=1; i<=diceNum; i++){
            let  direction = getDirection();
            await move(direction);
        }
        await checkBonus();
        resolve();
    })
}

function checkBonus(){
    return new Promise(async(resolve, reject) => {
        let fromSnakeUp=[[48.8,-6.1], [18.3,-6.1], [36.6,-12.2], [24.4,-24.4], [42.7,-30.5], [24.4,-42.7], [48.8,-48.8]];
        let toSnakeUp=[[36.6,-18.3], [6.1,-18.3], [48.8,-12.2], [36.6,-24.4], [36.6,-42.7], [12.2,-42.7], [42.7,-54.9]];
        let fromLedderDown=[[6.1,-12.2],[24.4,-12.2], [18.3,-30.5], [6.1,-36.6], [54.9,-48.8], [30.5,-54.9], [6.1, -54.9]];
        let toLedderDown=[[6.1,-6.1],[24.4,0], [18.3,-18.3], [6.1,-30.5], [54.9,-24.4], [30.5, -48.8], [6.1, -4.8]];
        for(let a=0; a<toSnakeUp.length; a++){
            if ( marginLeft()==fromSnakeUp[a][0] && marginTop()==fromSnakeUp[a][1] ){
                if (!mute) {new Audio('./sound/up.mp3').play();}
                document.querySelector(`#${turn}`).style.marginLeft=`${toSnakeUp[a][0]}vmin`;
                document.querySelector(`#${turn}`).style.marginTop=`${toSnakeUp[a][1]}vmin`;
                await new Promise(resolve => setTimeout(resolve,400));
                break;
            }
        }
        for(let a=0; a<toLedderDown.length; a++){
            if ( marginLeft()==fromLedderDown[a][0] && marginTop()==fromLedderDown[a][1] ){
                if (!mute) {new Audio('./sound/down.mp3').play();}
                document.querySelector(`#${turn}`).style.marginLeft=`${toLedderDown[a][0]}vmin`;
                document.querySelector(`#${turn}`).style.marginTop=`${toLedderDown[a][1]}vmin`;
                await new Promise(resolve => setTimeout(resolve,400));
                break;
            }
        }
        resolve();
    })
}

function move(direction){
    return new Promise(async(resolve,reject) => {
        if (!mute) {new Audio('./sound/magicstep.mp3').play();}
        if (direction=='up'){
            document.querySelector(`#${turn}`).style.marginTop = String(marginTop()-6.1)+'vmin';
        }
        else if (direction=='right') {
            document.querySelector(`#${turn}`).style.marginLeft = String(marginLeft()+6.1) + 'vmin';
        }
        else if(direction=='left') {
            document.querySelector(`#${turn}`).style.marginLeft = String(marginLeft()- 6.1) + 'vmin';
        }
        await new Promise(resolve => setTimeout(resolve,400));
        resolve();
    })
}

function getDirection(){
    let direction;
    if((marginLeft()==54.9 && ((((marginTop()*10)%(-12.2*10))/10)==0)) || (marginLeft()==0 && ((((marginTop()*10)%(-12.2*10))/10)!=0))){
        direction='up';
    }
    else if((((marginTop()*10)%(-12.2*10))/10)==0){
        direction='right';
    }
    else {
        direction='left';
    }
    return direction;
}    

function marginLeft(){
    return Number(document.querySelector(`#${turn}`).style.marginLeft.split('v')[0]);
}

function marginTop(){
    return Number(document.querySelector(`#${turn}`).style.marginTop.split('v')[0]);
}

function roll(){
    return new Promise(async(resolve,reject) => {
        let diceNum= Math.floor(Math.random() * 6) + 1;
        vibro(true);
        if (!mute) {new Audio('./sound/roll.mp3').play();}
        let values = [[0,-360],[-180,-360],[-180,270],[0,-90],[270,180],[90,90]];
        document.querySelector('#cube_inner').style.transform = `rotateX(360deg) rotateY(360deg)`;
        await new Promise(resolve => setTimeout(resolve, 750));
        document.querySelector('#cube_inner').style.transform = `rotateX(${values[diceNum-1][0]}deg) rotateY(${values[diceNum-1][1]}deg)`;
        await new Promise(resolve => setTimeout(resolve, 750));

        resolve(diceNum);
    })
}

RAF(update); 


//звуки в игре
let mute=false;

function switchMute() {
    if (!mute){
        let muteOff=document.querySelector('.pic_muteOff');
        muteOff.style.display='none';
        let muteOn=document.querySelector('.pic_muteOn');
        muteOn.style.display='inline';
        mute=true;
    }
    else {
        mute=false; 
        let muteOn=document.querySelector('.pic_muteOn');
        muteOn.style.display='none';
        let muteOff=document.querySelector('.pic_muteOff');
        muteOff.style.display='inline';
    }
    return mute; 
}

//виброотклик
    function vibro(longFlag) {
        if ( navigator.vibrate ) { // есть поддержка Vibration API?
            
                window.navigator.vibrate(100); // вибрация 100мс
          
        }
    }

