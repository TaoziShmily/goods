
const app = getApp();
import {apiRequest} from '../../utils/util';
const WxParse		= require('../../utils/wxParse/wxParse')

Page({
	data:{
		goods_id:'',  //商品ID
		goods_model:'',  //商品型号
		product:'',  //商品全称
		banner:'',
		our_price:0,  //金额
		total_price:398,
		list_price:0,
		discount:'',
		saved_price:'',
		count_buyer:'',
		goods_brief_title:'',
		goods_content_title:'',
		contact_phone:'',
		goods_service_title:'',
		goods_comment_title:'',
		goods_comments:[],
		goods_colors:[],
		goods_name:'',
		goods_color:'',
		num: 1,
		minusStatus: 'disabled',
		region: ['广东省', '广州市', '越秀区'],
    	customItem: '全部',
    	autoplay:true,
    	vertical:true,
    	interval:1000,
    	circular:true,
    	duration:500,
    	scrollTop:0,
    	scrollY:true,
    	count_down: {},
    	challenge_expired:0,
    	currIndex:0,
    	count_down:'',
    	day:'00',
    	hour:'00',
    	minute:'00',
    	second:'00',
    	timer:null,
    	userName:'',			//收货人
    	cellPhone:'',  //手机号码
    	address:'',    //收货地址
    	method:'货到付款', //付款方式
    	message:'',   //留言
    	windowHeight:0,   //屏幕高度,
    	hasData:false,
    	// disabled:false,
    	timeStamp: 0
	},

	// 获取首页数据
    onLoad () {
    	var that = this;
        apiRequest('/goods/3659/detail','POST',{},{'content-type':'application/x-www-form-urlencoded'}).then(res => {
          if (res.statusCode == 200 && res.data.status == "SUCCEED") {
          	var data = res.data.data
          	var goods_brief = data.goods.goods_brief
          	var goods_content = data.goods.goods_content
          	WxParse.wxParse('article', 'html', goods_brief, that, 5);
          	WxParse.wxParse('content', 'html', goods_content, that, 5);
            that.setData({
            	hasData:true,
            	goods_id:data.goods.goods_id,
            	goods_model:data.goods.goods_model,
            	banner:data.goods.goods_picture_full,
            	our_price:data.goods.our_price,
            	list_price:data.goods.list_price,
            	discount:data.goods.discount,
            	saved_price:data.goods.saved_price,
            	count_buyer:data.goods.count_buyer,
            	goods_brief_title:data.goods.goods_brief_title,
            	goods_content_title:data.goods.goods_content_title,
            	contact_phone:data.goods.contact_phone,
            	goods_service_title:data.goods.goods_service_title,
            	goods_comment_title:data.goods.goods_comment_title,
            	goods_comments:data.goods.goods_comments,
            	goods_colors :data.goods.goods_colors ,
            	goods_color :data.goods.goods_colors[0] ,
            	goods_name:data.goods.goods_name,
            	count_down:data.goods.count_down,
            })
        	this.countDown(this.data.count_down)
            wx.setNavigationBarTitle({
              title: this.data.goods_name
            })
            if (wx.hideToast) {
              wx.hideToast();
            }
          } else {
            wx.showModal({
                title: '错误提示',
                content: '请求出错',
                showCancel:false
            })
          }
        }, res => {
        	that.setData({
        		hasData:false,
        	})
        })
    },
    

	// 倒计时的执行函数
    countDown(timeStamp){
    	var number = timeStamp;
    	var that = this;
    	var [d,h,m,s] = [0,0,0,0];
    	that.timer = setInterval(function(){
    		number--;
    		var differ = number;
	    	if(differ<0){
	    		number = timeStamp;
	    		console.log('结束了')
	    		return
	    	}
    		d = format(parseInt(differ/(24*60*60)));
    		differ = differ%(24*60*60)
    		h = format(parseInt(differ/(60*60)));
    		differ = differ%(60*60)
    		m = format(parseInt(differ/60));
    		differ = differ%60
    		s = format(parseInt(differ));
	    	that.setData({
	    		day:d,
	    		hour:h,
	    		minute:m,
	    		second:s,
	    	})
    	}, 1000)
    	function format(num){
	    	return num <10 ? '0' + num : num;
	    }
    },
	// 拨打电话
	makePhoneCall(){
		wx.makePhoneCall({
			phoneNumber: this.data.contact_phone,
			success: function () {
				console.log("成功拨打电话")
			}
		})
	},
	/* 点击减号 */
	bindMinus: function() {
		var num = this.data.num;
		// 如果大于1时，才可以减
		if (num > 1) {
			num --;
		}
		var minusStatus = num <= 1 ? 'disabled' : 'normal';
		this.setData({
			num: num,
			minusStatus: minusStatus
		});
		var total_price = (this.data.our_price) * (this.data.num)
		this.setData({
			total_price: total_price
		});
		console.log('num',num)
	},
	/* 点击加号 */
	bindPlus() {
		var num = this.data.num;
		// 不作过多考虑自增1
		num ++;
		var minusStatus = num < 1 ? 'disabled' : 'normal';
		this.setData({
			num: num,
			minusStatus: minusStatus
		});
		var total_price = (this.data.our_price) * (this.data.num)
		this.setData({
			total_price: total_price
		});
		console.log('num',num)
	},
	/* 输入框事件 */
	bindNum (e) {
		var num = e.detail.value;
		// 将数值与状态写回
		this.setData({
			num: num
		});
		
		var total_price = (this.data.our_price) * (this.data.num)
		this.setData({
			total_price: total_price
		});
	},

	// 省市区
	bindRegionChange (e) {
	    console.log('picker发送选择改变，携带值为', e.detail.value)
	    this.setData({
	      region: e.detail.value
	    })
	},

	//回到顶部
	goTop (e) {  // 一键回到顶部
		console.log('')
		if (wx.pageScrollTo) {
			wx.pageScrollTo({
				scrollTop: 0
			})
		} else {
			wx.showModal({
				title: '提示',
				content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
			})
		}
	},

	// 在线下单
	goBuy1(e) {  
		wx.createSelectorQuery().select('#homepage').boundingClientRect(function(rect){
			console.log('rect',rect)
			wx.pageScrollTo({
				scrollTop:(rect.bottom - 800)
			})
	    }).exec()
	},

	// 在线下单
	goBuy2(e) {  
		wx.createSelectorQuery().select('#homepage').boundingClientRect(function(rect){
			console.log('rect',rect)
			wx.pageScrollTo({
				scrollTop:(rect.height - 800)
			})
	    }).exec()	
	},

	// 下单选择颜色
	selectColor(e){
		console.log('selectColor',e.currentTarget.dataset)
		this.setData({
			currIndex: e.currentTarget.dataset.index,
			goods_color: e.currentTarget.dataset.goods_color
		})
	},

	// 分享功能
    onShareAppMessage: function (res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      return {
        title: this.data.goods_name || '',
        path: '/pages/index/index'
      }
    },

   
    // 收货地址
    bindMessage(e){
    	this.setData({
    		message:e.detail.value
    	})
    	console.log('message',this.data.message)
    },

    // 提交表单
    formSubmit(e){
    	console.log(e)
    	if (e.timeStamp - this.data.timeStamp <= 2500) {
	      this.setData({ timeStamp: e.timeStamp });
	      return false;
	    }
    	this.setData({ timeStamp: e.timeStamp });
		if(e.detail.value.userName.length <=0) {
			wx.showModal({
				title:'温馨提示',
				content:'请填写姓名！',
				showCancel:false,
				confirmText:'我知道了'
			})
			return;
		}
		if(e.detail.value.cellPhone.length < 11) {
			wx.showModal({
				title:'温馨提示',
				content:'请填写正确的手机！',
				showCancel:false,
				confirmText:'我知道了'
			})
			return;
		}

		if(e.detail.value.address.length <=0) {
			wx.showModal({
				title:'温馨提示',
				content:'请填写地址！',
				showCancel:false,
				confirmText:'我知道了'
			})
			return;
		}
		var total_price = (this.data.our_price) * (this.data.num)
		var product = this.data.goods_name+this.data.goods_model
		this.setData({
			total_price:total_price,
			product:product
		})
		console.log('this.data.region',this.data.region)
		var postData = {
			"region": this.data.region,
			'address':e.detail.value.address,
			'pid'    : this.data.goods_id,
			'price'  : this.data.total_price,
			'product': this.data.product,
			'pro1': this.data.goods_name,
			'mun': this.data.num,
			'goods_model':this.data.goods_model,
			'name':e.detail.value.userName,
			'mob':e.detail.value.cellPhone,
			'guest':this.data.message,
			'order_from':'2',  //订单来源  1=H5,2=小程序
			'pay':'pod',   //支付方式ID 货到付款
			'payment_id':'6',  //支付方式ID
			'shipping_id':'10',  //物流方式ID,物流方式ID	
		}
		apiRequest('/order/submit','POST',postData,{'content-type':'application/x-www-form-urlencoded'}).then(res => {
			console.log('提交表单',res)
			
			if(res.statusCode == 200){
				wx.showLoading({
	            	title:'提交订单中...',
	            	mask:true
	            });

				if(res.data.status == "SUCCEED"){
					wx.hideLoading()
					app.globalData.order = res.data.order
					wx.redirectTo({
					  url: '/pages/success/success'
					})
					console.log('跳转')
				}else{
					
				}
			}else{
				wx.showModal({
					title:'提示',
					content:'下单出问题啦~',
					showCancel:false,
					confirmText:'好吧'
				})
			}		
		})		
	}
})
