define(['backbone'], function (Backbone, require) {
	var UserInfo = Backbone.Model.extend({
		defaults: {
			userid: '',
			username: '',
			password: '',
			device_num: '',
			device_name: '',
			pdno: '',
			menulist: '',
			oid: '',
			device_num: '',
			socketio_connect: ''
		}
	});

	// 此对象作为新预填单所有信息对象的命名空间
	var BaseAccountInfo = Backbone.Model.extend({
		defaults: {
			//模板样例
			baseInfo: {
				main_name_dom: "",					//主体名称所在表单，每个交易都应该有，请在完成前赋值
				transferAmt: "",						//真实金额
				rexValue: "",						//格式化回显金额
			},
			//个人活期账户开户
			personalOpenAccount: {
				main_name_dom: "",
				idcardReaded: '',		//身份证成功读取标志
				readIdCardNum: "",		//身份证号
				CstNmN: "",			//户名
				CstMblNum: "",		//手机号码

				input_dz: '',
				input_ws: '',
				input_dh: '',
				input_zz: '',
				open_amt: "",

				isSz: '',				//是否是深圳机构，1是，0不是
				photoWidth: '',			//需要的照片宽度(px)
				photoHeight: ''			//需要的照片高度(px)
				// transferAmt: "",						//真实金额
				// rexValue: "",						//格式化回显金额
			},
			//驾校考试业务
			drivingExam: {
				main_name_dom: "",
				allowAMET: '',				//外设可用标志
				errorAMET: '',				//外设错误描述
				amt: '',						//总缴费金额
				transferAmt: "",						//真实金额
				rexValue: "",						//格式化回显金额
			},
			//对公现金支取
			corporateCashCheque: {
				main_name_dom: "",
				serNo: "",					//流水号
				getSerNo: '',				//返回的流水号
				pic1: '',					//照片正面
				pic2: '',					//照片反面
				transferAmt: "",						//真实金额
				rexValue: "",						//格式化回显金额
			},
			//单位活期存款
			corporateCurrentDeposit: {
				main_name_dom: "",
				keyInfo: "",
				cardType: "",
				hasCheckPassword: '',		//验密标志
				name: '',					//户名
				account: '',					//账号
				money: '',					//余额
				moneyType: '',				//币种
				hasReadCard: '',				//当前卡号合法标志
				allowAMET: '',				//外设可用标志
				errorAMET: '',				//外设错误描述
				transferAmt: "",						//真实金额
				rexValue: "",						//格式化回显金额

				checkPasswordFun: "",			//验密接口
				noCheck: "",						//时候禁用余额查询
			},
			//一卡通缴费
			lifePayment: {
				main_name_dom: "",
				keyInfo: "",
				allowAMET: '',				//外设可用标志
				errorAMET: '',				//外设错误描述
				idCardReaded: '',			//身份信息已读取标志
				session_customerId: "",		//渠道客户号
				session_customerNameCN: "", //渠道客户姓名
				customerSelfName: "",		//本人客户姓名
				openNode: "",               //付款人开户机构号
				idType: "",                	//付款人证件类型
				customerSelfId: "",         //付款人证件号码

				cityCode: '',				//城市编号
				typeList: '',				//种类数组
				comObject: '',				//公司信息对象
				numType: '',					//号码类别
				allNum: '',					//全网号
				jfNo: '',					//缴费编号

				transferAmt: "",						//真实金额
				rexValue: "",						//格式化回显金额

			},
		}
	});

	var GiftShoppingItem = Backbone.Model.extend({
		defaults: {
			giftCode: '',
			giftCount: '',
			scoreType: 0,
			telNo: '',
			addr: '',
			shopSuccess: 0 //0-初始，1-成功，2-失败
		}
	});
	var ServiceShoppingItem = Backbone.Model.extend({
		defaults: {
			merchantCode: '',
			exchangeScore: '',
			exchangeDesc: '',
			scoreType: 0,
			shopSuccess: 0 //0-初始，1-成功，2-失败
		},
		initialize: function () {
			this.on('change: shopSuccess', function () {
				this.reset();
			});
		}
	});
	var GiftShoppingItems = Backbone.Collection.extend({
		model: GiftShoppingItem
	});
	var ServiceShoppingItems = Backbone.Collection.extend({
		model: ServiceShoppingItem
	});
	var CustInfo = Backbone.Model.extend({
		defaults: {
			custname: '',
			originDebitPoint: '', //兑换前客户借记卡积分
			originCreditPoint: '', //兑换前客户信用卡积分
			custinfo_type: '',
			custinfo_num: '',
			selectedPointType: 0, //积分兑换时选择的积分类型 0-借记卡，1-信用卡
			serviceShoppingList: null, //服务兑换单
			giftShoppingList: null //礼品兑换单
		},
		initialize: function () {
			this.set('giftShoppingList', new GiftShoppingItems());
			this.set('serviceShoppingList', new ServiceShoppingItems());
		}
	});
	//显示产品理财详细信息的对象
	var ProductsFinance = Backbone.Model.extend({
		defaults: {
			productid: '',
			productname: '',
			profittype: '',
			profitrate: '',
			mincash: '',
			startdate: '',
			duedate: '',
			enddate: '',
			risklevel: '',
			isnew: '',
			ishot: '',
			isfavor: '',
			investmentcurrency: '',//币种
			IncreasAmount: '',     //递增金额
			valuedate: '',		   //起息日
			deadline: '',	 	   //截至日期
			Saleschannels: '',	   //销售渠道
			isLoadPic: ''//是否加载图片详情页面	
		}
	});
	//传送排队信息的对象
	var showQueueNo = Backbone.Model.extend({
		defaults: {
			queue_num: '',  //队列号
			waitnum: '',    //队列等待人数
			vwaittime: '',  //虚拟等待叫号时间
			tradewin: '',   //可办窗口
			custinfo_tel: '',//客户电话
			bs_name_ch: '',//业务名称
			bs_id: '',//业务id
			check_queue_value: '',//验证码
			queueno: ''//原排队号
		}
	});

	var getCustomerInfo = Backbone.Model.extend({
		defaults: {
			custinfo_type: '',//证件类型
			custinfo_num: ''//证件号码
		}
	});
	//身份证信息
	var idCardInfo = Backbone.Model.extend({
		defaults: {
			name: '',
			sex: '',
			race: '',
			birthday: '',
			address: '',
			idNo: '',
			office: '',
			expiryDate: ''
		}
	});
	//IC卡信息
	SicCardInfo = Backbone.Model.extend({
		defaults: {
			icNo: '',
			icNoEr: ''
		}
	});
	//储存预填单客户信息的model
	PreFilledInfo = Backbone.Model.extend({
		defaults: {
			custinfo_flag: '',//客户信息标识
			custinfo_type: '',//证件类型
			custinfo_num: '',//证件号码
			custinfo_name: '',//客户姓名
			custinfo_sex: '',//客户性别
			id_num: '',//身份证号码
			employer_name: '',//工作单位
			phone_number: '',// 固定电话
			addr_street1: '',// 通讯地址
			electron_address: '',// 电子邮箱
			occupation_code: '',//职业
			birth_date: '',//生日
			passport_num: '',//护照号码
			customer_num: '',//客户号（浦发）
			card_num: '',//持有银行卡卡号
			bank_book_num: '',//持有存折账号
			custtype_e: '',//外部客户类型
			custtype_i: '',//内部客户类型
			asset_information: '',//资产信息
			avg_balance: '',//理财三月平均余额
			yesterday_balance: '',//昨日资产余额
			bs_case: '',//业务开通情况
			marketing_content: '',//智能营销话语
			open_branch: '',//开户行
			cust_mgr: '',//归属客户经理代码
			cust_mgr_name: '',//归属客户经理姓名
			cust_mgr_tel: '',//归属客户经理电话
			custinfo_name_en: '',//客户姓名(英)
			cust_class_code: '',//客户分类代码
			cust_type_code: '',//客户类型代码
			cust_pub_level: '',//对公客户等级
			cust_pri_level: '',//对私客户等级
			custinfo_tel: '',//客户电话
			creditInformation: '',//是否确认提供贷款预授服务1表示是
			district_number: '',//办理人电话地区区号
			hasSignReceiptCust: '',//是否已签约回单机(客户级)
			hasSignReceiptAcct: '',//是否已签约回单机(账户级)
		}
	});

	ReservInfo = Backbone.Model.extend({
		defaults: {
			reserv_id: '',
			reserv_bs_id: '',
			reserv_flag: '',
			custinfo_type: '',
			custtype_i: '',
			custinfo_num: ''
		}
	});

	UpdateMasketInfo = Backbone.Model.extend({
		defaults: {
			clue_id: '',
			cluename: '',
			cluetype: '',
			clue_date: '',
			productClass: '',
			validity: '',
			cluelevel: '',
			promptinfo: '',
			MarketingRecord: '',
			work_date: '',
			work_time: '',
			actionchannel: '',
			actionuser: '',
			actionstatus: '',
			operatetype: '',
			abstract: ''
		}
	});

	//理财购买用户信息
	ChargeUserInfo = Backbone.Model.extend({
		defaults: {
			addr_street1: '',
			birth_date: '',
			card_num: '',
			checkresult: '',
			custinfo_name: '',
			custinfo_name_en: '',
			custinfo_sex: '',
			custinfo_tel: '',
			customer_num: '',
			expire_date: '',
			isretain: '',
			job: '',
			landlinetelephone: '',
			open_branch: '',
			open_date: '',
			papers_num: '',
			papers_type: '',
			post_code: '',
			use_date: '',
			voucher_num: '',
			voucher_state: ''
		}
	});
	//取号用户信息
	QuhaoUserInfo = Backbone.Model.extend({
		defaults: {
			bank_book_num: "",
			card_num: "",
			cust_mgr: "",
			cust_mgr_name: "",
			cust_mgr_tel: "",
			custinfo_name: "",
			custinfo_name_en: "",
			custinfo_num: "",
			custinfo_sex: "",
			custinfo_type: "",
			customer_num: "",
			custtype_i: "",
			open_branch: ""
		}
	});

	//理财购买信息
	ChargeDealInfo = Backbone.Model.extend({
		defaults: {
			work_time: '',
			work_date: '',
			businessnum: '',
			branchname: '',
			accountno: '',
			availablebal: '',
			accountbal: '',
			accountname: '',

			productid: '',
			productname: '',
			chargebal: ''
		}
	});
	//转账的信息
	TransferTradeInfo = Backbone.Model.extend({
		defaults: {
			transRoad: '',				//汇路	2极简  3普通 4行内借记卡 5行内信用卡
			payAccount: '',
			transferAmt: '',
			recAccount: '',
			recAccountName: '',
			payUse: '',
			isSmsNotic: '',
			mobileNo: '',
			recCity: '',
			//unionBankNo:'',
			recAccountOpenBank: '',
			recProvince: '',
			//recBankName:'',
			//recBankNo:'',
			payAccountOpenNode: '',
			customerType: '',
			session_customerId: '',//渠道客户号
			session_customerNameCN: '',//客户姓名
			openNode: '',//付款人开户机构号
			AcctUseBal: '',//账户可用余额
			DayTotExtctAmt: '',//当日累计取现金额
			IdentTp: '',//付款人证件类型
			IdentNo: '',//本人证件号码
			agentIdentNo: '',//代理人证件号码
			CheckResult: '',//1行内借记卡2行内信通卡3行外卡X查询失败
			recBankName: '',//银行名称
			recBankNo: '',//小额速汇行号
			hasData: '',//加密包是否已生成
			// 收款人名册(现在加载进入其他接口对应名称字段)
			//shoukuanRecAccountName:'',				//收款人名册中的收款人姓名
			//shoukuanRecAccountOpenBank:'',			//收款人名册中的银行名称
			//shoukunUnionBankNo:'',			//收款人名册中的具体银行网点号
			//shoukuanRecAccount:'',			//收款人名册中的收款人账号
			//shoukuanBankNoType:'',			//收款人名册中的收款账号类型
			//shoukuanRecBankNo:'',			//收款人超级网银行号
			//查询中行和周边网点
			bankName: '',						//具体网点的名称
			unionBankNo: '',						//具体网点的编号
			payBankName: '',						//总行的名称
			settleBankNo: '',						//总行的编号
			keyInfo: '',							//加密后的密码信息

			customer_photo: '',					//缓存的联网核查客户头像
			customerAgent_photo: '',				//缓存的联网核查代理人头像

			customerIdPicture: '',				//办理人身份证图片
			customerAgentIdPicture: '',			//代理人身份证图片

			//customerIdHeadPic:"",				//办理人身份证头像
			//customerAgentIdHeadPic:'',			//代理人身份证头像

			customerIdNo: '',					//办理人身份证号
			customerAgentIdNo: '',				//代理人身份证号

			fingerprint: '',						//指纹信息

			//DayTotExtctAmt:'',					//客户今日已转账额度

			extctAmt: '',							//本次累加转账金额

			rightMarks: ['0', '0', '0', '0', '0', '0'],		//每一步是否通过的标示
			passWordMark: false,

			photoBeginNum: "",						//上传影像平台的照片开始序号
			photoRange: '',						//图片上传次数限制
			agentRelationType: "",						//代理人关系
			CAcountRange: '',							//CA签名限制
			step4noNeed: '',
			CATemplate: '',							//pdf模板
			isSmallAgent: '',							//是否小额代理人办理
			finishCA: '',								//CA正确完成标识
			nowStep: '',									//当前是第几个页面
			hasAlert: '',									//已经打开了弹框
			FormrAhrTlrNo: '',						//授权柜员号

			againInterfaceNum: '',						//二次电子签名
			noPrint: "",									//是否不需要授权，默认为否(即需要授权)

			faceGrade: '',							//人脸识别分数
			distanceFlag: '',							//是否继续远程授权标志,即客户是否同意继续转账
			distanceFinish: '',							//授权完成标志,记录是否已经授权成功
			distanceDesc: '',								//授权原因
			distanceTimeout: "",								//远程授权计时器
			allowCancelDistance: '',						//允许取消远程授权按钮标志
			distanceSettimeOne: '',						//远程授权一分钟计时器
			distanceSettimeThree: '',						//远程授权三分钟计时器

			selfIdReadMethod: '',						//本人身份证号读取方式
			agentIdReadMethod: '',						//代理人身份证号读取方式
			tradeSendFinish: '',						//最终交易发送标志
			tradeSendFinish2: '',						//最终交易发送标志

			authTeller: '',							//授权柜员号
			judgeFlag: "",							//公安联查标志
		}
	});

	//通用session缓存
	var SessionTradeInfo = Backbone.Model.extend({
		defaults: {
			//session内的元素在需要自定义输入值的时候我会在对应方法的注释中声明,自己随便赋值导致奇怪的结果不要来问我
			//全局相关
			serNo: "",								//该交易流水号
			timecountflag: "",						//锁屏标志,true为继续开启锁屏计时
			hasAlert: "",							//在倒计时时是否存在其他弹框
			checkPasswordSuccess: '',				//验密成功修改为true,在转账操作前再次判断该标志
			isDebug: '',								//是否是电脑调试状态，如果是电脑则设置为true
			//客户信息相关
			isAgent: "",								//是否代理人办理
			customerSelfName: "",					//本人姓名
			customerAgentName: "",					//代理人姓名
			customerSelfId: "",						//本人身份证号
			customerAgentId: "",						//代理人身份证号
			session_customerId: '',					//渠道客户号
			session_customerNameCN: '',				//渠道客户名
			idType: '',								//付款人证件类型
			blacklistFlag: '',						//黑名单标志,true为灰黑名单
			//卡相关
			payAccount: '',							//付款人卡号
			recAccount: '',							//收款人卡号
			keyInfo: '',							    //加密后的密码信息,具体加密密码为keyInfo.value
			checkKeySuccessEvent: '',				//验密后的成功回调函数
			openNode: '',							//付款人开户机构号
			cardType: '',							//付款卡是磁条还是IC, 磁条是0,IC是1,降级交易是2
			cardInfo: '',							//外设读取卡对象信息
			idCardInfo: '',							//外设读取身份证对象信息
			//金额相关
			acctUseBal: '',							//账户可用余额
			dayTotExtctAmt: '',						//当日累计取现金额
			transferAmt: '',							//本次转账或付款金额
			extctAmt: '',							//本次累加转账金额总额
			//CA相关
			CATemplate: '',							//填充数据后的pdf模板
			CAPicture: "",							//CA完成后返回的照片
			CASignPic: "",							//CA签字图片
			CAData: "",								//CA加密包
			CAFinish: "",							//是否完成CA签名
			CASendFinish: "",						//是否完成加密包验证
			//授权相关
			fingerprint: "",							//本地指纹缓存
			FormrAhrTlrNo: '',						//授权柜员号
			successEvent: "",						//授权成功方法缓存
			refuseEvent: "",							//授权拒绝方法缓存
			failEvent: "",							//授权连接失败或异常方法缓存
			authorizationSuccessFlag: '',			//授权通过标志,任何方式通过授权该标志均为true
			authTeller: '',							//提交用授权柜员号
			//远程
			distanceDesc: '',						//远程授权原因
			distanceTimeout: "",						//远程授权计时器
			allowCancelDistance: '',					//允许取消远程授权按钮标志
			distanceSettimeOne: '',					//远程授权一分钟计时器
			distanceSettimeThree: '',				//远程授权三分钟计时器
			distanceFlag: '',						//是否继续远程授权标志,即客户是否同意继续交易
			distanceFinish: '',						//授权完成标志,记录是否已经授权成功
			distanceSuccessEvent: '',				//远程授权成功回调
			distanceRefuseEvent: "",					//远程授权被拒绝回调
			distanceFailEvent: '',					//远程授权连接失败回调
			//影像图片相关
			beginFacePic: '',						//起始人脸识别拍摄图片（非活体检测会在拍摄后直接赋值,活体检测在调用解密识别交易后赋值）
			isLiving: '',							//是否开启活体检测,在活体拍摄成功后自动赋值为true
			beginLivingFaceData: '',					//活体检测加密包数据
			selfIdPic: '',							//本人身份证生成图片
			agentIdPic: '',							//代理人身份证生成图片
			selfInternetPic: '',						//本人联网核查头像图片
			agentInternetPic: '',					//代理人联网核查头像图片
			sendPicSuccessFlag: '',					//图片是否全部上传成功的标志
			judgeFlag: "",							//公安联查标志
			//其他标志位相关
			faceGrade: '',							//人脸识别分数
			tradeSendFinish: '',						//最终交易发送标志
		}
	});

	//重获激活码session缓存
	var AcodeTradeInfo = Backbone.Model.extend({
		defaults: {
			//全局相关
			serNo: "",								//该交易流水号
			timecountflag: "",						//锁屏标志,true为继续开启锁屏计时
			hasAlert: "",							//在倒计时时是否存在其他弹框
			checkPasswordSuccess: '',				//验密成功修改为true,在转账操作前再次判断该标志
			isDebug: '',								//是否是电脑调试状态，如果是电脑则设置为true
			//客户信息相关
			isAgent: "",								//是否代理人办理
			customerSelfName: "",					//本人姓名
			customerAgentName: "",					//代理人姓名
			customerSelfId: "",						//本人身份证号
			customerAgentId: "",						//代理人身份证号
			session_customerId: '',					//渠道客户号
			session_customerNameCN: '',				//渠道客户名
			idType: '',								//付款人证件类型
			blacklistFlag: '',						//黑名单标志,true为灰黑名单
			//卡相关
			payAccount: '',							//付款人卡号
			recAccount: '',							//收款人卡号
			keyInfo: '',							    //加密后的密码信息,具体加密密码为keyInfo.value
			checkKeySuccessEvent: '',				//验密后的成功回调函数
			openNode: '',							//付款人开户机构号
			cardType: '',							//付款卡是磁条还是IC, 磁条是0,IC是1,降级交易是2
			cardInfo: '',							//外设读取卡对象信息
			//金额相关
			acctUseBal: '',							//账户可用余额
			dayTotExtctAmt: '',						//当日累计取现金额
			transferAmt: '',							//本次转账或付款金额
			extctAmt: '',							//本次累加转账金额总额
			//CA相关
			CATemplate: '',							//填充数据后的pdf模板
			CAPicture: "",							//CA完成后返回的照片
			CASignPic: "",							//CA签字图片
			CAData: "",								//CA加密包
			CAFinish: "",							//是否完成CA签名
			CASendFinish: "",						//是否完成加密包验证
			//授权相关
			fingerprint: "",							//本地指纹缓存
			FormrAhrTlrNo: '',						//授权柜员号
			successEvent: "",						//授权成功方法缓存
			refuseEvent: "",							//授权拒绝方法缓存
			failEvent: "",							//授权连接失败或异常方法缓存
			authTeller: '',							//提交用授权柜员号
			//远程
			distanceDesc: '',						//远程授权原因
			distanceTimeout: "",						//远程授权计时器
			allowCancelDistance: '',					//允许取消远程授权按钮标志
			distanceSettimeOne: '',					//远程授权一分钟计时器
			distanceSettimeThree: '',				//远程授权三分钟计时器
			distanceFlag: '',						//是否继续远程授权标志,即客户是否同意继续交易
			distanceFinish: '',						//授权完成标志,记录是否已经授权成功
			distanceSuccessEvent: '',				//远程授权成功回调
			distanceRefuseEvent: "",					//远程授权被拒绝回调
			distanceFailEvent: '',					//远程授权连接失败回调
			//影像图片相关
			beginFacePic: '',						//起始人脸识别拍摄图片（非活体检测会在拍摄后直接赋值,活体检测在调用解密识别交易后赋值）
			isLiving: '',							//是否开启活体检测,在活体拍摄成功后自动赋值为true
			beginLivingFaceData: '',					//活体检测加密包数据
			selfIdPic: '',							//本人身份证生成图片
			agentIdPic: '',							//代理人身份证生成图片
			selfInternetPic: '',						//本人联网核查头像图片
			agentInternetPic: '',					//代理人联网核查头像图片
			sendPicSuccessFlag: '',					//图片是否全部上传成功的标志
			judgeFlag: "",							//公安联查标志
			//其他标志位相关
			faceGrade: '',							//人脸识别分数
			tradeSendFinish: '',						//最终交易发送标志
			cellPhone: '',							//电话号码
			checkflag: '',                           //校验码标志
			hadFengPing: '',							//是否进行过风评
			//0-激活码，1-下载吗
			Flg: ''
		}
	});

	//理财购买session缓存
	var FinaceTradeInfo = Backbone.Model.extend({
		defaults: {
			//全局相关
			serNo: "",								//该交易流水号
			timecountflag: "",						//锁屏标志,true为继续开启锁屏计时
			hasAlert: "",							//在倒计时时是否存在其他弹框
			checkPasswordSuccess: '',				//验密成功为true
			isDebug: '',								//是否是电脑调试状态，如果是电脑则设置为true
			//客户信息相关
			isAgent: "",								//是否代理人办理
			customerSelfName: "",					//本人姓名
			customerAgentName: "",					//代理人姓名
			customerSelfId: "",						//本人身份证号
			customerAgentId: "",						//代理人身份证号
			session_customerId: '',					//渠道客户号
			session_customerNameCN: '',				//渠道客户名
			idType: '',								//付款人证件类型
			blacklistFlag: '',						//黑名单标志,true为灰黑名单
			//卡相关
			payAccount: '',							//付款人卡号
			recAccount: '',							//收款人卡号
			keyInfo: '',							    //加密后的密码信息,具体加密密码为keyInfo.value
			checkKeySuccessEvent: '',				//验密后的成功回调函数
			openNode: '',							//付款人开户机构号
			cardType: '',							//付款卡是磁条还是IC, 磁条是0,IC是1,降级交易是2
			cardInfo: '',							//外设读取卡对象信息
			readIdSuccess: '',						//已经成功读取身份证标志,在读身份证成功并匹配后设置为true
			//金额相关
			acctUseBal: '',							//账户可用余额
			dayTotExtctAmt: '',						//当日累计取现金额
			transferAmt: '',							//本次转账或付款金额
			extctAmt: '',							//本次累加转账金额总额
			//CA相关
			CATemplate: '',							//填充数据后的pdf模板
			CAPicture: "",							//CA完成后返回的头像照片
			CASignPic: "",							//CA签字图片
			CAData: "",								//CA加密包
			CAFinish: "",							//是否完成CA签名
			CASendFinish: "",						//是否完成加密包验证
			//授权相关
			fingerprint: "",							//本地指纹缓存
			FormrAhrTlrNo: '',						//授权柜员号
			successEvent: "",						//授权成功方法缓存
			refuseEvent: "",							//授权拒绝方法缓存
			failEvent: "",							//授权连接失败或异常方法缓存
			authorizationSuccessFlag: '',			//授权通过标志,任何方式通过授权该标志均为true
			authTeller: '',							//提交用授权柜员号
			//远程
			distanceDesc: '',						//远程授权原因
			distanceTimeout: "",						//远程授权计时器
			allowCancelDistance: '',					//允许取消远程授权按钮标志
			distanceSettimeOne: '',					//远程授权一分钟计时器
			distanceSettimeThree: '',				//远程授权三分钟计时器
			distanceFlag: '',						//是否继续远程授权标志,即客户是否同意继续交易
			distanceFinish: '',						//授权完成标志,记录是否已经授权成功
			distanceSuccessEvent: '',				//远程授权成功回调
			distanceRefuseEvent: "",					//远程授权被拒绝回调
			distanceFailEvent: '',					//远程授权连接失败回调
			//影像图片相关
			beginFacePic: '',						//起始人脸识别拍摄图片（非活体检测会在拍摄后直接赋值,活体检测在调用解密识别交易后赋值）
			isLiving: '',							//是否开启活体检测,在活体拍摄成功后自动赋值为true
			beginLivingFaceData: '',					//活体检测加密包数据
			selfIdPic: '',							//本人身份证生成图片
			agentIdPic: '',							//代理人身份证生成图片
			selfInternetPic: '',						//本人联网核查头像图片
			agentInternetPic: '',					//代理人联网核查头像图片
			sendPicSuccessFlag: '',					//图片是否全部上传成功的标志
			judgeFlag: "",							//公安联查标志
			//其他标志位相关
			faceGrade: '',							//人脸识别分数
			tradeSendFinish: '',						//最终交易发送标志

			//理财自定义
			productId: '',							//当前理财产品ID
			finType: '',								//产品模板代码
			productName: '',							//当前产品名称
			guestRate: '',							//该产品查回预期收益率
			guestRateByValue: '',					//根据购买金额查回预期收益率
			guestRateHasSuccess: '',					//购买成功后查回预期收益率
			cashFlag: '',							//现金收付标志
			prodectRiskLevel: '',					//产品风险等级(小于等于客户等级可以购买)
			signFlag: '',							//理财签约标志,0为已签约,1为未签约
			riskDate: '',							//风险有效期截止日
			riskLevel: '',							//客户风险等级
			prods: '',								//个人可购买理财产品数组
			personUseLimit: '',						//个人可买额度
			prdTotvlo: '',							//产品份额
			ipoStartDate: '',						//募集开始时间
			ipoEndDate: '',							//募集结束时间
			estabDate: '',							//理财开始期限
			incomeDate: '',							//理财结束期限
			prdType: '',								//产品类型
			currType: '',							//币种
			pfirstAmt: '',							//起购金额
			pappAtm: '',								//递增购买金额
			cycleDays: '',							//投资天数
			iInvAnswersAll: '',						//风评答案集合		（questionNo:对应的问题编号，point:分值）
			iQuestionInfo: '',						//风评问题集合		（questionNo:问题编号，questionContent:问题内容）
			questionsObj: '',						//整理后的问题和答案对象
			questions: '',							//问题序号数组
			answers: '',								//对应答案数组
			cstRiskLevel: '',						//重新风评的客户风险等级
			newRiskDate: '',							//新产生的风评有效期
			buyOther: '',							//正在购买其他产品的标志,在此标志为true的情况下不需要拍照和刷卡
			buySuccess: '',							//理财购买成功标志
			curryStr: '',							//币种汉字
			prodTypeStr: '',							//产品类型汉字
			valueCheck: '',							//金额校验标志
			tipManagerPrintFlag: '',					//通知大堂经理授权标志，true表示已通知
			alreadyCheckedFengping: '',				//上次风评选中的风评答案对象集合
			rexValue: '',							//处理后的用来显示的金额
			readIdCardNum: '',							//通过刷身份证读取的号码
			riskDesc: '',							//风险等级描述数组
			productRiskDesc: '',						//产品风险等级描述
			beginFengping: '',						//进入风评标志
			buyOthers: '',							//购买其他产品标识
			allowFengping: '',
			allowBuy: '',							//购买允许标志
		}
	});

	//理财签约session缓存
	var FinaceSingInfo = Backbone.Model.extend({
		defaults: {
			//全局相关
			serNo: "",								//该交易流水号
			timecountflag: "",						//锁屏标志,true为继续开启锁屏计时
			hasAlert: "",							//在倒计时时是否存在其他弹框
			checkPasswordSuccess: '',				//验密成功为true
			isDebug: '',								//是否是电脑调试状态，如果是电脑则设置为true
			//客户信息相关
			isAgent: "",								//是否代理人办理
			customerSelfName: "",					//本人姓名
			customerAgentName: "",					//代理人姓名
			customerSelfId: "",						//本人身份证号
			customerAgentId: "",						//代理人身份证号
			session_customerId: '',					//渠道客户号
			session_customerNameCN: '',				//渠道客户名
			idType: '',								//付款人证件类型
			blacklistFlag: '',						//黑名单标志,true为灰黑名单
			//卡相关
			payAccount: '',							//付款人卡号
			recAccount: '',							//收款人卡号
			keyInfo: '',							    //加密后的密码信息,具体加密密码为keyInfo.value
			checkKeySuccessEvent: '',				//验密后的成功回调函数
			openNode: '',							//付款人开户机构号
			cardType: '',							//付款卡是磁条还是IC, 磁条是0,IC是1,降级交易是2
			cardInfo: '',							//外设读取卡对象信息
			idCardInfo: '',							//外设读取身份证对象信息
			readIdSuccess: '',						//已经成功读取身份证标志,在读身份证成功并匹配后设置为true
			//金额相关
			acctUseBal: '',							//账户可用余额
			dayTotExtctAmt: '',						//当日累计取现金额
			transferAmt: '',							//本次转账或付款金额
			extctAmt: '',							//本次累加转账金额总额
			//CA相关
			CATemplate: '',							//填充数据后的pdf模板
			CAPicture: "",							//CA完成后返回的头像照片
			CASignPic: "",							//CA签字图片
			CAData: "",								//CA加密包
			CAFinish: "",							//是否完成CA签名
			CASendFinish: "",						//是否完成加密包验证
			//授权相关
			fingerprint: "",							//本地指纹缓存
			FormrAhrTlrNo: '',						//授权柜员号
			successEvent: "",						//授权成功方法缓存
			refuseEvent: "",							//授权拒绝方法缓存
			failEvent: "",							//授权连接失败或异常方法缓存
			fingerFlag: '',							//授权成功标志,成功为true,失败为false
			authTeller: '',							//提交用授权柜员号
			//远程
			distanceDesc: '',						//远程授权原因
			distanceTimeout: "",						//远程授权计时器
			allowCancelDistance: '',					//允许取消远程授权按钮标志
			distanceSettimeOne: '',					//远程授权一分钟计时器
			distanceSettimeThree: '',				//远程授权三分钟计时器
			distanceFlag: '',						//是否继续远程授权标志,即客户是否同意继续交易
			distanceFinish: '',						//授权完成标志,记录是否已经授权成功
			distanceSuccessEvent: '',				//远程授权成功回调
			distanceRefuseEvent: "",					//远程授权被拒绝回调
			distanceFailEvent: '',					//远程授权连接失败回调
			//影像图片相关
			beginFacePic: '',						//起始人脸识别拍摄图片（非活体检测会在拍摄后直接赋值,活体检测在调用解密识别交易后赋值）
			isLiving: '',							//是否开启活体检测,在活体拍摄成功后自动赋值为true
			beginLivingFaceData: '',					//活体检测加密包数据
			selfIdPic: '',							//本人身份证生成图片
			agentIdPic: '',							//代理人身份证生成图片
			selfInternetPic: '',						//本人联网核查头像图片
			agentInternetPic: '',					//代理人联网核查头像图片
			sendPicSuccessFlag: '',					//图片是否全部上传成功的标志
			judgeFlag: "",							//公安联查标志
			//其他标志位相关
			faceGrade: '',							//人脸识别分数
			tradeSendFinish: '',						//最终交易发送标志

			//理财签约自定义
			oneStepFinish: '',						//第一步完成标志
			address: '',								//地址
			mobileNum: '',							//手机号
			sex: '',									//性别
			reserve: '',								//是否需要发送短息（0不要，1要）
			birthday: '',							//生日（YYYYMMDD)
			riskLevel: '',							//提交后的风评等级
			agoSignFlag: '',							//交易前的理财签约标志,0为已签约,1为未签约
			signFlag: '',							//交易结束是的签约标志
			riskDate: '',							//风评过期日期
			youbian: '',								//邮编
			telNum: '',								//电话号码
			//可用步骤按钮
			allowPrevious: '',						//上一步可用
			allowNext: "",							//下一步可用
			//完成使用session
			finish_riskLevel: '',					//风险等级
			finish_address: '',						//地址
			finish_mobileNo: '',						//手机号码
			finish_sex: '',							//性别
			finish_pcertNo: '',						//身份证号码
			finish_pcertType: '',					//证件类型
			finish_SendFreq: '',						//对账单发送频率
			finish_reserve: '',						//保留域
			finish_clientName: '',					//客户姓名
			finish_bankAcc: '',						//银行账号
			finish_openNode: '',						//开户网点
			//已签约信息回显
			already_riskLevel: '',					//风险等级
			already_riskDate: '',					//风评有效期
			already_address: '',						//地址
			already_mobileNo: '',						//手机号码
			already_sex: '',							//性别
			already_pcertNo: '',						//身份证号码
			already_pcertType: '',					//证件类型
			already_SendFreq: '',						//对账单发送频率
			already_reserve: '',						//保留域
			already_clientName: '',					//客户姓名
			already_bankAcc: '',						//银行账号
			already_openNode: '',						//开户网点
			already_zipCode: '',						//邮政编码
			already_tel: '',						//电话
			already_birthday: '',						//生日

			signFinish: '',							//签约交易完成标志
			signSuccess: '',							//是否签约成功
			signErrMessage: '',						//签约失败信息
			stepTwoAccess: '',						//已经进入第二步的标志
			alreadyCheckedFengping: '',				//上次风评选中的风评答案对象集合
			allowFengping: '',						//打开风评的标志
			riskDesc: '',							//风评等级描述
			hasChange: '',							//风评是否存在改动
			hasOpenFengPing: '',						//是否自动打开过风评
			canAccessFengPing: '',					//将进入风评
			commitSuccess: '',						//交易完成标志
		}
	});

	var NobleMetalTradeInfo = Backbone.Model.extend({
		defaults: {
			//全局相关
			serNo: "",								//该交易流水号
			timecountflag: "",						//锁屏标志,true为继续开启锁屏计时
			hasAlert: "",							//在倒计时时是否存在其他弹框
			checkPasswordSuccess: '',				//验密成功为true
			isDebug: '',								//是否是电脑调试状态，如果是电脑则设置为true
			//客户信息相关
			isAgent: "",								//是否代理人办理
			customerSelfName: "",					//本人姓名
			customerAgentName: "",					//代理人姓名
			customerSelfId: "",						//本人身份证号
			customerAgentId: "",						//代理人身份证号
			session_customerId: '',					//渠道客户号
			session_customerNameCN: '',				//渠道客户名
			idType: '',								//付款人证件类型
			blacklistFlag: '',						//黑名单标志,true为灰黑名单
			OpnAcctInstId: '',                       //开户网点
			agentRelationType: '',                   //代理人与本人关系
			//卡相关
			payAccount: '',							//付款人卡号
			recAccount: '',							//收款人卡号
			keyInfo: '',							    //加密后的密码信息,具体加密密码为keyInfo.value
			checkKeySuccessEvent: '',				//验密后的成功回调函数
			openNode: '',							//付款人开户机构号
			cardType: '',							//付款卡是磁条还是IC, 磁条是0,IC是1,降级交易是2
			cardInfo: '',							//外设读取卡对象信息
			//金额相关
			acctUseBal: '',							//账户可用余额
			dayTotExtctAmt: '',						//当日累计取现金额
			transferAmt: '',							//本次转账或付款金额
			extctAmt: '',							//本次累加转账金额总额
			//CA相关
			CATemplate: '',							//填充数据后的pdf模板
			CAPicture: "",							//CA完成后返回的照片
			CASignPic: "",							//CA签字图片
			CAData: "",								//CA加密包
			CAFinish: "",							//是否完成CA签名
			CASendFinish: "",						//是否完成加密包验证
			//授权相关
			fingerprint: "",							//本地指纹缓存
			FormrAhrTlrNo: '',						//授权柜员号
			successEvent: "",						//授权成功方法缓存
			refuseEvent: "",							//授权拒绝方法缓存
			failEvent: "",							//授权连接失败或异常方法缓存
			authTeller: '',							//提交用授权柜员号
			//远程
			distanceDesc: '',						//远程授权原因
			distanceTimeout: "",						//远程授权计时器
			allowCancelDistance: '',					//允许取消远程授权按钮标志
			distanceSettimeOne: '',					//远程授权一分钟计时器
			distanceSettimeThree: '',				//远程授权三分钟计时器
			distanceFlag: '',						//是否继续远程授权标志,即客户是否同意继续交易
			distanceFinish: '',						//授权完成标志,记录是否已经授权成功
			distanceSuccessEvent: '',				//远程授权成功回调
			distanceRefuseEvent: "",					//远程授权被拒绝回调
			distanceFailEvent: '',					//远程授权连接失败回调
			//影像图片相关
			beginFacePic: '',						//起始人脸识别拍摄图片（非活体检测会在拍摄后直接赋值,活体检测在调用解密识别交易后赋值）
			isLiving: '',							//是否开启活体检测,在活体拍摄成功后自动赋值为true
			beginLivingFaceData: '',					//活体检测加密包数据
			selfIdPic: '',							//本人身份证生成图片
			agentIdPic: '',							//代理人身份证生成图片
			selfInternetPic: '',						//本人联网核查头像图片
			agentInternetPic: '',					//代理人联网核查头像图片
			sendPicSuccessFlag: '',					//图片是否全部上传成功的标志
			judgeFlag: "",							//公安联查标志
			//其他标志位相关
			faceGrade: '',							//人脸识别分数
			tradeSendFinish: '',						//最终交易发送标志

			//业务信息相关
			nobleMetalList: "",                      //要购买的贵金属数组
			userName: '',                             //收货人姓名
			phoneNo: '',                            //收货人电话
			provinceName: '',                        //省份
			cityName: '',                             //市
			address: '',                               //地址
			needBill: '',                              //需要发票
			billType: '',                            //发票类型
			glInvoiceCompany: '',                    //公司名称
			goldRemark: '',                          //备注
			referrrerno: '',                           //推荐人工号
			s_province: '',
			s_city: '',
			commitAddress: "",							//是否允许提交，1是允许提交
			agoAddressList: '',							//历史地址数组




		}
	});

	var ToSignTradeInfo = Backbone.Model.extend({
		defaults: {
			//全局相关
			serNo: "",								//该交易流水号
			timecountflag: "",						//锁屏标志,true为继续开启锁屏计时
			hasAlert: "",							//在倒计时时是否存在其他弹框
			//客户信息相关
			isAgent: "",								//是否代理人办理
			customerSelfName: "",					//本人姓名
			customerAgentName: "",					//代理人姓名
			customerSelfId: "",						//本人身份证号
			customerAgentId: "",						//代理人身份证号
			session_customerId: '',					//渠道客户号
			//CA相关
			CATemplate: '',							//填充数据后的pdf模板
			CAPicture: "",							//CA完成后返回的照片
			CASignPic: "",							//CA签字图片
			CAData: "",								//CA加密包
			CAFinish: "",							//是否完成CA签名
			CASendFinish: "",						//是否完成加密包验证
			//授权相关
			fingerprint: "",							//本地指纹缓存
			FormrAhrTlrNo: '',						//授权柜员号
			successEvent: "",						//授权成功方法缓存
			refuseEvent: "",							//授权拒绝方法缓存
			failEvent: "",							//授权连接失败或异常方法缓存
			authTeller: '',							//提交用授权柜员号
			//影像图片相关
			beginFacePic: '',						//起始人脸识别拍摄图片（非活体检测会在拍摄后直接赋值,活体检测在调用解密识别交易后赋值）
			isLiving: '',							//是否开启活体检测,在活体拍摄成功后自动赋值为true
			beginLivingFaceData: '',					//活体检测加密包数据
			selfIdPic: '',							//本人身份证生成图片
			agentIdPic: '',							//代理人身份证生成图片
			selfInternetPic: '',						//本人联网核查头像图片
			agentInternetPic: '',					//代理人联网核查头像图片
			sendPicSuccessFlag: '',					//图片是否全部上传成功的标志
			judgeFlag: "",							//公安联查标志
			//其他标志位相关
			faceGrade: '',							//人脸识别分数
			tradeSendFinish: '',						//最终交易发送标志
			checkKeySuccessEvent: '',				//存放验证密码后的函数
			cardInfo: '',							//外设读取银行卡的信息
			idCardInfo: '',							//外设读取的身份证信息
			keyInfo: '',							//加密后的密码信息
			keyInfoOne: '',							//第一次输入的密码
			keyInfoTwice: '',						//第二次输入的密码
			idSignInfo: '',							//身份证签约信息
			cardSignInfo: '',						//银行卡签约信息
			messageFlag: '',							//短信验证成功标志
			atmSgnLimit: '',							//自助签约限额
			ibSgnLimit: '',							//网银签约限额
			telSgnLimit: '',							//电话签约限额
			authorizationFlag: '',					//授权通过标志
			countdown: '',							//重新发送短信时间控制
			NewIbCnlSgnSt: '',						//新签约状态赋值
			NewTelCnlSgnSt: '',						//新签约状态赋值
			NewRpdPySgnSt: '',						//新签约状态赋值
			NewIbCnlSgnStName: '',						//新签约内容赋值
			NewTelCnlSgnStName: '',						//新签约内容赋值
			NewRpdPySgnStName: '',						//新签约内容赋值
			NewIbCnlSgnStLimit: '',						//新签约限额赋值
			NewTelCnlSgnStLimit: '',						//新签约限额赋值
			allowPrevious: '',
			allowNext: '',
			isPlus: '',									//是否可加挂

			//远程
			distanceDesc: '',						//远程授权原因
			distanceTimeout: "",						//远程授权计时器
			allowCancelDistance: '',					//允许取消远程授权按钮标志
			distanceSettimeOne: '',					//远程授权一分钟计时器
			distanceSettimeThree: '',				//远程授权三分钟计时器
			distanceFlag: '',						//是否继续远程授权标志,即客户是否同意继续交易
			distanceFinish: '',						//授权完成标志,记录是否已经授权成功
			distanceSuccessEvent: '',				//远程授权成功回调
			distanceRefuseEvent: "",					//远程授权被拒绝回调
			distanceFailEvent: '',					//远程授权连接失败回调
			isLink: '',								//是否连续动作
			isAgreement: '',							//是否同意协议

			brithdayForm: '',						//无格式生日
			birthday: '',							//生日（YYYYMMDD)
			allowFinish: "",							//完成按钮允许点击标志
			refuseHideLock: "",						//锁屏禁止解除标志
		}
	});

	var NewToSignTradeInfo = Backbone.Model.extend({
		defaults: {
			//全局相关
			serNo: "",								//该交易流水号
			timecountflag: "",						//锁屏标志,true为继续开启锁屏计时
			hasAlert: "",							//在倒计时时是否存在其他弹框
			//客户信息相关
			isAgent: "",								//是否代理人办理
			customerSelfName: "",					//本人姓名
			customerAgentName: "",					//代理人姓名
			customerSelfId: "",						//本人身份证号
			customerAgentId: "",						//代理人身份证号
			session_customerId: '',					//渠道客户号
			custPhoneNo: "",							//手机号
			CstNoN: "",								//客户号P846查回
			//CA相关
			CATemplate: '',							//填充数据后的pdf模板
			CAPicture: "",							//CA完成后返回的照片
			CASignPic: "",							//CA签字图片
			CAData: "",								//CA加密包
			CAFinish: "",							//是否完成CA签名
			CASendFinish: "",						//是否完成加密包验证
			//授权相关
			fingerprint: "",							//本地指纹缓存
			FormrAhrTlrNo: '',						//授权柜员号
			successEvent: "",						//授权成功方法缓存
			refuseEvent: "",							//授权拒绝方法缓存
			failEvent: "",							//授权连接失败或异常方法缓存
			authTeller: '',							//提交用授权柜员号
			//影像图片相关
			beginFacePic: '',						//起始人脸识别拍摄图片（非活体检测会在拍摄后直接赋值,活体检测在调用解密识别交易后赋值）
			isLiving: '',							//是否开启活体检测,在活体拍摄成功后自动赋值为true
			beginLivingFaceData: '',					//活体检测加密包数据
			selfIdPic: '',							//本人身份证生成图片
			agentIdPic: '',							//代理人身份证生成图片
			selfInternetPic: '',						//本人联网核查头像图片
			agentInternetPic: '',					//代理人联网核查头像图片
			sendPicSuccessFlag: '',					//图片是否全部上传成功的标志
			judgeFlag: "",							//公安联查标志
			//其他标志位相关
			faceGrade: '',							//人脸识别分数
			tradeSendFinish: '',						//最终交易发送标志
			checkKeySuccessEvent: '',				//存放验证密码后的函数
			cardInfo: '',							//外设读取银行卡的信息
			idCardInfo: '',							//外设读取的身份证信息
			keyInfo: '',							//加密后的密码信息
			keyInfoOne: '',							//第一次输入的密码
			keyInfoTwice: '',						//第二次输入的密码
			idSignInfo: '',							//身份证签约信息
			cardSignInfo: '',						//银行卡签约信息
			messageFlag: '',							//短信验证成功标志
			atmSgnLimit: '',							//自助签约限额
			ibSgnLimit: '',							//网银签约限额
			telSgnLimit: '',							//电话签约限额
			authorizationFlag: '',					//授权通过标志
			countdown: '',							//重新发送短信时间控制
			NewIbCnlSgnSt: '',						//新签约状态赋值
			NewTelCnlSgnSt: '',						//新签约状态赋值
			NewRpdPySgnSt: '',						//新签约状态赋值
			NewIbCnlSgnStName: '',						//新签约内容赋值
			NewTelCnlSgnStName: '',						//新签约内容赋值
			NewRpdPySgnStName: '',						//新签约内容赋值
			NewIbCnlSgnStLimit: '',						//新签约限额赋值
			NewTelCnlSgnStLimit: '',						//新签约限额赋值
			allowPrevious: '',
			allowNext: '',
			isPlus: '',									//是否可加挂

			//远程
			distanceDesc: '',						//远程授权原因
			distanceTimeout: "",						//远程授权计时器
			allowCancelDistance: '',					//允许取消远程授权按钮标志
			distanceSettimeOne: '',					//远程授权一分钟计时器
			distanceSettimeThree: '',				//远程授权三分钟计时器
			distanceFlag: '',						//是否继续远程授权标志,即客户是否同意继续交易
			distanceFinish: '',						//授权完成标志,记录是否已经授权成功
			distanceSuccessEvent: '',				//远程授权成功回调
			distanceRefuseEvent: "",					//远程授权被拒绝回调
			distanceFailEvent: '',					//远程授权连接失败回调
			isLink: '',								//是否连续动作
			isAgreement: '',							//是否同意协议

			brithdayForm: '',						//无格式生日
			birthday: '',							//生日（YYYYMMDD)
			allowFinish: "",							//完成按钮允许点击标志
			refuseHideLock: "",						//锁屏禁止解除标志
			//-----------add by CKR---------------------------------------------
			chkNoBackInfor: {},						//验证码接口返回信息存储
			//签约信息相关
			isSignQuickPay: false,					//是否已签约快捷支付
			checkSignQuickPay: false,				//选中快捷支付
			isSignSelfBank: false,					//是否已签约自助银行
			checkSignSelfBank: false,				//选中自助银行
			isSignPhoneBank: false,					//是否已签约电话银行
			checkSignPhoneBank: false,				//选中电话银行
			isSignNetBank: false,					//是否已签约网银
			checkSignNetBank: false,					//选中网银

			//密码
			qryPwd: "",								//校验密码POP中的查询密码
			//CAPDF相关
			signQuickPayPdf: "",
			signSelfBankPdf: "",
			signPhoneBankPdf: "",
			signNetBankPdf: "",
			dayCountPdf: "",
			dayTotalLimitPdf: "",
			yearLimitPdf: "",
			dayLimitPdf1: "",
			dayLimitPdf2: "",
			safeStylePdf: "",
		}
	});

	//一卡通签约session缓存
	var SignOneCardInfo = Backbone.Model.extend({
		defaults: {
			//session内的元素在需要自定义输入值的时候我会在对应方法的注释中声明,自己随便赋值导致奇怪的结果不要来问我
			//全局相关
			serNo: "",								//该交易流水号
			timecountflag: "",						//锁屏标志,true为继续开启锁屏计时
			hasAlert: "",							//在倒计时时是否存在其他弹框
			checkPasswordSuccess: '',				//验密成功修改为true,在转账操作前再次判断该标志
			isDebug: '',								//是否是电脑调试状态，如果是电脑则设置为true
			//客户信息相关
			isAgent: "",								//是否代理人办理
			customerSelfName: "",					//本人姓名
			customerAgentName: "",					//代理人姓名
			customerSelfId: "",						//本人身份证号
			customerAgentId: "",						//代理人身份证号
			session_customerId: '',					//渠道客户号
			session_customerNameCN: '',				//渠道客户名
			idType: '',								//付款人证件类型
			blacklistFlag: '',						//黑名单标志,true为灰黑名单
			//卡相关
			payAccount: '',							//付款人卡号
			recAccount: '',							//收款人卡号
			keyInfo: '',							    //加密后的密码信息,具体加密密码为keyInfo.value
			checkKeySuccessEvent: '',				//验密后的成功回调函数
			openNode: '',							//付款人开户机构号
			cardType: '',							//付款卡是磁条还是IC, 磁条是0,IC是1,降级交易是2
			cardInfo: '',							//外设读取卡对象信息
			idCardInfo: '',							//外设读取身份证对象信息
			//金额相关
			acctUseBal: '',							//账户可用余额
			dayTotExtctAmt: '',						//当日累计取现金额
			transferAmt: '',							//本次转账或付款金额
			extctAmt: '',							//本次累加转账金额总额
			//CA相关
			CATemplate: '',							//填充数据后的pdf模板
			CAPicture: "",							//CA完成后返回的照片
			CASignPic: "",							//CA签字图片
			CAData: "",								//CA加密包
			CAFinish: "",							//是否完成CA签名
			CASendFinish: "",						//是否完成加密包验证
			//授权相关
			fingerprint: "",							//本地指纹缓存
			FormrAhrTlrNo: '',						//授权柜员号
			successEvent: "",						//授权成功方法缓存
			refuseEvent: "",							//授权拒绝方法缓存
			failEvent: "",							//授权连接失败或异常方法缓存
			authorizationSuccessFlag: '',			//授权通过标志,任何方式通过授权该标志均为true
			authTeller: '',							//提交用授权柜员号
			//远程
			distanceDesc: '',						//远程授权原因
			distanceTimeout: "",						//远程授权计时器
			allowCancelDistance: '',					//允许取消远程授权按钮标志
			distanceSettimeOne: '',					//远程授权一分钟计时器
			distanceSettimeThree: '',				//远程授权三分钟计时器
			distanceFlag: '',						//是否继续远程授权标志,即客户是否同意继续交易
			distanceFinish: '',						//授权完成标志,记录是否已经授权成功
			distanceSuccessEvent: '',				//远程授权成功回调
			distanceRefuseEvent: "",					//远程授权被拒绝回调
			distanceFailEvent: '',					//远程授权连接失败回调
			//影像图片相关
			beginFacePic: '',						//起始人脸识别拍摄图片（非活体检测会在拍摄后直接赋值,活体检测在调用解密识别交易后赋值）
			isLiving: '',							//是否开启活体检测,在活体拍摄成功后自动赋值为true
			beginLivingFaceData: '',					//活体检测加密包数据
			selfIdPic: '',							//本人身份证生成图片
			agentIdPic: '',							//代理人身份证生成图片
			selfInternetPic: '',						//本人联网核查头像图片
			agentInternetPic: '',					//代理人联网核查头像图片
			sendPicSuccessFlag: '',					//图片是否全部上传成功的标志
			judgeFlag: "",							//公安联查标志
			//其他标志位相关
			faceGrade: '',							//人脸识别分数
			tradeSendFinish: '',						//最终交易发送标志
			companyInfo: '',						//缴费公司信息
			userno: '',								//用户号
			company: [],						//公司
			tableInfo: '',						//表格信息
			bsnum: '',							//待提交业务序号
			bsNameList: '',					//业务名称总和
			bsRetSer: [],						//业务返回状态结果
			sumAll: '',							//返回结果序号
			idnum: '',							//读证件号
			idname: '',							//读证姓名
		}
	});
	//一卡通解约session缓存
	var UnSignOneCardInfo = Backbone.Model.extend({
		defaults: {
			//session内的元素在需要自定义输入值的时候我会在对应方法的注释中声明,自己随便赋值导致奇怪的结果不要来问我
			//全局相关
			serNo: "",								//该交易流水号
			timecountflag: "",						//锁屏标志,true为继续开启锁屏计时
			hasAlert: "",							//在倒计时时是否存在其他弹框
			checkPasswordSuccess: '',				//验密成功修改为true,在转账操作前再次判断该标志
			isDebug: '',								//是否是电脑调试状态，如果是电脑则设置为true
			//客户信息相关
			isAgent: "",								//是否代理人办理
			customerSelfName: "",					//本人姓名
			customerAgentName: "",					//代理人姓名
			customerSelfId: "",						//本人身份证号
			customerAgentId: "",						//代理人身份证号
			session_customerId: '',					//渠道客户号
			session_customerNameCN: '',				//渠道客户名
			idType: '',								//付款人证件类型
			blacklistFlag: '',						//黑名单标志,true为灰黑名单
			//卡相关
			payAccount: '',							//付款人卡号
			recAccount: '',							//收款人卡号
			keyInfo: '',							    //加密后的密码信息,具体加密密码为keyInfo.value
			checkKeySuccessEvent: '',				//验密后的成功回调函数
			openNode: '',							//付款人开户机构号
			cardType: '',							//付款卡是磁条还是IC, 磁条是0,IC是1,降级交易是2
			cardInfo: '',							//外设读取卡对象信息
			idCardInfo: '',							//外设读取身份证对象信息
			//金额相关
			acctUseBal: '',							//账户可用余额
			dayTotExtctAmt: '',						//当日累计取现金额
			transferAmt: '',							//本次转账或付款金额
			extctAmt: '',							//本次累加转账金额总额
			//CA相关
			CATemplate: '',							//填充数据后的pdf模板
			CAPicture: "",							//CA完成后返回的照片
			CASignPic: "",							//CA签字图片
			CAData: "",								//CA加密包
			CAFinish: "",							//是否完成CA签名
			CASendFinish: "",						//是否完成加密包验证
			//授权相关
			fingerprint: "",							//本地指纹缓存
			FormrAhrTlrNo: '',						//授权柜员号
			successEvent: "",						//授权成功方法缓存
			refuseEvent: "",							//授权拒绝方法缓存
			failEvent: "",							//授权连接失败或异常方法缓存
			authorizationSuccessFlag: '',			//授权通过标志,任何方式通过授权该标志均为true
			authTeller: '',							//提交用授权柜员号
			//远程
			distanceDesc: '',						//远程授权原因
			distanceTimeout: "",						//远程授权计时器
			allowCancelDistance: '',					//允许取消远程授权按钮标志
			distanceSettimeOne: '',					//远程授权一分钟计时器
			distanceSettimeThree: '',				//远程授权三分钟计时器
			distanceFlag: '',						//是否继续远程授权标志,即客户是否同意继续交易
			distanceFinish: '',						//授权完成标志,记录是否已经授权成功
			distanceSuccessEvent: '',				//远程授权成功回调
			distanceRefuseEvent: "",					//远程授权被拒绝回调
			distanceFailEvent: '',					//远程授权连接失败回调
			//影像图片相关
			beginFacePic: '',						//起始人脸识别拍摄图片（非活体检测会在拍摄后直接赋值,活体检测在调用解密识别交易后赋值）
			isLiving: '',							//是否开启活体检测,在活体拍摄成功后自动赋值为true
			beginLivingFaceData: '',					//活体检测加密包数据
			selfIdPic: '',							//本人身份证生成图片
			agentIdPic: '',							//代理人身份证生成图片
			selfInternetPic: '',						//本人联网核查头像图片
			agentInternetPic: '',					//代理人联网核查头像图片
			sendPicSuccessFlag: '',					//图片是否全部上传成功的标志
			judgeFlag: "",							//公安联查标志
			//其他标志位相关
			faceGrade: '',							//人脸识别分数
			tradeSendFinish: '',						//最终交易发送标志
			companyInfo: '',						//缴费公司信息
			userno: '',								//用户号
			company: [],						//公司
			signInfo: '',						//签约信息
			bsnum: '',							//待提交业务序号
			bsNameList: '',					//业务名称总和
			bsRetSer: [],						//业务返回状态结果
			sumAll: '',							//返回结果序号
			idnum: '',							//读证件号
			idname: '',							//读证姓名
		}
	});

	//基金购买session缓存
	var FundTradeInfo = Backbone.Model.extend({
		defaults: {
			//session内的元素在需要自定义输入值的时候我会在对应方法的注释中声明,自己随便赋值导致奇怪的结果不要来问我
			//全局相关
			serNo: "",								//该交易流水号
			timecountflag: "",						//锁屏标志,true为继续开启锁屏计时
			hasAlert: "",							//在倒计时时是否存在其他弹框
			checkPasswordSuccess: '',				//验密成功修改为true,在转账操作前再次判断该标志
			isDebug: '',								//是否是电脑调试状态，如果是电脑则设置为true
			//客户信息相关
			isAgent: "",								//是否代理人办理
			customerSelfName: "",					//本人姓名
			customerAgentName: "",					//代理人姓名
			customerSelfId: "",						//本人身份证号
			customerAgentId: "",						//代理人身份证号
			session_customerId: '',					//渠道客户号
			session_customerNameCN: '',				//渠道客户名
			idType: '',								//付款人证件类型
			blacklistFlag: '',						//黑名单标志,true为灰黑名单
			//卡相关
			payAccount: '',							//付款人卡号
			recAccount: '',							//收款人卡号
			keyInfo: '',							    //加密后的密码信息,具体加密密码为keyInfo.value
			checkKeySuccessEvent: '',				//验密后的成功回调函数
			openNode: '',							//付款人开户机构号
			cardType: '',							//付款卡是磁条还是IC, 磁条是0,IC是1,降级交易是2
			cardInfo: '',							//外设读取卡对象信息
			idCardInfo: '',							//外设读取身份证对象信息
			//金额相关
			acctUseBal: '',							//账户可用余额
			dayTotExtctAmt: '',						//当日累计取现金额
			transferAmt: '',							//本次转账或付款金额
			extctAmt: '',							//本次累加转账金额总额
			//CA相关
			CATemplate: '',							//填充数据后的pdf模板
			CAPicture: "",							//CA完成后返回的照片
			CASignPic: "",							//CA签字图片
			CAData: "",								//CA加密包
			CAFinish: "",							//是否完成CA签名
			CASendFinish: "",						//是否完成加密包验证
			//授权相关
			fingerprint: "",							//本地指纹缓存
			FormrAhrTlrNo: '',						//授权柜员号
			successEvent: "",						//授权成功方法缓存
			refuseEvent: "",							//授权拒绝方法缓存
			failEvent: "",							//授权连接失败或异常方法缓存
			authorizationSuccessFlag: '',			//授权通过标志,任何方式通过授权该标志均为true
			authTeller: '',							//提交用授权柜员号
			//远程
			distanceDesc: '',						//远程授权原因
			distanceTimeout: "",						//远程授权计时器
			allowCancelDistance: '',					//允许取消远程授权按钮标志
			distanceSettimeOne: '',					//远程授权一分钟计时器
			distanceSettimeThree: '',				//远程授权三分钟计时器
			distanceFlag: '',						//是否继续远程授权标志,即客户是否同意继续交易
			distanceFinish: '',						//授权完成标志,记录是否已经授权成功
			distanceSuccessEvent: '',				//远程授权成功回调
			distanceRefuseEvent: "",					//远程授权被拒绝回调
			distanceFailEvent: '',					//远程授权连接失败回调
			//影像图片相关
			beginFacePic: '',						//起始人脸识别拍摄图片（非活体检测会在拍摄后直接赋值,活体检测在调用解密识别交易后赋值）
			isLiving: '',							//是否开启活体检测,在活体拍摄成功后自动赋值为true
			beginLivingFaceData: '',					//活体检测加密包数据
			selfIdPic: '',							//本人身份证生成图片
			agentIdPic: '',							//代理人身份证生成图片
			selfInternetPic: '',						//本人联网核查头像图片
			agentInternetPic: '',					//代理人联网核查头像图片
			sendPicSuccessFlag: '',					//图片是否全部上传成功的标志
			judgeFlag: "",							//公安联查标志
			//其他标志位相关
			faceGrade: '',							//人脸识别分数
			tradeSendFinish: '',						//最终交易发送标志
			//基金产品相关信息
			buyType: '',								//当前购买方式（0购买,1定投）
			fundName: '',							//基金产品名称
			fundCode: '',							//基金代码
			fundCorp: '',							//公司名称
			unitNetValue: "",						//最新净值
			fundTypeName: '',						//基金类型名称
			minDing: '',								//最低定投金额
			minBuy: '',								//最低购买金额
			riskLevel: '',							//客户风评等级(小于产品等级需要提示)
			riskDate: '',							//风评有效期
			fundRiskLevel: '',						//产品风评等级
			dingQixian: '',							//定投选择期限
			redType: "",								//默认分红方式
			allowRedType: '',						//允许的分红方式
			customerRedType: '',						//客户选择的分红方式
			touDay: '',								//定投投资日
			touQi: '',								//定投投资期数
			TACode: '',								//基金公司代码
			limitValue: '',							//限购金额
			dangerousFlag: '',						//高风险基金标志
			touDayLimit: '',							//扣款日限制
			fundState: '',							//基金购买允许状态
			dingZhouqi: '',							//定投周期
			buyRote: '',								//最终购买途径，其中1为申购，2为认购，3为定投
			brithdayForm: '',						//无格式生日

			tradeFinishFlag: '',						//交易完成标志
			buySuccess: '',							//基金购买成功标志
		}
	});


	//基金签约session缓存
	var FundSignInfo = Backbone.Model.extend({
		defaults: {
			//session内的元素在需要自定义输入值的时候我会在对应方法的注释中声明,自己随便赋值导致奇怪的结果不要来问我
			//全局相关
			serNo: "",								//该交易流水号
			timecountflag: "",						//锁屏标志,true为继续开启锁屏计时
			hasAlert: "",							//在倒计时时是否存在其他弹框
			checkPasswordSuccess: '',				//验密成功修改为true,在转账操作前再次判断该标志
			isDebug: '',								//是否是电脑调试状态，如果是电脑则设置为true
			//客户信息相关
			isAgent: "",								//是否代理人办理
			customerSelfName: "",					//本人姓名
			customerAgentName: "",					//代理人姓名
			customerSelfId: "",						//本人身份证号
			customerAgentId: "",						//代理人身份证号
			session_customerId: '',					//渠道客户号
			session_customerNameCN: '',				//渠道客户名
			idType: '',								//付款人证件类型
			blacklistFlag: '',						//黑名单标志,true为灰黑名单
			//卡相关
			payAccount: '',							//付款人卡号
			recAccount: '',							//收款人卡号
			keyInfo: '',							    //加密后的密码信息,具体加密密码为keyInfo.value
			checkKeySuccessEvent: '',				//验密后的成功回调函数
			openNode: '',							//付款人开户机构号
			cardType: '',							//付款卡是磁条还是IC, 磁条是0,IC是1,降级交易是2
			cardInfo: '',							//外设读取卡对象信息
			idCardInfo: '',							//外设读取身份证对象信息
			//金额相关
			acctUseBal: '',							//账户可用余额
			dayTotExtctAmt: '',						//当日累计取现金额
			transferAmt: '',							//本次转账或付款金额
			extctAmt: '',							//本次累加转账金额总额
			//CA相关
			CATemplate: '',							//填充数据后的pdf模板
			CAPicture: "",							//CA完成后返回的照片
			CASignPic: "",							//CA签字图片
			CAData: "",								//CA加密包
			CAFinish: "",							//是否完成CA签名
			CASendFinish: "",						//是否完成加密包验证
			//授权相关
			fingerprint: "",							//本地指纹缓存
			FormrAhrTlrNo: '',						//授权柜员号
			successEvent: "",						//授权成功方法缓存
			refuseEvent: "",							//授权拒绝方法缓存
			failEvent: "",							//授权连接失败或异常方法缓存
			authorizationSuccessFlag: '',			//授权通过标志,任何方式通过授权该标志均为true
			authTeller: '',							//提交用授权柜员号
			//远程
			distanceDesc: '',						//远程授权原因
			distanceTimeout: "",						//远程授权计时器
			allowCancelDistance: '',					//允许取消远程授权按钮标志
			distanceSettimeOne: '',					//远程授权一分钟计时器
			distanceSettimeThree: '',				//远程授权三分钟计时器
			distanceFlag: '',						//是否继续远程授权标志,即客户是否同意继续交易
			distanceFinish: '',						//授权完成标志,记录是否已经授权成功
			distanceSuccessEvent: '',				//远程授权成功回调
			distanceRefuseEvent: "",					//远程授权被拒绝回调
			distanceFailEvent: '',					//远程授权连接失败回调
			//影像图片相关
			beginFacePic: '',						//起始人脸识别拍摄图片（非活体检测会在拍摄后直接赋值,活体检测在调用解密识别交易后赋值）
			isLiving: '',							//是否开启活体检测,在活体拍摄成功后自动赋值为true
			beginLivingFaceData: '',					//活体检测加密包数据
			selfIdPic: '',							//本人身份证生成图片
			agentIdPic: '',							//代理人身份证生成图片
			selfInternetPic: '',						//本人联网核查头像图片
			agentInternetPic: '',					//代理人联网核查头像图片
			sendPicSuccessFlag: '',					//图片是否全部上传成功的标志
			judgeFlag: "",							//公安联查标志
			//其他标志位相关
			faceGrade: '',							//人脸识别分数
			tradeSendFinish: '',						//最终交易发送标志
			//基金产品相关信息
			oneStepFinish: '',						//第一步完成标志
			address: '',								//地址
			mobileNum: '',							//手机号
			sex: '',									//性别
			reserve: '',								//是否需要发送短息（0不要，1要）
			birthday: '',							//生日（YYYYMMDD)
			riskLevel: '',							//提交后的风评等级
			agoSignFlag: '',							//交易前的理财签约标志,0为已签约,1为未签约
			signFlag: '',							//交易结束是的签约标志
			riskDate: '',							//风评过期日期
			youbian: '',								//邮编
			telNum: '',								//电话号码
			//可用步骤按钮
			allowPrevious: '',						//上一步可用
			allowNext: "",							//下一步可用
			//完成使用session
			finish_address: '',						//地址
			finish_mobileNo: '',						//手机号码
			finish_sex: '',							//性别
			finish_pcertNo: '',						//身份证号码
			finish_pcertType: '',					//证件类型
			finish_SendFreq: '',						//对账单发送频率
			finish_reserve: '',						//保留域
			finish_clientName: '',					//客户姓名
			finish_bankAcc: '',						//银行账号
			finish_openNode: '',						//开户网点
			//已签约信息回显
			already_riskLevel: '',					//风险等级
			already_riskDate: '',					//风评有效期
			already_address: '',						//地址
			already_mobileNo: '',						//手机号码
			already_sex: '',							//性别
			already_pcertNo: '',						//身份证号码
			already_pcertType: '',					//证件类型
			already_SendFreq: '',						//对账单发送频率
			already_reserve: '',						//保留域
			already_clientName: '',					//客户姓名
			already_bankAcc: '',						//银行账号
			already_openNode: '',						//开户网点
			already_zipCode: '',						//邮政编码
			already_tel: '',						//电话
			already_birthday: '',						//生日

			signFinish: '',							//签约交易完成标志
			signSuccess: '',							//是否签约成功
			signErrMessage: '',						//签约失败信息
			stepTwoAccess: '',						//已经进入第二步的标志
			allowFengping: '',						//打开风评的标志
			riskDesc: '',							//风评等级描述
			hasChange: '',							//风评是否存在改动
			hasOpenFengPing: '',						//是否自动打开过风评
			canAccessFengPing: '',					//将进入风评
			commitSuccess: '',						//交易完成标志
			reFengPing: '',							//重做标志(0为非重做,1为重做)
			oldSignAccount: '',						//已签约的签约账号
			signAccount: '',							//本次要签约的账号
			questions: '',							//问题列表
			answers: '',								//答案列表
			alreadyCheckedFengping: '',				//用来计算风评等级的列表
			totalPoint: '',							//风评总分数
			hadReadCard: '',							//是否进行过刷卡
			brithdayForm: '',						//无格式生日
			finish_account: '',						//签约返回账号
			finish_riskLevel: '',					//签约完成风评

			tradeFinishFlag: '',						//交易完成标志
		}
	});
	//一卡通缴费session缓存
	var OneCardTradeInfo = Backbone.Model.extend({
		defaults: {
			//session内的元素在需要自定义输入值的时候我会在对应方法的注释中声明,自己随便赋值导致奇怪的结果不要来问我
			//全局相关
			serNo: "",								//该交易流水号
			timecountflag: "",						//锁屏标志,true为继续开启锁屏计时
			hasAlert: "",							//在倒计时时是否存在其他弹框
			checkPasswordSuccess: '',				//验密成功修改为true,在转账操作前再次判断该标志
			isDebug: '',								//是否是电脑调试状态，如果是电脑则设置为true
			//客户信息相关
			isAgent: "",								//是否代理人办理
			customerSelfName: "",					//本人姓名
			customerAgentName: "",					//代理人姓名
			customerSelfId: "",						//本人身份证号
			customerAgentId: "",						//代理人身份证号
			session_customerId: '',					//渠道客户号
			session_customerNameCN: '',				//渠道客户名
			idType: '',								//付款人证件类型
			blacklistFlag: '',						//黑名单标志,true为灰黑名单
			//卡相关
			payAccount: '',							//付款人卡号
			recAccount: '',							//收款人卡号
			keyInfo: '',							    //加密后的密码信息,具体加密密码为keyInfo.value
			checkKeySuccessEvent: '',				//验密后的成功回调函数
			openNode: '',							//付款人开户机构号
			cardType: '',							//付款卡是磁条还是IC, 磁条是0,IC是1,降级交易是2
			cardInfo: '',							//外设读取卡对象信息
			idCardInfo: '',							//外设读取身份证对象信息
			//金额相关
			acctUseBal: '',							//账户可用余额
			dayTotExtctAmt: '',						//当日累计取现金额
			transferAmt: '',							//本次转账或付款金额
			extctAmt: '',							//本次累加转账金额总额
			//CA相关
			CATemplate: '',							//填充数据后的pdf模板
			CAPicture: "",							//CA完成后返回的照片
			CASignPic: "",							//CA签字图片
			CAData: "",								//CA加密包
			CAFinish: "",							//是否完成CA签名
			CASendFinish: "",						//是否完成加密包验证
			//授权相关
			fingerprint: "",							//本地指纹缓存
			FormrAhrTlrNo: '',						//授权柜员号
			successEvent: "",						//授权成功方法缓存
			refuseEvent: "",							//授权拒绝方法缓存
			failEvent: "",							//授权连接失败或异常方法缓存
			authorizationSuccessFlag: '',			//授权通过标志,任何方式通过授权该标志均为true
			authTeller: '',							//提交用授权柜员号
			//远程
			distanceDesc: '',						//远程授权原因
			distanceTimeout: "",						//远程授权计时器
			allowCancelDistance: '',					//允许取消远程授权按钮标志
			distanceSettimeOne: '',					//远程授权一分钟计时器
			distanceSettimeThree: '',				//远程授权三分钟计时器
			distanceFlag: '',						//是否继续远程授权标志,即客户是否同意继续交易
			distanceFinish: '',						//授权完成标志,记录是否已经授权成功
			distanceSuccessEvent: '',				//远程授权成功回调
			distanceRefuseEvent: "",					//远程授权被拒绝回调
			distanceFailEvent: '',					//远程授权连接失败回调
			//影像图片相关
			beginFacePic: '',						//起始人脸识别拍摄图片（非活体检测会在拍摄后直接赋值,活体检测在调用解密识别交易后赋值）
			isLiving: '',							//是否开启活体检测,在活体拍摄成功后自动赋值为true
			beginLivingFaceData: '',					//活体检测加密包数据
			selfIdPic: '',							//本人身份证生成图片
			agentIdPic: '',							//代理人身份证生成图片
			selfInternetPic: '',						//本人联网核查头像图片
			agentInternetPic: '',					//代理人联网核查头像图片
			sendPicSuccessFlag: '',					//图片是否全部上传成功的标志
			judgeFlag: "",							//公安联查标志
			//其他标志位相关
			faceGrade: '',							//人脸识别分数
			tradeSendFinish: '',						//最终交易发送标志
			//可用步骤按钮
			allowPrevious: '',						//上一步可用
			allowNext: "",							//下一步可用
			//一卡通缴费相关标识
			allowAMET: '',				//外设可用标志
			errorAMET: '',				//外设错误描述
			idCardReaded: '',			//身份信息已读取标志

			cityCode: '',				//城市编号
			typeList: '',				//种类数组
			comObject: '',				//公司信息对象
			numType: '',					//号码类别
			allNum: '',					//全网号
			jfNo: '',					//缴费编号
			cityInfo: '',				//城市缓存信息集合
			city_typeInfo: '',			//城市和缴费种类联合信息集合

			rexValue: "",						//格式化回显金额

			tradeFinishFlag: '',						//交易完成标志
			paymentBusinessInfo: "",				//缴费复合信息查询结果缓存
			compareFaceFinished: "",				//人脸识别照片获取完成标志
			sendPicWait: "",						//影像上传等待标志
		}
	});

	var balanceEntranceInfo = Backbone.Model.extend({
		defaults: {
			fingerprint: "", 						//指纹特征信息
			fingerFlag: "",							//授权成功标志,成功为true,失败为false
			authTeller: "",							//授权柜员号
			// allPhoto:{},							//存储图片的对象
			// allFailPhoto:{},						//所有上传失败的图片
			serialNumber: "",						//交易流水号
			tradeId: "",								//交易名称
			tellerStatus: "",						//柜员状态
			branchScale: "",							//机构规模
			photoSizeChoose: "IdCrd",				//照片尺寸
			isUploadImg: "",					        //提交影像标志集合
			isApplyImg: "",							//暂存影像标志集合
			keyInfo: "",								//密码
			photoFlgCollection: ''

		}
	});

	var PublicInformationProcessInfo = Backbone.Model.extend({
		defaults: {
			serialNumber: '',		//交易流水号
			pwdReqFlg: '',			//客户密码标志(0不校验, 1-校验, 2-设置)
			selectOptionObj: {},	//存储选择框中的选项
			customerInfoDetails: {},	//填单详情(P013返回)
			existCustomerFlag: false,	//存量客户标志
			isNeedArtificialPerson: true,	//是否需要填法人信息
			custPwd0: '',				//客户密码1
			custPwd1: '',				//客户密码2
			accountPwd0: '',			//账户密码1
			accountPwd1: '',			//账户密码2
			settlementCardPwd0: '',		//结算卡密码1
			settlementCardPwd1: '',		//结算卡密码2
			branchScale: '',			//机构规模类型(是否自贸区)
			artificialPersonInfo: {		//查询到的法人信息
			},
			artificialPersonInfoNew: {	//填的法人信息
			},
			handlePersonInfo: {	//查询到的经办人信息
			},
			handlePersonInfoNew: {	//填的经办人信息
			},
			p864SubmitInfo: {},	//P864上送报文对象
			p866SubmitInfo: {},	//P866上送报文对象
			p871SubmitInfo: {},	//P871上送报文对象
			netbankSubmitInfo: {},
			p874SubmitInfo: {},
			p867SubmitInfo: {},
			msgSignInfo1: {},
			msgSignInfo2: {},
			msgSignInfo3: {},
			opt_teller: '',			//柜员号
			artificialPersonSubmitMethod: '',	//法人个人信息提交方法(新增或新建)
			handlePersonSubmitMethod: '',	//经办人个人信息提交方法
			AcctNo: '',				//对公账号生成的账号
			netBankSubmitMethod: '',	//网银提交方法
			p874SubmitMethod: '',
			p867SubmitMethod: '',
			MsgSignMethod: '',
			MsgSignNumber: '',
			CATemplate: '',
			handlePersonPhoto: '',
			artificialPersonPhoto: '',
			artificialPersonHasChecked: '',//联网核查成功标志(法人)
			artificialPersonHasSend: '',	//联网核查已发送(法人)
			handlePersonHasChecked: '',	//联网核查成功标志(经办人)
			handlePersonHasSend: '',		//联网核查已发送(经办人)
			submitHasFailed: false, 	//提交交易是否有失败(需重发)
			TskNo: '',					//流程银行任务号
			isAccountCreateSucc: false,	//对公账户是否生成成功
			isProcessBankSucc: false,	//流程银行任务创建是否成功
			P855Results: {},			//
			P856Results: {},			//
			artificialPersonisMobilePhone: false,
			handlePersonisMobilePhone: false,
			artificialPersonReadFlag: false,
			handlePersonReadFlag: false,
			settlementCardLimits: [],
		}
	});

	var PublicInformationProcessResendInfo = Backbone.Model.extend({
		defaults: {
			pfs_seq: '',	//填单流水
			trade_seq: '',	//交易流水
		}
	})

	var ChangePublicInfo = Backbone.Model.extend({
		defaults: {
			serialNumber: '',		//交易流水号
			ProcessInfoList: [],	//
		}
	});

	var AccountType = Backbone.Model.extend({
		defaults: {
			serialNumber: '',		//交易流水号
			ProcessInfoList: [],	//
		}
	});

	var AccountTypeFinish = Backbone.Model.extend({
		defaults: {
			serialNumber: '',		//交易流水号
			ProcessInfoList: []	//
		}
	});

	var IdType = Backbone.Model.extend({
		defaults: {
			serialNumber: '',		//交易流水号
			ProcessInfoList: [],	//
		}
	});

	var IdTypeFinish = Backbone.Model.extend({
		defaults: {
			serialNumber: '',		//交易流水号
			ProcessInfoList: []	//
		}
	});

	var ChangePublicInfo = Backbone.Model.extend({
		defaults: {
			serialNumber: '',		//交易流水号
			ProcessInfoList: [],	//
		}
	});

	var PersonalOnAccount = Backbone.Model.extend({
		defaults: {
			serialNumber: '',		//交易流水号
			ProcessInfoList: [],	//
		}
	});

	var PublicInfomationSetupInfo = Backbone.Model.extend({
		defaults: {
			//全局相关
			serialNumber: "",								//该交易流水号
			timecountflag: "",						//锁屏标志,true为继续开启锁屏计时
			hasAlert: "",							//在倒计时时是否存在其他弹框
			tellerNo: "",							//柜员号
			branchScale: "",							//企业规模，用于判断是否自贸区
			TskNo: "",								//流程银行返回ID
			isFinished: "",							//交易是否完成
			//客户信息相关
			holderIdenType: {},						//控股人证件类型
			legalNationObj: {},							//法人国籍
			legalPersonInfo: {},						//法人个人信息查询返回
			legalUpdFlag: true,						//法人更新标志
			representPersonInfo: {},					//经办人个人信息查询返回
			representUpdFlag: true,					//经办人更新标志
			pbCustNo: "",							//客户号(P885)
			pbCustName: "",							//客户名称(P885)
			bossCtyStr: "",							//投资者国别
			//控股人
			holders: {},
			//外设相关
			legalIdCrdReadInfo: {},					//法人身份证读取信息
			representIdCrdReadInfo: {},				//经办人身份证读取信息
			//CA相关
			//影像图片相关
			isSz: '',								//是否是深圳机构，1是，0不是
			photoWidth: '',							//需要的照片宽度(px)
			photoHeight: '',						//需要的照片高度(px)
			//联网核查照片
			legalChkImg: "",
			representChkImg: "",
			//其他标志位相关
			keyInfo: '',							//加密后的密码信息
			keyInfo1: '',							//第一次输入的密码
			keyInfo2: '',							//第二次输入的密码
			//远程
			allowFinish: "",							//完成按钮允许点击标志
			allowPrevious: "",							//上一步按钮允许点击标志
			allowNext: "",								//下一步按钮允许点击标志
			refuseHideLock: "",						//锁屏禁止解除标志
			//防重
			newLegalAvoidRepeat: true,				//新建法人
			newRepresentAvoidRepeat: true,			//新建经办人
			newPublicAvoidRepeat: true,				//新建对公
			newPBankAvoidRepeat: true,				//新建流程银行
			updLegalAvoidRepeat: true,				//更新法人
			updRepresentAvoidRepeat: true			//更新经办人
		}
	});
	var publicFinalResultInfo = Backbone.Model.extend({
		defaults: {
			//全局相关
			serialNumber: "",						//获取到的交易流水号
			timecountflag: "",						//锁屏标志,true为继续开启锁屏计时
			hasAlert: "",							//在倒计时时是否存在其他弹框
			tellerNo: "",							//柜员号
			TskNo: "",								//流程银行返回ID
			isFinished: "" 							//交易是否完成
		}
	});

	var baseAccountInfo = new BaseAccountInfo();	//新预填单信息对象命名空间
	var oneCardTradeInfo = new OneCardTradeInfo();	//一卡通缴费
	var acodeTradeInfo = new AcodeTradeInfo();
	var userInfo = new UserInfo();
	var productsfinance = new ProductsFinance();//理财产品信息
	var chargeUserInfo = new ChargeUserInfo();//购买理财产品客户信息
	var chargeDealInfo = new ChargeDealInfo();//购买理财产品客户信息
	var showQueueNo = new showQueueNo();
	var getCustomerInfo = new getCustomerInfo();
	var idCardInfo = new idCardInfo();
	var SicCardInfo = new SicCardInfo();
	var preFilledInfo = new PreFilledInfo();
	var reservInfo = new ReservInfo();
	var updateMasketInfo = new UpdateMasketInfo();
	var transferTradeInfo = new TransferTradeInfo();//转账缓存
	var toSignTradeInfo = new ToSignTradeInfo();//渠道签约缓存
	var newToSignTradeInfo = new NewToSignTradeInfo();//渠道签约优化
	var sessionTradeInfo = new SessionTradeInfo();	//基础模板缓存样式
	var finaceTradeInfo = new FinaceTradeInfo();	//理财购买模板缓存样式
	var finaceSignInfo = new FinaceSingInfo();	//理财签约模板缓存样式
	var fundTradeInfo = new FundTradeInfo();	//基金购买模板缓存样式
	var fundSignInfo = new FundSignInfo();	//基金签约模板缓存样式

	var nobleMetalTradeInfo = new NobleMetalTradeInfo();//贵金属购买缓存
	var quhaoUserInfo = new QuhaoUserInfo();

	var custInfo = null;
	var urlBeforeBonus = '#bonusPointManage_step1';//要记录积分兑换操作前的url，以返回
	var messagecount = 0; //当前未读消息数
	var setBoxNum;
	var signOneCardInfo = new SignOneCardInfo();//一卡通签约缓存样式
	var unSignOneCardInfo = new UnSignOneCardInfo();//一卡通解约缓存样式
	var balanceEntranceInfo = new balanceEntranceInfo();//对公入口
	var publicInformationProcessInfo = new PublicInformationProcessInfo();//对公信息处理
	var publicInformationProcessResendInfo = new PublicInformationProcessResendInfo();//对公信息处理重发
	var changePublicInfo = new ChangePublicInfo();//对公信息处理
	var personalOnAccount = new PersonalOnAccount();//个人开户
	var accountType = new AccountType();//更新对公信息-帐号
	var accountTypeFinish = new AccountTypeFinish();
	var idType = new IdType();//更新对公信息-帐号
	var idTypeFinish = new IdTypeFinish();
	var publicInfomationSetupInfo = new PublicInfomationSetupInfo();//新建客户信息
	var publicFinalResultInfo = new publicFinalResultInfo();		//对公最终交易页面
	return {
		sessionID: '',
		UserInfo: UserInfo,
		userInfo: userInfo,
		custInfo: custInfo,
		CustInfo: CustInfo,
		ProductsFinance: ProductsFinance,
		productsfinance: productsfinance,
		showQueueNo: showQueueNo,
		getCustomerInfo: getCustomerInfo,
		idCardInfo: idCardInfo,
		SicCardInfo: SicCardInfo,
		preFilledInfo: preFilledInfo,
		reservInfo: reservInfo,
		ServiceShoppingItem: ServiceShoppingItem,
		GiftShoppingItem: GiftShoppingItem,
		urlBeforeBonus: urlBeforeBonus,
		messagecount: messagecount,
		chargeUserInfo: chargeUserInfo,
		chargeDealInfo: chargeDealInfo,
		quhaoUserInfo: quhaoUserInfo,
		updateMasketInfo: updateMasketInfo,
		transferTradeInfo: transferTradeInfo,
		toSignTradeInfo: toSignTradeInfo,
		newToSignTradeInfo: newToSignTradeInfo,
		sessionTradeInfo: sessionTradeInfo,
		nobleMetalTradeInfo: nobleMetalTradeInfo,
		finaceTradeInfo: finaceTradeInfo,
		finaceSignInfo: finaceSignInfo,
		fundTradeInfo: fundTradeInfo,
		fundSignInfo: fundSignInfo,
		acodeTradeInfo: acodeTradeInfo,
		signOneCardInfo: signOneCardInfo,
		unSignOneCardInfo: unSignOneCardInfo,
		baseAccountInfo: baseAccountInfo,
		oneCardTradeInfo: oneCardTradeInfo,
		balanceEntranceInfo: balanceEntranceInfo,
		publicInformationProcessInfo: publicInformationProcessInfo,
		publicInformationProcessResendInfo: publicInformationProcessResendInfo,
		changePublicInfo: changePublicInfo,
		personalOnAccount: personalOnAccount,
		accountType: accountType,
		accountTypeFinish: accountTypeFinish,
		idType: idType,
		idTypeFinish: idTypeFinish,
		publicInfomationSetupInfo: publicInfomationSetupInfo,
		publicFinalResultInfo: publicFinalResultInfo,
	}
});

