var BattleCity = BattleCity || {}

BattleCity.WebsocketClient = function (game) {
    this.game = game;
    this.connection = new WebSocket('ws://localhost:8080');

    var self = this;
    this.connection.onmessage = function (e) {
        //console.log('Receiving: ' + e.data);
        var data = JSON.parse(e.data);
        var messageType = data.type;
        var messageData = data.data;

        if (messageType == 'ID') {
            var player = new Player(self.game);

            player.id = messageData;
            player.isHuman = true;

            self.game.bodies[messageData] = player;

            player.notify();
        }

        else if (messageType == 'player') {
            var player = new Player(self.game);
            player.id = messageData.id;
            player.frame = messageData.frame;
            player.position.x = messageData.x;
            player.position.y = messageData.y;

            self.game.bodies[messageData.id] = player;
        }

        else if (messageType == 'bullet') {
            self.game.addBody(
                new Bullet(
                    self.game,
                    {'x': messageData.x, 'y': messageData.y},
                    messageData.velocity,
                    messageData.id
                )
            );
        }
    }
};

BattleCity.WebsocketClient.prototype = {
    send: function (data) {
        this.connection.send(JSON.stringify(data));
    }
};