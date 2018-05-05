// Event Listener
document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        window.addEventListener('message', function(event) {

            // Character Menu
            if (event.data.type == "enable_character_menu") {

                var new_chars = SortCharacters(event.data.chars);
                CharacterMenu.characters = new_chars;
                CharacterMenu.showMenu = true;

            } else if (event.data.type == "update_character_menu_models") {

                CharacterMenu.models = event.data.ped_models;

            } else if (event.data.type == "create_character_menu_callback") {

                if  (event.data.status) {

                    var new_chars = SortCharacters(event.data.chars)
                    CharacterMenu.showLoading = false;
                    CharacterMenu.showError = false;
                    CharacterMenu.errorMessage = "";
                    CharacterMenu.ShowCreator();
                    CharacterMenu.characters = new_chars;

                } else {

                    CharacterMenu.showLoading = false;
                    CharacterMenu.showError = true;
                    CharacterMenu.errorMessage = event.data.error;

                }
            } else if (event.data.type == "delete_character_menu_callback") {

                var new_chars = SortCharacters(event.data.chars)
                CharacterMenu.showLoading = false;
                CharacterMenu.characters = new_chars;
                CharacterMenu.showLoading = false;

            }
        });
    }
}

function SortCharacters(char_list) {
    var new_chars = [];
    for (var a = 0; a < char_list.length; a++) {
        new_chars.push({
            id: char_list[a].id,
            name: char_list[a].name,
            dob: char_list[a].dob,
            age: Interface.Helpers.GetAge(char_list[a].dob),
            gender: char_list[a].gender,
            model: char_list[a].model,
            bank: char_list[a].bank
        })
    }
    return new_chars;
}