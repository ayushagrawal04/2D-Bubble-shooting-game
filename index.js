const introMusic = new Audio("./music/introSong.mp3");
const shootingSound = new Audio("./music/shoooting.mp3");
const killEnemySound = new Audio("./music/killEnemy.mp3");
const gameOverSound = new Audio("./music/gameOver.mp3");
const heavyWeaponSound = new Audio("./music/heavyWeapon.mp3");
const hugeWeaponSound = new Audio("./music/hugeWeapon.mp3");

introMusic.play();


//  create a canvas element and then append it to the div
const canvas = document.createElement("canvas");
document.querySelector(".mygame").appendChild(canvas);
canvas.width=innerWidth;
canvas.height=innerHeight;
const context=canvas.getContext("2d");

const lightDamage=10;
const heavyDamage=20;
let playerScore=0;



// now we select the element from the html part

let difficluty=2;
const form=document.querySelector("form");
const scoreBoard=document.querySelector(".scoreBoard");

// add eventListner for difficulty where user can selewct their difficulty level

const input=document.querySelector("input")

input.addEventListener("click",(e)=>{
e.preventDefault();

introMusic.pause();


form.style.display="none";
scoreBoard.style.display="block";

const userValue=document.getElementById("difficulty").value;

if(userValue==="Easy"){
setInterval(enemySpawn,2000);
return (difficluty=5);
}
if(userValue==="Medium"){
    setInterval(enemySpawn,1400);
    return (difficluty=8);
}
if(userValue==="Hard"){
    setInterval(enemySpawn,1000);
    return (difficluty=10);
}
if(userValue==="Insane"){
    setInterval(enemySpawn,700);
    return (difficluty=12);

}
})

// ---------------------------------GAMEOVER LOADER -------------------------------------------------------
const gameOverLoader=()=>{
        // Creating endscreen div and play again button and high score element
        const gameOverBanner = document.createElement("div");
        const gameOverBtn = document.createElement("button");
        const highScore = document.createElement("div");
      
        highScore.innerHTML = `High Score : ${
            localStorage.getItem("highScore")
              ? localStorage.getItem("highScore")
              : playerScore
          }`;

          const oldHighScore =localStorage.getItem("highScore") && localStorage.getItem("highScore");

  if (oldHighScore < playerScore) {
    localStorage.setItem("highScore", playerScore);

    // updating high score html
    highScore.innerHTML = `High Score: ${playerScore}`;
  }




        
        // adding text to playagain button

        gameOverBtn.innerText = "Play Again";
      
        gameOverBanner.appendChild(highScore);
      
        gameOverBanner.appendChild(gameOverBtn);
        // Making reload on clicking playAgain button
        gameOverBtn.onclick = () => {
          window.location.reload();
        };     

        gameOverBanner.classList.add("gameover");

        document.querySelector("body").appendChild(gameOverBanner);
};

// ------------------- Creating Player, Enemy, Weapon, Etc Classes-----------------------------------------

//.... create a new object for postion of a player 
playerPosition={
x:canvas.width/2,
y:canvas.height/2
};
class Player{

    constructor(x,y,radius,color){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
    }
    // now we have to create a draw function 
    draw(){
        context.beginPath();
        
        context.arc(this.x,this.y,this.radius, (Math.PI / 180 )*0, (Math.PI / 180 )*360,false);
        context.fillStyle=this.color;
        
        context.fill();
    }
}
// -------------------------------------class for weapon nearly same as player--------------------------------------
class Weapon{

    constructor(x,y,radius,color,velocity,damage){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
        this.damage=damage;

    }
    // now we have to create a draw function 
    draw(){
        context.beginPath();
        
        context.arc(this.x,this.y,this.radius, (Math.PI / 180 )*0, (Math.PI / 180 )*360,false);
        context.fillStyle=this.color;  
        context.fill();
    }
    update(){
        //  here velocity is a object which gives the direction of the bullets 
        this.draw();
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;

    }
}

// --------------------------------------------CREATE A HIUGE WEAPON CLASS ------------------------------------------------

class HugeWeapon {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.color = "rgba(255,0,133,1)";
    }
  
    draw() {
      context.beginPath();
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, 200, canvas.height);
    }
  
    update() {
      this.draw();
      this.x += 20;
    }
  }

