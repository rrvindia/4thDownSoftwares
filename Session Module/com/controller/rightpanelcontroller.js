(function () {
    "use strict";
    
    //defining function to pass as object in NearByController
    function NearByController($scope, $compile, ServerCommunication, ngDialog, AppService) {
       
        var appService = AppService, serverCommunication = ServerCommunication;
        $scope.dataLimit = 20;

        //this function returns all the nearby users
        $scope.getAllUsers = function () {
            serverCommunication.getNearByUsers(function (data) {
                $scope.NearByUsers = data;
                appService.getConnnectedUsers();
            });
        };

        //this function returns user details by username
        function getUserDetail(userName, callback) {
            ServerCommunication.getUserDetail(userName, function (userDetail) {
                callback(userDetail);
            });
        }

        //this function calls the getuser method
        $scope.getAllUsers();

        //this method opens popup for nearby user with details 
        this.showUserDetails = function (userId) {
            $scope.star = "img/Star-white.png";
            $scope.connectionStatus = "Make Connection";
            $scope.userNoteLabel = "Add Notes";
            $scope.userNoteText = "";
            $scope.noteDisplay = "none";

            //this method returns details of a user
            getUserDetail(userId, function (data) {
                $scope.userId = userId;
                var newData = data[Object.keys(data)];
                if (appService.isUserConnected(userId)) {
                    newData.connected = true;
                    $scope.star = "img/Star.png";
                    $scope.connectionStatus = "Remove Connection";
                }

                appService.getUserNotes(userId, function (userNote) {
                    if (userNote !== "") {
                        $scope.userNoteLabel = "Edit Notes";
                    }

                    $scope.bio = newData.description.bio;
                    $scope.userName = newData.first + ' ' + newData.last;
                    $scope.userRole = newData.role;

                    //this method opens popup with template html
                    var dialog = ngDialog.open({
                        template: 'popups/modalpopup.html',
                        scope: $scope
                    });

                    if (userNote !== "") {
                        setTimeout(function () {
                            $("#txtNotes").val(userNote);
                            $("#divNotes").css("display", "block");
                        }, 200);
                    }
                });
            });
        };

        //Register the scroll event to load more data while scrolling
        $scope.registerUserScroll = function () {
            $("#userlist").scroll(function () {
                if ($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
                    $scope.dataLimit += 20;
                    $scope.$apply();
                }
            });
        };
    }
    
    //this controller is used to have functionality for near-by users
    mainModule.controller('NearByCtrl', ['$scope', '$compile', 'ServerCommunication', 'ngDialog', 'AppService', NearByController]);

})();