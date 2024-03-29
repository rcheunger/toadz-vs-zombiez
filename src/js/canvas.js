const canvas = document.querySelector('canvas')
const helpBtns = document.getElementById('helpBtns')
const shopBtns = document.getElementById('shopBtns')
const claimBtn = document.getElementById('claimBtn')
const startGame = document.getElementById('startBtn')
const header = document.getElementById('header')
const footer = document.getElementById('footer')
const enterPageToad = document.getElementById('toadJump')
const c = canvas.getContext('2d')
let coinsCollectedElem = document.querySelector("[data-coins]")

canvas.width = 1024
canvas.height = 576

// gravity strength
let gravity = 0.5

class Player {
    constructor() {
        this.speed = 9
        this.position = {
            x: 100,
            y: 0
        }
        this.velocity = {
            x: 0,
            y: 0
        }

        this.width = 90
        this.height = 120

        //sprite animations imported
        this.frames = 0
        this.sprites = {
            stand: {
                right: createImage(toadRightStand),
                left: createImage(toadLeftStand),
                potion: {
                    right: createImage(cyclopsRightStand),
                    left: createImage(cyclopsLeftStand)
                }
            },
            run: {
                right: createImage(toadRunRight),
                left: createImage(toadRunLeft),
                potion: {
                    right: createImage(cyclopsRunRight),
                    left: createImage(cyclopsRunLeft)
                }
            },
            jump: {
                right: createImage(toadJumpRight),
                left: createImage(toadJumpLeft),
                potion: {
                    right: createImage(cyclopsJumpRight),
                    left: createImage(cyclopsJumpLeft)
                }
            },
        }

        this.currentSprite = this.sprites.stand.right
        this.powerUps = {
            potion: false
        }
        this.invincible = false
        this.opacity = 1
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.drawImage(
            this.currentSprite,
            300 * this.frames,
            0,
            300,
            400,
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        )
        c.restore()
    }

    // gravity properties
    update() {
        this.frames++
        const {currentSprite, sprites} = this

        if (this.frames > 28 && (currentSprite === sprites.stand.right || currentSprite === sprites.stand.left 
            || currentSprite === sprites.stand.potion.left|| currentSprite === sprites.stand.potion.right)) 
            this.frames = 0
        else if (this.frames > 59 && (currentSprite === sprites.run.right || currentSprite === sprites.run.left 
            || currentSprite === sprites.run.potion.right || currentSprite === sprites.run.potion.left))
            this.frames = 0
        else if (currentSprite === sprites.jump.right ||
                 currentSprite === sprites.jump.left ||
                 currentSprite === sprites.jump.potion.right ||
                 currentSprite === sprites.jump.potion.left)
            this.frames = 0

        this.draw()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        if (this.position.y +this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity

        if (this.invincible) {
            if (this.opacity === 1) this.opacity = 0
                else this.opacity = 1
        } else this.opacity = 1
    }
}

class Platform {
    constructor({ x, y, image, block, help, shop, play }) {
         this.position = {
             x,
             y
         }

         this.velocity = {
             x: 0
         }

         this.image = image
         this.width = image.width
         this.height = image.height 
         this.block = block
         this.help = help
         this.shop = shop
         this.play = play
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
    }
}

class GenericObject {
    constructor({ x, y, image }) {
         this.position = {
             x,
             y
         }

         this.velocity = {
            x: 0
        }

         this.image = image
         this.width = image.width
         this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
    }
}

class Zombie {
    constructor({position, velocity, distance = {
        limitLeft: 75,
        limitRight: -75,
        traveled: 0
    } }) {
        this.position = {
            x: position.x,
            y: position.y,
        }

        this.velocity = {
            x: velocity.x,
            y: velocity.y,
        }

        this.width = 120
        this.height = 150
        
        this.sprites = {
            walk: {
                right: createImage(zombieSpriteRight),
                left: createImage(zombieSprite),
            }
        }
        
        this.currentSprite = this.sprites.walk.left
        this.frames= 0

        this.distance = distance
    }

    draw() {
        c.drawImage(
            this.currentSprite,
            300 * this.frames,
            0,
            300,
            400,
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height,
            this.position.x)
    }

    update() {
        this.frames++
        if (this.frames > 47 && (this.currentSprite === this.sprites.walk.left || this.currentSprite === this.sprites.walk.right)) 
            this.frames = 0
        this.draw()

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y +this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity

        //walk the zombie backwards
        this.distance.traveled -= this.velocity.x
        
        if (this.distance.traveled > this.distance.limitLeft) {
            this.distance.traveled = 0
            this.velocity.x = -this.velocity.x
            this.currentSprite = this.sprites.walk.right
        } else if (this.distance.traveled < this.distance.limitRight) {
            this.distance.traveled = 0
            this.velocity.x = -this.velocity.x
            this.currentSprite = this.sprites.walk.left
        }
    }
}

class Pad {
    constructor({ x, y, image }) {
         this.position = {
             x,
             y
         }

         this.velocity = {
             x: 0
         }

         this.image = image
         this.width = image.width
         this.height = image.height 
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
    }
}

    
class Potion {
    constructor({ x, y, image }) {
         this.position = {
             x,
             y
         }

         this.velocity = {
             x: 0
         }

        this.image = image
        this.width = 40
        this.height = 60
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
    }
}

class Coin {
    constructor({ x, y, image }) {
         this.position = {
             x,
             y
         }

         this.velocity = {
             x: 0
         }

        this.image = image
        this.width = 50
        this.height = 50
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
    }
}


class Particle {
    constructor({position, velocity, radius, color = 'green', laser = false}) {
        this.position = {
            x: position.x,
            y: position.y
        }
        this.velocity = {
            x: velocity.x,
            y: velocity.y
        }
        this.radius = radius
        this.ttl = 300
        this.color = color
        this.laser = laser
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
    }

    update() {
        this.ttl--
        this.draw()
        this.position.x += this.velocity.x
        this.position.y+= this.velocity.y

        if (this.position.y +this.radius + this.velocity.y <= canvas.height)
        this.velocity.y += gravity * 0.5
    }
}

class Abduction {
    constructor({ x, y }) {
        this.position = {
            x,
            y
        }

        this.width = 400
        this.height = 576
        this.frames= 0

        this.sprites = {
            abduction: {
                abduction: createImage(abduction),
            }
        }
        this.currentSprite = this.sprites.abduction.abduction
    }

