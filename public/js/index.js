function onSubmitButtonClicked() {
    var textdata =  document.getElementById("textdocument").value;
    if (textdata.replace(/\s/g, "").length === 0) 
        sweetAlert("Oops...", "Your text document is empty !!!", "error");
    else {

    }
}