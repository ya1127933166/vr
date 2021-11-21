/**
 * 列队等待控制器
 * 运行逻辑
 * 某个状态不满足时，加入到等待任务列表，等待状态刷新后，再次执行
 * 
 * 创建一个关注状态变更的数组，此数组用于存储需要执行function
 * xxxxSuccess表示状态变更已满足，开始一次列队的执行
 * 把数组用filter方法循环一次，根据方法返回的Bool值，决定function的有效期
 */

class Waiting {
    constructor() {
        this.list = {
            login: [], // 刷新登录状态列队
            userinfo: [], // 刷新用户信息列队
        };
    }

    /**
     * 注入登录状态刷新列队
     * @param {Function} f
     */
    set login(f) {
        this.list.login.push(f);
    }

    /**
     * 获取登录列队 - 列表
     */
    get login() {
        return this.list.login;
    }

    /**
     * 执行登录成功
     * 顺序执行任务
     * 基于filter过滤
     */
    loginSuccess() {
        this.list.login = this.list.login.filter(f => f());
    }

    /**
     * 注入用户信息更新列队
     * @param {Function} f
     */
    set userinfo(f) {
        this.list.userinfo.push(f);
    }

    /**
     * 获取用户信息更新列队
     */
    get userinfo() {
        return this.list.userinfo;
    }

    /**
     * 用户信息更新，执行列队
     */
    userinfoSuccess() {
        this.list.userinfo = this.list.userinfo.filter(f => f());
    }
}

const waiting = new Waiting();

export default waiting;
