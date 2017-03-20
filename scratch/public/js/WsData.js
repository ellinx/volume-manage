
//MsgHeader Constructor
function MsgHeader() {
	this.dwCommand = 0;
	this.dwReserved = 0;
	this.cbyMessageSize = 0;
	this.Read = function(oDataView, offset) {
		this.dwCommand  = oDataView.getUint32(offset,true);
		offset += 4;
		this.dwReserved  = oDataView.getUint32(offset,true);
		offset += 4;
		this.cbyMessageSize  = oDataView.getUint32(offset,true);
	};
	this.Init = function(dwCommand, cbyMessageSize) {
		this.dwCommand = dwCommand;
		this.cbyMessageSize = cbyMessageSize;
	};
	this.Write = function(oDataView, offset) {
		oDataView.setUint32(offset,this.dwCommand,true);
		offset += 4;
		oDataView.setUint32(offset,this.dwReserved,true);
		offset += 4;
		oDataView.setUint32(offset,this.cbyMessageSize,true);
	};
}

MsgHeader.Size = 16;


//VersionNegotiationReq Constructor
function VersionNegotiationReq() {
	this.byMajor = 0;
	this.byMinor = 0;
	this.wBuildNumber = 0;
	this.Init = function( byMajor, byMinor, wBuildNumber ){
		this.byMajor = byMajor;
		this.byMinor = byMinor;
		this.wBuildNumber = wBuildNumber;
	};
	this.Write = function(oDataView,offset) {
		oDataView.setUint8(offset,this.byMajor,true);
		offset += 1;
		oDataView.setUint8(offset,this.byMinor,true);
		offset += 1;
		oDataView.setUint16(offset,this.wBuildNumber,true);
	};
}

VersionNegotiationReq.Size = 4;


//WipeMediaReq Constructor
function WipeMediaReq() {
   this.owCardGUID = "";
   this.dwEarseSecurityLevel = 0;
   this.Init = function(owCardGUID, dwEarseSecurityLevel) {
   	this.owCardGUID = owCardGUID;
   	this.dwEarseSecurityLevel = dwEarseSecurityLevel;
   };
   this.Write = function(oDataView,offset) {
   	oDataView.setUint32(offset,parseInt("0x"+this.owCardGUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owCardGUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owCardGUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owCardGUID.substring(0,8)),true);
   	offset += 4;
   	oDataView.setUint32(offset,this.dwEarseSecurityLevel,true);
   };
}

WipeMediaReq.Size = 20;


//ChangeMediaInfoReq Constructor
function ChangeMediaInfoReq() {
   this.owCardGUID = "";
   this.dwFlags = 0;
   this.dwLengthUserComment = 0;
   this.abyUserComment = "";
   this.Init = function(owCardGUID, dwFlags, dwLengthUserComment, abyUserComment) {
   	this.owCardGUID = owCardGUID;
   	this.dwFlags = dwFlags;
   	this.dwLengthUserComment = dwLengthUserComment;
   	this.abyUserComment = abyUserComment;
   };
   this.Write = function(oDataView, offset) {
   	oDataView.setUint32(offset,parseInt("0x"+this.owCardGUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owCardGUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owCardGUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owCardGUID.substring(0,8)),true);
   	offset += 4;
   	oDataView.setUint32(offset,this.dwFlags,true);
   	offset += 4;
   	oDataView.setUint32(offset,this.dwLengthUserComment,true);
   	offset += 4;
   	for (var i=0;i<Math.min(this.dwLengthUserComment,48);i++) {
   		oDataView.setUint8((offset+i),this.abyUserComment.charCodeAt(i),true);
   	}
   };
}

ChangeMediaInfoReq.Size = 72;


//DefinePartitionReq Constructor
function DefinePartitionReq() {
   this.owCardGUID = "";
   this.qwSize = 0;
   this.dwLengthPartitionName = 0;
   this.abyPartitionName = "";
   this.Init = function(owCardGUID, qwSize, dwLengthPartitionName, abyPartitionName) {
   	this.owCardGUID = owCardGUID;
   	this.qwSize = qwSize;
   	this.dwLengthPartitionName = dwLengthPartitionName;
   	this.abyPartitionName = abyPartitionName;
   };
   this.Write = function(oDataView, offset) {
   	oDataView.setUint32(offset,parseInt("0x"+this.owCardGUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owCardGUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owCardGUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owCardGUID.substring(0,8)),true);
   	offset += 4;
   	oDataView.setUint32(offset, (this.qwSize%Math.pow(2,32)), true);
   	offset += 4;
   	oDataView.setUint32(offset, Math.floor(this.qwSize/Math.pow(2,32)), true);
   	offset += 4;
   	oDataView.setUint32(offset, this.dwLengthPartitionName, true);
   	offset += 4;
   	for (var i=0;i<Math.min(this.dwLengthPartitionName,64);i++) {
   		oDataView.setUint8((offset+i),this.abyPartitionName.charCodeAt(i),true);
   	}
   };
}

DefinePartitionReq.Size = 92;


