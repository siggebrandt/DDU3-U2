const websiteURL = "https://siggebrandt-ddu3-u2-beta.deno.dev"; // http://localhost:8000/cities
function updateListOfCities() {
  const response = fetch(`${websiteURL}/cities`, { method: "GET" });
  response.then((response) => {
    const responseJSON = response.json();

    responseJSON.then((responseData) => {
      const listOfCitiesContainer = document.querySelector(
        "#listOfCities-container"
      );

      listOfCitiesContainer.innerHTML = "";

      for (const city of responseData) {
        const cityElement = document.createElement("div");
        cityElement.classList = "city flex space-between";
        listOfCitiesContainer.appendChild(cityElement);

        const cityElementText = document.createElement("p");
        cityElementText.textContent = `${city.name}, ${city.country}`;
        cityElement.appendChild(cityElementText);

        const cityDeleteButton = document.createElement("button");
        cityDeleteButton.textContent = "delete";
        cityDeleteButton.classList = "deleteCityButton";

        cityElement.appendChild(cityDeleteButton);

        cityDeleteButton.addEventListener("click", function () {
          fetch(`${websiteURL}/cities`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: city.id }),
          });
          cityElement.remove();
        });
      }
    });
  });
}
updateListOfCities();

document.querySelector("#addCityButton").addEventListener("click", function () {
  const inputName = document.querySelector("#inputAddCityName").value;
  const inputCountry = document.querySelector("#inputAddCityCountry").value;

  const response = fetch(`${websiteURL}/cities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: inputName,
      country: inputCountry,
    }),
  });

  response.then((response) => {
    const responseJSON = response.json();
    if (response.status == 200) {
      updateListOfCities();
    }
    responseJSON.then((responseData) => {
      if (
        responseData == "Name or Country is missing" ||
        responseData == "City-name already exists"
      ) {
        alert(responseData);
      }
    });
  });
});

document
  .querySelector("#searchCityButton")
  .addEventListener("click", function () {
    const inputText = document.querySelector("#inputSearchCityText").value;
    const inputCountry = document.querySelector(
      "#inputSearchCityCountry"
    ).value;

    let response;

    if (inputCountry) {
      response = fetch(
        `${websiteURL}/cities/search?text=${inputText}&country=${inputCountry}`
      );
    } else if (inputText) {
      response = fetch(`${websiteURL}/cities/search?text=${inputText}`);
    } else {
      return alert('"Text" is missig');
    }

    document.querySelector("#searchCityResults").innerHTML = `
    <div class="inputBox" id="searchCityResultsBox"></div>`;

    response.then((response) => {
      const responseJSON = response.json();
      const searchCityResultsBox = document.querySelector(
        "#searchCityResultsBox"
      );
      searchCityResultsBox.innerHTML = "";

      responseJSON.then((responseData) => {
        for (const city of responseData) {
          const cityElement = document.createElement("div");
          cityElement.textContent = `${city.name}, ${city.country}`;
          cityElement.classList = "city";

          document
            .querySelector("#searchCityResultsBox")
            .appendChild(cityElement);
        }

        if (responseData.length == 0) {
          searchCityResultsBox.textContent = "No cities found";
          searchCityResultsBox.style.textAlign = "center";
        }
      });
    });
  });
