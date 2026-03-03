import React from 'react';
import { Container, Accordion } from 'react-bootstrap';

function FAQPage() {
  const faqs = [
    {
      question: 'Как оформить заказ?',
      answer: 'Для оформления заказа выберите товар в каталоге и нажмите кнопку "Купить". Затем заполните форму заказа и ожидайте звонка оператора для подтверждения.'
    },
    {
      question: 'Какие способы оплаты доступны?',
      answer: 'Мы принимаем оплату банковскими картами, электронными деньгами, а также наличными при получении.'
    },
    {
      question: 'Как осуществляется доставка?',
      answer: 'Доставка осуществляется курьерской службой или почтой России. Срок доставки составляет 3-7 рабочих дней.'
    },
    {
      question: 'Можно ли вернуть товар?',
      answer: 'Да, вы можете вернуть товар в течение 14 дней с момента получения, если он не был в употреблении и сохранены все ярлыки и упаковка.'
    },
    {
      question: 'Как узнать статус заказа?',
      answer: 'Статус заказа можно отследить в личном кабинете или связавшись с нашей службой поддержки.'
    }
  ];

  return (
    <Container className="py-4">
      <h1 className="mb-4">Часто задаваемые вопросы</h1>
      
      <Accordion defaultActiveKey="0">
        {faqs.map((faq, index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
            <Accordion.Header>{faq.question}</Accordion.Header>
            <Accordion.Body>
              {faq.answer}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
}

export default FAQPage;