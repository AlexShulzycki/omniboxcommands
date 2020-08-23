browser.omnibox.setDefaultSuggestion({
    description: "Commands!"
})

var commands = browser.storage.local.get(["commands"]);

//lets do some sneaky testing
commands =
    [
        {
            "keyword": "google",
            "delimiter" : " ",
            "url": "duckduckgo.com/?q=$"
        },
        {

        }
    ];

function parseURL(input){
    let keyword = input.split(" ")[0];

    //Check if command exists
    commands.forEach((object) => {
        if(object.keyword == keyword){

            //Got the correct object!
            return getURLfromCommand(input.substring(keyword.length), object);
        }
    })
}


function getURLfromCommand(input, command){
    let delimiter = command.delimiter;
    let inputs = input.split(delimiter);
    let keyword = inputs[0];
    if(command.subcommands != undefined) {
        if (command.subcommands.contains(keyword)) {
            //Recurse down the chain
            return getURLfromCommand(input.substring(keyword.length), command.subcommands.get(keyword));
        } else {
            //Failure, invalid command
            return;
        }
    }else {
        // Does not have subcommands

        //Do the job
        let url = command.url;

        //iterate over and replace dollars with arguments (.replace only looks for first occurrence, unless its regex)
        for (let i = 1; i < inputs.length; i++) {
            url.replace("$", inputs[i]);
        }
        return url;
    }
}


//Execute commands

browser.omnibox.onInputEntered.addListener((url, disposition) =>
{
    console.log("weeds");
    browser.tabs.update(parseURL({url: "google.com"}));
});