//SetPartitionOptionsReq Constructor
function SetPartitionOptionsReq() {
   this.owPUID = "";
   this.dwFlags = 0;
   this.dwMediaType = 0;
   this.dwLengthPartitionName = 0;
   this.dwLengthUserComment = 0;
   this.dwReserve = 0;
   this.abyPartitionName = "";
   this.abyUserComment = "";
   this.Init = function(owPUID, dwFlags, dwMediaType, dwLengthPartitionName, dwLengthUserComment, abyPartitionName, abyUserComment) {
   	this.owPUID = owPUID;
	   this.dwFlags = dwFlags;
	   this.dwMediaType = dwMediaType;
	   this.dwLengthPartitionName = dwLengthPartitionName;
	   this.dwLengthUserComment = dwLengthUserComment;
	   this.abyPartitionName = abyPartitionName;
	   this.abyUserComment = abyUserComment;
   };
   this.Write = function(oDataView, offset) {
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(0,8)),true);
   	offset += 4;
   	oDataView.setUint32(offset, this.dwFlags, true);
   	offset += 4;
   	oDataView.setUint32(offset, this.dwMediaType, true);
   	offset += 4;
   	oDataView.setUint32(offset, this.dwLengthPartitionName, true);
   	offset += 4;
   	oDataView.setUint32(offset, this.dwLengthUserComment, true);
   	offset += 8;// add dwReserved offset here
   	for (var i=0;i<Math.min(this.dwLengthPartitionName,64);i++) {
   		oDataView.setUint8(offset+i, this.abyPartitionName.charCodeAt(i), true);
   	}
   	offset += 64;
   	for (var j=0;j<Math.min(this.dwLengthUserComment,192);j++) {
   		oDataView.setUint8(offset+j, this.abyUserComment.charCodeAt(j), true);
   	}
   };
}

SetPartitionOptionsReq.Size = 292;


//PrepareMediaForEjectionReq Constructor
function PrepareMediaForEjectionReq() {
   this.owCardGUID = "";
   this.Init = function(owCardGUID) {
   	this.owCardGUID = owCardGUID;
   };
   this.Write = function(oDataView, offset) {
   	oDataView.setUint32(offset,parseInt("0x"+this.owCardGUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owCardGUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owCardGUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owCardGUID.substring(0,8)),true);
   };
}

PrepareMediaForEjectionReq.Size = 16;


//DeletePartitionReq Constructor
function DeletePartitionReq() {
   this.owPUID = "";
   this.Init = function(owPUID) {
   	this.owPUID = owPUID;
   };
   this.Write = function(oDataView, offset) {
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(0,8)),true);
   };
}

DeletePartitionReq.Size = 16;


//ClaimPartitionReq Constructor
function ClaimPartitionReq() {
   this.owPUID = "";
   this.dwClaimTypeForSharing = 0;
   this.Init = function(owPUID, dwClaimTypeForSharing) {
   	this.owPUID = owPUID;
   	this.dwClaimTypeForSharing = dwClaimTypeForSharing;
   };
   this.Write = function(oDataView, offset) {
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(0,8)),true);
   	offset += 4;
   	oDataView.setUint32(offset,this.dwClaimTypeForSharing,true);
   };
}

ClaimPartitionReq.Size = 20;


//ReleasePartitionReq Constructor
function ReleasePartitionReq() {
   this.owPUID = "";
   this.Init = function(owPUID) {
   	this.owPUID = owPUID;
   };
   this.Write = function(oDataView, offset) {
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(0,8)),true);
   };
}

ReleasePartitionReq.Size = 16;


//RebuildPartitionReq Constructor
function RebuildPartitionReq() {
   this.owPUID = "";
   this.Init = function(owPUID) {
   	this.owPUID = owPUID;
   };
   this.Write = function(oDataView, offset) {
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(0,8)),true);
   };
}

RebuildPartitionReq.Size = 16;


//FormatPartitionReq Constructor
function FormatPartitionReq() {
   this.owPUID = "";
   this.dwFilesystemType = 0;
   this.Init = function(owPUID, dwFilesystemType) {
   	this.owPUID = owPUID;
   	this.dwFilesystemType = dwFilesystemType;
   };
   this.Write = function(oDataView, offset) {
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(0,8)),true);
   	offset += 4;
   	oDataView.setUint32(offset,this.dwFilesystemType,true);
   };
}

FormatPartitionReq.Size = 20;

//ResizePartitionReq Constructor
function ResizePartitionReq() {
   this.owPUID = "";
   this.qwNewSizeInBytes = 0;
   this.Init = function(owPUID, qwNewSizeInBytes) {
   	this.owPUID = owPUID;
   	this.qwNewSizeInBytes = qwNewSizeInBytes;
   };
   this.Write = function(oDataView,offset) {
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(0,8)),true);
   	offset += 4;
   	oDataView.setUint32(offset,(this.qwNewSizeInBytes%Math.pow(2,32)),true);
   	offset += 4;
   	oDataView.setUint32(offset,Math.floor(this.qwNewSizeInBytes/Math.pow(2,32)),true);
   };
}

ResizePartitionReq.Size = 24;


//VerifyPartitionReq Constructor
function VerifyPartitionReq() {
	this.owPUID = "";
	this.Init = function(owPUID) {
		this.owPUID = owPUID;
	};
	this.Write = function(oDataView, offset) {
		oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(0,8)),true);
	};
}

