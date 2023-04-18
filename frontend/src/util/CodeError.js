
class CodeError extends Error {
    constructor(message, code=null) {
     super(message);
     this.code = code;
    }
}

export default CodeError