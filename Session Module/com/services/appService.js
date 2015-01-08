(function(){
    "use strict";
    
    //defining function to pass as object in AppService
    function AppService($window) {

        // Function to get the notes for specified user
        this.getUserNotes = function (userId, callback){
            var userNote = $window.sessionStorage.getItem(userId);
            
            try{
                if(userNote != undefined && userNote != null){
                    callback(userNote);
                } else {
                    fd.userDataGetTextInput( userId ).done(function( result ){ 
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
                    }).fail(function (error) {
                        userNote = "Failed to fetch user notes";
                        callback(userNote);
                    });
                } 
            }
            catch (error) {
                userNote = "Failed to fetch user notes";
                callback(userNote);
            }
        };

        // Function to correct the user for connected user by removing the extra comma from the comma seperated string of connected users
        this.trimComma = function (text){
            if(text.charAt(0)===','){
                text = text.slice(1);
            }
            if(text.charAt(text.length-1)===','){
                text = text.substr(0,text.length-1);
            }
            if(text.indexOf(',,')>-1){
                text = text.replace(',,',',');
            }
            return text;
        };

        //this method is used to make and remove connection
        this.makeConnection = function (obj){
            var userid = obj.userId;//$(obj).parent().find("div[id='curUID']").html();
            var oldString = $window.sessionStorage.getItem('bio_connection');

            if($("#lnkConnection").text() === 'Make Connection'){
                if(oldString != null){
                    var newString = userid;
                    if(oldString != null){
                        if(oldString.indexOf(newString) === -1)
                            newString = oldString + ',' + newString;
                    }
                    newString = this.trimComma(newString);
                    $window.sessionStorage.setItem('bio_connection', newString);
                    this.syncConnectionData();
                    $("#lnkConnection").html('Remove Connection');
                    $("#imgConnection").attr("src","img/Star.png");
                }
            }
            else{
                var removeId = userid;
                var newString = oldString.replace(removeId,'');
                newString = this.trimComma(newString);
                $window.sessionStorage.setItem('bio_connection', newString);
                this.syncConnectionData();

                $("#lnkConnection").html('Make Connection');
                $("#imgConnection").attr("src","img/Star-white.png");

                //myService.gotoPage("home");
            }
        };

        // This function checks if the connection status of user is connected
        this.isUserConnected = function(userId){
            var userString = $window.sessionStorage.getItem("bio_connection");
            if (userString === null || userString === undefined)
                return false;

            var arrUser = userString.split(',');
            if(arrUser.length > 0 && arrUser.indexOf(userId)>-1)
                return true;
            else
                return false;
        };

        // Function is creating a session variable to hold and return the connection status data of the users
        this.getConnnectedUsers = function(){
           try{
                if($window.sessionStorage.getItem("bio_connection") === undefined || $window.sessionStorage.getItem("bio_connection") === null){
                    setTimeout(function(){
                        //alert("Getting connected users data.")
                        fd.userDataGetTextInput( "bio_connection" ).done(function( result ){
                            if(result.text === undefined || result.text === null){
                                callback("", mainCallback);
                            }
                            else{
                                $window.sessionStorage.setItem("bio_connection",result.text);
                                callback(result.text, mainCallback);
                            }
                        });
                    }, 1000);
                    $window.sessionStorage.setItem("bio_connection","");
                }
            }
            catch(error){
                //alert("Error getting connnected users.");
            }
        };

        // This function is taking care of saving the connection status of all the users
        this.syncConnectionData = function(){
            //alert("Making/Removing connection start.");
            var sessionString = $window.sessionStorage.getItem('bio_connection');
            if(sessionString === null || sessionString === undefined)
                return;

            try{
                fd.userDataSaveTextInput( "bio_connection" , { text: sessionString } ); 
                //alert("Making/Removing connection done.");
            }
            catch(error){
               // alert("Error saving connection data.");
            }
        };
    }
    
    mainModule.service('AppService', ['$window', AppService]);
    
})();