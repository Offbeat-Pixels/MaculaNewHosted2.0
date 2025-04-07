// Intersection Observer for fade-in animations
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target); // Stop observing once animation is triggered
    }
  });
}, observerOptions);

// Observe all elements with animate-fade-in class
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(".animate-fade-in");
  animatedElements.forEach((el) => observer.observe(el));
});

 

function loadComponent(id, file, callback) {
  console.log(`Loading ${file} into #${id}...`);

  fetch(file)
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to load ${file}`);
      return response.text();
    })
    .then((data) => {
      console.log(`Fetched ${file} successfully.`);
      if (typeof DOMPurify !== "undefined") {
        data = DOMPurify.sanitize(data);
      } else {
        console.warn("DOMPurify is missing, skipping sanitization.");
      }

      const element = document.getElementById(id);
      if (!element) {
        console.error(`Element #${id} not found on this page.`);
        return;
      }

      element.innerHTML = data;
      if (callback) callback();
    })
    .catch((error) => console.error(`Error loading ${file}:`, error));
}


// Define Navbar function
function Navbar() {
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  
  // Service dropdown elements
  const mobileServiceBtn = document.getElementById("mobile-service-btn");
  const mobileDropdown = document.getElementById("mobile-dropdown");
  const serviceArrow = document.getElementById("service-arrow");
  
  // About dropdown elements
  const mobileAboutBtn = document.getElementById("mobile-about-btn");
  const mobileAboutDropdown = document.getElementById("mobile-about-dropdown");
  const aboutArrow = document.getElementById("about-arrow");
  
  // Blog dropdown elements
  const mobileBlogBtn = document.getElementById("mobile-blog-btn");
  const mobileBlogDropdown = document.getElementById("mobile-blog-dropdown");
  const blogArrow = document.getElementById("blog-arrow");

  // Toggle mobile menu
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Toggle service dropdown
  if (mobileServiceBtn && mobileDropdown && serviceArrow) {
    mobileServiceBtn.addEventListener("click", () => {
      mobileDropdown.classList.toggle("hidden");
      serviceArrow.innerHTML = mobileDropdown.classList.contains("hidden")
        ? "&#9660;" // Down Arrow
        : "&#9650;"; // Up Arrow
    });
  }
  
  // Toggle about dropdown
  if (mobileAboutBtn && mobileAboutDropdown && aboutArrow) {
    mobileAboutBtn.addEventListener("click", () => {
      mobileAboutDropdown.classList.toggle("hidden");
      aboutArrow.innerHTML = mobileAboutDropdown.classList.contains("hidden")
        ? "&#9660;" // Down Arrow
        : "&#9650;"; // Up Arrow
    });
  }
  
  // Toggle blog dropdown
  if (mobileBlogBtn && mobileBlogDropdown && blogArrow) {
    mobileBlogBtn.addEventListener("click", () => {
      mobileBlogDropdown.classList.toggle("hidden");
      blogArrow.innerHTML = mobileBlogDropdown.classList.contains("hidden")
        ? "&#9660;" // Down Arrow
        : "&#9650;"; // Up Arrow
    });
  }
}

// Initialize navbar when DOM content is loaded
document.addEventListener("DOMContentLoaded", Navbar);

// Load Navbar first and initialize it
loadComponent("navbar", "Navbar.html", () => {
  Navbar();  
});
loadComponent("footer", "Footer.html", () => {
  Footer();  
});

// Function to dynamically load config.js
function loadConfig(callback) {
  if (window.ENV) {
    if (callback) callback();
    return;
  }

  const script = document.createElement("script");
  script.src = "config.js";
  script.onload = () => {
    if (window.ENV?.API_URL) {
      if (callback) callback();
    } else {
      console.error("API_URL is not defined. Check config.js!");
    }
  };
  script.onerror = () => {
    console.error("Failed to load config.js. Check the file path.");
  };

  document.head.appendChild(script);
}

