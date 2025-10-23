// ===== jQuery Document Ready =====
$(document).ready(function() {
    
    // ===== Navigation Scroll Effect =====
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });

    // ===== Mobile Menu Toggle =====
    $('#hamburger').click(function() {
        $(this).toggleClass('active');
        $('#navMenu').toggleClass('active');
    });

    // Close mobile menu when clicking a link
    $('.nav-link').click(function() {
        $('#hamburger').removeClass('active');
        $('#navMenu').removeClass('active');
    });

    // ===== Smooth Scrolling =====
    $('.smooth-scroll').click(function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        
        if (target.indexOf('#') !== -1) {
            var targetSection = target.split('#')[1];
            $('html, body').animate({
                scrollTop: $('#' + targetSection).offset().top - 60
            }, 800);
        }
    });

    // ===== Animated Counter =====
    let counterAnimated = false;
    
    function animateCounters() {
        if (counterAnimated) return;
        
        $('.counter').each(function() {
            const $this = $(this);
            const target = parseInt($this.attr('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(function() {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                $this.text(Math.floor(current) + '+');
            }, 16);
        });
        
        counterAnimated = true;
    }

    // Trigger counter animation when stats section is visible
    $(window).scroll(function() {
        if ($('.stats').length) {
            const statsTop = $('.stats').offset().top;
            const statsHeight = $('.stats').height();
            const scrollTop = $(window).scrollTop();
            const windowHeight = $(window).height();
            
            if (scrollTop + windowHeight > statsTop + (statsHeight / 2)) {
                animateCounters();
            }
        }
    });

    // ===== Fade-in Animation on Scroll =====
    function fadeInOnScroll() {
        $('.fade-in').each(function() {
            const elementTop = $(this).offset().top;
            const windowBottom = $(window).scrollTop() + $(window).height();
            
            if (elementTop < windowBottom - 100) {
                $(this).css({
                    'opacity': '1',
                    'transform': 'translateY(0)'
                });
            }
        });
    }

    $(window).scroll(fadeInOnScroll);
    fadeInOnScroll();

    // ===== Contact Form Validation and Submission =====
    $('#contactForm').submit(function(e) {
        e.preventDefault();
        
        // Clear previous errors
        $('.form-error').text('');
        let isValid = true;

        // Validate Name
        const name = $('#name').val().trim();
        if (name.length < 3) {
            $('#nameError').text('Name must be at least 3 characters');
            isValid = false;
        }

        // Validate Email
        const email = $('#email').val().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            $('#emailError').text('Please enter a valid email address');
            isValid = false;
        }

        // Validate Phone
        const phone = $('#phone').val().trim();
        const phoneRegex = /^[0-9+\-\s()]{8,}$/;
        if (!phoneRegex.test(phone)) {
            $('#phoneError').text('Please enter a valid phone number');
            isValid = false;
        }

        // Validate Message
        const message = $('#message').val().trim();
        if (message.length < 10) {
            $('#messageError').text('Message must be at least 10 characters');
            isValid = false;
        }

        if (isValid) {
            // Submit form via AJAX
            $.ajax({
                type: 'POST',
                url: 'contact.php',
                data: $(this).serialize(),
                beforeSend: function() {
                    $('#contactForm button[type="submit"]').text('Sending...');
                },
                success: function(response) {
                    $('#formResponse').removeClass('error').addClass('success');
                    $('#formResponse').html('<strong>Success!</strong> Your message has been sent. We\'ll get back to you soon!');
                    $('#contactForm')[0].reset();
                    
                    // Hide success message after 5 seconds
                    setTimeout(function() {
                        $('#formResponse').fadeOut(function() {
                            $(this).removeClass('success').html('');
                            $(this).show();
                        });
                    }, 5000);
                },
                error: function() {
                    $('#formResponse').removeClass('success').addClass('error');
                    $('#formResponse').html('<strong>Error!</strong> There was a problem sending your message. Please try again.');
                },
                complete: function() {
                    $('#contactForm button[type="submit"]').text('Send Message');
                }
            });
        }
    });

    // ===== Newsletter Form =====
    $('.newsletter-form').submit(function(e) {
        e.preventDefault();
        const email = $(this).find('input[type="email"]').val();
        
        if (email) {
            alert('Thank you for subscribing! We\'ll keep you updated with our latest offers.');
            $(this).find('input[type="email"]').val('');
        }
    });

    // ===== Product Add to Cart (Homepage) =====
    $('.add-to-cart').click(function() {
        // Redirect to menu page
        window.location.href = 'menu.html';
    });


    // ===== Menu Page - Filter Functionality =====
    $('.filter-btn').click(function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        const filter = $(this).data('filter');
        
        $('.menu-item').each(function() {
            if (filter === 'all' || $(this).data('category') === filter) {
                $(this).fadeIn(400).removeClass('hidden');
            } else {
                $(this).fadeOut(400).addClass('hidden');
            }
        });
        
        checkNoResults();
    });

    // ===== Menu Search Functionality =====
    $('#menuSearch').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        $('.menu-item').each(function() {
            const itemText = $(this).text().toLowerCase();
            if (itemText.includes(searchTerm)) {
                $(this).fadeIn(400).removeClass('hidden');
            } else {
                $(this).fadeOut(400).addClass('hidden');
            }
        });
        
        checkNoResults();
    });

    // Check if no results found
    function checkNoResults() {
        const visibleItems = $('.menu-item').not('.hidden').length;
        if (visibleItems === 0) {
            $('#noResults').fadeIn();
        } else {
            $('#noResults').fadeOut();
        }
    }

    // ===== Shopping Cart Functionality =====
    let cart = [];
    let cartTotal = 0;

    // Add to Cart
    $('.btn-add-cart').click(function() {
        const itemName = $(this).data('item');
        const itemPrice = parseInt($(this).data('price'));
        
        // Check if item already in cart
        const existingItem = cart.find(item => item.name === itemName);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: itemName,
                price: itemPrice,
                quantity: 1
            });
        }
        
        updateCart();
        showNotification(`${itemName} added to cart!`);
        
        // Button feedback
        $(this).text('Added!').css('background', '#4CAF50');
        const btn = $(this);
        setTimeout(() => {
            btn.text('Add to Cart').css('background', '');
        }, 1500);
    });

    // Update Cart Display
    function updateCart() {
        const $cartItems = $('#cartItems');
        $cartItems.empty();
        
        // Reset cartTotal to 0 before calculating
        cartTotal = 0;
        
        if (cart.length === 0) {
            $cartItems.html('<p class="empty-cart">Your cart is empty</p>');
        } else {
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                cartTotal += itemTotal;
                
                $cartItems.append(`
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">Rp ${item.price.toLocaleString()}</div>
                            <div class="cart-item-quantity">
                                <button class="qty-btn minus" data-index="${index}">-</button>
                                <span>${item.quantity}</span>
                                <button class="qty-btn plus" data-index="${index}">+</button>
                                <button class="remove-item" data-index="${index}">Remove</button>
                            </div>
                        </div>
                    </div>
                `);
            });
        }
        
        $('#cartTotal').text('Rp ' + cartTotal.toLocaleString());
        $('#cartCount').text(cart.reduce((sum, item) => sum + item.quantity, 0));
        
        // Attach event handlers to dynamically created buttons
        attachCartEventHandlers();
    }

    // Attach Event Handlers to Cart Buttons
    function attachCartEventHandlers() {
        $('.qty-btn.plus').off('click').on('click', function() {
            const index = $(this).data('index');
            cart[index].quantity++;
            updateCart();
        });
        
        $('.qty-btn.minus').off('click').on('click', function() {
            const index = $(this).data('index');
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
                updateCart();
            }
        });
        
        $('.remove-item').off('click').on('click', function() {
            const index = $(this).data('index');
            const itemName = cart[index].name;
            cart.splice(index, 1);
            updateCart();
            showNotification(`${itemName} removed from cart`);
        });
    }

    // Toggle Cart Sidebar
    $('#cartButton').click(function() {
        $('#cartSidebar').toggleClass('open');
    });

    $('#cartClose').click(function() {
        $('#cartSidebar').removeClass('open');
    });

    // Checkout
    $('#checkoutBtn').click(function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // Save cart to localStorage
        localStorage.setItem('checkoutCart', JSON.stringify(cart));
        localStorage.setItem('checkoutTotal', cartTotal);
        
        // Redirect to checkout page
        window.location.href = 'checkout.html';
    });


    // ===== Gallery Page - Filter Functionality =====
    $('.gallery-filter-btn').click(function() {
        $('.gallery-filter-btn').removeClass('active');
        $(this).addClass('active');
        
        const filter = $(this).data('filter');
        
        $('.gallery-item').each(function() {
            if (filter === 'all' || $(this).data('category') === filter) {
                $(this).fadeIn(400).removeClass('hidden');
            } else {
                $(this).fadeOut(400).addClass('hidden');
            }
        });
    });

    // ===== Lightbox Functionality =====
    let currentImageIndex = 0;
    let galleryImages = [];

    // Populate gallery images array
    $('.view-btn').each(function() {
        galleryImages.push({
            class: $(this).data('image'),
            title: $(this).closest('.gallery-overlay').find('h3').text(),
            description: $(this).closest('.gallery-overlay').find('p').text()
        });
    });

    // Open Lightbox
    $('.view-btn').click(function() {
        const imageClass = $(this).data('image');
        currentImageIndex = galleryImages.findIndex(img => img.class === imageClass);
        showLightboxImage();
        $('#lightbox').addClass('active');
    });

    // Close Lightbox
    $('#lightboxClose').click(function() {
        $('#lightbox').removeClass('active');
    });

    // Close lightbox when clicking outside image
    $('#lightbox').click(function(e) {
        if (e.target === this) {
            $(this).removeClass('active');
        }
    });

    // Previous Image
    $('#prevImage').click(function() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        showLightboxImage();
    });

    // Next Image
    $('#nextImage').click(function() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        showLightboxImage();
    });

    // Show Lightbox Image
    function showLightboxImage() {
        const image = galleryImages[currentImageIndex];
        $('#lightboxImage').removeClass().addClass('lightbox-image').addClass(image.class);
        $('#lightboxCaption').html(`<h3>${image.title}</h3><p>${image.description}</p>`);
    }

    // Keyboard Navigation for Lightbox
    $(document).keydown(function(e) {
        if ($('#lightbox').hasClass('active')) {
            if (e.key === 'ArrowLeft') {
                $('#prevImage').click();
            } else if (e.key === 'ArrowRight') {
                $('#nextImage').click();
            } else if (e.key === 'Escape') {
                $('#lightboxClose').click();
            }
        }
    });

    // ===== Load More Images =====
    let galleryItemsLoaded = 12;
    
    // Hide items beyond initial load
    $('.gallery-item').each(function(index) {
        if (index >= galleryItemsLoaded) {
            $(this).hide();
        }
    });

    $('#loadMoreBtn').click(function() {
        let hiddenItems = $('.gallery-item:hidden').length;
        
        if (hiddenItems > 0) {
            $('.gallery-item:hidden').slice(0, 6).fadeIn(400);
            
            if ($('.gallery-item:hidden').length === 0) {
                $(this).text('All Images Loaded').prop('disabled', true);
            }
        }
    });

    // ===== Reviews Slider =====
    let currentReview = 0;
    const reviewCards = $('.review-card');
    const totalReviews = reviewCards.length;

    function showReview(index) {
        reviewCards.removeClass('active');
        $(reviewCards[index]).addClass('active');
        
        $('.dot').removeClass('active');
        $(`.dot[data-slide="${index}"]`).addClass('active');
    }

    // Auto-rotate reviews
    setInterval(function() {
        currentReview = (currentReview + 1) % totalReviews;
        showReview(currentReview);
    }, 5000);

    // Manual navigation
    $('.dot').click(function() {
        currentReview = $(this).data('slide');
        showReview(currentReview);
    });

    // ===== Notification System =====
    function showNotification(message) {
        // Remove existing notification if any
        $('.notification').remove();
        
        const notification = $(`
            <div class="notification" style="
                position: fixed;
                top: 80px;
                right: 20px;
                background: var(--dark-color);
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 9999;
                animation: slideInRight 0.3s ease;
            ">
                ${message}
            </div>
        `);
        
        $('body').append(notification);
        
        setTimeout(function() {
            notification.fadeOut(400, function() {
                $(this).remove();
            });
        }, 3000);
    }

    // Add CSS animation for notification
    if (!$('#notificationStyle').length) {
        $('head').append(`
            <style id="notificationStyle">
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            </style>
        `);
    }

    // ===== Parallax Effect on Hero Section =====
    $(window).scroll(function() {
        if ($('.hero').length) {
            const scrolled = $(window).scrollTop();
            $('.hero-content').css('transform', 'translateY(' + (scrolled * 0.5) + 'px)');
        }
    });

    // ===== Animate Elements on Scroll =====
    function animateOnScroll() {
        $('.animate-text').each(function() {
            const elementTop = $(this).offset().top;
            const windowBottom = $(window).scrollTop() + $(window).height();
            
            if (elementTop < windowBottom - 50) {
                $(this).css({
                    'opacity': '1',
                    'transform': 'translateY(0)'
                });
            }
        });
    }

    $(window).scroll(animateOnScroll);
    animateOnScroll();

    // ===== Input Focus Effects =====
    $('.form-group input, .form-group textarea').on('focus', function() {
        $(this).parent().addClass('focused');
    }).on('blur', function() {
        if ($(this).val() === '') {
            $(this).parent().removeClass('focused');
        }
    });

    // ===== Hover Effects for Product Cards =====
    $('.product-card, .menu-item').hover(
        function() {
            $(this).css('cursor', 'pointer');
        }
    );

    // ===== Initialize on Page Load =====
    console.log('CafeInc Website Loaded Successfully! ☕');
    
    // Trigger initial animations
    setTimeout(function() {
        $('.animate-text').css({
            'opacity': '1',
            'transform': 'translateY(0)'
        });
    }, 100);

});

