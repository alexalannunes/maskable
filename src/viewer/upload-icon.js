const imgElements = /** @type {HTMLCollectionOf<HTMLImageElement>} */ (document.getElementsByClassName(
  'icon'
));

/**
 * Changes the displayed icon in the center of the screen.
 *
 * @param {Blob | string | undefined} source URL or File for the icon.
 * If a File/Blob, an object URL is created and displayed.
 * If a string, the string is used as a URL directly.
 * If undefined (or falsy), nothing happens.
 */
function updateDisplayedIcon(source) {
  if (!source) return;

  // Revoke the old URL
  const oldUrl = imgElements[0].src;
  if (oldUrl.startsWith('blob:')) {
    URL.revokeObjectURL(oldUrl);
  }

  // Update the URL bar
  if (typeof source === 'string') {
    history.replaceState(undefined, '', `?demo=${source}`);
  } else {
    // Create a URL corresponding to the file.
    source = URL.createObjectURL(source);
    history.replaceState(undefined, '', '.');
  }

  updateSource(source);
  for (let i = 0; i < imgElements.length; i++) {
    const imgElement = imgElements[i];
    imgElement.src = source;
  }
}

/**
 * Changes the "Icon from" credits at the bottom of the app.
 * The credits are embedded in the HTML of the demo icons at the top of the screen.
 * The `alt` attribute is used for the human-readable portion of the link.
 * The `data-source` attribute is used for the URL of the link.
 *
 * @param {string} source Source URL of the displayed icon.
 * If the URL does not correspond to one of the demo icons, then the credits text is hidden.
 */
function updateSource(source) {
  /** @type {HTMLElement} */
  const sourceDisplay = document.querySelector('.source');
  /** @type {HTMLAnchorElement} */
  const sourceLink = sourceDisplay.querySelector('.source__link');

  /** @type {HTMLImageElement} */
  const preview = document.querySelector(`.demo__preview[src$="${source}"]`);
  if (preview != undefined) {
    sourceDisplay.hidden = false;
    sourceLink.href = preview.dataset.source;
    sourceLink.textContent = preview.alt;
  } else {
    sourceDisplay.hidden = true;
  }
}

/** @type {HTMLInputElement} The "Open icon file" button */
const fileInput = document.querySelector('#icon_file');
/** @type {import('file-drop-element').FileDropElement} The invisible file drop area */
const fileDrop = document.querySelector('#icon_drop');

/** @type {AddEventListenerOptions} */
const pas = { passive: true };

// Update the displayed icon when the "Open icon file" button is used
fileInput.addEventListener(
  'change',
  () => updateDisplayedIcon(fileInput.files[0]),
  pas
);
// Update the displayed icon when a file is dropped in
fileDrop.addEventListener(
  'filedrop',
  (evt) => updateDisplayedIcon(evt.files[0]),
  pas
);

// File input focus polyfill for Firefox
fileInput.addEventListener(
  'focus',
  () => fileInput.classList.add('focus'),
  pas
);
fileInput.addEventListener(
  'blur',
  () => fileInput.classList.remove('focus'),
  pas
);

// If there's a URL present in the "?demo" query parameter, use it as the icon URL.
const demoUrl = new URL(location.href).searchParams.get('demo');
updateDisplayedIcon(demoUrl);

/** @type {HTMLUListElement} */
const demoLinks = document.querySelector('.demo__list');
demoLinks.addEventListener('click', (evt) => {
  const target = /** @type {HTMLElement} */ (evt.target);
  const link = /** @type {HTMLAnchorElement | null} */ (target.closest(
    '.demo__link'
  ));
  if (link != undefined) {
    evt.preventDefault();
    const demoUrl = new URL(link.href).searchParams.get('demo');
    updateDisplayedIcon(demoUrl);
  }
});
