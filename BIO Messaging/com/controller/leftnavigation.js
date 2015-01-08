
// This controller manages user list actions in the left panel
mainModule.controller("LeftNavigationCtrl", ['$scope','ServerCommunication', LeftNavigationCtrl]);
function LeftNavigationCtrl($scope, ServerCommunication) {
    $scope.dataLimit = 50;

    //Register the scroll event to load more data while scrolling
    $scope.registerUserScroll = function(){
        $("#divUserList").scroll(function () {
            if ($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
                $scope.dataLimit += 50;
                $scope.$apply();
            }
        });
    };
}