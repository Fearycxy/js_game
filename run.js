   var log = console.log.bind(console)
   var imageFromPath = function (path) {
       var img = new Image()
       img.src = path
       return img
   }
   var Paddle = function () {
       var image = imageFromPath('image/paddle.png')
       var o = {
           image: image,
           x: 100,
           y: 250,
           speed: 15,
       }
       var paddle = o
       o.moveLeft = function () {
           if (paddle.x < 0) {
               return
           }
           paddle.x -= paddle.speed
       }
       o.moveRight = function () {
           if (paddle.x > 800 - image.width) {
               return
           }
           paddle.x += paddle.speed
       }
       o.reStart = function () {
           o.x = 100
           o.y = 250
       }
       o.moveUp = function () {
           if (paddle.y < 0) {
               return
           }
           paddle.y -= paddle.speed
       }
       o.moveDown = function () {
           if (paddle.y > 900 - image.height) {
               return
           }
           paddle.y += paddle.speed
       }
       o.collide = function (ball) {
           var a1 = ball.y + ball.image.height > o.y && ball.y + ball.image.height < o.y + o.image.height
           if (a1) {
               if (ball.x > o.x && ball.x < o.x + o.image.width) {
                   log('相撞')
                   return true
               }
           }
           return false
       }
       return o
   }
   var Ball = function () {
       var image = imageFromPath('image/ball.png')
       var o = {
           image: image,
           x: 100,
           y: 200,
           speedX: 10,
           speedY: 10,
           fired: false,
       }
       o.fire = function () {
           o.fired = true
       }
       o.stop = function () {
           o.fired = false
       }
       o.reStart = function () {
           o.x = 100
           o.y = 200
           o.fire = false
       }
       o.move = function () {
           if (o.fired) {
               // log('move')
               if (o.x < 0 || o.x > 800 - image.width) {
                   o.speedX = -o.speedX
               }
               if (o.y < 0) {
                   o.speedY = -o.speedY
               } else if (o.y > 900 - image.height) {
                   o.stop()
                   alert("你输啦！")
               }
               // move
               o.x += o.speedX
               o.y += o.speedY
           }
       }
       return o
   }
   // 瓜
   var GuaGame = function () {
       var g = {
           actions: {},
           keydowns: {},
       }
       var canvas = document.querySelector('#id-canvas')
       var context = canvas.getContext('2d')
       g.canvas = canvas
       g.context = context
       // draw
       g.drawImage = function (guaImage) {
           g.context.drawImage(guaImage.image, guaImage.x, guaImage.y)
       }
       // events
       window.addEventListener('keydown', function (event) {
           g.keydowns[event.key] = true
       })
       window.addEventListener('keyup', function (event) {
           g.keydowns[event.key] = false
       })
       //
       g.registerAction = function (key, callback) {
           g.actions[key] = callback
       }
       // timer
       setInterval(function () {
           // events
           var actions = Object.keys(g.actions)
           for (var i = 0; i < actions.length; i++) {
               var key = actions[i]
               if (g.keydowns[key]) {
                   // 如果按键被按下, 调用注册的 action
                   g.actions[key]()
               }
           }
           // update
           g.update()
           // clear
           context.clearRect(0, 0, canvas.width, canvas.height)
           // draw
           g.draw()
       }, 1000 / 30)
       return g
   }
   var __main = function () {
       var game = GuaGame()
       var paddle = Paddle()
       var ball = Ball()
       game.registerAction('a', function () {
           paddle.moveLeft()
       })
       game.registerAction('d', function () {
           paddle.moveRight()
       })
       game.registerAction('w', function () {
           paddle.moveUp()
       })
       game.registerAction('s', function () {
           paddle.moveDown()
       })
       game.registerAction('r', function () {
           ball.reStart()
           paddle.reStart()
       })
       game.registerAction('f', function () {
           ball.fire()
       })
       game.update = function () {
           if (!ball.fire)
               return
           ball.move()
           // 判断相撞
           if (paddle.collide(ball)) {
               // 这里应该调用一个 ball.反弹() 来实现
               ball.speedY *= -1
           }
       }
       game.draw = function () {
           // draw
           game.drawImage(paddle)
           game.drawImage(ball)
       }
   }
   __main()
