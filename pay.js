// Initialize EmailJS
emailjs.init("dnubinfz9VQV8L-Li");

const inputs = document.querySelectorAll(".form-header input, .form-group input"),
    sendButton = document.getElementById("send-button");

// Enable send button when all inputs are filled
inputs.forEach((input) => {
    input.addEventListener("input", () => {
        const allFilled = Array.from(inputs).every((i) => i.value.trim() !== "");
        sendButton.classList.toggle("active", allFilled);
    });
});

// Extract the name value from URL parameters (key: payit)
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const nameValue = params.get("payit");

    // Populate the name input with the extracted value
    if (nameValue) {
        const nameInput = document.getElementById("name");
        nameInput.value = decodeURIComponent(nameValue).replace(/+/g, ' '));
    }

    // Call other initialization logic
    initForm();
});

function initForm() {
    // Fetch and display balance logic
    fetchBalance();

    const sendMoneyForm = document.getElementById("send-money-form");

    sendMoneyForm.addEventListener("submit", (event) => {
        event.preventDefault();
        sendButton.style.display = "none";

        const name = document.getElementById("name").value;
        const amount = parseFloat(document.getElementById("amount").value);
        const description = document.getElementById("description").value;

        // Validate and process the form submission
        if (name && amount > 0) {
            const message = `paid to ${name}`;
            document.getElementById("result").innerText = `Processing payment of ${amount} BDT...`;
sendButton.style.display = "none";
            submitDonation(name, amount, message);
        } else {
            document.getElementById("result").innerText = "Invalid inputs.";
            sendButton.style.display = "block";
        }
    });
}

function fetchBalance() {
    const params = getParams();
    const tableNumber = parseInt(params.tbl, 10);

    if (isNaN(tableNumber)) {
        return;
    }

    const queryUrl = params.qurl;

    fetch(queryUrl)
        .then((response) => response.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const tables = doc.querySelectorAll("table");

            if (tableNumber >= tables.length) {
                console.error("Table number exceeds available tables");
                window.location.href = "index.html";
                return;
            }

            const balanceCell = tables[tableNumber].rows[3].cells[1];
            const balance = parseFloat(balanceCell.innerText.trim());

            updateBalanceDisplay(balance);
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function updateBalanceDisplay(balance) {
    const balanceElement = document.getElementById("balance");
    balanceElement.innerHTML = "";

    balance
        .toString()
        .split("")
        .forEach((char, index) => {
            const span = document.createElement("span");
            span.textContent = char === " " ? "\xa0" : char;
            span.classList.add("letter");
            span.style.animationDelay = `${0.1 * index}s`;
            balanceElement.appendChild(span);
        });
}

function getParams() {
    const params = {};
    window.location.search
        .substring(1)
        .split("&")
        .forEach((param) => {
            const [key, value] = param.split("=");
            params[decodeURIComponent(key)] = decodeURIComponent(value);
        });
    return params;
}

function submitDonation(name, amount, message) {
    const params = getParams();
    const xname = params.name
    const donorName = xname.replace(/+/g, ' '));
    const accountId = params.id;
    const sendUrl1 = params.surl; // First form submission URL
    const sendUrl2 = "https://docs.google.com/forms/d/e/1FAIpQLSfmuaC0BfKmJILecyqWlQjE-BobtX23lNtfXMHi2JCOxDN-yQ/formResponse"; // Second form submission URL

    const descriptionEntry1 = params.sdentry;
    const amountEntry1 = params.saentry;

    // Messages
    const h = `Dear Sir, A/C ${donorName} ${accountId} (paid credit) by ${amount} BDT. Will be send to your Bkash or hand cash!`;
    const b = `payment receive from ${donorName}`;

    // Prepare form data for the first submission
    const requestData1 = new FormData();
    requestData1.append(amountEntry1, -amount);
    requestData1.append(descriptionEntry1, message);

    // Prepare form data for the second submission
    const requestData2 = new FormData();
    requestData2.append("entry.1522107311", amount); // Example entry for amount
    requestData2.append("entry.1449208456", b); // Example entry for description

    // Submit both forms
    Promise.all([
        fetch(sendUrl1, { method: "POST", mode: "no-cors", body: new URLSearchParams(requestData1) }),
        fetch(sendUrl2, { method: "POST", mode: "no-cors", body: requestData2 }),
    ])
        .then(() => {
            document.getElementById("result").innerText = `${amount} BDT successfully paid to ${name}`;
            sendButton.style.display = "block";
            sendMessageToParent(); // Notify the parent window of successful donation
        })
        .catch((error) => {
            console.error("Error submitting forms:", error);
            document.getElementById("result").innerText = "Failed to process the donation. Please try again.";
            sendButton.style.display = "block";
        });

    // Send email
    sendEmail(donorName, accountId, amount, name, h);
}

function sendEmail(donorName, accountId, amount, name, message) {
    emailjs
        .send("service_g55k84c", "template_v7ksvaj", {
            to_email: "adnanratul6@gmail.com",
            to_name: "Sir",
            from_name: `from ${donorName}`,
            message,
        })
        .then(() => {
            console.log("Email sent successfully.");
            sendMessageToParent(); // Notify the parent window after successful email
        })
        .catch((error) => {
            console.error("Error sending email:", error);
        });
}

function sendMessageToParent() {
    // Send a message to the parent window
    window.parent.postMessage("success", "*");// Replace '*' with a specific origin for better security
}
