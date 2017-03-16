
var wsurl = "ws://192.168.2.100:7681";

//global variables
//var PartitionNumA = 0;
//var PartitionNumB = 0;
var binaryData = null;//for storage read







// Version Negotiation Request
function sendVersionNeg () {
	//sample version data here
	VersionNegotiation(0x01, 0x02, 0x1234);
}
function VersionNegotiation( aMajorVersion, aMinorVersion, aBuildNumber ) {
	var buffer = new ArrayBuffer(MsgHeader.Size + VersionNegotiationReq.Size);
	var dv = new DataView(buffer);
	var vnqMsgHeader = new MsgHeader();
	var versionNegReq = new VersionNegotiationReq();

	vnqMsgHeader.Init(JS_VERSION_NEG_REQ, VersionNegotiationReq.Size);
	vnqMsgHeader.Write(dv, 0);

	versionNegReq.Init(aMajorVersion, aMinorVersion, aBuildNumber);
	versionNegReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}



// Wipe Media Request
function sendWipeMedia (cardchar, eraseLevel) {

	//collect data from Web UI
	var GUID = $("#GUID"+cardchar).html();

	//store the command which is in progress
	$("#cardProgCmd"+cardchar).html(JS_WIPE_MEDIA_REQ);

	//clear error message area
	clearCardErrorMsg(cardchar);

	//send command
	WipeMedia(GUID, eraseLevel);


}
function WipeMedia( aCardGUID, anEraseSecurityLevel ) {
	var buffer = new ArrayBuffer(MsgHeader.Size + WipeMediaReq.Size);
	var dv = new DataView(buffer);
	var wmqMsgHeader = new MsgHeader();
	var wipeMediaReq = new WipeMediaReq();

	wmqMsgHeader.Init(JS_WIPE_MEDIA_REQ, WipeMediaReq.Size);
	wmqMsgHeader.Write(dv, 0);

	wipeMediaReq.Init(aCardGUID, anEraseSecurityLevel);
	wipeMediaReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}



//Change Media Info Request
function sendChangeMediaInfo (cardchar) {

	//collect data from Web UI
	var GUID = $("#GUID"+cardchar).html();

	var comment = document.getElementsByName("SDCardDesc"+cardchar)[0].value;
	comment = encodeURI(comment);
	//console.log("send comment:"+comment);
	var flag = 0;
	if ($("#SWLock"+cardchar).prop("checked")) {
		flag = 4;//bit 2 is for software protected
	}

	//clear error message area
	clearCardErrorMsg(cardchar);

	//send command
	ChangeMediaInfo(GUID, flag, comment.length, comment);

}
function ChangeMediaInfo( aCardGUID, aFlags, anUserCommentLength, anUserComment ) {
	var buffer = new ArrayBuffer(MsgHeader.Size + ChangeMediaInfoReq.Size);
	var dv = new DataView(buffer);
	var cmiMsgHeader = new MsgHeader();
	var changeMediaInfoReq = new ChangeMediaInfoReq();

	cmiMsgHeader.Init(JS_CHANGE_MEDIA_INFO_REQ, ChangeMediaInfoReq.Size);
	cmiMsgHeader.Write(dv, 0);

	changeMediaInfoReq.Init(aCardGUID, aFlags, anUserCommentLength, anUserComment);
	changeMediaInfoReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}



//Define Partition Request
function sendDefinePartition(cardchar) {
	//collect data from Web UI
	var GUID = $("#GUID"+cardchar).html();
	var partitionName = $("#NewPartName"+cardchar).val();
	partitionName = encodeURI(partitionName);
	var unit = $("#selectKBMBGB"+cardchar).val();
	var size = $("#PartitionSize"+cardchar).val();

	switch(unit) {
		case "KB":
			size *= Math.pow(2,10);
			break;
		case "MB":
			size *= Math.pow(2,20);
			break;
		case "GB":
			size *= Math.pow(2,30);
			break;
	}


	//send command
	DefinePartition(GUID, size, partitionName.length, partitionName);

	//reset input field
	document.getElementById("NewPartName"+cardchar).value = "";
	//document.getElementsByName("PartitionSize"+cardchar)[0].value = 0;
	//disable submit button
	document.getElementById("BtnCreatePartition"+cardchar).disabled = true;

}
function DefinePartition( owCardGUID, qwSize, dwLengthPartitionName, abyPartitionName ){
	var buffer = new ArrayBuffer(MsgHeader.Size + DefinePartitionReq.Size);
	var dv = new DataView(buffer);
	var dpqMsgHeader = new MsgHeader();
	var definePartReq = new DefinePartitionReq();

	dpqMsgHeader.Init(JS_DEFINE_PART_REQ, DefinePartitionReq.Size);
	dpqMsgHeader.Write(dv, 0);

	definePartReq.Init(owCardGUID, qwSize, dwLengthPartitionName, abyPartitionName);
	definePartReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}



//Set Partition Options Request
function sendSetPartitionOp(PUIDindex) {

	//collect data from Web UI
	var PUID = $("#PUIDstateStr"+PUIDindex).html();

	var flag_PSPCanMount = (document.getElementById("PSPCanMount"+PUIDindex).checked) ? 0:1;
	var flag_HostCanMount = (document.getElementById("HostCanMount"+PUIDindex).checked) ? 0:1;
	var flag_SwWriteProtected = (document.getElementById("SWWriteProtected"+PUIDindex).checked) ? 0:1;

	//console.log("flag_PSPCanMount:"+flag_PSPCanMount);
	//console.log("flag_HostCanMount:"+flag_HostCanMount);
	//console.log("flag_SwWriteProtected:"+flag_SwWriteProtected);

	var flags = ((flag_SwWriteProtected<<2) | (flag_HostCanMount<<1) | (flag_PSPCanMount));
	//console.log("flags:"+flags);

	var mediaType = document.getElementById("MediaType"+PUIDindex).selectedIndex;
	var partitionName = document.getElementById("PartitionName"+PUIDindex).value;
	partitionName = encodeURI(partitionName);
	var userComment = document.getElementById("UserComment"+PUIDindex).value;
	userComment = encodeURI(userComment);

	//send command
	SetPartitionOptions(PUID, flags, mediaType, partitionName.length, userComment.length, partitionName, userComment);

}
function SetPartitionOptions( aPUID, aFlags, aType, aPartitionNameLength, anUserCommentLength, aPartitionName, anUserComment ) {
	var buffer = new ArrayBuffer(MsgHeader.Size + SetPartitionOptionsReq.Size);
	var dv = new DataView(buffer);
	var spoqMsgHeader = new MsgHeader();
	var setPartOpReq = new SetPartitionOptionsReq();

	spoqMsgHeader.Init(JS_SET_PART_OPTIONS_REQ, SetPartitionOptionsReq.Size);
	spoqMsgHeader.Write(dv, 0);

	setPartOpReq.Init(aPUID, aFlags, aType, aPartitionNameLength, anUserCommentLength, aPartitionName, anUserComment);
	setPartOpReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}



//Prepare Media for Ejection Request
function sendPrepareMediaEjection(cardchar) {

	//collect data
	var GUID = $("#GUID"+cardchar).html();
	//console.log("sendPrepareMediaEjection GUID="+GUID);

	//clear error message area
	clearCardErrorMsg(cardchar);

	//send command
	PrepareMediaForEjection(GUID);

}
function PrepareMediaForEjection( aCardGUID ){
	var buffer = new ArrayBuffer(MsgHeader.Size + PrepareMediaForEjectionReq.Size);
	var dv = new DataView(buffer);
	var pmeqMsgHeader = new MsgHeader();
	var preMediaEjectReq = new PrepareMediaForEjectionReq();

	pmeqMsgHeader.Init(JS_PREP_MEDIA_FOR_EJECT_REQ, PrepareMediaForEjectionReq.Size);
	pmeqMsgHeader.Write(dv, 0);

	preMediaEjectReq.Init(aCardGUID);
	preMediaEjectReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}




//Delete Partition Request
function sendDeletePartition(PUIDindex) {
	//collect data from Web UI
	var PUID = $("#PUIDstateStr"+PUIDindex).html();

	//send command
	DeletePartition(PUID);
}
function DeletePartition( aPUID ) {
	var buffer = new ArrayBuffer(MsgHeader.Size + DeletePartitionReq.Size);
	var dv = new DataView(buffer);
	var ddpqMsgHeader = new MsgHeader();
	var deletePartReq = new DeletePartitionReq();

	ddpqMsgHeader.Init(JS_DEL_PART_REQ, DeletePartitionReq.Size);
	ddpqMsgHeader.Write(dv, 0);

	deletePartReq.Init(aPUID);
	deletePartReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}



//Claim Partition Request
function sendClaimPartition(PUIDindex) {
	//collect data from Web UI
	var PUID = $("#PUIDstateStr"+PUIDindex).html();
	var claimType = document.getElementById("ClaimType"+PUIDindex).selectedIndex;
	//send command
	if (claimType == 0) {
		ReleasePartition(PUID);
	} else {
		ClaimPartition(PUID, claimType);
	}
}
function ClaimPartition( aPUID, aClaimType ){
	var buffer = new ArrayBuffer(MsgHeader.Size + ClaimPartitionReq.Size);
	var dv = new DataView(buffer);
	var cpqMsgHeader = new MsgHeader();
	var claimPartReq = new ClaimPartitionReq();

	cpqMsgHeader.Init(JS_CLAIM_PART_REQ, ClaimPartitionReq.Size);
	cpqMsgHeader.Write(dv, 0);

	claimPartReq.Init(aPUID, aClaimType);
	claimPartReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}



//Release Partition Request
//Release is unclaim
function ReleasePartition( aPUID ){
	var buffer = new ArrayBuffer(MsgHeader.Size + ReleasePartitionReq.Size);
	var dv = new DataView(buffer);
	var relpqMsgHeader = new MsgHeader();
	var releasePartReq = new ReleasePartitionReq();

	relpqMsgHeader.Init(JS_RELEASE_PART_REQ, ReleasePartitionReq.Size);
	relpqMsgHeader.Write(dv, 0);

	releasePartReq.Init(aPUID);
	releasePartReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}



//Rebuild Partition (Queued Command)
function sendRebuildPartition (PUIDindex) {

	//collect data from Web UI
	var PUID = $("#PUIDstateStr"+PUIDindex).html();

	//store the command which is in progress
	$("#partProgCmd"+PUIDindex).html(JS_REBUILD_PART_REQ);

	RebuildPartition(PUID);

}
function RebuildPartition( aPUID ){
	var buffer = new ArrayBuffer(MsgHeader.Size + RebuildPartitionReq.Size);
	var dv = new DataView(buffer);
	var rbqMsgHeader = new MsgHeader();
	var rebuildPartReq = new RebuildPartitionReq();

	rbqMsgHeader.Init(JS_REBUILD_PART_REQ, RebuildPartitionReq.Size);
	rbqMsgHeader.Write(dv, 0);

	rebuildPartReq.Init(aPUID);
	rebuildPartReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}




//Format Partition (Queued Command)
function sendFormatPartition (PUIDindex) {

	//collect data from Web UI
	var PUID = $("#PUIDstateStr"+PUIDindex).html();
	var formatType = document.getElementById("formatType"+PUIDindex).selectedIndex;

	//store the command which is in progress
	$("#partProgCmd"+PUIDindex).html(JS_FORMAT_PART_REQ);

	//send command
	FormatPartition(PUID, formatType);

}
function FormatPartition( aPUID, aFilesystemType ){
	var buffer = new ArrayBuffer(MsgHeader.Size + FormatPartitionReq.Size);
	var dv = new DataView(buffer);
	var fpqMsgHeader = new MsgHeader();
	var formatPartReq = new FormatPartitionReq();

	fpqMsgHeader.Init(JS_FORMAT_PART_REQ, FormatPartitionReq.Size);
	fpqMsgHeader.Write(dv, 0);

	formatPartReq.Init(aPUID, aFilesystemType);
	formatPartReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}



//Resize Partition (Queued Command)
function sendResizePartition(PUIDindex) {

	//collect data from Web UI
	var PUID = $("#PUIDstateStr"+PUIDindex).html();

	var newSize = document.getElementById("resizeSize"+PUIDindex).value;

	if (document.getElementById("resizeUnit"+PUIDindex).selectedIndex == 0) {
		//byte
	} else if (document.getElementById("resizeUnit"+PUIDindex).selectedIndex == 1) {
		//KB
		newSize *= Math.pow(2,10);
	} else if (document.getElementById("resizeUnit"+PUIDindex).selectedIndex == 2) {
		//MB
		newSize *= Math.pow(2,20);
	} else if (document.getElementById("resizeUnit"+PUIDindex).selectedIndex == 3) {
		//GB
		newSize *= Math.pow(2,30);
	} else {
		console.log("Wrong resize Unit!");
	}

	//store the command which is in progress
	$("#partProgCmd"+PUIDindex).html(JS_RESIZE_PART_REQ);

	//send command
	ResizePartition(PUID, newSize);

}
function ResizePartition( aPUID, aNewSizeInBytes ){
	var buffer = new ArrayBuffer(MsgHeader.Size + ResizePartitionReq.Size);
	var dv = new DataView(buffer);
	var respqMsgHeader = new MsgHeader();
	var resizePartReq = new ResizePartitionReq();

	respqMsgHeader.Init(JS_RESIZE_PART_REQ, ResizePartitionReq.Size);
	respqMsgHeader.Write(dv, 0);

	resizePartReq.Init(aPUID, aNewSizeInBytes);
	resizePartReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}


//Verify Partition (Queued command)
function sendVerifyPartition(PUIDindex){
	//collect data from Web UI
	var PUID = $("#PUIDstateStr"+PUIDindex).html();

	//store the command which is in progress
	$("#partProgCmd"+PUIDindex).html(JS_VERIFY_PART_REQ);

	//send command
	VerifyPartition(PUID);
}
function VerifyPartition(owPUID) {
	var buffer = new ArrayBuffer(MsgHeader.Size + VerifyPartitionReq.Size);
	var dv = new DataView(buffer);
	var vpqMsgHeader = new MsgHeader();
	var verifyPartReq = new VerifyPartitionReq();

	vpqMsgHeader.Init(JS_VERIFY_PART_REQ, VerifyPartitionReq.Size);
	vpqMsgHeader.Write(dv, 0);

	verifyPartReq.Init(owPUID);
	verifyPartReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}


//Break Mirror Request
function sendBreakMirror() {

	//fake PUID
	BreakMirror(Dw2HexString(1));

}
function BreakMirror( aPUID ){
	var buffer = new ArrayBuffer(MsgHeader.Size + BreakMirrorReq.Size);
	var dv = new DataView(buffer);
	var bmqMsgHeader = new MsgHeader();
	var breakMirrorReq = new BreakMirrorReq();

	bmqMsgHeader.Init(JS_BREAK_MIRROR_REQ, BreakMirrorReq.Size);
	bmqMsgHeader.Write(dv, 0);

	breakMirrorReq.Init(aPUID);
	breakMirrorReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}



