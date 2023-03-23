import { Toast } from 'vant'
import router from '@/router/index'
import sessionData from '@/utils/hooks/useSession'

// 状态码判断
export const statusMessage = (status: number | string, msg?: string): string => {
    let message = ''
    switch (status) {
        case 400:
            message = msg || '请求错误(400)'
            break
        case 401:
            sessionData('clean', 'token')
            const currentEnv = import.meta.env.MODE
            router.replace({ path: '/' })
            if (currentEnv == 'prod') {
                router.replace({ path: '/sso' })
                window.location.href = 'https://sso.cqu.edu.cn/logout?service=http://zhxg.cqu.edu.cn/mobile/sso'
            } else {
                router.replace({ path: '/' })
            }
            message = msg || '未授权，请重新登录(401)'
            break
        case 403:
            // router.replace({ path: '/Error' })
            message = msg || '拒绝访问(403)'
            break
        case 404:
            // router.replace({ path: '/Error' })
            message = msg || '请求出错(404)'
            break
        case 408:
            message = msg || '请求超时(408)'
            break
        case 500:
            // router.replace({ path: '/Error' })
            message = msg || '服务器错误(500)'
            break
        case 501:
            // router.replace({ path: '/Error' })
            message = msg || '服务未实现(501)'
            break
        case 502:
            // router.replace({ path: '/Error' })
            message = msg || '网络错误(502)'
            break
        case 503:
            // router.replace({ path: '/Error' })
            message = msg || '服务不可用(503)'
            break
        case 504:
            // router.replace({ path: '/Error' })
            message = msg || '网络超时(504)'
            break
        case 505:
            // router.replace({ path: '/Error' })
            message = msg || 'HTTP版本不受支持(505)'
            break
        default:
            message = msg || `连接出错(${status})!`
    }
    Toast.fail(`${message}`)
    return `${message}`
}
