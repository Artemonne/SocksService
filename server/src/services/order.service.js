const nodemailer = require('nodemailer');

const PASS_EMAIL = process.env.PASS_EMAIL;

const transporter = nodemailer.createTransport({
  service: 'Mail.ru',
  auth: {
    user: 'office-socks@mail.ru',
    pass: PASS_EMAIL,
  },
});

exports.sendOrderMail = async (orderData) => {
  const { user, items, total } = orderData;
  const itemList = items
    .map(
      (item) =>
        `
      <div>
      <img src="${item.Sock.genImage}" alt="sock image" style="width:100px; height:auto" /> 
      <p>Количество: ${item.quantity} | Стоимость: ${item.price}₽ | Сумма: ${item.quantity*item.price}₽</p>
      </div>`
    )
    .join('');

  const mailOptions = {
    from: 'office-socks@mail.ru',
    to: 'office-socks@mail.ru',
    subject: `Новый заказ от ${user.name || user.email || user.id}`,
    html: `
      
    <h2>Данные пользователя:</h2>
    <p>Имя: ${user.name || '-'} ❤️</p>
    <p>Email: ${user.email || '-'}</p>

    <h2>Товары:</h2>
    ${itemList}

    <h3>Сумма заказа: ${total}₽</h3>
    `,
  };
  await transporter.sendMail(mailOptions);
};
