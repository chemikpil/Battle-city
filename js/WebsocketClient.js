var BattleCity = BattleCity || {}

BattleCity.WebsocketClient = function (host, callback) {
    this.connection = new WebSocket(host);

    this.connection.onmessage = function (e) {
        callback(JSON.parse(e.data));
    }
};

BattleCity.WebsocketClient.prototype = {
    send: function (data) {
        this.connection.send(JSON.stringify(data));
    }
};