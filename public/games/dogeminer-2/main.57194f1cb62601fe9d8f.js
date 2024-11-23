!function(e) {
    var t = {};
    function n(o) {
        if (t[o])
            return t[o].exports;
        var i = t[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return e[o].call(i.exports, i, i.exports, n),
        i.l = !0,
        i.exports
    }
    n.m = e,
    n.c = t,
    n.d = function(e, t, o) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: o
        })
    }
    ,
    n.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    n.t = function(e, t) {
        if (1 & t && (e = n(e)),
        8 & t)
            return e;
        if (4 & t && "object" == typeof e && e && e.__esModule)
            return e;
        var o = Object.create(null);
        if (n.r(o),
        Object.defineProperty(o, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var i in e)
                n.d(o, i, function(t) {
                    return e[t]
                }
                .bind(null, i));
        return o
    }
    ,
    n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return n.d(t, "a", t),
        t
    }
    ,
    n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    n.p = "/",
    n(n.s = 1)
}([function(e, t, n) {
    (function(n) {
        var o, i, a;
        i = [],
        void 0 === (a = "function" == typeof (o = function() {
            "use strict";
            function t(e, t, n) {
                var o = new XMLHttpRequest;
                o.open("GET", e),
                o.responseType = "blob",
                o.onload = function() {
                    r(o.response, t, n)
                }
                ,
                o.onerror = function() {
                    console.error("could not download file")
                }
                ,
                o.send()
            }
            function o(e) {
                var t = new XMLHttpRequest;
                t.open("HEAD", e, !1);
                try {
                    t.send()
                } catch (e) {}
                return 200 <= t.status && 299 >= t.status
            }
            function i(e) {
                try {
                    e.dispatchEvent(new MouseEvent("click"))
                } catch (n) {
                    var t = document.createEvent("MouseEvents");
                    t.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null),
                    e.dispatchEvent(t)
                }
            }
            var a = "object" == typeof window && window.window === window ? window : "object" == typeof self && self.self === self ? self : "object" == typeof n && n.global === n ? n : void 0
              , r = a.saveAs || ("object" != typeof window || window !== a ? function() {}
            : "download"in HTMLAnchorElement.prototype ? function(e, n, r) {
                var s = a.URL || a.webkitURL
                  , l = document.createElement("a");
                n = n || e.name || "download",
                l.download = n,
                l.rel = "noopener",
                "string" == typeof e ? (l.href = e,
                l.origin === location.origin ? i(l) : o(l.href) ? t(e, n, r) : i(l, l.target = "_blank")) : (l.href = s.createObjectURL(e),
                setTimeout((function() {
                    s.revokeObjectURL(l.href)
                }
                ), 4e4),
                setTimeout((function() {
                    i(l)
                }
                ), 0))
            }
            : "msSaveOrOpenBlob"in navigator ? function(e, n, a) {
                if (n = n || e.name || "download",
                "string" != typeof e)
                    navigator.msSaveOrOpenBlob(function(e, t) {
                        return void 0 === t ? t = {
                            autoBom: !1
                        } : "object" != typeof t && (console.warn("Deprecated: Expected third argument to be a object"),
                        t = {
                            autoBom: !t
                        }),
                        t.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob(["\ufeff", e],{
                            type: e.type
                        }) : e
                    }(e, a), n);
                else if (o(e))
                    t(e, n, a);
                else {
                    var r = document.createElement("a");
                    r.href = e,
                    r.target = "_blank",
                    setTimeout((function() {
                        i(r)
                    }
                    ))
                }
            }
            : function(e, n, o, i) {
                if ((i = i || open("", "_blank")) && (i.document.title = i.document.body.innerText = "downloading..."),
                "string" == typeof e)
                    return t(e, n, o);
                var r = "application/octet-stream" === e.type
                  , s = /constructor/i.test(a.HTMLElement) || a.safari
                  , l = /CriOS\/[\d]+/.test(navigator.userAgent);
                if ((l || r && s) && "object" == typeof FileReader) {
                    var d = new FileReader;
                    d.onloadend = function() {
                        var e = d.result;
                        e = l ? e : e.replace(/^data:[^;]*;/, "data:attachment/file;"),
                        i ? i.location.href = e : location = e,
                        i = null
                    }
                    ,
                    d.readAsDataURL(e)
                } else {
                    var c = a.URL || a.webkitURL
                      , p = c.createObjectURL(e);
                    i ? i.location = p : location.href = p,
                    i = null,
                    setTimeout((function() {
                        c.revokeObjectURL(p)
                    }
                    ), 4e4)
                }
            }
            );
            a.saveAs = r.saveAs = r,
            e.exports = r
        }
        ) ? o.apply(t, i) : o) || (e.exports = a)
    }
    ).call(this, n(3))
}
, function(e, t, n) {
    "use strict";
    n.r(t);
    n(2);
    var o, i, a, r, s, l, d, c = n(0);
    function p(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n,
        e
    }
    function f(e, t, n, o, i, a, r) {
        try {
            var s = e[a](r)
              , l = s.value
        } catch (e) {
            return void n(e)
        }
        s.done ? t(l) : Promise.resolve(l).then(o, i)
    }
    n(4);
    function m() {}
    window.noop = m;
    var x, b = !1, g = !1, u = !1, w = !1, h = !1;
    function k() {
        u && z(),
        w && v()
    }
    function y() {
        requestAnimationFrame((function() {
            w = !0;
            var e = document.getElementById("cookies-long");
            document.getElementById("landing-box").setAttribute("style", "display:none;"),
            e.removeAttribute("style"),
            window.scrollTo(0, 0),
            history.pushState({
                page: "cookies",
                from: "home"
            }, "Dogeminer2.com - Privacy Policy & Cookie Info")
        }
        ))
    }
    function v() {
        requestAnimationFrame((function() {
            w = !1;
            var e = document.getElementById("cookies-long")
              , t = document.getElementById("landing-box");
            e.setAttribute("style", "display:none;"),
            t.removeAttribute("style"),
            window.scrollTo(0, 0),
            history.pushState({
                page: "home",
                from: "cookies"
            }, document.title)
        }
        ))
    }
    function _() {
        h || (h = !0,
        i = window.FileReader,
        a = !1,
        r = "self.addEventListener('message', function(e) { var data=e.data; try { var reader = new FileReaderSync; postMessage({ result: reader[data.readAs](data.file), extra: data.extra, file: data.file})} catch(e){ postMessage({ result:'error', extra:data.extra, file:data.file}); } }, false);",
        s = "onmessage = function(e) { postMessage(!!FileReaderSync); };",
        l = ["loadstart", "progress", "load", "abort", "error", "loadend"],
        d = !1,
        o = window.FileReaderJS = {
            enabled: !1,
            setupInput: D,
            setupDrop: m,
            setupClipboard: m,
            setSync: function(e) {
                var t;
                (d = e) && !a && (t = C(s)) && (t.onmessage = function(e) {
                    a = e.data
                }
                ,
                t.postMessage({}))
            },
            getSync: function() {
                return d && a
            },
            output: [],
            opts: {
                dragClass: "drag",
                accept: !1,
                readAsDefault: "DataURL",
                readAsMap: {},
                on: {
                    loadstart: m,
                    progress: m,
                    load: m,
                    abort: m,
                    error: m,
                    loadend: m,
                    skip: m,
                    groupstart: m,
                    groupend: m,
                    beforestart: m
                }
            }
        },
        setTimeout((function() {
            var e, t, n;
            o.enabled = !0,
            t = "",
            n = {
                readAsMap: {
                    "text/*": "Text"
                },
                readAsDefault: "Text",
                on: (e = {
                    beforestart: function(e, t) {},
                    loadstart: function(e, t) {},
                    progress: function(e, t) {},
                    load: function(e, t) {}
                },
                p(e, "load", (function(e, n) {
                    t = e.target.result
                }
                )),
                p(e, "error", (function(e, t) {
                    alert("Could not load file")
                }
                )),
                p(e, "loadend", (function(e, n) {
                    G(t),
                    z()
                }
                )),
                p(e, "abort", (function(e, t) {}
                )),
                p(e, "skip", (function(e, t) {}
                )),
                p(e, "groupstart", (function(e) {}
                )),
                p(e, "groupend", (function(e) {}
                )),
                e)
            },
            o.setupInput(document.getElementById("loadbutton"), n)
        }
        ), 150)),
        requestAnimationFrame((function() {
            u = !0;
            var e = document.getElementById("savegames");
            document.getElementById("landing-box").setAttribute("style", "display:none;"),
            e.removeAttribute("style"),
            history.pushState({
                page: "saves",
                from: "home"
            }, "Dogeminer2.com - Download/Upload Saves"),
            window.scrollTo(0, 0)
        }
        ))
    }
    function z() {
        requestAnimationFrame((function() {
            u = !1;
            var e = document.getElementById("savegames")
              , t = document.getElementById("landing-box");
            e.setAttribute("style", "display:none;"),
            t.removeAttribute("style"),
            window.scrollTo(0, 0),
            history.pushState({
                page: "home",
                from: "saves"
            }, document.title)
        }
        ))
    }
    null !== (x = new URLSearchParams(document.location.search).get("portal")) && "cg" == x && sessionStorage.setItem("portal", "cg"),
    window.addEventListener("popstate", (function(e) {
        if (e && e.state && e.state.page) {
            var t = e.state.page;
            "home" === t ? (e.state.from ? "saves" === e.state.from ? z() : "cookies" === e.state.from && v() : k(),
            "saves" === t ? _() : "cookies" === t ? y() : k()) : "saves" === t ? _() : "cookies" === t ? y() : k()
        }
    }
    )),
    history.replaceState({
        page: "home"
    }, document.title, document.location.href),
    window.location.hostname.toLowerCase().indexOf("test.dogeminer2.com") > -1 ? (window.enableCloudSaves = !1,
    requestAnimationFrame((function() {
        document.getElementById("cloudsavebox").innerHTML = "No cloud saves on test server, sorry!",
        document.getElementById("saveheader").innerHTML = "The test server does not allow for downloading saves, only uploading. Do not attempt to upload anything but a downloaded save, unless you intend to reset or break your game."
    }
    ))) : window.enableCloudSaves = !0,
    sessionStorage.setItem("dogeminerlanding", "yupyupyup");
    var E = !1;
    function j() {
        if (!E) {
            if (E = !0,
            0 !== Y()) {
                var e = Y();
                "xmas" === e && (t = document.getElementById("extraextra"),
                requestAnimationFrame((function() {
                    t.innerHTML = "<style>.snowflake {color: #fff;font-size: 2em;font-family: 'DogeSans',Arial !important;text-shadow: 0 0 1px #000;}@-webkit-keyframes snowflakes-fall{0%{top:-10%}100%{top:100%}}@-webkit-keyframes snowflakes-shake{0%{-webkit-transform:translateX(0px);transform:translateX(0px)}50%{-webkit-transform:translateX(80px);transform:translateX(80px)}100%{-webkit-transform:translateX(0px);transform:translateX(0px)}}@keyframes snowflakes-fall{0%{top:-10%}100%{top:100%}}@keyframes snowflakes-shake{0%{transform:translateX(0px)}50%{transform:translateX(80px)}100%{transform:translateX(0px)}}.snowflake{position:fixed;top:-10%;z-index:9999;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default;-webkit-animation-name:snowflakes-fall,snowflakes-shake;-webkit-animation-duration:10s,3s;-webkit-animation-timing-function:linear,ease-in-out;-webkit-animation-iteration-count:infinite,infinite;-webkit-animation-play-state:running,running;animation-name:snowflakes-fall,snowflakes-shake;animation-duration:10s,3s;animation-timing-function:linear,ease-in-out;animation-iteration-count:infinite,infinite;animation-play-state:running,running}.snowflake:nth-of-type(0){left:1%;-webkit-animation-delay:0s,0s;animation-delay:0s,0s}.snowflake:nth-of-type(1){left:10%;-webkit-animation-delay:1s,1s;animation-delay:1s,1s}.snowflake:nth-of-type(2){left:20%;-webkit-animation-delay:6s,.5s;animation-delay:6s,.5s}.snowflake:nth-of-type(3){left:30%;-webkit-animation-delay:4s,2s;animation-delay:4s,2s}.snowflake:nth-of-type(4){left:40%;-webkit-animation-delay:2s,2s;animation-delay:2s,2s}.snowflake:nth-of-type(5){left:50%;-webkit-animation-delay:8s,3s;animation-delay:8s,3s}.snowflake:nth-of-type(6){left:60%;-webkit-animation-delay:6s,2s;animation-delay:6s,2s}.snowflake:nth-of-type(7){left:70%;-webkit-animation-delay:2.5s,1s;animation-delay:2.5s,1s}.snowflake:nth-of-type(8){left:80%;-webkit-animation-delay:1s,0s;animation-delay:1s,0s}.snowflake:nth-of-type(9){left:90%;-webkit-animation-delay:3s,1.5s;animation-delay:3s,1.5s}</style>",
                    requestAnimationFrame((function() {
                        t.innerHTML += '<div class="snowflakes" aria-hidden="true"><div class="snowflake">*</div><div class="snowflake">*</div><div class="snowflake">*</div><div class="snowflake">*</div><div class="snowflake">*</div><div class="snowflake">*</div><div class="snowflake">*</div><div class="snowflake">*</div><div class="snowflake">*</div><div class="snowflake">*</div></div>'
                    }
                    ))
                }
                )),
                requestAnimationFrame((function() {
                    document.getElementById("playBtn").innerHTML += '<style>#hat {height:177px;width:164px;position:absolute;top:-71px;right:-61px;pointer-events:none;}</style><img id="hat" class="animated fadeIn" src="play/img/santahat.png" alt="Santa Hat"/>'
                }
                )))
            }
            requestAnimationFrame((function() {
                b ? setTimeout((function() {
                    y()
                }
                ), 550) : g && setTimeout((function() {
                    _()
                }
                ), 550)
            }
            )),
            function() {
                var e = window.location.hostname.toLowerCase();
                e.toLowerCase().indexOf("test.dogeminer2.com") > -1 ? (window.dogehosted = !1,
                window.enableCloudSaves = !1) : e.toLowerCase().indexOf("dogeminer2.com") > -1 ? (window.dogehosted = !1,
                window.enableCloudSaves = !0) : (window.enableCloudSaves = !0,
                window.dogehosted = !0,
                console.log("%c This game is hosted from", 'background: #fff9ce; color: #673f07;font-size: 150%;font-family:  "DogeSans", "Comic Sans MS", sans-serif;'),
                console.log("%c https://dogeminer2.com", 'background: #fff9ce; color: #673f07;font-size: 150%;font-family:  "DogeSans", "Comic Sans MS", sans-serif;'),
                console.log("%c Please visit the above URL to play without iframes and whatnot.", 'background: #fff9ce; color: #673f07;font-size: 150%;font-family:  "DogeSans", "Comic Sans MS", sans-serif;'));
                var t = window.location.hash;
                t.indexOf("#privacy") > -1 ? b = !0 : t.indexOf("#saves") > -1 && (g = !0)
            }(),
            window.hideCookies = v,
            window.showCookies = y,
            window.hideSaveLoad = z,
            window.showSaveLoad = _,
            requestAnimationFrame((function() {
                !function(e, t, n, o) {
                    e.addEventListener("click", (function() {
                        v()
                    }
                    )),
                    t.addEventListener("click", (function() {
                        y()
                    }
                    )),
                    n.addEventListener("click", (function() {
                        _()
                    }
                    )),
                    o.addEventListener("click", (function() {
                        z()
                    }
                    ))
                }(document.getElementById("hide-cookie-info"), document.getElementById("show-cookie-info"), document.getElementById("open-saves"), document.getElementById("hide-savegames"))
            }
            )),
            setTimeout((function() {
                if (!window.hasSignedIn) {
                    var e = document.getElementById("googlebtn");
                    requestAnimationFrame((function() {
                        null != e && e.setAttribute("class", "g-signin2 animatedslow shake")
                    }
                    ))
                }
            }
            ), 1e4)
        }
        var t
    }
    var L = !1
      , S = document.getElementById("playBtn");
    function I(e) {
        if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream && window.navigator.standalone && (e.preventDefault(),
        !L)) {
            var t = window.location.hash;
            window.location.href = "/play/" + t
        }
        var n = document.getElementById("start-text")
          , o = document.getElementById("loading-indicator");
        requestAnimationFrame((function() {
            L || (S.className += " forced-active",
            n.className += " animated fadeOut",
            o.removeAttribute("style"),
            L = !0)
        }
        ))
    }
    S.addEventListener("click", (function(e) {
        I(e)
    }
    ), !1),
    S.addEventListener("touchend", (function(e) {
        I(e)
    }
    ), !1),
    document.getElementById("savebutton").addEventListener("click", (function() {
        O()
    }
    ), !1);
    var A = function() {
        var e, t = (e = regeneratorRuntime.mark((function e() {
            var t, n, o, i = arguments;
            return regeneratorRuntime.wrap((function(e) {
                for (; ; )
                    switch (e.prev = e.next) {
                    case 0:
                        return t = i.length > 0 && void 0 !== i[0] ? i[0] : 1,
                        n = [],
                        e.next = 4,
                        fetch("feed.xml").then((function(e) {
                            return e.text()
                        }
                        ));
                    case 4:
                        return o = e.sent,
                        T(o).querySelectorAll("item").forEach((function(e, o) {
                            o >= t || n.push({
                                title: e.getElementsByTagName("title")[0].textContent,
                                link: e.getElementsByTagName("link")[0].textContent
                            })
                        }
                        )),
                        e.abrupt("return", n);
                    case 8:
                    case "end":
                        return e.stop()
                    }
            }
            ), e)
        }
        )),
        function() {
            var t = this
              , n = arguments;
            return new Promise((function(o, i) {
                var a = e.apply(t, n);
                function r(e) {
                    f(a, o, i, r, s, "next", e)
                }
                function s(e) {
                    f(a, o, i, r, s, "throw", e)
                }
                r(void 0)
            }
            ))
        }
        );
        return function() {
            return t.apply(this, arguments)
        }
    }()
      , T = function(e) {
        return (new DOMParser).parseFromString(e, "text/xml")
    };
    A().then((function(e) {
        return function(e) {
            for (var t = 0; t < e.length; t++) {
                var n = e[t].title || ""
                  , o = e[t].link || ""
                  , i = "";
                n.length > 30 && (i = "...");
                var a = n.substring(0, 40) + i
                  , r = document.createElement("li")
                  , s = document.createElement("a");
                s.setAttribute("href", o),
                s.setAttribute("title", n),
                s.setAttribute("target", "_blank"),
                s.setAttribute("class", "blue-link"),
                s.setAttribute("rel", "noopener"),
                s.innerHTML = a,
                r.appendChild(s),
                document.getElementById("postlist").appendChild(r)
            }
        }(e)
    }
    ));
    function O() {
        try {
            new Blob
        } catch (e) {
            console.log("File saving is not supported on this browser"),
            alert("File saving is not supported on this browser :("),
            !1
        }
        if ("undefined" != typeof Storage) {
            var e;
            if (null == (e = window.location.hostname.toLowerCase().indexOf("test.dogeminer2.com") > -1 ? localStorage.getItem("dogeTEST1NG") : localStorage.getItem("dogeminer2020")))
                return B(),
                !1;
            var t = new Blob([e],{
                type: "text/plain;charset=UTF-8"
            })
              , n = Date.now()
              , o = new Intl.DateTimeFormat("en",{
                year: "numeric"
            }).format(n)
              , i = new Intl.DateTimeFormat("en",{
                month: "short"
            }).format(n)
              , a = new Intl.DateTimeFormat("en",{
                day: "2-digit"
            }).format(n)
              , r = "".concat(a, "-").concat(i, "-").concat(o)
              , s = (n += "").slice(n.length - 4)
              , l = window.location.hostname.toLowerCase();
            (-1 === l.indexOf("test.dogeminer2.com") || l.indexOf("127.0.0.1") > -1) && Object(c.saveAs)(t, "dogeminer2-SAVE".concat(s, "-").concat(r, ".DOGE"))
        } else
            B()
    }
    function M() {
        alert("The test server does not allow save downloads, sorry. Uploading is allowed! Uploading anything but a downloaded save will break and reset the game (if you're lucky).")
    }
    function B() {
        alert("Something went wrong. Your browser is in incognito, does not have a save, or does not support file saving. Or this is the test server (no downloads) Sorry. (Try logging in with another browser, Chrome usually works)")
    }
    function C(e) {
        var t = window.URL || window.webkitURL
          , n = window.Blob
          , o = window.Worker;
        if (!(t && n && o && e))
            return null;
        var i = new n([e]);
        return new o(t.createObjectURL(i))
    }
    function D(e, t) {
        if (o.enabled) {
            var n = U(U({}, o.opts), t);
            e.addEventListener("change", (function(t) {
                F(t, e.files, n)
            }
            ), !1),
            e.addEventListener("drop", (function(e) {
                e.stopPropagation(),
                e.preventDefault(),
                F(e, e.dataTransfer.files, n)
            }
            ), !1)
        }
    }
    function F(e, t, n) {
        var s, c = t.length, f = {
            groupID: N(),
            files: t,
            started: new Date
        };
        function m() {
            f.ended = new Date,
            n.on.groupend(f)
        }
        function x() {
            0 == --c && m()
        }
        o.output.push(f),
        function(e, t) {
            for (var n = 0; n < e.length; n++) {
                var o = e[n];
                o.extra = {
                    nameNoExtension: o.name.substring(0, o.name.lastIndexOf(".")),
                    extension: o.name.substring(o.name.lastIndexOf(".") + 1),
                    fileID: n,
                    uniqueID: q(),
                    groupID: t,
                    prettySize: (i = o.size,
                    void 0,
                    a = void 0,
                    ["bytes", "kb", "MB", "GB", "TB", "PB"],
                    a = Math.floor(Math.log(i) / Math.log(1024)),
                    (i / Math.pow(1024, Math.floor(a))).toFixed(2) + " " + ["bytes", "kb", "MB", "GB", "TB", "PB"][a])
                }
            }
            var i, a
        }(t, f.groupID);
        var b, g = "";
        (n.on = (p(s = {
            beforestart: function(e, t) {},
            loadstart: function(e, t) {},
            progress: function(e, t) {},
            load: function(e, t) {}
        }, "load", (function(e, t) {
            g = e.target.result
        }
        )),
        p(s, "error", (function(e, t) {
            alert("Could not load file")
        }
        )),
        p(s, "loadend", (function(e, t) {
            G(g),
            z()
        }
        )),
        p(s, "abort", (function(e, t) {}
        )),
        p(s, "skip", (function(e, t) {}
        )),
        p(s, "groupstart", (function(e) {}
        )),
        p(s, "groupend", (function(e) {}
        )),
        s),
        t.length) ? (d && a && ((b = C(r)).onmessage = function(e) {
            var t = e.data.file
              , o = e.data.result;
            t.extra || (t.extra = e.data.extra),
            t.extra.ended = new Date,
            n.on["error" === o ? "error" : "load"]({
                target: {
                    result: o
                }
            }, t),
            x()
        }
        ),
        Array.prototype.forEach.call(t, (function(t) {
            if (t.extra.started = new Date,
            n.accept && !t.type.match(new RegExp(n.accept)))
                return n.on.skip(t),
                void x();
            if (!1 === n.on.beforestart(t))
                return n.on.skip(t),
                void x();
            var o = function(e, t, n) {
                for (var o in t)
                    if (e.match(new RegExp(o)))
                        return "readAs" + t[o];
                return "readAs" + n
            }(t.type, n.readAsMap, n.readAsDefault);
            if (b)
                b.postMessage({
                    file: t,
                    extra: t.extra,
                    readAs: o
                });
            else {
                var a = new i;
                a.originalEvent = e,
                l.forEach((function(e) {
                    a["on" + e] = function(o) {
                        "load" != e && "error" != e || (t.extra.ended = new Date),
                        n.on[e](o, t),
                        "loadend" == e && x()
                    }
                }
                )),
                a[o](t)
            }
        }
        ))) : m()
    }
    function R(e) {
        return function() {
            return e.bind(null, R(e)).apply(this, arguments)
        }
    }
    function U(e, t) {
        for (var n in t)
            t[n] && t[n].constructor && t[n].constructor === Object ? (e[n] = e[n] || {},
            R((function(e, t, n, o) {
                e(t[o], n[o])
            }
            ))) : e[n] = t[n];
        return e
    }
    window.location.hostname.toLowerCase().indexOf("test.dogeminer2.com") > -1 && (O = M);
    var P, N = (P = 0,
    function() {
        return P++
    }
    ), q = function(e) {
        return function() {
            return e++
        }
    }(0);
    function G(e) {
        window.location.hostname.toLowerCase().indexOf("test.dogeminer2.com") > -1 ? localStorage.setItem("dogeTEST1NG", e) : localStorage.setItem("dogeminer2020", e),
        alert("Uploaded save has been loaded. Let's hope it works! - If you uploaded a bad save it will be broken.");
        var t = document.getElementById("loadbutton");
        t.value = "",
        /safari/i.test(navigator.userAgent) || (t.type = "",
        t.type = "file")
    }
    var H = !1;
    function Y() {
        for (var e = [[9, "halloween"], [11, "xmas"]], t = (new Date).getMonth(), n = 0; n < e.length; n++)
            if (e[n][0] === t)
                return e[n][1];
        return 0
    }
    document.addEventListener("DOMContentLoaded", (function() {
        H || (H = !0,
        window.setTimeout((function() {
            j()
        }
        ), 1))
    }
    ), !1),
    document.addEventListener("readystatechange", (function(e) {
        var t, n, o, i;
        "complete" === e.target.readyState && (window.isMobile || (t = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
        (i = document.createElement("script")).setAttribute("src", t),
        i.setAttribute("type", "text/javascript"),
        i.setAttribute("async", "async"),
        i.setAttribute("data-ad-client", "ca-pub-3248552182676022"),
        i.onload = void 0 !== n ? n : function() {}
        ,
        i.onerror = void 0 !== o ? o : function() {}
        ,
        document.body.appendChild(i)))
    }
    ), !1),
    document.attachEvent && document.attachEvent("onreadystatechange", (function() {
        H || (H = !0,
        window.setTimeout((function() {
            j()
        }
        ), 1))
    }
    ))
}
, function(e, t, n) {
    var o = function(e) {
        "use strict";
        var t = Object.prototype
          , n = t.hasOwnProperty
          , o = "function" == typeof Symbol ? Symbol : {}
          , i = o.iterator || "@@iterator"
          , a = o.asyncIterator || "@@asyncIterator"
          , r = o.toStringTag || "@@toStringTag";
        function s(e, t, n, o) {
            var i = t && t.prototype instanceof c ? t : c
              , a = Object.create(i.prototype)
              , r = new v(o || []);
            return a._invoke = function(e, t, n) {
                var o = "suspendedStart";
                return function(i, a) {
                    if ("executing" === o)
                        throw new Error("Generator is already running");
                    if ("completed" === o) {
                        if ("throw" === i)
                            throw a;
                        return z()
                    }
                    for (n.method = i,
                    n.arg = a; ; ) {
                        var r = n.delegate;
                        if (r) {
                            var s = h(r, n);
                            if (s) {
                                if (s === d)
                                    continue;
                                return s
                            }
                        }
                        if ("next" === n.method)
                            n.sent = n._sent = n.arg;
                        else if ("throw" === n.method) {
                            if ("suspendedStart" === o)
                                throw o = "completed",
                                n.arg;
                            n.dispatchException(n.arg)
                        } else
                            "return" === n.method && n.abrupt("return", n.arg);
                        o = "executing";
                        var c = l(e, t, n);
                        if ("normal" === c.type) {
                            if (o = n.done ? "completed" : "suspendedYield",
                            c.arg === d)
                                continue;
                            return {
                                value: c.arg,
                                done: n.done
                            }
                        }
                        "throw" === c.type && (o = "completed",
                        n.method = "throw",
                        n.arg = c.arg)
                    }
                }
            }(e, n, r),
            a
        }
        function l(e, t, n) {
            try {
                return {
                    type: "normal",
                    arg: e.call(t, n)
                }
            } catch (e) {
                return {
                    type: "throw",
                    arg: e
                }
            }
        }
        e.wrap = s;
        var d = {};
        function c() {}
        function p() {}
        function f() {}
        var m = {};
        m[i] = function() {
            return this
        }
        ;
        var x = Object.getPrototypeOf
          , b = x && x(x(_([])));
        b && b !== t && n.call(b, i) && (m = b);
        var g = f.prototype = c.prototype = Object.create(m);
        function u(e) {
            ["next", "throw", "return"].forEach((function(t) {
                e[t] = function(e) {
                    return this._invoke(t, e)
                }
            }
            ))
        }
        function w(e, t) {
            var o;
            this._invoke = function(i, a) {
                function r() {
                    return new t((function(o, r) {
                        !function o(i, a, r, s) {
                            var d = l(e[i], e, a);
                            if ("throw" !== d.type) {
                                var c = d.arg
                                  , p = c.value;
                                return p && "object" == typeof p && n.call(p, "__await") ? t.resolve(p.__await).then((function(e) {
                                    o("next", e, r, s)
                                }
                                ), (function(e) {
                                    o("throw", e, r, s)
                                }
                                )) : t.resolve(p).then((function(e) {
                                    c.value = e,
                                    r(c)
                                }
                                ), (function(e) {
                                    return o("throw", e, r, s)
                                }
                                ))
                            }
                            s(d.arg)
                        }(i, a, o, r)
                    }
                    ))
                }
                return o = o ? o.then(r, r) : r()
            }
        }
        function h(e, t) {
            var n = e.iterator[t.method];
            if (void 0 === n) {
                if (t.delegate = null,
                "throw" === t.method) {
                    if (e.iterator.return && (t.method = "return",
                    t.arg = void 0,
                    h(e, t),
                    "throw" === t.method))
                        return d;
                    t.method = "throw",
                    t.arg = new TypeError("The iterator does not provide a 'throw' method")
                }
                return d
            }
            var o = l(n, e.iterator, t.arg);
            if ("throw" === o.type)
                return t.method = "throw",
                t.arg = o.arg,
                t.delegate = null,
                d;
            var i = o.arg;
            return i ? i.done ? (t[e.resultName] = i.value,
            t.next = e.nextLoc,
            "return" !== t.method && (t.method = "next",
            t.arg = void 0),
            t.delegate = null,
            d) : i : (t.method = "throw",
            t.arg = new TypeError("iterator result is not an object"),
            t.delegate = null,
            d)
        }
        function k(e) {
            var t = {
                tryLoc: e[0]
            };
            1 in e && (t.catchLoc = e[1]),
            2 in e && (t.finallyLoc = e[2],
            t.afterLoc = e[3]),
            this.tryEntries.push(t)
        }
        function y(e) {
            var t = e.completion || {};
            t.type = "normal",
            delete t.arg,
            e.completion = t
        }
        function v(e) {
            this.tryEntries = [{
                tryLoc: "root"
            }],
            e.forEach(k, this),
            this.reset(!0)
        }
        function _(e) {
            if (e) {
                var t = e[i];
                if (t)
                    return t.call(e);
                if ("function" == typeof e.next)
                    return e;
                if (!isNaN(e.length)) {
                    var o = -1
                      , a = function t() {
                        for (; ++o < e.length; )
                            if (n.call(e, o))
                                return t.value = e[o],
                                t.done = !1,
                                t;
                        return t.value = void 0,
                        t.done = !0,
                        t
                    };
                    return a.next = a
                }
            }
            return {
                next: z
            }
        }
        function z() {
            return {
                value: void 0,
                done: !0
            }
        }
        return p.prototype = g.constructor = f,
        f.constructor = p,
        f[r] = p.displayName = "GeneratorFunction",
        e.isGeneratorFunction = function(e) {
            var t = "function" == typeof e && e.constructor;
            return !!t && (t === p || "GeneratorFunction" === (t.displayName || t.name))
        }
        ,
        e.mark = function(e) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(e, f) : (e.__proto__ = f,
            r in e || (e[r] = "GeneratorFunction")),
            e.prototype = Object.create(g),
            e
        }
        ,
        e.awrap = function(e) {
            return {
                __await: e
            }
        }
        ,
        u(w.prototype),
        w.prototype[a] = function() {
            return this
        }
        ,
        e.AsyncIterator = w,
        e.async = function(t, n, o, i, a) {
            void 0 === a && (a = Promise);
            var r = new w(s(t, n, o, i),a);
            return e.isGeneratorFunction(n) ? r : r.next().then((function(e) {
                return e.done ? e.value : r.next()
            }
            ))
        }
        ,
        u(g),
        g[r] = "Generator",
        g[i] = function() {
            return this
        }
        ,
        g.toString = function() {
            return "[object Generator]"
        }
        ,
        e.keys = function(e) {
            var t = [];
            for (var n in e)
                t.push(n);
            return t.reverse(),
            function n() {
                for (; t.length; ) {
                    var o = t.pop();
                    if (o in e)
                        return n.value = o,
                        n.done = !1,
                        n
                }
                return n.done = !0,
                n
            }
        }
        ,
        e.values = _,
        v.prototype = {
            constructor: v,
            reset: function(e) {
                if (this.prev = 0,
                this.next = 0,
                this.sent = this._sent = void 0,
                this.done = !1,
                this.delegate = null,
                this.method = "next",
                this.arg = void 0,
                this.tryEntries.forEach(y),
                !e)
                    for (var t in this)
                        "t" === t.charAt(0) && n.call(this, t) && !isNaN(+t.slice(1)) && (this[t] = void 0)
            },
            stop: function() {
                this.done = !0;
                var e = this.tryEntries[0].completion;
                if ("throw" === e.type)
                    throw e.arg;
                return this.rval
            },
            dispatchException: function(e) {
                if (this.done)
                    throw e;
                var t = this;
                function o(n, o) {
                    return r.type = "throw",
                    r.arg = e,
                    t.next = n,
                    o && (t.method = "next",
                    t.arg = void 0),
                    !!o
                }
                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                    var a = this.tryEntries[i]
                      , r = a.completion;
                    if ("root" === a.tryLoc)
                        return o("end");
                    if (a.tryLoc <= this.prev) {
                        var s = n.call(a, "catchLoc")
                          , l = n.call(a, "finallyLoc");
                        if (s && l) {
                            if (this.prev < a.catchLoc)
                                return o(a.catchLoc, !0);
                            if (this.prev < a.finallyLoc)
                                return o(a.finallyLoc)
                        } else if (s) {
                            if (this.prev < a.catchLoc)
                                return o(a.catchLoc, !0)
                        } else {
                            if (!l)
                                throw new Error("try statement without catch or finally");
                            if (this.prev < a.finallyLoc)
                                return o(a.finallyLoc)
                        }
                    }
                }
            },
            abrupt: function(e, t) {
                for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                    var i = this.tryEntries[o];
                    if (i.tryLoc <= this.prev && n.call(i, "finallyLoc") && this.prev < i.finallyLoc) {
                        var a = i;
                        break
                    }
                }
                a && ("break" === e || "continue" === e) && a.tryLoc <= t && t <= a.finallyLoc && (a = null);
                var r = a ? a.completion : {};
                return r.type = e,
                r.arg = t,
                a ? (this.method = "next",
                this.next = a.finallyLoc,
                d) : this.complete(r)
            },
            complete: function(e, t) {
                if ("throw" === e.type)
                    throw e.arg;
                return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg,
                this.method = "return",
                this.next = "end") : "normal" === e.type && t && (this.next = t),
                d
            },
            finish: function(e) {
                for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                    var n = this.tryEntries[t];
                    if (n.finallyLoc === e)
                        return this.complete(n.completion, n.afterLoc),
                        y(n),
                        d
                }
            },
            catch: function(e) {
                for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                    var n = this.tryEntries[t];
                    if (n.tryLoc === e) {
                        var o = n.completion;
                        if ("throw" === o.type) {
                            var i = o.arg;
                            y(n)
                        }
                        return i
                    }
                }
                throw new Error("illegal catch attempt")
            },
            delegateYield: function(e, t, n) {
                return this.delegate = {
                    iterator: _(e),
                    resultName: t,
                    nextLoc: n
                },
                "next" === this.method && (this.arg = void 0),
                d
            }
        },
        e
    }(e.exports);
    try {
        regeneratorRuntime = o
    } catch (e) {
        Function("r", "regeneratorRuntime = r")(o)
    }
}
, function(e, t) {
    var n;
    n = function() {
        return this
    }();
    try {
        n = n || new Function("return this")()
    } catch (e) {
        "object" == typeof window && (n = window)
    }
    e.exports = n
}
, function(e, t, n) {
    var o = n(5);
    "string" == typeof o && (o = [[e.i, o, ""]]);
    var i = {
        insert: "head",
        singleton: !1
    };
    n(9)(o, i);
    o.locals && (e.exports = o.locals)
}
, function(e, t, n) {
    var o = n(6)
      , i = n(7)
      , a = n(8);
    t = o(!1);
    var r = i(a);
    t.push([e.i, ".badbrowser{position:absolute;left:30%;top:15%;display:block;width:400px;height:200px;font-size:30px;color:red;font-weight:bold;padding:10px;background:#cccccc;border-radius:12px;text-align:center}/*! Dogeminer Landing Page CSS *//*! normalize.css v4.0.0 | MIT License | github.com/necolas/normalize.css */html{font-family:'DogeSans', 'Comic Sans MS', sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}section{display:block}a:active,a:hover{outline-width:0}b,strong{font-weight:inherit}b,strong{font-weight:bolder}h1{font-size:2em;margin:0.67em 0}small{font-size:80%}img{border-style:none}.latestv{visibility:visible;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}@media only screen and (max-width: 1025px){.latestv{font-size:80% !important}}@media only screen and (max-width: 767px){.latestv{display:none !important}}.special-info{-webkit-box-align:start;-webkit-align-items:start;-ms-flex-align:start;align-items:start;margin-top:0px;align-items:start}@media only screen and (max-width: 1025px){.special-info{-webkit-box-align:center !important;-webkit-align-items:center !important;-ms-flex-align:center !important;align-items:center !important;-webkit-box-pack:center !important;-webkit-justify-content:center !important;-ms-flex-pack:center !important;justify-content:center !important}}@media only screen and (max-width: 767px){.special-info{-webkit-box-align:center !important;-webkit-align-items:center !important;-ms-flex-align:center !important;align-items:center !important;-webkit-box-pack:center !important;-webkit-justify-content:center !important;-ms-flex-pack:center !important;justify-content:center !important;height:35px !important;margin-top:8px !important}}.p-sponsored{margin-top:10px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:100%;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;position:relative}.p-sponsored #sponsoredtext{font-size:16px;width:100%;margin-top:-5px}@media only screen and (max-height: 510px){.p-sponsored{max-height:65px;height:65px;min-height:65px;margin-top:5px}}.p-sponsored ins{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:100%;height:100%;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;text-align:center}@media only screen and (max-width: 767px){.p-sponsored ins{margin-top:7px;min-height:100px}}@media only screen and (max-height: 510px){.p-sponsored ins{margin-top:7px;min-height:50px}}.h-adsbygoogletext{text-shadow:1px 1px #000;font-size:80%;opacity:0.8;margin-bottom:10px;color:#a7a7a7;text-align:center;font-weight:400 !important}@media only screen and (max-width: 1025px){.h-adsbygoogletext{font-size:75%;height:15px;margin-bottom:4px}}@media only screen and (max-width: 767px){.h-adsbygoogletext{font-size:75%;height:15px;margin-bottom:0px}}.p-landing{display:block;overflow:hidden;margin-top:20px}@media only screen and (max-width: 1025px){.p-landing{margin-top:5px}}@media only screen and (max-width: 767px){.p-landing{margin-top:2px}}@media only screen and (max-height: 925px){.p-landing{margin-top:20px}}@media only screen and (max-height: 850px){.p-landing{margin-top:1px}}.p-landing p{margin:0;padding:0 auto;font-weight:600}.p-landing p a{text-decoration:none;color:#9b7d53}.p-landing__text--normal{color:#9b7d53;font-size:22px}.p-landing__text--dark{color:#825b21;font-size:25px}.p-landing__text--summer{padding-left:10px}@media only screen and (max-width: 767px){.p-landing__text--summer{display:none}}.p-landing__text--center{-webkit-align-self:center;-ms-flex-item-align:center;align-self:center}.p-landing__text--small{font-size:20px}.p-landing__images{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;margin:-20px -40px -120px 0}@media only screen and (max-width: 767px){.p-landing__images{margin:-5px -40px -40px 0}}@media only screen and (max-height: 510px){.p-landing__images{margin-top:-20px}}@media only screen and (min-device-width: 0px) and (max-device-height: 580px) and (orientation: portrait){body .p-landing__images{margin-top:0px}}@media only screen and (min-device-width: 500px) and (max-device-height: 320px) and (orientation: landscape){body .p-landing__images{margin-top:-37px;margin:-20px -40px -120px 0;-webkit-transform:scale3d(0.8, 0.8, 0.8);transform:scale3d(0.8, 0.8, 0.8)}}.p-landing__images img{max-width:100%;height:auto}.p-landing__images--text{max-width:70%}.p-landing__images h1{display:none}.p-landing__images p{display:none}.p-landing__images--logo{max-width:30%}.p-landing__images--logo img{margin-left:-30px}.p-landing__container{width:1035px;margin-left:auto;margin-right:auto;margin-bottom:20px;-webkit-box-shadow:0 10px 10px rgba(0,0,0,0.25),0 10px 10px rgba(0,0,0,0.22);box-shadow:0 10px 10px rgba(0,0,0,0.25),0 10px 10px rgba(0,0,0,0.22);padding:20px;padding-top:10px;padding-bottom:5px;border-radius:10px;border:8px solid #dea435;background:-webkit-gradient(linear, left top, left bottom, from(rgba(255,249,229,0.95)),color-stop(17%, rgba(254,238,189,0.95)),to(rgba(254,238,189,0.95)));background:-o-linear-gradient(top, rgba(255,249,229,0.95) 0%,rgba(254,238,189,0.95) 17%,rgba(254,238,189,0.95));background:linear-gradient(to bottom, rgba(255,249,229,0.95) 0%,rgba(254,238,189,0.95) 17%,rgba(254,238,189,0.95))}@media only screen and (max-width: 1025px){.p-landing__container{min-height:0;width:auto;padding:10px;margin-bottom:0px;-webkit-box-shadow:none;box-shadow:none}}@media only screen and (max-width: 767px){.p-landing__container{max-width:100%;padding:5px;width:auto;margin-bottom:0px;-webkit-box-shadow:none;box-shadow:none}}@media only screen and (max-height: 510px){.p-landing__container{padding:5px}}.p-landing__body{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;font-size:40px;margin-right:45%;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;position:relative}@media only screen and (min-width: 1000px){.p-landing__body{margin-top:20px}}.p-landing__body p,.p-landing__body h2{font-size:40px;margin:0 auto;color:#825b21}@media only screen and (max-width: 767px){.p-landing__body p,.p-landing__body h2{font-size:26px}}@media only screen and (max-height: 510px){.p-landing__body p,.p-landing__body h2{display:none}}.p-landing__body p:nth-child(1),.p-landing__body h2:nth-child(1){font-weight:400}@media only screen and (max-width: 767px){.p-landing__body p:nth-child(1),.p-landing__body h2:nth-child(1){font-size:0.45em}}.p-landing__body p:nth-child(2),.p-landing__body h2:nth-child(2){font-size:24px;position:relative}@media only screen and (max-width: 767px){.p-landing__body p:nth-child(2),.p-landing__body h2:nth-child(2){display:none}}.p-landing__body img{position:absolute;top:-5px;left:130px;max-width:100%;opacity:.7;height:50px}.p-landing__footer{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row}@media only screen and (max-height: 925px){.p-landing__footer{height:auto}}@media only screen and (max-width: 767px){.p-landing__footer{margin-top:69px}}.p-landing__footer--box{height:auto;position:relative;width:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-justify-content:space-around;-ms-flex-pack:distribute;justify-content:space-around;-webkit-box-align:start;-webkit-align-items:flex-start;-ms-flex-align:start;align-items:flex-start}@media only screen and (max-width: 767px){.p-landing__footer--box{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}}.p-landing__footer--fb{-webkit-align-self:flex-end;-ms-flex-item-align:end;align-self:flex-end}.p-landing__start{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-justify-content:space-around;-ms-flex-pack:distribute;justify-content:space-around;margin-top:30px;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row}@media only screen and (max-width: 767px){.p-landing__start{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column}}@media only screen and (max-height: 551px){.p-landing__start{margin-top:10px}}@media only screen and (min-device-width: 0px) and (max-device-height: 580px) and (orientation: portrait){body .p-landing__start{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column}}@media only screen and (min-device-width: 200px) and (max-device-height: 736px) and (orientation: landscape){body .p-landing__start{-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row}}.p-landing__start--box{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-basis:40%;-ms-flex-preferred-size:40%;flex-basis:40%;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;flex-direction:row;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}@media only screen and (max-width: 767px){.p-landing__start--box{width:100%}}.p-landing__start--leftsize{-webkit-flex-basis:27%;-ms-flex-preferred-size:27%;flex-basis:27%}@media only screen and (max-width: 767px){.p-landing__start--leftsize{-webkit-box-ordinal-group:4;-webkit-order:3;-ms-flex-order:3;order:3}.p-landing__start--leftsize p{margin-top:10px}.p-landing__start--leftsize strong,.p-landing__start--leftsize div,.p-landing__start--leftsize ul,.p-landing__start--leftsize li,.p-landing__start--leftsize p{text-align:center !important;-webkit-align-self:center !important;-ms-flex-item-align:center !important;align-self:center !important;-webkit-box-align:center !important;-webkit-align-items:center !important;-ms-flex-align:center !important;align-items:center !important;-webkit-box-pack:center !important;-webkit-justify-content:center !important;-ms-flex-pack:center !important;justify-content:center !important;font-size:1.2em}.p-landing__start--leftsize ul{margin-top:0px}}.p-landing__start--rightsize{-webkit-flex-basis:33%;-ms-flex-preferred-size:33%;flex-basis:33%;margin-top:30px}@media only screen and (max-width: 767px){.p-landing__start--rightsize{-webkit-box-ordinal-group:3;-webkit-order:2;-ms-flex-order:2;order:2}}.p-landing__start--header{padding-bottom:15px;color:#9b7d53}.p-landing__start--play{position:relative;border:7px solid #dea335;border-radius:12px;color:#ffffff;-webkit-transition:all 0.2s ease-out;-o-transition:all 0.2s ease-out;transition:all 0.2s ease-out;font-size:46px;width:230px;background:-webkit-gradient(linear, left top, left bottom, from(#ffde72), to(#feb645));background:-o-linear-gradient(#ffde72, #feb645);background:linear-gradient(#ffde72, #feb645);font-weight:bold;cursor:pointer;padding-top:2px;padding-bottom:15px;text-align:center;vertical-align:top;text-decoration:none;padding-left:40px;padding-right:40px}.p-landing__start--play:hover{-webkit-transform:scale(1.1);-ms-transform:scale(1.1);transform:scale(1.1);background-position:87px;background:-webkit-gradient(linear, left top, left bottom, from(#fdde78), to(#ffc05d));background:-o-linear-gradient(#fdde78, #ffc05d);background:linear-gradient(#fdde78, #ffc05d);-webkit-box-shadow:0 15px 20px -14px rgba(0,0,0,0.3);box-shadow:0 15px 20px -14px rgba(0,0,0,0.3)}@media only screen and (max-width: 1025px){.p-landing__start--play:hover{-webkit-transform:none;-ms-transform:none;transform:none;background-position:0px;-webkit-box-shadow:none;box-shadow:none}}@media only screen and (max-width: 767px){.p-landing__start--play{width:185px;padding-left:0%;padding-right:0%}.p-landing__start--play:hover{-webkit-transform:none;-ms-transform:none;transform:none;background-position:0px;-webkit-box-shadow:none;box-shadow:none}}.p-landing__start--play:active{-webkit-transform:scale(1);-ms-transform:scale(1);transform:scale(1);-webkit-transition:all 0.1s ease;-o-transition:all 0.1s ease;transition:all 0.1s ease;background:-webkit-gradient(linear, left top, left bottom, from(#ffe9aa), to(#ffc05d));background:-o-linear-gradient(#ffe9aa, #ffc05d);background:linear-gradient(#ffe9aa, #ffc05d)}@media only screen and (max-height: 510px){.p-landing__start--play{width:185px;padding-left:0%;padding-right:0%;margin-left:15px}}.p-landing__start--play img{height:40px;width:auto}.p-landing__start--signout{font-size:14px;margin-bottom:5px;color:#9b7d53;text-decoration:none;text-align:center}@media only screen and (max-width: 767px){.p-landing__start--signout{font-size:15px}}@media only screen and (max-height: 510px){.p-landing__start--signout{font-size:14px}}.p-landing__start--signInNotice{font-size:11px;margin-top:5px !important;color:#715e44;text-decoration:none;text-align:center;margin-bottom:5px !important}.p-landing__start .fb-page-plugin-box{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1}.p-landing__centered{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-justify-content:space-around;-ms-flex-pack:distribute;justify-content:space-around;text-align:center;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;-webkit-box-flex:0;-webkit-flex-grow:0;-ms-flex-positive:0;flex-grow:0;-webkit-flex-basis:40%;-ms-flex-preferred-size:40%;flex-basis:40%}@media only screen and (max-width: 767px){.p-landing__centered{width:100%;margin-bottom:-20px}}.p-landing__left{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;-webkit-box-flex:0;-webkit-flex-grow:0;-ms-flex-positive:0;flex-grow:0;-webkit-box-align:start;-webkit-align-items:flex-start;-ms-flex-align:start;align-items:flex-start;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;text-align:left;-webkit-flex-basis:27%;-ms-flex-preferred-size:27%;flex-basis:27%;padding-right:15px}@media only screen and (max-width: 767px){.p-landing__left{width:100%}}.p-landing #shortdesc{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column}.p-landing__right{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-flex:0;-webkit-flex-grow:0;-ms-flex-positive:0;flex-grow:0;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;text-align:center;-webkit-flex-basis:33%;-ms-flex-preferred-size:33%;flex-basis:33%;height:100%}@media only screen and (max-width: 767px){.p-landing__right{width:100%;height:auto}}.p-landing__box{width:170px;border-radius:10px;padding:10px 15px;height:150px;margin:20px;margin-bottom:0px;border:3px solid #dea435;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;-webkit-box-flex:0;-webkit-flex-grow:0;-ms-flex-positive:0;flex-grow:0;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;text-align:center;background:-webkit-gradient(linear, left top, left bottom, from(rgba(255,249,229,0.95)),color-stop(17%, rgba(254,238,189,0.95)),to(rgba(254,238,189,0.95)));background:-o-linear-gradient(top, rgba(255,249,229,0.95) 0%,rgba(254,238,189,0.95) 17%,rgba(254,238,189,0.95));background:linear-gradient(to bottom, rgba(255,249,229,0.95) 0%,rgba(254,238,189,0.95) 17%,rgba(254,238,189,0.95))}.p-landing__box--header{padding-bottom:10px;font-size:14px;color:#9b7d53}.p-landing__box--reddit{color:#d67d1d;font-size:15px;padding:0 0 10px;text-transform:lowercase}.p-landing__box img{max-width:100%}.p-landing__twitter{-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}.p-landing__twitter>p{padding-bottom:10px;color:#825b21}.p-landing__bg{position:fixed;z-index:-1;left:0;bottom:0;top:0;right:0;background-size:cover;background-image:url(" + r + ")}@media only screen and (max-width: 767px){.p-landing__bg{background-position-x:-135px}}.p-landing .devices-header{font-weight:400;margin-top:20px;font-size:16px;text-align:center}@media only screen and (max-width: 767px){.p-landing .devices-header{margin-top:20px;font-size:1.2em}}@media only screen and (max-height: 600px){.p-landing .devices-header{display:none}}#googlebtn{padding-top:5px}.google-signin-box{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;text-align:center;margin-top:5px}.google-signin-box a{text-align:center}@media only screen and (max-width: 767px){.google-signin-box{margin-bottom:6px}}@media only screen and (min-device-width: 0px) and (max-device-height: 580px) and (orientation: portrait){body .google-signin-box{margin-bottom:6px}}.sponsored-box{overflow:hidden;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;position:relative;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;height:220px;overflow:visible;width:350px}.sponsored-box p{font-size:14px;color:#754e13;position:absolute;left:120px;top:-24px;z-index:15}#blockedbox{overflow:hidden;-webkit-align-self:flex-end;-ms-flex-item-align:end;align-self:flex-end;height:175px}#blockedbox p{font-size:17px;text-align:center;margin-bottom:10px;position:relative;left:0;top:0}#blockedbox p:nth-child(2){font-weight:400}#blockedbox p:nth-child(4){font-weight:400}#cookies-long{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;overflow:auto}@media only screen and (max-width: 1025px){#cookies-long{max-height:100%}}@media only screen and (max-width: 767px){#cookies-long{max-height:100%}}#cookies-long p,#cookies-long ul,#cookies-long li{font-weight:normal;font-size:14px}#cookies-long h3{text-align:center;margin:0px;font-size:18px;font-weight:bold}#cookies-long h4{font-size:17px;font-weight:bold;margin-top:5px;margin-bottom:5px}#cookies-long h5{margin-top:5px;margin-bottom:5px;font-size:17px;font-weight:bold}#cookies-long #hide-cookie-info{white-space:nowrap;margin-top:15px;margin-bottom:5px;width:50%;margin-left:auto;margin-right:auto;border:none;padding:0.7em 2em;border:1px solid #d19405;background:#fece2f;color:#4c3000;text-align:center;font-size:1em;letter-spacing:1px;text-transform:uppercase;cursor:pointer;display:block;border-radius:8px;font-weight:600}#cookies-long #hide-cookie-info:active{border:1px solid #d19405;background:#fbe59d}#show-cookie-info{position:relative;text-align:right;font-size:15px;cursor:pointer;color:#361d0f;margin-right:-15px;margin-top:5px}@media only screen and (max-width: 1025px){#show-cookie-info{margin-top:20px;opacity:0.9;width:auto;margin-right:0px}}@media only screen and (max-width: 767px){#show-cookie-info{text-align:center;opacity:0.9;margin-top:35px;margin-left:0px;top:5px;height:40px}}#savegames{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;overflow:auto;color:#503404}#savegames p{margin-bottom:20px;font-weight:400}#savegames #saveheader{display:block;font-size:1.17em;-webkit-margin-before:1em;margin-block-start:1em;-webkit-margin-after:1em;margin-block-end:1em;-webkit-margin-start:0px;margin-inline-start:0px;-webkit-margin-end:0px;margin-inline-end:0px;font-weight:bold}@media only screen and (max-width: 1025px){#savegames{max-height:100%}}@media only screen and (max-width: 767px){#savegames{max-height:100%}}#hide-savegames{white-space:nowrap;margin-top:15px;margin-bottom:5px;width:40%;margin-left:auto;margin-right:auto;border:none;padding:0.7em 2em;border:1px solid #d19405;background:#fece2f;color:#4c3000;text-align:center;font-size:1em;letter-spacing:1px;text-transform:uppercase;cursor:pointer;display:block;border-radius:8px;font-weight:600;-webkit-transition:background-color 0.2s ease, -webkit-transform 0.2s ease;transition:background-color 0.2s ease, -webkit-transform 0.2s ease;-o-transition:background-color 0.2s ease, transform 0.2s ease;transition:background-color 0.2s ease, transform 0.2s ease;transition:background-color 0.2s ease, transform 0.2s ease, -webkit-transform 0.2s ease}#hide-savegames:hover{-webkit-transform:translateY(-2px) translateZ(0);transform:translateY(-2px) translateZ(0)}#hide-savegames:active{border:1px solid #d19405;background:#fbe59d}.ugly-box-because-you-blocked-socialmedias{height:110px}.forced-active{-webkit-transform:scale(1) !important;-ms-transform:scale(1) !important;transform:scale(1) !important;-webkit-transition:all 0.1s ease;-o-transition:all 0.1s ease;transition:all 0.1s ease;background:-webkit-gradient(linear, left top, left bottom, from(#ffe9aa), to(#ffc05d)) !important;background:-o-linear-gradient(#ffe9aa, #ffc05d) !important;background:linear-gradient(#ffe9aa, #ffc05d) !important}.patreon-cta{font-weight:400 !important;font-size:15px;max-width:100%;text-align:center;padding:20px;line-height:15px;color:#825b21}.patreon-cta strong{font-weight:800 !important}@media only screen and (max-width: 1025px){.patreon-cta{font-size:1em;line-height:1.1em}}@media only screen and (max-width: 767px){.patreon-cta{font-size:1.1em;max-width:95%;margin-left:auto !important;margin-right:auto !important;line-height:1.1em;padding-top:5px}}.ptreon{opacity:0.8;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-transition:opacity 0.2s ease, margin 0.2s ease, color 0.2s ease, background 0.2s ease, border 0.2s ease, border-color 0.2s ease, border-radius 0.2s ease, -webkit-box-shadow 0.2s ease, -webkit-transform 0.2s ease;transition:opacity 0.2s ease, margin 0.2s ease, color 0.2s ease, background 0.2s ease, border 0.2s ease, border-color 0.2s ease, border-radius 0.2s ease, -webkit-box-shadow 0.2s ease, -webkit-transform 0.2s ease;-o-transition:opacity 0.2s ease, margin 0.2s ease, color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, border 0.2s ease, border-color 0.2s ease, border-radius 0.2s ease;transition:opacity 0.2s ease, margin 0.2s ease, color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, border 0.2s ease, border-color 0.2s ease, border-radius 0.2s ease;transition:opacity 0.2s ease, margin 0.2s ease, color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, border 0.2s ease, border-color 0.2s ease, border-radius 0.2s ease, -webkit-box-shadow 0.2s ease, -webkit-transform 0.2s ease;-o-transition:opacity 0.2s ease, margin 0.2s ease, color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, -o-transform 0.2s ease, border 0.2s ease, border-color 0.2s ease, border-radius 0.2s ease;-moz-transition:opacity 0.2s ease, margin 0.2s ease, color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, -moz-transform 0.2s ease, border 0.2s ease, border-color 0.2s ease, border-radius 0.2s ease;-webkit-transition:opacity 0.2s ease, margin 0.2s ease, color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, -webkit-transform 0.2s ease, border 0.2s ease, border-color 0.2s ease, border-radius 0.2s ease;text-align:center;position:relative;display:block;border-radius:100px;border:0;text-decoration:none;outline:none;background:#f96854;color:#fff;line-height:0;-webkit-box-shadow:0 0 0 0 rgba(249,104,84,0.4);box-shadow:0 0 0 0 rgba(249,104,84,0.4);padding:6px 32px;width:215px;margin-left:auto;margin-right:auto}@media only screen and (max-width: 767px){.ptreon{opacity:0.9;width:250px;padding-left:20px;padding-right:20px}}.ptreon img{text-align:center;font-size:14px;color:#fff;line-height:0;border:0;max-width:100%;height:auto}.ptreon:hover{opacity:1;-webkit-box-shadow:0 15px 20px -14px rgba(0,0,0,0.3);box-shadow:0 15px 20px -14px rgba(0,0,0,0.3);-webkit-transform:translateY(-4px) translateZ(0);transform:translateY(-4px) translateZ(0)}.discordcta{opacity:0.8;-webkit-transition:all 0.2s ease;-o-transition:all 0.2s ease;transition:all 0.2s ease;margin-top:10px;-webkit-flex:0;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}@media only screen and (max-width: 767px){.discordcta{margin-top:35px}}.discordcta:hover{opacity:1}.discordcta p{color:#5c77d6 !important;font-weight:800 !important;font-style:italic !important;margin-bottom:10px !important;max-width:190px;text-align:left;word-break:keep-all;font-size:13px}.discordcta a{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;height:45px;font-size:24px;font-weight:400;border:none;background-color:#4963bb;background:#4963bb;border-radius:8px;text-decoration:none;text-align:center;color:#fff;margin-bottom:20px;width:190px;-webkit-transition:-webkit-box-shadow 0.2s ease, -webkit-transform 0.2s ease;transition:-webkit-box-shadow 0.2s ease, -webkit-transform 0.2s ease;-o-transition:box-shadow 0.2s ease, transform 0.2s ease;transition:box-shadow 0.2s ease, transform 0.2s ease;transition:box-shadow 0.2s ease, transform 0.2s ease, -webkit-box-shadow 0.2s ease, -webkit-transform 0.2s ease}.discordcta a:hover{-webkit-transform:translateY(-2px) translateZ(0);transform:translateY(-2px) translateZ(0);-webkit-box-shadow:0 15px 20px -14px rgba(0,0,0,0.3);box-shadow:0 15px 20px -14px rgba(0,0,0,0.3)}.discordcta img{width:190px;height:auto;margin-bottom:5px}#open-saves{opacity:0.6;margin-top:20px;white-space:nowrap;border:none;padding:0.5em;border:3px solid #d19405;color:#4c3000;text-align:center;font-size:1em;letter-spacing:1px;text-transform:uppercase;cursor:pointer;display:block;border-radius:8px;font-weight:800;-webkit-transition:all 0.2s ease;-o-transition:all 0.2s ease;transition:all 0.2s ease;height:41px;min-height:41px;background:-webkit-gradient(linear, left top, left bottom, from(#ffde72), to(#feb645));background:-o-linear-gradient(#ffde72, #feb645);background:linear-gradient(#ffde72, #feb645);-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;-webkit-box-flex:0;-webkit-flex-grow:0;-ms-flex-positive:0;flex-grow:0}#open-saves:hover{opacity:1;-webkit-transform:translateY(-2px) translateZ(0);transform:translateY(-2px) translateZ(0);background-position:87px;background:-webkit-gradient(linear, left top, left bottom, from(#fdde78), to(#ffc05d));background:-o-linear-gradient(#fdde78, #ffc05d);background:linear-gradient(#fdde78, #ffc05d);-webkit-box-shadow:0 15px 20px -14px rgba(0,0,0,0.3);box-shadow:0 15px 20px -14px rgba(0,0,0,0.3)}#loadbutton,#savebutton{display:block;opacity:0.9;border-radius:8px;border:3px solid #ca8308;display:block;cursor:pointer;color:#4c3000 !important;font-weight:800 !important;font-size:15px;padding:12px 15px;text-decoration:none;-webkit-transition:all 0.2s ease;-o-transition:all 0.2s ease;transition:all 0.2s ease;background:-webkit-gradient(linear, left top, left bottom, from(#ffde72), to(#feb645));background:-o-linear-gradient(#ffde72, #feb645);background:linear-gradient(#ffde72, #feb645);margin-bottom:20px}#loadbutton:hover,#savebutton:hover{-webkit-transform:translateY(-2px) translateZ(0);transform:translateY(-2px) translateZ(0);background-position:87px;background:-webkit-gradient(linear, left top, left bottom, from(#fdde78), to(#ffc05d));background:-o-linear-gradient(#fdde78, #ffc05d);background:linear-gradient(#fdde78, #ffc05d);-webkit-box-shadow:0 15px 20px -14px rgba(0,0,0,0.3);box-shadow:0 15px 20px -14px rgba(0,0,0,0.3)}#loadbutton{max-width:300px}.small-warning{margin-bottom:20px !important;margin-bottom:20px !important;font-size:15px;color:#503404}.small-warning em{color:#5f4011}.border-separators{border-right:2px solid #dea435;border-left:2px solid #dea435;border-right:2px solid rgba(222,164,53,0.52);border-left:2px solid rgba(222,164,53,0.52);-webkit-align-self:stretch !important;-ms-flex-item-align:stretch !important;align-self:stretch !important}@media only screen and (max-width: 767px){.border-separators{border:none}}.left-paragraphs{height:40px;width:100%;color:#754e13;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-self:flex-end;-ms-flex-item-align:end;align-self:flex-end;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;word-break:keep-all;font-size:0.9em;font-weight:400;max-width:100%;text-align:center;margin-top:20px}.left-paragraphs em,.left-paragraphs strong{font-size:0.95em;font-weight:800;word-break:keep-all;text-align:left}.left-paragraphs em{font-weight:400}@media only screen and (max-width: 767px){.left-paragraphs{font-size:1em;margin-bottom:20px;margin-top:0px}}.left-paragraphs p{padding-top:5px}.left-paragraphs a{color:inherit;text-decoration:underline;margin-bottom:10px}.left-paragraphs a:hover{text-decoration:underline}.left-paragraphs a:active{color:inherit}.alert-option{display:block;margin-top:-90px}@media only screen and (max-width: 767px){.alert-option{margin-top:0px}}.alert-option p{margin-left:-3px;margin-top:-30px;color:#a72d01;font-size:0.9em}.alert-option h3{text-align:center;font-weight:400;color:#825b21;margin-top:2px;margin-bottom:0px;font-size:1em}.alert-option a{color:#64471b;text-decoration:underline}.alert-option a:hover{color:#4e3714;text-decoration:underline}.alert-option a:active{color:#8a5910}.alert-option h4{text-align:center;font-weight:400;color:#825b21;margin-top:15px;margin-bottom:5px}.widget-centering{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}iframe{z-index:999999999 !important}*{font-family:'DogeSans', 'Comic Sans MS', sans-serif;-webkit-box-sizing:border-box;box-sizing:border-box}*:focus{outline:none}body,html{overflow:auto;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.adsbygoogletext{font-size:80%;margin-bottom:4px;display:block}#blogbox{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;justify-items:flex-start;font-size:14px;color:#754e13;z-index:15;-webkit-box-align:start;-webkit-align-items:flex-start;-ms-flex-align:start;align-items:flex-start;-webkit-align-self:flex-start;-ms-flex-item-align:start;align-self:flex-start}@media only screen and (max-width: 767px){#blogbox{padding-top:0px;padding-bottom:55px}}#blogbox ul{padding-top:0px;padding-bottom:0px;margin-bottom:0px;margin-top:0px}#blogbox include ul{padding-left:20px}#blogbox>p{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-align-self:center;-ms-flex-item-align:center;align-self:center}#blogbox .devblog{position:relative;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-align-self:center;-ms-flex-item-align:center;align-self:center}#blogbox .devblog ul{list-style-type:none;padding-left:0px}#blogbox .devblog ul li{white-space:nowrap;padding-bottom:8px;border-bottom:1px solid rgba(109,72,27,0.3)}#blogbox .devblog ul li:last-child{border-bottom:0px;padding-bottom:0px}#blogbox .devblog ul li a{white-space:nowrap;font-size:17px;cursor:pointer}.rated{position:absolute;top:5px;right:5px;text-align:right;cursor:pointer;color:#dabe97 !important;text-decoration:none}.rated:hover,.rated:active{color:#dabe97}@media only screen and (max-width: 1025px){.rated{display:none}}@media only screen and (max-width: 767px){.rated{display:none}}audio,canvas,img,video{vertical-align:middle}.bgImageAnimation{-webkit-animation:imageAnimation 30s linear infinite 0s;animation:imageAnimation 30s linear infinite 0s}@-webkit-keyframes imageAnimation{0%{-webkit-transform:scale(1);transform:scale(1);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}25%{-webkit-transform:scale(1.05);transform:scale(1.05);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}50%{-webkit-transform:scale(1.1);transform:scale(1.1)}}@keyframes imageAnimation{0%{-webkit-transform:scale(1);transform:scale(1);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}25%{-webkit-transform:scale(1.05);transform:scale(1.05);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}50%{-webkit-transform:scale(1.1);transform:scale(1.1)}}.animated{-webkit-animation-duration:0.25s;animation-duration:0.25s;-webkit-animation-fill-mode:both;animation-fill-mode:both}.animatedslow{-webkit-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:both;animation-fill-mode:both}@-webkit-keyframes fadeInUp{from{opacity:0;-webkit-transform:translate3d(0, 100%, 0);transform:translate3d(0, 100%, 0)}to{opacity:1;-webkit-transform:none;transform:none}}@keyframes fadeInUp{from{opacity:0;-webkit-transform:translate3d(0, 100%, 0);transform:translate3d(0, 100%, 0)}to{opacity:1;-webkit-transform:none;transform:none}}.fadeInUp{-webkit-animation-duration:0.1s;animation-duration:0.1s;-webkit-animation-delay:0.05s;animation-delay:0.05s;-webkit-animation-name:fadeInUp;animation-name:fadeInUp}@-webkit-keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@-webkit-keyframes fadeOut{from{opacity:1}to{opacity:0}}@keyframes fadeOut{from{opacity:1}to{opacity:0}}.fadeOut{-webkit-animation-name:fadeOut;animation-name:fadeOut}.fadeIn{-webkit-animation-name:fadeIn;animation-name:fadeIn}.delay0{-webkit-animation-delay:0.2s;animation-delay:0.2s}.delay1{-webkit-animation-delay:0.3s;animation-delay:0.3s}.delay2{-webkit-animation-delay:0.4s;animation-delay:0.4s}.delay3{-webkit-animation-delay:0.5s;animation-delay:0.5s}@-webkit-keyframes shake{from,to{-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0)}10%,30%,50%,70%,90%{-webkit-transform:translate3d(-10px, 0, 0);transform:translate3d(-10px, 0, 0)}20%,40%,60%,80%{-webkit-transform:translate3d(10px, 0, 0);transform:translate3d(10px, 0, 0)}}@keyframes shake{from,to{-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0)}10%,30%,50%,70%,90%{-webkit-transform:translate3d(-10px, 0, 0);transform:translate3d(-10px, 0, 0)}20%,40%,60%,80%{-webkit-transform:translate3d(10px, 0, 0);transform:translate3d(10px, 0, 0)}}.shake{-webkit-animation-name:shake;animation-name:shake}.noselect{-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;-ms-touch-action:none;touch-action:none;-ms-touch-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.noselect:focus{outline:none}.animate-spin{-webkit-animation:spin 2s infinite linear;animation:spin 2s infinite linear;display:inline-block}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}@keyframes spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}.chillaxicon{font-size:48px;font-family:\"dogeawesome\";font-display:auto;font-style:normal;font-weight:normal;color:rgba(137,92,25,0.55);display:inline-block;text-decoration:inherit;text-align:center;font-variant:normal;text-transform:none;line-height:1em;margin:0;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;position:absolute;top:13px;left:0px;width:100%;display:block}.blue-link{font-style:normal;text-decoration:underline;color:#754e13;cursor:pointer}.blue-link:hover{color:#905a09;text-decoration:underline}.blue-link:active{color:#754e13;text-decoration:none}.for-animation-purposes{position:relative;display:block}.readmore-patreon{margin-top:5px !important;font-size:12px;text-align:center}\n", ""]),
    e.exports = t
}
, function(e, t, n) {
    "use strict";
    e.exports = function(e) {
        var t = [];
        return t.toString = function() {
            return this.map((function(t) {
                var n = function(e, t) {
                    var n = e[1] || ""
                      , o = e[3];
                    if (!o)
                        return n;
                    if (t && "function" == typeof btoa) {
                        var i = (r = o,
                        s = btoa(unescape(encodeURIComponent(JSON.stringify(r)))),
                        l = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(s),
                        "/*# ".concat(l, " */"))
                          , a = o.sources.map((function(e) {
                            return "/*# sourceURL=".concat(o.sourceRoot || "").concat(e, " */")
                        }
                        ));
                        return [n].concat(a).concat([i]).join("\n")
                    }
                    var r, s, l;
                    return [n].join("\n")
                }(t, e);
                return t[2] ? "@media ".concat(t[2], " {").concat(n, "}") : n
            }
            )).join("")
        }
        ,
        t.i = function(e, n, o) {
            "string" == typeof e && (e = [[null, e, ""]]);
            var i = {};
            if (o)
                for (var a = 0; a < this.length; a++) {
                    var r = this[a][0];
                    null != r && (i[r] = !0)
                }
            for (var s = 0; s < e.length; s++) {
                var l = [].concat(e[s]);
                o && i[l[0]] || (n && (l[2] ? l[2] = "".concat(n, " and ").concat(l[2]) : l[2] = n),
                t.push(l))
            }
        }
        ,
        t
    }
}
, function(e, t, n) {
    "use strict";
    e.exports = function(e, t) {
        return t || (t = {}),
        "string" != typeof (e = e && e.__esModule ? e.default : e) ? e : (/^['"].*['"]$/.test(e) && (e = e.slice(1, -1)),
        t.hash && (e += t.hash),
        /["'() \t\n]/.test(e) || t.needQuotes ? '"'.concat(e.replace(/"/g, '\\"').replace(/\n/g, "\\n"), '"') : e)
    }
}
, function(e, t, n) {
    e.exports = n.p.slice(1) + "bg.058c2e6e2b128f15a7045f043115ce0a.jpg"
}
, function(e, t, n) {
    "use strict";
    var o, i = {}, a = function() {
        return void 0 === o && (o = Boolean(window && document && document.all && !window.atob)),
        o
    }, r = function() {
        var e = {};
        return function(t) {
            if (void 0 === e[t]) {
                var n = document.querySelector(t);
                if (window.HTMLIFrameElement && n instanceof window.HTMLIFrameElement)
                    try {
                        n = n.contentDocument.head
                    } catch (e) {
                        n = null
                    }
                e[t] = n
            }
            return e[t]
        }
    }();
    function s(e, t) {
        for (var n = [], o = {}, i = 0; i < e.length; i++) {
            var a = e[i]
              , r = t.base ? a[0] + t.base : a[0]
              , s = {
                css: a[1],
                media: a[2],
                sourceMap: a[3]
            };
            o[r] ? o[r].parts.push(s) : n.push(o[r] = {
                id: r,
                parts: [s]
            })
        }
        return n
    }
    function l(e, t) {
        for (var n = 0; n < e.length; n++) {
            var o = e[n]
              , a = i[o.id]
              , r = 0;
            if (a) {
                for (a.refs++; r < a.parts.length; r++)
                    a.parts[r](o.parts[r]);
                for (; r < o.parts.length; r++)
                    a.parts.push(g(o.parts[r], t))
            } else {
                for (var s = []; r < o.parts.length; r++)
                    s.push(g(o.parts[r], t));
                i[o.id] = {
                    id: o.id,
                    refs: 1,
                    parts: s
                }
            }
        }
    }
    function d(e) {
        var t = document.createElement("style");
        if (void 0 === e.attributes.nonce) {
            var o = n.nc;
            o && (e.attributes.nonce = o)
        }
        if (Object.keys(e.attributes).forEach((function(n) {
            t.setAttribute(n, e.attributes[n])
        }
        )),
        "function" == typeof e.insert)
            e.insert(t);
        else {
            var i = r(e.insert || "head");
            if (!i)
                throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
            i.appendChild(t)
        }
        return t
    }
    var c, p = (c = [],
    function(e, t) {
        return c[e] = t,
        c.filter(Boolean).join("\n")
    }
    );
    function f(e, t, n, o) {
        var i = n ? "" : o.css;
        if (e.styleSheet)
            e.styleSheet.cssText = p(t, i);
        else {
            var a = document.createTextNode(i)
              , r = e.childNodes;
            r[t] && e.removeChild(r[t]),
            r.length ? e.insertBefore(a, r[t]) : e.appendChild(a)
        }
    }
    function m(e, t, n) {
        var o = n.css
          , i = n.media
          , a = n.sourceMap;
        if (i && e.setAttribute("media", i),
        a && btoa && (o += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a)))), " */")),
        e.styleSheet)
            e.styleSheet.cssText = o;
        else {
            for (; e.firstChild; )
                e.removeChild(e.firstChild);
            e.appendChild(document.createTextNode(o))
        }
    }
    var x = null
      , b = 0;
    function g(e, t) {
        var n, o, i;
        if (t.singleton) {
            var a = b++;
            n = x || (x = d(t)),
            o = f.bind(null, n, a, !1),
            i = f.bind(null, n, a, !0)
        } else
            n = d(t),
            o = m.bind(null, n, t),
            i = function() {
                !function(e) {
                    if (null === e.parentNode)
                        return !1;
                    e.parentNode.removeChild(e)
                }(n)
            }
            ;
        return o(e),
        function(t) {
            if (t) {
                if (t.css === e.css && t.media === e.media && t.sourceMap === e.sourceMap)
                    return;
                o(e = t)
            } else
                i()
        }
    }
    e.exports = function(e, t) {
        (t = t || {}).attributes = "object" == typeof t.attributes ? t.attributes : {},
        t.singleton || "boolean" == typeof t.singleton || (t.singleton = a());
        var n = s(e, t);
        return l(n, t),
        function(e) {
            for (var o = [], a = 0; a < n.length; a++) {
                var r = n[a]
                  , d = i[r.id];
                d && (d.refs--,
                o.push(d))
            }
            e && l(s(e, t), t);
            for (var c = 0; c < o.length; c++) {
                var p = o[c];
                if (0 === p.refs) {
                    for (var f = 0; f < p.parts.length; f++)
                        p.parts[f]();
                    delete i[p.id]
                }
            }
        }
    }
}
]);
