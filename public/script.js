const request = new Request("http://localhost:8000/cities", { method: "GET" });

const response = fetch(request);
response.then((response) => {
  const responseJSON = response.json();

  responseJSON.then((responseData) => {
    console.log(responseData);
    // läs in alla här, loop

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
    }
  });
});

/* document
  .querySelector(".deleteCityButton")
  .addEventListener("click", function (event) {
    console.log("hej");
  });
 */
