const app = getApp();

Page({
	data:{
		order:null,
	},
	onLoad(){
		console.log('app',app)
		this.setData({
			order:app.globalData.order
		})
		wx.setNavigationBarTitle({
			title:'您的订单已经提交成功，感谢您的支持！'
		})
	},
	goHome(){
		wx.redirectTo({
		  url: '/pages/index/index'
		})
	}
})