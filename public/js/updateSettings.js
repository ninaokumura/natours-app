/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
// updateData and call in index.js

export const updateData = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: './api/v1/users/updateMe',
      data: {
        name,
        email,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Data updated successfully!');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
