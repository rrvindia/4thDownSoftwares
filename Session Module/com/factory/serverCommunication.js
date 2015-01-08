(function(){
     "use strict";
    
    //defining function to pass as object in ServerCommunication factory
    function ServerCommunication() {
        var ServerCommunication={};

            ServerCommunication.getNearByUsers = function(callback){
                var data=  fd_api.eventGetUsersByProximity();
                var userCollection  = [];
                angular.forEach(data, function(value,index){
                    data[index].id = index;
                    userCollection.push(data[index]);
                });
                callback(userCollection);
            };

            ServerCommunication.getSessionInfoByName = function(sessionName, roomName, callback){
                var sessionData = fd_api.eventGetSessionsByName({session_name: sessionName, room_name: roomName});
                callback(sessionData);
            };

            ServerCommunication.getUserDetail = function(username, callback){
                var userDetail = fd_api.userGetProfile( {user_name: username});
                callback(userDetail);
            };
        return ServerCommunication;
    }
    
    // Registering the ServerCommunication factory to 4thdownServerCommunication module
    mainModule.factory('ServerCommunication', ServerCommunication);
    
})();