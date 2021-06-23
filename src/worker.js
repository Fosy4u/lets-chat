//registering service worker

console.log("service worker loaded");

window.self.addEventListener("push", (e) => {
  const data = e.data.json();
  console.log("Push received....");
  window.self.registration.showNotification(data.title, {
    body: "Notified by Lets-Gist App",
  });
});
