(() => {
  const publicPages = ["index.html", "user-login.html", "admin-login.html", ""];
  const currentPage = window.location.pathname.split("/").pop();
  const role = sessionStorage.getItem("needforgeRole");
  const normalizedRole = role === 'demo' ? 'member' : role;

  const isMemberPage = ["home.html", "genealogy.html", "products.html", "faq.html", "contact.html", "payment.html", "user-dashboard.html"].includes(currentPage);
  const isAdminPage = ["admin-dashboard.html", "admin-members.html", "admin-levels.html", "admin-payments.html", "admin-products.html", "admin-support.html", "admin-settings.html", "admin-site-content.html", "admin-access.html"].includes(currentPage);

  if (!publicPages.includes(currentPage)) {
    if (isMemberPage && normalizedRole !== "member") {
      window.location.replace("index.html");
      return;
    }
    if (isAdminPage && normalizedRole !== "admin") {
      window.location.replace("index.html");
      return;
    }
  }

  window.NeedForgeAuth = {
    login(roleName) {
      sessionStorage.setItem("needforgeRole", roleName === 'demo' ? 'member' : roleName);
    },
    logout() {
      sessionStorage.removeItem("needforgeRole");
      window.location.href = "index.html";
    }
  };

  document.addEventListener('click', (event) => {
    const logoutLink = event.target.closest('[data-logout="true"]');
    if (!logoutLink) return;
    event.preventDefault();
    window.NeedForgeAuth.logout();
  });
})();
