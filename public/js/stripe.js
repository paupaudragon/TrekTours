
const bookTour= async tourId =>{
    try{
        const stripe = Stripe('pk_test_51NVpEqAK2OSiIWwfS8aTXgoobi6dPOaaKTsqMgCpdefmzyVsMlXto5yotdOPOrP3ZZkaHTC8OXoV4QyAVOHvgRBr00Ydrc3698');
    // 1)Get checkout-session from api 
    const session = await axios(
        {
            method: "GET",
            url: `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`

        }
        );

    console.log(session);

    // 2) Create checkout form + credit card 
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })

        // window.location.replace(session.data.session.url)

    }catch(err){
        console.log(err);
        showAlert('error', err);
    }
    


}

const bookBtn = document.getElementById('book-tour'); 
if(bookBtn){
    bookBtn.addEventListener('click', e=>{
        e.target.textContent ='Processing ...'
        const tourId = e.target.dataset.tourId;
        console.log(e.target.dataset)
        bookTour(tourId);

    }
    )
}