function setUpClicks(clickHandler) {
  document.getElementById("board").addEventListener("load", () => {
    const svg = document.getElementById("board").getSVGDocument();
    let dots = svg.getElementsByTagName('ellipse');
    for (var i = 0; i < dots.length; i++) {
      if (dots[i] != null) {
        dots[i].removeEventListener("click", clickHandler);
        dots[i].addEventListener("click", (e) => {
          clickHandler(e.target);
        });
      }
    }
  });
}

export { setUpClicks };
