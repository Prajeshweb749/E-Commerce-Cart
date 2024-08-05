(function() {
    emailjs.init("aH8-BMZJQkKnQLmpk");
})();

// Show the cart section with an animation
function cart() {
    const cartSection = document.getElementById("cart-sec");
    cartSection.classList.remove('outro'); // Remove outro class to start intro animation
    cartSection.style.display = 'flex'; // Make cart section visible
    cartSection.classList.add('intro'); // Add intro class to animate in
    cartSection.style.overflowY = 'scroll'; // Enable vertical scrolling
    cartSection.style.overflowX = 'hidden'; // Disable horizontal scrolling
    document.body.style.overflow = 'hidden'; // Disable body scrolling
}

// Hide the cart section with an animation
function cartc() {
    const cartSection = document.getElementById("cart-sec");
    cartSection.classList.remove('intro'); // Remove intro class to start outro animation
    cartSection.classList.add('outro'); // Add outro class to animate out
    setTimeout(function() {
        cartSection.style.display = 'none'; // Hide cart section after animation
    }, 500); // Duration of the animation
    cartSection.style.overflow = 'hidden'; // Disable scrolling in cart section
    document.body.style.overflowY = 'scroll'; // Re-enable body scrolling
}

// Add an item to the cart
function add(button) {
    var parentdiv = document.getElementById("cart-items");
    var itemName = button.getAttribute("data-name");
    var itemPrice = button.getAttribute("data-price");
    var itemImg = button.parentElement.previousElementSibling.firstElementChild.src;

    // Prevent adding the item again if already added
    if (button.classList.contains('added')) return;

    // Update button state to indicate item is added
    button.classList.add('added');
    button.style.pointerEvents = 'none'; // Disable button to prevent re-adding

    // Create a new cart item element
    var newItem = document.createElement('div');
    newItem.classList.add('cart-item');
    newItem.innerHTML = `
        <img src="${itemImg}" alt="${itemName}">
        <div class="quantity">
            <button onclick="decrementQuantity(this)" id="decreasebtn">-</button>
            <span>1</span>
            <button onclick="incrementQuantity(this)">+</button>
        </div>
        <div class="item-details">
            <h2>${itemName}</h2>
            <p>₹ ${itemPrice}</p>
        </div>
        <div><h1 id='tp'>Total Price : ₹ ${itemPrice}</h1></div>
        <i onclick="removeItem(this)" class="fa-solid fa-xmark fa-lg remove-item"></i>
        <input type="hidden" class="item-price" value="${itemPrice}">
    `;
    parentdiv.appendChild(newItem);

    // Update total price and button state
    updateCartTotal();
    placeorderbtn();
}

// Increment the quantity of an item
function incrementQuantity(button) {
    updateQuantity(button, true); // Call helper function to handle increment
}

// Decrement the quantity of an item
function decrementQuantity(button) {
    updateQuantity(button, false); // Call helper function to handle decrement
}

// Helper function to update quantity and button state
function updateQuantity(button, increment) {
    var quantityElement = button.parentElement.querySelector('span');
    var currentQuantity = parseInt(quantityElement.textContent);
    var newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;

    // Update quantity and button state
    if (newQuantity > 0) {
        quantityElement.textContent = newQuantity;
        updateTotalPrice(button);
        updateCartTotal();
    }

    var decreasebtn = button.parentElement.querySelector('#decreasebtn');
    decreasebtn.style.cursor = newQuantity > 1 ? 'pointer' : 'not-allowed';
    decreasebtn.style.pointerEvents = newQuantity > 1 ? 'all' : 'none';
    decreasebtn.style.backgroundColor = newQuantity > 1 ? 'rebeccapurple' : 'gray';
}

// Update the total price for a specific item
function updateTotalPrice(button) {
    var quantityElement = button.parentElement.querySelector('span').textContent;
    var itemPriceElement = button.parentElement.parentElement.querySelector('.item-price');
    var itemPrice = parseFloat(itemPriceElement.value);
    var totalPriceElement = button.parentElement.nextElementSibling.nextElementSibling.firstElementChild;
    var totalPrice = quantityElement * itemPrice;
    totalPriceElement.innerText = "Total Price : ₹ " + totalPrice.toFixed(2);
}

// Update the total price of all items in the cart
function updateCartTotal() {
    var cartItems = document.querySelectorAll('.cart-item');
    var cartTotal = 0;

    cartItems.forEach(function(item) {
        var itemPriceElement = item.querySelector('.item-price');
        var itemQuantity = parseInt(item.querySelector('.quantity span').textContent);
        var itemPrice = parseFloat(itemPriceElement.value);
        cartTotal += itemPrice * itemQuantity;
    });

    document.getElementById('cart-total').innerText = "Total Price: ₹ " + cartTotal.toFixed(2);
}

// Update the "Place Order" button state based on cart items
function placeorderbtn() {
    var cartItemsDiv = document.getElementById('cart-items');
    var numberOfChildren = cartItemsDiv.children.length;
    var placeOrderButton = document.getElementById('placeorder');
    
    if (numberOfChildren >= 1) {
        placeOrderButton.style.backgroundColor = '#28cf4a'; // Green background for enabled
        placeOrderButton.style.pointerEvents = 'all';
        placeOrderButton.style.cursor = 'pointer';
    } else {
        placeOrderButton.style.backgroundColor = 'gray'; // Gray background for disabled
        placeOrderButton.style.pointerEvents = 'none';
        placeOrderButton.style.cursor = 'not-allowed';
    }
}

// Remove an item from the cart
function removeItem(icon) {
    var item = icon.parentElement;
    item.remove(); // Remove item from cart

    // Reset the style of the "Add to Cart" button
    var itemName = item.querySelector('h2').innerText;
    var addButtons = document.querySelectorAll('a[data-name="' + itemName + '"]');

    addButtons.forEach(function(button) {
        button.classList.remove('added');
        button.style.pointerEvents = 'all'; // Re-enable button
    });

    // Update total price and button state
    updateCartTotal();
    placeorderbtn();
}

// Place an order and send an email with cart details
function placeOrder() {
    var cartItems = document.getElementById("cart-items");
    var items = cartItems.getElementsByClassName("cart-item");
    var productDetails = '';
    var totalCartCost = 0;

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var productName = item.querySelector(".item-details h2").innerText;
        var productImage = item.querySelector("img").src;
        var productQuantity = parseInt(item.querySelector(".quantity span").innerText);
        var productTotalPrice = parseFloat(item.querySelector("#tp").innerText.split('₹ ')[1]);
        
        totalCartCost += productTotalPrice;

        var productDetail = `
        <div class="product">
            <img src="${productImage}">
            <h3>Product Name: ${productName}</h3>
            <h3>Quantity: ${productQuantity}</h3>
            <h3>Total Price: ₹ ${productTotalPrice.toFixed(2)}</h3>
        </div>`;

        productDetails += productDetail;
    }

    // Prepare the email parameters
    var templateParams = {
        product_details: productDetails,
        total_cart_cost: totalCartCost.toFixed(2)
    };

    // Send the email using EmailJS
    emailjs.send('service_6nm0teo', 'template_xgg60m1', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            alert('Order placed successfully!');
        }, function(error) {
            console.log('FAILED...', error);
            alert('Failed to place the order. Please try again.');
        });
}
