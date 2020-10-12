// global variables

const employees = [];
const url = "https://randomuser.me/api/?results=12&nat=us,au,ca,ch,de,gb,fr&inc=name, picture, email, location, phone, dob, nat & noinfo";
const modalContainer = document.querySelector('.modal-container');
const index = 0;
const toggle = document.querySelector('#toggle');
const searchField = document.getElementById("search");

function generateData() {
  fetch(url) //fetch source of info. Stored in url variable.
    .then(response => response.json()) // parse the data into json() name:value pairs.
    .then(data => { //Anonymous function, do something...
     const results = data.results; //store data in "const results"
     directory(results); // call the directory function, create card for each employee passed through 
    employees.push(results); //store the employees returned from the API in a global variable 
    })
    .catch(error => console.log("Something went wrong!", error)); // catch the error and log to console
 
 }
   generateData();

   const directory = employees => { //Anonymous function to handle newly created DOM elements for employee array
    const gallery = document.querySelector('#gallery'); // store the elements
  
    employees.forEach(employee => { //loop through each employee in array
      gallery.innerHTML += //Target the gallery DIV to add code inside
       // Use template literal to build the structure of HTML elements.
       `
      <div class="card">
        <div class="card-img-container">
          <img class="card-img" src="${employee.picture.large}" alt="${employee.name.first}'s profile picture">
        </div>
        <div class="card-info-container">
          <h3 id="name" class="card-name cap">${changeCase(employee.name.first)} ${changeCase(employee.name.last)}</h3>
          <p class="card-text">${employee.email}</p>
          <p class="card-text cap">${changeCase(employee.location.city)}</p>
        </div>
      </div>
    `;
    });

    gallery.querySelectorAll('.card').forEach((card, index) => { //Gives click functionality to each new employee element.
        card.addEventListener('click', () => {
          modal(employees, employees[index], index); //calls the modal function for the single employee that was clicked.
        });
      });
  
  };

// Translate into English alphabet 

function changeCase(str) {
    str = str.replace("ß", "ss");
    str = str.replace("-", " - ");
    str = str.replace("/", " - ");
    str = str.replace("\'", " \' ");
    str = str.replace(/[éêèë]/gi, "e");
    str = str.replace(/[äàâ]/gi, "a");
    str = str.replace(/[öôò]/gi, "o");
    str = str.replace(/[üûù]/gi, "u");
    let words = str.split(" ");
    let newString = [];
    words.forEach(word => newString += `${word[0].toUpperCase()}${word.slice(1)} `);
    newString = newString.replace(" - ", "-");
    newString = newString.replace(" \' ", "\'");
    return newString;
  }

  const modal = (employees, employee, index) => {
    const dob = new Date(Date.parse(employee.dob.date)).toLocaleDateString(navigator.language); // Formats date depending on users locale.
  
    modalContainer.innerHTML = `
      <div class="modal">
        <div class="modal-info-container">
          <span class="close"> X </span>
          <span class="previous"> < </span>
          <span class="next"> > </span>
          <img class="modal-img" src="${employee.picture.large}" alt="${employee.name.first}'s profile picture">
          <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
          <p class="modal-text">${employee.email}</p>
          <p class="modal-text cap">${employee.location.city}</p><hr>
          <p class="modal-text">${employee.phone}</p>
          <p class="modal-text cap">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.state} ${employee.location.postcode}</p>
          <p class="modal-text">Birthday: ${dob}</p>
        </div>
      </div>
    `;

    modalContainer.style.display = 'block';

    modalContainer.addEventListener("click", (e) => { //When the user clicks on certain things in the pop-up modal...
      if(e.target.className === "close") { //If they click on the "X"...
        modalContainer.style.display = "none"; //Remove the modal display
        } else if (e.target.className === "previous") { //If user clicks on the previous arrow
          if (index > 0) { //If user clicks on anything 
            modal(employees, employees[index - 1], index - 1); //move back one card
          } else {
            modal(employees, employees[employees.length - 1], employees.length - 1); //If user clicks on the first one, move to the length(12) minus 1 which would display the 11th card.
          }
        } else if (e.target.className === "next") { //If user click on the next arrow
          if (index < employees.length - 1) { //if what user clicked on is not the last card
            modal(employees, employees[index + 1], index + 1); //move forward one card
          } else {
            modal(employees, employees[0], 0); //If user clicks on last card, move back to the first card (index 0)
          }
        } else {
          return; // end the function, return value it's landed on.
        }
    });
  };

  function search() {
    let searchValue = searchField.value.toLowerCase();
    let employeeCard = document.querySelectorAll(".card");
    let employeeName = document.querySelectorAll(".card-info-container");
    for (let i = 0; i < employeeCard.length; i++) { //Loop through each card thumbnail
      let title = employeeName[i].getElementsByTagName("h3")[0]; //get the value found within each card's h3 element, starting at the first one [0 index]
      let name = title.textContent; //Get the person's name from each card, store it in "name"
      name = removeAccent(name);
      if (name.toLowerCase().indexOf(searchValue) > -1) { //If that person's name matches what the user is searching at all, so it returns an index of at least 0 (greater than -1)
        employeeCard[i].style.display = ""; //Take that person and keep them on the screen
      } else {
        employeeCard[i].style.display = "none"; // else hide them because they don't match the search
      }
    }
  }

  // Return the data in English alphabet only

  function removeAccent(str) {
    str = str.replace("ß", "ss");
    str = str.replace(/[äàâ]/gi, "a");
    str = str.replace(/[éêèë]/gi, "e");
    str = str.replace(/[öôò]/gi, "o");
    str = str.replace(/[üûù]/gi, "u");
    return str;
  }
  
  searchField.addEventListener("keyup", (e) => search()); 




// below is from dark mode 

document.querySelector('#toggle').addEventListener
('change', () => {
    document.body.classList.toggle('dark')
})

  
  // check value for theme in local storage

  function localStorageCheck() {
    if (localStorage.length > 0) {
      let storageThemeValue = localStorage.getItem('Dark-Theme');
    
      if (storageThemeValue === 'off') {
        toggle.checked = false;
      } else {
        toggle.checked = true;
        updateTheme();
      }
    }
  }