// Ensure config loads first, then execute the form submission logic
loadConfig(() => {
  loadComponent("footer", "Footer.html", () => {
    const form = document.getElementById("contactForm");
    if (!form) {
      console.error("Form not found after footer load!");
      return;
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitButton = form.querySelector("button[type='submit']");
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";

      const formData = new FormData(form);
      const data = new URLSearchParams();
      formData.forEach((value, key) => data.append(key, value));

      if (!window.ENV?.API_URL) {
        console.error("API_URL is not defined. Ensure config.js is loaded.");
        alert("Configuration error: API URL is missing.");
        submitButton.disabled = false;
        submitButton.textContent = "Submit";
        return;
      }

      const webAppUrl = window.ENV.API_URL;

      try {
        const response = await fetch(webAppUrl, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: data.toString(),
        });

        const text = await response.text();

        if (response.ok && text.includes("success")) {
          alert("Your message has been successfully submitted!");
          form.reset();
        } else {
          alert("Error submitting the form. Check logs.");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        alert(
          "There was an error submitting your message. Please check the console."
        );
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit";
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");

  function validateInput(input, regex, errorMessage) {
    const errorElement = input.nextElementSibling;
    if (!regex.test(input.value.trim())) {
      errorElement.textContent = errorMessage;
      errorElement.classList.remove("hidden");
      return false;
    } else {
      errorElement.classList.add("hidden");
      return true;
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;

    // Name validation: Only letters, min 2 characters
    const nameValid = validateInput(
      document.getElementById("name"),
      /^[a-zA-Z\s]{2,}$/,
      "Enter a valid name (only letters, at least 2 characters)."
    );

    // Email validation
    const emailValid = validateInput(
      document.getElementById("email"),
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Enter a valid email address."
    );

    // Phone number validation: 10-15 digits
    const phoneValid = validateInput(
      document.getElementById("phone"),
      /^[0-9]{10,15}$/,
      "Enter a valid phone number (10-15 digits)."
    );

    // Message validation: Min 10 characters
    const messageValid = validateInput(
      document.getElementById("message"),
      /^.{10,}$/,
      "Message must be at least 10 characters long."
    );

    // Check if all fields are valid
    isValid = nameValid && emailValid && phoneValid && messageValid;

    if (isValid) {
      console.log("Form is valid. Submitting...");
      form.submit(); // Only submit if all validations pass
    } else {
      console.log("Form has errors. Fix them before submitting.");
    }
  });
});


// Select all buttons with class "ripple"
const rippleButtons = document.querySelectorAll("#ripple");

rippleButtons.forEach((button) => {
  button.addEventListener("mouseover", function (e) {
    // Create a new span element for each ripple
    let ripples = document.createElement("span");
    ripples.classList.add("ripple-effect"); // Add a class for styling

    // Get mouse position relative to button
    let x = e.clientX - button.getBoundingClientRect().left;
    let y = e.clientY - button.getBoundingClientRect().top;

    // Set position of ripple
    ripples.style.left = x + "px";
    ripples.style.top = y + "px";

    // Append ripple to the button
    button.appendChild(ripples);

    // Remove ripple after animation completes
    setTimeout(() => {
      ripples.remove();
    }, 1000);
  });

  // Remove ripple when mouse leaves
  button.addEventListener("mouseout", function () {
    const ripple = button.querySelector(".ripple-effect");
    if (ripple) {
      ripple.remove();
    }
  });
});



  
 document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('contactForm');
            
            form.addEventListener('submit', async function (event) {
                event.preventDefault();
                
                // Get submit button and response message elements
                const submitButton = document.querySelector('button[type="submit"]');
                const responseMessage = document.createElement('div');
                form.appendChild(responseMessage);
                
                // Reset previous response message
                responseMessage.textContent = "";
                responseMessage.className = ""; // Clear previous classes
                
                // Disable submit button and change text
                submitButton.textContent = "Submitting...";
                submitButton.disabled = true;

                // Collect form data
                const formData = new FormData(form);
                const data = {
                    'name': formData.get('name'),
                    'email': formData.get('email'),
                    'subject': formData.get('subject'),
                    'phone': formData.get('phone'),
                    'message': formData.get('message')
                };

                try {
                    // Replace with your Google Apps Script Web App URL
                    const response = await fetch(
                      "https://all-websiteformsdata.offbeatpixels.workers.dev/",
                      {
                        method: "POST",
                        mode: "no-cors", // Important for Google Sheets submission
                        cache: "no-cache",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                      }
                    );

                    // Success handling (note: no-cors mode prevents reading response)
                    responseMessage.textContent = "Your message has been successfully submitted!";
                    responseMessage.className = "text-green-600 mt-4";
                    form.reset(); // Reset form fields
                } catch (error) {
                    // Error handling
                    responseMessage.textContent = "There was an error submitting your message. Please try again.";
                    responseMessage.className = "text-red-600 mt-4";
                    console.error('Error:', error);
                } finally {
                    // Restore submit button
                    submitButton.textContent = "Submit Now!";
                    submitButton.disabled = false;
                }
            });
        });