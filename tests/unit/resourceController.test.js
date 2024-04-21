const {
  createResource,
  updateResource,
} = require("../../controllers/resourceController");
const Resource = require("../../models/resourceModel");
const ClassRoom = require("../../models/classRoomModel");

jest.mock("../../models/resourceModel");
jest.mock("../../models/classRoomModel");
const findByIdAndUpdateMock = jest.fn(() => mockResource);
Resource.findByIdAndUpdate.mockImplementation(findByIdAndUpdateMock);

describe("createResource", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        description: "Test description",
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  test("should create resource successfully", async () => {
    const newResource = {
      _id: "resourceId",
      description: "Test description",
      location: "",
    };
    Resource.prototype.save.mockResolvedValue(newResource);
    await createResource(req, res);
    expect(Resource.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      data: newResource,
      Message: "Resource Created Successfully!",
    });
  });

  test("should handle error while creating resource", async () => {
    const error = new Error("Database error");
    Resource.prototype.save.mockRejectedValue(error);
    await createResource(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      data: {},
      message: "Error Creating Resource.",
    });
  });
});

describe("updateResource", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "resourceId" },
      body: {
        description: "Updated description",
        location: "classRoomId",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update the resource and return a success message", async () => {
    const mockResource = {
      _id: "resourceId",
      description: "Old description",
      location: "oldClassRoomId",
      save: jest.fn().mockResolvedValue(),
    };

    const mockClassRoomWithResource = {
      _id: "classRoomWithResourceId",
      resources: ["resourceId"],
      save: jest.fn().mockResolvedValue(),
    };

    const mockClassRoomToBeUpdated = {
      _id: "classRoomId",
      resources: [],
      save: jest.fn().mockResolvedValue(),
    };

    jest
      .spyOn(ClassRoom, "findOne")
      .mockResolvedValueOnce(mockClassRoomWithResource);
    jest
      .spyOn(ClassRoom, "findById")
      .mockResolvedValueOnce(mockClassRoomToBeUpdated);
    jest
      .spyOn(Resource, "findByIdAndUpdate")
      .mockResolvedValueOnce(mockResource);

    await updateResource(req, res);

    expect(ClassRoom.findOne).toHaveBeenCalledWith({ resources: "resourceId" });
    expect(ClassRoom.findById).toHaveBeenCalledWith("classRoomId");
    expect(Resource.findByIdAndUpdate).toHaveBeenCalledWith(
      "resourceId",
      {
        description: "Updated description",
        location: "classRoomId",
      },
      { new: true }
    );
    expect(mockClassRoomWithResource.resources).not.toContain("resourceId");
    expect(mockClassRoomToBeUpdated.resources).toContain("resourceId");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        resource: expect.objectContaining(mockResource),
        classRoom: expect.objectContaining(mockClassRoomToBeUpdated),
      },
      message: "Resource Updated Successfully!",
    });
  });

  it("should handle error when updating resource", async () => {
    const mockError = new Error("Test error");
    jest.spyOn(Resource, "findByIdAndUpdate").mockRejectedValueOnce(mockError);

    await updateResource(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      data: {},
      message: "Error Updating Resource.",
    });
  });

  it("should handle error gracefully", async () => {
    const mockError = new Error("Test error");
    jest.spyOn(ClassRoom, "findOne").mockRejectedValueOnce(mockError);

    await updateResource(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      data: {},
      message: "Error Updating Resource.",
    });
  });
});
