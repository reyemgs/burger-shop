export default class Basket {
    constructor() {
        this.sideBar = document.querySelector('#sidebar-wrapper');
    }

    createBasket() {
        const basketWrapper = document.createElement('div');
        const basketHeader = document.createElement('span');
        const basketBody = document.createElement('div');
        const basketOrderButton = document.createElement('button');

        basketWrapper.className = 'basket';
        basketHeader.className = 'basket-header';
        basketBody.className = 'basket-body';
        basketOrderButton.className = 'order-button';

        basketHeader.innerHTML = '<i class="fas fa-shopping-basket"></i> Корзина';
        basketOrderButton.innerHTML = 'ОФОРМИТЬ ЗАКАЗ';

        basketBody.append(basketOrderButton);
        basketWrapper.append(basketHeader);
        basketWrapper.append(basketBody);
        this.sideBar.append(basketWrapper);
    }

    render() {
        this.createBasket();
    }
}
