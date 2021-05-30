// General HTML Elements Variables
const panelsDiv = document.getElementById("panels");
const panelsButtonsDiv = document.getElementById("shop-buttons-panel");
const panels = panelsDiv.getElementsByClassName('card-body');
const panelsButtons = panelsButtonsDiv.getElementsByTagName('button');
const productsMissingFieldsAlert = document.getElementById("products-missing-fields-alert");
const productsNoProductsAlert = document.getElementById("products-no-products-alert");
const productsTable = document.getElementById("products-table");
const productsTableTbody = document.getElementById("products-table-tbody");
const addToCartButton = document.getElementById("add-to-cart-button");
const productsErrorMessage = document.getElementById("products-error-message");
const shoppingCardTitle = document.getElementById("shopping-card-title");
const productsNotInCartAlert = document.getElementById("no-products-in-cart-alert");
const cartTable = document.getElementById("cart-table");
const cartTableTbody = document.getElementById("cart-table-tbody");
const cartTableTfoot = document.getElementById("cart-table-tfoot");
const placeOrderButton = document.getElementById("place-order-button");

// General Script Variables
const panelsCount = panels.length;
const panelButtonClickStateClass = "btn btn-success";
const panelButtonOriginalStateClass = "btn btn-secondary";
const clientPanelBodyId = "client-panel-body";
const clientPanelButtonId = "client-panel-btn";
const productsPanelBodyId = "products-panel-body";
const productsPanelButtonId = "products-panel-btn";
const shoppingCartBodyId = "shopping-cart-body";
const shoppingCartButtonId = "shopping-cart-btn";
const invalidQ4Value = "q4-none";
let productsToShow = [];
let productsInCart = [];

// Client Panel Variables
const q1Input = document.getElementById("q1-text-area");
const q1ErrorMessage = document.getElementById("q1-error-message");
const q2InputOption1 = document.getElementById("q2-option1");
const q2InputOption2 = document.getElementById("q2-option2");
const q3InputOption1 = document.getElementById("q3-option1");
const q3InputOption2 = document.getElementById("q3-option2");
const q3InputOption3 = document.getElementById("q3-option3");
const q4Input = document.getElementById("q4-dropdown");
const q4ErrorMessage = document.getElementById("q4-error-message");

// Client Panel User Inputs
let q1UserInput = "";
let q2UserInput = [false, false];
let q3UserInput = "";
let q4UserInput = "";

// List of products
const products = [
    {
        name: "Mozzarella cheese",
        price: 2.99,
        containsLactose: true,
        containsNuts: false,
        isOrganic: false,
        index: 0
    },

    {
        name: "Regular pringles chips",
        price: 3.99,
        containsLactose: false,
        containsNuts: false,
        isOrganic: false,
        index: 1
    },

    {
        name: "Dairy-free vanilla ice cream",
        price: 5.49,
        containsLactose: false,
        containsNuts: false,
        isOrganic: false,
        index: 2
    },

    {
        name: "Cherry tomatoes",
        price: 2.99,
        containsLactose: false,
        containsNuts: false,
        isOrganic: true,
        index: 3
    },

    {
        name: "Vegan meat",
        price: 11.99,
        containsLactose: false,
        containsNuts: false,
        isOrganic: false,
        index: 4
    },

    {
        name: "Nutella jar",
        price: 6.99,
        containsLactose: true,
        containsNuts: true,
        isOrganic: false,
        index: 5
    },

    {
        name: "Microwave pizza",
        price: 10.99,
        containsLactose: true,
        containsNuts: false,
        isOrganic: false,
        index: 6
    },

    {
        name: "Cheerios cereal box",
        price: 2.99,
        containsLactose: false,
        containsNuts: false,
        isOrganic: false,
        index: 7
    },

    {
        name: "Organic orange juice",
        price: 1.50,
        containsLactose: false,
        containsNuts: false,
        isOrganic: true,
        index: 8
    },

    {
        name: "Yogurt",
        price: 5.99,
        containsLactose: true,
        containsNuts: false,
        isOrganic: false,
        index: 9
    }
];

// Events
onLoad();

// Functions
function onLoad() {
    for (let panel = 0; panel < panelsCount; panel++) {
        panels[panel].style.display = "none";
    }

    loadPanel(clientPanelBodyId, clientPanelButtonId);
}

function loadPanel(panelInput, panelInputButton) {
    // This function loads the wanted panel & changes the color of its button
    const panelBody = document.getElementById(panelInput);
    const panelButton = document.getElementById(panelInputButton);

    panelBody.style.display = "block";
    panelButton.className = panelButtonClickStateClass;

    for (let panel = 0; panel < panelsCount; panel++) {
        if (panels[panel] !== panelBody) {
            panels[panel].style.display = "none";
            panelsButtons[panel].className = panelButtonOriginalStateClass
        }
    }
}

function validateClientPanelEntries() {
    // Validate input for question 1
    if (q1Input.value.trim() === "") {
        q1ErrorMessage.style.display = "block";
    } else if (q1Input.value.trim() !== "" && q1ErrorMessage.style.display === "block") {
        q1ErrorMessage.style.display = "none";
    }

    return (q1ErrorMessage.style.display === "none")
}

