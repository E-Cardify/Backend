import request from "supertest";
import app from "../app";
import CardInfo from "../models/CardInfo";
import mongoose from "mongoose";

const sampleCardInfo = {
  information: {
    firstName: "John",
    lastName: "Doe",
    title: "Software Engineer",
    company: "Tech Corp",
  },
  design: {
    color: "blue-500",
    style: "solid",
  },
  fields: [
    {
      label: "Email",
      value: "john@example.com",
    },
    {
      label: "Phone",
      value: "+1234567890",
    },
  ],
};

describe("CardInfo Controllers", () => {
  describe("POST /api/v1/card-info", () => {
    it("should create a new card successfully", async () => {
      const response = await request(app)
        .post("/api/v1/card-info")
        .send(sampleCardInfo);

      expect(response.status).toBe(201);
      expect(mongoose.Types.ObjectId.isValid(response.body)).toBeTruthy();

      const savedCard = await CardInfo.findById(response.body);
      expect(savedCard).toBeTruthy();
      expect(savedCard?.information.firstName).toBe("John");
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app).post("/api/v1/card-info").send({
        information: sampleCardInfo.information,
        // missing design and fields
      });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/v1/card-info/main", () => {
    beforeEach(async () => {
      await CardInfo.create({
        ...sampleCardInfo,
        isMain: true,
      });
    });

    it("should get the main card", async () => {
      const response = await request(app).get("/api/v1/card-info/main");

      expect(response.status).toBe(200);
      expect(response.body.information.firstName).toBe("John");
      expect(response.body.isMain).toBe(true);
    });

    it("should return 404 if no main card exists", async () => {
      await CardInfo.deleteMany({});

      const response = await request(app).get("/api/v1/card-info/main");

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/v1/card-info/:id", () => {
    let cardId: string;

    beforeEach(async () => {
      const card = await CardInfo.create(sampleCardInfo);
      cardId = card!._id!.toString();
    });

    it("should delete a card successfully", async () => {
      const response = await request(app).delete(`/api/v1/card-info/${cardId}`);

      expect(response.status).toBe(204);

      const deletedCard = await CardInfo.findById(cardId);
      expect(deletedCard).toBeNull();
    });

    it("should return 400 for invalid ID format", async () => {
      const response = await request(app).delete(
        "/api/v1/card-info/invalid-id"
      );

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/v1/card-info/change-main-card/:id", () => {
    let cardId: string;

    beforeEach(async () => {
      const card = await CardInfo.create(sampleCardInfo);
      cardId = card!._id!.toString();
      // Create another card that's initially main
      await CardInfo.create({
        ...sampleCardInfo,
        isMain: true,
      });
    });

    it("should change main card successfully", async () => {
      const response = await request(app).get(
        `/api/v1/card-info/change-main-card/${cardId}`
      );

      expect(response.status).toBe(204);

      const newMainCard = await CardInfo.findById(cardId);
      expect(newMainCard?.isMain).toBe(true);

      // Check that old main card is no longer main
      const oldMainCards = await CardInfo.find({ isMain: true });
      expect(oldMainCards.length).toBe(1);
      expect(oldMainCards[0]!._id!.toString()).toBe(cardId);
    });

    it("should return 400 for invalid ID format", async () => {
      const response = await request(app).get(
        "/api/v1/card-info/change-main-card/invalid-id"
      );

      expect(response.status).toBe(400);
    });
  });
});
