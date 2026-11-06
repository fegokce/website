document.addEventListener("DOMContentLoaded", () => {
  const mobileToggle = document.getElementById("mobile-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navbar = document.getElementById("navbar");

  // Mobil Menü Aç/Kapat
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      mobileToggle.classList.toggle("active");
    });
  }

  // İç bağlantılar için yumuşak kaydırma
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        if (navMenu && navMenu.classList.contains("open")) {
          navMenu.classList.remove("open");
          mobileToggle.classList.remove("active");
        }
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Navbar Arka Plan Blur & Gölge
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.style.borderBottomColor = "rgba(56, 189, 248, 0.2)";
      navbar.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.4)";
    } else {
      navbar.style.borderBottomColor = "rgba(255, 255, 255, 0.08)";
      navbar.style.boxShadow = "none";
    }
  });

  // Scroll Spy Takibi
  const sections = document.querySelectorAll("section[id]");
  function scrollActive() {
    const scrollY = window.scrollY || window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150;
      const sectionId = current.getAttribute("id");
      const targetLink = document.querySelector(`.nav-menu a[href*='${sectionId}']`);

      if (targetLink && !targetLink.classList.contains("nav-btn")) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetLink.classList.add("active");
        } else {
          targetLink.classList.remove("active");
        }
      }
    });
  }
  window.addEventListener("scroll", scrollActive);

  // XSS & Girdi Sanitizasyonu
  function sanitizeInput(str) {
    return str
      .trim()
      .replace(/[&<>"']/g, (m) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[m]));
  }

  // Güvenli İletişim Formu Yönetimi
  const contactForm = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");
  const honeyField = document.getElementById("honey-field");

  if (contactForm && submitBtn) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // 1. Bot Tuzağı (Honeypot) Kontrolü
      if (honeyField && honeyField.value.trim() !== "") {
        console.warn("Spam girişimi engellendi.");
        submitBtn.textContent = "Mesaj Gönderildi ✓";
        contactForm.reset();
        return;
      }

      // 2. Flood / Rate Limiting Koruması (60 saniyelik limit)
      const lastSent = sessionStorage.getItem("last_msg_sent");
      const now = Date.now();
      if (lastSent && now - parseInt(lastSent, 10) < 60000) {
        const remaining = Math.ceil((60000 - (now - parseInt(lastSent, 10))) / 1000);
        submitBtn.textContent = `Lütfen ${remaining}sn bekleyin!`;
        submitBtn.style.background = "#f59e0b";
        return;
      }

      // 3. Veri Güvenliği & Temizliği
      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const messageInput = document.getElementById("message");

      const cleanName = sanitizeInput(nameInput.value);
      const cleanEmail = sanitizeInput(emailInput.value);
      const cleanMessage = sanitizeInput(messageInput.value);

      if (!cleanName || !cleanEmail || !cleanMessage) {
        alert("Lütfen tüm alanları geçerli bilgilerle doldurunuz.");
        return;
      }

      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Güvenli Bağlantıyla İletiliyor...";

      const payload = new FormData(contactForm);
      payload.set("name", cleanName);
      payload.set("email", cleanEmail);
      payload.set("message", cleanMessage);

      try {
        const response = await fetch("https://formsubmit.co/ajax/fegokce@outlook.com", {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: payload,
        });

        if (response.ok) {
          submitBtn.textContent = "Mesajınız Başarıyla İletildi! ✓";
          submitBtn.style.background = "#10b981";
          sessionStorage.setItem("last_msg_sent", Date.now().toString());
          contactForm.reset();

          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = "";
          }, 4000);
        } else {
          throw new Error("HTTP Status Error");
        }
      } catch (error) {
        submitBtn.textContent = "İletim Hatası! Tekrar Deneyin";
        submitBtn.style.background = "#ef4444";

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = "";
        }, 4000);
      }
    });
  }
});
