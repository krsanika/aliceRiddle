/*
var express = require('express'),
    app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);
*/

var io = require('socket.io').listen(9003);

var no = 1;

io.sockets.on('connection', function(socket) {
    socket.emit('connection', {
        type : 'connected'
    });

    socket.on('connection', function(data) {
        console.log(data);
        //방입장시에 필요한 처리
        if(data.type == 'join') {

            socket.join(data.room);

            socket.room = data.room;
            //GET SET ERR 대책
//            socket.set('room', data.room);
/*
            socket.on('room', function(data){
            });
*/

            socket.emit('system', {
                message : 'Alice grin like a cheshire cat.'
            });
            no++;

            socket.broadcast.to(data.room).emit('system', {
//                message : data.name + '님이 접속하셨습니다.'
                message : no+"번쨰 앨리스가 도착했습니다. (" + data.name + ")"
            });

        }

        socket.on('user', function(data) {
            console.log(data);
            socket.broadcast.to(socket.room).emit('message', data);
            /*
             socket.get('room', function(error, room) {
             socket.broadcast.to(room).emit('message', data);
             });
             */
        });


       //다이스관련
       socket.on('dice', function(data) {
//           console.log("DICE!!", data);
           var value = {'plus' : [], 'minus' : [], 'add' : []};
           var sum = 0;

/*
           //MAX대책
           if(data.n > 100) data.n = 100;
*/
           Object.keys(data.dicepool.plus).forEach(function(key){
               value.plus[parseInt(key)] = [];
               for(var i=0 ; i < parseInt(data.dicepool.plus[key]) ;i++){
                   var roll = Math.floor((Math.random() * key) +1);
                   console.log('RoLL'+key+':' + roll);
                   value.plus[parseInt(key)].push(roll);
                   sum += roll;
               }
           });

           Object.keys(data.dicepool.minus).forEach(function(key){
               value.minus[parseInt(key)] = [];
               for(var i=0 ; i < parseInt(data.dicepool.minus[key]) ;i++) {
                   var roll = Math.floor((Math.random() * key) +1);
                   console.log('RoLL :'+key+":"+ roll);
                   value.minus[parseInt(key)].push(roll);
                   sum -= roll;
               }
           });


           if(data.add instanceof Array){
               for(var i=0 ; i < data.add.length ; i++){
                   sum += data.add[i];
               }
           }

           value.plus = value.plus.filter(function(n){ return n != undefined });
           value.minus = value.minus.filter(function(n){ return n != undefined });
           value.add = data.add;

           var result = {
               roller : data.name,
               req : data.req,
               value : value,
               sum : sum,
           };
           console.log(result);
           io.sockets.in(socket.room).emit('roll', result);
       });

    });
/*
        socket.on('disconnect', () => {
            console.log('disconnected');
        })
*/



});
