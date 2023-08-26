document.addEventListener("DOMContentLoaded", function () {
  const applyButton = document.getElementById("applyButton");
  const purchaseButton = document.getElementById("purchaseButton");

  let totalAmount = 0;
  let totalDiscount = 0;

  function updateButtonStates(totalAmount, totalDiscount) {
    if (totalAmount === 0) {
      purchaseButton.disabled = true;
      applyButton.disabled = true;
    } else {
      applyButton.disabled = totalAmount < 200;
      purchaseButton.disabled = false;
    }

    const totalPriceElement = document.getElementById("totalPrice");
    const totalDiscountElement = document.getElementById("totalDiscount");
    const finalTotalElement = document.getElementById("finalTotal");

    totalPriceElement.textContent = `${totalAmount.toFixed(2)} TK`;
    totalDiscountElement.textContent = `${totalDiscount.toFixed(2)} TK`;
    finalTotalElement.textContent = `${(totalAmount - totalDiscount).toFixed(
      2
    )} TK`;
  }

  const productCards = document.querySelectorAll(".card-body");
  const selectedProductsContainer = document.querySelector(".selectedProducts");

  let selectedProductCount = 0;

  function updateTotalAmountAndDiscount(selected, productPrice) {
    if (selected) {
      totalAmount += productPrice;
    } else {
      totalAmount -= productPrice;
      if (totalAmount < 200) {
        totalDiscount = 0;
      }
    }
    updateButtonStates(totalAmount, totalDiscount);
  }

  productCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.classList.contains("mask-star-2")) {
        event.stopPropagation();
      } else {
        const productName = card.querySelector(".font-medium").textContent;
        const productPriceElement = card.querySelector(".moneyAmount");
        const productPrice = parseFloat(
          productPriceElement.textContent.replace(" TK", "")
        );

        const isSelected = card.classList.contains("selected");

        updateTotalAmountAndDiscount(!isSelected, productPrice);

        if (isSelected) {
          card.classList.remove("selected");
          const selectedProduct = selectedProductsContainer.querySelector(
            `.selected-product[data-name="${productName}"]`
          );
          if (selectedProduct) {
            selectedProductsContainer.removeChild(selectedProduct);
            selectedProductCount--;
            updateSelectedProductNumbers();
          }
        } else {
          card.classList.add("selected");
          const selectedProductElement = document.createElement("div");
          selectedProductElement.classList.add("selected-product");
          selectedProductElement.setAttribute("data-name", productName);
          selectedProductElement.setAttribute("data-price", productPrice);
          selectedProductCount++;
          selectedProductElement.innerHTML = `
            <span class="selected-product-name" style="font-weight: bold; font-size: 1.2em;">${selectedProductCount}. ${productName}</span>
            <span class="selected-product-price">- <span style="color: red;">${productPrice.toFixed(
              2
            )} TK</span></span>
          `;
          selectedProductsContainer.appendChild(selectedProductElement);
          updateSelectedProductNumbers();
        }
      }
    });
  });

  function updateSelectedProductNumbers() {
    const selectedProductElements =
      selectedProductsContainer.querySelectorAll(".selected-product");
    selectedProductElements.forEach((element, index) => {
      const productName = element.getAttribute("data-name");
      const productPrice = parseFloat(
        element.getAttribute("data-price")
      ).toFixed(2);
      element.innerHTML = `
        <span class="selected-product-name" style="font-weight: bold;">${
          index + 1
        }. ${productName}</span>
        <span class="selected-product-price">- <span style="color: red;">${productPrice} TK</span></span>
      `;
    });
  }

  applyButton.addEventListener("click", () => {
    const couponCode = document.getElementById("couponCode").value;
    if (totalAmount >= 200 && couponCode === "SELL200") {
      const couponDiscount = totalAmount * 0.2;
      totalDiscount += couponDiscount;

      updateButtonStates(totalAmount, totalDiscount);
    } else {
      alert("Invalid coupon");
    }
  });

  function resetCheckout() {
    totalAmount = 0;
    totalDiscount = 0;
    updateButtonStates(totalAmount, totalDiscount);

    selectedProductsContainer.innerHTML = "";
    document.getElementById("couponCode").value = "";

    productCards.forEach((card) => {
      card.classList.remove("selected");
    });
  }

  document
    .getElementById("purchaseButtonModal")
    .addEventListener("click", () => {
      resetCheckout();
      my_modal_5.close();
    });

  updateButtonStates(totalAmount, totalDiscount);
});
