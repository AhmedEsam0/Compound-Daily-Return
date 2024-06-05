let Btn = document.getElementById("btn");
let BtnClicked = false;
let inputFields = document.querySelectorAll("input");
let div = document.getElementById("div");
let outputContainer = document.getElementById("output-container");
let goToBottomBtn = document.getElementById("go-to-bottom");
let backToTopBtn = document.getElementById("back-to-top");

function calculateInterest(startingBalance, annualRate, numberOfDays) {
  let dailyRate = annualRate / (100 * 365);
  let totalInterest = 0;
  outputContainer.innerHTML = ""; // Clear existing content

  for (let i = 1; i <= numberOfDays; i++) {
    let dailyInterest = startingBalance * dailyRate;
    totalInterest += dailyInterest;

    let paragraph = document.createElement("p");
    paragraph.textContent = `Day ${i} return: ${dailyInterest
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    paragraph.style.color = "red";

    let paragraph2 = document.createElement("p");
    paragraph2.innerHTML = `:Total return after day ${i}<br>${totalInterest
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    paragraph2.style.color = "darkgreen";

    outputContainer.appendChild(paragraph);
    outputContainer.appendChild(paragraph2);

    let hr = document.createElement("hr");
    hr.style.margin = "5px auto";
    hr.style.border = "1px solid rgb(0 206 185)";
    function adjustHrWidth() {
      // Check if viewport width is less than or equal to 767px
      if (window.innerWidth <= 767) {
        // Set the width of <hr> element to 80%
        hr.style.width = "80%";
        outputContainer.style.fontSize = "12px";
      } else {
        // For viewport widths greater than 767px, set the width to auto or any other value you prefer
        hr.style.width = "60%";
      }
    }
    adjustHrWidth();
    window.addEventListener("resize", adjustHrWidth);
    outputContainer.appendChild(hr);

    startingBalance += dailyInterest;
  }

  outputContainer.style.display = "block";
}

function formatNumberWithCommas(value) {
  if (!isNaN(value) && value !== "") {
    let parts = value.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  return value;
}

function parseFormattedNumber(value) {
  return parseFloat(value.replace(/,/g, ""));
}

inputFields.forEach((input) => {
  input.oninput = function () {
    // Allow only numbers and a single dot
    let cursorPosition = this.selectionStart;
    let originalValue = this.value;

    // Remove all non-numeric characters except for the first dot
    let newValue = originalValue.replace(/[^0-9.]/g, "");
    let parts = newValue.split(".");
    if (parts.length > 2) {
      newValue = parts[0] + "." + parts.slice(1).join("");
    }

    this.value = formatNumberWithCommas(newValue);

    // Correct cursor position
    let newLength = this.value.length;
    cursorPosition += newLength - originalValue.length;
    this.setSelectionRange(cursorPosition, cursorPosition);

    // Remove error state if input is corrected
    this.classList.remove("error");
    let errorMessage = this.nextElementSibling;
    if (errorMessage && errorMessage.classList.contains("error-message")) {
      errorMessage.style.display = "none";
    }
  };
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission or other default actions
    Btn.click();
  }
});

Btn.onclick = function () {
  BtnClicked = true;
  let startingBalance = parseFormattedNumber(
    document.getElementById("starting-balance").value
  );
  let annualRate = parseFormattedNumber(
    document.getElementById("rate-percentage").value
  );
  let numberOfDays = parseFormattedNumber(
    document.getElementById("number-of-days").value
  );

  let isValid = true;
  let firstInvalidInput = null;

  // Validation
  inputFields.forEach((input) => {
    let value = parseFormattedNumber(input.value);
    if (isNaN(value) || value <= 0) {
      input.classList.add("error");
      isValid = false;

      // Focus on the first invalid input field
      if (!firstInvalidInput) {
        firstInvalidInput = input;
      }

      // Show error message
      let errorMessage = input.nextElementSibling;
      if (!errorMessage || !errorMessage.classList.contains("error-message")) {
        errorMessage = document.createElement("div");
        errorMessage.classList.add("error-message");
        errorMessage.textContent = "الرجاء إدخال قيمة صالحة";
        input.parentNode.insertBefore(errorMessage, input.nextSibling);
      }
      errorMessage.style.display = "block";
    } else {
      input.classList.remove("error");
      let errorMessage = input.nextElementSibling;
      if (errorMessage && errorMessage.classList.contains("error-message")) {
        errorMessage.style.display = "none";
      }
    }
  });

  if (!isValid) {
    // Focus on the first invalid input field
    if (firstInvalidInput) {
      firstInvalidInput.focus();
    }

    goToBottomBtn.style.display = "none";
    backToTopBtn.style.display = "none";
    div.style.display = "none";
    return;
  }

  sessionStorage.setItem("Starting_Balance", startingBalance);
  sessionStorage.setItem("Annual_Rate", annualRate);
  sessionStorage.setItem("Number_Of_Days", numberOfDays);

  calculateInterest(startingBalance, annualRate, numberOfDays);

  // Show the div
  div.style.display = "block";

  // Show the footer
  document.getElementById("footer").style.display = "block";
};

window.onload = function () {
  let startingBalance = sessionStorage.getItem("Starting_Balance");
  let annualRate = sessionStorage.getItem("Annual_Rate");
  let numberOfDays = sessionStorage.getItem("Number_Of_Days");

  if (startingBalance) {
    document.getElementById("starting-balance").value =
      formatNumberWithCommas(startingBalance);
  }
  if (annualRate) {
    document.getElementById("rate-percentage").value =
      formatNumberWithCommas(annualRate);
  }
  if (numberOfDays) {
    document.getElementById("number-of-days").value =
      formatNumberWithCommas(numberOfDays);
  }
};

// Scroll event listener to hide/show the back-to-top button

window.onscroll = function () {
  if (BtnClicked) {
    let startingBalance = parseFormattedNumber(
      document.getElementById("starting-balance").value
    );
    let annualRate = parseFormattedNumber(
      document.getElementById("rate-percentage").value
    );
    let numberOfDays = parseFormattedNumber(
      document.getElementById("number-of-days").value
    );

    let isValid = !(
      isNaN(startingBalance) ||
      startingBalance <= 0 ||
      isNaN(annualRate) ||
      annualRate <= 0 ||
      isNaN(numberOfDays) ||
      numberOfDays <= 0
    );

    if (!isValid) {
      backToTopBtn.style.display = "none";
      goToBottomBtn.style.display = "none";
      div.style.display = "none";
      return;
    }

    if (window.scrollY > 300) {
      backToTopBtn.style.display = "block";
      div.style.display = "none"; // Hide the div when scrolling beyond 300 pixels
    } else {
      backToTopBtn.style.display = "none";
      div.style.display = "block"; // Show the div when scrolling back up
    }

    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 50
    ) {
      goToBottomBtn.style.display = "none";
    } else {
      goToBottomBtn.style.display = "block";
    }
  }
};

div.onclick = function () {
  outputContainer.scrollIntoView({ behavior: "smooth" });
  div.style.display = "none";
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
backToTopBtn.addEventListener("click", scrollToTop);
function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}
goToBottomBtn.addEventListener("click", scrollToBottom);
window.addEventListener("scroll", function () {
  // Check if user has scrolled to the bottom of the page and the window width is under 520px
  if (
    window.innerWidth <= 520 &&
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 35
  ) {
    // User has scrolled to the bottom and the window width is under 520px, reduce opacity of the background
    backToTopBtn.style.backgroundColor = "rgba(16, 202, 183, 0.3)"; // Adjust the rgba values as needed
    backToTopBtn.style.color = "rgba(255,255,255,0.4)";
  } else {
    // User is not at the bottom or the window width is over 520px, reset background color to original
    backToTopBtn.style.backgroundColor = "#10cab7"; // Original background color
    backToTopBtn.style.color = "rgba(255,255,255,1)";
  }
});
