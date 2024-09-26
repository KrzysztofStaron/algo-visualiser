const lambda = () => {
  let data = JSON.parse(localStorage.getItem("problemListData") || "{}");
  console.log("hell yeah");

  const links = document.querySelectorAll("a.h-5.hover\\:text-blue-s.dark\\:hover\\:text-dark-blue-s");

  links.forEach(link => {
    const content = link.innerHTML.split(".");
    const key = content[0].trim();
    const value = {
      href: link.href,
      text: content[1]?.trim() || "",
    };

    data[key] = value;
  });

  // Safely store the updated data back to localStorage
  try {
    localStorage.setItem("problemListData", JSON.stringify(data));
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
  }

  const clickNextButton = () => {
    const nav = document.querySelectorAll(
      "button.flex.items-center.justify-center.px-3.h-8.rounded.select-none.focus\\:outline-none.bg-fill-3.dark\\:bg-dark-fill-3.text-label-2.dark\\:text-dark-label-2.hover\\:bg-fill-2.dark\\:hover\\:bg-dark-fill-2"
    );

    const button = nav.item(nav.length - 1);
    if (button) {
      button.click(); // Click the button if it is found
    } else {
      console.log("Button not found.");
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  let page = parseInt(urlParams.get("page") || "1", 10); // Get the current page number
  if (page < 66) {
    clickNextButton();
  } else {
    clearInterval(lambdaInterval); // Stop the interval after the last page
  }
};

// Start the interval after the lambda function is defined
var lambdaInterval = setInterval(lambda, 5000);
