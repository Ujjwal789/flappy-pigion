//board
let board
let boardwidth = 360;
let boardheight = 640;
let context ;

//bird
let birdwidth = 44;
let birdheight = 44;
let birdX = boardwidth/8;
let birdY = boardheight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdwidth,
    height : birdheight
}

//Pipe
let PipeArray = [];
let Pipewidth = 64;// use for 1/8 th dimension of pipe
let Pipeheight = 512;
let PipeX = boardwidth;
let PipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physices
let velocityX = -2; //pipe moving left speed
let velocityY = 0;
let gravity = 0.6;

let gameOver = false;
let score = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d");// use for drawing on the borad

    //draw flappy bird practice with green squre
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height)

    //load img
    birdImg = new Image();
    birdImg.src = "./flappybird.png"
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)

    }

    //Pipe img
    topPipeImg = new Image();
    topPipeImg.src ="./toppipe.png"
    
    bottomPipeImg = new Image();
    bottomPipeImg.src ="./bottompipe.png"
       
    requestAnimationFrame(update);
    setInterval(placePipes, 1500);//every 1.5 second
    document.addEventListener("keydown", moveBird);

   

}


function update(){
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, boardwidth, boardheight);

    //bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y  = Math.max(bird.y + velocityY, 0);  // maximum upperside of borad
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height){
        gameOver = true;
    }

    //pipes
    for( let i= 0; i < PipeArray.length; i++){
        let Pipe = PipeArray[i];
        Pipe.x += velocityX;
        context.drawImage(Pipe.img, Pipe.x, Pipe.y, Pipe.width, Pipe.height);

        if(!Pipe.passed && bird.x > Pipe.x + Pipe.width){
            score += 0.5;
            Pipe.passed = true; 
        }

        if (detectcollision(bird, Pipe)){
            gameOver = true;
        }
        
      //clear pipes 
    while(PipeArray.length > 0 && PipeArray [0].x < -Pipewidth){
        PipeArray.shift(); // remove pipe when it touch first side
    }

    }

     //score
     context.fillStyle = "black";
     context.font = "45px sans-serif";
     context.fillText( score, 5, 45);

     if(gameOver){
        context.fillText("GAME OVER", 5,90);
     }
 
}

function placePipes(){
     
    if(gameOver){
        return;
    }

    //(0-1) *pipeheight/2
    //(0) -> 128 pipeheight/4 
    //(0-1) -> 128-256 pipeheight/4 

    let randomPipey =  PipeY -Pipeheight/4 -Math.random()*(Pipeheight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : PipeX,
        y : randomPipey ,
        width: Pipewidth,
        height: Pipeheight,
        passed : false

    }

    PipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : PipeX,
        y : randomPipey + Pipeheight + openingSpace ,
        width: Pipewidth,
        height: Pipeheight,
        passed : false

    }

    PipeArray.push(bottomPipe);
}
 
function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        velocityY = -6;

        if(gameOver){
            bird.y = birdY;
            PipeArray  = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectcollision(a, b){
    return a.x < b.x + b.width &&  
           a.x + a.width > b.x &&
           a.y < b.y + b.height&&
           a.y + a.height > b.y;

}