VerifyPartitionReq.Size = 16;


//BreakMirrorReq Constructor
function BreakMirrorReq() {
   this.owPUID = "";
   this.Init = function(owPUID) {
   	this.owPUID = owPUID;
   };
   this.Write = function(oDataView, offset) {
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(0,8)),true);
   };
}

BreakMirrorReq.Size = 16;


//JoinMirrorReq Constructor
function JoinMirrorReq() {
   this.owPUID = "";
   this.Init = function(owPUID) {
   	this.owPUID = owPUID;
   };
   this.Write = function(oDataView, offset) {
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(0,8)),true);
   };
}

JoinMirrorReq.Size = 16;


//ConvertPartitionTypeReq Constructor
function ConvertPartitionTypeReq() {
   this.owPUID = "";
   this.dwNewPartitionType = 0;
   this.Init = function(owPUID, dwNewPartitionType) {
   	this.owPUID = owPUID;
   	this.dwNewPartitionType = dwNewPartitionType;
   };
   this.Write = function(oDataView, offset) {
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(0,8)),true);
   	offset += 4;
   	oDataView.setUint32(offset,this.dwNewPartitionType,true);
   };
}

ConvertPartitionTypeReq.Size = 20;


//SharePartitionReq Constructor
function SharePartitionReq() {
   this.owPUID = "";
   this.dwPSPShare = 0;
   this.dwWritable = 0;
   this.Init = function(owPUID, dwPSPShare, dwWritable) {
   	this.owPUID = owPUID;
   	this.dwPSPShare = dwPSPShare;
   	this.dwWritable = dwWritable;
   };
   this.Write = function(oDataView, offset) {
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(0,8)),true);
   	offset += 4;
   	oDataView.setUint32(offset,this.dwPSPShare,true);
   	offset += 4;
   	oDataView.setUint32(offset,this.dwWritable,true);
   };
}

SharePartitionReq.Size = 24;


//UnsharePartitionReq Constructor
function UnsharePartitionReq() {
   this.owPUID = "";
   this.Init = function(owPUID) {
   	this.owPUID = owPUID;
   };
   this.Write = function(oDataView, offset) {
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(0,8)),true);
   };
}

UnsharePartitionReq.Size = 16;


//CancelQueuedTaskReq Constructor
function CancelQueuedTaskReq() {
	this.owUID = "";
	this.dwCommand = 0;
	this.Init = function(owUID, dwCommand) {
		this.owUID = owUID;
		this.dwCommand = dwCommand;
	};
	this.Write = function(oDataView, offset) {
		oDataView.setUint32(offset,parseInt("0x"+this.owUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owUID.substring(0,8)),true);
   	offset += 4;
   	oDataView.setUint32(offset,this.dwCommand,true);
	};
}

CancelQueuedTaskReq.Size = 20;


//StorageReadNetworkReq Constructor
function StorageReadNetworkReq() {
	this.owPUID = "";
	this.dwOffsetBySector = 0;
	this.cNumOfSectors = 0;
	this.Init = function(owPUID, dwOffsetBySector, cNumOfSectors) {
		this.owPUID = owPUID;
		this.dwOffsetBySector = dwOffsetBySector;
		this.cNumOfSectors = cNumOfSectors;
	};
	this.Write = function(oDataView, offset) {
		oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPUID.substring(0,8)),true);
   	offset += 4;
   	oDataView.setUint32(offset,this.dwOffsetBySector,true);
   	offset += 4;
   	oDataView.setUint32(offset,this.cNumOfSectors,true);
	};
}

StorageReadNetworkReq.Size = 24;


//ConvertRAIDTypeReq Constructor
function ConvertRAIDTypeReq() {
   this.owPrimaryCardGUID = "";
   this.dwNewRAIDType = 0;
   this.Init = function(owPrimaryCardGUID, dwNewRAIDType) {
   	this.owPrimaryCardGUID = owPrimaryCardGUID;
   	this.dwNewRAIDType = dwNewRAIDType;
   };
   this.Write = function(oDataView, offset) {
   	oDataView.setUint32(offset,parseInt("0x"+this.owPrimaryCardGUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPrimaryCardGUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPrimaryCardGUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owPrimaryCardGUID.substring(0,8)),true);
   	offset += 4;
   	oDataView.setUint32(offset,this.dwNewRAIDType,true);
   };
}

ConvertRAIDTypeReq.Size = 20;



//DefragReq Constructor
function DefragReq(){
	this.owGUID = "";
	this.Init = function(owGUID) {
		this.owGUID = owGUID;
	};
	this.Write = function(oDataView, offset) {
		oDataView.setUint32(offset,parseInt("0x"+this.owGUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owGUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owGUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owGUID.substring(0,8)),true);
	};
}

DefragReq.Size = 16;


//SyncMirrorReq Constructor
function SyncMirrorReq() {
	this.owSecondaryCardGUID = "";
	this.dwReserved = 0;
	this.Init = function(owSecondaryCardGUID) {
		this.owSecondaryCardGUID = owSecondaryCardGUID;
	};
	this.Write = function(oDataView, offset) {
		oDataView.setUint32(offset,parseInt("0x"+this.owSecondaryCardGUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owSecondaryCardGUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owSecondaryCardGUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owSecondaryCardGUID.substring(0,8)),true);
	};
}

