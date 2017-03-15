
var piechartProperties = new Object();


function pieChart(canvas_name, radius, pieChartPercents, inputtext, colors) {
	var canvas = document.getElementById(canvas_name);
	var a = piechartProperties.a = canvas.getContext("2d");
	piechartProperties.colors = colors;
	piechartProperties.i = 0;
	canvas.width = 7*radius;

	canvas.height = 100;
	x = y = canvas.height/2;
	a.font = "bold 12px Arial";
	var u = 0;
	var v = 0;

	for (i=0;i < pieChartPercents.length;i++) {
		v += pieChartPercents[i];
		drawChart(i)(x,y,radius,u,v);
		u = v;
		a.fillText(inputtext[i], x+radius+10, y-radius/2+i*18);
	}
}


function drawChart(x,y,r,u,v) {
	var a = piechartProperties.a;

	if(r) {
		a.beginPath();
		a.moveTo(x,y);
		a.arc(x, y , r, (u||0)/50*Math.PI, (v||7)/50*Math.PI, 0);
		a.lineTo(x,y);
		a.fill();
	} else {
		a.fillStyle = '#'+piechartProperties.colors[piechartProperties.i++];
	}

	return drawChart;
}


function LoadPieCharts(cardchar, used, free) {
	var usedStr = "Used Space "+used+"%";
	var freeStr = "Free Space "+free+"%";

	if (cardchar == "A") {
   	pieChart('c_a', 50, [Math.round(used), Math.round(free)], [usedStr, freeStr], ['FC7D00','0066FF']);
   } else if (cardchar == "B") {
   	pieChart('c_b', 50, [Math.round(used), Math.round(free)], [usedStr, freeStr], ['FC7D00','0066FF']);
   } else {
   	console.log("LoadPieCharts() cardchar not matched!");
   }
}


