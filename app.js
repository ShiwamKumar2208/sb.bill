window.onload = generate;
window.generate = generate;
window.download = download;
window.share = share;

function parse(text) {
  const lines = text.split("\n");
  let items = [];

  for (let l of lines) {
    let m = l.trim().match(/(.*?)(\d+)\s*$/);
    if (m) {
      items.push({
        name: m[1].trim(),
        price: parseInt(m[2])
      });
    }
  }

  return items;
}

function generate() {
  const name = document.getElementById("name").value;
  const text = document.getElementById("input").value;

  const items = parse(text);

//   if (!text.trim()) {
//     document.getElementById("bill").innerHTML = "";
//     return;
//   }

  let total = 0;

  let html = `
    <div class="logo">
      <img src="./logo.png">
    </div>

    <div class="title">Shobha Boutique</div>
    <div class="subtitle">Your personal tailoring service</div>

    <div class="row"><b>Name:</b> ${name || "-"}</div>
    <div class="row"><b>Date:</b> ${new Date().toLocaleDateString()}</div>

    <hr>
  `;

  items.forEach(i => {
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
        <p>Thank you for your order 😊</p>
        <p>Do visit again ✨</p>
        <p class="note">Please keep this bill for any future reference.</p>
    </div>
  `;

  document.getElementById("bill").innerHTML = html;
}

async function download() {
  console.log("DOWNLOAD CLICKED");
  const bill = document.getElementById("bill");

  await new Promise(r => setTimeout(r, 100)); // wait render

  const canvas = await html2canvas(bill, {
    scale: 2, // sharp image
    backgroundColor: "#ffffff"
  });

  const link = document.createElement("a");
  link.download = "sb-bill.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

async function share() {
  const bill = document.getElementById("bill");

  await new Promise(r => setTimeout(r, 100));

  const canvas = await html2canvas(bill, {
    scale: 2,
    backgroundColor: "#ffffff"
  });

  canvas.toBlob(async (blob) => {
    const file = new File([blob], "sb-bill.png", {
      type: "image/png"
    });

    // BEST CASE (mobile)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "Bill"
      });
    } else {
      // fallback (desktop or unsupported)
      const link = document.createElement("a");
      link.download = "sb-bill.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  });
}