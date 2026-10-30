document.documentElement.classList.add('js');
const screen = document.querySelector('[data-screen]');
const tabs = [...document.querySelectorAll('[data-screen-tab]')];
function selectScreen(tab, focus = false) {
  if (!screen) return;
  screen.src = tab.dataset.src;
  screen.alt = tab.dataset.alt;
  screen.closest('[role="tabpanel"]').setAttribute('aria-labelledby', tab.id);
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectScreen(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectScreen(tabs[next], true);
    }
  });
});

const appStoreDialog = document.querySelector('#app-store-dialog');
if (appStoreDialog && !location.hash) {
  history.scrollRestoration = 'manual';
  const startAtTop = () => {
    if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };
  startAtTop();
  window.addEventListener('pageshow', startAtTop);
}

let dialogOpener;
let dialogScrollPosition;
document.querySelectorAll('[data-app-store]').forEach(button => {
  button.addEventListener('click', () => {
    if (!appStoreDialog) return;
    dialogOpener = button;
    dialogScrollPosition = { top: window.scrollY, left: window.scrollX, behavior: 'instant' };
    appStoreDialog.showModal();
    appStoreDialog.querySelector('.dialog-confirm').focus({ preventScroll: true });
    window.scrollTo(dialogScrollPosition);
  });
});
appStoreDialog?.addEventListener('close', () => {
  dialogOpener?.focus({ preventScroll: true });
  if (dialogScrollPosition) window.scrollTo(dialogScrollPosition);
});
appStoreDialog?.addEventListener('click', event => {
  if (event.target !== appStoreDialog) return;
  const bounds = appStoreDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) {
    appStoreDialog.close();
  }
});