//Join Mirror Request
function sendJoinMirror() {

	//fake PUID
	JoinMirror(Dw2HexString(1));

}
function JoinMirror( aPUID ){
	var buffer = new ArrayBuffer(MsgHeader.Size + JoinMirrorReq.Size);
	var dv = new DataView(buffer);
	var jmqMsgHeader = new MsgHeader();
	var joinMirrorReq = new JoinMirrorReq();

	jmqMsgHeader.Init(JS_JOIN_MIRROR_REQ, JoinMirrorReq.Size);
	jmqMsgHeader.Write(dv, 0);

	joinMirrorReq.Init(aPUID);
	joinMirrorReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}



//Convert Partition Type
function sendConvertPartitionType(PUIDindex, ConvertType) {

	//collect data from Web UI
	var PUID = $("#PUIDstateStr"+PUIDindex).html();

	//clear error message area
	clearCardErrorMsg(cardchar);

	//send commmand
	ConvertPartitionType(PUID, ConvertType);

}
function ConvertPartitionType( aPUID, aNewPartitionType ){
	var buffer = new ArrayBuffer(MsgHeader.Size + ConvertPartitionTypeReq.Size);
	var dv = new DataView(buffer);
	var cptqMsgHeader = new MsgHeader();
	var convertPartTypeReq = new ConvertPartitionTypeReq();

	cptqMsgHeader.Init(JS_CONVERT_PART_REQ, ConvertPartitionTypeReq.Size);
	cptqMsgHeader.Write(dv, 0);

	convertPartTypeReq.Init(aPUID, aNewPartitionType);
	convertPartTypeReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}



//Share Partition Request
function sendSharePartition(PUIDindex) {

	//collect data from Web UI
	var PUID = $("#PUIDstateStr"+PUIDindex).html();
	var PSPShare = document.getElementById("shareOpPSPShare"+PUIDindex).selectedIndex;
	var writable = (document.getElementById("shareOpWritable"+PUIDindex).selectedIndex == 0) ? 1 : 0;

	//send commmand
	SharePartition(PUID, PSPShare, writable);

}
function SharePartition( aPUID, aPSPShare, aReadOnly ){
	var buffer = new ArrayBuffer(MsgHeader.Size + SharePartitionReq.Size);
	var dv = new DataView(buffer);
	var spqMsgHeader = new MsgHeader();
	var sharePartReq = new SharePartitionReq();

	spqMsgHeader.Init(JS_SHARE_PART_REQ, SharePartitionReq.Size);
	spqMsgHeader.Write(dv, 0);

	sharePartReq.Init(aPUID, aPSPShare, aReadOnly);
	sharePartReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}



//Unshare Partition Request
function sendUnsharePartition(PUIDindex) {

	//collect data from Web UI
	var PUID = $("#PUIDstateStr"+PUIDindex).html();

	//send command
	UnsharePartition(PUID);

}
function UnsharePartition( aPUID ){
	var buffer = new ArrayBuffer(MsgHeader.Size + UnsharePartitionReq.Size);
	var dv = new DataView(buffer);
	var upqMsgHeader = new MsgHeader();
	var unsharePartReq = new UnsharePartitionReq();

	upqMsgHeader.Init(JS_UNSHARE_PART_REQ, UnsharePartitionReq.Size);
	upqMsgHeader.Write(dv, 0);

	unsharePartReq.Init(aPUID);
	unsharePartReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}


//Convert RAID type Request
function sendConvertRAIDType(cardchar) {
	//collect data from web UI
	var NewRAIDType = document.getElementById("RAIDType"+cardchar).selectedIndex - 1;
	var GUID = $("#GUID"+cardchar).html();

	//store the command which is in progress
	$("#cardProgCmd"+cardchar).html(JS_CONVERT_RAID_TYPE_REQ);

	//console.log("Convert GUID = "+GUID);

	//disable "Convert" button
	$("#confirmConvertRAIDType"+cardchar).prop("disabled", true);

	//send command
	ConvertRAIDType(GUID, NewRAIDType);
}
function ConvertRAIDType(PrimaryCardGUID, NewRAIDType) {
	var buffer = new ArrayBuffer(MsgHeader.Size + ConvertRAIDTypeReq.Size);
	var dv = new DataView(buffer);
	var crtqMsgHeader = new MsgHeader();
	var convertRAIDTypeReq = new ConvertRAIDTypeReq();

	crtqMsgHeader.Init(JS_CONVERT_RAID_TYPE_REQ, ConvertRAIDTypeReq.Size);
	crtqMsgHeader.Write(dv, 0);

	convertRAIDTypeReq.Init(PrimaryCardGUID, NewRAIDType);
	convertRAIDTypeReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}


//Cancel Queued Command for partition
function sendCancelPartQueuedTask(PUIDindex) {
	//collect data from Web UI
	var PUID = $("#PUIDstateStr"+PUIDindex).html();
	var commandNum = $("#partProgCmd"+PUIDindex).html();

	console.log("Partition Cancel Command:"+commandNum);


	//send command
	CancelQueuedTask(PUID, commandNum);

}
////Cancel Queued Command for card
function sendCancelCardQueuedTask(cardchar) {
	//collect data from Web UI
	var GUID = $("#GUID"+cardchar).html();
	var commandNum = $("#cardProgCmd"+cardchar).html();

	console.log("Card Cancel Command:"+commandNum);


	//send command
	CancelQueuedTask(GUID, commandNum);

}
function CancelQueuedTask(owUID, dwCommand) {
	var buffer = new ArrayBuffer(MsgHeader.Size + CancelQueuedTaskReq.Size);
	var dv = new DataView(buffer);
	var cqtqMsgHeader = new MsgHeader();
	var cancelQueuedTask = new CancelQueuedTaskReq();

	cqtqMsgHeader.Init(JS_CANCEL_QUEUED_TASK_REQ, CancelQueuedTaskReq.Size);
	cqtqMsgHeader.Write(dv, 0);

	cancelQueuedTask.Init(owUID, dwCommand);
	cancelQueuedTask.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}


//Defrag Request
function sendDefrag(cardchar) {
	//collect data from Web UI
	var GUID = $("#GUID"+cardchar).html();

	//store the command which is in progress
	$("#cardProgCmd"+cardchar).html(JS_DEFRAG_REQ);

	//clear error message area
	clearCardErrorMsg(cardchar);

	//send command
	Defrag(GUID);
}
function Defrag(owGUID){
	var buffer = new ArrayBuffer(MsgHeader.Size + DefragReq.Size);
	var dv = new DataView(buffer);
	var defragMsgHeader = new MsgHeader();
	var defrag = new DefragReq();

	defragMsgHeader.Init(JS_DEFRAG_REQ, DefragReq.Size);
	defragMsgHeader.Write(dv, 0);

	defrag.Init(owGUID);
	defrag.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}


//SyncMirror Request
function sendSyncMirror(cardchar) {
	//collect data from Web UI
	var GUID = "";

	if (cardchar == 'A') {
		GUID = $("#GUIDA").html();
	} else if (cardchar == 'B') {
		GUID = $("#GUIDB").html();
	} else {
		console.log("sync mirror wrong card index!!!");
	}

	//store the command which is in progress
	$("#cardProgCmd"+cardchar).html(JS_SYNC_MIRROR_REQ);

	//send command
	SyncMirror(GUID);
}
function SyncMirror(owSecondaryCardGUID){
	var buffer = new ArrayBuffer(MsgHeader.Size + SyncMirrorReq.Size);
	var dv = new DataView(buffer);
	var syncMsgHeader = new MsgHeader();
	var sync = new SyncMirrorReq();

	syncMsgHeader.Init(JS_SYNC_MIRROR_REQ, SyncMirrorReq.Size);
	syncMsgHeader.Write(dv, 0);

	sync.Init(owSecondaryCardGUID);
	sync.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}


//PrepareSSPFirmwareUpdate Request
function sendPrepareSSPFirmwareUpdate() {
	//collect data from Web UI

	//send command
	PrepareSSPFirmwareUpdate(0);//it's just reserved field.
}
function PrepareSSPFirmwareUpdate(dwReserved) {
	var buffer = new ArrayBuffer(MsgHeader.Size + PrepareSSPFirmwareUpdateReq.Size);
	var dv = new DataView(buffer);
	var PSSPFUMsgHeader = new MsgHeader();
	var PSSPFU = new PrepareSSPFirmwareUpdateReq();

	PSSPFUMsgHeader.Init(JS_SSPFIRMWARE_UPDATE_REQ, PrepareSSPFirmwareUpdateReq.Size);
	PSSPFUMsgHeader.Write(dv, 0);

	PSSPFU.Init(dwReserved);
	PSSPFU.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
	console.log("PrepareSSPFirmwareUpdate sent!");
}


//ReadRawRegisters Request
function sendReadRawRegisters() {
	//collect data from Web UI
	var GUID = "";
	if (document.getElementById("RdRawRegCard").selectedIndex == 1) {
		GUID = $("#GUIDA").html();
	} else if (document.getElementById("RdRawRegCard").selectedIndex == 2) {
		GUID = $("#GUIDB").html();
	}

	//send command
	ReadRawRegisters(GUID);
}
function ReadRawRegisters(owCardGUID) {
	var buffer = new ArrayBuffer(MsgHeader.Size + ReadRawRegistersReq.Size);
	var dv = new DataView(buffer);
	var rawRegReqMsgHeader = new MsgHeader();
	var rawRegReq = new ReadRawRegistersReq();

	rawRegReqMsgHeader.Init(JS_SD_RAW_REGISTERS_REQ, ReadRawRegistersReq.Size);
	rawRegReqMsgHeader.Write(dv, 0);

	rawRegReq.Init(owCardGUID);
	rawRegReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}


//ChangeRAIDSetting Request
function sendChangeRAIDSetting() {
	//collect data from Web UI
	var syncMode = $("#SyncSetting").prop("checked") ? 1 : 0;

	//send command
	ChangeRAIDSetting(syncMode);

	//hide confirm button
	$("#BtnConfirmSyncSetting").hide();
}
function ChangeRAIDSetting(bySyncMode) {
	var buffer = new ArrayBuffer(MsgHeader.Size + ChangeRAIDSettingReq.Size);
	var dv = new DataView(buffer);
	var crsReqMsgHeader = new MsgHeader();
	var crsReq = new ChangeRAIDSettingReq();

	crsReqMsgHeader.Init(JS_RAID_SETTING_REQ, ChangeRAIDSettingReq.Size);
	crsReqMsgHeader.Write(dv, 0);

	crsReq.Init(bySyncMode);
	crsReq.Write(dv, MsgHeader.Size);

	websocketMain.send(buffer);
}


