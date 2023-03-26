let serieFindedDivs = document.getElementsByClassName("serieFinded")
let originalSerieID = window.location.href.split("/")[4]
let realName = document.getElementById("realName").innerHTML
let libraryName = document.getElementById("library").innerHTML
for (let i = 0; i < serieFindedDivs.length; i++) {
    let serieFindedDiv = serieFindedDivs[i]
    serieFindedDiv.addEventListener("click", function() {
        let serieID = serieFindedDiv.id
        let form = document.createElement("form");
        form.method = "POST";
        form.action = `/editSerie/${realName}/${libraryName}`;
        let input = document.createElement("input");
        input.type = "hidden";
        input.name = "newSerieID";
        input.value = `${serieID}`;
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
    })
}

let customIDButton = document.getElementById("customSerieButton")
customIDButton.addEventListener("click", function() {
    let serieID = document.getElementById("serieID").value
    let form = document.createElement("form");
    form.method = "POST";
    form.action = `/editSerie/${realName}/${libraryName}`;
    let input = document.createElement("input");
    input.type = "hidden";
    input.name = "newSerieID";
    input.value = `${serieID}`;
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
})