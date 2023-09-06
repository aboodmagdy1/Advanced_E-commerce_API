//@desc    this calss in resposible for operational error (errors tha i can predict )
class AppError extends Error {
    constructor(message,statusCode ){
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith(4) ?'fali':'error'
        this.isOperational = true// tell us that this error i have predict it 
    }
}


module.exports  = AppError