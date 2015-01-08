    // This controller is used for the functionalities related to user details
    mainModule.controller("UserCtrl",['$scope','$window','$compile','ServerCommunication','appService','ngDialog',UserCtrl]);

    function UserCtrl($scope, $window, $compile, ServerCommunication, appService, ngDialog) {
    
        $scope.ShowCurrentSecton('Biography');

        $scope.AddMessage = function(){
            $("#divMessage").html($("#divMessage").html() + '<div class="blue-msg-box"><div class="arrow"></div><p>' + $scope.textMessage +'</p><span>' + appService.getDateTime() + '</span></div></div>');
            $scope.textMessage='';
            setTimeout(function(){
               $("#divMssage").scrollTop(($("#divMessage").innerHeight() * 2));
            },100);
        };
   
        if(!appService.isObjUndefinedNull(appService.userId) && appService.userId !== ""){
            
            // To set connection status as connected if it is connected
            if(appService.isUserConnected(appService.userId, $window.sessionStorage.getItem("bio_connection"))){
            $("#lnkConnection").html('Remove Connection');
            $("#imgConnection").attr("src","img/Star.png");
        }

            // To get the user notes data
            appService.getUserNotes(appService.userId, function(data){
            if(data != "" && !appService.isObjUndefinedNull(data)){
                $("#divSave").hide();
                $("#txtNotes").attr("readonly","true").css("border","0px solid #FFF").focus().val(data);
                $("#divNotes").removeClass("hide").show();
                $("#lnkNote").html('Edit Notes');
            }
        });

            // To get user details for specific user by user id
            ServerCommunication.getUserById(appService.userId, function(userDetails){
            $scope.currentUserDetails = userDetails;
            $scope.imageUrl=appService.imageUrl;
            
            if(appService.lastSelectedTab == "btnMessage")
                $scope.ShowSection('Messages');
            else
                $scope.ShowSection('Biography');
        });

            // To make and remove connection status of the selected user
            $scope.makeConnection = function(userid){
            var oldString = sessionStorage.getItem('bio_connection');
            if($("#lnkConnection").html() == 'Make Connection'){
                if(oldString != null){

                    var newString = userid;
                    if(oldString != null){
                        if(oldString.indexOf(newString) == -1)
                            newString = oldString + ',' + newString;
                    }
                    newString = appService.trimComma(newString);
                    sessionStorage.setItem('bio_connection', newString);
                    appService.syncConnectionData();
                    $("#lnkConnection").html('Remove Connection');
                    $("#imgConnection").attr("src","img/Star.png");
                }
            }
            else{
                var removeId = userid;
                var newString = oldString.replace(removeId,'');
                newString = appService.trimComma(newString);
                sessionStorage.setItem('bio_connection', newString);
                appService.syncConnectionData();

                $("#lnkConnection").html('Make Connection');
                $("#imgConnection").attr("src","img/Star-white.png");
                
                
                var previousData = $scope.Users;
                var index = 0;
                angular.forEach(previousData, function(v, i){
                    if(previousData[i].id === userid){
                        index = i;
                        return false;
                    }
                });
                $scope.Users.splice(index, 1);
                setTimeout(function(){
                    $scope.gotoUserDetails($("#divUserList div").first().find("a").attr("id"));
                },100);
            }
        };

            // To save user notes data back to database using api call
            $scope.saveUserNote = function(user_id){
            var noteText = $('#txtNotes').val();
            /*fd.userDataSaveTextInput( user_id, { text: noteText } ).fail(function(error){
                alert('Error saving user note.');
            });*/

            $("#divSave").hide(500);
            $("#txtNotes").attr("readonly","true");
            $("#txtNotes").css("border","0px solid #FFF");

            $window.sessionStorage.setItem(user_id, $("#txtNotes").val());
            if($("#txtNotes").val().trim()===''){
                $("#lnkNote").html('Add Notes');
                $("#divNotes").hide(500);
            }
        };
            
            // This section opens the notes textbox to add/edit(if available) notes data
            $scope.addNotes = function(){
                debugger;
                var lnkText = $("#lnkNote").text();
                if(lnkText == 'Add Notes'){
                    $("#divSave").show(300);
                    $("#divNotes").removeClass("hide");
                    $("#divNotes").show(300);
                    $("#lnkNote").html('Edit Notes');
                    $("#txtNotes").removeAttr("readonly");
                    $("#txtNotes").css("border","1px solid #AAAAAA");
                    $("#txtNotes").focus();
                    $("#txtNotes").val(sessionStorage.getItem("notes"));
                }
                else{
                    $("#divSave").show(500);
                    $("#divNotes").show(500);
                    $("#txtNotes").removeAttr("readonly");
                    $("#txtNotes").css("border","1px solid #AAAAAA");
                    $("#txtNotes").focus();
                }
            };
        }
        else{
            appService.gotoPage("home");
        }
    }