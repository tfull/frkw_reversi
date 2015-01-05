var play = (function(){
    const modes = {
        plane: 0, end: 1, finish: 4, over: 3, turn: 2
    };
    var scene = undefined;
    var mode = 0;
    var turn = 0;
    var assets = undefined;
    var sprites = undefined;
    var board = undefined;
    // 0: plane, 1: black, 2: white, 3: red, 4: blue, 5: bomb
    const plane = 0;
    const red = 3;
    const blue = 4;
    const bomb = 5;
    var player = 0;
    var flame = 0;
    var overturn = undefined;
    const FLAME_P = 2;
    var turn_color = 0;
    var turn_sprites;
    var end_button;
    var labels;
    var chips;

    var component = {
        game: {},
        finish: {},
        over: {}
    };

    function initialize(game){
        const size = 64;
        const margin_x = 32;

        assets = game.assets;
        scene = new Scene();
        scene.backgroundColor = "gray";

        board = [];
        overturn = [];
        for(var i = 0; i < 10; i++){
            board[i] = [];
            overturn[i] = [];
        }

        var sprite = new Sprite(size * 8 + 2, size * 8 + 2);
        sprite.x = margin_x;
        sprite.y = parseInt((game.height - sprite.height) / 2);
        sprite.backgroundColor = "black";

        scene.addChild(sprite);

        sprites = [];
        for(var i = 0; i < 10; i++){
            sprites[i] = [];
            for(var j = 0; j < 10; j++){
                if(i == 0 || i == 9 || j == 0 || j == 9){
                    sprites[i][j] = null;
                }else{
                    sprite = new Sprite(size, size);
                    sprite.x = margin_x + size * (j - 1) + 1;
                    sprite.y = parseInt((game.height - size * 8) / 2) + size * (i - 1);
                    sprites[i][j] = sprite;
                    (function(){
                        var _i = i;
                        var _j = j;
                        sprite.addEventListener('touchstart', function(){
                            action(_i, _j);
                        });
                    })();
                    scene.addChild(sprite);
                }
            }
        }

        turn_sprites = [];
        labels = [];

        for(var i = 0; i < 2; i++){
            turn_sprites[i] = new Sprite(120, 180);
            turn_sprites[i].x = 600;
            turn_sprites[i].y = 80 + i * (180 + 80);

            scene.addChild(turn_sprites[i]);

            var sprite = new Sprite(100, 160);
            sprite.backgroundColor = "green";
            sprite.x = 600 + parseInt((turn_sprites[i].width - sprite.width) / 2);
            sprite.y = 80 + i * (180 + 80) + parseInt((turn_sprites[i].height - sprite.height) / 2);

            scene.addChild(sprite);

            var sprite = new Sprite(64, 64);
            sprite.x = 600 + parseInt((turn_sprites[i].width - sprite.width) / 2);
            sprite.y = 80 + i * (180 + 80) + parseInt((turn_sprites[i].height - sprite.height) / 2) + 32;
            sprite.image = assets["image/" + ["black", "white"][i] + ".png"];

            scene.addChild(sprite);

            labels[i] = new Label(["black", "white"][i]);
            labels[i].x = 600 + 64;
            labels[i].y = 80 + i * (180 + 80) + parseInt((turn_sprites[i].height - labels[i].height) / 2) - 32;
            labels[i].color = "white";

            scene.addChild(labels[i]);
        }

        end_button = new Sprite(100, 50);
        end_button.x = 550;
        end_button.y = 530;
        end_button.addEventListener('touchstart', function(){
            mode = modes.end;
        });
        end_button.backgroundColor = "yellow";
    }

    function action(i, j){
        if(turn != player || mode != modes.plane){
            return;
        }

        if(canTurn(i, j)){
            put(i, j, player);
        }
    }

    function put(i, j, c){
        var img = [null, "black", "white", "red", "blue"][c];
        sprites[i][j].image = assets["image/" + img + ".png"];
        flame = FLAME_P;
        readyAnimation(i, j);
        turn_color = c;
        board[i][j] = c;
        mode = modes.turn;
        chips ++;
    }

    function putBomb(i, j){
        var img = assets["image/bomb.png"];
        flame = FLAME_P;
        board[i][j] = bomb;
        sprites[i][j].image = img;
        mode = modes.turn;
        chips ++;
    }

    function readyAnimation(i, j){
        for(var di = -1; di <= 1; di++){
            for(var dj = -1; dj <= 1; dj++){
                if(di == 0 && dj == 0){
                    continue;
                }

                var y = i + di;
                var x = j + dj;

                var c = board[y][x];

                if(turn == player){
                    if(c == red || c == 3 - player){
                        do{
                            y += di;
                            x += dj;
                        }while(board[y][x] == c);
                        if(board[y][x] == player){
                            y = i + di;
                            x = j + dj;
                            var count = 0;
                            while(board[y][x] == c){
                                count ++;
                                overturn[y][x] = count;
                                y += di;
                                x += dj;
                            }
                        }
                    }
                }else{
                    if(c == player){
                        do{
                            y += di;
                            x += dj;
                        }while(board[y][x] == c);
                        if(board[y][x] == 3 - player || board[y][x] >= 3){ /* red blue bomb */
                            y = i + di;
                            x = j + dj;
                            var count = 0;
                            while(board[y][x] == c){
                                count ++;
                                overturn[y][x] = count;
                                y += di;
                                x += dj;
                            }
                        }
                    }
                }
            }
        }
    }

    function canTurn(i, j){
        if(board[i][j] != 0){
            return false;
        }

        for(var di = -1; di <= 1; di++){
            for(var dj = -1; dj <= 1; dj++){
                if(di == 0 && dj == 0){
                    continue;
                }

                var y = i + di;
                var x = j + dj;
                var c = board[y][x];

                if(turn == player){
                    if(c == 3 - player || c == red){
                        do{
                            y += di;
                            x += dj;
                        }while(board[y][x] == c);

                        if(board[y][x] == player){
                            return true;
                        }
                    }
                }else{
                    if(c == player){
                        do{
                            y += di;
                            x += dj;
                        }while(board[y][x] == c);

                        if(board[y][x] == 3 - player || board[y][x] > 3){
                            return true;
                        }
                    }
                }
            }
        }
    }

    function getCanTurn(){
        var can = [];
        for(var i = 1; i <= 8; i++){
            for(var j = 1; j <= 8; j++){
                if(canTurn(i, j)){
                    can.push([i, j]);
                }
            }
        }

        return can;
    }

    function letOver(){
        mode = modes.over;
        scene.addChild(end_button);
    }

    function pass(){
        flame = FLAME_P * 2;
        mode = modes.turn;
    }

    function changeTurn(){
        turn_sprites[turn - 1].backgroundColor = null;
        turn = 3 - turn;
        turn_sprites[turn - 1].backgroundColor = "red";
    }

    function computer(){
        var can = getCanTurn();
        if(can.length == 0){
            var bs = getBombCells();
            var l = bs[Math.floor(Math.random() * bs.length)];
            putBomb(l[0], l[1], bomb);
        }else{
            var l = can[Math.floor(Math.random() * can.length)];
            if(chips > 36 && Math.floor(Math.random() * 100) < chips){
                put(l[0], l[1], blue);
            }else{
                put(l[0], l[1], 3 - player);
            }
        }
    }

    function getBombCells(){
        var b = [];
        var dx = [ 1, 0, -1, 0 ];
        var dy = [ 0, -1, 0, 1 ];
        for(var i = 1; i <= 8; i++){
            for(var j = 1; j <= 8; j++){
                var flag = false;
                if(board[i][j] == plane){
                    for(var k = 0; k < 4; k++){
                        if(board[i+dy[k]][j+dx[k]] != plane){
                            flag = true;
                            break;
                        }
                    }
                }
                if(flag){
                    b.push([i, j]);
                }
            }
        }
        return b;
    }

    function loop(){
        if(mode == modes.plane){
            if(flame == 0){
                if(turn == 3 - player){
                    computer();
                }
            }else{
                flame --;
            }
        }else if(mode == modes.turn){
            if(flame == 0){
                if(animation()){
                    mode = modes.plane;
                    changeTurn();
                    flame = FLAME_P * 2;
                    if(chips == 64){
                        mode = modes.finish;
                    }else if(turn == player && getCanTurn().length == 0){
                        pass();
                    }
                }else{
                    flame = FLAME_P;
                }
            }else{
                flame --;
            }
        }else if(mode == modes.finish){
            letOver();
        }
    }

    function animation(){
        var count = 0;

        for(var i = 1; i <= 8; i++){
            for(var j = 1; j <= 8; j++){
                if(overturn[i][j] == 1){
                    if(turn_color == player && chips > 20 && Math.floor(Math.random() * 100) < 10){
                        board[i][j] = red;
                    }else{
                        board[i][j] = turn_color;
                    }
                    var img = [null, "black", "white", "red", "blue"][board[i][j]];
                    sprites[i][j].image = assets["image/" + img + ".png"];
                    overturn[i][j] = 0;
                }else if(overturn[i][j] > 1){
                    overturn[i][j] --;
                    count ++;
                }
            }
        }
        return count <= 0;
    }

    function reset(p){
        mode = modes.plane;
        turn = 1;
        player = p;
        chips = 4;

        scene.removeChild(end_button);

        for(var i = 0; i < 10; i++){
            for(var j = 0; j < 10; j++){
                board[i][j] = 0;
                overturn[i][j] = 0;
            }
        }
        board[4][4] = 2;
        board[4][5] = 1;
        board[5][4] = 1;
        board[5][5] = 2;

        for(var i = 0; i < 10; i++){
            for(var j = 0; j < 10; j++){
                if(i == 0 || i == 9 || j == 0 || j == 9){
                    continue;
                }else if(i == 4 && j == 4 || i == 5 && j == 5){
                    sprites[i][j].image = assets['image/white.png'];
                }else if(i == 4 && j == 5 || i == 5 && j == 4){
                    sprites[i][j].image = assets['image/black.png'];
                }else{
                    sprites[i][j].image = assets['image/plane.png'];
                }
            }
        }

        turn_sprites[0].backgroundColor = "red";
        turn_sprites[1].backgroundColor = null;

        var q = p - 1;

        labels[q].text = "Player";
        labels[q].x = 600 + 64;

        q = 2 - p;

        labels[q].text = "古川";
        labels[q].x = 600 + 64;
    }

    function getScene(){
        return scene;
    }

    function isEnd(){
        return mode == modes.end;
    }

    return { initialize: initialize,
        getScene: getScene,
        reset: reset,
        loop: loop,
        isEnd: isEnd
    };
})();