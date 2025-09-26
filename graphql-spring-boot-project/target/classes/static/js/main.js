let productModalInstance = null;
let allUsers = [];
let allCategoriesData = [];

document.addEventListener('DOMContentLoaded', function() {
    const productModalElement = document.getElementById('product-modal');
    productModalInstance = new bootstrap.Modal(productModalElement);


    fetchProducts(); 
    fetchCategories();
    fetchUsersForForm();


    document.getElementById('btn-new-product').addEventListener('click', handleNewProductClick);
    document.getElementById('product-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('product-list').addEventListener('click', handleProductListClick);
});


async function callGraphQL(query) {
    const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query })
    });
    return response.json();
}


function fetchProducts() {
    const query = `
        query {
            allProductsByPrice {
                id title price description
                user { id fullname }
                categories { id name }
            }
        }
    `;
    callGraphQL(query).then(result => {
        if (result.errors) {
            console.error("GraphQL Errors (fetchProducts):", result.errors);
            return;
        }
        renderProducts(result.data.allProductsByPrice);
        document.getElementById('product-list-title').innerText = 'Tất cả sản phẩm (Sắp xếp theo giá tăng dần)';
        document.querySelectorAll('#category-list li').forEach(li => li.classList.remove('active'));
        document.querySelector('#category-list li:first-child')?.classList.add('active');
    });
}

function fetchCategories() {
    const query = `query { allCategories {id name} }`;
    callGraphQL(query).then(result => {
        if (result.errors) {
            console.error("GraphQL Errors (fetchCategories):", result.errors);
            return;
        }
        allCategoriesData = result.data.allCategories;
        const categoryList = document.getElementById('category-list');
        categoryList.querySelectorAll('li:not(:first-child)').forEach(li => li.remove());

        allCategoriesData.forEach(cat => {
            const li = document.createElement('li');
            li.className = 'list-group-item list-group-item-action';
            li.style.cursor = 'pointer';
            li.textContent = cat.name;
            li.onclick = (event) => fetchProductsByCategory(cat.id, cat.name, event);
            categoryList.appendChild(li);
        });
        populateCategoryDropdown();
    });
}

function fetchUsersForForm() {
    const query = `query { allUsers {id fullname} }`;
    callGraphQL(query).then(result => {
        if (result.errors) {
            console.error("GraphQL Errors (fetchUsersForForm):", result.errors);
            return;
        }
        allUsers = result.data.allUsers;
        populateUserDropdown();
    });
}

function fetchProductsByCategory(categoryId, categoryName, event) {
    const query = `query { productsByCategory(categoryId: "${categoryId}") { id title price description } }`;
    callGraphQL(query).then(result => {
        if (result.errors) {
            console.error("GraphQL Errors (fetchProductsByCategory):", result.errors);
            return;
        }
        renderProducts(result.data.productsByCategory);
        document.getElementById('product-list-title').innerText = `Sản phẩm thuộc danh mục: ${categoryName}`;
        document.querySelectorAll('#category-list li').forEach(li => li.classList.remove('active'));
        event.target.classList.add('active');
    });
}


function renderProducts(products) {
    const productListDiv = document.getElementById('product-list');
    productListDiv.innerHTML = '';
    if (!products || products.length === 0) {
        productListDiv.innerHTML = '<p class="col-12">Không có sản phẩm nào để hiển thị.</p>';
        return;
    }
    products.forEach(product => {
        const productCard = `
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Giá: ${product.price.toLocaleString('vi-VN')} VNĐ</h6>
                        <p class="card-text">${product.description || 'Không có mô tả'}</p>
                    </div>
                    <div class="card-footer text-end bg-transparent border-top-0">
                        <button class="btn btn-sm btn-outline-secondary btn-edit" data-id="${product.id}">Sửa</button>
                        <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${product.id}" data-title="${product.title}">Xóa</button>
                    </div>
                </div>
            </div>
        `;
        productListDiv.innerHTML += productCard;
    });
}

function populateUserDropdown() {
    const userSelect = document.getElementById('product-user');
    userSelect.innerHTML = '<option value="">-- Chọn người đăng --</option>';
    allUsers.forEach(user => {
        userSelect.innerHTML += `<option value="${user.id}">${user.fullname}</option>`;
    });
}

function populateCategoryDropdown() {
    const categorySelect = document.getElementById('product-categories');
    categorySelect.innerHTML = '';
    allCategoriesData.forEach(cat => {
        categorySelect.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
    });
}


function handleNewProductClick() {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('productModalLabel').innerText = 'Thêm sản phẩm mới';
    productModalInstance.show();
}

function handleProductListClick(event) {
    const target = event.target;
    if (target.classList.contains('btn-edit')) {
        const productId = target.getAttribute('data-id');
        handleEditClick(productId);
    }
    if (target.classList.contains('btn-delete')) {
        const productId = target.getAttribute('data-id');
        const productTitle = target.getAttribute('data-title');
        handleDeleteClick(productId, productTitle);
    }
}

function handleEditClick(productId) {
    const query = `query {
        productById(id: "${productId}") { 
            id title price quantity description 
            user {id} 
            categories {id} 
        } 
    }`;
    callGraphQL(query).then(result => {
        if(result.errors) {
            console.error(result.errors);
            alert("Không thể tải dữ liệu sản phẩm!");
            return;
        }
        const product = result.data.productById;
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-title').value = product.title;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-quantity').value = product.quantity;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-user').value = product.user.id;
        
        const categoryIds = product.categories.map(cat => cat.id);
        const categorySelect = document.getElementById('product-categories');
        Array.from(categorySelect.options).forEach(option => {
            option.selected = categoryIds.includes(option.value);
        });

        document.getElementById('productModalLabel').innerText = 'Cập nhật sản phẩm';
        productModalInstance.show();
    });
}

function handleDeleteClick(productId, productTitle) {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productTitle}" không?`)) {
        const mutation = `mutation { deleteProduct(id: "${productId}") }`;
        callGraphQL(mutation).then(result => {
            if (result.errors) {
                console.error(result.errors);
                alert("Xóa sản phẩm thất bại!");
            } else if (result.data.deleteProduct) {
                alert("Xóa sản phẩm thành công!");
                fetchProducts();
            }
        });
    }
}

function handleFormSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('product-id').value;
    const title = document.getElementById('product-title').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const quantity = parseInt(document.getElementById('product-quantity').value);
    const description = document.getElementById('product-description').value;
    const userId = document.getElementById('product-user').value;
    const categoryIds = Array.from(document.getElementById('product-categories').selectedOptions).map(opt => opt.value);

    const productInput = `{
        title: "${title.replace(/"/g, '\\"')}",
        price: ${price},
        quantity: ${quantity},
        description: "${description.replace(/"/g, '\\"')}",
        userId: "${userId}",
        categoryIds: [${categoryIds.map(id => `"${id}"`).join(',')}]
    }`;

    let mutation;
    if (id) {
        mutation = `mutation { updateProduct(id: "${id}", productInput: ${productInput}) { id title } }`;
    } else {
        mutation = `mutation { createProduct(productInput: ${productInput}) { id title } }`;
    }

    callGraphQL(mutation).then(result => {
        if (result.errors) {
            console.error(result.errors);
            alert("Thao tác thất bại!");
        } else {
            alert(id ? "Cập nhật thành công!" : "Thêm mới thành công!");
            productModalInstance.hide();
            fetchProducts();
        }
    });
}