    draw() {
        c.drawImage(
            this.currentSprite,
            400 * this.frames,
            0,
            400,
            576,
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height,
            this.position.x)
    }

    update() {
        this.frames++
        this.draw()
    }
}

let platformImage
let tPlatformImage
let xtPlatformImage
let blockTriImage
let blockImage
let padImage
let potionImage
let coinImage

let player = new Player()
let platforms = []
let genericObjects = []
let zombiez = []
let particles = []
let potions = []
let coins = []
let pads = []
let abductions = []

let lastKey
let keys 
let scrollOffset
let game
let coinsCollected = 0
let currentLevel = 8
let laserTimeOut = 0
let jumpInt = 0
let letAbduction 

function selectLevel(currentLevel) {
    switch (currentLevel) {
        case 1:
           gameResetLevel1()
           break
        case 2: 
           gameResetLevel2()
           break
        case 3: 
           gameResetLevel3()
           break  
        case 4: 
            gameResetLevel4()
            break      
        case 5:
           goHome()
           break
        case 6:
            goHelp()
            break
        case 7: 
            goShop()
            break
        case 8:
            enterPage()
            break
    }
}

async function abductionFunction() {
    enterPageToad.style.display = "none"
    letAbduction = true

    setTimeout(()=> {
        goHome()
        selectLevel(currentLevel == 5)
      },4500)
}

async function claimCoinBtn() {
    claimCoins(), 
    approveContract(),
    coinsCollected = 0
}

async function gameResetLevel1() {
    currentLevel = 1
    player = new Player()

    keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    }

    scrollOffset = 0

    game = {
        disableUserInput: false
    }

   platformImage = await createImageAsync(platform)
   tPlatformImage = await createImageAsync(tPlatform)
   xtPlatformImage = await createImageAsync(xtPlatform)
   blockTriImage = await createImageAsync(blockTri)
   blockImage = await createImageAsync(block)
   padImage = await createImageAsync(pad)
   potionImage = await createImageAsync(potion)
   coinImage = await createImageAsync(coin)
   
    zombiez = [
        new Zombie({
        position: {
            x: 2750,
            y: 100
        },
        velocity: {
            x:-0.5,
            y: 0
        }
        }),

        new Zombie({
        position: {
            x: 6000,
            y: 100,
        },
        velocity: {
            x:-0.5,
            y: 0,
        },        
        distance: {
        limitLeft: 250,
        limitRight: -250,
        traveled: 0
        }
        }),

        new Zombie({
        position: {
            x: 6100,
            y: 100,
        },
        velocity: {
            x:-0.5,
            y: 0,
        },        
        distance: {
        limitLeft: 250,
        limitRight: -250,
        traveled: 0
        }
        }),

        new Zombie({
        position: {
            x: 6200,
            y: 100,
        },
        velocity: {
            x:-0.5,
            y: 0,
        },        
        distance: {
        limitLeft: 250,
        limitRight: -250,
        traveled: 0
        }
        }),
        
        new Zombie({
        position: {
            x: 6300,
            y: 100,
        },
        velocity: {
            x:-0.5,
            y: 0,
        },        
        distance: {
        limitLeft: 250,
        limitRight: -250,
        traveled: 0
        }
        }),

        new Zombie({
        position: {
            x: 8450,
            y: 100
        },
        velocity: {
            x:-0.5,
            y: 0
        }
        }),
        new Zombie({
        position: {
            x: 11600,
            y: 100,
        },
        velocity: {
            x:-0.5,
            y: 0,
        },        
        distance: {
        limitLeft: 150,
        limitRight: -150,
        traveled: 0
        }
        }),
        new Zombie({
        position: {
            x: 11800,
            y: 100,
        },
        velocity: {
            x:-0.5,
            y: 0,
        },        
        distance: {
        limitLeft: 225,
        limitRight: -225,
        traveled: 0
        }
        }),
        new Zombie({
        position: {
            x: 12000,
            y: 100,
        },
        velocity: {
            x:-0.5,
            y: 0,
        },        
        distance: {
        limitLeft: 200,
        limitRight: -200,
        traveled: 0
        }
        }),
        new Zombie({
        position: {
            x: 12200,
            y: 100,
        },
        velocity: {
            x:-0.5,
            y: 0,
        },        
        distance: {
        limitLeft: 175,
        limitRight: -175,
        traveled: 0
        }
        }),
        new Zombie({
        position: {
            x: 12400,
            y: 100,
        },
        velocity: {
            x:-0.5,
            y: 0,
        },        
        distance: {
        limitLeft: 150,
        limitRight: -150,
        traveled: 0
        }
        }),
        new Zombie({
        position: {
            x: 12700,
            y: 100,
        },
        velocity: {
            x:-0.5,
            y: 0,
        },        
        distance: {
        limitLeft: 100,
        limitRight: -100,
        traveled: 0
        }
        }),
    ]
    
    particles = []
    platforms = [
    new Platform ({
        x: 1700,
        y: 290,
        image: blockTriImage,
        block: true
    }),
    new Platform ({
        x: 2150,
        y: 190,
        image: xtPlatformImage,
    }),
    new Platform ({
        x: 3750,
        y: 290,
        image: blockImage,
        block: true
    }),
    new Platform ({
        x: 4125,
        y: 310,
        image: tPlatformImage,
    }),
    new Platform ({
        x: 6925,
        y: 290,
        image: blockTriImage,
        block: true
    }),
    new Platform ({
        x: 9325,
        y: 400,
        image: blockImage,
        block: true
    }),
    new Platform ({
        x: 9525,
        y: 400,
        image: blockImage,
        block: true
    }),
    new Platform ({
        x: 9725,
        y: 400,
        image: blockImage,
        block: true
    }),
    new Platform ({
        x: 9925,
        y: 350,
        image: blockImage,
        block: true
    }),
    new Platform ({
        x: 10125,
        y: 300,
        image: blockImage,
        block: true
    }),
    new Platform ({
        x: 10325,
        y: 250,
        image: blockImage,
        block: true
    }),
    new Platform ({
        x: 10525,
        y: 200,
        image: blockTriImage,
        block: true
    }),
    new Platform ({
        x: 10678,
        y: 200,
        image: blockTriImage,
        block: true
    }),
    new Platform ({
        x: 10831,
        y: 200,
        image: blockTriImage,
        block: true
    }),
    new Platform ({
        x: 10984,
        y: 200,
        image: blockTriImage,
        block: true
    }),
    new Platform ({
        x: 11437,
        y: 150,
        image: blockImage,
        block: true
    }),
    new Platform ({
        x: 11737,
        y: 150,
        image: blockImage,
        block: true
    }),
    new Platform ({
        x: 12037,
        y: 150,
        image: blockImage,
        block: true
    }),
    new Platform ({
        x: 12337,
        y: 150,
        image: blockImage,
        block: true
    })
    ]

