export default class Modal {
    constructor() {
        this.menuItems = [
            { id: 'sizes', name: 'Размер' },
            { id: 'bread', name: 'Хлеб' },
            { id: 'vegetables', name: 'Овощи' },
            { id: 'sauces', name: 'Соусы' },
            { id: 'fillings', name: 'Начинка' },
            { id: 'done', name: 'Готово!' },
        ];
    }

    createWrapper() {
        const wrapper = document.createElement('div');
        wrapper.className = 'modal-wrapper';
        return wrapper;
    }

    createHeader() {
        const header = document.createElement('div');
        header.className = 'modal-header';
        return header;
    }

    createMenuItems() {
        const ul = document.createElement('ul');
        ul.className = 'items-wrapper';
        for (const item of this.menuItems) {
            const li = document.createElement('li');
            li.setAttribute('data-category', item.id);
            li.className = 'modal-menu-item';
            li.innerHTML = item.name;
            ul.append(li);
        }
        return ul;
    }

    createModal() {
        const wrapper = this.createWrapper();
        wrapper.append(this.createHeader(), this.createMenuItems());
        document.body.append(wrapper);
    }
}