// ===== Vanilla JavaScript Additional Features =====

// Page Loading Animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(function() {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Detect if user is on mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Add touch support for mobile devices
if (isMobile()) {
    document.addEventListener('touchstart', function() {}, true);
}

// Prevent right-click on images (optional, for gallery protection)
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// Console welcome message
console.log('%c Welcome to CafeInc! ☕', 'color: #8B4513; font-size: 24px; font-weight: bold;');
console.log('%c Enjoy exploring our premium coffee selection!', 'color: #D2691E; font-size: 14px;');

// ===== Checkout Page Functionality =====
$(document).ready(function() {
    // Load cart data on checkout page
    if (window.location.pathname.includes('checkout.html')) {
        loadCheckoutCart();
        
        // Clear all button handler
        $('#clearAllBtn').click(function() {
            clearAllItems();
        });
        
        // Handle form submission
        $('#checkoutForm').submit(function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateCheckoutForm()) {
                return false;
            }
            
            // Get form data
            const formData = {
                customer_name: $('#customerName').val(),
                customer_email: $('#customerEmail').val(),
                customer_phone: $('#customerPhone').val(),
                customer_address: $('#customerAddress').val(),
                payment_method: $('#paymentMethod').val(),
                order_notes: $('#orderNotes').val(),
                order_data: JSON.stringify(JSON.parse(localStorage.getItem('checkoutCart') || '[]')),
                order_total: localStorage.getItem('checkoutTotal') || '0'
            };
            
            // Set hidden fields
            $('#orderData').val(formData.order_data);
            $('#orderTotal').val(formData.order_total);
            
            // Submit via AJAX
            $.ajax({
                url: 'process_order.php',
                method: 'POST',
                data: formData,
                dataType: 'json',
                beforeSend: function() {
                    $('#placeOrderBtn').prop('disabled', true).text('Processing...');
                },
                success: function(response) {
                    if (response.success) {
                        $('#checkoutResponse').removeClass('error').addClass('success')
                            .html('<strong>Success!</strong> ' + response.message).show();
                        
                        // Clear cart
                        localStorage.removeItem('checkoutCart');
                        localStorage.removeItem('checkoutTotal');
                        
                        // Reset form
                        $('#checkoutForm')[0].reset();
                        
                        // Redirect after 3 seconds
                        setTimeout(function() {
                            window.location.href = 'index.html';
                        }, 3000);
                    } else {
                        $('#checkoutResponse').removeClass('success').addClass('error')
                            .html('<strong>Error!</strong> ' + response.message).show();
                        $('#placeOrderBtn').prop('disabled', false).text('Place Order');
                    }
                },
                error: function() {
                    $('#checkoutResponse').removeClass('success').addClass('error')
                        .html('<strong>Error!</strong> Failed to process order. Please try again.').show();
                    $('#placeOrderBtn').prop('disabled', false).text('Place Order');
                }
            });
        });
    }
});