// -----------------------------------------------------------
//  this is enemy class that approaching the player 

class Enemy{

    constructor(x,y,radius,color,velocity){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;

    }
    // now we have to create a draw function 
    draw(){
        context.beginPath();
        
        context.arc(this.x,this.y,this.radius, (Math.PI / 180 )*0, (Math.PI / 180 )*360,false);
        context.fillStyle=this.color;
        context.fill();
    }
    update(){
        //  here velocity is a object which gives the direction of the bullets 
        this.draw();
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;

    }
}
// -----------------------------------------------

// ----------------------------------CREATE A PARTICLE CLASS -------------------------------------
const fraction=0.98;

class Particle{

    constructor(x,y,radius,color,velocity){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
        this.alpha=1;

    }
    // now we have to create a draw function 
    draw(){
        context.save();
        
        context.globalAlpha=this.alpha;
        
        context.beginPath();
        
        context.arc(this.x,this.y,this.radius, (Math.PI / 180) *0, (Math.PI / 180 )*360,false);
        context.fillStyle=this.color;
        context.fill();
        context.restore();
        
    }
    update(){
        //  here velocity is a object which gives the direction of the bullets 
        this.draw();
        this.velocity.x *= fraction;
        this.velocity.y*=fraction;

        this.x+=this.velocity.x;
        this.y+=this.velocity.y;
        this.alpha-=0.01;

    }
}
// --------------------------------------THIS IS A END OF PARTICLE CLASS ----------------------------------------------


// now ye dikh ny rha h to new object banayenge 
const ayush=new Player(playerPosition.x ,playerPosition.y,15,
    "white");

// now we create an animation 
// declare an array because are not only one there are multiple weapon 
const weapons=[];
const hugeWeapons=[];
const enemies=[];
const particles=[];

const enemySpawn=()=>{

    // here we create all the parameter that we passes in this enemy object
    const enemySize=Math.random()*(40-5)+5;
    const enemyColor=`hsl(${Math.floor(Math.random() * 360)},100%,50%)`;

    // now we create the coming porition of the enemey 
    let random;

    if (Math.random() < 0.5) {
        // Making X equal to very left off of screen or very right off of screen and setting Y to any where vertically
        random = {
          x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
          y: Math.random() * canvas.height,
        };
      } else {
        // Making Y equal to very up off of screen or very down off of screen and setting X to any where horizontally
        random = {
          x: Math.random() * canvas.width,
          y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize,
        };
      }

    // now we create the velocity of the enemy 
    const myAngle=Math.atan2(canvas.height/2-random.y,canvas.width/2-random.x);
    // this is the velocity wala object ----
    const velocity={
       x:Math.cos(myAngle)*difficluty,
       y:Math.sin(myAngle)*difficluty,
    }
    enemies.push(new Enemy(random.x,random.y,enemySize,enemyColor,velocity));
}

// --------------------------------------------------------ANIMATION FUNCTION---------------------------------------------------------------------
let animationId;

