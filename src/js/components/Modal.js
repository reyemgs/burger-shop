export default class Modal {
    constructor() {
        this.menuItems = [
            {
                id: 1,
                category: 'sizes',
                name: 'Размер',
                title: 'Выберите размер сендвича',
            },
            {
                id: 2,
                category: 'breads',
                name: 'Хлеб',
                title: 'Хлеб для сендвича на выбор',
            },
            {
                id: 3,
                category: 'vegetables',
                name: 'Овощи',
                title: 'Дополнительные овощи бесплатно',
            },
            {
                id: 4,
                category: 'sauces',
                name: 'Соусы',
                title: 'Выберите 3 бесплатных соуса по вкусу',
            },
            {
                id: 5,
                category: 'fillings',
                name: 'Начинка',
                title: 'Добавьте начинку по вкусу',
            },
            {
                id: 6,
                category: 'done',
                name: 'Готово!',
                title: 'Проверьте и добавьте в корзину',
            },
        ];
        this.currentProduct = null;
        this.currentPage = 1;
    }

    open(product) {
        this.currentProduct = product;
        this.active(this.getCategoryItem(this.currentPage));
        document.body.style.overflow = 'hidden';
        const wrapper = document.querySelector('.modal-wrapper');
        const shadow = document.querySelector('.shadow-modal');
        const title = document.querySelector('.modal-title');
        title.innerHTML = this.getMenuItem(this.currentPage).title;
        wrapper.classList.toggle('active');
        shadow.classList.toggle('active');
    }

    close() {
        this.currentPage = 1;
        document.body.style.overflow = 'visible';
        const wrapper = document.querySelector('.modal-wrapper');
        const shadow = document.querySelector('.shadow-modal');
        wrapper.classList.toggle('active');
        shadow.classList.toggle('active');
    }

    nextPage() {
        this.currentPage = this.getMenuItem(this.currentPage + 1).id;
        const title = document.querySelector('.modal-title');
        title.innerHTML = this.getMenuItem(this.currentPage).title;
        this.active(this.getCategoryItem(this.currentPage));
        console.log(this.currentPage, this.getCategoryItem(this.currentPage));
    }

    previousPage() {
        this.currentPage = this.getMenuItem(this.currentPage - 1).id;
        const title = document.querySelector('.modal-title');
        title.innerHTML = this.getMenuItem(this.currentPage).title;
        this.active(this.getCategoryItem(this.currentPage));
        console.log(this.currentPage, this.getCategoryItem(this.currentPage));
    }

    active(category) {
        const items = document.querySelectorAll('.modal-menu-item');
        for (const li of items) {
            li.classList.remove('active');
            if (li.getAttribute('data-category') === category) {
                li.classList.add('active');
            }
        }
    }

    getMenuItem(id) {
        return this.menuItems.find(item => item.id == id);
    }

    getCategoryItem(id) {
        let result = this.menuItems.find(item => item.id == id);
        return result.category;
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

    createDonePage(product, data) {
        const wrapper = document.createElement('div');
        wrapper.className = 'done-wrapper';

        const header = document.createElement('span');
        header.className = 'done-header';
        header.innerHTML = 'Ваш сендвич готов!';

        const info = document.createElement('div');
        info.className = 'done-info';

        const size = document.createElement('span');
        size.className = 'done-size';
        size.innerHTML = `Размер: ${data.sizes[product.components.size].name}`;

        const bread = document.createElement('span');
        bread.className = 'done-bread';
        bread.innerHTML = `Хлеб: ${data.breads[product.components.bread].name}`;

        const vegetables = document.createElement('span');
        vegetables.className = 'done-vegetables';
        vegetables.innerHTML = `Овощи: ${product.components.vegetable}`;

        const sauces = document.createElement('span');
        sauces.className = 'done-sauces';
        sauces.innerHTML = `Соусы: ${product.components.sauce}`;

        const fillings = document.createElement('span');
        fillings.className = 'done-fillings';
        fillings.innerHTML = `Начинка: ${product.components.filling}`;

        const name = document.createElement('span');
        name.className = 'done-name';
        name.innerHTML = `${product.name}`;

        info.append(size, bread, vegetables, sauces, fillings);
        wrapper.append(header, info, name);
        return wrapper;
    }

    createCloseButton() {
        const closeButton = document.createElement('div');
        closeButton.className = 'close-modal';
        closeButton.innerHTML = '<i class="fas fa-times fa-2x"></i>';
        closeButton.addEventListener('click', () => this.close());
        return closeButton;
    }

    createNextButton() {
        const nextButton = document.createElement('button');
        nextButton.className = 'next-button';
        nextButton.innerHTML = 'ВПЕРЕД';
        // nextButton.addEventListener('click', () => this.nextPage());
        return nextButton;
    }

    createPreviousButton() {
        const previousButton = document.createElement('button');
        previousButton.className = 'previous-button';
        previousButton.innerHTML = 'НАЗАД';
        // previousButton.addEventListener('click', () => this.previousPage());
        return previousButton;
    }

    createTitle() {
        const title = document.createElement('span');
        title.className = 'modal-title';
        return title;
    }

    createHeader() {
        const header = document.createElement('div');
        header.className = 'modal-header';
        header.append(this.createTitle(), this.createCloseButton());
        return header;
    }

    createFooter() {
        const footer = document.createElement('div');
        footer.className = 'modal-footer';
        return footer;
    }

    createItemsWrapper() {
        const itemWrapper = document.createElement('div');
        itemWrapper.className = 'items-wrapper';
        itemWrapper.append(this.createPreviousButton(), this.createMenuItems(), this.createNextButton());
        return itemWrapper;
    }

    createMenuItems() {
        const ul = document.createElement('ul');
        ul.className = 'items-list';
        for (const item of this.menuItems) {
            const li = document.createElement('li');
            li.setAttribute('data-category', item.category);
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
            this.createItemsWrapper(),
            this.createContent(),
            this.createFooter()
        );
        document.body.append(wrapper, this.createShadow());
    }
}
