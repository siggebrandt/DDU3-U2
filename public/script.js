function updateListOfCities() {
  const response = fetch("http://localhost:8000/cities", { method: "GET" });
  response.then((response) => {
    const responseJSON = response.json();

    responseJSON.then((responseData) => {
      document.querySelector("#listOfCities-container").innerHTML = "";

      for (let city of responseData) {
        const cityElement = document.createElement("div");
        cityElement.textContent = `${city.name}, ${city.country}`;
        cityElement.classList = "city flex space-between";

        const cityDeleteButton = document.createElement("button");
        cityDeleteButton.textContent = "delete";
        cityDeleteButton.classList = "deleteCityButton";

        document
          .querySelector("#listOfCities-container")
          .appendChild(cityElement);

        cityElement.appendChild(cityDeleteButton);

        cityDeleteButton.addEventListener("click", function () {
          fetch("http://localhost:8000/cities", {
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

document
  .querySelector("#addCityButton")
  .addEventListener("click", function (event) {
    const inputName = document.querySelector("#inputAddCityName").value;
    const inputCountry = document.querySelector("#inputAddCityCountry").value;

    const response = fetch("http://localhost:8000/cities", {
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

/**
 * Användaren kan söka bland städerna med ”Search Cities”. Om sökningen gick bra (inget HTTP-fel) så visas städerna enligt bilden ovan.
 * Om sökningen ger en tom array (inga städer uppfyller villkoren) så ska det stå ”No cities found” där listan med hittade städer normalt visas.
 */

document
  .querySelector("#searchCityButton")
  .addEventListener("click", function (event) {
    const inputText = document.querySelector("#inputSearchCityText").value;
    const inputCountry = document.querySelector(
      "#inputSearchCityCountry"
    ).value;

    //

    const response = fetch("http://localhost:8000/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: inputName,
        country: inputCountry,
      }),
    });

    //

    document.querySelector("#SearchCityResults").innerHTML = `
    <div class="inputBox" id="SearchCityResultsBox"></div>`;
  });
