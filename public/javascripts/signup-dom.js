const level = document.querySelector("#level");

// const notNovice = document.querySelectorAll(".not-novice");
let notNovice = document.querySelector(".not-novice");
level.onchange = () => {
  if (level.value === "novice") {
    notNovice.innerHTML = "";
  } else if (level.value === "intermediate" || level.value === "advanced") {
    notNovice.innerHTML = `<p>Incredible! Seeing that you are an ${level.value} developer:</p><label for="mentorship" class="not-novice">Are you open to becoming a mentor?</label> <br>
  <input type="radio" name="mentorship" class="not-novice" value="yes"> <span class="not-novice">Yes</span><br>
  <input type="radio" name="mentorship" class="not-novice" value="no"> <span class="not-novice">No </span><br><br>`;
  } else {
    notNovice.innerHTML = `<p>Incredible! Seeing that you are a ${level.value} developer:</p><label for="mentorship" class="not-novice" id="not-novice">Are you open to becoming a mentor?</label> <br>
  <input type="radio" name="mentorship" class="not-novice" value="yes"> <span class="not-novice">Yes</span><br>
  <input type="radio" name="mentorship" class="not-novice" value="no"> <span class="not-novice">No </span><br><br>`;
  }
};

const mentor = document.querySelector(".not-novice");
let thanks = document.querySelector(".thanks-mentor");

mentor.onchange = () => {
  if (mentor.value === "no") {
    thanks.innerHTML = "";
  } else
    thanks.innerHTML = `Thank you very much! Being a mentor is clearly something that we believe creates a win-win relationship :)`;
};
