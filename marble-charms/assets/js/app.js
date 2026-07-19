// ---- Shared config & helpers used across every page ----
var WHATSAPP_NUMBER = "919741531531"; // +91 97415 31531, digits only with country code
var DEFAULT_MESSAGE = "Hi Marble Charms! ✨ I'd love to order a charm.";

function buildWaLink(message){
  var msg = message || DEFAULT_MESSAGE;
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
}

// Build a WhatsApp message for a specific product
function buildProductMessage(product){
  var price = product && product.price ? " (₹" + product.price + ")" : "";
  var name = product ? product.name : "charm";
  return "Hi Marble Charms! ✨ I'd love to order the " + name + price + ".";
}

function renderStars(rating){
  rating = Math.round((rating || 0) * 2) / 2; // nearest half
  var full = Math.floor(rating);
  var half = rating - full === 0.5;
  var empty = 5 - full - (half ? 1 : 0);
  return "★".repeat(full) + (half ? "☆" : "") + "✩".repeat(Math.max(empty, 0));
}

document.addEventListener("DOMContentLoaded", function(){
  // Default WhatsApp links for any generic chat buttons on the page
  ["nav-wa", "hero-wa", "order-wa", "float-wa", "foot-wa"].forEach(function(id){
    var el = document.getElementById(id);
    if (el) el.href = buildWaLink();
  });

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  var toggle = document.getElementById("menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", function(){
      var links = document.querySelector("nav.links");
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      links.style.display = expanded ? "none" : "flex";
      links.style.flexDirection = "column";
      links.style.position = "absolute";
      links.style.top = "64px";
      links.style.right = "24px";
      links.style.background = "#FFF9F6";
      links.style.padding = "16px 22px";
      links.style.borderRadius = "16px";
      links.style.boxShadow = "0 10px 30px rgba(139,46,77,0.12)";
      links.style.gap = "14px";
    });
  }
});