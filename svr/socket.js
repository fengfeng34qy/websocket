var zTool = require("./zTool");
var onlineUserMap = new zTool.SimpleMap();
var historyContent = new zTool.CircleList(100);

var chatLib = require("./chatLib");
var EVENT_TYPE = chatLib.EVENT_TYPE;
var PORT = chatLib.PORT;
console.log(PORT);
//使用socket.io直接启动http服务
var io = require("socket.io").listen(PORT);

io.sockets.on("connection",function(socket){
    socket.on("message",function(message){
        var mData = chatLib.analyzeMessageData(message);
        if (mData && mData.EVENT) {
			switch (mData.EVENT) {
			case EVENT_TYPE.LOGIN: // 新用户连接
                socket.name = socket.id;
				var newUser = {'uid':socket.id, 'nick':chatLib.getMsgFirstDataValue(mData),'face':chatLib.getMsgFace(mData)};

				// 把新连接的用户增加到在线用户列表
				onlineUserMap.put(socket.id, newUser);

				// 把新用户的信息广播给在线用户
                var data = JSON.stringify({
                    'user':onlineUserMap.get(socket.id),
                    'EVENT' : EVENT_TYPE.LOGIN,
                    'values' : [newUser],
                    'onLineCounts': onlineUserMap.values().length,
                    'users':onlineUserMap.values().length,
                    'historyContent':historyContent.values()
               });
                io.sockets.emit('message',data);//广播
                //socket.emit('message',data);
               // socket.broadcast.emit('message', data);//无效
				break;

			case EVENT_TYPE.SPEAK: // 用户发言
				var content = chatLib.getMsgFirstDataValue(mData);
				var face = chatLib.getMsgFace(mData);
				var origin = chatLib.getOrigin(mData);
                var data = JSON.stringify({
                    'user':onlineUserMap.get(socket.id),
                    'EVENT' : EVENT_TYPE.SPEAK,
                    'values' : [content,face,origin]
                });
                //socket.emit('message',data);
                io.sockets.emit('message',data);
				historyContent.add({'user':onlineUserMap.get(socket.id),'content':content,'time':new Date().getTime()});
				break;

            case EVENT_TYPE.LOGOUT: // 用户请求退出
                var user = mData.values[0];
                onlineUserMap.remove(user.uid);
                var data = JSON.stringify({
                    'EVENT' : EVENT_TYPE.LOGOUT,
                    'values' : [user],
                    'onLineCounts': onlineUserMap.values().length
                });
                io.sockets.emit('message',data);
                break;

			    default:
				break;
			}

		} else {
			// 事件类型出错，记录日志，向当前用户发送错误信息
			console.log('desc:message,userId:' + socket.id + ',message:' + message);
            var data = JSON.stringify({
                'uid':socket.id,
                'EVENT' : EVENT_TYPE.ERROR
            });
            socket.emit('message',data);
		}
   });

    // 监听用户断开连接 (退出聊天室)
    socket.on('disconnect', function(){
        'use strict';
        console.log('用户退出了连接');
        console.log('id:' + socket.name);
        console.log(onlineUserMap);
        if(onlineUserMap.map.hasOwnProperty(socket.name)){
            var nick = onlineUserMap.map[socket.name].nick;
            delete onlineUserMap.map[socket.name];
            // onLineCounts--;
            var data = JSON.stringify({
                'EVENT' : 'LOGOUT',
                'values' : [nick],
                'onLineCounts': onlineUserMap.values().length
            });
            console.log('广播用户退出消息');
            /* 向所有客户端广播该用户退出群聊 */
            io.sockets.emit('message',data);

        }
    });

});

console.log('Start listening on port ' + PORT);