/* generate borders and expandable partition sections for card A or card B for each entry in partition table */
function generatePartitionEntries ( partitionData, start, end, divsection )  {

	var   divSectiondoc = document.getElementById( divsection );
	divSectiondoc.innerHTML = "";

	var   cardIDstr = "";
	var   cardchar = "";

	if (divsection == "CardAPartitionList") {
		cardIDstr = "SD_CARD_A";
		cardchar = "A";
	} else if (divsection == "CardBPartitionList") {
		cardIDstr = "SD_CARD_B";
		cardchar = "B";
	} else {
		console.log("Wrong divSection data!");
	}
	//console.log("cardchar:"+cardchar);

	var PUIDindex  = "";
	var partition_PUID = "puid_error";
	var partition_PeerPUID = "peerpuid_error";
	var partition_size = 0;
	var partition_size_unit = "";
	var partition_used = 0;
	var partition_used_unit = "";
	var partition_used_percentage = 0;
	var usage_bar_color = "#DDDDDD";
	var usage_font_color = "#DDDDDD";
	var partition_type = "type_error";
	var partition_format = "format_error";

	var flag_PSPCanMount = "";
	var flag_HostCanMount = "";
	var flag_SwWriteProtected = "";
	var flag_RebuildInProgress = 0;
   var flag_FormatInProgress = 0;
   var flag_ResizeInProgress = 0;
   var flag_VerifyInProgress = 0;
   var flag_UploadInProgress = "hidden";
   var flag_DownloadInProgress = "hidden";
	var flag_mounted = "NONE";
	var Option_share_unshare = "Share";
	var Option_share_unshare_html = "&emsp;Share&emsp;";

	var MediaType_HDD = "";
	var MediaType_Optical = "";
	var MediaType_Floppy = "";
	var ClaimType_Unclaimed = "";
	var ClaimType_Host = "";
	var ClaimType_PSP = "";


	var partition_name = "name_error";
	var partition_desc = "desc_error";

	var resizeDefaultB = "";
	var resizeDefaultKB = "";
	var resizeDefaultMB = "";
	var resizeDefaultGB = "";

	var convertTypeJBOD = (cardchar == "A") ? (CONVERT_PART_TYPE_JBOD_CARD_A) : (CONVERT_PART_TYPE_JBOD_CARD_B) ;

	for ( var j=start; j < end; j++ ) {
   	/* get the Info of the specific partition here */

		if (cardchar == "A") {
			PUIDindex = "1" + (j-start);
		} else {
			PUIDindex = "2" + (j-start);
		}

		partition_PUID = partitionData[j].owPUID;
		partition_PeerPUID = partitionData[j].owPUIDPeer;

		//console.log("ClaimType:"+partitionData[j].dwClaimType);

	   partition_name = decodeURI(partitionData[j].abyPartitionName);
	   partition_desc = decodeURI(partitionData[j].abyUserComment);

	   //console.log("partitionName Length:"+partitionData[j].cbyPartitionName);
	   //console.log("usercomment length:"+partitionData[j].cbyUserComment);
	   //console.log("partition_name:"+partitionData[j].abyPartitionName);
	   //console.log("partition_name:"+partition_name);
	   //console.log("partition_desc:"+partition_desc);

	   switch(partitionData[j].dwType) {
	      case 0:
	        	partition_type = (cardchar=="A") ? "JBOD_CARD_A" : "JBOD_CARD_B";
	        	break;
	      case 1:
	        	partition_type = "Mirror";
	        	break;
	      default:
	      	console.log("Wrong partition type! partitionData[j].dwType="+partitionData[j].dwType);
	        	break;
	   }

    	//console.log("partition_type:"+partition_type);


    	if(partition_type == "JBOD_CARD_A" || partition_type == "JBOD_CARD_B") {
       	divSectiondoc.innerHTML +=
       	"<font size='4' color='#E8E8E8'>" +
          	"<div class='PartitionBorder' id='VolHeader" + PUIDindex + "'> " +
             	"<div class='accordionPartitionBtn' style='padding-top:17px;padding-bottom:17px;'>" +
             		"<span>" +
                   	"&emsp;&emsp;" + cardIDstr + "&emsp;&emsp;&emsp;Name:&emsp;" + partition_name +
                  "</span>" +
             	"</div>" +
             	"<div id='ExpandVolArea" + PUIDindex + "' class='accordionPartition'>" +
                	//"<p>" +
                	"&emsp;&emsp;<span id='uploadErrorMsg" + PUIDindex + "' style='font-size:15px;color:red;font-weight:bold;'></span>" +
						"<span id='uploadCancelFlag" + PUIDindex + "' style='display:none'></span>" +
                	"<span id='downloadErrorMsg" + PUIDindex + "' style='font-size:15px;color:red;font-weight:bold;'></span>" +
						"<span id='downloadCancelFlag" + PUIDindex + "' style='display:none'></span>" +
                   	"<br><span id='uploadArea" + PUIDindex + "' >" +
                      	"&emsp;&emsp;Upload file to SD card partition:&emsp;" +
                      	"<button onclick='chooseUploadFile(" + PUIDindex + ")' id='uploadBtn" + PUIDindex + "'/>Choose File</button>" +
                      	"<span id='uploadFileName" + PUIDindex + "' style='font-size:13px'></span>" +
                      	//"<span id='uploadFileStart" + PUIDindex + "' style='display:none'>0</span>" +
                      	//"<span id='uploadOffset" + PUIDindex + "' style='display:none'>0</span>" +
                      	"<span id='uploadProgArea" + PUIDindex + "' style='visibility:"+ flag_UploadInProgress + "'>" +
	                      	"<div id='uploadProgOut" + PUIDindex + "' class='progress' style='width:300px;display:inline-block;position:relative;top:25px;left:90px;'>" +
	    								"<div id='uploadProg" + PUIDindex + "' class='progress-bar progress-bar-striped active'  style='width:0%'>Uploading...</div>" +
	    							"</div>" +
	    							"&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<button id='cancelUpload" + PUIDindex + "' onclick='CancelUploadTask(" + PUIDindex + ")'>Cancel</button>" +
	    						"</span>" +
                   	"</span>" +
                	//"</p>" +
                	//"<p>" +
                   	"<br><span id='downloadArea" + PUIDindex + "' >" +
                      	"&emsp;&emsp;Download file from SD card partition:&emsp;" +
                      	"<button onclick='chooseDownloadFile(" + PUIDindex + ")'>Download</button>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;" +
                      	//"<span id='downloadOffset" + PUIDindex + "' style='display:none'>0</span>" +
                      	"<span id='downloadProgArea" + PUIDindex + "' style='visibility:"+ flag_DownloadInProgress + "'>" +
	                      	"<div id='downloadProgOut" + PUIDindex + "' class='progress' style='width:300px;display:inline-block;position:relative;top:25px;'>" +
	    								"<div id='downloadProg" + PUIDindex + "' class='progress-bar progress-bar-striped active'  style='width:0%'>Downloading...</div>" +
	    							"</div>" +
	    							"&emsp;&emsp;<button id='cancelDownload" + PUIDindex + "' onclick='CancelDownloadTask(" + PUIDindex + ")'>Cancel</button>" +
	    						"</span>" +
                      	"&emsp;&emsp;&emsp;&emsp;&emsp;<a id='downloadLink" + PUIDindex + "' style='display:none' href='#'>badurl</a>" +
                      	"<br>" +
                   	"</span><br>" +
                	//"</p>" +
                	"<div class='PartitionInfoBorder'>" +
   	               "<br>&emsp;&nbsp;Partition Information:&emsp;" + "<span id='SetPartError" + PUIDindex + "' style='font-size:14px;color:red;font-weight:bold;'></span>" + "<span id='updateReminder" + PUIDindex + "' style='font-size:14px;color:orange;font-weight:bold;display:none;'>Click update to make change!</span>" +
                   	"<p style='line-height:200%'>&emsp;&nbsp;" +
                      	"<font size='3' color='#F3F3FA'>" +
                         	"Partition Name:&nbsp;<input type='text' id='PartitionName" + PUIDindex + "' name='PartitionName' size='60' maxlength='64' value='" + partition_name + "' oninput='checkPartNameChange(" + PUIDindex + ")'>" +
                         	"<span id='OriPartName" + PUIDindex + "' style='display:none'>" + partition_name + "</span>" +
                         	"&nbsp;<span id='setPartNameErrorMsg" + PUIDindex +"' style='font-size:14px;color:red;font-weight:bold;display:none;'>Empty name is NOT allowed!</span>" +
                         	"<br>&emsp;&nbsp;User Comment:&nbsp;<input type='text' id='UserComment" + PUIDindex + "' name='UserComment' size='60' maxlength='64' value='" + partition_desc + "' oninput='checkUserCmtChange(" + PUIDindex + ")'>" +
                         	"<span id='OriUserCmt" + PUIDindex + "' style='display:none'>" + partition_desc + "</span>" +
                         	"<br>&emsp;&nbsp;PSP can mount:&emsp;" +
                         	"<span class='mounttoggle'>" +
                            	"<input type='checkbox' onchange='checkPSPCanMountChange(" + PUIDindex + ")' id='PSPCanMount" + PUIDindex + "'" + flag_PSPCanMount + ">" +
                            	"<label for='PSPCanMount" + PUIDindex + "'><b></b></label>" +
                         	"</span>&emsp;&emsp;&emsp;" +
                         	"Host can mount:&emsp;" +
                         	"<span class='mounttoggle'>" +
                            	"<input type='checkbox' onchange='checkHostCanMountChange(" + PUIDindex + ")' id='HostCanMount" + PUIDindex + "'" + flag_HostCanMount + ">" +
                            	"<label for='HostCanMount" + PUIDindex + "'><b></b></label>" +
                         	"</span>" +
                         	"<br>&emsp;&nbsp;Software write protected:&emsp;" +
                         	"<span class='mounttoggle'>" +
                            	"<input type='checkbox' onchange='checkSWWrtProtectedChange(" + PUIDindex + ")' id='SWWriteProtected" + PUIDindex + "'" + flag_SwWriteProtected + ">" +
                            	"<label for='SWWriteProtected" + PUIDindex + "'><b></b></label>" +
                         	"</span>" +
                         	"<br>&emsp;&nbsp;Media Type:&emsp;" +
                         	"<select onchange='checkMediaTypeChange(" + PUIDindex + ")' id='MediaType" + PUIDindex + "'>" +
                            	"<option value='HDD' " + MediaType_HDD + ">HDD</option>" +
                            	"<option value='Optical' " + MediaType_Optical + ">Optical</option>" +
                            	"<option value='Floppy' " + MediaType_Floppy + ">Floppy</option>" +
                         	"</select>" +
                         	"&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;Claim Type:&emsp;" +
                         	"<select onchange='checkClaimTypeChange(" + PUIDindex + ")' id='ClaimType" + PUIDindex + "'>" +
                            	"<option value='Unclaimed' " + ClaimType_Unclaimed + ">Unclaimed</option>" +
                            	"<option value='Host' " + ClaimType_Host + ">Host</option>" +
                            	"<option value='PSP' " + ClaimType_PSP + ">PSP</option>" +
                         	"</select>" +
                      	"</font>" +
                      	"<button id='update" + PUIDindex + "' class='ButtonUpdate' style='float:right;' onclick='partUpdate(" + PUIDindex + ")' disabled>&emsp;Update&emsp;</button>" +
                      	"<button id='rstPartOp" + PUIDindex + "' class='BtnResetPartOp' style='float:right;display:none;' onclick='ResetPartOp(" + PUIDindex + ")'>&emsp;Reset&emsp;</button>"+
                   	"</p>" +
                	"</div>" +
                	"<p>" +
                   	"&emsp;&emsp;Partition Usage: &emsp;" +
                   	"<span id='partUsed" + PUIDindex + "'>" + partition_used + "</span>" +
                   	"<span id='partUsedUnit" + PUIDindex + "'>" + partition_used_unit + "</span>&nbsp;&nbsp;of &nbsp;" +
                   	"<span id='partTotalSize" + PUIDindex + "'>" + partition_size + "</span>" +
                   	"&nbsp;<span id='partTotalSizeUnit" + PUIDindex + "'>" + partition_size_unit + "</span>" +
                   	"<div id='progressOuter" + PUIDindex + "' class='progressOuter' style='position: relative; left: 107px;' >" +
                      	"<div id='progressInner" + PUIDindex + "' class='progressInner' style='width: " + partition_used_percentage + "%; background-color: " + usage_bar_color + ";' >" +
                         	"<span id='UsagePercent" + PUIDindex + "' class='ShiftLeft68' ><font size='4' color='" + usage_font_color + "'>" + partition_used_percentage.toFixed(2) + "%</font></span>" +
                      	"</div>" +
                   	"</div>" +
                	"</p>" +
                	"&emsp;&emsp;Mounted:&emsp;" + flag_mounted +
                	"<br><br>&emsp;&emsp;Activity:&emsp;" +
                	"<span id='IdActivity" + PUIDindex + "'style='background-color:#444444'>" +
                   	"<span>&emsp;Idle&emsp;</span>|<span id='actOptionDelete" + PUIDindex + "' class='activityOption' onclick='showConfirmDelete(" + PUIDindex + ")'>&emsp;Delete&emsp;</span>" +
                   	"|<span id='actOptionFormat" + PUIDindex + "' class='activityOption' onclick='showConfirmFormat(" + PUIDindex + ")'>&emsp;Format&emsp;</span>" +
                   	"|<span id='actOptionRebuild" + PUIDindex + "' class='activityOption' onclick='showConfirmRebuild(" + PUIDindex + ")'>&emsp;Rebuild&emsp;</span>" +
                   	"|<span id='actOptionResize" + PUIDindex + "' class='activityOption' onclick='showConfirmResize(" + PUIDindex + ")'>&emsp;Resize&emsp;</span>" +
                   	"|<span id='actOptionVerify" + PUIDindex + "' class='activityOption' onclick='showConfirmVerify(" + PUIDindex + ")'>&emsp;Verify&emsp;</span>" +
                   	"|<span id='actOptionShareUnshare" + PUIDindex + "' class='activityOption' onclick='showConfirm" + Option_share_unshare + "(" + PUIDindex + ")'>" + Option_share_unshare_html + "</span>" +
                   	//"|<span class='activityOption' onclick='showConfirmSplit(" + PUIDindex + ")'>&emsp;Split&emsp;</span>" +
                   	//"|<span class='activityOption' onclick='showConfirmJoin(" + PUIDindex + ")'>&emsp;Join&emsp;</span>" +
                   	//"|<span class='activityOption' onclick='JBODShowConfirmR1(" + PUIDindex + ")'>&emsp;To R1:Mirror&emsp;</span>" +
                	"</span><br>" +
                	"<img id='arrow" + PUIDindex + "' class='dragArrowJBOD' src='image/up_arrow.png' style='position:relative;right:-135px;'></img>" +
                	"<img id='IdArrow" + PUIDindex + "' src='image/up_arrow.png' class='cArrowUp' style='display:none'></img>" +
                	"<div id='divider" + PUIDindex + "' class='cDividerJBOD'></div>" +
                	"<span id='confirmDeleteArea" + PUIDindex + "' class='confirmArea' style='display:none'>" +
                   	"<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Are you sure to delete this partition?&emsp;&emsp;" +
                   	"<button class='ButtonGreen' onclick='confirmDelete(" + PUIDindex + ");sendDeletePartition(" + PUIDindex + ");'>Yes</button>&nbsp;" +
                   	"<button class='ButtonGreen' onclick='hideConfirmDelete(" + PUIDindex + ")'>Cancel</button>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<br>" +
                	"</span>" +
                	"<span id='confirmFormatArea" + PUIDindex + "' class='confirmArea' style='display:none'>" +
                   	"<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Select File System Type:&emsp;" +
                   	"<select id='formatType" + PUIDindex + "' >" +
                   		"<option value='RAW'>RAW</option>" +
                   		"<option value='FAT16'>FAT16</option>" +
                   		"<option value='FAT32'>FAT32</option>" +
                   		"<option value='EXT2'>EXT2</option>" +
                   	"</select>&emsp;" +
                   	"<button id='BtnFormatConfirm" + PUIDindex + "' class='ButtonGreen' onclick='confirmFormat(" + PUIDindex + ");sendFormatPartition(" + PUIDindex + ")'>Confirm</button>&nbsp;" +
                   	"<button class='ButtonGreen' onclick='hideConfirmFormat(" + PUIDindex + ")'>Cancel</button>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<br>" +
                	"</span>" +
                	"<span id='confirmRebuildArea" + PUIDindex + "' class='confirmArea' style='display:none'>" +
                   	"<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Are you sure to rebuild this partition?&emsp;&emsp;" +
                   	"<button class='ButtonGreen' onclick='confirmRebuild(" + PUIDindex + ");sendRebuildPartition(" + PUIDindex + ");'>Yes</button>&nbsp;" +
                   	"<button class='ButtonGreen' onclick='hideConfirmRebuild(" + PUIDindex + ")'>Cancel</button>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<br>" +
                	"</span>" +
                	"<span id='confirmResizeArea" + PUIDindex + "' class='confirmArea' style='display:none'>" +
                   	"<br>&emsp;&emsp;&emsp;&emsp;&emsp;Input new size of this partition:&nbsp;" +
                   	"<input id='resizeSize" + PUIDindex + "' type='number' min='" + partition_size + "' value='" + partition_size + "' oninput='validateResizeSize(" + PUIDindex + ")'>&nbsp;" +
                   	"<select id='resizeUnit" + PUIDindex + "' onchange='validateResizeSize(" + PUIDindex + ")'>" +
                   		"<option value='B' " + resizeDefaultB + ">B</option>" +
                   		"<option value='KB' " + resizeDefaultKB + ">KB</option>" +
                   		"<option value='MB' " + resizeDefaultMB + ">MB</option>" +
                   		"<option value='GB' " + resizeDefaultGB + ">GB</option>" +
                   	"</select>&emsp;" +
                   	"<button id='BtnResize" + PUIDindex + "' class='ButtonGreen' onclick='confirmResize(" + PUIDindex + ");sendResizePartition(" + PUIDindex + ");' disabled>Confirm</button>&nbsp;" +
                   	"<button class='ButtonGreen' onclick='hideConfirmResize(" + PUIDindex + ")'>Cancel</button>&emsp;&emsp;&emsp;&emsp;&emsp;<br>" +
                	"</span>" +
                	"<span id='confirmVerifyArea" + PUIDindex + "' class='confirmArea' style='display:none'>" +
                		"<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Are you sure to verify this partition?&emsp;&emsp;" +
                		"<button class='ButtonGreen' onclick='confirmVerify(" + PUIDindex + ");sendVerifyPartition(" + PUIDindex + ")'>Yes</button>&nbsp;" +
                   	"<button class='ButtonGreen' onclick='hideConfirmVerify(" + PUIDindex + ")'>Cancel</button>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<br>" +
                	"</span>" +
                	"<span id='confirmShareArea" + PUIDindex + "' class='confirmArea' style='display:none'>" +
	                	"<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Share To:&nbsp;" +
	                	"<select id='shareOpPSPShare" + PUIDindex + "'>" +
	                		"<option value='Host'>Host</option>" +
	                		"<option value='PSP'>PSP</option>" +
	                	"</select>&emsp;&emsp;&emsp;&emsp;" +
	                	"Writable:&nbsp;" +
	                	"<select id='shareOpWritable" + PUIDindex + "'>" +
	                		"<option value='On'>On</option>" +
	                		"<option value='Off'>Off</option>" +
	                	"</select>" +
	                	"&emsp;&emsp;&emsp;&emsp;<button class='ButtonGreen' onclick='confirmShare(" + PUIDindex + ");sendSharePartition(" + PUIDindex + ");'>Confirm</button>&nbsp;"+
	                	"<button class='ButtonGreen' onclick='hideConfirmShare(" + PUIDindex + ")'>Cancel</button>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;" +
	               "</span>" +
	               "<span id='confirmUnshareArea" + PUIDindex + "' class='confirmArea' style='display:none'>" +
	               	"<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Are you sure to unshare this partition?&emsp;&emsp;" +
	               	"&emsp;&emsp;&emsp;<button class='ButtonGreen' onclick='confirmUnshare(" + PUIDindex + ");sendUnsharePartition(" + PUIDindex + ");'>Confirm</button>" +
	               	"&nbsp;<button class='ButtonGreen' onclick='hideConfirmUnshare(" + PUIDindex + ")' >Cancel</button>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;" +
	               "</span>" +
                	"<span id='confirmSplitArea" + PUIDindex + "' class='confirmArea' style='display:none'>" +
                   	"<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Are you sure to split this partition?&emsp;&emsp;" +
                   	"<button class='ButtonGreen' onclick='confirmSplit(" + PUIDindex + ")'>Yes</button>&nbsp;" +
                   	"<button class='ButtonGreen' onclick='hideConfirmSplit(" + PUIDindex + ")'>Cancel</button>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<br>" +
                	"</span>" +
                	"<span id='confirmJoinArea" + PUIDindex + "' class='confirmArea' style='display:none'>" +
                   	"<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Are you sure to join this partition?&emsp;&emsp;" +
                   	"<button class='ButtonGreen' onclick='confirmJoin(" + PUIDindex + ")'>Yes</button>&nbsp;" +
                   	"<button class='ButtonGreen' onclick='hideConfirmJoin(" + PUIDindex + ")'>Cancel</button>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<br>" +
                	"</span>" +
                	"<span id='confirmR1Area" + PUIDindex + "' class='confirmArea' style='display:none'>" +
                   	"<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Are you sure to convert this partition to R1?&emsp;&emsp;" +
                   	"<button class='ButtonGreen' onclick='confirmR1(" + PUIDindex + ");sendConvertPartitionType(" + PUIDindex + "," + CONVERT_PART_TYPE_MIRROR + ");'>Yes</button>&nbsp;" +
                   	"<button class='ButtonGreen' onclick='hideConfirmR1(" + PUIDindex + ")'>Cancel</button>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<br>" +
                	"</span>" +
                	"<span id='partProgArea" + PUIDindex + "' style='display:" + partProgressBarDisplay + ";'><br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;" +
                		"<div id='partProgOut" + PUIDindex + "' class='progress' style='width:525px;display:inline-block;'>" +
 								"<div id='partProg" + PUIDindex + "' class='progress-bar progress-bar-striped active' style='width:0%'></div>" +
 							"</div>" +
 							"&emsp;&emsp;<button onclick='sendCancelPartQueuedTask(" + PUIDindex + ")' class='ButtonGreen' style='position:relative;top:-25px;'>Cancel</button>" +
                	"</span>" +
                	"<span id='partProgCmd" + PUIDindex + "' style='display:none'></span>" +
                	"<p style='line-height:150%;'>" +
                   	"&emsp;&emsp;Partition Type:&emsp;<span id='partType" + PUIDindex + "'>" + partition_type + "</span>" +
                   	"<br>&emsp;&emsp;Partition Format:&emsp;<span id='initFormat" + PUIDindex + "'>" + partition_format + "</span>" +
                   	"&emsp;<span id='partSize" + PUIDindex + "' style='display:none'>"+ partitionData[j].qwSizeInBytes + "</span>" +
                   	"&emsp;<span id='partImageSize" + PUIDindex + "' style='display:none'>" + partitionData[j].qwImageSizeInBytes + "</span>" +
                   	"<br>&emsp;&emsp;Partition PUID:&emsp;<span id='PUIDstateStr" + PUIDindex + "'>" + partition_PUID + "</span>" +
                   	"&emsp;<span id='offsetIntoCard" + PUIDindex + "' style=''>" + partitionData[j].dwSectorOffSetIntoCard + "</span>" +
                	"</p>" +
                	"&emsp;&emsp;<span id='partActError" + PUIDindex + "' style='font-size:16px;color:red;font-weight:bold;'></span>" +
             	"</div>" +
          	"</div>" +
       	"</font>";
    	} else {
    		//Undefined type
    		console.log("Undefined  type!");
    	}


	}
}


