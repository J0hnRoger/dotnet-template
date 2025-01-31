
export const healthCheck = async (url: string) : Promise<boolean> => {
    const response = await fetch(`${url}`)
    if (!response.ok) {
        return false
    }
    return true
}
