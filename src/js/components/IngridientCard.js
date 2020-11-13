export default class IngridientCard {
    constructor(item) {
        this.id = item.id;
        this.key = item.key;
        this.name = item.name;
        this.price = item.price;
        this.image = item.image;
        this.description = item.description;
        this.category = item.category;
        this.selected = false;
    }

    active(id) {
        const ingridients = document.querySelectorAll('.ingridient-wrapper');
        if (this.category == 'sizes' || this.category == 'breads') {
            this.activeSingle(ingridients, id);
        } else {
            this.activeMultiple(ingridients, id);
        }
    }

    activeSingle(ingridients, id) {
        for (const item of ingridients) {
            item.classList.remove('active');
            if (item.getAttribute('data-ingridient-id') == id) {
                item.classList.add('active');
            }
        }
    }

    activeMultiple(ingridients, id) {
        for (const item of ingridients) {
            if (item.getAttribute('data-ingridient-id') == id) {
                item.classList.toggle('active');
            }
        }
    }

    createCardWrapper() {
        const wrapper = document.createElement('div');
        wrapper.className = 'ingridient-wrapper';
        wrapper.setAttribute('data-ingridient-id', this.id);
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
        if (this.selected) {
            this.active(this.id);
        }
    }
}
