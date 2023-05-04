signup_cl = {
    hUserExists : null,
    hDivUserExists : null,
    hLabelUserExists : null,

    init : () => {
        signup_cl.hUserExists = document.getElementById("UserExists");
        signup_cl.hDivUserExists = document.getElementById("DivUserExists");
        signup_cl.hLabelUserExists = document.getElementById("LabelUserExists");

        if (signup_cl.hUserExists.value == 1) {
            signup_cl.hDivUserExists.style.display = 'block';
            signup_cl.hLabelUserExists.style.display = 'inline';
            signup_cl.hLabelUserExists.style.color = '#d73a3a';
        }
        else {
            signup_cl.hDivUserExists.style.display = 'none';
            signup_cl.hLabelUserExists.style.display = 'none';
        }
    }
}
window.onload = signup_cl.init;