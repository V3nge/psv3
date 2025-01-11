var pathname = encodeURIComponent(window.location.pathname);
async function reportPlaying() {
  fetch(`/r?u=${pathname}`, { method: "POST" });
}
setInterval(reportPlaying, 1000 * 60);

function error(entity) {
  setTimeout(() => {
    const errorDetails = {
        message: display || 'Unknown error',
        stack: entity?.stack || 'No stack trace available',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
    };
  
    fetch('/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorDetails),
    })
    .then(response => {
        if (!response.ok) {
            console.error('Error logging failed');
        }
    })
    .catch(err => {
        console.error('Network error while logging: ', err);
    });
  }, 0);
}