function loadCheckoutCart() {
    const cartData = JSON.parse(localStorage.getItem('checkoutCart') || '[]');
    
    if (cartData.length === 0) {
        $('#checkoutOrderItems').html(`
            <div class="empty-order">
                <p>Your cart is empty</p>
                <a href="menu.html" class="btn btn-primary">Browse Menu</a>
            </div>
        `);
        $('#orderTotalSection').hide();
        $('#clearAllBtn').hide();
        return;
    }
    
    // Show clear all button
    $('#clearAllBtn').show();
    
    // Display order items
    let itemsHTML = '';
    cartData.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        itemsHTML += `
            <div class="order-item" data-index="${index}">
                <div class="order-item-info">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-details">Rp ${item.price.toLocaleString()} per item</div>
                    <div class="order-item-quantity">
                        <button type="button" class="btn-qty btn-decrease" data-index="${index}" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
                        <span>${item.quantity}</span>
                        <button type="button" class="btn-qty btn-increase" data-index="${index}">+</button>
                    </div>
                </div>
                <div class="order-item-right">
                    <div class="order-item-price">Rp ${itemTotal.toLocaleString()}</div>
                    <button type="button" class="btn-remove-item" data-index="${index}">Remove</button>
                </div>
            </div>
        `;
    });
    
    $('#checkoutOrderItems').html(itemsHTML);
    
    // Calculate totals
    const cartTotal = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 20000;
    const grandTotal = cartTotal + deliveryFee;
    
    // Display totals
    $('#checkoutSubtotal').text('Rp ' + cartTotal.toLocaleString());
    $('#deliveryFee').text('Rp ' + deliveryFee.toLocaleString());
    $('#checkoutTotal').text('Rp ' + grandTotal.toLocaleString());
    $('#orderTotalSection').show();
    
    // Update localStorage with new total
    localStorage.setItem('checkoutTotal', cartTotal);
    
    // Attach event handlers for quantity buttons
    attachCheckoutEventHandlers();
}

