(() => {
  const publicPages = ["index.html", "user-login.html", "admin-login.html", ""];
  const currentPage = window.location.pathname.split("/").pop();
  if (!publicPages.includes(currentPage) && !sessionStorage.getItem("needforgeRole")) {
    window.location.replace("index.html");
  }
})();
