document.addEventListener('DOMContentLoaded', function() {
  const element = document.querySelector('#your-element-id');
  if (element) {
    element.addEventListener('click', function() {
      console.log('Element clicked');
    });
  }

  window.addEventListener("scroll", () => {
    const styleSwitcher = document.querySelector(".style-switcher");
    if (styleSwitcher && styleSwitcher.classList.contains("open")) {
      styleSwitcher.classList.remove("open");
    }
  });

  const alternateStyles = document.querySelectorAll(".alternate-style");
  function setActiveStyle(color) {
    alternateStyles.forEach((style) => {
      if (color === style.getAttribute("title")) {
        style.removeAttribute("disabled");
      } else {
        style.setAttribute("disabled", "true");
      }
    });
  }

  /* Dark/Light Mode */
  const dayNight = document.querySelector(".day-night");
  if (dayNight) {
    dayNight.addEventListener("click", () => {
      const icon = dayNight.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-sun");
        icon.classList.toggle("fa-moon");
      }
      document.body.classList.toggle("dark");
    });

    window.addEventListener("load", () => {
      const icon = dayNight.querySelector("i");
      if (icon) {
        if (document.body.classList.contains("dark")) {
          icon.classList.add("fa-sun");
        } else {
          icon.classList.add("fa-moon");
        }
      }
    });
  }

  /* Typing Animation */
  const typedElement = new Typed(".typing", {
    strings: [
      "",
      "Designing and developing full-stack web applications.",
      "Delivering scalable and efficient digital solutions.",
      "Combining development and DevOps to drive innovation.",
      "Optimizing cloud infrastructure for modern applications.",
      "Turning ideas into impactful, user-friendly software.",
    ],
    typeSpeed: 100,
    backSpeed: 150,
    loop: true,
  });

  /* Changing Aside Active Link */
  const nav = document.querySelector(".nav");
  if (nav) {
    const navList = nav.querySelectorAll("li");
    const totalNavList = navList.length;
    const allSection = document.querySelectorAll(".section");
    const totalSection = allSection.length;

    navList.forEach((item, i) => {
      const a = item.querySelector("a");
      a.addEventListener("click", function () {
        removeBackSection();
        navList.forEach((listItem, j) => {
          const navAnchor = listItem.querySelector("a");
          if (navAnchor.classList.contains("active")) {
            addBackSection(j);
          }
          navAnchor.classList.remove("active");
        });
        this.classList.add("active");
        showSection(this);

        if (window.innerWidth < 1200) {
          asideSectionTogglerBtn();
        }
      });
    });

    function addBackSection(num) {
      if (allSection[num]) {
        allSection[num].classList.add("back-section");
      }
    }

    function removeBackSection() {
      allSection.forEach((section) => {
        section.classList.remove("back-section");
      });
    }

    function showSection(element) {
      allSection.forEach((section) => {
        section.classList.remove("active");
      });

      const target = element.getAttribute("href").split("#")[1];
      const targetSection = document.querySelector("#" + target);
      if (targetSection) {
        targetSection.classList.add("active");
      }
    }

    function updateNav(element) {
      navList.forEach((listItem) => {
        const navAnchor = listItem.querySelector("a");
        navAnchor.classList.remove("active");
        const target = element.getAttribute("href").split("#")[1];
        if (target === navAnchor.getAttribute("href").split("#")[1]) {
          navAnchor.classList.add("active");
        }
      });
    }

    // Make sure the hire-me button is available
    const hireMeButton = document.querySelector(".hire-me");
    if (hireMeButton) {
      hireMeButton.addEventListener("click", function () {
        const sectionIndex = this.getAttribute("data-section-index");
        showSection(this);
        updateNav(this);
        removeBackSection();
        addBackSection(sectionIndex);
      });
    }
  }

  /* Activating Mobile Menu */
  const navTogglerBtn = document.querySelector(".nav-toggler");
  const aside = document.querySelector(".aside");

  if (navTogglerBtn && aside) {
    navTogglerBtn.addEventListener("click", () => {
      asideSectionTogglerBtn();
    });

    function asideSectionTogglerBtn() {
      aside.classList.toggle("open");
      navTogglerBtn.classList.toggle("open");
      allSection.forEach((section) => {
        section.classList.toggle("open");
      });
    }
  }
});
