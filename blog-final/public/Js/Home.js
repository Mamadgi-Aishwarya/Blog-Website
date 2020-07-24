/*
document.getElementsByName("confirmation").addEventListener("click", function(e) {
      e.preventDefault();
  axios.post('/post/delete', {text: confirmation.value}).then(function (response) {
    var att = document.createAttribute("data-dismiss").value="modal";                
    document.getElementById("confirmation").setAttributeNode(att);  
   }).catch(function() {
    console.log("Please try again later.");
  })
})
*/

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function(position){
        const latitude=position.coords.latitude;
        const longitude=position.coords.longitude;
        const data={lat:latitude,lon:longitude};
        const options={method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)};
        fetch('/weather',options);
    })
        console.log("supported");
    } else {
        console.log("Geolocation is not supported by this browser.");
        document.write("<p>geolocation not supported</p>")
    }

 /*axios.post("/post/<%= post._id%>/delete", {text: confirmation.value}).then(function (response) {
      var att = document.createAttribute("data-dismiss").value="modal";                
      document.getElementById("confirmation").setAttributeNode(att);  
     }).catch(function() {
      console.log("Please try again later.");
    })
    */ 