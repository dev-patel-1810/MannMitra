import async from 'async'

const async_handler=(requestHandler)=>{return (req,res,next)=>{
    Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
} 
// these funtions are async funtions now we can just call and use without headache
export{async_handler}