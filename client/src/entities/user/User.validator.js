export class UserValidator {
  static validateEmail(email) {
    const emailPattern = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}$/;
    return emailPattern.test(email);
  }

  static validatePassword(password) {
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasNumbers = /\d/;
    const hasSpecialCharacters = /[!@#$%^&*()-,.?":{}|<>]/;
    const isValidLength = password.length >= 8;

    if (
      !hasUpperCase.test(password) ||
      !hasLowerCase.test(password) ||
      !hasNumbers.test(password) ||
      !hasSpecialCharacters.test(password) ||
      !isValidLength
    ) {
      return false;
    }

    return true;
  }

  static validateSignInData({ email, password }) {
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return {
        isValid: false,
        error: 'Email не должен быть пустым',
      };
    }

    if (
      !password ||
      typeof password !== 'string' ||
      password.trim().length === 0
    ) {
      return {
        isValid: false,
        error: 'Пароль не должен быть пустым',
      };
    }

    return {
      isValid: true,
      error: null,
    };
  }

  static validateSignUpData({ name, email, password }) {
    if (
      !name ||
      typeof name !== 'string' ||
      name.trim().length === 0
    ) {
      return {
        isValid: false,
        error: 'поле name не должно быть пустым',
      };
    }

    if (
      !email ||
      typeof email !== 'string' ||
      email.trim().length === 0 ||
      !this.validateEmail(email)
    ) {
      return {
        isValid: false,
        error: 'email должен быть валидным',
      };
    }

    if (
      !password ||
      typeof password !== 'string' ||
      password.trim().length === 0 ||
      !this.validatePassword(password)
    ) {
      return {
        isValid: false,
        error:
          'Пароль не должен быть пустым, должен содержать одну большую букву, одну маленькую, один специальный символ, и не должен быть короче 8 символов',
      };
    }

    return {
      isValid: true,
      error: null,
    };
  }
}
