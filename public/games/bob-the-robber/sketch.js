var bob_left;
var bob_right;
var cop_left;
var cop_right;
var bobStandingLeft,bobStandingRight;
var bg,bob,cop;
var gameState = 1;
var stair1,stair1B;
var wallR,wallL1,wallL3,wallL5;

function preload(){
    bg = loadImage("Assets/bg_robber.jpg");
    bob_left = loadAnimation("Assets/L1.png","Assets/L2.png","Assets/L3.png","Assets/L4.png","Assets/L5.png","Assets/L6.png","Assets/L7.png","Assets/L8.png","Assets/L9.png");
    bob_right = loadAnimation("Assets/R1.png","Assets/R2.png","Assets/R3.png","Assets/R4.png","Assets/R5.png","Assets/R6.png","Assets/R7.png","Assets/R8.png","Assets/R9.png");
    cop_left = loadAnimation("Assets/L1E.png","Assets/L2E.png","Assets/L3E.png","Assets/L4E.png","Assets/L5E.png","Assets/L6E.png","Assets/L7E.png","Assets/L8E.png");
    cop_right = loadAnimation("Assets/R1E.png","Assets/R2E.png","Assets/R3E.png","Assets/R4E.png","Assets/R5E.png","Assets/R6E.png","Assets/R7E.png","Assets/R8E.png");
    bobStandingLeft = loadImage("Assets/standingleft.png");
    bobStandingRight = loadImage("Assets/standing.png");



}
function setup() {
  createCanvas(displayWidth-20,displayHeight-110);

  bob = createSprite(120, 600, 50, 50);
  bob.addImage("bobStandingRight",bobStandingRight);
  bob.addImage("bobStandingLeft",bobStandingLeft);
  bob.addAnimation("bobLeft",bob_left);
  bob.addAnimation("bobRight",bob_right);
  bob.scale=0.5;
  
  stair1 = createSprite(390,600,30,30);
  stair1.visible=false;
  stair1B = createSprite(390,470,30,30);
  stair1B.visible=false;

  wallR = createSprite(1310,330,1,displayHeight-130);
  wallR.visible=false;

  //wallL1 for l1 and l2
  wallL1 = createSprite(80,510,1,250);
  //wallL1.visible=false;
  wallL3 = createSprite(280,330,1,125);
  //wallL3.visible=false;
  wallL5 = createSprite(640,60,1,125);
  //wallL5.visible=false;

}

function draw() {
  background(bg);  
  text("x: "+ mouseX + "y: " + mouseY,mouseX,mouseY);
  if(bob.isTouching(wallR)){
    bob.x=1245;
  }
  if(bob.isTouching(wallL1)){
    bob.x=120;
  }
  if(bob.isTouching(wallL3)){
    bob.x=320;
  }
  if(bob.isTouching(wallL5)){
    bob.x=685;
  }
  if((keyDown(RIGHT_ARROW)||keyDown("D")) && bob.x>0 && bob.x<1320){
    bob.changeAnimation("bobRight",bob_right);
    bob.velocityX=3;
    
  }
  else{
    bob.changeImage("bobStandingRight",bobStandingRight);
    bob.velocityX=0;
  }
  if((keyDown(LEFT_ARROW)||keyDown("A")) && bob.x>0 && bob.x<1320){
    bob.changeAnimation("bobLeft",bob_left);
    bob.velocityX=-3;
    
  }
  /*else{
    bob.changeImage("bobStandingLeft",bobStandingLeft);
    bob.velocityX=0;
  }*/
  if(bob.isTouching(stair1)&&keyDown(UP_ARROW)){
    bob.x=390;
    bob.y=470;
  }
  if(bob.isTouching(stair1B)&&keyDown(DOWN_ARROW)){
    bob.x=390;
    bob.y=600;
  }
  console.log(bob.x);
  drawSprites();
}
