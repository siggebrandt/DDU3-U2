const cities = [
  { id: 2, name: "Lille", country: "France" },
  { id: 3, name: "Nantes", country: "France" },
  { id: 5, name: "Bremen", country: "Germany" },
  { id: 10, name: "Dresden", country: "Germany" },
  { id: 11, name: "Heidelberg", country: "Germany" },
  { id: 12, name: "Venice", country: "Italy" },
  { id: 13, name: "Rome", country: "Italy" },
  { id: 16, name: "Graz", country: "Austria" },
  { id: 20, name: "Basel", country: "Switzerland" },
  { id: 21, name: "Lucerne", country: "Switzerland" },
  { id: 22, name: "Kraków", country: "Poland" },
  { id: 23, name: "Warsaw", country: "Poland" },
  { id: 24, name: "Poznań", country: "Poland" },
  { id: 28, name: "Ghent", country: "Belgium" },
  { id: 31, name: "Maastricht", country: "Netherlands" },
  { id: 38, name: "Maribor", country: "Slovenia" },
  { id: 42, name: "Strasbourg", country: "France" },
];

function findHighestID(array) {
  let highestID = 0;
  for (const element of array) {
    if (element.id > highestID) {
      highestID = element.id;
    }
  }
  return highestID;
}

async function handler(request) {
  const url = new URL(request.url);

  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Content-Type", "application/json");

  if (request.method == "OPTIONS") {
    headers.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    return new Response(null, {
      status: 204,
      headers: headers,
    });
  }

  if (request.method == "GET") {
    if (url.pathname == "/cities") {
      return new Response(JSON.stringify(cities, null, 2), {
        status: 200,
        headers: headers,
      });
    }

    const cityIDRoute = new URLPattern({ pathname: "/cities/:id" });
    const citiesIDPage = cityIDRoute.exec(url);
    if (citiesIDPage) {
      if (url.pathname != "/cities/search") {
        const idOfCity = citiesIDPage.pathname.groups.id;

        const foundCity = cities.find((element) => element.id == idOfCity);

        if (foundCity != undefined) {
          return new Response(JSON.stringify(foundCity, null, 2), {
            status: 200,
            headers: headers,
          });
        } else {
          return new Response(JSON.stringify("no city with such ID exists"), {
            status: 404,
            headers: headers,
          });
        }
      } else if (url.pathname == "/cities/search") {
        if (url.searchParams.has("text")) {
          const textFromParam = url.searchParams.get("text");

          let matchingCities = cities.filter((element) =>
            element.name.toLowerCase().includes(textFromParam.toLowerCase())
          );

          if (url.searchParams.has("country")) {
            const countryFromParam = url.searchParams.get("country");

            matchingCities = matchingCities.filter(
              (element) =>
                element.country.toLowerCase() == countryFromParam.toLowerCase()
            );
          }

          return new Response(JSON.stringify(matchingCities, null, 2), {
            status: 200,
            headers: headers,
          });
        } else {
          return new Response(JSON.stringify('"Text" is missig'), {
            status: 400,
            headers: headers,
          });
        }
      }
    }
  }
  if (request.method == "POST") {
    if (url.pathname == "/cities") {
      if (request.headers.get("Content-Type") != "application/json") {
        return new Response(JSON.stringify("Invalid Content-Type"), {
          status: 400,
          headers: headers,
        });
      }

      const requestBody = await request.json();

      if (!requestBody.name || !requestBody.country) {
        return new Response(JSON.stringify("Name or Country is missing"), {
          status: 400,
          headers: headers,
        });
      }
      const citiesFound = cities.find(
        (element) =>
          element.name.toLowerCase() == requestBody.name.toLowerCase()
      );

      if (citiesFound == undefined) {
        const newCity = {
          id: findHighestID(cities) + 1,
          name: requestBody.name,
          country: requestBody.country,
        };
        cities.push(newCity);
        return new Response(JSON.stringify(newCity), {
          status: 200,
          headers: headers,
        });
      } else {
        return new Response(JSON.stringify("City-name already exists"), {
          status: 409,
          headers: headers,
        });
      }
    }
  }

  if (request.method == "DELETE") {
    if (url.pathname == "/cities") {
      if (request.headers.get("Content-Type") != "application/json") {
        return new Response(JSON.stringify("Invalid Content-Type"), {
          status: 400,
          headers: headers,
        });
      }

      const requestID = await request.json();

      if (!requestID.id) {
        return new Response(JSON.stringify("ID is missing"), {
          status: 400,
          headers: headers,
        });
      }

      const cityWithIDIndex = cities.findIndex(
        (element) => element.id == requestID.id
      );

      if (cityWithIDIndex != -1) {
        cities.splice(cityWithIDIndex, 1);
        return new Response(JSON.stringify("Delete OK"), {
          status: 200,
          headers: headers,
        });
      } else {
        return new Response(JSON.stringify("No city with such ID"), {
          status: 404,
          headers: headers,
        });
      }
    }
  }

  return new Response(JSON.stringify("No Valid request (400)"), {
    status: 400,
    headers: headers,
  });
}
Deno.serve(handler);