function clientPanelNextButtonClick() {
    const isInputValid = validateClientPanelEntries();

    if (isInputValid) {
        q1UserInput = q1Input.value.trim();
        q2UserInput = [q2InputOption1.checked, q2InputOption2.checked];

        if (q3InputOption1.checked) {
            q3UserInput = "Y";
        } else if (q3InputOption2.checked) {
            q3UserInput = "N";
        } else if (q3InputOption3.checked) {
            q3UserInput = "N/A";
        }

        q4UserInput = q4Input.value;

        productsMissingFieldsAlert.style.display = "none";

        loadPanel(productsPanelBodyId, productsPanelButtonId);
        displayProducts();
    } else {
        productsMissingFieldsAlert.style.display = "block";
        productsNoProductsAlert.style.display = "none";
        productsTable.style.display = "none";
        addToCartButton.style.display = "none";
    }
}

function calculateBudget(product) {
    const smallBudgetThreshold = 5;
    const mediumAndLargeBudgetThreshold = 10;

    if (product.price < smallBudgetThreshold) {
        return "small";
    } else if (product.price < mediumAndLargeBudgetThreshold) {
        return "medium";
    } else {
        return "large";
    }
}

function displayProducts() {
    productsToShow = [];

    for (let product = 0; product < products.length; product++) {
        const productObject = products[product];
        const productBudget = calculateBudget(productObject);

        if (q2UserInput[0] === true && productObject.containsLactose) {
            continue;
        }

        if (q2UserInput[1] === true && productObject.containsNuts) {
            continue;
        }

        if (q3UserInput === "Y" && !productObject.isOrganic) {
            continue;
        } else if (q3UserInput === "N" && productObject.isOrganic) {
            continue;
        }

        if (q4UserInput === "q4-1" && productBudget !== "small") {
            continue;
        } else if (q4UserInput === "q4-2" && productBudget !== "medium") {
            continue;
        } else if (q4UserInput === "q4-3" && productBudget !== "large") {
            continue;
        }

        // If product fits the criteria, it adds it to the table
        productsToShow.push(productObject);
    }

    if (productsToShow.length === 0) {
        productsTableTbody.innerHTML = "";
        productsTable.style.display = "none";
        addToCartButton.style.display = "none"
        productsNoProductsAlert.style.display = "block";
    } else {
        productsNoProductsAlert.style.display = "none";
        addToCartButton.style.display = "block";

        // Sorting the array of products by price (from cheapest to most expensive) & clearing the table
        productsToShow = productsToShow.sort((a, b) => a.price - b.price);
        productsTableTbody.innerHTML = "";

        for (let product = 0; product < productsToShow.length; product++) {
            const productObject = productsToShow[product];
            const tableRow = productsTableTbody.insertRow(-1);
            const cell1 = tableRow.insertCell(0);
            const cell2 = tableRow.insertCell(1);
            const cell3 = tableRow.insertCell(2);
            const productName = productObject.name;
            let checkBox = document.createElement("input");
            let checkBoxLabel = document.createElement('label');

            checkBox.setAttribute("type", "checkbox");
            checkBox.setAttribute("class", "form-check-input");
            checkBox.setAttribute("name", `${productObject.index}-check`);
            checkBox.setAttribute("id", `${productObject.index}-check`);
            checkBox.setAttribute("value", `${productObject.index}-check`);
            checkBoxLabel.setAttribute('for',`${productObject.index}-check`);
            checkBoxLabel.innerText = 'Add to cart';

            cell1.innerHTML = productName;
            cell2.innerHTML = `$${productObject.price}`;
            cell3.append(checkBox, checkBoxLabel);
            cell3.setAttribute("class", "product-cart-checkbox");
            cell3.setAttribute("id", `${productObject.index}`);
        }

        productsTable.style.display = "";
    }
}

function addToCartButtonClick() {
    const checkboxes = document.getElementsByClassName("product-cart-checkbox");
    productsInCart = [];

    for (let product = 0; product < checkboxes.length; product++) {
        const productId = parseInt(checkboxes[product].id);
        const checkboxIsChecked = checkboxes[product].getElementsByTagName("input")[0].checked;

        if (checkboxIsChecked) {
            productsInCart.push(products[productId])
        }
    }

    if (productsInCart.length === 0) {
        cartTableTbody.innerHTML = "";
        cartTableTfoot.innerHTML = "";
        productsErrorMessage.style.display = "block";
        productsNotInCartAlert.style.display = "block";
        cartTable.style.display = "none";
        placeOrderButton.style.display = "none";
    } else {
        productsErrorMessage.style.display = "none";
        productsNotInCartAlert.style.display = "none";
        placeOrderButton.style.display = "block";
        loadPanel(shoppingCartBodyId, shoppingCartButtonId);
        displayCart();
    }
}

function calculateTotalPrice() {
    let totalPrice = 0;

    for (let product = 0; product < productsInCart.length; product++) {
        const productObject = productsInCart[product];
        totalPrice = totalPrice + productObject.price;
    }

    return totalPrice.toFixed(2);
}

function displayCart() {
    shoppingCardTitle.innerText = `Thank you for shopping with us, ${q1UserInput}!`
    cartTableTbody.innerHTML = "";
    cartTableTfoot.innerHTML = "";

    for (let product = 0; product < productsInCart.length; product++) {
        const productObject = productsInCart[product];
        const tableRow = cartTableTbody.insertRow(-1);
        const cell1 = tableRow.insertCell(0);
        const cell2 = tableRow.insertCell(1);

        cell1.innerHTML = productObject.name;
        cell2.innerHTML = `$${productObject.price}`;
    }

    const tableFootRow = cartTableTfoot.insertRow(-1);
    const tfootCell1 = tableFootRow.insertCell(0);
    const tfootCell2 = tableFootRow.insertCell(1);
    const totalText = "Total";
    const total = `$${calculateTotalPrice()}`;

    tfootCell1.innerHTML = totalText.bold();
    tfootCell2.innerHTML = total.bold();

    cartTable.style.display = "";
}