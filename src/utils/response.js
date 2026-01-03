export const success = (res, data, message = "OK") => {
  res.json({ success: true, message, data });
};

export const failure = (res, message, code = 400) => {
  res.status(code).json({ success: false, message });
};
