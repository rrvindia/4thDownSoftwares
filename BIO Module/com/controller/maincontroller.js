/*
    This controller is a parent controller of the all the controllers in the application.
    This manages the scope between different controllers of different views.
    e.g.
    Functionality of filtering the user list on left navigation panel through tabs on header partial view.
*/
(function(){
    "use strict";
    function MainCtrl($scope, $window, ServerCommunication, AppService) {
        var appService = AppService;
        var serverCommunication = ServerCommunication;
        
        // This function check if the user list for left navigation panel has changed
        $scope.$on("myEvent", function (event, args) {
            $scope.Users = args.data1;
        });

        // This function gets all the users for attendees filter.
        $scope.showUserPanel = true;
        $scope.getAllUsers = function(){
            var lastTab = appService.lastSelectedTab;
            if(lastTab === "btnAttendees")
                return;
            
            if(lastTab !== undefined)
                $("#" + lastTab).removeClass("Selected_Tab");
            
            lastTab = appService.lastSelectedTab = "btnAttendees";
            $("#" + lastTab).addClass("Selected_Tab");

            appService.lastSelectedUser = undefined;
            serverCommunication.getAllUserData(function(data){
                $scope.$broadcast("myEvent", {data1: data });
                appService.gotoPage("home");
            });
        };

        // To navigate to root
        $scope.goToRoot = function(){
            serverCommunication.NavigateToRoot();
        };
        
        // Calling this function for getting user list for attendees as default .
        $scope.getAllUsers();
        
        // This function gets all the users for speakers filter.
        $scope.getSpeakerUsers = function(){
            var lastTab = appService.lastSelectedTab;
            if(lastTab === "btnSpeakers")
                return;
            
            $("#" + lastTab).removeClass("Selected_Tab");
            lastTab = appService.lastSelectedTab = "btnSpeakers";
            $("#" + lastTab).addClass("Selected_Tab");

            appService.lastSelectedUser=undefined;
            serverCommunication.getSpeakerUsers(function(data){
                $scope.$broadcast("myEvent", {data1: data });
                appService.gotoPage("home");
            });
        };
        
        // This function gets all the users for nearby filter.
        $scope.getUserForMatchingDevice = function(){
            var lastTab = appService.lastSelectedTab;
            if(lastTab === "btnNearBy")
                return;
            
            $("#" + lastTab).removeClass("Selected_Tab");
            lastTab = appService.lastSelectedTab="btnNearBy";
            $("#" + lastTab).addClass("Selected_Tab");

            appService.lastSelectedUser=undefined;
            serverCommunication.getUserForMatchingDevice(function(data){
                $scope.$broadcast("myEvent", {data1: data });
                appService.gotoPage("home");
            });
        };
        
        // This function gets all the users for connections filter.
        $scope.getUserForConnection=function(){
            var lastTab = appService.lastSelectedTab;
            if(lastTab === "btnConnections")
                return;

            $("#" + lastTab).removeClass("Selected_Tab");
            lastTab = appService.lastSelectedTab = "btnConnections";
            $("#" + lastTab).addClass("Selected_Tab");
            appService.lastSelectedUser = undefined;

            serverCommunication.getUserForConnection(function(data){
                $scope.$broadcast("myEvent", {data1: data });
                appService.gotoPage("home");
            });
        };
    }
    mainModule.controller("MainCtrl", ['$scope', '$window', 'ServerCommunication', 'AppService', MainCtrl]);
})();