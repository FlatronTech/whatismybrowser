// Should work with IE 6-11 ¯\_(ツ)_/¯

// Cross-browser event listener
function addEvent(el, type, fn) {
    if (el.addEventListener) {
        el.addEventListener(type, fn, false);
    } else if (el.attachEvent) {
        el.attachEvent('on' + type, fn);
    }
}

// Cross-browser text setter
function setText(id, text, className) {
    var el = document.getElementById(id);
    if (el) {
        if (typeof el.textContent !== 'undefined') {
            el.textContent = text;
        } else {
            el.innerText = text;
        }
        if (className) {
            el.className = 'value ' + className;
        }
    }
}

function setHTML(id, html, className) {
    var el = document.getElementById(id);
    if (el) {
        el.innerHTML = html;
        if (className) {
            el.className = 'value ' + className;
        }
    }
}

// 1. Browser Detection
function detectBrowser() {
    var ua = navigator.userAgent;
    var name = 'Unknown';
    var version = 'Unknown';
    var engine = 'Unknown';

    if (ua.indexOf('MSIE') !== -1 || ua.indexOf('Trident') !== -1) {
        name = 'Internet Explorer';
        var match = ua.match(/(?:MSIE |rv:)(\d+(\.\d+)?)/);
        version = match ? match[1] : 'Unknown';
        engine = 'Trident';
    } else if (ua.indexOf('Firefox') !== -1) {
        name = 'Firefox';
        var match = ua.match(/Firefox\/([0-9.]+)/);
        version = match ? match[1] : 'Unknown';
        engine = 'Gecko';
    } else if (ua.indexOf('Edg') !== -1) {
        name = 'Edge';
        var match = ua.match(/Edg\/([0-9.]+)/);
        version = match ? match[1] : 'Unknown';
        engine = 'Blink';
    } else if (ua.indexOf('Chrome') !== -1) {
        name = 'Chrome';
        var match = ua.match(/Chrome\/([0-9.]+)/);
        version = match ? match[1] : 'Unknown';
        engine = 'Blink';
    } else if (ua.indexOf('Safari') !== -1) {
        name = 'Safari';
        var match = ua.match(/Version\/([0-9.]+)/);
        version = match ? match[1] : 'Unknown';
        engine = 'WebKit';
    } else if (ua.indexOf('Opera') !== -1 || ua.indexOf('OPR') !== -1) {
        name = 'Opera';
        var match = ua.match(/(?:Opera|OPR)\/([0-9.]+)/);
        version = match ? match[1] : 'Unknown';
        engine = 'Blink';
    }

    setText('browserName', name);
    setText('browserVersion', version);
    setText('browserEngine', engine);

    var vNum = parseFloat(version);
    var isCurrent = false;
    
    if (name === 'Chrome' && vNum >= 120) isCurrent = true;
    else if (name === 'Edge' && vNum >= 120) isCurrent = true;
    else if (name === 'Firefox' && vNum >= 120) isCurrent = true;
    else if (name === 'Safari' && vNum >= 17) isCurrent = true;
    else if (name === 'Opera' && vNum >= 105) isCurrent = true;
    else if (name === 'Internet Explorer') isCurrent = false; // IE is not a new browser so its not up to date ¯\_(ツ)_/¯

    if (isNaN(vNum)) {
        setHTML('browserStatus', 'Unknown', 'status-warn');
    } else {
        setHTML('browserStatus', isCurrent ? 'Up to date' : 'Not up to date', isCurrent ? 'status-good' : 'status-warn');
    }

    setText('cookies', navigator.cookieEnabled ? 'Enabled' : 'Disabled');
}

