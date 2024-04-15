$(document).ready(function(){
    // Initialize Background Image Slider
    $('.hero .slick-slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      dots: false,
      arrows: false,
      fade: true,
      cssEase: 'linear',
      infinite: true,
      speed: 500,
      pauseOnHover: false
    });

    $('.hero .slick-slider1').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        dots: true,
        arrows: false,
        fade: true,
        cssEase: 'linear',
        infinite: true,
        speed: 500,
        pauseOnHover: false
      });
  
   
  });

  (function() {
    // Function to make the API call
    function makeAPICall() {
        var user = $('#username').val();
        var pass = $('#password').val();
        $.ajax({
            url: 'http://localhost:3000/login', // Replace 'https://api.example.com/data' with your API endpoint
            method: 'POST', // Change method to 'POST'
            dataType: 'json', // Change the dataType according to your API response format
            contentType: 'application/json', // Set content type to JSON
            data: JSON.stringify({ // Convert the data object to JSON string
                username: user,
                password: pass
            }),
            success: function(response) {
                // Handle the successful API response here
                console.log('API response:', response);
                console.log(response.access_key);
                localStorage.setItem('access_key', response.access_key);
                var userass = JSON.stringify(response.user_assets);
                console.log(userass);
                localStorage.setItem('user_assets', userass);
                window.location.href = "home.html";
            },
            error: function(xhr, status, error) {
                // Handle errors here
                console.error('API error:', error);
            }
        });
    }

    function makeAmakeAPICallsubPICall() {
        var assettype = $('#asset').val();
        var assetid = $('#assetId').val();
        var rssn = $('#receiverSsn').val();
        console.log("asset type: ", assettype);
        $.ajax({
            url: 'http://localhost:3000/transferasset', // Replace 'https://api.example.com/data' with your API endpoint
            method: 'POST', // Change method to 'POST'
            dataType: 'json', // Change the dataType according to your API response format
            contentType: 'application/json', // Set content type to JSON
            data: JSON.stringify({ // Convert the data object to JSON string
                asset_type: assettype,
                asset_id: assetid,
                buyer_ssn: rssn,
            }),
            success: function(response) {
                // Handle the successful API response here
                console.log('API response:', response);
                alert("Transfer Asset Successful");
            },
            error: function(xhr, status, error) {
                // Handle errors here
                console.error('API error:', error);
            }
        });
    }

    // Call the function
    //makeAPICall();
    $('#loginForm').submit(function(event){
        event.preventDefault();
        event.stopPropagation();
        // Add your form submission logic here
        console.log('Trade submitted!');
        makeAPICall();
        //window.location.href = "home.html";
      });

    
      $('#tradeForm').submit(function(event){
        event.preventDefault();
        event.stopPropagation();
        // Add your form submission logic here
        console.log('Trade sub!');
        makeAmakeAPICallsubPICall();
        //window.location.href = "home.html";
      });

      $('.table-display').each(function() {
        // Check if the current element has the specific class name
        if ($(this).hasClass('table-display')) {
            // Perform your desired function here
            console.log('Found the target div:', $(this).text());
            var user_assets = localStorage.getItem('user_assets');
            if(user_assets.length > 0) {
                console.log("user_assets:", user_assets);
                var jsonparsed = JSON.parse(user_assets);
                console.log("jsonparsed:", jsonparsed);
                $(this).empty();
                $.each(jsonparsed, function(i, d) {
                    console.log(d.asset_id);
                    console.log(d.asset_name);
                    $('.table-display').append('<div class="asset-item d-flex my-3"><p class="col-6">Asset ID: ' + d.asset_id + '</p><p class="col-6">Asset Name: ' + d.asset_name + '</p></div>');   
                });
            }

        }
    });
})();
