document.querySelector("#add-book").addEventListener("click", openModal);
document.querySelector("input[type='submit']").addEventListener("click", function (e) { addBookToLibrary(); closeModal(e); });
document.querySelector(".modal").addEventListener("click", function (e) { closeModal(e) });

let myLibrary = [];

class Book {
    constructor(title, author) {
        this.title = title;
        this.author = author;
    }

    createBook() {
        const main = document.querySelector("main");
        // container
        const book_container = document.createElement("div");
        book_container.classList.add("book", "container");
        book_container.dataset.book = `${myLibrary.length}`;
        main.appendChild(book_container);
        // cover
        const book_cover = document.createElement("img");
        book_cover.alt = "Book Cover";
        book_cover.classList.add("cover");
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${this.title.replace(" ", "+").replace(/[^\w]/g, "")}+inauthor:${this.author.split(" ")[0]}`)
            .then(res => res.json())
            .then(data => book_cover.src = (data['items'][0].volumeInfo.imageLinks.thumbnail));
        // title
        const book_title = document.createElement("h3");
        book_title.textContent = this.title;
        book_title.classList.add("title");
        // author
        const book_author = document.createElement("span");
        book_author.textContent = this.author;
        book_author.classList.add("author");
        // div
        const book_button_container = document.createElement("div");
        book_button_container.classList.add("book-button-container");
        // page progress
        const book_progress = document.createElement("button");
        book_progress.textContent = "Not Read";
        book_progress.classList.add("unfinished");
        book_progress.addEventListener("click", function (e) { finishBook(e) });
        book_button_container.appendChild(book_progress);
        // pages read
        const book_remove = document.createElement("button");
        book_remove.textContent = "Remove";
        book_remove.dataset.book = `${myLibrary.length}`;
        book_remove.classList.add("book-remove");
        book_remove.addEventListener("click", function (e) { removeBook(e) })
        book_button_container.appendChild(book_remove);


        for (let e of [book_cover, book_title, book_author, book_button_container]) {
            book_container.appendChild(e);
        }
    }
}

function addBookToLibrary() {
    const title = document.querySelector("#formTitle");
    const author = document.querySelector("#formAuthor");
    const book = new Book(title.value, author.value);
    book.createBook();
    myLibrary.push(book);
    title.value = "";
    author.value = "";
}

function openModal() {
    document.querySelector(".modal").style.display = "flex";

}

function closeModal(e = null) {
    if (e.target === e.currentTarget) {
        document.querySelector(".modal").style.display = "none";
    }
}

function removeBook(e) {
    const index = e.currentTarget.dataset.book;
    const main = document.querySelector("main");
    const book = document.querySelector(`div[data-book="${index}"]`);
    main.removeChild(book);
    myLibrary.splice(index, 1);
    resetIndex()
}

function resetIndex() {
    const books = document.querySelectorAll(`div[data-book]`);
    const removeButtons = document.querySelectorAll(`button[data-book]`)
    for (let i = 0; i < books.length; i++) {
        books[i].dataset.book = i;
        removeButtons[i].dataset.book = i;
    }
}

function finishBook(e) {
    e.currentTarget.classList.toggle("finished");
    e.currentTarget.classList.toggle("unfinished");
    e.currentTarget.textContent = e.currentTarget.classList[0] === "finished" ? "Finished" : "Not Read";
}