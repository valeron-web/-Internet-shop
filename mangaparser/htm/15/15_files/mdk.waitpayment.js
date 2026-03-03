((e) => {
  window.mdk = window.mdk || {};
  window.mdk.waitPayment = window.mdk.waitPayment || e;
})(() => {
  'use strict';
  const url = 'https://tools2.mandarake.co.jp/tools/waitPayment/';
  const isLogin = () => {
    const loginCookie = 'mandarake_userId';
    const cookies = document.cookie.split(';');
    for(const c of cookies) {
      if (c.trim().slice(0, c.trim().indexOf('=')) === loginCookie) {
        return true;
      }
    }
    return false;
  }
  const get = async (callback) => {
    if (isLogin()) {
      const response = await fetch(url, {
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
      });
      const data = await response.json();
      if (callback !== undefined && typeof callback === 'function') {
        callback(data);
      }
    }
  }
  const render = (res) => {
    const mypage = 'https://order.mandarake.co.jp/order/mypage/orderHistory';
    const message = {
      ja: {
        msg1: 'お支払いできる注文が %s 件あります。',
        msg2: 'お支払いはこちらから',
      },
      en: {
        msg1: 'There are %s order(s) available for payment.',
        msg2: 'Click here to pay.',
      },
      zh: {
        msg1: '您有 %s 件未支付的订单。',
        msg2: '请点击此处付款',
      }
    }
    if (res.result === 'success' &&
        res.response.user_id !== undefined &&
        res.response.data.waitForPayment.cnt > 0
    ) {
      const langlist = ['ja','en','zh'];
      const param = new URLSearchParams(window.location.search).get('lang');
      const lang = param !== null && langlist.indexOf(param) >= 0 ? param : langlist[0];
      const el = document.createElement('div');
      el.classList.add('payment-banner');
      el.innerHTML =`
        <a href="${mypage}?lang=${lang}">
          ${message[lang].msg1.replace(/\%s/, res.response.data.waitForPayment.cnt)} 
          ${message[lang].msg2}
        </a>
        <div class="payment-banner__close"></div>
      `;
      document.body.appendChild(el);
      setTimeout(() => {
        const el = document.querySelector('.payment-banner');
        el.style.bottom = '15px';
        el.style.opacity = 1;
      }, 100);
      const close = document.querySelector('.payment-banner__close');
      close.addEventListener('click', () => {
        const el = document.querySelector('.payment-banner');
        el.style.opacity = 0;
        el.style.bottom = 0;
        setTimeout(() => {
          const el = document.querySelector('.payment-banner');
          el.parentNode.removeChild(el);
        }, 1000);
      })
    }
  }
  return {
    get: get,
    render: render,
  }
});