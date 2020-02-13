function openPage(page) {
  var x = document.getElementsByClassName("page");
  for (var i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(page).style.display = "block";

  var x = document.getElementsByClassName("tab");
  for (var i = 0; i < x.length; i++) {
    x[i].style.fontWeight = "normal";
  }
  document.getElementById(`${page}-tab`).style.fontWeight = "bold";
}