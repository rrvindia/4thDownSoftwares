//this controller is used to have user details page functionality
(function () {
    "use strict";
    function UserCtrl($scope, $window, ServerCommunication, AppService, ngDialog) {
        var appService = AppService, serverCommunication = ServerCommunication, textNotes = '';

        if (appService.userId !== undefined && appService.userId !== "") {
            serverCommunication.getUserById(appService.userId, function (userDetails) {
                $scope.currentUserDetails = userDetails;
                $scope.isConnected = userDetails.isConnected;
                $scope.imageUrl = appService.imageUrl;
                $scope.userId = appService.userId;

                var userNote = $window.sessionStorage.getItem(appService.userId);
                if(userNote != undefined && userNote != null){
                    textNotes = userNote;
                }
                else{
                    /*fd.userDataGetTextInput( appService.userId ).done(function( result ){ 
                    if(result.text !== undefined && result.text !== null && result.text !== "" ){
                        textNotes = result.text;

                        $("#lnkNotes").html("Edit Notes");
                        $('.div_notes').val(textNotes);
                        $("#divnotesection").removeClass("hide");
                    }
                    });*/
                    
                    textNotes = "hghg";
                }

                $scope.userNotes = textNotes;
                
                if (textNotes !== "") {
                    $("#lnkNotes").html("Edit Notes");
                    $('.div_notes').val(textNotes);
                    $("#divnotesection").removeClass("hide");
                }
            });

            // This function is used to open model popup on add and edit mode for notes
            this.openNotify = function () {

                var dialog = ngDialog.open({
                    template: 'partials/saveuserpopup.html',
                    scope: $scope,
                    controller: 'UserCtrl'
                });
                dialog.closePromise.then(function (data) {
                    $("#ngdialog1").remove();
                });

                //this section is used to set text of textarea from div's inner html 
                setTimeout(function () {
                    if ($("#lnkNotes").text() === 'Edit Notes') {
                        $("textarea").val($('.div_notes').val());
                    }
                }, 200);
            };
            // This function is used to change the star image on make connection link click
            this.MakeConnection = function (userid) {

                if ($('#imgStar').attr('src') === "img/Star.png") {
                    $('#imgStar').attr('src','img/Star-white.png');
                    $("#lnkMakeConnection").html("Make Connection");
                    serverCommunication.RemoveConnectionOfThisUser(userid, function(){
                        var lastTab = appService.lastSelectedTab;
                        if (lastTab !== "btnConnections")
                            return;

                        var previousData = $scope.Users;
                        var index = 0;
                        angular.forEach(previousData, function(v, i){
                            if(previousData[i].id === userid){
                                index = i;
                                return false;
                            }
                        });
                        $scope.Users.splice(index, 1);
                        appService.gotoPage("home");
                    });
                }
                else{
                    $('#imgStar').attr('src','img/Star.png');
                    $("#lnkMakeConnection").html("Remove Connection");
                    serverCommunication.MakeConnectionToThisUser(userid);
                }
            };
            
            // This function saves the user notes to database using api call
            $scope.saveNotes = function(user_id){

                var noteText = $scope.userNotes;
                $window.sessionStorage.setItem(user_id, noteText);
                //fd.userDataSaveTextInput( user_id, { text: noteText } );

                $('.div_notes').val(noteText);
                $(".ngdialog").remove();
                if(noteText !== ""){
                    $('#lnkNotes').html('Edit Notes');
                    $("#divnotesection").removeClass("hide");
                }
                else{
                    $("#divnotesection").addClass("hide");
                    $('#lnkNotes').html('Add Notes');
                }
            };
        }
        else{
            appService.gotoPage("home");
        }
    }
    mainModule.controller("UserCtrl", ['$scope', '$window', 'ServerCommunication', 'AppService', 'ngDialog', UserCtrl ]);
})();