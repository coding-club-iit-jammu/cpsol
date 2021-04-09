var search_box = document.getElementById('search-box')

const formatParams = (params) => {
    return "?" + Object
          .keys(params)
          .map(function(key){
            return key+"="+encodeURIComponent(params[key])
          })
          .join("&")
}

const search = () => {
    const search_result_div = document.getElementById('search-results')
    const search_term = search_box.value
    const url='/problems/search' + formatParams({"search_term" : search_term})
    fetch(url)
    .then(
        function(response) {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
            response.status);
            return;
        }

        // Examine the text in the response
        response.json().then(function(results) {
            
            search_result_div.innerHTML = ""
            results.forEach((result) => {
                search_result_div.innerHTML += formatSearchResult(result)
            })
        });
        }
    )
    .catch(function(err) {
        console.log('Fetch Error :-S', err);
    });

}
search_box.addEventListener("keyup", function (event) {
  
    // Checking if key pressed is ENTER or not
    // if the key pressed is ENTER
    // click listener on button is called
    if (event.keyCode == 13) {
        search()
    }
});

const formatSearchResult = (result) => {
    const search_result_template = `<div class = "search-result">
        <div class = "problem_title">
            ${result.title}
        </div>
        <div class = "problem_link">
            <a href = "${result.link}">${result.link}</a>
        </div>
        <div class = "solution_author">
            Solution by : ${result.email}
        </div>
        <div>
            <button class ="view-sol-button">View Solution</button>
        </div>
        </div>
    `
    return search_result_template
}
