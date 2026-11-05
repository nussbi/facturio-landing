/* Shared header injector — inlined HTML to avoid fetch issues */
(function(){
  console.log("header-block.js: START");
  document.documentElement.setAttribute("data-header-loaded", "true"); // Visual debug
  console.log("header-block.js: START - attribute added");
  var placeholder=document.getElementById("sh-placeholder");
  if(!placeholder){ console.log("header-block.js: no placeholder found"); return; }
  console.log("header-block.js: placeholder found, injecting header HTML");

  // Inlined header HTML (from /assets/header-block.html)
  var html='<!-- ============================================================\n   SHARED HEADER BLOCK — facturio.ch\n   Edit this one file to update the header on every external page\n   (main site + all blog posts, DE/FR/IT/EN).\n   app.facturio.ch is NOT included.\n   ============================================================ -->\n<style>\n/* Shared header — self-contained, no conflicts with page CSS */\n#shared-header{position:sticky;top:0;z-index:50;width:100%}\n#shared-header .sh-bar{border-bottom:none;background:#ffffff;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}\n#shared-header .sh-inner{display:flex;align-items:center;width:100%;max-width:1152px;margin:0 auto;padding:11px 14px;box-sizing:border-box}\n#shared-header .sh-left{display:flex;align-items:center;flex-shrink:0}\n#shared-header .sh-center{display:flex;align-items:center;gap:6px;flex-shrink:0}\n#shared-header .sh-right{display:flex;align-items:center;gap:10px;margin-left:auto;flex-shrink:0}\n#shared-header .sh-logo{font-size:18px;font-weight:700;letter-spacing:-.025em;line-height:1;white-space:nowrap;text-decoration:none;color:#111827;flex-shrink:0}\n#shared-header .sh-logo .grad{background-image:linear-gradient(to right,#4f46e5,#2563eb,#06b6d4);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}\n#shared-header .sh-center a.sh-link{font-size:12px;font-weight:500;color:#4b5563;text-decoration:none;white-space:nowrap;line-height:1;padding:6px 8px;border-radius:6px}\n#shared-header .sh-center a.sh-link:hover{color:#111827;background:#f3f4f6}\n#shared-header .sh-right a.sh-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:600;color:#fff;text-decoration:none;line-height:1;background-image:linear-gradient(to right,#4f46e5,#2563eb,#06b6d4);box-shadow:0 1px 2px rgba(0,0,0,.05)}\n#shared-header .sh-right a.sh-btn:hover{filter:brightness(1.08)}\n#shared-header .sh-lang{display:inline-flex;align-items:center;gap:4px;cursor:pointer;font-size:12px;font-weight:500;color:#4b5563;line-height:1;padding:6px 8px;border-radius:6px;position:relative}\n#shared-header .sh-lang:hover{background:#f3f4f6}\n#shared-header .sh-lang .sh-label{font-weight:500;color:#4b5563}\n#shared-header .sh-lang .sh-chev{font-size:9px;color:#6b7280}\n#shared-header .sh-menu{display:none;position:absolute;left:50%;transform:translateX(-50%);top:calc(100% + 6px);min-width:160px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 10px 25px rgba(0,0,0,.10);padding:6px;z-index:1000}\n#shared-header .sh-menu.open{display:block}\n#shared-header .sh-menu a{display:flex;align-items:center;gap:8px;width:100%;padding:8px 10px;font-size:14px;color:#374151;text-decoration:none;border-radius:6px}\n#shared-header .sh-menu a:hover{background:#f3f4f6}\n#shared-header .sh-menu a .sh-tick{margin-left:auto;color:#4f46e5;font-weight:700}\n@media(max-width:640px){\n  #shared-header .sh-inner{padding:9px 14px;flex-wrap:wrap;gap:8px}\n  #shared-header .sh-right{margin-left:auto}\n  #shared-header .sh-logo{font-size:16px}\n  #shared-header .sh-lang{font-size:12px;padding:6px 8px}\n}\n</style>\n\n<header id="shared-header">\n  <div class="sh-bar">\n    <div class="sh-inner">\n      <div class="sh-left">\n        <a href="/" class="sh-logo"><span class="grad">facturio.ch</span></a>\n      </div>\n      <div class="sh-center">\n        <a href="/about" class="sh-link" data-i18n="nav.about">About</a>\n        <a href="/blog/" class="sh-link" data-i18n="nav.blog">Blog</a>\n      </div>\n      <div class="sh-right">\n        <div class="sh-lang" id="shLang" role="group" aria-label="Language">\n          <span class="sh-label" id="shLangLabel">EN</span><span class="sh-chev">▾</span>\n          <div class="sh-menu" id="shMenu" role="menu"></div>\n        </div>\n        <a href="https://app.facturio.ch/login" class="sh-link sh-btn" data-i18n="nav.signin">Log in</a>\n      </div>\n    </div>\n  </div>\n</header>';

  console.log("header-block.js: injecting header HTML");
  placeholder.innerHTML=html;

  // Detect current language from URL - handles both /fr/ and /blog/fr/ patterns
  var path=window.location.pathname;
  var langMatch=path.match(/\/(en|de|fr|it)\//);
  var currentLang=langMatch?langMatch[1]:'en';
  console.log("header-block.js: currentLang:", currentLang);
  
  // Update navigation links with correct language prefix
  var aboutLink=placeholder.querySelector('a[data-i18n="nav.about"]');
  var blogLink=placeholder.querySelector('a[data-i18n="nav.blog"]');
  var langSlugs={en:'about',de:'ueber-uns',fr:'a-propos',it:'chi-siamo'};
  if(aboutLink){
    if(currentLang==='en'){
      aboutLink.href='/about';
      blogLink.href='/blog/';
    }else{
      aboutLink.href='/'+currentLang+'/'+langSlugs[currentLang];
      blogLink.href='/'+currentLang+'/blog/';
    }
  }

  // Load external i18n logic after header is injected
  var s=document.createElement("script");
  s.src="/assets/header-i18n.js";
  s.onload=function(){ console.log("header i18n loaded"); };
  s.onerror=function(e){ console.error("failed to load header i18n", e); };
  document.head.appendChild(s);
})();