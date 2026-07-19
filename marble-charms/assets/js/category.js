document.addEventListener("DOMContentLoaded", function () {
  var params = new URLSearchParams(window.location.search);
  var catId = params.get("cat");

  var head = document.getElementById("category-head");
  var breadcrumbCat = document.getElementById("breadcrumb-cat");
  var grid = document.getElementById("category-grid");

  fetch("products.json")
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var category = data.categories.find(function (c) { return c.id === catId; });

      if (!category) {
        head.innerHTML = "<h1>We couldn't find that category</h1><p>Try heading back to the shop.</p>";
        grid.innerHTML = "";
        return;
      }

      document.title = category.name + " — Marble Charms";
      breadcrumbCat.textContent = category.name;

      head.innerHTML =
        '<span class="eyebrow">' + category.icon + " " + category.name + "</span>" +
        "<h1>" + category.name + "</h1>" +
        "<p>" + category.tagline + "</p>";

      if (!category.products || category.products.length === 0) {
        grid.innerHTML = '<div class="empty-state">No charms here just yet — check back soon.</div>';
        return;
      }

      grid.innerHTML = category.products.map(function (p) {
        var img = p.images && p.images[0] ? p.images[0] : "";
        var priceHtml = '<span class="price">₹' + p.price + "</span>" +
          (p.compareAtPrice ? '<span class="compare">₹' + p.compareAtPrice + "</span>" : "");
        var stockBadge = p.inStock === false ? '<span class="out-of-stock">Made to order</span>' : "";

        return (
          '<article class="product-card">' +
            '<a class="card-link" href="product.html?cat=' + encodeURIComponent(category.id) + '&id=' + encodeURIComponent(p.id) + '">' +
              '<div class="thumb"><img src="' + img + '" alt="' + p.name + '" loading="lazy" onerror="this.closest(\'.thumb\').style.background=\'var(--pink-soft)\'; this.remove();"></div>' +
              "<h3>" + p.name + "</h3>" +
              '<div class="card-meta">' +
                priceHtml +
                '<span class="stars">' + renderStars(p.rating) + '<span class="count">(' + p.reviewCount + ")</span></span>" +
              "</div>" +
              stockBadge +
            "</a>" +
            '<a class="order-link" href="product.html?cat=' + encodeURIComponent(category.id) + '&id=' + encodeURIComponent(p.id) + '">View charm &rarr;</a>' +
          "</article>"
        );
      }).join("");
    })
    .catch(function (err) {
      console.error(err);
      grid.innerHTML = '<div class="empty-state">Something went wrong loading the shop. Please refresh.</div>';
    });
});