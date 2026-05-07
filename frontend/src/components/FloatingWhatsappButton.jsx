import { MessageCircle } from "lucide-react";

function FloatingWhatsAppButton() {
  const whatsappNumber = "2567XXXXXXXX";

  const whatsappMessage =
    "Hello, I would like to inquire about products on Kubiz Market Place.";

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-full shadow-xl hover:bg-green-600 hover:-translate-y-1 transition z-50 font-bold flex items-center gap-2"
    >
      <MessageCircle size={18} />
      WhatsApp
    </a>
  );
}

export default FloatingWhatsAppButton;