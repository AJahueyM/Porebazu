import {MDCList} from "@material/list";
import {MDCDrawer} from "@material/drawer";
import {MDCTopAppBar} from '@material/top-app-bar';

const list = MDCList.attachTo(document.querySelector('.mdc-list'));
list.wrapFocus = true;

const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
drawer.open = true;

const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);


topAppBar.listen('MDCTopAppBar:nav', () => {
    drawer.open = !drawer.open;
});

const transitionsTop = document.querySelectorAll('.top-layer');
const transitionsBottom = document.querySelectorAll('.bottom-layer');

let lastNavListIndex = 0;

list.listen('click', () => {
    let movementList = list.selectedIndex - lastNavListIndex;

    if(movementList > 0){
        for(const transitionTop of transitionsTop){
            console.log('Entered');
            transitionTop.classList.remove('top-layer');
            void transitionTop.offsetHeight;
            transitionTop.classList.add('top-layer');
        }
    }else if(movementList < 0){
        for(const transitionBottom of transitionsBottom){
            console.log('Entered');
            transitionBottom.classList.remove('bottom-layer');
            void transitionBottom.offsetHeight;
            transitionBottom.classList.add('bottom-layer');
        }
    }
    lastNavListIndex = list.selectedIndex;
});