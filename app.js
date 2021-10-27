const express = require("express");
const app = express();
const methodOverride = require("method-override");
const cors = require("cors");

mongoose = require("mongoose");

const mongoPath =
  "mongodb+srv://m001-student:QlVq3YE9omjEpdwb@cluster0.djnza.mongodb.net/covid?retryWrites=true&w=majority";
mongoose.connect(mongoPath, function (err, res) {
  if (err) {
    console.log("ERROR: connecting to Database. " + err);
  } else {
    console.log("conectado");
  }
});

const StatesModel = require("./models/StatesModel");
const CovidModel = require("./models/CovidModel");

let router = express.Router();

const formated_data = (data) => {
  let fechas = [];
  let totales = [];
  for (let data_state of data) {
    if (!fechas.includes(data_state.date)) {
      fechas.push(data_state.date);
      totales[data_state.date] = {
        cases: 0,
        deaths: 0,
      };
    }
  }

  for (let fecha of fechas) {
    let cases_temp = 0;
    let deaths_temp = 0;
    for (let data_detail of data) {
      if (data_detail.date == fecha) {
        cases_temp = totales[data_detail.date].cases;
        deaths_temp = totales[data_detail.date].deaths;

        totales[data_detail.date].cases = cases_temp + data_detail.cases;
        totales[data_detail.date].deaths = deaths_temp + data_detail.deaths;
      }
    }
  }

  let total_cases_day = [];
  let total_deaths_day = [];
  for (let fecha of fechas) {
    total_cases_day.push(totales[fecha].cases);
    total_deaths_day.push(totales[fecha].deaths);
  }

  let all_data_return = [];

  const data_1 = {
    dates: fechas,
    cases: total_cases_day,
    deaths: total_deaths_day,
  };
  all_data_return = data_1;
  return [all_data_return];
};

router.get("/states", async (req, res) => {
  const result = await StatesModel.find({}).exec();
  res.send(result);
});

router.get("/cases/specificday/:day", async (req, res) => {
  const { day } = req.params;
  const day_arr = day.split("-");

  const start = day_arr[0] + "-" + day_arr[1] + "-" + (day_arr[2] - 1);
  const end = day_arr[0] + "-" + day_arr[1] + "-" + day_arr[2];

  const data = await CovidModel.find({
    date: {
      $gte: `${start}T00:00:00.000Z`,
      $lt: `${end}T23:59:59.999Z`,
    },
  });
  let total_cases = 0;
  let total_deaths = 0;
  for (let data_state of data) {
    total_cases = total_cases + data_state.cases;
    total_deaths = total_deaths + data_state.deaths;
  }
  const all_data = {
    totals: {
      cases: total_cases,
      deaths: total_deaths,
    },
    details: {
      data: data,
    },
  };
  res.send(all_data);
});

router.get("/cases/dates/:state/:filter", async (req, res) => {
  const today = new Date();
  const lastsevenday = new Date(today);
  const { filter, state } = req.params;

  if (filter == 7) {
    lastsevenday.setDate(lastsevenday.getDate() - 7);
  }
  if (filter == 30) {
    lastsevenday.setMonth(lastsevenday.getMonth() - 1);
  }
  if (filter == "all") {
    lastsevenday.setDate(01);
    lastsevenday.setMonth(01);
    lastsevenday.setYear(2020);
  }

  let d = new Date(today);
  let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
  let mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
  let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
  const end = `${ye}-${mo}-${da}`;

  let d1 = new Date(lastsevenday);
  let ye1 = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d1);
  let mo1 = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d1);
  let da1 = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d1);
  const start = `${ye1}-${mo1}-${da1}`;

  let data = {};
  if (state == "all") {
    data = await CovidModel.find({
      date: {
        $gte: `${start}T00:00:00.000Z`,
        $lt: `${end}T23:59:59.999Z`,
      },
    });
  } else {
    data = await CovidModel.find({
      date: {
        $gte: `${start}T00:00:00.000Z`,
        $lt: `${end}T23:59:59.999Z`,
      },
      state: `${state}`,
    });
  }

  const all_data_return = formated_data(data);

  res.send(all_data_return);
});

app.use(cors({ origin: true }));
app.use(router);

app.listen(3030, function () {
  console.log("Node server running on http://localhost:3030");
});
