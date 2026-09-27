 /* Cross-browser Event Listener compatible with IE 6-11 and all modern browsers */
        function addEvent(el, type, fn) {
            if (el.addEventListener) {
                el.addEventListener(type, fn, false);
            } else if (el.attachEvent) {
                el.attachEvent('on' + type, fn);
            } else {
                el['on' + type] = fn;
            }
        }

        /* Cross-browser Text Setter (textContent vs innerText) */
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

        /* Cross-browser HTML Setter */
        function setHTML(id, html, className) {
            var el = document.getElementById(id);
            if (el) {
                el.innerHTML = html;
                if (className) {
                    el.className = 'value ' + className;
                }
            }
        }

        /* Safe String Trimming for IE 6-8 */
        function safeTrim(str) {
            if (!str) return '';
            return str.replace(/^\s+|\s+$/g, '');
        }

        function detectBrowser() {
            var ua = navigator.userAgent || '';
            var vendor = navigator.vendor || '';
            var name = 'Unknown';
            var version = 'Unknown';
            var engine = 'Unknown';
            var majorVersion = 0;

            // 1. Internet Explorer & IE Trident Detection (IE 6.0 - 11.0 + IE Document Modes)
            if (ua.indexOf('MSIE') !== -1 || ua.indexOf('Trident/') !== -1 || (window.ActiveXObject !== undefined)) {
                name = 'Internet Explorer';
                engine = 'Trident';

                // Version matching for IE
                var match = ua.match(/(?:MSIE\s|rv:)([\d.]+)/i);
                if (match) {
                    version = match[1];
                } else if (document.documentMode) {
                    version = document.documentMode.toString();
                }

                // Check IE document mode overrides
                if (document.documentMode) {
                    version = version + ' (Doc Mode: ' + document.documentMode + ')';
                }
            }
            // 2. Microsoft Edge (Legacy EdgeHTML vs Modern Blink)
            else if (ua.indexOf('Edg/') !== -1) {
                name = 'Microsoft Edge';
                engine = 'Blink';
                var match = ua.match(/Edg\/([\d.]+)/i);
                if (match) version = match[1];
            } else if (ua.indexOf('Edge/') !== -1) {
                name = 'Microsoft Edge (Legacy)';
                engine = 'EdgeHTML';
                var match = ua.match(/Edge\/([\d.]+)/i);
                if (match) version = match[1];
            }
            // 3. Firefox (FF 20 - 153+)
            else if (ua.indexOf('Firefox') !== -1 || ua.indexOf('FxiOS') !== -1) {
                name = 'Firefox';
                engine = 'Gecko';
                var match = ua.match(/(?:Firefox|FxiOS)\/([\d.]+)/i);
                if (match) version = match[1];
            }
            // 4. Opera / Opera Touch / Opera GX
            else if (ua.indexOf('OPR/') !== -1 || ua.indexOf('Opera') !== -1) {
                name = 'Opera';
                engine = (ua.indexOf('Presto') !== -1) ? 'Presto' : 'Blink';
                var match = ua.match(/(?:OPR|Opera)\/([\d.]+)/i);
                if (!match) match = ua.match(/Version\/([\d.]+)/i);
                if (match) version = match[1];
            }
            // 5. Chrome / Chromium (Chrome 15 - 150+)
            else if (ua.indexOf('Chrome') !== -1 || ua.indexOf('CriOS') !== -1) {
                name = 'Chrome';
                engine = 'Blink';
                var match = ua.match(/(?:Chrome|CriOS)\/([\d.]+)/i);
                if (match) version = match[1];
            }
            // 6. Safari
            else if (ua.indexOf('Safari') !== -1 && vendor.indexOf('Apple') !== -1) {
                name = 'Safari';
                engine = 'WebKit';
                var match = ua.match(/Version\/([\d.]+)/i);
                if (match) version = match[1];
            }

            // Extract Major Version
            majorVersion = parseInt(version, 10);
            if (isNaN(majorVersion)) majorVersion = 0;

            setText('browserName', name);
            setText('browserVersion', version);
            setText('browserMajorVer', majorVersion ? majorVersion.toString() : 'Unknown');
            setText('browserEngine', engine);

            // Determine software update status based on version targets
            var isUpToDate = false;
            var isLegacy = false;

            if (name === 'Chrome' && majorVersion >= 120) isUpToDate = true;
            else if (name === 'Firefox' && majorVersion >= 120) isUpToDate = true;
            else if (name === 'Microsoft Edge' && majorVersion >= 120) isUpToDate = true;
            else if (name === 'Safari' && majorVersion >= 17) isUpToDate = true;
            else if (name === 'Opera' && majorVersion >= 100) isUpToDate = true;
            else if (name === 'Internet Explorer') isLegacy = true;

            if (isLegacy) {
                setHTML('browserStatus', 'End of Life (Legacy)', 'status-bad');
            } else if (isUpToDate) {
                setHTML('browserStatus', 'Up to Date', 'status-good');
            } else if (majorVersion > 0) {
                setHTML('browserStatus', 'Outdated Version', 'status-warn');
            } else {
                setHTML('browserStatus', 'Unknown', 'status-info');
            }

            setText('cookies', navigator.cookieEnabled ? 'Enabled' : 'Disabled');
        }

        function detectOS() {
            var ua = navigator.userAgent || '';
            var platform = navigator.platform || '';
            var osName = 'Unknown';
            var osVersion = 'Unknown';
            var kernel = 'Unknown';

            // Detailed Windows NT Mapping Matrix
            if (ua.indexOf('Win') !== -1 || platform.indexOf('Win') !== -1) {
                osName = 'Windows';

                if (ua.indexOf('Windows NT 10.0') !== -1) {
                    // Windows 11 vs Windows 10 distinction
                    // Windows 11 uses NT 10.0 in User-Agent, can be refined with Sec-CH-UA if available
                    osVersion = 'Windows 10 / 11';
                    kernel = 'NT 10.0';
                } else if (ua.indexOf('Windows NT 6.3') !== -1) {
                    osVersion = 'Windows 8.1';
                    kernel = 'NT 6.3';
                } else if (ua.indexOf('Windows NT 6.2') !== -1) {
                    osVersion = 'Windows 8';
                    kernel = 'NT 6.2';
                } else if (ua.indexOf('Windows NT 6.1') !== -1) {
                    osVersion = 'Windows 7';
                    kernel = 'NT 6.1';
                } else if (ua.indexOf('Windows NT 6.0') !== -1) {
                    osVersion = 'Windows Vista';
                    kernel = 'NT 6.0';
                } else if (ua.indexOf('Windows NT 5.2') !== -1) {
                    osVersion = 'Windows Server 2003 / XP x64';
                    kernel = 'NT 5.2';
                } else if (ua.indexOf('Windows NT 5.1') !== -1) {
                    osVersion = 'Windows XP';
                    kernel = 'NT 5.1';
                } else if (ua.indexOf('Windows NT 5.01') !== -1) {
                    osVersion = 'Windows 2000 SP1+';
                    kernel = 'NT 5.01';
                } else if (ua.indexOf('Windows NT 5.0') !== -1) {
                    osVersion = 'Windows 2000';
                    kernel = 'NT 5.0';
                } else if (ua.indexOf('Windows NT 4.0') !== -1 || ua.indexOf('WinNT4.0') !== -1) {
                    osVersion = 'Windows NT 4.0';
                    kernel = 'NT 4.0';
                } else if (ua.indexOf('Windows NT 3.51') !== -1) {
                    osVersion = 'Windows NT 3.51';
                    kernel = 'NT 3.51';
                } else if (ua.indexOf('Windows 98') !== -1 || ua.indexOf('Win98') !== -1) {
                    osVersion = 'Windows 98';
                    kernel = 'MS-DOS 7.1';
                } else if (ua.indexOf('Windows 95') !== -1 || ua.indexOf('Win95') !== -1) {
                    osVersion = 'Windows 95';
                    kernel = 'MS-DOS 7.0';
                } else if (ua.indexOf('Windows ME') !== -1 || ua.indexOf('Win 9x 4.90') !== -1) {
                    osVersion = 'Windows ME';
                    kernel = 'MS-DOS 8.0';
                } else if (ua.indexOf('Windows Phone') !== -1) {
                    osVersion = 'Windows Phone';
                    var wpMatch = ua.match(/Windows Phone ([\d.]+)/i);
                    if (wpMatch) osVersion += ' ' + wpMatch[1];
                    kernel = 'Windows CE / NT';
                } else if (ua.indexOf('Windows CE') !== -1) {
                    osVersion = 'Windows CE';
                    kernel = 'CE';
                }
            }
            // macOS / Mac OS X
            else if (ua.indexOf('Mac') !== -1 || platform.indexOf('Mac') !== -1) {
                osName = 'macOS';
                var macMatch = ua.match(/Mac OS X ([\d_.]+)/i);
                if (macMatch) {
                    osVersion = macMatch[1].replace(/_/g, '.');
                } else {
                    osVersion = 'Classic / Mac OS';
                }
                kernel = 'Darwin / XNU';
            }
            // Android OS
            else if (ua.indexOf('Android') !== -1) {
                osName = 'Android';
                var andMatch = ua.match(/Android\s+([\d.]+)/i);
                if (andMatch) osVersion = andMatch[1];
                kernel = 'Linux Kernel';
            }
            // iOS (iPhone / iPad / iPod)
            else if (ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1 || ua.indexOf('iPod') !== -1) {
                osName = 'iOS';
                var iosMatch = ua.match(/OS ([\d_]+) like Mac OS X/i);
                if (iosMatch) {
                    osVersion = iosMatch[1].replace(/_/g, '.');
                }
                kernel = 'Darwin (Mobile)';
            }
            // Linux Distributions
            else if (ua.indexOf('Linux') !== -1 || platform.indexOf('Linux') !== -1) {
                osName = 'Linux';
                if (ua.indexOf('Ubuntu') !== -1) osVersion = 'Ubuntu Linux';
                else if (ua.indexOf('Debian') !== -1) osVersion = 'Debian Linux';
                else if (ua.indexOf('Fedora') !== -1) osVersion = 'Fedora Linux';
                else if (ua.indexOf('Red Hat') !== -1) osVersion = 'Red Hat Linux';
                else osVersion = 'Generic Linux';
                kernel = 'Linux';
            }
            // BSD Unix Systems
            else if (ua.indexOf('FreeBSD') !== -1) {
                osName = 'FreeBSD';
                kernel = 'FreeBSD Kernel';
            } else if (ua.indexOf('OpenBSD') !== -1) {
                osName = 'OpenBSD';
                kernel = 'OpenBSD Kernel';
            }

            setText('osName', osName);
            setText('osVersion', osVersion);
            setText('osKernel', kernel);

            // Device Type Detection
            var deviceType = 'Desktop';
            if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
                deviceType = 'Mobile';
            } else if (/iPad|Tablet|Nexus 7|Nexus 10/i.test(ua)) {
                deviceType = 'Tablet';
            }
            setText('deviceType', deviceType);

            // Language Detection
            var lang = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || 'Unknown';
            setText('language', lang);

            // Timezone Detection with safety try/catch block
            var tz = 'Unknown';
            try {
                if (window.Intl && Intl.DateTimeFormat) {
                    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
                } else {
                    var offset = new Date().getTimezoneOffset();
                    tz = 'UTC' + (offset <= 0 ? '+' : '-') + Math.abs(Math.floor(offset / 60));
                }
            } catch(e) {
                tz = 'Unavailable';
            }
            setText('timezone', tz);
        }

        function detectHardware() {
            // CPU Cores
            var cores = navigator.hardwareConcurrency ? navigator.hardwareConcurrency + ' Cores' : 'Not reported';
            setText('cpuCores', cores);

            // RAM
            var ram = navigator.deviceMemory ? '~' + navigator.deviceMemory + ' GB' : 'Not reported';
            setText('ram', ram);

            // GPU Detection using WebGL Context (safely isolated for legacy IE)
            var gpuName = 'Not Supported / Disabled';
            try {
                var canvas = document.createElement('canvas');
                if (canvas && canvas.getContext) {
                    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                    if (gl) {
                        var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                        if (debugInfo) {
                            gpuName = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                        } else {
                            gpuName = gl.getParameter(gl.RENDERER) || 'WebGL Supported';
                        }
                    }
                }
            } catch (e) {
                gpuName = 'Access Denied / Error';
            }
            setText('gpu', gpuName);

            // Touch Support
            var hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
            setText('touch', hasTouch ? 'Supported' : 'Not Supported');

            var touchPoints = navigator.maxTouchPoints || navigator.msMaxTouchPoints || (hasTouch ? 1 : 0);
            setText('touchPoints', touchPoints.toString());
        }

        function detectDisplay() {
            var screenWidth = screen.width || 0;
            var screenHeight = screen.height || 0;
            setText('resolution', screenWidth + ' x ' + screenHeight);

            var availWidth = screen.availWidth || 0;
            var availHeight = screen.availHeight || 0;
            setText('availResolution', availWidth + ' x ' + availHeight);

            // Viewport dimension calculations handling legacy IE box models
            var updateWindowSize = function() {
                var winW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0;
                var winH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
                setText('windowSize', winW + ' x ' + winH);
            };
            updateWindowSize();
            addEvent(window, 'resize', updateWindowSize);

            // Pixel Ratio
            var ratio = window.devicePixelRatio || 1;
            setText('pixelRatio', ratio + 'x');

            // Color Depth
            var colorDepth = screen.colorDepth || screen.pixelDepth || 'Unknown';
            setText('colorDepth', colorDepth + '-bit');

            // Color Scheme Preference (Dark / Light)
            var theme = 'Light / Standard';
            try {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    theme = 'Dark Theme';
                }
            } catch(e) {}
            setText('theme', theme);
        }

        function detectNetwork() {
            var updateOnline = function() {
                var isOnline = navigator.onLine;
                if (typeof isOnline === 'undefined') isOnline = true;
                setHTML('onlineStatus', isOnline ? 'Online' : 'Offline', isOnline ? 'status-good' : 'status-bad');
            };
            updateOnline();
            addEvent(window, 'online', updateOnline);
            addEvent(window, 'offline', updateOnline);

            // Protocol
            var isHttps = location.protocol === 'https:';
            setHTML('protocol', isHttps ? 'HTTPS (Secure)' : 'HTTP (Insecure)', isHttps ? 'status-good' : 'status-warn');

            // Connection API
            var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (conn) {
                setText('connectionType', conn.effectiveType ? conn.effectiveType.toUpperCase() : (conn.type || 'Unknown'));
                setText('downlink', conn.downlink ? conn.downlink + ' Mbps' : 'N/A');
            } else {
                setText('connectionType', 'N/A');
                setText('downlink', 'N/A');
            }

            // Do Not Track
            var dnt = navigator.doNotTrack || navigator.msDoNotTrack || window.doNotTrack;
            var dntText = 'Not Enabled';
            if (dnt === '1' || dnt === 'yes' || dnt === true) dntText = 'Enabled';
            setText('dnt', dntText);

            // Battery Status
            if (navigator.getBattery && window.Promise) {
                navigator.getBattery().then(function(battery) {
                    var pct = Math.round(battery.level * 100);
                    var state = battery.charging ? ' (Charging)' : '';
                    setText('battery', pct + '%' + state);
                })['catch'](function() {
                    setText('battery', 'Unavailable');
                });
            } else {
                setText('battery', 'Not Supported');
            }
        }

        function testFeatures() {
            var features = [
                { name: 'HTML5 Canvas', supported: !!window.HTMLCanvasElement },
                { name: 'WebGL', supported: (function() { try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch(e) { return false; } })() },
                { name: 'LocalStorage', supported: (function() { try { return 'localStorage' in window && window['localStorage'] !== null; } catch(e) { return false; } })() },
                { name: 'Service Worker', supported: ('serviceWorker' in navigator) },
                { name: 'WebAssembly', supported: (typeof WebAssembly === 'object') },
                { name: 'Promises', supported: (typeof Promise !== 'undefined') },
                { name: 'Fetch API', supported: (typeof fetch !== 'undefined') },
                { name: 'Flexbox', supported: (function() { var s = document.createElement('div').style; return 'flex' in s || 'webkitFlex' in s || 'msFlex' in s; })() },
                { name: 'CSS Grid', supported: (function() { var s = document.createElement('div').style; return 'grid' in s || 'msGrid' in s; })() },
                { name: 'Geolocation', supported: ('geolocation' in navigator) },
                { name: 'WebSockets', supported: ('WebSocket' in window || 'MozWebSocket' in window) }
            ];

            var container = document.getElementById('featureGrid');
            if (!container) return;

            var html = '';
            for (var i = 0; i < features.length; i++) {
                var f = features[i];
                var cls = f.supported ? 'feature-supported' : 'feature-unsupported';
                var symbol = f.supported ? '&#10004; ' : '&#10008; ';
                html += '<div class="feature-tag ' + cls + '">' + symbol + f.name + '</div>';
            }
            container.innerHTML = html;
        }

        function initDiagnostics() {
            var ua = navigator.userAgent || 'Unknown User-Agent';
            setText('rawUserAgent', ua);

            detectBrowser();
            detectOS();
            detectHardware();
            detectDisplay();
            detectNetwork();
            testFeatures();
        }

        // Safe Initialization across ancient IE and modern DOM
        addEvent(window, 'load', initDiagnostics);