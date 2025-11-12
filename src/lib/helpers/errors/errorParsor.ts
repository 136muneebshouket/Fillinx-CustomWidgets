const ErrorParserFn = (error) => {
    let errMsg = error?.response?.data?.msg || error?.response?.data?.message || error?.message;
    if (Array.isArray(errMsg)) {
        const htmlMessage = errMsg.map((e) => `<p>${e}</p>`).join('');
        const html = () => {
            return htmlMessage;
        };
        error.message = html;
        throw error;
    } else {
        error.message = errMsg;
        throw new Error(error);
    }


};

export { ErrorParserFn };
