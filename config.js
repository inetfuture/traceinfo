module.exports = {
    port: process.env.PORT || 5000,
    conString: process.env.DATABASE_URL || 'mongodb://traceinfo:traceinfo@wind.qrnu.edu.cn/traceinfo',

    qqLoginAppId: '100277699',
    qqLoginRedirectUri: 'http://traceinfo.herokuapp.com/login?qqCallback=true'
}