//set parameters when drag stops and during dragging
function setDragArrowJBOD() {
  	$(".dragArrowJBOD").draggable({
		opacity: 0.35,          // opacity of the element while it's dragged
		stack: $(".dragArrowJBOD"),       // brings the item to front
		axis: 'x',               // allow dragging only on the horizontal axis
		containment:[200,0,795,0],
		cursor: "e-resize",
		revert: true,
		revertDuration: 0.00001,
		stop: function(event,ui) {
	      var PUIDindex = $(this).attr('id').substring(5);
	      var pos = ui.position.left;

	      if (pos>170 && pos<260) {
	      	//delete area

				ArrowPosition(ACT_DELETE, PUIDindex);
				showConfirmDelete(PUIDindex);
				$('#arrow'+PUIDindex).hide(0.00001);
	      } else if (pos>260 && pos<355) {
	      	//format area

				ArrowPosition(ACT_FORMAT, PUIDindex);
				showConfirmFormat(PUIDindex);
				$('#arrow'+PUIDindex).hide(0.00001);
	      } else if (pos>355 && pos<455) {
	      	//rebuild area

				ArrowPosition(ACT_REBUILD, PUIDindex);
				showConfirmRebuild(PUIDindex);
				$('#arrow'+PUIDindex).hide(0.00001);
			} else if (pos>455 && pos<545) {
				//resize area

				ArrowPosition(ACT_RESIZE, PUIDindex);
				showConfirmResize(PUIDindex);
				$('#arrow'+PUIDindex).hide(0.00001);
	      } else if (pos>545 && pos<630) {
	      	//verify area

				ArrowPosition(ACT_VERIFY, PUIDindex);
				showConfirmVerify(PUIDindex);
				$('#arrow'+PUIDindex).hide(0.00001);
	      } else if (pos>630 && pos<710) {
	      	//share area

				ArrowPosition(ACT_SHARE, PUIDindex);
				showConfirmShare(PUIDindex);
				$('#arrow'+PUIDindex).hide();
			} else if (pos>710 && pos<788) {
	      	//Split area

				ArrowPosition(ACT_SPLIT, PUIDindex);
				showConfirmSplit(PUIDindex);
				$('#arrow'+PUIDindex).hide();
			} else if (pos>788 && pos<855) {
	      	//join area

				ArrowPosition(ACT_JOIN, PUIDindex);
				showConfirmJoin(PUIDindex);
				$('#arrow'+PUIDindex).hide();
	      } else if (pos>855 && pos<1000) {
	      	//r1 area

				ArrowPosition(ACT_JBOD2R1, PUIDindex);
				JBODShowConfirmR1(PUIDindex);
				$('#arrow'+PUIDindex).hide();
	      } else {
				//other area
				ArrowPosition(ACT_IDLE, PUIDindex);
	      }
		}
	});
}

