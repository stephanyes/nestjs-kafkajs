export const sleep = (timeout: number) => {
    return new Promise<void>((resolve) => setTimeout(resolve, timeout))
}
// This function returns a promise that resolves after the specified timeout.