//parse data from websocket in index page
function parseIncomingMessage (evt) {

	// get the notify_resp_type

	// parse evt.data

	var blobReader = new FileReader();
	blobReader.onload = function() {
		var dv = new DataView(this.result);
		var indata = new Uint8Array(this.result);
		var notify_resp_type = dv.getUint32(0,true);

		var msgHeader = new MsgHeader();
		msgHeader.Read(dv, 0);

		var cardchar = "";
		var cardcharPeer = "";
		var errorMsg = "";
		var PUIDindex = "";
		var percentage = 0;

		// determine what action to take for this response or notification
		switch ( msgHeader.dwCommand ) {

			case JS_VERSION_NEG_RES:
				console.log("get VERSION_NEG_RES!");
				//Read data and save it in "versionNegRes"
				var versionNegRes = new VersionNegotiationRes();
				versionNegRes.Read(dv, MsgHeader.Size);



				//Update on Web Interface
				if (versionNegRes.dwStatusCode == 0x00) {

				} else {
					//alert("Negotiation failed!");
					$("#VNErrorMsg").effect("pulsate",{times:3},3000);
				}
				break;

			case JS_SPACE_AVAIL_NOTIFY:
				console.log("get JS_SPACE_AVAIL_NOTIFY!");
				//Read data and save it in "spaceAvailableNoti"
				var spaceAvailableNoti = new SpaceAvailableNotification();
				spaceAvailableNoti.Read(dv, MsgHeader.Size);

				//Update on Web Interface
				if (spaceAvailableNoti.cbyTotalFreeSpaceCombined >= Math.pow(2,30)) {
					$(".TotalFreeSpace").html(" "+(spaceAvailableNoti.cbyTotalFreeSpaceCombined/Math.pow(2,30)).toFixed(2)+" ");
					$(".TotalFreeUnit").html("&nbsp;GB");
				}else if (spaceAvailableNoti.cbyTotalFreeSpaceCombined >= Math.pow(2,20)) {
					$(".TotalFreeSpace").html(" "+(spaceAvailableNoti.cbyTotalFreeSpaceCombined/Math.pow(2,20)).toFixed(2)+" ");
					$(".TotalFreeUnit").html("&nbsp;MB");
				} else if (spaceAvailableNoti.cbyTotalFreeSpaceCombined >= Math.pow(2,10)) {
					$(".TotalFreeSpace").html(" "+(spaceAvailableNoti.cbyTotalFreeSpaceCombined/Math.pow(2,10)).toFixed(2)+" ");
					$(".TotalFreeUnit").html("&nbsp;KB");
				} else if (spaceAvailableNoti.cbyTotalFreeSpaceCombined >= 0) {
					$(".TotalFreeSpace").html(" "+(spaceAvailableNoti.cbyTotalFreeSpaceCombined).toFixed(2)+" ");
					$(".TotalFreeUnit").html("&nbsp;B");
				}

				if (spaceAvailableNoti.cbyTotalFreeSpaceOnCardA >= Math.pow(2,30)) {
					$("#totalFreeA").html(" "+(spaceAvailableNoti.cbyTotalFreeSpaceOnCardA/Math.pow(2,30)).toFixed(2)+" ");
					$("#totalFreeAUnit").html("&nbsp;GB");
				}else if (spaceAvailableNoti.cbyTotalFreeSpaceOnCardA >= Math.pow(2,20)) {
					$("#totalFreeA").html(" "+(spaceAvailableNoti.cbyTotalFreeSpaceOnCardA/Math.pow(2,20)).toFixed(2)+" ");
					$("#totalFreeAUnit").html("&nbsp;MB");
				} else if (spaceAvailableNoti.cbyTotalFreeSpaceOnCardA >= Math.pow(2,10)) {
					$("#totalFreeA").html(" "+(spaceAvailableNoti.cbyTotalFreeSpaceOnCardA/Math.pow(2,10)).toFixed(2)+" ");
					$("#totalFreeAUnit").html("&nbsp;KB");
				} else if (spaceAvailableNoti.cbyTotalFreeSpaceOnCardA >= 0) {
					$("#totalFreeA").html(" "+(spaceAvailableNoti.cbyTotalFreeSpaceOnCardA).toFixed(2)+" ");
					$("#totalFreeAUnit").html("&nbsp;B");
				}

				if (spaceAvailableNoti.cbyTotalFreeSpaceOnCardB >= Math.pow(2,30)) {
					$("#totalFreeB").html(" "+(spaceAvailableNoti.cbyTotalFreeSpaceOnCardB/Math.pow(2,30)).toFixed(2)+" ");
					$("#totalFreeBUnit").html("&nbsp;GB");
				}else if (spaceAvailableNoti.cbyTotalFreeSpaceOnCardB >= Math.pow(2,20)) {
					$("#totalFreeB").html(" "+(spaceAvailableNoti.cbyTotalFreeSpaceOnCardB/Math.pow(2,20)).toFixed(2)+" ");
					$("#totalFreeBUnit").html("&nbsp;MB");
				} else if (spaceAvailableNoti.cbyTotalFreeSpaceOnCardB >= Math.pow(2,10)) {
					$("#totalFreeB").html(" "+(spaceAvailableNoti.cbyTotalFreeSpaceOnCardB/Math.pow(2,10)).toFixed(2)+" ");
					$("#totalFreeBUnit").html("&nbsp;KB");
				} else if (spaceAvailableNoti.cbyTotalFreeSpaceOnCardB >= 0) {
					$("#totalFreeB").html(" "+(spaceAvailableNoti.cbyTotalFreeSpaceOnCardB).toFixed(2)+" ");
					$("#totalFreeBUnit").html("&nbsp;B");
				}

				if (spaceAvailableNoti.cbyLargestJBODSpaceOnCardA >= Math.pow(2,30)) {
					$("#possibleJBODA").html(" "+(spaceAvailableNoti.cbyLargestJBODSpaceOnCardA/Math.pow(2,30)).toFixed(2)+" ");
					$("#possibleJBODAUnit").html("&nbsp;GB");
				}else if (spaceAvailableNoti.cbyLargestJBODSpaceOnCardA >= Math.pow(2,20)) {
					$("#possibleJBODA").html(" "+(spaceAvailableNoti.cbyLargestJBODSpaceOnCardA/Math.pow(2,20)).toFixed(2)+" ");
					$("#possibleJBODAUnit").html("&nbsp;MB");
				} else if (spaceAvailableNoti.cbyLargestJBODSpaceOnCardA >= Math.pow(2,10)) {
					$("#possibleJBODA").html(" "+(spaceAvailableNoti.cbyLargestJBODSpaceOnCardA/Math.pow(2,10)).toFixed(2)+" ");
					$("#possibleJBODAUnit").html("&nbsp;KB");
				} else if (spaceAvailableNoti.cbyLargestJBODSpaceOnCardA >= 0) {
					$("#possibleJBODA").html(" "+(spaceAvailableNoti.cbyLargestJBODSpaceOnCardA).toFixed(2)+" ");
					$("#possibleJBODAUnit").html("&nbsp;B");
				}

				if (spaceAvailableNoti.cbyLargestJBODSpaceOnCardB >= Math.pow(2,30)) {
					$("#possibleJBODB").html(" "+(spaceAvailableNoti.cbyLargestJBODSpaceOnCardB/Math.pow(2,30)).toFixed(2)+" ");
					$("#possibleJBODBUnit").html("&nbsp;GB");
				}else if (spaceAvailableNoti.cbyLargestJBODSpaceOnCardB >= Math.pow(2,20)) {
					$("#possibleJBODB").html(" "+(spaceAvailableNoti.cbyLargestJBODSpaceOnCardB/Math.pow(2,20)).toFixed(2)+" ");
					$("#possibleJBODBUnit").html("&nbsp;MB");
				} else if (spaceAvailableNoti.cbyLargestJBODSpaceOnCardB >= Math.pow(2,10)) {
					$("#possibleJBODB").html(" "+(spaceAvailableNoti.cbyLargestJBODSpaceOnCardB/Math.pow(2,10)).toFixed(2)+" ");
					$("#possibleJBODBUnit").html("&nbsp;KB");
				} else if (spaceAvailableNoti.cbyLargestJBODSpaceOnCardB >= 0) {
					$("#possibleJBODB").html(" "+(spaceAvailableNoti.cbyLargestJBODSpaceOnCardB).toFixed(2)+" ");
					$("#possibleJBODBUnit").html("&nbsp;B");
				}

				if (spaceAvailableNoti.cbyLargestStripeSpaceOnCard >= Math.pow(2,30)) {
					$(".PossibleStripeSpace").html(" "+(spaceAvailableNoti.cbyLargestStripeSpaceOnCard/Math.pow(2,30)).toFixed(2)+" ");
					$(".PossibleStripeUnit").html("&nbsp;GB");
				}else if (spaceAvailableNoti.cbyLargestStripeSpaceOnCard >= Math.pow(2,20)) {
					$(".PossibleStripeSpace").html(" "+(spaceAvailableNoti.cbyLargestStripeSpaceOnCard/Math.pow(2,20)).toFixed(2)+" ");
					$(".PossibleStripeUnit").html("&nbsp;MB");
				} else if (spaceAvailableNoti.cbyLargestStripeSpaceOnCard >= Math.pow(2,10)) {
					$(".PossibleStripeSpace").html(" "+(spaceAvailableNoti.cbyLargestStripeSpaceOnCard/Math.pow(2,10)).toFixed(2)+" ");
					$(".PossibleStripeUnit").html("&nbsp;KB");
				} else if (spaceAvailableNoti.cbyLargestStripeSpaceOnCard >= 0) {
					$(".PossibleStripeSpace").html(" "+(spaceAvailableNoti.cbyLargestStripeSpaceOnCard).toFixed(2)+" ");
					$(".PossibleStripeUnit").html("&nbsp;B");
				}

				if (spaceAvailableNoti.cbyLargestMirrorSpaceOnCard >= Math.pow(2,30)) {
					$(".PossibleMirrorSpace").html(" "+(spaceAvailableNoti.cbyLargestMirrorSpaceOnCard/Math.pow(2,30)).toFixed(2)+" ");
					$(".PossibleMirrorUnit").html("&nbsp;GB");
				}else if (spaceAvailableNoti.cbyLargestMirrorSpaceOnCard >= Math.pow(2,20)) {
					$(".PossibleMirrorSpace").html(" "+(spaceAvailableNoti.cbyLargestMirrorSpaceOnCard/Math.pow(2,20)).toFixed(2)+" ");
					$(".PossibleMirrorUnit").html("&nbsp;MB");
				} else if (spaceAvailableNoti.cbyLargestMirrorSpaceOnCard >= Math.pow(2,10)) {
					$(".PossibleMirrorSpace").html(" "+(spaceAvailableNoti.cbyLargestMirrorSpaceOnCard/Math.pow(2,10)).toFixed(2)+" ");
					$(".PossibleMirrorUnit").html("&nbsp;KB");
				} else if (spaceAvailableNoti.cbyLargestMirrorSpaceOnCard >= 0) {
					$(".PossibleMirrorSpace").html(" "+(spaceAvailableNoti.cbyLargestMirrorSpaceOnCard).toFixed(2)+" ");
					$(".PossibleMirrorUnit").html("&nbsp;B");
				}

				//update piechart
				var totalA = parseInt($("#cardSizeA").html());
				if (totalA > 0) {
					var freeA = (100*spaceAvailableNoti.cbyTotalFreeSpaceOnCardA/totalA).toFixed(2);
					var usedA = (100 - freeA).toFixed(2);
					LoadPieCharts("A", usedA, freeA);
				}


				var totalB = parseInt($("#cardSizeB").html());
				if (totalB > 0) {
					var freeB = (100*spaceAvailableNoti.cbyTotalFreeSpaceOnCardB/totalB).toFixed(2);
					var usedB = (100 - freeB).toFixed(2);
					LoadPieCharts("B", usedB, freeB);
				}

				//clear previous input value of partition size
				$("#PartitionSizeA").val("");
				$("#PartitionSizeB").val("");

				//hide error messages of new partition size
				$("#volumeSizeErrorMsgA").hide();
				$("#volumeSizeErrorMsgB").hide();
				//clear error messages of previous partition activity
				document.getElementById("definePartErrorMsgA").innerHTML = "";
				document.getElementById("definePartErrorMsgB").innerHTML = "";

				break;

			case JS_PART_LIST_UPDATED_NOTIFY:
				console.log("get PART_LIST_UPDATED_NOTIFY!");
				//Read data and save it in "partListUpdateNoti"
				var partListUpdateNoti = new PartitionListUpdatedNotification();
				partListUpdateNoti.Read(dv, indata);

				//console.log("cPartitions:"+partListUpdateNoti.cPartitions);
				//Update on Web Interface
				var GUIDA = $("#GUIDA").html();
				var GUIDB = $("#GUIDB").html();

				var PartInfoEntry = partListUpdateNoti.pie;

				//console.log("partitionNum:"+partListUpdateNoti.cPartitions);

				if (partListUpdateNoti.cPartitions == 0) {

					//accordionVolume();
					$("#CardAPartitionList").html("");
					$("#CardBPartitionList").html("");

				} else {

					var BstartIndex = partListUpdateNoti.cPartitions;
					for (var i=0;i<partListUpdateNoti.cPartitions;i++) {
						if (PartInfoEntry[i].owGUID == GUIDB) {
							BstartIndex = i;
							break;
						}
					}

					$("#PartitionNumA").html(BstartIndex - 0);
					$("#PartitionNumB").html(partListUpdateNoti.cPartitions - BstartIndex);

					generatePartitionEntries ( PartInfoEntry, 0, BstartIndex, 'CardAPartitionList' );
					generatePartitionEntries ( PartInfoEntry, BstartIndex, partListUpdateNoti.cPartitions, 'CardBPartitionList' );
					/*if (PartInfoEntry[0].owGUID == GUIDA) {
						PartitionNumA = partListUpdateNoti.cPartitions;
						generatePartitionEntries ( PartInfoEntry, partListUpdateNoti.cPartitions, 'CardAPartitionList' );
					} else if (PartInfoEntry[0].owGUID == GUIDB) {
						PartitionNumB = partListUpdateNoti.cPartitions;
						generatePartitionEntries ( PartInfoEntry, partListUpdateNoti.cPartitions, 'CardBPartitionList' );
					} else {
						//GUID not recognized
						console.log("Unrecognized GUID in pie!");
					}*/

					accordionVolume();
					setDragArrowJBOD();
					setDragArrowMirror();
					setDragArrowStripe();

				}
				break;

			case JS_PROG_REPORT_NOTIFY:
				console.log("get JS_PROG_REPORT_NOTIFY!");
				//Read data and save it in "progReportNoti"
				var progReportNoti = new ProgressReportNotification();
				progReportNoti.Read(dv, MsgHeader.Size);
				//console.log("progReportNoti.dwCommand:"+progReportNoti.dwCommand);
				//Update on Web Interface

				if (progReportNoti.owGUID == $("#GUIDA").html()) {
					cardchar = "A";
					cardcharPeer = "B";
				} else if (progReportNoti.owGUID == $("#GUIDB").html()) {
					cardchar = "B";
					cardcharPeer = "A";
				} else {
					console.log("Wrong GUID in PROG_REPORT_NOTIFY!");
					console.log("GUID:"+progReportNoti.owGUID);
				}

				if (progReportNoti.dwErrorCode == 0) {
					//error code is 0
					console.log(progReportNoti.dwTotalStepsCompleted+":"+progReportNoti.dwTotalStepsRequired);
					//clear error message for
					//document.getElementById("CardError"+cardchar).innerHTML = "";
					//clearCardErrorMsg(cardchar);
					//display card progress bar
					if (document.getElementById("cardProgArea"+cardchar).style.display == "none" && (progReportNoti.dwTotalStepsCompleted<progReportNoti.dwTotalStepsRequired)) {
						showCardProg(cardchar);
					}

					percentage = 100*progReportNoti.dwTotalStepsCompleted/progReportNoti.dwTotalStepsRequired;

					switch(progReportNoti.dwCommand) {
						case JS_WIPE_MEDIA_REQ:

							$("#WipeErrorMark"+cardchar).fadeTo(0,0);
							$("#WipeErrorMark"+cardchar).prop("title","");
							$("#CardError" + cardchar + "WIPE").html("");
							$("#cardProg"+cardchar).html("Wiping "+percentage.toFixed(2).slice(0,-3)+"%");
							$("#cardProgCmd"+cardchar).html(JS_WIPE_MEDIA_REQ);

							if (progReportNoti.dwTotalStepsCompleted < progReportNoti.dwTotalStepsRequired) {

								$("#cardProg"+cardchar).width(percentage+"%");
								$("#BtnWipe"+cardchar).prop("disabled", true);

							} else if (progReportNoti.dwTotalStepsCompleted == progReportNoti.dwTotalStepsRequired) {

								$("#cardProgArea"+cardchar).hide();
								$("#cardProg"+cardchar).width("0%");
								$("#cardProg"+cardchar).html("");
								$("#cardProgCmd"+cardchar).html("");
								$("#BtnWipe"+cardchar).prop("disabled", false);

							} else {
								//steps field not correct
								console.log("JS_PROG_REPORT_NOTIFY ERROR: dwTotalStepsCompleted > dwTotalStepsRequired");
								$("#BtnWipe"+cardchar).prop("disabled", false);
							}
							break;
						case JS_DEFRAG_REQ:

							$("#DefragErrorMark"+cardchar).fadeTo(0,0);
							$("#DefragErrorMark"+cardchar).prop("title","");
							$("#CardError" + cardchar + "DEFRAG").html("");
							$("#cardProg"+cardchar).html("Defragging "+percentage.toFixed(2).slice(0,-3)+"%");
							$("#cardProgCmd"+cardchar).html(JS_DEFRAG_REQ);

							if (progReportNoti.dwTotalStepsCompleted < progReportNoti.dwTotalStepsRequired) {

								$("#cardProg"+cardchar).width(percentage+"%");
								$("#BtnDefrag"+cardchar).prop("disabled", true);

							} else if (progReportNoti.dwTotalStepsCompleted == progReportNoti.dwTotalStepsRequired) {

								$("#cardProgArea"+cardchar).hide();
								$("#cardProg"+cardchar).width("0%");
								$("#cardProg"+cardchar).html("");
								$("#cardProgCmd"+cardchar).html("");
								$("#BtnDefrag"+cardchar).prop("disabled", false);

							} else {
								//steps field not correct
								$("#BtnDefrag"+cardchar).prop("disabled", false);
							}

							break;
						case JS_CONVERT_RAID_TYPE_REQ:

							$("#ConvertErrorMark"+cardchar).hide();
							$("#ConvertErrorMark"+cardchar).prop("title","");
							$("#CardError" + cardchar + "CVT").html("");
							$("#cardProg"+cardchar).html("Converting "+percentage.toFixed(2).slice(0,-3)+"%");
							$("#cardProgCmd"+cardchar).html(JS_CONVERT_RAID_TYPE_REQ);

							if (progReportNoti.dwTotalStepsCompleted < progReportNoti.dwTotalStepsRequired) {
								if ($("#RAIDTypeStr"+cardchar).html() == "Mirror") {
									$("#cardProg"+cardchar).width(percentage+"%");
								} else if ($("#RAIDTypeStr"+cardchar).html() == "JBOD") {
									$("#cardProg"+cardchar).width(percentage+"%");
									$("#cardProg"+cardcharPeer).html("Converting "+percentage.toFixed(2).slice(0,-3));
									$("#cardProgCmd"+cardcharPeer).html(JS_CONVERT_RAID_TYPE_REQ);
									$("#cardProg"+cardcharPeer).width(percentage+"%");
								} else {

								}
							} else if (progReportNoti.dwTotalStepsCompleted == progReportNoti.dwTotalStepsRequired) {
								if ($("#RAIDTypeStr"+cardchar).html() == "Mirror") {
									$("#cardProgArea"+cardchar).hide();
									$("#cardProg"+cardchar).width("0%");
									$("#cardProg"+cardchar).html("");
									$("#cardProgCmd"+cardchar).html("");
								} else if ($("#RAIDTypeStr"+cardchar).html() == "JBOD") {
									$("#cardProgArea"+cardchar).hide();
									$("#cardProgArea"+cardcharPeer).hide();
									$("#cardProg"+cardchar).width("0%");
									$("#cardProg"+cardcharPeer).width("0%");
									$("#cardProg"+cardchar).html("");
									$("#cardProgCmd"+cardchar).html("");
									$("#cardProg"+cardcharPeer).html("");
									$("#cardProgCmd"+cardcharPeer).html("");
								} else {
									//unknow RAID type

								}
								//hide "convert" button
								$("#confirmConvertRAIDType"+cardchar).hide();
								$("#confirmConvertRAIDType"+cardchar).prop("disabled", false);
							} else {
								//steps field is not correct

							}

							break;
						case JS_SYNC_MIRROR_REQ:

							$("#CardError" + cardchar + "SYNC").html("");
							$("#cardProg"+cardchar).html("Syncing "+percentage.toFixed(2).slice(0,-3)+"%");
							$("#cardProgCmd"+cardchar).html(JS_SYNC_MIRROR_REQ);

							if (progReportNoti.dwTotalStepsCompleted < progReportNoti.dwTotalStepsRequired) {

								$("#cardProg"+cardchar).width(percentage+"%");

							} else if (progReportNoti.dwTotalStepsCompleted == progReportNoti.dwTotalStepsRequired) {

								$("#cardProgArea"+cardchar).hide();
								$("#cardProg"+cardchar).width("0%");
								$("#cardProg"+cardchar).html("");
								$("#cardProgCmd"+cardchar).html("");

							} else {
								//steps field not correct

							}

							break;
						default:
							console.log("Command in Progress Notification is not recognized!");
							console.log("progReportNoti.dwCommand="+progReportNoti.dwCommand);
							break;
					}
				} else {
					//error code is NOT 0
					errorMsg = parseErrorCode(progReportNoti.dwErrorCode);
					//reset progress bar for wipe/defrag/convert if error happens to present operation
					//Say wipe has error while convert is in progress, don't reset.
					if (progReportNoti.dwCommand == $("#cardProgCmd"+cardchar).html()) {
						$("#cardProgArea"+cardchar).hide();
						$("#cardProg"+cardchar).width("0%");
						$("#cardProg"+cardchar).html("");
						$("#cardProgCmd"+cardchar).html("");
					}

					if (progReportNoti.dwCommand == JS_CONVERT_RAID_TYPE_REQ) {
						switch ($("#RAIDTypeStr"+cardchar).html()) {
							case "JBOD":
								document.getElementById("RAIDType"+cardchar).selectedIndex = 1;
								break;
							case "Mirror":
								document.getElementById("RAIDType"+cardchar).selectedIndex = 2;
								break;
							default:
								document.getElementById("RAIDType"+cardchar).selectedIndex = 0;
								console.log("convert reset raid type error!");
						}
					}

					if (progReportNoti.dwCommand == JS_CONVERT_RAID_TYPE_REQ && $("#RAIDTypeStr"+cardchar).html() == "JBOD") {
						$("#cardProgArea"+cardcharPeer).hide();
						$("#cardProg"+cardcharPeer).width("0%");
						$("#cardProg"+cardcharPeer).html("");
						$("#cardProgCmd"+cardcharPeer).html("");
					}

					if (progReportNoti.dwCommand == JS_WIPE_MEDIA_REQ) {
						$("#BtnWipe"+cardchar).prop("disabled", false);
					}
					if (progReportNoti.dwCommand == JS_DEFRAG_REQ) {
						$("#BtnDefrag"+cardchar).prop("disabled", false);
					}


					//hide "convert" button
					$("#confirmConvertRAIDType"+cardchar).hide();
					$("#confirmConvertRAIDType"+cardchar).prop("disabled", false);

					//display error message
					//var errorMsg = parseErrorCode(progReportNoti.dwErrorCode);
					console.log("progReportNoti.dwErrorCode="+progReportNoti.dwErrorCode+",progReportNoti.dwCommand="+progReportNoti.dwCommand+","+progReportNoti.dwTotalStepsCompleted+":"+progReportNoti.dwTotalStepsRequired);
						//document.getElementById("CardError"+cardchar).innerHTML = "0x" + Dw2HexString(progReportNoti.dwErrorCode) + "&emsp;&emsp;" + errorMsg.toUpperCase();
					var cmd = "";
					switch(progReportNoti.dwCommand) {
						case JS_WIPE_MEDIA_REQ:
							cmd = "WIPE";
							break;
						case JS_DEFRAG_REQ:
							cmd = "DEFRAG";
							break;
						case JS_CONVERT_RAID_TYPE_REQ:
							cmd = "CVT";
							break;
						case JS_SYNC_MIRROR_REQ:
							cmd = "SYNC";
							break;
						default:
							console.log("progReportNoti wrong cmd!");
					}
					updateCardErrorMsg(cardchar, cmd, progReportNoti.dwErrorCode);
				}
				break;

			case JS_CHANGE_MEDIA_INFO_RES:
				console.log("get JS_CHANGE_MEDIA_INFO_RES!");
				//Read data and save it in "changeMediaInfoRes"
				var changeMediaInfoRes = new ChangeMediaInfoRes();
				changeMediaInfoRes.Read(dv, MsgHeader.Size);

				//Update on Web Interface

				if (changeMediaInfoRes.owCardGUID == $("#GUIDA").html()) {
					cardchar = "A";
				} else if (changeMediaInfoRes.owCardGUID == $("#GUIDB").html()) {
					cardchar = "B";
				} else {
					console.log("No match for GUID in CHANGE_MEDIA_INFO_RES!");
				}

				//hide "changemediainfo" button
				$("#CMediaInfo"+cardchar).fadeOut();

				//changeMediaInfo request comment is empty, then no change will be made for comment.
				//reset comment to previous one
				if ($("#CardDesc"+cardchar).val() == "") {
					var cmtStr = $("#userComment"+cardchar).html();
					$("#CardDesc"+cardchar).val(cmtStr);
				}

				if (changeMediaInfoRes.dwErrorCode != 0) {

					//display error message
					updateCardErrorMsg(cardchar, "CMI", changeMediaInfoRes.dwErrorCode);

					errorMsg = parseErrorCode(changeMediaInfoRes.dwErrorCode);
					var comment = $("#userComment"+cardchar).html();
					if (comment != $("#CardDesc"+cardchar).val()) {
						$("#ChangeMediaInfoCmtErrorMark"+cardchar).prop("title","Error: 0x" + Dw2HexString(changeMediaInfoRes.dwErrorCode) + "  " + errorMsg.toUpperCase());
						$("#ChangeMediaInfoCmtErrorMark"+cardchar).fadeIn();
					}

					if (($("#SWLockStr"+cardchar).html() == "OFF" && $("#SWLock"+cardchar).prop("checked")) || ($("#SWLockStr"+cardchar).html() == "ON" && !$("#SWLock"+cardchar).prop("checked"))) {
						$("#ChangeMediaInfoSWLErrorMark"+cardchar).prop("title","Error: 0x" + Dw2HexString(changeMediaInfoRes.dwErrorCode) + "  " + errorMsg.toUpperCase());
						$("#ChangeMediaInfoSWLErrorMark"+cardchar).fadeIn();
					}
					//console.log("changeMediaInfoRes.dwErrorCode = "+changeMediaInfoRes.dwErrorCode);

					//reset ChangeMediaInfo
					$("#CardDesc"+cardchar).val(comment);
					if ($("#SWLockStr"+cardchar).html() == "ON") {
						$("#SWLock"+cardchar).prop("checked", true);
					} else {
						$("#SWLock"+cardchar).prop("checked", false);
					}
				}
				break;

			case JS_PREP_MEDIA_FOR_EJECT_RES:
				console.log("get JS_PREP_MEDIA_FOR_EJECT_RES!");
				//Read data and save it in "mediaEjectRes"
				var mediaEjectRes = new PrepareMediaForEjectionRes();
				mediaEjectRes.Read(dv, MsgHeader.Size);

				//Update on Web Interface
				if (mediaEjectRes.owGUID == $("#GUIDA").html()) {
					cardchar = "A";
				} else if (mediaEjectRes.owGUID == $("#GUIDB").html()) {
					cardchar = "B";
				} else {
					console.log("No match for GUID in JS_PREP_MEDIA_FOR_EJECT_RES!");
				}

				if (mediaEjectRes.dwErrorCode != 0) {
					//var errorMsg = parseErrorCode(mediaEjectRes.dwErrorCode);
					//document.getElementById("CardError"+cardchar).innerHTML = "EJECT - 0x" + Dw2HexString(mediaEjectRes.dwErrorCode) + "&emsp;" + errorMsg.toUpperCase();
					updateCardErrorMsg(cardchar, "EJECT", mediaEjectRes.dwErrorCode);
					console.log("mediaEjectRes.dwErrorCode = "+mediaEjectRes.dwErrorCode);
				}
				break;

			case JS_MEDIA_INFO_CHANGE_NOTIFY:
				console.log("get MEDIA_INFO_CHANGE_NOTIFY!");
				//Read data and save it in "mediaInfoChangeNoti"
				var mediaInfoChangeNoti = new CardMediaInfoChangedNotification();
				mediaInfoChangeNoti.Read(dv, indata, MsgHeader.Size);

				//console.log(MediaInfoCNFlags & CMIC_FLAGS_MEDIA_IN_USE_MASK);//Flags(bit 0)-Media in use
				//console.log(MediaInfoCNFlags & CMIC_FLAGS_MEDIA_IS_PHYSICALLY_WRITE_PROTECTED_MASK);//Flags(bit 1)-Media is physically write-protected
				//console.log(MediaInfoCNFlags & CMIC_FLAGS_MEDIA_IS_SOFTWARE_WRITE_PROTECTED_MASK);//Flags(bit 2)-Media is software write protected
				//console.log(MediaInfoCNFlags & CMIC_FLAGS_MEDIA_QUIESCE_MASK);//Flags(bit 3)-quiesce in progress

				//Update on Web Interface
				//console.log("mediaInfoChangeNoti.dwSectorSize:"+mediaInfoChangeNoti.dwSectorSize);

				//CardNumber 0x01 for card A and 0x02 for card B
				if (mediaInfoChangeNoti.dwCardNumber == 1) {
					cardchar = "A";
					cardcharPeer = "B";
				} else if (mediaInfoChangeNoti.dwCardNumber == 2) {
					cardchar = "B";
					cardcharPeer = "A";
				} else {

				}

				var cardStatus = "";
				switch(mediaInfoChangeNoti.dwReasonCode) {
					case 0:
						cardStatus = "NEW CONNECTION";
						break;
					case 1:
						cardStatus = "CARD INSERTED";
						break;
					case 2:
						cardStatus = "CARD REMOVED";
						break;
					case 3:
						cardStatus = "CHANGED BY REQUEST";
						break;
					case 4:
						cardStatus = "PARTITION MOUNTED";
						break;
					case 5:
						cardStatus = "PARTITION DISMOUNTED";
						break;
					case 6:
						cardStatus = "MEDIA EJECT REQUESTED";
						break;
					case 7:
						cardStatus = "CARD UNRECOGNIZED";
						if ($("#GUID"+cardcharPeer).html()!="" && $("#GUID"+cardcharPeer).html()!="00000000000000000000000000000000") {
							if ($("#RAIDTypeStr"+cardcharPeer).html()=="Mirror") {
								$("#syncBtn"+cardchar).show();
							}
						}
						break;
					default:
						cardStatus = "UNKNOWN STATUS";
						break;
				}


				//check card HW lock flag
				if ((mediaInfoChangeNoti.dwFlags & CMIC_FLAGS_MEDIA_IS_PHYSICALLY_WRITE_PROTECTED_MASK) != 0) {

					document.getElementById("HWLock"+cardchar).checked = true;

				} else {

					document.getElementById("HWLock"+cardchar).checked = false;

				}

				//check card SW lock flag
				if ((mediaInfoChangeNoti.dwFlags & CMIC_FLAGS_MEDIA_IS_SOFTWARE_WRITE_PROTECTED_MASK) != 0) {

					$("#SWLock"+cardchar).prop("checked" ,true);
					$("#SWLockStr"+cardchar).html("ON");

				} else {

					$("#SWLock"+cardchar).prop("checked" ,false);
					$("#SWLockStr"+cardchar).html("OFF");

				}

				//check isPrimary flag
				if ((mediaInfoChangeNoti.dwFlags & CMIC_FLAGS_MEDIA_IS_PRIMARY_MIRROR_MASK) != 0) {
					$("#isPrimary"+cardchar).html("YES");
				} else {
					$("#isPrimary"+cardchar).html("NO");
				}

				//update MediaSize
				if (mediaInfoChangeNoti.cbySizeOfMedia >= Math.pow(2,30)) {

					document.getElementById("mediaSize"+cardchar).innerHTML = (mediaInfoChangeNoti.cbySizeOfMedia/Math.pow(2,30)).toFixed(2) + "&nbsp;GB";
					$("#cardSize"+cardchar).html(mediaInfoChangeNoti.cbySizeOfMedia);

				} else if (mediaInfoChangeNoti.cbySizeOfMedia >= Math.pow(2,20)) {

					document.getElementById("mediaSize"+cardchar).innerHTML = (mediaInfoChangeNoti.cbySizeOfMedia/Math.pow(2,20)).toFixed(2) + "&nbsp;MB";
					$("#cardSize"+cardchar).html(mediaInfoChangeNoti.cbySizeOfMedia);

				} else if (mediaInfoChangeNoti.cbySizeOfMedia >= Math.pow(2,10)) {

					document.getElementById("mediaSize"+cardchar).innerHTML = (mediaInfoChangeNoti.cbySizeOfMedia/Math.pow(2,10)).toFixed(2) + "&nbsp;KB";
					$("#cardSize"+cardchar).html(mediaInfoChangeNoti.cbySizeOfMedia);

				} else if (mediaInfoChangeNoti.cbySizeOfMedia >= 0) {

					document.getElementById("mediaSize"+cardchar).innerHTML = (mediaInfoChangeNoti.cbySizeOfMedia).toFixed(2) + "&nbsp;B";
					$("#cardSize"+cardchar).html(mediaInfoChangeNoti.cbySizeOfMedia);

				}
				//console.log("mediaInfoChangeNoti.cbySizeOfMedia="+mediaInfoChangeNoti.cbySizeOfMedia);
				//console.log("mediaInfoChangeNoti.dwSectorSize="+mediaInfoChangeNoti.dwSectorSize);

				//update RAID Type
				if (mediaInfoChangeNoti.dwRAIDType == 0) {

					document.getElementById("RAIDType"+cardchar).selectedIndex = 1;
					$("#RAIDTypeStr"+cardchar).html("JBOD");
					$("#syncBtn"+cardcharPeer).hide();

				} else if (mediaInfoChangeNoti.dwRAIDType == 1) {

					document.getElementById("RAIDType"+cardchar).selectedIndex = 2;
					$("#RAIDTypeStr"+cardchar).html("Mirror");
					if ($("#GUID"+cardcharPeer).html()!="" && $("#GUID"+cardcharPeer).html()!="00000000000000000000000000000000") {
						$("#syncBtn"+cardcharPeer).show();
					}

				} else {
					//unknow RAID type

				}

				document.getElementById("GUID"+cardchar).innerHTML = mediaInfoChangeNoti.owCardGUID;
				document.getElementById("manString"+cardchar).innerHTML = mediaInfoChangeNoti.achManufacturer;
				document.getElementById("CardDesc"+cardchar).value = decodeURI(mediaInfoChangeNoti.achUserComment);
				document.getElementById("userComment"+cardchar).innerHTML = decodeURI(mediaInfoChangeNoti.achUserComment);
				//document.getElementById("CardError"+cardchar).innerHTML = "";
				clearCardErrorMsg(cardchar);
				document.getElementById("CardStatus"+cardchar).innerHTML = cardStatus;
				$("#CardStatus"+cardchar).effect("pulsate",{times:1},1500);

				if (mediaInfoChangeNoti.dwSectorSize != 0) {
					//card is present

					if (mediaInfoChangeNoti.dwReasonCode == 2) {
						//card status is removed, disable all operations on card
						document.getElementById("RAIDType"+cardchar).disabled = true;
						document.getElementById("SWLock"+cardchar).disabled = true;
						document.getElementById("CardDesc"+cardchar).disabled = true;
						document.getElementById("BtnWipe"+cardchar).disabled = true;
						document.getElementById("BtnDefrag"+cardchar).disabled = true;
						document.getElementById("BtnEject"+cardchar).disabled = true;

					} else if (mediaInfoChangeNoti.dwReasonCode == 7) {
						//card status is unrecognized, disable all operations except wipe and eject
						document.getElementById("RAIDType"+cardchar).disabled = true;
						document.getElementById("SWLock"+cardchar).disabled = true;
						document.getElementById("CardDesc"+cardchar).disabled = true;
						document.getElementById("BtnWipe"+cardchar).disabled = false;
						document.getElementById("BtnDefrag"+cardchar).disabled = true;
						document.getElementById("BtnEject"+cardchar).disabled = false;


					} else {

						document.getElementById("RAIDType"+cardchar).disabled = false;
						document.getElementById("SWLock"+cardchar).disabled = false;
						document.getElementById("CardDesc"+cardchar).disabled = false;
						document.getElementById("BtnWipe"+cardchar).disabled = false;
						document.getElementById("BtnDefrag"+cardchar).disabled = false;
						document.getElementById("BtnEject"+cardchar).disabled = false;

					}
				} else {
					//card is not present

					//display default RAID type
					document.getElementById("RAIDType"+cardchar).selectedIndex = 0;
					$("#RAIDTypeStr"+cardchar).html("---");
					//hide mirror sync
					$("#syncBtnA").hide();
					$("#syncBtnB").hide();
					//no operation is allowed
					document.getElementById("RAIDType"+cardchar).disabled = true;
					document.getElementById("SWLock"+cardchar).disabled = true;
					document.getElementById("CardDesc"+cardchar).disabled = true;
					document.getElementById("BtnWipe"+cardchar).disabled = true;
					document.getElementById("BtnDefrag"+cardchar).disabled = true;
					document.getElementById("BtnEject"+cardchar).disabled = true;

					//reset upload/download offset area
					var cardnum = 0;
					if (cardchar == "A") {
						cardnum = 1;
					} else if (cardchar == "B") {
						cardnum = 2;
					} else {
						console.log("MediaChangeInfo error, cardchar="+ cardchar);
					}

					for (var i=0; i<MAX_PARTITION_PER_CARD; i++) {
						$("#uploadFileStart"+cardnum+i).html(0);
						$("#uploadOffset"+cardnum+i).html(0);
						//$("#uploadFileSize"+cardnum+i).html(0);  //The file size will get updated every time an upload is issued.
						$("#downloadOffset"+cardnum+i).html(0);
					}

					//ignore card status in MediaChangeInfo notification
					document.getElementById("CardStatus"+cardchar).innerHTML = "CARD NOT PRESENT";
				}


				$("#CMediaInfo"+cardchar).fadeOut();
				$("#confirmConvertRAIDType"+cardchar).fadeOut();

				break;

			case JS_DEL_PART_RES:
				console.log("get JS_DEL_PART_RES!");
				//Read data and save it in "deletePartRes"
				var deletePartRes = new DeletePartitionRes();
				deletePartRes.Read(dv, MsgHeader.Size);

				//Update on Web Interface
				//console.log("deletePartRes.owPUID = "+deletePartRes.owPUID);
				PUIDindex = getPUIDindex(deletePartRes.owPUID);
				if (deletePartRes.dwErrorCode != 0){
					errorMsg = parseErrorCode(deletePartRes.dwErrorCode);
					$("#partActError"+PUIDindex).html("ErrorCode: 0x" + Dw2HexString(deletePartRes.dwErrorCode) + "&emsp;&emsp;" + errorMsg.toUpperCase());
				} else {
					//clear partition activity error message
					$("#partActError"+PUIDindex).html("");
				}

				break;
			case JS_BREAK_MIRROR_RES:
				console.log("get JS_BREAK_MIRROR_RES!");
				//Read data and save it in "breakMirrorRes"
				var breakMirrorRes = new BreakMirrorRes();
				breakMirrorRes.Read(dv, MsgHeader.Size);

				//Update on Web Interface

				/*process data
				console.log(dv.getUint32(16,true) + dv.getUint32(20,true) * Math.pow(2,32));//owPUID
				console.log(dv.getUint32(32,true));//dwErrorCode
				*/
				break;
			case JS_PART_PROGRESS_NOTIFY:
				console.log("get JS_PART_PROGRESS_NOTIFY!");
				//Read data and save it in "partProgNoti"
				var partProgNoti = new PartitionProgressNotification();
				partProgNoti.Read(dv, MsgHeader.Size);

				//Update on Web Interface
				PUIDindex = getPUIDindex(partProgNoti.owPUID);

				//console.log("partProgNoti.dwCommand:"+partProgNoti.dwCommand);
				//console.log("partProgNoti.dwFlags:"+partProgNoti.dwFlags);

				if (PUIDindex != "") {

					//while partition operation is in progress, receive PartitionListUpdateNotification.
					//Then progress bar for both mirror and its peer will show up. Only one is needed.
					if ($("#partType"+PUIDindex).html() == "Mirror") {
						var PeerPUID = $("#PeerPUIDStr"+PUIDindex).html();
						var PeerPUIDindex = getPUIDindex(PeerPUID);
						//hide peer partition progress bar if it's displayed
						if (document.getElementById("partProgArea"+PeerPUIDindex).style.display != "none") {
							document.getElementById("partProgArea"+PeerPUIDindex).style.display = "none";
						}
					}


					if (partProgNoti.dwErrorCode == 0) {

						//clear error message
						$("#partActError"+PUIDindex).html("");

						percentage = 100*partProgNoti.dwOperationCompleted/partProgNoti.dwOperationRequired;

						switch(partProgNoti.dwCommand) {
							case JS_REBUILD_PART_REQ:
								console.log("value:"+partProgNoti.dwOperationCompleted+":"+partProgNoti.dwOperationRequired);
								$("#partProg"+PUIDindex).html("Rebuilding "+percentage.toFixed(2).slice(0,-3)+"%");
								$("#partProgCmd"+PUIDindex).html(JS_REBUILD_PART_REQ);
								if (partProgNoti.dwOperationCompleted < partProgNoti.dwOperationRequired) {

									$("#partProg"+PUIDindex).width(percentage+"%");

								} else if (partProgNoti.dwOperationCompleted == partProgNoti.dwOperationRequired) {

									$("#partProgArea"+PUIDindex).hide();
									$("#partProg"+PUIDindex).width("0%");
									$("#partProg"+PUIDindex).html("");
									$("#partProgCmd"+PUIDindex).html("");

									//enable partition activity list
									$("#actOptionDelete"+PUIDindex).addClass("activityOption");
									document.getElementById("actOptionDelete"+PUIDindex).onclick = function(){showConfirmDelete(PUIDindex);};
									$("#actOptionFormat"+PUIDindex).addClass("activityOption");
									document.getElementById("actOptionFormat"+PUIDindex).onclick = function(){showConfirmFormat(PUIDindex);};
									$("#actOptionRebuild"+PUIDindex).addClass("activityOption");
									document.getElementById("actOptionRebuild"+PUIDindex).onclick = function(){showConfirmRebuild(PUIDindex);};
									$("#actOptionResize"+PUIDindex).addClass("activityOption");
									document.getElementById("actOptionResize"+PUIDindex).onclick = function(){showConfirmResize(PUIDindex);};
									$("#actOptionVerify"+PUIDindex).addClass("activityOption");
									document.getElementById("actOptionVerify"+PUIDindex).onclick = function(){showConfirmVerify(PUIDindex);};
									$("#actOptionShareUnshare"+PUIDindex).addClass("activityOption");
									if ($("#actOptionShareUnshare"+PUIDindex).html().trim() == "Share") {
										document.getElementById("actOptionShareUnshare"+PUIDindex).onclick = function(){showConfirmShare(PUIDindex);};
									} else {
										document.getElementById("actOptionShareUnshare"+PUIDindex).onclick = function(){showConfirmUnshare(PUIDindex);};
									}

									ArrowPosition(ACT_IDLE, PUIDindex);
									$('#arrow'+PUIDindex).fadeTo(1000,1);

								} else {
									//step info error

								}
								break;
							case JS_FORMAT_PART_REQ:
								console.log("value:"+partProgNoti.dwOperationCompleted+":"+partProgNoti.dwOperationRequired);
								$("#partProg"+PUIDindex).html("Formatting "+percentage.toFixed(2).slice(0,-3)+"%");
								$("#partProgCmd"+PUIDindex).html(JS_FORMAT_PART_REQ);
								if (partProgNoti.dwOperationCompleted < partProgNoti.dwOperationRequired) {

									$("#partProg"+PUIDindex).width(percentage+"%");

								} else if (partProgNoti.dwOperationCompleted == partProgNoti.dwOperationRequired) {

									$("#partProgArea"+PUIDindex).hide();
									$("#partProg"+PUIDindex).width("0%");
									$("#partProg"+PUIDindex).html("");
									$("#partProgCmd"+PUIDindex).html("");

									//enable partition activity list
									$("#actOptionDelete"+PUIDindex).addClass("activityOption");
									document.getElementById("actOptionDelete"+PUIDindex).onclick = function(){showConfirmDelete(PUIDindex);};
									$("#actOptionFormat"+PUIDindex).addClass("activityOption");
									document.getElementById("actOptionFormat"+PUIDindex).onclick = function(){showConfirmFormat(PUIDindex);};
									$("#actOptionRebuild"+PUIDindex).addClass("activityOption");
									document.getElementById("actOptionRebuild"+PUIDindex).onclick = function(){showConfirmRebuild(PUIDindex);};
									$("#actOptionResize"+PUIDindex).addClass("activityOption");
									document.getElementById("actOptionResize"+PUIDindex).onclick = function(){showConfirmResize(PUIDindex);};
									$("#actOptionVerify"+PUIDindex).addClass("activityOption");
									document.getElementById("actOptionVerify"+PUIDindex).onclick = function(){showConfirmVerify(PUIDindex);};
									$("#actOptionShareUnshare"+PUIDindex).addClass("activityOption");
									if ($("#actOptionShareUnshare"+PUIDindex).html().trim() == "Share") {
										document.getElementById("actOptionShareUnshare"+PUIDindex).onclick = function(){showConfirmShare(PUIDindex);};
									} else {
										document.getElementById("actOptionShareUnshare"+PUIDindex).onclick = function(){showConfirmUnshare(PUIDindex);};
									}

									ArrowPosition(ACT_IDLE, PUIDindex);
									$('#arrow'+PUIDindex).fadeTo(1000,1);

								} else {
									//step info error

								}
								break;
							case JS_RESIZE_PART_REQ:
								console.log("value:"+partProgNoti.dwOperationCompleted+":"+partProgNoti.dwOperationRequired);
								$("#partProg"+PUIDindex).html("Resizing "+percentage.toFixed(2).slice(0,-3)+"%");
								$("#partProgCmd"+PUIDindex).html(JS_RESIZE_PART_REQ);
								if (partProgNoti.dwOperationCompleted < partProgNoti.dwOperationRequired) {

									$("#partProg"+PUIDindex).width(percentage+"%");

								} else if (partProgNoti.dwOperationCompleted == partProgNoti.dwOperationRequired) {

									$("#partProgArea"+PUIDindex).hide();
									$("#partProg"+PUIDindex).width("0%");
									$("#partProg"+PUIDindex).html("");
									$("#partProgCmd"+PUIDindex).html("");

									//enable partition activity list
									$("#actOptionDelete"+PUIDindex).addClass("activityOption");
									document.getElementById("actOptionDelete"+PUIDindex).onclick = function(){showConfirmDelete(PUIDindex);};
									$("#actOptionFormat"+PUIDindex).addClass("activityOption");
									document.getElementById("actOptionFormat"+PUIDindex).onclick = function(){showConfirmFormat(PUIDindex);};
									$("#actOptionRebuild"+PUIDindex).addClass("activityOption");
									document.getElementById("actOptionRebuild"+PUIDindex).onclick = function(){showConfirmRebuild(PUIDindex);};
									$("#actOptionResize"+PUIDindex).addClass("activityOption");
									document.getElementById("actOptionResize"+PUIDindex).onclick = function(){showConfirmResize(PUIDindex);};
									$("#actOptionVerify"+PUIDindex).addClass("activityOption");
									document.getElementById("actOptionVerify"+PUIDindex).onclick = function(){showConfirmVerify(PUIDindex);};
									$("#actOptionShareUnshare"+PUIDindex).addClass("activityOption");
									if ($("#actOptionShareUnshare"+PUIDindex).html().trim() == "Share") {
										document.getElementById("actOptionShareUnshare"+PUIDindex).onclick = function(){showConfirmShare(PUIDindex);};
									} else {
										document.getElementById("actOptionShareUnshare"+PUIDindex).onclick = function(){showConfirmUnshare(PUIDindex);};
									}

									ArrowPosition(ACT_IDLE, PUIDindex);
									$('#arrow'+PUIDindex).fadeTo(1000,1);

								} else {
									//step info error
									console.log("Error: partProgNoti.dwOperationCompleted > partProgNoti.dwOperationRequired");
								}
								break;
							case JS_VERIFY_PART_REQ:
								//console.log("value:"+partProgNoti.dwOperationCompleted+":"+partProgNoti.dwOperationRequired);
								$("#partProg"+PUIDindex).html("Verifying "+percentage.toFixed(2).slice(0,-3)+"%");
								$("#partProgCmd"+PUIDindex).html(JS_VERIFY_PART_REQ);
								if (partProgNoti.dwOperationCompleted < partProgNoti.dwOperationRequired) {

									$("#partProg"+PUIDindex).width(percentage+"%");

								} else if (partProgNoti.dwOperationCompleted == partProgNoti.dwOperationRequired) {

									$("#partProgArea"+PUIDindex).hide();
									$("#partProg"+PUIDindex).width("0%");
									$("#partProg"+PUIDindex).html("");
									$("#partProgCmd"+PUIDindex).html("");

									//enable partition activity list
									$("#actOptionDelete"+PUIDindex).addClass("activityOption");
									document.getElementById("actOptionDelete"+PUIDindex).onclick = function(){showConfirmDelete(PUIDindex);};
									$("#actOptionFormat"+PUIDindex).addClass("activityOption");
									document.getElementById("actOptionFormat"+PUIDindex).onclick = function(){showConfirmFormat(PUIDindex);};
									$("#actOptionRebuild"+PUIDindex).addClass("activityOption");
									document.getElementById("actOptionRebuild"+PUIDindex).onclick = function(){showConfirmRebuild(PUIDindex);};
									$("#actOptionResize"+PUIDindex).addClass("activityOption");
									document.getElementById("actOptionResize"+PUIDindex).onclick = function(){showConfirmResize(PUIDindex);};
									$("#actOptionVerify"+PUIDindex).addClass("activityOption");
									document.getElementById("actOptionVerify"+PUIDindex).onclick = function(){showConfirmVerify(PUIDindex);};
									$("#actOptionShareUnshare"+PUIDindex).addClass("activityOption");
									if ($("#actOptionShareUnshare"+PUIDindex).html().trim() == "Share") {
										document.getElementById("actOptionShareUnshare"+PUIDindex).onclick = function(){showConfirmShare(PUIDindex);};
									} else {
										document.getElementById("actOptionShareUnshare"+PUIDindex).onclick = function(){showConfirmUnshare(PUIDindex);};
									}

									ArrowPosition(ACT_IDLE, PUIDindex);
									$('#arrow'+PUIDindex).fadeTo(1000,1);

								} else {
									//step info error

								}
								break;
							default:
								console.log("Command in Partition Progress Notification is not recognized!!!");
								break;
						}
					} else {
						//error code is not zero
						console.log("partProgress ErrorCode:"+partProgNoti.dwErrorCode);

						//reset progress bar
						$("#partProgArea"+PUIDindex).hide();
						$("#partProg"+PUIDindex).width("0%");
						$("#partProg"+PUIDindex).html("");
						$("#partProgCmd"+PUIDindex).html("");

						//enable partition activity list
						$("#actOptionDelete"+PUIDindex).addClass("activityOption");
						document.getElementById("actOptionDelete"+PUIDindex).onclick = function(){showConfirmDelete(PUIDindex);};
						$("#actOptionFormat"+PUIDindex).addClass("activityOption");
						document.getElementById("actOptionFormat"+PUIDindex).onclick = function(){showConfirmFormat(PUIDindex);};
						$("#actOptionRebuild"+PUIDindex).addClass("activityOption");
						document.getElementById("actOptionRebuild"+PUIDindex).onclick = function(){showConfirmRebuild(PUIDindex);};
						$("#actOptionResize"+PUIDindex).addClass("activityOption");
						document.getElementById("actOptionResize"+PUIDindex).onclick = function(){showConfirmResize(PUIDindex);};
						$("#actOptionVerify"+PUIDindex).addClass("activityOption");
						document.getElementById("actOptionVerify"+PUIDindex).onclick = function(){showConfirmVerify(PUIDindex);};
						$("#actOptionShareUnshare"+PUIDindex).addClass("activityOption");
						if ($("#actOptionShareUnshare"+PUIDindex).html().trim() == "Share") {
							document.getElementById("actOptionShareUnshare"+PUIDindex).onclick = function(){showConfirmShare(PUIDindex);};
						} else {
							document.getElementById("actOptionShareUnshare"+PUIDindex).onclick = function(){showConfirmUnshare(PUIDindex);};
						}

						//reset activity arrow
						ArrowPosition(ACT_IDLE, PUIDindex);
						$('#arrow'+PUIDindex).fadeTo(1000,1);

						//show error message
						errorMsg = parseErrorCode(partProgNoti.dwErrorCode);
						$("#partActError"+PUIDindex).html("ErrorCode: 0x" + Dw2HexString(partProgNoti.dwErrorCode) + "&emsp;&emsp;" + errorMsg.toUpperCase());
					}
				} else {
					//no PUID match, show partProgNoti.dwErrorCode???
					console.log("partProgress ErrorCode:"+partProgNoti.dwErrorCode);
				}


				break;

			case JS_DEFINE_PART_RES:
				console.log("get JS_DEFINE_PART_RES!");
				//Read data and save it in "definePartRes"
				var definePartRes = new DefinePartitionRes();
				definePartRes.Read(dv, MsgHeader.Size);

				//Update on Web Interface
				if (definePartRes.owCardGUID == $("#GUIDA").html()) {
					cardchar = "A";
				} else if (definePartRes.owCardGUID == $("#GUIDB").html()) {
					cardchar = "B";
				} else {
					console.log("Wrong GUID in DEFINE_PART_RES!");
				}
				//console.log("definePartRes.owPUID = "+definePartRes.owPUID);
				if (definePartRes.dwErrorCode != 0) {

					errorMsg = parseErrorCode(definePartRes.dwErrorCode);
					$("#definePartErrorMsg"+cardchar).html( "ErrorCode: 0x" + Dw2HexString(definePartRes.dwErrorCode) + "&emsp;&emsp;" + errorMsg.toUpperCase() );
				} else {
					$("#definePartErrorMsg"+cardchar).html("");
				}

				//print msg in console
				/*console.log("GUID:"+definePartRes.owCardGUID);
				console.log("PUID:"+definePartRes.owPUID);
				console.log("PeerPUID:"+definePartRes.owPeerPUID);
				console.log("ErrorCode:"+definePartRes.dwErrorCode);*/

				break;
			case JS_SET_PART_OPTIONS_RES:
				console.log("get JS_SET_PART_RES!");
				//Read data and save it in "setPartRes"
				var setPartRes = new SetPartitionRes();
				setPartRes.Read(dv, MsgHeader.Size);

				//Update on Web Interface
				PUIDindex = getPUIDindex(setPartRes.owPUID);

				if (setPartRes.dwErrorCode != 0) {
					//reset all partition options
					ResetPartOp(PUIDindex);
					//show error code
					errorMsg = parseErrorCode(setPartRes.dwErrorCode);
					$("#SetPartError"+PUIDindex).html("ErrorCode: 0x" + Dw2HexString(setPartRes.dwErrorCode) + "&emsp;&emsp;" + errorMsg.toUpperCase() + "&emsp;&emsp;");

				} else {
					//succeed
					$("#SetPartError"+PUIDindex).html("");

				}
				//console.log("error code:"+setPartRes.dwErrorCode);
				break;
			case JS_CLAIM_PART_RES:
				console.log("get JS_CLAIM_PART_RES!");
				//Read data and save it in "claimPartRes"
				var claimPartRes = new ClaimPartitionRes();
				claimPartRes.Read(dv, MsgHeader.Size);

				//Update on Web Interface
				PUIDindex = getPUIDindex(claimPartRes.owPUID);

				if (claimPartRes.dwErrorCode != 0) {
					//hide update reminder
					$("#updateReminder"+PUIDindex).hide();
					//reset claim type
					if (document.getElementById("ClaimType"+PUIDindex).options[0].defaultSelected) {
						document.getElementById("ClaimType"+PUIDindex).selectedIndex = 0;
					} else if (document.getElementById("ClaimType"+PUIDindex).options[1].defaultSelected) {
						document.getElementById("ClaimType"+PUIDindex).selectedIndex = 1;
					} else if (document.getElementById("ClaimType"+PUIDindex).options[2].defaultSelected) {
						document.getElementById("ClaimType"+PUIDindex).selectedIndex = 2;
					}

					//disable update button
					$("#update"+PUIDindex).prop("disabled", true);
					//show error code
					errorMsg = parseErrorCode(claimPartRes.dwErrorCode);
					$("#SetPartError"+PUIDindex).html("ErrorCode: 0x" + Dw2HexString(claimPartRes.dwErrorCode) + "&emsp;&emsp;" + errorMsg.toUpperCase() + "&emsp;&emsp;");

				} else {
					//succeed
					$("#SetPartError"+PUIDindex).html("");

				}
				//console.log("claim ErrorCode:"+claimPartRes.dwErrorCode);

				break;
			case JS_RELEASE_PART_RES:
				console.log("get JS_RELEASE_PART_RES!");
				//Read data and save it in "releasePartRes"
				var releasePartRes = new ReleasePartitionRes();
				releasePartRes.Read(dv, MsgHeader.Size);

				//Update on Web Interface
				PUIDindex = getPUIDindex(releasePartRes.owPUID);
				if (releasePartRes.dwErrorCode != 0) {
					//hide update reminder
					$("#updateReminder"+PUIDindex).hide();
					//disable update button
					$("#update"+PUIDindex).prop("disabled", true);
					//show error code
					errorMsg = parseErrorCode(releasePartRes.dwErrorCode);
					$("#SetPartError"+PUIDindex).html("ErrorCode: 0x" + Dw2HexString(releasePartRes.dwErrorCode) + "&emsp;&emsp;" + errorMsg.toUpperCase() + "&emsp;&emsp;");

					//console.log("releasePartRes.dwErrorCode="+releasePartRes.dwErrorCode);
				} else {
					//succeed
					$("#SetPartError"+PUIDindex).html("");

				}

				break;
			case JS_SHARE_PART_RES:
				console.log("get JS_SHARE_PART_RES!");
				//Read data and save it in "sharePartRes"
				var sharePartRes = new SharePartitionRes();
				sharePartRes.Read(dv, MsgHeader.Size);

				//Updata on Web Interface

				//show error message
				if (sharePartRes.dwErrorCode != 0) {
					PUIDindex = getPUIDindex(sharePartRes.owPUID);
					errorMsg = parseErrorCode(sharePartRes.dwErrorCode);
					$("#partActError"+PUIDindex).html("ErrorCode: 0x" + Dw2HexString(sharePartRes.dwErrorCode) + "&emsp;&emsp;" + errorMsg.toUpperCase());
				}
				//console.log("share ErrorCode:"+sharePartRes.dwErrorCode);

				break;
			case JS_UNSHARE_PART_RES:
				console.log("get JS_UNSHARE_PART_RES!");
				//Read data and save it in "unsharePartRes"
				var unsharePartRes = new UnsharePartitionRes();
				unsharePartRes.Read(dv, MsgHeader.Size);

				//Update on Web Interface
				if (unsharePartRes.dwErrorCode != 0) {
					PUIDindex = getPUIDindex(unsharePartRes.owPUID);
					errorMsg = parseErrorCode(unsharePartRes.dwErrorCode);
					$("#partActError"+PUIDindex).html("ErrorCode: 0x" + Dw2HexString(unsharePartRes.dwErrorCode) + "&emsp;&emsp;" + errorMsg.toUpperCase());
				}
				//console.log("unshare ErrorCode:"+unsharePartRes.dwErrorCode);

				break;
			case JS_SD_RAW_REGISTERS_RES:
				console.log("get JS_SD_RAW_REGISTERS_RES!");
				//Read data and save it in "sdRawRegistersRes"
				var sdRawRegistersRes = new ReadRawRegistersRes();
				sdRawRegistersRes.Read(dv, MsgHeader.Size);

				//Update on Web Interface
				if (sdRawRegistersRes.dwErrorCode == 0) {

					if (sdRawRegistersRes.owCardGUID == $("#GUIDA").html()) {
						cardchar = "A";
						cardcharPeer = "B";
					} else if (sdRawRegistersRes.owCardGUID == $("#GUIDB").html()) {
						cardchar = "B";
						cardcharPeer = "A";
					} else {
						console.log("Wrong GUID in SD_RAW_REGISTERS_RES!");
					}

					$("#OCR"+cardchar).html("0x"+Dw2HexString(sdRawRegistersRes.sdRawRegisters.dwOCR));
					$("#CID0"+cardchar).html("0x"+Dw2HexString(sdRawRegistersRes.sdRawRegisters.dwCID[0]));
					$("#CID1"+cardchar).html("0x"+Dw2HexString(sdRawRegistersRes.sdRawRegisters.dwCID[1]));
					$("#CID2"+cardchar).html("0x"+Dw2HexString(sdRawRegistersRes.sdRawRegisters.dwCID[2]));
					$("#CID3"+cardchar).html("0x"+Dw2HexString(sdRawRegistersRes.sdRawRegisters.dwCID[3]));
					$("#CSD0"+cardchar).html("0x"+Dw2HexString(sdRawRegistersRes.sdRawRegisters.dwCSD[0]));
					$("#CSD1"+cardchar).html("0x"+Dw2HexString(sdRawRegistersRes.sdRawRegisters.dwCSD[1]));
					$("#CSD2"+cardchar).html("0x"+Dw2HexString(sdRawRegistersRes.sdRawRegisters.dwCSD[2]));
					$("#CSD3"+cardchar).html("0x"+Dw2HexString(sdRawRegistersRes.sdRawRegisters.dwCSD[3]));
					$("#RCA"+cardchar).html("0x"+Dw2HexString(sdRawRegistersRes.sdRawRegisters.dwRCA));
					$("#DSR"+cardchar).html("0x"+Dw2HexString(sdRawRegistersRes.sdRawRegisters.dwDSR));
					$("#SCR"+cardchar).html("0x"+Dw2HexString(sdRawRegistersRes.sdRawRegisters.dwSCR));

					$("#RawReg"+cardchar).fadeIn();
					$("#RawReg"+cardcharPeer).fadeOut();
					$("#sdRawRegTable").fadeIn();

				} else {
					//error
					console.log("sdRawRegistersRes.dwErrorCode:"+sdRawRegistersRes.dwErrorCode);
					$("#sdRawRegTable").fadeOut();
					$("#RawRegA").fadeOut();
					$("#RawRegB").fadeOut();
				}

				break;

			case JS_CANCEL_QUEUED_TASK_RES:
				console.log("get JS_CANCEL_QUEUED_TASK_RES!");
				//Read data and save it in "cancelQueuedTaskRes"
				var cancelQueuedTaskRes = new CancelQueuedTaskRes();
				cancelQueuedTaskRes.Read(dv, MsgHeader.Size);

				//check UID to see if it's GUID
				if (cancelQueuedTaskRes.owUID == $("#GUIDA").html()) {
					cardchar = "A";
				} else if (cancelQueuedTaskRes.owUID == $("#GUIDB").html()) {
					cardchar = "B";
				} else {
					//UID is not GUID

				}

				//Update on Web Interface
				if (cardchar == "A" || cardchar == "B") {
					if (cancelQueuedTaskRes.dwErrorCode == 0) {
						//hide progress bar
						$("#cardProgArea"+cardchar).hide();

						//reset progress bar
						$("#cardProg"+cardchar).width("0%");
						$("#cardProg"+cardchar).html("");
						$("#cardProgCmd"+cardchar).html("");

						//enable convert button
						$("#confirmConvertRAIDType"+cardchar).prop("disabled", false);
					} else {
						//var errorMsg = parseErrorCode(cancelQueuedTaskRes.dwErrorCode);
						//document.getElementById("CardError"+cardchar).innerHTML = "CANCEL - 0x" + Dw2HexString(cancelQueuedTaskRes.dwErrorCode) + "&emsp;" + errorMsg.toUpperCase();
						updateCardErrorMsg(cardchar, "CANCEL", cancelQueuedTaskRes.dwErrorCode);
					}
				} else if (cardchar == "") {
					PUIDindex = getPUIDindex(cancelQueuedTaskRes.owUID);

					if (cancelQueuedTaskRes.dwErrorCode == 0) {
						//hide progress bar
						$("#partProgArea"+PUIDindex).hide();
						//reset activity arrow position
						ArrowPosition(ACT_IDLE, PUIDindex);
						$('#arrow'+PUIDindex).fadeTo(1000,1);
						//reset the progress bar
						$("#partProg"+PUIDindex).width("0%");
						$("#partProg"+PUIDindex).html("");
						$("#partProgCmd"+PUIDindex).html("");

						//enable partition activity list
						$("#actOptionDelete"+PUIDindex).addClass("activityOption");
						document.getElementById("actOptionDelete"+PUIDindex).onclick = function(){showConfirmDelete(PUIDindex);};
						$("#actOptionFormat"+PUIDindex).addClass("activityOption");
						document.getElementById("actOptionFormat"+PUIDindex).onclick = function(){showConfirmFormat(PUIDindex);};
						$("#actOptionRebuild"+PUIDindex).addClass("activityOption");
						document.getElementById("actOptionRebuild"+PUIDindex).onclick = function(){showConfirmRebuild(PUIDindex);};
						$("#actOptionResize"+PUIDindex).addClass("activityOption");
						document.getElementById("actOptionResize"+PUIDindex).onclick = function(){showConfirmResize(PUIDindex);};
						$("#actOptionVerify"+PUIDindex).addClass("activityOption");
						document.getElementById("actOptionVerify"+PUIDindex).onclick = function(){showConfirmVerify(PUIDindex);};
						$("#actOptionShare"+PUIDindex).addClass("activityOption");
						if ($("#actOptionShareUnshare"+PUIDindex).html().trim() == "Share") {
							document.getElementById("actOptionShareUnshare"+PUIDindex).onclick = function(){showConfirmShare(PUIDindex);};
						} else {
							document.getElementById("actOptionShareUnshare"+PUIDindex).onclick = function(){showConfirmUnshare(PUIDindex);};
						}
					} else {
						errorMsg = parseErrorCode(cancelQueuedTaskRes.dwErrorCode);
						$("#partActError"+PUIDindex).html("ErrorCode: 0x" + Dw2HexString(cancelQueuedTaskRes.dwErrorCode) + "&emsp;&emsp;" + errorMsg.toUpperCase());

						console.log("cancelQueuedTaskRes.dwErrorCode="+cancelQueuedTaskRes.dwErrorCode);
					}
				}

				break;

			case JS_RAID_SETTING_RES:
				console.log("get JS_RAID_SETTING_RES!");
				//Read data and save it in "RAIDSettingRes"
				var RAIDSettingRes = new ChangeRAIDSettingRes();
				RAIDSettingRes.Read(dv, MsgHeader.Size);

				//update on web interface
				if (RAIDSettingRes.dwErrorCode == 0) {
					if ($("#SyncSettingStr").html() == "ON") {
						$("#SyncSettingStr").html("OFF");
					} else {
						$("#SyncSettingStr").html("ON");
					}
				} else {
					errorMsg = parseErrorCode(RAIDSettingRes.dwErrorCode);
					document.getElementById("SyncSettingErrorMsg").innerHTML = " ErrorCode: 0x" + Dw2HexString(RAIDSettingRes.dwErrorCode) + "&emsp;&emsp;" + errorMsg.toUpperCase();

				}

				break;

			case JS_WRITE_COMPLETE_RES:
				console.log("get JS_WRITE_COMPLETE_RES!");
				//Read data and save it in "writeCompleteRes"
				var writeCompleteRes = new StorageWriteCompleteRes();
				writeCompleteRes.Read(dv, MsgHeader.Size);

				//update on Web Interface
				PUIDindex = getPUIDindex(writeCompleteRes.owPUID);
				//console.log("PUID:"+writeCompleteRes.owPUID);
				//console.log("PUIDindex:"+PUIDindex);

				if (writeCompleteRes.dwErrorCode == 0) {
					if ($("#uploadCancelFlag"+PUIDindex).html()=="on") {
						$("#uploadProgArea"+PUIDindex).css("visibility","hidden");
						$("#uploadProg"+PUIDindex).html("");
						$("#uploadProg"+PUIDindex).width("0%");
						$("#uploadFileStart"+PUIDindex).html(0);
						$("#uploadOffset"+PUIDindex).html(0);
						$("#uploadCancelFlag"+PUIDindex).html("");
						console.log("Upload cancelled!");
						return;
					}

					var uploadFiles = document.getElementById("uploadFiles"+ PUIDindex).files;
					//var uploadFile = uploadFiles[0];
					var uploadFileSize = parseInt($("#uploadFileSize"+PUIDindex).html());
					var start = parseInt($("#uploadFileStart"+PUIDindex).html());
					//console.log("fileStart:uploadFileSize = " + start + ":" + uploadFileSize);
					percentage = 100*start/uploadFileSize;
					$("#uploadProg"+PUIDindex).html("Uploading "+percentage.toFixed(2).slice(0,-3)+"%");
					$("#uploadProg"+PUIDindex).width(percentage+"%");

					if ((start < uploadFileSize) && (uploadFiles.length != 0)) {
						sendFileChunk(PUIDindex);
					} else if (start == uploadFileSize) {

						$("#uploadProgArea"+PUIDindex).css("visibility","hidden");
						$("#uploadProg"+PUIDindex).html("");
						$("#uploadProg"+PUIDindex).width("0%");
						$("#uploadFileStart"+PUIDindex).html(0);
						$("#uploadOffset"+PUIDindex).html(0);

					} else {
						console.log("Error: uploadFiles.length="+uploadFiles.length);
					}
				} else {
					//error
					console.log("ErrorCode:"+writeCompleteRes.dwErrorCode);

					$("#uploadProgArea"+PUIDindex).css("visibility","hidden");
					$("#uploadProg"+PUIDindex).html("");
					$("#uploadProg"+PUIDindex).width("0%");
					$("#uploadFileStart"+PUIDindex).html(0);
					$("#uploadOffset"+PUIDindex).html(0);

					errorMsg = parseErrorCode(writeCompleteRes.dwErrorCode);
					document.getElementById("uploadErrorMsg" + PUIDindex).innerHTML = "Upload ErrorCode: 0x" + Dw2HexString(writeCompleteRes.dwErrorCode) + "&emsp;&emsp;" + errorMsg.toUpperCase() + "&emsp;";
				}
				break;
			case JS_READ_NETWORK_RES:
				console.log("get JS_READ_NETWORK_RES!");
				//Read data and save it in "readResponseNetwork"
				var readResponseNetwork = new ReadResponseNetwork();
				readResponseNetwork.Read(dv, MsgHeader.Size);
				//console.log("last:"+readResponseNetwork.byLastReadFromPartition);
				//console.log("dwOffsetBySector:"+readResponseNetwork.cNumOfSectors);
				var isChrome = !!window.chrome && !!window.chrome.webstore;
				PUIDindex = getPUIDindex(readResponseNetwork.owPUID);
				if (readResponseNetwork.dwErrorCode == 0) {
					if ($("#downloadCancelFlag"+PUIDindex).html()=="on") {
						$("#downloadProgArea"+PUIDindex).css("visibility", "hidden");
						$("#downloadProg"+PUIDindex).html("");
						$("#downloadProg"+PUIDindex).width("0%");
						$("#downloadOffset"+PUIDindex).html(0);
						binaryData = null;
						$("#downloadCancelFlag"+PUIDindex).html();
						console.log("Download Cancelled!");
						return;
					}

					var offset = parseInt($("#downloadOffset"+PUIDindex).html());
					var AlignedImageSize = parseInt($("#partImageSize"+PUIDindex).html());  //qwImageSizeInBytes is sector size alligned

					//Use upload file size to download file with actual size******************This is just for test purpose, backend should provide actual file size*****************
					var imageSize = parseInt($("#uploadFileSize"+PUIDindex).html());   //Actual file size in bytes but will be gone if refresh webpage!

					if (imageSize == 0) {
						imageSize = AlignedImageSize;
					}

					var data = indata.subarray(48);//test code excludes this line


					if (imageSize-offset*SECTOR_SIZE_IN_BYTE<readResponseNetwork.cNumOfSectors*SECTOR_SIZE_IN_BYTE) {
						data = indata.subarray(48,48+imageSize-offset*SECTOR_SIZE_IN_BYTE);
					}
					//************************************test code ends*************************************************************************************************************


					if (isChrome) {
						//File system API download*****************
						fileStore(PUIDindex, offset, readResponseNetwork.byLastReadFromPartition, data);
						//*************************************
					} else {

						//store data in one large blob
						if ( offset == 0) {
							binaryData = new Blob([data],{type: 'application/octet-stream'});

						} else {
							binaryData = new Blob([binaryData,data],{type: 'application/octet-stream'});

						}
					}

					if (readResponseNetwork.byLastReadFromPartition == 1) {
						$("#downloadProgArea"+PUIDindex).css("visibility", "hidden");
						$("#downloadProg"+PUIDindex).html("");
						$("#downloadProg"+PUIDindex).width("0%");
						if (!isChrome) {
							window.open(URL.createObjectURL(binaryData));  //download file as large blob
						}
						$("#downloadOffset"+PUIDindex).html(0);
						binaryData = null;

					} else {

						percentage = 100*offset*SECTOR_SIZE_IN_BYTE/imageSize;
						$("#downloadOffset"+PUIDindex).html(offset+readResponseNetwork.cNumOfSectors);
						$("#downloadProg"+PUIDindex).html("Downloading "+percentage.toFixed(2).slice(0,-3)+"%");
						$("#downloadProg"+PUIDindex).width(percentage+"%");
						sendStorageReadNetworkReq(PUIDindex);

					}
				} else {
					//error
					console.log("ErrorCode:"+readResponseNetwork.dwErrorCode);

					$("#downloadProgArea"+PUIDindex).css("visibility", "hidden");
					$("#downloadProg"+PUIDindex).html("");
					$("#downloadProg"+PUIDindex).width("0%");
					$("#downloadOffset"+PUIDindex).html(0);

					errorMsg = parseErrorCode(readResponseNetwork.dwErrorCode);
					document.getElementById("downloadErrorMsg" + PUIDindex).innerHTML = "Download ErrorCode: 0x" + Dw2HexString(readResponseNetwork.dwErrorCode) + "&emsp;&emsp;" + errorMsg.toUpperCase();
				}


				break;
			default:
				alert("Undefined command code number:"+msgHeader.dwCommand);

		}
	};
	blobReader.readAsArrayBuffer(evt.data);
}

