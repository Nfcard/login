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

let fetchedDataValue;

function fetchTableData() {
    const params = getQueryParams();
    const tableIndex = parseInt(params.tbl, 10);

    if (isNaN(tableIndex)) {
        console.error("Invalid table number in local storage");
        return;
    }

    const queryUrl = params.qurl;

    fetch(queryUrl)
        .then((response) => response.text())
        .then((htmlText) => {
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(htmlText, "text/html");
            const tables = htmlDocument.querySelectorAll("table");

            if (tableIndex >= tables.length) {
                console.error("Table number exceeds available tables");
                window.history.back();
                return;
            }

            const cell = tables[tableIndex].rows[3].cells[1];
            const value = cell.innerText || cell.textContent;

            fetchedDataValue = parseFloat(value.trim());
            animateText(value.trim(), "balance", "letter");
        })
        .catch((error) => console.error("Error fetching data:", error));
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

function sendMessageToParent() {
    window.parent.postMessage("success", "*");
}

window.onload = fetchTableData;

document.getElementById("send-money-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const audioElement = new Audio("ting.mp3");
    const audioElement2 = new Audio("fail.mp3");
    audioElement.preload = "auto";
    audioElement2.preload = "auto";

    const failedPopup = document.getElementById("no-connection-popup2");
    const donePopup = document.getElementById("no-connection-popup3");

    sendButton.style.opacity = 0.5;
    sendButton.innerText = "wait....";
    sendButton.disabled = true;

    const accountName = document.getElementById("name").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const amount2 = `-${amount}`;
    const description = `Paid to ${accountName}`;
    const name = params.name || "unknown";
    const surl = params.surl;
    const saentry = params.saentry;
    const sdentry = params.sdentry;
    const description2 = `Payment from ${name}`;

    const remailMap = {
        "Habib Store": "md.adnan.bank@gmail.com",
        "Taj": "tajmulok8@gmail.com",
        "Ritu": "tajmulok8@gmail.com",
        "Rifat": "K45255336@gmail.com",
        "Ruhul": "Ruhulok8@gmail.com",
        "Tamjid": "Tamjidimg.jpg",
        "Shorna": "uplogo.jpg",
        "Sadik": "sadik4u3@gmail.com",
        "Jubayer": "jubayer@example.com",
        "Arafat": "k45255336@gmail.com"
    };

    const remail = remailMap[accountName] || "adnanratul6@gmail.com";

    let googleFormsData = [];

    if (accountName === "Rifat" && amount >= 1 && amount <= fetchedDataValue) {
        googleFormsData = [
            {
                url: "https://docs.google.com/forms/d/e/1FAIpQLSdwibAx-kNF8WUJMtkLovi5v7CvD8b331qg8cuIXxQgvBY3fQ/formResponse",
                entries: {
                    amount: "entry.571402887",
                    description: "entry.885732113"
                }
            },
            {
                url: surl,
                entries: {
                    amount: saentry,
                    description: sdentry
                }
            }
        ];
    } else if (accountName === "Habib Store" && amount >= 1 && amount <= fetchedDataValue) {
        googleFormsData = [
            {
                url: "https://docs.google.com/forms/d/e/1FAIpQLSfeGLi1AvyzGFbLFsZO1cBE6b6yvAVMx8xxZtyuME4P2efMQQ/formResponse",
                entries: {
                    amount: "entry.1522107311",
                    description: "entry.1449208456"
                }
            },
            {
                url: surl,
                entries: {
                    amount: saentry,
                    description: sdentry
                }
            }
        ];
    } else {
        const errorMessage = `🚫 ${
            amount < 1 ? "Minimum payment is 1 unit" : "Insufficient balance"
        }`;

        audioElement2.play().catch((error) => console.error("Audio playback failed:", error));
        failedPopup.style.display = "block";
        document.getElementById("result").innerText = errorMessage;
        sendButton.disabled = false;
        sendButton.innerText = "Send";
        return;
    }

    try {
        for (const form of googleFormsData) {
            const formData = new URLSearchParams();
            formData.append(form.entries.amount, form === googleFormsData[0] ? amount : amount2);
            formData.append(form.entries.description, form === googleFormsData[0] ? description2 : description);

            await fetch(form.url, {
                method: "POST",
                mode: "no-cors",
                body: formData
            });
        }

        await emailjs.send("service_g55k84c", "template_v7ksvaj", {
            to_email: remail,
            to_name: accountName,
            from_name: name,
            message: `Dear Sir/Madam, A/C ${name} has paid ${amount}. Please use the app to cash out.`
        });
        sendButton.style.display = "none";
        sendMessageToParent();
        audioElement.play().catch((error) => console.error("Audio playback failed:", error));
        donePopup.style.display = "block";
        document.getElementById("result").innerText = `${amount}৳ has been successfully paid`;
    } catch (error) {
        console.error("Error during submission:", error);
        audioElement2.play().catch((error) => console.error("Audio playback failed:", error));
        failedPopup.style.display = "block";
        document.getElementById("result").innerText = `Failed to send payment of ${amount}৳ to ${accountName}`;
    } finally {
        sendButton.style.opacity = "1";
        sendButton.innerText = "Send";
        sendButton.disabled = false;
    }
});