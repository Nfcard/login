emailjs.init("YhCaKlqyXGsPVBljd");
const inputs = document.querySelectorAll(".form-header input, .form-group input"),
    sendButton = document.getElementById("send-button");
inputs.forEach((e) => {
    e.addEventListener("input", () => {
        let e = Array.from(inputs).every((e) => "" !== e.value.trim());
        sendButton.classList.toggle("active", e);
    });
});
const profiles = {
    "বিদ্যানন্দ ফাউন্ডেশন": "bid.jpeg",
    "অ্যাকশন এইড": "action.jpeg",
    "জাগো ফাউন্ডেশন": "JAAGO.jpeg",
    "তাসাউফ ফাউন্ডেশন": "t.jpeg",
    "শক্তি ফাউন্ডেশন": "shakti.png",
    "প্রথম আলো ট্রাস্ট": "protom.png",
    "আস-সুন্নাহ ফাউন্ডেশন": "as.png",
    "UP Bank": "uplogo.png",
    "UP bank": "uplogo.png",
};
function updateProfile() {
    let e = document.getElementById("profilePic"),
        t = document.getElementById("name"),
        n = t.value.trim();
    "" === n ? (e.src = "user.jpg") : profiles[n] ? (e.src = profiles[n]) : (e.src = "who.png");
}
document.getElementById("name").addEventListener("input", updateProfile),
    updateProfile(),
    document.addEventListener("DOMContentLoaded", function () {
        let e;
        function t() {
            let r = n(),
                o = parseInt(r.tbl, 10);
            if (isNaN(o)) {
                console.error("Invalid table number in local storage");
                return;
            }
            let l = r.qurl || t.qurl;
            fetch(l)
                .then((e) => e.text())
                .then((t) => {
                    let n = new DOMParser(),
                        r = n.parseFromString(t, "text/html"),
                        l = r.querySelectorAll("table");
                    if (o >= l.length) {
                        console.error("Table number exceeds available tables"), (window.location.href = "index.html");
                        return;
                    }
                    let a = l[o].rows[3].cells[1],
                        i = a.innerText || a.textContent;
                    (e = parseFloat(i.trim())),
                        (function e(t, n, r) {
                            let o = document.getElementById(n);
                            (o.innerHTML = ""),
                                t.split("").forEach((e, t) => {
                                    let n = document.createElement("span");
                                    (n.textContent = " " === e ? "\xa0" : e), n.classList.add(r), (n.style.animationDelay = `${0.1 * t}s`), o.appendChild(n);
                                });
                        })(i.trim(), "balance", "letter");
                })
                .catch((e) => console.error("Error fetching data:", e));
        }
        function n() {
            let e = {};
            return (
                window.location.search
                    .substring(1)
                    .split("&")
                    .forEach(function (t) {
                        let [n, r] = t.split("=");
                        e[decodeURIComponent(n)] = decodeURIComponent(r);
                    }),
                e
            );
        }
        (window.onload = t),
            document.getElementById("send-money-form").addEventListener("submit", function (r) {
                r.preventDefault(), (sendButton.style.display = "none");
                let o = document.getElementById("name").value,
                    l = "Donation to " + o,
                    a = parseFloat(document.getElementById("amount").value),
                    i = "-" + a,
                    s = document.getElementById("description").value,
                    p = n(),
                    u = p.id,
                    c = p.surl,
                    m = p.saentry,
                    y = p.sdentry,
                    g = p.name,
                    f = "from " + g,
                    h = `Dear Sir, A/C ${g} ${u} (Donation credit) by ${a} BDT. For ${o}`,
                    b = `${s} - ${f}`,
                    E = document.getElementById("no-connection-popup2"),
                    B = document.getElementById("no-connection-popup3"),
                    I = !1,
                    v = new Audio("ting.mp3");
                function sendMessageToParent() {
            // Send a message to the parent window
            window.parent.postMessage('triggerAction', '*');  // '*' allows all origins (replace with a specific origin for security)
        }
                (v.preload = "auto"), v.load(), (document.getElementById("description").value = b);
                let $ = [];
                if (profiles[o] && a >= 1 && a <= e)
                    $ = [
                        { url: "https://docs.google.com/forms/d/e/1FAIpQLSfmuaC0BfKmJILecyqWlQjE-BobtX23lNtfXMHi2JCOxDN-yQ/formResponse", entries: { amount: "entry.1522107311", description: "entry.1449208456" } },
                        { url: c, entries: { amount: m, description: y } },
                    ];
                else {
                    let k = `🚫 `;
                    profiles[o] || (k += ` নাম ভুল হয়েছে, `), a < 0 && (k += ` টাকার পরিমাণ সঠিক নয়,`), a > e && (k += ` পর্যাপ্ত ব্যালেন্স নেই,`), (document.getElementById("result").innerText = k), (sendButton.style.display = "block");
                    return;
                }
                $.forEach((e, n) => {
                    let r = new FormData();
                    r.append(e.entries.amount, e === $[0] ? a : i),
                        r.append(e.entries.description, e === $[0] ? b : l),
                        fetch(e.url, { method: "POST", mode: "no-cors", body: new URLSearchParams(r) })
                            .then((e) => {
                                if (!e.ok) throw Error("Error submitting form");
                                t();
                            })
                            .catch((e) => {
                                I || (v.play().catch((e) => console.error("Audio playback failed:", e)), (I = !0)), (E.style.display = "block"), console.error("Error submitting form:", e);
                            });
                }),
                    emailjs
                        .send("updensiion", "template_densiion", { to_email: "moraladnan.siraj@gmail.com", to_name: "DM sir", from_name: f, message: h })
                        .then((e) => {
                            I || (v.play().catch((e) => console.error("Audio playback failed:", e)), (I = !0)), sendMessageToParent(),(B.style.display = "block"), t(), (document.getElementById("result").innerText = `${a} has been donated for ${o}`);
                        })
                        .catch((e) => {
                            I ||
                                (v.play().catch((e) => {
                                    console.error("Audio playback failed:", e);
                                }),
                                (I = !0)),
                                (document.getElementById("result").innerText = `${a}৳ to ${o} has been successfully donated ✅️`),
                                (B.style.display = "block"),
                                console.error("Error sending email:", e);
                        });
            });
    });
