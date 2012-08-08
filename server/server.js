var io = require('socket.io').listen(5050);

var observerCount = 0;
io.sockets.on('connection', function(socket){
  var address = socket.handshake.address;
  console.log("New connection from " + address.address + ":" + address.port);

  observerCount++;

  // Track player
  var playerId = null;

  // Send client game state when joining
  socket.emit('start', {
    state: {}
  });

  socket.on('join', function(){
    //Check that player has not already joined
    if (playerId != null){
      console.log('user', playerId, 'tried to join twice');
      return;
    }

    playerId = address.address + ":" + address.port

    console.log('user', playerId, 'joined')

    var data = {}
    data.playerId = playerId
    socket.broadcast.emit('join', data)
    data.isme = true
    socket.emit('join', data)
  });

  socket.on('disconnect', function() {
    console.log('user leaving', playerId);
    observerCount--;

    io.sockets.emit('leave', {playerId:playerId});
  });
});
