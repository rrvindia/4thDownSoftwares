// This variable is created globally to be used by fs_map api to set map pin with different values provided.
var roomcenter = new L.latLng(0, 0);

(function () {
    "use strict";
    
    //defining function to pass as object in map controller
    function MapController($scope, AppService) {
        
        var appService = AppService;
        
        // Assiging the room list from service variable (loaded on session info controller) to scope variable of map controller
        $scope.Rooms = appService.rooms;

        // To reload render map with the value corresponding to the selected room from the rooms dropdown
        $scope.changeRoom = function () {
            var venue = $scope.RoomName.venue, level = $scope.RoomName.level, rname = $scope.RoomName.name, rx = parseFloat($scope.RoomName.xpos), ry = parseFloat($scope.RoomName.ypos);

            renderMap(venue, level, rname, rx, ry);
        };

        // Render the map on page load
        $scope.mapLoad = function () {
            var localRooms = $scope.Rooms, venue = localRooms[0].venue, level = localRooms[0].level, rname = localRooms[0].name, rx = parseFloat(localRooms[0].xpos), ry = parseFloat(localRooms[0].ypos);
            renderMap(venue, level, rname, rx, ry);

            if (localRooms.length <= 1) {
                $("#drpRoomSelector").hide();
                $("#divRoomName").show();
                $("#divRoomName").text(localRooms[0].label);
            } else {
                $("#drpRoomSelector").show();
                $("#divRoomName").hide();
                $("#divRoomName").text();
            }
        };
        // Calling to the mapLoad function for first time
        $scope.mapLoad();

        // Generic function to load the map with required values provided
        function renderMap(venue, level, rname, rx, ry) {
            roomcenter.lat = rx;
            roomcenter.lng = ry;
            $scope.zoomerImage = Zoomer.zoom_image("inline-view", 'maps/assets/' + venue + '/level_' + level + '/tile_{z}_{x}_{y}.png', 6000, 6000);
            //$scope.zoomerImage = FullZoomer.zoom_image("full-view",'maps/assets/' + venue + '/level_' + level + '/tile_{z}_{x}_{y}.png',6000,6000);
        }
    }
    
    // Declaring a global variable "roomcenter" with default value of longitude & latitute as "0",
    mainModule.controller("MapsCtrl", ['$scope', 'AppService', MapController]);
    
})();