    mainModule.service('appService',['$http', '$window', appService]);

    function appService ($http, $window) {
    
        //this.latestMsgUserIds = [];
    
        this.gotoPage =  function (page) {
        $window.location.href = "#" + page;
    };
    
        // Function is creating a session variable to hold and return the connection status data of the users
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
            $window.sessionStorage.setItem("bio_connection","user_50,user_55,user_800");
            callback("user_50,user_55,user_800", mainCallback);
        }
        else
            callback($window.sessionStorage.getItem("bio_connection"), mainCallback);
            //callback("user_65,user_75", mainCallback);
    };
    
        // This function checks if the connection status of user is connected
        this.isUserConnected = function(userId, userString){
        return isUserConnected(userId, userString);
    }
    
        function isUserConnected(userId, userString){
        var userString = sessionStorage.getItem("bio_connection");
        
        if (userString === null || userString === undefined)
        return false;

        var arrUser = userString.split(',');
        if(arrUser.length > 0 && arrUser.indexOf(userId)>-1)
            return true;
        else
            return false;
    }
    
        // This function is taking care of saving the connection status of all the users
        this.syncConnectionData = function () {
        var sessionString = sessionStorage.getItem('bio_connection');
        if(sessionString == null || sessionString == undefined)
            return;

        /*fd.userDataSaveTextInput( "bio_connection" , { text: sessionString } )
        .fail(function(error){
            alert("Error saving connection data.");
        });*/
    }
    
        // Function to correct the user for connected user by removing the extra comma from the comma seperated string of connected users
        this.trimComma = function (text) {
        if(text.charAt(0) == ','){
            text = text.slice(1);
        }
        if(text.charAt(text.length-1) == ','){
            text = text.substr(0, text.length - 1);
        }
        if(text.indexOf(',,') >- 1){
            text = text.replace(',,',',');
        }
        return text;
    }
    
        // Function to check if object is undefined or null
        this.isObjUndefinedNull = function (obj) {
        if(obj == undefined || obj == null)
            return true;
        else
            return false;
    }

        //this method provides current date time in proper format
        this.getDateTime = function () {
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        var hours = currentDate.getHours();
        var minutes = currentDate.getMinutes();
        var suffix = "AM";

        if (minutes < 10){
            minutes = "0" + minutes;
        }
        if (hours >= 12) {
            suffix = "PM";
            hours = hours - 12;
        }
        if (hours === 0){
            hours = 12;
        }
        return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ' ' + suffix ;
    }

        //this method is used to highlight the seleted link
        this.removeClass = function (type){
        $("#lnkBio").removeClass("link_selected");
        $("#lnkBio span").removeClass("lnk_span");

        $("#lnkNotes").removeClass("link_selected");
        $("#lnkNotes span").removeClass("lnk_span");

        $("#lnkMsg").removeClass("link_selected");
        $("#lnkMsg span").removeClass("lnk_span");

        if(type=='Biography'){
            $("#lnkBio").addClass("link_selected");
            $("#lnkBio span").addClass("lnk_span");
        }
        else if(type=='Notes'){
            $("#lnkNotes").addClass("link_selected");
            $("#lnkNotes span").addClass("lnk_span");
        }
        else if(type=='Messages'){
            $("#lnkMsg").addClass("link_selected");
            $("#lnkMsg span").addClass("lnk_span");
        }
}
    
        // Function to get the notes for specified user
        this.getUserNotes = function (userId, callback) {
        var userNote = $window.sessionStorage.getItem(userId);
        if(userNote !== undefined && userNote !== null){
            callback(userNote);
        }
        else{
            /*fd.userDataGetTextInput( userId )
            .done(function( result ){ 
                if(result.text != undefined && result.text != null && result.text != "" ){
                    alert("Note fetched.."+ result.text);
                    textNotes = result.text;
                    $("#lnkAddNotes").html("Edit Notes");
                    $('.div_notes').val(textNotes);
                    $("#divnotesection").removeClass("hide");

                    if(result.text != undefined && result.text != null && result.text != "" ){
                        userNote = result.text;
                    }
                    callback(userNote);
                }
            })
            .fail(function(error){
                //alert("Error getting notes data.");
            });
            */
            
            userNote = "Temporary note.";
            callback(userNote);
        }
    }

        // Functions to get all attendees users from json file and creating data according to format for angular filter.
        this.getAllUsers = function (callback){
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
    }
    
        // Functions to get all speaker users from json file and creating data according to format for angular filter.
        this.getAllSpeakers = function (callback, userCollection) {
         var userData = user_api.eventGetSpeakers();
         var data=userData[0];
         var speakerCollection  = [];
            $.each(data, function(index, value){
                data[index].id = index;
                speakerCollection.push(data[index]);
            });
            callback(userCollection, speakerCollection);
    }

        // Functions to get all nearby device users from json file and creating data according to format for angular filter.
        this.getNearByDevices = function (callback, userCollection) {
        var userData = user_api.eventGetNearBy();
        var data=userData[0];
        var nearByDeviceCollection  = [];
            $.each(data, function(index, value){
                nearByDeviceCollection.push(data[index]);
            });
            callback(userCollection, nearByDeviceCollection);
    }
    
        // Get users list in the conversation
        this.getTestUserData = function(callback){
        $http.get("com/services/userdata.json").success(function(data){
            callback(data);
        });
    }
    
        // Get message data for the user specified
        this.getTestMsgData = function(userid, callback){
            $http.get("com/services/" + userid + ".json").success(function(data){
                callback(data);
            });
        }
    
    }