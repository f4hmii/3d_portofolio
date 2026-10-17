(() => {
  // Live clock on contact card
  const contactClock = document.getElementById("contact-local-time");
  function updateContactTime() {
    if (!contactClock) return;
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    contactClock.textContent = `${formatter.format(now)} WIB`;
  }
  if (contactClock) {
    updateContactTime();
    setInterval(updateContactTime, 1000);
  }

  // Copy email to clipboard
  const copyBtn = document.getElementById("copy-email-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = "fahmif3211@gmail.com";
      try {
        await navigator.clipboard.writeText(email);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = "<span>✓ Tersalin!</span>";
        copyBtn.style.color = "var(--lime)";
        copyBtn.style.borderColor = "var(--lime)";
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.style.removeProperty("color");
          copyBtn.style.removeProperty("border-color");
        }, 2200);
      } catch (err) {
        window.location.href = `mailto:${email}`;
      }
    });
  }

  // Contact form submission
  const contactForm = document.getElementById("contact-form");
  const formFeedback = document.getElementById("form-feedback");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const name = (formData.get("name") || "").toString().trim();
      const email = (formData.get("email") || "").toString().trim();
      const service = (formData.get("service") || "New Project").toString().trim();
      const message = (formData.get("message") || "").toString().trim();

      const subject = encodeURIComponent(`[Kolaborasi - ${service}] dari ${name || "Klien"}`);
      const body = encodeURIComponent(
        `Halo Zulfahmi,\n\nNama: ${name}\nEmail: ${email}\nLayanan: ${service}\n\nPesan:\n${message}\n\n---\nDikirim melalui formulir portofolio`
      );
      const mailtoUrl = `mailto:fahmif3211@gmail.com?subject=${subject}&body=${body}`;

      if (formFeedback) {
        formFeedback.hidden = false;
        formFeedback.textContent = `Terima kasih, ${name || "Teman"}! Email aplikasi Anda telah disiapkan. Membuka email...`;
      }

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 600);
    });
  }
})();
