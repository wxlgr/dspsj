/* 更改日期格式 */
function formatDate (time, fmt) {
	if(!time){ time = new Date() }; // 默认时间 当天
	if(!fmt){ fmt = "YYYY-MM-DD hh:mm:ss" }; // 默认时间格式 年-月-日 时：分：秒
	
	const date = new Date(time)
    if (/(Y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    const o = {
        "Q+": Math.floor((date.getMonth() + 3) / 3),	// 季度
        'M+': date.getMonth() + 1,						// 月份
        'D+': date.getDate(),							// 日期
        'h+': date.getHours(),							// 小时
        'm+': date.getMinutes(),						// 分钟
        's+': date.getSeconds(),						// 秒钟
        "ms": date.getMilliseconds(),					// 毫秒
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};

function padLeftZero (str) {
    return ('00' + str).substr(str.length);
};


/* 导出方法函数 */
export { formatDate }