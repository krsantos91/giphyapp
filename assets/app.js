var giphySearch = {
	index:[],

	newSearch: function(event){
		event.preventDefault();
		$("#search-input").empty()
		console.log("is this working");
    	var newGif = $("#search-input").val().trim();
    	console.log(newGif);
    	if (giphySearch.index.indexOf(newGif) == -1){
       	 	giphySearch.index.push(newGif);
       	 	giphySearch.renderButtons();
 			var searchTerm = newGif;
			queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm +"&api_key=8925750c46774225a89d94feafb4b3b6&limit=25"
			var xhr = $.get(queryURL);
			xhr.done(function(response) { 
				$("#giphy-info").empty();
				var results = response.data;
				results.forEach(function(picture){
					var container = $("<div class='col-sm-4 animated zoomIn' style='margin-bottom:5px'>");
					var gifDiv = $("<div class='gif container'>");
					var rating = $("<span style='margin-right:5px'>").text("Rating: " + picture.rating);
					gifDiv.css("background-image", "url('" + picture.images.fixed_height_still.url + "')")
					var saveButton = $("<span class='btn btn-success savebutton'>");
					saveButton.html('<i class="fa fa-arrow-circle-o-down" aria-hidden="true"></i>');
					saveButton.attr("data-url",picture.images.downsized.url);
					container.append(gifDiv).append(rating).append(saveButton)
					$("#giphy-info").append(container);
				});
			});
		};
	},

	renderButtons: function(){
		$("#button-container").empty();
		giphySearch.index.forEach(function(index){
			var button = $("<div>");
			button.addClass("btn btn-primary");
			button.attr("data-name",index);
			button.attr("style", "margin: 0 2px")
			button.text(index)
			$("#button-container").append(button);
		});
	},

	api: function(event){
		$("#giphy-info").empty();
		var searchTerm = $(event.currentTarget).attr("data-name");
		queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm +"&api_key=8925750c46774225a89d94feafb4b3b6&limit=25"
		var xhr = $.get(queryURL);
		xhr.done(function(response) { 
			var results = response.data;
			results.forEach(function(picture){
				var container = $("<div class='col-sm-4 animated zoomIn' style='margin-bottom:5px'>");				var gifDiv = $("<div class='gif container'>");
				var rating = $("<span style='margin-right:5px'>").text("Rating: " + picture.rating);
				gifDiv.css("background-image", "url('" + picture.images.fixed_height_still.url + "')")
				var saveButton = $("<div class='btn btn-success savebutton'>");
				saveButton.html('<i class="fa fa-arrow-circle-o-down" aria-hidden="true"></i>');
				saveButton.attr("data-url",picture.images.downsized.url);
				container.append(gifDiv).append(rating).append(saveButton)
				$("#giphy-info").append(container);

			});
        });
	},

	saveImage: function(event){
		var imageURL = $(event.currentTarget).attr("data-url");
		var container = $("<div class='col-xs-4 col-sm-2 col-md-6 animated fadeInRight'>")		
		var imageDiv = $("<div class='container'>");
		imageDiv.addClass("savedImages");
		imageDiv.css('background-image', 'url("'+ imageURL + '")');
		container.append(imageDiv)
		$("#saved").append(container);
	}
};


$("#add-gif").on("click", function(e){
	giphySearch.newSearch(e);
});

$(document).on("click","[data-name]", function(e){
	giphySearch.api(e);
});

$(document).on("click",".savebutton",function(e){
	giphySearch.saveImage(e);
});