function setDragArrowMirror() {
  	$(".dragArrowMirror").draggable({
		opacity: 0.35,          // opacity of the element while it's dragged
		stack: $(".dragArrowMirror"),       // brings the item to front
		axis: 'x',               // allow dragging only on the horizontal axis
		containment:[200,0,795,0],
		cursor: "e-resize",
		revert: true,
		revertDuration: 0.00001,
		stop: function(event,ui) {
	      var PUIDindex = $(this).attr('id').substring(5);
	      var pos = ui.position.left;

	      if (pos>170 && pos<260) {
	      	//delete area

				ArrowPosition(ACT_DELETE, PUIDindex);
				showConfirmDelete(PUIDindex);
				$('#arrow'+PUIDindex).hide(0.00001);
	      } else if (pos>260 && pos<355) {
	      	//format area

				ArrowPosition(ACT_FORMAT, PUIDindex);
				showConfirmFormat(PUIDindex);
				$('#arrow'+PUIDindex).hide(0.00001);
	      } else if (pos>355 && pos<455) {
	      	//rebuild area

				ArrowPosition(ACT_REBUILD, PUIDindex);
				showConfirmRebuild(PUIDindex);
				$('#arrow'+PUIDindex).hide(0.00001);
			} else if (pos>455 && pos<545) {
				//resize area

				ArrowPosition(ACT_RESIZE, PUIDindex);
				showConfirmResize(PUIDindex);
				$('#arrow'+PUIDindex).hide(0.00001);
	      } else if (pos>545 && pos<630) {
	      	//verify area

				ArrowPosition(ACT_VERIFY, PUIDindex);
				showConfirmVerify(PUIDindex);
				$('#arrow'+PUIDindex).hide(0.00001);
	      } else if (pos>630 && pos<710) {
	      	//share area

				ArrowPosition(ACT_SHARE, PUIDindex);
				showConfirmShare(PUIDindex);
				$('#arrow'+PUIDindex).hide(0.00001);
	      } else if (pos>710 && pos<730) {
	      	//split area

				ArrowPosition(ACT_SPLIT, PUIDindex);
				showConfirmSplit(PUIDindex);
				$('#arrow'+PUIDindex).hide(0.00001);
	      } else if (pos>730 && pos<750) {
	      	//join area

				ArrowPosition(ACT_JOIN, PUIDindex);
				showConfirmJoin(PUIDindex);
				$('#arrow'+PUIDindex).hide();
	      } else if (pos>750 && pos<810) {
	      	//jbod area

				ArrowPosition(ACT_MIRROR2JBOD, PUIDindex);
				MirrorShowConfirmJBOD(PUIDindex);
				$('#arrow'+PUIDindex).hide();
	      } else {
				//other area
				ArrowPosition(ACT_IDLE, PUIDindex);
	      }
		}
	});
}


function setDragArrowStripe() {
  	$(".dragArrowStripe").draggable({
		opacity: 0.35,          // opacity of the element while it's dragged
		stack: $(".dragArrowStripe"),       // brings the item to front
		axis: 'x',               // allow dragging only on the horizontal axis
		containment:[200,0,877,0],
		cursor: "e-resize",
		revert: true,
		revertDuration: 0.00001,
		stop: function(event,ui) {
	      var PUIDindex = $(this).attr('id').substring(5);
	      var pos = ui.position.left;

	      if (pos>170 && pos<255) {
	      	//delete area

				ArrowPosition(ACT_DELETE, PUIDindex);
				showConfirmDelete(PUIDindex);
				$('#arrow'+PUIDindex).hide(0.00001);
	      } else if (pos>260 && pos<360) {
	      	//format area

				ArrowPosition(ACT_FORMAT, PUIDindex);
				showConfirmFormat(PUIDindex);
				$('#arrow'+PUIDindex).hide(0.00001);
	      } else if (pos>362 && pos<458) {
	      	//rebuild area

				ArrowPosition(ACT_REBUILD, PUIDindex);
				showConfirmRebuild(PUIDindex);
				$('#arrow'+PUIDindex).hide(0.00001);
			} else if (pos>460 && pos<560) {
				//resize area

				ArrowPosition(ACT_RESIZE, PUIDindex);
				showConfirmResize(PUIDindex);
				$('#arrow'+PUIDindex).hide(0.00001);
	      } else if (pos>560 && pos<670) {
	      	//jbod area

				ArrowPosition(ACT_STRIPE2JBOD,PUIDindex);
				StripeShowConfirmJBOD(PUIDindex);
				$('#arrow'+PUIDindex).hide(0.00001);
	      } else if (pos>670 && pos<800) {
	      	//r1 area

				ArrowPosition(ACT_STRIPE2R1, PUIDindex);
				StripeShowConfirmR1(PUIDindex);
				$('#arrow'+PUIDindex).hide();
	      } else {
				//other area
				ArrowPosition(ACT_IDLE, PUIDindex);
	      }
		}
	});
}



//If resize size is smaller than original size, disable "confirm" button
function validateResizeSize(PUIDindex) {
	// all size in byte unit
	var resizeSize = document.getElementById("resizeSize"+PUIDindex).value;
	if (document.getElementById("resizeUnit"+PUIDindex).selectedIndex == 0) {
		//unit byte
	} else if (document.getElementById("resizeUnit"+PUIDindex).selectedIndex == 1) {
		//unit KB
		resizeSize *= Math.pow(2,10);
	} else if (document.getElementById("resizeUnit"+PUIDindex).selectedIndex == 2) {
		//unit MB
		resizeSize *= Math.pow(2,20);
	} else if (document.getElementById("resizeUnit"+PUIDindex).selectedIndex == 3) {
		//unit GB
		resizeSize *= Math.pow(2,30);
	} else {
		//size unit is not recognized
		console.log("Unrecognized resize Size!");
	}

	var partSize = parseInt($("#partTotalSize"+PUIDindex).html());
	if ($("#partTotalSizeUnit"+PUIDindex).html() == "KB") {
		partSize *= Math.pow(2,10);
	} else if ($("#partTotalSizeUnit"+PUIDindex).html() == "MB") {
		partSize *= Math.pow(2,20);
	} else if ($("#partTotalSizeUnit"+PUIDindex).html() == "GB") {
		partSize *= Math.pow(2,30);
	} else if ($("#partTotalSizeUnit"+PUIDindex).html() == "B") {
		//unit byte
	} else {
		//unknown unit
		console.log("Unknown unit for resize size!");
	}

//**********************************************************************************add check here for no larger than possible size*****************************
//**************************************************************************************************************************************************************
	if (resizeSize <= partSize) {
		//resize size is less than original size
		$("#BtnResize"+PUIDindex).prop("disabled", true);

	} else {

		$("#BtnResize"+PUIDindex).prop("disabled", false);
	}
}

