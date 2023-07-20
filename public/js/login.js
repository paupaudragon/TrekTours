// import{showAlert} from './alerts';
const login = async (email, password) => {
    //console.log(email,password);
    //axios have good error throwing message, so use try catch 
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        email,
        password
      },
    });

    //console.log(res);

    if(res.data.status ==='success'){
      showAlert('success','Logged in');
        // alert('successully log in');
      window.setTimeout(()=>{
        location.assign('/');
      }, 1500)
    }
  } catch (err) {
    showAlert('error',err.response.data.message);
    // alert(err.response.data.message);
  }
};

const loginForm = document.querySelector('.form--login'); 
if(loginForm){

  loginForm.addEventListener('submit', e =>{
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password);
  })
}

/////////////////////////////////////////////////////////////////
const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });
    if ((res.data.status === 'success')) location.reload(true);
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};

const logOutBtn = document.querySelector('.nav__el--logout');
if (logOutBtn) logOutBtn.addEventListener('click', logout);
