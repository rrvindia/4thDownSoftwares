// Registering the ServerCommunication factory to 4thdownServerCommunication module
(function(){
    "use strict";
    function ServerCommunication($http, $window, AppService) {
        var ServerCommunication = {};
        var appService = AppService;

        // Fetching all the users for attendees using generic function
        ServerCommunication.getAllUserData = function(callback){
            appService.getAllUsers($http, callback);
        };
        // Fetching all the users for speakers using generic function
        // This function contain logic to match the users in from user json file with user matching in speakers json file
        ServerCommunication.getSpeakerUsers = function(callback){
            var matchingSpeaker = [];
            appService.getAllUsers($http, function(userCollection){
                appService.getAllSpeakers($http, function(userCollection, speakerCollection){
                    angular.forEach(userCollection, function(value,index){
                        var userid = userCollection[index].id;
                        $.each(speakerCollection, function(index2, value){
                            if($.inArray(userid, speakerCollection[index2].speakers) !== -1){
                                userCollection[index].id = userid;
                                matchingSpeaker.push(userCollection[index]);
                                return false;
                            }
                        });
                    });
                   callback(matchingSpeaker); 
                }, userCollection);
            });
        };
        // Fetching all the users for nearby matching device using generic function
        // This function contain logic to match the users in from user json file with user matching in nearby device json file
        ServerCommunication.getUserForMatchingDevice = function(callback){
            var userForMatchingDevice = [];
            appService.getAllUsers($http, function(userCollection){
                appService.getNearByDevices($http, function(userCollection, nearByDevices){
                    angular.forEach(userCollection, function(value,index){
                        var deviceId = userCollection[index].device;
                        angular.forEach(nearByDevices, function(value2, index2){
                            if($.inArray(deviceId, nearByDevices[index2].devices) !== -1){
                                userForMatchingDevice.push(userCollection[index]);
                                return false;
                            }
                        });
                    });
                   callback(userForMatchingDevice); 
                }, userCollection);
            });
        };
        // Function to get particular user by user id
        ServerCommunication.getUserById = function(userId, callback){
            appService.getAllUsers($http, function(userCollection){
                var userDetails = $.grep(userCollection, function(n, i){
                    return (userCollection[i].id == userId);
                });

                if(userDetails.length>0){
                    callback(userDetails[0]);
                }
            });
        };
        // Function to get connected users
        ServerCommunication.getUserForConnection = function(callback){
            appService.getAllUsers($http, function(allUsers){
                var filteredData = $.grep(allUsers,function(v, j){
                    return(allUsers[j].isConnected == true);
                });
                callback(filteredData);
            });
        };
        // This function is responsible for making connection for the selected user
        ServerCommunication.MakeConnectionToThisUser = function(userid){
            var oldString = $window.sessionStorage.getItem('bio_connection');
            var newString = userid;
            if(oldString !== null){
                if(oldString.indexOf(newString) === -1)
                    newString = oldString + ',' + newString;
            }
            newString = appService.trimComma(newString);
            $window.sessionStorage.setItem('bio_connection', newString);
            appService.syncConnectionData();
        };
        // This function is responsible for removing connection for the selected user
        ServerCommunication.RemoveConnectionOfThisUser = function(userid, callback){
            var oldString = $window.sessionStorage.getItem('bio_connection');
            var removeId = userid;
            if(oldString !== null){
                var newString=oldString.replace(removeId,'');
                newString = appService.trimComma(newString);
                $window.sessionStorage.setItem('bio_connection', newString);
                appService.syncConnectionData();
                callback();
            }
        };
        // Navigate to back to root
        ServerCommunication.NavigateToRoot = function(){
            appService.goToRoot();
        };

        return ServerCommunication;
    }
    mainModule.factory('ServerCommunication', ['$http', '$window', 'AppService', ServerCommunication ]);
})();