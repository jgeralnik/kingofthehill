var assert = require("assert")
var game = require("./game.js")

var g = new game.Game();

//Test join and leave
(function(){
  assert.equal(g.playerCount(), 0);
  g.join({id:1, name:"Joey"});
  assert.equal(g.playerCount(), 1);
  g.join({id:2, name:"Me"});
  assert.equal(g.playerCount(), 2);
  g.leave(1);
  assert.equal(g.playerCount(), 1);
  g.leave(2);
  assert.equal(g.playerCount(), 0);
})();

//Test basic movement
(function(){
  g.join({id:1, name:"Joey"});
  var p = g.state.players[1];
  assert.notEqual(p, undefined);
  assert.equal(p.mode, "spin");
  assert.ok(g.inBounds(p), "Object must start in bounds");
  var oldAngle = p.angle;
  g.update(g.state.timeStamp+10);
  p = g.state.players[1];
  assert.ok(p.angle>oldAngle, "Angle must increase when spinning");
  assert.ok(p.angle < 0 && p.angle > -Math.PI/2,
      "Test assumes player is pointed down right");
  var oldX = p.x, oldY = p.y;
  g.move(1);
  g.update(g.state.timeStamp+10);
  p = g.state.players[1];
  assert.ok(p.x > oldX, "Player must move right");
  assert.ok(p.y > oldY, "Player must move down");
})();

console.log("All tests passed successfully");
