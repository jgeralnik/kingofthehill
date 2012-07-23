document.addEventListener('DOMContentLoaded', function(){
  socket = io.connect("http://localhost:5050");

  // Start the game - gets initial state
  socket.on('start', function(state) {
    console.log('starting game', state);
  });

  // Update state
  socket.on('state', function(state) {
    console.log('updating game', state);
  });

  // New client joins
  socket.on('join', function(userid){
    console.log('new user joined', userid);
  });

  // Other client starts moving
  socket.on('move', function(userid){
    console.log('user moving', userid);
  });

  // Other client goes back to spinning
  socket.on('spin', function(userid){
    console.log('user spinning', userid);
  });

  // Other client leaves
  socket.on('leave', function(userid){
    console.log('user left', userid);
  });

});
