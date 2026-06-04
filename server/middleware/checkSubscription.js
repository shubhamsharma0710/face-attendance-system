module.exports = async (
  req,
  res,
  next
) => {
  const company =
    req.company;

  if (
    new Date() >
    company.planExpiryDate
  ) {
    return res.status(403).json({
      message:
        "Subscription Expired",
    });
  }

  next();
};