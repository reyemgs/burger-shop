export default class Basket {
    constructor() {
        this.sideBar = document.querySelector('#sidebar-wrapper');
        this.addedProducts = [];
        this.totalPrice = 0;
    }

    monitoring() {
        console.log(this.addedProducts);
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

        if (this.isAdded(product)) return;

        const basketProduct = this.createProduct();
        this.addTotalPrice(basketTotalPrice, product);

        basketProduct.append(
            this.createProductName(product),
            this.createProductQuantity(product),
            this.createRemoveButton(product)
        );
        basketProductsWrapper.append(basketProduct);
        this.addedProducts.push(product);
        this.monitoring();
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

    removeProduct(id) {
        const index = this.addedProducts.findIndex(item => item.id == id);
        this.addedProducts.splice(index, 1);
        this.monitoring();
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

    createRemoveButton(item) {
        const totalPrice = document.querySelector('.basket-total-price');
        const basketRemoveButton = document.createElement('div');
        basketRemoveButton.className = 'remove-button';
        basketRemoveButton.innerHTML = '<i class="fas fa-trash-alt fa-lg"></i>';

        basketRemoveButton.addEventListener('click', () => {
            this.removeProduct(item.id);
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