//validate new partition name and check size, then try to enable CreatePartition button
function validateNewPartName(cardchar) {
	var volumeName = $("#NewPartName"+cardchar).val();

	if ( volumeName == null || volumeName.trim() === "" ) {
		//invalid partition name
		$("#volumeNameErrorMsg" + cardchar).fadeIn();
		$("#BtnCreatePartition" + cardchar).prop("disabled", true);
	} else {
		//valid partition name
		$("#volumeNameErrorMsg" + cardchar).fadeOut();

		if (isNewSizeValid(cardchar)) {
			//valid partition size
			$("#BtnCreatePartition" + cardchar).prop("disabled", false);
		} else {
			//invalid partition size
			$("#BtnCreatePartition" + cardchar).prop("disabled", true);
		}
	}
}

//check new partition name valid or not
function isNewPartNameValid(cardchar) {
	var volumeName = $("#NewPartName"+cardchar).val();
	if ( volumeName == null || volumeName.trim() === "" ) {
		return false;
	} else {
		return true;
	}
}

//validate new partition name and check size, then try to enable CreatePartition button
function validateNewPartSize(cardchar) {
	var sizeUnit = $("#selectKBMBGB"+cardchar).val();
	var goalSpace = $("#PartitionSize"+cardchar).val();

	var availableSpace = parseInt($("#possibleJBOD"+cardchar).html().trim());

	// compare all with unit "Byte"
	if ($("#possibleJBOD"+cardchar+"Unit").html().substring(6) == "GB") {
		availableSpace *= Math.pow(2,30);
	} else if ($("#possibleJBOD"+cardchar+"Unit").html().substring(6) == "MB") {
		availableSpace *= Math.pow(2,20);
	} else if ($("#possibleJBOD"+cardchar+"Unit").html().substring(6) == "KB") {
		availableSpace *= Math.pow(2,10);
	} else {
		availableSpace *= 1;
	}

	if (goalSpace === "") {
		goalSpace = -1;
	} else if (sizeUnit === "GB") {
		goalSpace *= Math.pow(2,30);
	} else if (sizeUnit === "MB") {
		goalSpace *= Math.pow(2,20);
	} else {
		goalSpace *= Math.pow(2,10);
	}

	//console.log("goalSpace:"+goalSpace);
	if (goalSpace <= 0) {
		//invalid partition size
		$("#volumeSizeErrorMsg" + cardchar).html("Invalid number!!!");
		$("#volumeSizeErrorMsg" + cardchar).fadeIn();
		$("#BtnCreatePartition" + cardchar).prop("disabled", true);

	} else if (goalSpace > availableSpace) {
		//invalid partition size
		$("#volumeSizeErrorMsg" + cardchar).html("No enough space!!!");
		$("#volumeSizeErrorMsg" + cardchar).fadeIn();
		$("#BtnCreatePartition" + cardchar).prop("disabled", true);

	} else {
		//valid partition size
		$("#volumeSizeErrorMsg" + cardchar).fadeOut();

		if (isNewPartNameValid(cardchar)) {
			//valid partition name
			$("#BtnCreatePartition" + cardchar).prop("disabled", false);

		} else {
			//invalid partition name
			$("#BtnCreatePartition" + cardchar).prop("disabled", true);
		}
	}
}

//check new partition size valid or not
function isNewSizeValid(cardchar) {
	var sizeUnit = $("#selectKBMBGB"+cardchar).val();
	var goalSpace = $("#PartitionSize"+cardchar).val();

	var availableSpace = parseInt($("#possibleJBOD"+cardchar).html().trim());

	// compare all with unit "Byte"
	if ($("#possibleJBOD"+cardchar+"Unit").html().substring(6) == "GB") {
		availableSpace *= Math.pow(2,30);
	} else if ($("#possibleJBOD"+cardchar+"Unit").html().substring(6) == "MB") {
		availableSpace *= Math.pow(2,20);
	} else if ($("#possibleJBOD"+cardchar+"Unit").html().substring(6) == "KB") {
		availableSpace *= Math.pow(2,10);
	} else {
		availableSpace *= 1;
	}

	if (goalSpace === "") {
		goalSpace = -1;
	} else if (sizeUnit === "GB") {
		goalSpace *= Math.pow(2,30);
	} else if (sizeUnit === "MB") {
		goalSpace *= Math.pow(2,20);
	} else {
		goalSpace *= Math.pow(2,10);
	}


	if (goalSpace < 0) {
		//console.log("goalSpace < 0");
		return false;
	} else if (goalSpace > availableSpace) {
		//console.log("goalSpace > availableSpace");
		return false;
	} else {
		return true;
	}
}

//*********************************************functions to check change in set partition options******************************STARTS******************
//*****************************************************************************************************************************************************
//change on partition name causes trying to enable "update" button if there is actually any change in this part
function checkPartNameChange(PUIDindex) {
	var prevPartName = $("#OriPartName"+PUIDindex).html();
	var newPartName = $("#PartitionName"+PUIDindex).val();

	if (prevPartName == newPartName) {
		if (isUserCmtChanged(PUIDindex) || isPSPCanMountChanged(PUIDindex) || isHostCanMountChanged(PUIDindex) || isSWWrtProtectedChanged(PUIDindex) || isMediaTypeChanged(PUIDindex) || isClaimTypeChanged(PUIDindex)) {

			$("#update"+PUIDindex).prop("disabled", false);
			$("#rstPartOp"+PUIDindex).fadeIn();
			$("#updateReminder"+PUIDindex).fadeIn();
		} else {

			$("#update"+PUIDindex).prop("disabled", true);
			$("#rstPartOp"+PUIDindex).hide();
			$("#updateReminder"+PUIDindex).fadeOut();
		}
	} else {

		$("#rstPartOp"+PUIDindex).fadeIn();
		//if partition name is changed, validate new partition name
		if (newPartName == null || newPartName.trim() === "" ) {
			$("#setPartNameErrorMsg"+PUIDindex).fadeIn();

			$("#update"+PUIDindex).prop("disabled", true);
			$("#updateReminder"+PUIDindex).fadeOut();
		} else {
			$("#setPartNameErrorMsg"+PUIDindex).fadeOut();

			$("#update"+PUIDindex).prop("disabled", false);
			$("#updateReminder"+PUIDindex).fadeIn();
		}
	}
}
function isPartNameChanged(PUIDindex) {
	var prevPartName = $("#OriPartName"+PUIDindex).html();
	var newPartName = $("#PartitionName"+PUIDindex).val();

	if (prevPartName == newPartName) {
		return false;
	} else {
		return true;
	}
}

//change on user comment causes trying to enable "update" button if there is actually any change in this part
function checkUserCmtChange(PUIDindex) {
	var prevUserCmt = $("#OriUserCmt"+PUIDindex).html();
	var newUserCmt = $("#UserComment"+PUIDindex).val();

	if (prevUserCmt == newUserCmt) {
		if (isPartNameChanged(PUIDindex) || isPSPCanMountChanged(PUIDindex) || isHostCanMountChanged(PUIDindex) || isSWWrtProtectedChanged(PUIDindex) || isMediaTypeChanged(PUIDindex) || isClaimTypeChanged(PUIDindex)) {

			$("#update"+PUIDindex).prop("disabled", false);
			$("#rstPartOp"+PUIDindex).fadeIn();
			$("#updateReminder"+PUIDindex).fadeIn();

		} else {

			$("#update"+PUIDindex).prop("disabled", true);
			$("#rstPartOp"+PUIDindex).hide();
			$("#updateReminder"+PUIDindex).fadeOut();

		}
	} else {

		$("#update"+PUIDindex).prop("disabled", false);
		$("#rstPartOp"+PUIDindex).fadeIn();
		$("#updateReminder"+PUIDindex).fadeIn();

	}
}
function isUserCmtChanged(PUIDindex) {
	var prevUserCmt = $("#OriUserCmt"+PUIDindex).html();
	var newUserCmt = $("#UserComment"+PUIDindex).val();

	if (prevUserCmt == newUserCmt) {
		return false;
	} else {
		return true;
	}
}

