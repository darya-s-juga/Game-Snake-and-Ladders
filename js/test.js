 // model

 // поле
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
    let canvas=document.getElementById('canvas');
    let ctx = canvas.getContext("2d");
    var x=0;
    var y=0;
    ctx.drawImage(this.img, x, y, canvas.width, canvas.height);
}

// лестницы и змеи
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
    let canvas=document.getElementById('canvas');
    let ctx = canvas.getContext("2d");  
    var snY=this.y;
    var snX=this.x;
    var snW=this.width;
    var snH=this.height;
    ctx.drawImage(this.img, snX, snY, snW, snH);
}


// фишки
class Chips {
    constructor(select){
    this.select=select;
    this.MLeft=0;
    this.MTop=0;
    this.score=0;
    this.bonus=false;
    this.win=false;
    this.myView=null;
    }
    // let myView=null;
     

    start(view){
        let myView=view;
        this.timer=requestAnimationFrame( () => myView.drawChip(),1000 );
    }

    updateView(){
        if (this.myView)
        myView.drawChip();
    }

    addScore(){
        document.querySelector('.blossom' + this.myModel.select).innerHTML=this.id;
        document.querySelector('.score' + this.myModel.select).innerHTML=this.score;
    }

    setScore(){
        score=this.score+10;
        this.myView.update();
    }

    setWin(){
        if (this.win=true)
        this.myView.update();
    }
   
    get marginLeft(){
        return Number(myPlayers.style.marginLeft.split('v')[0]);
    }
    
    get marginTop(){
        return Number(myPlayers.style.marginTop.split('v')[0]);
    }
}


// view
class ViewWebPage {
    constructor(){
    this.myModelChips=null;// с какой моделью работаем
    this.modelGround=null;
    this.modelSnakesLadders;

    this.myPlayers = null; //сама фишка
    this.myField = null; // внутри какого элемента DOM наша вёрстка
    this.score = null; // 
    this.myDice = null; 
    }

    start(model,field) {
    
        let myModelChips=model;
        let myField=field;
        let myPlayers=player;   
        this.timer=requestAnimationFrame( () => this.drawChip(),1000 );
    }

    drawChip(){       
        this.myPlayers.style.marginLeft=this.myModelChips.MLeft + 'vmin';
        this.myPlayers.style.marginTop=this.myModelChips.MTop + 'vmin';  
        this.myModel.score=this.score;
    }

    get changeTurn(){
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

    move(direction){
        return new Promise(async(resolve,reject) => {
            new Audio('./sound/magicstep.mp3').play();
            if (direction=='up'){
                this.myPlayers.style.marginTop = String(marginTop()-8.1)+'vmin';
            }
            else if (direction=='right') {
                this.myPlayers.style.marginLeft = String(marginLeft()+8.1) + 'vmin';
            }
            else if(direction=='left') {
                this.myPlayers.style.marginLeft = String(marginLeft()- 8.1) + 'vmin';
            }
            await new Promise(resolve => setTimeout(resolve,400));
            resolve();
        })
    }
}

// controller
class ConrollerPlay {
    constructor(){
        this.myPlayers=null;
        this.myField=null;
        this.myDice=null;
        this.stopEvent = false;
    }
    resize_canvas(){
        if (canvas.width < window.innerWidth)
        {
            canvas.width  = window.innerWidth;
        }

        if (window.innerHeight < canvas.height)
        {
            canvas.height = window.innerHeight;
        }
    }

    start(player,field,dice) {
        this.myPlayers=player;
        this.myField=field;
        this.myDice=dice;
        let cubeRoll=document.querySelector('.cube');
        cubeRoll.addEventListener('click', this.game);
    }

    controlButtonMenu(){
        let buttonPlay=document.querySelector('.button_play');
        buttonPlay.addEventListener('click', this.onGame);

        let buttonExit=document.querySelector('.button_exit');
        buttonExit.addEventListener('click', this.offGame);

    }
    onGame(){
        let searchMenu=document.querySelector('.wrapper');
        searchMenu.style.display='none';
    
        let searchGame=document.getElementById('wrapper_game');
        searchGame.style.visibility='visible';
    }    
   
    get roll(){
        return new Promise(async(resolve,reject) => {
            let diceNum= Math.floor(Math.random() * 6) + 1;
            new Audio('./sound/roll.mp3').play();   
            let values = [[0,-360],[-180,-360],[-180,270],[0,-90],[270,180],[90,90]];
            document.querySelector('#cube_inner').style.transform = `rotateX(360deg) rotateY(360deg)`;
            await new Promise(resolve => setTimeout(resolve, 750));
            document.querySelector('#cube_inner').style.transform = `rotateX(${values[diceNum-1][0]}deg) rotateY(${values[diceNum-1][1]}deg)`;
            await new Promise(resolve => setTimeout(resolve, 750));

            resolve(diceNum);
        });
    }

