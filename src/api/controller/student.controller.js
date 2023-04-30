const StatusCodes = require('http-status');
const Student = require('../../model/student');
const GoogleLogin = require('../../utils/googleLogin');
const Orders = require('../../model/orders');

exports.loginStudent = async (req, res) => {
  try {
    let googleRes;
    if (req.body.googleAccessToken) {
      googleRes = await GoogleLogin.login(req.body.googleAccessToken);
    }
    const user = await Student.findByCredentials(
      req.body.email || googleRes.data.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(StatusCodes.CREATED).send({ user, token });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).send();
  }
};

exports.signupStudent = async (req, res) => {
  try {
    let googleRes;
    let user;
    if (req.body.googleAccessToken) {
      googleRes = await GoogleLogin.login(req.body.googleAccessToken);
      user = new Student({
        email: googleRes.data.email,
        firstname: googleRes.data.given_name,
        lastname: googleRes.data.family_name,
      });
    } else {
      user = new Student(req.body);
    }
    await user.save();
    const token = await user.generateAuthToken();
    res.status(StatusCodes.CREATED).send({ user, token });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).send(e);
  }
};

exports.updateData = async (req, res) => {
  try {
    const user = await Student.updateSchema(req.params.studentid, req.body);
    res.status(StatusCodes.CREATED).send({ user });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).send();
  }
};

exports.createOrder = async (req, res) => {
  try {
    const order = new Orders(req.body);
    const saveOrder = await order.save();
    const orderById = req.body.orderedBy;
    await Student.findByIdAndUpdate(
      orderById,
      {
        $push: { getOrders: saveOrder._id },
      },
      {
        new: true,
        useFindAndModify: true,
      }
    );
    res.status(StatusCodes.OK).send(saveOrder);
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).send();
  }
};