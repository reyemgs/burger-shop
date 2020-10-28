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
        this.productQuantity = 1;
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

    createMarket(response) {
        const productMarket = document.createElement('img');
        productMarket.className = 'product-market';
        productMarket.setAttribute(
            'src',
            `../examples${response.markets[this.market].image}`
        );
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

    createSetAmount() {
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
        productInBasketButton.setAttribute('id', this.id);

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

        productIncreaseButton.addEventListener('click', () =>
            this.increaseQuantity(productAmount)
        );

        productDecreaseButton.addEventListener('click', () =>
            this.decreaseQuantity(productAmount)
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
            this.createSetAmount()
        );
        rightSideWrapper.append(productCardWrapper);
    }
}
