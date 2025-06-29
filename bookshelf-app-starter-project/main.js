console.log("Hello, world!");

// Simpan data buku ke localStorage
function saveBooksToStorage(books) {
  localStorage.setItem("books", JSON.stringify(books));
}

// Ambil data buku dari localStorage
function getBooksFromStorage() {
  return JSON.parse(localStorage.getItem("books")) || [];
}

// Render daftar buku, bisa pakai filter hasil pencarian
function renderBooks(filteredBooks = null) {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  const books = filteredBooks || getBooksFromStorage();

  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");

    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
        </button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

// Tambah buku baru
document
  .getElementById("bookForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = parseInt(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    const newBook = {
      id: +new Date(),
      title,
      author,
      year,
      isComplete,
    };

    const books = getBooksFromStorage();
    books.push(newBook);
    saveBooksToStorage(books);

    renderBooks();
    event.target.reset();
    updateSubmitButtonText();
  });

// Pindahkan buku antar rak
function moveBook(bookId) {
  const books = getBooksFromStorage();
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveBooksToStorage(books);
    renderBooks();
  }
}

// Hapus buku
function deleteBook(bookId) {
  let books = getBooksFromStorage();
  books = books.filter((book) => book.id !== bookId);
  saveBooksToStorage(books);
  renderBooks();
}

// Event listener untuk semua tombol (gabung jadi satu listener)
document.addEventListener("click", function (event) {
  const target = event.target;

  if (target.getAttribute("data-testid") === "bookItemIsCompleteButton") {
    const bookId = target.closest("[data-bookid]").getAttribute("data-bookid");
    moveBook(parseInt(bookId));
  }

  if (target.getAttribute("data-testid") === "bookItemDeleteButton") {
    const bookId = target.closest("[data-bookid]").getAttribute("data-bookid");
    deleteBook(parseInt(bookId));
  }
});

// Fitur pencarian
document
  .getElementById("searchBook")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const searchTerm = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const books = getBooksFromStorage();
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm)
    );

    renderBooks(filteredBooks);
  });

// Update teks tombol submit sesuai checkbox
function updateSubmitButtonText() {
  const checkbox = document.getElementById("bookFormIsComplete");
  const submitButton = document.getElementById("bookFormSubmit");
  const spanElement = submitButton.querySelector("span");

  if (checkbox.checked) {
    spanElement.textContent = "Selesai dibaca";
  } else {
    spanElement.textContent = "Belum selesai dibaca";
  }
}

// Inisialisasi saat halaman pertama kali load
document.addEventListener("DOMContentLoaded", function () {
  updateSubmitButtonText();
  renderBooks();

  const checkbox = document.getElementById("bookFormIsComplete");
  checkbox.addEventListener("change", updateSubmitButtonText);
});