    get checkBonus(){
        return new Promise(async(resolve, reject) => {
            let fromSnakeUp=[[64.8,-8.1], [24.3,-8.1], [48.6,-16.2], [32.4,-32.4], [56.7,-40.5], [32.4,-56.7], [64.8,-64.8]];
            let toSnakeUp=[[48.6,-24.3], [8.1,-24.3], [64.8,-16.2], [48.6,-32.4], [48.6,-56.7], [16.2,-56.7], [56.7,-72.9]];
            let fromLedderDown=[[8.1,-16.2],[32.4,-16.2], [24.3,-40.5], [8.1,-48.6], [72.9,-64.8], [40.5,-72.9], [8.1, -72.9]];
            let toLedderDown=[[8.1,-8.1],[32.4,0], [24.3,-24.3], [8.1,-40.5], [72.9,-32.4], [40.5, -64.8], [8.1, -64.8]];
            for(let a=0; a<toSnakeUp.length; a++){
                if ( marginLeft()==fromSnakeUp[a][0] && marginTop()==fromSnakeUp[a][1] ){
                    new Audio('./sound/up.mp3').play();
                    document.querySelector(`#${turn}`).style.marginLeft=`${toSnakeUp[a][0]}vmin`;
                    document.querySelector(`#${turn}`).style.marginTop=`${toSnakeUp[a][1]}vmin`;
                    await new Promise(resolve => setTimeout(resolve,400));
                    break;
                }
            }
            for(let a=0; a<toLedderDown.length; a++){
                if ( marginLeft()==fromLedderDown[a][0] && marginTop()==fromLedderDown[a][1] ){
                    new Audio('./sound/down.mp3').play();
                    document.querySelector(`#${turn}`).style.marginLeft=`${toLedderDown[a][0]}vmin`;
                    document.querySelector(`#${turn}`).style.marginTop=`${toLedderDown[a][1]}vmin`;
                    await new Promise(resolve => setTimeout(resolve,400));
                    break;
                }
            }
            resolve();
        })
    }

    get getDirection(){
        let direction;
        if((marginLeft()==72.9 && ((((marginTop()*10)%(-16.2*10))/10)==0)) || (marginLeft()==0 && ((((marginTop()*10)%(-16.2*10))/10)!=0))){
            direction='up';
        }
        else if((((marginTop()*10)%(-16.2*10))/10)==0){
            direction='right';
        }
        else {
            direction='left';
        }
        return direction;
    }  
    

    game(){
        document.addEventListener('click', async(e) => {
            if (e.code=='onclick' && !stopEvent) {
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
                    let diceNumWin=marginLeft() - Number(diceNum*8.1)+ Number((diceNum-(diceNum-1))*8.1);
                    await run(diceNumWin);
                    if (marginLeft()==0 && marginTop()== -72.9) {
                    document.querySelector('#p_turn').innerHTML= `Finish!`;
                    new Audio('./sound/fanfare.mp3').play();
                    await new Promise(resolve => setTimeout(resolve,400)); //WIN
                    
                    stopEvent=false;
                    confirm('Do you want restart?');
                    }
                }
            }
        })
    }

    checkOut(diceNum) {
        let isOut=false;
        if(marginTop()== -72.9 && (marginLeft() + Number((diceNum*-8.1).toFixed(1)))<0){
            isOut=true;
        }
        return isOut;
    }

    run(diceNum){
        return new Promise(async(resolve,reject) => {
            for(let i=1; i<=diceNum; i++){
                let  direction = getDirection();
                await move(direction);
            }
            await checkBonus();
            resolve();
        })
    }
}


// создание объектов
var field =new Ground(canvas,'./img/field.jpg', 0);
var containerElem1=document.getElementById('gamePlayers');

let player1=new Chips('.player1');
let player2= new Chips('.player2');

let snakesladdersA= [
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

let view1=new ViewWebPage();
let controller=new ConrollerPlay();

var containerElem2=document.getElementById('wrapper_game');

// увязываем компоненты друг с другом
    var containerElem3=document.getElementById('side'); 
    player1.start(view1);
    player2.start(view1);

    view1.start(player1, containerElem1);
    view1.start(player2, containerElem1);
    controller.start(player1,player2,snakesladdersA, field, containerElem1, containerElem2, containerElem3);
    controller.controlButtonMenu();
    // инициируем первичное отображение Model во View
    player1.updateView();
    player2.updateView();

        field.drawing();
        for (var i=0; i < snakesladdersA.length; i++){
            snakesladdersA[i].drawing();
        }
    