//change on PSPCanMount causes trying to enable "update" button if there is actually any change in this part
function checkPSPCanMountChange(PUIDindex) {
	var prevStatus = (document.getElementById("PSPCanMount"+PUIDindex).defaultChecked) ? "OFF" : "ON";
	var newStatus = $("#PSPCanMount"+PUIDindex).is(":checked") ? "OFF" : "ON";

	if (prevStatus == newStatus) {
		if (isPartNameChanged(PUIDindex) || isUserCmtChanged(PUIDindex) || isHostCanMountChanged(PUIDindex) || isSWWrtProtectedChanged(PUIDindex) || isMediaTypeChanged(PUIDindex) || isClaimTypeChanged(PUIDindex)) {

			$("#update"+PUIDindex).prop("disabled", false);
			$("#rstPartOp"+PUIDindex).fadeIn();
			$("#updateReminder"+PUIDindex).fadeIn();

		} else {

			$("#update"+PUIDindex).prop("disabled", true);
			$("#rstPartOp"+PUIDindex).hide();
			$("#updateReminder"+PUIDindex).fadeOut();

		}
	} else {

		$("#update"+PUIDindex).prop("disabled", false);
		$("#rstPartOp"+PUIDindex).fadeIn();
		$("#updateReminder"+PUIDindex).fadeIn();
	}
}
function isPSPCanMountChanged(PUIDindex) {
	var prevStatus = (document.getElementById("PSPCanMount"+PUIDindex).defaultChecked) ? "OFF" : "ON";
	var newStatus = $("#PSPCanMount"+PUIDindex).is(":checked") ? "OFF" : "ON";

	if (prevStatus == newStatus) {
		return false;
	} else {
		return true;
	}
}

//change on HostCanMount causes trying to enable "update" button if there is actually any change in this part
function checkHostCanMountChange(PUIDindex) {
	var prevStatus = (document.getElementById("HostCanMount"+PUIDindex).defaultChecked) ? "OFF" : "ON";
	var newStatus = $("#HostCanMount"+PUIDindex).is(":checked") ? "OFF" : "ON";

	if (prevStatus == newStatus) {
		if (isPartNameChanged(PUIDindex) || isUserCmtChanged(PUIDindex) || isPSPCanMountChanged(PUIDindex) || isSWWrtProtectedChanged(PUIDindex) || isMediaTypeChanged(PUIDindex) || isClaimTypeChanged(PUIDindex)) {

			$("#update"+PUIDindex).prop("disabled", false);
			$("#rstPartOp"+PUIDindex).fadeIn();
			$("#updateReminder"+PUIDindex).fadeIn();

		} else {

			$("#update"+PUIDindex).prop("disabled", true);
			$("#rstPartOp"+PUIDindex).hide();
			$("#updateReminder"+PUIDindex).fadeOut();
		}
	} else {

		$("#update"+PUIDindex).prop("disabled", false);
		$("#rstPartOp"+PUIDindex).fadeIn();
		$("#updateReminder"+PUIDindex).fadeIn();
	}
}
function isHostCanMountChanged(PUIDindex) {
	var prevStatus = (document.getElementById("HostCanMount"+PUIDindex).defaultChecked) ? "OFF" : "ON";
	var newStatus = $("#HostCanMount"+PUIDindex).is(":checked") ? "OFF" : "ON";

	if (prevStatus == newStatus) {
		return false;
	} else {
		return true;
	}
}

//change on SW write protected causes trying to enable "update" button if there is actually any change in this part
function checkSWWrtProtectedChange(PUIDindex) {
	var prevStatus = (document.getElementById("SWWriteProtected"+PUIDindex).defaultChecked) ? "OFF" : "ON";
	var newStatus = $("#SWWriteProtected"+PUIDindex).is(":checked") ? "OFF" : "ON";

	if (prevStatus == newStatus) {
		if (isPartNameChanged(PUIDindex) || isUserCmtChanged(PUIDindex) || isPSPCanMountChanged(PUIDindex) || isHostCanMountChanged(PUIDindex) || isMediaTypeChanged(PUIDindex) || isClaimTypeChanged(PUIDindex)) {

			$("#update"+PUIDindex).prop("disabled", false);
			$("#rstPartOp"+PUIDindex).fadeIn();
			$("#updateReminder"+PUIDindex).fadeIn();
		} else {

			$("#update"+PUIDindex).prop("disabled", true);
			$("#rstPartOp"+PUIDindex).hide();
			$("#updateReminder"+PUIDindex).fadeOut();
		}
	} else {

		$("#update"+PUIDindex).prop("disabled", false);
		$("#rstPartOp"+PUIDindex).fadeIn();
		$("#updateReminder"+PUIDindex).fadeIn();
	}
}
function isSWWrtProtectedChanged(PUIDindex) {
	var prevStatus = (document.getElementById("SWWriteProtected"+PUIDindex).defaultChecked) ? "OFF" : "ON";
	var newStatus = $("#SWWriteProtected"+PUIDindex).is(":checked") ? "OFF" : "ON";

	if (prevStatus == newStatus) {
		return false;
	} else {
		return true;
	}
}

//change on Media type causes trying to enable "update" button if there is actually any change in this part
function checkMediaTypeChange(PUIDindex) {
	var newIndex = document.getElementById("MediaType"+PUIDindex).selectedIndex;

	if (document.getElementById("MediaType"+PUIDindex).options[newIndex].defaultSelected) {
		if (isPartNameChanged(PUIDindex) || isUserCmtChanged(PUIDindex) || isPSPCanMountChanged(PUIDindex) || isHostCanMountChanged(PUIDindex) || isSWWrtProtectedChanged(PUIDindex) || isClaimTypeChanged(PUIDindex)) {

			$("#update"+PUIDindex).prop("disabled", false);
			$("#rstPartOp"+PUIDindex).fadeIn();
			$("#updateReminder"+PUIDindex).fadeIn();
		} else {

			$("#update"+PUIDindex).prop("disabled", true);
			$("#rstPartOp"+PUIDindex).hide();
			$("#updateReminder"+PUIDindex).fadeOut();
		}
	} else {

		$("#update"+PUIDindex).prop("disabled", false);
		$("#rstPartOp"+PUIDindex).fadeIn();
		$("#updateReminder"+PUIDindex).fadeIn();
	}
}
function isMediaTypeChanged(PUIDindex) {
	var newIndex = document.getElementById("MediaType"+PUIDindex).selectedIndex;

	if (document.getElementById("MediaType"+PUIDindex).options[newIndex].defaultSelected) {
		return false;
	} else {
		return true;
	}
}

//change on Claim type causes trying to enable "update" button if there is actually any change in this part
function checkClaimTypeChange(PUIDindex) {
	var newIndex = document.getElementById("ClaimType"+PUIDindex).selectedIndex;

	if (document.getElementById("ClaimType"+PUIDindex).options[newIndex].defaultSelected) {
		if (isPartNameChanged(PUIDindex) || isUserCmtChanged(PUIDindex) || isPSPCanMountChanged(PUIDindex) || isHostCanMountChanged(PUIDindex) || isSWWrtProtectedChanged(PUIDindex) || isMediaTypeChanged(PUIDindex)) {

			$("#update"+PUIDindex).prop("disabled", false);
			$("#rstPartOp"+PUIDindex).fadeIn();
			$("#updateReminder"+PUIDindex).fadeIn();
		} else {

			$("#update"+PUIDindex).prop("disabled", true);
			$("#rstPartOp"+PUIDindex).hide();
			$("#updateReminder"+PUIDindex).fadeOut();
		}
	} else {

		$("#update"+PUIDindex).prop("disabled", false);
		$("#rstPartOp"+PUIDindex).fadeIn();
		$("#updateReminder"+PUIDindex).fadeIn();
	}
}
function isClaimTypeChanged(PUIDindex) {
	var newIndex = document.getElementById("ClaimType"+PUIDindex).selectedIndex;

	if (document.getElementById("ClaimType"+PUIDindex).options[newIndex].defaultSelected) {
		return false;
	} else {
		return true;
	}
}

//when click on Partition's "Update" button, send setPartitionOption or claim command or both
function partUpdate(PUIDindex){
	if (isPartNameChanged(PUIDindex) || isUserCmtChanged(PUIDindex) || isPSPCanMountChanged(PUIDindex) || isHostCanMountChanged(PUIDindex) || isSWWrtProtectedChanged(PUIDindex) || isMediaTypeChanged(PUIDindex)) {
		sendSetPartitionOp(PUIDindex);
	}

	if (isClaimTypeChanged(PUIDindex)) {
		sendClaimPartition(PUIDindex);
	}
}

