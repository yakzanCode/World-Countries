// Global Variables
let countryData = []; // Store the fetched country data
let filteredData = []; // Store the filtered country data

// Functions
function clearData() {
  const tbody = document.getElementById("tBody");
  tbody.innerHTML = "";
}

function formatPopulation(number) {
  return number.toLocaleString();
}

function fillData(data) {
  const tbody = document.getElementById("tBody");
  data.forEach((country, index) => {
    const TR = document.createElement("tr");
    const TD1 = document.createElement("td");
    const TD2 = document.createElement("td");
    const TD3 = document.createElement("td");
    const TD4 = document.createElement("td");

    const cImg = document.createElement("img");
    cImg.src = country.flags.png;
    TD1.appendChild(cImg);
    TD2.innerHTML = country.name.common;
    TD3.innerHTML = country.capital || "N/A";
    TD4.innerHTML = formatPopulation(country.population);
    TD4.style.color = "rgb(200, 0, 0)";

    if (index % 2 === 0) {
      TD1.style.backgroundColor = "rgb(211, 211, 211)";
      TD2.style.backgroundColor = "rgb(211, 211, 211)";
      TD3.style.backgroundColor = "rgb(211, 211, 211)";
      TD4.style.backgroundColor = "rgb(211, 211, 211)";
    }

    TR.append(TD1, TD2, TD3, TD4);
    tbody.appendChild(TR);
  });
}

function getCountries() {
  fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then((json) => {
      countryData = json; // Save the fetched country data
      filteredData = [...countryData]; // Initialize filteredData with all countries
      fillData(filteredData);
    });
}

function getFilteredCountries(regions) {
  const filteredData = countryData.filter((country) => {
    return regions.includes(country.region);
  });

  return filteredData;
}

function searchCountry(keyword, data) {
  const filteredData = data.filter((country) => {
    return country.name.common.toLowerCase().includes(keyword.toLowerCase());
  });

  return filteredData;
}

function sortDataByName(order, data) {
  const sortedData = [...data].sort((a, b) => {
    const nameA = a.name.common.toLowerCase();
    const nameB = b.name.common.toLowerCase();

    if (order === "asc") {
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
    } else if (order === "desc") {
      if (nameA > nameB) return -1;
      if (nameA < nameB) return 1;
    }

    return 0;
  });

  return sortedData;
}

function sortDataByPopulation(order, data) {
  const sortedData = [...data].sort((a, b) => {
    const populationA = a.population;
    const populationB = b.population;

    if (order === "asc") {
      return populationA - populationB;
    } else if (order === "desc") {
      return populationB - populationA;
    }

    return 0;
  });

  return sortedData;
}

