!function(e){
    mdkCookieHandler = e;
}((function(){
    'use strict';
    const COOKIENAME = {
        location: 'mandarake_url'
    };
    var w = window, d = document;
    return {
        setCookie: function() {
            d.cookie = COOKIENAME.location + '=' + w.location.pathname + w.location.search
                     + ';path=/;domain=.mandarake.co.jp';
        }
    }
}));