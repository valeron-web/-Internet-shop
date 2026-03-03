$(document).ready(function () {
  $(".adult_link").colorbox({
    inline: true,
    initialWidth: "200",
    initialHeight: "200",
    width: "500",
  });
  $(".adult_link").click(function () {
    const dec = document.querySelector('#over18Declaration');
    if (dec != null) {
      dec.dataset.itemCode = this.id;
    }
    var form = document.getElementById("confirm_adult_form");
    form.itemCode.value = this.id;
  });
  $(".adult_close").click(function () {
    $("#cboxContent").colorbox.close();
    return false;
  });
});
function confirm_adult_form_submit() {
  $("#doAdultConfirm").click();
}
window.onbeforeunload = () => {}; // bfcache無効
window.onunload = () => {}; // bfcache無効
window.addEventListener('pageshow', (e) => { // bfcache無効 safari対策
  if (e.persisted) {
    const observer = new IntersectionObserver((entries) => {
      for(const e of entries) {
        console.log(e.isIntersecting);
        if (e.isIntersecting) {
          window.location.reload();
        }
      }
    });
    observer.observe(document.getElementById('adult_confirm'))
  }
});
(() => {
  const dec = document.querySelector('#over18Declaration');
  if (dec != null) {
    dec.addEventListener('click', (e) => {
      e.preventDefault();
      const base = new URL(e.target.baseURI);
      const url = new URL(`${base.protocol}//${base.host}${e.target.dataset.url}`);
      const params = url.searchParams;
      params.append('itemCode', e.target.dataset.itemCode);
      document.cookie = 'adult_confirm=1; domain=.mandarake.co.jp; path=/; secure;';
      window.location.href = `${url.pathname}?` + params.toString();
    })
  }
  const cookie = document.cookie;
  let cookies = {};
  if (!!cookie) {
    cookie.split(';').forEach(arr => {
      const a = arr.split('=').map(b => {return b.trim()});
      const key = a[0];
      const val = a[1];
      cookies[key] = val;
    })
  }
  if (!(cookies.hasOwnProperty('adult_confirm') && cookies.adult_confirm == 1)) {
    const elms = document.querySelectorAll('.adultItem');
    if (elms.length > 0) {
      for (const el of elms) {
        const idx = el.dataset.itemidx;
        let elThum = el.querySelector('.thum');
        if (elThum != null) {
          let elThumTagsA = elThum.getElementsByTagName('a');
          if (elThumTagsA.length > 0) {
            for (let tag of elThumTagsA) {
              tag.href = '#adult_confirm';
              tag.classList.add('adult_link');
              tag.setAttribute('id', idx);
            }
          }
          let newEl = document.createElement('div');
          newEl.classList.add('r18mark');
          newEl.innerHTML = `
            <a href="#adult_confirm" class="adult_link" id="${idx}">
              <img src="/content/img/item_list/r18.png"/>
            </a>
          `;
          elThum.insertBefore(newEl, elThum.firstChild);
        }
        let elTitle = el.querySelector('.title');
        if (elTitle != null) {
          let elTitleTagsA = elTitle.getElementsByTagName('a');
          if (elTitleTagsA.length > 0) {
            for (let tag of elTitleTagsA) {
              tag.href = '#adult_confirm';
              tag.classList.add('adult_link');
              tag.setAttribute('id', idx);
            }
          }
        }
        let elRange = el.querySelector('.price_range');
        if (elRange != null) {
          let elRangeTagsA = elRange.getElementsByTagName('a');
          if (elRangeTagsA.length > 0) {
            for (let tag of elRangeTagsA) {
              tag.href = '#adult_confirm';
              tag.classList.add('adult_link');
              tag.setAttribute('id', idx);
            }
          }
        }
      }
    }
  }
})();