    pads = [
        new Pad ({
            x: 13200,
            y: 420,
            image: padImage,
        })
    ]


    potions = [
        new Potion ({ 
        x: 2248,
        y: 170,
        image: potionImage
    })
    ]

    coins = [
        new Coin({
        x: 1750,
        y: 225,
        image: coinImage
        }),
        new Coin({
        x: 3750,
        y: 225,
        image: coinImage
        }),
        new Coin({
        x: 6100,
        y: 160,
        image: coinImage
        }),
        new Coin({
        x: 8975,
        y: 200,
        image: coinImage
        }),
        new Coin({
        x: 9730,
        y: 315,
        image: coinImage
        }),
        new Coin({
        x: 12037,
        y: 240,
        image: coinImage
        }), 
    ]

    genericObjects = [
        new GenericObject({
            x: -1,
            y: 0,
            image: createImage(background)
        }),
        new GenericObject({
            x: -1,
            y: 0,
            image: createImage(hills)
        })
    ]

    abductions = []

    scrollOffset = 0

    const platformsMap = ['plat', 'plat', 'plat', 'plat', 'plat', 'gap', 'plat', 'plat', 
    'gap', 'gap', 'plat', 'plat', 'plat', 'gap', 'gap', 'tPlat', 'gap', 'xtPlat', 'gap', 
    'xtPlat', 'gap', 'xtPlat', 'gap', 'gap', 'gap', 'gap', 'gap', 'gap', 'gap', 'plat', 
    'plat', 'plat', 'plat', 'plat', 'plat']

    let platformDistance = 0

    platformsMap.forEach(symbol => {
        switch(symbol) {
            case 'plat':
                platforms.push(new Platform({
                    x: platformDistance,
                    y: canvas.height - platformImage.height,
                    image: platformImage,
                }))

            platformDistance += platformImage.width

            break

            case 'gap':
                platformDistance += 300

                break;
            
            case 'tPlat':
                platforms.push(new Platform({
                    x: platformDistance,
                    y: canvas.height - tPlatformImage.height,
                    image: tPlatformImage,

                }))

            platformDistance += tPlatformImage.width

            break

            case 'xtPlat':
                platforms.push(new Platform({
                    x: platformDistance,
                    y: canvas.height - xtPlatformImage.height,
                    image: xtPlatformImage,

                }))

            platformDistance += xtPlatformImage.width

            break
        }

    })
}

async function gameResetLevel2() {
    currentLevel = 2
    player = new Player()

    keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    }

    scrollOffset = 0

    game = {
        disableUserInput: false
    }


   platformImage = await createImageAsync(platformLevel2)
   tPlatformImage = await createImageAsync(tPlatformLevel2)
   xtPlatformImage = await createImageAsync(xtPlatformLevel2)
   blockTriImage = await createImageAsync(blockTri)
   blockImage = await createImageAsync(block)
   padImage = await createImageAsync(pad)
   potionImage = await createImageAsync(potion)
   coinImage = await createImageAsync(coin)
    
    platforms = [
        new Platform ({
            x: 2075,
            y: 350,
            image: blockTriImage,
            block: true
        }),
        new Platform ({
            x: 2228,
            y: 350,
            image: blockTriImage,
            block: true
        }),
        new Platform ({
            x: 2600,
            y: 350,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 3450,
            y: 300,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 3700,
            y: 220,
            image: xtPlatformImage,
        }),
        new Platform ({
            x: 4400,
            y: 375,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 4800,
            y: 275,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 5200,
            y: 375,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 5600,
            y: 275,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 6200,
            y: 370,
            image: platformImage
        }),
        new Platform ({
            x: 7660,
            y: 370,
            image: platformImage
        }),
        new Platform ({
            x: 7660,
            y: 290,
            image: platformImage
        }),
        new Platform ({
            x: 7660,
            y: 210,
            image: platformImage
        }),
        new Platform ({
            x: 8650,
            y: 210,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 9050,
            y: 160,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 9450,
            y: 210,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 9850,
            y: 160,
            image: blockImage,
            block: true
        }),          
        new Platform ({
            x: 11285,
            y: 290,
            image: platformImage
        }),
        new Platform ({
            x: 11000,
            y: 370,
            image: platformImage
        }),
        new Platform ({
            x: 11575,
            y: 370,
            image: platformImage
        })
    ]
    
    zombiez = [
        new Zombie({
            position: {
                x: 3800,
                y: 250,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 75,
            limitRight: -75,
            traveled: 0
            }
            }),
        new Zombie({
            position: {
                x: 6200,
                y: 300,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 175,
            limitRight: -175,
            traveled: 0
            }
            }),
        new Zombie({
            position: {
                x: 6600,
                y: 0,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 275,
            limitRight: -275,
            traveled: 0
            }
            }),
        new Zombie({
            position: {
                x: 6900,
                y: 300,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 175,
            limitRight: -175,
            traveled: 0
            }
            }),
        new Zombie({
            position: {
                x: 11700,
                y: 100,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 285,
            limitRight: -285,
            traveled: 0
            }
            }),   
        new Zombie({
            position: {
                x: 11600,
                y: 250,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 285,
            limitRight: -285,
            traveled: 0
            }
            }),            
        new Zombie({
            position: {
                x: 11500,
                y: 300,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 285,
            limitRight: -285,
            traveled: 0
            }
            }),  
    ]
    particles = []

    pads = [
        new Pad ({
            x: 13200,
            y: 420,
            image: padImage,
        })
    ]

    potions = [new Potion({
        x: 3800,
        y: 201,
        image: potionImage
    }
    )]

    coins = [
        new Coin({
        x: 2600,
        y: 275,
        image: coinImage
        }),
        new Coin({
        x: 4000,
        y: 340,
        image: coinImage
        }),
        new Coin({
        x: 6120,
        y: 160,
        image: coinImage
        }),
        new Coin({
        x: 7925,
        y: 425,
        image: coinImage
        }),
        new Coin({
        x: 9850,
        y: 90,
        image: coinImage
        }),
        new Coin({
        x: 11550,
        y: 250,
        image: coinImage
        })
    ]

    genericObjects = [
        new GenericObject({
            x: -1,
            y: 0,
            image: createImage(backgroundLevel2)
        }),
        new GenericObject({
            x: -615,
            y: 0,
            image: createImage(hillsLevel2)
        })
    ]

    abductions = []

    const platformsMap = ['plat', 'plat', 'plat', 'gap', 'gap', 'gap', 'gap', 'plat', 'plat', 'gap', 
    'gap', 'gap', 'gap', 'gap', 'gap', 'plat', 'plat', 'gap', 'gap', 'plat', 'gap', 'gap', 'gap', 'gap', 'gap', 'gap',  'gap', 'plat', 
    'plat', 'plat', 'plat', 'plat', 'plat', 'plat' ]

    let platformDistance = 0

    platformsMap.forEach(symbol => {
        switch(symbol) {
            case 'plat':
                platforms.push(new Platform({
                    x: platformDistance,
                    y: canvas.height - platformImage.height,
                    image: platformImage,
                }))

            platformDistance += platformImage.width

            break

            case 'gap':
                platformDistance += 300

                break;
            
            case 'tPlat':
                platforms.push(new Platform({
                    x: platformDistance,
                    y: canvas.height - tPlatformImage.height,
                    image: tPlatformImage,

                }))

            platformDistance += tPlatformImage.width

            break

            case 'xtPlat':
                platforms.push(new Platform({
                    x: platformDistance,
                    y: canvas.height - xtPlatformImage.height,
                    image: xtPlatformImage,

                }))

            platformDistance += xtPlatformImage.width

            break
        }

    })
}

