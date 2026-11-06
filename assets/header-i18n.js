/* ============================================================
   SHARED HEADER I18N / LANGUAGE DROPDOWN LOGIC — facturio.ch
   Loaded by header-block.js after header markup is injected.
   ============================================================ */

(function(){
  var I18N = {
    en: { "nav.about":"About","nav.blog":"Blog","nav.signup":"Sign up","nav.signin":"Log in" },
    de: { "nav.about":"Über uns","nav.blog":"Blog","nav.signup":"Registrieren","nav.signin":"Anmelden" },
    fr: { "nav.about":"À propos","nav.blog":"Blog","nav.signup":"S'inscrire","nav.signin":"Se connecter" },
    it: { "nav.about":"Chi siamo","nav.blog":"Blog","nav.signup":"Registrati","nav.signin":"Accedi" }
  };
  var LANGS = { en:{code:"EN",name:"English"},de:{code:"DE",name:"Deutsch"},fr:{code:"FR",name:"Français"},it:{code:"IT",name:"Italiano"} };
  var LANG_KEY="facturio-lang";
  function detectLang(){
    var nav=(navigator.language||"").toLowerCase();
    if(nav.indexOf("de")===0)return"de";
    if(nav.indexOf("fr")===0)return"fr";
    if(nav.indexOf("it")===0)return"it";
    return"en";
  }
  function buildMenu(){
    var menu=document.getElementById("shMenu"); if(!menu)return;
    menu.innerHTML="";

    // Extract alternate URLs from <link rel="alternate" hreflang="..."> tags
    var alternates={};
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(function(link){
      var hl=link.getAttribute("hreflang");
      if(hl && hl!=="x-default") alternates[hl.replace("-CH","")]=link.getAttribute("href");
    });

    ["en","de","fr","it"].forEach(function(k){
      var a=document.createElement("a"); a.role="menuitem"; a.dataset.lang=k;
      a.innerHTML='<b>'+LANGS[k].code+'</b> <span>'+LANGS[k].name+'</span>';
      if(alternates[k]){
        a.href=alternates[k];
        // Update localStorage on click BEFORE navigation
        a.onclick=function(){ try{localStorage.setItem(LANG_KEY,k);}catch(e){} };
      }else{
        a.href="#"; a.onclick=function(e){e.preventDefault(); apply(k); };
      }
      menu.appendChild(a);
    });
  }
  function apply(l){
    var dict=I18N[l]||I18N.en;
    document.documentElement.lang=l;
    var els=document.querySelectorAll("[data-i18n]");
    for(var i=0;i<els.length;i++){
      var key=els[i].getAttribute("data-i18n");
      if(dict[key]!=null) els[i].textContent=dict[key];
    }
    var lbl=document.getElementById("shLangLabel"); if(lbl) lbl.textContent=LANGS[l].code;
    var menu=document.getElementById("shMenu");
    if(menu){
      menu.querySelectorAll("[data-lang]").forEach(function(b){
        var active=b.getAttribute("data-lang")===l;
        var t=b.querySelector(".sh-tick");
        if(active&&!t){var s=document.createElement("span"); s.className="sh-tick"; s.textContent="✓"; b.appendChild(s);}
        else if(!active&&t) t.remove();
      });
    }
    try{localStorage.setItem(LANG_KEY,l);}catch(e){}
    document.querySelectorAll('a[href*="app.facturio.ch/login"]').forEach(function(a){
      var u=new URL(a.href); u.searchParams.set('lang',l); a.href=u.toString();
    });
    var m=document.getElementById("shMenu"); if(m) m.classList.remove("open");
  }
  function updateNavHrefs(){
    var path=window.location.pathname;
    var lang='en';
    if(path.startsWith('/de/')) lang='de';
    else if(path.startsWith('/fr/')) lang='fr';
    else if(path.startsWith('/it/')) lang='it';
    var slugs={en:'about',de:'ueber-uns',fr:'a-propos',it:'chi-siamo'};
    var langPrefix = lang==='en' ? '' : '/'+lang;
    var aboutLink=document.querySelector('a.sh-link[data-i18n="nav.about"]');
    var blogLink=document.querySelector('a.sh-link[data-i18n="nav.blog"]');
    var logoLink=document.querySelector('a.sh-logo');
    if(aboutLink && aboutLink.getAttribute('href')==='/about'){
      aboutLink.href=langPrefix+'/'+slugs[lang];
    }
    if(blogLink && blogLink.getAttribute('href')==='/blog/'){
      blogLink.href=langPrefix+'/blog/';
    }
    if(logoLink && logoLink.getAttribute('href')==='/'){
      logoLink.href=langPrefix+'/';
    }
  }
  function init(){
    buildMenu();
    updateNavHrefs();
    // Detect language from URL path (page content is baked in this language)
    var path=window.location.pathname;
    var urlLang='en';
    if(path.startsWith('/de/')) urlLang='de';
    else if(path.startsWith('/fr/')) urlLang='fr';
    else if(path.startsWith('/it/')) urlLang='it';
    // Apply page language to header labels + dropdown state
    apply(urlLang);
    var btn=document.getElementById("shLang"); var m=document.getElementById("shMenu");
    if(btn){btn.onclick=function(e){e.stopPropagation(); var o=m.classList.toggle("open"); btn.setAttribute("aria-expanded",o?"true":"false");};}
    document.addEventListener("click",function(e){ if(!e.target.closest("#shLang")){ if(m) m.classList.remove("open"); var b=document.getElementById("shLang"); if(b) b.setAttribute("aria-expanded","false");} });
    if(m){ m.addEventListener("click",function(e){ if(e.target.closest("[data-lang]")){ m.classList.remove("open"); } }); }
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();
})();