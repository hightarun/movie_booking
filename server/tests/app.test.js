const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");

let connectDB = require("../config/init_db");
const User = require("../src/models/User");

let authToken;
let adminAuthToken;
let ticketID;
let theatreID;
let movieID;
let showID;

beforeAll((done) => {
  const adminUser = new User({
    username: "hightarun",
    name: "Tarun Bisht",
    email: "tarunbisht252000@gmail.com",
    password: "$2a$10$TyoRN0eZNtMgAKo2Xe491.3s1Rw/yLm6BpTt6y2fkhbmqJ0nJndDG",
    role: "ADMIN",
    isVerified: true,
    phone: 8929405439,
  });
  adminUser.save();
  done();
});
afterAll((done) => {
  mongoose.connection.close();
  mongoose.connection.db.dropDatabase();
  app.close();
  done();
});
describe("Sample Test", () => {
  it("should test that true === true", () => {
    expect(true).toBe(true);
  });
});

describe("Authentication Routes", () => {
  it("should register new user", async () => {
    const newUser = {
      username: "tarunbisht",
      firstName: "Tarun",
      lastName: "Bisht",
      email: "cyberdaemon7@gmail.com",
      password: "12345678",
      phone: "8929405438",
    };
    const res = await request(app)
      .post("/api/moviebooking/register")
      .send(newUser);
    expect(res.status).toEqual(200);
  });
  it("should login and generate token for USER", async () => {
    const user = {
      emailOrUname: "tarunbisht",
      password: "12345678",
    };
    const res = await request(app).post("/api/moviebooking/login").send(user);
    authToken = res.body.token;
    expect(res.status).toEqual(200);
  });
  it("should login and generate token for ADMIN", async () => {
    const user = {
      emailOrUname: "hightarun",
      password: "adminadmin",
    };
    const res = await request(app).post("/api/moviebooking/admin").send(user);
    adminAuthToken = res.body.token;
    expect(res.status).toEqual(200);
  });
});

describe("Movie , theatre and show routes", () => {
  it("should add new movie", async () => {
    const movie = {
      movieFullName: "Golmal",
      movieLength: "02:30",
      bookingStatus: "true",
      releaseDate: "31-07-2023",
    };
    const res = await request(app)
      .post("/api/moviebooking/admin/add-movie")
      .send(movie)
      .set("auth-token", adminAuthToken);
    movieID = res.body.movieID;
    expect(res.status).toEqual(200);
  });

  it("should add new theatre", async () => {
    const theatre = {
      theatreNo: "2",
      totalSeats: 99,
    };
    const res = await request(app)
      .post("/api/moviebooking/admin/add-theatre")
      .send(theatre)
      .set("auth-token", adminAuthToken);
    theatreID = res.body.theatreID;
    expect(res.status).toEqual(200);
  });
  it("should add new show", async () => {
    const show = {
      theatreID: theatreID,
      movieID: movieID,
      showStartTime: "06-08-2023 16:45:00",
      showPrice: "350",
    };
    const res = await request(app)
      .post("/api/moviebooking/admin/add-show")
      .send(show)
      .set("auth-token", adminAuthToken);
    showID = res.body.showID;
    expect(res.status).toEqual(200);
  });
});

describe("Ticket and Movie API", () => {
  it("should return all movies", async () => {
    const res = await request(app).get("/api/moviebooking/movie/all");
    expect(res.status).toEqual(200);
  });
  it("should book the ticket", async () => {
    const ticket = {
      showDetails: showID,
      noOfTickets: 2,
      seatsBooked: ["M12", "M13"],
    };
    const res = await request(app)
      .post("/api/moviebooking/movie/add")
      .set("auth-token", authToken)
      .send(ticket);
    ticketID = res.body.ticketID;
    expect(res.status).toEqual(200);
  });
  it("should update the ticket", async () => {
    const ticket = {
      showDetails: showID,
      noOfTickets: 3,
      seatsBooked: ["M12", "M13", "M14"],
    };
    const res = await request(app)
      .put(`/api/moviebooking/movie/update/${ticketID}`)
      .set("auth-token", authToken)
      .send(ticket);
    expect(res.status).toEqual(200);
  });
  it("should delete the ticket", async () => {
    const res = await request(app)
      .delete(`/api/moviebooking/movie/delete/${ticketID}`)
      .set("auth-token", authToken);
    expect(res.status).toEqual(200);
  });
});
