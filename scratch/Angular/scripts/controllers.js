'use strict';
angular.module('BMSApp')
  .controller('NavController', ['$scope',function($scope) {
    $scope.selectedNav = 0;

    $scope.selectNav = function(index) {
      $scope.selectedNav = index;
    }

    $scope.isSelected = function(index) {
      return ($scope.selectedNav == index);
    }

  }])

  .controller('BooksController', ['$scope','BooksFactory',function($scope, BooksFactory) {

    $scope.books = BooksFactory.getBooks();

  }])
;
