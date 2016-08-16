define (function (require) {

	var server={requestURL:"", reqType:"",reqdata:"",callBackSuccess:""};
	var BaseURL = "http://msi-vmsupstgportalap.metricstream.com:8010/wtr/";
	var authorization;
	var errorMessage = "internal_error";

	function servercall_success(msg)
	{
		try{

			server.callBackSuccess(msg);

		}catch(e){

		}
	};

	function servercall_error(msg)
	{
			var data;
			if(404 === msg.status){
				server.callBackSuccess(data,"matches_not_found");
			}else if(408 === msg.status || 200 > msg.status || 3 === msg.code){
				server.callBackSuccess(data,"network_failed");
			}else if(401 === msg.status){
				server.callBackSuccess(data,"invalid_session");
			}else{
				server.callBackSuccess(data,errorMessage);
			}

	};

	var serverCall = {

		login:function(reqdata,successFunction)
		{
				var data = JSON.stringify(reqdata);
				this.connectServer("POST","login",data,successFunction);
		},
		tasks:function(successFunction)
		{
			this.connectServer("GET","tasks","",successFunction);
		},
		takeAction:function(reqdata,successFunction)
		{
			var data = JSON.stringify(reqdata);
			this.connectServer("PUT","tasks/"+reqdata.instanceId,data,successFunction);
		},
		logout:function(successFunction)
		{

		},
		connectServer:function (reqType,reqURL,reqdata,successFunction,contentType)
		{
			try
			{
				server.reqType = reqType;
				server.reqdata = reqdata;
				server.callBackSuccess = successFunction;
				server.requestURL = reqURL;

				var type = contentType;
				if(!contentType)
				{
						type = "application/json";
				}

				makeServerCall(reqType,BaseURL+reqURL,reqdata,servercall_success,servercall_error,type);
			}
			catch (e)
			{
				if (e instanceof TypeError)
				{
					alert("Type Error encountered. The description is " + e.message);
				}
				else if (e instanceof SyntaxError)
				{
					alert("Syntax Error encountered. The description is " + e.message);
				}
				else
				{
					alert("Error encountered. The description is " + e.message);
				}
			}
		}

	};

	function makeServerCall(reqType,serviceUrl,reqdata,successFunction,errorFunction,contentType)
	{


			$.ajax({
				beforeSend			:  function (xhr){
															xhr.setRequestHeader('authorization', authorization);
															xhr.setRequestHeader('access-control-allow-origin','*');
													},
				cache						: false,
				complete				: function (xhr) {},
				type            : reqType, //GET or POST or PUT or DELETE verb
				url             : serviceUrl, // Location of the service
				data            : reqdata, //Data sent to server
				contentType     : contentType, // content type sent to server
				processdata     : false, //True or False
				timeout			    : 60000,
				xhrFields       : {withCredentials: true},
				success         : successFunction,
				error						: errorFunction,

			});
	}
	return serverCall;
});
