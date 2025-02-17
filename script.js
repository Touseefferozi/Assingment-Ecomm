// Image Slider
const slider = document.querySelector(".slider");
const images = document.querySelectorAll(".slider img");
let slideIndex = 0;

if (images.length > 0) {
  const imageWidth = images[0].offsetWidth;

  function slideImages() {
    slideIndex = (slideIndex + 1) % images.length;
    slider.style.transform = `translateX(${-slideIndex * imageWidth}px)`;
  }

  setInterval(slideImages, 3000);
}

// Wishlist Functionality
function addToWishlist(product) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("You must log in to use the wishlist.");
    window.location.href = "login.html";
    return;
  }

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (!wishlist.some(item => item.name === product.name)) {
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert("Product added to wishlist!");
    updateWishlistCount();
  } else {
    alert("Product is already in the wishlist!");
  }
}

function updateWishlistItem(index, newName, newPrice) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (index >= 0 && index < wishlist.length) {
    wishlist[index].name = newName;
    wishlist[index].price = newPrice;
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    renderWishlistItems();
  }
}

function deleteWishlistItem(index) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (index >= 0 && index < wishlist.length) {
    wishlist.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    renderWishlistItems();
    updateWishlistCount();
  }
}

function updateWishlistCount() {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const wishlistLink = document.querySelector('nav ul li a[href="wishlist.html"]');
  if (wishlistLink) {
    wishlistLink.textContent = `Wishlist (${wishlist.length})`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateWishlistCount();
  updateNavbar();
  renderWishlistItems();
});

function updateNavbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    const nav = document.querySelector("nav ul");
    nav.innerHTML = `
      <li><a href="index.html">Home</a></li>
      <li><a href="#">Products</a></li>
      <li><a href="wishlist.html">Wishlist</a></li>
      <li><a href="contact.html">Contact</a></li>
      <li><span>Welcome, ${user.name}</span></li>
      <li><button onclick="logout()">Logout</button></li>
      ${user.role === "admin" ? '<li><a href="admin.html">Dashboard</a></li>' : ''}
    `;
  }
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

function renderWishlistItems() {
  const wishlistItemsContainer = document.getElementById("wishlist-items");
  wishlistItemsContainer.innerHTML = "";
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  wishlist.forEach((item, index) => {
    const itemElement = document.createElement("div");
    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}" width="100">
      <p>${item.name}</p>
      <p>${item.price}</p>
      <button class="update-button" data-index="${index}">Update</button>
      <button class="delete-button" data-index="${index}">Delete</button>
    `;
    wishlistItemsContainer.appendChild(itemElement);

    itemElement.querySelector(".update-button").addEventListener("click", () => {
      const newName = prompt("Enter new product name:", item.name);
      const newPrice = prompt("Enter new product price:", item.price);
      if (newName && newPrice) {
        updateWishlistItem(index, newName, newPrice);
      }
    });

    itemElement.querySelector(".delete-button").addEventListener("click", () => {
      deleteWishlistItem(index);
    });
  });
}

document.querySelectorAll(".product-card button").forEach((button, index) => {
  button.addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please log in before adding products to the cart.");
      window.location.href = "login.html";
      return;
    }

    const product = {
      name: document.querySelectorAll(".product-card h3")[index].textContent,
      price: document.querySelectorAll(".product-card p")[index * 3 + 1]?.textContent || "Unknown",
      image: document.querySelectorAll(".product-card img")[index].src,
      userEmail: user.email,
    };
    addToWishlist(product);
  });
});

async function fetchUsers() {
  try {
    const response = await fetch("users.json");
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
