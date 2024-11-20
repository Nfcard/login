emailjs.init("dnubinfz9VQV8L-Li");

function getQueryParams() {
    const params = {};
    window.location.search
        .substring(1)
        .split("&")
        .forEach((param) => {
            const [key, value] = param.split("=");
            params[decodeURIComponent(key)] = decodeURIComponent(value.replace(/\+/g, " "));
        });
    return params;
}

const params = getQueryParams();
document.getElementById("name").value = params.payit || "";
const inputs = document.querySelectorAll(".form-header input, .form-group input");
const sendButton = document.getElementById("send-button");

inputs.forEach((input) => {
    input.addEventListener("input", () => {
        const allInputsFilled = Array.from(inputs).every((input) => input.value.trim() !== "");
        sendButton.classList.toggle("active", allInputsFilled);
    });
});

function fetchTableDataDynamic(rowIndex, cellIndex, targetId, animationClass) {
    const params = getQueryParams();
    const tableIndex = parseInt(params.tbl, 10);

    if (isNaN(tableIndex)) {
        console.error("Invalid table number in query parameters");
    } else {
        const queryUrl = params.qurl;

        fetch(queryUrl)
            .then((response) => response.text())
            .then((htmlText) => {
                const parser = new DOMParser();
                const htmlDocument = parser.parseFromString(htmlText, "text/html");
                const tables = htmlDocument.querySelectorAll("table");

                if (tableIndex >= tables.length) {
                    console.error("Table index exceeds available tables");
                } else {
                    const rows = tables[tableIndex].rows;

                    if (rowIndex >= rows.length) {
                        console.error(`Row index ${rowIndex} exceeds available rows`);
                    } else {
                        const cells = rows[rowIndex].cells;

                        if (cellIndex >= cells.length) {
                            console.error(`Cell index ${cellIndex} exceeds available cells`);
                        } else {
                            const cell = cells[cellIndex];
                            let value = cell.innerText || cell.textContent;
                            value = value.trim();

                            if (!value) {
                                value = "0";
                            }

                            animateText(value, targetId, animationClass);
                        }
                    }
                }
            })
            .catch((error) => console.error("Error fetching data:", error));
    }
}

function animateText(text, targetId, animationClass) {
    const target = document.getElementById(targetId);
    target.innerHTML = "";
    text.split("").forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\xa0" : char;
        span.classList.add(animationClass);
        span.style.animationDelay = `${0.1 * index}s`;
        target.appendChild(span);
    });
}

fetchTableDataDynamic(3, 1, "balance", "letter");
fetchTableDataDynamic(4, 4, "bonus", "letter");

function sendMessageToParent() {
    window.parent.postMessage("success", "*");
}
document.getElementById("send-money-form")?.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Audio Elements
    const audioElement = new Audio("ting.mp3");
    const audioElement2 = new Audio("fail.mp3");
    audioElement.preload = "auto";
    audioElement2.preload = "auto";

    // Popups
    const failedPopup = document.getElementById("no-connection-popup2");
    const donePopup = document.getElementById("no-connection-popup3");

    // Button
    const sendButton = document.getElementById("send-button");
    if (!sendButton) {
        console.error("Send button not found");
        return;
    }

    sendButton.style.opacity = "0.5";
    sendButton.innerText = "processing....";
    sendButton.disabled = true;

    // Inputs
    const accountName = document.getElementById("name")?.value || "";
    const amountInput = document.getElementById("amount")?.value || "0";
    const amount = parseFloat(amountInput);
    const fetchedDataValue = parseFloat(document.getElementById("balance")?.innerText || "0");

    // Validation for inputs
    if (isNaN(amount) || amount <= 0) {
        console.error("Invalid amount input");
        return;
    }

   const params = getQueryParams();
 const surl = params.surl || "";
    const saentry = params.saentry || "default_entry1";
    const sdentry = params.sdentry || "default_entry2";
    const name = params.name;
    const number = params.id;
    const description = `Paid to ${accountName}`;
    const description2 = `Payment from ${name}`;
    const remailMap = {
        "Habib Store": "md.adnan.bank@gmail.com",
        "Moral Adnan": "moraladnan.siraj@gmail.com"
    };
    const remail = remailMap[accountName] || "adnanratul6@gmail.com";

   if (amount < 10) {
    handleError("সর্বনিম্ন পেমেন্ট 10 টাকা।");
    return;
}

