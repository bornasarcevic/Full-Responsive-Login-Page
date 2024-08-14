"use strict";

// Data from database simulation.
const users = [
  {
    firstName: "John",
    lastName: "Addams",
    email: "john.addams@gmail.com",
    password: "AmaZon321",
  },
  {
    firstName: "Kim",
    lastName: "King",
    email: "kim.king@yahoo.com",
    password: "piKe13",
  },
];

// Button elements
const loginButton = document.querySelector(".login-button");
const signUpButton = document.querySelector(".signup-button");

// Anchor elements
const forgotYourPasswordAnchor = document.querySelector(
  "#forgot-your-password"
);

// Login button click event handling.
loginButton.addEventListener("click", function () {
  //Store values from login fields to variables.
  const loginUsernameTextFieldValue = String(
    document.querySelector(".login-username").value
  );
  const loginPasswordTextFieldValue = String(
    document.querySelector(".login-password").value
  );

  // DATA CHECK 1 - Check if login fields are empty.
  const emptyField = checkIfLoginFieldsAreEmpty(
    loginUsernameTextFieldValue,
    loginPasswordTextFieldValue
  );

  // DATA CHECK 2 - userRegistered variable stores user object if user is found in database.
  const userRegistered = isUserAlreadyRegistered(loginUsernameTextFieldValue);

  // If fields are empty send message to client. If not continue with data check.
  if (emptyField) {
    showLogInEmptyFieldPopupWindow(
      loginUsernameTextFieldValue,
      loginPasswordTextFieldValue
    );
  } else {
    // If user exist in database do password check.
    if (Object.keys(userRegistered).length !== 0) {
      checkLoginPasswordInput(userRegistered, loginPasswordTextFieldValue);
    } else {
      showNoUserPopupWindow();
    }
  }
});

// Sign Up button click event handling.
signUpButton.addEventListener("click", function () {
  //Store values from signup fields to variables.
  const signUpFirstNameTextFieldValue =
    document.querySelector(".signup-first-name").value;
  const signUpLastNameTextFieldValue =
    document.querySelector(".signup-last-name").value;
  const signUpEmailTextFieldValue =
    document.querySelector(".signup-email").value;
  const signUpPasswordTextFieldValue =
    document.querySelector(".signup-password").value;
  const signUpPasswordRepeatTextFieldValue = document.querySelector(
    ".signup-password-repeat"
  ).value;

  // Array consists of text field values and is used to pass those values to function that check if any of fields is empty.
  const textFieldValuesArray = [
    signUpFirstNameTextFieldValue,
    signUpLastNameTextFieldValue,
    signUpEmailTextFieldValue,
    signUpPasswordTextFieldValue,
    signUpPasswordRepeatTextFieldValue,
  ];

  // DATA CHECK 1 - Check if signup fields are empty.
  const emptyField = checkIfSignUpFieldsAreEmpty(textFieldValuesArray);

  // DATA CHECK 2 - If user already have account save user object to userFound variable. On contrary object remains empty.
  const userRegistered = isUserAlreadyRegistered(signUpEmailTextFieldValue);

  if (emptyField) {
    showSignUpEmptyFieldPopupWindow(textFieldValuesArray);
  } else {
    //Check if userFound variable has any keys. If there are any keys that means user exist. Contrary if there is 0 keys user is not registered.
    if (Object.keys(userRegistered).length !== 0) {
      showUserAlreadyExistInDatabasePopupWindow();
    } else {
      if (
        isSignUpPasswordCorrect(
          signUpPasswordTextFieldValue,
          signUpPasswordRepeatTextFieldValue
        )
      ) {
        const newUser = {
          firstName: signUpFirstNameTextFieldValue,
          lastName: signUpLastNameTextFieldValue,
          email: signUpEmailTextFieldValue,
          password: signUpPasswordTextFieldValue,
        };

        users.push(newUser);
        console.log(users);
      } else {
        showIncorrectPasswordPopupWindowSignUp();
      }
    }
  }
});

// Forgot your password? link click event handling.
forgotYourPasswordAnchor.addEventListener("click", function () {
  showForgotYourPasswordPopupWindow();
});

// Check if users already exists in database by comparing e-mail address. If user exist return user object.
const isUserAlreadyRegistered = function (email) {
  let userFoundInDatabase = {};
  for (const user of users) {
    if (user.email === email.toLowerCase()) userFoundInDatabase = user;
  }
  return userFoundInDatabase;
};

// Check if Username or Password fields in login section are empty.
const checkIfLoginFieldsAreEmpty = function (
  usernameTextFieldValue,
  passwordTextFieldValue
) {
  return usernameTextFieldValue.length === 0 ||
    passwordTextFieldValue.length === 0
    ? true
    : false;
};

// Login Password check. Comparing if passwordTextFieldValue is equal to registeredUserObject password property.
// If two values match login is successfuly done. If not user must enter password again.
const checkLoginPasswordInput = function (
  registeredUserObject,
  passwordTextFieldValue
) {
  passwordTextFieldValue === registeredUserObject.password
    ? showLoggedInSuccessfullyPopupWindow()
    : showLoggedInUnsuccessfullyPopupWindow();
};

// Check if text fields in signup section are empty.
const checkIfSignUpFieldsAreEmpty = function (textFieldValuesArray) {
  let isAnyFieldEmpty = false;
  for (const field of textFieldValuesArray) {
    if (field.length === 0) {
      isAnyFieldEmpty = true;
      break;
    }
  }
  return isAnyFieldEmpty;
};

