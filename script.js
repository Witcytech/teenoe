document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceSpan = document.getElementById('total-price');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutButton = document.getElementById('checkout-button');
    const qrCodeSection = document.getElementById('qr-code-section');
    const qrImage = document.getElementById('qr-image');
    const qrTotalAmountSpan = document.getElementById('qr-total-amount');
    const backToShopButton = document.getElementById('back-to-shop-button');

    // ส่วน Admin
    const addProductForm = document.getElementById('add-product-form');
    const newProductNameInput = document.getElementById('new-product-name');
    const newProductPriceInput = document.getElementById('new-product-price');
    const manageProductList = document.getElementById('manage-product-list');

    // ตัวอย่างข้อมูลสินค้าพร้อมรูปภาพจาก Unsplash
    // รูปภาพที่ใช้เป็น Placeholder หรือรูปที่เกี่ยวข้องกับที่นอน
    let products = [
        { id: 1, name: 'ที่นอนยางพาราแท้ 6 ฟุต', price: 15000, image: 'https://media.1deelert.com/catalog/product/cache/0ee050c3ffc3555709b9bb6062f4d7e9/m/a/maxtex-600x600.webp' },
        { id: 2, name: 'ที่นอน Pocket Spring 5 ฟุต', price: 12000, image: 'https://inwfile.com/s-dg/arwl4m.jpg' },
        { id: 3, name: 'ที่นอนเมมโมรี่โฟม 3.5 ฟุต', price: 8500, image: 'https://down-th.img.susercontent.com/file/th-11134207-7r98z-loxfa30v2k4p35' },
        { id: 4, name: 'ที่นอนใยมะพร้าว 6 ฟุต', price: 7000, image: 'https://stlfurniture1.com/wp-content/uploads/2022/08/coconut-fibre-sponge-mattress-crystal-1200x1200.jpg' }
    ];

    // URL รูปภาพสำหรับสุ่มเมื่อเพิ่มสินค้าใหม่ (จาก Unsplash)
    const randomProductImageUrls = [
        'https://cdn-icons-png.freepik.com/512/8525/8525168.png',
        'https://cdn-icons-png.freepik.com/512/8525/8525168.png'
    ];

    let cart = [];

    // ฟังก์ชันแสดงสินค้าทั้งหมดในหน้าหลัก
    function displayProducts() {
        productList.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-item');
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price} บาท</p>
                <button data-id="${product.id}">เพิ่มลงตะกร้า</button>
            `;
            productList.appendChild(productDiv);
        });
        attachAddToCartListeners();
    }

    // ฟังก์ชันผูก Event Listener สำหรับปุ่ม "เพิ่มลงตะกร้า"
    function attachAddToCartListeners() {
        document.querySelectorAll('.product-item button').forEach(button => {
            button.onclick = (event) => {
                const productId = parseInt(event.target.dataset.id);
                addToCart(productId);
            };
        });
    }

    // ฟังก์ชันเพิ่มสินค้าลงตะกร้า
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const existingCartItem = cart.find(item => item.id === productId);
            if (existingCartItem) {
                existingCartItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCartDisplay();
        }
    }

    // ฟังก์ชันลบสินค้าออกจากตะกร้า
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartDisplay();
    }

    // ฟังก์ชันอัปเดตการแสดงผลตะกร้าสินค้า
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <span>${item.name} (x${item.quantity})</span>
                    <span>${item.price * item.quantity} บาท</span>
                    <button data-id="${item.id}">ลบ</button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });
            attachRemoveFromCartListeners();
        }
        calculateTotalPrice();
    }

    // ฟังก์ชันผูก Event Listener สำหรับปุ่ม "ลบ" ในตะกร้า
    function attachRemoveFromCartListeners() {
        document.querySelectorAll('#cart-items .cart-item button').forEach(button => {
            button.onclick = (event) => {
                const productId = parseInt(event.target.dataset.id);
                removeFromCart(productId);
            };
        });
    }

    // ฟังก์ชันคำนวณราคารวม
    function calculateTotalPrice() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPriceSpan.textContent = total;
    }

    // ฟังก์ชันสำหรับการชำระเงิน (จำลอง QR Code)
    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            const total = parseFloat(totalPriceSpan.textContent);

            // ซ่อนส่วนอื่น ๆ และแสดงส่วน QR Code
            document.getElementById('products').style.display = 'none';
            document.getElementById('cart').style.display = 'none';
            document.getElementById('admin-product-management').style.display = 'none';
            qrCodeSection.style.display = 'block';

            // ตั้งค่า URL ของ QR Code จำลองและแสดงยอดรวม
            // นี่คือ URL ของบริการสร้าง QR Code ออนไลน์ (ไม่ใช่การเชื่อมต่อ Payment Gateway จริง)
            // คุณสามารถเปลี่ยน 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data='
            // เป็น URL อื่นๆ ที่ให้บริการสร้าง QR Code ได้
            qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=OrderTotal:${total}THB`;
            qrTotalAmountSpan.textContent = total;

        } else {
            alert('ยังไม่มีสินค้าในตะกร้า!');
        }
    });

    // ปุ่มกลับสู่ร้านค้าจากหน้า QR Code
    backToShopButton.addEventListener('click', () => {
        qrCodeSection.style.display = 'none';
        document.getElementById('products').style.display = 'block';
        document.getElementById('cart').style.display = 'block';
        document.getElementById('admin-product-management').style.display = 'block';
        cart = []; // ล้างตะกร้าหลังจาก "ชำระเงิน" (จำลอง)
        updateCartDisplay();
    });

    // --- ส่วนสำหรับผู้ดูแลระบบ (เพิ่มและลบสินค้า) ---

    // ฟังก์ชันสุ่ม URL รูปภาพ
    function getRandomImageUrl() {
        const randomIndex = Math.floor(Math.random() * randomProductImageUrls.length);
        return randomProductImageUrls[randomIndex];
    }

    // ฟังก์ชันเพิ่มสินค้า (Admin)
    addProductForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = newProductNameInput.value;
        const price = parseFloat(newProductPriceInput.value);
        const image = getRandomImageUrl(); // สุ่มรูปภาพ

        if (name && price >= 0 && !isNaN(price)) {
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            const newProduct = { id: newId, name, price, image };
            products.push(newProduct);
            displayProducts(); // อัปเดตหน้าหลัก
            displayManageProducts(); // อัปเดตส่วนจัดการสินค้า
            alert('เพิ่มสินค้าสำเร็จ!');
            addProductForm.reset();
        } else {
            alert('กรุณากรอกข้อมูลสินค้าให้ครบถ้วนและถูกต้อง!');
        }
    });

    // ฟังก์ชันแสดงสินค้าในส่วนจัดการสินค้า (Admin)
    function displayManageProducts() {
        manageProductList.innerHTML = '';
        if (products.length === 0) {
            manageProductList.innerHTML = '<p style="text-align: center; color: #666;">ยังไม่มีสินค้าในระบบ</p>';
            return;
        }
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-item', 'manage-product-item'); // เพิ่ม class manage-product-item
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price} บาท</p>
                <button class="delete-button" data-id="${product.id}">ลบสินค้า</button>
            `;
            manageProductList.appendChild(productDiv);
        });
        attachDeleteProductListeners(); // ผูก event listener สำหรับปุ่มลบ
    }

    // ฟังก์ชันผูก Event Listener สำหรับปุ่ม "ลบสินค้า" ในส่วน Admin
    function attachDeleteProductListeners() {
        document.querySelectorAll('#manage-product-list .delete-button').forEach(button => {
            button.onclick = (event) => {
                const productId = parseInt(event.target.dataset.id);
                deleteProduct(productId);
            };
        });
    }

    // ฟังก์ชันลบสินค้า (Admin)
    function deleteProduct(productId) {
        if (confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) {
            products = products.filter(p => p.id !== productId);
            // ลบสินค้าออกจากตะกร้าด้วยหากมี
            cart = cart.filter(item => item.id !== productId);
            updateCartDisplay(); // อัปเดตตะกร้าสินค้า
            displayProducts(); // อัปเดตหน้าหลัก
            displayManageProducts(); // อัปเดตส่วนจัดการสินค้า
            alert('ลบสินค้าสำเร็จ!');
        }
    }

    // เริ่มต้นแสดงสินค้าเมื่อโหลดหน้าเว็บ
    displayProducts();
    updateCartDisplay();
    displayManageProducts(); // แสดงสินค้าในส่วนจัดการด้วย
});