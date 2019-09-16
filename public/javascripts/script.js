document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("IronGenerator JS imported successfully!");
  },
  false
);

const level = document.querySelector("#level");

// const notNovice = document.querySelectorAll(".not-novice");
let notNovice = document.querySelector(".not-novice");
console.log(notNovice);
level.onchange = () => {
  if (level.value === "novice") {
    notNovice.innerHTML = "";
  } else if (level.value !== "novice") {
    notNovice.innerHTML = `<label for="mentorship" class="not-novice">Open to becoming a mentor?</label> <br>
  <input type="radio" name="mentorship" class="not-novice" value="yes"> <span class="not-novice">Yes</span><br>
  <input type="radio" name="mentorship" class="not-novice" value="no"> <span class="not-novice">No </span><br><br>`;
  }
};