function ResetPartOp(PUIDindex){
	//reset partition options and clear all related error message
	var originalName = $("#OriPartName"+PUIDindex).html();
	$("#PartitionName"+PUIDindex).val(originalName);
	$("#setPartNameErrorMsg"+PUIDindex).fadeOut();
	var originalComment = $("#OriUserCmt"+PUIDindex).html();
	$("#UserComment"+PUIDindex).val(originalComment);

	if (document.getElementById("PSPCanMount"+PUIDindex).defaultChecked) {
		$("#PSPCanMount"+PUIDindex).prop("checked", true);
	} else {
		$("#PSPCanMount"+PUIDindex).prop("checked", false);
	}

	if (document.getElementById("HostCanMount"+PUIDindex).defaultChecked) {
		$("#HostCanMount"+PUIDindex).prop("checked", true);
	} else {
		$("#HostCanMount"+PUIDindex).prop("checked", false);
	}

	if (document.getElementById("SWWriteProtected"+PUIDindex).defaultChecked) {
		$("#SWWriteProtected"+PUIDindex).prop("checked", true);
	} else {
		$("#SWWriteProtected"+PUIDindex).prop("checked", false);
	}

	if (document.getElementById("MediaType"+PUIDindex).options[0].defaultSelected) {
		document.getElementById("MediaType"+PUIDindex).selectedIndex = 0;
	} else if (document.getElementById("MediaType"+PUIDindex).options[1].defaultSelected) {
		document.getElementById("MediaType"+PUIDindex).selectedIndex = 1;
	} else if (document.getElementById("MediaType"+PUIDindex).options[2].defaultSelected) {
		document.getElementById("MediaType"+PUIDindex).selectedIndex = 2;
	}

	if (document.getElementById("ClaimType"+PUIDindex).options[0].defaultSelected) {
		document.getElementById("ClaimType"+PUIDindex).selectedIndex = 0;
	} else if (document.getElementById("ClaimType"+PUIDindex).options[1].defaultSelected) {
		document.getElementById("ClaimType"+PUIDindex).selectedIndex = 1;
	} else if (document.getElementById("ClaimType"+PUIDindex).options[2].defaultSelected) {
		document.getElementById("ClaimType"+PUIDindex).selectedIndex = 2;
	}

	$("#updateReminder"+PUIDindex).fadeOut();
	$("#rstPartOp"+PUIDindex).hide();
	$("#update"+PUIDindex).prop("disabled", true);
}

//*****************************************************************************************************************************************************
//*********************************************functions to check change in set partition options*********************ENDS*****************************



/*put activity indication arrow in correct position*/
function ArrowPosition( Index, PUIDindex ) {
  	switch(Index){
    	case ACT_IDLE:
	      //Idle
	      $("#IdArrow"+PUIDindex).animate({right: '-135px'});
	      $("#IdArrow"+PUIDindex).hide(1);
	      break;
    	case ACT_DELETE:
	      //Delete

	      $("#IdArrow"+PUIDindex).animate({right: '-215px'},0.001);
	      $("#IdArrow"+PUIDindex).show(0.001);
	      break;
    	case ACT_FORMAT:
	      //Format

	      $("#IdArrow"+PUIDindex).animate({right: '-310px'},0.001);
	      $("#IdArrow"+PUIDindex).show(0.001);
	      break;
    	case ACT_REBUILD:
	      //Rebuild

	      $("#IdArrow"+PUIDindex).animate({right: '-405px'},0.001);
	      $("#IdArrow"+PUIDindex).show(0.001);
      	break;
      case ACT_RESIZE:
	      //Resize

	      $("#IdArrow"+PUIDindex).animate({right: '-500px'},0.001);
	      $("#IdArrow"+PUIDindex).show(0.001);
      	break;
    	case ACT_SPLIT:
	      //Split

	      $("#IdArrow"+PUIDindex).animate({right: '-750px'},0.001);
	      $("#IdArrow"+PUIDindex).show(0.001);
	      break;
    	case ACT_JOIN:
	      //Join

	      $("#IdArrow"+PUIDindex).animate({right: '-820px'},0.001);
	      $("#IdArrow"+PUIDindex).show(0.001);
	      break;
    	case ACT_JBOD2R1:
	      //(Type:JBOD)R1

	      $("#IdArrow"+PUIDindex).animate({right: '-920px'},0.001);
	      $("#IdArrow"+PUIDindex).show(0.001);
	      break;
    	case ACT_MIRROR2JBOD:
	      //(Type:Mirror)JBOD

	      $("#IdArrow"+PUIDindex).animate({right: '-760px'},0.001);
	      $("#IdArrow"+PUIDindex).show(0.001);
	      break;
    	case ACT_STRIPE2JBOD:
	      //(Type:Stripe)JBOD

	      $("#IdArrow"+PUIDindex).animate({right: '-615px'},0.001);
	      $("#IdArrow"+PUIDindex).show(0.001);
	      break;
    	case ACT_STRIPE2R1:
	      //(Type:Stripe)R1

	      $("#IdArrow"+PUIDindex).animate({right: '-740px'},0.001);
	      $("#IdArrow"+PUIDindex).show(0.001);
	      break;
	   case ACT_VERIFY:
	   	//Verify

	   	$("#IdArrow"+PUIDindex).animate({right: '-585px'},0.001);
	      $("#IdArrow"+PUIDindex).show(0.001);
	   	break;
	   case ACT_SHARE:
	   	//share

	   	$("#IdArrow"+PUIDindex).animate({right: '-670px'},0.001);
	      $("#IdArrow"+PUIDindex).show(0.001);
	   	break;
	   case ACT_UNSHARE:
	   	//unshare

	   	$("#IdArrow"+PUIDindex).animate({right: '-670px'},0.001);
	      $("#IdArrow"+PUIDindex).show(0.001);
	   	break;
    	default:
    		console.log("Unknown partition activity!");
      	break;
  	}
}

/*functions handling click on "confirm yes" of activities*/
function confirmDelete(PUIDindex) {
	$("#confirmDeleteArea"+PUIDindex).hide(500);

	ArrowPosition(ACT_IDLE, PUIDindex);
	$('#arrow'+PUIDindex).fadeTo(1000,1);
}

