export default class ProductCard {
    constructor(item, response) {
        this.rightSideWrapper = document.querySelector('#rightside-wrapper');

        this.name = item.name;
        this.description = item.description;
        this.market = item.market;
        this.image = item.image;

        this.response = response;
    }

    createProductCard() {
        const productCardWrapper = document.createElement('div');
        productCardWrapper.className = 'product-card-wrapper';

        const productCardMarket = document.createElement('img');
        productCardMarket.className = 'product-market';
        productCardMarket.setAttribute(
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

        productCardWrapper.append(productCardMarket);
        productCardWrapper.append(productImage);
        productCardWrapper.append(productName);
        productCardWrapper.append(productDescription);
        this.rightSideWrapper.append(productCardWrapper);
    }
}
