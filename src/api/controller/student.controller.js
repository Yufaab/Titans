const StatusCodes = require('http-status');
const Student = require('../../model/student');
const GoogleLogin = require('../../utils/googleLogin');
const Orders = require('../../model/orders');
const Counselling2022 = require('../../model/counselling2022');

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

exports.createOrder = async (req, res) => {
  try {
    let saveOrder;
    if (req.body.isNewOrder) {
      req.body.orderedBy = req.user._id;
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
    else {
      saveOrder = await Orders.updateSchema(req.body.orderid, req.body);
    }
    res.status(StatusCodes.OK).send({
      status: 'Order made successfully',
      data: {
        order: saveOrder
      },
      isNewMember: saveOrder.isNewMember
    });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).send({
      status: 'Order not created',
      error: e,
    });
  }
};

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

exports.generateCounsellingData = async (req, res) => {
  try {
    const { rank, gender, seatType, institute, academicProgramName } = req.body;
    const matcher = {
      openingRank : { 
        $gte: rank 
      },
      gender,
      seatType,
    };
    if (institute) {
      matcher.institute = {
        $in: institute,
      }
    }
    if (academicProgramName) {
      matcher.academicProgramName = {
        $in: academicProgramName
      }
    }
    const dataPref = await Counselling2022.aggregate([
      {
        $match: matcher
      },
      {
        $addFields : { 
          "instituePref" : institute && { 
            $indexOfArray: [ institute , "$institute" ] 
          },
          "academicProgramNamePref" : academicProgramName && {
            $indexOfArray: [ academicProgramName, "$academicProgramName"]
          }
        }
      },
      {
        $sort: { 
          instituePref: 1,
          academicProgramNamePref: 1,
          openingRank: 1,
        }
      }
    ]);
    const dataCommon = await Counselling2022.aggregate([
      {
        $match: {
          openingRank : { 
            $gte: rank 
          },
          gender,
          seatType,
        }
      },
      {
        $sort: {
          openingRank: 1
        }
      },
      {
        $limit: 25
      }
    ])
    const filterData = dataCommon.filter(data => 
      !dataPref.some(obj => obj.openingRank === data.openingRank)
    );
    const collegeData = [ ...dataPref, ...filterData ];
    res.status(StatusCodes.OK).send({
      status: 'Result generated successfully',
      data: {
        collegeData,
      }
    })
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send({
      status: 'Data not found',
      error: err,
    });
  }
};