function parseError(evt)  {

}

function sendClientShutdown(evt)  {
	//show connected/disconnected

	document.getElementById("WebStatus").innerHTML = "&nbsp;Disconnected (Reopen webpage to get connected)";
	document.getElementById("WebStatus").style.color = "red";
	//alert("Disconnected from WebSocket Server!");
	$("#WebStatus").effect("pulsate",{times:3},3000);
	$("#VNErrorMsg").fadeOut();


	//if disconnected, clear all and disable all operations
	//GUID
	$("#GUIDA").html("");
	$("#GUIDB").html("");
	//Mirror Sync button
	$("#syncBtnA").hide();
	$("#syncBtnB").hide();
	//Primary Card
	$("#isPrimaryA").html("---");
	$("#isPrimaryB").html("---");
	//media size
	$("#mediaSizeA").html("---");
	$("#mediaSizeB").html("---");
	//manufacturer string
	$("#manStringA").html("");
	$("#manStringB").html("");
	//user comment
	document.getElementById("CardDescA").value = "";
	document.getElementById("CardDescB").value = "";
	document.getElementById("CardDescA").disabled = true;
	document.getElementById("CardDescB").disabled = true;
	//card status
	$("#CardStatusA").html("");
	$("#CardStatusB").html("");
	//Error area
	$("#CardErrorA").hide();
	$("#CardErrorB").hide();
	//RAID type
	document.getElementById("RAIDTypeA").disabled = true;
	document.getElementById("RAIDTypeB").disabled = true;
	//card software lock
	document.getElementById("SWLockA").disabled = true;
	document.getElementById("SWLockB").disabled = true;
	//wipe button
	document.getElementById("BtnWipeA").disabled = true;
	document.getElementById("BtnWipeB").disabled = true;
	//defrag button
	document.getElementById("BtnDefragA").disabled = true;
	document.getElementById("BtnDefragB").disabled = true;
	//eject button
	document.getElementById("BtnEjectA").disabled = true;
	document.getElementById("BtnEjectB").disabled = true;
	//prepare for ssp firmware update button
	document.getElementById("PFUBtn").disabled = true;
	//change RAID setting button
	document.getElementById("SyncSetting").disabled = true;
	//read raw registers
	document.getElementById("RdRawRegCard").disabled = true;
}

