(async function () {
  // document.querySelector("header").innerHTML = "<div>Loading header...</div>";
  try {
    const data = await fetch("./HTML/header.html");
    if (!data.ok) {
      throw new Error("failed to fetch header.html");
    }
    const html = await data.text();
    document.querySelector(".header").innerHTML = html;
  } catch (err) {
    console.log(err);
  }
})();
