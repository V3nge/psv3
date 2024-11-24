if (__BLANK__) {
    console.log("YOU'VE BEEN BLANKED");

    const gamesContent = {};

    function openBlank(content) {
        const newWindow = window.open('about:blank', '_blank');
        newWindow.open();
        newWindow.document.write(`<script>var __BLANK__ = true;</script>` + content);
        newWindow.document.close();
    }

    async function fixAnchors() {
        const anchors = Array.from(document.getElementsByTagName("a"));
        for (const tag of anchors) {
            if (!tag.href.startsWith("javascript:") && tag.href.startsWith(window.location.href)) {
                console.log("fixing", tag.href);
                if (tag.dataset.loaded) continue;

                tag.dataset.loaded = "true";

                try {
                    const response = await fetch(tag.href);
                    const html = await response.text();
                    const key = btoa(tag.href);
                    gamesContent[key] = html;

                    tag.removeAttribute('href');

                    tag.onclick = () => {
                        openBlank(gamesContent[key]);
                    };
                } catch (error) {
                    console.error(`Failed to fetch ${tag.href}`, error);
                }
            }
        }
    }

    setInterval(fixAnchors, 100);
    fixAnchors();
}
