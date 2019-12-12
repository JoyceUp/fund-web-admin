/* 当数据的某个字段其中有空值，返回-- */
export function isNull(val) {
    return (val == "" || val == undefined || val == null) ? " - - " : val;
};

/* 截取出生日期长度，显示年月日 */
export function isBirthDate(val) {
    return isNotNull(val) ? "" : val.substring(0, 10);
};

function isNotNull(val) {
    return (val == "" || val == undefined || val == null) ? true : false;
};
function isTwoCent(x){
    var f = Math.round(x*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
};

//美分变美元，人民币同
export function centToDollar(cent) {

    if ( !isNotNull(cent)) {
        var dollar = cent / 100;
        return isTwoCent(parseFloat(dollar.toFixed(2)));
    }
    return isTwoCent(0);
}
//百分号
export function centToPerCent(cent) {
    if ( !isNotNull(cent)) {
        var dollar = cent / 10000;
        return parseFloat(dollar.toFixed(2));
    }
    return 0;
}
//去除前后空格
export function trimBlank(rate) {
    if(!isNotNull(rate)){
        return rate.replace(/(^\s*)|(\s*$)/g, "");
    }
    return rate;
};

export function getPreMonth() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth();
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month
    return currentdate;
}


export  function getNowFormatDate() {
    var dd = new Date();
    console.log(dd)
    var seperator1 = "-";
    var year = dd.getFullYear();
    var month = dd.getMonth() + 1;
    var strDate = dd.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

exports.pickerOptions2 ={
    shortcuts: [{
        text: '最近一周',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
        }
    }, {
        text: '最近一个月',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
        }
    }, {
        text: '最近三个月',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
        }
    }]
}