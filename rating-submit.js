(function () {
  const cfg = window.EcoDocsConfig || {};
  const supabaseUrl = cfg.supabaseUrl;
  const supabaseAnonKey = cfg.supabaseAnonKey;
  const ratingsTable = cfg.ratingsTable || "ratings";

  const form = document.querySelector(".contact-form");
  const formWrapper = document.getElementById("formWrapper");
  const successMsg = document.getElementById("successMsg");

  if (!form) {
    return;
  }

  const submitButton = form.querySelector(".btn-submit");
  const submitDefaultText = submitButton ? submitButton.textContent : "Enviar evaluacion ->";
  const department = document.body.getAttribute("data-department") || "General";
  const nombreInput = document.getElementById("nombre");
  const emailInput = document.getElementById("email");
  const mensajeInput = document.getElementById("mensaje");

  const hasSupabaseClient = !!(window.supabase && window.supabase.createClient);
  if (!hasSupabaseClient) {
    alert("Falta cargar la libreria de Supabase (@supabase/supabase-js).");
    return;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    alert("Configura supabaseUrl y supabaseAnonKey en supabase-config.js.");
    return;
  }

  const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

  function getRatingValue() {
    const checked = form.querySelector('input[name="rating"]:checked');
    return checked ? Number(checked.value) : null;
  }

  async function saveRating(payload) {
    const result = await supabase.from(ratingsTable).insert(payload);
    if (result.error) {
      throw result.error;
    }
  }

  window.handleSubmit = async function handleSubmit(event) {
    event.preventDefault();

    const name = (nombreInput.value || "").trim();
    const email = (emailInput.value || "").trim();
    const rating = getRatingValue();
    const comment = (mensajeInput.value || "").trim();

    if (!email) {
      alert("Debes ingresar un correo.");
      return;
    }

    if (!rating) {
      alert("Selecciona una puntuacion.");
      return;
    }

    if (!comment) {
      alert("Ingresa un comentario.");
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Guardando evaluacion...";
    }

    try {
      await saveRating({
        department: department,
        rating: rating,
        comment: comment,
        user_email: email.toLowerCase(),
        user_name: name || null,
      });

      if (formWrapper) {
        formWrapper.style.display = "none";
      }
      if (successMsg) {
        successMsg.style.display = "block";
      }
    } catch (error) {
      alert(error.message || "No se pudo guardar la evaluacion.");
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitDefaultText;
      }
    }
  };
})();
