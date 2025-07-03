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
        `- ${item.name || item.genImage} (id: ${item.sockId}): ${
          item.quantity
        } x ${item.price}₽`
    )
    .join('\n');

  const mailOptions = {
    from: 'office-socks@mail.ru',
    to: 'office-socks@mail.ru',
    subject: `Новый заказ от ${user.name || user.email || user.id}`,
    text: `
      Данные пользователя:
      Имя: ${user.name || '-'}
      Email: ${user.email || '-'}
      ID: ${user.id || '-'}

      Товары:
      ${itemList}

      Сумма заказа: ${total}₽
    `,
  };
  await transporter.sendMail(mailOptions);
};
