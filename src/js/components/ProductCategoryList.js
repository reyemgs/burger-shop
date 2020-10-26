export default class ProductCategoryList {
    constructor() {
        this.sideBar = document.querySelector('#sidebar-wrapper');
        this.menuItems = [
            'Блины',
            'Шаурма',
            'Сендвичи',
            'Бургеры',
            'Курица & Картофель',
            'Тортилья & Салаты',
            'Напитки & Десерты',
        ];
    }

    createProductCategoryList() {
        const menu = document.createElement('ul');
        menu.className = 'category-menu';
        for (let i = 0; i < this.menuItems.length; i++) {
            const li = document.createElement('li');
            li.className = 'menu-item';
            li.innerHTML = this.menuItems[i];
            menu.append(li);
        }
        this.sideBar.append(menu);
    }

    render() {
        this.createProductCategoryList();
    }
}
