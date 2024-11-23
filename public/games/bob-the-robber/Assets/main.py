import pygame

pygame.mixer.init()
pygame.font.init()
size=(1000,700)
win=pygame.display.set_mode(size)
pygame.display.set_caption("Bob the robber")
bg_level1=pygame.image.load('background.jpg')
bg_level1=pygame.transform.scale(bg_level1,size)
bg_level2=pygame.image.load('bg1.jpg')
bg_level2=pygame.transform.scale(bg_level2,size)
bg_level3=pygame.transform.scale(pygame.image.load('background3.png'),size)
menu_bg=pygame.transform.scale(pygame.image.load('MENU1.png'),size)
char_r=pygame.transform.scale(pygame.image.load('standing.png'),(80,80))
char_l=pygame.transform.scale(pygame.image.load('standingleft.png'),(80,80))
walkRight=[pygame.image.load('R1.png'),pygame.image.load('R2.png'),
           pygame.image.load('R3.png'),pygame.image.load('R4.png'),
           pygame.image.load('R5.png'),pygame.image.load('R6.png'),
           pygame.image.load('R7.png'),pygame.image.load('R8.png'),
pygame.image.load('R9.png'),]
walkLeft=[pygame.image.load('L1.png'),pygame.image.load('L2.png'),
          pygame.image.load('L3.png'),pygame.image.load('L4.png'),
          pygame.image.load('L5.png'),pygame.image.load('L6.png'),
          pygame.image.load('L7.png'),pygame.image.load('L8.png'),
          pygame.image.load('L9.png'),]
EwalkRight=[pygame.image.load('R1E.png'),pygame.image.load('R2E.png'),
           pygame.image.load('R3E.png'),pygame.image.load('R4E.png'),
           pygame.image.load('R5E.png'),pygame.image.load('R6E.png'),
           pygame.image.load('R7E.png'),pygame.image.load('R8E.png'),]
Ewalkleft=[pygame.image.load('L1E.png'),pygame.image.load('L2E.png'),
          pygame.image.load('L3E.png'),pygame.image.load('L4E.png'),
          pygame.image.load('L5E.png'),pygame.image.load('L6E.png'),
          pygame.image.load('L7E.png'),pygame.image.load('L8E.png'),]
play_image=pygame.transform.scale(pygame.image.load('ppp.png'),(350,300))
menu_sound = pygame.mixer.Sound("Weirding_Way.mp3")
quit_img=pygame.transform.scale(pygame.image.load('quit.png'),(210,100))
def print_text(message,x,y,font_color=(0,0,0),font_type='arial',font_size=30):
    font_type=pygame.font.Font(None,font_size)
    text=font_type.render(message,True,font_color)
    win.blit(text,(x,y))
def start_button(x, y):
    win.blit(play_image, (x, y))
class Button():
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.inactive_clr = (255, 255, 0, 255)
        self.active_clr = (139, 139, 0, 255)

    def draw(self, x, y, action=None):
        mouse = pygame.mouse.get_pos()
        click = pygame.mouse.get_pressed()
        pygame.draw.ellipse(win, self.inactive_clr, [x, y, self.width, self.height])
        if x < mouse[0] < x + self.width and y < mouse[1] < y + self.height:
            pygame.draw.ellipse(win, self.active_clr, [x, y, self.width, self.height])
            if click == (1, 0, 0) and action == "START GAME":
                #pygame.mixer.Sound.play(button1_sound)
                #pygame.time.delay(300)
                x=Stage1()
                x.lev1()
            elif click == (0, 0, 1):
                pygame.quit()
                quit()
        else:
            pygame.draw.ellipse(win, self.inactive_clr, (x, y, self.width, self.height))
        #start_button(x, y)
        #print_text(message=message,x=x+10,y=y+10,font_size=font_size)
