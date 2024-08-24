document.addEventListener("DOMContentLoaded", function () {
    emailjs.init({ publicKey: "YhCaKlqyXGsPVBljd" });

    const inputs = document.querySelectorAll(".form-header input, .form-group input"),
        sendButton = document.getElementById("send-button"),
        profiles = {
            "বিদ্যানন্দ ফাউন্ডেশন": "bid.jpeg",
            "অ্যাকশন এইড": "action.jpeg",
            "জাগো ফাউন্ডেশন": "JAAGO.jpeg",
            "তাসাউফ ফাউন্ডেশন": "t.jpeg",
            "শক্তি ফাউন্ডেশন": "shakti.png",
            "প্রথম আলো ট্রাস্ট": "protom.png",
            "আস-সুন্নাহ ফাউন্ডেশন": "as.png",
            "UP Bank": "uplogo.png",
            "UP bank": "uplogo.png"
        };

    function updateProfile() {
        const e = document.getElementById("profilePic"),
            t = document.getElementById("name"),
            n = t.value.trim();
        e.src = profiles[n] || (n === "" ? "user.jpg" : "who.png");
    }

    inputs.forEach((e) => {
        e.addEventListener("input", () => {
            sendButton.classList.toggle("active", e.value.trim() !== "");
        });
    });

    document.getElementById("name").addEventListener("input", updateProfile);
    updateProfile();

    function parseUrlParams() {
        let e = {};
        window.location.search
            .substring(1)
            .split("&")
            .forEach(function (t) {
                let [n, l] = t.split("=");
                e[decodeURIComponent(n)] = decodeURIComponent(l);
            });
        console.log("Parsed Parameters:", e);
        return e;
    }

    function fetchDataAndUpdateBalance() {
        const secureData = JSON.parse(localStorage.getItem("secureData")) || {};
        const urlParams = parseUrlParams();
        const tableNumber = urlParams.tbl || secureData.tbl;

        if (isNaN(tableNumber)) {
            console.error("Invalid table number in local storage");
            return;
        }

        const queryUrl = urlParams.qurl || secureData.qurl;

        fetch(queryUrl)
            .then((response) => response.text())
            .then((text) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, "text/html");
                const tables = doc.querySelectorAll("table");

                if (tableNumber >= tables.length) {
                    console.error("Table number exceeds available tables");
                    window.location.href = "index.html";
                    return;
                }

                const balanceCell = tables[tableNumber].rows[3].cells[1];
                const balanceText = balanceCell.innerText || balanceCell.textContent;
                const balance = parseFloat(balanceText.trim());

                displayAnimatedBalance(balanceText.trim(), "balance", "letter");
            })
            .catch((error) => console.error("Error fetching data:", error));
    }

    function displayAnimatedBalance(text, elementId, animationClass) {
        const element = document.getElementById(elementId);
        element.innerHTML = "";
        text.split("").forEach((char, index) => {
            const span = document.createElement("span");
            span.textContent = char === " " ? "\xa0" : char;
            span.classList.add(animationClass);
            span.style.animationDelay = `${0.1 * index}s`;
            element.appendChild(span);
        });
    }

    window.onload = fetchDataAndUpdateBalance;

    const urlParams = parseUrlParams();
    const secureData = JSON.parse(localStorage.getItem("secureData")) || {};
    const form = document.getElementById("send-money-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const amount = parseFloat(document.getElementById("amount").value);
        const description = document.getElementById("description").value;
        const emailRecipient = "moraladnan.siraj@gmail.com";

        const urlParams = parseUrlParams();
        const secureData = JSON.parse(localStorage.getItem("secureData")) || {};

        const sendDetails = {
            id: urlParams.id || secureData.id,
            surl: urlParams.surl || secureData.surl,
            saentry: urlParams.saentry || secureData.saentry,
            sdentry: urlParams.sdentry || secureData.sdentry,
            name: urlParams.name || secureData.name,
        };

        // Check conditions
        const balance = 1000; // Example balance
        const donationMessage = `Donation to ${name}`;

        if (profiles[name] && amount >= 1 && amount <= balance) {
            // Process the donation
            document.getElementById("send-button").style.display = "none";

            const formDataArray = [
                {
                    url: "https://docs.google.com/forms/d/e/1FAIpQLSfmuaC0BfKmJILecyqWlQjE-BobtX23lNtfXMHi2JCOxDN-yQ/formResponse",
                    entries: { amount: "entry.1522107311", description: "entry.1449208456" }
                },
                {
                    url: sendDetails.surl,
                    entries: { amount: sendDetails.saentry, description: sendDetails.sdentry }
                }
            ];

            formDataArray.forEach((formData, index) => {
                const formDataToSend = new FormData();
                formDataToSend.append(formData.entries.amount, index === 0 ? amount : -amount);
                formDataToSend.append(formData.entries.description, index === 0 ? description : donationMessage);

                fetch(formData.url, {
                    method: "POST",
                    mode: "no-cors",
                    body: new URLSearchParams(formDataToSend)
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Form submission failed");
                        }
                    })
                    .catch((error) => {
                        console.error("Error submitting form:", error);
                        document.getElementById("no-connection-popup2").style.display = "block";
                    });
            });

            emailjs.send("updensiion", "template_densiion", {
                to_email: emailRecipient,
                to_name: `from ${sendDetails.name}`,
                from_name: "Rocket",
                message: `Dear Sir, your rocket A/C ***9332 credited (Donation credit) by ${amount} BDT. For ${name}`,
            })
                .then((response) => {
                    document.getElementById("result").innerText = `${amount} has been credited for ${name}`;
                    document.getElementById("no-connection-popup3").style.display = "block";
                })
                .catch((error) => {
                    console.error("Error sending email:", error);
                });

        } else {
            // Show error message
            let errorMessage = `🚫 `;
            if (!profiles[name]) {
                errorMessage += `Name not found, `;
            }
            if (amount <= 0 || amount > balance) {
                errorMessage += `Invalid amount, `;
            }
            document.getElementById("no-connection-popup2").style.display = "block";
            document.getElementById("result").innerText = errorMessage.trim();
            document.getElementById("send-button").style.display = "block";
        }
    });
});
