var pathname = encodeURIComponent(window.location.pathname);
async function reportPlaying() {
    fetch(`/r?u=${pathname}`, {method: "POST"});
}
fetch(`/s?u=${pathname}`, {method: 'POST'});
setInterval(reportPlaying, 10000);