class quit():
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.inactive_clr = (255, 255, 0, 255)
        self.active_clr = (139, 139, 0, 255)

    def draw(self, x, y, action=None):
        mouse = pygame.mouse.get_pos()
        click = pygame.mouse.get_pressed()
        pygame.draw.circle(win, self.inactive_clr, [x, y], 60)
        if x < mouse[0] < x + self.width and y < mouse[1] < y + self.height:
            pygame.draw.circle(win, self.active_clr, [x, y], 60)
            if click == (1, 0, 0) and action == "START GAME":
                #pygame.mixer.Sound.play(button1_sound)
                #pygame.time.delay(300)
                pygame.quit()
                quit()
            elif click == (0, 0, 1):
                pygame.quit()
                quit()
        else:
            pygame.draw.circle(win, self.inactive_clr, [x, y], 60)

###------------show menu--------------------------------------------------
def show_menu():

    pygame.mixer.Sound.play(menu_sound)
    #win.fill((255, 255, 255))
    menu = pygame.image.load("MENU1.png").convert_alpha()
    menu = pygame.transform.scale(menu, size)
    bob=pygame.transform.scale(pygame.image.load("bob-removebg-preview.png"), (450,400))

    start_button1 = Button(350, 120)
    quit_button=quit(200, 120)
    done = True
    while done:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                done = True

        win.fill((255, 255, 255))
        win.blit(menu, (0, 0))
        win.blit(bob,(300,10))
        win.blit(char_l,(620,200))
        start_button1.draw(310, 370, "START GAME")
        quit_button.draw(450, 580)
        win.blit(play_image,(310, 275))
        win.blit(quit_img, (345, 532))
        pygame.display.update()
        #pygame.clock.tick(60)