function attachCheckoutEventHandlers() {
    // Decrease quantity
    $('.btn-decrease').off('click').on('click', function() {
        const index = $(this).data('index');
        updateItemQuantity(index, -1);
    });
    
    // Increase quantity
    $('.btn-increase').off('click').on('click', function() {
        const index = $(this).data('index');
        updateItemQuantity(index, 1);
    });
    
    // Remove item
    $('.btn-remove-item').off('click').on('click', function() {
        const index = $(this).data('index');
        removeItem(index);
    });
}

function updateItemQuantity(index, change) {
    let cartData = JSON.parse(localStorage.getItem('checkoutCart') || '[]');
    
    if (cartData[index]) {
        cartData[index].quantity += change;
        
        // Remove item if quantity becomes 0
        if (cartData[index].quantity <= 0) {
            cartData.splice(index, 1);
        }
        
        // Update localStorage
        localStorage.setItem('checkoutCart', JSON.stringify(cartData));
        
        // Reload cart display
        loadCheckoutCart();
    }
}

function removeItem(index) {
    let cartData = JSON.parse(localStorage.getItem('checkoutCart') || '[]');
    
    // Remove item from array
    cartData.splice(index, 1);
    
    // Update localStorage
    localStorage.setItem('checkoutCart', JSON.stringify(cartData));
    
    // Reload cart display
    loadCheckoutCart();
}

