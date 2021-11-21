/* eslint-disable no-useless-escape */
/**
 * 时间格式化
 */
class DateFormat {
    constructor(dateString) {
        const d = new Date();
        this.nowYear = d.getFullYear();
        this.nowMonth = d.getMonth() + 1;
        this.nowDate = d.getDate();

        if (dateString) {
            this.parse(dateString);
        } else {
            this.date = d;
        }
    }

    /**
     * 时间字符串转为时间
     * @param {String} dateString 时间字符串
     */
    parse(dateString, sync) {
        const ds = dateString.replace(/\-/g, '/')
            .replace(/\./g, '/')
            .replace(/T/g, ' ')
            .replace(/(日|秒)/g, '')
            .replace(/(时|分)/g, ':')
            .replace(/(年|月)/g, '/');
        const d = new Date(ds);
        if (isNaN(d.getTime())) {
            throw Error('dateString不是合法的时间字符串');
        }
        if (sync) {
            this.date = d;
        }
        return d;
    }

    /**
     * 格式化输出时间
     * @param {String} tpl 模板
     * @param {String|Date} date 时间字符串或时间对象
     */
    format(tpl, date) {
        let d = date;
        if (!date) {
            d = this.date;
        } else if (typeof date === 'string') {
            d = this.parse(date);
        } else if (date.constructor.name !== 'Date') {
            throw Error('请传入正确的Date对象');
        }

        const o = {};
        o.yyyy = d.getFullYear();
        o.yy = `${o.yyyy}`.substring(2);
        o.m = d.getMonth() + 1;
        o.mm = o.m < 10 ? `0${o.m}` : o.m;
        o.d = d.getDate();
        o.dd = o.d < 10 ? `0${o.d}` : o.d;

        const dateTemplate = tpl || 'yyyy/mm/dd';
        const regexp = /(yyyy|yy|mm|m|dd|d)/ig;
        return dateTemplate.replace(regexp, key => o[key.toLowerCase()]);
    }

    /**
     * 计算两个时间之间，相差月份
     * @param {String|Date} start 开始时间
     * @param {String|Date} end 结束时间
     */
    computedMonth(start, end) {
        let startDate = this.parse(start);
        let endDate = this.parse(end);

        const startTime = startDate.getTime();
        const endTime = endDate.getTime();
        // 自动倒序
        if (endTime < startTime) {
            const endDate2 = startDate;
            startDate = endDate;
            endDate = endDate2;
        }

        /**
         * 12进制计算月份差
         */
        const startYearString = startDate.getFullYear().toString(12);
        const endYearString = endDate.getFullYear().toString(12);
        const startMonthString = startDate.getMonth().toString(12);
        const endMonthString = endDate.getMonth().toString(12);

        const startNum = parseInt(`${startYearString}${startMonthString}`, 12);
        const endNum = parseInt(`${endYearString}${endMonthString}`, 12);

        let months = endNum - startNum;

        const startDateDate = startDate.getDate();
        const endDateDate = endDate.getDate();
        let contractMonths = months;
        if (endDateDate >= startDateDate) {
            contractMonths += 1;
        }

        /**
         * 满月判断
         */
        let fullMonth = false;
        const endMonth = endDate.getMonth() + 1;

        if (startDateDate > 1 && startDateDate < 30) {
            if (startDateDate - 1 === endDateDate) {
                fullMonth = true;
            }
        } else
        // 1号
        if (startDateDate === 1) {
            if (endDateDate > 27) {
                const monthEndDate = this.getMonthEndDate(endDate).getDate();
                fullMonth = (monthEndDate === endDateDate);
            }
        } else
        // 31号
        if (startDateDate === 31) {
            const monthEndDate = this.getMonthEndDate(endDate).getDate();
            fullMonth = (monthEndDate === endDateDate);
        } else
        // 30号
        if (startDateDate === 30) {
            const monthEndDate = this.getMonthEndDate(endDate).getDate();
            if (endMonth === 2) {
                fullMonth = (monthEndDate === endDateDate);
            } else {
                fullMonth = endDateDate === 29;
            }
        }
        return {
            months,
            contractMonths,
            fullMonth,
            days: (() => {
                const startTime = startDate.getTime();
                const endTime = endDate.getTime();
                return Math.ceil((endTime - startTime) / 24 / 60 / 60 / 1000);
            })(),
            startDate,
            endDate,
            computedParam: {
                startYearString,
                endYearString,
                startMonthString,
                endMonthString,
                startNum,
                endNum,
            },
        };
    }

    /**
     * 
     * @param {String} numberDate 组装成
     */
    numberDateSplit(numberDate, symbol = '-') {
        if (numberDate.length !== 8 && numberDate.length !== 6) {
            return numberDate;
        }
        const yearEnd = numberDate.length === 8 ? 4 : 2;
        const date = [];
        date.push(numberDate.substring(0, yearEnd));
        date.push(numberDate.substring(yearEnd, yearEnd + 2));
        date.push(numberDate.substring(yearEnd + 2, yearEnd + 4));
        return date.join(symbol);
    }

    /**
     * 获取月末对象
     * @param {Date} date 需要被获取的时间
     */
    getMonthEndDate(date) {
        let yearFixed = date.getFullYear();
        let monthFixed = (date.getMonth() + 1) + 1;
        if (monthFixed > 12) {
            monthFixed = 1;
            yearFixed += 1;
        }
        const fixedDate = this.parse(`${yearFixed}/${monthFixed}/1`);
        fixedDate.setTime(fixedDate.getTime() - (24 * 60 * 60 * 1000));
        return fixedDate;
    }
}

const dateFormat = new DateFormat();

export default dateFormat;
