import {MDCList} from "@material/list";
import {MDCDrawer} from "@material/drawer";
import {MDCTopAppBar} from '@material/top-app-bar';
import {navigationListener} from "./index-content.jsx";
import './index-content.jsx'

const list = MDCList.attachTo(document.querySelector('.mdc-list'));
list.wrapFocus = true;

const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
drawer.open = true;

const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);
topAppBar.listen('MDCTopAppBar:nav', () => {
    drawer.open = !drawer.open;
});

let lastNavListIndex = 0;
const transitionsTop = document.querySelectorAll('.top-to-bottom-animation');
const transitionsBottom = document.querySelectorAll('.bottom-to-top-animation');

transitionsTop[0].addEventListener("animationstart", (event) => {
    setTimeout(() => {
        navigationListener.callback(list.selectedIndex);
    }, 200);
});

transitionsBottom[0].addEventListener("animationstart", (event) => {
    setTimeout(() => {
        navigationListener.callback(list.selectedIndex);
    }, 400);});

list.listen('click', () => {
    let movementList = list.selectedIndex - lastNavListIndex;
    if(movementList === 0){
        return;
    }
    if(movementList > 0){
        for(const transitionTop of transitionsTop){
            transitionTop.classList.remove('top-to-bottom-animation');
            void transitionTop.offsetHeight;
            transitionTop.classList.add('top-to-bottom-animation');
        }
    }else if(movementList < 0){
        for(const transitionBottom of transitionsBottom){
            transitionBottom.classList.remove('bottom-to-top-animation');
            void transitionBottom.offsetHeight;
            transitionBottom.classList.add('bottom-to-top-animation');
        }
    }
    lastNavListIndex = list.selectedIndex;
});

