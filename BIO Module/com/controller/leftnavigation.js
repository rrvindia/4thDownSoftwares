//this controller manages user list actions in the left panel
(function(){
    "use strict";
    function LeftNavigationCtrl($scope, AppService) {
        var appService = AppService;
        
        // Limit of users to load dynamically on scroll if scroll reaches very bottom
        $scope.dataLimit = 50;

        // This fetched the detais of the specific user id
        this.gotoUserDetails = function(userId){
            if(appService.lastSelectedUser === ("lnk" + userId)){
               return; 
            }
            appService.userId = userId;
            var objId = "lnk" + userId;
            if(appService.lastSelectedUser !== undefined){
              $("#" + appService.lastSelectedUser).removeClass("anchorSelected");  
            }
            appService.lastSelectedUser = objId;
            $("#" + objId).addClass("anchorSelected");
            appService.imageUrl = $("#"+userId).attr("src");
            appService.gotoPage("userdetails");
        };

        // Register the scroll event to load more data while scrolling
        this.registerUserScroll = function(){
            $("#divUserList").scroll(function () {
                if ($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
                    $scope.dataLimit += 50;
                    $scope.$apply();
                }
            });
        };
        this.registerUserScroll();
    }
    
    mainModule.controller("LeftNavigationCtrl",['$scope', 'AppService', LeftNavigationCtrl ]);
})();