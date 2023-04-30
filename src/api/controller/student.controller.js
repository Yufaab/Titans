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
    res.status(StatusCodes.CREATED).send({ 
      status: 'Login successful',
      data: {
        user,
        token,
      }
     });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).send({
      status: 'Login failed',
      error: e,
    });
  }
};

exports.logoutStudent = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token)=> token.token !== req.token)
    await req.user.save()
    res.status(StatusCodes.OK).send({
      status: 'Logged out successfully'
    });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).send({
      status: 'Logout failed',
      error: e,
    });
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
    res.status(StatusCodes.CREATED).send({ 
      status: 'Signup done successfully',
      data: {
        user,
        token,
      }
     });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).send({
      status: 'Signup failed',
      error: e,
    });
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

// create a new order or update a existing order
exports.createOrder = async (req, res) => {
  try {
    let saveOrder;
    // checks if the order is new
    if (req.body.isNewOrder) {
      req.body.orderedBy = req.user._id; // orderby is extracted from the JWT token, refer to middleware
      const order = new Orders(req.body);
      saveOrder = await order.save();
      await Student.findByIdAndUpdate(
        req.user._id,
        {
          $push: { getOrders: saveOrder._id },
        },
        {
          new: true,
          useFindAndModify: true,
        }
      );
    }
    // if the order is already present
    else {
      saveOrder = await Orders.updateSchema(req.body.orderid, req.body);
    }
    res.status(StatusCodes.OK).send({
      status: 'Order made successfully',
      data: {
        order: saveOrder
      }
    });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).send({
      status: 'Order not created',
      error: e,
    });
  }
};

// fetch the order by orderid
exports.getOrder = async (req, res) => {
  try {
    const order = await Orders.findById(req.params.orderid);
    if (!order) {
      res.status(StatusCodes.OK).send({
        status: 'Order not found'
      })
    }
    res.status(StatusCodes.OK).send({
      status: 'Order found',
      data: order
    })
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send({
      status: 'Order not fetched'
    });
  }
};
