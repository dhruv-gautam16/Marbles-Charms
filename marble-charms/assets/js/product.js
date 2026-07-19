document.addEventListener("DOMContentLoaded", function () {
  var params = new URLSearchParams(window.location.search);
  var catId = params.get("cat");
  var productId = params.get("id");

  var breadcrumbCat = document.getElementById("breadcrumb-cat");
  var breadcrumbCatLink = document.getElementById("breadcrumb-cat-link");
  var wrap = document.getElementById("product-wrap");

  fetch("products.json")
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var category = data.categories.find(function (c) { return c.id === catId; });
      var product = category && category.products.find(function (p) { return p.id === productId; });

      if (!category || !product) {
        wrap.innerHTML = "<div class=\"empty-state\"><h1>We couldn't find that charm</h1><p>It may have sold out or moved. <a href=\"index.html\">Back to the shop</a></p></div>";
        return;
      }

      document.title = product.name + " — Marble Charms";
      breadcrumbCat.textContent = category.name;
      breadcrumbCatLink.href = "category.html?cat=" + encodeURIComponent(category.id);

      var images = product.images && product.images.length ? product.images : [];

      var thumbsHtml = images.map(function (src, i) {
        return '<button class="thumb-btn' + (i === 0 ? " active" : "") + '" data-src="' + src + '" aria-label="Show image ' + (i + 1) + '">' +
          '<img src="' + src + '" alt="' + product.name + " view " + (i + 1) + '" loading="lazy">' +
        "</button>";
      }).join("");

      var priceHtml = '<span class="price">₹' + product.price + "</span>" +
        (product.compareAtPrice ? '<span class="compare">₹' + product.compareAtPrice + "</span>" : "");

      var stockBadge = product.inStock === false ? '<span class="out-of-stock">Made to order</span><br>' : "";

      var reviews = product.reviews || [];
      var reviewsHtml = reviews.length
        ? reviews.map(function (r) {
            return (
              '<div class="review-card">' +
                '<div class="review-top">' +
                  '<span class="reviewer">' + r.name + "</span>" +
                  '<span class="stars">' + renderStars(r.rating) + "</span>" +
                "</div>" +
                '<div class="review-date">' + r.date + "</div>" +
                "<p>" + r.text + "</p>" +
              "</div>"
            );
          }).join("")
        : '<p style="opacity:0.7;">No reviews yet — be the first to order and let us know what you think!</p>';

      wrap.innerHTML =
        '<div class="product-detail">' +
          '<div class="gallery">' +
            '<div class="main-image"><img id="main-image" src="' + (images[0] || "") + '" alt="' + product.name + '"></div>' +
            '<div class="thumbs">' + thumbsHtml + "</div>" +
          "</div>" +
          '<div class="product-info">' +
            '<span class="eyebrow">' + category.name + "</span>" +
            stockBadge +
            "<h1>" + product.name + "</h1>" +
            '<div class="rating-row">' +
              '<span class="stars">' + renderStars(product.rating) + '<span class="count">' + product.rating + " · " + product.reviewCount + " review" + (product.reviewCount === 1 ? "" : "s") + "</span></span>" +
            "</div>" +
            '<div class="price-row">' + priceHtml + "</div>" +
            '<div class="desc"><p>' + product.description + "</p></div>" +
            '<a class="wa-btn" id="product-wa" href="#" target="_blank" rel="noopener">' +
              '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.4c.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5-.1-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z"/><path d="M12 2C6.5 2 2 6.4 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.9-1.3c1.5.8 3.3 1.2 5.1 1.2 5.5 0 10-4.4 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3.2-.4-4.5-1.2l-.3-.2-3 .8.8-2.9-.2-.3C4 15.1 3.6 13.6 3.6 12 3.6 7.3 7.4 3.6 12 3.6s8.4 3.8 8.4 8.4-3.8 8.2-8.4 8.2z"/></svg>' +
              "Order on WhatsApp" +
            "</a>" +
            '<p class="note">Tapping this opens WhatsApp with your order pre-filled, so you can add colours or notes before sending.</p>' +
          "</div>" +
        "</div>" +
        '<div class="reviews">' +
          "<h2>Reviews</h2>" +
          '<div class="summary"><span class="big-rating">' + product.rating + "</span><span class=\"stars\">" + renderStars(product.rating) + '<span class="count">Based on ' + product.reviewCount + " review" + (product.reviewCount === 1 ? "" : "s") + "</span></span></div>" +
          '<div class="review-list">' + reviewsHtml + "</div>" +
        "</div>";

      // Wire the order button now that it exists in the DOM
      var waBtn = document.getElementById("product-wa");
      waBtn.href = buildWaLink(buildProductMessage(product));

      // Gallery thumbnail switching
      var mainImage = document.getElementById("main-image");
      document.querySelectorAll(".thumb-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          mainImage.src = btn.getAttribute("data-src");
          document.querySelectorAll(".thumb-btn").forEach(function (b) { b.classList.remove("active"); });
          btn.classList.add("active");
        });
      });
    })
    .catch(function (err) {
      console.error(err);
      wrap.innerHTML = '<div class="empty-state">Something went wrong loading this charm. Please refresh.</div>';
    });
});