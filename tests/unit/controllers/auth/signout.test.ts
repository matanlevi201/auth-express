import { container } from "../../../../inversify.config";
import { IUserRepository, TYPES } from "../../../../src/types";
import { mockUserRepository } from "../../__mocks__/repositories";
import { mockRequest, mockResponse } from "../../__mocks__/express";
import { signout } from "../../../../src/controllers/auth.controllers";

describe("AUTH / signout Controller", () => {
  container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(mockUserRepository);

  it("should throw bad request error when user provided wrong email", async () => {
    const mockReq = mockRequest({ body: {} });
    const mockRes = mockResponse();

    await signout(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(205);
    expect(mockRes.clearCookie).toHaveBeenCalledWith("refreshToken");
  });
});
