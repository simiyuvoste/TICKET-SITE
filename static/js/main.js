document.getElementById("ticket-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  if (!name || !email) return alert("Please fill in all fields");

  document.getElementById("ticket-form").style.display = "none";
  document.getElementById("paypal-button-container").style.display = "block";

  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{ amount: { value: '10.00' } }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        const ticketId = 'TICKET-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        const qrData = `Ticket for ${name} (${email})\nTicket ID: ${ticketId}`;
        QRCode.toCanvas(document.getElementById('qr'), qrData);
        document.getElementById('download-btn').style.display = "inline-block";

        document.getElementById("download-btn").onclick = function() {
          const { jsPDF } = window.jspdf;
          const doc = new jsPDF();
          doc.setFontSize(16);
          doc.text("🎫 Show Ticket", 20, 20);
          doc.text("Name: " + name, 20, 35);
          doc.text("Email: " + email, 20, 45);
          doc.text("Ticket ID: " + ticketId, 20, 55);
          const qrCanvas = document.getElementById("qr");
          const imgData = qrCanvas.toDataURL("image/png");
          doc.addImage(imgData, 'PNG', 20, 65, 60, 60);
          doc.save("Your_Ticket.pdf");
        };
      });
    }
  }).render('#paypal-button-container');
});