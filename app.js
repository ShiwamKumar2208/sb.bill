window.generate = generate;
window.download = download;
window.share = share;
window.shareupi = shareupi;
window.shareBoth = shareBoth;

window.onload = () => {
  const dateInput = document.getElementById("date");
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;
  generate();
};

function parse(text) {
  const lines = text.split("\n");
  let items = [];

  for (let l of lines) {
    let m = l.trim().match(/(.*?)(\d+)\s*$/);
    if (m) {
      items.push({
        name: m[1].trim(),
        price: parseInt(m[2]),
      });
    }
  }

  return items;
}

function generate() {
  const dateInput = document.getElementById("date").value;
  const formattedDate = dateInput
    ? new Date(dateInput).toLocaleDateString("en-GB")
    : "";

  const name = document.getElementById("name").value;
  const text = document.getElementById("input").value;

  const items = parse(text);

  let total = 0;

  let html = `
    <div class="logo">
      <img src="./logo.png">
    </div>

    <div class="title">Shobha Boutique</div>
    <div class="subtitle">Your personal tailoring service</div>

    <div class="row"><b>Name:</b> ${name || "-"}</div>
    <div class="row"><b>Date:</b> ${formattedDate}</div>

    <hr>
  `;

  items.forEach((i) => {
    total += i.price;

    html += `
      <div class="item">
        <span>${i.name}</span>
        <span>₹${i.price}</span>
      </div>
    `;
  });

  html += `
    <hr>

    <div class="total">
      <span>Total</span>
      <span>₹${total}</span>
    </div>

    <div class="footer">
      <p>Thank you for choosing Shobha Boutique 😊</p>
      <p>Do visit again ✨</p>
      <p class="note">
        Please keep this bill. For any issues, contact within 7 days.
      </p>
    </div>
  `;

  document.getElementById("bill").innerHTML = html;
  window.currentTotal = total;
}

function generateUPIQR() {
  const total = window.currentTotal || 0;

  if (!total) return false;

  const upiId = "shark.sk1154@oksbi";
  const name = "Shobha Boutique";

  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${total}&cu=INR`;

  // 🔹 MODAL QR
  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = "";

  new QRCode(qrContainer, {
    text: upiLink,
    width: 200,
    height: 200
  });

  document.getElementById("qrAmount").textContent = `Amount: ₹${total}`;

  // 🔹 EXPORT QR (IMPORTANT)
  const exportContainer = document.getElementById("qrExportCode");
  exportContainer.innerHTML = "";

  new QRCode(exportContainer, {
    text: upiLink,
    width: 200,
    height: 200
  });

  document.getElementById("qrExportAmount").textContent = `Amount: ₹${total}`;

  return true;
}

/* 🔥 DOWNLOAD BILL */
async function download() {
  const bill = document.getElementById("bill");

  const canvas = await html2canvas(bill, {
    scale: 2,
    backgroundColor: "#ffffff",
  });

  const link = document.createElement("a");
  link.download = "sb-bill.png";
  link.href = canvas.toDataURL();
  link.click();
}

/* 🔥 SHARE BILL (fixed reliability) */
async function share() {
  const bill = document.getElementById("bill");

  const canvas = await html2canvas(bill, {
    scale: 2,
    backgroundColor: "#ffffff",
  });

  canvas.toBlob(async (blob) => {
    const file = new File([blob], "sb-bill.png", {
      type: "image/png",
    });

    try {
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({ files: [file] });
      } else {
        // fallback
        const link = document.createElement("a");
        link.download = "sb-bill.png";
        link.href = canvas.toDataURL();
        link.click();
      }
    } catch (err) {
      console.log(err);
    }
  });
}

async function shareupi() {
  const ok = generateUPIQR();

  if (!ok) {
    alert("Add items first");
    return;
  }

  const qrBox = document.querySelector("#qrExport .qr-box");

  const canvas = await html2canvas(qrBox, {
    scale: 2,
    backgroundColor: "#ffffff"
  });

  const blob = await new Promise(resolve => canvas.toBlob(resolve));

  if (!blob) {
    alert("Failed to generate QR image");
    return;
  }

  const file = new File([blob], "upi-qr.png", { type: "image/png" });

  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({ files: [file] });
  } else {
    const link = document.createElement("a");
    link.download = "upi-qr.png";
    link.href = canvas.toDataURL();
    link.click();
  }
}

async function shareBoth() {
  const ok = generateUPIQR();

  if (!ok) {
    alert("Add items first");
    return;
  }

  const bill = document.getElementById("bill");
  const qrBox = document.querySelector("#qrExport .qr-box");

  const billCanvas = await html2canvas(bill, {
    scale: 2,
    backgroundColor: "#ffffff"
  });

  const qrCanvas = await html2canvas(qrBox, {
    scale: 2,
    backgroundColor: "#ffffff"
  });

  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = Math.max(billCanvas.width, qrCanvas.width);
  finalCanvas.height = billCanvas.height + qrCanvas.height;

  const ctx = finalCanvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

  const billX = (finalCanvas.width - billCanvas.width) / 2;
  ctx.drawImage(billCanvas, billX, 0);
  const qrX = (finalCanvas.width - qrCanvas.width) / 2;
  ctx.drawImage(qrCanvas, qrX, billCanvas.height);

  const blob = await new Promise(resolve => finalCanvas.toBlob(resolve));

  if (!blob) {
    alert("Failed to generate image");
    return;
  }

  const file = new File([blob], "bill-with-qr.png", { type: "image/png" });

  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({ files: [file] });
  } else {
    const link = document.createElement("a");
    link.download = "bill-with-qr.png";
    link.href = finalCanvas.toDataURL();
    link.click();
  }
}
