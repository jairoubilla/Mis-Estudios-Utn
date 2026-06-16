// Capturamos el formulario por su ID
    const loginForm = document.getElementById('loginForm');
    const mensaje = document.getElementById('mensaje');

    // Cuando hacen clic en el botón Login
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        // Capturamos los valores que ingresó el usuario
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        // Validamos los datos ingresados
        if (user.trim() === '' || pass.trim() === '') {
            mensaje.style.color = '#FFFF99'; 
            mensaje.textContent = 'Por favor, completa todos los campos';
        } 
        else {
            // Mostramos mensaje de éxito
            mensaje.style.color = '#99ff99'; // Verde suave
            mensaje.textContent = `¡Bienvenido, ${user}!`;
            
            // Esperamos dos 2 segundos y limpiamos
            setTimeout(() => {
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
                mensaje.textContent = '';
            }, 2000);
        }
    });