const keyStorageToken: string = 'system-token'

const storage = {
    getToken: () => {
        return JSON.parse(localStorage.getItem(`${keyStorageToken}`) as string)
    },

    setToken: (token: string) => {
        localStorage.setItem(`${keyStorageToken}`, JSON.stringify(token))
    },

    clearToken: () => {
        localStorage.removeItem(`${keyStorageToken}`)
    }
}

export default storage