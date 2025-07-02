import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { UserValidator } from '../../../../entities/user/User.validator';
import { UserApi } from '../../../../entities/user/UserApi';
import { setAccessToken } from '../../../../shared/lib/axiosInstance';

const INITIAL_INPUTS_DATA = {
  email: '',
  password: '',
};

export default function SignInForm({ setUser }) {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState(INITIAL_INPUTS_DATA);

  const onChangeHandler = (event) => {
    setInputs((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const { isValid, error } = UserValidator.validateSignInData(inputs);

    if (!isValid) {
      alert(error);
      return;
    }

    try {
      const response = await UserApi.signIn(inputs);
      const { error: serverError, data, message, statusCode } = response;
      if (serverError || statusCode !== 200) {
        alert(message);
        return;
      }

      setUser(data.user);
      setAccessToken(data.accessToken);
      setInputs(INITIAL_INPUTS_DATA);
      navigate('/tasks');
    } catch ({ message }) {
      console.log(message);
      alert(message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <input
        placeholder='email'
        type='email'
        name='email'
        required
        value={inputs.email}
        onChange={onChangeHandler}
      />
      <input
        placeholder='password'
        type='password'
        name='password'
        required
        value={inputs.password}
        onChange={onChangeHandler}
      />
      <button type='submit'>Войти</button>
    </form>
  );
}
