const verifyRoles = require("../../middlewares/verifyRoles");

describe("verifyRoles middleware", () => {
  const mockRequest = (role) => ({
    role,
  });
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
  const mockNext = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if no roles provided", () => {
    const req = mockRequest();
    const res = mockResponse();
    const next = mockNext;

    verifyRoles("admin")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: No roles provided",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if insufficient roles provided", () => {
    const req = mockRequest("user");
    const res = mockResponse();
    const next = mockNext;

    verifyRoles("admin")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: Insufficient roles",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if roles provided are allowed", () => {
    const req = mockRequest("admin");
    const res = mockResponse();
    const next = mockNext;

    verifyRoles("admin")(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
