(function () {
    "use strict";
    
    //defining function to pass as object in SessionInfoController
    function SessionInfoController($scope, ServerCommunication, AppService) {

        var appService = AppService, serverCommunication = ServerCommunication, sessionName = "", roomName = "";

        // This function gets the value of session and room(optional) to load the data for.
        $scope.loadInfo = function (callback) {
            try {
                /*fd.dataGetValueAsString("session").done(function(_sessionName){
                    //this will be whatever you put in item xml, in this case “session_1"
                    sessionName = _sessionName;
                    alert("Session name Loaded..."+ "--"+ sessionName +"--"+ _sessionName);

                    fd.dataGetValueAsString("room").done(function(_roomName){
                        //this will be whatever you put in item xml, in this case “room_2"
                        roomName = _roomName;
                        alert("Room name Loaded..."+ "--"+ roomName +"--"+ _roomName);

                        callback();
                        alert("Finished");
                    });
                });*/

                //---- Test code of assigning values to variables ----
                sessionName = "session_2";
                //roomName = "regal_ballroom";
                callback();
            } catch (error) {
                //alert("Error..." + error);
            }
        };

        //this method is used to load session information
        $scope.loadSessionInfo = function () {
            serverCommunication.getSessionInfoByName(sessionName, roomName, function (data) {

                var sessionBlock = data[0].session_1;
                var startdate = new Date(sessionBlock.start_date);
                var enddate = new Date(sessionBlock.end_date);
                var roomsList = sessionBlock.rooms;
                var rooms = roomsList;
                var sessionData = {
                    "sessionName": sessionName,
                    "startDate": startdate,
                    "endDate": enddate,
                    "description": sessionBlock.description,
                    "rooms" : rooms,
                    "sessionLabel": sessionBlock.label
                };
                
                appService.rooms = rooms;
                appService.sessionData = sessionData;
                $scope.sessionData = sessionData;
                
            });
        };

        $scope.loadInfo(function () {
            $scope.loadSessionInfo();
        });
    }
    
    //this controller is used to get session information
    mainModule.controller("SessionInfoCtrl", ['$scope', 'ServerCommunication', 'AppService', SessionInfoController]);
    
})();
