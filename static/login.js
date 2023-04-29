login = {
    hIncorrect : null,
    hDivIncorrect : null,
    hLabelIncorrect : null,

    init : () => {
        login.hIncorrect = document.getElementById("Incorrect");
        login.hDivIncorrect = document.getElementById("DivIncorrect");
        login.hLabelIncorrect = document.getElementById("LabelIncorrect");

        if (login.hIncorrect.value == 1) {
            login.hDivIncorrect.style.display = 'block';
            login.hLabelIncorrect.style.display = 'inline';
            login.hLabelIncorrect.style.color = '#d73a3a';
        }
        else {
            login.hDivIncorrect.style.display = 'none';
            login.hLabelIncorrect.style.display = 'none';
        }
    }
}
window.onload = login.init;