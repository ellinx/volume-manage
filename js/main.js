
var MAX_PARTITION_PER_CARD		= 16;


$(document).ready(function(){
   //Navigation Bar
   NavBar();
   accordionVolume();


});

function NavBar() {
   $("#idVolume").hide();

   $("#idHomeTab").click( function() {
      SelectNaviBar(1);
      $("#idHome").show('normal');
      $("#idVolume").hide();
   } );

   $("#idVolumeTab").click(  function() {
      SelectNaviBar(2);
      $("#idVolume").show('normal');
      $("#idHome").hide();
   } );

}

function SelectNaviBar(index) {
   switch(index) {
      case 1:
         $("#idHomeTab").removeClass("unselected").addClass("selected");
         $("#idVolumeTab").removeClass("selected").addClass("unselected");
         break;
      case 2:
         $("#idHomeTab").removeClass("selected").addClass("unselected");
         $("#idVolumeTab").removeClass("unselected").addClass("selected");
         break;
      case 3:
         $("#idHomeTab").removeClass("selected").addClass("unselected");
         $("#idVolumeTab").removeClass("selected").addClass("unselected");
         break;
   }
}

function accordionVolume() {
	$(".accordionCardButton").off("click");
   $(".accordionCardButton").click(function() {
      $(".accordionCardContent").slideUp('normal');
      if ($(this).next().css('display') == 'none') {
         $(this).next().slideDown('normal');
      }
   });

   //$(".accordionCardContent").hide();

   $(".accordionPartitionBtn").off("click");
   $(".accordionPartitionBtn").click(function() {
      $(".accordionPartition").slideUp('normal');
      if ($(this).next().css('display') == 'none') {
         $(this).next().slideDown('normal');
      }
   });


   $(".accordionPartition").hide();
}


function main( ) {
   //LoadPieCharts();
   PrepareRWOffset("A");
   PrepareRWOffset("B");
	initWebSock();

}
