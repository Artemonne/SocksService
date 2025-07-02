import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { UserValidator } from '../../../../entities/user/User.validator';
import { UserApi } from '../../../../entities/user/UserApi';
import { setAccessToken } from '../../../../shared/lib/axiosInstance';

const INITIAL_INPUTS_DATA = {
  username: '',
  email: '',
  password: '',
  repeatPassword: '',
};

export default function SignUpForm({ setUser }) {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState(INITIAL_INPUTS_DATA);

  const onChangeHandler = (event) => {
    setInputs((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const { isValid, error } = UserValidator.validateSignUpData(inputs);

    if (!isValid) {
      alert(error);
      return;
    }

    if (inputs.password !== inputs.repeatPassword) {
      alert('Пароли не совпадают');
      return;
    }

    try {
      const response = await UserApi.signUp(inputs);
      const { error: serverError, data, message, statusCode } = response;
      if (serverError || statusCode !== 201) {
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
        placeholder='username'
        name='username'
        required
        value={inputs.username}
        onChange={onChangeHandler}
      />
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
      <input
        placeholder='password'
        type='password'
        name='repeatPassword'
        required
        value={inputs.repeatPassword}
        onChange={onChangeHandler}
      />
      <button type='submit'>Зарегистрироваться</button>
    </form>
  );
}
