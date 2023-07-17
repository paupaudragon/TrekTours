export const hideAlert=()=>{
    const el = document.querySelector('.alert'); //return first element match
    if(el) el.parentElement.removeChild(el);//move 1 level up and remove the child. 
}


// type success or error
export const showAlert = (type, msg)=>{
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
}