function animation(){
    animationId=requestAnimationFrame(animation);

    scoreBoard.innerHTML=`Score : ${playerScore}`;
    //  laser si aa rhi thi to make in circle-circle we use clearrect to do so 
    context.fillStyle='rgba(49,49,49,0.1)';
    
    context.fillRect(0, 0, canvas.width, canvas.height);

    // this will produce our player
ayush.draw()

// here we update our particle array-----------------------------------------------------------------

particles.forEach((Particle,particleIndex)=>{
 
    if(Particle.alpha<=0){
        particles.splice(particleIndex,1);
    }
    else{
        Particle.update();
    }
});
// ---- generating hugeWeapon---------------------------------------------------------------------------
hugeWeapons.forEach((hugeWeapon,hugeWeaponIndex)=>{

    if(hugeWeapon.x>canvas.width){
        hugeWeapons.splice(hugeWeaponIndex,1);
    }
    else
    {
        hugeWeapon.update();
    }
})
// this will produce our weapon-----------------------------------------------------------------------------
weapons.forEach((Weapon,weaponIndex)=>{
    Weapon.update();

    if (
        Weapon.x + Weapon.radius < 1 ||
        Weapon.y + Weapon.radius < 1 ||
        Weapon.x - Weapon.radius > canvas.width ||
        Weapon.y - Weapon.radius > canvas.height
      ) {
        weapons.splice(weaponIndex, 1);
      }
})
// this will update our Enemy ------------------------------------------------------------------------------

enemies.forEach((Enemy,enemyIndex)=>{
    Enemy.update(); 
    // distance between enemy and player 

    const distancebwEnemyandplayer=Math.hypot(ayush.x-Enemy.x,ayush.y-Enemy.y);
    if(distancebwEnemyandplayer-ayush.radius-Enemy.radius<1){
        cancelAnimationFrame(animationId);
        gameOverSound.play();
      hugeWeaponSound.pause();
      shootingSound.pause();
      heavyWeaponSound.pause();
      killEnemySound.pause();
        return gameOverLoader();
    }

    hugeWeapons.forEach((hugeWeapon)=>{
        const distancebwEnemyandhugeWeapon=hugeWeapon.x-Enemy.x;
        if(distancebwEnemyandhugeWeapon<=200 && 
            distancebwEnemyandhugeWeapon>=-200 ){
                playerScore=playerScore+10;
                setTimeout(() => {
                    killEnemySound.play();
                    enemies.splice(enemyIndex,1);
                }, 0);
            }
    });


    weapons.forEach((Weapon,weaponIndex)=>{

        // find distance between enemy and the weapon
        const distancebwEnemyandWeapon=Math.hypot(Weapon.x-Enemy.x,Weapon.y-Enemy.y);
        if(distancebwEnemyandWeapon-Weapon.radius-Enemy.radius<1){
           
            if(Enemy.radius> Weapon.damage+8){
                gsap.to(Enemy,{
                    radius:Enemy.radius-Weapon.damage,
                })
                setTimeout(() => {
                    weapons.splice(weaponIndex,1);
                }, 0);
            }
            else{

                for (let index = 0; index < Enemy.radius * 2; index++) {
                    particles.push(new Particle(Weapon.x,Weapon.y,Math.random() * 2,Enemy.color,{
                        x: (Math.random() - 0.5) * (Math.random() * 7),
                y: (Math.random() - 0.5) * (Math.random() * 7),
                    }));
                 }

                 playerScore=playerScore+10;

                //  ---------rendering player score in score board
                scoreBoard.innerHTML=`Score : ${playerScore}`;
                setTimeout(() => {
                    killEnemySound.play();
                    enemies.splice(enemyIndex,1);
                weapons.splice(weaponIndex,1);
                }, 0);
                
            }
        }

    });

});

}
// event listner for light weapon give less damage 


canvas.addEventListener("click",(e)=>{
    shootingSound.play();

    // this is used to find the angle between the x and y length of the click
    const myAngle=Math.atan2(e.clientY-canvas.height/2,e.clientX-canvas.width/2);
    // this is the velocity wala object ----
    const velocity={
       x:Math.cos(myAngle)*6,
       y:Math.sin(myAngle)*6,
    }

    weapons.push(new Weapon(canvas.width/2,canvas.height/2,6,"white",velocity,lightDamage));
});


// ---------------------------------- event listener for heavy weapon ----------------------------------------

canvas.addEventListener("contextmenu",(e)=>{
    e.preventDefault(); 

    if(playerScore<=0){
        return;
    }
    heavyWeaponSound.play();

    // scoreboard update------------------...........................

    playerScore-=2;
    scoreBoard.innerHTML=`Score : ${playerScore}`;

    // this is used to find the angle between the x and y length of the click
    const myAngle=Math.atan2(e.clientY-canvas.height/2,e.clientX-canvas.width/2);
    // this is the velocity wala object ----
    const velocity={
       x:Math.cos(myAngle)*3,
       y:Math.sin(myAngle)*3,
    }

    weapons.push(new Weapon(canvas.width/2,canvas.height/2,30,"cyan",velocity,heavyDamage));
});

addEventListener("keypress", (e) => {

    if (e.key === " ") {

        if(playerScore<10){
            return;
        }
    
        // scoreboard update------------------...........................
    
        playerScore-=10;
        scoreBoard.innerHTML=`Score : ${playerScore}`;
        hugeWeaponSound.play();

        hugeWeapons.push(new HugeWeapon(0,0))
       
    }
  });
  addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
  addEventListener("resize", () => {
    window.location.reload();
  }); 

animation();

