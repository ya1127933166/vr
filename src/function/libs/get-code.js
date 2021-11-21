/**
 * GetCode
 * 将数字转换成自定义混淆进制码
 */
class GetCode {
    constructor(len = 6) {
        this.char = 'fVUPwXOrmkBiGvjAEu89MRtDxNL4FWgcZsJYby'.split(''); // 进制码
        this.symbol = 'dTa2Ke6nzoHq7153ChpIQlS'.split(''); // 混淆码
        this.charLen = this.char.length; // 进制编码长度
        this.symbolLen = this.symbol.length; // 混淆填充编码长度
        this.len = len; // 期望的固定长度，如果数字过大，长度会超过这个数字
    }
    
    /**
     * 数字转进制码
     * @param {Number} n 数字
     */
    toKey(n) {
        if (!n) return this.char[0];
        const num = n * 1;
        const a = Math.floor(num / this.charLen);
        const b = num % this.charLen;
        let s = '';
        if (a > 0) {
            s += this.toKey(a);
        }
        s += this.char[b];
        return s;
    }

    /**
     * 进制码转数字
     * @param {Number} s 进制码
     */
    toNum(s) {
        if (!s) return 0;
        const str = s.toString();
        const len = str.length - 1;
        let n = 0;
        str.split('').forEach((i, index) => {
            let key = this.char.indexOf(i);
            if (key === -1) key = 0;
            const now = key * (this.charLen ** (len - index));
            n += now;
        });
        return n;
    }

    /**
     * 随机数
     * @param {Number} a 起始数字
     * @param {Number} b 截止数字
     */
    random(a, b) {
        return Math.floor(Math.random() * (a - b)) + b;
    }

    /**
     * 在字符串中随机插入一个字符
     * 前提是str.length > 1
     * 
     * @param {String} str
     * @param {String} ins
     */
    randomInsert(str, ins) {
        if (str.length === 1) {
            return `${str}${ins}`;
        }
        const r = this.random(0, str.length + 1);
        const s1 = str.substring(0, r);
        const s2 = str.substring(r);
        return `${s1}${ins}${s2}`;
    }

    /**
     * 把KEY转出固定位数
     * 不足部分混入替补符号
     * 剔除替补符号以后，原字符串保持不变
     * 
     * @param {String} key 已转换的进制码
     */
    toFixed(key) {
        if (key.length >= this.len) return key;
        const num = this.len - key.length;
        let symbol = [];
        symbol.length = num;
        symbol.fill(1, 0);
        symbol = symbol.map(() => this.symbol[this.random(0, this.symbolLen)]);
        if (num < 2) {
            return this.randomInsert(symbol.join(''), key);
        }
        let newKey = key;
        symbol.forEach(i => newKey = this.randomInsert(newKey, i));
        return newKey;
    }

    /**
     * 清除key中替补符号
     * 
     * @param {String} key 待清除的进制码
     */
    clearSymbol(key) {
        const regexp = new RegExp(`[${this.symbol.join('')}]`, 'g');
        return key.replace(regexp, '');
    }

    /**
     * 获取keyId
     * 
     * @param {Number} n 转换的数字
     */
    getKeyId(n) {
        const key = this.toKey(n);
        return this.toFixed(key);
    }

    /**
     * 获取NumId
     * 
     * @param {String} s 转换的进制码
     */
    getNumId(s) {
        if (!/[a-zA-Z0-9]/.test(s)) {
            throw Error('getNumId传入的字符串不正确');
        }
        const key = this.clearSymbol(s);
        return this.toNum(key);
    }
}

export default GetCode;
