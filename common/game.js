(function(exports){
  //Game instance shared between server and clients
  var Game = function(){
    this.state = {players: {}, timeStamp: (new Date()).valueOf(), king: null};
    this.timer = null;
  };

  Game.UPDATE_INTERVAL = Math.round(1000 / 30);
  Game.MAX_DELTA       = 10000;
  Game.WIDTH           = 480;
  Game.HEIGHT          = 480;

  /*
   * Computes the game state
   * @param {number} delta Number of milliseconds in the future
   * @return {object} The new game state at that timestamp
   */
  Game.prototype.computeState = function(delta){
    var newState = {
      players: {},
      timeStamp: this.state.timeStamp + delta,
      king: this.state.king,
    };

    for(var i in this.state.players){
      newState.players[i] = this.state.players[i].computeState(delta);
    }

    // If nobody has crown, give crown to first player to reach middle
    if(this.state.king == null)
    {
      //TODO
    }

    // Check for collisions
    for(var i in newState.players){
      var p1 = newState.players[i];
      for(var j in newState.players){
        var p2 = newState.players[j];
        if(i < j && p1.intersects(p2)){
          p1.lastHit = j;
          p2.lastHit = i;
          console.log(p1.name + " collides with " + p2.name)
            lastHit = j;
          this.handleCollision_(p1, p2);
        }
      }

      // Check if out of bounds
      if(!this.inBounds(p1)){
        console.log("Out of bounds")
        this.respawn(p1);
        if(newState.king == i)
          newState.king = p1.lastHit;
      }

      delete p1.lastHit;
    }

    // Give points to king
    if(newState.king != null)
      newState.players[newState.king].score++;

    // Victory conditions!
    // TODO

    return newState;
  }

  /*
   * Computes the state for a given timestamp in the future
   * @param {number} timeStamp Timestamp to computer for
   */
  Game.prototype.update = function(timeStamp) {
    var delta = timeStamp - this.state.timeStamp;
    if(delta < 0){
      throw "Can't compute state in the past. Delta: " + delta;
    }
    if(delta > Game.MAX_DELTA) {
      throw "Can't computer state so far in the future. Delta: " + delta;
    }
    this.state = this.computeState(delta);
  }

  Game.prototype.updateEvery = function(interval, skew) {
    if(!skew)
      skew = 0;

    var lastUpdate = (new Date()).valueOf() - skew;
    var that = this;
    this.timer = setInterval(function() {
      var date = (new Date()).valueOf() - skew;
      if ( date - lastUpdate >= interval ) {
        that.update(date);
        lastUpdate = date;
      }
    });
  }

  Game.prototype.join = function(params) {
    var p = new Player(params);
    this.respawn(p);
    this.state.players[p.id] = p;
  }

  Game.prototype.leave = function(id) {
    delete this.state.players[id];
  }

  Game.prototype.playerCount = function() {
    var result = 0;
    for (var i in this.state.players)
      result++;
    return result;
  }

  Game.prototype.move = function(id) {
    this.state.players[id].move();
  }

  Game.prototype.spin = function(id) {
    this.state.players[id].spin();
  }

  Game.prototype.inBounds = function(player){
    return player.x >= Player.RADIUS &&
      player.y >= Player.RADIUS &&
      player.x <= Game.WIDTH  - Player.RADIUS &&
      player.y <= Game.HEIGHT - Player.RADIUS;
  }

  Game.prototype.respawn = function(player){
    var pos = 0;
    for(var p in this.state.players)
      if(p < player.id)
        pos++;
    player.resetPosition(pos);
  }

  var Player = function(params){
    this.name  = params.name;
    this.id    = params.id;
    this.x     = params.x;
    this.y     = params.y;
    this.angle = params.angle;
    this.mode  = params.mode || "spin";
  }

  Player.RADIUS  = 20;
  Player.ANGLE_V = 2 * Math.PI / 1000;
  Player.SPACE_V = 1;

  Player.prototype.resetPosition = function(num){
    switch(num) {
      case 0:
        // Top left
        this.x     = Player.RADIUS;
        this.y     = Player.RADIUS;
        this.angle = -Math.PI / 4;
        break;
      case 1:
        // Top right
        this.x     = Game.WIDTH - Player.RADIUS;
        this.y     = Player.RADIUS;
        this.angle = -3 * Math.PI / 4;
        break;
      case 2:
        // Bottom left
        this.x     = Player.RADIUS;
        this.y     = Game.HEIGHT - Player.RADIUS;
        this.angle = Math.PI / 4;
        break;
      case 3:
        this.x     = Game.WIDTH  - Player.RADIUS;
        this.y     = Game.HEIGHT - Player.RADIUS;
        this.angle = 3 * Math.PI / 4;
        break;
      default:
        console.log("Invalid position", num);
    }
  }

  Player.prototype.computeState = function(delta){
    var nextPos = new Player(this.toJSON());
    if(nextPos.mode == "spin")
    {
      nextPos.angle += Player.ANGLE_V * delta;
    }
    else if(nextPos.mode == "move")
    {
      nextPos.x += Player.SPACE_V * delta * Math.cos(nextPos.angle);
      //Moving y up is subtraction
      nextPos.y -= Player.SPACE_V * delta * Math.sin(nextPos.angle);
    }
    else
    {
      console.log("Invalid mode", nextPos.mode);
    }
    return nextPos;
  }

  Player.prototype.toJSON = function(){
    result = {};
    for(var prop in this)
      if(this.hasOwnProperty(prop))
        result[prop] = this[prop];
    return result;
  }

  Player.prototype.spin = function(){
    this.mode = "spin";
  }

  Player.prototype.move = function(){
    this.mode = "move";
  }


  //TODO: spin,move
  //Save, Load
  //Player class
  //Exports

  exports.Game   = Game;
  exports.Player = Player;

})(typeof global === "undefined" ? window : exports);
