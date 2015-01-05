(function(){
    function initialize(game){
        title.initialize(game);
        play.initialize(game);
    }

    window.onload = function(){
        enchant();

        var game = new Game(800, 600);
        game.preload("image/plane.png", "image/black.png", "image/white.png", "image/red.png", "image/blue.png", "image/bomb.png");
        game.fps = 8;

        gamev = { board: undefined };

        var modes = { title: 0, play: 1, over: 2 };
        var mode = modes.title;

        game.onload = function(){
            initialize(game);

            var scenes = { title: title.getScene(), play: play.getScene() };
            game.pushScene(scenes.title);
            mode = modes.title;

            game.addEventListener('enterframe', function(){
                if(mode == modes.title){
                    if(title.isEnd()){
                        play.reset(title.getOrder());
                        mode = modes.play;
                        game.popScene();
                        game.pushScene(scenes.play);
                    }
                }else if(mode == modes.play){
                    play.loop();
                    if(play.isEnd()){
                        mode = modes.title;
                        title.reset();
                        game.popScene();
                        game.pushScene(scenes.title);
                    }
                }
            });
        }

        game.start();
    }
})();
