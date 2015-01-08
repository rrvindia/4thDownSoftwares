(function(){
    "use strict";
    function AppService($window) {

        this.syncConnectionData = function(obj, user_id){
            var sessionString = $window.sessionStorage.getItem('bio_connection');
            if(sessionString === null || sessionString === undefined)
                return;

            //fd.userDataSaveTextInput( "bio_connection" , { text: sessionString } ); 
        };
        $window.isUserConnected = function(userId, userString){
            if (userString === null || userString === undefined)
            return false;

            var arrUser = userString.split(',');
            if(arrUser.length > 0 && arrUser.indexOf(userId)>-1)
                return true;
            else
                return false;
        };
        this.getConnnectedUsers = function(callback, mainCallback){

            if($window.sessionStorage.getItem("bio_connection") === undefined || $window.sessionStorage.getItem("bio_connection") === null){
                /*setTimeout(function(){
                    fd.userDataGetTextInput( "bio_connection" ).done(function( result ){
                        if(result.text === undefined || result.text === null){
                            callback("", mainCallback);
                        }
                        else{
                            $window.sessionStorage.setItem("bio_connection",result.text);
                            callback(result.text, mainCallback);
                        }
                    });
                }, 1000);*/
                $window.sessionStorage.setItem("bio_connection","user_50,user_55");
                callback("user_50,user_55", mainCallback);
            }
            else
                callback($window.sessionStorage.getItem("bio_connection"), mainCallback);
                //callback("user_65,user_75", mainCallback);
        };
        this.getAllUsers = function($http, callback){
            this.getConnnectedUsers(function(connectedUsersString, mainCallback){
                var userData = user_api.eventGetUsers();
                var data = userData[0];
                var userCollection  = [];
                angular.forEach(data, function(value, index){
                    if(isUserConnected(index,connectedUsersString)){
                        data[index].isConnected = true;
                    }
                    else{
                        data[index].isConnected = false;
                    }
                    data[index].id = index;
                    userCollection.push(data[index]);
                });
                mainCallback(userCollection);

            }, callback);
        };
        this.getAllSpeakers = function($http, callback, userCollection){
            var userData = user_api.eventGetSpeakers();
            var data = userData[0];
            var speakerCollection  = [];
            angular.forEach(data, function(value, index){
                data[index].id = index;
                speakerCollection.push(data[index]);
            });
            callback(userCollection, speakerCollection);
        };
        this.getNearByDevices = function($http, callback, userCollection){
            var userData = user_api.eventGetNearBy();
            var data = userData[0];
            var nearByDeviceCollection  = [];
            angular.forEach(data, function(value, index){
                nearByDeviceCollection.push(data[index]);
            });
            callback(userCollection, nearByDeviceCollection);
        };
        this.trimComma = function(text){
            if(text.charAt(0)===','){
                text = text.slice(1);
            }
            if(text.charAt(text.length-1)===','){
                text = text.substr(0,text.length-1);
            }
            if(text.indexOf(',,')>-1){
                text = text.replace(',,',',');
            }
            return text;
        };
        this.goToRoot = function(obj, user_id){
            //fd.navigationGoToPath('../root');
        };
        this.gotoPage = function(page){
            window.location.href = "#" + page;
            //$location.path("/" + page);
        };
    }
    mainModule.service('AppService', [ '$window', AppService ]);
})();