// Sign Up Password check. Consists of two tests, overlaping test and characters test.
const isSignUpPasswordCorrect = function (password, passwordRepeat) {
  const overlapingCheck = checkSignUpPasswordsOverlaping(
    password,
    passwordRepeat
  );
  const charactersCheck = overlapingCheck
    ? checkPasswordCharacters(password)
    : false;
  return overlapingCheck && charactersCheck ? true : false;
};

// Check if Sign Up password and repeated password are the same.
const checkSignUpPasswordsOverlaping = function (password, passwordRepeat) {
  return password === passwordRepeat ? true : false;
};

// Check if Sign Up password meet the given criteria.
// 8-15 characters, at least 1 number, 1 special character, 1 upper case letter, 1 lower case letter.
const checkPasswordCharacters = function (password) {
  let passwordCheckRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordCheckRegex.test(password) ? true : false;
};

// -------------Popup windows-------------
// Show popup window if any or both of login fields are empty.
const showLogInEmptyFieldPopupWindow = function (
  usernameTextFieldValue,
  passwordTextFieldValue
) {
  let emptyFieldDescription = "";
  if (
    usernameTextFieldValue.length === 0 &&
    passwordTextFieldValue.length === 0
  ) {
    emptyFieldDescription =
      "Username and Password field cannot be empty. Please try again.";
  } else if (usernameTextFieldValue.length === 0) {
    emptyFieldDescription = "Username field cannot be empty. Please try again.";
  } else if (passwordTextFieldValue.length === 0) {
    emptyFieldDescription = "Password field cannot be empty. Please try again.";
  }
  Swal.fire({
    title: "Empty fields",
    toast: true,
    text: String(emptyFieldDescription),
    icon: "warning",
    confirmButtonText: "OK",
    customClass: {
      confirmButton: "confirm-button-class",
    },
  });
};

// Show no user popup window.
const showNoUserPopupWindow = function () {
  Swal.fire({
    title: "User not found",
    toast: true,
    text: "User was not found. Please try again or create account.",
    icon: "warning",
    confirmButtonText: "OK",
    customClass: {
      confirmButton: "confirm-button-class",
    },
  });
};

// Show popup window if any of signup fields are empty.
const showSignUpEmptyFieldPopupWindow = function (textFieldValuesArray) {
  let emptySignUpFieldFound = false;
  for (const textFieldValue of textFieldValuesArray) {
    if (textFieldValue.length === 0) {
      emptySignUpFieldFound = true;
      break;
    }
  }
  if (emptySignUpFieldFound) {
    Swal.fire({
      title: "Empty fields",
      toast: true,
      text: "All sign up fields must be entered in order to create new account. ",
      icon: "warning",
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "confirm-button-class",
      },
    });
  }
};

// Show Forgot your password? popup window.
const showForgotYourPasswordPopupWindow = function () {
  Swal.fire({
    title: "Forgot your password?",
    toast: true,
    text: "New password must contain 8-15 characters, at least 1 number, 1 special character, 1 upper case letter and 1 lower case letter.",
    input: "password",
    inputPlaceholder: "Enter new password here",
    confirmButtonText: "Next",
    showCloseButton: true,
    customClass: {
      confirmButton: "confirm-button-class",
    },
  }).then((result) => {
    console.log(result.value);
    const charactersCheckOK = checkPasswordCharacters(result.value);
    if (charactersCheckOK) {
      showEnterEmailPopupWindow();
    } else {
      showIncorrectPasswordPopupWindowSignUp();
    }
  });
};

// Show popup window with email field. Appears after choosing new password and pressing next button.
const showEnterEmailPopupWindow = function () {
  Swal.fire({
    title: "Forgot your password?",
    toast: true,
    text: "In order to reset password please enter your E-Mail address.",
    input: "email",
    inputPlaceholder: "Enter E-mail address here",
    confirmButtonText: "Confirm",
    showCloseButton: true,
    customClass: {
      confirmButton: "confirm-button-class",
    },
    preConfirm: () => {
      showEmailSentConfirmationPopupWindow();
    },
  });
};

// Show email sent confirmation popup window. Appears after entering email and pressing confirm button.
const showEmailSentConfirmationPopupWindow = function () {
  Swal.fire({
    icon: "success",
    toast: true,
    title: "Great!",
    text: "New password is sent to email adress.",
    customClass: {
      confirmButton: "confirm-button-class",
    },
  });
};

// Show logged in successfully popup window when user enters correct Username and Password.
const showLoggedInSuccessfullyPopupWindow = function () {
  Swal.fire({
    icon: "success",
    toast: true,
    title: "Logged successfully",
    text: "Correct username and password.",
    showConfirmButton: false,
    timer: 2000,
  });
};

// Show logged in unsuccessfully popup window when user enters correct Username but wrong Password.
const showLoggedInUnsuccessfullyPopupWindow = function () {
  Swal.fire({
    icon: "warning",
    toast: true,
    title: "Login unsuccessfully",
    text: "Wrong password. Please try again.",
    customClass: {
      confirmButton: "confirm-button-class",
    },
  });
};

// Show popup window which tells user that email address already exist in database.
const showUserAlreadyExistInDatabasePopupWindow = function () {
  Swal.fire({
    icon: "warning",
    toast: true,
    title: "User exist",
    text: "Someone is already registered with e-mail address.  Choose another one and try again.",
    customClass: {
      confirmButton: "confirm-button-class",
    },
  });
};

// Show incorrect password popup window in signup form.
const showIncorrectPasswordPopupWindowSignUp = function () {
  Swal.fire({
    icon: "warning",
    toast: true,
    title: "Incorrect password",
    text: "Password doesn't match given criteria. It should contain 8-15 characters, at least 1 number, 1 special character, 1 upper case letter and 1 lower case letter.",
    customClass: {
      confirmButton: "confirm-button-class",
    },
  });
};
