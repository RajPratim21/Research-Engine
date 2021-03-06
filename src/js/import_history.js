document.getElementById('checkbox_history').addEventListener("click", function(){
    var checkbox = document.getElementById('checkbox_history').checked;
    if(checkbox == true){
        localStorage.setItem('checkbox_history',true);
    }
    else {
        localStorage.setItem('checkbox_history',false);
    }
    ;})

function importHistory(){
        chrome.history.search({'text': '','maxResults': 200000, 'startTime':0 }, function(history) {
        var history_items = new Array(); 

        //create list of already downloaded urls, if not exists
        if (localStorage.getItem('list_downloaded_urls')==null){
                localStorage['list_downloaded_urls'] = JSON.stringify(['','']);
        };

        //adding all urls that are new to the list of urls to be downloaded
        var existing_urls = JSON.parse(localStorage['list_downloaded_urls']);    
        for (var i = 0; i < history.length ; i++) { 

            var archive = shouldArchive(history[i])

            if (existing_urls.indexOf(history[i].url) > -1 || archive == false) {
                continue;
                }
            else {
                var item = {
                    url: history[i].url,
                    lastVisitTime: new Date(history[i].lastVisitTime).getTime()
                }
                history_items.push(item);    
                //console.log(item) 
            }  
            

        }
        console.log("TOTAL ITEMS IN HISTORY:" + history_items.length)    
        chrome.storage.local.set({history: JSON.stringify(history_items)});
        localStorage.setItem('number_urls',history_items.length)


    //adding amount, time and size estimation to analyse_urls.html
    document.getElementById("amount_urls").innerHTML = history_items.length
    document.getElementById("size_urls").innerHTML = Math.ceil(history_items.length * 15 / 1000)  //15kB and /1000 to convert it into MB
    document.getElementById("time_to_download").innerHTML = Math.ceil(history_items.length * 1.5 / 3600) // 1.5 seconds per download /3600 to calculate in hours

  })};



//onpageload start request to chrome history api
document.body.onload = importHistory();
