//Game Constants & Variables
let inputDir = {x: 0, y: 0};
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/bg_music.mp3');
let speed = 10;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    {x: 13, y: 15}
]
food = {x: 6, y: 7};

// Game Functions
function main(curTime){
    window.requestAnimationFrame(main);
    if((curTime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = curTime;
    gameEngine();
}

function isCollide(snake){
    // If you bump into yourself
    for(let i = 1; i < snakeArr.length; i++){
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    // If you bump into the wall
    if(snake[0].x >= 19 || snake[0].x <= 0 || snake[0].y >= 19 || snake[0].y <= 0){
        return true;
    }
    return false;
}

function gameEngine(){
    // Part 1: Updating the snake array & food
    if(isCollide(snakeArr)){
        gameOverSound.play();
        musicSound.pause();
        inputDir =  {x: 0, y: 0}; 
        alert("Game Over. Press any key to play again!");
        let a = 1; 
        let b = 18;
        snakeArr = [{x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random())}];
        musicSound.play();
        score = 0; 
        scoreBox.innerHTML = "Score: " +  score;
    }
    
    // If you have grabbed the food, increment the score and regenerate the food
    if(snakeArr[0].y === food.y && snakeArr[0].x === food.x){
        foodSound.play();
        score += 1;
        if(score > highScoreVal){
            highScoreVal = score;  
            localStorage.setItem('highScore', JSON.stringify(highScoreVal));
            highScoreBox.innerHTML = "High Score: " + highScoreVal;
        }
        scoreBox.innerHTML = "Score: " +  score;
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y})
        let a = 1; 
        let b = 18; 
        food = {x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random())}
    }

    // Moving the snake
    for(let i = snakeArr.length - 2; i >= 0; i--){
        snakeArr[i+1] = {...snakeArr[i]};
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and food
    // Display the Snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if(index === 0){
            if(inputDir.x === 0 && inputDir.y === -1){ // arrowUp
                snakeElement.classList.add('head-up');
            }
            else if(inputDir.x === 0 && inputDir.y === 1){ // arrowDown
                snakeElement.classList.add('head-down');
            }
            else if(inputDir.x === -1 && inputDir.y === 0){ // arrowLeft
                snakeElement.classList.add('head-left');
            }
            else if(inputDir.x === 1 && inputDir.y === 0){   // arrowRight
                snakeElement.classList.add('head-right');
            }
            else{
                snakeElement.classList.add('head-left');
            }
        }
        else{
            snakeElement.classList.add('snake-body');
        }

        board.appendChild(snakeElement);
    })

    // Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}




// main logic
let highScore = localStorage.getItem('highScore');
if(highScore === null){
    highScoreVal = 0;
    localStorage.setItem('highScore', JSON.stringify(highScoreVal));
}
else{
    highScoreVal = JSON.parse(highScore);
    highScoreBox.innerHTML = "High Score: " + highScore;
}
window.requestAnimationFrame(main);
window.addEventListener('keydown', e =>{
    musicSound.play();
    moveSound.play();
    switch (e.key){
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
            
        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;

        default:
            break;
    }
});