async function gameResetLevel3() {
    currentLevel = 3
    player = new Player()

    keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    }

    scrollOffset = 0

    game = {
        disableUserInput: false
    }


   platformImage = await createImageAsync(platformLevel3)
   tPlatformImage = await createImageAsync(tPlatformLevel3)
   xtPlatformImage = await createImageAsync(xtPlatformLevel3)
   blockTriImage = await createImageAsync(blockTri)
   blockImage = await createImageAsync(block)
   padImage = await createImageAsync(pad)
   potionImage = await createImageAsync(potion)
   coinImage = await createImageAsync(coin)

    
    platforms = [
        new Platform ({
            x: 1500,
            y: 320,
            image: tPlatformImage,
        }),
        new Platform ({
            x: 2050,
            y: 281,
            image: xtPlatformImage,
        }),
        new Platform ({
            x: 2634,
            y: 368,
            image: platformImage,
        }),
        new Platform ({
            x: 3213,
            y: 368,
            image: platformImage,
        }),
        new Platform ({
            x: 2634,
            y: 285,
            image: platformImage,
        }),
        new Platform ({
            x: 5150,
            y: 400,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 5350,
            y: 300,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 5550,
            y: 200,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 5850,
            y: 281,
            image: xtPlatformImage,
        }),
        new Platform ({
            x: 6390,
            y: 200,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 6750,
            y: 281,
            image: xtPlatformImage,
        }),
        new Platform ({
            x: 7290,
            y: 200,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 7650,
            y: 281,
            image: xtPlatformImage,
        }),
        new Platform ({
            x: 8300,
            y: 200,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 8700,
            y: 400,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 9100,
            y: 200,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 9500,
            y: 400,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 9900,
            y: 200,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 10300,
            y: 400,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 11000,
            y: 288,
            image: blockTriImage,
            block: true
        }),
        new Platform ({
            x: 11151,
            y: 288,
            image: blockTriImage,
            block: true
        }),
        new Platform ({
            x: 11302,
            y: 288,
            image: blockTriImage,
            block: true
        }),
        new Platform ({
            x: 11453,
            y: 288,
            image: blockTriImage,
            block: true
        }),
        new Platform ({
            x: 11604,
            y: 288,
            image: blockTriImage,
            block: true
        }),
        new Platform ({
            x: 11755,
            y: 288,
            image: blockTriImage,
            block: true
        }),
        new Platform ({
            x: 11906,
            y: 288,
            image: blockTriImage,
            block: true
        }),
        new Platform ({
            x: 12057,
            y: 288,
            image: blockTriImage,
            block: true
        }),
        new Platform ({
            x: 12208,
            y: 288,
            image: blockTriImage,
            block: true
        }),
        new Platform ({
            x: 12359,
            y: 288,
            image: blockTriImage,
            block: true
        }),
        new Platform ({
            x: 12510,
            y: 288,
            image: blockTriImage,
            block: true
        }),
        new Platform ({
            x: 12661,
            y: 288,
            image: blockTriImage,
            block: true
        }),
    ]
    
    zombiez = [
        new Zombie({
            position: {
                x: 4300,
                y: 250,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 275,
            limitRight: -275,
            traveled: 0
            }
            }),
        new Zombie({
            position: {
                x: 4550,
                y: 250,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 275,
            limitRight: -275,
            traveled: 0
            }
            }),
        new Zombie({
            position: {
                x: 4800,
                y: 250,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 275,
            limitRight: -275,
            traveled: 0
            }
            }), 
        new Zombie({
            position: {
                x: 5950,
                y: 150,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 100,
            limitRight: -100,
            traveled: 0
            }
            }),
        new Zombie({
            position: {
                x: 6850,
                y: 150,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 100,
            limitRight: -100,
            traveled: 0
            }
            }),
        new Zombie({
            position: {
                x: 7750,
                y: 150,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 100,
            limitRight: -100,
            traveled: 0
            }
            }),
        new Zombie({
            position: {
                x: 11400,
                y: 325,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 300,
            limitRight: -300,
            traveled: 0
            }
            }),
        new Zombie({
            position: {
                x: 11550,
                y: 325,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 325,
            limitRight: -325,
            traveled: 0
            }
            }),
        new Zombie({
            position: {
                x: 11700,
                y: 325,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 200,
            limitRight: -200,
            traveled: 0
            }
            }),
        new Zombie({
            position: {
                x: 11850,
                y: 325,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 370,
            limitRight: -370,
            traveled: 0
            }
            }),
        new Zombie({
            position: {
                x: 12000,
                y: 325,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 150,
            limitRight: -150,
            traveled: 0
            }
            }),
        new Zombie({
            position: {
                x: 12300,
                y: 325,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 340,
            limitRight: -340,
            traveled: 0
            }
            }),
        new Zombie({
            position: {
                x: 12450,
                y: 325,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 125,
            limitRight: -125,
            traveled: 0
            }
            }), 
        new Zombie({
            position: {
                x: 12600,
                y: 325,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 300,
            limitRight: -300,
            traveled: 0
            }
            }),          
    ]
    particles = []

    pads = [
        new Pad ({
            x: 13200,
            y: 420,
            image: padImage,
        })
    ]

    potions = [new Potion({
        x: 2900,
        y: 432,
        image: potionImage
    }
    )]

    coins = [
        new Coin({
        x: 2140,
        y: 225,
        image: coinImage
        }),
        new Coin({
        x: 4350,
        y: 350,
        image: coinImage
        }),
        new Coin({
        x: 5925,
        y: 210,
        image: coinImage
        }),
        new Coin({
        x: 9100,
        y: 125,
        image: coinImage
        }),
        new Coin({
        x: 9900,
        y: 125,
        image: coinImage
        }),
        new Coin({
        x: 11750,
        y: 350,
        image: coinImage
        }), 
    ]

    genericObjects = [
        new GenericObject({
            x: -1,
            y: 0,
            image: createImage(backgroundLevel3)
        }),
        new GenericObject({
            x: -615,
            y: 0,
            image: createImage(hillsLevel3)
        })
    ]

    abductions = []

    const platformsMap = ['plat', 'plat', 'plat', 'gap', 'gap', 'gap', 'plat', 'plat', 'plat','plat','gap',
     'gap', 'gap','gap', 'gap', 'gap','gap', 'gap', 'gap', 'gap', 'gap','gap', 'gap', 'gap','gap', 'gap', 'gap', 
     'gap', 'gap', 'plat','plat','plat','plat','plat','plat','plat']

    let platformDistance = 0

    platformsMap.forEach(symbol => {
        switch(symbol) {
            case 'plat':
                platforms.push(new Platform({
                    x: platformDistance,
                    y: canvas.height - platformImage.height,
                    image: platformImage,
                }))

            platformDistance += platformImage.width - 2

            break

            case 'gap':
                platformDistance += 300

                break;
            
            case 'tPlat':
                platforms.push(new Platform({
                    x: platformDistance,
                    y: canvas.height - tPlatformImage.height,
                    image: tPlatformImage,

                }))

            platformDistance += tPlatformImage.width

            break

            case 'xtPlat':
                platforms.push(new Platform({
                    x: platformDistance,
                    y: canvas.height - xtPlatformImage.height,
                    image: xtPlatformImage,

                }))

            platformDistance += xtPlatformImage.width

            break
        }

    })
}

