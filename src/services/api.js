import _uni from './uni.js'

import {
    ACCESS_TOKEN,
    API_HOST
} from './constant.js'
// function isOutTime(res) {
//   if (res.data.message === '请先登录') {
//     toast.error('登录信息已过期,请重新登录')
//     setTimeout(() => {
//       uni.redirectTo({
//         url: '/pages/login/login'
//       })
//     }, 1000)
//     uni.removeStorageSync('userInfo')
//     uni.removeStorageSync('token')
//   } else {
//     toast.error(res.data.message)
//   }
// }

const apiService = {
    initChatGPT() {
        const url = `/init-im`
        return service.get(url)
    },
    sendMessage({message, conversationId, parentMessageId}) {
        const url = `/send-message`
        return service.post(url, {message, conversationId, parentMessageId})
    },
    sendMessageToCoze({conversation_id, bot_id, user_id, stream, additional_messages}, onMessage, onError, onOpen) {
        // const url = `https://api.coze.cn/open_api/v2/chat`
        const url = `/coze/v3/chat?conversation_id=${conversation_id || ''}`
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + 'pat_aj5RrqpodarvPfxmpdZJfwT17v6ajbXZgzOxPBYAtUjAwM8qdpV1k9T7gUZmRFqP'
        }
        return service.initSsePost(url, {bot_id, user_id, stream, additional_messages}, headers, onMessage, onError, onOpen)
    }
}

const service = {
    initSsePost(url, data, headers, onMessage, onError, onOpen) {
        if (!url.startsWith("http")) url = API_HOST + url
        // 发送 POST 请求并处理响应中的流数据
        fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        }).then(response => {
            if (!response.body) {
                throw new Error('ReadableStream not yet supported in this browser.');
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            const read = () => {
                reader.read().then(({value, done}) => {
                    if (done) {
                        console.log('Stream closed.');
                        return;
                    }
                    buffer += decoder.decode(value, {stream: true});
                    let index;
                    while ((index = buffer.indexOf('\n\n')) !== -1) {
                        const chunk = buffer.slice(0, index);
                        buffer = buffer.slice(index + 2);
                        if (chunk.trim() !== '') {
                            const message = {};
                            chunk.split('\n').forEach(line => {
                                const [field, value] = line.split(/:(.+)/);
                                if (field && value) {
                                    message[field.trim()] = value.trim();
                                }
                            });
                            if (message.data && onMessage && typeof onMessage === 'function') {
                                onMessage(message);
                            }
                        }
                    }
                    // 继续读取
                    read();
                }).catch(error => {
                    if (onError && typeof onError === 'function') {
                        onError(error);
                    } else {
                        console.error('Error reading stream:', error);
                    }
                });
            };
            // 连接打开时调用 onOpen 回调
            if (onOpen && typeof onOpen === 'function') {
                onOpen();
            }
            // 开始读取流
            read();
        }).catch(error => {
            if (onError && typeof onError === 'function') {
                onError(error);
            } else {
                console.error('Fetch error:', error);
            }
        });

        // 返回一个对象用于控制连接，例如关闭连接
        return {
            close() {
                reader.cancel().catch(error => console.error('Error cancelling stream:', error));
            }
        }
    },
    get(url, param) {
        const header = {}
        // header['Authorization'] = 'Bearer ' + uni.getStorageSync('token')
        // header['content-type'] = 'application/json'
        header['X-Access-Token'] = uni.getStorageSync(ACCESS_TOKEN)
        return new Promise((resolve, reject) => {
            uni.request({
                method: 'get',
                url: API_HOST + url,
                data: {
                    _t: Date.parse(new Date()) / 1000,
                    // column: 'createTime',
                    order: 'desc',
                    ...param
                },
                header: header,
                success: (res) => {
                    // 调用接口成功
                    // if (!res.data.flag) {
                    //   isOutTime(res)
                    //   reject(res)
                    // }
                    if (res.statusCode !== 200) {
                        if (res.data.message === 'Token失效，请重新登录') {
                            uni.redirectTo({
                                url: '../login/login',
                                success: () => {
                                    setTimeout(() => {
                                        _uni.showToast('登录已过期,请重新登录.')
                                    }, 500)
                                }
                            })
                        }
                        reject(res)
                    }
                    if (!res.data.success) {
                        _uni.showToast(res.data.message)
                        reject(res)
                    }
                    resolve(res)
                },
                fail: (err) => {
                    _uni.showToast(err.errMsg)
                    reject(err)
                }
            })
        })
    },
    post(url, data, header) {
        header = header || {}
        // if (isLogin) {
        //   header['content-type'] = 'application/x-www-form-urlencoded'
        // } else {
        // header['X-Access-Token'] = uni.getStorageSync(ACCESS_TOKEN)
        header['Authorization'] = 'Bearer ' + 'pat_aj5RrqpodarvPfxmpdZJfwT17v6ajbXZgzOxPBYAtUjAwM8qdpV1k9T7gUZmRFqP'
        //   header['content-type'] = 'application/json'
        // }
        // console.log(process.env)
        // console.log(uni.getSystemInfoSync())

        if (!url.startsWith("http")) url = API_HOST + url
        return new Promise((resolve, reject) => {
            uni.request({
                method: 'post',
                url,
                data: data,
                header: header,
                success: (res) => {
                    // if (res.statusCode !== 200) {
                    //     if (res.data.message === 'Token失效，请重新登录') {
                    //         uni.redirectTo({
                    //             url: '../login/login',
                    //             success: () => {
                    //                 setTimeout(() => {
                    //                     _uni.showToast('登录已过期,请重新登录.')
                    //                 }, 500)
                    //             }
                    //         })
                    //     }
                    //     reject(res)
                    // }
                    // if (!res.data.success) {
                    //     _uni.showToast(res.data.message)
                    //     reject(res)
                    // }
                    resolve(res)
                },
                fail: (err) => {
                    _uni.showToast(err.errMsg)
                    reject(err)
                }
            })
        })
    },
    put(url, data) {
        const header = {}
        // if (isLogin) {
        //   header['content-type'] = 'application/x-www-form-urlencoded'
        // } else {
        header['X-Access-Token'] = uni.getStorageSync(ACCESS_TOKEN)
        //   header['content-type'] = 'application/json'
        // }
        return new Promise((resolve, reject) => {
            uni.request({
                method: 'put',
                url: API_HOST + url,
                header: header,
                data,
                success: (res) => {
                    // if (!res.data.flag) {
                    //   isOutTime(res)
                    //   reject(res)
                    // }
                    if (!res.data.success) {
                        _uni.showToast(res.data.message)
                        reject(res)
                    }
                    resolve(res)
                },
                fail: (err) => {
                    _uni.showToast(err.errMsg)
                    reject(err)
                }
            })
        })
    }
}

export default apiService
