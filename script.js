

// 🌐 1. Browser Detection
function detectBrowser() {
    const ua = navigator.userAgent;
    let name = "Unknown 🤷‍♂️";
    let version = "Unknown 🤷‍♂️";
    let engine = "Unknown ⚙️";

    if (ua.indexOf("Firefox") > -1) {
        name = "Mozilla Firefox 🦊";
        version = ua.match(/Firefox\/([0-9.]+)/)?.[1] || "Unknown";
        engine = "Gecko 🦎";
    } else if (ua.indexOf("Edg") > -1) {
        name = "Microsoft Edge 🌐🔷";
        version = ua.match(/Edg\/([0-9.]+)/)?.[1] || "Unknown";
        engine = "Blink ⚡";
    } else if (ua.indexOf("Chrome") > -1) {
        name = "Google Chrome 🟢";
        version = ua.match(/Chrome\/([0-9.]+)/)?.[1] || "Unknown";
        engine = "Blink ⚡";
    } else if (ua.indexOf("Safari") > -1) {
        name = "Apple Safari 🧭";
        version = ua.match(/Version\/([0-9.]+)/)?.[1] || "Unknown";
        engine = "WebKit 🍎";
    } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
        name = "Opera 🎭";
        version = ua.match(/(?:Opera|OPR)\/([0-9.]+)/)?.[1] || "Unknown";
        engine = "Blink ⚡";
    }

    document.getElementById('browserName').innerText = name;
    document.getElementById('browserVersion').innerText = `v${version}`;
    document.getElementById('engine').innerText = engine;

    // 🚀 Up-to-date check (heuristic based on 2024/2025 thresholds)
    const vNum = parseFloat(version);
    const statusEl = document.getElementById('browserStatus');

    if (!isNaN(vNum)) {
        const thresholds = {
            "Chrome": 120,
            "Edge": 120,
            "Firefox": 120,
            "Safari": 17,
            "Opera": 105
        };

        let isCurrent = false;
        for (const [browser, minVer] of Object.entries(thresholds)) {
            if (name.includes(browser) && vNum >= minVer) {
                isCurrent = true;
                break;
            }
        }

        if (isCurrent) {
            statusEl.innerHTML = '<span class="status-ok">✅ Up to date! 🚀</span>';
        } else {
            statusEl.innerHTML = '<span class="status-warn">⚠️ Update recommended! 🔄</span>';
        }
    } else {
        statusEl.innerHTML = '<span class="status-warn">🤷‍♂️ Could not determine</span>';
    }

    // 🍪 Cookies
    document.getElementById('cookiesStatus').innerText =
        navigator.cookieEnabled ? "✅ Enabled 🍪" : "❌ Disabled 🚫";
}

// 💻 2. Operating System
function detectOS() {
    const ua = navigator.userAgent;
    let os = "Unknown 🤷‍♂️";

    if (ua.indexOf("Win") > -1) os = "Windows 🪟";
    else if (ua.indexOf("Mac") > -1) os = "macOS 🍎";
    else if (ua.indexOf("Linux") > -1) os = "Linux 🐧";
    else if (ua.indexOf("Android") > -1) os = "Android 🤖";
    else if (ua.indexOf("like Mac") > -1) os = "iOS 📱🍎";

    document.getElementById('osName').innerText = os;

    // 📱 Device type
    let device = "Desktop 💻";
    if (/Mobi|Android/i.test(ua)) device = "Mobile 📱";
    else if (/Tablet|iPad/i.test(ua)) device = "Tablet 📲";
    document.getElementById('deviceType').innerText = device;

    // 🌍 Language
    document.getElementById('language').innerText = navigator.language || "Unknown 🌍";

    // 🕒 Timezone
    document.getElementById('timezone').innerText =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown 🕒";
}

