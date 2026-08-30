document.addEventListener('DOMContentLoaded', () => {
    detectBrowser();
    detectOS();
    detectHardware();
    detectDisplay();
    detectNetwork();
    detectSecurity();
});

function setText(id, text, className) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = text;
        if (className) {
            el.className = `value ${className}`;
        }
    } else {
        console.warn(`Element with ID "${id}" not found in HTML.`);
    }
}

function setHTML(id, html, className) {
    const el = document.getElementById(id);
    if (el) {
        el.innerHTML = html;
        if (className) {
            el.className = `value ${className}`;
        }
    } else {
        console.warn(`Element with ID "${id}" not found in HTML.`);
    }
}

function detectBrowser() {
    const ua = navigator.userAgent;
    let name = 'Unknown';
    let version = 'Unknown';
    let engine = 'Unknown';

    if (ua.includes('Firefox')) {
        name = 'Firefox';
        version = ua.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown';
        engine = 'Gecko';
    } else if (ua.includes('Edg')) {
        name = 'Edge';
        version = ua.match(/Edg\/([0-9.]+)/)?.[1] || 'Unknown';
        engine = 'Blink';
    } else if (ua.includes('Chrome')) {
        name = 'Chrome';
        version = ua.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown';
        engine = 'Blink';
    } else if (ua.includes('Safari')) {
        name = 'Safari';
        version = ua.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown';
        engine = 'WebKit';
    } else if (ua.includes('Opera') || ua.includes('OPR')) {
        name = 'Opera';
        version = ua.match(/(?:Opera|OPR)\/([0-9.]+)/)?.[1] || 'Unknown';
        engine = 'Blink';
    }

    setText('browserName', name);
    setText('browserVersion', version);
    setText('browserEngine', engine);

    const vNum = parseFloat(version);
    const thresholds = { Chrome: 120, Edge: 120, Firefox: 120, Safari: 17, Opera: 105 };
    let isCurrent = false;
    
    for (const [browser, minVer] of Object.entries(thresholds)) {
        if (name.includes(browser) && vNum >= minVer) {
            isCurrent = true;
            break;
        }
    }

    if (isNaN(vNum)) {
        setHTML('browserStatus', 'Unknown', 'status-warn');
    } else {
        setHTML('browserStatus', isCurrent ? 'Up to date' : 'Not up to date', isCurrent ? 'status-good' : 'status-warn');
    }

    setText('cookies', navigator.cookieEnabled ? 'Enabled' : 'Disabled');
}

function detectOS() {
    const ua = navigator.userAgent;
    let os = 'Unknown';
    
    if (ua.includes('Win')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('like Mac')) os = 'iOS';
    
    setText('osName', os);

    // OS Detection
    let osVersion = 'Unknown';
    if (os === 'Windows') {
        if (ua.includes('Windows NT 10.0')) osVersion = '10 / 11';
        else if (ua.includes('Windows NT 6.3')) osVersion = '8.1';
        else if (ua.includes('Windows NT 6.2')) osVersion = '8';
        else if (ua.includes('Windows NT 6.1')) osVersion = '7';
        else if (ua.includes('Windows NT 6.0')) osVersion = 'Vista';
        else if (ua.includes('Windows NT 5.1')) osVersion = 'XP';
    } else if (os === 'macOS') {
        const macMatch = ua.match(/Mac OS X (\d+)[_.](\d+)(?:[_.](\d+))?/);
        if (macMatch) {
            osVersion = macMatch[1] + '.' + macMatch[2] + (macMatch[3] ? '.' + macMatch[3] : '');
        }
    } else if (os === 'Android') {
        const androidMatch = ua.match(/Android (\d+\.?\d*)/);
        if (androidMatch) osVersion = androidMatch[1];
    } else if (os === 'iOS') {
        const iosMatch = ua.match(/OS (\d+)[_.](\d+)(?:[_.](\d+))?/);
        if (iosMatch) {
            osVersion = iosMatch[1] + '.' + iosMatch[2] + (iosMatch[3] ? '.' + iosMatch[3] : '');
        }
    } else if (os === 'Linux') {
        osVersion = 'N/A'; // Of course because there are thousands of distros so no version detection for linux :P
    }
    setText('osVersion', osVersion);

    let device = 'Desktop';
    if (/Mobi|Android/i.test(ua)) device = 'Mobile';
    else if (/Tablet|iPad/i.test(ua)) device = 'Tablet';
    setText('deviceType', device);

    setText('language', navigator.language || 'Unknown');
    setText('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown');
}

function detectHardware() {
    setText('cpuCores', navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} cores/threads` : 'Unknown');
    setText('ram', navigator.deviceMemory ? `~${navigator.deviceMemory} GB` : 'Not supported');
    
    let gpuName = 'Not detected';
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
        gpuName = 'Access denied';
    }
    setText('gpu', gpuName);

    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    setText('touch', isTouch ? 'Yes' : 'No');
}

function detectDisplay() {
    setText('resolution', `${screen.width} x ${screen.height}`);
    setText('windowSize', `${window.innerWidth} x ${window.innerHeight}`);
    setText('pixelRatio', `${window.devicePixelRatio}x`);
    setText('colorDepth', `${screen.colorDepth}-bit`);
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setText('theme', prefersDark ? 'Dark' : 'Light');

    window.addEventListener('resize', () => {
        setText('windowSize', `${window.innerWidth} x ${window.innerHeight}`);
    });
}

function detectNetwork() {
    const updateOnline = () => {
        setHTML('onlineStatus', navigator.onLine ? 'Online' : 'Offline', navigator.onLine ? 'status-good' : 'status-bad');
    };
    updateOnline();
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);

    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
        setText('connectionType', conn.effectiveType ? conn.effectiveType.toUpperCase() : 'Unknown');
        setText('downlink', conn.downlink ? `${conn.downlink} Mbps` : 'N/A');
        setText('rtt', conn.rtt !== undefined ? `${conn.rtt} ms` : 'N/A');
    } else {
        setText('connectionType', 'API unavailable');
        setText('downlink', 'API unavailable');
        setText('rtt', 'API unavailable');
    }
}

function detectSecurity() {
    setHTML('protocol', location.protocol === 'https:' ? 'HTTPS (Secure)' : 'HTTP (Insecure)', location.protocol === 'https:' ? 'status-good' : 'status-warn');
    
    const dnt = navigator.doNotTrack;
    let dntText = 'Not set';
    if (dnt === '1') dntText = 'Enabled';
    else if (dnt === '0') dntText = 'Disabled';
    setText('dnt', dntText);

    setText('clipboard', navigator.clipboard ? 'Supported' : 'Not supported');
    setText('geolocation', navigator.geolocation ? 'Supported' : 'Not supported');

    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            const pct = Math.round(battery.level * 100);
            const state = battery.charging ? ' (Charging)' : '';
            setText('battery', `${pct}%${state}`);
        }).catch(() => setText('battery', 'Error'));
    } else {
        setText('battery', 'Not supported');
    }
}
