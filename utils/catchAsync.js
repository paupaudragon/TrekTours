/**
* High level warpper for Async to catch Error
* This function takes in another function and catch the error if any, return a promise, and call next.
* @param {async function} fn 
* @returns A anynomous function
*/

module.exports = fn =>{
 return (req, res, next)=>{
   fn(req, res, next).catch(next)
 }

}