//open websocket in index page
function initWebSock()  {


	// create websocket connection with specified remote IP address
	//console.log("PilotHostName:"+PilotHostName);
	console.log("WsUrl = "+wsurl);
	websocketMain = new WebSocket(wsurl);

	// for now, does nothing with version, gets CUID and triggers event notifications; available space, partition list
	websocketMain.onopen = function(evt) {
		document.getElementById("WebStatus").innerHTML = "&nbsp;Connection succeeds.";
		$("#WebStatus").effect("pulsate",{times:3},3000);
		sendVersionNeg(evt);
	};

	// determine what the websocket server has sent us
	websocketMain.onmessage = function(evt) { parseIncomingMessage(evt); };

	// determine error code sent by websocket server
	websocketMain.onerror = function(evt) { parseError(evt); };

	// perform any cleanup on socket close
	websocketMain.onclose = function(evt) { sendClientShutdown(evt); };

}


//update error message on "cardError" area
function updateCardErrorMsg(cardchar, cmd, errorCode) {
	var errorMsg = parseErrorCode(errorCode);
	switch (cmd) {
		case "WIPE":
			if ($("#CardError" + cardchar + "CMI").html() != "" ||
					$("#CardError" + cardchar + "EJECT").html() != "" ||
					$("#CardError" + cardchar + "CANCEL").html() != "") {
				document.getElementById("CardError"+cardchar+"WIPE").innerHTML = cmd + " - 0x" + Dw2HexString(errorCode) + "&emsp;" + errorMsg.toUpperCase() + "<br>&emsp;&emsp;&emsp;";
			} else {
				document.getElementById("CardError"+cardchar+"WIPE").innerHTML = cmd + " - 0x" + Dw2HexString(errorCode) + "&emsp;" + errorMsg.toUpperCase();
			}

			$("#WipeErrorMark"+cardchar).prop("title","Error: 0x" + Dw2HexString(errorCode) + "  " + errorMsg.toUpperCase());
			$("#WipeErrorMark"+cardchar).fadeTo(0,1);
			break;
		case "DEFRAG":
			if ($("#CardError" + cardchar + "CMI").html() != "" ||
					$("#CardError" + cardchar + "EJECT").html() != "" ||
					$("#CardError" + cardchar + "CANCEL").html() != "") {
				document.getElementById("CardError"+cardchar+"DEFRAG").innerHTML = cmd + " - 0x" + Dw2HexString(errorCode) + "&emsp;" + errorMsg.toUpperCase() + "<br>&emsp;&emsp;&emsp;";
			} else {
				document.getElementById("CardError"+cardchar+"DEFRAG").innerHTML = cmd + " - 0x" + Dw2HexString(errorCode) + "&emsp;" + errorMsg.toUpperCase();
			}

			$("#DefragErrorMark"+cardchar).prop("title","Error: 0x" + Dw2HexString(errorCode) + "  " + errorMsg.toUpperCase());
			$("#DefragErrorMark"+cardchar).fadeTo(0,1);
			break;
		case "CVT":
			if ($("#CardError" + cardchar + "CMI").html() != "" ||
					$("#CardError" + cardchar + "EJECT").html() != "" ||
					$("#CardError" + cardchar + "CANCEL").html() != "") {
				document.getElementById("CardError"+cardchar+"CVT").innerHTML = cmd + " - 0x" + Dw2HexString(errorCode) + "&emsp;" + errorMsg.toUpperCase() + "<br>&emsp;&emsp;&emsp;";
			} else {
				document.getElementById("CardError"+cardchar+"CVT").innerHTML = cmd + " - 0x" + Dw2HexString(errorCode) + "&emsp;" + errorMsg.toUpperCase();
			}

			$("#ConvertErrorMark"+cardchar).prop("title","Error: 0x" + Dw2HexString(errorCode) + "  " + errorMsg.toUpperCase());
			$("#ConvertErrorMark"+cardchar).fadeIn();
			break;
		case "SYNC":
			if ($("#CardError" + cardchar + "CMI").html() != "" ||
					$("#CardError" + cardchar + "EJECT").html() != "" ||
					$("#CardError" + cardchar + "CANCEL").html() != "") {
				document.getElementById("CardError"+cardchar+"SYNC").innerHTML = cmd + " - 0x" + Dw2HexString(errorCode) + "&emsp;" + errorMsg.toUpperCase() + "<br>&emsp;&emsp;&emsp;";
			} else {
				document.getElementById("CardError"+cardchar+"SYNC").innerHTML = cmd + " - 0x" + Dw2HexString(errorCode) + "&emsp;" + errorMsg.toUpperCase();
			}
			break;
		case "CMI":
			document.getElementById("CardError"+cardchar+"CMI").innerHTML = cmd + " - 0x" + Dw2HexString(errorCode) + "&emsp;" + errorMsg.toUpperCase();
			break;
		case "EJECT":
			document.getElementById("CardError"+cardchar+"EJECT").innerHTML = cmd + " - 0x" + Dw2HexString(errorCode) + "&emsp;" + errorMsg.toUpperCase();
			break;
		case "CANCEL":
			document.getElementById("CardError"+cardchar+"CANCEL").innerHTML = cmd + " - 0x" + Dw2HexString(errorCode) + "&emsp;" + errorMsg.toUpperCase();
			break;
		default:
			console.log("updateCardErrorMsg error!");
	}
	/*if ($("#CardError"+cardchar).html() == "") {
		document.getElementById("CardError"+cardchar).innerHTML = cmd + " - 0x" + Dw2HexString(errorCode) + "&emsp;" + errorMsg.toUpperCase();
	} else {
		document.getElementById("CardError"+cardchar).innerHTML += "<br>&emsp;&emsp;&emsp;" + cmd + " - 0x" + Dw2HexString(changeMediaInfoRes.dwErrorCode) + "&emsp;" + errorMsg.toUpperCase();
	}*/
}


