const sendErrorDev = (err, res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message, 
        error: err,
        stack: err.stack
    })
}

const sendErrorProd = (err, messares) => {

    // Operational, trusted error: send as much error message to client
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message, 
        })
    }
    // Programming or other unknown error
    else{
        // 1) Log error
        console.error('Error', err)

        // 2) Send generic message to client
        res.status(500).json({
            status:'error',
            message:'Something went wrong.'
        })
    }

}


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500 // internal server error
    err.status = err.status || 'error'

    if(process.env.NODE_ENV !== 'development'){

        sendErrorDev(err, res);

    }else if(process.env.NODE_ENV !== 'production'){

        sendErrorProd(err, res);
    }
    
}