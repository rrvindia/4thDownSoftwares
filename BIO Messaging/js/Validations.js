function numbersonly(key) {
    var keycode = (key.which) ? key.which : key.keyCode;

    //comparing pressed keycodes
    if ((keycode >= 96 && keycode <= 105) || keycode == 16 || keycode == 9 || keycode == 46 || keycode == 37 || keycode == 39 || keycode == 35 || keycode == 36) {
        return true;
    }
    else {
        if (!(keycode == 8 || keycode == 46 || keycode == 189 || keycode == 9) && (keycode < 48 || keycode > 57) && (keycode < 97 || keycode > 122)) {
            return false;
        }
        else {
            return true;
        }
    }
}
function RestrictSpecialChar(e) {
    //get the keycode when the user pressed any key in application 
    var exp = String.fromCharCode(window.event.keyCode)
    //Below line will have the special characters that is not allowed you can add if you want more for some characters you need to add escape sequence 
    var r = new RegExp("[-_,/'().0-9a-zA-Z \r]", "g");
    if (exp.match(r) == null) {
        window.event.keyCode = 0
        return false;
    }
    var keynum;
    var keychar
    if (window.event) {
        keynum = e.keyCode
    }
    else if (e.which) {
        keynum = e.which
    }
    keychar = String.fromCharCode(keynum)
    //List of special characters you want to restrict   
    if (keychar == "'" || keychar == "(" || keychar == ")" || keychar == "-" || keychar == "," || keychar == "." || keychar == "/") {
        return false;
    }
    else {
        return true;
    }
    //            else {
    //                return isAlphaNumeric(window.event.keyCode);
    //            }
}
function restrictspecialchars(key) {
    if (!key.shiftKey)
        return true;
    else
        return false;
}
function stringonly(key) {
    var keycode = (key.which) ? key.which : key.keyCode
    //comparing pressed keycodes
    if ((keycode >= 65 && keycode <= 90) || keycode == 32 || keycode == 8 || keycode == 9 || keycode == 35 || keycode == 36 || keycode == 37 || keycode == 39 || keycode == 46) {
        return true;
    }
    else {
        return false;
    }
}
function validatePostal(obj) {
    var elementValue = obj.value;
    var postalPattern = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    var flag = Boolean();
    flag = postalPattern.test(elementValue);
    if (flag) {
        $(".postalvalidation").hide();
        return true;
    }
    else {
        $(".postalvalidation").show();
        return false;
    }
}
function validatePhoneNumber() {
    var elementValue = document.getElementById("Phone").value;
    var phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    var flag = Boolean();
    flag = phoneNumberPattern.test(elementValue);
    if (flag) {
        $("#phonevalidation").hide();
        return true;
    }
    else {
        $("#phonevalidation").show();
        return false;
    }
}
// Allow Only Numbers
function isNumber(evt) {

    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

// function to get the decimal values only
function validateDecimal(event) {
    // var value = document.getElementById("txtDimLength").value;
    var value = $(event).val();
    var message = "Please enter a decimal value";
    if (isNaN(value) == true) {
        alert(message);
        $(event).focus();
        $(event).val('');
        //document.getElementById("event").select();
        return false;
    } else {
        return true;
    }
}
// function to check file extension

function checkextension(filename) {

    var extensionList = new Array(".jpg", ".JPG", ".gif", ".GIF", ".png", ".PNG", ".jpeg", ".JPEG");
    //Get Selected file extension
    var extension = filename.slice(filename.lastIndexOf(".")).toLowerCase();
    //Check file extension with your required extension list.
    for (var i = 0; i < extensionList.length; i++) {
        if (extensionList[i] == extension)
            flagtest == true;
        return true;
    }
    alert("You can only upload an Image File Type i.e.\n" + extensionList.join(" or\n"));
    ctrlUpload.value = '';
    ctrlUpload.focus();
    flagtest == false;
    return false;
}