//clear error message on "cardError" area
function clearCardErrorMsg(cardchar) {
	$("#CardError" + cardchar + "WIPE").html("");
	$("#WipeErrorMark"+cardchar).fadeTo(0,0);
	$("#WipeErrorMark"+cardchar).prop("title","");

	$("#CardError" + cardchar + "DEFRAG").html("");
	$("#DefragErrorMark"+cardchar).fadeTo(0,0);
	$("#DefragErrorMark"+cardchar).prop("title","");

	$("#CardError" + cardchar + "CVT").html("");
	$("#ConvertErrorMark"+cardchar).hide();
	$("#ConvertErrorMark"+cardchar).prop("title","");

	$("#CardError" + cardchar + "SYNC").html("");

	$("#CardError" + cardchar + "CMI").html("");
	$("#ChangeMediaInfoSWLErrorMark"+cardchar).hide();
	$("#ChangeMediaInfoSWLErrorMark"+cardchar).prop("title","");
	$("#ChangeMediaInfoCmtErrorMark"+cardchar).hide();
	$("#ChangeMediaInfoCmtMark"+cardchar).prop("title","");

	$("#CardError" + cardchar + "EJECT").html("");
	$("#CardError" + cardchar + "CANCEL").html("");
}

//get PUID's corresponding PUIDindex
function getPUIDindex(PUID) {
	var PUIDindex = "";
	for (var i=0;i<$("#PartitionNumA").html();i++) {
		if (PUID == $("#PUIDstateStr"+"1"+i).html()) {
			PUIDindex = "1" + i;
			break;
		}
	}
	for (var j=0;j<$("#PartitionNumB").html();j++) {
		if (PUID == $("#PUIDstateStr"+"2"+j).html()) {
			PUIDindex = "2" + j;
			break;
		}
	}
	return PUIDindex;
}

