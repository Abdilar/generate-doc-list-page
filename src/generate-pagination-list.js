import {sorter} from './utils.js'
import {BASE_API_URL, BUCKET_NAME} from './config.js'

/**
 * @constant {number}
 */
const PAGE_SIZE = 10;

/**
 * @member {!number} - shows the current page number
*/ 
let currentPage = 1;

/**
 * @member {!number} - shows the all pages number
*/ 
let pages = 1;

/**
 * @type {!Array<string>} - the list of directories
*/ 
let directories = []

fetch("./data.json", { method: "GET" }).then(async (response) => {
  try {
    directories = await response.json(); // NOTE: The list of directory
    initialize();
  } catch (err) {}
});

/**
 * The entry point of application
 *
 * @requires utils.sorter
 */
function initialize() {
  directories = directories.sort(sorter);
  /**
   * @member {number} pages - number of pages
   * @inner
   */
  pages = Math.ceil(directories.length / PAGE_SIZE);

  generatePaginationButtons();

  updateActivePaginationButton();

  appendListItem(currentPage);
}

/**
 * @param {number} page - It's a page that must be create
 * @return {Element} - return a page button that is a li element and contains a link element with click events that change a page
 * @throws - If page is null or undefined throw an exception 
 */
function getButtonTemplate(page) {
  const liElement = document.createElement("li");
  liElement.className = "page-item";
  liElement.innerHTML = `
          <a class="page-link" href="#">${page}</a>
        `;
  liElement.onclick = () => handleClickLiElement(page)
  return liElement;
}

/**
 * Click handler on li element
 * @callback LiClickHandler
 * @param {number} page - The page
 */
const handleClickLiElement = (page) => {
  currentPage = page;
  updateActivePaginationButton();
  updatePrevNextButton(page);

  appendListItem(page);
}

function getListItemTemplate(directory) {
  // TODO: replace path with aws s3
  const path = `${BASE_API_URL}/${BUCKET_NAME}/${directory}/index.html`;

  const divElement = document.createElement("div");
  divElement.className = "d-flex text-body-secondary pt-3 border-bottom";
  divElement.innerHTML = `
          <p class="pb-3 mb-0 small lh-sm text-gray-dark" >
            <a href="${path}" class="d-block link-primary">
              <strong>Version ${directory}</strong>
            </a>
            Some representative placeholder content, with some information about this user. Imagine this being some sort of status update, perhaps?
          </p>
        `;

  return divElement;
};

/**
 * Generate pagination navbar buttons based on the pages
 */
function generatePaginationButtons() {
  const nextButtonElement = document.getElementById("next-page");
  if (nextButtonElement) {
    Array(pages)
      .fill(0)
      .forEach((_, index) => {
        const element = getButtonTemplate(index + 1);
        nextButtonElement.parentNode.insertBefore(
          element,
          nextButtonElement.previousSibling
        );
      });
      const prevButtonElement = document.getElementById("prev-page");
      if (prevButtonElement) {
        prevButtonElement.addEventListener('click',  prevPage)
      }
      nextButtonElement.addEventListener('click',  nextPage)

  }
}

function updateActivePaginationButton() {
  const pageElements = document.getElementsByClassName("page-item");
  if (pageElements) {
    [...pageElements].forEach((liElement, index) => {
      liElement.classList.remove("active");
      if (index === currentPage) {
        liElement.classList.add("active");
      }
    });
  }
}


function appendListItem(page) {
  const listWrapperElement = document.getElementById("list-wrapper");
  if (listWrapperElement) {
    listWrapperElement.innerHTML = "";
    const from = (page - 1) * PAGE_SIZE;
    const to = page < pages ? page * PAGE_SIZE : directories.length;

    directories.slice(from, to).forEach((directory) => {
      const element = getListItemTemplate(directory);
      listWrapperElement.appendChild(element);
    });
  }
};

function updatePrevNextButton(currentPage) {
  const nextElement = document.getElementById("next-page");
  const prevElement = document.getElementById("prev-page");
  if (nextElement) {
    currentPage >= pages
      ? nextElement.classList.add("disabled")
      : nextElement.classList.remove("disabled");
  }
  if (prevElement) {
    currentPage <= 1
      ? prevElement.classList.add("disabled")
      : prevElement.classList.remove("disabled");
  }
}

function nextPage() {
  updatePrevNextButton(currentPage + 1);

  if (currentPage >= pages) return;
  currentPage++;
  updateActivePaginationButton();
  appendListItem(currentPage);
}

function prevPage() {
  updatePrevNextButton(currentPage - 1);

  if (currentPage <= 1) return;
  currentPage--;
  updateActivePaginationButton();
  appendListItem(currentPage);
}