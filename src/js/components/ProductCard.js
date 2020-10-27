import Basket from './Basket';

export default class ProductCard {
    constructor(item, response) {
        this.rightSideWrapper = document.querySelector('#rightside-wrapper');
        this.response = response;

        this.name = item.name;
        this.image = item.image;
        this.price = item.price;
        this.description = item.description;
        this.market = item.market;

        this.productQuantity = 1;
    }

    createProductCard() {
        const productCardWrapper = document.createElement('div');
        productCardWrapper.className = 'product-card-wrapper';

        const productMarket = document.createElement('img');
        productMarket.className = 'product-market';
        productMarket.setAttribute(
            'src',
            `../examples${this.response.markets[this.market].image}`
        );

        const productImage = document.createElement('img');
        productImage.className = 'product-image';
        productImage.setAttribute('src', '../examples' + this.image);

        const productName = document.createElement('span');
        productName.className = 'product-name';
        productName.innerHTML = this.name;

        const productDescription = document.createElement('div');
        productDescription.className = 'product-description';
        productDescription.innerHTML = this.description;

        const productPrice = document.createElement('span');
        productPrice.className = 'product-price';
        productPrice.innerHTML = `Цена: ${this.price} руб.`;

        const productSetAmountWrapper = document.createElement('div');
        const productAmountLabel = document.createElement('span');
        const productAmount = document.createElement('span');
        const productIncreaseButton = document.createElement('div');
        const productDecreaseButton = document.createElement('div');
        const productInBasketButton = document.createElement('button');

        productSetAmountWrapper.className = 'set-amount-wrapper';
        productAmountLabel.className = 'product-amount-label';
        productAmount.className = 'product-amount';
        productIncreaseButton.className = 'increase-button';
        productDecreaseButton.className = 'decrease-button';
        productInBasketButton.className = 'in-basket-button';

        productAmountLabel.innerHTML = 'Количество';
        productAmount.innerHTML = this.productQuantity;
        productIncreaseButton.innerHTML = '<i class="fas fa-plus-circle"></i>';
        productDecreaseButton.innerHTML = '<i class="fas fa-minus-circle"></i>';
        productInBasketButton.innerHTML = 'В КОРЗИНУ';

        productSetAmountWrapper.append(
            productAmountLabel,
            productDecreaseButton,
            productAmount,
            productIncreaseButton,
            productInBasketButton
        );
        productCardWrapper.append(
            productMarket,
            productImage,
            productName,
            productDescription,
            productPrice,
            productSetAmountWrapper
        );
        this.rightSideWrapper.append(productCardWrapper);

        // * EVENTS * //
        productIncreaseButton.addEventListener('click', () =>
            this.increaseQuantity(productAmount)
        );

        productDecreaseButton.addEventListener('click', () =>
            this.decreaseQuantity(productAmount)
        );
    }

    increaseQuantity(productAmount) {
        this.productQuantity = this.productQuantity + 1;
        productAmount.innerHTML = this.productQuantity;
    }

    decreaseQuantity(productAmount) {
        if (this.productQuantity === 1) return;
        else {
            this.productQuantity = this.productQuantity - 1;
            productAmount.innerHTML = this.productQuantity;
        }
    }
}
