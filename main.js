const dateArray = document.querySelectorAll(".card .date input");
const dateLabels = document.querySelectorAll(".card .date label");
const btn = document.querySelector(".divider .arrow-style img");
const spans = document.querySelectorAll(".calculate span");
const sectionInputFields = document.querySelectorAll(".card .date section");

btn.addEventListener("click", () => {
  removeErrorMessagesBlocks();
  let isValidDateFormat = true;
  if (checkAndCreateEmptyFields()) isValidDateFormat = false;
  console.warn(isValidDateFormat);
  const [day, month, year] = dateArray;
  if (
    !checkValidDateInputValues({
      DD: day.value,
      MM: month.value,
      YYYY: year.value,
    })
  )
    isValidDateFormat = false;
  if (!isValidDateFormat) return;
  const userDate = new Date(`${year.value}-${month.value}-${day.value}`);
  const currDate = new Date();
  const currDay = +userDate.toString().match(/\s\w{2}\s/g)[0];
  if (userDate == "Invalid Date" || currDay != day.value) {
    insertInvalidDateMessage();
    return;
  }
  if (currDate < userDate) {
    styleAndCreateErrorMessage("Must be in the past", 0);
    styleAndCreateErrorMessage("Must be in the past", 1);
    styleAndCreateErrorMessage("Must be in the past", 2);
    return;
  }
  const date = calcDate(userDate, currDate);
  spans[0].innerText = date.years;
  spans[1].innerText = date.months;
  spans[2].innerText = date.days;
});

function insertInvalidDateMessage() {
  sectionInputFields[0].appendChild(createErrorMessage("Must be a valid date"));
  for (let i = 0; i < dateLabels.length; i++) {
    dateArray[i].style.borderColor = "RED";
    dateLabels[i].style.color = "RED";
  }
}
function checkAndCreateEmptyFields() {
  let isEmpty = false;
  for (let i = 0; i < dateArray.length; i++) {
    if (dateArray[i].value.length == 0) {
      styleAndCreateErrorMessage("This field is required", i);
      isEmpty = true;
    }
  }
  return isEmpty;
}

function removeErrorMessagesBlocks() {
  const errorMessageBlocks = document.querySelectorAll(
    ".card .date section summary"
  );
  for (let i = 0; i < dateLabels.length; i++) {
    dateArray[i].style.borderColor = "black";
    dateLabels[i].style.color = "#767676";
  }
  for (let i = 0; i < errorMessageBlocks.length; i++) {
    errorMessageBlocks[i].parentNode.removeChild(errorMessageBlocks[i]);
  }
}

function checkValidDateInputValues(currentDate) {
  const datesMaxValidValues = {
    DD: [1, 31],
    MM: [1, 12],
    YYYY: [100, new Date().getFullYear()],
  };
  const datesErrorMessages = {
    DD: ["Must be a valid day", "Must be a valid day"],
    MM: ["Must be a valid month", "Must be a valid month"],
    YYYY: ["Must be in the past", "Must be above 99"],
  };
  var isValid = true;
  for (let i = 0; i < sectionInputFields.length; i++) {
    var placeholder = dateArray[i].getAttribute("placeholder");
    if (currentDate[placeholder] == "") continue;
    if (datesMaxValidValues[placeholder][0] > currentDate[placeholder]) {
      isValid = false;
      if (sectionInputFields[i])
        styleAndCreateErrorMessage(datesErrorMessages[placeholder][1], i);
    } else if (datesMaxValidValues[placeholder][1] < currentDate[placeholder]) {
      isValid = false;
      if (sectionInputFields[i])
        styleAndCreateErrorMessage(datesErrorMessages[placeholder][0], i);
    }
  }
  return isValid;
}

function styleAndCreateErrorMessage(message, index) {
  dateArray[index].style.borderColor = "RED";
  dateLabels[index].style.color = "RED";
  sectionInputFields[index].appendChild(createErrorMessage(message));
}

function createErrorMessage(message) {
  const errorMessage = document.createElement("summary");
  errorMessage.classList.add("error-message");
  errorMessage.innerText = message;
  return errorMessage;
}

function calcDate(date1, date2) {
  const dt_date1 = new Date(date1);
  const dt_date2 = new Date(date2);

  const date1_time_stamp = dt_date1.getTime();
  const date2_time_stamp = dt_date2.getTime();

  let calc = new Date(date2_time_stamp - date1_time_stamp);
  if (date1_time_stamp > date2_time_stamp) {
    calc = new Date(date1_time_stamp - date2_time_stamp);
  }
  const calcFormatTmp =
    calc.getDate() + "-" + (calc.getMonth() + 1) + "-" + calc.getFullYear();
  const calcFormat = calcFormatTmp.split("-");
  return {
    months: Number(Math.abs(calcFormat[1]) - 1),
    days: Number(Math.abs(calcFormat[0]) - 1),
    years: Number(Math.abs(calcFormat[2]) - 1970),
  };
}
