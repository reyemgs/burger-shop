class SideBar {
    constructor() {
        this.sideBar = document.querySelector('#sidebar-wrapper');
        this.menuItems = [''];
    }

    createSideBar() {
        const menu = document.createElement('ul');
        menu.className = 'sidebar';
        for (let i = 0; i < 7; i++) {
            const li = document.createElement('li');
            li.innerHTML = i;
            menu.append(li);
        }
        this.sideBar.append(menu);
    }
}
