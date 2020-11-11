export default class Basket {
    constructor() {
        this.sideBar = document.querySelector('#sidebar-wrapper');
        this.addedProducts = [];
        this.totalPrice = 0;
    }

    getProduct(id) {
        return this.addedProducts.find(product => product.id == id);
    }

    isAdded(product) {
        return this.addedProducts.length != 0 && this.addedProducts.some(item => item.id === product.id);
    }

    addProduct(product) {
        const basketProductsWrapper = document.getElementById('basket-content-wrapper');
        const basketTotalPrice = document.querySelector('.basket-total-price');

        if (this.isAdded(product)) {
            this.updateTotalPrice(basketTotalPrice, this.addedProducts);
            return;
        }

        const basketProduct = this.createProduct();
        this.addTotalPrice(basketTotalPrice, product);

        basketProduct.append(
            this.createProductName(product),
            this.createProductQuantity(product),
            this.createRemoveButton(product)
        );
        basketProductsWrapper.append(basketProduct);

        product.added = true;
        this.addedProducts.push(product);
    }

    addTotalPrice(elem, product) {
        this.totalPrice += product.price * product.productQuantity;
        elem.innerHTML = `Итого: ${this.totalPrice} руб.`;
    }

    updateTotalPrice(elem, addedProducts) {
        this.totalPrice = 0;
        for (let item of addedProducts) {
            this.totalPrice += item.price * item.productQuantity;
        }
        elem.innerHTML = `Итого: ${this.totalPrice} руб.`;
    }

    updateProducts() {
        const basketProductsWrapper = document.getElementById('basket-content-wrapper');

        basketProductsWrapper.innerHTML = '';
        for (const item of this.addedProducts) {
            const basketProduct = this.createProduct();

            basketProduct.append(
                this.createProductName(item),
                this.createProductQuantity(item),
                this.createRemoveButton(item)
            );
            basketProductsWrapper.append(basketProduct);
        }
    }

    removeProduct(id, category) {
        // find index of removed item
        const index = this.addedProducts.findIndex(item => item.id == id);

        // if find category equal category then change style of button
        if (this.findCurrentCategory() == category) {
            const productButton = document.querySelector(
                `button.in-basket-button[data-product-card-id="${id}"]`
            );
            productButton.textContent = 'В КОРЗИНУ';
            productButton.removeAttribute('style');
        }

        // delete item from basket
        this.addedProducts[index].added = false;
        this.addedProducts.splice(index, 1);
    }

    findCurrentCategory() {
        const menuItems = document.querySelectorAll('.menu-item');
        let currentCategory = null;

        // find active item and return its id(category)
        for (const item of menuItems) {
            if (item.classList.contains('active')) {
                currentCategory = item.getAttribute('id');
            }
        }
        return currentCategory;
    }

    // * PRODUCT * //
    createProduct() {
        const basketProduct = document.createElement('div');
        basketProduct.className = 'basket-product';
        return basketProduct;
    }

    createProductName(item) {
        const basketProductName = document.createElement('span');
        basketProductName.className = 'basket-product-name';
        basketProductName.innerHTML = item.name;
        return basketProductName;
    }

    createProductQuantity(item) {
        const basketProductQuantity = document.createElement('span');
        basketProductQuantity.className = 'basket-product-quantity';
        basketProductQuantity.innerHTML = item.productQuantity;
        return basketProductQuantity;
    }

    createIngridients(product, data) {
        const ingridientWrapper = document.createElement('ul');
        ingridientWrapper.className = 'basket-ingridient-wrapper';

        for (let ingridient of product.components) {
            const ingridient = document.createElement('li');
            ingridient.className = 'basket-ingridient';
            ingridient.innerHTML = data[ingridient];
        }
    }

    createRemoveButton(item) {
        const totalPrice = document.querySelector('.basket-total-price');
        const basketRemoveButton = document.createElement('div');
        basketRemoveButton.className = 'remove-button';
        basketRemoveButton.innerHTML = '<i class="fas fa-trash-alt fa-lg"></i>';

        basketRemoveButton.addEventListener('click', () => {
            this.removeProduct(item.id, item.category);
            this.updateTotalPrice(totalPrice, this.addedProducts);
            this.updateProducts();
        });

        return basketRemoveButton;
    }

    // * HEADER & BODY * //
    createWrapper() {
        const basketWrapper = document.createElement('div');
        basketWrapper.className = 'basket';
        return basketWrapper;
    }

    createHeader() {
        const basketHeader = document.createElement('span');
        basketHeader.className = 'basket-header';
        basketHeader.innerHTML = '<i class="fas fa-shopping-basket"></i> Корзина';
        return basketHeader;
    }

    createBody() {
        const basketBody = document.createElement('div');
        basketBody.className = 'basket-body';
        return basketBody;
    }

    createLabelWrapper() {
        const basketLabelWrapper = document.createElement('div');
        basketLabelWrapper.className = 'basket-label-wrapper';
        return basketLabelWrapper;
    }

    createNameLabel() {
        const basketNameLabel = document.createElement('span');
        basketNameLabel.className = 'basket-name-label';
        basketNameLabel.innerHTML = 'Название';
        return basketNameLabel;
    }

    createQuantityLabel() {
        const basketQuantityLabel = document.createElement('span');
        basketQuantityLabel.className = 'basket-quantity-label';
        basketQuantityLabel.innerHTML = 'Количество';
        return basketQuantityLabel;
    }

    createProductsWrapper() {
        const basketProductsWrapper = document.createElement('div');
        basketProductsWrapper.className = 'basket-content-wrapper';
        basketProductsWrapper.setAttribute('id', 'basket-content-wrapper');
        return basketProductsWrapper;
    }

    createTotalPrice() {
        const basketTotalPrice = document.createElement('span');
        basketTotalPrice.className = 'basket-total-price';
        basketTotalPrice.innerHTML = `Итого: ${this.totalPrice} руб.`;
        return basketTotalPrice;
    }

    createOrderButton() {
        const basketOrderButton = document.createElement('button');
        basketOrderButton.className = 'order-button';
        basketOrderButton.innerHTML = 'ОФОРМИТЬ ЗАКАЗ';
        return basketOrderButton;
    }

    // * BASKET * //
    createBasket() {
        const basketWrapper = this.createWrapper();
        const basketBody = this.createBody();
        const basketLabelWrapper = this.createLabelWrapper();

        basketLabelWrapper.append(this.createNameLabel(), this.createQuantityLabel());
        basketBody.append(
            basketLabelWrapper,
            this.createProductsWrapper(),
            this.createTotalPrice(),
            this.createOrderButton()
        );
        basketWrapper.append(this.createHeader(), basketBody);
        this.sideBar.append(basketWrapper);
    }

    render() {
        this.createBasket();
    }
}
