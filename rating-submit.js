(function () {
  async function saveRating(payload) {
    const supabaseUrl = window.RATE_ECODOCS_SUPABASE_URL;
    const supabaseAnonKey = window.RATE_ECODOCS_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Falta configurar Supabase. Revisa supabase-config.js con tu URL y ANON KEY."
      );
    }

    const response = await fetch(
      `${supabaseUrl.replace(/\/$/, "")}/rest/v1/ratings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "No se pudo guardar la evaluación.");
    }
  }

  function getSelectedRating() {
    const selected = document.querySelector('input[name="rating"]:checked');
    return selected ? Number(selected.value) : null;
  }

  window.handleSubmit = async function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const btn = form.querySelector(".btn-submit");
    const originalText = btn.textContent;
    const rating = getSelectedRating();

    if (!rating) {
      alert("Selecciona una puntuación antes de enviar.");
      return;
    }

    btn.textContent = "Enviando...";
    btn.disabled = true;

    const payload = {
      department: document.body.dataset.department || "Sin departamento",
      nombre: document.getElementById("nombre").value.trim() || null,
      email: document.getElementById("email").value.trim() || null,
      rating,
      comentarios: document.getElementById("mensaje").value.trim(),
      created_at: new Date().toISOString(),
      page: window.location.pathname.split("/").pop(),
      user_agent: navigator.userAgent,
    };

    try {
      await saveRating(payload);
      document.getElementById("formWrapper").style.display = "none";
      document.getElementById("successMsg").style.display = "block";
    } catch (error) {
      console.error("Error al guardar evaluación:", error);
      alert(
        "No se pudo guardar tu evaluación en este momento. Intenta nuevamente."
      );
      btn.textContent = originalText;
      btn.disabled = false;
    }
  };
})();
