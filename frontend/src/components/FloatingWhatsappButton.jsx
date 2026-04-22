function FloatingWhatsAppButton() {
  const whatsappNumber = "2567XXXXXXXX"; // replace with your real number
  const whatsappMessage = "Hello, I would like to inquire about products on Kubiz Market Place.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-full shadow-lg hover:bg-green-600 transition z-50 font-semibold"
    >
      WhatsApp
    </a>
  );
}

export default FloatingWhatsAppButton;