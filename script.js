document.addEventListener("DOMContentLoaded", () => {
  const mobileToggle = document.getElementById("mobile-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link, .nav-btn");
  const navbar = document.getElementById("navbar");

  // Mobil Menü Aç/Kapat
  mobileToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    mobileToggle.classList.toggle("active");
  });

  // Menüdeki linke tıklandığında mobilde menüyü kapat
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        mobileToggle.classList.remove("active");
      }
    });
  });

  // Navbar Arka Plan Bulanıklığı (Scroll efekti)
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.style.borderBottomColor = "rgba(56, 189, 248, 0.2)";
      navbar.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.4)";
    } else {
      navbar.style.borderBottomColor = "rgba(255, 255, 255, 0.08)";
      navbar.style.boxShadow = "none";
    }
  });

  // Aktif Sayfa Bölümü Takibi (Scroll Spy)
  const sections = document.querySelectorAll("section[id]");

  function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150;
      const sectionId = current.getAttribute("id");
      const targetLink = document.querySelector(
        `.nav-menu a[href*='${sectionId}']`
      );

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

  // İletişim Formu Gönderimi (FormSubmit API)
  const contactForm = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");

  if (contactForm && submitBtn) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = "Gönderiliyor...";

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(
          "https://formsubmit.co/ajax/fegokce@outlook.com",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
            },
            body: formData,
          }
        );

        if (response.ok) {
          submitBtn.textContent = "Mesajınız Başarıyla İletildi! ✓";
          submitBtn.style.background = "#10b981";
          contactForm.reset();

          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = "";
          }, 4000);
        } else {
          throw new Error("Form iletim hatası");
        }
      } catch (error) {
        submitBtn.textContent = "Hata Oluştu, Tekrar Deneyin!";
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