async function gameResetLevel4() {
    currentLevel = 4
    player = new Player()

    keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    }

    scrollOffset = 0

    game = {
        disableUserInput: false
    }

   platformImage = await createImageAsync(platform)
   tPlatformImage = await createImageAsync(tPlatform)
   xtPlatformImage = await createImageAsync(xtPlatform)
   blockTriImage = await createImageAsync(blockTri)
   blockImage = await createImageAsync(block)
   padImage = await createImageAsync(pad)
   potionImage = await createImageAsync(potion)
   coinImage = await createImageAsync(coin)

    
    platforms = [ 
        new Platform ({
            x: 1970,
            y: 370,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 2240,
            y: 281,
            image: xtPlatformImage,
        }),
        new Platform ({
            x: 2642,
            y: 370,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 2850,
            y: 281,
            image: xtPlatformImage,
        }),
        new Platform ({
            x: 3290,
            y: 370,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 4000,
            y: 358,
            image: platformImage,
        }),     
        new Platform ({
            x: 4550,
            y: 275,
            image: platformImage,
        }),
        new Platform ({
            x: 4550,
            y: 358,
            image: platformImage,
        }),
        new Platform ({
            x: 5100,
            y: 358,
            image: platformImage,
        }),
        new Platform ({
            x: 7400,
            y: 465,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 7900,
            y: 465,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 8400,
            y: 465,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 8900,
            y: 465,
            image: blockImage,
            block: true
        }),
        new Platform ({
            x: 10300,
            y: 281,
            image: xtPlatformImage,
        }),
    ]
    
    zombiez = [
        new Zombie({
            position: {
                x: 4500,
                y: 250,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 275,
            limitRight: -275,
            traveled: 0
            }
            }),
        new Zombie({
            position: {
                x: 4800,
                y: 100,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 175,
            limitRight: -175,
            traveled: 0
            }
            }),
        new Zombie({
            position: {
                x: 5200,
                y: 200,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 255,
            limitRight: -255,
            traveled: 0
            }
            }), 
        new Zombie({
            position: {
                x: 6150,
                y: 150,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 100,
            limitRight: -100,
            traveled: 0
            }
            }),
        new Zombie({
            position: {
                x: 10400,
                y: 250,
            },
            velocity: {
                x:-0.5,
                y: 0,
            },        
            distance: {
            limitLeft: 75,
            limitRight: -75,
            traveled: 0
            }
            }),
             
    ]
    particles = []

    pads = [
        new Pad ({
            x: 13200,
            y: 420,
            image: padImage,
        })
    ]

    potions = [new Potion({
        x: 2942,
        y: 255,
        image: potionImage
    }
    )]

    coins = [
        new Coin({
        x: 2320,
        y: 80,
        image: coinImage
        }),
        new Coin({
        x: 4830,
        y: 325,
        image: coinImage
        }),
        new Coin({
        x: 6270,
        y: 180,
        image: coinImage
        }),
        new Coin({
        x: 9170,
        y: 135,
        image: coinImage
        }),
        new Coin({
        x: 10384,
        y: 385,
        image: coinImage
        }),
    ]

    genericObjects = [
        new GenericObject({
            x: -1,
            y: 0,
            image: createImage(backgroundLevel4)
        }),
        new GenericObject({
            x: -615,
            y: 0,
            image: createImage(hillsLevel4)
        })
    ]

    abductions = []

    const platformsMap = ['plat', 'plat', 'plat', 'gap', 'gap', 'gap', 'gap', 'gap', 'gap','plat','plat', 
    'plat', 'plat','plat','plat', 'gap', 'gap', 'gap', 'gap', 'gap', 'gap','gap', 'gap',
     'plat', 'plat', 'gap', 'gap','plat', 'plat', 'plat','plat','plat','plat']

    let platformDistance = 0

    platformsMap.forEach(symbol => {
        switch(symbol) {
            case 'plat':
                platforms.push(new Platform({
                    x: platformDistance,
                    y: canvas.height - platformImage.height,
                    image: platformImage,
                }))

            platformDistance += platformImage.width - 2

            break

            case 'gap':
                platformDistance += 300

                break;
            
            case 'tPlat':
                platforms.push(new Platform({
                    x: platformDistance,
                    y: canvas.height - tPlatformImage.height,
                    image: tPlatformImage,

                }))

            platformDistance += tPlatformImage.width

            break

            case 'xtPlat':
                platforms.push(new Platform({
                    x: platformDistance,
                    y: canvas.height - xtPlatformImage.height,
                    image: xtPlatformImage,

                }))

            platformDistance += xtPlatformImage.width

            break
        }

    })
}

