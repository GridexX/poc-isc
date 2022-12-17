
const healthResult = {
  status: "ok",
};


function setupRoutes(app, client) {

  app.get("/", function (_, res) {
    res.send("Welcome to the Excuse Generator API");
  });

  app.get("/health/ready", function (_, res) {
    res.send(healthResult);
  });

  app.get("/health/alive", function (_, res) {
    res.send(healthResult);
  });


  // returns 1 random excuses
  app.get("/excuse", function (req, res) {
    const result = client.getRandom(1);
    res.send(result);
  });

  // returns the excuse having the specific id
  app.get("/excuse/id/:num(\\d+)?", async function (req, res) {
    const result = await client.getByID(parseInt(req.params.num));
    res.send(result);
  });


  // returns n random excuses
  app.get("/excuse/:num(\\d+)?", function (req, res) {
    const result = client.getRandom(parseInt(req.params.num));
    res.send(result);
  });

  // returns excuse based on specific category
  app.get("/excuse/:category", async function (req, res) {
    const result = await client.getByCategory(req.params.category, 1);
    res.send(result);
  });

  // returns n excuse based on specific category
  app.get("/excuse/:category/:num(\\d+)?", async function (req, res) {
    const result = await client.getByCategory(req.params.category, parseInt(req.params.num) || 1);
    res.send(result);

  });

  app.get("*", function (_, res) {
    res.status(404).send(" 404 - Page not found ");
  });

}

module.exports = {
  setupRoutes
};