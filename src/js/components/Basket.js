export default class Basket {
    constructor() {
        this.sideBar = document.querySelector('#sidebar-wrapper');
        this.addedProducts = [];
        this.totalPrice = 0;
    }

    isAdded(product) {
        return (
            this.addedProducts.length != 0 &&
            this.addedProducts.some(item => item.id === product.id)
        );
    }

    addProduct(product) {
        if (this.isAdded(product)) {
            return;
        }

        const basketProductsWrapper = document.getElementById(
            'basket-content-wrapper'
        );
        const basketContent = document.createElement('div');
        basketContent.className = 'basket-content';

        const basketProductName = document.createElement('span');
        basketProductName.className = 'basket-product-name';
        basketProductName.innerHTML = product.name;

        const basketProductQuantity = document.createElement('span');
        basketProductQuantity.className = 'basket-product-quantity';
        basketProductQuantity.innerHTML = product.productQuantity;

        const basketTotalPrice = document.querySelector('.basket-total-price');
        this.updateTotalPrice(
            basketTotalPrice,
            product.price,
            product.productQuantity
        );

        basketContent.append(basketProductName, basketProductQuantity);
        basketProductsWrapper.append(basketContent);
        this.addedProducts.push(product);
    }

    updateTotalPrice(elem, price, quantity) {
        this.totalPrice += price * quantity;
        elem.innerHTML = `Итого: ${this.totalPrice} руб.`;
    }

    createBasket() {
        const basketWrapper = document.createElement('div');
        basketWrapper.className = 'basket';

        const basketHeader = document.createElement('span');
        basketHeader.className = 'basket-header';
        basketHeader.innerHTML = '<i class="fas fa-shopping-basket"></i> Корзина';

        const basketBody = document.createElement('div');
        basketBody.className = 'basket-body';

        const basketLabelWrapper = document.createElement('div');
        basketLabelWrapper.className = 'basket-label-wrapper';
        const basketNameLabel = document.createElement('span');
        basketNameLabel.className = 'basket-name-label';
        const basketQuantityLabel = document.createElement('span');
        basketQuantityLabel.className = 'basket-quantity-label';
        basketNameLabel.innerHTML = 'Название';
        basketQuantityLabel.innerHTML = 'Количество';

        const basketProductsWrapper = document.createElement('div');
        basketProductsWrapper.className = 'basket-content-wrapper';
        basketProductsWrapper.setAttribute('id', 'basket-content-wrapper');

        const basketTotalPrice = document.createElement('span');
        basketTotalPrice.className = 'basket-total-price';
        basketTotalPrice.innerHTML = `Итого: ${this.totalPrice} руб.`;

        const basketOrderButton = document.createElement('button');
        basketOrderButton.className = 'order-button';
        basketOrderButton.innerHTML = 'ОФОРМИТЬ ЗАКАЗ';

        basketLabelWrapper.append(basketNameLabel, basketQuantityLabel);
        basketBody.append(
            basketLabelWrapper,
            basketProductsWrapper,
            basketTotalPrice,
            basketOrderButton
        );
        basketWrapper.append(basketHeader, basketBody);
        this.sideBar.append(basketWrapper);
    }

    render() {
        this.createBasket();
    }
}