function showCountryDetails(country) {
  const modalTitle = document.getElementById("countryModalTitle");
  const countryFlag = document.getElementById("countryFlag");
  const countryCapital = document.getElementById("countryCapital");
  const countryPopulation = document.getElementById("countryPopulation");

  modalTitle.textContent = country.name.common;
  countryFlag.src = country.flags.png;
  countryCapital.textContent = country.capital || "N/A";
  countryPopulation.textContent = formatPopulation(country.population);
  countryPopulation.style.color = "rgb(200, 0, 0)";

  // Show the modal
  const countryModal = new bootstrap.Modal(document.getElementById("countryModal"));
  countryModal.show();
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  const regionCheckboxes = document.querySelectorAll(".region-checkbox");
  const searchTxt = document.getElementById("searchTxt");
  const sortCheckboxes = document.querySelectorAll(".sort-checkbox");

  regionCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const selectedRegions = Array.from(regionCheckboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);

      if (selectedRegions.length > 0) {
        filteredData = getFilteredCountries(selectedRegions);
      } else {
        filteredData = [...countryData];
      }

      const keyword = searchTxt.value.trim();
      if (keyword !== "") {
        filteredData = searchCountry(keyword, filteredData);
      }

      const checkedSortCheckbox = Array.from(sortCheckboxes).find((checkbox) => checkbox.checked);
      if (checkedSortCheckbox) {
        const sortValue = checkedSortCheckbox.value;
        if (sortValue === "name") {
          filteredData = sortDataByName("asc", filteredData);
        } else if (sortValue === "population-asc") {
          filteredData = sortDataByPopulation("asc", filteredData);
        } else if (sortValue === "population-desc") {
          filteredData = sortDataByPopulation("desc", filteredData);
        }
      }

      clearData(); // Clear previously fetched data
      fillData(filteredData);
    });
  });

  searchTxt.addEventListener("input", () => {
    const keyword = searchTxt.value.trim();
    if (regionCheckboxes.length > 0) {
      const selectedRegions = Array.from(regionCheckboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);

      if (selectedRegions.length > 0) {
        filteredData = getFilteredCountries(selectedRegions);
      } else {
        filteredData = [...countryData];
      }
    } else {
      filteredData = [...countryData];
    }

    if (keyword !== "") {
      filteredData = searchCountry(keyword, filteredData);
    }

    const checkedSortCheckbox = Array.from(sortCheckboxes).find((checkbox) => checkbox.checked);
    if (checkedSortCheckbox) {
      const sortValue = checkedSortCheckbox.value;
      if (sortValue === "name") {
        filteredData = sortDataByName("asc", filteredData);
      } else if (sortValue === "population-asc") {
        filteredData = sortDataByPopulation("asc", filteredData);
      } else if (sortValue === "population-desc") {
        filteredData = sortDataByPopulation("desc", filteredData);
      }
    }

    clearData(); // Clear previously fetched data
    fillData(filteredData);
  });

  sortCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const checkedSortCheckboxes = Array.from(sortCheckboxes).filter((checkbox) => checkbox.checked);

      if (checkedSortCheckboxes.length > 1) {
        // Uncheck all other sort checkboxes
        sortCheckboxes.forEach((checkbox) => {
          if (checkbox !== checkedSortCheckboxes[0]) {
            checkbox.checked = false;
          }
        });
      }

      const keyword = searchTxt.value.trim();
      if (regionCheckboxes.length > 0) {
        const selectedRegions = Array.from(regionCheckboxes)
          .filter((checkbox) => checkbox.checked)
          .map((checkbox) => checkbox.value);

        if (selectedRegions.length > 0) {
          filteredData = getFilteredCountries(selectedRegions);
        } else {
          filteredData = [...countryData];
        }
      } else {
        filteredData = [...countryData];
      }

      if (keyword !== "") {
        filteredData = searchCountry(keyword, filteredData);
      }

      if (checkedSortCheckboxes.length > 0) {
        const sortValue = checkedSortCheckboxes[0].value;
        if (sortValue === "name") {
          filteredData = sortDataByName("asc", filteredData);
        } else if (sortValue === "population-asc") {
          filteredData = sortDataByPopulation("asc", filteredData);
        } else if (sortValue === "population-desc") {
          filteredData = sortDataByPopulation("desc", filteredData);
        }
      }

      clearData(); // Clear previously fetched data
      fillData(filteredData);
    });
  });

  // Event listener for country selection (when a row is clicked)
  const tableBody = document.getElementById("tBody");
  tableBody.addEventListener("click", (event) => {
    const selectedCountryIndex = event.target.closest("tr").rowIndex - 1;
    const selectedCountry = filteredData[selectedCountryIndex];

    if (selectedCountry) {
      showCountryDetails(selectedCountry);
    }
  });
});

// Initialization
getCountries(); // Fetch all countries when the page is loaded















// function getCountries() {
//   fetch('https://restcountries.com/v3.1/all')
//     .then(response => response.json())
//     .then(json => fillData(json))
//   .then(json => {
//     fillData(json)
//     isFirstCall = true;
//   })
// }

// function getFilteredCountries(region) {
//   fetch(`https://restcountries.com/v3.1/region/${region}`)
//     .then(response => response.json())
//     .then(json => {
//       fillData(json);
//       isFirstCall = false;
//     })
// }

// const regionsList = document.querySelectorAll(".reg");
// const countriesLink = document.querySelector(".countries-link");


// regionsList.forEach(R => {
//   R.addEventListener("click", () => {
//     const selectedRegion = R.textContent;
//     clearData();
//     getFilteredCountries(selectedRegion);
//   })
// });

// countriesLink.addEventListener("click", () => {
//   clearData();
//   getCountries();
// });


// const isFirstCall = false;

// function clearData() {
//   const tbody = document.getElementById("tBody");
//   while (tbody.firstChild) {
//     tbody.removeChild(tbody.firstChild);
//   }
// }

// function fillData(json) {
//   json.forEach((country, index) => {
//     const TBODY = document.getElementById("tBody");
//     const TR = document.createElement("tr");
//     const TD1 = document.createElement("td");
//     const TD2 = document.createElement("td");
//     const TD3 = document.createElement("td");
//     const TD4 = document.createElement("td");


//     const cImg = document.createElement('img');
//     cImg.src = country.flags.png;
//     TD1.appendChild(cImg);
//     TD2.innerHTML = country.name.common;
//     TD3.innerHTML = country.capital;
//     TD4.innerHTML = country.population;
//     TD4.style.color = "rgb(200,0,0)";

//     if (index % 2 === 0) {
//       TD1.style.backgroundColor = "rgb(211,211,211)"
//       TD2.style.backgroundColor = "rgb(211,211,211)"
//       TD3.style.backgroundColor = "rgb(211,211,211)"
//       TD4.style.backgroundColor = "rgb(211,211,211)"
//     }

//     TR.append(TD1, TD2, TD3, TD4);
//     TBODY.appendChild(TR);
//   })
// }

// document.addEventListener("DOMContentLoaded", () => {
//   getCountries();
// });