function clearAllItems() {
    if (confirm('Are you sure you want to clear all items from your cart?')) {
        localStorage.removeItem('checkoutCart');
        localStorage.removeItem('checkoutTotal');
        loadCheckoutCart();
    }
}


function validateCheckoutForm() {
    let isValid = true;
    
    // Clear previous errors
    $('.form-error').text('');
    
    // Validate name
    const name = $('#customerName').val().trim();
    if (name.length < 3) {
        $('#nameError').text('Name must be at least 3 characters');
        isValid = false;
    }
    
    // Validate email
    const email = $('#customerEmail').val().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        $('#emailError').text('Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone
    const phone = $('#customerPhone').val().trim();
    const phoneRegex = /^(08|62)\d{8,11}$/;
    if (!phoneRegex.test(phone.replace(/[-\s]/g, ''))) {
        $('#phoneError').text('Please enter a valid Indonesian phone number');
        isValid = false;
    }
    
    // Validate address
    const address = $('#customerAddress').val().trim();
    if (address.length < 10) {
        $('#addressError').text('Please enter a complete address');
        isValid = false;
    }
    
    // Validate payment method
    const payment = $('#paymentMethod').val();
    if (!payment) {
        $('#paymentError').text('Please select a payment method');
        isValid = false;
    }
    
    return isValid;
}
