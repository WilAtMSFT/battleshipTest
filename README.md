## Battleship basic webapp tutorial: Learning the basics of javascript and express framework.

I wanted to learn some basic javascript and build a webapp. I thought a Battleship like game would be straight forward. I am a backend developer mainly working in C# and SQL, so my goal was to not use either of those. After asking around, using the [express][6] framework on node.js seemed the best approach so from there i just started digging. I started by following the tutorial at [closebrace][1] but I skipped all the mongoDb stuff as I just wanted a quick intro to the framework and getting started. After that it was a bit of web searching and experimenting.

The following are the steps I used to create my Battleship app with corresponding commits. This repo alone will not be enough as it does not contain the node_modules and you need to install node/npm, but it does have the files so you can just copy them over after doing the initial express setup.

### Tutorial

First install [npm](https://www.npmjs.com/) so you can install other stuff. This will install node.js

Next install express by runing the following from the command line `npm install -g express-generator`

Create a base project by running `express BattleShip --view=jade`. This will create a folder Battleship with the express framework all setup using the jade templating engine. You'll see this output on the command line.

```   create : BattleShip
   create : BattleShip/package.json
   create : BattleShip/app.js
   create : BattleShip/routes
   create : BattleShip/routes/index.js
   create : BattleShip/routes/users.js
   create : BattleShip/public
   create : BattleShip/views
   create : BattleShip/views/index.jade
   create : BattleShip/views/layout.jade
   create : BattleShip/views/error.jade
   create : BattleShip/bin
   create : BattleShip/bin/www
   create : BattleShip/public/images
   create : BattleShip/public/javascripts
   create : BattleShip/public/stylesheets
   create : BattleShip/public/stylesheets/style.css

   install dependencies:
     > cd BattleShip && npm install

   run the app:
     > SET DEBUG=battleship:* & npm start
```

Now cd into BattleShip and run `npm install`.

What have we done so far? From what I understand, we now have a basic web server framework ready for requests to http://localhost:3000/. Express provides an easy routing and rendering framework. I considered writing this app without express and just using html but I started down express and I really liked the templating of views and the ease of [rendering][7]. Yes, you'll need to learn some [jade][3] but that is not that bad. I'll explain more in a bit.

Run `npm start` in the BattleShip folder and then hit http://localhost:3000/ in the browser. We have a server responding! How is this stuff working? First open app.js. You'll see a bunch of require('blah') statements. This is loading up [node modules][5].

Next in app.js, you will see two routes being imported `var index = require('./routes/index');` and a similar one for users. A few line down we have `app.use('/', index);` and another again for users. These lines tell the server to execute the index.js module when we go to http://localhost:3000/ and the second is the users route at http://localhost:3000/users. There are index.js and users.js in the routes folder. Both those js files export modules and those modules are what `var index = require('./routes/index');` is loading. So when those endpoints are hit, our server executes index.js or users.js. Users.js is simple - it just returns with a string. Index.js is more interesting as it response with a jade templated view.

The views folder currently has 3 views. Layout.jade is going to be what the other views extend/inherit from. The error.jade view is used in the app.js when things go wrong. The index.jade view is what express is rendering when you hit http://localhost:3000/. You'll see in the index.js route file `res.render('index', { title: 'Express' });` which means change this jade template into html and sub in _Express_ when you see the token #{title} - this [render API][7] is the main reason I stuck with express. Go to http://localhost:3000/ in chrome and hit F12 key. In the Elements sections, you will see the resulting html. You'll see where the layout.jade produced the header and the index.jade extended that with the body of the html with the title token replaced.

Now we have a rough idea of how this all works. This is the state for the first commit a5dc46e25346139ffceec465d81336127df47034

Lets clean it up and get rid of users stuff and put in place a battleship route and view. In app.js we will just replace `users` with `battleship`. We add a new battleship.js file in the routes folder and delete the users.js file. Finally, we add battleship.jade template to the views folder. Full change can be found [here](https://github.com/WilAtMSFT/battleshipTest/commit/4f114e51b91fa985d2714956012702e2a56fc086). If you run `npm start` and go to http://localhost:3000/battleship you will be welcomed to Battleship! Commit: 4f114e51b91fa985d2714956012702e2a56fc086

Next we add a place for users to give us a coordinate. We will use a [form](https://www.w3schools.com/tags/tag_form.asp) and send the input back with a fixed result message. I am not a formatting expert so it looks crude but it accomplishes the task. The form comes with a submit button that will POST back to the battleship endpoint, that is what the method and action attributes tell the browser to do `form#fire(name="fire",method="post",action="/battleship")`. We need to handle the POST so we add `router.post('/', function(req, res)` to our battleship.js controller. Full change is [here](https://github.com/WilAtMSFT/battleshipTest/commit/6de8376472e41657e5d78c6f1ad28dd37c7d9471). Commit 6de8376472e41657e5d78c6f1ad28dd37c7d9471

Next we are going to create a place to store some state. To keep it simple for now, we'll add a hidden read-only input to contain the current board state `input#BoardData(type="hidden", value=boardString, name="boardString", readonly)`. This is nice because we can inspect the board json in the browser via F12, which will be handy for debugging. We will also pre-populate a small 3 by 3 board in the inital load of the battleship page. 

The `board` will contain `cells` which can be thought of as a 2D array. Each cell is either:
- `null` for not fired on and no ship
- 0 for a `miss`
- Postive value of the `shipId` that has not been hit
- Negitive value of the `shipId` that has been hit

The `board` also has an arry `ships` which holds the hits remaining for each `shipId`. We reserver the 0 index for null so we don't have to do -1 shifts everywhere. So `ships[1]` is the first ship and the value is number of hits it has left. `board` also has the count of remaining ships `shipsRemaining` and an indicator if the game is over. This starts to get into more javascript work. If you are new to javascript, I recommend clicking through [this][2]. Also, I added the commented out line `//let result = fire(x,y,board);` in our POST function which foreshadows my plan for updating the data. 

I recommend running the server at this time and going to our battleship enpoint. Hit F12 in the browser and expand the html, you will see the rendered html from the jade template and you will see our hidden json board. [Full diff of changes](https://github.com/WilAtMSFT/battleshipTest/commit/37eed866a5eb438e7ee0d23a91dae8ffc1a54578). Commit 37eed866a5eb438e7ee0d23a91dae8ffc1a54578

Now lets add a grid. Stylesheet gets loaded by the layout.jade template via this line `link(rel='stylesheet', href='/stylesheets/style.css')`. So we will edit the style.css file under public/stylesheets. I am not a css pro and used the example [here][8] stripped down to build the table. Note `td` and `tr` are standard [html tags][4]. [Full diff of changes](https://github.com/WilAtMSFT/battleshipTest/commit/4ddcf6e9516c0daa27f49fd89b87c889aa821179). Commit 4ddcf6e9516c0daa27f49fd89b87c889aa821179

Cool. Time to build some battleship logic. We are going to write the `fire` function. The [code change](https://github.com/WilAtMSFT/battleshipTest/commit/6fec83cecaa0717ad8e06ff424b17148142d27c8) is hopefully easy enough to follow. Watch it in action in the browser with F12 to see the board changes. Commit 6fec83cecaa0717ad8e06ff424b17148142d27c8

Finally, lets make the grid work and make the messaging on the page nicer. The main thing here is to pass the cells to `res.render` and then update the battleship.jade template to check cell values and set grid cell background color based on cell state. I also took this chance to clean up the messaging at the top of the battleship webpage. [Full diff of changes](https://github.com/WilAtMSFT/battleshipTest/commit/9637abec78644dc175b7da18f7758e6c1c4d493d). Commit 9637abec78644dc175b7da18f7758e6c1c4d493d

Thats it for this tutorial. There is more you can do to continue your learning adventure. You could add random board generation or store board state in the [file system](https://www.w3schools.com/nodejs/ref_fs.asp). 

[1]: https://closebrace.com/tutorials/2017-03-02/the-dead-simple-step-by-step-guide-for-front-end-developers-to-getting-up-and-running-with-nodejs-express-and-mongodb

[2]: https://javascript.info/

[3]: https://scalate.github.io/scalate/documentation/jade-syntax.html

[4]: https://www.w3schools.com/tags/

[5]: https://www.w3schools.com/nodejs/default.asp

[6]: http://expressjs.com

[7]: http://expressjs.com/en/api.html#res.render

[8]: https://codepen.io/eddyerburgh/pen/RaBgxq
