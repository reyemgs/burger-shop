export default class IngridientCard {
    constructor(item) {
        this.id = item.id;
        this.name = item.name;
        this.price = item.price;
        this.image = item.image;
        this.description = item.description;
        this.category = item.category;
    }

    createCardWrapper() {
        const wrapper = document.createElement('div');
        wrapper.className = 'ingridient-wrapper';
        return wrapper;
    }

    createImage() {
        const image = document.createElement('img');
        image.className = 'ingridient-image';
        image.setAttribute('src', '../examples' + this.image);
        return image;
    }

    createName() {
        const name = document.createElement('span');
        name.className = 'ingridient-name';
        name.innerHTML = this.name;
        return name;
    }

    createPrice() {
        const price = document.createElement('span');
        price.className = 'ingridient-price';
        price.innerHTML = `Цена: ${this.price} руб.`;
        return price;
    }

    createIngridientCard() {
        const content = document.querySelector('.modal-content');
        const wrapper = this.createCardWrapper();
        wrapper.append(this.createImage(), this.createName(), this.createPrice());
        content.append(wrapper);
    }
}
