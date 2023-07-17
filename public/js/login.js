// import axios from 'axios';
// import{showAlert} from './alerts';


// export 
const login = async (email, password) => {
    //console.log(email,password);
    //axios have good error throwing message, so use try catch 
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/users/login",
      data: {
        email,
        password
      },
    });

    //console.log(res);

    if(res.data.status ==='success'){
    //   showAlert('success','Logged in');
        alert('successully log in');
      window.setTimeout(()=>{
        location.assign('/');
      }, 1500)
    }
  } catch (err) {
    // showAlert('error',err.response.data.message);
    alert(err.response.data.message);
  }
};

document.querySelector('.form').addEventListener('submit', e =>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
})


