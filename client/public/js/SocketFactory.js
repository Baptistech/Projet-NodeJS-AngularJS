/**
 * Created by baptiste on 03/12/2015.
 */

// On va se créer un socket.io qui s'adapte à angular car socket.io n'est compatible qu'avec node
app.factory('socket', function($rootScope){
    var socket = io();
    return{
        on: function (eventName, callback){
            socket.on(eventName, function(){
                var args = arguments;
                $rootScope.$apply(function(){
                    callback.apply(socket, args);
                })
            });
        },
        emit: function (eventName, data, callback){
            socket.emit(eventName, data, function(){
                var args = arguments;
                $rootScope.$apply(function(){
                    if (callback)
                    callback.apply(socket, args);
                })
            });
        }
    }
});
