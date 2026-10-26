// Pantalla de carga (index.html): arranca la caída del logo cuando sus imágenes están
// listas (así no aparecen letras a medio caer con internet lento) y la quita cuando
// Flutter dibuja su primera pantalla, después de que la caída termine.
// Va en un archivo aparte porque la regla de seguridad (CSP) no permite código dentro de la página.
(function () {
  var carga = document.getElementById('carga');
  if (!carga) return;
  var MINIMO = 2100; // ms: lo que dura la animación del logo
  var inicio = Date.now();

  // Arranca cuando las imágenes están decodificadas, o a los 800 ms como máximo.
  var arrancado = false;
  function arrancar() {
    if (arrancado) return;
    arrancado = true;
    inicio = Date.now();
    carga.classList.add('listo');
  }
  var imagenes = Array.prototype.slice.call(carga.querySelectorAll('img'));
  Promise.all(imagenes.map(function (img) {
    return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
  })).then(arrancar);
  setTimeout(arrancar, 800);

  function quitar() {
    if (carga.classList.contains('fuera')) return;
    carga.classList.add('fuera');
    setTimeout(function () { carga.remove(); }, 500);
  }

  window.addEventListener('flutter-first-frame', function () {
    arrancar();
    setTimeout(quitar, Math.max(0, MINIMO - (Date.now() - inicio)));
  });
})();
