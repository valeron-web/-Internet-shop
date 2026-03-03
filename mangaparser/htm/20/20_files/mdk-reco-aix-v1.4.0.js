!function(e) {
    window.mdkRecommendAix = window.mdkRecommendAix || e;
}((function(){
    'use strict';
    const ep = {
        item: 'https://tools2.mandarake.co.jp/reco/aix/item/',
        cart: 'https://tools2.mandarake.co.jp/reco/aix/cart/',
        list: 'https://tools2.mandarake.co.jp/reco/aix/list/',
        top:  'https://tools2.mandarake.co.jp/reco/aix/top/'
    },
    addSendTrackingEvent = function(elms) {
        if (elms === null || elms === undefined || typeof elms != 'object' || elms.length == 0) {
            return false;
        }
        for (var i = 0, l = elms.length; i < l; i++) {
            elms[i].addEventListener('click', function(){
                if (this.dataset.index == undefined || this.dataset.index == '' || !this.dataset.index.match(/^\d{10}$/)) {
                    return false;
                }
                var xhr = new XMLHttpRequest();
                xhr.open('post', ep.cart);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.withCredentials = true;
                xhr.send('idx=' + this.dataset.index);
            });
        }
    },
    sendTracking = function(idx) {
        if (idx === null || idx === undefined || typeof idx != 'string' || !idx.match(/^\d{10}$/)) {
            return false;
        }
        var xhr = new XMLHttpRequest();
        xhr.open('post', ep.cart);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.withCredentials = true;
        xhr.send('idx=' + idx);
    },
    getRecommend = function(url, parameters, callback) {
        try {
            if (parameters === null || parameters === undefined || typeof parameters != 'object') {
                throw 'Parameters is invalid.';
            }
            var xhr = new XMLHttpRequest(), p = [], res;
            for (var key in parameters) {p.push(key + '=' + parameters[key])};
            xhr.addEventListener('readystatechange', function(){
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        res = typeof xhr.response === 'string' ? JSON.parse(xhr.response) : xhr.response;
                        if (callback !== undefined && typeof callback === 'function') {
                            Function('"use strict";return(function(a){return ' + callback + '(a);});')()(res);
                        }
                    }
                    else {
                        throw 'Failed to request for recommend.';
                    }
                }
            });
            xhr.open('post', url);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.withCredentials = true;
            xhr.responseType = 'json';
            xhr.send(p.join('&'));
        }
        catch (e) {
            console.log(e);
        }
    },
    dispatchWindowmoveEvent = function() {
        var event = new CustomEvent('windowmove');
        window.addEventListener('load', function(){
            this.dispatchEvent(event);
        });
        window.addEventListener('scroll', function(){
            this.dispatchEvent(event);
        });
        window.addEventListener('resize', function(){
            this.dispatchEvent(event);
        });
    };
    return {
        recommend: {
            item: function(args) {
                try {
                    var idx='', lang='', lazytarget='', uselazy=false, callback=null, cat='', scd='', adult=true;
                    if (args !== undefined) {
                        idx = args.idx !== undefined ? args.idx : idx;
                        cat = args.cat !== undefined ? args.cat : cat;
                        scd = args.scd !== undefined ? args.scd : scd;
                        lang = args.lang !== undefined ? args.lang : lang;
                        adult = args.adult !== undefined && args.adult == false ? false : true;
                        callback = args.callback !== undefined ? args.callback : callback;
                        if (args.lazy !== undefined) {
                            uselazy = args.lazy.use !== undefined && args.lazy.use == true ? true : false;
                            lazytarget = args.lazy.target !== undefined ? args.lazy.target : lazytarget;
                        }
                    }
                    if (idx == '' || !idx.match(/^\d{10}$/)) {
                      throw 'Parameter idx is invalid.';
                    }
                    if (cat == '' || !cat.match(/^\d+$/)) {
                      throw 'Parameter cat is invalid.';
                    }
                    if (scd == '' || !scd.match(/^\d+$/)) {
                      throw 'Parameter scd is invalid.';
                    }
                    if (uselazy) {
                        var lazyEventControler = function() {
                            var rect = document.querySelector(lazytarget).getBoundingClientRect();
                            if (window.innerHeight >= rect.top) {
                                window.removeEventListener('windowmove', lazyEventControler);
                                getRecommend(ep.item, {idx: idx,lang: lang, cat: cat, scd: scd, adult: adult}, callback);
                            }
                        };
                        if (document.querySelector(lazytarget) != null) {
                            dispatchWindowmoveEvent();
                            window.addEventListener('windowmove', lazyEventControler);
                        }
                    }
                    else {
                        getRecommend(ep.item, {idx: idx,lang: lang, cat: cat, scd: scd, adult: adult}, callback);
                    }
                }
                catch (e) {
                    console.log(e);
                }
            },
            list: function(args) {
                var category='', adult=true, lang='', lazytarget='', uselazy=false, callback=null;
                if (args !== undefined) {
                    category = args.category !== undefined ? args.category : category;
                    adult = args.adult !== undefined && args.adult == false ? false : true;
                    lang = args.lang !== undefined ? args.lang : lang;
                    callback = args.callback !== undefined ? args.callback : callback;
                    if (args.lazy !== undefined) {
                        uselazy = args.lazy.use !== undefined && args.lazy.use == true ? true : false;
                        lazytarget = args.lazy.target !== undefined ? args.lazy.target : lazytarget;
                    }
                }
                if (uselazy) {
                    var lazyEventControler = function() {
                        var rect = document.querySelector(lazytarget).getBoundingClientRect();
                        if (window.innerHeight >= rect.top) {
                            window.removeEventListener('windowmove', lazyEventControler);
                            getRecommend(ep.list, {category: category,adult: adult,lang: lang}, callback);
                        }
                    };
                    if (document.querySelector(lazytarget) != null) {
                        dispatchWindowmoveEvent();
                        window.addEventListener('windowmove', lazyEventControler);
                    }
                }
                else {
                    getRecommend(ep.list, {category: category,adult: adult,lang: lang}, callback);
                }
            },
            top: function(args) {
              var category='', adult=true, lang='', lazytarget='', uselazy=false, callback=null;
              if (args !== undefined) {
                category = args.category !== undefined ? args.category : category;
                adult = args.adult !== undefined && args.adult == false ? false : true;
                lang = args.lang !== undefined ? args.lang : lang;
                callback = args.callback !== undefined ? args.callback : callback;
                if (args.lazy !== undefined) {
                  uselazy = args.lazy.use !== undefined && args.lazy.use == true ? true : false;
                  lazytarget = args.lazy.target !== undefined ? args.lazy.target : lazytarget;
                }
              }
              if (uselazy) {
                var lazyEventControler = function() {
                  var rect = document.querySelector(lazytarget).getBoundingClientRect();
                  if (window.innerHeight >= rect.top) {
                    window.removeEventListener('windowmove', lazyEventControler);
                    getRecommend(ep.top, {category: category,adult: adult,lang: lang}, callback);
                  }
                };
                if (document.querySelector(lazytarget) != null) {
                  dispatchWindowmoveEvent();
                  window.addEventListener('windowmove', lazyEventControler);
                }
              }
              else {
                getRecommend(ep.top, {category: category, adult: adult, lang: lang}, callback);
              }
            }
        },
        tracking: function(args) {
            var idx = args !== undefined && args.idx !== undefined ? args.idx : '';
            try {
                if (idx == '' || !idx.match(/^\d{10}$/)) {
                    throw 'Tracking idx is invalid.';
                }
                sendTracking(idx);
            }
            catch (e) {
                console.log(e);
            }
        },
        addTrackingEvent: function(args) {
            var elms = args.target !== undefined ? d.querySelectorAll(args.target) : null;
            try {
                if (elms === null || elms.length == 0) {
                    throw 'There is nothing to tracking.';
                }
                addSendTrackingEvent(elms);
            }
            catch (e) {
                console.log(e);
            }
        },
        render: {
            default: function(args) {
              const getPagePath = () => {
                if (/^ec\.mandarake\.co\.jp$/.test(window.location.hostname)) {
                  return 'https://ec.mandarake.co.jp/order/detailPage/item';
                } else if (/^order\.mandarake\.co\.jp$/.test(window.location.hostname) && /^\/app\//.test(window.location.pathname)) {
                  return 'https://order.mandarake.co.jp/app/detailPage/item';
                } else {
                  return 'https://order.mandarake.co.jp/order/detailPage/item';
                }
              }
                var placeholder = null, lang = 'ja', items = null, device = 0,
                    base_classname = 'mdk-recommend',
                    // detail_page_path = /^order\.mandarake\.co\.jp$/.test(window.location.hostname) && /^\/app\//.test(window.location.pathname) ? 'https://order.mandarake.co.jp/app/detailPage/item' : 'https://order.mandarake.co.jp/order/detailPage/item',
                    price_suffix = {ja: '円', en: ' yen', zh: '日元'};
                const detail_page_path = getPagePath();
                try {
                    if (args !== undefined) {
                        placeholder = args.placeholder !== undefined ? document.querySelector(args.placeholder) : null;
                        lang = args.lang !== undefined && ['ja','en','zh'].indexOf(args.lang) > 0 ? args.lang : lang;
                        items = args.items !== undefined ? args.items : null;
                    }
                    var _search_ary = (window.location.search).replace(/^\?/, '').split('&');
                    for (var i=0,l=_search_ary.length; i<l; i++) {
                        if (_search_ary[i].split('=')[0] == 'deviceId' && _search_ary[i].split('=')[1] == '1') {
                            device = '1';
                        }
                    }
                    if (placeholder == null) {
                        throw 'Cannot rendering.';
                    }
                    if (items === null || items.length == 0) {
                        throw 'Response is nothing.';
                    }
                    var container = document.createElement('div'),
                        frg = document.createDocumentFragment();
                    container.classList.add(base_classname + '-container');
                    for (var i=0,l=items.length; i<l; i++) {
                        var item = items[i],
                            box = document.createElement('div'),
                            anc = document.createElement('a'),
                            fig = document.createElement('figure'),
                            title = document.createElement('p'),
                            price = document.createElement('p'),
                            img = new Image();
                        box.classList.add(base_classname + '-item');
                        fig.classList.add(base_classname + '-img');
                        title.classList.add(base_classname + '-title');
                        price.classList.add(base_classname + '-price');
                        img.src = item.img_url;
                        img.setAttribute('loading', 'lazy');
                        anc.href = detail_page_path + '?itemCode=' + item.id + '&reco=2' + (lang == 'ja' ? '' : '&lang=' + lang) + (device == '1' ? '&deviceId=1' : '');
                        anc.setAttribute('data-ct_url', item.ct_url);
                        title.textContent = lang == 'ja' ? item.title : item.title_en;
                        price.textContent = new Intl.NumberFormat().format(parseInt(item.price1)) + price_suffix[lang];
                        if (lang == 'ja') {
                            price.textContent = new Intl.NumberFormat().format(parseInt(item.price1_with_tax)) + price_suffix[lang];
                        }
                        else {
                            price.textContent = new Intl.NumberFormat().format(parseInt(item.price1)) + price_suffix[lang];
                        }
                        fig.appendChild(img);
                        anc.appendChild(fig);
                        anc.appendChild(title);
                        anc.appendChild(price);
                        box.appendChild(anc);
                        frg.appendChild(box);
                        anc.addEventListener('click', function(e){
                            e.preventDefault();
                            var xhr = new XMLHttpRequest();
                            xhr.open('get', this.dataset.ct_url);
                            xhr.addEventListener('readystatechange', function(){
                                if (xhr.readyState >= 3) {
                                    window.location = this.href;
                                }
                            }.bind(this));
                            xhr.send(null);
                        });
                    }
                    container.appendChild(frg);
                    placeholder.parentNode.insertBefore(container, placeholder.nextSibling);
                    placeholder.parentNode.removeChild(placeholder);
                }
                catch (e) {
                    console.log(e);
                    return false;
                }
            }
        }
    }
}));