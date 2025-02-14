// Image Slider
const slider = document.querySelector(".slider");
const sliderContainer = document.querySelector(".slider-container");
let slideIndex = 0;
const images = document.querySelectorAll(".slider img");
const imageWidth = images[0].offsetWidth;

function slideImages() {
  slideIndex++;
  if (slideIndex >= images.length) {
    slideIndex = 0;
  }
  slider.style.transform = `translateX(${-slideIndex * imageWidth}px)`;
}

// Automatically slide images every 3 seconds
setInterval(slideImages, 3000);

// Wishlist Functionality
function addToWishlist(product) {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("You must log in to use the wishlist.");
    window.location.href = "login.html";
    return;
  }

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist.push(product);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  alert("Product added to wishlist!");
  updateWishlistCount();
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
  }
}

// Update Wishlist Count in Navbar
function updateWishlistCount() {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const wishlistCount = wishlist.length;
  const wishlistLink = document.querySelector(
    'nav ul li a[href="wishlist.html"]'
  );
  if (wishlistLink) {
    wishlistLink.textContent = `Wishlist (${wishlistCount})`;
  }
}

// Ensure Wishlist Count Updates on Page Load
document.addEventListener("DOMContentLoaded", () => {
  updateWishlistCount();
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
        `;
    if (user.role === "admin") {
      nav.innerHTML += `<li><a href="admin.html">Dashboard</a></li>`;
    }
  }
}

function logout() {
  window.location.href = "login.html";
}

// Render Wishlist Items
function renderWishlistItems() {
  const wishlistItemsContainer = document.getElementById("wishlist-items");
  wishlistItemsContainer.innerHTML = ""; // Clear existing items
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  wishlist.forEach((item, index) => {
    const itemElement = document.createElement("div");
    itemElement.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" width="100">
            <p>${item.name}</p>
            <p>${item.price}</p>
            <button class="update-button" data-index="${index}">Update</button>
            <button class="delete-button" data-index="${index}">Delete</button>
        `;
    wishlistItemsContainer.appendChild(itemElement);

    // Add Event Listeners for Update and Delete Buttons
    itemElement
      .querySelector(".update-button")
      .addEventListener("click", () => {
        const newName = prompt("Enter new product name:", item.name);
        const newPrice = prompt("Enter new product price:", item.price);
        if (newName && newPrice) {
          updateWishlistItem(index, newName, newPrice);
        }
      });

    itemElement
      .querySelector(".delete-button")
      .addEventListener("click", () => {
        deleteWishlistItem(index);
      });
  });
}

// Add to Cart Functionality
document.querySelectorAll(".product-card button").forEach((button, index) => {
  button.addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    // Redirect to Login if User is Not Logged In
    if (!user) {
      alert("Please log in before adding products to the cart.");
      window.location.href = "login.html";
      return;
    }

    // If User is Logged In, Add to Wishlist
    const productName =
      document.querySelectorAll(".product-card h3")[index].textContent;
    const productPrice =
      document.querySelectorAll(".product-card p")[index * 3 + 1].textContent; // Corrected index
    const productImage =
      document.querySelectorAll(".product-card img")[index].src;
    const product = {
      name: productName,
      price: productPrice,
      imageUrl: productImage,
      userEmail: user.email,
    };

    console.log("Adding product to wishlist...");
    addToWishlist(product);
  });
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
        `;
    if (user.role === "admin") {
      nav.innerHTML += `<li><a href="admin.html">Dashboard</a></li>`;
    }
  }
}

// Function to fetch user data from users.json
async function fetchUsers() {
  try {
    const response = await fetch("users.json");
    const users = await response.json();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Function to display user details in the sidebar
async function displayUserDetailsInSidebar() {
  const users = await fetchUsers();
  if (users.length > 0) {
    // Display details of the first user in the array
    const user = users[0];
    document.getElementById("user-name").textContent = user.name || "N/A";
    document.getElementById("user-email").textContent = user.email || "N/A";
  } else {
    document.getElementById("user-name").textContent = "No users found";
    document.getElementById("user-email").textContent = "No users found";
  }
}

// Modify the existing displayUserDetails function to only display the wishlist
function displayUserDetails() {
  const userList = document.getElementById("user-list");
  const users = getStoredUsers();

  users.forEach((user) => {
    const userDiv = document.createElement("div");
    userDiv.innerHTML = `
            <h3>Wishlist:</h3>
            <ul id="wishlist-${user.email.replace(
              /[@.]/g,
              "-"
            )}" class="wishlist-list">
                <!-- Wishlist items will be displayed here -->
            </ul>
        `;
    userList.appendChild(userDiv);

    displayWishlistItems(user.email);
  });
}

// Call fetchUsers and displayUserDetailsInSidebar when the page loads
document.addEventListener("DOMContentLoaded", () => {
  updateWishlistCount();
  updateNavbar();
  displayUserDetails();
  displayProductDetails();
  displayUserDetailsInSidebar();
});

// Function to populate the user list in the sidebar
async function populateUserList() {
  const users = await fetchUsers();
  const userListItems = document.getElementById("user-list-items");

  users.forEach((user) => {
    const listItem = document.createElement("li");
    listItem.textContent = user.name;
    listItem.style.cursor = "pointer";
    listItem.addEventListener("click", () => {
      document.getElementById("user-name").textContent = user.name || "N/A";
      document.getElementById("user-email").textContent = user.email || "N/A";
    });
    userListItems.appendChild(listItem);
  });
}

// Call fetchUsers and populateUserList when the page loads
document.addEventListener("DOMContentLoaded", () => {
  updateWishlistCount();
  updateNavbar();
  displayUserDetails();
  displayProductDetails();
  displayUserDetailsInSidebar();
  populateUserList();
});

// Add to cart functionality (example - adjust selector and logic as needed)
/*document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        // Check if the user is logged in
        if (!localStorage.getItem('loggedInUser')) {
            alert('Please log in to add products to your cart.');
            window.location.href = 'login.html'; // Redirect to login page
            return;
        }
        let productId = this.getAttribute('data-product-id');
        console.log('Adding product to cart:', productId);
        // Here you would typically add the product to the cart,
        // possibly using local storage or sending an AJAX request.
    });
});*/
