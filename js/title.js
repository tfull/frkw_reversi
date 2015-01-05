var title = (function(){
    var scene = undefined;
    var sprites = [];
    var order = 0;
    var mode = 0; // 1: end

    function initialize(game){
        const assets = game.assets;
        const bsize = 80;
        const fsize = 64;        

        scene = new Scene();
        scene.backgroundColor = "#408040";

        (function(){
            var label = new Label("Furukawa Reversi");
            label.font = "36px Times New Roman";
            label.color = "white";
            label.x = parseInt((game.width - label.width) / 2);
            label.y = 100;

            scene.addChild(label);

            for(var i = 0; i < 2; i++){
                var sprite = new Sprite(bsize, bsize);
                sprite.x = parseInt((game.width / 2 - sprite.width) / 2);
                sprite.y = 200 + i * (bsize + 16);

                sprites[i] = sprite;
                scene.addChild(sprite);
            }

            sprites[0].backgroundColor = "red";

            for(var i = 0; i < 2; i++){
                (function(){
                    var _i = i;
                    sprites[i].addEventListener('touchstart', function(){
                        order = _i;
                        sprites[_i].backgroundColor = "red";
                        sprites[1 - _i].backgroundColor = null;
                    });
                })();
            }

            for(var i = 0; i < 2; i++){
                (function(){
                    var _i = i;
                    var sprite = new Sprite(fsize, fsize);
                    sprite.x = parseInt((game.width / 2 - sprite.width) / 2);
                    sprite.y = 200 + i * (bsize + 16) + parseInt((bsize - fsize) / 2);
                    sprite.image = assets["image/" + ["black", "white"][i] + '.png'];
                    sprite.addEventListener('touchstart', function(){
                        order = _i;
                        sprites[_i].backgroundColor = "red";
                        sprites[1 - _i].backgroundColor = null;
                    });
                    scene.addChild(sprite);
                })();
            }

            sprite = new Sprite(100, 50);
            sprite.x = parseInt((game.width - sprite.width) / 2);
            sprite.y = 400;
            sprite.backgroundColor = "red";
            sprite.addEventListener('touchstart', function(){
                mode = 1;
            });
            scene.addChild(sprite);
        })();
    }

    function getScene(){
        return scene;
    }

    function isEnd(){
        return mode == 1;
    }

    function getOrder(){
        return order + 1;
    }

    function reset(){
        mode = 0;
    }

    return { initialize: initialize,
        getScene: getScene,
        isEnd: isEnd,
        getOrder: getOrder,
        reset: reset
    };
})();