if (amount > fetchedDataValue) {
    handleError("অপর্যাপ্ত ব্যালেন্স। পেমেন্টের পরিমাণ আপনার ব্যালেন্স অতিক্রম করেছে।");
    return;
}

// Error handling function
function handleError(errorMessage) {
    audioElement2.play().catch((error) => console.error("Audio playback failed:", error));
    if (failedPopup) failedPopup.style.display = "block";
    document.getElementById("result").innerText = errorMessage;
    sendButton.style.opacity = "1";
    sendButton.innerText = "Pay";
    sendButton.disabled = false;
}

    // Google Forms Data
    let googleFormsData = [];
    if (accountName === "Rifat") {
        googleFormsData = [
            {
                url: "https://docs.google.com/forms/d/e/1FAIpQLSdwibAx-kNF8WUJMtkLovi5v7CvD8b331qg8cuIXxQgvBY3fQ/formResponse",
                entries: { amount: "entry.571402887", description: "entry.885732113" }
            },
            { url: surl, entries: { amount: saentry, description: sdentry } }
        ];
    } else if (accountName === "Habib Store") {
        googleFormsData = [
            {
                url: "https://docs.google.com/forms/d/e/1FAIpQLSfeGLi1AvyzGFbLFsZO1cBE6b6yvAVMx8xxZtyuME4P2efMQQ/formResponse",
                entries: { amount: "entry.1522107311", description: "entry.1449208456" }
            },
            { url: surl, entries: { amount: saentry, description: sdentry } }
        ];
    }

    try {
        // Submitting forms
        for (const form of googleFormsData) {
            const formData = new URLSearchParams();
            formData.append(form.entries.amount, form === googleFormsData[0] ? amount : `-${amount}`);
            formData.append(form.entries.description, form === googleFormsData[0] ? description2 : description);

            await fetch(form.url, { method: "POST", mode: "no-cors", body: formData });
        }

        // Sending email
        await emailjs.send("service_g55k84c", "template_v7ksvaj", {
            to_email: remail,
            to_name: accountName,
            from_name: name,
            message: `প্রিয় স্যার/ম্যাডাম, A/C ${name} [ ${number} ] ${amount} টাকা দিয়েছেন। ক্যাশ আউট করতে অ্যাপ ব্যবহার করুন।`
        });
        const bonusInput = document.getElementById("bonus")?.innerText || "0";
const bonusValue = bonusInput.includes("%")
    ? Math.min((amount * parseFloat(bonusInput.replace("%", "").trim())) / 100, 20)
    : Math.min(parseFloat(bonusInput) || 0, 20);

if (bonusValue >= 1) {
    // Submit the bonus form
    const bonusFormUrl = surl;
    const bonusFormData = new URLSearchParams();
    bonusFormData.append(saentry, bonusValue.toString());
    bonusFormData.append(sdentry, "Bonus [payment]");

    await fetch(bonusFormUrl, { method: "POST", mode: "no-cors", body: bonusFormData });

    sendButton.style.display = 'none';

    // Success message
    if (donePopup) donePopup.style.display = "block";
    audioElement.play().catch((error) => console.error("Audio playback failed:", error));

    document.getElementById("result").innerText = `${amount} টাকা পেমেন্ট হয়ে গেছে। আপনি ${bonusValue} টাকা বোনাস পেয়েছেন!`;
} else {
    // Display result message only (no form submission)
    document.getElementById("result").innerText = `${amount} টাকা পেমেন্ট হয়ে গেছে।`;

    // Show the done popup and play the sound as well
    if (donePopup) donePopup.style.display = "block";
    audioElement.play().catch((error) => console.error("Audio playback failed:", error))
      } }catch (error) {
        console.error("Error during submission:", error);
        audioElement2.play().catch((error) => console.error("Audio playback failed:", error));
        if (failedPopup) failedPopup.style.display = "block";
        document.getElementById("result").innerText = `${accountName}-এ ${amount} টাকা পেমেন্ট পাঠাতে ব্যর্থ হয়েছে!`;
    } finally {
        sendButton.style.opacity = "1";
        sendButton.innerText = "Pay";
        sendButton.disabled = false;
    }
});