async function goHome() { 
    helpBtns.style.display = "none"
    shopBtns.style.display = "none"
    header.style.display = "block"
    footer.style.display = "block"
    startGame.style.display = "none"
    enterPageToad.style.display = "none"

    currentLevel = 5

    player = new Player()
    audioGameOver.audio.play()  

    scrollOffset = 0

    game = {
        disableUserInput: false
    }
    
    platformImage = await createImageAsync(platform)

    zombiez = []
    particles = []

    platforms = [ 
        new Platform ({
        x: 485,
        y: 300,
        image: createImage(play),
        play: true,
        block: true
        }),
    ]

    potions = []
    coins = []
    pads = []
    abductions = []

    genericObjects = [
        new GenericObject({
            x: 0,
            y: 0,
            image: createImage(homeBackground)
        }),
    ]
    
    const platformsMap = ['plat', 'plat', 'plat']

    let platformDistance = 0

    platformsMap.forEach(symbol => {
        switch(symbol) {
            case 'plat':
                platforms.push(new Platform({
                    x: platformDistance,
                    y: canvas.height - platformImage.height + 35,
                    image: platformImage,
                }))

            platformDistance += platformImage.width
            break
        }
    })
}

async function goHelp() {
    helpBtns.style.display = "block"
    shopBtns.style.display = "none"

    currentLevel = 6
    keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    }

    scrollOffset = 0

    game = {
        disableUserInput: true
    }

    platformImage = await createImageAsync(platformLevel3)

    zombiez = []
    particles = []
    platforms = []
    potions = []
    coins = []
    pads = []
    abductions = []

    genericObjects = [
        new GenericObject({
            x: 0,
            y: 0,
            image: createImage(helpBackground)
        }),
    ]
    

    const platformsMap = ['plat', 'plat', 'plat']

    let platformDistance = 0

    platformsMap.forEach(symbol => {
        switch(symbol) {
            case 'plat':
                platforms.push(new Platform({
                    x: platformDistance,
                    y: canvas.height - platformImage.height + 35,
                    image: platformImage,
                }))

            platformDistance += platformImage.width
            break
        }   
         
    })
}

async function goShop() {
    helpBtns.style.display = "none"
    shopBtns.style.display = "block"

    currentLevel = 7

    keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    }

    scrollOffset = 0

    game = {
        disableUserInput: true
    }

    platformImage = await createImageAsync(platformLevel2)

    zombiez = []
    particles = []
    platforms = []
    potions = []
    coins = []
    pads = []
    abductions = []

    genericObjects = [
        new GenericObject({
            x: 0,
            y: 0,
            image: createImage(shopBackground)
        }),
    ]
    

    const platformsMap = ['plat', 'plat', 'plat']

    let platformDistance = 0

    platformsMap.forEach(symbol => {
        switch(symbol) {
            case 'plat':
                platforms.push(new Platform({
                    x: platformDistance,
                    y: canvas.height - platformImage.height + 35,
                    image: platformImage,
                }))

            platformDistance += platformImage.width
            break
        }
    })
}

