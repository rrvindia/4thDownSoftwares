    latestMsgUserIds=[];
    // Registering the ServerCommunication factory to 4thdownServerCommunication module
    mainModule.factory('ServerCommunication', ['appService', ServerCommunication]);

    function ServerCommunication(appService) {
        var ServerCommunication={};

        // Fetching all the users for attendees using generic function
        ServerCommunication.getAllUserData = function(callback){
            appService.getAllUsers(callback);
        };
    
        // Fetching all the users for speakers using generic function
        // This function contain logic to match the users in from user json file with user matching in speakers json file
        ServerCommunication.getSpeakerUsers = function(callback){
            var matchingSpeaker = [];
            appService.getAllUsers(function(userCollection){
                appService.getAllSpeakers(function(userCollection, speakerCollection){
                    angular.forEach(userCollection, function(value, index){
                        var userid = userCollection[index].id;
                        $.each(speakerCollection, function(index2, value){
                            if($.inArray(userid, speakerCollection[index2].speakers) != -1){
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
            appService.getAllUsers(function(userCollection){
                appService.getNearByDevices(function(userCollection, nearByDevices){
                    angular.forEach(userCollection, function(value, index){
                        var deviceId = userCollection[index].device;
                        $.each(nearByDevices, function(index2, value){
                            if($.inArray(deviceId, nearByDevices[index2].devices) != -1){
                                userForMatchingDevice.push(userCollection[index]);
                                return false;
                            }
                        });
                    });
                   callback(userForMatchingDevice); 
                }, userCollection);
            });
        };
    
        // Function to get connected users
        ServerCommunication.getUserForConnection = function(callback){
            appService.getAllUsers(function(allUsers){
                var filteredData = $.grep(allUsers,function(v, j){
                    return(allUsers[j].isConnected === true);
                });
                callback(filteredData);
            });
        };
    
        // Function to get particular user by user id
        ServerCommunication.getUserById = function(userId, callback){
            appService.getAllUsers(function(userCollection){
                var userDetails = $.grep(userCollection, function(n, i){
                    return (userCollection[i].id == userId);
                });

                if(userDetails.length>0){
                    callback(userDetails[0]);
                }
            });
        };
    
        //get all the users having chat with logged in user.
        ServerCommunication.getAllMessageUser = function(callback, ii){
            appService.getTestUserData(function(messageUser){
                var userList=[];
                appService.getAllUsers(function(userCollection){
                    angular.forEach(messageUser, function(val, id){
                        var userDetails = $.grep(userCollection, function(n, i){
                            if (userCollection[i].id == messageUser[id].bio_id)
                                userCollection[i].user_id=messageUser[id].user_id;
                                return (userCollection[i].id == messageUser[id].bio_id);
                            }); 
                            userList.push(userDetails[0]);
                    });
                });
                if(latestMsgUserIds.length>0){
                    angular.forEach(userList, function(value, index){
                        if(latestMsgUserIds[0] !== undefined){
                           if(userList[index].user_id==latestMsgUserIds[0]){
                              var tempItem= userList[index];
                               $("a[abc='"+userList[index].user_id+"']").parent().addClass("bullets");
                               userList.splice(index,1);
                               userList.unshift(tempItem);
                               latestMsgUserIds.splice(0,1);
                           }
                        }
                    });
                }
                callback(userList);
            });
        };
    
        //get all messages for a particular user user
        ServerCommunication.getMessagesByUserId = function(user_id, callback){
            //callback(appService.getMessageByUserId(user_id));
            appService.getTestMsgData(user_id, function(data){
                callback(data);
            });
        };
        
        return ServerCommunication;
    }

/* ------------------------- Below are generic functions to be deleted on production release -----------------------*/


/*function getMessagesRange (number,userId){
    if(userId=='jbodajlo'){
        if(number===0)
      return [{"message_id":"9","from_user_id":"jseaborn","to_user_id":"jbodajlo","data":"What's up?","created":"2014-09-25 15:23:12"},
              {"message_id":"7","from_user_id":"jbodajlo","to_user_id":"jseaborn","data":"yo","created":"2014-09-25 15:23:12"},
              {"message_id":"6","from_user_id":"jbodajlo","to_user_id":"jseaborn","data":"no, ive got a bunch to work on and will be out for a couple of hours this morning. so making up that time\n\nso i'll figure out something to fill my time ","created":"2014-09-25 15:23:12"},
              {"message_id":"5","from_user_id":"jseaborn","to_user_id":"jbodajlo","data":"hope you didn't start early just for me.","created":"2014-09-25 15:23:12"},
              {"message_id":"4","from_user_id":"jbodajlo","to_user_id":"jseaborn","data":"ok","created":"2014-09-25 15:23:12"},
              {"message_id":"3","from_user_id":"jseaborn","to_user_id":"jbodajlo","data":"thanks, I'll be in touch","created":"2014-09-25 15:23:12"},
              {"message_id":"2","from_user_id":"jbodajlo","to_user_id":"jseaborn","data":"we can do later today when you're ready","created":"2014-09-25 15:23:12"},
              {"message_id":"1","from_user_id":"jseaborn","to_user_id":"jbodajlo","data":"sorry, got caught up doing other stuff with Brett yesterday.","created":"2014-09-25 15:23:12"}];
        else
            return [{"message_id":"20","from_user_id":"jseaborn","to_user_id":"jbodajlo","data":"I'm hanging in there. Still trying to put some pieces together.","created":"2014-09-25 15:23:12"},
              {"message_id":"19","from_user_id":"jbodajlo","to_user_id":"jseaborn","data":"how you making out?","created":"2014-09-25 15:23:12"},
              {"message_id":"18","from_user_id":"jseaborn","to_user_id":"jbodajlo","data":"That works.","created":"2014-09-25 15:23:12"},
              {"message_id":"17","from_user_id":"jbodajlo","to_user_id":"jseaborn","data":"will do 9:30 EST then","created":"2014-09-25 15:23:12"},
              {"message_id":"11","from_user_id":"jseaborn","to_user_id":"jbodajlo","data":"As early as you want. I'll be up when you need me.","created":"2014-09-25 15:23:12"},
              {"message_id":"10","from_user_id":"jbodajlo","to_user_id":"jseaborn","data":"i want to do a quick team call tomorrow morning. what time will work for you in the AM?","created":"2014-09-25 15:23:12"},
              {"message_id":"9","from_user_id":"jseaborn","to_user_id":"jbodajlo","data":"What's up?","created":"2014-09-25 15:23:12"},
              {"message_id":"7","from_user_id":"jbodajlo","to_user_id":"jseaborn","data":"yo","created":"2014-09-25 15:23:12"},
              {"message_id":"6","from_user_id":"jbodajlo","to_user_id":"jseaborn","data":"no, ive got a bunch to work on and will be out for a couple of hours this morning. so making up that time\n\nso i'll figure out something to fill my time ","created":"2014-09-25 15:23:12"},
              {"message_id":"5","from_user_id":"jseaborn","to_user_id":"jbodajlo","data":"hope you didn't start early just for me.","created":"2014-09-25 15:23:12"},
              {"message_id":"4","from_user_id":"jbodajlo","to_user_id":"jseaborn","data":"ok","created":"2014-09-25 15:23:12"},
              {"message_id":"3","from_user_id":"jseaborn","to_user_id":"jbodajlo","data":"thanks, I'll be in touch","created":"2014-09-25 15:23:12"},
              {"message_id":"2","from_user_id":"jbodajlo","to_user_id":"jseaborn","data":"we can do later today when you're ready","created":"2014-09-25 15:23:12"},
              {"message_id":"1","from_user_id":"jseaborn","to_user_id":"jbodajlo","data":"sorry, got caught up doing other stuff with Brett yesterday.","created":"2014-09-25 15:23:12"}];

    }
    else if(userId=='blutz'){
     return [{"message_id":"21","from_user_id":"blutz","to_user_id":"jseaborn","data":"another message.  I'm popular!","created":"2014-09-25 15:40:13"}] ;
    }
    else if(userId=='bhowell'){
        if(number===0)
        return [{"message_id":"14","from_user_id":"bhowell","to_user_id":"jseaborn","data":"slammed","created":"2014-09-25 15:23:12"},
                {"message_id":"13","from_user_id":"jseaborn","to_user_id":"bhowell","data":"Pretty good how about you?","created":"2014-09-25 15:23:12"},
                {"message_id":"12","from_user_id":"bhowell","to_user_id":"jseaborn","data":"how you doing?","created":"2014-09-25 15:23:12"}];
    else
        return [{"message_id":"16","from_user_id":"jseaborn","to_user_id":"bhowell","data":"Roger. Be there tomorrow.","created":"2014-09-25 15:23:12"},
                {"message_id":"15","from_user_id":"jseaborn","to_user_id":"bhowell","data":"Sorry to hear that. Let me know if I can help.","created":"2014-09-25 15:23:12"},
                {"message_id":"14","from_user_id":"bhowell","to_user_id":"jseaborn","data":"slammed","created":"2014-09-25 15:23:12"},
                {"message_id":"13","from_user_id":"jseaborn","to_user_id":"bhowell","data":"Pretty good how about you?","created":"2014-09-25 15:23:12"},
                {"message_id":"12","from_user_id":"bhowell","to_user_id":"jseaborn","data":"how you doing?","created":"2014-09-25 15:23:12"}];

    }
    else if(userId=='raviv'){
     return [{"message_id":"18","from_user_id":"raviv","to_user_id":"jseaborn","data":"New Message for testing ravi new user","created":"2014-09-25 15:40:13"}] ;
    }
}


function getUsersByMessage (ii) {
    if(ii===0){
        return [{"user_id":"blutz","first_name":"Bill","last_name":"Lutz","bio_id":"user_478","job_title":"VP, Sales","latest_message_id":"22"},
        {"user_id":"jbodajlo","first_name":"James","last_name":"Bodajlo","bio_id":"user_476","job_title":"CEO","latest_message_id":"21"},
        {"user_id":"bhowell","first_name":"Brett","last_name":"Howell","bio_id":"user_477","job_title":"CEO","latest_message_id":"17"}];
    }
    else if(ii==1){
        return [
        {"user_id":"blutz","first_name":"Bill","last_name":"Lutz","bio_id":"user_478","job_title":"VP, Sales","latest_message_id":"22"},
        {"user_id":"jbodajlo","first_name":"James","last_name":"Bodajlo","bio_id":"user_476","job_title":"CEO","latest_message_id":"21"},
        {"user_id":"bhowell","first_name":"Brett","last_name":"Howell","bio_id":"user_477","job_title":"CEO","latest_message_id":"17"}];
    }
    else
    {
        return [
        {"user_id":"blutz","first_name":"Bill","last_name":"Lutz","bio_id":"user_478","job_title":"VP, Sales","latest_message_id":"21"},
        {"user_id":"jbodajlo","first_name":"James","last_name":"Bodajlo","bio_id":"user_476","job_title":"CEO","latest_message_id":"20"},
        {"user_id":"bhowell","first_name":"Brett","last_name":"Howell","bio_id":"user_477","job_title":"CEO","latest_message_id":"16"},
        {"user_id":"raviv","first_name":"Ravi","last_name":"Verma","bio_id":"user_475","job_title":"Developer","latest_message_id":"15"}];
    }
}*/