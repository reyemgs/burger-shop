export default class Basket {
    constructor() {
        this.sideBar = document.querySelector('#sidebar-wrapper');
        this.totalPrice = 0;
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

        const basketTotalPrice = document.createElement('span');
        basketTotalPrice.className = 'basket-total-price';
        basketTotalPrice.innerHTML = `Итого: ${this.totalPrice} руб.`;

        const basketOrderButton = document.createElement('button');
        basketOrderButton.className = 'order-button';
        basketOrderButton.innerHTML = 'ОФОРМИТЬ ЗАКАЗ';

        basketLabelWrapper.append(basketNameLabel, basketQuantityLabel);
        basketBody.append(basketLabelWrapper, basketTotalPrice, basketOrderButton);
        basketWrapper.append(basketHeader, basketBody);
        this.sideBar.append(basketWrapper);
    }

    render() {
        this.createBasket();
    }
}
