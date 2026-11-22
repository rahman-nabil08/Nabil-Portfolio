/* Theme bootstrap. Loaded in <head> (before the stylesheets) so the saved theme is applied
   before first paint = no flash of the wrong theme.
   - First visit (nothing saved): LIGHT mode, purple accent. Nothing is written to storage.
   - Storage is written ONLY when the visitor explicitly picks a theme or an accent.
   - Keys are namespaced (nr_*): generic keys like "theme" are shared with every other local
     project on the same origin (file:// or localhost) and can silently force dark mode. */
(function (w, root) {
  var THEME_KEY = 'nr_theme', ACCENT_KEY = 'nr_accent';
  var ACCENTS = ['crimson', 'blue', 'green', 'purple', 'orange'];

  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function write(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked: still works for this page */ } }

  function apply(theme, accent) {
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-bs-theme', theme);   /* lets Bootstrap's own components (modal, accordion, close button) follow the theme */
    root.setAttribute('data-accent', accent);
  }
  function savedTheme() { return read(THEME_KEY) === 'dark' ? 'dark' : 'light'; }   /* anything else = light */
  function savedAccent() { var a = read(ACCENT_KEY); return ACCENTS.indexOf(a) > -1 ? a : 'purple'; }

  apply(savedTheme(), savedAccent());

  w.NRTheme = {
    setTheme: function (t) { t = t === 'dark' ? 'dark' : 'light'; write(THEME_KEY, t); apply(t, root.getAttribute('data-accent')); },
    setAccent: function (a) { if (ACCENTS.indexOf(a) < 0) return; write(ACCENT_KEY, a); root.setAttribute('data-accent', a); }
  };

  /* keep other open tabs/pages in sync */
  w.addEventListener('storage', function (e) {
    if (e.key === THEME_KEY || e.key === ACCENT_KEY) apply(savedTheme(), savedAccent());
  });
})(window, document.documentElement);
