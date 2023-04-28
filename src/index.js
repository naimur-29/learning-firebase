import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  //   getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  //   getDoc,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBc3KCC4IA9DjGTi71pFVjcBMkhFfi8Km0",
  authDomain: "fir-9-dojo-19bfa.firebaseapp.com",
  projectId: "fir-9-dojo-19bfa",
  storageBucket: "fir-9-dojo-19bfa.appspot.com",
  messagingSenderId: "304597369673",
  appId: "1:304597369673:web:f9cec1f020f11bd24d5098",
};

// init firebase app:
initializeApp(firebaseConfig);

// init services:
const db = getFirestore();

// collection reference:
const collRefBooks = collection(db, "books");

// query ref:
// const q = query(collRefBooks, where("title", "==", "<value>"));
const qry = query(collRefBooks, orderBy("createdAt"));

// select the bookList html element:
const booksList = document.querySelector(".books-list");

// live/on change in db invoke getBooks:
onSnapshot(qry, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });

  console.log(books);

  booksList.textContent = books.length ? "" : "Empty!";

  const prevBookTimestamp =
    books.length && books[books.length - 1].createdAt?.seconds;

  books.forEach((book) => {
    let bookTimeStamp = prevBookTimestamp - book.createdAt?.seconds;

    // create html for the book contents:
    const title = document.createElement("p");
    title.textContent = `Title: ${book.title}`;
    const author = document.createElement("p");
    author.textContent = `Author: ${book.author}`;
    const synopsis = document.createElement("article");
    synopsis.textContent = `Synopsis: ${book.synopsis.slice(0, 140)}${
      book.synopsis.length > 140 ? "..." : ""
    }`;
    const created = document.createElement("p");
    created.textContent = `${
      bookTimeStamp >= 60
        ? Math.floor(bookTimeStamp / 60) + "m " + (bookTimeStamp % 60) + "s"
        : bookTimeStamp + "s"
    }`;
    created.style.textAlign = "right";

    // create li and append the book contents:
    const fragment = document.createElement("li");
    fragment.appendChild(title);
    fragment.appendChild(author);
    fragment.appendChild(synopsis);
    fragment.appendChild(created);

    // append the li to bookList:
    booksList.appendChild(fragment);
  });
});

// adding documents:
const addBookForm = document.querySelector(".add-book-form");

addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(collRefBooks, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    synopsis: addBookForm.synopsis.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

// delete documents:
const deleteBookForm = document.querySelector(".delete-book-form");

deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", deleteBookForm?.id.value);

  docRef &&
    deleteDoc(docRef).then(() => {
      deleteBookForm.reset();
    });
});

// get a single document:
const docRef = doc(db, "books", "o6PHEaIhsyGYGSfW9PV2");

onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

// update a book by id:
const updateBookForm = document.querySelector(".update-book-form");

updateBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", updateBookForm.id.value);

  if (addBookForm.checkValidity()) {
    updateDoc(docRef, {
      title: addBookForm.title.value,
      author: addBookForm.author.value,
      synopsis: addBookForm.synopsis.value,
    }).then(() => {
      addBookForm.reset();
      updateBookForm.reset();
    });
  } else {
    alert("Fill Up All The Required Fields To Update!");
  }
});
