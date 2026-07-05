/* =========================================================
   1. CONFIGURACION GENERAL
   Credenciales demo, teléfono de WhatsApp y contenido inicial.
   Para seguridad real, el login debe validarse en un servidor.
   ========================================================= */
const ADMIN_DEMO = {
    usuario: "admin@gda.com",
    password: "GDA-admin-2026"
};

const WHATSAPP_GDA = "5492604313196";

const CONTENIDO_INICIAL = {
    avisoTitulo: "Reunión especial de oración",
    avisoTexto: "Este miércoles nos reunimos para orar por las familias, la ciudad y los proyectos de la iglesia.",
    eventoTitulo: "Congreso de Adoradores GDA",
    eventoTexto: "Un fin de semana entero dedicado a capacitarnos y buscar la presencia de Dios junto a invitados especiales."
};

/* =========================================================
   2. REFERENCIAS A ELEMENTOS DEL HTML
   Guardamos los elementos que usa JavaScript para manipular
   menú, login, formulario de contacto y contenido editable.
   ========================================================= */
const botonMenuMobile = document.querySelector("#boton-menu-mobile");
const menuPrincipal = document.querySelector("#menu-principal");
const enlacesMenu = document.querySelectorAll("#menu-principal a");

const formularioContacto = document.querySelector("#formulario-contacto");

const formularioAdmin = document.querySelector("#admin-login-form");
const mensajeLogin = document.querySelector("#mensaje-login");
const botonMenuAdmin = document.querySelector(".boton-login-menu");
const panelAdmin = document.querySelector("#panel-admin");
const botonCerrarSesion = document.querySelector("#cerrar-sesion-admin");
const botonDestacarEvento = document.querySelector("#marcar-evento-destacado");
const botonRestaurarContenido = document.querySelector("#restaurar-contenido");
const formularioAdminContenido = document.querySelector("#formulario-admin-contenido");
const eventoPrincipal = document.querySelector(".evento-item");
const textosEditables = document.querySelectorAll("[data-admin-text]");

/* =========================================================
   3. MENU MOBILE
   Abre y cierra el menú en pantallas chicas. Al tocar un enlace,
   el menú se cierra para dejar visible la sección elegida.
   ========================================================= */
