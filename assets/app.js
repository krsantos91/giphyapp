var giphySearch = {
	index:[],

	temp: "",

	contentIndex: 1,

	newSearch: function(event){
		$("#loadmore").empty();
		giphySearch.contentIndex = 1;
    	var newGif = $("#search-input").val().trim();
    	$("#search-input").val("")
    	if (giphySearch.index.indexOf(newGif) == -1){
       	 	giphySearch.index.push(newGif);
       	 	giphySearch.renderButtons();
 			var searchTerm = newGif;
			queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm +"&api_key=8925750c46774225a89d94feafb4b3b6&limit=25"
			var xhr = $.get(queryURL);
			xhr.done(function(response) { 
				$("#giphy-info").empty();
				var results = response.data;
				if (response.pagination.total_count === 0){
					var message = $("<div class='container-fluid'>");
					message.html("<h3>Your search returned 0 results, please try something else.</h3>")
					delete giphySearch.index[giphySearch.index.length-1];
					giphySearch.renderButtons();
					$("#giphy-info").append(message);
				}
				else{
					results.forEach(function(picture){
						var container = $("<div class='col-sm-4 animated zoomIn' style='margin-bottom:5px'>");
						var gifDiv = $("<div class='gif-container container btn'>");
						var rating = $("<div>").text("Rating: " + picture.rating.toUpperCase());
						gifDiv.attr("data-state","still")
						gifDiv.attr("data-still-url",picture.images.fixed_height_still.url);
						gifDiv.attr("data-animate-url",picture.images.fixed_height.url);
						gifDiv.css("background-image", "url('" + picture.images.fixed_height_still.url + "')")
						var bookmarkButton = $("<span class='btn btn-success bookmark'>");
						bookmarkButton.html('<i class="fa fa-bookmark" aria-hidden="true"></i></i><span> Bookmark</span>');
						bookmarkButton.attr("data-bookmark-url",picture.images.downsized.url);
						bookmarkButton.attr("data-url",picture.images.fixed_height.url);
						container.append(gifDiv).append(rating).append(bookmarkButton);
						$("#giphy-info").append(container);
					});
					var nextButton = $("<div class='btn btn-warning' id='nextbutton'>");
					nextButton.attr("data-info",newGif);
					nextButton.text("Load more");
					$("#loadmore").append(nextButton);	
				}		
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
		$("#loadmore").empty();
		$("#giphy-info").empty();
		giphySearch.contentIndex = 1;
		var searchTerm = $(event.currentTarget).attr("data-name");
		queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm +"&api_key=8925750c46774225a89d94feafb4b3b6&limit=25"
		var xhr = $.get(queryURL);
		xhr.done(function(response) { 
			var results = response.data;			
			results.forEach(function(picture){				
				var container = $("<div class='col-sm-4 animated zoomIn' style='margin-bottom:5px'>");
				var gifDiv = $("<div class='gif-container container btn'>");
				var rating = $("<div>").text("Rating: " + picture.rating.toUpperCase());
				gifDiv.attr("data-state","still")
				gifDiv.attr("data-still-url",picture.images.fixed_height_still.url);
				gifDiv.attr("data-animate-url",picture.images.fixed_height.url);
				gifDiv.css("background-image", "url('" + gifDiv.attr("data-still-url") + "')");
				var bookmarkButton = $("<div class='btn btn-success bookmark'>");
				bookmarkButton.html('<i class="fa fa-bookmark" aria-hidden="true"></i><span> Bookmark</span>');
				bookmarkButton.attr("data-bookmark-url",picture.images.downsized.url);
				bookmarkButton.attr("data-url",picture.images.fixed_height.url);
				container.append(gifDiv).append(rating).append(bookmarkButton)
				$("#giphy-info").append(container);
			});
			var nextButton = $("<div class='btn btn-warning' id='nextbutton'>");
			nextButton.attr("data-info", searchTerm);
			nextButton.text("Load more");
			$("#loadmore").append(nextButton);

        });
	},

	saveImage: function(event){
		$(event.currentTarget).addClass("animated fadeOutDown")
		var imageURL = $(event.currentTarget).attr("data-bookmark-url");
		var container = $("<div class='col-xs-4 col-sm-2 col-md-6 animated fadeInUp'>")	;
		var link = $("<a>");	
		link.attr("href", $(event.currentTarget).attr("data-url"));
		link.attr("target","_blank");
		var imageDiv = $("<div class='container'>");
		imageDiv.addClass("savedImages");
		imageDiv.css('background-image', 'url("'+ imageURL + '")');
		link.append(imageDiv)
		container.append(link)
		$("#saved").append(container);
	},

	animate: function(event){	
		var state = $(event.currentTarget).attr("data-state");
		var animate = $(event.currentTarget).attr("data-animate-url");
		var stop = $(event.currentTarget).attr("data-still-url");

		if (giphySearch.temp != "" && giphySearch.temp != stop ){
			$(".gif-container[data-still-url='" + giphySearch.temp + "']").css("background-image", "url('" + giphySearch.temp + "')");
			$(".gif-container[data-still-url='" + giphySearch.temp + "']").parent().removeClass("col-sm-8").addClass("col-sm-4");
			$(".gif-container[data-still-url='" + giphySearch.temp + "']").attr("data-state","still");
			$(".gif-container[data-still-url='" + giphySearch.temp + "']").animate({
				height: '200px',
				width: '100%'
			});	
			$(".gif-container[data-still-url='" + giphySearch.temp + "']").css("max-width","250px")					
		};

		if (state === "still"){		
			giphySearch.temp = stop;
			$(event.currentTarget).parent().removeClass("col-sm-4").addClass("col-sm-8");
			$(event.currentTarget).css("max-width","500px")
			$(event.currentTarget).css("background-image", "url('" + animate + "')");
			$(event.currentTarget).attr("data-state","animated" );
			$(event.currentTarget).animate({
				height: '390px',
				width: '430px'
			});

		}
		else{		
			$(event.currentTarget).parent().removeClass("col-sm-8").addClass("col-sm-4");
			$(event.currentTarget).css("max-width","250px")			
			$(event.currentTarget).css("background-image", "url('" + stop + "')");
			$(event.currentTarget).attr("data-state","still" );
			$(event.currentTarget).animate({
				height: '200px',
				width: '100%'
			});			
		}
	},

	addContent: function(searchterm){
		giphySearch.contentIndex++;
		$("#loadmore").empty();
		queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchterm +"&api_key=8925750c46774225a89d94feafb4b3b6&limit=25&offset=" + (25*giphySearch.contentIndex);
		var xhr = $.get(queryURL);
		xhr.done(function(response) { 
			var results = response.data;
			results.forEach(function(picture){
				var container = $("<div class='col-sm-4 animated zoomIn' style='margin-bottom:5px'>");
				var gifDiv = $("<div class='gif-container container btn'>");
				var rating = $("<div>").text("Rating: " + picture.rating.toUpperCase());
				gifDiv.attr("data-state","still")
				gifDiv.attr("data-still-url",picture.images.fixed_height_still.url);
				gifDiv.attr("data-animate-url",picture.images.fixed_height.url);
				gifDiv.css("background-image", "url('" + gifDiv.attr("data-still-url") + "')");
				var bookmarkButton = $("<div class='btn btn-success bookmark'>");
				bookmarkButton.html('<i class="fa fa-bookmark" aria-hidden="true"></i><span> Bookmark</span>');
				bookmarkButton.attr("data-bookmark-url",picture.images.downsized.url);
				bookmarkButton.attr("data-url",picture.images.fixed_height.url);
				container.append(gifDiv).append(rating).append(bookmarkButton)
				$("#giphy-info").append(container);
			});
			var nextButton = $("<div class='btn btn-warning' id='nextbutton'>");
			nextButton.attr("data-info", searchterm);
			nextButton.text("Load more");
			$("#loadmore").append(nextButton);		
		});
	}

};


$("#add-gif").on("click", function(e){
	giphySearch.newSearch(e);
});

$(document).on("click","[data-name]", function(e){
	giphySearch.api(e);
});

$(document).on("click",".bookmark",function(e){
	giphySearch.saveImage(e);
});

$(document).on("click",".gif-container",function(e){
	giphySearch.animate(e);
})

$(document).on("click","#nextbutton",function(e){
	giphySearch.addContent($(this).attr("data-info"));
})

$(document).on("click","#bookmarktrash",function(){
	$("#saved").empty();
})

