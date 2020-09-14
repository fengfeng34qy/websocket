/*
#define IMATE_PORT_ERROR			-1		//端口打开失败
#define IMATE_PORT_OPENED			-2		//端口已经打开
#define IMATE_PORT_NOTOPEN			-3		//端口未打开
#define IMATE_COMM_ERROR			-4		//通讯失败，包括以下三种情况：1数据发送失败；2数据接收失败；3数据接收超时。
#define IMATE_WORK_BUSY				-5		//设备忙
#define IMATE_WORK_TIMEOUT			-6		//操作等待超时，例如等待刷卡超时、等待插卡超时...
#define IMATE_WORK_ERROR			-7		//操作失败, 例如刷卡失败、读卡失败等。
#define IMATE_WORK_DEVICE			-8		//不支持的设备
#define IMATE_OTHER_ERROR			-99		//其它错误
*/

define(function() {
	window.require = window.requireNode;
	var edge = require('edge');
	window.require = window.requirejs;
	
	var imate_online = edge.func(function() {/*
	using System.Runtime.InteropServices;
	using System.Threading.Tasks;
	public class Program {
		[DllImport("lib/imateface.dll", EntryPoint = "imate_online")]
    	static extern int imate_online();
    	public static int ImateOnline() {
        	return imate_online();
    	}
	}
	public class Startup {
		public async Task<object> Invoke(object input) {
			return Program.ImateOnline();
    	}
 	}
	*/});
	
	var imate_open = edge.func(function() {/*
	using System.Runtime.InteropServices;
	using System.Threading.Tasks;
	public class Program {
		[DllImport("lib/imateface.dll", EntryPoint = "imate_open")]
    	static extern int imate_open(string port);
    	public static int ImateOpen(string port) {
        	return imate_open(port);
    	}
	}
	public class Startup {
		public async Task<object> Invoke(object input) {
			return Program.ImateOpen((string)input);
    	}
 	}
	*/});
	
	var imate_swipe = edge.func(function() {/*
 	using System.Runtime.InteropServices;
 	using System.Threading.Tasks;
 	//using System;
	using System.Text;
	public	class TrackData {
 		public int retcode;
		public int timeout;
		public byte[] track2;
		public byte[] track3;
	}
	public class Program {
		[DllImport("lib/imateface.dll", EntryPoint = "imate_swipe")]
		static extern int imate_swipe(StringBuilder track2, StringBuilder track3, int timeout);
		public static object ImateSwipe(int timeout) {
			int result = 0;
			StringBuilder track2 = new StringBuilder(300);
			StringBuilder track3 = new StringBuilder(300);
        	result = imate_swipe(track2, track3, timeout);
			TrackData trackdata = new TrackData();
			trackdata.retcode = result;
			trackdata.timeout = timeout;
			trackdata.track2 = Encoding.ASCII.GetBytes(track2.ToString());
			trackdata.track3 = Encoding.ASCII.GetBytes(track3.ToString());
			return trackdata;
		}
	}
	public class Startup {
		public async Task<object> Invoke(dynamic input) {
			return Program.ImateSwipe((int)input.timeout);
		}
	}
	*/});
	
	var imate_idcard = edge.func(function() {/*
	using System.Runtime.InteropServices;
	using System.Threading.Tasks;
	using System.Text;
 	public class IdcardData {
 		public int retcode;
		public int timeout;
		public byte[] idinfo;
		public byte[] photodata;
	}
	public class Program {
    	[DllImport("lib/imateface.dll", EntryPoint = "imate_idcard")]
		static extern int imate_idcard(StringBuilder idinfo, StringBuilder photodata, int timeout);
		public static object ImateIdcard(int timeout) {
			int result = 0;
			StringBuilder idinfo = new StringBuilder(600);
			StringBuilder photodata = new StringBuilder(2048);
			result = imate_idcard(idinfo, photodata, timeout);
			IdcardData idcarddata  = new IdcardData();
			idcarddata.retcode = result;
			idcarddata.timeout = timeout;
			idcarddata.idinfo = Encoding.UTF8.GetBytes(idinfo.ToString());
			idcarddata.photodata = Encoding.ASCII.GetBytes(photodata.ToString());
			return idcarddata;
		}
	}
	public class Startup {
		public async Task<object> Invoke(object input) {
			return Program.ImateIdcard((int)input);
		}
	}
	*/});

	var imate_pboccard = edge.func(function() {/*
	using System.Runtime.InteropServices;
	using System.Threading.Tasks;
	using System.Text;
	public class PboccardData {
 		public int retcode;
		public int timeout;
		public byte[] cardinfo;
	}
	public class Program {
    	[DllImport("lib/imateface.dll", EntryPoint = "imate_pboccard")]
		static extern int imate_pboccard(StringBuilder cardinfo, int timeout);
		public static object ImatePboccard(int timeout) {
			int result = 0;
			StringBuilder cardinfo = new StringBuilder(2048);
			result = imate_pboccard(cardinfo, timeout);
			PboccardData pboccardData  = new PboccardData();
			pboccardData.retcode = result;
			pboccardData.timeout = timeout;
			pboccardData.cardinfo = Encoding.UTF8.GetBytes(cardinfo.ToString());
			return pboccardData;
		}
	}
	public class Startup {
		public async Task<object> Invoke(object input) {
			return Program.ImatePboccard((int)input);
		}
	}
	*/});
	
	var imate_pboccard1 = function(timeout, cb) {
		imate_pboccard(timeout, function(err, result) {
			if (err) cb(err, null);
			else if (0 == result.retcode) {
				var str = result.cardinfo.toString();
				var re = new RegExp('^<cardNo>(.*)</cardNo><expireDate>(.*)</expireDate><holderId>(.*)</holderId><holderName>(.*)</holderName><track2>(.*)</track2><panSequence>(.*)</panSequence>$');
				var par = str.match(re);
				var jsonret = {cardNo: par[1], expireDate: par[2], holderId: par[3], holderName: par[4], track2: par[5], panSequence: par[6]};
				cb(null, jsonret);
			} else cb(null, result);
		});
	};
	
	return {
		imate_online: imate_online,
		imate_open: imate_open,
		imate_swipe: imate_swipe,
		imate_idcard: imate_idcard,
		imate_pboccard: imate_pboccard1
	};
});
