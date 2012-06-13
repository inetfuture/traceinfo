module.exports = {
	port: process.env.PORT || 5000,
	conString: process.env.DATABASE_URL || 'tcp://traceinfo:qaz1!@wind.qrnu.edu.cn/traceinfo',
	
	qqLoginAppId: '100277699',
    qqLoginRedirectUri: 'http://traceinfo.herokuapp.com/login?qqCallback=true'
}