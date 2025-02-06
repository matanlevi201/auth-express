import request from "supertest";
import { app } from "../../../../src/app";

const BASE_URL = "/auth";

describe(`DELETE ${BASE_URL}/sessions`, () => {
  it("returns 205 when user signed out", async () => {
    const payload = { email: "test@test.com", password: "Aa@@123456" };
    await request(app).post(`${BASE_URL}/users`).send(payload).expect(200);
    const response = await request(app).delete(`${BASE_URL}/sessions`).send({}).expect(205);
    const cookies = response.get("Set-Cookie") ?? [];
    const refreshTokenCookie = cookies.find((cookie) => cookie.startsWith("refreshToken="));
    expect(refreshTokenCookie).toEqual("refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
  });
});
