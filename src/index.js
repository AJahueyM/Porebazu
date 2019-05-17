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
