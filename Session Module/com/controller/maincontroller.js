(function () {
    "use strict";
    
    // defining function to pass as object in main controller 
    function MainController($scope, $window, AppService) {
       
        var appService = AppService;
       
        $scope.IsSpeakersAvailable = true;

        $scope.DisplaySpeakers = function (whattodo) {
            $scope.IsSpeakersAvailable = whattodo;
        };
       
        $scope.getUserNotes = function (userId) {
            appService.getUserNotes(userId, callback);
        };

        // Function to correct the user for connected user by removing the extra comma from the comma seperated string of connected users
        $scope.trimComma = function (text) {
            appService.trimComma(text);
        };

        //this method is used to make and remove connection
        $scope.makeConnection = function (obj) {
            appService.makeConnection(obj);
        };

        // This function checks if the connection status of user is connected
        $scope.isUserConnected = function (userId) {
            appService.isUserConnected(userId);
        };

        // Function is creating a session variable to hold and return the connection status data of the users
        $scope.isUserConnected = function () {
            appService.getConnnectedUsers();
        };

        // This function is taking care of saving the connection status of all the users
        $scope.syncConnectionData = function () {
            appService.syncConnectionData();
        };

        //this method is used to add and edit notes
        $scope.addNotes = function () {
            if ($("#lnkNotes").text() === 'Add Notes') {
                $("#divSave").show(300);
                $("#divNotes").show(300);
                $("#lnkNotes").html('Edit Notes');
                $("#txtNotes").removeAttr("readonly").css("border", "1px solid #AAAAAA").focus();
            } else if ($("#lnkNotes").text() === 'Edit Notes') {
                $("#divSave").show(500);
                $("#divNotes").show(500);
                $("#txtNotes").removeAttr("readonly").css("border", "1px solid #AAAAAA").focus();
            }
        };

        //this method is used to save notes
        $scope.saveNotes = function (user_id) {
            try {
                var noteText = $scope.userNotes = $("#txtNotes").val();
                $window.sessionStorage.setItem(user_id, noteText);
                //fd.userDataSaveTextInput( user_id, { text: noteText } );

                $("#divSave").hide();
                $("#txtNotes").attr("readonly", "true").css("border", "0px solid #FFF");

                if ($("#txtNotes").val().trim() === '') {
                    $("#lnkNotes").html('Add Notes');
                    $("#divNotes").hide(500);
                }
            } catch (error) {
                //alert("Error saving notes data.");
            }
        };
    }
    
    //this controller is used to have functionality for near-by users
    mainModule.controller("MainCtrl", ['$scope', '$window', 'AppService', MainController]);
    
})();