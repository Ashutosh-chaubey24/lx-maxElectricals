// modal
const modal = document.getElementById("quoteModal");
const openBtns = document.querySelectorAll(".openModalBtn");
const closeBtn2 = document.querySelector(".closeBtn");

openBtns.forEach(button => {
  button.addEventListener("click", async (e) => {
    e.preventDefault(); // 🔥 VERY IMPORTANT

    modal.style.display = "flex";

    const id = button.dataset.id;

    try {
      const res = await fetch(`/showinfomodal/${id}`);
      const data = await res.json();

      // Fill modal
      document.getElementById("title").textContent = data.title;
      document.getElementById("img").src = data.image;
      document.getElementById("height").textContent = data.height;
      document.getElementById("material").textContent = data.material;
      document.getElementById("productid").value = data._id;

    } catch (err) {
      console.error("Modal fetch error:", err);
    }
  });
});

// Close modal
closeBtn2.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});


// <!-- About script -->
// Simple count-up animation
function animateCounts(){
const els = document.querySelectorAll('.num[data-target]');
els.forEach(el=>{
const target = +el.getAttribute('data-target');
let current = 0;
const step = Math.max(1, Math.floor(target / 60));
const id = setInterval(()=>{
current += step;
if(current >= target){
el.textContent = target + (target === 100 ? '%' : '+');
clearInterval(id);
} else {
el.textContent = current + (target === 100 ? '%' : '+');
}
}, 14);
})
}
// Simple count-up animation
function animateCounts(){
const els = document.querySelectorAll('.num[data-target]');
els.forEach(el=>{
const target = +el.getAttribute('data-target');
let current = 0;
const step = Math.max(1, Math.floor(target / 60));
const id = setInterval(()=>{
current += step;
if(current >= target){
el.textContent = target + (target === 100 ? '%' : '+');
clearInterval(id);
} else {
el.textContent = current + (target === 100 ? '%' : '+');
}
}, 14);
})
}



// <!-- filter by image -->
  const categoryCards = document.querySelectorAll(".category-card");

  categoryCards.forEach(card => {
    card.addEventListener("click", () => {
      const category = card.dataset.filter;
      window.location.href = `/product?category=${category}`;
    });
  });
    function openCatalog() {
      window.open("/pdf/Lx Max Electricals.pdf", "_blank");
    }

// filter product
  const button = document.querySelectorAll(".filter-btn");

  button.forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-filter");
      window.location.href = `/product?category=${category}`;
    });
  });

// about

// Simple count-up animation
function animateCounts(){
const els = document.querySelectorAll('.num[data-target]');
els.forEach(el=>{
const target = +el.getAttribute('data-target');
let current = 0;
const step = Math.max(1, Math.floor(target / 60));
const id = setInterval(()=>{
current += step;
if(current >= target){
el.textContent = target + (target === 100 ? '%' : '+');
clearInterval(id);
} else {
el.textContent = current + (target === 100 ? '%' : '+');
}
}, 14);
})
}


// Trigger when section is in view
const obs = new IntersectionObserver(entries=>{
entries.forEach(e=>{ if(e.isIntersecting){ animateCounts(); obs.disconnect(); } })
}, {threshold:0.3});
obs.observe(document.querySelector('.section'));

