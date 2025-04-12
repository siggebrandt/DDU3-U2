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

function handler(request) {
  const url = new URL(request.url);

  // if (url.searchParams.has("text") && url.searchParams.has("country")

  //console.log(request);

  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Content-Type", "application/json");

  if (request.method == "GET") {
    if (url.pathname == "/cities") {
      return new Response(JSON.stringify(cities, null, 2), {
        status: 200,
        headers: headers,
      });
    }

    const cityIDRoute = new URLPattern({ pathname: "/cities/:id" });
    const citiesIDPage = cityIDRoute.exec(request.url);
    if (citiesIDPage) {
      const idOfCity = citiesIDPage.pathname.groups.id;

      const foundCity = cities.find((element) => element.id == idOfCity);

      if (foundCity != undefined) {
        return new Response(JSON.stringify(foundCity, null, 2), {
          status: 200,
          headers: headers,
        });
      } else {
        return new Response(null, {
          status: 404,
          headers: headers,
        });
      }
    }

    if (url.pathname == "/cities/search" && url.searchParams.has("text")) {
      const textFromParam = url.searchParams.get("text");

      console.log("param", textFromParam);

      // svarar med array av städerna som inkluderas i text...
      const matchingCities = cities.filter((element) =>
        element.name.toLowerCase().includes(textFromParam.toLowerCase())
      );
      console.log("matched cities:", matchingCities);
      return new Response(JSON.stringify(matchingCities, null, 2), {
        headers: headers,
      });

      // country
      if (url.searchParams.has("country")) {
        // country hello
      }
    }
  }
  if (request.method == "POST") {
    if (url.pathname == "/cities") {
      //
    }
  }

  if (request.method == "DELETE") {
    if (url.pathname == "/cities") {
      //
    }
    //
  }
  return new Response("No Valid request", { status: 400 });
}
Deno.serve(handler);
