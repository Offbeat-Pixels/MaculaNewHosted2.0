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


const slider = document.getElementById("slider");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let index = 0;
const totalSlides = document.querySelectorAll("#slider > div").length;

// Function to move slides
function updateSlider() {
  slider.style.transform = `translateX(-${index * 100}%)`;
}

// Next Slide
nextBtn.addEventListener("click", () => {
  if (index < totalSlides - 1) {
    index++;
  } else {
    index = 0; // Loop back to the first slide
  }
  updateSlider();
});

// Previous Slide
prevBtn.addEventListener("click", () => {
  if (index > 0) {
    index--;
  } else {
    index = totalSlides - 1; // Loop to the last slide
  }
  updateSlider();
});


