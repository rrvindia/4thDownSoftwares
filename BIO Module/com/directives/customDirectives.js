//this module is used to create custom directives
//this custom directive is used to replace default image if image is not found in the folder
(function(){
  var cusDirective = angular.module('customeDirectives',[]);

  function errSrc() {
         return {
          link: function(scope, element, attrs) {

            scope.$watch(function() {
                return attrs.ngSrc;
              }, function (value) {
                if (!value) {
                  element.attr('src', attrs.errSrc);  
                }
            });

            element.bind('error', function() {
              element.attr('src', attrs.errSrc);
            });
          }
        };
  }
  cusDirective.directive('errSrc', errSrc);
})();