SyncMirrorReq.Size = 20;


//ChangeRAIDSettingReq Constructor
function ChangeRAIDSettingReq() {
	this.bySyncMode = 0;
	this.byReserved = 0;
	this.Init = function(bySyncMode) {
		this.bySyncMode = bySyncMode;
	};
	this.Write = function(oDataView, offset){
		oDataView.setUint8(offset, this.bySyncMode, true);
	};
}

ChangeRAIDSettingReq.Size = 4;


//PrepareSSPFirmwareUpdateReq Constructor
function PrepareSSPFirmwareUpdateReq() {
	this.dwReserved = 0;
	this.Init = function(dwReserved) {
		this.dwReserved = dwReserved;
	};
	this.Write = function(oDataView, offset) {
		oDataView.setUint32(offset, this.dwReserved, true);
	};
}

PrepareSSPFirmwareUpdateReq.Size = 4;


//ReadRawRegistersReq Constructor
function ReadRawRegistersReq() {
	this.owCardGUID = "";
	this.Init = function(owCardGUID) {
		this.owCardGUID = owCardGUID;
	};
	this.Write = function(oDataView, offset) {
		oDataView.setUint32(offset,parseInt("0x"+this.owCardGUID.substring(24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owCardGUID.substring(16,24)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owCardGUID.substring(8,16)),true);
   	offset += 4;
   	oDataView.setUint32(offset,parseInt("0x"+this.owCardGUID.substring(0,8)),true);
	};
}

ReadRawRegistersReq.Size = 16;



//*******************************************    Response structure below   **************************************



//VersionNegotiationRes Constructor
function VersionNegotiationRes() {
	this.byMajor = 0;
	this.byMinor = 0;
	this.wBuildNumber = 0;
	this.dwStatusCode = 0;		//0x00 accepted,!0x00 negotiation failed
	this.dwCUID = 0; 				//(Connection Unique ID)
	this.dwLengthofCUID = 0; 	//block (inclusive),revisit
	this.Read = function(oDataView, offset) {
		this.byMajor = oDataView.getUint8(offset,true);
		offset += 1;
		this.byMinor = oDataView.getUint8(offset,true);
		offset += 1;
		this.wBuildNumber = oDataView.getUint16(offset,true);
		offset += 2;
		this.dwStatusCode = oDataView.getUint32(offset,true);
		offset += 4;
		this.dwCUID = oDataView.getUint32(offset,true);
		offset += 4;
		this.dwLengthofCUID = oDataView.getUint32(offset,true);
	};
}

VersionNegotiationRes.Size = 16;


//SpaceAvailableNotification Constructor
function SpaceAvailableNotification() {
   this.cbyTotalFreeSpaceCombined = 0;
   this.cbyTotalFreeSpaceOnCardA = 0;
   this.cbyTotalFreeSpaceOnCardB = 0;
   this.cbyLargestJBODSpaceOnCardA = 0;
   this.cbyLargestJBODSpaceOnCardB = 0;
   this.cbyLargestStripeSpaceOnCard = 0;
   this.cbyLargestMirrorSpaceOnCard = 0;
   this.Read = function(oDataView, offset) {
   	this.cbyTotalFreeSpaceCombined = oDataView.getUint32(offset,true) + oDataView.getUint32(offset+4,true)*Math.pow(2,32);
   	offset += 8;
   	this.cbyTotalFreeSpaceOnCardA = oDataView.getUint32(offset,true) + oDataView.getUint32(offset+4,true)*Math.pow(2,32);
   	offset += 8;
   	this.cbyTotalFreeSpaceOnCardB = oDataView.getUint32(offset,true) + oDataView.getUint32(offset+4,true)*Math.pow(2,32);
   	offset += 8;
   	this.cbyLargestJBODSpaceOnCardA = oDataView.getUint32(offset,true) + oDataView.getUint32(offset+4,true)*Math.pow(2,32);
   	offset += 8;
   	this.cbyLargestJBODSpaceOnCardB = oDataView.getUint32(offset,true) + oDataView.getUint32(offset+4,true)*Math.pow(2,32);
   	offset += 8;
   	this.cbyLargestStripeSpaceOnCard = oDataView.getUint32(offset,true) + oDataView.getUint32(offset+4,true)*Math.pow(2,32);
   	offset += 8;
   	this.cbyLargestMirrorSpaceOnCard = oDataView.getUint32(offset,true) + oDataView.getUint32(offset+4,true)*Math.pow(2,32);
   };
}

SpaceAvailableNotification.Size = 56;


//PartitionListUpdatedNotification Constructor
function PartitionListUpdatedNotification() {
	this.cPartitions = 0;
	this.adwReserved = 0;
	this.pie = [];
	this.Read = function(oDataView, oIndata) {
		this.cPartitions = oDataView.getUint32(16,true);
		this.adwReserved = 0;
		for (var i=0;i<oDataView.getUint32(16,true);i++) {
			this.pie.push({
				owGUID: (Dw2HexString(oDataView.getUint32(44+i*512,true)) + Dw2HexString(oDataView.getUint32(40+i*512,true)) + Dw2HexString(oDataView.getUint32(36+i*512,true)) + Dw2HexString(oDataView.getUint32(32+i*512,true))),
				owPUID: (Dw2HexString(oDataView.getUint32(60+i*512,true)) + Dw2HexString(oDataView.getUint32(56+i*512,true)) + Dw2HexString(oDataView.getUint32(52+i*512,true)) + Dw2HexString(oDataView.getUint32(48+i*512,true))),
				owPUIDPeer: (Dw2HexString(oDataView.getUint32(76+i*512,true)) + Dw2HexString(oDataView.getUint32(72+i*512,true)) + Dw2HexString(oDataView.getUint32(68+i*512,true)) + Dw2HexString(oDataView.getUint32(64+i*512,true))),
				qwOffsetInBytesOnCard: (oDataView.getUint32(80+i*512,true) + oDataView.getUint32(84+i*512,true) * Math.pow(2,32)),
				qwSizeInBytes: (oDataView.getUint32(88+i*512,true) + oDataView.getUint32(92+i*512,true) * Math.pow(2,32)),
				dwSizeInSectors: oDataView.getUint32(96+i*512,true),
				dwAlignedSizeInSectors: oDataView.getUint32(100+i*512,true),
				qwImageSizeInBytes: (oDataView.getUint32(104+i*512,true) + oDataView.getUint32(108+i*512,true) * Math.pow(2,32)),
            dwLogicSizeInSectors: oDataView.getUint32(112+i*512,true),
				dwSectorOffSetIntoCard: oDataView.getUint32(116+i*512,true),
				dwType: oDataView.getUint32(120+i*512,true),
				dwStartWithOddSector: oDataView.getUint32(124+i*512,true),
				dwInitialFormatType: oDataView.getUint32(128+i*512,true),
				dwFlags: oDataView.getUint32(132+i*512,true),
				dwMediaType: oDataView.getUint32(136+i*512,true),
				dwClaimType: oDataView.getUint32(140+i*512,true),
				byRecoveryState: oDataView.getUint8(144+i*512,true),
				byReserved: "", //3bytes reserved here
				cbyPartitionName: oDataView.getUint32(148+i*512,true),
				cbyUserComment: oDataView.getUint32(152+i*512,true),
				abyPartitionName: String.fromCharCode.apply(null,oIndata.subarray(156+i*512,156+i*512+oDataView.getUint32(148+i*512,true))),
				abyUserComment: String.fromCharCode.apply(null,oIndata.subarray(220+i*512,220+i*512+oDataView.getUint32(152+i*512,true))),
				abyReserved: ""
			});
		}
	};
}


//ProgressReportNotification Constructor
function ProgressReportNotification() {
	this.owGUID = "";
	this.dwTotalStepsRequired = 0;
	this.dwTotalStepsCompleted = 0;
   this.dwFlags = 0;
	this.dwErrorCode = 0;
	this.dwCommand = 0;
	this.dwLengthofParameters = 0;
	this.Read = function(oDataView, offset) {
		this.owGUID = Dw2HexString(oDataView.getUint32(offset+12,true)) + Dw2HexString(oDataView.getUint32(offset+8,true)) + Dw2HexString(oDataView.getUint32(offset+4,true)) + Dw2HexString(oDataView.getUint32(offset,true));
		offset += 16;
		this.dwTotalStepsRequired = oDataView.getUint32(offset,true);
		offset += 4;
		this.dwTotalStepsCompleted = oDataView.getUint32(offset,true);
		offset += 4;
		this.dwFlags = oDataView.getUint32(offset,true);
		offset += 4;
      this.dwErrorCode = oDataView.getUint32(offset,true);
      offset += 4;
		this.dwCommand = oDataView.getUint32(offset,true);
		offset += 4;
		this.dwLengthofParameters = oDataView.getUint32(offset,true);
	};
}

ProgressReportNotification.Size = 40;


//ChangeMediaInfoRes Constructor
function ChangeMediaInfoRes() {
	this.owCardGUID = "";
	this.dwErrorCode = 0;
	this.Read = function(oDataView, offset) {
		this.owCardGUID = Dw2HexString(oDataView.getUint32(offset+12,true)) + Dw2HexString(oDataView.getUint32(offset+8,true)) + Dw2HexString(oDataView.getUint32(offset+4,true)) + Dw2HexString(oDataView.getUint32(offset,true));
		offset += 16;
		this.dwErrorCode = oDataView.getUint32(32,true);
	};
}

ChangeMediaInfoRes.Size = 20;


//PrepareMediaForEjectionRes Constructor
function PrepareMediaForEjectionRes() {
	this.owGUID = "";
	this.dwErrorCode = 0;
	this.Read = function(oDataView, offset) {
		this.owGUID = Dw2HexString(oDataView.getUint32(offset+12,true)) + Dw2HexString(oDataView.getUint32(offset+8,true)) + Dw2HexString(oDataView.getUint32(offset+4,true)) + Dw2HexString(oDataView.getUint32(offset,true));
		offset += 16;
		this.dwErrorCode = oDataView.getUint32(offset,true);
	};
}

PrepareMediaForEjectionRes.Size = 20;


//CardMediaInfoChangedNotification Constructor
function CardMediaInfoChangedNotification() {
	this.owCardGUID = "";
	this.cbySizeOfMedia = 0;
	this.dwCardNumber = 0;
	this.dwSectorSize = 0;
	this.dwFlags = 0;
	this.dwRAIDType = 0;
	this.cbyManufacturerString = 0;
	this.cbyUserCommentString = 0;
	this.achManufacturer = "";
	this.achUserComment = "";
	this.dwReasonCode = 0;
	this.Read = function(oDataView, oIndata, offset) {
		this.owCardGUID = Dw2HexString(oDataView.getUint32(offset+12,true)) + Dw2HexString(oDataView.getUint32(offset+8,true)) + Dw2HexString(oDataView.getUint32(offset+4,true)) + Dw2HexString(oDataView.getUint32(offset,true));
		offset += 16;
		this.cbySizeOfMedia = oDataView.getUint32(offset,true) + oDataView.getUint32(offset+4,true) * Math.pow(2,32);
		offset += 8;
		this.dwCardNumber = oDataView.getUint32(offset,true);
		offset += 4;
		this.dwSectorSize = oDataView.getUint32(offset,true);
		offset += 4;
		this.dwFlags = oDataView.getUint32(offset,true);
		offset += 4;
		this.dwRAIDType = oDataView.getUint32(offset,true);
		offset += 4;
		this.cbyManufacturerString = oDataView.getUint32(offset,true);
		offset += 4;
		this.cbyUserCommentString = oDataView.getUint32(offset,true);
		offset += 4;
		this.achManufacturer = String.fromCharCode.apply(null,oIndata.subarray(offset,offset+this.cbyManufacturerString));
		offset += 16;
		this.achUserComment = String.fromCharCode.apply(null,oIndata.subarray(offset,offset+this.cbyUserCommentString));
		offset += 48;
		this.dwReasonCode = oDataView.getUint32(offset,true);
	};
}

CardMediaInfoChangedNotification.Size = 116;


//DeletePartitionRes Constructor
function DeletePartitionRes() {
	this.owPUID = "";
	this.dwErrorCode = 0;
	this.Read = function(oDataView, offset) {
		this.owPUID = Dw2HexString(oDataView.getUint32(offset+12,true)) + Dw2HexString(oDataView.getUint32(offset+8,true)) + Dw2HexString(oDataView.getUint32(offset+4,true)) + Dw2HexString(oDataView.getUint32(offset,true));
		offset += 16;
		this.dwErrorCode = oDataView.getUint32(offset,true);
	};
}

DeletePartitionRes.Size = 20;


//BreakMirrorRes Constructor
function BreakMirrorRes() {
	this.owPUID = "";
	this.dwErrorCode = 0;
	this.Read = function(oDataView, offset) {
		this.owPUID = Dw2HexString(oDataView.getUint32(offset+12,true)) + Dw2HexString(oDataView.getUint32(offset+8,true)) + Dw2HexString(oDataView.getUint32(offset+4,true)) + Dw2HexString(oDataView.getUint32(offset,true));
		offset += 16;
		this.dwErrorCode = oDataView.getUint32(offset,true);
	};
}

BreakMirrorRes.Size = 20;


//PartitionProgressNotification Constructor
function PartitionProgressNotification() {
	this.owPUID = "";
   this.dwFlags = 0;
	this.dwErrorCode = 0;
	this.dwCommand = 0;
	this.dwOperationRequired = 0;
	this.dwOperationCompleted = 0;
	this.Read = function(oDataView, offset) {
		this.owPUID = Dw2HexString(oDataView.getUint32(offset+12,true)) + Dw2HexString(oDataView.getUint32(offset+8,true)) + Dw2HexString(oDataView.getUint32(offset+4,true)) + Dw2HexString(oDataView.getUint32(offset,true));
		offset += 16;
      this.dwFlags = oDataView.getUint32(offset,true);
      offset += 4;
		this.dwErrorCode = oDataView.getUint32(offset,true);
		offset += 4;
		this.dwCommand = oDataView.getUint32(offset,true);
		offset += 4;
		this.dwOperationRequired = oDataView.getUint32(offset,true);
		offset += 4;
		this.dwOperationCompleted = oDataView.getUint32(offset,true);
	};
}

PartitionProgressNotification.Size = 36;


//DefinePartitionRes Constructor
function DefinePartitionRes(){
	this.owCardGUID = "";
	this.owPUID = "";
	this.owPeerPUID = "";
	this.dwErrorCode = 0;
	this.Read = function(oDataView, offset) {
		this.owCardGUID = Dw2HexString(oDataView.getUint32(offset+12,true)) + Dw2HexString(oDataView.getUint32(offset+8,true)) + Dw2HexString(oDataView.getUint32(offset+4,true)) + Dw2HexString(oDataView.getUint32(offset,true));
		offset += 16;
		this.owPUID = Dw2HexString(oDataView.getUint32(offset+12,true)) + Dw2HexString(oDataView.getUint32(offset+8,true)) + Dw2HexString(oDataView.getUint32(offset+4,true)) + Dw2HexString(oDataView.getUint32(offset,true));
		offset += 16;
		this.owPeerPUID = Dw2HexString(oDataView.getUint32(offset+12,true)) + Dw2HexString(oDataView.getUint32(offset+8,true)) + Dw2HexString(oDataView.getUint32(offset+4,true)) + Dw2HexString(oDataView.getUint32(offset,true));
		offset += 16;
		this.dwErrorCode = oDataView.getUint32(offset,true);
	};
}

DefinePartitionRes.Size = 52;


//SetPartitionRes Constructor
function SetPartitionRes() {
	this.owPUID = "";
	this.dwErrorCode = 0;
	this.Read = function(oDataView, offset) {
		this.owPUID = Dw2HexString(oDataView.getUint32(offset+12,true)) + Dw2HexString(oDataView.getUint32(offset+8,true)) + Dw2HexString(oDataView.getUint32(offset+4,true)) + Dw2HexString(oDataView.getUint32(offset,true));
		offset += 16;
		this.dwErrorCode = oDataView.getUint32(offset,true);
	};
}

SetPartitionRes.Size = 20;


//ClaimPartitionRes Constructor
function ClaimPartitionRes() {
	this.owPUID = "";
	this.dwErrorCode = 0;
	this.Read = function(oDataView, offset) {
		this.owPUID = Dw2HexString(oDataView.getUint32(offset+12,true)) + Dw2HexString(oDataView.getUint32(offset+8,true)) + Dw2HexString(oDataView.getUint32(offset+4,true)) + Dw2HexString(oDataView.getUint32(offset,true));
		offset += 16;
		this.dwErrorCode = oDataView.getUint32(offset,true);
	};
}

ClaimPartitionRes.Size = 20;


//VerifyPartitionRes Constructor
function VerifyPartitionRes() {
	this.owPUID = "";
	this.dwErrorCode = 0;
	this.Read = function(oDataView, offset) {
		this.owPUID = Dw2HexString(oDataView.getUint32(offset+12,true)) + Dw2HexString(oDataView.getUint32(offset+8,true)) + Dw2HexString(oDataView.getUint32(offset+4,true)) + Dw2HexString(oDataView.getUint32(offset,true));
		offset += 16;
		this.dwErrorCode = oDataView.getUint32(offset,true);
	};
}


//ReleasePartitionRes Constructor
function ReleasePartitionRes() {
	this.owPUID = "";
	this.dwErrorCode = 0;
	this.Read = function(oDataView, offset) {
		this.owPUID = Dw2HexString(oDataView.getUint32(offset+12,true)) + Dw2HexString(oDataView.getUint32(offset+8,true)) + Dw2HexString(oDataView.getUint32(offset+4,true)) + Dw2HexString(oDataView.getUint32(offset,true));
		offset += 16;
		this.dwErrorCode = oDataView.getUint32(offset,true);
	};
}

ReleasePartitionRes.Size = 20;



//SharePartitionRes Constructor
function SharePartitionRes() {
	this.owPUID = "";
	this.dwErrorCode = 0;
	this.Read = function(oDataView, offset) {
		this.owPUID = Dw2HexString(oDataView.getUint32(offset+12,true)) + Dw2HexString(oDataView.getUint32(offset+8,true)) + Dw2HexString(oDataView.getUint32(offset+4,true)) + Dw2HexString(oDataView.getUint32(offset,true));
		offset += 16;
		this.dwErrorCode = oDataView.getUint32(offset,true);
	};
}

SharePartitionRes.Size = 20;


//UnsharePartitionRes Constructor
function UnsharePartitionRes() {
   this.owPUID = "";
	this.dwErrorCode = 0;
	this.Read = function(oDataView, offset) {
		this.owPUID = Dw2HexString(oDataView.getUint32(offset+12,true)) + Dw2HexString(oDataView.getUint32(offset+8,true)) + Dw2HexString(oDataView.getUint32(offset+4,true)) + Dw2HexString(oDataView.getUint32(offset,true));
		offset += 16;
		this.dwErrorCode = oDataView.getUint32(offset,true);
	};
}

UnsharePartitionRes.Size = 20;


//CancelQueuedTaskRes Constructor
function CancelQueuedTaskRes() {
	this.owUID = "";
   this.owCommandCancelled = -1;
	this.dwErrorCode = 0;
	this.Read = function(oDataView, offset) {
		this.owUID = Dw2HexString(oDataView.getUint32(offset+12,true)) + Dw2HexString(oDataView.getUint32(offset+8,true)) + Dw2HexString(oDataView.getUint32(offset+4,true)) + Dw2HexString(oDataView.getUint32(offset,true));
		offset += 16;
      this.owCommandCancelled = oDataView.getUint32(offset,true);
      offset += 4;
		this.dwErrorCode = oDataView.getUint32(offset,true);
	};
}

CancelQueuedTaskRes.Size = 24;


//StorageWriteCompleteRes Constructor
function StorageWriteCompleteRes() {
	this.owPUID = "";
	this.dwErrorCode = 0;
	this.Read = function(oDataView, offset) {
		this.owPUID = Dw2HexString(oDataView.getUint32(offset+12,true)) + Dw2HexString(oDataView.getUint32(offset+8,true)) + Dw2HexString(oDataView.getUint32(offset+4,true)) + Dw2HexString(oDataView.getUint32(offset,true));
		offset += 16;
		this.dwErrorCode = oDataView.getUint32(offset,true);
	};
}

StorageWriteCompleteRes.Size = 20;

//ReadResponseNetwork Constructor
function ReadResponseNetwork() {
	this.owPUID = "";
   this.dwErrorCode = 0;
	this.dwOffsetBySector = 0;
	this.cNumOfSectors = 0;
	this.byLastReadFromPartition = 0;
   this.Read = function(oDataView, offset) {
   	this.owPUID = Dw2HexString(oDataView.getUint32(offset+12,true)) + Dw2HexString(oDataView.getUint32(offset+8,true)) + Dw2HexString(oDataView.getUint32(offset+4,true)) + Dw2HexString(oDataView.getUint32(offset,true));
	   offset += 16;
	   this.dwErrorCode = oDataView.getUint32(offset,true);
	   offset += 4;
		this.dwOffsetBySector = oDataView.getUint32(offset,true);
		offset += 4;
		this.cNumOfSectors = oDataView.getUint32(offset,true);
		offset += 4;
		this.byLastReadFromPartition = oDataView.getUint8(offset,true);
   };
}

//ChangeRAIDSettingRes Constructor
function ChangeRAIDSettingRes() {
	this.dwErrorCode = 0;
	this.Read = function(oDataView, offset) {
		this.dwErrorCode = oDataView.getUint32(offset,true);
	};
}

ChangeRAIDSettingRes.Size = 4;


//ReadRawRegistersRes COnstructor
function ReadRawRegistersRes() {
	this.owCardGUID = "";
	this.dwErrorCode = 0;
	this.sdRawRegisters = {
		dwOCR: 0,
		dwCID: [0, 0, 0, 0],
		dwCSD: [0, 0, 0, 0],
		dwRCA: 0,
		dwDSR: 0,
		dwSCR: 0
	};
	this.Read = function(oDataView, offset) {
		this.owCardGUID = Dw2HexString(oDataView.getUint32(offset+12,true)) + Dw2HexString(oDataView.getUint32(offset+8,true)) + Dw2HexString(oDataView.getUint32(offset+4,true)) + Dw2HexString(oDataView.getUint32(offset,true));
		offset += 16;
		this.dwErrorCode = oDataView.getUint32(offset,true);
		offset += 4;
		this.sdRawRegisters.dwOCR = oDataView.getUint32(offset,true);
		offset += 4;
		this.sdRawRegisters.dwCID[0] = oDataView.getUint32(offset,true);
		offset += 4;
		this.sdRawRegisters.dwCID[1] = oDataView.getUint32(offset,true);
		offset += 4;
		this.sdRawRegisters.dwCID[2] = oDataView.getUint32(offset,true);
		offset += 4;
		this.sdRawRegisters.dwCID[3] = oDataView.getUint32(offset,true);
		offset += 4;
		this.sdRawRegisters.dwCSD[0] = oDataView.getUint32(offset,true);
		offset += 4;
		this.sdRawRegisters.dwCSD[1] = oDataView.getUint32(offset,true);
		offset += 4;
		this.sdRawRegisters.dwCSD[2] = oDataView.getUint32(offset,true);
		offset += 4;
		this.sdRawRegisters.dwCSD[3] = oDataView.getUint32(offset,true);
		offset += 4;
		this.sdRawRegisters.dwRCA = oDataView.getUint32(offset,true);
		offset += 4;
		this.sdRawRegisters.dwDSR = oDataView.getUint32(offset,true);
		offset += 4;
		this.sdRawRegisters.dwSCR = oDataView.getUint32(offset,true);
	};
}



//PartitionInfoEntry Constructor
function PartitionInfoEntry() {
   this.owGUID = "";
   this.owPUID = "";
   this.owPUIDPeer = "";
   this.qwOffsetInBytesOnCard = 0;
   this.qwSizeInBytes = 0;
   this.dwSizeInSectors = 0;
   this.dwAlignedSizeInSectors = 0;
   this.qwImageSizeInBytes = 0;   //image size in bytes,ISO, floppy image
   this.dwLogicSizeInSectors = 0;
   this.dwSectorOffSetIntoCard = 0;
   this.dwType = 0;				   //partition type
   this.dwStartWithOddSector = 0;
   this.dwInitialFormatType = 0;
   // Flags
   this.bitPspCanMount = 0;
   this.bitHostCanMount = 0;
   this.bitSoftwareWriteProtected = 0;
   this.bitRebuildInProgress = 0;
   this.bitFormatInProgress = 0;
   this.bitResizeInProgress = 0;
   this.bitVerifyInProgress = 0;
   this.bitUploadInProgress = 0;
   this.bitDownloadInProgress = 0;
   this.bitShared = 0;
   this.bitSharedAsdWritable = 0; //// TODO:: fix typo remove d
   this.bitPSPMounted = 0;
   this.bitUpdatePartitionInfoInProgress = 0;
   this.bitIntegrity = 0;

   this.dwMediaType = 0;
   this.dwClaimType = 0;
   this.cbyPartitionName = 0;
   this.cbyUserComment = 0;
   this.abyPartitionName = "";
   this.abyUserComment = "";
   this.abyReserved = "";
}

PartitionInfoEntry.Size = 512;
