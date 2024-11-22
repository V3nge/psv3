(window.webpackJsonp = window.webpackJsonp || []).push([[3], {
    353: function (e, o, n) {
        function t() {
            var e = dogeminer.helperfunctions, o = dogeminer.shop, t = n(45), s = n(31);
            t.ignoreThatShizzle(!0), t.checkIfGood(!0), e.setPersec(!0), o.updateAllHelpers(), s.refreshBoxes();
            var r = n(79);
            setTimeout((function () { r.updatePatreonIcon(!0) }), 1500)
        } console.log("Patronage confirmed, you are a really good doge! <3"), function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
            if (e) {
                window.dogescriptl = !0, window.dogescriptchecks = !0, n(3).showStory("yaypat"), window.dogepbonus = { dps: 1.05, click: 1.05, costs: .95, diamonds: 5 };
                for (var o = !1, s = dogeminer.player.fortunes, r = 0;
                    r < s.length;
                    r++)"pbdg" === s[r][0] && (o = !0);
                if (!o) {
                    var a = { type: "fortune", id: "pbdg", iconSprite: new PIXI.Sprite(n(18).assets.general["general/icons/patreonbadge"]), dropType: 4 }, i = dogeminer.loot.makeFortune(a, !1);
                    dogeminer.player.fortunes.push(i), n(25).updateButtonIcon("fortune")
                } setTimeout(t, 1), log("# Bonuses applied! If you are not an actual patron and just cheated to get this, this function is always logged when used + compared to client & auth keys. If they do not match or are used elsewhere, an email with very specific data is sent unless the browser is not refreshed within 2 minutes. Friendly FYI!")
            } else console.log("Agency!")
        }(!0), n(6).saveGame(!0, !0)
    }
}]);
