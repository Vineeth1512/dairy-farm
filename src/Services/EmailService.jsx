import emailjs from "emailjs-com";

export const sendOrderConfirmationEmail = (userData, orderData) => {
  const templateParams = {
    user_name: userData.user.displayName,
    user_email: userData.user.email,
    order_id: Date.now(),
    order_date: new Date().toLocaleString(),
    delivery_address: orderData.address,
    payment_method: orderData.paymentMethod,
    order_items: orderData.items
      .map((item) => `${item.name || item.breed} x ${item.quantity}`)
      .join(", "),
    order_total: orderData.total,
    order_gst: orderData.gst,
  };

  console.log("Sending Email with params:", templateParams);

  return emailjs.send(
    "service_zvf2vm8", // emailservice key
    "template_ymj4c3h", // templates key
    templateParams,
    "QAvyvShmeHIuZArrw" //public key
  );
};
