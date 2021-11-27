/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51K0E8cCnwRCAEViyHiV7hdRwGnitzWins3JaXGfCXnTYMcvx7iR2bKGymnH7A6SzXYSDlDNW07An9G5tb9DbRM7q00pyKBw1VT'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from the API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
