const validator = require('validator')

const validateProfileEditData = (req) => {
  const editableFields = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "photoURL",
    "about",
    "skills",
  ];
  const isEditable = Object.keys(req).every((field) =>
    editableFields.includes(field)
  );
  return isEditable;
};

const validPassword = (req)=>{
  const isValid = validator.isStrongPassword(req);
  return isValid;

}

module.exports = {
  validateProfileEditData,
  validPassword
};