async function enterPage() {
    currentLevel = 8

    player.position.x = 462

    keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    }

    scrollOffset = 0

    game = {
        disableUserInput: true
    }

    zombiez = []
    particles = []
    platforms = []
    potions = []
    coins = []
    pads = []

     abductions = [
        new Abduction ({
            x: 316,
            y: 0
        })
    ]

    genericObjects = [
        new GenericObject({
            x: 0,
            y: 0,
            image: createImage(enterPageBg)
        }),
    ]
}

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle= 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)


    const homeElem = document.querySelector('.home')
    const helpElem = document.querySelector('.help')
    const shopElem = document.querySelector('.shop')
    const claimButton = document.querySelector('.claim')
    const startGameButton = document.querySelector('.startBtn')
    
    homeElem.onclick = goHome
    helpElem.onclick = goHelp
    shopElem.onclick = goShop
    claimButton.onclick = claimCoinBtn
    startGameButton.onclick = abductionFunction 

    if (currentLevel == 8) {
        canvas.height = 750
    }
    else {
        canvas.height = 576
    }

    genericObjects.forEach(genericObject => {
        genericObject.update()
        genericObject.velocity.x = 0
    })

    platforms.forEach(platform => {
       platform.update() 
       platform.velocity.x = 0
    })

    
    pads.forEach(pad => {
        if 
        (currentLevel == 1 || currentLevel == 2 || currentLevel == 3 || currentLevel == 4)
        {
            pad.update() 
            pad.velocity.x = 0   
        }             
        //end of level pad detection -> go to next level
        if (isOnTopOfPad({
                    object: player,
                    pad
                })
            )
            {
            game.disableUserInput = true
            audioGameOver.audio.play()
    
            player.velocity.y = 0
            player.velocity.x = 0
            player.opacity = 0 
            gravity = 0.5
            selectLevel(currentLevel + 1)
            }                
        })


    //Toad potion powerup
    potions.forEach((potion, i) => {
        if (objectsTouch ({ 
            object1: player,
            object2: potion
        })
        ) {
            player.powerUps.potion = true
        setTimeout(() => {
            potions.splice(i, 1)
            audioLaser.audio.play()
        }, 0)
        } else potion.update()
    })

    coinsCollectedElem.textContent = `${coinsCollected}`

    //collect coins
    coins.forEach((coin, i) => {
        if (objectsTouch ({ 
            object1: player,
            object2: coin
        })
        ) {
        coinsCollected ++
        setTimeout(() => {
            coins.splice(i, 1)
            coinCollect.audio.play()
        }, 0)
        } else coin.update()
    })

    zombiez.forEach((zombie, index) => {
        zombie.update()

        //remove zombie on laser beam
        particles.forEach((particle, particleIndex) => {
            if (
                particle.laser &&
                particle.position.x + particle.radius >= zombie.position.x
                && particle.position.y + particle.radius >= zombie.position.y
                && particle.position.x - particle.radius <= zombie.position.x + zombie.width
                && particle.position.y - particle.radius <= zombie.position.y + zombie.height
                )
            {
            for (let i = 0; i < 50; i++) {
                particles.push(
                    new Particle({
                    position: {
                        x: zombie.position.x + zombie.width / 2,
                        y: zombie.position.y + zombie.height / 2
                    },
                    velocity: {
                        x: (Math.random() - 0.5) * 5,
                        y: (Math.random() - 0.5) * 10
                    },
                    radius: Math.random() * 2.5
                }))
            }
            setTimeout(() => {
                audioZombieDeath.audio.play()
                zombiez.splice(index, 1)   
                particles.splice(particleIndex, 1)
            }, 0)
            }
        })

        //zombie squish 
        if (collisionTop({
            object1: player,
            object2: zombie
        })) {
            //squished zombie particles
            for (let i = 0; i < 50; i++) {
                 particles.push(new Particle({
                     position: {
                         x: zombie.position.x + zombie.width / 2,
                        y: zombie.position.y + zombie.height / 2
                    },
                    velocity: {
                        x: (Math.random() - 0.5) * 5,
                        y: (Math.random() - 0.5) * 10
                    },
                    radius: Math.random() * 2.5
                }))
            }
            audioZombieDeath.audio.play()
            //player boost on zombie squish
            player.velocity.y -=`25`
            setTimeout(() => {
                zombiez.splice(index, 1)   
                
            }, 0)
        } else if (
            player.position.x + player.width >= zombie.position.x
                && 
            player.position.y + player.height >= zombie.position.y
                &&
            player.position.x <= zombie.position.x + zombie.width
        ) { 
        //player hits zombie
            if (player.powerUps.potion) {
                player.invincible = true
                player.powerUps.potion = false
                audioLosePowerUp.audio.play()

                setTimeout(() => {
                    player.invincible = false}, 1000)
            } else if (!player.invincible) {
            audioGameOver.audio.play()
            selectLevel(currentLevel)
        }
        }
    })

    //start game abduction 
    abductions.forEach(abduction => {
        if (letAbduction == true){
        abduction.update()
        letAbduction == false
        }
    })

    //particle creation
    particles.forEach((particle, i) => {
        particle.update()
        if (particle.laser && (particle.position.x - particle.radius >= canvas.width 
            || particle.position.x + particle.radius <= 0)) 
        setTimeout(() => {
            particles.splice(i, 1)
        }, 0)
    })

    if (currentLevel == 1 || currentLevel == 2 || currentLevel == 3 || currentLevel == 4 || currentLevel == 5)
    {
        player.update()
    }
    
    if (game.disableUserInput) return

    //scrolling code start
    let hitSide = false
    //left and right movement 
    if (
        ((currentLevel == 1 || currentLevel == 2 || currentLevel == 3 || currentLevel == 4) && keys.right.pressed && player.position.x < 400) ||
        ((currentLevel == 5) && keys.right.pressed && player.position.x < 935) 
    ) {
        player.velocity.x = player.speed
    } else if (
        ((currentLevel == 1 || currentLevel == 2 || currentLevel == 3 || currentLevel == 4) && keys.left.pressed && player.position.x > 100) || 
        ((currentLevel == 5) && keys.left.pressed && player.position.x > 0) ||
        ((currentLevel == 1 || currentLevel == 2 || currentLevel == 3 || currentLevel == 4) && keys.left.pressed && scrollOffset === 0 && player.position.x > 0) ||
        ((currentLevel == 5) && keys.left.pressed && scrollOffset === 0 && player.position.x > 0) ||
        ((currentLevel == 1 || currentLevel == 2 || currentLevel == 3 || currentLevel == 4) && keys.right.pressed && scrollOffset === 13250 && player.position.x > 13250) ||
        ((currentLevel == 5) && keys.right.pressed && scrollOffset === 0 && player.position.x > 934)
    ) {
        player.velocity.x = -player.speed
    } else {
        player.velocity.x = 0
    
        //scrolling code
        if (keys.right.pressed && scrollOffset < 13250)  
        {
            for (let i = 0; i < platforms.length; i++) {
                const platform = platforms[i]
                platform.velocity.x = -player.speed
                if (
                  platform.block &&
                  hitSideOfPlatform({
                    object: player,
                    platform
                  })
                ) {
                  platforms.forEach((platform) => {
                    platform.velocity.x = 0
                  })
                hitSide = true
                break
                }
            }    

        if (!hitSide) {
        scrollOffset += player.speed

        genericObjects.forEach((genericObject) => {
          genericObject.velocity.x = -player.speed * 0.66
        })
            zombiez.forEach((zombie) => {
                zombie.position.x -= player.speed
            })
            potions.forEach((potion) => {
                potion.position.x -= player.speed
            })
            coins.forEach((coin) => {
                coin.position.x -= player.speed
            })
            particles.forEach((particle) => {
                particle.position.x -= player.speed
            })
            pads.forEach((pad) => {
                pad.position.x -= player.speed
             })
        }
            
        } else if (keys.left.pressed && scrollOffset > 0) {
            for (let i = 0; i < platforms.length; i++) {
                const platform = platforms[i]
                platform.velocity.x = player.speed
        
                if (
                  platform.block &&
                  hitSideOfPlatform({
                    object: player,
                    platform
                  })
                ) {
                  platforms.forEach((platform) => {
                    platform.velocity.x = 0
                  })
                  hitSide = true
                  break
                }
              }
              if (!hitSide) {
                scrollOffset -= player.speed
                genericObjects.forEach((genericObject) => {
                  genericObject.velocity.x = player.speed * 0.66
                })

                zombiez.forEach((zombie) => {
                    zombie.position.x += player.speed
                })

                potions.forEach((potion) => {
                    potion.position.x += player.speed
                })

                coins.forEach((coin) => {
                    coin.position.x += player.speed
                })

                particles.forEach((particle) => {
                   particle.position.x += player.speed
                })

                pads.forEach((pad) => {
                    pad.position.x += player.speed
                 })
            }
        }
    }

    // platform collision detection
    platforms.forEach(platform => {
        if (
            isOnTopOfPlatform({
                object: player,
                platform
            })
        ) {
            player.velocity.y = 0,
            jumpInt = 0
        }

        if (platform.block && hitTopOfPlatform({
            object: player,
            platform
        })) {
            player.velocity.y = 0,
            jumpInt = 0
        }

        if ((currentLevel == 1 || currentLevel == 2 || currentLevel == 3 || currentLevel == 4) &&
            platform.block && hitBottomOfPlatform({
            object: player,
            platform
        })) {
            player.velocity.y = -player.velocity.y
        }

        if (platform.block && hitSideOfPlatform({
                object: player,
                platform
            })) {
                player.velocity.x = 0
            }
    
        if ((currentLevel == 5) && platform.play && hitBottomOfPlatform({
                object: player,
                platform
            })) {
                audioGameOver.audio.play()
                player.velocity.y = -player.velocity.y
                selectLevel(currentLevel = 1)
            }

        //particle bounce off platforms
        particles.forEach((particle, index) => {
                if (
                    isOnTopOfPlatformCircle({
                    object: particle,
                    platform
                })
            ) {
                particle.velocity.y = -particle.velocity.y * 0.9

                if (particle.radius - 0.4 < 0) particles.splice(index, 1)
                else particle.radius -= 0.4
            } 
                if ( particle.ttl < 0)
                    particles.splice(index, 1)
        })

        //zombie platform detection
        zombiez.forEach(zombie => {
            if (isOnTopOfPlatform({
                object: zombie,
                platform
            })) 
            zombie.velocity.y = 0
        })

        //potion platform detection
        potions.forEach(potion => {
            if (isOnTopOfPlatform({
                object: potion,
                platform
            })) 
            potion.velocity.y = 0
        })
    })       

    //player falls off map (lose con)
    if (player.position.y > canvas.height) {
        audioGameOver.audio.play()
        selectLevel(currentLevel)
    }

    //sprite Switching
    if (player.velocity.y !== 0) return

    if (keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.right) {
        player.currentSprite = player.sprites.run.right
    } else if (keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.left) {
        player.currentSprite = player.sprites.run.left
    } else if (!keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.stand.left) {
        player.currentSprite = player.sprites.stand.left
    } else if (!keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.stand.right) {
        player.currentSprite = player.sprites.stand.right
    } 

    //cyclops (potion) sprites
    if (!player.powerUps.potion) return
    if (keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.potion.right) {
        player.currentSprite = player.sprites.run.potion.right
    } else if (keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.potion.left) {
        player.currentSprite = player.sprites.run.potion.left
    } else if (!keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.stand.potion.left) {
        player.currentSprite = player.sprites.stand.potion.left
    } else if (!keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.stand.potion.right) {
        player.currentSprite = player.sprites.stand.potion.right
    } 
}

