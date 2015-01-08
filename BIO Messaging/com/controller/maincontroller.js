/*
    This controller is a parent controller of the all the controllers in the application.
    This manages the scope between different controllers of different views.
    e.g.
    Functionality of filtering the user list on left navigation panel through tabs on header partial view.
*/
    mainModule.controller("MainCtrl", ['$scope', '$window', 'ServerCommunication', 'appService', MainCtrl]);

    function MainCtrl($scope, $window, ServerCommunication, appService) {
        var isMessageTab = false;
        var userCheck;

        // Function to goto user specific selected user details
        $scope.gotoUserDetails = function(userId, user_id){

            if(appService.lastSelectedUser === userId){
               return; 
            }
            appService.userId = userId;
            appService.user_id = user_id;
            var objId = userId;

            if(appService.lastSelectedUser !== undefined){
              $("#" + appService.lastSelectedUser).removeClass("anchorSelected");  
            }

            appService.lastSelectedUser = objId;
            $("#" + objId).addClass("anchorSelected");
            appService.imageUrl= "profile_img/"+userId+".jpg";
            appService.gotoPage("userdetails");
};

        $scope.ShowSection = function(text){
            if(text === "Biography"){
                $scope.ShowCurrentSecton('Biography');
                appService.removeClass('Biography');
            }
            else if(text === "Notes"){
                $scope.ShowCurrentSecton('Notes');
                appService.removeClass('Notes');
            }
            else if(text === "Messages"){
                $scope.ShowCurrentSecton('Messages');
                appService.removeClass('Messages');
                appService.getTestUserData(function(userList){
                    $.grep(userList,function(n,i){
                        if(appService.userId == userList[i].bio_id){
                            appService.user_id = userList[i].user_id;
                            return false;
                        }
                    });

                    ServerCommunication.getMessagesByUserId(appService.user_id, function(data){
                        var divMessageHTML = "";
                        setTimeout(function(){
                            $.each(data, function(num, value){
                                var msgClass = appService.user_id==value.to_user_id ? "blue-msg-box":"grey-msg-box";
                                divMessageHTML += '<div class="'+msgClass+'"><div class="arrow"></div><p>' + value.data +'</p><span>' + value.created +'</span></div></div>';
                            });
                            $("#divMessage").html(divMessageHTML);
                            $("#divMessage").scrollTop($("#divMessage").innerHeight());
                        },400); 
                        $("a[abc='"+appService.user_id+"']").parent().removeClass("bullets");
                    });
                });
            }
        };

        // Stops the background process to check if new user involve in the conversation
        $scope.stopUserCheck = function(){
            clearInterval(userCheck);
        };

        // This function gets all the users for attendees filter.
        $scope.showUserPanel = true;

        // To selected the tab specified and managing the last selected user
        $scope.ShowSelectedTab = function(tabName){
            var lastTab = appService.lastSelectedTab;
            if(lastTab == tabName)
                return true;
            
            if(lastTab !== undefined)
                $("#" + lastTab).removeClass("selected-nearby").removeClass("Selected_Tab");

            lastTab = appService.lastSelectedTab = tabName;
            $("#" + lastTab).addClass("Selected_Tab").addClass("selected-nearby");
            appService.lastSelectedUser = undefined;
        };

        // Gets the list of connected users
        $scope.getConnnectedUsers = function(callback, mainCallback){
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
                $window.sessionStorage.setItem("bio_connection","user_50,user_55,user_800");
                callback("user_50,user_55,user_800", mainCallback);
            }
            else
                callback($window.sessionStorage.getItem("bio_connection"), mainCallback);
                //callback("user_65,user_75", mainCallback);
};

        // Gets the list of all the users for attendees tab
        $scope.getAllUsers = function(){
            $scope.stopUserCheck();
            if($scope.ShowSelectedTab("btnAttendees"))
                return;

            ServerCommunication.getAllUserData(function(data){
                $scope.Users = data;
                appService.gotoPage("home");
            });

            setTimeout(function(){
                var linkId=$("#divUserList div").first().find("a").attr("id");
                appService.userId=linkId;
               $scope.gotoUserDetails(linkId);
            },100);
        };

        // Calling this function for getting user list for attendees as default .
        $scope.getAllUsers();

        // This function gets all the users for speakers filter.
        $scope.getSpeakerUsers = function(){
            $scope.stopUserCheck();
            if($scope.ShowSelectedTab("btnSpeakers"))
                return;

            ServerCommunication.getSpeakerUsers(function(data){
                $scope.Users = data;
                setTimeout(function(){
                    $scope.gotoUserDetails($("#divUserList div").first().find("a").attr("id"));
                },200);
            });
        };

        // This function gets all the users for nearby filter.
        $scope.getUserForMatchingDevice = function(){
            $scope.stopUserCheck();
            if($scope.ShowSelectedTab("btnNearBy"))
                return;

            ServerCommunication.getUserForMatchingDevice(function(data){
                $scope.Users = data;
                setTimeout(function(){
                    $scope.gotoUserDetails($("#divUserList div").first().find("a").attr("id"));
                },200);
            });
        };

        // This function gets all the users for connections filter.
        $scope.getUserForConnection = function(){
            $scope.stopUserCheck();
            if($scope.ShowSelectedTab("btnConnections"))
                return;

            ServerCommunication.getUserForConnection(function(data){
                $scope.Users = data;
                setTimeout(function(){
                    $scope.gotoUserDetails($("#divUserList div").first().find("a").attr("id"));
                },200);
            });
        };
        
        // Gets the latest list of users with the user details in the conversation
        $scope.getNewUsersDetails = function(userList, newUserList){
            appService.getAllUsers(function(userCollection){
                angular.forEach(newUserList, function(val, id){
                    var userDetails = $.grep(userCollection, function(n, i){
                        if (userCollection[i].id === newUserList[id].bio_id)
                            userCollection[i].user_id = newUserList[id].user_id;
                            userCollection[i].latestMsgId = 0;
                            return (userCollection[i].id === newUserList[id].bio_id);
                        }); 
                        userList.push(userDetails[0]);
                });
            });
        }

        $scope.sortList = function(item){
            if(appService.lastSelectedTab === "btnMessage")
                 return '';
            else
                return item.last;
        };

        // To make specified link selected on user details
        $scope.ShowCurrentSecton = function(section){
            switch(section){
                case 'Biography':
                    $scope.Biography=true;
                    $scope.Notes=false;
                    $scope.Messages=false;
                    break;
                case 'Messages':
                    $scope.Biography=false;
                    $scope.Notes=false;
                    $scope.Messages=true;
                    break;
                case 'Notes':
                    $scope.Biography=false;
                    $scope.Notes=true;
                    $scope.Messages=false;
                    break;
            }
        };
        
        // Gets the latest list of user IDs in the conversation
        $scope.getUsersinConversation = function(obj, callback){
            var list = [];
            angular.forEach(obj, function(v, i){
                list.push(obj[i].bio_id);
            });
            callback(list);
        };
        
        // This function is called to fetch all users in the left panel
        $scope.getUserForMessage = function(){ 
            if($scope.ShowSelectedTab("btnMessage"))
                return;

            ServerCommunication.getAllMessageUser(function(data){
                $scope.Users = data;
                setTimeout(function(){
                    $scope.gotoUserDetails($("#divUserList div").first().find("a").attr("id"));
                },100);
            });

            $scope.checkNewUserInConversation();
        };
        
        // Track the latest message id for the user and add bullet indicating new message and 
        // reorder the user list according to the latest message arrived
        $scope.trackLatest = function(jsonData, userid, id){
            var _value = sessionStorage.getItem(userid);
            var lastestMsgID = (_value === undefined || _value === null) ? 0 : _value;
            $.each(jsonData, function(n, i){
                var currData = jsonData[n];
                if(parseInt(lastestMsgID) < parseInt(currData.message_id)){
                    latestMsgUserIds.unshift(userid);
                    lastestMsgID = currData.message_id;
                    $("a[abc='"+userid+"']").parent().addClass("bullets");
                    
                    var currUser = $("#" + id).parent();
                    currUser.prependTo($(currUser).parent());
                }
            });
            sessionStorage.setItem(userid, lastestMsgID);
            return lastestMsgID;
        }
        
        // Function to track unread messages for all users in the conversation
        $scope.trackUnreadMsgs = function(detailedList){
            angular.forEach(detailedList, function(n, i){
                var userid = detailedList[i].id;
                var bioid = detailedList[i].user_id;
                appService.getTestMsgData(bioid, function(msgData){
                    $scope.trackLatest(msgData, bioid, userid);
                    var divMessageHTML = "";
                    setTimeout(function(){
                        if(appService.userId === userid){
                            $.each(msgData, function(num, value){
                                var msgClass = appService.user_id==value.to_user_id ? "blue-msg-box":"grey-msg-box";
                                divMessageHTML += '<div class="'+msgClass+'"><div class="arrow"></div><p>' + value.data +'</p><span>' + value.created +'</span></div></div>';
                            });
                            $("#divMessage").html(divMessageHTML);
                            $("#divMessage").scrollTop($("#divMessage").innerHeight());
                        }
                    },100);
                });
            });
        };
        
        // Function track if new user added in the conversation
        $scope.checkNewUserInConversation = function(){
            var userList = [];
            userCheck = setInterval(function(){
                userList = [];
                appService.getTestUserData(function(newUserList){
                    $scope.getNewUsersDetails(userList, newUserList);
                    var lastUserList = $window.sessionStorage.getItem("lastUserList");
                    if(lastUserList !== undefined && lastUserList !== null){
                        $scope.getUsersinConversation(newUserList, function(list){
                            if(list.sort().join(",") !== lastUserList.split(",").sort().join(",")){
                                $window.sessionStorage.setItem("lastUserList", list);

                                var isSelectedUserRemoved = $.grep(newUserList, function(n,i){
                                    return (newUserList[i].bio_id == appService.lastSelectedUser);
                                }).length == 0;

                                if(isSelectedUserRemoved){
                                    setTimeout(function(){
                                        $scope.gotoUserDetails($("#divUserList div").first().find("a").attr("id"));
                                    },100);
                                }

                                $scope.Users = userList;
                                $scope.highlightCurrentUser();
                            }
                        });
                    }
                    else{
                        $scope.highlightCurrentUser();
                        
                        var list = $scope.getUsersinConversation(newUserList, function(list){
                           $window.sessionStorage.setItem("lastUserList", list); 
                        });
                        $scope.Users = userList;
                    }
                    $scope.trackUnreadMsgs(userList);
                });

            }, 10000);
        };
        
        // Highlights the current selected user
        $scope.highlightCurrentUser = function(){
            if(appService.lastSelectedUser !== undefined){
                setTimeout(function(){
                    $("#" + appService.lastSelectedUser).addClass("anchorSelected");
                },100);
            }
        };
    }