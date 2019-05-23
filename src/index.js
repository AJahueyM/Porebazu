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

let url = window.location.hash, idx = url.indexOf("#");
let hash = idx !== -1 ? url.substring(idx+1) : "";
console.log(hash);

switch (hash) {
    case 'Guides':
    {
        navigationListener.notify(1);
        list.selectedIndex = 1;
        break;
    }
    case 'Resources':
    {
        navigationListener.notify(2);
        list.selectedIndex = 2;
        break;
    }
    default:
    {
        break;
    }
}
list.listen('click', () => {
    let movementList = list.selectedIndex - lastNavListIndex;
    if(movementList === 0){
        return;
    }
    navigationListener.notify(list.selectedIndex);
    lastNavListIndex = list.selectedIndex;
});
