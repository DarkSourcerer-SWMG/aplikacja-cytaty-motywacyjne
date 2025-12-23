import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";

describe("API E2E Tests", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api/v1");
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // -----------------------
  // QUOTES
  // -----------------------

  it("GET /quotes/random → should return random quote", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/v1/quotes/random")
      .expect(200);

    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("text");
    expect(res.body).toHaveProperty("author");
  });

  it("GET /quotes/random?tag=motivation → should filter by tag", async () => {
    const res = await request(app.getHttpServer()).get(
      "/api/v1/quotes/random?tag=motivation"
    );

    if (res.status === 200) {
      expect(res.body).toHaveProperty("tags");
    } else {
      expect(res.status).toBe(404);
    }
  });

  it("GET /quotes → should return list of quotes", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/v1/quotes")
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  // -----------------------
  // AUTHORS
  // -----------------------

  it("POST /authors → create author", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/authors")
      .send({ name: "Test Author" })
      .expect(201);

    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Test Author");
  });

  it("GET /authors → list authors", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/v1/authors")
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  // -----------------------
  // TAGS
  // -----------------------

  it("POST /tags → create tag", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/tags")
      .send({ name: "test-tag" })
      .expect(201);

    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("test-tag");
  });

  it("GET /tags → list tags", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/v1/tags")
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });
});