// 2. OS Detection
function detectOS() {
    var ua = navigator.userAgent;
    var os = 'Unknown';

    if (ua.indexOf('Win') !== -1) os = 'Windows';
    else if (ua.indexOf('Mac') !== -1) os = 'macOS';
    else if (ua.indexOf('Linux') !== -1) os = 'Linux';
    else if (ua.indexOf('Android') !== -1) os = 'Android';
    else if (ua.indexOf('like Mac') !== -1) os = 'iOS';

    setText('osName', os);

    var device = 'Desktop';
    if (/Mobi|Android/i.test(ua)) device = 'Mobile';
    else if (/Tablet|iPad/i.test(ua)) device = 'Tablet';
    setText('deviceType', device);

    setText('language', navigator.userLanguage || navigator.language || 'Unknown');
    
    var tz = 'Unknown';
    try {
        if (window.Intl && Intl.DateTimeFormat) {
            tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
        }
    } catch(e) {}
    setText('timezone', tz);
}

// 3. Hardware
function detectHardware() {
    setText('cpuCores', navigator.hardwareConcurrency ? navigator.hardwareConcurrency + ' cores' : 'Unknown');
    setText('ram', navigator.deviceMemory ? '~' + navigator.deviceMemory + ' GB' : 'Not supported');

    var gpuName = 'Not detected';
    try {
        var canvas = document.createElement('canvas');
        var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                gpuName = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
        }
    } catch (e) {
        gpuName = 'Access denied';
    }
    setText('gpu', gpuName);

    var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    setText('touch', isTouch ? 'Yes' : 'No');
}

// 4. Display
function detectDisplay() {
    setText('resolution', screen.width + ' x ' + screen.height);
    setText('windowSize', document.documentElement.clientWidth + ' x ' + document.documentElement.clientHeight);
    setText('pixelRatio', (window.devicePixelRatio || 1) + 'x');
    setText('colorDepth', screen.colorDepth + '-bit');

    var theme = 'Light';
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = 'Dark';
    }
    setText('theme', theme);

    addEvent(window, 'resize', function() {
        setText('windowSize', document.documentElement.clientWidth + ' x ' + document.documentElement.clientHeight);
    });
}

// 5. Network
function detectNetwork() {
    var updateOnline = function() {
        var isOnline = navigator.onLine;
        setHTML('onlineStatus', isOnline ? 'Online' : 'Offline', isOnline ? 'status-good' : 'status-bad');
    };
    updateOnline();
    addEvent(window, 'online', updateOnline);
    addEvent(window, 'offline', updateOnline);

    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
        setText('connectionType', conn.effectiveType ? conn.effectiveType.toUpperCase() : 'Unknown');
        setText('downlink', conn.downlink ? conn.downlink + ' Mbps' : 'N/A');
        setText('rtt', (typeof conn.rtt !== 'undefined') ? conn.rtt + ' ms' : 'N/A');
    } else {
        setText('connectionType', 'API unavailable');
        setText('downlink', 'API unavailable');
        setText('rtt', 'API unavailable');
    }
}

// 6. Security & APIs
function detectSecurity() {
    var isHttps = location.protocol === 'https:';
    setHTML('protocol', isHttps ? 'HTTPS (Secure)' : 'HTTP (Insecure)', isHttps ? 'status-good' : 'status-warn');

    var dnt = navigator.doNotTrack || navigator.msDoNotTrack;
    var dntText = 'Not set';
    if (dnt === '1' || dnt === 'yes') dntText = 'Enabled';
    else if (dnt === '0') dntText = 'Disabled';
    setText('dnt', dntText);

    setText('clipboard', window.ClipboardEvent ? 'Supported' : 'Not supported');
    setText('geolocation', navigator.geolocation ? 'Supported' : 'Not supported');

    // Battery API requires Promises (Not natively in IE11)
    if (navigator.getBattery && window.Promise) {
        navigator.getBattery().then(function(battery) {
            var pct = Math.round(battery.level * 100);
            var state = battery.charging ? ' (Charging)' : '';
            setText('battery', pct + '%' + state);
        }).catch(function() {
            setText('battery', 'Error');
        });
    } else {
        setText('battery', 'Not supported');
    }
}
// Initialize the script
addEvent(window, 'load', function() {
    detectBrowser();
    detectOS();
    detectHardware();
    detectDisplay();
    detectNetwork();
    detectSecurity();
});