//convert Dword number to 8-bit hex string(PUID&GUID)
function Dw2HexString(dwNumber) {
	var hexStr = dwNumber.toString(16);
	switch (hexStr.length) {
		case 1:
			hexStr = "0000000" + hexStr;
			break;
		case 2:
			hexStr = "000000" + hexStr;
			break;
		case 3:
			hexStr = "00000" + hexStr;
			break;
		case 4:
			hexStr = "0000" + hexStr;
			break;
		case 5:
			hexStr = "000" + hexStr;
			break;
		case 6:
			hexStr = "00" + hexStr;
			break;
		case 7:
			hexStr = "0" + hexStr;
			break;
		case 8:
			break;
		default:
			console.log("Dw2HexString bit number error!");
			break;
	}
	return hexStr;
}

//parse error code
function parseErrorCode(errorCode) {

	var errorMsg = "";

	switch(errorCode) {
		//Connection, tag, driver
		case (parseInt(0x100)):
			errorMsg = "Out of CUIDs";
			break;
		case (parseInt(0x101)):
			errorMsg = "Invalid CUID";
			break;
		case (parseInt(0x102)):
			errorMsg = "System sync in progress";
			break;
		case (parseInt(0x103)):
			errorMsg = "No Response available";
			break;

		//config, storage
		case (parseInt(0x200)):
			errorMsg = "Invalid Card GUID";
			break;
		case (parseInt(0x201)):
			errorMsg = "Card slot is empty";
			break;
		case (parseInt(0x202)):
			errorMsg = "Wipe on Card already in progress";
			break;
		case (parseInt(0x203)):
			errorMsg = "Card is busy";
			break;
		case (parseInt(0x204)):
			errorMsg = "Wipe failed";
			break;
		case (parseInt(0x205)):
			errorMsg = "PSP can't mount optical devices";
			break;
		case (parseInt(0x206)):
			errorMsg = "Insufficient sapce available";
			break;
		case (parseInt(0x207)):
			errorMsg = "User comment too long";
			break;
		case (parseInt(0x208)):
			errorMsg = "Partition name too long";
			break;
		case (parseInt(0x209)):
			errorMsg = "Invalid media type";
			break;
		case (parseInt(0x20A)):
			errorMsg = "Partition in use";
			break;
		case (parseInt(0x20B)):
			errorMsg = "Unable to update partition table";
			break;
		case (parseInt(0x20C)):
			errorMsg = "Partition name already exists";
			break;
		case (parseInt(0x20D)):
			errorMsg = "Reach max host mounts";
			break;
		case (parseInt(0x20E)):
			errorMsg = "Claim mismatch";
			break;
		case (parseInt(0x20F)):
			errorMsg = "Partition not in share";
			break;
		case (parseInt(0x210)):
			errorMsg = "Already claimed";
			break;
		case (parseInt(0x211)):
			errorMsg = "No claim to release";
			break;
		case (parseInt(0x212)):
			errorMsg = "Partition is read only";
			break;
		case (parseInt(0x213)):
			errorMsg = "Peer card not available for rebuild";
			break;
		case (parseInt(0x214)):
			errorMsg = "Invalid file system type";
			break;
		case (parseInt(0x215)):
			errorMsg = "Partition is not mirrored";
			break;
		case (parseInt(0x216)):
			errorMsg = "Invalid PUID";
			break;
		case (parseInt(0x217)):
			errorMsg = "Invalid conversion";
			break;
		case (parseInt(0x218)):
			errorMsg = "Unrecoverable data on read";
			break;
		case (parseInt(0x219)):
			errorMsg = "Unrecoverable data on write";
			break;
		case (parseInt(0x21A)):
			errorMsg = "Invalid log entry index";
			break;
		case (parseInt(0x21B)):
			errorMsg = "Invalid peer";
			break;
		case (parseInt(0x21C)):
			errorMsg = "Mismatched mirror data";
			break;
		case (parseInt(0x21D)):
			errorMsg = "Storage write invalid size";
			break;
		case (parseInt(0x21E)):
			errorMsg = "Invalid partition name size";
			break;
		case (parseInt(0x21F)):
			errorMsg = "Invalid user comment size";
			break;
		case (parseInt(0x220)):
			errorMsg = "Storage read invalid size";
			break;
		case (parseInt(0x221)):
			errorMsg = "Write verify failed";
			break;
		case (parseInt(0x222)):
			errorMsg = "Cannot join mirror";
			break;
		case (parseInt(0x223)):
			errorMsg = "Partition corrupted";
			break;
		case (parseInt(0x224)):
			errorMsg = "Mirror broken";
			break;
		case (parseInt(0x225)):
			errorMsg = "Stripe corrupted";
			break;
		case (parseInt(0x226)):
			errorMsg = "Mirror corrupted";
			break;
		case (parseInt(0x227)):
			errorMsg = "No rebuild needed";
			break;
		case (parseInt(0x228)):
			errorMsg = "Invalid request size";
			break;
		case (parseInt(0x229)):
			errorMsg = "Read write CRC no match";
			break;
		case (parseInt(0x22A)):
			errorMsg = "Cannot rebuild";
			break;
		case (parseInt(0x22B)):
			errorMsg = "Card no defrag needed";
			break;
		case (parseInt(0x22C)):
			errorMsg = "Reach max PSP mounts";
			break;
		case (parseInt(0x22D)):
			errorMsg = "Partition mounted";
			break;
		case (parseInt(0x22E)):
			errorMsg = "Partition unmounted";
			break;
		case (parseInt(0x22F)):
			errorMsg = "Raid sync not allowed";
			break;
		case (parseInt(0x230)):
			errorMsg = "Raid sync media too small";
			break;
		case (parseInt(0x231)):
			errorMsg = "Raid conversion media too small";
			break;
		case (parseInt(0x232)):
			errorMsg = "Task cancelled";
			break;
		case (parseInt(0x233)):
			errorMsg = "Task SD IO error";
			break;

		//SD card status
		case (parseInt(0x300)):
			errorMsg = "Card not present";
			break;
		case (parseInt(0x301)):
			errorMsg = "Card Inserted";
			break;
		case (parseInt(0x302)):
			errorMsg = "Card removed";
			break;
		case (parseInt(0x303)):
			errorMsg = "Changed by request";
			break;
		case (parseInt(0x306)):
			errorMsg = "Media eject request";
			break;
		case (parseInt(0x307)):
			errorMsg = "Card hardware write protected";
			break;
		case (parseInt(0x308)):
			errorMsg = "Card software write protected";
			break;
		case (parseInt(0x309)):
			errorMsg = "Card unrecognized";
			break;
		case (parseInt(0x30A)):
			errorMsg = "Rewrite failed";
			break;
		case (parseInt(0x30B)):
			errorMsg = "Media out of sync";
			break;
		default:
			errorMsg = "Unknown error";
			break;
	}

	return errorMsg;
}