// 🧠 3. Hardware
function detectHardware() {
    // ⚙️ CPU Cores
    const cores = navigator.hardwareConcurrency || "Unknown ⚙️";
    document.getElementById('cpuCores').innerText = `${cores} cores 🧵`;

    // 🐏 RAM
    const ram = navigator.deviceMemory;
    document.getElementById('ram').innerText = ram
        ? `~${ram} GB 💾`
        : "N/A 🤷‍♂️ (e.g. Firefox)";

    // 🎮 GPU
    let gpuName = "Not detected 🎮";
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                gpuName = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
        }
    } catch (e) {
        gpuName = "Access denied 🔒";
    }
    document.getElementById('gpu').innerText = gpuName;

    // 👆 Touch
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    document.getElementById('touch').innerText = isTouch ? "✅ Yes 👆" : "❌ No 🖱️";
}

// 🖥️ 4. Display
function detectScreen() {
    document.getElementById('resolution').innerText = `${screen.width} × ${screen.height} 📐`;
    document.getElementById('windowSize').innerText = `${window.innerWidth} × ${window.innerHeight} 📏`;
    document.getElementById('pixelRatio').innerText = `${window.devicePixelRatio}x 🔍`;
    document.getElementById('colorDepth').innerText = `${screen.colorDepth}-bit 🎨`;

    // 🌙 Dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.getElementById('darkMode').innerText = prefersDark
        ? "🌙 Yes (Dark)"
        : "☀️ No (Light)";
}

// 📶 5. Network
function detectNetwork() {
    const updateOnline = () => {
        document.getElementById('onlineStatus').innerHTML = navigator.onLine
            ? '<span class="status-ok">✅ Online 🟢</span>'
            : '<span class="status-bad">❌ Offline 🔴</span>';
    };
    updateOnline();
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);

    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
        document.getElementById('connectionType').innerText =
            conn.effectiveType ? conn.effectiveType.toUpperCase() + " 📡" : "Unknown 📡";
        document.getElementById('downlink').innerText =
            conn.downlink ? `${conn.downlink} Mbps ⚡` : "N/A ⚡";
        document.getElementById('rtt').innerText =
            conn.rtt !== undefined ? `${conn.rtt} ms 🐌` : "N/A 🐌";
    } else {
        document.getElementById('connectionType').innerText = "API unavailable 🚫";
        document.getElementById('downlink').innerText = "API unavailable 🚫";
        document.getElementById('rtt').innerText = "API unavailable 🚫";
    }
}

// 🔐 6. Security & APIs
function detectSecurity() {
    // 🔒 HTTPS
    document.getElementById('https').innerHTML = location.protocol === 'https:'
        ? '<span class="status-ok">✅ Yes 🔒</span>'
        : '<span class="status-warn">⚠️ No (HTTP) 🔓</span>';

    // 🧭 Do Not Track
    const dnt = navigator.doNotTrack;
    let dntText = "Not set 🤷‍♂️";
    if (dnt === "1") dntText = "✅ Enabled 🧭";
    else if (dnt === "0") dntText = "❌ Disabled 🧭";
    document.getElementById('dnt').innerText = dntText;

    // 📋 Clipboard API
    document.getElementById('clipboard').innerText =
        navigator.clipboard ? "✅ Supported 📋" : "❌ Not supported 🚫";

    // Geolocation
    document.getElementById('geolocation').innerText =
        navigator.geolocation ? "✅ Supported 📍" : "❌ Not supported 🚫";

    // Battery API
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            const pct = Math.round(battery.level * 100);
            const charging = battery.charging ? " ⚡🔌" : " 🔋";
            document.getElementById('battery').innerText = `${pct}%${charging}`;
        }).catch(() => {
            document.getElementById('battery').innerText = "Error 🔋❌";
        });
    } else {
        document.getElementById('battery').innerText = "Not supported 🚫";
    }
}

// 🚀 INITIALIZATION 🚀
window.addEventListener('DOMContentLoaded', () => {
    detectBrowser();
    detectOS();
    detectHardware();
    detectScreen();
    detectNetwork();
    detectSecurity();
});

// 📏 Live window resize update 🔄
window.addEventListener('resize', () => {
    document.getElementById('windowSize').innerText =
        `${window.innerWidth} × ${window.innerHeight} 📏`;
});
