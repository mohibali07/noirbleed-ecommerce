document.addEventListener("DOMContentLoaded", () => {
    
    // --- GSAP Animations (for homepage only) ---
    // This code runs only if we are on the index.html page
    if (document.getElementById('preloader')) {
        gsap.registerPlugin(ScrollTrigger);

        // Preloader and Hero Animation
        const preloader = document.getElementById('preloader');
        const heroTitle = document.querySelector('.hero-title');
        const heroText = document.querySelector('.hero-text');
        const ctaButton = document.querySelector('.cta-button');

        // Initial state of hero elements (hidden)
        gsap.set([heroTitle, heroText, ctaButton], { y: 50, opacity: 0 });

        // This function hides the preloader and shows the hero content
        const hidePreloaderAndAnimateHero = () => {
            gsap.to(preloader, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    preloader.style.display = 'none';
                    document.body.classList.remove('no-scroll');

                    // Animate the hero section elements after preloader is gone
                    gsap.to([heroTitle, heroText, ctaButton], {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        stagger: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        };

        // Ensure the preloader stays for at least 3 seconds
        const preloaderDuration = 3000;
        const pageLoadTime = Date.now();

        window.addEventListener('load', () => {
            const timeElapsed = Date.now() - pageLoadTime;
            const remainingTime = preloaderDuration - timeElapsed;

            if (remainingTime > 0) {
                setTimeout(hidePreloaderAndAnimateHero, remainingTime);
            } else {
                hidePreloaderAndAnimateHero();
            }
        });

        document.body.classList.add('no-scroll');
    }

    // --- Cart Management Functions ---
    const getCart = () => {
        return JSON.parse(localStorage.getItem('cart')) || [];
    };

    const updateCartCount = () => {
        const cart = getCart();
        const cartCountElement = document.querySelector('.cart-link');
        if (cartCountElement) {
            cartCountElement.textContent = `Cart (${cart.length})`;
        }
    };
    
    // --- Custom Pop-up Notification Function ---
    const showNotification = (message) => {
        const popup = document.getElementById('notification-popup');
        const messageSpan = document.getElementById('notification-message');
        
        messageSpan.textContent = message;
        popup.classList.add('show');
        
        setTimeout(() => {
            popup.classList.remove('show');
        }, 3000); // Hides the pop-up after 3 seconds
    };

    updateCartCount();

    // --- Displaying products on the shop page ----
    const productListSection = document.getElementById("product-list");
    if (productListSection) {
        function displayProducts(productsArray) {
            productListSection.innerHTML = "";
            productsArray.forEach(product => {
                const productCard = document.createElement("div");
                productCard.classList.add("product-card");

                productCard.innerHTML = `
                    <a href="product-details.html?id=${product.id}">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>$${product.price.toFixed(2)}</p>
                    </a>
                `;
                productListSection.appendChild(productCard);
            });
        }
        
        displayProducts(products); // Assumes products.js is linked
    }
    
    // --- Displaying featured products on the homepage ----
    const featuredProductList = document.getElementById("featured-product-list");
    if (featuredProductList) {
        const featuredProducts = products.slice(0, 4); // Display the first 4 products
        featuredProducts.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            productCard.innerHTML = `
                <a href="product-details.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                </a>
            `;
            featuredProductList.appendChild(productCard);
        });
    }

    // ---- Displaying a single product on the details page ----
    const productDetailsContainer = document.getElementById("product-details-container");
    if (productDetailsContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const selectedProduct = products.find(product => product.id === productId);

        if (selectedProduct) {
            productDetailsContainer.innerHTML = `
                <div class="product-detail-card">
                    <img src="${selectedProduct.image}" alt="${selectedProduct.name}" class="product-detail-image">
                    <div class="product-detail-info">
                        <h2>${selectedProduct.name}</h2>
                        <p class="product-price">$${selectedProduct.price.toFixed(2)}</p>
                        <p class="product-description">${selectedProduct.description}</p>
                        <button id="add-to-cart-btn" class="add-to-cart-button">Add to Cart</button>
                    </div>
                </div>
            `;
            const addToCartBtn = document.getElementById("add-to-cart-btn");
            addToCartBtn.addEventListener("click", () => {
                const cart = getCart();
                cart.push(selectedProduct.id);
                localStorage.setItem('cart', JSON.stringify(cart));
                showNotification(selectedProduct.name); // Using the new function
                updateCartCount();
            });
        } else {
            productDetailsContainer.innerHTML = "<p>Product not found.</p>";
        }
    }

    // --- Displaying cart items on the cart page ---
    const cartItemsSection = document.getElementById("cart-items");
    const cartSummarySection = document.getElementById("cart-summary");

    if (cartItemsSection && cartSummarySection) {
        const cart = getCart();
        const cartProductCounts = cart.reduce((counts, productId) => {
            counts[productId] = (counts[productId] || 0) + 1;
            return counts;
        }, {});
        
        let cartTotal = 0;
        cartItemsSection.innerHTML = '';

        Object.keys(cartProductCounts).forEach(productId => {
            const product = products.find(p => p.id === productId);
            if (product) {
                const quantity = cartProductCounts[productId];
                const itemTotal = product.price * quantity;
                cartTotal += itemTotal;

                const cartItemHTML = `
                    <div class="cart-item">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="cart-item-details">
                            <h3>${product.name}</h3>
                            <p>Price: $${product.price.toFixed(2)}</p>
                            <div class="cart-quantity-controls">
                                <button class="quantity-change-btn" data-id="${product.id}" data-action="decrease">-</button>
                                <span>${quantity}</span>
                                <button class="quantity-change-btn" data-id="${product.id}" data-action="increase">+</button>
                            </div>
                            <button class="remove-item-btn" data-id="${product.id}">Remove</button>
                            <p class="cart-item-total">Total: $${itemTotal.toFixed(2)}</p>
                        </div>
                    </div>
                `;
                cartItemsSection.innerHTML += cartItemHTML;
            }
        });

        if (Object.keys(cartProductCounts).length === 0) {
            cartItemsSection.innerHTML = '<p>Your cart is empty.</p>';
            cartSummarySection.innerHTML = '';
        } else {
            cartSummarySection.innerHTML = `
                <h3>Order Summary</h3>
                <p>Total: $${cartTotal.toFixed(2)}</p>
                <a href="checkout.html" id="checkout-btn" class="checkout-button">Proceed to Checkout</a>
            `;
        }
        
        cartItemsSection.addEventListener('click', (event) => {
            const target = event.target;
            const productId = target.dataset.id;
            let cart = getCart();
            
            if (target.classList.contains('quantity-change-btn')) {
                const action = target.dataset.action;
                const index = cart.indexOf(productId);
                
                if (action === 'increase') {
                    cart.push(productId);
                } else if (action === 'decrease' && index !== -1) {
                    cart.splice(index, 1);
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                location.reload();
            } else if (target.classList.contains('remove-item-btn')) {
                cart = cart.filter(id => id !== productId);
                localStorage.setItem('cart', JSON.stringify(cart));
                location.reload();
            }
        });
    }

    // --- Checkout Page Logic ---
    const checkoutSummaryContainer = document.getElementById('checkout-summary-container');

    if (checkoutSummaryContainer) {
        const cart = getCart();

        if (cart.length === 0) {
            checkoutSummaryContainer.innerHTML = '<h3>Your cart is empty. Please add items to proceed.</h3>';
        } else {
            const cartProductCounts = cart.reduce((counts, productId) => {
                counts[productId] = (counts[productId] || 0) + 1;
                return counts;
            }, {});

            const lineItems = Object.keys(cartProductCounts).map(productId => {
                const product = products.find(p => p.id === productId);
                const quantity = cartProductCounts[productId];
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: product.name,
                        },
                        unit_amount: Math.round(product.price * 100),
                    },
                    quantity: quantity,
                };
            });
            
            const cartTotal = lineItems.reduce((sum, item) => sum + (item.price_data.unit_amount / 100) * item.quantity, 0);

            checkoutSummaryContainer.innerHTML = `
                <h3>Order Summary</h3>
                <ul>
                    ${Object.keys(cartProductCounts).map(productId => {
                        const product = products.find(p => p.id === productId);
                        const quantity = cartProductCounts[productId];
                        return `<li>${product.name} x${quantity} - $${(product.price * quantity).toFixed(2)}</li>`;
                    }).join('')}
                </ul>
                <p class="order-total">Total: $${cartTotal.toFixed(2)}</p>
                <button id="pay-now-btn" class="checkout-button">Place Order</button>
            `;

            const payNowBtn = document.getElementById('pay-now-btn');
            payNowBtn.addEventListener('click', (event) => {
                event.preventDefault(); // Default form submission ko rokne ke liye

                // Form validation (ek simple check)
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const card = document.getElementById('card-number').value;

                if (!name || !email || !card) {
                    alert('Please fill out all the details.');
                    return;
                }

                // Agar form bhara hua hai, toh order process karein
                // Kyunki yeh Cash on Delivery hai, isme koi online payment process nahi hoga.
                // Hum seedha success page par redirect karenge.
                
                // Sabse zaroori: Order place hone par cart ko empty karein
                localStorage.removeItem('cart');

                // Order confirmation page par redirect karein
                window.location.href = 'success.html';
            });
        }
    }
});