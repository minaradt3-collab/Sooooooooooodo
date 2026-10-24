(function(){
  // ====== PUT YOUR 6 PHOTOS HERE ======
  // Between the quotes, write the photo file name (put the photos in the same folder).
  // Example: "photo1.jpg". Leave "" to keep an empty frame.
  var PHOTOS = [
    "sodo (1).jpg",   // photo 1
    "sodo (2).jpg",   // photo 2
    "sodo.jpg",   // photo 3
    "sodooo (1).jpg",   // photo 4
    "sodooo (3).jpg",   // photo 5
    "sodooo (2).jpg"    // photo 6
  ];
  // =====================================

  var grid = document.getElementById("grid");
  for (var i = 0; i < 6; i++) {
    var f = document.createElement("div"); f.className = "frame pending";
    var p = document.createElement("label"); p.className = "photo"; p.tabIndex = 0;
    p.innerHTML = '<span>＋ Add photo</span><input type="file" accept="image/*">';
    (function(p){
      var input = p.querySelector("input");
      p.addEventListener("keydown", function(e){ if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); } });
      input.addEventListener("change", function(){
        var file = input.files && input.files[0]; if (!file) return;
        var img = p.querySelector("img") || document.createElement("img");
        img.alt = "A photo of us";
        img.src = URL.createObjectURL(file);
        p.appendChild(img);
      });
    })(p);
    if (PHOTOS[i]) {
      var im = document.createElement("img");
      im.alt = "A photo of us";
      im.src = PHOTOS[i];
      p.appendChild(im);
    }
    f.appendChild(p); grid.appendChild(f);
  }

  var HASH = "b523316951aa63662ec28fb837904af1bfba2a293c76f440a2c7cb0a26e4b773";
  var lock = document.getElementById("lock"), pw = document.getElementById("pw"), err = document.getElementById("err");
  function sha256(str){
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(str)).then(function(buf){
      return Array.prototype.map.call(new Uint8Array(buf), function(b){ return ("0" + b.toString(16)).slice(-2); }).join("");
    });
  }
  var site = document.getElementById("site"), opening = false;
  var song = document.getElementById("song"), musicBtn = document.getElementById("music");
  function fadeInSong(){
    song.volume = 0;
    var v = 0, t = setInterval(function(){
      v = Math.min(0.8, v + 0.04);
      song.volume = v;
      if (v >= 0.8) clearInterval(t);
    }, 150);
  }
  function syncMusicBtn(){
    var on = !song.paused && !song.muted;
    musicBtn.textContent = on ? "\u266A" : "\uD83D\uDD07";
    musicBtn.classList.toggle("off", !on);
  }
  musicBtn.addEventListener("click", function(){
    if (song.paused) { song.muted = false; song.volume = 0.8; song.play().catch(function(){}); }
    else { song.pause(); }
    syncMusicBtn();
  });

  function burst(){
    var reach = Math.min(window.innerWidth, window.innerHeight) * 0.55 + 80;
    for (var n = 0; n < 28; n++) {
      var b = document.createElement("span");
      b.className = "burst";
      b.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      var ang = (n / 28) * Math.PI * 2 + Math.random() * 0.4;
      var dist = reach * (0.55 + Math.random() * 0.6);
      b.style.fontSize = (20 + Math.random() * 24) + "px";
      b.style.setProperty("--x", Math.round(Math.cos(ang) * dist) + "px");
      b.style.setProperty("--y", Math.round(Math.sin(ang) * dist) + "px");
      b.style.setProperty("--r", Math.round(Math.random() * 120 - 60) + "deg");
      b.style.setProperty("--d", (1.3 + Math.random() * 0.9).toFixed(2) + "s");
      b.addEventListener("animationend", function(e){ e.target.remove(); });
      document.body.appendChild(b);
    }
  }
  function openSite(){
    if (opening) return;
    opening = true;
    if (reduce) { lock.remove(); site.hidden = false; return; }
    lock.classList.add("leaving");
    burst();
    setTimeout(function(){ site.hidden = false; site.classList.add("reveal"); }, 450);
    setTimeout(function(){ lock.remove(); }, 950);
  }
  function tryOpen(){
    song.muted = true;
    var started = song.play();
    if (started && started.catch) started.catch(function(){});
    sha256(pw.value.trim().toLowerCase()).then(function(h){
      if (h === HASH) {
        song.muted = false;
        if (song.paused) { var again = song.play(); if (again && again.catch) again.catch(function(){}); }
        fadeInSong();
        musicBtn.hidden = false;
        syncMusicBtn();
        openSite();
      } else {
        song.pause();
        song.currentTime = 0;
        err.textContent = "Not quite, try again.";
        lock.classList.remove("shake"); void lock.offsetWidth; lock.classList.add("shake");
        pw.select();
      }
    });
  }
  document.getElementById("go").addEventListener("click", tryOpen);
  pw.addEventListener("keydown", function(e){ if (e.key === "Enter") tryOpen(); });
  pw.focus();

  var sky = document.getElementById("sky");
  var emojis = ["❤️","💖","💕","💗","⭐","🌟","✨","💫","🩷"];
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function spawn(){
    if (document.hidden || reduce) return;
    var s = document.createElement("span");
    s.className = "float";
    s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    var size = 18 + Math.random() * 26;
    s.style.left = (Math.random() * 100) + "%";
    s.style.fontSize = size + "px";
    s.style.setProperty("--dur", (9 + Math.random() * 8).toFixed(1) + "s");
    s.style.setProperty("--sway", ((Math.random() * 80) - 40).toFixed(0) + "px");
    s.style.setProperty("--rot", ((Math.random() * 60) - 30).toFixed(0) + "deg");
    s.style.setProperty("--op", (0.55 + Math.random() * 0.4).toFixed(2));
    s.addEventListener("animationend", function(){ s.remove(); });
    sky.appendChild(s);
  }
  for (var k = 0; k < 8; k++) setTimeout(spawn, k * 350);
  setInterval(function(){ if (sky.children.length < 28) spawn(); }, 600);

  var frames = document.querySelectorAll(".frame");
  if (reduce || !("IntersectionObserver" in window)) {
    frames.forEach(function(f){ f.classList.remove("pending"); });
  } else {
    var queue = [], timer = null;
    var drain = function(){
      var el = queue.shift();
      if (!el) return;
      el.classList.remove("pending");
      el.classList.add("show");
      timer = setTimeout(function(){ timer = null; if (queue.length) drain(); }, 450);
    };
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting) { io.unobserve(en.target); queue.push(en.target); }
      });
      if (queue.length && !timer) drain();
    }, { threshold: 0.2 });
    frames.forEach(function(f){ io.observe(f); });
  }
})();