function confirmFormat(PUIDindex) {
	$("#confirmFormatArea"+PUIDindex).hide();

	$("#partProgArea"+PUIDindex).fadeIn();

	//while formatting, disable all activity option
	$("#actOptionDelete"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionDelete"+PUIDindex).onclick = null;

	$("#actOptionFormat"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionFormat"+PUIDindex).onclick = null;

	$("#actOptionRebuild"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionRebuild"+PUIDindex).onclick = null;

	$("#actOptionResize"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionResize"+PUIDindex).onclick = null;

	$("#actOptionVerify"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionVerify"+PUIDindex).onclick = null;

	$("#actOptionShareUnshare"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionShareUnshare"+PUIDindex).onclick = null;

	//ArrowPosition(ACT_IDLE,PUIDindex);
	//$('#arrow'+PUIDindex).fadeTo(1000,1);
}

function confirmRebuild(PUIDindex) {
	$("#confirmRebuildArea"+PUIDindex).hide();

	$("#partProgArea"+PUIDindex).fadeIn();

	//while rebuilding, disable all activity option
	$("#actOptionDelete"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionDelete"+PUIDindex).onclick = null;

	$("#actOptionFormat"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionFormat"+PUIDindex).onclick = null;

	$("#actOptionRebuild"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionRebuild"+PUIDindex).onclick = null;

	$("#actOptionResize"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionResize"+PUIDindex).onclick = null;

	$("#actOptionVerify"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionVerify"+PUIDindex).onclick = null;

	$("#actOptionShareUnshare"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionShareUnshare"+PUIDindex).onclick = null;

	//ArrowPosition(ACT_IDLE, PUIDindex);
	//$('#arrow'+PUIDindex).fadeTo(1000,1);
}

function confirmResize(PUIDindex) {
	$("#confirmResizeArea"+PUIDindex).hide();

	$("#partProgArea"+PUIDindex).fadeIn();

	//while resizing, disable all activity option
	$("#actOptionDelete"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionDelete"+PUIDindex).onclick = null;

	$("#actOptionFormat"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionFormat"+PUIDindex).onclick = null;

	$("#actOptionRebuild"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionRebuild"+PUIDindex).onclick = null;

	$("#actOptionResize"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionResize"+PUIDindex).onclick = null;

	$("#actOptionVerify"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionVerify"+PUIDindex).onclick = null;

	$("#actOptionShareUnshare"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionShareUnshare"+PUIDindex).onclick = null;

	//ArrowPosition(ACT_IDLE, PUIDindex);
	//$('#arrow'+PUIDindex).fadeTo(1000,1);
}

function confirmVerify(PUIDindex) {
	$("#confirmVerifyArea"+PUIDindex).hide();

	$("#partProgArea"+PUIDindex).fadeIn();

	//while verifying, disable all activity option
	$("#actOptionDelete"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionDelete"+PUIDindex).onclick = null;

	$("#actOptionFormat"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionFormat"+PUIDindex).onclick = null;

	$("#actOptionRebuild"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionRebuild"+PUIDindex).onclick = null;

	$("#actOptionResize"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionResize"+PUIDindex).onclick = null;

	$("#actOptionVerify"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionVerify"+PUIDindex).onclick = null;

	$("#actOptionShareUnshare"+PUIDindex).removeClass("activityOption");
	document.getElementById("actOptionShareUnshare"+PUIDindex).onclick = null;

	//ArrowPosition(ACT_IDLE, PUIDindex);
	//$('#arrow'+PUIDindex).fadeTo(1000,1);
}

function confirmShare(PUIDindex) {
	$("#confirmShareArea"+PUIDindex).hide();

	ArrowPosition(ACT_IDLE, PUIDindex);
	$('#arrow'+PUIDindex).fadeTo(1000,1);
}

function confirmUnshare(PUIDindex) {
	$("#confirmUnshareArea"+PUIDindex).hide();

	ArrowPosition(ACT_IDLE, PUIDindex);
	$('#arrow'+PUIDindex).fadeTo(1000,1);
}

function confirmSplit(PUIDindex) {
	$("#confirmSplitArea"+PUIDindex).hide(500);

	ArrowPosition(ACT_IDLE, PUIDindex);
	$('#arrow'+PUIDindex).fadeTo(1000,1);
}

function confirmJoin(PUIDindex) {
	$("#confirmJoinArea"+PUIDindex).hide(500);

	ArrowPosition(ACT_IDLE, PUIDindex);
	$('#arrow'+PUIDindex).fadeTo(1000,1);
}

function confirmJBOD(PUIDindex) {
	$("#confirmJBODArea"+PUIDindex).hide();

	$("#partProgArea"+PUIDindex).fadeIn();

	ArrowPosition(ACT_IDLE, PUIDindex);
	$('#arrow'+PUIDindex).fadeTo(1000,1);
}

function confirmR1(PUIDindex) {
	$("#confirmR1Area"+PUIDindex).hide();

	$("#partProgArea"+PUIDindex).fadeIn();

	ArrowPosition(ACT_IDLE, PUIDindex);
	$('#arrow'+PUIDindex).fadeTo(1000,1);
}

/*click on activity form*/
function showConfirmDelete(PUIDindex) {
	$(".confirmArea").hide(500);
	$('#arrow'+PUIDindex).hide(0.001);
	ArrowPosition(ACT_DELETE, PUIDindex);
	$("#confirmDeleteArea"+PUIDindex).show(500);
}

function showConfirmFormat(PUIDindex) {
	$(".confirmArea").hide(500);
	$('#arrow'+PUIDindex).hide(0.001);
	ArrowPosition(ACT_FORMAT, PUIDindex);
	$("#confirmFormatArea"+PUIDindex).show(500);
}

function showConfirmRebuild(PUIDindex) {
	$(".confirmArea").hide(500);
	$('#arrow'+PUIDindex).hide(0.001);
	ArrowPosition(ACT_REBUILD, PUIDindex);
	$("#confirmRebuildArea"+PUIDindex).show(500);
}

function showConfirmResize(PUIDindex) {
	$(".confirmArea").hide(500);
	$('#arrow'+PUIDindex).hide(0.001);
	ArrowPosition(ACT_RESIZE, PUIDindex);
	$("#confirmResizeArea"+PUIDindex).show(500);
}

function showConfirmVerify(PUIDindex) {
	$(".confirmArea").hide(500);
	$('#arrow'+PUIDindex).hide(0.001);
	ArrowPosition(ACT_VERIFY, PUIDindex);
	$("#confirmVerifyArea"+PUIDindex).show(500);
}

function showConfirmShare(PUIDindex) {
	$(".confirmArea").hide(500);
	$('#arrow'+PUIDindex).hide(0.001);
	ArrowPosition(ACT_SHARE, PUIDindex); //need to be adjusted*************************************
	$("#confirmShareArea"+PUIDindex).show(500);
}

function showConfirmUnshare(PUIDindex) {
	$(".confirmArea").hide(500);
	$('#arrow'+PUIDindex).hide(0.001);
	ArrowPosition(ACT_UNSHARE, PUIDindex); //need to be adjusted*************************************
	$("#confirmUnshareArea"+PUIDindex).show(500);
}

function showConfirmSplit(PUIDindex) {
	$(".confirmArea").hide(500);
	$('#arrow'+PUIDindex).hide(0.001);
	ArrowPosition(ACT_SPLIT, PUIDindex);
	$("#confirmSplitArea"+PUIDindex).show(500);
}

function showConfirmJoin(PUIDindex) {
	$(".confirmArea").hide(500);
	$('#arrow'+PUIDindex).hide(0.001);
	ArrowPosition(ACT_JOIN, PUIDindex);
	$("#confirmJoinArea"+PUIDindex).show(500);
}

function JBODShowConfirmR1(PUIDindex) {
	$(".confirmArea").hide(500);
	$('#arrow'+PUIDindex).hide(0.001);
	ArrowPosition(ACT_JBOD2R1, PUIDindex);
	$("#confirmR1Area"+PUIDindex).show(500);
}

function MirrorShowConfirmJBOD(PUIDindex) {
	$(".confirmArea").hide(500);
	$('#arrow'+PUIDindex).hide(0.001);
	ArrowPosition(ACT_MIRROR2JBOD, PUIDindex);
	$("#confirmJBODArea"+PUIDindex).show(500);
}

function StripeShowConfirmJBOD(PUIDindex) {
	$(".confirmArea").hide(500);
	$('#arrow'+PUIDindex).hide(0.001);
	ArrowPosition(ACT_STRIPE2JBOD, PUIDindex);
	$("#confirmJBODArea"+PUIDindex).show(500);
}

function StripeShowConfirmR1(PUIDindex) {
	$(".confirmArea").hide(500);
	$('#arrow'+PUIDindex).hide(0.001);
	ArrowPosition(ACT_STRIPE2R1, PUIDindex);
	$("#confirmR1Area"+PUIDindex).show(500);
}

/*functions handling click on "confirm no" of activities*/
function hideConfirmDelete(PUIDindex) {
	$("#confirmDeleteArea"+PUIDindex).hide(500);
	ArrowPosition(ACT_IDLE, PUIDindex);
	$('#arrow'+PUIDindex).fadeTo(1,1);
}

function hideConfirmFormat(PUIDindex) {
	$("#confirmFormatArea"+PUIDindex).hide(500);
	ArrowPosition(ACT_IDLE, PUIDindex);
	$('#arrow'+PUIDindex).fadeTo(1000,1);
}

function hideConfirmRebuild(PUIDindex) {
	$("#confirmRebuildArea"+PUIDindex).hide(500);
	ArrowPosition(ACT_IDLE, PUIDindex);
	$('#arrow'+PUIDindex).fadeTo(1000,1);
}

function hideConfirmResize(PUIDindex) {
	$("#confirmResizeArea"+PUIDindex).hide(500);
	ArrowPosition(ACT_IDLE, PUIDindex);
	$('#arrow'+PUIDindex).fadeTo(1000,1);
}

function hideConfirmVerify(PUIDindex) {
	$("#confirmVerifyArea"+PUIDindex).hide(500);
	ArrowPosition(ACT_IDLE, PUIDindex);
	$('#arrow'+PUIDindex).fadeTo(1000,1);
}

function hideConfirmShare(PUIDindex) {
	$("#confirmShareArea"+PUIDindex).hide(500);
	ArrowPosition(ACT_IDLE, PUIDindex);
	$('#arrow'+PUIDindex).fadeTo(1000,1);
}

function hideConfirmUnshare(PUIDindex) {
	$("#confirmUnshareArea"+PUIDindex).hide(500);
	ArrowPosition(ACT_IDLE, PUIDindex);
	$('#arrow'+PUIDindex).fadeTo(1000,1);
}

function hideConfirmSplit(PUIDindex) {
	$("#confirmSplitArea"+PUIDindex).hide(500);
	ArrowPosition(ACT_IDLE, PUIDindex);
	$('#arrow'+PUIDindex).fadeTo(1000,1);
}

function hideConfirmJoin(PUIDindex) {
	$("#confirmJoinArea"+PUIDindex).hide(500);
	ArrowPosition(ACT_IDLE, PUIDindex);
	$('#arrow'+PUIDindex).fadeTo(1000,1);
}

function hideConfirmJBOD(PUIDindex) {
	$("#confirmJBODArea"+PUIDindex).hide(500);
	ArrowPosition(ACT_IDLE, PUIDindex);
	$('#arrow'+PUIDindex).fadeTo(1000,1);
}

function hideConfirmR1(PUIDindex) {
	$("#confirmR1Area"+PUIDindex).hide(500);
	ArrowPosition(ACT_IDLE, PUIDindex);
	$('#arrow'+PUIDindex).fadeTo(1000,1);
}