if (botonMenuMobile && menuPrincipal) {
    botonMenuMobile.addEventListener("click", function () {
        const menuAbierto = menuPrincipal.classList.toggle("menu-abierto");
        botonMenuMobile.setAttribute("aria-expanded", menuAbierto);
        botonMenuMobile.innerHTML = menuAbierto
            ? '<i class="fas fa-xmark"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    enlacesMenu.forEach(function (enlace) {
        enlace.addEventListener("click", function () {
            menuPrincipal.classList.remove("menu-abierto");
            botonMenuMobile.setAttribute("aria-expanded", "false");
            botonMenuMobile.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

/* =========================================================
   4. FORMULARIO DE CONTACTO A WHATSAPP
   Toma nombre, correo y mensaje. Luego arma una URL de WhatsApp
   para que la persona envíe el pedido desde su teléfono o PC.
   ========================================================= */
if (formularioContacto) {
    formularioContacto.addEventListener("submit", function (event) {
        event.preventDefault();

        const datos = new FormData(formularioContacto);
        const nombre = datos.get("nombre").trim();
        const email = datos.get("email").trim();
        const mensaje = datos.get("mensaje").trim();

        const textoWhatsApp = [
            "Hola GDA, quiero enviar una consulta o pedido de oración.",
            "",
            `👤 Nombre: ${nombre}`,
            `📧 Correo: ${email}`,
            `💬 Mensaje: ${mensaje}`
        ].join("%0A");

        const urlWhatsApp = `https://wa.me/${WHATSAPP_GDA}?text=${encodeURIComponent(textoWhatsApp).replace(/%250A/g, "%0A")}`;
        window.open(urlWhatsApp, "_blank");
        formularioContacto.reset();
    });
}

/* =========================================================
   5. FUNCIONES DEL LOGIN ADMIN
   Muestran mensajes, activan el panel y permiten cerrar sesión.
   ========================================================= */
function showMensajeLogin(texto, tipo) {
    if (!mensajeLogin) {
        return;
    }

    mensajeLogin.textContent = texto;
    mensajeLogin.className = `mensaje-login ${tipo}`;
}

function limpiarLogin() {
    if (!mensajeLogin) {
        return;
    }

    mensajeLogin.textContent = "";
    mensajeLogin.className = "mensaje-login";
}

function activarPanelAdmin() {
    sessionStorage.setItem("gdaAdminAutorizado", "true");

    if (formularioAdmin) {
        formularioAdmin.classList.add("oculto");
    }

    if (panelAdmin) {
        panelAdmin.classList.remove("oculto");
    }

    if (botonMenuAdmin) {
        botonMenuAdmin.textContent = "Admin activo";
    }

    cargarFormularioAdmin();
}

function cerrarSesionAdmin() {
    sessionStorage.removeItem("gdaAdminAutorizado");
    sessionStorage.removeItem("gdaEventoDestacado");

    if (formularioAdmin) {
        formularioAdmin.classList.remove("oculto");
        formularioAdmin.reset();
    }

    if (panelAdmin) {
        panelAdmin.classList.add("oculto");
    }

    if (botonMenuAdmin) {
        botonMenuAdmin.textContent = "Administradores";
    }

    if (eventoPrincipal) {
        eventoPrincipal.classList.remove("evento-destacado-admin");
    }

    limpiarLogin();
    window.location.hash = "";
}

/* =========================================================
   6. CONTENIDO EDITABLE CON LOCALSTORAGE
   Guarda avisos y evento en el navegador. Es una demo útil
   para practicar administración sin backend.
   ========================================================= */
function obtenerContenidoGuardado() {
    const contenidoGuardado = localStorage.getItem("gdaContenidoAdmin");

    if (!contenidoGuardado) {
        return { ...CONTENIDO_INICIAL };
    }

    try {
        return {
            ...CONTENIDO_INICIAL,
            ...JSON.parse(contenidoGuardado)
        };
    } catch (error) {
        localStorage.removeItem("gdaContenidoAdmin");
        return { ...CONTENIDO_INICIAL };
    }
}

function aplicarContenido(contenido) {
    textosEditables.forEach(function (elemento) {
        const clave = elemento.dataset.adminText;

        if (contenido[clave]) {
            elemento.textContent = contenido[clave];
        }
    });
}

function guardarContenido(contenido) {
    localStorage.setItem("gdaContenidoAdmin", JSON.stringify(contenido));
    aplicarContenido(contenido);
}

function cargarFormularioAdmin() {
    if (!formularioAdminContenido) {
        return;
    }

    const contenido = obtenerContenidoGuardado();
    formularioAdminContenido.elements.avisoTitulo.value = contenido.avisoTitulo;
    formularioAdminContenido.elements.avisoTexto.value = contenido.avisoTexto;
    formularioAdminContenido.elements.eventoTitulo.value = contenido.eventoTitulo;
    formularioAdminContenido.elements.eventoTexto.value = contenido.eventoTexto;
}

aplicarContenido(obtenerContenidoGuardado());

if (formularioAdminContenido) {
    formularioAdminContenido.addEventListener("submit", function (event) {
        event.preventDefault();

        const datos = new FormData(formularioAdminContenido);
        const nuevoContenido = {
            avisoTitulo: datos.get("avisoTitulo").trim(),
            avisoTexto: datos.get("avisoTexto").trim(),
            eventoTitulo: datos.get("eventoTitulo").trim(),
            eventoTexto: datos.get("eventoTexto").trim()
        };

        guardarContenido(nuevoContenido);
        showMensajeLogin("Cambios guardados en este navegador.", "exito");
    });
}

if (botonRestaurarContenido) {
    botonRestaurarContenido.addEventListener("click", function () {
        localStorage.removeItem("gdaContenidoAdmin");
        guardarContenido(CONTENIDO_INICIAL);
        cargarFormularioAdmin();
        showMensajeLogin("Textos restaurados.", "exito");
    });
}

/* =========================================================
   7. VALIDACION DEL FORMULARIO ADMIN
   Comprueba las credenciales demo y muestra el panel privado.
   ========================================================= */
if (formularioAdmin) {
    formularioAdmin.addEventListener("submit", function (event) {
        event.preventDefault();

        const datos = new FormData(formularioAdmin);
        const usuario = datos.get("usuario").trim();
        const password = datos.get("password").trim();

        const esAdministrador =
            usuario === ADMIN_DEMO.usuario && password === ADMIN_DEMO.password;

        if (!esAdministrador) {
            showMensajeLogin("Acceso denegado. Solo administradores autorizados.", "error");
            return;
        }

        showMensajeLogin("Acceso concedido. Bienvenido, administrador.", "exito");
        activarPanelAdmin();
        formularioAdmin.reset();
    });
}

/* =========================================================
   8. ESTADO DE SESION Y EVENTO DESTACADO
   sessionStorage recuerda el acceso solo mientras está abierta
   la pestaña actual del navegador.
   ========================================================= */
if (sessionStorage.getItem("gdaAdminAutorizado") === "true") {
    activarPanelAdmin();
}

if (sessionStorage.getItem("gdaEventoDestacado") === "true" && eventoPrincipal) {
    eventoPrincipal.classList.add("evento-destacado-admin");
}

if (botonDestacarEvento && eventoPrincipal) {
    botonDestacarEvento.addEventListener("click", function () {
        eventoPrincipal.classList.toggle("evento-destacado-admin");

        const estaDestacado = eventoPrincipal.classList.contains("evento-destacado-admin");
        sessionStorage.setItem("gdaEventoDestacado", estaDestacado);
    });
}

if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener("click", cerrarSesionAdmin);
}

/* =========================================================
   9. CIERRE RAPIDO DEL MODAL
   Permite cerrar el modal con la tecla Escape y limpia los
   mensajes cuando el usuario sale de la ventana.
   ========================================================= */
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && window.location.hash === "#login-modal") {
        window.location.hash = "";
        limpiarLogin();
    }
});
