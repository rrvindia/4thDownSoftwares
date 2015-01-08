//this custom filter returns list of users searched by first name, last name and role 
mainModule.filter('userFilter', function() {
    return function (items, letter) {
        var filtered = [];
        if(items !== undefined){
            var letterMatch = new RegExp(letter, 'i');
            for (var i = 0; i < items.length; i++) {
                  var item = items[i];
                  if (letterMatch.test(item.first +" "+ item.last +" "+ item.role)) {
                    filtered.push(item);
                  }
            }
        }
        if(filtered.length>0){
            $(".Complete_profile_deatils").show();
            $("#divSelectContact").hide();
        }
        else{
            $("#divSelectContact").show();
            $(".Complete_profile_deatils").hide();
        }

        return filtered;
  };
});