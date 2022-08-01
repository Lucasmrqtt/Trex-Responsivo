//declarando as variáveis
var cloud,cloudImg
var trex,trexRunning,trexColliding,trexJumping
var edges
var ground,groundImg
var groundline
var spike, spikeImg1,spikeImg2,spikeImg3,spikeImg4,spikeImg5,spikeImg6
var score = 0
var hiScore = 0
const PLAY = 0
const END = 1
var gameState = PLAY
var clouds 
var spikes
var gameOver,gameOverImg
var restart, restartImg
var soundDie, soundJump, soundPoint
var isDead = false
//preload carrega as mídias do jogo

function preload(){
  trexRunning = loadAnimation ('./images/trex3.png','./images/trex4.png')
  trexJumping = loadAnimation ("./images/trex1.png")
  groundImg = loadImage ("./images/ground2.png")
  cloudImg = loadImage ("./images/cloud.png")
  spikeImg1 = loadImage ("./images/obstacle1.png")
  spikeImg2 = loadImage ("./images/obstacle2.png")
  spikeImg3 = loadImage ("./images/obstacle3.png")
  spikeImg4 = loadImage ("./images/obstacle4.png")
  spikeImg5 = loadImage ("./images/obstacle5.png")
  spikeImg6 = loadImage ("./images/obstacle6.png")
  trexColliding = loadAnimation ("./images/trex_collided.png")
  gameOverImg = loadImage ("./images/gameOver.png")
  restartImg = loadImage ("./images/restart.png")
  soundDie = loadSound ("./sounds/die.mp3")
  soundPoint = loadSound ("./sounds/checkPoint.mp3")
  soundJump = loadSound ("./sounds/jump.mp3")
}


//setup faz a configuração
function setup(){
  createCanvas(windowWidth,windowHeight);

  clouds = new Group()
  spikes = new Group()

  //sprite trex
  trex = createSprite(50,height-30,20,40);
  //trex.debug = true
  trex.addAnimation('Running',trexRunning);
  trex.addAnimation('collided',trexColliding);
  trex.addAnimation ('jumping',trexJumping)
  trex.scale = 0.45
  trex.setCollider('rectangle',-10,-20,40,90,30)
  //trex.setCollider('circle',-10,10,30)
  
  //sprite Solo
  ground = createSprite (width/2,height-20,width,20)
  ground.addImage("ground",groundImg)
  ground.scale = 1.5

  //criando bordas
  edges = createEdgeSprites()
  
  //criando linha do solo
  groundline = createSprite (width/2,height-15,width,0.5)
  groundline.visible = false

  // criando restart/gameOver
  restart = createSprite (width/2,height - 80)
  restart.addImage (restartImg)
  restart.scale = 0.4
  restart.visible = false

  gameOver = createSprite (width/2,height -120)
  gameOver.addImage (gameOverImg)
  gameOver.scale = 0.7
  gameOver.visible = false
}

 
//draw faz o movimento, a ação do jogo
function draw(){
  background('#f2f2f2');

  gravity()
 
  if (trex.isTouching(spikes)) {
    gameState = END
    if(!isDead){
      soundDie.play()
      isDead = true
    }

  }

  if (gameState == PLAY) {
    spawnCloud();
    spawnSpike();  
  

    //pulo do trex
    if ((keyDown('space' ) || touches.length>0 || keyDown('up')) && trex.y >=height-40 ) {
      trex.velocityY = -9;
      soundJump.play()
      touches = []
    }

    if (ground.x < 0) {
      ground.x = ground.width/2
    }

    if (trex.y < height-50) {
      trex.changeAnimation ("jumping")
    }
    else {
      trex.changeAnimation ("Running")
    }

    ground.velocityX = -(3 + score/100)

    score = score + Math.round(getFrameRate()/60)

    if (score %100 == 0 && score > 0) {
      soundPoint.play()
    }

  }


  if (gameState == END) {
    ground.velocityX = 0
    spikes.setVelocityXEach (0)
    clouds.setVelocityXEach (0)
    trex.changeAnimation ("collided")
    spikes.setLifetimeEach (-1)
    clouds.setLifetimeEach (-1)
    gameOver.visible = true
    restart.visible = true
    if (score > hiScore) {
      hiScore = score
    }

    // Reset
    if (mousePressedOver(restart) || keyDown('r') || touches.length > 0) {
      reset();
      touches = []
    }

  }
  
 //console.log (frameCount)


  trex.collide(groundline)
 
  drawSprites();

   //coordenadas do mouse na tela
  text("X: "+mouseX+" / Y: "+ mouseY,mouseX,mouseY)
  text ('Score:'+ score,width-80,height-170)
  text ('Hi:' + hiScore ,width-140,height-170)
}


function gravity(){
  trex.velocityY += 0.5
}

//Cactos
function spawnSpike(){
  if(frameCount %100 == 0){
    spike = createSprite (width,height-30) 
    spike.velocityX =  -(3 + score/100)
    var sorteio = Math.round(random (1,6))
    spike.lifetime = width/spike.velocityX
    switch (sorteio) {
      case 1: spike.addImage(spikeImg1)
        spike.scale = 0.4
      break;
      case 2: spike.addImage(spikeImg2)
        spike.scale = 0.4
      break;
      case 3: spike.addImage(spikeImg3)
        spike.scale = 0.4
      break;
      case 4: spike.addImage(spikeImg4)
        spike.scale = 0.4
      break;
      case 5: spike.addImage(spikeImg5)
        spike.scale = 0.4
      break;
      case 6: spike.addImage(spikeImg6)
        spike.scale = 0.3
      break;
    }
    spikes.add(spike)
  }
}

//nuvens
function spawnCloud(){
  if(frameCount %60 == 0){
    cloud = createSprite (width,random(height-170,height-80),20,20)
    cloud.velocityX =  -(3 + score/100)
    cloud.addImage (cloudImg)
    cloud.scale = random (0.7,1.3)
    cloud.depth = trex.depth - 1
    cloud.lifetime = width/cloud.velocityX
    clouds.add(cloud)
  }
  
}

function reset(){
 gameState = PLAY
 restart.visible = false
 gameOver.visible = false 
 clouds.destroyEach();
 spikes.destroyEach();
 score = 0
}