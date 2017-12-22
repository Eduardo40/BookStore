(function () {
    class Book {
        constructor(title, author, isbn) {
            this.title = title;
            this.author = author;
            this.isbn = isbn;
        }
    }

    class Validator {
        constructor() {}

        validateBook(book = {
            title: "",
            author: "",
            isbn: ""
        }) {
            if (typeof book !== 'object') {
                return new Error(`Book must be object!`);
            }
            if ((book.title.trim() !== "") &&
                (book.author.trim() !== "") &&
                (book.isbn.trim() !== "")
            ) {
                return true;
            } else {
                return false;
            }
        }
    }

    class Memory {
        constructor() {
            this.checkLocalStoarage();
        }

        getBooks() {
            return this.books;
        }

        addBookToMemory(book) {
            this.books.push(book);
            console.log(this.books);
            localStorage.setItem('books', JSON.stringify(this.books));
        }

        deleteFromMemory(book) {
            const filtredOut = this.books.filter(_book => _book.isbn !== book.isbn);
            this.books = filtredOut;
            localStorage.setItem('books', JSON.stringify(this.books));

        }

        checkLocalStoarage() {
            if (localStorage.getItem('books')) {
                this.books = JSON.parse(localStorage.getItem('books'));
                return true;
            } else {
                this.books = [];
                return false;
            }
        }
    }

    class UI {
        constructor() {}

        addToList(book, showAlert) {
            const valid = new Validator();
            if (valid.validateBook(book)) {
                const UITable = document.querySelector('tbody');
                const tr = document.createElement('tr');
                for (let key in book) {
                    if (key !== 'delete') {
                        const td = document.createElement('td');
                        td.textContent = book[key];
                        tr.appendChild(td);
                    }
                }
                book.delete = 'Delete';
                const td = document.createElement('td');
                td.innerHTML = `<a href="#" class='delete'>${book.delete}</a>`
                tr.appendChild(td);
                UITable.appendChild(tr);
                if (!showAlert) {
                    this.notify('Success', 'green');
                }
                return true;
            }
            if (!showAlert) {
                this.notify('Plesae check inputs.', 'red');
            }
            return false;
        }
        displayBooks() {
            const mem = new Memory();
            const books = mem.getBooks();
            books.forEach((book) => {
                this.addToList(book, true);
            })
        }

        deleteFromList(e) {
            const mem = new Memory();
            if (e.target.classList.contains('delete')) {
                const target = e.target.parentNode.parentNode.children;
                console.log(target);
                const bookToDelete = {
                    title: target[0].textContent,
                    author: target[1].textContent,
                    isbn: target[2].textContent,
                    delete: target[3].textContent
                }
                mem.deleteFromMemory(bookToDelete);
                e.target.parentNode.parentNode.remove();
                ui.notify('Deleted!', "green"); // because this is for event listener.
            }
        }

        notify(text, color) {
            const alert = document.querySelector('.alert');
            alert.innerHTML = "";
            const div = document.createElement('div');
            div.style.backgroundColor = color;
            div.classList.add('notify')
            div.textContent = text;

            alert.appendChild(div);
            setTimeout(() => {
                div.remove();
            }, 2500);
        }
    }

    const ui = new UI();
    ui.displayBooks();

    //eventListenrs
    document.querySelector('form').addEventListener('submit', addToList);
    document.querySelector('table').addEventListener('click', ui.deleteFromList);

    //event functions

    function addToList(e) {
        e.preventDefault() ? e.preventDefault() : e.returnValue = false;
        const title = e.target[0].value;
        const author = e.target[1].value;
        const isbn = e.target[2].value;

        const book = {
            title,
            author,
            isbn
        }
        if (ui.addToList(book)) {
            mem.addBookToMemory(book);
            this.reset();
        }
    }
}());