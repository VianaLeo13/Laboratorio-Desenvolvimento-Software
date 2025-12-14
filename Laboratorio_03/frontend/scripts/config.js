(function () {
    if (window.API_BASE_URL) return;

    window.API_BASE_URL =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
            ? 'http://localhost:8080'
            : 'https://laboratorio-desenvolvimento-software.onrender.com';
})();
