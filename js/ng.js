var app = angular.module("myApp", []);
app.controller("myCtrl", function($scope) {
   $scope.Books = [
      {  name: "Alfreds",
         author: "Futterkiste"
      },
      {  name: "Berglunds snabbköp",
         author: "snabbköp"
      },
      {  name: "Centro comercial Moctezuma",
         author: "Moctezuma"
      },
      {  name: "Ernst Handel",
         author: "Handel"
      }
   ]
});
