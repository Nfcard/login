// Initialize EmailJS
emailjs.init("YhCaKlqyXGsPVBljd");

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
        nameInput.value = decodeURIComponent(nameValue);
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
            const message = `Donation to ${name}`;
            document.getElementById("result").innerText = `Processing donation of ${amount} BDT to ${name}...`;

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
    const sendUrl = params.surl;
    const descriptionEntry = params.sdentry;
    const amountEntry = params.saentry;

    const requestData = new FormData();
    requestData.append(amountEntry, -amount);
    requestData.append(descriptionEntry, message);

    fetch(sendUrl, { method: "POST", mode: "no-cors", body: new URLSearchParams(requestData) })
        .then(() => {
            document.getElementById("result").innerText = `${amount} BDT has been successfully donated to ${name}`;
            sendButton.style.display = "block";
        })
        .catch((error) => {
            console.error("Error submitting form:", error);
            document.getElementById("result").innerText = "Failed to process the donation. Please try again.";
            sendButton.style.display = "block";
        });

    sendEmail(name, amount, message);
}

function sendEmail(name, amount, message) {
    const params = getParams();
    const donorName = params.name;

    emailjs
        .send("updensiion", "template_densiion", {
            to_email: "moraladnan.siraj@gmail.com",
            to_name: "DM sir",
            from_name: `from ${donorName}`,
            message,
        })
        .then(() => {
            console.log("Email sent successfully.");
        })
        .catch((error) => {
            console.error("Error sending email:", error);
        });
}
