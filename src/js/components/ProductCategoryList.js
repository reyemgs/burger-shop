export default class ProductCategoryList {
    constructor() {
        this.sideBar = document.querySelector('#sidebar-wrapper');
        this.menuItems = [
            { id: 1, name: 'Пицца', category: 'pizza' },
            { id: 2, name: 'Шаурма', category: 'shaurma' },
            { id: 3, name: 'Сендвичи', category: 'sandwiches' },
            { id: 4, name: 'Бургеры', category: 'burgers' },
            { id: 5, name: 'Курица & Картофель', category: 'chicken' },
            { id: 6, name: 'Тортилья & Салаты', category: 'salads' },
            { id: 7, name: 'Напитки & Десерты', category: 'drinks' },
        ];
    }

    createProductCategoryList() {
        const menu = document.createElement('ul');
        menu.className = 'category-menu';
        for (let i = 0; i < this.menuItems.length; i++) {
            const li = document.createElement('li');
            li.className = 'menu-item';
            li.innerHTML = this.menuItems[i].name;
            menu.append(li);
        }
        this.sideBar.append(menu);
    }

    render() {
        this.createProductCategoryList();
    }
}
