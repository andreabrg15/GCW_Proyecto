const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const listaJugadores=[];

const app = express();
const server = createServer(app);
const io = new Server(server);


app.use('/models',express.static( join(__dirname, 'models')))
app.use('/imgs',express.static( join(__dirname, 'imgs')))
app.use('/css',express.static( join(__dirname, 'css')))

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.get('/chooseGame', (req, res) => {
  res.sendFile(join(__dirname, 'chooseGame.html'));
});

app.get('/game', (req, res) => {
    res.sendFile(join(__dirname, 'game.html'));
});

app.get('/settings', (req, res) => {
    res.sendFile(join(__dirname, 'settings.html'));
});

app.get('/scores', (req, res) => {
    res.sendFile(join(__dirname, 'scores.html'));
});

app.get('/main.js', (req, res) => {
    res.sendFile(join(__dirname, 'main.js'));
});

app.get('/loop.ogg', (req, res) => {
  res.sendFile(join(__dirname, '/sound/loop.ogg'));
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('Iniciar', (nombre/* , personaje */) => {
    console.log('Nuevo jugador: '+nombre);

  listaJugadores.push( {
    name:nombre,
    x:0,
    y:0,
    z:0/* ,
    character:personaje */
  });
  
  for(let item of listaJugadores){
    
   io.emit('Iniciar',item.name/* , item.character */);

  }

  });

  socket.on('Posicion', (posicion,nombre) => {
  
    //console.log('nombre: '+nombre+'posicion:'+posicion.x);
   for(let item of listaJugadores){
    console.log('nombre: '+item.name+' posicion:'+item.x);
     if(item.name==nombre){

      item.x=posicion.x;
      item.y=posicion.y;
      item.z=posicion.z;
      console.log('nombre: '+item.name+' posicion:'+item.x);
     }

    io.emit('Posicion',item,item.name);

   }
   });

  
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});