class level1:#player

    def __init__(self):
        self.x=38
        self.y=50
        self.vel=2
        self.walkCount=0
        self.left=False
        self.right=False
        self.standing=True
    def character(self,win):
        if self.walkCount+1>27:
            self.walkCount=0
        if not self.standing:
            if self.left:
                win.blit(pygame.transform.scale(walkLeft[self.walkCount//3],(80,80)),(self.x,self.y))
                self.walkCount+=1
            else:
                win.blit(pygame.transform.scale(walkRight[self.walkCount // 3], (80, 80)), (self.x,self.y))
        else:
            if self.left:
                win.blit(char_l,(self.x,self.y))
            else:
                win.blit(char_r, (self.x, self.y))
        pygame.display.update()

class Enemy_level1:
    def __init__(self,x,y,width,height,end,vel):
        self.x=x
        self.y=y
        self.width=width
        self.height=height
        self.end=end
        self.path=[self.x,self.end]
        self.walkCount=0
        self.vel=vel
    def draw(self,win):
        self.move()
        if self.walkCount+1>24:
            self.walkCount=0
        if self.vel>0:#enemy is moving right
            win.blit(pygame.transform.scale(EwalkRight[self.walkCount // 3], (self.width, self.height)),(self.x,self.y))
            self.walkCount += 1
        else:
            win.blit(pygame.transform.scale(Ewalkleft[self.walkCount // 3], (self.width, self.height)),
                     (self.x, self.y))
            self.walkCount += 1
    def move(self):
        if self.vel>0:
            if self.x+self.vel<self.path[1]:
                self.x+=self.vel
            else:
                self.vel=self.vel*-1
                self.walkCount+=1
        else:
            if self.x-self.vel>self.path[0]:
                self.x+=self.vel
            else:
                self.vel=self.vel*-1
                self.walkCount+=1
almazy=[]
almazy.append([60,50])
class Almaz:
    def __init__(self,x,y,width,height,end,vel):
        self.x=x
        self.y=y
        self.width=width
        self.height=height
        self.end=end
        self.path=[self.y,self.end]
        self.walkCount=0
        self.vel=vel
    def draw(self,win):
        self.move()

        if self.vel>0:#enemy is moving right
            win.blit(pygame.transform.scale(pygame.image.load("almaz.png"), (self.width, self.height)),(self.x,self.y))
            self.walkCount += 1
        else:
            win.blit(pygame.transform.scale(pygame.image.load("almaz.png"), (self.width, self.height)),
                     (self.x, self.y))
            self.walkCount += 1
    def move(self):
        if self.vel>0:
            if self.y+self.vel<self.path[1]:
                self.y+=self.vel
            else:
                self.vel=self.vel*-1
                self.walkCount+=1
        else:
            if self.y-self.vel>self.path[0]:
                self.y+=self.vel
            else:
                self.vel=self.vel*-1
                self.walkCount+=1


scores=10
def count_scores():
    global scores
    scores=scores-10
def count_almaz():
    global scores
    scores = scores +10
if scores == 0:
    main_screen = pygame.image.load('gameover.jpg')
    main_screen = pygame.transform.scale(main_screen, size)
    win.blit(main_screen, (0, 0))
    pygame.display.update()
    pygame.quit()
    quit()


class Stage1:
    player=level1()
    enemy1=Enemy_level1(360,50,80,80,770,0.5)
    enemy2=Enemy_level1(370,190,80,80,600,0.5)
    enemy3=Enemy_level1(190, 330, 80, 80, 600, 0.5)
    enemy4=Enemy_level1(680, 330, 80, 80, 930, 0.1)
    enemy5=Enemy_level1(350,470,80,80,780,0.1)
    almaz1=Almaz(240,50,50,50,60,0.1)
    hide=False

    def wall(self):
        if self.player.y==50 and self.player.x>=760:
            self.player.x = 760
        if self.player.y==190 and self.player.x>=590:
            self.player.x = 590
        if self.player.y==330 and self.player.x>=590:
            self.player.x = 590
        if self.player.y==470 and self.player.x>=770:
            self.player.x = 770
    def enemies(self):
        #HERE WE CHECK FOR COLLIZION
        if self.player.x + 5 > self.enemy1.x - 5 and self.player.x - 5 < self.enemy1.x + 5:
            if self.player.y + 5 > self.enemy1.y - 5 and self.player.y - 5 < self.enemy1.y + 5:
                count_scores()
                self.player.x = 38
                self.player.y = 50
        if self.player.x + 5 > self.enemy2.x - 5 and self.player.x - 5 < self.enemy2.x + 5:
            if self.player.y + 5 > self.enemy2.y - 5 and self.player.y - 5 < self.enemy2.y + 5:
                count_scores()
                self.player.x = 38
                self.player.y = 50
        if self.player.x + 5 > self.enemy3.x - 5 and self.player.x - 5 < self.enemy3.x + 5:
            if self.player.y + 5 > self.enemy3.y - 5 and self.player.y - 5 < self.enemy3.y + 5:
                count_scores()
                self.player.x = 38
                self.player.y = 50
        if self.player.x + 5 > self.enemy4.x - 5 and self.player.x - 5 < self.enemy4.x + 5:
            if self.player.y + 5 > self.enemy4.y - 5 and self.player.y - 5 < self.enemy4.y + 5:
                count_scores()
                self.player.x = 38
                self.player.y = 50
        if self.player.x + 5 > self.enemy5.x - 5 and self.player.x - 5 < self.enemy5.x + 5:
            if self.player.y + 5 > self.enemy5.y - 5 and self.player.y - 5 < self.enemy5.y + 5:
                count_scores()
                self.player.x = 38
                self.player.y = 50
        if self.player.x + 3 > self.almaz1.x - 3 and self.player.x - 3 < self.almaz1.x + 3:
            if self.player.y + 3 > self.almaz1.y - 3 and self.player.y - 3 < self.almaz1.y + 3:
                count_almaz()
                hide=False
    def stairs(self):
        keys = pygame.key.get_pressed()
        if self.player.x in range(520,580) and self.player.y == 50:
            if keys[pygame.K_DOWN]:
                self.player.y = 190

        if self.player.x in range(520,580) and self.player.y == 190:
            if keys[pygame.K_UP]:
                self.player.y = 50

        if self.player.x in range(20,80) and self.player.y == 190:
            if keys[pygame.K_DOWN]:
                self.player.y = 330

        if self.player.x in range(20,80) and self.player.y == 330:
            if keys[pygame.K_UP]:
                self.player.y = 190

        if self.player.x in range(360,420) and self.player.y == 330:
            if keys[pygame.K_DOWN]:
                self.player.y = 470

        if self.player.x in range(360,420) and self.player.y == 470:
            if keys[pygame.K_UP]:
                self.player.y = 330

    def drawing_level1(self):
        self.player.character(win)
        win.blit(bg_level1,(0,0))
        self.enemy1.draw(win)
        self.enemy2.draw(win)
        self.enemy3.draw(win)
        self.enemy4.draw(win)
        self.enemy5.draw(win)
        self.almaz1.draw(win)
        win.blit(pygame.font.Font('CAVEMAN_.TTF',25).render('Scores:'+ str(scores),True,(255, 255, 0, 255)), (30, 10))


    def lev1(self):
        pygame.mixer.stop()
        lev1_sound = pygame.mixer.Sound("robber.mp3")
        pygame.mixer.Sound.play(lev1_sound)
        run =  True
        while run:

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    run = False
                    break

            keys = pygame.key.get_pressed()

            self.wall()
            self.stairs()
            self.enemies()
            self.drawing_level1()
#####-----------------Showing passing throught gate effect
            if self.player.x in range(260,300) and self.player.y == 50:
                self.player.x = 330
            if self.player.x in range(300, 330) and self.player.y == 50:
                self.player.x = 260
            if self.player.x in range(330, 360) and self.player.y == 190:
                self.player.x = 270
            if self.player.x in range(280,320) and self.player.y == 190:
                self.player.x = 360
            if self.player.x in range(120, 130) and self.player.y == 330:
                self.player.x = 180
            if self.player.x in range(160, 170) and self.player.y == 330:
                self.player.x = 110
            if self.player.x in range(330, 350) and self.player.y == 470:
                self.player.x = 270
            if self.player.x in range(280, 310) and self.player.y == 470:
                self.player.x = 360
######----------------  When player reaches the vault
            if self.player.x in range(80,90) and self.player.y==470:

                main_screen = pygame.image.load('nextlevel.jpg')
                main_screen = pygame.transform.scale(main_screen, size)
                win.blit(main_screen, (0, 0))
                pygame.display.update()
                pygame.time.delay(2000)
                run = False
                b = Stage2()
                b.lev1()


####---------------------Player position-------------
            if keys[pygame.K_LEFT] and self.player.x>30:
                self.player.x-=self.player.vel
                self.player.left=True
                self.player.right=False
                self.player.standing=False
            elif keys[pygame.K_RIGHT] and self.player.x<915:
                self.player.x+=self.player.vel
                self.player.left=False
                self.player.right=True
                self.player.standing=False
            else:
                self.player.standing=True
                self.player.walkCount=0

class Stage2:
    player = level1()
    enemy1 = Enemy_level1(120, 50, 80, 80, 350, 0.5)
    enemy2 = Enemy_level1(140, 190, 80, 80, 530, 0.5)
    enemy3 = Enemy_level1(190, 330, 80, 80, 600, 0.5)
    enemy4 = Enemy_level1(680, 330, 80, 80, 910, 0.5)
    enemy5 = Enemy_level1(350, 470, 80, 80, 940, 0.5)
    almaz1 = Almaz(440, 470, 50, 50, 60, 0.1)

    def wall(self):
        """if self.player.y == 50 and self.player.x >=380:
            self.player.x = 380
        if self.player.y == 50 and self.player.x <=480:
            self.player.x = 480"""
        if self.player.y == 50 and self.player.x >= 945:
            self.player.x = 945
        if self.player.y == 190 and self.player.x <=675:
            self.player.x = 675
        if self.player.y == 330 and self.player.x <= 150:
            self.player.x = 150
        if self.player.y == 330 and self.player.x >=620:
            self.player.x = 620
        if self.player.y == 470 and self.player.x <= 60:
            self.player.x = 60

    def enemies(self):
        # HERE WE CHECK FOR COLLIZION
        if self.player.x + 5 > self.enemy1.x - 5 and self.player.x - 5 < self.enemy1.x + 5:
            if self.player.y + 5 > self.enemy1.y - 5 and self.player.y - 5 < self.enemy1.y + 5:
                count_scores()
                self.player.x = 38
                self.player.y = 50
        if self.player.x + 5 > self.enemy2.x - 5 and self.player.x - 5 < self.enemy2.x + 5:
            if self.player.y + 5 > self.enemy2.y - 5 and self.player.y - 5 < self.enemy2.y + 5:
                count_scores()
                self.player.x = 38
                self.player.y = 50
        if self.player.x + 5 > self.enemy3.x - 5 and self.player.x - 5 < self.enemy3.x + 5:
            if self.player.y + 5 > self.enemy3.y - 5 and self.player.y - 5 < self.enemy3.y + 5:
                count_scores()
                self.player.x = 38
                self.player.y = 50
        if self.player.x + 5 > self.enemy4.x - 5 and self.player.x - 5 < self.enemy4.x + 5:
            if self.player.y + 5 > self.enemy4.y - 5 and self.player.y - 5 < self.enemy4.y + 5:
                count_scores()
                self.player.x = 38
                self.player.y = 50
        if self.player.x + 5 > self.enemy5.x - 5 and self.player.x - 5 < self.enemy5.x + 5:
            if self.player.y + 5 > self.enemy5.y - 5 and self.player.y - 5 < self.enemy5.y + 5:
                count_scores()
                self.player.x = 38
                self.player.y = 50
        if self.player.x + 3 > self.almaz1.x - 3 and self.player.x - 3 < self.almaz1.x + 3:
            if self.player.y + 3 > self.almaz1.y - 3 and self.player.y - 3 < self.almaz1.y + 3:
                count_almaz()

    def stairs(self):
        keys = pygame.key.get_pressed()
        if self.player.x in range(220, 296) and self.player.y == 50:
            if keys[pygame.K_DOWN]:
                self.player.y = 470
                self.player.x = 240

        if self.player.x in range(805, 875) and self.player.y == 470:
            if keys[pygame.K_UP]:
                self.player.y = 330
                self.player.x=230

        if self.player.x in range(460, 535) and self.player.y == 330:
            if keys[pygame.K_UP]:
                self.player.y = 50
                self.player.x = 545
        if self.player.x in range(685, 765) and self.player.y == 50:
            if keys[pygame.K_DOWN]:
                self.player.y = 190
        if self.player.x in range(360, 420) and self.player.y == 330:
            if keys[pygame.K_DOWN]:
                self.player.y = 470
        if self.player.x in range(870, 920) and self.player.y == 190:
            if keys[pygame.K_LEFT]:
                self.player.y = 600
        if self.player.x in range(40, 80) and self.player.y == 50:
            if keys[pygame.K_LEFT]:
                self.player.x = 38
        if self.player.x in range(40, 80) and self.player.y == 190:
            if keys[pygame.K_LEFT]:
                self.player.x = 38
        if self.player.x in range(266, 300) and self.player.y == 470:
            if keys[pygame.K_LEFT]:
                self.player.x = 250
        if self.player.x in range(380, 455) and self.player.y == 600:
            if keys[pygame.K_RIGHT]:
                self.player.x = 460

        if self.player.x in range(220, 250) and self.player.y == 330:
            if keys[pygame.K_DOWN]:
                self.player.y = 470
                self.player.x= 840

    def drawing_level1(self):
        self.player.character(win)
        win.blit(bg_level2, (0, 0))
        self.enemy1.draw(win)
        self.enemy2.draw(win)
        self.enemy3.draw(win)
        self.enemy4.draw(win)
        self.enemy5.draw(win)
        self.almaz1.draw(win)
        win.blit(pygame.font.Font('CAVEMAN_.TTF', 25).render('Scores:' + str(scores), True, (255, 255, 0, 255)),
                 (30, 10))

    def lev1(self):
        pygame.mixer.stop()
        lev1_sound = pygame.mixer.Sound("robber.mp3")
        pygame.mixer.Sound.play(lev1_sound)
        run = True
        while run:

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    run = False
                    break

            keys = pygame.key.get_pressed()
            print(self.player.x,self.player.y)
            self.wall()
            self.stairs()
            self.enemies()
            self.drawing_level1()
            #####-----------------Showing passing throught gate effect
            if self.player.x in range(40,80) and self.player.y == 50:
                self.player.x =90


            if self.player.x in range(40, 80) and self.player.y == 190:
                self.player.x = 90


            if self.player.x in range(930, 955) and self.player.y == 190:
                #self.player.x = 950
                self.player.y=600

            if self.player.x in range(266, 300) and self.player.y == 470:
                self.player.x = 370
            if self.player.x in range(380, 455) and self.player.y == 600:
                self.player.x = 340

            ######----------------  When player reaches the vault
            if self.player.x in range(55, 75) and self.player.y == 600:
                main_screen = pygame.image.load('nextlevel.jpg')
                main_screen = pygame.transform.scale(main_screen, size)
                win.blit(main_screen, (0, 0))
                pygame.display.update()
                pygame.time.delay(2000)
                run = False
                c = Stage3()
                c.lev1()

            ####---------------------Player position-------------
            if keys[pygame.K_LEFT] and self.player.x > 30:
                self.player.x -= self.player.vel
                self.player.left = True
                self.player.right = False
                self.player.standing = False
            elif keys[pygame.K_RIGHT] and self.player.x < 915:
                self.player.x += self.player.vel
                self.player.left = False
                self.player.right = True
                self.player.standing = False
            else:
                self.player.standing = True
                self.player.walkCount = 0

class Stage3:
    player=level1()
    enemy1=Enemy_level1(550,50,80,80,830,0.5)
    enemy2=Enemy_level1(80,190,80,80,480,0.5)
    enemy3=Enemy_level1(600, 190, 80, 80, 930, 0.1)
    enemy4 = Enemy_level1(70, 330, 80, 80, 390, 0.5)
    enemy5 =Enemy_level1(500, 330, 80, 80, 930, 0.5)
    enemy6 =Enemy_level1(70,470,80,80,270,0.5)
    enemy7 = Enemy_level1(370, 470, 80, 80, 930, 0.5)
    almaz1 = Almaz(240, 50, 50, 50, 60, 0.1)

    def wall(self):
        if self.player.y==50 and self.player.x>=830:
            self.player.x = 830

        if self.player.y==190 and self.player.x>=950:
            self.player.x = 950
        if self.player.y==330 and self.player.x>=950:
            self.player.x = 950

        if self.player.y==470 and self.player.x>=950:
            self.player.x = 950

        if self.player.y==610 and self.player.x>=950:
            self.player.x = 950

    def enemies(self):
        #HERE WE CHECK FOR COLLIZION
        if self.player.x + 5 > self.enemy1.x - 5 and self.player.x - 5 < self.enemy1.x + 5:
            if self.player.y + 5 > self.enemy1.y - 5 and self.player.y - 5 < self.enemy1.y + 5:
                count_scores()
                self.player.x = 38
                self.player.y = 50
        if self.player.x + 5 > self.enemy2.x - 5 and self.player.x - 5 < self.enemy2.x + 5:
            if self.player.y + 5 > self.enemy2.y - 5 and self.player.y - 5 < self.enemy2.y + 5:
                count_scores()
                self.player.x = 38
                self.player.y = 50
        if self.player.x + 5 > self.enemy3.x - 5 and self.player.x - 5 < self.enemy3.x + 5:
            if self.player.y + 5 > self.enemy3.y - 5 and self.player.y - 5 < self.enemy3.y + 5:
                count_scores()
                self.player.x = 38
                self.player.y = 50
        if self.player.x + 5 > self.enemy4.x - 5 and self.player.x - 5 < self.enemy4.x + 5:
            if self.player.y + 5 > self.enemy4.y - 5 and self.player.y - 5 < self.enemy4.y + 5:
                count_scores()
                self.player.x = 38
                self.player.y = 50
        if self.player.x + 5 > self.enemy5.x - 5 and self.player.x - 5 < self.enemy5.x + 5:
            if self.player.y + 5 > self.enemy5.y - 5 and self.player.y - 5 < self.enemy5.y + 5:
                count_scores()
                self.player.x = 38
                self.player.y = 50
        if self.player.x + 5 > self.enemy6.x - 5 and self.player.x - 5 < self.enemy6.x + 5:
            if self.player.y + 5 > self.enemy6.y - 5 and self.player.y - 5 < self.enemy6.y + 5:
                count_scores()
                self.player.x = 38
                self.player.y = 50
        if self.player.x + 5 > self.enemy7.x - 5 and self.player.x - 5 < self.enemy7.x + 5:
            if self.player.y + 5 > self.enemy7.y - 5 and self.player.y - 5 < self.enemy7.y + 5:
                count_scores()
                self.player.x = 38
                self.player.y = 50
        if self.player.x + 3 > self.almaz1.x - 3 and self.player.x - 3 < self.almaz1.x + 3:
            if self.player.y + 3 > self.almaz1.y - 3 and self.player.y - 3 < self.almaz1.y + 3:
                count_almaz()
    def stairs(self):
        keys = pygame.key.get_pressed()
        if self.player.x in range(730,800) and self.player.y == 50:
            if keys[pygame.K_DOWN]:
                self.player.y = 190
                #self.player.x = 750
        if self.player.x in range(730,800) and self.player.y == 190:
            if keys[pygame.K_UP]:
                self.player.y = 50
        if self.player.x in range(590,640) and self.player.y == 190:
            if keys[pygame.K_DOWN]:
                self.player.y = 330
        if self.player.x in range(590,640) and self.player.y == 330:
            if keys[pygame.K_UP]:
                self.player.y = 190

        if self.player.x in range(720,810) and self.player.y == 330:
            if keys[pygame.K_DOWN]:
                self.player.y = 470
        if self.player.x in range(720,810) and self.player.y == 470:
            if keys[pygame.K_UP]:
                self.player.y = 330
        if self.player.x in range(340,370) and self.player.y == 470:
            if keys[pygame.K_DOWN]:
                self.player.y = 610
        if self.player.x in range(340,370) and self.player.y == 610:
            if keys[pygame.K_UP]:
                self.player.y = 470
        if self.player.x in range(120,180) and self.player.y == 610:
            if keys[pygame.K_UP]:
                self.player.y = 470

        if self.player.x in range(120,180) and self.player.y == 470:
            if keys[pygame.K_DOWN]:
                self.player.y = 610
        if self.player.x in range(30,55) and self.player.y == 470:
            if keys[pygame.K_LEFT]:
                self.player.y = 190

        if self.player.x in range(30,55) and self.player.y == 190:
            if keys[pygame.K_DOWN]:
                self.player.y = 470

        if self.player.x in range(395,495) and self.player.y == 330:
            if keys[pygame.K_LEFT]:
                self.player.x=380
        if self.player.x in range(330,380) and self.player.y == 190:
            if keys[pygame.K_DOWN]:
                self.player.x=850
                self.player.y=610



    def drawing_level1(self):
        self.player.character(win)
        win.blit(bg_level3,(0,0))
        self.enemy1.draw(win)
        self.enemy2.draw(win)
        self.enemy3.draw(win)
        self.enemy4.draw(win)
        self.enemy6.draw(win)
        self.enemy7.draw(win)
        self.almaz1.draw(win)
        win.blit(pygame.font.Font('CAVEMAN_.TTF', 25).render('Scores:' + str(scores), True, (255, 255, 0, 255)),
                 (30, 10))

    def lev1(self):

        pygame.mixer.stop()
        lev1_sound = pygame.mixer.Sound("robber.mp3")
        pygame.mixer.Sound.play(lev1_sound)
        run = True
        while run:

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    run = False
                    break

            keys = pygame.key.get_pressed()
            print(self.player.x,self.player.y)

            self.wall()
            self.stairs()
            self.enemies()
            self.drawing_level1()
#####-----------------Showing passing throught gate effect
            if self.player.x in range(395,495) and self.player.y == 330:
                self.player.x = 500

######----------------  When player reaches the vault
            if self.player.x in range(640,680) and self.player.y==610:
                pygame.mixer.stop()
                lev1_sound = pygame.mixer.Sound("gamewin.mp3")
                pygame.mixer.Sound.play(lev1_sound)
                main_screen = pygame.image.load('gameover.jpg')
                main_screen = pygame.transform.scale(main_screen, size)
                win.blit(main_screen, (0, 0))
                pygame.display.update()
                pygame.time.delay(2000)
                run = False

####---------------------Player position-------------
            if keys[pygame.K_LEFT] and self.player.x>30:
                self.player.x-=self.player.vel
                self.player.left=True
                self.player.right=False
                self.player.standing=False
            elif keys[pygame.K_RIGHT] and self.player.x<915:
                self.player.x+=self.player.vel
                self.player.left=False
                self.player.right=True
                self.player.standing=False
            elif keys[pygame.K_BACKSPACE]:
                pause()
            else:
                self.player.standing=True
                self.player.walkCount=0

def pause():
    paused=True
    while pause:
        for event in pygame.event.get():
            if event.type==pygame.QUIT:
                pygame.quit()
                quit()
            print_text('Paused. Press enter to continue ',160,300)
            keys=pygame.key.get_pressed()
            if keys[pygame.K_BACKSPACE]:
                paused=False
            pygame.display.update()
            pygame.clock.tick(60)


def game_intro():

    intro=True
    while intro:
        show_menu()
        """main_screen=pygame.image.load('mybg.jpg')
        main_screen=pygame.transform.scale(main_screen,size)
        win.blit(main_screen,(0,0))
        pygame.display.update()"""
        for event in pygame.event.get():
            if event.type==pygame.QUIT:
                intro=False
                break





            """if event.type==pygame.MOUSEBUTTONDOWN:
                for x in range(510,680):
                    for y in range(270,375):
                        if pygame.mouse.get_pos()==(x,y):
                            intro=False

                            #pygame.mixer.Sound.play("Weirding_Way.mp3")
                            #level1_music=pygame.mixer.music.play(-1,31)
                            #x=Stage1()
                            #x.lev1()
                            b=Stage3()
                            b.lev1()

                            #checking quit button
                for x in range(510,680):
                    for y in range(270,375):
                        if pygame.mouse.get_pos()==(x,y):
                            pygame.quit()
                            quit()"""
        

if __name__=="__main__":

    game_intro()
    msg=True
    while msg:
        main_screen = pygame.image.load('gameover.jpg')
        main_screen = pygame.transform.scale(main_screen, size)
        win.blit(main_screen,(0,0))
        pygame.display.update()
        pygame.time.delay(2000)
        msg=False







