// console.log("hello");



//     const modal = document.getElementById("quoteModal");
//     const openBtn = document.querySelectorAll(".openModalBtn");
//     const closeBtn = document.querySelector(".closeBtn");

//     // Open modal
//     openBtn.forEach( button =>{
//         button.addEventListener("click", async(btn) => {
//             console.log("btn was cliked")
//         modal.style.display = "flex";
//         console.log("hello btn was  clicked");
//         let id = button.dataset.id;
//         console.log(id)
//     console.log("Editing Product ID:", id);
//     // Fetch product details
//     let res = await fetch(`/showinfomodal/${id}`);
//     let data = await res.json();
//     console.log(data)
//     // fill modal
//     //  document.getElementById("edit_id").value = data._id;
//     document.getElementById("title").textContent = data.title;
//     document.getElementById("img").src = data.image;
//     document.getElementById("price").textContent = data.price;
//     document.getElementById("height").textContent= data.height;
//     document.getElementById("material").textContent= data.matetial;
//       document.getElementById("productid").value= data._id;
//     });
//     });
    

//     // Close modal
//     closeBtn.addEventListener("click", () => {
//         modal.style.display = "none";
//     });

//     // Close by clicking outside
//     window.addEventListener("click", (e) => {
//         if (e.target === modal) {
//             modal.style.display = "none";
//         }
//     });




// // Simple count-up animation
// function animateCounts(){
// const els = document.querySelectorAll('.num[data-target]');
// els.forEach(el=>{
// const target = +el.getAttribute('data-target');
// let current = 0;
// const step = Math.max(1, Math.floor(target / 60));
// const id = setInterval(()=>{
// current += step;
// if(current >= target){
// el.textContent = target + (target === 100 ? '%' : '+');
// clearInterval(id);
// } else {
// el.textContent = current + (target === 100 ? '%' : '+');
// }
// }, 14);
// })
// }


// // Trigger when section is in view
// const obs = new IntersectionObserver(entries=>{
// entries.forEach(e=>{ if(e.isIntersecting){ animateCounts(); obs.disconnect(); } })
// }, {threshold:0.3});
// obs.observe(document.querySelector('.section'));

//   // small client-side validation + pleasant interactions
//   (function(){
//     const form = document.getElementById('contactForm');
//     const submitBtn = document.getElementById('submitBtn');

//     function isEmail(val){
//       return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
//     }

//     function showError(input){
//       input.classList.add('error');
//       setTimeout(()=> input.classList.remove('error'), 2200);
//     }

//     form.addEventListener('submit', function(e){
//       e.preventDefault();
//       const name = form.name;
//       const email = form.email;
//       const message = form.message;

//       let ok = true;
//       if(!name.value.trim()){ showError(name); ok=false; }
//       if(!isEmail(email.value.trim())){ showError(email); ok=false; }
//       if(!message.value.trim()){ showError(message); ok=false; }

//       if(!ok) return;

//       // simulate send
//       submitBtn.disabled = true;
//       submitBtn.textContent = 'Sending...';

//       // fake send flow (replace with real fetch to your API)
//       setTimeout(()=>{
//         submitBtn.textContent = 'Message Sent ✓';
//         submitBtn.style.boxShadow = '0 8px 20px rgba(16, 80, 120, 0.06)';
//         form.reset();

//         // revert after a while
//         setTimeout(()=>{
//           submitBtn.disabled = false;
//           submitBtn.textContent = 'Send Message';
//         }, 2300);
//       }, 900);
//     });

//     // small improvement: remove error state on input
//     form.querySelectorAll('.field').forEach(f => {
//       f.addEventListener('input', ()=> f.classList.remove('error'));
//     });
//   })();
//   const categoryCards = document.querySelectorAll(".category-card");

//   categoryCards.forEach(card => {
//     card.addEventListener("click", () => {
//       const category = card.dataset.filter;
//       window.location.href = `/product?category=${category}`;
//     });
//   });
