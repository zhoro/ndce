export const defaultCmdParams = {
    /***
     * default command parameters
     */
    cmdParams: {
        sendTimeout: 2000
    },
    /***
     * set timeout for command execution
     */
    setTimeout: (value: number) => {
        defaultCmdParams.cmdParams.sendTimeout = value;
    }
}