selectLevel(currentLevel)
animate()

// down key listener (asdw)
addEventListener('keydown', ({ keyCode }) => {
    if (game.disableUserInput) return
    switch (keyCode) {
        case 13:
            break
        
        case 65:
            keys.left.pressed = true
            lastKey = 'left'
            break
        
        case 83:
            break
            
        case 68:
            keys.right.pressed = true
            lastKey = 'right'
            break

        case 87:
            if (jumpInt == 0) {
                player.velocity.y -= 15 
                audioJump.audio.play()
                jumpInt = 1
            }

            if (lastKey === 'right') 
            player.currentSprite = player.sprites.jump.right
            else
            player.currentSprite = player.sprites.jump.left

            if (!player.powerUps.potion) 
            break

            if (lastKey === 'right') 
            player.currentSprite = player.sprites.jump.potion.right
            else
            player.currentSprite = player.sprites.jump.potion.left
            break

        case 32:
            if (!player.powerUps.potion) return
            if (laserTimeOut == 0) {
                audioLaser.audio.play()
                let velocity = 60
                if (lastKey === 'left') velocity = -60
                particles.push(new Particle({
                    position: {
                        x: player.position.x + player.width / 2,
                        y: player.position.y + player.height / 2 -43
                    },
                    velocity: {
                        x: velocity,
                        y: 0
                    },
                    radius: 5,
                    color: 'red',
                    laser: true
                }))
                particles.push(new Particle({
                    position: {
                        x: player.position.x + player.width / 2,
                        y: player.position.y + player.height / 2 -35
                    },
                    velocity: {
                        x: velocity,
                        y: 0
                    },
                    radius: 5,
                    color: 'red',
                    laser: true
                }))
                laserTimeOut = 1
                setTimeout(() => {
                    laserTimeOut = 0
                }, 1500)
                }
            break
    }
})

// up key listener (asdw)
addEventListener('keyup', ({ keyCode }) => {
    if (game.disableUserInput) return
    
    switch (keyCode) {
        case 65:
            keys.left.pressed = false
            break
        
        case 83:
            break
            
        case 68:
            keys.right.pressed = false
            break

        case 87:
            break
    }
})

