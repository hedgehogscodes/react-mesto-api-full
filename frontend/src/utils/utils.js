export const apiOptions = {
  baseUrl: 'https://mestoproject.student.nomoredomains.icu',
  headers: {
    'Content-Type': 'application/json'
  }
};

export const baseUrl = 'https://mestoproject.student.nomoredomains.icu';

export const checkResponse = (res) =>
  res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
