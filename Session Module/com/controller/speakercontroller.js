(function () {
    "use strict";
    
    //defining function to pass as object in SpeakerController
    function SpeakerController($scope, $compile, ServerCommunication, ngDialog, AppService) {

        var appService = AppService, serverCommunication = ServerCommunication, sessionData = appService.sessionData, rooms = sessionData.rooms;

        $scope.direction = 'left';
        $scope.currentIndex = 0;

        // Managing the slider direction (right/left)
        $scope.setCurrentSlideIndex = function (index) {
            $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
            $scope.currentIndex = index;
        };

        // Setting current index of slider
        $scope.isCurrentSlideIndex = function (index) {
            return $scope.currentIndex === index;
        };

        // To move to previous slide
        this.prevSlide = function () {
            $scope.direction = 'left';
            $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
        };

        // To move to next slide
        this.nextSlide = function () {
            $scope.direction = 'right';
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
        };

        // To get selected user details
        function getUserDetail(username, callback) {
            serverCommunication.getUserDetail(username, function (userDetail) {
                callback(userDetail);
            });
        }
        
        var speakerDetails = [], mainCounter = 0;
        // Creating speaker collection for the speakers slider
        
        var allSpeakers = [];
        angular.forEach(rooms, function (iv, i) {
            allSpeakers = $.merge(allSpeakers, rooms[i].speakers);
        });
        
        var speakers = allSpeakers, fourSpeaker = [], count = 0;
        angular.forEach(speakers, function (jv, j) {
            mainCounter += 1;
            getUserDetail(speakers[j], function (userDetail) {
                var currKey = Object.keys(userDetail), currentUser = userDetail[currKey];
                currentUser.id = currKey[0];

                if (count === 4) {
                    speakerDetails.push(fourSpeaker);
                    fourSpeaker = [];
                    fourSpeaker.push(currentUser);
                    count = 1;
                } else {
                    fourSpeaker.push(currentUser);
                    count += 1;
                    if (mainCounter === speakers.length) {
                        speakerDetails.push(fourSpeaker);
                    }
                }
            });
        });
        
        $scope.slides = speakerDetails;
        
        // To hide speaker list and enlarge map area in case there is no speakers available
        if (speakerDetails.length === 0) {
            $scope.DisplaySpeakers(false);
            setTimeout(function () {
                $("#inline-view").css("height", "415px");
            }, 150);
            return;
        }

        // Function managing the data in the user details popup
        this.showUserDetails = function (userId) {

            $scope.star = "img/Star-white.png";
            $scope.connectionStatus = "Make Connection";
            $scope.userNoteLabel = "Add Notes";
            $scope.userNoteText = "";
            $scope.noteDisplay = "none";

            //this method returns details of a user
            getUserDetail(userId, function (data) {
                $scope.userId = userId;
                var _data = data[Object.keys(data)];
                if (appService.isUserConnected(userId)) {
                    _data.connected = true;
                    $scope.star = "img/Star.png";
                    $scope.connectionStatus = "Remove Connection";
                }

                appService.getUserNotes(userId, function (userNote) {
                    if (userNote != "") {
                        $scope.userNoteLabel = "Edit Notes";
                    }

                    $scope.bio = _data.description.bio;
                    $scope.userName = _data.first + ' ' + _data.last;
                    $scope.userRole = _data.role;

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
    }
    
    //This controller is for speaker slider
    mainModule.controller("SpeakerCtrl", ['$scope', '$compile', 'ServerCommunication', 'ngDialog', 'AppService', SpeakerController])
        .animation('.slide-animation', function () {
            return {
                beforeAddClass: function (element, className, done) {
                    var scope = element.scope();

                    if (className === 'ng-hide') {
                        var finishPoint = element.parent().width();
                        if (scope.direction !== 'right') {
                            finishPoint = -finishPoint;
                        }
                        TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
                    } else {
                        done();
                    }
                },
                removeClass: function (element, className, done) {
                    var scope = element.scope();

                    if (className === 'ng-hide') {
                        element.removeClass('ng-hide');

                        var startPoint = element.parent().width();
                        if (scope.direction === 'right') {
                            startPoint = -startPoint;
                        }

                        TweenMax.fromTo(element, 0.5, { left: startPoint }, {left: 0, onComplete: done });
                    } else {
                        done();
                    }
                }
            };
        });
})();