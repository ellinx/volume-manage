'use strict';
angular.module('BMSApp', []).controller('NavController', ['$scope',function($scope) {
  $scope.selectedNav = 0;

  $scope.selectNav = function(index) {
    $scope.selectedNav = index;
  }

  $scope.isSelected = function(index) {
    return ($scope.selectedNav == index);
  }

  var books = [
    {
      name:'Gone with wind',
      //image: 'images/uthapizza.png',
      author:'Margaret Mitchell',
      category: 'mains',
      label:'Hot',
      price:'4.99',
      description:'A unique combination of Indian Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer.',
      comment: ''
    },

    {
      name:'Twenty Thousand Leagues Under the Sea',
      //image: 'images/zucchipakoda.png',
      author:'Jules Verne',
      category: 'appetizer',
      label:'',
      price:'1.99',
      description:'Deep fried Zucchini coated with mildly spiced Chickpea flour batter accompanied with a sweet-tangy tamarind sauce',
      comment: ''
    },

    {
      name:'The Old Man and the Sea',
      //image: 'images/vadonut.png',
      author:'Ernest Hemingway',
      category: 'appetizer',
      label:'New',
      price:'1.99',
      description:'A quintessential ConFusion experience, is it a vada or is it a donut?',
      comment: ''
    },

    {
      name:'Sherlock Holmes',
      //image: 'images/elaicheesecake.png',
      author:'Sir Arthur Conan Doyle',
      category: 'dessert',
      label:'',
      price:'2.99',
      description:'A delectable, semi-sweet New York Style Cheese Cake, with Graham cracker crust and spiced with Indian cardamoms',
      comment: ''
    }
  ];

  $scope.books = books;
}]);
