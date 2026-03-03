!function(w,d){
    var xhr, CONST = {
        EP: 'https://my.mandarake.co.jp/customer/ajax/my/'
    }
    mdkLoginStatus = {

        container: '',
        option: {
            lang: 'ja',
            device: 0,
            referer: encodeURIComponent(w.location.href)
        },
        init: function(con, args) {
            this.container = con;
            this.option.lang = args.lang !== undefined ? args.lang : this.option.lang;
            this.option.device = args.device !== undefined ? args.device : this.option.device;
        },
        renderer: function() {
            var ary = [];
            for (var key in this.option) {
                ary.push(key + '=' + this.option[key]);
            }
            xhr.send(ary.join('&'));
        }

    }
    if (w.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }
    else if (w.ActiveXObject) {
        try {
            xhr = new ActiveXObject('Msxml2.XMLHTTP');
        }
        catch(e) {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
    }
    xhr.open('POST', CONST.EP);
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function(){
        if (xhr.readyState === 4) {

            var el = d.querySelector(mdkLoginStatus.container);
            if (xhr.status === 200) {
                el.innerHTML = xhr.response;
            }
            else {
                el.innerHTML = 'an error occured... please refresh this page.';
            }

        }
    });
}(window, document);