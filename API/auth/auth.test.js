const sinon = require("sinon");
const should = require("should");
const jwt = require("jsonwebtoken");
const { isAuthorized } = require("../middlewares/authMiddlewares");
const User = require("../users/user.model");
const { NotAuthorized } = require("../helpers/error.constructors");
const ObjectId = require("mongoose").Types.ObjectId;

describe("Auth", () => {
  const jwt_secret = "secret";
  const user = new User({});
  user.date = Date.now();
  user.token = jwt.sign({ id: user.id, date: user.date }, jwt_secret);
  user.email = "test@mail.com";

  describe("#isAuthorized", () => {
    let sandbox;

    before(() => {
      sandbox = sinon.createSandbox();

      getPayloadFromTokenStub = sinon
        .stub(User, "getPayloadFromToken")
        .callsFake((token) => {
          try {
            return jwt.verify(token, jwt_secret);
          } catch {
            return false;
          }
        });

      findByIdStub = sinon.stub(User, "findById").callsFake((id) => {
        return id === user.id ? user : null;
      });

      isTokenEqualStub = sinon.stub(user, "isTokenEqual").callsFake((token) => {
        return token === user.token ? true : false;
      });

      this.nextSpy = sinon.spy();
    });
    beforeEach(() => {
      this.nextSpy.resetHistory();
      getPayloadFromTokenStub.resetHistory();
      findByIdStub.resetHistory();
      isTokenEqualStub.resetHistory();
    });
    after(() => {
      sandbox.restore();
    });

    context("without req.headers.authorization", () => {
      const req = {
        headers: {},
      };

      it("should not call getPayloadFromToken", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        getPayloadFromTokenStub.callCount.should.equal(0);
      });

      it("should not call findById", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        findByIdStub.callCount.should.equal(0);
      });

      it("should not call isTokenEqual", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        isTokenEqualStub.callCount.should.equal(0);
      });

      it("should call next once", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        this.nextSpy.callCount.should.equal(1);
      });

      it("argument of next should deepEqual error - new NotAuthorized()", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        const arg = this.nextSpy.getCall(0).args[0];
        should.deepEqual(arg, new NotAuthorized());
      });
    });

    context("with invalid token", () => {
      const req = {
        headers: {
          authorization: `Bearer ${jwt.sign(
            { id: user.id, date: user.date },
            "WRONG JWT SECRET"
          )}`,
        },
      };

      it("should call once getPayloadFromToken", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        getPayloadFromTokenStub.callCount.should.equal(1);
      });

      it("getPayloadFromToken should return false", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        const token = getPayloadFromTokenStub.getCall(0).args[0];

        getPayloadFromTokenStub(token).should.equal(false);
      });

      it("should not call findById", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        findByIdStub.callCount.should.equal(0);
      });

      it("should not call isTokenEqual", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        isTokenEqualStub.callCount.should.equal(0);
      });

      it("should call next once", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        this.nextSpy.callCount.should.equal(1);
      });

      it("argument of next should deepEqual error - new NotAuthorized()", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        const arg = this.nextSpy.getCall(0).args[0];
        should.deepEqual(arg, new NotAuthorized());
      });
    });

    context("with correct but missing user.id", () => {
      const req = {
        headers: {
          authorization: `Bearer ${jwt.sign(
            { id: new User({}).id, date: user.date },
            jwt_secret
          )}`,
        },
      };

      it("should call once getPayloadFromToken", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        getPayloadFromTokenStub.callCount.should.equal(1);
      });

      it("getPayloadFromToken should return object with valid id", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        const token = getPayloadFromTokenStub.getCall(0).args[0];

        should.ok(ObjectId.isValid(getPayloadFromTokenStub(token).id));
      });

      it("should call once findById", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        findByIdStub.callCount.should.equal(1);
      });

      it("findById should return null", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        const id = findByIdStub.getCall(0).args[0];

        should.equal(findByIdStub(id), null);
      });

      it("should not call isTokenEqual", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        isTokenEqualStub.callCount.should.equal(0);
      });

      it("should call next once", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        this.nextSpy.callCount.should.equal(1);
      });

      it("argument of next should deepEqual error - new NotAuthorized()", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        const arg = this.nextSpy.getCall(0).args[0];
        should.deepEqual(arg, new NotAuthorized());
      });
    });

    context("with correct but outdated token (user.id is present)", () => {
      const req = {
        headers: {
          authorization: `Bearer ${jwt.sign(
            { id: user.id, date: Date.now() },
            jwt_secret
          )}`,
        },
      };

      it("should call once getPayloadFromToken", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        getPayloadFromTokenStub.callCount.should.equal(1);
      });

      it("getPayloadFromToken should return object with valid id", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        const token = getPayloadFromTokenStub.getCall(0).args[0];

        should.ok(ObjectId.isValid(getPayloadFromTokenStub(token).id));
      });

      it("should call once findById", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        findByIdStub.callCount.should.equal(1);
      });

      it("findById should return user", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        const id = findByIdStub.getCall(0).args[0];

        should.equal(findByIdStub(id), user);
      });

      it("should call once isTokenEqual", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        isTokenEqualStub.callCount.should.equal(1);
      });

      it("isTokenEqual should return false", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        const token = isTokenEqualStub.getCall(0).args[0];

        should.equal(isTokenEqualStub(token), false);
      });

      it("should call next once", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        this.nextSpy.callCount.should.equal(1);
      });

      it("argument of next should deepEqual error - new NotAuthorized()", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        const arg = this.nextSpy.getCall(0).args[0];
        should.deepEqual(arg, new NotAuthorized());
      });
    });

    context("with exact token", () => {
      const req = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      it("should call once getPayloadFromToken", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        getPayloadFromTokenStub.callCount.should.equal(1);
      });

      it("getPayloadFromToken should return object with valid id", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        const token = getPayloadFromTokenStub.getCall(0).args[0];

        should.ok(ObjectId.isValid(getPayloadFromTokenStub(token).id));
      });

      it("should call once findById", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        findByIdStub.callCount.should.equal(1);
      });

      it("findById should return user", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        const id = findByIdStub.getCall(0).args[0];

        should.equal(findByIdStub(id), user);
      });

      it("should call once isTokenEqual", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        isTokenEqualStub.callCount.should.equal(1);
      });

      it("isTokenEqual should return true", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        const token = isTokenEqualStub.getCall(0).args[0];

        should.equal(isTokenEqualStub(token), true);
      });

      it("should call next once", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        this.nextSpy.callCount.should.equal(1);
      });

      it("next should call without arguments", async () => {
        await isAuthorized(req, {}, this.nextSpy);

        const argsCount = this.nextSpy.getCall(0).args.length;

        should.equal(argsCount, 0);
      });

      it("req should have user", async () => {
        const next = () => {
          should.equal(req.user, user);
        };

        await isAuthorized(req, {}, next);
      });
    });
  });
});
