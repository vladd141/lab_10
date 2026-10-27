
const grocery = document.getElementById("grocery");
const submit_btn = document.querySelector(".submit-btn");
const grocery_list = document.querySelector(".grocery-list");
const grocery_container = document.querySelector(".grocery-container");
const clear_btn = document.querySelector(".clear-btn");
const alert_message = document.querySelector(".alert");

let editElement = null;
let messageTimer;

function showMessage(text, type = "success") {
    clearTimeout(messageTimer);

    alert_message.textContent = text;
    alert_message.className = `alert alert-${type}`;

    messageTimer = setTimeout(() => {
        alert_message.textContent = "";
        alert_message.className = "alert";
    }, 1500);
}

function createProduct(value) {
    const article = document.createElement("article");
    article.classList.add("grocery-item");
    
    article.innerHTML = `
        <p class="title"></p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    article.querySelector(".title").textContent = value;

    return article;
}

function saveProducts() {
    const products = Array.from(
        grocery_list.querySelectorAll(".title")
    ).map(title => title.textContent);

    localStorage.setItem("groceryProducts", JSON.stringify(products));
}

function updateContainer() {
    if (grocery_list.children.length > 0) {
        grocery_container.classList.add("show-container");
    } else {
        grocery_container.classList.remove("show-container");
    }
}

function resetForm() {
    editElement = null;
    submit_btn.textContent = "Додати";
    grocery.value = "";
}

submit_btn.addEventListener("click", function(event) {
    event.preventDefault();

    const value = grocery.value.trim();

    if (value === "") {
        showMessage("Введіть назву продукту", "danger");
        return;
    }

    if (editElement !== null) {
        editElement.querySelector(".title").textContent = value;

        resetForm();
        saveProducts();
        updateContainer();

        showMessage("Продукт відредаговано");
    } else {
        const article = createProduct(value);

        grocery_list.append(article);

        grocery.value = "";

        saveProducts();
        updateContainer();

        showMessage("Продукт додано");
    }
});

grocery_list.addEventListener("click", function(event) {
    const editButton = event.target.closest(".edit-btn");
    const deleteButton = event.target.closest(".delete-btn");

    if (editButton) {
        editElement = editButton.closest("article");

        grocery.value = editElement.querySelector(".title").textContent;
        submit_btn.textContent = "Редагувати";

        grocery.focus();
    }

    if (deleteButton) {
        const article = deleteButton.closest("article");

        if (editElement === article) {
            resetForm();
        }

        article.remove();

        saveProducts();
        updateContainer();

        showMessage("Продукт видалено");
    }
});

clear_btn.addEventListener("click", function(event) {
    event.preventDefault();

    grocery_list.replaceChildren();

    localStorage.removeItem("groceryProducts");

    resetForm();
    updateContainer();

    showMessage("Список очищено");
});

function loadProducts() {
    let products = [];

    try {
        products = JSON.parse(
            localStorage.getItem("groceryProducts") || "[]"
        );

        if (!Array.isArray(products)) {
            products = [];
        }
    } catch {
        products = [];
    }

    products.forEach(function(value) {
        grocery_list.append(createProduct(String(value)));
    });

    updateContainer();
}

loadProducts();
