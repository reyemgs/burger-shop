export default class ProductCard {
    constructor(item) {
        this.id = item.id;
        this.name = item.name;
        this.image = item.image;
        this.price = item.price;
        this.description = item.description;
        this.market = item.market;
        this.category = item.category;
        this.type = item.type;
        this.weight = item.weight;
        this.components = item.components;
        this.productQuantity = 1;
        this.added = false;
    }

    increaseQuantity(productQuantity) {
        this.productQuantity = this.productQuantity + 1;
        productQuantity.innerHTML = this.productQuantity;
    }

    decreaseQuantity(productQuantity) {
        if (this.productQuantity === 1) return;
        else {
            this.productQuantity = this.productQuantity - 1;
            productQuantity.innerHTML = this.productQuantity;
        }
    }

    createMarket(response) {
        const productMarket = document.createElement('img');
        productMarket.className = 'product-market';
        productMarket.setAttribute('src', `../examples${response.markets[this.market].image}`);
        return productMarket;
    }

    createImage() {
        const productImage = document.createElement('img');
        productImage.className = 'product-image';
        productImage.setAttribute('src', '../examples' + this.image);
        return productImage;
    }

    createName() {
        const productName = document.createElement('span');
        productName.className = 'product-name';
        productName.innerHTML = this.name;
        return productName;
    }

    createDescription() {
        const productDescription = document.createElement('div');
        productDescription.className = 'product-description';
        productDescription.innerHTML = this.description;
        return productDescription;
    }

    createPrice() {
        const productPrice = document.createElement('span');
        productPrice.className = 'product-price';
        productPrice.innerHTML = `Цена: ${this.price} руб.`;
        return productPrice;
    }

    createQuantityLabel() {
        const productQuantityLabel = document.createElement('span');
        productQuantityLabel.className = 'product-quantity-label';
        productQuantityLabel.innerHTML = 'Количество';
        return productQuantityLabel;
    }

    createInBasketButton() {
        const productInBasketButton = document.createElement('button');
        productInBasketButton.className = 'in-basket-button';
        productInBasketButton.setAttribute('data-product-card-id', this.id);
        productInBasketButton.innerHTML = 'В КОРЗИНУ';
        return productInBasketButton;
    }

    createSetAmountWrapper() {
        const productSetAmountWrapper = document.createElement('div');
        productSetAmountWrapper.className = 'set-quantity-wrapper';

        const productQuantity = document.createElement('span');
        productQuantity.className = 'product-quantity';
        productQuantity.innerHTML = this.productQuantity;

        const productIncreaseButton = document.createElement('div');
        productIncreaseButton.className = 'increase-button';
        productIncreaseButton.setAttribute('data-increase-id', this.id);
        productIncreaseButton.innerHTML = '<i class="fas fa-plus-circle"></i>';

        const productDecreaseButton = document.createElement('div');
        productDecreaseButton.className = 'decrease-button';
        productDecreaseButton.setAttribute('data-decrease-id', this.id);
        productDecreaseButton.innerHTML = '<i class="fas fa-minus-circle"></i>';

        productSetAmountWrapper.append(
            this.createQuantityLabel(),
            productDecreaseButton,
            productQuantity,
            productIncreaseButton,
            this.createInBasketButton()
        );

        return productSetAmountWrapper;
    }

    createProductCard(response) {
        const rightSideWrapper = document.querySelector('#rightside-wrapper');
        const productCardWrapper = document.createElement('div');

        productCardWrapper.className = 'product-card-wrapper';
        productCardWrapper.append(
            this.createMarket(response),
            this.createImage(),
            this.createName(),
            this.createDescription(),
            this.createPrice(),
            this.createSetAmountWrapper()
        );
        rightSideWrapper.append(productCardWrapper);
    }
}
