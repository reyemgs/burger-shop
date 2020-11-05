export default class Modal {
    constructor() {
        this.menuItems = [
            { id: 'sizes', name: 'Размер' },
            { id: 'breads', name: 'Хлеб' },
            { id: 'vegetables', name: 'Овощи' },
            { id: 'sauces', name: 'Соусы' },
            { id: 'fillings', name: 'Начинка' },
            { id: 'done', name: 'Готово!' },
        ];
        this.currentProduct = null;
    }

    createWrapper() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('modal-wrapper');
        return wrapper;
    }

    createContent() {
        const content = document.createElement('div');
        content.className = 'modal-content';
        return content;
    }

    createCloseButton() {
        const closeButton = document.createElement('div');
        closeButton.className = 'close-modal';
        closeButton.innerHTML = '<i class="fas fa-times fa-2x"></i>';
        closeButton.addEventListener('click', () => this.close());
        return closeButton;
    }

    createHeader() {
        const header = document.createElement('div');
        header.className = 'modal-header';
        header.append(this.createCloseButton());
        return header;
    }

    createFooter() {
        const footer = document.createElement('div');
        footer.className = 'modal-footer';
        return footer;
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

    createShadow() {
        const shadow = document.createElement('div');
        shadow.classList.add('shadow-modal');
        return shadow;
    }

    createModal() {
        const wrapper = this.createWrapper();
        wrapper.append(
            this.createHeader(),
            this.createMenuItems(),
            this.createContent(),
            this.createFooter()
        );
        document.body.append(wrapper, this.createShadow());
    }

    open(product) {
        this.currentProduct = product;
        document.body.style.overflow = 'hidden';
        const wrapper = document.querySelector('.modal-wrapper');
        const shadow = document.querySelector('.shadow-modal');
        wrapper.classList.toggle('active');
        shadow.classList.toggle('active');
    }

    close() {
        document.body.style.overflow = 'visible';
        const wrapper = document.querySelector('.modal-wrapper');
        const shadow = document.querySelector('.shadow-modal');
        wrapper.classList.toggle('active');
        shadow.classList.toggle('active');
    }
}
